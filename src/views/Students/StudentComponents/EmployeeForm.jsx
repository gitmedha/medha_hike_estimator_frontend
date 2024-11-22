import React from 'react'
import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
import {useHistory} from "react-router-dom";
import nProgress from "nprogress";

// import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";

import { Input } from "../../../utils/Form";
import { employeeValidations} from "../../../validations";
import {getEmployeePicklist,createEmployee,updateEmployee} from './EmployeeActions';
import DetailField from "../../../components/content/DetailField";

import moment from "moment";

const Section = styled.div`
  padding-top: 30px;
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
export default function EmployeeForm(props) {

    
    const { show,onHide } = props;
    let navigation = useHistory();

    const [currentBands, setCurrentBands] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [employeeTypes, setEmployeeTypes] = useState([]);
    const [employeeStatuses] = useState([
        {
        label: 'Active',
        value: 'Active'
    }, {
        label: 'Inactive',
        value: 'Inactive'
    }
]);
    const [employeeTitles, setEmployeeTitles] = useState([]);

    const [isWorking,setIsWorking] = useState(props.employeeData ? true:false);
    const [isUpdated,setIsUpdated] = useState(false);
    const [experience,setExperience] = useState(props.employeeData?props.employeeData.experience : "0 days" );
    const [startDate, setStartDate] = useState("");
    const [endDate,setEndDate] = useState("");

 

    const initialValues = {
        current_band:props?.employeeData?.current_band || "",
        department:props?.employeeData?.department || "",
        email_id:props?.employeeData?.email_id || "",
        first_name:props?.employeeData?.first_name || "",
        last_name:props?.employeeData?.last_name || "",
        experience:props?.employeeData?.experience || "",
        employee_status:props?.employeeData?.employee_status || "",
        employee_id:props?.employeeData?.employee_id || "",
        title:props?.employeeData?.title || "",
        employee_type:props?.employeeData?.employee_type || "",
        date_of_joining: props.employeeData?new Date(props.employeeData.date_of_joining):"",
    }

    
    useEffect(()=>{
        async function fetchPickList(){
           const employeePickLists =  await getEmployeePicklist();
            setCurrentBands(employeePickLists.currentBands);
            setDepartments(employeePickLists.departments);
            setEmployeeTypes(employeePickLists.employeeTypes);
            setEmployeeTitles(employeePickLists.titles);
        }

        fetchPickList();
    },[])
    
    const getUpdatedFields = (oldData, newData) => {
      const updatedFields = {};
      for (const key in newData) {
          if (newData[key] !== oldData[key]) {
            console.log(key)
            if(key === "date_of_joining"){
              const newJoiningDate = new Date(newData[key]);
              const oldJoiningDate = new Date(oldData[key]);
              if(newJoiningDate.toISOString() === oldJoiningDate.toISOString()) {
                return updatedFields;
              }
              else {
                updatedFields[key] = newData[key];
              }
            }
            updatedFields[key] = newData[key];
          }
      }
      return updatedFields;
  };
  

    const onSubmit = async (values) => {
      nProgress.start();
      try {
          if (props.employeeData) {
              const updatedData = getUpdatedFields(props.employeeData, values);
              if (Object.keys(updatedData).length > 0) {
                  await updateEmployee(updatedData,props.employeeData.id);
                  onHide();
              } else {

                setIsUpdated(true);
                setTimeout(() => {
                  setIsUpdated(false);
                  onHide();
                  nProgress.done();
                },3000);
                
              }
          } else {
              const response = await createEmployee(values);
              onHide();
              navigation.push(`/employee/${response.data.id}`);
              nProgress.done();
          }
          
      } catch (error) {
          console.error("Error submitting form:", error);
      }
  };

  const calculateExperience = (startDate, endDate) => {
    // Parse the dates
    const start = moment(startDate);
    const end = moment(endDate);
  
    // Check if the dates are valid
    if (!start.isValid() || !end.isValid()) {
      return "Invalid dates";
    }
  
    // Calculate the difference
    const years = end.diff(start, "years");
    const months = end.diff(start, "months") % 12;
  
    return `${years} year(s) ${months} month(s)`;
  };

    return (
        <Modal
          centered
          size="lg"
          show={show}
          animation={false}
          aria-labelledby="contained-modal-title-vcenter"
          className="form-modal"
        >
          <Modal.Header className="bg-white">
            <Modal.Title
              id="contained-modal-title-vcenter"
              className="d-flex align-items-center"
            >
              <h1 className="text--primary bebas-thick mb-0">
                {props.employeeData ? "Edit Details" : 'Add New'}
              </h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-white">
            <Formik
              onSubmit={onSubmit}
              initialValues={initialValues}
              validationSchema={employeeValidations}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <Section>
                    <div className="row">
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="first_name"
                          label="First Name"
                          required
                          control="input"
                          placeholder="First Name"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="last_name"
                          label="Last Name"
                          required
                          control="input"
                          placeholder="Last Name"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="employee_id"
                          label="Employee ID"
                          required
                          control="input"
                          placeholder="Employee ID"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="email_id"
                          label="Email"
                          required
                          control="input"
                          placeholder="Email"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="date_of_joining"
                          label="Date of Joining"
                          required
                          control="datepicker"
                          className="form-control"
                          placeholder="Date of Joining"
                          autoComplete="off"
                        />
                        </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                          <Input
                            control="lookup"
                            name="title"
                            label="Title"
                            required
                            className="form-control"
                            placeholder="Title"
                            options={employeeTitles}
                          />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                          <Input
                            icon="down"
                            control="lookup"
                            name="employee_status"
                            label="Status"
                            required
                            className="form-control"
                            placeholder="Status"
                            options={employeeStatuses}
                          />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                          <Input
                            control="lookup"
                            name="employee_type"
                            label="Types"
                            required
                            className="form-control"
                            placeholder="Type"
                            options={employeeTypes}
                          />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                          <Input
                            control="lookup"
                            name="department"
                            label="Department"
                            required
                            className="form-control"
                            placeholder="Department"
                            options={departments}
                          />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                          <Input
                            control="lookup"
                            name="current_band"
                            label="Current Band"
                            required
                            className="form-control"
                            placeholder="Current Band"
                            options={currentBands}
                          />
                      </div>
                    </div>
                  </Section>
                  <Section>
                    <h3 className='section-header'>
                    Experience    
                    </h3>
                    <div className="row">
                    <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="start_date"
                          label="Start Date"
                          required
                          control="datepicker"
                          className="form-control"
                          placeholder="Start Date"
                          autoComplete="off"
                          onChange={(e)=>setFieldValue('start_date',e.target.value)}
                        />
                        </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="end_date"
                          label="End Date"
                          required
                          control="datepicker"
                          placeholder="End Date"
                          className="form-control"
                          autoComplete="off"
                          onChange={(e)=>setFieldValue('end_date',e.target.value)}
                        />
                      </div>
                      {/* <div className="col-md-6 col-sm-12 mt-2 d-flex align-items-center">
                      <DetailField label="Experience" className="capitalize" value={experience} />
                      {console.log(values.start_date)}
                      {console.log(values.end_date)}
                      {console.log(calculateExperience(values.start_date, values.end_date))}
                      </div> */}

                    </div>
                    {isUpdated ? <p style={{color:'red'}}> No Changes Detected</p>: <p></p>}
                  </Section>
                  <div className="row justify-content-end mt-1">
                    <div className="col-auto p-0">
                       <button type="button"
                       onClick={onHide} className='btn btn-secondary btn-regular collapse_form_buttons'>
                        CANCEL                    
                      </button>
                    </div>
                    <div className="col-auto p-0">
                      <button type='submit' className='btn btn-primary btn-regular collapse_form_buttons'>
                        SAVE
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
      );
}
