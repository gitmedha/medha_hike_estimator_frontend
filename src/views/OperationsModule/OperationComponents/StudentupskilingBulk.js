import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { getStateDistricts } from "../../Address/addressActions";
import { getDefaultAssigneeOptions } from "../../../utils/function/lookupOptions";
import { getUpskillingPicklist } from "../../Students/StudentComponents/StudentActions";
import {searchPrograms, searchStudents} from "./operationsActions";
import { capitalizeFirstLetter } from "../../../utils/function/OpsModulechecker";

const options = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

const categoryOptions = [
  { value: "Career", label: "Career" },
  { value: "Creative", label: "Creative" },
];


const StudentupskilingBulk = (props) => {
  const [rows, setRows] = useState([
    {
      id: 1,
      assigned_to: "",
      student_id: "",
      institution: "",
      batch: "",
      start_date: "",
      end_date: "",
      course_name: "",
      certificate_received: "",
      category: "",
      sub_category: "",
      issued_org: "",
      program_name: "",
    },
    // Add more initial rows as needed
  ]);
  const [row, setRowData] = useState(props.row);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [areaOptions, setAreaOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [subcategory, setSubcategory] = useState([]);
  const [studentinput, setstudentinput] = useState("");
  const [programeName, setProgramName] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const coursename = useRef(null);
  const issuingorg = useRef(null);
  // const handleChange = (options, key) => {
  // };
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

  const filterProgram = async (filterValue) => {
    try {
      const {data} = await searchPrograms(filterValue);

      return data.programsConnection.values.map((program) => {
        return {
          ...program,
          label: program.name,
          value: program.name,
        }
      });

    } catch (error) {
      console.error(error);
    }
  };
  useEffect(async () => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
    getUpskillingPicklist().then((data) => {
      setSubcategory(
        data.subCategory.map((item) => ({
          key: item,
          value: item,
          label: item,
        }))
      );
    });
  }, []);

  const updateRow = (id, field, value) => {
    row[field] = value;
  };
  useEffect(async () => {
    filterStudent(studentinput).then((data) => {
      setStudentOptions(data);
    });
    filterProgram().then((data) => {
      setProgramOptions(data);
    });
  }, [studentinput]);

  const filterStudent = async (filterValue) => {
    try {
      const {data} = await searchStudents(filterValue);
      let programEnrollmentStudent = "112";
      let studentFoundInList = false;
      let filterData = data.studentsConnection.values.map((student) => {
        if (student.id === Number(props?.id)) {
          studentFoundInList = true;
        }
        return {
          ...student,
          label: `${student.full_name} (${student.student_id})`,
          value: Number(student.id),
        };
      });
      return filterData;

    } catch (error) {
      console.error(error);
    }
    
  };
  const handleInputChange = (id, data, value) => {
    const input = value.current;
    if (input) {
      input.value = capitalizeFirstLetter(input.value);
      props.updateRow(id, data, input.value);
    }
  };

  return (
    <>
      <tr key={row.id}>
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.assigned_to
                ? `border-red`
                : "table-input h-2"
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="assigned_to"
            options={assigneeOptions}
            onChange={(e) => props.handleChange(e, "assigned_to", row.id)}
          />
        </td>
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.student_id
                ? `border-red`
                : "table-input h-2"
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            filterData={filterStudent}
            options={studentOptions}
            onInputChange={(e) => {
              setstudentinput(e);
            }}
            onChange={(e) => {
              props.handleChange(e, "student_id", row.id);
            }}
          />
        </td>
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.institution
                ? `border-red`
                : "table-input h-2"
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="institution"
            options={props.institutiondata}
            onChange={(e) => props.handleChange(e, "institution", row.id)}
            onInputChange={(inputValue) => {
              props.filterInstitution(inputValue).then((data) => {
                props.setInstitutionOptions(data);
              });
            }}
          />
        </td>
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.batch
                ? `border-red`
                : "table-input h-2"
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="batch"
            options={props.batchbdata}
            onChange={(e) => {
              props.handleChange(e, "batch", row.id)}}
            onInputChange={(inputValue) => {
              props.filterBatch(inputValue).then((data) => {
                props.setBatchOptions(data);
              });
            }}
          />
        </td>
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.program_name
                ? `border-red`
                : "table-input h-2"
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="batch"
            options={programOptions}
            filterData={filterProgram}
            onChange={(e) => {
              props.handleChange(e, "program_name", row.id);
            }}
          />
        </td>

        {/* <td>{row.id}</td> */}
        <td>
          <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.course_name
                ? `border-red`
                : "table-input h-2"
            }`}
            type="text"
            ref={coursename}
            onChange={(e) =>
              handleInputChange(row.id, "course_name", coursename)
            }
          />
        </td>
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.category
                ? `border-red`
                : "table-input h-2"
            }`}
            classNamePrefix="select"
            isSearchable={true}
            name="category"
            options={categoryOptions}
            onChange={(e) => props.handleChange(e, "category", row.id)}
          />
        </td>
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.sub_category
                ? `border-red`
                : "table-input h-2"
            }`}
            classNamePrefix="select"
            isSearchable={true}
            name="sub_category"
            options={subcategory}
            onChange={(e) => props.handleChange(e, "sub_category", row.id)}
          />
        </td>

        <td>
          <input
            type="date"
            className={`table-input h-2 ${
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
            className="table-input basic-single"
            // classNamePrefix="select"
            isSearchable={true}
            name="area"
            options={options}
            onChange={(e) =>
              props.handleChange(e, "certificate_received", row.id)
            }
          />
        </td>

        <td>
          <input
            className="table-input h-2"
            type="text"
            ref={issuingorg}
            onChange={(e) =>
              handleInputChange(row.id, "issued_org", issuingorg)
            }
          />
        </td>
      </tr>
    </>
  );
};

export default StudentupskilingBulk;
