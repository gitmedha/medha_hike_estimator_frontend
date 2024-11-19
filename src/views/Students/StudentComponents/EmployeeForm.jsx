import React from 'react'
import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
// import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";

import { Input } from "../../../utils/Form";
import { EmployeeValidations} from "../../../validations";
import {getEmployeePicklist} from './EmployeeActions';
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

    
    const { show, handleClose,onHide } = props;

    const [currentBands, setCurrentBands] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [employeeTypes, setEmployeeTypes] = useState([]);
    const [employeeStatuses] = useState([
        {
        label: 'Active',
        Value: 'Active'
    }, {
        label: 'Inactive',
        Value: 'Inactive'
    }
]);
    const [employeeTitles, setEmployeeTitles] = useState([]);

    const [isWorking,setIsWorking] = useState(props.employeeData ? true:false);

    const initialValues = {
        is_present: isWorking ? ["present"] : [],
        current_band:props?.employeeData?.current_band || "",
        department:props?.employeeData?.department || "",
        email_id:props?.employeeData?.email_id || "",
        first_name:props?.employeeData?.first_name || "",
        last_name:props?.employeeData?.last_name || "",
        experience:props?.employeeData?.experience || "",
        employee_status:props?.employeeData?.employee_status || "Active",
        employee_id:props?.employeeData?.employee_id || "",
        title:props?.employeeData?.title || "",
        employee_type:props?.employeeData?.employee_type || "",
        date_of_joining: new Date(props?.employeeData?.date_of_joining ) || ""
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



    const onSubmit = async(values) =>{
        try {
            console.log(values);
        } catch (error) {
            console.error(error)
        }
    }

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
              validationSchema={EmployeeValidations}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <Section>
                    <div className="row form_sec">
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
                      {/* <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="date_of_joining"
                          label="Date of Joining"
                          required
                          control="datepicker"
                          className="form-control"
                          placeholder="Date of Joining"
                          autoComplete="off"
                        />
                        </div> */}
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
                        />
                        </div>
                      {!isWorking && <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="end_date"
                          label="End Date"
                          required
                          control="datepicker"
                          placeholder="End Date"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>}
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                            control="checkbox"
                            name="is_present"
                            label="Current Working"
                            options={[
                            { key: "Present", value: "present" }
                            ]}
                            className="form-check-label"
                            onChange={e => setIsWorking(e.target.checked)}                        />
                        </div>

                    </div>
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
