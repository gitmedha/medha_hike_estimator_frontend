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

const Historics = (props) => {
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


  const getEmployers = async (
    selectedTab,
    limit = paginationPageSize,
    offset = 0,
    sortBy = "employee",
    sortOrder = "asc"
  ) => {
    nProgress.start();
    setLoading(true);
    try {
      const params = {
        limit: limit,
        offset: offset,
        sortBy:sortBy,
        sortOrder:sortOrder
      };
      
      const data = await api.get('/api/historical_data/get_historical_data', {params});
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
    ) => {
      if (sortBy.length) {
        let sortByField = "employee_id";
        let sortOrder = sortBy[0].desc === true ? "desc" : "asc";
        if(sortBy[0].id){
          sortByField = sortBy[0].id;
        }
        if (isSearchEnable) {
         
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

export default connect(mapStateToProps, mapActionsToProps)(Historics);
