import React,{Fragment,useState} from 'react'
import {connect} from 'react-redux';
import { Input } from '../../../utils/Form';
import { Formik, FieldArray, Form ,useFormik} from 'formik';
import styled from "styled-components";
import {searchOperationTab,resetSearch} from '../../../store/reducers/Operations/actions';
import {getFieldValues} from './operationsActions';
const Section = styled.div`
  padding-bottom: 30px;

  &:not(:first-child) {
    border-top: 1px solid #C4C4C4;
  }

  .section-header {
    color: #207B69;
    font-family: 'Latto-Regular';
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 15px;
  }
`;
const SamarthSearchBar =({searchOperationTab,resetSearch})=> {

  let options = [{key:0, value:'student_name',label:'Student Name'}, {key:1, value:'institution_name', label:'Institute Name'}, {key:2, value:'course_name',label:'Course Name'}]
        
    const initialValues = {
        search_by_field:'',
        search_by_value:''
    }


    const [studentNameOptions,setStudentNameOptions] = useState([]);
    const [instituteOptions,setInstituteOptions] = useState([]);
    const [courseNameOptions,setCourseNameOptions] = useState([]);
    const [selectedSearchField, setSelectedSearchField] = useState('');


    const handleSubmit = async(values) =>{
        let baseUrl = 'dte-samarth-sdits'
        await searchOperationTab(baseUrl,values.search_by_field,values.search_by_value)
    }
    const formik = useFormik({ // Create a Formik reference using useFormik
      initialValues,
      onSubmit: handleSubmit,
  });
  const setSearchItem = (value)=>{

    setSelectedSearchField(value)
 
    if(value === 'student_name'){
      setDropdownValues(value)
    }

    else if(value === 'institution_name'){
      setDropdownValues(value)
    }
    else if (value === "course_name"){
      setDropdownValues(value)
    }


  }


  const setDropdownValues = async (fieldName)=>{
    try {
     const {data} =  await getFieldValues(fieldName,'dte-samarth-sdits')
  
     if(fieldName === 'student_name'){
      setStudentNameOptions(data)
    }

    else if(fieldName === 'institution_name'){
      setInstituteOptions(data)
    }
    else if (fieldName === "course_name"){
      setCourseNameOptions(data)
    }
    
    } catch (error) {
      console.error("error", error);
    }
  }

    const clear = async(formik)=>{
      formik.setValues(initialValues);
      await resetSearch()
    }

    

  return (
    <Fragment>
        <Formik 
            initialValues={initialValues}
            onSubmit={handleSubmit}
            >
          {formik=>(<Form>
                <Section>
                    <div className="row align-items-center">
                        <div className='col-lg-2 col-md-4 col-sm-12 mb-2'>
                            <Input
                                icon="down"
                                name="search_by_field"
                                label="Search Field"
                                control="lookup"
                                options={options}
                                className="form-control"
                                onChange = {(e)=>setSearchItem(e.value)}
                            />
                        </div>
                        <div className='col-lg-3 col-md-4 col-sm-12 mb-2'>
                        {
                        selectedSearchField === "" && <Input
                            name="search_by_value"
                            control="input"
                            label="Search Value"
                            className="form-control"
                            disabled={true}
                            
                            />
                            }

                      {
                          selectedSearchField === "student_name" &&
                            <Input 
                                icon="down"
                                name="search_by_value"
                                label="Search Value"
                                control="lookup"
                                options={studentNameOptions}
                                className="form-control"
                            />
                          }

{
                          selectedSearchField === "institution_name" &&
                            <Input 
                                icon="down"
                                name="search_by_value"
                                label="Search Value"
                                control="lookup"
                                options={instituteOptions}
                                className="form-control"
                            />
                          }

{
                          selectedSearchField === "course_name" &&
                            <Input 
                                icon="down"
                                name="search_by_value"
                                label="Search Value"
                                control="lookup"
                                options={courseNameOptions}
                                className="form-control"
                            />
                          }

                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-12 mt-3 d-flex justify-content-start align-items-center">
                        <button className="btn btn-primary btn-regular" type="submit">
                        FIND
                    </button>
                    <button  className="btn btn-secondary btn-regular mr-2" type='button' onClick={() => clear(formik)}>
                        CLEAR
                    </button>
                </div>   
                    </div>
                </Section>
            </Form>)}
        </Formik>
    </Fragment>
  )
}


export default connect(null, {searchOperationTab,resetSearch})(SamarthSearchBar);
