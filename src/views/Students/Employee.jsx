
import { useState, useEffect } from "react";
import { useHistory ,useParams} from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";

import Details from "./StudentComponents/Details";
import SkeletonLoader from "../../components/content/SkeletonLoader";
import Collapsible from "../../components/content/CollapsiblePanels";
import {getEmployee} from "./StudentComponents/EmployeeActions";
import HistoricDetails from "./StudentComponents/HistoricDetails";
import EmployeeForm from "./StudentComponents/EmployeeForm";
import styled from 'styled-components';

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
  
}


if (isLoading) {
    return <SkeletonLoader />;
  } else {
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
            </div>
          <div className="col-12 d-flex bebas-thick text--primary" style={{fontSize:'2.5rem'}}>
            Employee Details
          </div>
        </div>
        <Details {...employee}/>
        <Collapsible title="Historic Details">
          <HistoricDetails firstName={employee.first_name} lastName = {employee.last_name}/>
        </Collapsible>
        {
          modalShow ? <EmployeeForm show={modalShow} onHide={()=>setModalShow(false)} employeeData={employee}/> : <div></div>
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
          <p>Are you sure, you want to delete this employee?</p>
        </SweetAlert>: <div></div>
        }
      </>
      </Styled>
    );
  }
};


export default Employee;
