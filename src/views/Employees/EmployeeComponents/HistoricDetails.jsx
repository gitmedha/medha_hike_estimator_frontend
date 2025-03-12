import { useState, useMemo, useEffect,useCallback } from "react";
import Table from "../../../components/content/Table";
import {getEmployeeHistoricsData, deleteHistoric} from "./EmployeeActions";


const HistoricDetails = (props) => {
  let { firstName, lastName} = props;
  const [historicalData, setHistoricalData] =useState([]);

  useEffect(() => {
    getEmployeeHistoricsData(firstName,lastName).then((data)=>{
setHistoricalData(data);
    }).catch((error) => {
        console.log("Error fetching historical data: ", error);
    });
    
  },[]);

const fetchData = useCallback((pageSize,paginationPageSize,sortBy)=>{
if(sortBy.length){
  let sortOrder = sortBy[0].desc ? "desc" : "asc";
  let sort = sortBy[0].id;
  getEmployeeHistoricsData(firstName,lastName,sort,sortOrder).then((data)=>{
    setHistoricalData(data);
        }).catch((error) => {
            console.log("Error fetching historical data: ", error);
        });
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
        Header: "KRA VS GOALS",
        accessor: "kra_vs_goals",
      },
      {
        Header: "Competency",
        accessor: "competency",
      },
      {
        Header: "Final Score",
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

const mapStateToProps = (state) => ({});


export default HistoricDetails;
