import nProgress from "nprogress";
import api from "../../../apis";
import moment from "moment";
import Avatar from "../../../components/content/Avatar";
import { useHistory } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import TabPicker from "../../../components/content/TabPicker";
import Table from '../../../components/content/Table';
import WidgetUtilTab from "../../../components/content/WidgetUtilTab";
import { GET_OPPORTUNITIES } from "../../../graphql/dashboard";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { connect } from "react-redux";
import Collapse from "../../../components/content/CollapsiblePanels";
import { getOpportunitiesPickList } from "../../Opportunities/OpportunityComponents/opportunityAction";
import { FaBlackTie, FaBriefcase } from "react-icons/fa";
import { Badge } from "../../../components/content/Utils";

const tabPickerOptions = [
  { title: "My Data", key: "test-1" },
  { title: "My Area", key: "test-2" },
  { title: "My State", key: "test-3" },
  { title: "All Medha", key: "test-4" },
];

const Opportunities = (props) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [pickList, setPickList] = useState([]);
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
  const [opportunitiesAggregate, setOpportunitiesAggregate] = useState([]);
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [opportunitiesTableData, setOpportunitiesTableData] = useState([]);
  const userId  = parseInt(localStorage.getItem('user_id'))

  const OpportunityIcon = ({opportunity, name}) => {
    let bgColor = '#ffffff';
    let icon = null;

    switch (opportunity.type) {
      case 'Job':
        icon = <FaBriefcase size="20" color="#808080"/>;
        break;

      case 'Internship':
        icon = <FaBlackTie size="20" color="#808080"/>;
        break;
    }
    if (icon) {
      return (
      <div className="d-flex align-items-center justify-content-start h-100">
        <div className="flex-row-centered avatar avatar-default " style ={{ width: '35px', height: '35px'}} >
          {icon}
        </div>
        <p className="mb-0 latto-regular" style={{ color: '#787B96'}}>{name}</p>
      </div>)
    }
    return <></>;
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Role/Designation',
        accessor: 'avatar',
        disableSortBy: true,
      },
      {
        Header: 'Employer',
        accessor: 'employer',
        disableSortBy: true,
      },
      {
        Header: 'Type',
        accessor: 'opportunity_type',
        disableSortBy: true,
      },
      {
        Header: 'Status',
        accessor: 'status',
        disableSortBy: true,
      },
      {
        Header: 'Openings',
        accessor: 'number_of_opportunities',
        disableSortBy: true,
      },
      {
        Header: 'Assigned To',
        accessor: 'assigned_to',
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
    getOpportunitiesPickList().then(data => {
      setPickList(data);
    });
  }, [])

  const getOpportunities = async (limit = paginationPageSize, offset = 0, sortBy = 'type', sortOrder = 'desc') => {
    nProgress.start();
    setLoading(true);
    await api.post("/graphql", {
      query: GET_OPPORTUNITIES,
      variables: {
        id: userId,
        limit: limit,
        start: offset,
        sort: `${sortBy}:${sortOrder}`,
      },
    })
    .then(data => {
      setOpportunities(data?.data?.data?.opportunitiesConnection.values);
      setOpportunitiesAggregate(data?.data?.data?.opportunitiesConnection?.aggregate);
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
      getOpportunities(pageSize, pageSize * pageIndex, sortByField, sortOrder);
    } else {
      getOpportunities(pageSize, pageSize * pageIndex);
    }
  }, []);

  useEffect(() => {
    let data = opportunities;
    data = data.map((opportunitydata, index) => {
      return {
      ...opportunitydata,
      avatar:  <OpportunityIcon opportunity={opportunitydata} name={opportunitydata.role_or_designation}> {opportunitydata.role_or_designation} </OpportunityIcon>,
       role_or_designation: opportunitydata.role_or_designation,
       status: <Badge value={opportunitydata.status} pickList={pickList.status} />,
       opportunity_type: <Badge value={opportunitydata.type} pickList={pickList.type} />,
       number_of_opportunities: opportunitydata.number_of_opportunities,
       address: opportunitydata.employer ? opportunitydata.employer.address : '',
       employer: opportunitydata.employer ? opportunitydata.employer.name : '',
       assigned_to: opportunitydata.assigned_to ? opportunitydata.assigned_to.username : '',
       created_at: moment(opportunitydata.created_at).format("DD MMM YYYY"),
       href: `/opportunity/${opportunitydata.id}`,
      }
    });
    setOpportunitiesTableData(data);
  }, [opportunities, pickList]);

  return (
    <Collapse title="NEW OPPORTUNITIES" type="plain" opened={true}>
      <div className="row m-3">
        <div className="d-flex justify-content-between align-items-center mb-2 px-0">
          {/* <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} /> */}
          <div className="d-flex justify-content-center align-items-center">
            {/* <WidgetUtilTab /> */}
          </div>
        </div>
        <Table columns={columns} data={opportunitiesTableData} totalRecords={opportunitiesAggregate.count} fetchData={fetchData} showPagination={false} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize}/>
      </div>
    </Collapse>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
    setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Opportunities);
