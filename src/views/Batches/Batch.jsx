import moment from "moment";
import NP from "nprogress";
import { useState, useEffect } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Dropdown } from 'react-bootstrap';
import { isAdmin } from "../../common/commonFunctions";

import {
  GET_BATCH,
  UPDATE_BATCH,
  GET_BATCH_STUDENTS,
} from "../../graphql";
import { queryBuilder } from "../../apis";
import Details from "./batchComponents/Details";
import Sessions from "./batchComponents/Sessions";
import { TitleWithLogo } from "../../components/content/Avatar";
import Collapsible from "../../components/content/CollapsiblePanels";
import SkeletonLoader from "../../components/content/SkeletonLoader";
import BatchForm from "./batchComponents/BatchForm";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { getBatchProgramEnrollments, deleteBatch, updateBatch, getBatchSessions, getBatchSessionAttendanceStats, getBatchStudentAttendances, batchGenerateCertificates, batchEmailCertificates, batchSendLinks,sendEmailOnCreateBatch } from "./batchActions";
import ProgramEnrollments from "./batchComponents/ProgramEnrollments";
import styled from 'styled-components';
import { FaCheckCircle } from "react-icons/fa";

const Styled = styled.div`
.button{
  padding: 6px 43px !important;
}

@media screen and (max-width: 360px) {
  .section-badge {
    margin-left: 2px;
    padding: 0px 20px !important;
  }
}
`

