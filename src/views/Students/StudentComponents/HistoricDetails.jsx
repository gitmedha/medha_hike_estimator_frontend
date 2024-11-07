import { useState, useMemo, useEffect } from "react";
import Table from "../../../components/content/Table";
import {getEmployeeHistoricsData} from "./EmployeeActions";


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
        fetchData={() => {}}
        loading={false}
        showPagination={false}
        // onRowClick={handleRowClick}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({});


export default HistoricDetails;
