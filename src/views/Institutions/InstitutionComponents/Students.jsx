import { useCallback, useEffect, useMemo, useState  } from "react";
import Table from "../../../components/content/Table";
import { getProgramEnrollmentsPickList, getInstitutionStudents } from "./instituteActions";
import {
  TableRowDetailLink,
  Badge,
  Anchor,
} from "../../../components/content/Utils";
import Avatar from "../../../components/content/Avatar";
import { useHistory } from "react-router-dom";
import moment from 'moment';
import { Modal } from "react-bootstrap";
import SkeletonLoader from "../../../components/content/SkeletonLoader";
import DetailField from '../../../components/content/DetailField';
import { GET_INSTITUTION_STUDENTS_DETAILS } from "../../../graphql";
import api from "../../../apis";

const Students = ({ id }) => {
  const [programEnrollments, setProgramEnrollments] = useState([]);
  const [institutionStudentsAggregate, setInstitutionStudentsAggregate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pickList, setPickList] = useState([]);
  const [studentsTableData, setStudentsTableData] = useState([]);
  const history = useHistory();
  const paginationPageSize = 10;
  const [showModal, setShowModal] = useState(false);
  const [studentInModal, setStudentInModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  const fetchData = useCallback(({ pageSize, pageIndex, sortBy }) => {
    setLoading(true);
    let sortByField = 'created_at', sortOrder = 'desc'; // default
    if (sortBy && sortBy.length) {
      sortOrder = sortBy[0].desc === true ? 'desc' : 'asc';
      switch (sortBy[0].id) {
        case 'student':
          sortByField = 'student.full_name';
          break;

        case 'status':
        case 'course_type':
          sortByField = sortBy[0].id; // the one that is selected
          break;

        default:
          sortByField = 'created_at';
          break;
      }
    }

    getInstitutionStudents(id, pageSize, pageSize * pageIndex, sortByField, sortOrder).then(data => {
      setProgramEnrollments(data?.data?.data?.programEnrollmentsConnection?.values);
      setInstitutionStudentsAggregate(data?.data?.data?.programEnrollmentsConnection?.aggregate.count);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    getProgramEnrollmentsPickList().then(data => {
      setPickList(data);
    });
  }, []);

  useEffect(() => {
    let data = programEnrollments;
    data = data.map((programEnrollment, index) => {
      return {
        id: programEnrollment.student.id,
        student: programEnrollment.student.full_name,
        area: programEnrollment.student.city,
        status: <Badge value={programEnrollment.status} pickList={pickList.status || []} />,
        year_of_course_completion: programEnrollment.year_of_course_completion,
        link: <TableRowDetailLink value={programEnrollment.student.id} to={'student'} />
      }
    });
    setStudentsTableData(data);
  }, [programEnrollments, pickList]);

  const columns = useMemo(
    () => [
      {
        Header: 'Student',
        accessor: 'student',
      },
      {
        Header: 'Area',
        accessor: 'area',
        disableSortBy: true,
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Year of Course Completion',
        accessor: 'year_of_course_completion',
      },
    ],
    []
  );
  const showStudentDetails = (student) => {
    setStudentInModal(student);
    setShowModal(true);
  }

  return (
    <div className="px-3 py-2">
      <div className="row">
        <div className="container-fluid my-3">
          <Table columns={columns} data={studentsTableData} paginationPageSize={paginationPageSize} totalRecords={institutionStudentsAggregate} onRowClick={showStudentDetails} fetchData={fetchData} loading={loading}  showPagination={false} />
        </div>
      </div>
      {showModal && (
        <StudentModal
          show={showModal}
          onHide={toggleModal}
          student={studentInModal}
        />
      )}
    </div>
  );
};

const StudentModal = (props) => {
  const [details, setDetails] = useState({});
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    getStudentDetails();
  }, []);

  const getStudentDetails = async () => {
    setLoading(true);
    return await api.post("/graphql", {
      query: GET_INSTITUTION_STUDENTS_DETAILS,
      variables: {
        id: props.student.id,
      },
    }).then(data => {
      setDetails(data.data.data.student);
    }).catch(err => {
      Promise.reject(err);
    }).finally(() => {
      setLoading(false);
    })
  };

  return (
    <Modal
      centered
      size="lg"
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header className="bg-light">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="text--primary latto-bold"
        >
        <h1 className="text--primary bebas-thick mb-0">{props.student.student}</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="row">
            <div className="col-md-5 col-sm-12">
              <DetailField label="Name" className="capitalize"value={<Anchor text={details.full_name} href={`/student/${props.student.id}`}  />} /> 
              <DetailField label="Status" value={details.status} />
              <DetailField label="Category" value={details.category} />
              <DetailField label="Gender" value={details.gender} />
            </div>
            <div className="offset-md-1 col-md-5 col-sm-12">
              <DetailField label="Phone Number" value={details.phone} />
              <DetailField label="Date Of Birth" value={moment(details.date_of_birth).format("DD MMM YYYY")} />
              <DetailField label="Email" value={details.email} />
            </div>
          </div>
        )}
        <div className="row mt-3 py-3">
          <div className="d-flex justify-content-end">
            <button
              type="button"
              onClick={props.onHide}
              className="btn btn-secondary btn-regular mr-2"
            >
              CLOSE
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default Students;
