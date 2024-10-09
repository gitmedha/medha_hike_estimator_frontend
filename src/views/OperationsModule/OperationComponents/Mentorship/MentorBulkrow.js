import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { getAddressOptions, getStateDistricts } from "../../../Address/addressActions";
import {
  filterAssignedTo,
  getDefaultAssigneeOptions,
} from "../../../../utils/function/lookupOptions";
import {
  capitalizeFirstLetter,
  handleKeyPress,
  handleKeyPresscharandspecialchar,
  isEmptyValue,
  mobileNochecker,
} from "../../../../utils/function/OpsModulechecker";
import {
  getAlumniPickList,
  getStudent,
  searchPrograms,
  searchStudents,
} from "../operationsActions";

const options = [
  { value: "Offline", label: "Offline" },
  { value: "Online", label: "Online" },
];
const statusOption = [
  { value: "Connected", label: "Connected" },
  { value: "Pipeline", label: "Pipeline" },
  { value: "Dropped out", label: "Dropped out" },
];

const MentorBulkrow = (props) => {
  const [name, setName] = useState("");
  const [rows, setRows] = useState([
    {
      id: 1,
      assigned_to: "",
      mentor_name: "",
      email: "",
      mentor_domain: "",
      mentor_company_name: "",
      designation: "",
      mentor_area: "",
      mentor_state: "",
      outreach: "",
      onboarding_date: "",
      social_media_profile_link: "",
      medha_area: "",
      status: "",
      program_name: "",
      contact:"",
      medha_area:""
    },
    // Add more initial rows as needed
  ]);
  const [row, setRowData] = useState(props.row);
  const [startDate, setStartDate] = useState("");
  const [areaOptions, setAreaOptions] = useState([]);
  const [mentorAreaOptions, setMentorAreaOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [areaCheck, setAreaCheck] = useState(true);
  const [stateOptions, setStateOptions] = useState([]);
  const [fieldvalue, setfieldvalue] = useState({
    student_name: "",
    student_id: "",
    father_name: "",
    email: "",
    phone: "",
    location: "",
  });
  const [programOptions, setProgramOptions] = useState([]);

  const handleInputChange = (id, data, value) => {
    const input = value.current;
    if (input) {
      input.value = capitalizeFirstLetter(input.value);
      props.updateRow(id, data, input.value);
    }
  };

  useEffect(() => {
    
  }, [name]);

  const onStateChange = (value, rowid, field) => {
    getStateDistricts(value).then((data) => {
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
    props.updateRow(rowid, field, value.value);
  };

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
    getAddressOptions().then((data) => {
      setStateOptions(
        data?.data?.data?.geographiesConnection.groupBy.state
          .map((state) => ({
            label: state?.key,
            value: state?.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    });
    getStateDistricts().then((data) => {
      setMentorAreaOptions([]);
      setMentorAreaOptions(
        data?.data?.data?.geographiesConnection.groupBy.area
          .map((area) => ({
            key: area.id,
            label: area.key,
            value: area.key,
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
   
  }, []);

  const changeInput = async (event, field, id) => {
    if (field == "student_name") {
      await props.updateRow(id, "student_name", event.full_name);
    } else {
      await props.handleChange(event, field, id);
    }
  };
  

  

  useEffect(async () => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
    filterProgram().then((data) => {
      setProgramOptions(data);
    });
  }, []);

  const filterProgram = async (filterValue) => {
    try {
      const { data } = await searchPrograms(filterValue);

      return data.programsConnection.values.map((program) => {
        return {
          ...program,
          label: program.name,
          value: program.name,
        };
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <tr key={row.id}>
        <td>
          <input
            // className="table-input h-2 mentor_name"
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.mentor_name
                ? `border-red`
                : ""
            }`}
            type="text"
            // disabled={Father ? true : false}
            // value={Father}
            onKeyPress={handleKeyPress}
            onChange={(e) =>
              props.updateRow(row.id, "mentor_name", e.target.value)
            }
          />
        </td>
        <td>
          <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.contact
                ? `border-red`
                : ""
            }`}
            minLength={10}
            maxLength={10}
            type="text"
            onKeyPress={mobileNochecker}
            defaultValue={email}
            onChange={(e) =>{
              if(/^[0-9]*$/.test(e.target?.value)) {
                props.updateRow(row.id, "contact", e.target.value)
              // handleChangeInput('mobileno', e.target.value);
            }}}
            // onChange={(e) => props.updateRow(row.id, "contact", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            disabled={email ? true : false}
            defaultValue={email}
            onChange={(e) => props.updateRow(row.id, "email", e.target.value)}
          />
        </td>
        <td>
          <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.mentor_domain
                ? `border-red`
                : ""
            }`}
            type="text"
            // disabled={email ? true :false}
            defaultValue={email}
            onChange={(e) =>
              props.updateRow(row.id, "mentor_domain", e.target.value)
            }
          />
        </td>

        <td>
          <input
             className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.mentor_company_name
                ? `border-red`
                : ""
            }`}
            type="text"
            // disabled={email ? true :false}
            defaultValue={email}
            onChange={(e) =>
              props.updateRow(row.id, "mentor_company_name", e.target.value)
            }
          />
        </td>
        <td>
          <input
             className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.designation
                ? `border-red`
                : ""
            }`}
            type="text"
            // ref={conclusion}
            onChange={(e) =>
              props.updateRow(row.id, "designation", e.target.value)
            }
          />
        </td>
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.mentor_state
                ? `border-red`
                : ""
            }`}
            classNamePrefix="select"
            isSearchable={true}
            name="state"
            options={stateOptions}
            onChange={(e) => {
              setAreaCheck(false)
              onStateChange(e, row.id, "mentor_state")}}
          />
        </td>
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.mentor_area
                ? `border-red`
                : ""
            }`}
            classNamePrefix="select"
            isSearchable={true}
            options={areaOptions}
            isDisabled={areaCheck}
            onChange={(e) => props.handleChange(e, "mentor_area", row.id)}
          />
        </td>

       
        
         <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.outreach
                ? `border-red`
                : ""
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="batch"
            options={options}
            // filterData={filterProgram}
            onChange={(e) => props.handleChange(e, "outreach", row.id)}
          />
        </td>
        <td>
          <input
            type="date"
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.onboarding_date
                ? `border-red`
                : ""
            }`}
            defaultValue={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              props.updateRow(row.id, "onboarding_date", e.target.value);
            }}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            disabled={email ? true : false}
            defaultValue={email}
            onChange={(e) => props.updateRow(row.id, "social_media_profile_link", e.target.value)}
          />
        </td>
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.assigned_to
                ? `border-red`
                : ""
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="assigned_to"
            options={assigneeOptions}
            defaultValue={() =>
              setAssigneeOptions(filterAssignedTo("rohit sharma"))
            }
            onChange={(e) => props.handleChange(e, "assigned_to", row.id)}
          />
        </td>
       
       
        
        
        
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.medha_area
                ? `border-red`
                : ""
            }`}
            classNamePrefix="select"
            isSearchable={true}
            options={mentorAreaOptions}
            // isDisabled={!isEmptyValue(area)? true :false}
            onChange={(e) => props.handleChange(e, "medha_area", row.id)}
          />
        </td>
         <td>
          <Select
            // className="basic-single table-input"
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.program_name
                ? `border-red`
                : ""
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="batch"
            options={programOptions}
            filterData={filterProgram}
            onChange={(e) => props.handleChange(e, "program_name", row.id)}
          />
        </td>
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.status
                ? `border-red`
                : ""
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="batch"
            options={statusOption}
            // filterData={filterProgram}
            onChange={(e) => props.handleChange(e, "status", row.id)}
          />
        </td>
      </tr>
    </>
  );
};

export default MentorBulkrow;
