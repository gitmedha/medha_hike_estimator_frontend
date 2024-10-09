import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import { Anchor} from "../../../components/content/Utils";
import api from "../../../apis";

import { Input } from "../../../utils/Form";
import { sessionValidations } from "../../../validations";
import { GET_BATCH_STUDENTS_ONLY } from "../../../graphql";
import TableWithSelection from '../../../components/content/TableWithSelection';
import { getSessionAttendance } from "../batchActions";
import SweetAlert from "react-bootstrap-sweetalert";

const Section = styled.div`
  padding-top: 30px;
  padding-bottom: 30px;

  &:not(:first-child) {
    border-top: 1px solid #C4C4C4;
  }

  .section-header {
    color: #207B69;
    font-family: 'Latto-Regular';
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 15px;
  }
`;

const BatchSessionForm = (props) => {
  let { onHide, show, batch, onDelete } = props;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [sessionAttendance, setSessionAttendance] = useState([]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  let initialValues = {
    topics: '',
    date: '',
  };
  if (props.session) {
    initialValues['topics'] = props.session.topics_covered;
    initialValues['date'] = new Date(props.session.date);
  }

  const onSubmit = async (values) => {
    let selectedStudentIds = selectedStudents.map(student => student.id);
    await onHide({
      ...values,
      sessionAttendance,
      students: students.map(student => {
        return {
          ...student,
          present: selectedStudentIds.includes(student.id),
        };
      }),
    });
  };

  const getStudents = async () => {
    setLoading(true);
    try {
      let { data } = await api.post("/graphql", {
        query: GET_BATCH_STUDENTS_ONLY,
        variables: {
          id: batch.id,
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
      name: <Anchor text={rec.student?.full_name} href={`/student/${rec.student?.id}`} />,
      phone: rec.student.phone,
      student_id: rec.student.student_id,
      parent_name: rec.student.name_of_parent_or_guardian

    }));
  };

  useEffect(() => {
    getStudents();
  }, []);

  useEffect(() => {
    // setting the rows that needs to be checked if an existing session is being updated.
    if (props.session && props.session.id) {
      setLoading(true);
      getSessionAttendance(props.session.id).then(async data => {
        setSessionAttendance(data.data.data.attendances); // saving session attendance records
        let selectedStudentProgramEnrollmentIds = data.data.data.attendances.filter(attendance => {
          return attendance.program_enrollment && attendance.present;
        }).map(attendance => {
          return Number(attendance.program_enrollment.id);
        });
        const checkedRows = {};
        students.map((student, index) => {
          if (selectedStudentProgramEnrollmentIds.includes(student.program_enrollment_id)) {
            checkedRows[index] = true;
          }
          return student;
        });
        setSelectedRows(checkedRows);
      }).finally(() => {
        setLoading(false);
      })
    }
  }, [props.session]);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        disableSortBy: true,
      },
      {
        Header: 'Student ID',
        accessor: 'student_id',
        disableSortBy: true,
      },
      {
        Header: 'Phone',
        accessor: 'phone',
        disableSortBy: true,
      },
      {
        Header: 'Parent Name',
        accessor: 'parent_name',
        disableSortBy: true,
      },
    ],
    []
  );

  return (
    <Modal
      centered
      size="lg"
      show={show}
      onHide={onHide}
      animation={false}
      aria-labelledby="contained-modal-title-vcenter"
      className="form-modal"
    >
      <Modal.Header className="bg-white">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-center"
        >
          <h1 className="text--primary bebas-thick mb-0">
            {props.session && props.session.id ? 'Update' : 'Add New'} Session and Attendance
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={sessionValidations}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <Section>
                <div className="row form_sec">
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="date"
                      label="Date & Time"
                      placeholder="Date & Time"
                      required
                      control="datepicker"
                      className="form-control"
                      showtime
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="topics"
                      control="input"
                      label="Topics Covered"
                      required
                      className="form-control"
                      placeholder="Topics Covered"
                    />
                  </div>
                  <div className="col-12 mt-5">
                    {loading ? (
                      <>
                        <Skeleton width="100%" height="50px" />
                        <Skeleton width="100%" height="50px" />
                        <Skeleton width="100%" height="50px" />
                      </>
                    ) : (
                      <TableWithSelection columns={columns} data={students} selectAllHeader="Mark Attendance" selectedRows={selectedRows} setSelectedRows={setSelectedStudents} />
                    )}
                  </div>
                </div>
              </Section>
              <div className="row justify-content-end mt-1">
                {batch.status === 'In Progress' && onDelete && <div className="col-auto p-0">
                  <button 
                    onClick={() => {setShowDeleteAlert(true)}} className='btn btn-danger btn-regular collapse_form_buttons'>
                    DELETE
                  </button>
                </div>}
                <div className="col-auto p-0">
                   <button 
                   onClick={onHide} className='btn btn-secondary btn-regular collapse_form_buttons'>
                    CANCEL                    
                  </button>
                </div>
                <div className="col-auto p-0">
                  <button type='submit' className='btn btn-primary btn-regular collapse_form_buttons'disabled={isSubmitting}>
                    SAVE
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
        <SweetAlert
          danger
          showCancel
          btnSize="md"
          show={showDeleteAlert}
          title={
            <span className="text--primary latto-bold">
              Delete session?
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
                onClick={() => {
                  setShowDeleteAlert(false);
                  onDelete();
                }}
                className="btn btn-danger mx-2 px-4"
              >
                Delete
              </button>
            </>
          }
        >
        <p>Are you sure, you want to delete this session?</p>
      </SweetAlert>
      </Modal.Body>
    </Modal>
  );
};

export default BatchSessionForm;
