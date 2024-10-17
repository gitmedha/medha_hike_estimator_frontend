import nProgress from "nprogress";
import { useState,useMemo, useCallback, useRef } from "react";
import Table from "../../components/content/Table";
import { useHistory } from "react-router-dom";
import api from "../../apis";

import { setAlert } from "../../store/reducers/Notifications/actions";
import { connect } from "react-redux";
import Collapse from "../../components/content/CollapsiblePanels";

const tabPickerOptions = [
  { title: "My Data", key: "my_data" },
  { title: "My Area", key: "my_area" },
  { title: "My State", key: "my_state" },
  { title: "All Medha", key: "all_medha" },
];

const Employers = (props) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [employersAggregate, setEmployersAggregate] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [pickList, setPickList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [employersTableData, setEmployersTableData] = useState([]);
  const pageSize = parseInt(localStorage.getItem("tablePageSize")) || 25;
  const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
  const { setAlert } = props;
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
  const userId = parseInt(localStorage.getItem("user_id"));
  const state = localStorage.getItem("user_state");
  const area = localStorage.getItem("user_area");
  const [selectedSearchField, setSelectedSearchField] = useState(null);
  const [isSearchEnable, setIsSearchEnable] = useState(false);
  const [selectedSearchedValue, setSelectedSearchedValue] = useState(null);
  const [formErrors, setFormErrors] = useState([]);
  const prevIsSearchEnableRef = useRef(isSearchEnable);


  const columns = useMemo(
    () => [
      {
        Header: "Employee",
        accessor: "employee",
      },
      {
        Header: "Reviewer",
        accessor: "reviewer",
      },
      {
        Header: "KRA VS GOALS",
        accessor: "kra_vs_goals",
      },
      {
        Header: "Competency",
        accessor: "competency",
      },
      {
        Header: "Final Score",
        accessor: "final_score",
      },
      {
        Header: "Start Month",
        accessor: "start_month",
      },
      {
        Header: "Ending Month",
        accessor: "ending_month",
      },
    ],
    []
  );

  const getEmployerBySearchFilter = async (
    selectedTab,
    limit = paginationPageSize,
    offset = 0,
    selectedSearchedValue,
    selectedSearchField,
    sortBy,
    sortOrder
  ) => {
    const employerFields = `
    id
    name
    phone
    status
    website
    email
    type
    industry
    paid_leaves
    employee_benefits
    employment_contract
    offer_letter
    medha_partner
    address
    district
    pin_code
    state
    medha_area
    address
    city
    created_at
    updated_at
    logo {
      id
      url
    }
    assigned_to{
      id
      username
      email
    }
    mou_file {
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
    logo {
      url
    }
    contacts {
      id
      email
      phone
      full_name
      designation
    }
  `;

    let variables = {
      limit,
      start: offset,
      sort: `${sortBy ? sortBy : selectedSearchField}:${
        sortOrder ? sortOrder : "asc"
      }`,
    };

    if (selectedTab === "my_data") {
      if (selectedSearchField === "medha_area") {
        Object.assign(variables, {
          id: userId,
          area: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "state") {
        Object.assign(variables, {
          id: userId,
          state: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "status") {
        Object.assign(variables, {
          id: userId,
          status: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "assigned_to") {
        Object.assign(variables, {
          id: userId,
          username: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "industry") {
        Object.assign(variables, {
          id: userId,
          industry_name: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "name") {
        Object.assign(variables, {
          id: userId,
          name: selectedSearchedValue.trim(),
        });
      }
    } else if (selectedTab === "my_state") {
      if (selectedSearchField === "state") {
        Object.assign(variables, {
          state: selectedSearchedValue.trim(),
        });
      }
      else if (selectedSearchField === "medha_area") {
        Object.assign(variables, {
          state: state,
          area: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "status") {
        Object.assign(variables, {
          state: state,
          status: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "assigned_to") {
        Object.assign(variables, {
          state: state,
          username: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "industry") {
        Object.assign(variables, {
          state: state,
          industry_name: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "name") {
        Object.assign(variables, {
          state: state,
          name: selectedSearchedValue.trim(),
        });
      }
    } else if (selectedTab === "my_area") {
      if (selectedSearchField === "state") {
        Object.assign(variables, {
          area: area,
          state: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "medha_area") {
        Object.assign(variables, {
          area: selectedSearchedValue.trim(),
        });
      }else if (selectedSearchField === "status") {
        Object.assign(variables, {
          area: area,
          status: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "assigned_to") {
        Object.assign(variables, {
          area: area,
          username: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "industry") {
        Object.assign(variables, {
          area: area,
          industry_name: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "name") {
        Object.assign(variables, {
          area: area,
          name: selectedSearchedValue.trim(),
        });
      }
    } else if (selectedSearchField === "medha_area") {
      Object.assign(variables, { area: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "state") {
      Object.assign(variables, { state: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "status") {
      Object.assign(variables, { status: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "assigned_to") {
      Object.assign(variables, { username: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "industry") {
      Object.assign(variables, { industry_name: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "name") {
      Object.assign(variables, { name: selectedSearchedValue.trim() });
    }

    const employerQuery = `query GET_EMPLOYERS(
  $id: Int,
  $limit: Int,
  $start: Int,
  $sort: String,
  $status: String,
  $state: String,
  $area: String,
  $username: String,
  $industry_name:String,
  $name:String
) {
  employersConnection(
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
      industry:$industry_name
      name:$name
    }
  ) {
    values {
      ${employerFields}
    }
    aggregate {
      count
    }
  }
}
`;

    await api
      .post("/graphql", {
        query: employerQuery,
        variables,
      })
      .then((data) => {
        setEmployers(data?.data?.data?.employersConnection.values);
        setEmployersAggregate(data?.data?.data?.employersConnection?.aggregate);
        setLoading(false);
        nProgress.done();
      })
      .catch((error) => {
        setLoading(false);
        nProgress.done();
        return Promise.reject(error);
      });
  };

  const getEmployers = async (
    selectedTab,
    limit = paginationPageSize,
    offset = 0,
    sortBy = "created_at",
    sortOrder = "desc"
  ) => {
    nProgress.start();
    setLoading(true);
    try {
      const params = {
        limit: limit,
        offset: offset,
      };
      
      const data = await api.get('/api/historical_data/get_historical_data', {params});
      console.log(data);
      if(data.status === 200){
        setEmployers(data?.data?.data);
        setEmployersAggregate(data?.data?.total);
        setLoading(false);
        nProgress.done();
      }
    
    }
    catch(error){
        setLoading(false);
        nProgress.done();
        return Promise.reject(error);
    }
  };

  const fetchData = useCallback(
    (
      pageIndex,
      pageSize,
      sortBy,
      isSearchEnable,
      selectedSearchedValue,
      selectedSearchField
    ) => {
      if (sortBy.length) {
        let sortByField = "name";
        let sortOrder = sortBy[0].desc === true ? "desc" : "asc";
        switch (sortBy[0].id) {
          case "employer":
          case "industry":
          case "assigned_to.username":
          case "district":
            sortByField = sortBy[0].id;
            break;

          case "city":
            sortByField = "city";
            break;

          case "state":
            sortByField = "state";
            break;

          case "avatar":
          default:
            sortByField = "name";
            break;
        }
        if (isSearchEnable) {
          // getEmployerBySearchFilter(
          //   activeTab.key,
          //   pageSize,
          //   pageSize * pageIndex,
          //   selectedSearchedValue,
          //   selectedSearchField,
          //   sortByField,
          //   sortOrder
          // );
        } else {
          getEmployers(
            activeTab.key,
            pageSize,
            pageSize * pageIndex,
            sortByField,
            sortOrder
          );
        }
      } else {
        if (isSearchEnable) {
          // getEmployerBySearchFilter(
          //   activeTab.key,
          //   pageSize,
          //   pageSize * pageIndex,
          //   selectedSearchedValue,
          //   selectedSearchField
          // );
        } else {
          getEmployers(activeTab.key, pageSize, pageSize * pageIndex);
        }
      }
    },
    [activeTab.key]
  );

  const onRowClick = (row)=>{
    history.push(`/historic/${row.id}`);
  }

  return (
    <Collapse title="Historical Data" type="plain" opened={true}>
      <div className="row">
        <Table
          columns={columns}
          data={employers}
          paginationPageSize={paginationPageSize}
          totalRecords={employersAggregate}
          fetchData={fetchData}
          loading={loading}
          onPageSizeChange={setPaginationPageSize}
          isSearchEnable={isSearchEnable}
          selectedSearchField={selectedSearchField}
          selectedSearchedValue={selectedSearchedValue}
          onRowClick={onRowClick}
        />
      </div>
    </Collapse>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Employers);
