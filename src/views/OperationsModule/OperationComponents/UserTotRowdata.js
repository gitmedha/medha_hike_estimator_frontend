import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { getStateDistricts } from "../../Address/addressActions";
import {
  getAllSrm,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import {
  handleKeyPress,
  handleKeyPresscharandspecialchar,
  mobileNochecker,
} from "../../../utils/function/OpsModulechecker";
import { getStudentsPickList } from "../../Students/StudentComponents/StudentActions";
import { getTotPickList } from "./operationsActions";


const projecttypeoptions = [
  { value: 'External', label: "External" },
  { value: 'Internal', label: "Internal" },
];
const certificateoptions = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];
const UserTotRowdata = (props) => {
  const [rows, setRows] = useState([
    {
      id: 1,
      user_name: "",
      trainer_1: "",
      project_name: "",
      certificate_given: "",
      module_name: "",
      project_type: "",
      new_entry: "",
      trainer_2: "",
      partner_dept: "",
      college: "",
      city: "",
      state: "",
      age: "",
      gender: "",
      contact: "",
      designation: "",
      start_date: "",
      end_date: "",
    },
    // Add more initial rows as needed
  ]);
  const [row, setRowData] = useState(props.row);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(new Date());
  const [areaOptions, setAreaOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [srmOption, setsrmOption] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [moduleName,setModuleName]=useState([])
  const [partnerDept,setPartnerDept]=useState([])
  const [projectName,setProjectName]=useState([])
  const userName=useRef(null)
  const designation=useRef(null)
  const college =useRef(null)
  const [state,setstate]=useState(true)
 
  const onStateChange = (value, rowid, field) => {
    getStateDistricts(value).then((data) => {
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
    props.handleChange(value, "state",row.id)
    setstate(false)

  };
  useEffect(() => {
    let srmData=async()=>{
      let data = await getAllSrm();
    setsrmOption(data);
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
    }
    srmData()
  }, []);
  useEffect(() => {
    getStudentsPickList().then((data) => {
      setGenderOptions(
        data.gender.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
        }))
      );
    });
   
  }, [props]);

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
    getTotPickList().then(data=>{
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
      setProjectName(
        data.project_name.map((item) => ({
          key: item,
          value: item,
          label: item,
        }))
      );
    })
  }, []);

  const updateRow = (id, field, value) => {
    row[field] = value;
    
  };
  const handleInputChange = (id,data,value) => {
    const input = value.current;
    if (input) {
      input.value = capitalizeFirstLetter(input.value);;
      props.updateRow(id,data,input.value)
    }
   
  };

  const capitalizeFirstLetter = (text) => {
    return text
      .split(' ')
      .map((word) => {
        if (word.length > 0) {
          return word[0].toUpperCase() + word.slice(1);
        } else {
          return word;
        }
      })
      .join(' ');
  };

  return (
    <>
      <tr key={row.id}>
        {/* <td>{row.id}</td> */}
        <td>
          <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.user_name
                ? `border-red`
                : "table-input h-2"
            }`}
            type="text"
            onKeyPress={handleKeyPresscharandspecialchar}
            ref={userName}
            onChange={(e) => handleInputChange(row.id, "user_name",userName)}
          />
        </td>
         <td>
          <input
            className="table-input h-2"
            type="number"
            onChange={(e) => props.updateRow(row.id, "age", e.target.value)}
          />
        </td>
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.gender
                ? `border-red`
                : "table-input h-2"
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="gender"
            options={genderOptions}
            onChange={(e) => props.handleChange(e, "gender", row.id)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onKeyPress={mobileNochecker}
            onChange={(e) => props.updateRow(row.id, "contact", e.target.value)}
          />
        </td>
        
        <td>
          <Select
            className={`table-input  ${
              props.classValue[`class${row.id - 1}`]?.state
                ? `border-red`
                : "table-input h-2"
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="state"
            options={props.statedata}
            onChange={(e) => onStateChange(e, row.id, "state")}
          />
        </td>
        <td>
          <Select
            className={`table-input  ${
              props.classValue[`class${row.id - 1}`]?.area
                ? `border-red`
                : "table-input h-2"
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="area"
            options={areaOptions}
            isDisabled={state}
            onChange={(e) => props.handleChange(e, "city", row.id)}
          />
        </td>
         <td>
          <input
            className="table-input h-2"
            type="text"
            onKeyPress={handleKeyPress}
            ref={designation}
            onChange={(e) => handleInputChange(row.id, "designation",designation)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onKeyPress={handleKeyPress}
            ref={college}
            onChange={(e) => handleInputChange(row.id, "college",college)}
          />
        </td>
        <td>
          
          <Select
            className="table-input h-2"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="project_name"
            options={projectName}
            onChange={(e) => props.handleChange(e, "project_name", row.id)}
          />
        </td>
        <td>
          {/* <input
            className="table-input h-2"
            type="text"
            onKeyPress={handleKeyPresscharandspecialchar}
            onChange={(e) =>
              props.updateRow(row.id, "partner_dept", e.target.value)
            }
          /> */}
          <Select
            className="table-input"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="partner_dept"
            options={partnerDept}
            onChange={(e) => props.handleChange(e, "partner_dept", row.id)}
          />
        </td>
        <td>
          {/* <input
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "module_name", e.target.value)
            }
          /> */}
          <Select
            className="table-input h-2"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="module_name"
            options={moduleName}
            onChange={(e) => props.handleChange(e, "module_name", row.id)}
          />
        </td>
        <td>
          <input
            type="date"
            className={`table-input h-2  ${
              props.classValue[`class${row.id - 1}`]?.start_date
                ? `border-red`
                : "table-input h-2"
            }`}
            defaultValue={startDate}
            onChange={(e) => {
             

              setStartDate(e.target.value);
              props.updateRow(row.id, "start_date", e.target.value);
            }}
          />
        </td>
        <td>
          <input
            type="date"
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.end_date
                ? `border-red`
                : "table-input h-2"
            }`}
            min={startDate}
            value={endDate}
            disabled={!startDate ? true : false}
            onChange={(event) => {
              const date = event.target.value;
              setEndDate(date);
              props.updateRow(row.id, "end_date", date);
            }}
          />
        </td>
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.trainer_1
                ? `border-red`
                : "table-input h-2"
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="tariner_1"
            options={srmOption}
            onChange={(e) => props.handleChange(e, "trainer_1", row.id)}
          />
        </td>
        <td>
          <Select
            className="basic-single table-input "
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="trainer_2"
            options={srmOption}
            onChange={(e) => props.handleChange(e, "trainer_2", row.id)}
          />
        </td>
        <td>
            <Select
            className={`table-input   ${
              props.classValue[`class${row.id - 1}`]?.certificate_given
                ? `border-red`
                : "table-input h-2"
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="certificate_given"
            options={certificateoptions}
            onChange={(e) => props.handleChange(e, "certificate_given", row.id)}
          />
        </td>
        <td>
        <Select
            className={`table-input   ${
              props.classValue[`class${row.id - 1}`]?.project_type
                ? `border-red`
                : "table-input h-2"
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="project_type"
            options={projecttypeoptions}
            onChange={(e) => props.handleChange(e, "project_type", row.id)}
          />
          
        </td>
        {/* <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "new_entry", e.target.value)
            }
          />
        </td> */}

        
      </tr>
    </>
  );
};

export default UserTotRowdata;
