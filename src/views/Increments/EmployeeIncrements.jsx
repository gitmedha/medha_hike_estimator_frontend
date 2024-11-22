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
// import EmployeesGrid from "./StudentComponents/EmployeesGrid";
import Collapse from "../../components/content/CollapsiblePanels";
import SearchBar from "../../components/layout/SearchBar";
// import {searchEmployees,LoadSearchPicklist} from "./StudentComponents/EmployeeActions";
// import EmployeeForm from "./StudentComponents/EmployeeForm";  

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


function EmployeeIncrements(props) {

    
  let { isSidebarOpen } = props;
  const { setAlert } = props;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [studentsAggregate, setStudentsAggregate] = useState([]);
  const [layout, setLayout] = useState("list");
//   const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
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
            Header: "Employee Name",
            accessor: "full_name",
            width: 250,
            size: 200,
          },
          {
            Header: "KRA vs Goals",
            accessor: "kra_vs_goals",
          },
          {
            Header: "Compentency",
            accessor: "compentency",
          },
          {
            Header: "Average Rating",
            accessor: "final_score",
          },
          {
            Header: "Manager",
            accessor: "reviewer",
          },
          {
            Header: "Review Type",
            accessor: "review_type",
          },
          {
            Header: "Normalized Rating",
            accessor: "employee_status",
          },
          {
            Header: "Increment",
            accessor: "increment",
          },
        ],
        []
      );

      const optionsForSearch = [{
        label: "Employee ID",
        value: "employee_id",
        key: 0
      }, {
        label: "Employee Name",
        value: "full_name",
        key: 1
      }, {
        label: "KRA vs Goals",
        value: "kra_vs_goals",
        key: 2
      }, {
        label: "Competency",
        value: "compentency",
        key: 3
      }, {
        label: "Average Rating",
        value: "final_score",
        key: 4
      }, {
        label: "Manager",
        value: "reviewer",
        key: 5
      }, {
        label: "Review Type",
        value: "review_type",
        key: 6
      }, {
        label: "Normalized Rating",
        value: "employee_status",
        key: 7
      }, {
        label: "Increment",
        value: "increment",
        key: 8
      }]

      const fetchData = useCallback(()=>{

      },[]);

      const search = async()=>{

      }

      const loadDefaultOptions = async()=>{

      }

  return (
    
    <Collapse title="Increment Data" type="plain" opened={true}>
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
            className="btn btn-primary add_button_sec mt-4"
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
              data={employees}
              totalRecords={studentsAggregate}
              fetchData={fetchData}
              loading={loading}
              paginationPageSize={paginationPageSize}
              onPageSizeChange={setPaginationPageSize}
              paginationPageIndex={paginationPageIndex}
              onPageIndexChange={setPaginationPageIndex}
            //   isSearchEnable={isSearchEnable}
            //   selectedSearchField={selectedSearchField}
            //   selectedSearchedValue={selectedSearchedValue}
            //   onRowClick={onRowClick}
            />
          </div>
        </div>
        {/* <div className="d-flex flex-column flex-md-row justify-content-between align-items-center m-2">
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
        </div> */}
        {/* {
          modalShow && (
            <EmployeeForm
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
          )
        } */}
      </Styled>
    </Collapse>
  )
}

export default EmployeeIncrements