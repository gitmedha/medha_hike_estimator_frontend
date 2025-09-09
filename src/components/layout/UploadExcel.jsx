import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Modal, Button, Table, Spinner } from "react-bootstrap";
import api from "../../apis";
import toaster from 'react-hot-toast';
import { FaFileUpload, FaEdit, FaRegCheckCircle } from "react-icons/fa";
import styled from "styled-components";

const Styled = styled.div`
  .icon-box {
    display: flex;
    padding: 5px;
    justify-content: center;
  }
  .cv-icon {
    margin-right: 20px;
    padding: 8px;
    border: 1px solid transparent;
    border-radius: 50%;
    &:hover {
      background-color: #eee;
      box-shadow: 0 0 0 1px #c4c4c4;
    }
  }
  .section-header {
    color: #207b69;
    font-family: "Latto-Regular";
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 15px;
  }
  .uploader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .imageUploader {
    position: relative;
    width: 150px;
    height: 150px;
    border: 2px dashed #257b69;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-bottom: 15px;
    
    .upload-helper-text {
      color: #257b69;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .uploaderInput {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }
`;

const UploadExcel = ({
  expectedColumns,
  validationRules,
  uploadApi,
  onValidData,
  onInvalidData,
  refreshData,
  onClose,
  title = "Upload Data"
}) => {
  const [fileName, setFileName] = useState("");
  const [parsedData, setParsedData] = useState([]);
  const [normalizedData, setNormalizedData] = useState([]);
  const [invalidRows, setInvalidRows] = useState([]);
  const [validRows, setValidRows] = useState([]);
  const [isValidated, setIsValidated] = useState(false);
  const [headerErrors, setHeaderErrors] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const [readyToUpload, setReadyToUpload] = useState(false);

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
    setParsedData([]);
    setNormalizedData([]);
    setInvalidRows([]);
    setValidRows([]);
    setIsValidated(false);
    setHeaderErrors([]);
    setShowPreview(false);
    setIsUploading(false);
    setUploadError(null);
    setUploadSuccess(false);
    setShowForm(true);
    setReadyToUpload(false);

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

    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setUploadError("The file type should be .xlsx or .xls");
      return;
    }

    setFileName(file.name);
    setUploadError(null);
    setShowSpinner(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "", raw: false });

      if (!jsonData.length) {
        setHeaderErrors(["Excel file is empty!"]);
        setShowSpinner(false);
        return;
      }

      const fileHeaders = Object.keys(jsonData[0]);
      const missingColumns = expectedColumns.filter((col) => !fileHeaders.includes(col));
      if (missingColumns.length > 0) {
        setHeaderErrors(missingColumns);
        setShowSpinner(false);
        return;
      }

      const normalized = jsonData.map((row) => {
        const normalizedRow = Object.keys(colMapping).reduce((acc, key) => {
          let value = row[key] || "";

          if (key === "Date of Joining" && value) {
            const dateStr = value.toString();
            if (dateStr.includes('/')) {
              const [month, day, year] = dateStr.split('/');
              const fullYear = year.length === 2 ? `20${year}` : year;
              const dateObj = new Date(`${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
              if (!isNaN(dateObj.getTime())) {
                value = dateObj.toISOString().split('T')[0];
              }
            } else if (!isNaN(Date.parse(dateStr))) {
              const dateObj = new Date(dateStr);
              value = dateObj.toISOString().split('T')[0];
            }
          }

          acc[colMapping[key]] = value;
          return acc;
        }, {});
        return normalizedRow;
      });

      setParsedData(normalized);
      setHeaderErrors([]);
    } catch (error) {
      setUploadError(error.message || "Error processing file");
    } finally {
      setShowSpinner(false);
    }
  };

  const runValidations = () => {
    const valid = [];
    const invalid = [];

    parsedData.forEach((row, idx) => {
      const errors = {};
      expectedColumns.forEach((col) => {
        const key = colMapping[col];
        const val = row[key];

        if (validationRules[col]) {
          const validationResult = validationRules[col](val);
          if (validationResult !== true) {
            errors[col] = validationResult || `${col} is invalid`;
          }
        }
      });

      if (Object.keys(errors).length)
        invalid.push({ ...row, errors, rowNumber: idx + 2 });
      else valid.push(row);
    });

    setNormalizedData(parsedData);
    setValidRows(valid);
    setInvalidRows(invalid);
    setIsValidated(true);
    setShowPreview(true);

    onValidData && onValidData(valid);
    onInvalidData && onInvalidData(invalid);
  };

  const handleUpload = async () => {
    if (!uploadApi) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await api.post(uploadApi, { data: validRows });

      if (response.data.success) {
        toaster.success(response.data.message || "Data uploaded successfully!", {
          position: "bottom-center"
        });
        setUploadSuccess(true);
        setShowForm(false);
        refreshData && refreshData();
      } else {
        const errorMsg = response.data.error || "Upload failed";
        setUploadError(errorMsg);
        toaster.error(errorMsg, {
          position: "bottom-center"
        });
      }
    } catch (err) {
      console.error(err);
      let errorMsg = "Failed to upload data";
      if (err.response && err.response.data && err.response.data.error) {
        errorMsg = err.response.data.error;
      } else if (err.message) {
        errorMsg = err.message;
      }
      setUploadError(errorMsg);
      toaster.error(errorMsg, {
        position: "bottom-center"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const uploadNewData = () => {
    reset();
  };

  console.log("fileName",fileName, fileName.length);
  console.log(headerErrors,"headerErrors")
  return (
    <Modal centered size="lg" show={true} onHide={handleClose} animation={false} className="form-modal">
      <Modal.Header className="bg-white">
        <Modal.Title>
          <h1 className="text--primary bebas-thick mb-0">{title}</h1>
        </Modal.Title>
      </Modal.Header>
      <Styled>
        {showForm ? (
          <Modal.Body className="bg-white">
            

            {uploadError && (
              <p style={{color:'red'}}>{uploadError}</p>
            )}

            {showSpinner ? (
              <div className="bg-white d-flex align-items-center justify-content-center" style={{ height: "40vh" }}>
                <Spinner animation="border" variant="success" />
              </div>
            ) : !showPreview ? (
              <div className="uploader-container">
                <div className="imageUploader">
                  <p className="upload-helper-text">Click Here To Upload</p>
                  <div className="upload-helper-icon">
                    <FaFileUpload size={30} color={"#257b69"} />
                  </div>
                  <input
                    accept=".xlsx,.xls"
                    type="file"
                    onChange={handleFile}
                    ref={fileInputRef}
                    className="uploaderInput"
                  />
                </div>
                <label className="text--primary latto-bold text-center">
                  Upload File
                </label>
                {fileName && (
                  <div className={`mt-3 ${uploadError ? 'text-danger' : 'text-success'}`}>
                    {fileName}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {isUploading ? (
                  <div className="text-center p-4">
                    <Spinner animation="border" variant="success" />
                    <p className="mt-2">Uploading data...</p>
                  </div>
                ) : invalidRows.length ? (
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
                ) :!uploadError && (
                     <p className="text-success text-center">
    {validRows.length} rows are valid and ready to upload.
  </p>
                )}
              </div>
            )}

{headerErrors.length > 0 && (
              <p className="mb-0" style={{color:'red'}}>
                  Missing headers: {headerErrors.join(", ")}
                </p>
            )}
            {/* --- Footer Buttons --- */}

      <div className="row mb-4 mt-4">
  <div className="col-md-12 d-flex justify-content-center">
    <Button
      variant="danger"
      onClick={handleClose}
      disabled={isUploading}
      className="px-4 mx-4"
    >
      Close
    </Button>

    {/* Step 1: Show Next only when ready for validation */}
    {!showPreview && invalidRows.length === 0 && (
      <Button
        variant="primary"
        onClick={runValidations}
        disabled={headerErrors.length > 0 || fileName.length === 0}
        className="px-4 mx-4"
      >
        Next
      </Button>
    )}

    {/* Step 2: Show Upload if everything is valid */}
    {showPreview && invalidRows.length === 0 && !isUploading && !uploadError && (
      <Button
        variant="primary"
        onClick={handleUpload}
        className="px-4 mx-4"
      >
        Upload
      </Button>
    )}

    {/* Step 2: Show Re-upload if invalid rows OR backend error */}
    {showPreview && (invalidRows.length > 0 || uploadError) && !isUploading && (
      <Button
        variant="secondary"
        onClick={reset}
        className="px-4 mx-4"
      >
        Re-upload File
      </Button>
    )}

    {isUploading && (
      <Button variant="primary" disabled className="px-4 mx-4">
        <Spinner animation="border" size="sm" className="me-2" />
        Uploading...
      </Button>
    )}
  </div>
</div>



          </Modal.Body>
        ) : (
          <Modal.Body style={{ height: "15rem" }}>
            <div className="mb-5">
              <p className="text-success text-center" style={{ fontSize: "1.3rem" }}>
                {uploadSuccess ? (
                  <>
                    <FaRegCheckCircle size={20} color="#31B89D" />{" "}
                    {validRows.length} row(s) of data uploaded successfully!
                  </>
                ) : (
                  <>
                    <FaEdit size={20} color="#31B89D" /> {validRows.length} row(s) of data will be uploaded.
                  </>
                )}
              </p>
            </div>
            <div className="col-md-12 d-flex justify-content-center">
              <Button variant="danger" onClick={handleClose} className="px-4 mx-4">
                Close
              </Button>
              {uploadSuccess ? (
                <Button variant="primary" onClick={uploadNewData} className="px-4 mx-4">
                  Upload New
                </Button>
              ) : (
                <Button variant="primary" onClick={handleUpload} className="px-4 mx-4">
                  Proceed
                </Button>
              )}
            </div>
          </Modal.Body>
        )}
      </Styled>
    </Modal>
  );
};

export default UploadExcel;
