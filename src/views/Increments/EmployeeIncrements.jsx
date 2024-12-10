import nProgress from "nprogress";
import styled from "styled-components";
import api from "../../apis";
import { useState, useEffect, useMemo, useCallback,} from "react";
import { useHistory } from "react-router-dom";
import Table from "../../components/content/Table";
import { FaListUl, FaThLarge } from "react-icons/fa";
import Switch from "@material-ui/core/Switch";
import Collapse from "../../components/content/CollapsiblePanels";
import SearchBar from "../../components/layout/SearchBar";
import IncrementDataForm from "./IncrementsComponents/IncrementDataForm";  
import {fetchAllIncrements,fetchFilterPicklist,applyFilterActions,fetchSearchDropdown,search} from "./IncrementsComponents/incrementsActions";
import toaster from 'react-hot-toast'
import CurrentBandDropdown from "./IncrementsComponents/CurrentBandFilter";
import {Input} from "../../utils/Form"

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
  const pageSize = parseInt(localStorage.getItem("tablePageSize")) || 25;
  const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
  const [paginationPageIndex, setPaginationPageIndex] = useState(0);
  const [selectedSearchField, setSelectedSearchField] = useState(null);
  const [isSearchEnable, setIsSearchEnable] = useState(false);
  const [selectedSearchedValue, setSelectedSearchedValue] = useState(null);
  const [defaultSearchOptions,setDefaultSearchOptions] = useState([]);
  const [modalShow,setModalShow] = useState(false);
  const [newBandOptions,setNewBandOptions] = useState([]);
  const [currentBandOptions,setCurrentBandOptions] = useState([]);
  const [longTenureOptions,setLongTenureOptions] = useState([]);
  const [tenureOptions,setTenureOptions] = useState([]);
  const [selectedBand, setSelectedBand] = useState(null);
  const [selectedTenure,setSelectedTenure] = useState(null);
  const [selectedLongTenures,setSelectedLongTenure] = useState(null);
  const [isClearDisabled,setClearDisabled] = useState(false);
  const [selectCurrentBand,setSelectCurrentBand] = useState(null);


  const [filters,setFilters] = useState([{
    fields: [],
    values:[]
  }]);
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

      const handleSearch = async(value)=>{
        try{
        const data = await search(value.searchField, value.searchValue,pageSize,paginationPageIndex);
        console.log(data);
        setIncrementData(data.data);
        setTotalCount(data.totalCount);

        }catch(e){
console.error(e.message);
        }
      }

      const loadDefaultOptions = async(field)=>{
        try{
          return await fetchSearchDropdown(field);

        }catch(error){
            console.error(error);
        }
      }

      useEffect(()=>{
        async function mountApis(){
         const data = await fetchAllIncrements(paginationPageIndex,pageSize);
         const {tenure} = await fetchFilterPicklist();
         setNewBandOptions([{
          label:'I',
          value:'I'
         }, {
          label:'II',
          value:'II'
         },{
          label:'III',
          value:'III'
         }, {
          label:'IV',
          value:'IV'
         }, {
          label:'V',
          value:'V'
         }, {
          label:'VI',
          value:'VI'
         }])
         setCurrentBandOptions([{
          label:'I',
          value:'I'
         }, {
          label:'II',
          value:'II'
         },{
          label:'III',
          value:'III'
         }, {
          label:'IV',
          value:'IV'
         }, {
          label:'V',
          value:'V'
         }, {
          label:'VI',
          value:'VI'
         }])
         setTenureOptions([...tenure])
         setLongTenureOptions([...[{
          key:0,
          label:'No',
          value: "No"
          }, {
          key:1,
          label:'Yes',
          value: "Yes"
        }]])
         setIncrementData(data.data);
         setTotalCount(data.totalCount);
        }
        mountApis();
      },[])

      const onRowClick = (row)=>{
        history.push(`/increment_employee/${row.employee_id}`);
      }

      const handleFilters = async(filters,offset,limit)=>{
        try {
          const data = await applyFilterActions(filters,offset,limit);
          setIncrementData(data.data);
          setTotalCount(data.total);
        } catch (error) {
          console.error(error);
        }
      }

      useEffect(()=>{
        async function runFilter(filters,offset,limit){
         await handleFilters(filters,offset,limit);
        }

        if(filters[0].fields.length){
          runFilter(filters,paginationPageIndex,paginationPageSize)
        }

      },[filters])


      const clearFilters = async()=>{
        await setSelectCurrentBand([])
       await setSelectedBand([]);
       await setSelectedTenure([]);
       await setSelectedLongTenure([]);
       
       const data = await fetchAllIncrements(paginationPageIndex, pageSize);
       setIncrementData(data.data);
       setTotalCount(data.totalCount);

      }

      const ToastOnSuccess = ()=>{
        toaster.success("Increment entry created successfully!",{ position: "bottom-center" })
      }
      const ToastOnFailure = (value)=>{
        toaster.error("Failed to create entry!",{ position: "bottom-center" })
      }

  return (
    
    <Collapse title="Increment Data" type="plain" opened={true}>
      <div className="d-flex justify-content-between align-items-center">
      <div className="filter_container d-flex mt-2">
          <CurrentBandDropdown 
          newBands={newBandOptions}
          currentBands={currentBandOptions} 
          longTenures={longTenureOptions} 
          tenures={tenureOptions} 
          applyFilter={setFilters} 
          filters={filters}
          selectCurrentBand={selectCurrentBand}
          setSelectCurrentBand={setSelectCurrentBand}
          selectedBand={selectedBand}
          setSelectedBand={setSelectedBand}
          selectedTenure={selectedTenure}
          setSelectedTenure={setSelectedTenure}
          selectedLongTenures={selectedLongTenures}
          setSelectedLongTenure={setSelectedLongTenure}
          setClearDisabled={setClearDisabled}
          />
        </div>
        <div className="col">
          <SearchBar
          searchFieldOptions={optionsForSearch}
          defaultSearchOptions={defaultSearchOptions}
          handleSearch = {handleSearch}
          handleSearchPicklist = {loadDefaultOptions}
          clearFilters={clearFilters}
          isClearDisabled={isClearDisabled}
          setClearDisabled={setClearDisabled}
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
              ToastOnSuccess={ToastOnSuccess}
              ToastOnFailure={ToastOnFailure}

            />
          )
        }
      </Styled>
    </Collapse>
  )
}

export default EmployeeIncrements