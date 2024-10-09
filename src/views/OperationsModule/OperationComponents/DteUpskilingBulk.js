import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getStateDistricts } from "../../Address/addressActions";
import { getDefaultAssigneeOptions } from "../../../utils/function/lookupOptions";
import { getStudentsPickList } from "../../Students/StudentComponents/StudentActions";

const options = [
  { value: "DTE", label: "DTE " },
  { value: "Samarath", label: "Samarath" },
  { value: "SDIT", label: "SDIT " },
];


const DteUpskilingBulk = (props) => {
  const [row, setRowData] = useState(props.row);
  const [startDate, setStartDate] = useState(new Date());
  const [areaOptions, setAreaOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  
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
    getStudentsPickList().then(data => {
      setGenderOptions(data.gender.map(item => ({ key: item.value, value: item.value, label: item.value })));
    });

   

  }, [props]);
  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
  }, []);

  const updateRow = (id, field, value) => {
    row[field] = value;
  
  };

  return (
    <>
      <tr key={row.id}>
        {/* <td>{row.id}</td> */}
        <td>
          <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.student_name
                ? `border-red`
                : "table-input"
            }`}
            type="text"
            onChange={(e) => updateRow(row.id, "student_name", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) => updateRow(row.id, "course_name", e.target.value)}
          />
        </td>
        <td>
          <Select
            className="table-input"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="institution"
            options={props.institutiondata}
            onChange={(e) => props.handleChange(e, "institution_name", row.id)}
          />
        </td>
        <td>
          <Select
            className="table-input"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="batch"
            options={props.batchbdata}
            onChange={(e) => props.handleChange(e, "batch_name", row.id)}
          />
        </td>
        <td>
          <Select
            className="basic-single table-input"
            classNamePrefix="select"
            // defaultValue={stateOptions[0]}
            // isDisabled={isDisabled}
            // isLoading={true}
            isClearable={true}
            // isRtl={isRtl}
            isSearchable={true}
            name="state"
            options={props.statedata}
            onChange={(e) => onStateChange(e, row.id, "state")}
          />
        </td>
        <td>
         
            <Select
              className="basic-single table-input"
              classNamePrefix="select"
              // defaultValue={batchOptions[0]}
              // isDisabled={isDisabled}
              // isLoading={true}
              isClearable={true}
              // isRtl={isRtl}
              isSearchable={true}
              name="area"
              options={areaOptions}
              onChange={(e) => props.handleChange(e, "area", row.id)}
            />
          
        </td>

        <td>
          <input
            type="date"
            className="table-input h-2"
            defaultValue={startDate}
            onChange={(e) => {

              setStartDate(e.target.value);
              props.updateRow(row.id, "dob", e.target.value);
            }}
          />
        </td>
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.gender ? `border-red` : ""
            }`}
            classNamePrefix="select"
            isSearchable={true}
            name="area"
            options={genderOptions}
            onChange={(e) => props.handleChange(e, "gender", row.id)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              updateRow(row.id, "father_guardian", e.target.value)
            }
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) => props.updateRow(row.id, "mobile", e.target.value)}
          />
        </td>
        <td>
          {/* <Select
                        className="basic-single table-input"
                        classNamePrefix="select"
                       
                        isSearchable={true}
                        name="area"
                        options={options}
                        onChange={(e) => props.handleChange(e, "donor", row.id)}
                    /> */}
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
            onChange={(e) =>
              props.updateRow(row.id, "institute_admitted", e.target.value)
            }
          />
        </td>
        
        <td>
          <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.acad_year
                ? `border-red`
                : "table-input"
            }`}
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "acad_year", e.target.value)
            }
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) => props.updateRow(row.id, "placed", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "apprenticeship", e.target.value)
            }
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "company_placed", e.target.value)
            }
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "position", e.target.value)
            }
          />
        </td>
        <td>
          <input
            type="date"
            className="table-input  h-2"
            defaultValue={startDate}
            onChange={(e) => {

              setStartDate(e.target.value);
              props.updateRow(row.id, "doj", e.target.value);
            }}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "monthly_salary", e.target.value)
            }
          />
        </td>
        <td>
          <input 
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "annual_income", e.target.value)
            }
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "full_address", e.target.value)
            }
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "self_employed", e.target.value)
            }
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "higher_studies", e.target.value)
            }
          />
        </td>

         <td>
          <Select
            className={`table-input donor ${
              props.classValue[`class${row.id - 1}`]?.gender ? `border-red` : ""
            }`}
            classNamePrefix="select"
            isSearchable={true}
            name="area"
            options={options}
            onChange={(e) => props.handleChange(e, "data_flag", row.id)}
          />
        </td>
       
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) => props.updateRow(row.id, "trade", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "company_apprenticed", e.target.value)
            }
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "company_self", e.target.value)
            }
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) => props.updateRow(row.id, "result", e.target.value)}
          />
        </td>
      </tr>
    </>
  );
};

export default DteUpskilingBulk;
