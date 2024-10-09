import nProgress from "nprogress";
import api from "../../../apis";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import Table from '../../../components/content/Table';
import { GET_DASHBOARD_PROGRAM_ENROLLMENTS, } from "../../../graphql/dashboard";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { connect } from "react-redux";
import Collapse from "../../../components/content/CollapsiblePanels";
import { Badge } from "../../../components/content/Utils";
import { getProgramEnrollmentsPickList } from "../../Institutions/InstitutionComponents/instituteActions";

const tabPickerOptions = [
  { title: "My Data", key: "test-1" },
  { title: "My Area", key: "test-2" },
  { title: "My State", key: "test-3" },
  { title: "All Medha", key: "test-4" },
];

const ProgramEnrollments = (props) => {
  const [programEnrollments, setProgramEnrollments] = useState([]);
  const [pickList, setPickList] = useState([]);
  const [programEnrollmentAggregate, setProgramEnrollmentAggregate] = useState([]);
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [programEnrollmentTableData, setProgramEnrollmentTableData] = useState([]);
  const userId  = parseInt(localStorage.getItem('user_id'))

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
        Header: 'Batch',
        accessor: 'batch_name',
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
        Header: 'Fee Status',
        accessor: 'fee_status_badge',
        disableSortBy: true,
      },
      {
        Header: 'Created At',
        accessor: 'created_at',
        disableSortBy: true,
      },
    ],
    []
  );

  useEffect(() => {
    getProgramEnrollmentsPickList().then(data => {
      setPickList(data);
    });
  }, []);

  const getProgramEnrollment = async (limit=10) => {
    nProgress.start();
    await api.post("/graphql", {
      query: GET_DASHBOARD_PROGRAM_ENROLLMENTS,
      variables: {
        id:  Number(userId),
        limit:limit
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
      let sortByField = 'role';
      let sortOrder = sortBy[0].desc === true ? 'desc' : 'asc';
      switch (sortBy[0].id) {
        case 'employer':
        case 'type':
          sortByField = sortBy[0].id;
          break;

        case 'created_at':
        case 'address':
        case 'number_of_opportunities':
          sortByField = 'number_of_opportunities'
          break;

        case 'avatar':
        default:
          sortByField = 'role_or_designation';
          break;
      }
      getProgramEnrollment(pageSize, pageSize * pageIndex, sortByField, sortOrder);
    } else {
      getProgramEnrollment(pageSize, pageSize * pageIndex);
    }
  }, []);

  useEffect(() => {
    if (programEnrollments) {
      let data = programEnrollments;
      data = data.map(programEnrollment => {
        return {
          ...programEnrollment,
          student_name: programEnrollment.student?.full_name,
          area:programEnrollment.institution.medha_area,
          registration_date_formatted: moment(programEnrollment.registration_date).format("DD MMM YYYY"),
          certification_date_formatted: programEnrollment.certification_date ? moment(programEnrollment.certification_date).format("DD MMM YYYY"):'',
          batch_name: programEnrollment?.batch?.name,
          program_name: programEnrollment.batch?.program?.name,
          created_at:moment(programEnrollment.created_at).format("DD MMM YYYY"),
          institution_name: programEnrollment.institution.name,
          status_badge: <Badge value={programEnrollment.status} pickList={pickList.status} />,
          fee_status_badge: <Badge value={programEnrollment.fee_status} pickList={pickList.fee_status} />,
          assigned : programEnrollment?.institution?.assigned_to.username,
          href: `/student/${programEnrollment.student?.id}`
        }
      });
      setProgramEnrollmentTableData(data);
    }
  }, [programEnrollments, pickList]);

  return (
    <Collapse title="New Program Enrollments" type="plain" opened={true}>
      <div className="row m-3">
        <div className="d-flex justify-content-between align-items-center mb-2 px-0">
          {/* <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} /> */}
          <div className="d-flex justify-content-center align-items-center">
            {/* <WidgetUtilTab /> */}
          </div>
        </div>
        <Table columns={columns} data={programEnrollmentTableData} totalRecords={programEnrollmentAggregate.count} fetchData={fetchData} showPagination={false} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize}/>
      </div>
    </Collapse>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
    setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(ProgramEnrollments );
