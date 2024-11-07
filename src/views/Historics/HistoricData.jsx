
import { useState, useEffect } from "react";
import { useHistory ,useParams} from "react-router-dom";

import Details from "./HistoricComponents/Details";
import SkeletonLoader from "../../components/content/SkeletonLoader";
import {getHistoric} from "./HistoricComponents/HistoricActions";
import styled from 'styled-components';

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


useEffect(()=>{
    async function getHistoricDetails(id){
        const data = await getHistoric(id);
        setHistoric(data.data[0]);
    }
    getHistoricDetails(id);  
},[])


if (isLoading) {
    return <SkeletonLoader />;
  } else {
    return (
      <Styled>
      <>
        <div className="row" style={{margin: '30px 0 0'}}>
          <div className="col-12 d-flex bebas-thick text--primary" style={{fontSize:'2.5rem'}}>
            Historical Data
          </div>
        </div>
        <Details {...historic}/>
      </>
      </Styled>
    );
  }
};


export default HistoricData;
