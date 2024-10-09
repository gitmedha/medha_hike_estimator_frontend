import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { getStateDistricts } from "../../Address/addressActions";
import { getAllSrm, getDefaultAssigneeOptions } from "../../../utils/function/lookupOptions";
import { capitalizeFirstLetter, handleKeyPress, mobileNochecker } from "../../../utils/function/OpsModulechecker";
import { getProgramEnrollmentsPickList } from "../../Institutions/InstitutionComponents/instituteActions";
import { getPitchingPickList ,searchPrograms} from "./operationsActions";

const options = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];


const CollegepitchesBulkrow = (props) => {
  const [rows, setRows] = useState([
    {
      id: 1,
      pitch_date: "",
      student_name: "",
      course_name: "",
      course_year: "",
      college_name: "",
      phone: "",
      whatsapp: "",
      email: "",
      remarks: "",
      srm_name: "",
      area: "",
      program_name:''
    },
    // Add more initial rows as needed
  ]);
  const [srmOption, setsrmOption] = useState([]);
  const [row, setRowData] = useState(props.row);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [areaOptions, setAreaOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [currentCourseYearOptions, setCurrentCourseYearOptions] = useState([]);
  const [colleges,setCollege]=useState([])
  const [programOptions, setProgramOptions] = useState(null);
  const [courseName,setCourseName]=useState([])
  const studentName=useRef(null)
  const remark=useRef(null)


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

  const handleInputChange = (id,data,value) => {
    const input = value.current;
    if (input) {
      input.value = capitalizeFirstLetter(input.value);;
      props.updateRow(id,data,input.value)
    }
   
  };

  useEffect(async () => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
    let data = await getAllSrm(1);
    setsrmOption(data);
    getProgramEnrollmentsPickList().then((data) => {
      setCurrentCourseYearOptions(
        data.current_course_year.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
        }))
      );
    });
    getPitchingPickList().then((data) => {
      setCollege(
        data.college_name.map((item) => ({
          key: item,
          value: item,
          label: item,
        }))
      );
      setCourseName(data.course_name.map((item) => ({
        key: item,
        value: item,
        label: item,
      })))
      setAreaOptions(
        data.medha_area.map((item) => ({
          key: item,
          value: item,
          label: item,
        }))
      );
    });
    filterProgram().then(data => {
      setProgramOptions(data);
    });
  }, []);

  const updateRow = (id, field, value) => {
    row[field] = value;

  };

  const filterProgram = async (filterValue) => {
    try {
      const {data} = await searchPrograms(filterValue);

      return data.programsConnection.values.map(program => {
        return {
          ...program,
          label: program.name,
          value: program.name,
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  
  return (
    <>
      <tr key={row.id} className="mt-4">
        {/* <td>{row.id}</td> */}
        
        <td>
          <input
            type="date"
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.pitch_date
                ? `border-red`
                : ""
            }`}
            defaultValue={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              props.updateRow(row.id, "pitch_date", e.target.value);
            }}
          />
        </td>
        <td>
          <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.student_name
                ? `border-red`
                : ""
            }`}
            type="text"
            onKeyPress={handleKeyPress}
            ref={studentName}
            onChange={(e) => handleInputChange(row.id, "student_name",studentName)}
            // onChange={(e) => props.updateRow(row.id, "student_name", e.target.value)}
          />
        </td>

        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.course_name
                ? `border-red`
                : ""
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            options={courseName}
            onChange={(e) => props.handleChange(e, "course_name", row.id)}
          />
        </td>
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.course_year
                ? `border-red`
                : "table-input h-2"
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            options={currentCourseYearOptions}
            onChange={(e) => props.handleChange(e, "course_year", row.id)}
          />
        </td>
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.college_name
                ? `border-red`
                : ""
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            options={props.institutiondata}
            onChange={(e) => props.handleChange(e, "college_name", row.id)}
            onInputChange={inputValue=> {
              props.filterInstitution(inputValue).then(data=>{
                props.setInstitutionOptions(data)
              })
            }}
          />
        </td>

        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.college_name
                ? `border-red`
                : ""
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            options={programOptions}
            filterdata={filterProgram}
            onChange={(e) => props.handleChange(e, "program_name", row.id)}
          />
        </td>

        <td>
          <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.phone
                ? `border-red`
                : ""
            }`}
            type="text"
            onKeyPress={mobileNochecker}
            onChange={(e) => props.updateRow(row.id, "phone", e.target.value)}
          />
        </td>
        <td>
          <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.whatsapp
                ? `border-red`
                : ""
            }`}
            type="text"
            onKeyPress={mobileNochecker}
            onChange={(e) => props.updateRow(row.id, "whatsapp", e.target.value)}
          />
        </td>

        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) => props.updateRow(row.id, "email", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            ref={remark}
            onChange={(e) => handleInputChange(row.id, "remarks",remark)}
            // onChange={(e) => props.updateRow(row.id, "remarks", e.target.value)}
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
            name="srm_name"
            options={srmOption}
            onChange={(e) =>  props.handleChange(e, "srm_name", row.id) }
          />
        </td>
        <td>
        <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.area
                ? `border-red`
                : "table-input h-2"
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="srm_name"
            options={areaOptions}
            onChange={(e) => props.handleChange(e, "area", row.id)}
          />
        </td>
        
      </tr>
    </>
  );
};

export default CollegepitchesBulkrow;
