import React,{useEffect,useState} from 'react'
import { useParams,useLocation } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import styled from 'styled-components';
import {fetchIncrement,deleteIncrement,calculateNormalizedRating,calculateIncrement,getIncrementDataByReviewCycle,weightedIncrement,getReviewCycles,getHistoricsData} from "./incrementsActions";
import Collapsible from "../../../components/content/CollapsiblePanels";
import IncrementDataForm from './IncrementDataForm';
import Details from "./Details";
import toaster, { toast } from  'react-hot-toast'
import ReactSelect from "react-select";
import HistoricDetails from './HistoricalDetails';
import Spinner from "../../../utils/Spinners/Spinner";

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
    width: "250px",
  }),
  control: (provided) => ({
    ...provided,
    width: "250px",
  }),
};
function IncrementEmployee() {
  const [employeeData, setEmployeeData] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedCycle,setSelectedCycle] = useState("");
  const {id} = useParams();
  const [isLoading,setIsLoading] = useState(true);
  const [isAdmin] = useState(localStorage.getItem('admin'));
  const location = useLocation();
  const [reviewCycles, setReviewCycles] = useState([]);

  const { review_cycle } = location.state || {};

  const [historics,setHistorics] = useState([]);

  
useEffect(()=>{
  async function componentMount(){
    const data = await fetchIncrement(id,review_cycle)
    await setEmployeeData(data[0]);
    await setReviewCycles(await getReviewCycles(id));
    setIsLoading(false);
    return data[0];
  }
  componentMount().then((data)=>{
    getHistoricsData(data.full_name).then((historicsData)=>{
      setHistorics(historicsData);
    }).catch((error)=>{
      console.error("Error fetching historical data: ", error);
    })
  })
  .catch(error=>{
    console.error(error)
  })

}, [])

useEffect(()=>{
  async function getIncrementData(){
    setIsLoading(true);
    try{
      
    const data = await getIncrementDataByReviewCycle(employeeData.employee_id, selectedCycle);
    await setEmployeeData(data[0]);
    setIsLoading(false);

    }catch(err){
      setIsLoading(false);
      toast.error("Review Cycle increment data not found", {position:'bottom-center'})

    }
  }
  if(employeeData){
    getIncrementData();
  }

},[selectedCycle])


const handleDelete = async()=>{
  try{
    await deleteIncrement(employeeData.id);
    toaster.success("Increment details deleted successfully",{ position: "bottom-center" })
    setTimeout(()=>window.location.href = "/employee_increments",2000);
  }catch(error){
    toaster.error("Failed to delete increment details",{ position: "bottom-center" })
    console.error(error);
  }
}

const handleNormalizedRating = async ()=>{
  
  try{
    await calculateNormalizedRating(employeeData.employee_id, employeeData.appraisal_cycle,employeeData.average,employeeData.manager);
    await toaster.success('Normalized rating calculated successfully!',{ position: "bottom-center" });
    setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        window.location.href = "/increment_employee/" + employeeData.employee_id;
      }, 3000);
      

    }, 1000);
    
  }catch(error){
    setIsLoading(false);
    toaster.error('Unable to calculate rating, check the data again',{ position: "bottom-center" })
    console.error(error);
  }
}

const handleIncrement = async ()=>{
  try{
    await calculateIncrement(employeeData.employee_id,employeeData.appraisal_cycle,employeeData.normalize_rating);
    toaster.success('Increment calculated successfully!',{ position: "bottom-center" })
    setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        window.location.href = "/increment_employee/" + employeeData.employee_id;
      }, 3000);
    }, 1000);
    }catch(error){
      setIsLoading(false);
      toaster.error('Unable to calculate increment, check the data again',{ position: "bottom-center" })
    console.error(error);
  }
}

const handleWeightedIncrement = async ()=>{
  try{
    await weightedIncrement(employeeData.employee_id,employeeData.appraisal_cycle);
    toaster.success('Weighted increment calculated successfully!',{ position: "bottom-center" })
    setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        window.location.href = "/increment_employee/" + employeeData.employee_id;
      }, 3000);
    }, 1000);

    }catch(error){
      setIsLoading(false);
      toaster.error('Unable to calculate weighted increment, check the data again',{ position: "bottom-center" })
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
     {isLoading ?<div className="spinner">
      <Spinner/>
     </div>: <>
        <div className="row" style={{margin: '30px 0 0'}}>
          <div className="col-12 d-flex bebas-thick text--primary" style={{fontSize:'2.8rem'}}>
            Employee Increment Data
          </div>
          <div className="row justify-content-between align-items-center mb-4 mt-2">
            <div className="col-auto" style={{paddingLeft:20}}>
              <div className="name-sec d-flex align-items-center">
                <div className="employee_name">
                  {employeeData ?employeeData.full_name: ''}
                </div>
                {/* <div className={`employee_status ${employeeData.employee_status === 'Inactive'? 'disabled_label':''}`} style={{marginTop:7}}>
                {employeeData ?employeeData.employee_status: ''}
                </div> */}
              </div>
              <div className="designation_sec">
                {employeeData ? employeeData.title: '' }
              </div>
            </div>
            <div className="col-4 d-flex justify-content-end">
            <div className="dropdown_sec">
              <div  style={{fontSize:'15px', fontWeight:'bold',color: '#787b96'}}>
                Review Cycle
              </div>
               <div className='d-flex'>
                
              <ReactSelect
                styles={customStyles}
                options={reviewCycles}
                value={
                  reviewCycles
                    ? reviewCycles.find(option =>
                        option.value === (selectedCycle && selectedCycle !== "" ? selectedCycle : review_cycle)
                      )
                    : null
                }   
                onChange={handleSelect}
                placeholder="Review Cycle"
              />
              {isAdmin === "true" && <button
                onClick={() => setModalShow(true)}
                className="action_button_sec edit_button_sec"
              >
                EDIT
              </button>}
            </div>
            </div>
            </div>
          </div>
        </div>
        <div>
        <Details {...employeeData}/>

         {isAdmin === "true" && <div className="d-flex align-items-center justify-content-end">
          <div className="col-auto" style={{marginRight:15}}>
              <button
                onClick={() => handleNormalizedRating()}
                className="btn custom_actions_bottons action_button_sec"
              >
                Normalize Rating
              </button>
            </div>
          
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
                onClick={() => handleWeightedIncrement()}
                className="btn custom_actions_bottons action_button_sec"
                disabled = {employeeData?.increment === null ? true : false}
              >
                Weighted Increment
              </button>
            </div>
          </div>}
          </div>
        {
          modalShow ? <IncrementDataForm show={modalShow} onHide={()=>setModalShow(false)} IncrementData={employeeData} showDeleteModal={handleDeleteModal}/> : <div></div>
        }
        
        <Collapsible title="Historic Details" opened={true}>
         { historics.length ?<HistoricDetails historics={historics} fullName={employeeData.full_name}/> : <div></div>}
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
      </>}
      </Styled>
  )
}

export default IncrementEmployee;