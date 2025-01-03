import nProgress from "nprogress";
import { useState,useMemo, useCallback, useRef } from "react";
import Table from "../../components/content/Table";
import { useHistory } from "react-router-dom";
import toaster from "react-hot-toast";
import api from "../../apis";

import { setAlert } from "../../store/reducers/Notifications/actions";
import { connect } from "react-redux";
import Collapse from "../../components/content/CollapsiblePanels";
import SearchBar from "../../components/layout/SearchBar";
import {searchHistorics,LoadSearchPicklist} from "./HistoricComponents/HistoricActions";
import HistoricForm from "./HistoricComponents/HistoricForm";

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
  const [selectedSearchField, setSelectedSearchField] = useState(null);
  const [isSearchEnable, setIsSearchEnable] = useState(false);
  const [selectedSearchedValue, setSelectedSearchedValue] = useState(null);
  const [formErrors, setFormErrors] = useState([]);
  const prevIsSearchEnableRef = useRef(isSearchEnable);
  const [isDisable,setIsDisable] = useState(true);



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
        Header: "KRA",
        accessor: "kra_vs_goals",
      },
      {
        Header: "Competency",
        accessor: "competency",
      },
      {
        Header: "Average",
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

  const optionsForSearch = [
    {
      label: "Employee",
      value: "employee",
      key: 0,
    },
    {
      label: "Reviewer",
      value: "reviewer",
      key: 1,
    },{
    key:2,
    label: "Kra",
    value: "kra_vs_goals",
  },
  {
    key:3,
    label: "Competency",
    value: "competency",
  },
  {
    key:4,
    label: "Average",
    value: "final_score",
  }, {
    key:5,
    label: "Start Month",
    value: "start_month",
  }, {
    key:6,
    label: "Ending Month",
    value: "ending_month",
  }
  ]
  const search =async (SearchProps)=>{
    let historics;
    if(SearchProps.from && SearchProps.to){
      historics = await  searchHistorics(SearchProps.searchValue,SearchProps.from,SearchProps.to,paginationPageSize)
    }
    else {
      historics= await searchHistorics(SearchProps.searchValue,paginationPageSize);
    }
    setEmployers(historics.data);
    setEmployersAggregate(historics.total);
  }

  const loadDefaultOptions = async(dropDownField)=>{
    const searchPickList = await LoadSearchPicklist(dropDownField)
    return searchPickList;

  }

  const onFailure = ()=>{
    toaster.error("Failed to create historic data",{ position: "bottom-center" });
  }
  const onSuccess = ()=>{
    toaster.success("Created the historic data successfully!",{ position: "bottom-center" })
  }
  return (
    <Collapse title="Historical Data" type="plain" opened={true}>
      <div className="d-flex justify-content-between align-items-center">
        <div className="col-10">
          <SearchBar
          searchFieldOptions={optionsForSearch}
          searchValueOptions={[]}
          handleSearch = {search}
          handleSearchPicklist = {loadDefaultOptions}
          isDisable={isDisable}
          setIsDisable={setIsDisable}
          />
        </div>
        <div className="col-auto mt-4">
        <button
            className="btn btn-primary add_button_sec"
            onClick={() => setModalShow(true)}
          >
            Add New
          </button>
        </div>
      </div>
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
      {
        modalShow && (
          <HistoricForm
            show={modalShow}
            onHide={() => setModalShow(false)}
            onFailure={onFailure}
            onSuccess={onSuccess}
          />
        )
      }
    </Collapse>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Historics);
