import { connect } from "react-redux";
import ReactJson from "react-json-view";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { useEffect, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import {
  getSessions,
  deleteSession,
} from "../../../store/reducers/sessionAttendances/actions";
import Collapsible from "../../../components/content/CollapsiblePanels";

const Sessions = (props) => {
  const { session, loading, attendances, getSessions, deleteSession, match } =
    props;

  const sessionID = match.params.sessionID;
  const history = useHistory();

  const [showAlert, setAlertShow] = useState(false);

  const handleDelete = () => {
    deleteSession();
    setAlertShow(false);
    history.goBack();
  };

  useEffect(() => {
    getSessions(sessionID);
    // eslint-disable-next-line
  }, []);

  return (
    <Collapsible title="Session" type="plain" opened={true}>
      {/* <pre>
        <code>{JSON.stringify(session, null, 2)}</code>
      </pre>
      <pre>
        <code>{JSON.stringify(attendances, null, 2)}</code>
      </pre> */}
      <ReactJson
        name="Session"
        iconStyle="square"
        theme="google"
        src={session}
        collapsed={true}
        indentWidth={2}
      />
      <br />
      <ReactJson
        name="Attendance"
        indentWidth={2}
        iconStyle="square"
        theme="google"
        collapsed={true}
        src={attendances}
      />
      <br />
      <Link
        to={`/update-session/${sessionID}`}
        className="btn btn-primary btn-regular"
      >
        UPDATE
      </Link>
      <button
        className="btn btn-primary btn-regular"
        onClick={() => setAlertShow(true)}
      >
        DELETE SESSION
      </button>
      <SweetAlert
        warning
        showCancel
        btnSize="md"
        show={showAlert}
        onConfirm={() => handleDelete()}
        onCancel={() => setAlertShow(false)}
        title={
          <span className="text--primary latto-bold">Delete this session.</span>
        }
        customButtons={
          <>
            <button
              onClick={() => setAlertShow(false)}
              className="btn--secondary"
            >
              Cancel
            </button>
            <button onClick={() => handleDelete()} className="btn--primary">
              Okay
            </button>
          </>
        }
      >
        <div>
          <p>
            Please note you are going to delete{" "}
            <span className="text--success">1 Session</span> and{" "}
            <span className="text--primary">
              {attendances.length} attendance
            </span>{" "}
            records.
          </p>
        </div>
      </SweetAlert>
    </Collapsible>
  );
};

const mapStateToProps = (state) => ({
  ...state.sessionAttendance,
});

const mapActionsToProps = {
  getSessions,
  deleteSession,
};

export default connect(mapStateToProps, mapActionsToProps)(Sessions);
