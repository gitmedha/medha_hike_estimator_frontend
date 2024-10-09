import React from "react";
import { Modal} from "react-bootstrap";
import { useState, useEffect } from "react";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import {
  getAddressOptions,
  getStateDistricts,
} from "../../Address/addressActions";
import { connect } from "react-redux";
import { searchInstitutions,searchBatches} from "./operationsActions";
import UserTotRowdata from "./UserTotRowdata";
import { checkEmptyValuesandplaceNA } from "../../../utils/function/OpsModulechecker";

const UserTot = (props) => {
  let { onHide, show } = props;
  const { setAlert } = props;
  let iconStyles = { color: "#257b69", fontSize: "1.5em" };
  const [classValue,setclassValue]=useState({})
  const [data, setData] = useState([
    {
      id: 1,
      user_name: "",
      trainer_1: "",
      project_name: "",
      certificate_given: "",
      module_name: "",
      project_type: "",
      trainer_2: "",
      partner_dept: "",
      college: "",
      city: "",
      state: "",
      age: "",
      gender: "",
      contact: "",
      designation: "",
      start_date:"",
      end_date:""
    },
    // Add more initial rows as needed
  ]);
  const [rows, setRows] = useState([
    {
      id: 1,
      user_name: "",
      trainer_1: "",
      project_name: "",
      certificate_given: "",
      module_name: "",
      project_type: "",
      trainer_2: "",
      partner_dept: "",
      college: "",
      city: "",
      state: "",
      age: "",
      gender: "",
      contact: "",
      designation: "",
      start_date:"",
      end_date:""
    },
  ]);
  const [newRow, setNewRow] = useState({
    id: 1,
    user_name: "",
    trainer_1: "",
    project_name: "",
    certificate_given: "",
    module_name: "",
    project_type: "",
    trainer_2: "",
    partner_dept: "",
    college: "",
    city: "",
    state: "",
    age: "",
    gender: "",
    contact: "",
    designation: "",
    start_date:"",
    end_date:""
  });
  // 
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
  
    if (typeof value === 'string' && value.trim() === '') {
      return true;
    }
  
    if (Array.isArray(value) && value.length === 0) {
      return true;
    }
  
    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return true;
    }
  
    return false;
  }
  const addRow = () => {
    let value =checkEmptyValues(rows[rows.length-1])
    if(value.student_name || value.gender){
      let obj={...classValue,[`class${[rows.length-1]}`]:value}
      return setclassValue(obj)
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
    console.log(options);
    updateRow(rowid, key, options?.value);
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
        data?.data?.data?.geographiesConnection.groupBy.district
          .map((area) => ({
            key: area.key,
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

  useEffect(() => {
    
    let isEmptyValuFound=false
  // participant_name,age,gender,mobile,designation,college_name,project_name,partner_dept,module_name,trainer_2
 
    for (let row of rows) {
      for(let key in row){
         // end_date,certificate_received,issued_org,assigned_to && !(key=='designation') && !(key =='college') && !(key =='partner_dept') &&  !(key=='module_name') && !(key == 'trainer_2')
        if(!(key =='age') && !(key == 'gender') && !(key == 'contact') && !(key == 'id') && !(key=='designation') && !(key =='college') && !(key =='partner_dept') &&  !(key=='module_name') && !(key == 'trainer_2') ){
          if(isEmptyValue(row[key])){
            isEmptyValuFound=true
          }
         
        }
      }
     
    }
    setDisableSaveButton(isEmptyValuFound)
  }, [rows]);

  const onSubmit = async () => {
    let data = rows.map((row) => {
      delete row["id"];
      delete row["name"];
      row.trainer_1 = Number(row.trainer_1 );
      row.trainer_2 = Number(row.trainer_2);
      row.isActive = true;
      row.createdby = Number(userId);
      row.updatedby = Number(userId);
      let value = checkEmptyValuesandplaceNA(row)
      return value;
    });

    try {
      onHide('tot',data)
      setRows([
        {
          id: 1,
          user_name: "",
          trainer_1: "",
          project_name: "",
          certificate_given: "",
          module_name: "",
          project_type: "",
          trainer_2: "",
          partner_dept: "",
          college: "",
          city: "",
          state: "",
          age: "",
          gender: "",
          contact: "",
          designation: "",
          start_date:"",
          end_date:""
        },
      ]);
    } catch (error) {
      setAlert("Data is not created yet", "danger");
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

  const handleRowData = (rowData) => {
    // Do something with the row data
  };

  useEffect(() => {
    filterInstitution().then((data) => {
      setInstitutionOptions(data);
    });

    filterBatch().then((data) => {
      setBatchOptions(data);
    });
  }, []);

  const filterInstitution = async (filterValue) => {
    try {
      const {data} = await searchInstitutions(filterValue);

      let filterData = data.institutionsConnection.values.map((institution) => {
        return {
          ...institution,
          label: institution.name,
          value: Number(institution.id),
        };
      });

      return filterData;

    } catch (error) {
      console.error(error);
    }
  };

  const filterBatch = async (filterValue) => {
    try {
      const {data} = await searchBatches(filterValue);

      let filterData = data.batchesConnection.values.map((batch) => {
        return {
          ...batch,
          label: batch.name,
          value: Number(batch.id),
        };
      });

      return filterData;

    } catch (error) {
      console.error(error);
    }
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
             
              <h2 className="text--primary bebas-thick mb-0">
                {props.id ? props.full_name : "Add New TOT Data"}
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
                  <th>Participant Name *</th>
                  <th>Age </th>
                  <th>Gender </th>
                  <th>Mobile no.  </th>
                  <th>State *</th>
                  <th>City *</th>
                  <th>Designation </th>
                  <th>College Name</th>
                  <th>Project Name *</th>
                  <th>Partner Department</th>
                  <th>Module Name</th>
                  <th>Start Date *</th>
                  <th>End Date *</th>
                  <th>Trainer 1 *</th>
                  <th>Trainer 2 </th>
                  <th>Certificate Given *</th>
                  <th>Project Type *</th>
                  {/* <th>New Entry</th> */}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <UserTotRowdata
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
          <div className="d-flex justify-content-end between_class bulk_add_actions">
            <button
              type="button"
              onClick={onHide}
              className="btn btn-danger btn-regular mr-2 bulk_add_button"
            >
              CLOSE
            </button>
            <button
              className="btn btn-primary btn-regular mx-0 bulk_add_button"
              type="submit"
              onClick={onSubmit}
              disabled={disableSaveButton}
            >
              SAVE
            </button>
          </div>
        </div>
      </Modal.Body>

    </Modal>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(UserTot);
