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
    }, 
    {
        label: 'Resigned',
        value: 'resigned'
    }, {
        label: 'Terminated',
        value: 'Terminated'
    }
]);
    const [employeeTitles, setEmployeeTitles] = useState([]);

    const [isUpdated,setIsUpdated] = useState(false);
    
    const initialValues = {
        current_band:props?.employeeData?.current_band || "",
        department:props?.employeeData?.department || "",
        email_id:props?.employeeData?.email_id || "",
        first_name:props?.employeeData?.first_name || "",
        last_name:props?.employeeData?.last_name || "",
        years: props?.employeeData?.experience 
        ? parseInt(props.employeeData.experience.match(/\d+/g)?.[0] || 0, 10) 
        : 0,
        months: props?.employeeData?.experience 
        ? parseInt(props.employeeData.experience.match(/\d+/g)?.[1] || 0, 10) 
        : 0,
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

  const formatExperience = (years, months) => {
    return `${years} year(s) ${months} month(s)`;
  };
  

    const onSubmit = async (values) => {
      nProgress.start();
      const experienceText = formatExperience(values.years, values.months);
  const dataToSubmit = {
    ...values,
    experience: experienceText,
  };
      try {
          if (props.employeeData) {
              const updatedData = getUpdatedFields(props.employeeData, values);
              if (Object.keys(updatedData).length > 0) {
                delete dataToSubmit.years;
                delete dataToSubmit.months;
                  await updateEmployee(dataToSubmit,props.employeeData.id);
                  onHide();
                  props.triggerToast.success('Details updated successfully',{ position: "bottom-center" })
                  setTimeout(()=>{
                    window.location.href = `/employee/${props.employeeData.id}`;
                  },2000)
                 
                 
              } else {

                setIsUpdated(true);
                setTimeout(() => {
                  setIsUpdated(false);
                  onHide();
                  nProgress.done();
                },3000);
                
              }
          } else {
            delete dataToSubmit.years;
            delete dataToSubmit.months;

              const response = await createEmployee(dataToSubmit);
              onHide();
              props.onSuccess();
              setTimeout(() => navigation.push(`/employee/${response.data.id}`),2000);
              nProgress.done();
              
          }
          
      } catch (error) {
        if(props.onFailure){
          props.onFailure(error);
        }
        else {
          props.triggerToast.error("Internal Server error",{ position: "bottom-center" })
        }
          console.error("Error submitting form:", error);
          nProgress.done();

      }
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
                          disabled={props?.employeeData?.employee_id ? true : false}
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
                          name="years"
                          label="Years"
                          required
                          control="input"
                          placeholder="Experience in years"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                      
                    <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                            name="months"
                            label="Months"
                            required
                            control="input"
                            className="form-control"
                            placeholder="Experience in months"
                            autoComplete="off"
                          />
                        </div>
                    </div>
                    
                    {isUpdated ? <p style={{color:'red'}}> No Changes Detected</p>: <p></p>}
                  </Section>
                  <div className="row justify-content-between mt-1">
                    <div className="col-auto p-0">
                       {
                        props.employeeData && <button type="button"
                       onClick={()=>props.showDeleteModal()} className='btn btn-danger btn-regular collapse_form_buttons'>
                        DELETE
                       </button>
                       }
                    </div>
                    <div className="col-auto p-0">
                       <button type="button"
                       onClick={onHide} className='btn btn-secondary btn-regular collapse_form_buttons'>
                        CANCEL                    
                      </button>
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
