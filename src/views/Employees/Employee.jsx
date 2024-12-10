
import { useState, useEffect } from "react";
import { useHistory ,useParams} from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";

import Details from "./EmployeeComponents/Details";
import SkeletonLoader from "../../components/content/SkeletonLoader";
import Collapsible from "../../components/content/CollapsiblePanels";
import {getEmployee,deleteEmployee} from "./EmployeeComponents/EmployeeActions";
import HistoricDetails from "./EmployeeComponents/HistoricDetails";
import EmployeeForm from "./EmployeeComponents/EmployeeForm";
import styled from 'styled-components';
import toaster from 'react-hot-toast'

const Styled = styled.div`

@media screen and (max-width: 360px) {
  .section-badge {
    margin-left: 2px;
    padding: 0px 20px !important;
  }
}
`

const Employee = (props) => {
const {id} = useParams();

  const [isLoading, setLoading] = useState(false);
  const [employee,setEmployee] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);


useEffect(()=>{
    async function getEmployeeDetails(id){
        const data = await getEmployee(id);
        setEmployee(data.data[0]);
    }
    getEmployeeDetails(id);  
},[])

const handleDelete = async ()=>{
  try{
    await deleteEmployee(employee.id);
    toaster.success('Employee deleted successfully!', { position: "bottom-center" });
    setTimeout(()=>{
      window.location.href = "/employees_details";
    },1000)
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
        <div className="row " style={{margin: '30px 0 0', marginBottom:25}}>
          <div className="col-12 d-flex bebas-thick text--primary" style={{fontSize:'2.8rem'}}>
            Employee Details
          </div>
          <div className="row justify-content-between align-items-baseline">
            <div className="col-auto" style={{paddingLeft:20}}>
              <div className="name-sec d-flex align-items-center">
                <div className="employee_name">
                  {employee ?employee.first_name: ''}
                </div>
                <div className="employee_status">
                {employee ?employee.employee_status: ''}
                </div>
              </div>
              <div className="designation_sec">
                {employee ? employee.title: '' } || {employee ? employee.department: ''}
              </div>
            </div>
            <div className="col-auto">
            <button
                onClick={() => setModalShow(true)}
                style={{ marginLeft: "0px" }}
                className="btn--primary action_button_sec"
              >
                EDIT
              </button>
            </div>
          </div>
        </div>
        <Details {...employee}/>
        <Collapsible title="Historic Details">
          <HistoricDetails firstName={employee.first_name} lastName = {employee.last_name}/>
        </Collapsible>
        {
          modalShow ? <EmployeeForm show={modalShow} onHide={()=>setModalShow(false)} employeeData={employee} triggerToast={toaster}                         showDeleteModal={handleDeleteModal}
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
              Delete {employee.first_name +" " + employee.last_name}?
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
          <p>Are you sure, you want to delete this employee?</p>
        </SweetAlert>: <div></div>
        }
      </>
      </Styled>
    );
  }
};


export default Employee;
