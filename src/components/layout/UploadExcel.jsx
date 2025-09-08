import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Modal, Button, Table } from "react-bootstrap";
import api from "../../apis";

const UploadExcel = ({
  expectedColumns,
  validationRules,
  uploadApi,
  onValidData,
  onInvalidData,
  refreshData,
  onClose
}) => {
  const [fileName, setFileName] = useState("");
  const [normalizedData, setNormalizedData] = useState([]);
  const [invalidRows, setInvalidRows] = useState([]);
  const [validRows, setValidRows] = useState([]);
  const [isValidated, setIsValidated] = useState(false);
  const [headerErrors, setHeaderErrors] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const fileInputRef = useRef(null);

  const colMapping = {
    "Employee ID": "employee_id",
    "First Name": "first_name",
    "Last Name": "last_name",
    "Email ID": "email_id",
    "Department": "department",
    "Title": "title",
    "Date of Joining": "date_of_joining",
    "Employee Status": "employee_status",
    "Employee Type": "employee_type",
    "Experience": "experience",
    "Current Band": "current_band",
    "Gross Monthly Salary/ Fee (Rs.)": "gross_monthly_salary_or_fee_rs",
  };

  const reset = () => {
    setFileName("");
    setNormalizedData([]);
    setInvalidRows([]);
    setValidRows([]);
    setIsValidated(false);
    setHeaderErrors([]);
    setShowPreview(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    reset();
    onClose && onClose();
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "", raw: false });

    if (!jsonData.length) {
      setHeaderErrors(["Excel file is empty!"]);
      return;
    }

    // Validate headers
    const fileHeaders = Object.keys(jsonData[0]);
    const missingColumns = expectedColumns.filter((col) => !fileHeaders.includes(col));
    if (missingColumns.length > 0) {
      setHeaderErrors(missingColumns.map(col => `${col} is missing`));
      return;
    }

    // Normalize data
    const normalized = jsonData.map((row, idx) => ({
      ...Object.keys(colMapping).reduce((acc, key) => {
        acc[colMapping[key]] = row[key] || "";
        return acc;
      }, {}),
      rowNumber: idx + 2
    }));

    // Validate rows
    const valid = [];
    const invalid = [];

    normalized.forEach((row) => {
      const errors = {};
      expectedColumns.forEach((col) => {
        const key = colMapping[col];
        const val = row[key];
        if (validationRules[col]) {
          const isValid = validationRules[col](val);
          if (!isValid) errors[col] = `${col} is invalid or missing`;
        }
      });

      if (Object.keys(errors).length) invalid.push({ ...row, errors });
      else valid.push(row);
    });

    setNormalizedData(normalized);
    setValidRows(valid);
    setInvalidRows(invalid);
    setIsValidated(true);
    setShowPreview(true);
    onValidData && onValidData(valid);
    onInvalidData && onInvalidData(invalid);
  };

  const handleUpload = async () => {
    if (!uploadApi) return;
    try {
      const response = await api.post(uploadApi, { data: validRows });
      if (response.status === 200) {
        refreshData && refreshData();
        handleClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {headerErrors.length > 0 && (
        <div className="alert alert-danger">
          <ul className="mb-0">
            {headerErrors.map((err, idx) => <li key={idx}>{err}</li>)}
          </ul>
        </div>
      )}

      {!showPreview ? (
        <div>
          <div className="mb-3">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFile}
              ref={fileInputRef}
              className="form-control"
            />
          </div>
          {fileName && <p>Selected File: {fileName}</p>}
        </div>
      ) : (
        <div>
          {invalidRows.length ? (
            <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
              <Table striped bordered hover responsive className="text-nowrap">
                <thead>
                  <tr>
                    <th>Row #</th>
                    {expectedColumns.map((col, idx) => (
                      <th key={idx}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invalidRows.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.rowNumber}</td>
                      {expectedColumns.map((col, cIdx) => (
                        <td
                          key={cIdx}
                          style={{
                            backgroundColor: row.errors[col] ? "#f8d7da" : "inherit",
                            color: row.errors[col] ? "#721c24" : "inherit",
                            fontWeight: row.errors[col] ? "bold" : "normal",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                          title={row.errors[col] || row[colMapping[col]]}
                        >
                          {row.errors[col] || row[colMapping[col]]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p>{validRows.length} rows are valid and ready to upload.</p>
          )}
        </div>
      )}

      <div className="modal-footer">
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        {showPreview && invalidRows.length === 0 && (
          <Button variant="primary" onClick={handleUpload}>
            Upload
          </Button>
        )}
        {showPreview && invalidRows.length > 0 && (
          <Button variant="secondary" onClick={reset}>
            Re-upload File
          </Button>
        )}
      </div>
    </div>
  );
};

export default UploadExcel;