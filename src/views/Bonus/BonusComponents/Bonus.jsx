import React,{useEffect,useState} from 'react'
import { useParams } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import styled from 'styled-components';
import {fetchBonusDetails,deleteBonus,getNormalizedRating,getBonus,getDataByReviewCycle,calculateWeightedBonus} from "./bonusActions";
import Collapsible from "../../../components/content/CollapsiblePanels";
import BonusForm from './BonusForm';
import Details from "./Details";
import toaster, { toast } from  'react-hot-toast'
import ReactSelect from "react-select";
// import HistoricDetails from './HistoricalDetails';
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
    width: "150px",
  }),
  control: (provided) => ({
    ...provided,
    width: "150px",
  }),
};
function Bonus() {
  const [bonusData, setBonusData] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedCycle,setSelectedCycle] = useState("");
  const {id} = useParams();
  const [isLoading,setIsLoading] = useState(true);
  const [isAdmin] = useState(localStorage.getItem('admin'));

  
useEffect(()=>{
  async function componentMount(){
    const data = await fetchBonusDetails(id)
    console.log(data);
    await setBonusData(data[0]);
    // setSelectedCycle({ value: data[0].review_cycle, label: data[0].review_cycle });
    setIsLoading(false);
  }
  componentMount();
}, [])

useEffect(()=>{
  async function getIncrementData(){
    setIsLoading(true);
    try{
      
    const data = await getDataByReviewCycle(bonusData.employee_id, selectedCycle);
    await setBonusData(data[0]);
    setIsLoading(false);

    }catch(err){
      setIsLoading(false);
      toast.error("Review Cycle Bonus data not found", {position:'bottom-center'})

    }
  }
  if(bonusData){
    getIncrementData();
  }

},[selectedCycle])



const handleDelete = async()=>{
  try{
    await deleteBonus(bonusData.id);
    toaster.success("bonus details deleted successfully",{ position: "bottom-center" })
    setTimeout(()=>window.location.href = "/employee_bonuses",2000);
  }catch(error){
    toaster.error("Failed to delete bonus details",{ position: "bottom-center" })
    console.error(error);
  }
}

const handleNormalizedRating = async ()=>{
  try{
    await getNormalizedRating(bonusData.employee_id, bonusData.review_cycle,bonusData.average,bonusData.manager);
    await toaster.success('Normalized rating calculated successfully!',{ position: "bottom-center" });
    setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        window.location.href = "/bonus/" + bonusData.employee_id;
      }, 3000);
      

    }, 1000);    
  }catch(error){
    setIsLoading(false);
    toaster.error('Unable to calculate rating, check the data again',{ position: "bottom-center" })
    console.error(error);
  }
}

const handleBonus = async ()=>{
  try{
    await getBonus(bonusData.employee_id,bonusData.review_cycle,bonusData.normalized_ratings);
    toaster.success('bonus calculated successfully!',{ position: "bottom-center" })
    setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        window.location.href = "/bonus/" + bonusData.employee_id;
      }, 3000);
    }, 1000);

    }catch(error){
      setIsLoading(false);
      toaster.error('Unable to calculate bonus, check the data again',{ position: "bottom-center" })
    console.error(error);
  }
}

const handleWeightedBonus = async ()=>{
  try{
    await calculateWeightedBonus(bonusData.employee_id, bonusData.review_cycle);
    toaster.success('Weighted bonus calculated successfully!',{ position: "bottom-center" })
    setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        window.location.href = "/bonus/" + bonusData.employee_id;
      }, 3000);
    }, 1000);
  }catch(error){
    setIsLoading(false);
    toaster.error('Unable to calculate weighted bonus, check the data again',{ position: "bottom-center" })
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
            Employee Bonus Data
          </div>
          <div className="row justify-content-between align-items-center mb-4 mt-2">
            <div className="col-auto" style={{paddingLeft:20}}>
              <div className="name-sec d-flex align-items-center">
                <div className="employee_name">
                  {bonusData ?bonusData.full_name: ''}
                </div>
                <div className={`employee_status ${bonusData?.employee_status === 'Inactive'? 'disabled_label':''}`}>
                {bonusData ?bonusData.employee_status: ''}
                </div>
              </div>
              <div className="designation_sec">
                {bonusData ? bonusData.title: '' } || {bonusData ? bonusData.department: ''}
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
                options={[{
                  value: 'April-March 2022',
                  label: 'April-March 2022'
                }, {
                  value: 'April-March 2023',
                  label: 'April-March 2023'
                }]}
                value={selectedCycle}
                onChange={handleSelect}
                placeholder="Review Cycle"
              />
<button
                onClick={() => setModalShow(true)}
                className="action_button_sec edit_button_sec"
              >
                EDIT
              </button>
            </div>
            </div>
            </div>
          </div>
        </div>
        <div>
        <Details {...bonusData}/>
        <div className="d-flex align-items-center justify-content-end">
          
          <div className="col-auto" style={{marginRight:15}}>
          <button
                onClick={() => handleWeightedBonus()}
                className="btn custom_actions_bottons action_button_sec"
              >
                Weighted Bonus
              </button>
              <button
                onClick={() => handleBonus()}
                className="btn custom_actions_bottons action_button_sec"
              >
                Bonus
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
        </div>
        {
          modalShow ? <BonusForm show={modalShow} onHide={()=>setModalShow(false)} bonusData={bonusData} showDeleteModal={handleDeleteModal}/> : <div></div>
        }
        
        {/* <Collapsible title="Historic Details">
          <HistoricDetails fullName={bonusData ?bonusData.full_name: ''}/>
        </Collapsible> */}
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
              Delete {bonusData.full_name}?
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

export default Bonus;