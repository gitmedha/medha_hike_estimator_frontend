import { map } from "lodash";
import { useState } from "react";
import {
  cellStyle,
  SerialNumberRenderer,
} from "../../../components/content/AgGridUtils";
import { AgGridColumn, AgGridReact } from "ag-grid-react";

const SessionStudentList = ({ students, updateAttendance }) => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState([]);

  const getRowData = async ({
    data: { program_enrollment_id },
    node: { selected },
  }) => {
    const updatedAttendance = map(students, (student) => {
      if (student.program_enrollment_id === program_enrollment_id) {
        student.present = selected;
      }

      return {
        present: student.present,
        program_enrollment_id: student.program_enrollment_id,
      };
    });

    updateAttendance(updatedAttendance);
  };

  const onGridReady = async (params) => {
    params.api.selectAll();
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  return (
    <div className="row">
      <div className="col-md-6 col-sm-12">
        <div
          className="ag-theme-alpine"
          style={{ height: "50vh", width: "100%" }}
        >
          <AgGridReact
            rowData={students}
            frameworkComponents={{
              sno: SerialNumberRenderer,
            }}
            onGridReady={onGridReady}
            rowSelection={"multiple"}
            onRowSelected={getRowData}
            rowMultiSelectWithClick={true}
          >
            <AgGridColumn
              sortable
              field="name"
              cellRenderer="sno"
              headerName="S. No."
              cellStyle={cellStyle}
            />
            <AgGridColumn
              sortable
              field="name"
              headerName="Name"
              cellStyle={cellStyle}
            />
            <AgGridColumn
              cellStyle={cellStyle}
              checkboxSelection={true}
              headerName="Mark Attendance"
            />
          </AgGridReact>
        </div>
      </div>
    </div>
  );
};

export default SessionStudentList;
