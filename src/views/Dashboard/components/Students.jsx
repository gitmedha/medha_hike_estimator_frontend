import nProgress from "nprogress";
import styled from 'styled-components';
import api from "../../../apis";
import {
  TableRowDetailLink,
  Badge,
} from "../../../components/content/Utils";
import { connect } from "react-redux";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { GET_STUDENTS } from "../../../graphql/dashboard";
import Table from '../../../components/content/Table';
import { setAlert } from "../../../store/reducers/Notifications/actions";
import Collapse from "../../../components/content/CollapsiblePanels";
import moment from "moment";
import { getProgramEnrollmentsPickList } from "../../Institutions/InstitutionComponents/instituteActions";

const tabPickerOptions = [
  { title: "My Data", key: "test-1" },
  { title: "My Area", key: "test-2" },
  { title: "My State", key: "test-3" },
  { title: "All Medha", key: "test-4" },
];

const Styled = styled.div`

  .MuiSwitch-root { // material switch
    margin-left: 5px;
    margin-right: 5px;

    .MuiSwitch-switchBase {
      color: #207B69;
    }
    .MuiSwitch-track {
      background-color: #C4C4C4;
      opacity: 1;
    }
  }
`;

const Students = (props) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [programEnrollments, setStudents] = useState([]);
  const [studentsAggregate, setStudentsAggregate] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [pickList, setPickList] = useState([]);
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [paginationPageIndex, setPaginationPageIndex] = useState(0);
  const userId = parseInt(localStorage.getItem('user_id'))

  const columns = useMemo(
    () => [
      {
        Header: 'Student',
        accessor: 'student_name',
        disableSortBy: true,
      },
      {
        Header: 'Program',
        accessor: 'program_name',
        disableSortBy: true,
      },
      {
        Header: 'Program Status',
        accessor: 'program_status',
        disableSortBy: true,
      },
      {
        Header: 'Area',
        accessor: 'area',
        disableSortBy: true,
      },
      {
        Header: 'Institution',
        accessor: 'institution_name',
        disableSortBy: true,
      },
      {
        Header: 'Course Type',
        accessor: 'type',
        disableSortBy: true,
      },
      {
        Header: 'Certification Date',
        accessor: 'certification_date_formatted',
        disableSortBy: true,
      },
    ],
    []
  );

  const getStudents = async (limit = 10) => {
    nProgress.start();
    setLoading(true);
    let variables = {
      limit,
    }
    await api.post("/graphql", {
      query: GET_STUDENTS,
      variables,
    })
    .then(data => {
      setStudents(data?.data?.data?.programEnrollmentsConnection.values);
      setStudentsAggregate(data?.data?.data?.programEnrollmentsConnection?.aggregate);
    })
    .catch(error => {
      return Promise.reject(error);
    })
    .finally(() => {
      setLoading(false);
      nProgress.done();
    });
  };

  const fetchData = useCallback((pageIndex, pageSize, sortBy) => {
    if (sortBy.length) {
      let sortByField = 'full_name';
      let sortOrder = sortBy[0].desc === true ? 'desc' : 'asc';
      switch (sortBy[0].id) {
        case 'status':
        case 'phone':
        case 'city':
        case 'id':
        case 'course_type_latest':
          sortByField = sortBy[0].id;
          break;

        case 'avatar':
        default:
          sortByField = 'full_name';
          break;
      }
      getStudents( pageSize, pageSize * pageIndex, sortByField, sortOrder);
    } else {
      getStudents( pageSize, pageSize * pageIndex);
    }
  }, []);

  useEffect(() => {
    getProgramEnrollmentsPickList().then(data => {
      setPickList(data);
    });
  }, []);

  useEffect(() => {
    if (programEnrollments) {
      let data = programEnrollments;
      data = data.map(programEnrollment => {
        return {
          ...programEnrollment,
          student_name: programEnrollment.student?.full_name,
          area: programEnrollment.student?.medha_area,
          registration_date_formatted: moment(programEnrollment.registration_date).format("DD MMM YYYY"),
          certification_date_formatted: programEnrollment.certification_date ? moment(programEnrollment.certification_date).format("DD MMM YYYY"):'',
          batch_name: programEnrollment?.batch?.name,
          program_name: programEnrollment.batch?.program?.name,
          program_status: <Badge value={programEnrollment.status} pickList={pickList.status} />,
          created_at:moment(programEnrollment.created_at).format("DD MMM YYYY"),
          institution_name: programEnrollment.institution?.name,
          status_badge: <Badge value={programEnrollment.status} pickList={pickList.status} />,
          fee_status_badge: <Badge value={programEnrollment.fee_status} pickList={pickList.fee_status} />,
          assigned : programEnrollment?.institution?.assigned_to.username,
          type: <Badge value={programEnrollment.course_type} pickList={pickList.course_type} />,
          href: `/student/${programEnrollment.student?.id}`,
        }
      });
      setStudentsData(data);
    }
  }, [programEnrollments, pickList]);

  return (
    <Collapse title="Students Awaiting Internships/Employment" type="plain" opened={true}>
      <Styled>
        <div className="row m-1">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2">
            {/* <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} /> */}
            <div className="d-flex justify-content-center align-items-center">
              {/* <WidgetUtilTab /> */}
            </div>
            {/* <Tabs options={studentStatusOptions} onTabChange={handleStudentStatusTabChange} /> */}
          </div>
          <Table columns={columns} data={studentsData} totalRecords={studentsAggregate.count} fetchData={fetchData} loading={loading} showPagination={false} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize} paginationPageIndex={paginationPageIndex} onPageIndexChange={setPaginationPageIndex} />
        </div>
      </Styled>
    </Collapse>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Students);
