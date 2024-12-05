import React,{useEffect,useState} from 'react'
import { useParams } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import styled from 'styled-components';
import { Dropdown } from 'react-bootstrap';
import {fetchIncrement,deleteIncrement,calculateNormalizedRating,calculateIncrement} from "./incrementsActions";
import IncrementDataForm from './IncrementDataForm';
import Details from "./Details";
import toaster from  'react-hot-toast'
const Styled = styled.div`

@media screen and (max-width: 360px) {
  .section-badge {
    margin-left: 2px;
    padding: 0px 20px !important;
  }
}
`
function IncrementEmployee() {
  const [employeeData, setEmployeeData] = useState(null);
  
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const {id} = useParams();

  
useEffect(()=>{
  async function componentMount(){
    const data = await fetchIncrement(id)
    setEmployeeData(data[0]);
  }
  componentMount();
}, [])


const handleDelete = async()=>{
  try{
    await deleteIncrement(id);
    toaster.success("Increment details deleted successfully")
    setTimeout(()=>window.location.href = "/employee_increments",2000);
  }catch(error){
    toaster.error("Failed to delete increment details")
    console.error(error);
  }
}

const handleNormalizedRating = async ()=>{
  try{
    await calculateNormalizedRating(employeeData.employee_id, employeeData.appraisal_cycle,employeeData.average,employeeData.manager);
    toaster.success('Normalized rating calculated successfully!');
    setTimeout(() => {
      window.location.href = "/increment_employee/"+ employeeData.id;
    }, 3000);
    
  }catch(error){
    toaster.error('Unable to calculate rating, check the data again')
    console.error(error);
  }
}

const handleIncrement = async ()=>{
  try{
    await calculateIncrement(employeeData.employee_id,employeeData.appraisal_cycle,employeeData.normalize_rating);
    toaster.success('Increment calculated successfully!')
    setTimeout(() => {
      window.location.href = "/increment_employee/"+ employeeData.id;
    }, 3000);
    }catch(error){
      toaster.error('Unable to calculate increment, check the data again')
    console.error(error);
  }
}

const handleWeightedIncrement = async ()=>{
  
}

  return (
    <Styled>
      <>
        <div className="row" style={{margin: '30px 0 0'}}>
        <div className="col-12 button_container">
              <button
                onClick={() => setModalShow(true)}
                style={{ marginLeft: "0px" }}
                className="btn--primary action_button_sec"
              >
                EDIT
              </button>
              <button
                onClick={() => setShowDeleteAlert(true)}
                className="btn--primary action_button_sec"
              >
                DELETE
              </button>
              <Dropdown className="d-inline ">
                  <Dropdown.Toggle
                    variant="secondary"
                    id="dropdown-basic"
                    className="btn--primary action_button_sec"
                  >
                    ACTIONS
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item className="dropdown-item-sec" onClick={()=>handleNormalizedRating()}>
                    Normalize Rating
                    </Dropdown.Item>
                    
                  <Dropdown.Item className="dropdown-item-sec" disabled={false} onClick={()=>handleIncrement()}>
                    Increment
                    </Dropdown.Item>
                    <Dropdown.Item disabled={true} onClick={()=>handleWeightedIncrement()}>
                      Weighted Increment
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
            </div>
          <div className="col-12 d-flex bebas-thick text--primary" style={{fontSize:'2.5rem'}}>
            Employee Increment Data
          </div>
        </div>
        <Details {...employeeData}/>
        {
          modalShow ? <IncrementDataForm show={modalShow} onHide={()=>setModalShow(false)} IncrementData={employeeData}/> : <div></div>
        }
        {
          showDeleteAlert ? 
          <SweetAlert
          danger
          showCancel
          btnSize="md"
          show={showDeleteAlert}
          onConfirm={() => handleDelete()}
          onCancel={() => setShowDeleteAlert(false)}
          title={
            <span className="text--primary latto-bold">
              Delete {employeeData.full_name}?
            </span>
          }
          customButtons={
            <>
              <button
                onClick={() => setShowDeleteAlert(false)}
                className="btn btn-secondary mx-2 px-4"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete()}
                className="btn btn-danger mx-2 px-4"
              >
                Delete
              </button>
            </>
          }
        >
          <p>Are you sure, you want to delete this increment data?</p>
        </SweetAlert>: <div></div>
        }
      </>
      </Styled>
  )
}

export default IncrementEmployee;