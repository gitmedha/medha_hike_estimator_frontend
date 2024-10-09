import nProgress from "nprogress";
import api from "../../apis";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import TabPicker from "../../components/content/TabPicker";
import Table from '../../components/content/Table';
import { GET_OPPORTUNITIES } from "../../graphql";
import { FaBlackTie, FaBriefcase, FaTools } from "react-icons/fa";
import OpportunityForm from "./OpportunityComponents/OpportunityForm";
import { createOpportunity, getOpportunitiesPickList } from "./OpportunityComponents/opportunityAction";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { connect } from "react-redux";
import Collapse from "../../components/content/CollapsiblePanels";
import { Badge } from "../../components/content/Utils";
import OpportunitySearchBar from "./OpportunityComponents/OpportunitySearchBar";

const tabPickerOptions = [
    { title: "My Data", key: "my_data" },
    { title: "My Area", key: "my_area" },
    { title: "My State", key: "my_state" },
    { title: "All Medha", key: "all_medha" },
  ];

  const Opportunities = (props) => {
    const history = useHistory();
    const [opportunities, setOpportunities] = useState([]);
    const [pickList, setPickList] = useState([]);
    const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
    const {setAlert} = props;
    const [opportunitiesAggregate, setOpportunitiesAggregate] = useState([]);
    const pageSize = parseInt(localStorage.getItem('tablePageSize')) || 25;
    const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
    const [opportunitiesTableData, setOpportunitiesTableData] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const userId = parseInt(localStorage.getItem('user_id'))
    const state = localStorage.getItem('user_state');
    const area = localStorage.getItem('user_area')
    const [selectedSearchField, setSelectedSearchField] = useState(null);
    const [isSearchEnable,setIsSearchEnable] = useState(false);
    const [selectedSearchedValue,setSelectedSearchedValue] = useState(null);

    const OpportunityIcon = ({opportunity, name}) => {
      let icon = null;

      switch (opportunity.type) {
        case 'Job':
          icon = <FaBriefcase size="20" color="#808080"/>;
          break;

        case 'Internship':
        case 'UnPaid GIG':
        case 'Paid GIG':
          icon = <FaBlackTie size="20" color="#808080"/>;
          break;

        default:
          icon = <FaTools size="20" color="#808080"/>;
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

  useEffect(() => {
    getOpportunities(activeTab.key);
  }, [activeTab,isSearchEnable,selectedSearchedValue]);
  

  const columns = useMemo(
    () => [
      {
        Header: 'Role/Designation',
        accessor: 'avatar',
      },
      {
        Header: 'Employer',
        accessor: 'employer',
      },
      {
        Header: 'District',
        accessor: 'district',
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
    ],
    []
  );

  useEffect(() => {
    getOpportunitiesPickList().then(data => {
      setPickList(data);
    });
  }, [])


  const getOpportunitiesBySearchFilter = async(selectedTab,limit=paginationPageSize,offset=0,selectedSearchedValue,selectedSearchField,sortBy,sortOrder)=>{
    const opportunityFields = `
    id
    type
    role_or_designation
    number_of_opportunities
    created_at
    updated_at
    status
    department_or_team
    role_description
    skills_required
    compensation_type
    salary
    address
    city
    state
    pin_code
    medha_area
    district
    job_description_file {
      id
      url
      created_at
    }
    created_by_frontend{
      username
      email
    }
    updated_by_frontend{
      username
      email
    }
    assigned_to {
      id
      username
      email
    }
    employer{
      id
      name
      address
      district
      state
      medha_area
      logo{
        url
      }
    }
    `

  let variables = {
    limit,
    start:offset,
    sort: `${sortBy ? sortBy:selectedSearchField}:${sortOrder?sortOrder:"asc"}`
  }

  if (selectedTab === "my_data") {
    if(selectedSearchField === "medha_area"){
      Object.assign(variables, { id: userId,area: selectedSearchedValue.trim()});
    }
    else if (selectedSearchField === "status"){
      Object.assign(variables, { id: userId,status: selectedSearchedValue.trim()});
    }
    else if(selectedSearchField === "assigned_to"){
      Object.assign(variables, { id: userId,username: selectedSearchedValue.trim()});
    }
    else if(selectedSearchField === "type"){
      Object.assign(variables, { id: userId,type: selectedSearchedValue.trim()});
    }
    else if(selectedSearchField === "employer"){
      Object.assign(variables, { id: userId,employer_name: selectedSearchedValue.trim()});
    }
    else if(selectedSearchField === "role_or_designation"){
      Object.assign(variables, {id: userId, role_or_designation: selectedSearchedValue.trim()});
    }
  } else if (selectedTab === "my_state") {
    if(selectedSearchField === "medha_area"){
      Object.assign(variables, { state: state ,area: selectedSearchedValue.trim()});
    }
    else if (selectedSearchField === "status"){
      Object.assign(variables, { state: state ,status: selectedSearchedValue.trim()});
    }
    else if(selectedSearchField === "assigned_to"){
      Object.assign(variables, { state: state ,username: selectedSearchedValue.trim()});
    }
    else if(selectedSearchField === "type"){
      Object.assign(variables, { state: state ,type: selectedSearchedValue.trim()});
    }
    else if(selectedSearchField === "employer"){
      Object.assign(variables, { state: state ,employer_name: selectedSearchedValue.trim()});
    }
    else if(selectedSearchField === "role_or_designation"){
      Object.assign(variables, { state: state ,role_or_designation: selectedSearchedValue.trim()});
    }
  } else if (selectedTab === "my_area") {
    if (selectedSearchField === "status"){
      Object.assign(variables, { area: area, status: selectedSearchedValue.trim()});
    }
    else if(selectedSearchField === "assigned_to"){
      Object.assign(variables, {area: area,  username: selectedSearchedValue.trim()});
    }
    else if(selectedSearchField === "type"){
      Object.assign(variables, { area: area, type: selectedSearchedValue.trim()});
    }
    else if(selectedSearchField === "employer"){
      Object.assign(variables, { area: area, employer_name: selectedSearchedValue.trim()});
    }
    else if(selectedSearchField === "role_or_designation"){
      Object.assign(variables, { area: area, role_or_designation: selectedSearchedValue.trim()});
    }
    else if(selectedSearchField === "medha_area"){
      Object.assign(variables, { area: selectedSearchedValue.trim()});
    }
  }
  else if(selectedSearchField === "medha_area"){
    Object.assign(variables, { area: selectedSearchedValue.trim()});
  }
  else if (selectedSearchField === "status"){
    Object.assign(variables, { status: selectedSearchedValue.trim()});
  }
  else if(selectedSearchField === "assigned_to"){
    Object.assign(variables, { username: selectedSearchedValue.trim()});
  }
  else if(selectedSearchField === "type"){
    Object.assign(variables, { type: selectedSearchedValue.trim()});
  }
  else if(selectedSearchField === "employer"){
    Object.assign(variables, { employer_name: selectedSearchedValue.trim()});
  }
  else if(selectedSearchField === "role_or_designation"){
    Object.assign(variables, { role_or_designation: selectedSearchedValue.trim()});
  }
  

const opportunityQuery = `query GET_OPPORTUNITIES(
  $id: Int,
  $limit: Int,
  $start: Int,
  $sort: String,
  $status: String,
  $state: String,
  $area: String,
  $username: String,
  $employer_name:String,
  $type:String,
  $role_or_designation:String
) {
  opportunitiesConnection(
    sort: $sort
    start: $start
    limit: $limit
    where: {
      assigned_to: {
        id: $id
        username: $username
      }
      medha_area: $area
      state: $state
      status: $status
      type:$type
      employer: {
        name:$employer_name
      }
      role_or_designation:$role_or_designation
    }
  ) {
    values {
      ${opportunityFields}
    }
    aggregate {
      count
    }
  }
}
`
   
  await api
    .post("/graphql", {
      query: opportunityQuery,
      variables,
    })
    .then(data => {
  
      setOpportunities(data?.data?.data?.opportunitiesConnection.values);
      setOpportunitiesAggregate(data?.data?.data?.opportunitiesConnection?.aggregate);
      nProgress.done();
    })
      .catch((error) => {
        nProgress.done();
        return Promise.reject(error);
      })
  }


  const getOpportunities = async (selectedTab, limit = paginationPageSize, offset = 0, sortBy = 'type', sortOrder = 'desc') => {
    nProgress.start();

    if(isSearchEnable){
      await getOpportunitiesBySearchFilter(selectedTab,limit,offset,selectedSearchedValue,selectedSearchField)

    }
    else {
      let variables = {
        limit,
        start: offset,
        sort: `${sortBy}:${sortOrder}`,
      }
      if(selectedTab === "my_data"){
        Object.assign(variables, {id: userId})
      } else if(selectedTab === "my_area"){
        Object.assign(variables, {area: area})
      }else if(selectedTab === "my_state"){
        Object.assign(variables, {state: state})
      }
  
      await api.post("/graphql", {
        query: GET_OPPORTUNITIES,
        variables,
      })
      .then(data => {
        setOpportunities(data?.data?.data?.opportunitiesConnection.values);
        setOpportunitiesAggregate(data?.data?.data?.opportunitiesConnection?.aggregate);
      })
      .catch(error => {
        return Promise.reject(error);
      })
      .finally(() => {
        nProgress.done();
      });

    }
    
  };

  const fetchData = useCallback((pageIndex, pageSize, sortBy,isSearchEnable,selectedSearchedValue,selectedSearchField) => {
    if (sortBy.length) {
      let sortByField = 'role';
      let sortOrder = sortBy[0].desc === true ? 'desc' : 'asc';
      switch (sortBy[0].id) {
        case 'employer':
        case 'type':
        case 'district':
        case 'status':
          sortByField = sortBy[0].id;
          break;

        case 'number_of_opportunities':
          sortByField = 'number_of_opportunities';
          break;

        case 'opportunity_type':
          sortByField = 'type';
          break;

        case 'assigned_to.username':
          sortByField = 'assigned_to.username';
          break;

        case 'avatar':
        default:
          sortByField = 'role_or_designation';
          break;
      }
      if(isSearchEnable){
        getOpportunitiesBySearchFilter(activeTab.key,pageSize,pageSize * pageIndex,selectedSearchedValue,selectedSearchField,sortByField,sortOrder)

      }
      else {
        getOpportunities(activeTab.key, pageSize, pageSize * pageIndex, sortByField, sortOrder);


      }
    } else {
      if(isSearchEnable){
        getOpportunitiesBySearchFilter(activeTab.key,pageSize,pageSize * pageIndex,selectedSearchedValue,selectedSearchField)
      }
      else {
        getOpportunities(activeTab.key, pageSize, pageSize * pageIndex);

      }
    }
  }, [activeTab.key]);

  useEffect(() => {
    let data = opportunities;
    data = data.map((opportunitydata, index) => {
      return {
      ...opportunitydata,
       role_or_designation: opportunitydata.role_or_designation,
       opportunity_type: <Badge value={opportunitydata.type} pickList={pickList.type} />,
       status: <Badge value={opportunitydata.status} pickList={pickList.status} />,
       number_of_opportunities: opportunitydata.number_of_opportunities,
       address: opportunitydata.employer ? opportunitydata.employer.address : '',
       employer: opportunitydata.employer ? opportunitydata.employer.name : '',
       created_at: moment(opportunitydata.created_at).format("DD MMM YYYY"),
       avatar:  <OpportunityIcon opportunity={opportunitydata} name={opportunitydata.role_or_designation}> {opportunitydata.role_or_designation} </OpportunityIcon>,
       href: `/opportunity/${opportunitydata.id}`,
      }
    });
    setOpportunitiesTableData(data);
  }, [opportunities, pickList]);

  const hideCreateModal = async (data) => {
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // need to remove `show` from the payload
    let {show, ...dataToSave} = data;

    nProgress.start();
    createOpportunity(dataToSave).then(data => {
      setAlert("Opportunity created successfully.", "success");
      history.push(`/opportunity/${data.data.data.createOpportunity.opportunity.id}`);
    }).catch(err => {
     
      setAlert("Unable to create opportunity.", "error");
    }).finally(() => {
      nProgress.done();
      getOpportunities();
    });
    setModalShow(false);
  };

  return (
    <Collapse title="OPPORTUNITIES" type="plain" opened={true}>
      <div className="row">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2 navbar_sec">
          <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} />
          <button
              className="btn btn-primary add_button_sec"
              onClick={() => setModalShow(true)}
              style={{marginLeft: '15px'}}
            >
              Add New
            </button>
          
        </div>

        
        <OpportunitySearchBar 
          selectedSearchField={selectedSearchField} 
          setSelectedSearchField={setSelectedSearchField} 
          setIsSearchEnable={setIsSearchEnable}
          setSelectedSearchedValue={setSelectedSearchedValue}
          tab={activeTab.key}
          info={{
            id:userId,
            area:area,
            state:state,
          }}
          isDisable={opportunitiesAggregate.count ? false:true}
        />
        
        <Table 
          columns={columns} 
          data={opportunitiesTableData} 
          totalRecords={opportunitiesAggregate.count} 
          fetchData={fetchData} 
          paginationPageSize={paginationPageSize} 
          onPageSizeChange={setPaginationPageSize}
          isSearchEnable={isSearchEnable}
          selectedSearchField={selectedSearchField}
          selectedSearchedValue={selectedSearchedValue}
          />
        <OpportunityForm
          show={modalShow}
          onHide={hideCreateModal}
        />
      </div>
    </Collapse>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
    setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Opportunities);
