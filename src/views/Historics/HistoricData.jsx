
import { useState, useEffect } from "react";
import { useHistory ,useParams} from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import Details from "./HistoricComponents/Details";
import SkeletonLoader from "../../components/content/SkeletonLoader";
import {getHistoric,getReportee,deleteHistoric} from "./HistoricComponents/HistoricActions";
import styled from 'styled-components';
import HistoricForm from "./HistoricComponents/HistoricForm";
import Collapsible from "src/components/content/CollapsiblePanels";
import ReporteeDetails from "./HistoricComponents/ReporteeDetails";

const Styled = styled.div`

@media screen and (max-width: 360px) {
  .section-badge {
    margin-left: 2px;
    padding: 0px 20px !important;
  }
}
`

const HistoricData = (props) => {
const {id} = useParams();

  const [isLoading, setLoading] = useState(false);
  const [historic,setHistoric] = useState({});
  
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isAdmin] = useState(localStorage.getItem('admin'));



useEffect(()=>{
    async function getHistoricDetails(id){
        const data = await getHistoric(id);
        // const reportee = await getReportee(id);
        // console.log("reportee",reportee);
        setHistoric(data.data[0]);
    }
    getHistoricDetails(id);  
},[])

const handleDelete = async () => {
  try{
    await deleteHistoric(historic.id);
    window.location.href = "/historical_data";
  }catch(error){
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

if (isLoading) {
    return <SkeletonLoader />;
  } else {
    return (
      <Styled>
      <>
        <div className="row" style={{margin: '30px 0 0'}}>
        <div className="bebas-thick text--primary" style={{fontSize:'2.8rem'}}>
            Historical Data
          </div>
          <div className="d-flex justify-content-end">
            
          {isAdmin == "true" && <button
            onClick={() => setModalShow(true)}
            style={{ marginLeft: "0px" }}
            className="btn--primary action_button_sec"
          >
            EDIT
          </button>}
          </div>
        </div>
        <Details {...historic}/>
        <Collapsible title="Reportee Details">
          <ReporteeDetails managerData={historic}/>
        </Collapsible>
        {
          modalShow ? <HistoricForm 
                        show={modalShow} 
                        onHide={()=>setModalShow(false)} 
                        HistoricalData={historic}
                        showDeleteModal={handleDeleteModal}

                        /> : <div></div>
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
              Delete {historic.employee}?
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
          <p>Are you sure, you want to delete this historical data?</p>
        </SweetAlert>: <div></div>
        }
      </>
      </Styled>
    );
  }
};


export default HistoricData;
