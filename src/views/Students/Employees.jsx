import nProgress from "nprogress";
import styled from "styled-components";
import api from "../../apis";
import { connect } from "react-redux";
import { useState, useEffect, useMemo, useCallback,} from "react";
import { useHistory } from "react-router-dom";
import Table from "../../components/content/Table";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { FaListUl, FaThLarge } from "react-icons/fa";
import Switch from "@material-ui/core/Switch";
import EmployeesGrid from "./StudentComponents/EmployeesGrid";
import Collapse from "../../components/content/CollapsiblePanels";
import SearchBar from "../../components/layout/SearchBar";
import {searchEmployees,LoadSearchPicklist} from "./StudentComponents/EmployeeActions";
import EmployeeForm from "./StudentComponents/EmployeeForm";  

const tabPickerOptions = [
  { title: "My Data", key: "my_data" },
  { title: "My Area", key: "my_area" },
  { title: "My State", key: "my_state" },
  { title: "All Medha", key: "all_medha" },
];

const Styled = styled.div`
  .MuiSwitch-root {
    // material switch
    margin-left: 5px;
    margin-right: 5px;

    .MuiSwitch-switchBase {
      color: #207b69;
    }
    .MuiSwitch-track {
      background-color: #c4c4c4;
      opacity: 1;
    }
  }
`;

const Employees = (props) => {
  let { isSidebarOpen } = props;
  const { setAlert } = props;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsAggregate, setStudentsAggregate] = useState([]);
  const [layout, setLayout] = useState("list");
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
  const [activeStatus, setActiveStatus] = useState("All");
  const pageSize = parseInt(localStorage.getItem("tablePageSize")) || 25;
  const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
  const [paginationPageIndex, setPaginationPageIndex] = useState(0);
  const [selectedSearchField, setSelectedSearchField] = useState(null);
  const [isSearchEnable, setIsSearchEnable] = useState(false);
  const [selectedSearchedValue, setSelectedSearchedValue] = useState(null);
  const [defaultSearchOptions,setDefaultSearchOptions] = useState([]);
  const [modalShow,setModalShow] = useState(false);


  const columns = useMemo(
    () => [
      {
        Header: "Employee ID",
        accessor: "employee_id",
      },
      {
        Header: "First Name",
        accessor: "first_name",
        width: 250,
        size: 200,
      },
      {
        Header: "Last Name",
        accessor: "last_name",
      },
      {
        Header: "Email",
        accessor: "email_id",
      },
      {
        Header: "Department",
        accessor: "department",
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Date of Joining",
        accessor: "date_of_joining",
      },
      {
        Header: "Employee Status",
        accessor: "employee_status",
      },
      {
        Header: "Employee Type",
        accessor: "employee_type",
      },
    ],
    []
  );

