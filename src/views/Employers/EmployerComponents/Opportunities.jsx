import moment from "moment";
import Avatar from "../../../components/content/Avatar";
import { useState, useEffect, useMemo} from "react";
import Table from '../../../components/content/Table';
import OpportunityForm from "./OpportunityForm";
import { createOpportunity } from "../../Opportunities/OpportunityComponents/opportunityAction";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import  {getOpportunitiesPickList} from "../../Opportunities/OpportunityComponents/opportunityAction";
import { Badge } from "../../../components/content/Utils";
import NP from "nprogress";
import { connect } from "react-redux";


const Opportunities = (props) => {
  let { employer, opportunities, onDataUpdate } = props;
  const {setAlert} = props;
  const [opportunitiesTableData, setOpportunitiesTableData] = useState([]);
  const [createOpportunityModalShow, setCreateOpportunityModalShow] = useState(false);
  const [pickList, setPickList] = useState([]);

  useEffect(() => {
    getOpportunitiesPickList().then(data => {
      setPickList(data);
    });
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: 'Role/Designation',
        accessor: 'avatar',
      },
      {
        Header: 'Type',
        accessor: 'opportunity_type',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Openings',
        accessor: 'number_of_opportunities',
      },
      {
        Header: 'Assigned To',
        accessor: 'assigned_to.username',
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

  useEffect(() => {
    let data = opportunities.map((opportunity, index) => {
      return {
        ...opportunity,
        id: opportunity.id,
        avatar: employer ? <Avatar name={`${opportunity.role_or_designation}`} logo={employer.logo} style={{width: '35px', height: '35px'}} icon="opportunity" /> : <></>,
        role_or_designation: opportunity.role_or_designation,
        opportunity_type: <Badge value={opportunity.type} pickList={pickList.type}/>,
        status:<Badge value={opportunity.status} pickList={pickList.status}/>,
        number_of_opportunities: opportunity.number_of_opportunities,
        address: employer ? employer.address : '',
        employer: employer ? employer.name : '',
        created_at: moment(opportunity.created_at).format("DD MMM YYYY"),
        updated_at: moment(opportunity.updated_at).format("DD MMM YYYY"),
        href: `/opportunity/${opportunity.id}`,
      }
    });
    setOpportunitiesTableData(data);
  }, [opportunities, pickList]);

  const hideCreateOpportunityModal = (data) => {
    if (!data || data.isTrusted) {
      setCreateOpportunityModalShow(false);
      return;
    }

    // need to remove `show` from the payload
    let {show, employer_name, ...dataToSave} = data;
    dataToSave['employer'] = data.employer.id;

    NP.start();
    createOpportunity(dataToSave).then(data => {
      setAlert("Opportunity created successfully.", "success");
    }).catch(err => {
      setAlert("Unable to create opportunity.", "error");
    }).finally(() => {
      NP.done();
      onDataUpdate();
    });
    setCreateOpportunityModalShow(false);
  }

  return (
    <div className="container-fluid my-3">
      <div className="row">
        <div className="col-md-6 col-sm-12 mb-4">
          <button
            className="btn btn-primary"
            onClick={() => setCreateOpportunityModalShow(true)}
          >
            + Add More
          </button>
        </div>
      </div>
      <Table columns={columns} data={opportunitiesTableData} paginationPageSize={opportunitiesTableData.length} totalRecords={opportunitiesTableData.length} fetchData={() => {}} loading={false} showPagination={false} />
      <OpportunityForm
        show={createOpportunityModalShow}
        onHide={hideCreateOpportunityModal}
        employer={employer}
      />
    </div>
  );
};
const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Opportunities);

