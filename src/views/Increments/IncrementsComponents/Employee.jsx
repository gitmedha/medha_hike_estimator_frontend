import React,{useEffect,useState} from 'react'
import { useParams } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import styled from 'styled-components';
import {fetchIncrement,deleteIncrement,calculateNormalizedRating,calculateIncrement,getIncrementDataByReviewCycle} from "./incrementsActions";
import Collapsible from "../../../components/content/CollapsiblePanels";
import IncrementDataForm from './IncrementDataForm';
import Details from "./Details";
import toaster, { toast } from  'react-hot-toast'
import ReactSelect from "react-select";
import HistoricDetails from './HistoricalDetails';

const Styled = styled.div`

@media screen and (max-width: 360px) {
  .section-badge {
    margin-left: 2px;
    padding: 0px 20px !important;
  }
}
  .custom_actions_bottons{
  padding:5px 30px;
  background-color:#257b69;
  border-radius:10px;
  color:#FFFFFF;
  }
`
const customStyles = {
  container: (provided) => ({
    ...provided,
    width: "200px",
  }),
  control: (provided) => ({
    ...provided,
    width: "200px",
  }),
};
function IncrementEmployee() {
  const [employeeData, setEmployeeData] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedCycle,setSelectedCycle] = useState("");
  const {id} = useParams();

  
useEffect(()=>{
  async function componentMount(){
    const data = await fetchIncrement(id)
    setEmployeeData(data[0]);
  }
  componentMount();
}, [])

useEffect(()=>{
  async function getIncrementData(){
    try{
      
    const data = await getIncrementDataByReviewCycle(employeeData.employee_id, selectedCycle);
    setEmployeeData(data[0]);

    }catch(err){
      toast.error("Increment not found", {position:'bottom-center'})
    }
  }
  if(employeeData){
    getIncrementData();
  }

},[selectedCycle])

console.log(selectedCycle);


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

const handleDeleteModal = ()=>{
  setModalShow(false);
  setShowDeleteAlert(true);
}

const handleDeleteAlertConfirm = ()=>{
  setShowDeleteAlert(false);
  handleDelete();
}
const handleCloseDeleteAlert = ()=>{
  setModalShow(true);
  setShowDeleteAlert(false);
}


const handleSelect = (event) => {
  setSelectedCycle(event.value);
};
  return (
    <Styled>
      <>
        <div className="row" style={{margin: '30px 0 0'}}>
          <div className="col-12 d-flex bebas-thick text--primary" style={{fontSize:'2.5rem'}}>
            Employee Increment Data
          </div>
          <div className="col-12 d-flex justify-content-between button_container my-3">
            <div className="dropdown_sec">
            <div className="text-label">
              Review Cycle
      </div>
        <ReactSelect
        styles={customStyles}
      options={[{
        value: 'April-March 2022',
        label: 'April-March 2022'
      }, {
        value: 'April-March 2023',
        label: 'April-March 2023'
      }]}
      value={selectedCycle}
      onChange={handleSelect}
      placeholder="Select Review Cycle"
    />
            </div>
            
            <div>
              <div>&nbsp;</div>
            <button
                onClick={() => setModalShow(true)}
                className="btn--primary action_button_sec"
              >
                EDIT
              </button>
            </div>
            </div>
        </div>
        <Details {...employeeData}/>
        {
          modalShow ? <IncrementDataForm show={modalShow} onHide={()=>setModalShow(false)} IncrementData={employeeData} showDeleteModal={handleDeleteModal}/> : <div></div>
        }
        <div className="d-flex align-items-center justify-content-end">
          
        <div className="col-auto" style={{marginRight:15}}>
            <button
              onClick={() => handleIncrement()}
              className="btn custom_actions_bottons action_button_sec"
            >
              Increment
            </button>
          </div>
          <div className="col-auto" style={{marginRight:15}}>
            <button
              onClick={() => handleNormalizedRating()}
              className="btn custom_actions_bottons action_button_sec"
            >
              Normalize Rating
            </button>
          </div>
        </div>
        
        <Collapsible title="Historic Details">
          <HistoricDetails fullName={employeeData ?employeeData.full_name: ''}/>
        </Collapsible>
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
                onClick={() => handleCloseDeleteAlert(false)}
                className="btn btn-secondary mx-2 px-4"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAlertConfirm()}
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