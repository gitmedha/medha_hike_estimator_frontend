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
  // expectedColumns,
  // validationRules,
  uploadApi,
  // onValidData,
  // onInvalidData,
  refreshData,
  onClose,
  title,
  colMapping
}) => {
  const [fileName, setFileName] = useState("");
  const [parsedData, setParsedData] = useState([]);
  const [validRows, setValidRows] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);

  const fileInputRef = useRef(null);

  const reset = () => {
    setFileName("");
    setParsedData([]);
    setValidRows([]);
    setUploadError(null);
    setUploadSuccess(false);
    setShowForm(true);

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
      console.log(workbook,"workbook")
      const worksheet = workbook.Sheets[workbook.SheetNames[1]];
      console.log(worksheet,"worksheet")
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "", raw: false });
      console.log(jsonData,"jsonData")
//loop for mapping live excel data for historical data
let review_cycle = 'Apr 2018 - Sep 2018'

const results = [];

      for(let i=2;i<jsonData.length;i++){
        const row = jsonData[i];
    const cellValue = row["__EMPTY"];
    let newObj = {}



          if (cellValue && typeof cellValue === "string" && cellValue.startsWith("Apr")) {
                review_cycle = cellValue.trim();
                console.log("Review Cycle:", review_cycle);
                const parts = review_cycle.split("-");
                newObj.start_month = parts[0].trim().startsWith("Apr") ? `April ${parts[0].trim().split(' ')[1]}` : parts[0].trim();
                newObj.ending_month = parts[1].trim().startsWith("Sept") || parts[1].trim().startsWith("September") ? `Sep ${parts[1].trim().split(' ')[1]}` :`Mar ${parts[1].trim().split(' ')[1]}`;
               console.log(newObj,"newObj")
          }

      results.push({
      employee: row["__EMPTY"] || "",
      reviewer: row["__EMPTY_1"] || "",
      kra: row["__EMPTY_2"] ? parseFloat(row["__EMPTY_2"]) : null,
      competency: row["__EMPTY_3"] ? parseFloat(row["__EMPTY_3"]) : null,
      final_score: row["__EMPTY_4"] ? parseFloat(row["__EMPTY_4"]) : null,
      start_month: newObj.start_month || "",
      ending_month: newObj.ending_month || ""
    });


      }
      console.log(results,"results")
      console.log("count", results.length)

      // Directly set as valid rows (skip validation)
      // const normalized = jsonData.map((row) => {
      //   const normalizedRow = Object.keys(colMapping).reduce((acc, key) => {
      //     let value = row[key] || "";
      //     acc[colMapping[key]] = value;
      //     return acc;
      //   }, {});
      //   return normalizedRow;
      // });

      setParsedData(results);
      setValidRows(results);
    } catch (error) {
      setUploadError(error.message || "Error processing file");
    } finally {
      setShowSpinner(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadApi) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await api.post(uploadApi, { data: validRows });

      const isSuccess =
        response.data?.success === true ||
        response.data?.status === "success" ||
        response.status === 200;

      if (isSuccess) {
        toaster.success(response.data?.message || "Data uploaded successfully!", {
          position: "bottom-center"
        });
        setUploadSuccess(true);
        setUploadError(null);
        setShowForm(false);
        if (refreshData) {
          await refreshData();
        }
        handleClose();
      } else {
        const errorMsg =
          response.data?.error || response.data?.message || "Upload failed";
        setUploadError(errorMsg);
        toaster.error(errorMsg, { position: "bottom-center" });
      }
    } catch (err) {
      console.error(err);
      let errorMsg = "Failed to upload data";
      if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }
      setUploadError(errorMsg);
      toaster.error(errorMsg, { position: "bottom-center" });
    } finally {
      setIsUploading(false);
    }
  };

  const uploadNewData = () => {
    reset();
  };

  return (
    <Modal centered size="xl" show={true} onHide={handleClose} animation={false} className="form-modal">
      <Modal.Header className="bg-white">
        <Modal.Title>
          <h1 className="text--primary bebas-thick mb-0">{title}</h1>
        </Modal.Title>
      </Modal.Header>
      <Styled>
        {showForm ? (
          <Modal.Body className="bg-white">
            {uploadError && <p style={{color:'red'}}>{uploadError}</p>}

            {showSpinner ? (
              <div className="bg-white d-flex align-items-center justify-content-center" style={{ height: "40vh" }}>
                <Spinner animation="border" variant="success" />
              </div>
            ) : (
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
                <label className="text--primary latto-bold text-center">Upload File</label>
                {fileName && <div className={`mt-3 ${uploadError ? 'text-danger' : 'text-success'}`}>{fileName}</div>}
              </div>
            )}

            <div className="row mb-4 mt-4">
              <div className="col-md-12 d-flex justify-content-center">
                <Button variant="danger" onClick={handleClose} disabled={isUploading} className="px-4 mx-4">
                  Close
                </Button>

                {validRows.length > 0 && !isUploading && !uploadError && (
                  <Button variant="primary" onClick={handleUpload} className="px-4 mx-4">
                    Upload
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
                    <FaRegCheckCircle size={20} color="#31B89D" /> {validRows.length} row(s) of data uploaded successfully!
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
