import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { getStateDistricts } from "../../Address/addressActions";
import { getDefaultAssigneeOptions } from "../../../utils/function/lookupOptions";
import { capitalizeFirstLetter, handleKeyPress, handleKeyPresscharandspecialchar, isEmptyValue, mobileNochecker } from "../../../utils/function/OpsModulechecker";
import { getAlumniPickList,getStudent,searchStudents } from "./operationsActions";


const options = [
  { value: 'Open', label: "Open" },
  { value: 'Resolved', label: "Resolved" },
  { value: 'Closed', label: "Closed" }
];

const AlumunniBulkrow = (props) => {
  const [name,setName]=useState("")
  const [rows, setRows] = useState([
    {
      id: 1,
      query_start: "",
      student_name: name,
      student_id:"",
      father_name: "",
      email: "",
      phone: "",
      location: "",
      query_type: "",
      query_desc: "",
      conclusion: "",
      status: "",
      query_end: "",
      // published_at: "",
    },
    // Add more initial rows as needed
  ]);
  const [row, setRowData] = useState(props.row);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [areaOptions, setAreaOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [studentinput,setstudentinput]=useState("")
  const [queryTypes,setQueryType]=useState([])
  const [Father,setFatherName]=useState("")
  const [email,setEmail]=useState("")
  const [phone,setPhone]=useState('')
  const [area,setArea]=useState({})
  const queryDesc=useRef(null)
  const conclusion=useRef(null)
  const [status ,setStatus]=useState(false)
  const [fieldvalue,setfieldvalue]=useState({student_name: "",
    student_id:"",
    father_name: "",
    email: "",
    phone: "",
    location: "",})
 
  const filterStudent = async (filterValue) => {
    try {
      const {data} = await searchStudents(filterValue);
      let studentFoundInList = false;
      let filterData = data.studentsConnection.values.map(student => {
        if (student.id === Number(props?.id)) {
          studentFoundInList = true;
        }
        return {
          ...student,
          label: `${student.full_name} (${student.student_id})`,
          value: Number(student.id),
        }
      });

      return filterData;

    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    filterStudent(studentinput).then((data) => {
     
      setStudentOptions(data);
    });
  }, [studentinput]);
  const handleInputChange = (id,data,value) => {
    const input = value.current;
    if (input) {
      input.value = capitalizeFirstLetter(input.value);;
      props.updateRow(id,data,input.value)
    }
   
  };

  useEffect(() => {
    getStudent(name?.id).then(async(data)=>{
      if(data){
        if(!isEmptyValue(data?.name_of_parent_or_guardian) || !isEmptyValue(data?.email) || !isEmptyValue(data?.phone)){
          setFatherName(data?.name_of_parent_or_guardian)
          setEmail(data?.email)
          setPhone(data?.phone)
          setArea({value: data.medha_area, label: data.medha_area})
          setfieldvalue({...fieldvalue ,father_name:data?.name_of_parent_or_guardian,phone:data?.phone,email:data?.email})
          // await props.updateRow(row.id, "father_name", data?.name_of_parent_or_guardian)
        }
  
      }

      

    })
  }, [name])


useEffect(()=>{


if(fieldvalue.email){
  props.updateRow(row.id, "email", fieldvalue.email)
  
  props.updateRow(row.id, "father_name", fieldvalue.father_name)
  props.updateRow(row.id, "phone", fieldvalue.phone)
}
},[fieldvalue])
  
  
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
    getAlumniPickList().then((data) => {
      setAreaOptions(
        data.medha_area.map((item) => ({
          key: item,
          value: item,
          label: item,
        }))
      );
      setQueryType(
        data.query_type.map((item) => ({
          key: item,
          value: item,
          label: item,
        }))
      );
    });
  }, []);


  
  const changeInput =async (event,field,id)=>{
    
  if(field =="student_name"){
    await props.updateRow(id, "student_name",event.full_name)
  }else {
    await props.handleChange(event, field, id)
  }
  
   
  }
  const handleClear =()=>{
    setFatherName("")
    setEmail("")
    setPhone("")
    setName('')
    setArea({})
  }

  const statuscheck =(e)=>{
    if(e.value =="Open"){
      setStatus(false)
    }else{
      setStatus(true)
    }

    props.handleChange(e, "status", row.id)
  }

  useEffect(() => {
    // This effect will run every time inputValue changes
    props.updateRow(row.id, "student_name", name.full_name)
  }, [name]);

  useEffect(() => {
    // This effect will run every time inputValue changes
    props.updateRow(row.id, "father_name", Father)
  }, [Father]);

  useEffect(() => {
    // This effect will run every time inputValue changes
    props.updateRow(row.id, "email", email)
  }, [email]);

  useEffect(() => {
    // This effect will run every time inputValue changes
    props.updateRow(row.id, "location", area.value)
  }, [area]);

  
  return (
    <>
      <tr key={row.id}>
        <td>
          <Select
            className="basic-single table-input h-2"
            classNamePrefix="select"
            isClearable={handleClear}
            isSearchable={true}
            filterData={filterStudent}
            options={studentOptions}
            onInputChange={(e)=>{
             
              setstudentinput(e)
            
            }}
            onChange={async(e) => {
              if(e){
                setName(e)
                changeInput(e, "student_id", row.id)
              }else{
                handleClear()
              }
              
            }}
          />
        </td>
        <td>
          <input
            type="date"
            className={`table-input h-2 ${props.classValue[`class${row.id-1}`]?.query_start ? `border-red`:"table-input h-2"}`}
            defaultValue={startDate}
            onChange={(e) => {

              setStartDate(e.target.value);
              props.updateRow(row.id, "query_start", e.target.value);
            }}
          />
        </td>
        <td>
          <input
            className={`table-input h-2  ${props.classValue[`class${row.id-1}`]?.student_name ? `border-red`:"table-input h-2"}`}
            type="text"
            defaultValue={name?.full_name || ""}
            disabled={name?.full_name ? true :false}
            onKeyPress={handleKeyPresscharandspecialchar}
            onChange={(e) => props.updateRow(row.id, "student_name", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            disabled={Father ? true :false}
            value={Father}
            onKeyPress={handleKeyPress}
            onChange={(e) => props.updateRow(row.id, "father_name", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            disabled={email ? true :false}
            defaultValue={email}
            onChange={(e) => props.updateRow(row.id, "email", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            defaultValue={phone}
            disabled={phone ? true :false}
            onKeyPress={mobileNochecker}
            onChange={(e) => props.updateRow(row.id, "phone", e.target.value)}
          />
        </td>
       <td>
          {/* <input
            className="table-input h-2"
            type="text"

            onChange={(e) => props.updateRow(row.id, "location", e.target.value)}
          /> */}
          <Select
            className={`table-input ${props.classValue[`class${row.id-1}`]?.location ? `border-red`:"table-input h-2"}`}
            classNamePrefix="select"
            isSearchable={true}
            options={areaOptions}
            value={area}
            isDisabled={!isEmptyValue(area)? true :false}
            onChange={(e) => props.handleChange(e, "location", row.id)}
          />
        </td>
         <td>
          
          <Select
            className="basic-single table-input "
            classNamePrefix="select"
            isSearchable={true}
            options={queryTypes}
            onChange={(e) => props.handleChange(e, "query_type", row.id)}
          />
        </td>

       
       
        
       
        <td>
          <input
            className={`table-input h-2 ${props.classValue[`class${row.id-1}`]?.query_desc ? `border-red`:"table-input h-2"}`}
            type="text"
            ref={queryDesc}
            onChange={(e) => handleInputChange(row.id, "query_desc",queryDesc)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            ref={conclusion}
            onChange={(e) => handleInputChange(row.id, "conclusion",conclusion)}
          />
           
        </td>

        
        <td>
          <Select
            className={`table-input  ${props.classValue[`class${row.id-1}`]?.status ? `border-red`:"table-input h-2"}`}
            classNamePrefix="select"
            isSearchable={true}
            options={options}
            onChange={(e) => statuscheck(e)}
          />
        </td>
        <td>
          <input
            type="date"
            className="table-input h-2 "
            defaultValue={startDate}
            min={startDate}
            value={endDate}
            disabled={!isEmptyValue(startDate) && status ? false:true}
            onChange={(e) => {

              setEndDate(e.target.value);
              props.updateRow(row.id, "query_end", e.target.value);
            }}
          />
        </td>

        
      </tr>
    </>
  );
};

export default AlumunniBulkrow;