const Batch = (props) => {
  const [batchProgramEnrollments, setBatchProgramEnrollments] = useState([]);
  const [batch, setBatch] = useState(null);
  const [students, setStudents] = useState([]);
  const batchID = Number(props.match.params.id);
  const [isLoading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [sessions, setSessions] = useState([]);
  const history = useHistory();
  const {setAlert} = props;
  const [programEnrollmentAggregate, setProgramEnrollmentAggregate] = useState([]);
  const [completeCertifyLoading, setCompleteCertifyLoading] = useState(false);
  const [clickedSendLink, setClickedSendLink ] =useState(false);
  const userId = localStorage.getItem("user_id");

  const getThisBatch = async () => {
    try {
      const batchID = props.match.params.id;
      let { data } = await queryBuilder({
        query: GET_BATCH,
        variables: { id: Number(batchID) },
      });
     
      setBatch(data.batch);
    } catch (err) {
   
    }
  };

  const getSessions = async (sortBy = 'created_at', sortOrder = 'desc') => {
    getBatchSessions(batchID, sortBy, sortOrder).then(async data => {
      await getAttendanceStats(data.data.data.sessionsConnection.values);
    }).catch(err => {
     
    });
  };

  const getAttendanceStats = async (sessionsList) => {
    getBatchSessionAttendanceStats(Number(batchID)).then(async data => {
      let groupByBatch = data.data.data.programEnrollmentsConnection.groupBy.batch;
      if (!groupByBatch.length) {
        return;
      }
      const totalStudents = groupByBatch[0].connection.aggregate.studentsEnrolled;

      let attPercentage = data.data.data.attendancesConnection.groupBy.session.map(
        (sess) => ({
          id: sess.sessionId,
          present: sess.connection.aggregate.studentsPresent,
          percent: (sess.connection.aggregate.studentsPresent / totalStudents) * 100,
        })
      );

      sessionsList = sessionsList.map(session => {
        let matchedAttPercentage = attPercentage.find(att => att.id === session.id);
        return {
          ...session,
          present: matchedAttPercentage?.present,
          percent: matchedAttPercentage?.percent,
        };
      })

      await setSessions(sessionsList);
    }).catch(err => {
      
    });
  };

  const getStudents = async (sortBy = 'student.full_name', sortOrder = 'desc') => {
    try {
      const batchID = props.match.params.id;
      let { data } = await queryBuilder({
        query: GET_BATCH_STUDENTS,
        variables: {
          id: Number(batchID),
          sort: `${sortBy}:${sortOrder}`
        },
      });
      let studentsData = data.programEnrollmentsConnection.values;
      getBatchStudentAttendances(batchID).then(data => {
        let sessionCount= data.data.data.sessionsConnection.aggregate.count
        let programEnrollmentAttendances = data.data.data.attendancesConnection.groupBy.program_enrollment;
        let studentsWithAttendance = studentsData.map(student => {
          let studentAttendancePercent = programEnrollmentAttendances.find(programEnrollment => programEnrollment.key === student.id);
          return {
            ...student,
            attendancePercent: studentAttendancePercent ? Math.floor((studentAttendancePercent.connection.aggregate.count/sessionCount) * 100) : 0,
          }
        });
        setStudents(studentsWithAttendance);
      });
    } catch (err) {
    
    }
  };

  const markAsCertified = async () => {
    NP.start();
    updateBatch(batch.id, {
      status: 'Certified'
    }).then(data => {
      console.log(data)
      sendEmailOnCreateBatch('pehli udaan')
      setAlert("Batch updated successfully.", "success");
    }).catch(err => {
      
      setAlert("Unable to update batch.", "error");
    }).finally(async () => {
      NP.done();
      await getThisBatch();
      await getProgramEnrollments();
    });
  }

  const generateCertificates = async () => {
    NP.start();
    batchGenerateCertificates(batch.id, {
      status: 'Complete'
    }).then(data => {
      setAlert("Certificate generation in progress. Please check after some time.", "success");
    }).catch(err => {
      
      setAlert("Unable to update batch.", "error");
    }).finally(async () => {
      NP.done();
      await getThisBatch();
      await getProgramEnrollments();
    });
  }

  const emailCertificates = async () => {
    NP.start();
    batchEmailCertificates(batch.id, {
      status: 'Certified'
    }).then(data => {
      setAlert("Emails sent successfully.", "success");
    }).catch(err => {
     
      setAlert("Unable to update batch.", "error");
    }).finally(async () => {
      NP.done();
      await getThisBatch();
      await getProgramEnrollments();
    });
  }

  const sendLinks = async () => {
    NP.start();
    batchSendLinks(batch.id, {
      status: 'Complete'
    }).then(data => {
      setAlert("Emails sent successfully.", "success");
    }).catch(err => {
      setAlert("Unable to sent mail.", "error");
    }).finally(async () => {
      NP.done();
    });
  }

  const done = () => getThisBatch();

  const hideUpdateModal = async (data) => {
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    let {id, show, logo, created_at, created_by_frontend, updated_by_frontend, updated_at, ...dataToSave} = data;

    if(data.institution === null){
      dataToSave['institution'] = null
    }
    else if (typeof data.institution === 'object') {
      dataToSave['institution'] = Number(data.institution?.id);
    }
    if (typeof data.program === 'object') {
      dataToSave['program'] = Number(data.program?.id);
    }
    if (typeof data.grant === 'object') {
      dataToSave['grant'] = Number(data.grant?.id);
    }
    if (typeof data.assigned_to === 'object') {
      dataToSave['assigned_to'] = Number(data.assigned_to?.id);
    }
    dataToSave['start_date'] = moment(data.start_date).format("YYYY-MM-DD");
    dataToSave['end_date'] = moment(data.end_date).format("YYYY-MM-DD");

    NP.start();
    updateBatch(Number(id), dataToSave).then(data => {
      setAlert("Batch updated successfully.", "success");
     if(dataToSave.status === "Enrollment Complete -- To Be Started" || dataToSave.status ==="Complete"){
      dataToSave.id = Number(id);
      sendEmailOnCreateBatch(dataToSave);
     }
    }).catch(err => {
      
      setAlert("Unable to update batch.", "error");
    }).finally(async () => {
      NP.done();
      getThisBatch();
    });
    setModalShow(false);
  };

  const handleDelete = async () => {
    NP.start();
    deleteBatch(batch.id).then(data => {
      setAlert("Batch deleted successfully.", "success");
    }).catch(err => {
      
      setAlert("Unable to delete batch.", "error");
    }).finally(() => {
      setShowDeleteAlert(false);
      NP.done();
      history.push("/batches");
    });
  };

  useEffect(() => {
    setLoading(true);
    NP.start();
    getThisBatch();
    getProgramEnrollments();
    NP.done();
    setLoading(false);
  }, [batchID]);

  useEffect(() => {
    getSessions();
    getStudents();
  }, [batch]);

  const handleSessionDataUpdate = async () => {
    await getSessions();
    await getStudents();
  }

  const getProgramEnrollments = async () => {
    getBatchProgramEnrollments(batchID).then(data => {
      setBatchProgramEnrollments(data.data.data.programEnrollmentsConnection.values);
      setProgramEnrollmentAggregate(data?.data?.data?.programEnrollmentsConnection?.aggregate);
    }).catch(err => {
     
    });
  }

  if (isLoading) {
    return <SkeletonLoader />;
  } else {
    return (
      <Styled>
        <>
          <div className="row" style={{margin: '30px 0 0'}}>
            <div className="col-12 button_container">
              <button
                onClick={() => setModalShow(true)}
                style={{ marginLeft: "0px" }}
                className="btn--primary action_button_sec"
              >
                EDIT
              </button>
              <button
                onClick={() => setShowDeleteAlert(true)}
                className="btn--primary action_button_sec"
                disabled={!isAdmin() && (batch?.created_by_frontend?.id !== userId || (batch?.status === "In Progress" || batch?.status === "Complete" || batch?.status === "Certified"))}
              >
                DELETE
              </button>
              {isAdmin() &&
                <Dropdown className="d-inline">
                  <Dropdown.Toggle
                    variant="secondary"
                    id="dropdown-basic"
                    className="btn--primary action_button_sec"
                    disabled={batch?.status == "Enrollment Ongoing"}
                  >
                    ACTIONS
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {batch?.status === "Complete" &&
                    <Dropdown.Item
                    onClick={() => {
                      sendLinks();
                      setClickedSendLink(true);
                    }}
                    className="d-flex align-items-center"
                  >
                      <FaCheckCircle size="20" color={clickedSendLink === false && batch?.link_sent_at === null ? '#E0E0E8' :'#207B69' }className="mr-2" />
                      <span>&nbsp;&nbsp;Send a link</span>
                    </Dropdown.Item>
                    }
                    <Dropdown.Item
                      onClick={() => markAsCertified()}
                      className="d-flex align-items-center"
                    >
                      <FaCheckCircle size="20" color={batch?.status === 'Certified' ? '#207B69' : '#E0E0E8'} className="mr-2" />
                      <span>&nbsp;&nbsp;Mark as Certified</span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => generateCertificates()}
                      disabled={batch?.status !== "Certified"}
                    >
                      <FaCheckCircle
                        size="20"
                        color={batch?.status === 'Certified' && batch?.certificates_generated_at ? '#207B69' : '#E0E0E8'}
                        className="mr-2"
                      />
                      <span>&nbsp;&nbsp;Generate Certificates</span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => emailCertificates()}
                      disabled={batch?.status !== "Certified" || batch?.certificates_generated_at === null}
                    >
                      <FaCheckCircle
                        size="20"
                        color={batch?.status === 'Certified' && batch?.certificates_emailed_at > batch?.certificates_generated_at ? '#207B69' : '#E0E0E8'}
                        className="mr-2"
                      />
                      <span>&nbsp;&nbsp;Email Certificates</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              }
            </div>
            {batch && (
              <Collapsible
                titleContent={
                  <TitleWithLogo
                    done={done}
                    id={batch.id}
                    logo={batch.logo}
                    title={batch.name}
                    query={UPDATE_BATCH}
                    icon="batch"
                  />
                }
                opened={true}
              >
                <Details batch={batch} sessions={sessions} />
              </Collapsible>
            )}
            <Collapsible
              title="Program Enrollments"
              badge={programEnrollmentAggregate.count}
            >
              <ProgramEnrollments
                programEnrollments={batchProgramEnrollments}
                students={students}
                onDataUpdate={getProgramEnrollments}
                batch={batch}
                fetchData={getStudents}
                id={batchID}
              />
            </Collapsible>
            <Collapsible
              title="Sessions & Attendance"
              badge={sessions.length.toString()}
            >
              <Sessions
                sessions={sessions}
                batchID={props.match.params.id}
                batch={batch}
                onDataUpdate={handleSessionDataUpdate}
                fetchData={getSessions}
              />
            </Collapsible>
            {batch && (
              <BatchForm {...batch} show={modalShow} onHide={hideUpdateModal} />
            )}
            {batch && (
              <SweetAlert
                danger
                showCancel
                btnSize="md"
                show={showDeleteAlert}
                onConfirm={() => handleDelete()}
                onCancel={() => setShowDeleteAlert(false)}
                title={
                  <span className="text--primary latto-bold">
                    Delete {batch.name}?
                  </span>
                }
                customButtons={
                  <>
                    <button
                      onClick={() => setShowDeleteAlert(false)}
                      className="btn btn-secondary mx-2 px-4"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete()}
                      className="btn btn-danger mx-2 px-4"
                    >
                      Delete
                    </button>
                  </>
                }
              >
                <p>Are you sure, you want to delete this batch?</p>
              </SweetAlert>
            )}
          </div>
        </>
      </Styled>
    );
  }
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Batch);