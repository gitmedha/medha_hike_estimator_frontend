import nProgress from "nprogress";
import styled from "styled-components";
import api from "../../apis";
import { useState, useEffect, useMemo, useCallback,} from "react";
import { useHistory } from "react-router-dom";
import Table from "../../components/content/Table";
import { FaListUl, FaThLarge } from "react-icons/fa";
import Switch from "@material-ui/core/Switch";
// import EmployeesGrid from "./StudentComponents/EmployeesGrid";
import Collapse from "../../components/content/CollapsiblePanels";
import SearchBar from "../../components/layout/SearchBar";
// import {searchEmployees,LoadSearchPicklist} from "./StudentComponents/EmployeeActions";
import IncrementDataForm from "./IncrementsComponents/IncrementDataForm";  
import {fetchAllIncrements} from "./IncrementsComponents/incrementsActions";

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

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [incrementData, setIncrementData] = useState([]);
  const [totalCount, setTotalCount] = useState([]);
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
            Header: "KRA",
            accessor: "kra_vs_goals",
          },
          {
            Header: "Compentency",
            accessor: "compentency",
          },
          {
            Header: "Average Rating",
            accessor: "average",
          },
          {
            Header: "Manager",
            accessor: "manager",
          },
          {
            Header: "Review Cycle",
            accessor: "appraisal_cycle",
          },
          {
            Header: "Normalized Rating",
            accessor: "normalize_rating",
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
        label: "KRA",
        value: "kra_vs_goals",
        key: 2
      }, {
        label: "Competency",
        value: "compentency",
        key: 3
      }, {
        label: "Average Rating",
        value: "average",
        key: 4
      }, {
        label: "Manager",
        value: "manager",
        key: 5
      }, {
        label: "Review Cycle",
        value: "appraisal_cycle",
        key: 6
      }, {
        label: "Normalized Rating",
        value: "normalize_rating",
        key: 7
      }, {
        label: "Increment",
        value: "increment",
        key: 8
      }]

      const fetchData = useCallback(async()=>{
        nProgress.start();
        setLoading(true);
        const data = await fetchAllIncrements(paginationPageIndex, pageSize);
        setIncrementData(data.data);
        setTotalCount(data.totalCount);
        setLoading(false);
        nProgress.done();
      },[paginationPageIndex,pageSize]);

      const search = async()=>{

      }

      const loadDefaultOptions = async()=>{

      }

      useEffect(()=>{
        async function mountApis(){
         const data = await fetchAllIncrements(paginationPageIndex,pageSize);
         setIncrementData(data.data);
         setTotalCount(data.totalCount);
        }
        mountApis();
      },[])

      const onRowClick = (row)=>{
        history.push(`/increment_employee/${row.id}`);
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
              data={incrementData}
              totalRecords={totalCount}
              fetchData={fetchData}
              loading={loading}
              paginationPageSize={paginationPageSize}
              onPageSizeChange={setPaginationPageSize}
              paginationPageIndex={paginationPageIndex}
              onPageIndexChange={setPaginationPageIndex}
            //   isSearchEnable={isSearchEnable}
            //   selectedSearchField={selectedSearchField}
            //   selectedSearchedValue={selectedSearchedValue}
              onRowClick={onRowClick}
            />
          </div>
        </div>
        {
          modalShow && (
            <IncrementDataForm
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
          )
        }
      </Styled>
    </Collapse>
  )
}

export default EmployeeIncrements