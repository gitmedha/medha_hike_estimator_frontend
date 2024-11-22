import React from 'react'
import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
// import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";

import { Input } from "../../../utils/Form";
import { historicValidations} from "../../../validations";
import {getHistoricPickList} from './HistoricActions';
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



function HistoricForm(props) {
    const { show, handleClose,onHide } = props;
    const [employees,setEmployees] = useState([]);
    const [reviewers,setReviewers] = useState([]);
    const [loading, setLoading] = useState(true);
    const initialValues = {
        employee:props?.HistoricalData?.employee || "",
        reviewer:props?.HistoricalData?.department || "",
        kra_vs_goals:props?.HistoricalData?.kra_vs_goals || "",
        competency:props?.HistoricalData?.competency || "",
        final_score:props?.HistoricalData?.final_score || "",
        start_month:new Date(props?.HistoricalData?.start_month) || "",
        ending_month:new Date(props?.HistoricalData?.ending_month) || ""
    }
    const onSubmit = async (values)=>{
        try{

        }catch(error){

        }
    }

    useEffect(()=>{
        async function setInitialFields(){
            const data = await getHistoricPickList();
            console.log(data)
            setEmployees(data.employees);
            setReviewers(data.reviewers);
        }
        setInitialFields()
    }, [])
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
              validationSchema={historicValidations}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <Section>
                    <div className="row">
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="employee"
                          label="Full Name"
                          required
                          control="lookup"
                          placeholder="Full Name"
                          className="form-control"
                          options={employees}
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="reviewer"
                          label="Reviewer"
                          required
                          control="lookup"
                          placeholder="Reviewer"
                          className="form-control"
                          options={reviewers}
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="kra_vs_goals"
                          label="Kra vs Goals"
                          required
                          control="input"
                          placeholder="Kra vs Goals"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="competency"
                          label="Competency"
                          required
                          control="input"
                          placeholder="Competency"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="final_score"
                          label="Final Score"
                          required
                          control="input"
                          placeholder="Final Score"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="start_month"
                          label="Start Month"
                          required
                          control="datepicker"
                          className="form-control"
                          placeholder="Start Date"
                          autoComplete="off"
                        />
                        </div>
                        <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="end_month"
                          label="End Month"
                          required
                          control="datepicker"
                          className="form-control"
                          placeholder="Start Date"
                          autoComplete="off"
                        />
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

export default HistoricForm