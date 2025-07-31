import React from 'react'
import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { useState, useEffect } from "react";

import { Input } from "../../../utils/Form";
import { bonusValidations} from "../../../validations";
import {getBonusPickList,createBonus,updateBonus} from './bonusActions';
import moment from "moment";
import nProgress from "nprogress";
import {useHistory} from "react-router-dom";
import toaster from 'react-hot-toast'
import ReviewCycleInput  from "../../Increments/IncrementsComponents/utils/layout/reviewCycleInput";



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



function BonusForm(props) {
    const { reviewCycle,show,onHide } = props;
    const [increments,setIncrements] = useState([]);
    const [reviewers,setReviewers] = useState([]);
    const [IDs,setIDs] = useState([]);
    let navigation = useHistory();
    const initialValues = {
        average:props?.bonusData?.average || 0,
        compentency:props?.bonusData?.compentency || 0,
        employee_id:props?.bonusData?.employee_id || "",
        full_name:props?.bonusData?.full_name || "",
        bonus:props?.bonusData?.bonus || "0",
        kra:props?.bonusData?.kra || 0,
        manager:props?.bonusData?.manager || "",
        normalized_ratings:props?.bonusData?.normalized_ratings || 0,
        weighted_bonus:props?.bonusData?.weighted_bonus || "0",
        from_review_cycle:props?.bonusData?.from_review_cycle || null,
        to_review_cycle:props?.bonusData?.to_review_cycle || null
    }
    const onSubmit = async (values)=>{
      nProgress.start();
        try{
        let newValues = values;
        
        newValues.normalized_ratings = parseFloat(values.normalized_ratings);
        newValues.compentency = parseFloat(values.compentency);
        newValues.average = parseFloat(values.average);
        newValues.kra = parseFloat(values.kra);
          if(props.bonusData){
            await updateBonus(newValues,props.bonusData.id);
            onHide();
            toaster.success('Details updated successfully!',{ position: "bottom-center" })

            setTimeout(() =>window.location.href = `/bonus/${props.bonusData.employee_id}`,2000);
            nProgress.done();

          }
          else {
            
           const{data} =  await createBonus(newValues);
           onHide();
           props.ToastOnSuccess()
           setTimeout(() => navigation.push(`/bonus/${data[0].employee_id}`),2000);
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
            const data = await getBonusPickList(reviewCycle);
            setIncrements(data.Names);
            setReviewers(data.Managers);
            setIDs(data.IDS);
        }
        setInitialFields()
    }, [])

    console.log("props.bonusData",props.bonusData)
  
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
                {props.bonusData ? "Edit Details" : 'Add New'}
              </h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-white">
            <Formik
              onSubmit={onSubmit}
              initialValues={initialValues}
              validationSchema={bonusValidations}
            >
              {({ values, setFieldValue }) => {
                const handleInputChange = (field, value) => {
                  setFieldValue(field, value);
                  if(field === "kra"){
                    const kra = parseFloat(value);
                    const compentency = parseFloat(values.compentency);
                    const average = (kra + compentency) / 2;
                    setFieldValue("average", average.toFixed(1));
                  }
                  else if (field === "compentency"){
                    const kra = parseFloat(values.kra);
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
                          isDisabled={props.bonusData ? true : false}
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
                          name="kra"
                          label="Kra"
                          required
                          control="input"
                          placeholder="Kra"
                          className="form-control"
                          onChange={(e) => handleInputChange("kra", e.target.value)}
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
                          name="bonus"
                          label="Bonus"
                          control="input"
                          placeholder="Bonus %"
                          className="form-control"
                          disabled={true}
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                          name="normalized_ratings"
                          label="Normalized Rating"
                          control="input"
                          placeholder="Normalized Rating"
                          className="form-control"
                          disabled={true}
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                          name="weighted_bonus"
                          label="Weighted Bonus"
                          control="input"
                          placeholder="Weighted Bonus %"
                          className="form-control"
                        />
                      </div>
                    </div>
                  </Section>
                  <div className="row justify-content-between mt-1">
                    <div className="col-auto p-0">
                       {
                        props.bonusData && <button type="button"
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
                </Form>)
              }}
            </Formik>
          </Modal.Body>
        </Modal>
      );
}

export default BonusForm;