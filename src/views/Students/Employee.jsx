
import { useState, useEffect } from "react";
import { useHistory ,useParams} from "react-router-dom";

import Details from "./StudentComponents/Details";
import SkeletonLoader from "../../components/content/SkeletonLoader";
import Collapsible from "../../components/content/CollapsiblePanels";
import {getEmployee} from "./StudentComponents/EmployeeActions";
import HistoricDetails from "./StudentComponents/HistoricDetails";
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


useEffect(()=>{
    async function getEmployeeDetails(id){
        const data = await getEmployee(id);
        setEmployee(data.data[0]);
    }
    getEmployeeDetails(id);  
},[])


if (isLoading) {
    return <SkeletonLoader />;
  } else {
    return (
      <Styled>
      <>
        <div className="row" style={{margin: '30px 0 0'}}>
          <div className="col-12 d-flex bebas-thick text--primary" style={{fontSize:'2.5rem'}}>
            Employee Details
          </div>
        </div>
        <Details {...employee}/>
        <Collapsible title="Historic Details">
          <HistoricDetails firstName={employee.first_name} lastName = {employee.last_name}/>
        </Collapsible>
      </>
      </Styled>
    );
  }
};


export default Employee;
