import { useState, useMemo, useEffect,useCallback } from "react";
import Table from "../../../components/content/Table";
import {getHistoricsData} from "./incrementsActions";


const HistoricDetails = (props) => {
  let { fullName} = props;
  const [historicalData, setHistoricalData] =useState([]);

  useEffect(() => {
    getHistoricsData(fullName).then((data)=>{
setHistoricalData(data);
    }).catch((error) => {
        console.log("Error fetching historical data: ", error);
    });
    
  },[]);

const fetchData = useCallback(async (pageIndex,pageSize,sortBy) => {
  try {
   if(sortBy.length){
    let sortField = sortBy[0].id;
    let sortOrder = sortBy[0].desc ? "desc" : "asc";
    const response = await getHistoricsData(fullName,sortField,sortOrder);
    setHistoricalData(response);
  }
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
},[]);
  
  const columns = useMemo(
    () => [
      {
        Header: "Employee",
        accessor: "employee",
      },
      {
        Header: "Reviewer",
        accessor: "reviewer",
      },
      {
        Header: "KRA",
        accessor: "kra_vs_goals",
      },
      {
        Header: "Competency",
        accessor: "competency",
      },
      {
        Header: "Average",
        accessor: "final_score",
      },
      {
        Header: "Start Month",
        accessor: "start_month",
      },
      {
        Header: "Ending Month",
        accessor: "ending_month",
      },
    ],
    []
  );

  return (
    <div className="container-fluid my-3">
      <Table
        columns={columns}
        data={historicalData}
        paginationPageSize={25}
        totalRecords={historicalData.length}
        fetchData={fetchData}
        loading={false}
        showPagination={false}
        // onRowClick={handleRowClick}
      />
    </div>
  );
};



export default HistoricDetails;
