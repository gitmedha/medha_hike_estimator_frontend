import React, { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import styled from "styled-components";
import { isAdmin, isSRM } from "../../../common/commonFunctions";
import { GET_ALL_BATCHES, GET_ALL_INSTITUTES } from "../../../graphql";
import { queryBuilder } from "../../../apis";
import { getAllSrmbyname } from "../../../utils/function/lookupOptions";
import {FaEdit, FaFileUpload } from "react-icons/fa";
// import CheckValuesOpsUploadedData from "./CheckValuesOpsUploadedData";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  getAddressOptions,
  getStateDistricts,
} from "../../Address/addressActions";
import { bulkCreateUsersTots, getTotPickList } from "../OperationComponents/operationsActions";
import CheckTot from "./CheckTot";
import { isNumber } from "lodash";
import { setAlert } from "src/store/reducers/Notifications/actions";

const expectedColumns = [
  "Participant Name",
  "Trainer 1",
  "Project Name",
  "Certificate Given",
  "Module Name",
  "Project Type",
  "Trainer 2",
  "Partner Department",
  "College Name",
  "City",
  "State",
  "Age",
  "Gender",
  "Mobile no.",
  "Designation",
  "Start Date",
  "End Date",
];

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

  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    --color: #257b69;
    --animation: 2s ease-in-out infinite;
  }

  .loader .circle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 20px;
    height: 20px;
    border: solid 2px var(--color);
    border-radius: 50%;
    margin: 0 10px;
    background-color: transparent;
    animation: circle-keys var(--animation);
  }

  .loader .circle .dot {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--color);
    animation: dot-keys var(--animation);
  }

  .loader .circle .outline {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    animation: outline-keys var(--animation);
  }

  .circle:nth-child(2) {
    animation-delay: 0.3s;
  }

  .circle:nth-child(3) {
    animation-delay: 0.6s;
  }

  .circle:nth-child(4) {
    animation-delay: 0.9s;
  }

  .circle:nth-child(5) {
    animation-delay: 1.2s;
  }

  .circle:nth-child(2) .dot {
    animation-delay: 0.3s;
  }

  .circle:nth-child(3) .dot {
    animation-delay: 0.6s;
  }

  .circle:nth-child(4) .dot {
    animation-delay: 0.9s;
  }

  .circle:nth-child(5) .dot {
    animation-delay: 1.2s;
  }

  .circle:nth-child(1) .outline {
    animation-delay: 0.9s;
  }

  .circle:nth-child(2) .outline {
    animation-delay: 1.2s;
  }

  .circle:nth-child(3) .outline {
    animation-delay: 1.5s;
  }

  .circle:nth-child(4) .outline {
    animation-delay: 1.8s;
  }

  .circle:nth-child(5) .outline {
    animation-delay: 2.1s;
  }

  @keyframes circle-keys {
    0% {
      transform: scale(1);
      opacity: 1;
    }

    50% {
      transform: scale(1.5);
      opacity: 0.5;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes dot-keys {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(0);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes outline-keys {
    0% {
      transform: scale(0);
      outline: solid 20px var(--color);
      outline-offset: 0;
      opacity: 1;
    }

    100% {
      transform: scale(1);
      outline: solid 0 transparent;
      outline-offset: 20px;
      opacity: 0;
    }
  }
`;

const options = [
  { value: "feild_activity", label: "Field Activity" },
  { value: "collegePitch", label: "Pitching" },
];

const TotUpload = (props) => {
  const { onHide } = props;
  const [file, setFile] = useState(null);
  const handler = (data) => setFile(data);
  const [assigneOption, setAssigneeOption] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [check, setCheck] = useState(false);
  const [areaOptions, setAreaOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [moduleName, setModuleName] = useState([]);
  const [partnerDept, setPartnerDept] = useState([]);
  const [projectName, setProjectName] = useState([]);
  const [notUploadedData, setNotuploadedData] = useState([]);
  const [uploadSuccesFully, setUploadSuccesFully] = useState("");
  const [notuploadSuccesFully, setNotUploadSuccesFully] = useState("");
  const [showModalTOT, setShowModalTOT] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [fileName, setFileName] = useState("");
  const [showSpinner, setShowSpinner] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [uploadNew, setUploadNew] = useState(false);

  useEffect(() => {
    const getdata = async () => {
      const data = await getAllSrmbyname();
      setAssigneeOption(data);
    };

    getdata();
  }, [props]);

  const handleFileChange = (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
  
    setShowForm(true);
    setFileName(''); // Reset the file name display
    setNextDisabled(false); // Optionally disable the next button
    setUploadSuccesFully(''); 
    setNotUploadSuccesFully('');
  
    if (file) {
      setFileName(`${file.name} Uploaded`);
  
      const reader = new FileReader();
  
      reader.onload = () => {
        const fileData = reader.result;
        try {
          convertExcel(fileData);
        } catch (error) {
          setNotUploadSuccesFully(error?.message);
        }
      };
  
      reader.readAsBinaryString(file);
      fileInput.value = '';
    } else {
      setUploadSuccesFully("The file type should be .xlsx");
    }
  };

  const convertExcel = (excelData) => {
    const workbook = XLSX.read(excelData, { type: "binary" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const results = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const headers = results[0];
    const data = results.slice(1).map((row) => {
      const newItem = {};
      headers.forEach((header, i) => {
        newItem[header.trim()] = row[i];
      });
      return newItem;
    });
    processFileData(data);
  };

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const excelSerialDateToJSDate = (serial) => {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(excelEpoch.getTime() + serial * 86400000);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const isValidDateFormat = (dateStr) => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Regex for yyyy-mm-dd format
    if (datePattern.test(dateStr)) {
      const [year, month, day] = dateStr.split("-");
      return `${year}-${month}-${day}`;
    }
    return null;
  };

  useEffect(() => {
    getTotPickList().then((data) => {
      // setModuleName(data.module_name.map(item))
      setModuleName(
        data.module_name.map((item) => ({
          key: item,
          value: item,
          label: item,
        }))
      );
      setPartnerDept(
        data.partner_dept.map((item) => ({
          key: item,
          value: item,
          label: item,
        }))
      );
      setProjectName(data.project_name.map((item) => item));
    });
    getAddressOptions().then((data) => {
      setStateOptions(
        data?.data?.data?.geographiesConnection.groupBy.state
          .map((state) => ({
            key: state?.id,
            label: state?.key,
            value: state?.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    });
    getStateDistricts().then((data) => {
      setAreaOptions([]);
      setAreaOptions(
        data?.data?.data?.geographiesConnection.groupBy.district
          .map((area) => ({
            key: area.id,
            label: area.key,
            value: area.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    });
  }, [props]);

  const capitalize = (s) => {
    return s[0].toUpperCase() + s.slice(1);
  };

  const validateColumns = (data, expectedColumns) => {
    const fileColumns = Object.keys(data[0]);
    if(data.length === 0){
      setNotUploadSuccesFully(
        "File is empty please select file which has data in it"
      );
      return false
    }
    if (!data ) {
      setNotUploadSuccesFully(
        "Some data fields are empty or not properly initialized"
      );
      return false;
    }
    const missingColumns = expectedColumns.filter(
      (col) => {;
        return !fileColumns.includes(col.trim())
      }
    );
    const extraColumns = fileColumns.filter(
      (col) => !expectedColumns.includes(col.trim())
    );
    if (data.length > 0 && data.length > 200) {
      setNotUploadSuccesFully(`Number of rows should be less than 200`);
    }

    if (missingColumns.length > 0) {
      console.error(`Missing columns: ${missingColumns.join(", ")}`);
      setNotUploadSuccesFully(`Missing columns: ${missingColumns.join(", ")}`);
      return false;
    }

    if (extraColumns.length > 0) {
      console.error(`Extra columns: ${extraColumns.join(", ")}`);
      setNotUploadSuccesFully(`Extra columns: ${extraColumns.join(", ")}`);
      return false;
    }
    return true;
  };

  const processFileData = (jsonData) => {
    const validRecords = [];
    const invalidRecords = [];
    jsonData.forEach((row) => {
      if (Object.values(row).some((value) => value === null || value === "")) {
        return;
      } else {
        validRecords.push(row);
      }
    });
    const filteredArray = validRecords.filter((obj) =>
      Object.values(obj).some((value) => value !== undefined)
    ); 
    if (
      validateColumns(filteredArray, expectedColumns) &&
      filteredArray.length <= 200 &&
      filteredArray.length > 0
    ) {
      setUploadSuccesFully(`File Uploaded`);
      setNextDisabled(true);
      processParsedData(filteredArray);
    }
  };

  const processParsedData = (data) => {
    const formattedData = [];
    const notFoundData = [];
    const userId = localStorage.getItem("user_id");

    data.forEach((item, index) => {
      const newItem = {};
      Object.keys(item).forEach((key) => {
        newItem[key] = item[key];
      });

      const currentUser = localStorage.getItem("user_id");
      const StateCheck = stateOptions.find(
        (state) => state === newItem["State"]
      )?.id;
      const areaCheck = areaOptions.find(
        (area) => area === newItem["City"]
      )?.id;
      const moduleCheck = moduleName.find(
        (module) => module.value === newItem["Module Name"]
      );

      const departMentCheck = partnerDept.find(
        (department) => department.value === newItem["Partner Department"]
      );

      const projectCheck = ["Internal", "External"].find(
        (project) => project === newItem["Project Type"]
      );
      const projectNameCheck = projectName.find(
        (project) => project === newItem["Project Name"]
      );

      const trainer_1 = assigneOption.find(
        (user) => user.label === newItem["Trainer 1"]
      )?.value;

      const trainer_2 = assigneOption.find(
        (user) => user.label === newItem["Trainer 2"]
      )?.value;

      const startDate = excelSerialDateToJSDate(newItem["Start Date"]);
      const endDate = excelSerialDateToJSDate(newItem["End Date"]);

      const isStartDateValid = isValidDateFormat(startDate);
      const isEndDateValid = isValidDateFormat(endDate);
      const createdby = Number(userId);
      const updatedby = Number(userId);
      const pattern = /^[0-9]{10}$/;
        console.log("isStartDateValid",isStartDateValid);
        console.log("isEndDateValid",isEndDateValid);
      if (
        !pattern.test(newItem["Mobile no."]) ||
        !departMentCheck ||
        !projectCheck ||
        !moduleCheck ||
        !isStartDateValid ||
        !isEndDateValid ||
        !projectNameCheck ||
        !isNumber(newItem["Age"])
      ) {
        notFoundData.push({
          index: index + 1,
          user_name: newItem["Participant Name"]
            ? capitalize(newItem["Participant Name"])
            : "",
          trainer_1: newItem["Trainer 1"],
          project_name: projectCheck
            ? newItem["Project Name"]
            : {
                value: newItem["Project Name"]
                  ? newItem["Project Name"]
                  : "Empty",
                notFound: true,
              },
          certificate_given: newItem["Certificate Given"],
          module_name: moduleCheck
            ? newItem["Module Name"]
            : {
                value: newItem["Module Name"]
                  ? newItem["Module Name"]
                  : "Empty",
                notFound: true,
              },
          project_type: projectCheck
            ? newItem["Project Type"]
            : {
                value: newItem["Project Type"]
                  ? newItem["Project Type"]
                  : "Empty",
                notFound: true,
              },
          trainer_2: newItem["Trainer 2"],
          partner_dept: departMentCheck
            ? newItem["Partner Department"]
            : {
                value: newItem["Partner Department"]
                  ? newItem["Partner Department"]
                  : "Empty",
                notFound: true,
              },
          college: newItem["College Name"]
            ? capitalize(newItem["College Name"])
            : "Empty",
          city: newItem["City"] ? capitalize(newItem["City"]) : "",
          state: newItem["State"] ? capitalize(newItem["State"]) : "",
          age: newItem["Age"],
          gender: newItem["Gender"] ? capitalize(newItem["Gender"]) : "",
          contact: newItem["Mobile no."],
          designation: newItem["Designation"],
          start_date: isStartDateValid
            ? startDate
            : { value: newItem["Start Date"], notFound: true },
          end_date: isEndDateValid
            ? endDate
            : { value: newItem["End Date"], notFound: true },
        });
      } else {
        formattedData.push({
          user_name: newItem["Participant Name"]
            ? capitalize(newItem["Participant Name"])
            : "",
          trainer_1: Number(trainer_1),
          project_name: newItem["Project Name"],
          certificate_given: newItem["Certificate Given"],
          module_name: newItem["Module Name"],
          project_type: newItem["Project Type"],
          trainer_2: Number(trainer_2),
          partner_dept: newItem["Partner Department"],
          college: newItem["College Name"]
            ? capitalize(newItem["College Name"])
            : "",
          city: newItem["City"] ? capitalize(newItem["City"]) : "",
          state: newItem["State"] ? capitalize(newItem["State"]) : "",
          age: newItem["Age"],
          gender: newItem["Gender"] ? capitalize(newItem["Gender"]) : "",
          contact: newItem["Mobile no."],
          designation: newItem["Designation"]
            ? capitalize(newItem["Designation"])
            : "",
          start_date: startDate,
          end_date: endDate,
          createdby: createdby,
          updatedby: currentUser,
        });
      }
    });

    setExcelData(formattedData);
    setNotuploadedData(notFoundData);
  };

  function hasNullValue(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].activity_type === "" || arr[i].activity_type === undefined) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    if (notUploadedData.length === 1) {
      setCheck(hasNullValue(notUploadedData));
    }
  }, [notUploadedData]);

  const hideShowModal = () => {
    setShowModalTOT(false);
    setUploadSuccesFully("");
    setShowForm(true);
    setFileName('');  // Reset the file name display
    setNextDisabled(false);  // Optionally disable the next button
    setUploadSuccesFully('');
  };

  const uploadDirect = () => {
    if (notUploadedData.length === 0 && excelData.length > 0) {
      // setNextDisabled(!nextDisabled);
      setShowForm(false);
      // props.uploadExcel(excelData, "my_data");
    } else {
      setShowModalTOT(true);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const uploadNewData =()=>{
    setShowForm(true);
    setUploadNew(!uploadNew)
  setFileName('');  // Reset the file name display
  setNextDisabled(false);  // Optionally disable the next button
  setUploadSuccesFully(''); 

  }

  const proceedData = async () => {
    if (notUploadedData.length === 0 && excelData.length > 0) {
      // setNextDisabled(!nextDisabled);
      setUploadNew(true);
      // props.uploadExcel(excelData, "my_data");
      bulkCreateUsersTots(excelData)
      // await api.post("/users-ops-activities/createBulkOperations", excelData);
      // setAlert("Data created successfully.", "success");
    }
  };

  return (
    <>
      <Modal
        centered
        size="lg"
        show={true}
        onHide={onHide}
        animation={false}
        aria-labelledby="contained-modal-title-vcenter"
        className="form-modal"
      >
        <Modal.Header className="bg-white">
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="d-flex align-items-center"
          >
            <h1 className="text--primary bebas-thick mb-0">Upload Data TOT</h1>
          </Modal.Title>
        </Modal.Header>
        <Styled>
        {showForm ? (
            <Modal.Body className="bg-white">
              {showSpinner ? (
                <div
                  className="bg-white d-flex align-items-center justify-content-center "
                  style={{ height: "40vh" }}
                >
                  <Spinner animation="border" variant="success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <>
                  <div className="uploader-container">
                    <div className="imageUploader">
                      <p className="upload-helper-text">
                        Click Here To Upload{" "}
                      </p>
                      <div className="upload-helper-icon">
                        <FaFileUpload size={30} color={"#257b69"} />
                      </div>
                      <input
                        accept=".xlsx"
                        type="file"
                        multiple={false}
                        name="file-uploader"
                        onChange={handleFileChange}
                        className="uploaderInput"
                      />
                    </div>
                    <label className="text--primary latto-bold text-center">
                      Upload File
                    </label>
                  </div>
                  <div className="d-flex  flex-column  ">
                    {notuploadSuccesFully ? (
                      <div
                        className={`text-danger  d-flex justify-content-center `}
                      >
                        {" "}
                        {notuploadSuccesFully}{" "}
                      </div>
                    ) : (
                      <div
                        className={`text-success d-flex justify-content-center `}
                      >
                        {" "}
                        {fileName}{" "}
                      </div>
                    )}
                    {(isSRM() || isAdmin()) && (
                      <div className="row mb-4 mt-2">
                        <div className="col-md-12 d-flex justify-content-center">
                          <button
                            type="button"
                            onClick={() => props.closeThepopus()}
                            className="btn btn-danger px-4 mx-4 mt-2"
                            style={{ height: "2.5rem" }}
                          >
                            Close
                          </button>

                          <button
                            type="button"
                            disabled={!nextDisabled}
                            onClick={() => uploadDirect()}
                            className="btn btn-primary px-4 mx-4 mt-2"
                            style={{ height: "2.5rem" }}
                          >
                            Next
                          </button>
                        </div>
                        <div className="d-flex justify-content-center ">
                          <p
                            className="text-gradient-warning"
                            style={{ color: "#B06B00" }}
                          >
                            Note : Maximum recomended number of records is 100
                            per excel
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </Modal.Body>
          ) : (
            <Modal.Body style={{height:'15rem'}}>
              <div className='mb-5'>
                <p className="text-success text-center" style={{fontSize:'1.3rem'}}>
                <FaEdit size={20} color="#31B89D"  />{" "}
                  {!uploadNew ? `${excelData.length} row(s) of data will be uploaded` :`${excelData.length} row(s) of data uploaded successfully` }
                  
                </p>
              </div>
              <div className="col-md-12 d-flex justify-content-center">
                <button
                  type="button"
                  onClick={() => props.closeThepopus()}
                  className="btn btn-danger px-4 mx-4 mt-2"
                  style={{ height: "2.5rem" }}
                >
                  Close
                </button>

                {!uploadNew ? (
                   <button
                   type="button"
                   // disabled={!nextDisabled}
                   onClick={() => proceedData()}
                   className="btn btn-primary px-4 mx-4 mt-2"
                   style={{ height: "2.5rem" }}
                 >
                   Proceed
                 </button>
                   
                 ) : (
                   <button
                     type="button"
                     // disabled={!nextDisabled}
                     onClick={() =>uploadNewData()}
                     className="btn btn-primary px-4 mx-4 mt-2"
                     style={{ height: "2.5rem" }}
                   >
                     Upload New
                   </button>
                )}
              </div>
            </Modal.Body>
          )}
        </Styled>
      </Modal>

      <CheckTot
        show={showModalTOT}
        onHide={() => hideShowModal()}
        notUploadedData={notUploadedData}
        excelData={excelData}
        uploadExcel={props.uploadExcel}
      />
    </>
  );
};

export default TotUpload;
