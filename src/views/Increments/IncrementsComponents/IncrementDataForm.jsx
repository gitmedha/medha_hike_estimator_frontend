import React from 'react'
import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
// import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";

import { Input } from "../../../utils/Form";
import { incrementValidations} from "../../../validations";
import {fetchIncrementPickList,createIncrement,updateIncrement} from './incrementsActions';
import moment from "moment";
import nProgress from "nprogress";
import {useHistory} from "react-router-dom";
import toaster from 'react-hot-toast'
import ReviewCycleInput  from "../IncrementsComponents/utils/layout/reviewCycleInput";



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
.reviewCycleHeading {
  color: #787B96;
  font-family: 'Latto-Regular';
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
  margin-bottom: 5px;
}
`;



function IncrementDataForm(props) {
    const { show,onHide } = props;
    const [increments,setIncrements] = useState([]);
    const [reviewers,setReviewers] = useState([]);
    const [newBands] = useState([{
      label:'I',
      value:'I'
     }, {
      label:'II',
      value:'II'
     },{
      label:'III',
      value:'III'
     }, {
      label:'IV',
      value:'IV'
     }, {
      label:'V',
      value:'V'
     }, {
      label:'VI',
      value:'VI'
     }])
    const [currentBands] = useState([{
      label:'I',
      value:'I'
     }, {
      label:'II',
      value:'II'
     },{
      label:'III',
      value:'III'
     }, {
      label:'IV',
      value:'IV'
     }, {
      label:'V',
      value:'V'
     }, {
      label:'VI',
      value:'VI'
     }])
    const [IDs,setIDs] = useState([]);
    let navigation = useHistory();
    const initialValues = {
        average:props?.IncrementData?.average || 0,
        compentency:props?.IncrementData?.compentency || 0,
        current_band:props?.IncrementData?.current_band || "",
        current_salary:props?.IncrementData?.current_salary || "",
        employee_id:props?.IncrementData?.employee_id || "",
        full_name:props?.IncrementData?.full_name || "",
        inc_adjustments:props?.IncrementData?.inc_adjustments || "0",
        increment:props?.IncrementData?.increment || "0",
        kra_vs_goals:props?.IncrementData?.kra_vs_goals || 0,
        long_tenure:props?.IncrementData?.long_tenure || "No",
        manager:props?.IncrementData?.manager || "",
        new_band:props?.IncrementData?.new_band || "",
        new_salary:props?.IncrementData?.new_salary || "",
        normalize_rating:props?.IncrementData?.normalize_rating || 0,
        tenure:props?.IncrementData?.tenure || 0,
        weighted_increment:props?.IncrementData?.weighted_increment || "0",
        from_review_cycle:props?.IncrementData?.from_review_cycle || null,
        to_review_cycle:props?.IncrementData?.to_review_cycle || null
    }

    const onSubmit = async (values)=>{
      console.log("working")
      nProgress.start();
        try{
        let newValues = {...values};
        
        newValues.long_tenure = values.long_tenure === "Yes" ? true : false;
        newValues.normalize_rating = parseFloat(values.normalize_rating);
        newValues.compentency = parseFloat(values.compentency);
        newValues.average = parseFloat(values.average);
        newValues.kra_vs_goals = parseFloat(values.kra_vs_goals);
        newValues.tenure = parseFloat(values.tenure);
        newValues.from_review_cycle = moment(values.from_review_cycle).format("MMMM YYYY");
        newValues.to_review_cycle = moment(values.to_review_cycle).format("MMM YYYY");


          if(props.IncrementData){
            
            await updateIncrement(newValues,props.IncrementData.id);
            onHide();
            toaster.success('Details updated successfully!',{ position: "bottom-center" })

            setTimeout(() =>window.location.href = `/increment_employee/${props.IncrementData.employee_id}`,2000);
            nProgress.done();

          }
          else {
           const{id} =  await createIncrement(newValues);
           onHide();
           props.ToastOnSuccess()
          //  setTimeout(() => navigation.push(`/increment_employee/${id[0].employee_id}`),2000);
          nProgress.done();

          }

        }catch(error){
          onHide();
          nProgress.done();
          if(props.ToastOnFailure){
            props.ToastOnFailure();
          }
          else {
            toaster.error('Failed to update details!',{ position: "bottom-center" })
          }
          console.error(error)
        }
    }

    useEffect(()=>{
        async function setInitialFields(){
            const data = await fetchIncrementPickList();
            setIncrements(data.names);
            setReviewers(data.managers);
            setIDs(data.IDs);
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
                {props.IncrementData ? "Edit Details" : 'Add New'}
              </h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-white">
            <Formik
              onSubmit={onSubmit}
              initialValues={initialValues}
              validationSchema={incrementValidations}
            >
              {({ values, setFieldValue }) => {
                const handleInputChange = (field, value) => {
                  setFieldValue(field, value);
                  if(field === "kra_vs_goals"){
                    const kra = parseFloat(value);
                    const compentency = parseFloat(values.compentency);
                    const average = (kra + compentency) / 2;
                    setFieldValue("average", average.toFixed(1));
                  }
                  else if (field === "compentency"){
                    const kra = parseFloat(values.kra_vs_goals);
                    const compentency = parseFloat(value);
                    const average = (kra+ compentency)/2;
                    setFieldValue("average", average.toFixed(1));
                  }
                };
                return(<Form>
                  <Section>
                    <div className="row">
                    <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="employee_id"
                          label="Employee ID"
                          required
                          control="lookup"
                          placeholder="Employee ID"
                          className="form-control"
                          options={IDs}
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="full_name"
                          label="Full Name"
                          required
                          control="lookup"
                          placeholder="Full Name"
                          className="form-control"
                          options={increments}
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="manager"
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
                          label="Kra"
                          required
                          control="input"
                          placeholder="Kra"
                          className="form-control"
                          onChange={(e) => handleInputChange("kra_vs_goals", e.target.value)}
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="compentency"
                          label="Competency"
                          required
                          control="input"
                          placeholder="Competency"
                          className="form-control"
                          onChange={(e) => handleInputChange("compentency", e.target.value)}

                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="average"
                          label="Average"
                          required
                          control="input"
                          placeholder="Average"
                          className="form-control"
                          disabled={true}
                        />
                      </div>
                      
                      <div className="col-md-6 col-sm-12 mt-2">
                        <label htmlFor="Review Cycle" className="reviewCycleHeading">
                          Review Cycle <span style={{color:'red', fontSize:'16px'}}>*</span>
                        </label>
                        <div className="d-flex justify-content-between">
                           <ReviewCycleInput
                          name="from_review_cycle"
                          label="From"
                          className=""
                          required
                        />
                        <ReviewCycleInput
                          name="to_review_cycle"
                          label="To"
                          required
                        />

                        </div>
                       
                       
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="tenure"
                          label="Tenure"
                          required
                          control="input"
                          placeholder="Tenure"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="long_tenure"
                          label="Long Tenure"
                          required
                          control="lookup"
                          placeholder="Long Tenure"
                          options={[
                            {key: 0,
                            value: 'No',
                            label: 'No'},
                            {key: 1,
                            value: 'Yes',
                            label: 'Yes'}
                          ]}
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="inc_adjustments"
                          label="Incremental Adjustments"
                          required
                          control="input"
                          placeholder="Incremental Adjustments %"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="current_band"
                          label="Current Band"
                          required
                          control="lookup"
                          placeholder="Current Band"
                          className="form-control"
                          options={currentBands}
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="current_salary"
                          label="Current Salary"
                          required
                          control="input"
                          placeholder="₹ Current Salary"
                          className="form-control"
                        />
         
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="new_band"
                          label="New Band"
                          required
                          control="lookup"
                          placeholder="New Band"
                          className="form-control"
                          options={newBands}
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="new_salary"
                          label="New Salary"
                          required
                          control="input"
                          placeholder="₹ New Salary"
                          className="form-control"
                        />
                      </div>
                      
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="increment"
                          label="Increment"
                          control="input"
                          placeholder="Increment %"
                          className="form-control"
                          // disabled={true}
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                          name="normalize_rating"
                          label="Normalize Rating"
                          control="input"
                          placeholder="Normalize Rating"
                          className="form-control"
                          // disabled={true}
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                          name="weighted_increment"
                          label="Weighted Increment"
                          control="input"
                          placeholder="Weighted Increment %"
                          className="form-control"
                        />
                      </div>
                    </div>
                  </Section>
                  <div className="row justify-content-between mt-1">
                    <div className="col-auto p-0">
                       {
                        props.IncrementData && <button type="button"
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
                      <button type='submit' className='btn btn-primary btn-regular collapse_form_buttons' >
                        SAVE
                      </button>
                    </div>
                  </div>
                </Form>)
              }}
            </Formik>
          </Modal.Body>
        </Modal>
      );
}

export default IncrementDataForm;