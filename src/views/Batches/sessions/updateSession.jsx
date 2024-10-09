import {
  MARK_ATTENDANCE,
  UPDATE_SESSION_QUERY,
  UPDATE_SESSION_ATTENDANCE,
} from "../../../graphql";
import moment from "moment";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { queryBuilder } from "../../../apis";
import Skeleton from "react-loading-skeleton";
import {
  cellStyle,
  SerialNumberRenderer,
} from "../../../components/content/AgGridUtils";
import { Form, Input } from "../../../utils/Form";
import { Link, useHistory } from "react-router-dom";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import Collapsible from "../../../components/content/CollapsiblePanels";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { getSessions } from "../../../store/reducers/sessionAttendances/actions";

const UpdateSession = (props) => {
  const { session, loading, attendances, getSessions, setAlert } = props;
  const sessionID = props.match.params.sessionID;

  // eslint-disable-next-line
  const [gridApi, setGridApi] = useState(null);
  // eslint-disable-next-line
  const [gridColumnApi, setGridColumnApi] = useState([]);

  const [isUpdating, setUpdating] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);
  const [gridIntialized, setInitialized] = useState(false);

  // Original Copy of attendance List

  // Update Flag

  const history = useHistory();

  useEffect(() => {
    if (!session && !attendances.length) {
      getSessions(sessionID);
    }
    // eslint-disable-next-line
  }, []);

  const onGridReady = async (params) => {
    let list = [];
    params.api.forEachNode((node) => {
      node.setSelected(node.data.present);
      list.push({
        ...node.data,
        updated: false,
      });
    });

    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    setAttendanceList(JSON.parse(JSON.stringify(list)));
    setInitialized(true);
  };

  const onRowSelect = async ({ node, data }) => {
    if (!gridIntialized) {
      return;
    }

    setAttendanceList(
      attendanceList.map((att) => {
        if (att.program_enrollment.id === data.program_enrollment.id) {
          return {
            ...data,
            updated: !att.updated,
            present: node.selected,
          };
        }
        return att;
      })
    );
  };

  const onSubmit = async (values) => {
    setUpdating(true);
    try {
      const prevSessionVal = {
        topics_covered: session.topics_covered,
        date: session.date,
      };

      let queryVars = {
        id: Number(values.id),
        data: {
          topics_covered: values.topics_covered,
          date: moment(values.date).format("YYYY-MM-DD"),
        },
      };

      // Check if the session details data is updated
      if (JSON.stringify(prevSessionVal) !== JSON.stringify(queryVars.data)) {
        await queryBuilder({
          variables: queryVars,
          query: UPDATE_SESSION_QUERY,
        });
      }

      // Update or Create new Attencande Records
      await attendanceUpdated();
      setAlert("Session updated successfully.", "success");
    } catch (err) {
      setAlert("Unable to update the session.", "error");
    } finally {
      setUpdating(false);
      history.goBack();
    }
  };

  const attendanceUpdated = async () => {
    let updatedRec = JSON.parse(
      JSON.stringify(attendanceList.filter((att) => att.updated))
    );

    await updatedRec.forEach(async (att) => {
      let variables = att.id
        ? // Payload for the session records which needs to be updated only
          {
            id: att.id,
            data: {
              present: att.present,
            },
          }
        : // Payload for New Session Records which were initially not present
          {
            session: sessionID,
            present: att.present,
            program_enrollment_id: att.program_enrollment.id,
          };

      if (variables.id) {
        delete variables["updated"];
        delete variables["program_enrollment"];
      }

      await queryBuilder({
        variables,
        query: att.id ? UPDATE_SESSION_ATTENDANCE : MARK_ATTENDANCE,
      });
    });
    return;
  };

  return (
    <Collapsible title="Update Session" type="plain" opened={true}>
      {loading && (
        <div className="px-2 pt-2">
          <Skeleton height={65} count={5} />
        </div>
      )}
      {!loading && session ? (
        <div className="container">
          <Form
            onSubmit={onSubmit}
            initialValues={{
              ...session,
              date: new Date(session.date),
            }}
          >
            <div className="row my-3">
              <div className="col-md-6 col-sm-12">
                <Input
                  name="date"
                  label="Date"
                  control="datepicker"
                  className="form-control"
                />
              </div>
              <div className="col-md-6 col-sm-12">
                <Input
                  control="input"
                  name="topics_covered"
                  label="Topics Covered"
                  className="form-control"
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-6 col-sm-12">
                <div
                  className="ag-theme-alpine"
                  style={{ height: "50vh", width: "100%" }}
                >
                  <AgGridReact
                    rowData={attendances}
                    frameworkComponents={{
                      sno: SerialNumberRenderer,
                    }}
                    onGridReady={onGridReady}
                    rowSelection={"multiple"}
                    onRowSelected={onRowSelect}
                    rowMultiSelectWithClick={true}
                  >
                    <AgGridColumn
                      sortable
                      field="id"
                      width={100}
                      cellRenderer="sno"
                      headerName="S. No."
                      cellStyle={cellStyle}
                    />
                    <AgGridColumn
                      sortable
                      headerName="Name"
                      cellStyle={cellStyle}
                      valueGetter={nameGetter}
                      field="program_enrollment"
                    />
                    <AgGridColumn
                      width={140}
                      cellStyle={cellStyle}
                      checkboxSelection={true}
                      headerName="Mark Attendance"
                    />
                  </AgGridReact>
                </div>
              </div>
            </div>
            <div className="col-12 mt-3 d-flex">
              <button
                type="submit"
                disabled={isUpdating}
                className="btn btn-primary btn-regular"
              >
                SAVE
              </button>
              <div style={{ width: "10px" }} />
              <Link
                type="button"
                to={`/session/${sessionID}`}
                className="btn btn-primary btn-regular"
              >
                Cancel
              </Link>
            </div>
          </Form>
        </div>
      ) : null}
    </Collapsible>
  );
};

const nameGetter = (params) =>
  params.data.program_enrollment.student.full_name;

const mapStateToProps = (state) => ({
  ...state.sessionAttendance,
});

const mapActionsToProps = {
  setAlert,
  getSessions,
};

export default connect(mapStateToProps, mapActionsToProps)(UpdateSession);
