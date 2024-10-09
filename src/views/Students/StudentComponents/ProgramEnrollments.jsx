import moment from 'moment';
import { useState, useMemo, useEffect, useCallback } from "react";
import Table from "../../../components/content/Table";
import { FaDownload } from "react-icons/fa";
import CreateProgramEnrollmentForm from "./ProgramEnrollmentForm";
import UpdateProgramEnrollmentForm from "./ProgramEnrollmentForm";
import { createProgramEnrollment, deleteProgramEnrollment, updateProgramEnrollment } from "./StudentActions";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { Badge } from "../../../components/content/Utils";
import { getProgramEnrollmentsPickList } from "../../Institutions/InstitutionComponents/instituteActions";
import ProgramEnrollment from "./ProgramEnrollment";
import SweetAlert from "react-bootstrap-sweetalert";
import { urlPath } from "../../../constants";
import { connect } from "react-redux";
import NP from "nprogress";
import nProgress from "nprogress";
import api from "../../../apis";
import {GET_STUDENT_PROGRAM_ENROLLMENTS } from "../../../graphql";
import { deleteFile } from "../../../common/commonActions";
import { isAdmin, isSRM } from "../../../common/commonFunctions";


const ProgramEnrollments = (props) => {
  let { id, student} = props;
  const [createModalShow, setCreateModalShow] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [viewModalShow, setViewModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [pickList, setPickList] = useState([]);
  const {setAlert} = props;
  const [programEnrollmentAggregate, setProgramEnrollmentAggregate] = useState([]);
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [programEnrollmentTableData, setProgramEnrollmentsTableData] = useState([]);
  const [programEnrollments, setProgramEnrollments] = useState([]);
  const [selectedProgramEnrollment, setSelectedProgramEnrollment] = useState({});

  useEffect(() => {
    getProgramEnrollmentsPickList().then(data => {
      setPickList(data);
    });
  }, []);

  const getStudentProgramEnrollments = async (limit=paginationPageSize, offset=0, sortBy='updated_at', sortOrder = 'asc') => {
    nProgress.start();
    await api.post("/graphql", {
      query: GET_STUDENT_PROGRAM_ENROLLMENTS,
      variables: {
        id:  Number(id),
        limit:limit,
        start: offset,
        sort: `${sortBy}:${sortOrder}`,
      },
    })
    .then(data => {
      setProgramEnrollments(data.data.data.programEnrollmentsConnection.values);
      setProgramEnrollmentAggregate(data?.data?.data?.programEnrollmentsConnection?.aggregate);
    })
    .catch(err => {
     
    })
    .finally(() => {
      nProgress.done();
    });
  };

  const fetchData = useCallback((pageIndex, pageSize, sortBy) => {
    if (sortBy.length) {
      let sortByField = 'certification_date_formatted';
      let sortOrder = sortBy[0].desc === true ? 'desc' : 'asc';
      switch (sortBy[0].id) {
        case 'institution.name':
          sortByField = sortBy[0].id;
          break;

          case ' institution.name':
          sortByField = 'registration_date_formatted';
          break;
        

        default:
          sortByField = 'updated_at';
          break;
      }
      getStudentProgramEnrollments(pageSize, pageSize * pageIndex, sortByField, sortOrder);
    } else {
      getStudentProgramEnrollments(pageSize, pageSize * pageIndex);
    }
  }, []);

  useEffect(() => {
    let data = programEnrollments.map(programEnrollment => {
      return {
        ...programEnrollment,
        registration_date_formatted: programEnrollment.registration_date ? moment(programEnrollment.registration_date).format("DD MMM YYYY"): '',
        certification_date_formatted: programEnrollment.certification_date ? moment(programEnrollment.certification_date).format("DD MMM YYYY"):'',
        updated_at:moment(programEnrollment.updated_at).format("DD MMM YYYY"),
        batch_name: programEnrollment?.batch?.name,
        status_badge: <Badge value={programEnrollment.status} pickList={pickList.status} />,
        fee_status_badge: <Badge value={programEnrollment.fee_status} pickList={pickList.fee_status} />,
        medha_program_certificate_icon: programEnrollment.medha_program_certificate ? <a href={urlPath(programEnrollment.medha_program_certificate.url)} target="_blank" className="c-pointer" rel="noreferrer"><FaDownload size="20" color="#31B89D" /></a> : '',
        program_name: programEnrollment?.batch?.program?.name,
      };
    });
    setProgramEnrollmentsTableData(data);
  }, [programEnrollments, pickList]);

  const columns = useMemo(
    () => [
      {
        Header: 'Program',
        accessor: 'program_name',
      },
      {
        Header: 'Batch',
        accessor: 'batch_name',
      },
      {
        Header: 'Institution',
        accessor: 'institution.name',
      },
      {
        Header: 'Program Status',
        accessor: 'status_badge',
      },
      {
        Header: 'Registration Date',
        accessor: 'registration_date_formatted',
      },
      {
        Header: 'Certification Date',
        accessor: 'certification_date_formatted',
      },
      {
        Header: 'Updated At',
        accessor: 'updated_at',
      },
      {
        Header: '',
        accessor: 'link',
        disableSortBy: true,
      },
    ],
    []
  );

  const handleRowClick = programEnrollment => {
    setSelectedProgramEnrollment(programEnrollment);
    setViewModalShow(true);
  }

  const hideViewModal = () => {
    setViewModalShow(false);
  }

  const handleViewEdit = () => {
    setViewModalShow(false);
    setUpdateModalShow(true);
  }

  const handleViewDelete = () => {
    setViewModalShow(false);
    setShowDeleteAlert(true);
  }

  const hideCreateModal = async (data) => {
    if (!data || data.isTrusted) {
      setCreateModalShow(false);
      return;
    }

    // need to remove some data from the payload that's not accepted by the API
    let {id, program_name, medha_program_certificate, medha_program_certificate_icon, program_enrollment_student, registration_date_formatted, batch_name, institution_name, status_badge, fee_status_badge, ...dataToSave} = data;
    dataToSave['registration_date'] = data.registration_date ? moment(data.registration_date).format("YYYY-MM-DD") : null;
    dataToSave['certification_date'] = data.certification_date ? moment(data.certification_date).format("YYYY-MM-DD") : null;
    dataToSave['fee_payment_date'] = data.fee_payment_date ? moment(data.fee_payment_date).format("YYYY-MM-DD") : null;
    dataToSave['fee_refund_date'] = data.fee_refund_date ? moment(data.fee_refund_date).format("YYYY-MM-DD") : null;
    dataToSave['student'] = student.id;


     NP.start();
     createProgramEnrollment(dataToSave).then(data => {
      setAlert("Program Enrollment created successfully.", "success");
    }).catch(err => {
  
      setAlert("Unable to create program Enrollment.", "error");
    }).finally(() => {
      NP.done();
      getStudentProgramEnrollments();
    });
    setCreateModalShow(false);
  };

  const hideUpdateModal = async (data) => {
    if (!data || data.isTrusted) {
      setUpdateModalShow(false);
      return;
    }

    // need to remove some data from the payload that's not accepted by the API
    let {id, certification_date_formatted, created_at, updated_at, program_name, medha_program_certificate, medha_program_certificate_icon, program_enrollment_student, registration_date_formatted, batch_name, institution_name, status_badge, fee_status_badge, higher_education_proof_of_enrollment, assignment_file, ...dataToSave} = data;
    dataToSave['registration_date'] = data.registration_date ? moment(data.registration_date).format("YYYY-MM-DD") : null;
    dataToSave['certification_date'] = data.certification_date ? moment(data.certification_date).format("YYYY-MM-DD") : null;
    dataToSave['fee_payment_date'] = data.fee_payment_date ? moment(data.fee_payment_date).format("YYYY-MM-DD") : null;
    dataToSave['fee_refund_date'] = data.fee_refund_date ? moment(data.fee_refund_date).format("YYYY-MM-DD") : null;
    dataToSave['course_name_other'] = data.course_name_in_current_sis === 'Other' ? data.course_name_other:null

     NP.start();
    updateProgramEnrollment(Number(id), dataToSave).then(data => {
      setAlert("Program Enrollment updated successfully.", "success");
    }).catch(err => {
  
      setAlert("Unable to update program Enrollment.", "error");
    }).finally(() => {
       NP.done();
       getStudentProgramEnrollments();
    });
    setUpdateModalShow(false);
  };

  const handleDelete = async () => {
    NP.start();
    deleteProgramEnrollment(selectedProgramEnrollment.id).then(data => {
      setAlert("Program Enrollment deleted successfully.", "success");
    }).catch(err => {
      
      setAlert("Unable to delete program enrollment.", "error");
    }).finally(() => {
      setShowDeleteAlert(false);
      getStudentProgramEnrollments();
       NP.done();
    });
  };

  const fileDeleteProofOfEnrollment = async (value) => {
    NP.start();
    deleteFile(selectedProgramEnrollment[value].id).then(data => {
      setAlert("Proof of enrollment deleted successfully.", "success");
    }).catch(err => {
      
      setAlert("Unable to delete proof of enrollment.", "error");
    }).finally(() => {
      NP.done();
      setShowDeleteAlert(false);
      getStudentProgramEnrollments();
      hideViewModal();
    });
  };

  const hideModal = () => {
    hideViewModal();
    getStudentProgramEnrollments();
  }

  return (
    <div className="container-fluid my-3">
      {(isSRM() || isAdmin()) && <div className="row">
        <div className="col-md-6 col-sm-12 mb-4">
          <button
            className="btn btn-primary"
            onClick={() => setCreateModalShow(true)}
          >
            + Add More
          </button>
        </div>
      </div>}
      <Table columns={columns} data={programEnrollmentTableData} onRowClick={handleRowClick} totalRecords={programEnrollmentAggregate.count} fetchData={fetchData} showPagination={programEnrollmentAggregate.count > 10 ? true: false} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize}/>
      <ProgramEnrollment
        show={viewModalShow}
        onHide={hideViewModal}
        handleEdit={handleViewEdit}
        handleDelete={handleViewDelete}
        student={student}
        programEnrollment={selectedProgramEnrollment}
        onDelete={fileDeleteProofOfEnrollment}
        onUpdate={hideModal}
      />
      <CreateProgramEnrollmentForm
        show={createModalShow}
        onHide={hideCreateModal}
        student={student}
        allBatches={programEnrollmentTableData}
      />
      <UpdateProgramEnrollmentForm
        show={updateModalShow}
        onHide={hideUpdateModal}
        student={student}
        programEnrollment={selectedProgramEnrollment}
        allBatches={programEnrollmentTableData}
      />
      <SweetAlert
          danger
          showCancel
          btnSize="md"
          show={showDeleteAlert}
          onConfirm={() => handleDelete()}
          onCancel={() => setShowDeleteAlert(false)}
          title={
            <span className="text--primary latto-bold">Delete Program Enrollment?</span>
          }
          customButtons={
            <>
              <button
                onClick={() => setShowDeleteAlert(false)}
                className="btn btn-secondary mx-2 px-4"
              >
                Cancel
              </button>
              <button onClick={() => handleDelete()} className="btn btn-danger mx-2 px-4">
                Delete
              </button>
            </>
          }
        >
          <p>Batch name: {selectedProgramEnrollment.batch && selectedProgramEnrollment.batch?.name}</p>
          <p>Program name: {selectedProgramEnrollment.batch && selectedProgramEnrollment.batch.program?.name}</p>
        </SweetAlert>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(ProgramEnrollments);
