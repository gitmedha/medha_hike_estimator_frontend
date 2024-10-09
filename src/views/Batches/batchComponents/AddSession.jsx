import moment from "moment";
import api from "../../../apis";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { Input, Form } from "../../../utils/Form";
import { MARK_ATTENDANCE } from "../../../graphql";
import { Link, useHistory } from "react-router-dom";
import SessionStudentList from "./SessionStudentList";
import { sessionValidations } from "../../../validations";
import { CREATE_SESSION, GET_BATCH_STUDENTS_ONLY } from "../../../graphql";
import { setAlert } from "../../../store/reducers/Notifications/actions";

const AddSession = (props) => {
  const history = useHistory();
  const [students, setStudents] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const batchID = Number(props.match.params.batchId);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const initialValues = {
    date: "",
    topics: "",
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      let { data } = await api.post("/graphql", {
        query: CREATE_SESSION,
        variables: {
          batchID,
          ...values,
          date: moment(values.date).format("YYYY-MM-DD"),
        },
      });
      await markAttendance(Number(data.data.createSession.session.id));
      props.setAlert("Session added successfully.", "success");
    } catch (err) {
      props.setAlert("Unable to add session.", "error");
    } finally {
      setLoading(false);
      history.goBack();
    }
  };

  const markAttendance = async (sessionID) => {
    await attendanceRecords.forEach(async (student) => {
      await attendanceApiCaller({
        ...student,
        session: sessionID,
      });
    });
    return;
  };

  const attendanceApiCaller = async (params) => {
    try {
      await api.post("/graphql", {
        variables: params,
        query: MARK_ATTENDANCE,
      });
    } catch (err) {}
  };

  const getStudents = async () => {
    setLoading(true);
    try {
      let { data } = await api.post("/graphql", {
        query: GET_BATCH_STUDENTS_ONLY,
        variables: {
          id: batchID,
        },
      });
      setStudents(clubStudentRecords(data.data.programEnrollments));
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const clubStudentRecords = (records) => {
    return records.map((rec) => ({
      present: false,
      id: rec.student.id,
      program_enrollment_id: Number(rec.id),
      name: rec.student.full_name,
    }));
  };

  useEffect(() => {
    getStudents();
  }, []);

  return (
    <div className="container py-3">
      <div className="row">
        <div className="col-md-12 px-4 mb-3">
          <h3 className="latto-bold text--primary">
            Add New Session and Attendance
          </h3>
        </div>
      </div>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={sessionValidations}
      >
        <div className="row px-2 py-2">
          <div className="col-md-6 col-sm-12 mt-3">
            <Input
              name="date"
              label="Date"
              placeholder="Date"
              control="datepicker"
              className="form-control"
            />
          </div>
          <div className="col-md-6 col-sm-12 mt-3">
            <Input
              name="topics"
              control="input"
              label="Topics Covered"
              className="form-control"
              placeholder="Topics Covered"
            />
          </div>
          <div className="col-12 px-2 pt-3">
            <hr />
          </div>
        </div>
        {!isLoading && (
          <SessionStudentList
            students={students}
            updateAttendance={setAttendanceRecords}
          />
        )}

        <div className="row justify-content-end">
          <div className="col-auto p-0">
            <Link
              to={`/batch/${batchID}`}
              className="btn btn-primary btn-regular"
            >
              Cancel
            </Link>
          </div>
          <div className="col-auto p-0">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-regular"
            >
              SAVE
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => ({});
const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(AddSession);
