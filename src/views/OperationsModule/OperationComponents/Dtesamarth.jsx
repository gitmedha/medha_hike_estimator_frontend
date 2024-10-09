import React from "react";
import { Modal, Button } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { FaSchool } from "react-icons/fa";
import { Input } from "../../../utils/Form";
import { urlPath } from "../../../constants";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import SweetAlert from "react-bootstrap-sweetalert";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import {
  getAddressOptions,
  getStateDistricts,
} from "../../Address/addressActions";
import { connect } from "react-redux";

import { MeiliSearch } from "meilisearch";

import { RowsData } from "./RowsData";
import {
  bulkCreateSamarth,
  createOperation,
  createSamarthSdit,
} from "./operationsActions";
import api from "../../../apis";
import StudentupskilingBulk from "./StudentupskilingBulk";
import DteUpskilingBulk from "./DteUpskilingBulk";
import { checkEmptyValuesandplaceNA } from "../../../utils/function/OpsModulechecker";

const meilisearchClient = new MeiliSearch({
  host: process.env.REACT_APP_MEILISEARCH_HOST_URL,
  apiKey: process.env.REACT_APP_MEILISEARCH_API_KEY,
});

const Dtesamarth = (props) => {
  let { onHide, show } = props;
  const { setAlert } = props;
  const [classValue, setclassValue] = useState({});
  let iconStyles = { color: "#257b69", fontSize: "1.5em" };
  const [data, setData] = useState([
    {
      id: 1,
      student_name: "",
      course_name: "",
      institution_name: "",
      district: "",
      state: "",
      dob: "",
      gender: "",
      father_guardian: "",
      mobile: "",
      email: "",
      annual_income: "",
      full_address: "",
      self_employed: "",
      higher_studies: "",
      placed: "",
      apprenticeship: "",
      doj: "",
      company_placed: "",
      father_guardian: "",
      monthly_salary: "",
      data_flag: "",
      position: "",
      trade: "",
      company_apprenticed: "",
      company_self: "",
      institute_admitted: "",
      acad_year: "",
      result: "",
    },
    // Add more initial rows as needed
  ]);
  const [rows, setRows] = useState([
    {
      id: 1,
      student_name: "",
      course_name: "",
      institution_name: "",
      district: "",
      state: "",
      dob: "",
      gender: "",
      father_guardian: "",
      mobile: "",
      email: "",
      annual_income: "",
      full_address: "",
      self_employed: "",
      higher_studies: "",
      placed: "",
      apprenticeship: "",
      doj: "",
      company_placed: "",
      father_guardian: "",
      monthly_salary: "",
      data_flag: "",
      position: "",
      trade: "",
      company_apprenticed: "",
      company_self: "",
      institute_admitted: "",
      acad_year: "",
      result: "",
    },
  ]);
  const [newRow, setNewRow] = useState({
    id: 1,
    student_name: "",
    course_name: "",
    institution_name: "",
    district: "",
    state: "",
    dob: "",
    gender: "",
    father_guardian: "",
    mobile: "",
    email: "",
    annual_income: "",
    full_address: "",
    self_employed: "",
    higher_studies: "",
    placed: "",
    apprenticeship: "",
    doj: "",
    company_placed: "",
    father_guardian: "",
    monthly_salary: "",
    data_flag: "",
    position: "",
    trade: "",
    company_apprenticed: "",
    company_self: "",
    institute_admitted: "",
    acad_year: "",
    result: "",
  });
  const [showLimit, setshowLimit] = useState(false);

  function checkEmptyValues(obj) {
    const result = {};

    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        const isEmpty = isEmptyValue(value);
        result[key] = isEmpty;
      }
    }

    return result;
  }

  function isEmptyValue(value) {
    if (value === null || value === undefined) {
      return true;
    }

    if (typeof value === "string" && value.trim() === "") {
      return true;
    }

    if (Array.isArray(value) && value.length === 0) {
      return true;
    }

    if (typeof value === "object" && Object.keys(value).length === 0) {
      return true;
    }

    return false;
  }
  const addRow = () => {
    let value = checkEmptyValues(rows[rows.length - 1]);

    setclassValue({});
    if (value.student_name || value.gender) {
      let obj = { [`class${[rows.length - 1]}`]: value };
      setclassValue(obj);
      return;
    }

    if (rows.length >= 10) {
      setAlert("You can't Add more than 10 items.", "error");
    } else {
      const newRowWithId = { ...newRow, id: rows.length + 1 };
      setRows([...rows, newRowWithId]);
      // setNewRow({ id: '', name: '', age: '' });
     
    }
  };

  const handleChange = (options, key, rowid) => {
    if (key == "state") {
      getStateDistricts().then((data) => {
        setAreaOptions([]);
        setAreaOptions(
          data?.data?.data?.geographiesConnection.groupBy.area
            .map((area) => ({
              key: area.id,
              label: area.key,
              value: area.key,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
        );
      });
    }
    updateRow(rowid, key, options.value);
  };
  const updateRow = (id, field, value) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setRows(updatedRows);
  };

  const deleteRow = (id) => {
    if (rows.length == 1) {
      return rows;
    }
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };

  const userId = localStorage.getItem("user_id");

  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [typeOptions, setTypeOptions] = useState([]);
  const [show1, setShow1] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleClose = () => setShow1(false);
  const handleShow = () => setShow1(true);

  useEffect(() => {
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
  }, []);

  const onStateChange = (value) => {
    setDistrictOptions([]);
    getStateDistricts(value).then((data) => {
      setDistrictOptions(
        data?.data?.data?.geographiesConnection.groupBy.district
          .map((district) => ({
            key: district.id,
            label: district.key,
            value: district.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
      setAreaOptions([]);
      setAreaOptions(
        data?.data?.data?.geographiesConnection.groupBy.area
          .map((area) => ({
            key: area.id,
            label: area.key,
            value: area.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    });
  };

  const handleInputChange = (e, index, field) => {
    const { value } = e;
    setData((prevRows) =>
      prevRows.map((row, rowIndex) => {
        if (rowIndex === index) {
          return { ...row, [field]: value };
        }
        return row;
      })
    );
  };

  const onSubmit = async () => {
    let data = rows.map((row) => {
      delete row["id"];
      delete row["name"];
      row.isActive = true;
      row.created_by = Number(userId);
      row.updated_by = Number(userId);
      let value = checkEmptyValuesandplaceNA(row)
      return value;
    });

    try {
      const value = await bulkCreateSamarth(data);
      props.ModalShow();
    } catch (error) {
    }
  };

  useEffect(() => {
    getAddressOptions().then((data) => {
      setStateOptions(
        data?.data?.data?.geographiesConnection.groupBy.state
          .map((state) => ({
            key: state.id,
            label: state.key,
            value: state.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    });
  }, []);


  useEffect(() => {
    filterInstitution().then((data) => {
      setInstitutionOptions(data);
    });

    filterBatch().then((data) => {
      setBatchOptions(data);
    });
  }, []);

  const filterInstitution = async (filterValue) => {
    return await meilisearchClient
      .index("institutions")
      .search(filterValue, {
        limit: 100,
        attributesToRetrieve: ["id", "name"],
      })
      .then((data) => {
        let filterData = data.hits.map((institution) => {
          return {
            ...institution,
            label: institution.name,
            value: institution.name,
          };
        });

        return filterData;
      });
  };

  const filterBatch = async (filterValue) => {
    return await meilisearchClient
      .index("batches")
      .search(filterValue, {
        limit: 100,
        attributesToRetrieve: ["id", "name"],
      })
      .then((data) => {
        // let programEnrollmentBatch = props.programEnrollment ? props.programEnrollment.batch : null;

        let filterData = data.hits.map((batch) => {
          return {
            ...batch,
            label: batch.name,
            value: batch.name,
          };
        });

        return filterData;
      });
  };

  const onConfirm = () => {
    setshowLimit(true);
  };
  const onCancel = () => {
    setshowLimit(false);
  };

  return (
    <Modal
      centered
      size="xl"
      responsive
      show={show}
      onHide={onHide}
      animation={false}
      aria-labelledby="contained-modal-title-vcenter"
      className="form-modal"
      id="custom-modal"
      dialogClassName="fullscreen-modal"
    >
      <Modal.Header className="bg-white">
        <Modal.Title
          id="contained-modal-title-vcenter "
          className="d-flex align-items-center justify-content-between"
        >
          <div className="d-flex justify-content-between">
            {/* <h2 className="section-header">Basic Info</h2> */}
            <div className="d-flex ">
              {props.id && props.logo ? (
                <img
                  src={urlPath(props.logo.url)}
                  className="avatar mr-2"
                  alt="Student Profile"
                />
              ) : (
                <div className="flex-row-centered avatar avatar-default mr-2">
                  <FaSchool color={"#fff"} size={25} />
                </div>
              )}
              <h2 className="text--primary bebas-thick mb-0">
                {props.id ? props.full_name : "Add Dte-Samarth Data"}
              </h2>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <div id="CreateOptsData">
          <div className="adddeletebtn">
            {rows.length > 1 ? (
              <button className="unset" onClick={() => deleteRow(rows.length)}>
                <FaMinusCircle
                  style={iconStyles}
                  width="15"
                  size={40}
                  color="#000"
                  className="ml-2 mr-3"
                />
              </button>
            ) : (
              ""
            )}
            {rows.length == 10 ? (
              ""
            ) : (
              <button className="unset" onClick={addRow}>
                <FaPlusCircle
                  style={iconStyles}
                  width="15"
                  size={40}
                  color="#000"
                  className="ml-2"
                />
              </button>
            )}
           
          </div>
          <div className="table-container">
            <table className="create_data_table">
              <thead>
                <tr>
                  {/* <th className="id">ID</th> */}
                  <th>Student Name *</th>
                  <th>Course Name </th>
                  <th>Institution</th>
                  <th>Batch</th>
                  <th>State</th>
                  <th>District</th>
                  <th>DOB</th>
                  <th>Gender *</th>
                  <th>Father/Guardian</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Institute Admitted</th>
                  <th>Academic Year *</th>
                  <th>Placed</th>
                  <th>Apprenticeship</th>
                  <th>Company Placed</th>
                  <th>Position</th>
                  <th>DOJ</th>
                  <th>Monthly Salary</th>
                  <th>Annual Income</th>
                  <th>Full Address</th>
                  <th>Self Employed</th>
                  <th>Higher Studies</th>
                  <th>Select college *</th>
                  <th>Trade</th>
                  <th>Company Apprenticed</th>
                  <th>Company Self</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <DteUpskilingBulk
                    handleInputChange={handleInputChange}
                    handleChange={handleChange}
                    row={row}
                    endDate={endDate}
                    startDate={startDate}
                    setStartdate={setStartDate}
                    institutiondata={institutionOptions}
                    batchbdata={batchOptions}
                    updateRow={updateRow}
                    statedata={stateOptions}
                    areaOptions={areaOptions}
                    classValue={classValue}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end between_class">
            <button
              type="button"
              onClick={onHide}
              className="btn btn-danger btn-regular mr-2"
            >
              CLOSE
            </button>
            <button
              className="btn btn-primary btn-regular mx-0"
              type="submit"
              onClick={onSubmit}
              disabled={disableSaveButton}
            >
              SAVE
            </button>
          </div>
        </div>
      </Modal.Body>

      {/* {showLimit ? <SweetAlert title="You can't dd more than 10 items!" onConfirm={onConfirm} onCancel={()=>onCancel()} /> :""} */}
    </Modal>
  );
};

// export default OperationCreateform;

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Dtesamarth);
