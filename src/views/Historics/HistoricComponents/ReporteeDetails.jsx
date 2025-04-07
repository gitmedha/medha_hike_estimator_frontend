import { useState, useMemo, useEffect } from "react";
import Table from "../../../components/content/Table";
import {getReportee} from "./HistoricActions";
function ReporteeDetails(props) {

    const [reporteeData] = useState(props.managerData);

  const columns = useMemo(
    () => [
      {
        Header: "First Name",
        accessor: "first_name",
      },
      {
        Header: "Last Name",
        accessor: "last_name",
      },
      {
        Header: "Emplpoyee ID",
        accessor: "employee_id",
      },
      {
        Header: "Email ID",
        accessor: "email_id",
      }
    ],
    []
  );
  return (
    <div className="container-fluid my-3">
      <Table
        columns={columns}
        data={reporteeData}
        paginationPageSize={25}
        totalRecords={reporteeData.length}
        fetchData={() => {}}
        loading={false}
        showPagination={false}
        // onRowClick={handleRowClick}
      />
    </div>
  )
}

export default ReporteeDetails