const optionsForSearch = [
  {
    label: "Employee ID",
    value: "employee_id",
    key: 0,
  },
  {
    label: "First Name",
    value: "first_name",
    key: 1,
  },{
  key:2,
  label: "Employee Type",
  value: "employee_type",
},
{
  key:3,
  label: "Last Name",
  value: "last_name",
},
{
  key:4,
  label: "Email",
  value: "email_id",
}, {
  key:5,
  label: "Department",
  value: "department",
}, {
  key:6,
  label: "Title",
  value: "title",
}, {
  key:7,
  label: "Date of Joining",
  value: "date_of_joining",
}, 
{
  key:8,
  label: "Employee Status",
  value: "employee_status",
}
]
  const getStudents = async (
    status = "All",
    selectedTab,
    limit = paginationPageSize,
    offset = 0,
    sortBy = "updated_at",
    sortOrder = "desc"
  ) => {
    nProgress.start();
    setLoading(true);
try {
  const params = {
    limit: limit,
    offset: offset,
  };
  
  const data = await api.get('/api/employees/get_employees', {params});
  if(data.status === 200){
    setStudents(data?.data?.data);
    setStudentsAggregate(data?.data?.total);
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
        let sortByField = "full_name";
        let sortOrder = sortBy[0].desc === true ? "desc" : "asc";

        switch (sortBy[0].id) {
          case "status":
          case "phone":
          case "city":
          case "id":
          case "medha_area":
          case "student_id":
          case "assigned_to.username":
          case "course_type_latest":
            sortByField = sortBy[0].id;
            break;

          case "avatar":
          default:
            sortByField = "full_name";
            break;
        }
        if (isSearchEnable) {
          // getStudentsBySearchFilter(
          //   activeStatus,
          //   activeTab.key,
          //   pageSize,
          //   pageSize * pageIndex,
          //   selectedSearchedValue,
          //   selectedSearchField,
          //   sortByField,
          //   sortOrder
          // );
        } else {
          getStudents(
            activeStatus,
            activeTab.key,
            pageSize,
            pageSize * pageIndex,
            sortByField,
            sortOrder
          );
        }
      } else {
        if (isSearchEnable) {
          // getStudentsBySearchFilter(
          //   activeStatus,
          //   activeTab.key,
          //   pageSize,
          //   pageSize * pageIndex,
          //   selectedSearchedValue,
          //   selectedSearchField
          // );
        } else {
          getStudents(
            activeStatus,
            activeTab.key,
            pageSize,
            pageSize * pageIndex
          );
        }
      }
    },
    [activeTab.key, activeStatus]
  );

  useEffect(() => {
    fetchData(0, paginationPageSize, []);
  }, []);

  useEffect(() => {
    setPaginationPageIndex(0);
  }, [activeTab.key, activeStatus]);

  const onRowClick = (row)=>{
    history.push(`/employee/${row.id}`);
  }
  const loadDefaultOptions = async(dropDownField)=>{
    const searchPickList = await LoadSearchPicklist(dropDownField)
    // setDefaultSearchOptions(searchPickList);
    return searchPickList;

  }

  const search =async (SearchProps)=>{
    let employees;
    if(SearchProps.from && SearchProps.to){
      employees = await  searchEmployees(SearchProps.searchValue,SearchProps.from,SearchProps.to,paginationPageSize,paginationPageIndex)
    }
    else {
      employees= await searchEmployees(SearchProps.searchValue,paginationPageSize,paginationPageIndex);
    }
    setStudents(employees.data);
    setStudentsAggregate(employees.total);
  }


  return (
    <Collapse title="Employees Details" type="plain" opened={true}>
      <div className="d-flex justify-content-between align-items-center">
        <div className="col-10">
          <SearchBar
          searchFieldOptions={optionsForSearch}
          defaultSearchOptions={defaultSearchOptions}
          searchValueOptions={[]}
          handleSearch = {search}
          handleSearchPicklist = {loadDefaultOptions}
          />
        </div>
        <div className="col-auto">
        <button
            className="btn btn-primary add_button_sec"
            onClick={() => setModalShow(true)}
            // style={{ marginLeft: "15px" }}
          >
            Add New
          </button>
        </div>
      </div>
      <Styled>
        <div className="row m-1">
          <div className="d-flex justify-content-end py-2">
            <FaThLarge
              size={22}
              color={layout === "grid" ? "#00ADEF" : "#787B96"}
              onClick={() => setLayout("grid")}
              className="c-pointer"
            />
            <Switch
              size="small"
              checked={layout === "list"}
              onChange={() => setLayout(layout === "list" ? "grid" : "list")}
              color="default"
            />
            <FaListUl
              size={22}
              color={layout === "list" ? "#00ADEF" : "#787B96"}
              onClick={() => setLayout("list")}
              className="c-pointer"
            />
          </div>
          <div className={`${layout !== "list" ? "d-none" : "p-0"}`}>
            <Table
              columns={columns}
              data={students}
              totalRecords={studentsAggregate}
              fetchData={fetchData}
              loading={loading}
              paginationPageSize={paginationPageSize}
              onPageSizeChange={setPaginationPageSize}
              paginationPageIndex={paginationPageIndex}
              onPageIndexChange={setPaginationPageIndex}
              isSearchEnable={isSearchEnable}
              selectedSearchField={selectedSearchField}
              selectedSearchedValue={selectedSearchedValue}
              onRowClick={onRowClick}
            />
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center m-2">
          <div className={`col-12 ${layout !== "grid" ? "d-none" : ""}`}>
            <EmployeesGrid
              data={students}
              isSidebarOpen={isSidebarOpen}
              totalRecords={studentsAggregate.count}
              fetchData={() => {}}
              paginationPageSize={paginationPageSize}
              onPageSizeChange={setPaginationPageSize}
              paginationPageIndex={paginationPageIndex}
              onPageIndexChange={setPaginationPageIndex}
            />
          </div>
        </div>
        {
          modalShow && (
            <EmployeeForm
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
          )
        }
      </Styled>
    </Collapse>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Employees);
