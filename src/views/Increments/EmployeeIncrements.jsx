import nProgress from "nprogress";
import styled from "styled-components";
import { useState, useEffect, useMemo, useCallback,} from "react";
import { useHistory } from "react-router-dom";
import Table from "../../components/content/Table";
import { FaListUl, FaThLarge } from "react-icons/fa";
import Switch from "@material-ui/core/Switch";
import SearchBar from "../../components/layout/SearchBar";
import IncrementDataForm from "./IncrementsComponents/IncrementDataForm";  
import {
  fetchAllIncrements,
  fetchFilterPicklist,
  applyFilterActions,
  fetchSearchDropdown,
  search,
  calculateBulkNormalizeRating,
  downloadTableExcel,
  bulkIncrement,
  bulkWeightedIncrement,
  getAllReviewCycles,
  getIncrementDataByAppraisalCycle
} from "./IncrementsComponents/incrementsActions";
import toaster from 'react-hot-toast'
import CurrentBandDropdown from "./IncrementsComponents/CurrentBandFilter";
import Modal from "react-bootstrap/Modal";
import Spinner from "../../utils/Spinners/Spinner";
import { Dropdown,Button } from 'react-bootstrap';
import api from "../../apis";
import ReactSelect from "react-select";



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

const customStyles = {
  container: (provided) => ({
    ...provided,
    width: "150px",
    marginRight:"15px"
  }),
  control: (provided) => ({
    ...provided,
    width: "150px",
  }),
};

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
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  
  const [showUploadExcelInput,setShowUploadExcelInput] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [reviewCycle,setReviewCycle] = useState(null);
  const [reviewData,setReviewData] = useState(null);


const fetchIncrementByReview = async(pageSize,pageIndex,sortBy,sortOrder,review_cycle)=>{
        try{
          const [data,totalCount] = await getIncrementDataByAppraisalCycle(pageSize,pageIndex,sortBy,sortOrder,review_cycle);
          setIncrementData(data);
          setTotalCount(totalCount);
        }
        catch(e){
          console.error(e);
        }
      }
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
          },{
            Header:"Weighted Increment",
            accessor:"weighted_increment"
          }
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

      const fetchData = useCallback(async(pageIndex,
        pageSize,
        sortBy,)=>{
          let SortField='employee_id';
          let SortOrder='asc';
          if(sortBy.length){
            
          SortField = sortBy[0].id;
          SortOrder = sortBy[0].desc ? "desc" : "asc";
          }
        nProgress.start();
        setLoading(true);
        const data = await fetchAllIncrements(paginationPageIndex, pageSize,SortField,SortOrder);
        setIncrementData(data.data);
        setTotalCount(data.totalCount);
        setLoading(false);
        nProgress.done();
      },[paginationPageIndex,pageSize]);

      const handleSearch = async(value)=>{
        try{
        const data = await search(value.searchField, value.searchValue,pageSize,paginationPageIndex);
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
 const getReviews = async ()=>{
        try{
          const data = await getAllReviewCycles();
          setReviewData(data);
        }
        catch(e){
          console.error(e);
        }
      }
      useEffect(()=>{
        async function mountApis(){
         const data = await fetchAllIncrements(paginationPageIndex,pageSize);
         const {tenure} = await fetchFilterPicklist();
         await getReviews();

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

         localStorage.setItem('appraisal_cycle', data.data[0].appraisal_cycle);

        }
        mountApis();
      },[])

      const onRowClick = (row)=>{
        history.push(`/increment_employee/${row.employee_id}`,{ review_cycle:row.appraisal_cycle });
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

      const bulkRatings = async () =>{
        try{
          setIsBulkLoading(true);
          await calculateBulkNormalizeRating();
          const data = await fetchAllIncrements(paginationPageIndex, pageSize);
          setIncrementData(data.data);
          setTotalCount(data.totalCount);
          

        }catch(e){
          console.error(e.message);
        }finally {
          setIsBulkLoading(false);
          window.location.reload();
        }
      }

      
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("file",file)
    setSelectedFile(file);
  };

  const handleUploadFile = async () => {
    if (!selectedFile) {
      toaster.error("No file selected!", { position: "bottom-center" });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      nProgress.start();
      const response = await api.post("/api/increments/upload_excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        toaster.success("File uploaded successfully!", { position: "bottom-center" });
        setTimeout(()=>{
          window.location.reload();
        },3000)
      } else {
        toaster.error("File upload failed!", { position: "bottom-center" });
      }
    } catch (error) {
      toaster.error("File upload failed!", { position: "bottom-center" });
    } finally {
      nProgress.done();
      setShowUploadExcelInput(false);
      setSelectedFile(null);
    }
  };

  
  const hideExcelModal = ()=>{
    setShowUploadExcelInput(false);
  }

  const calculateBulkIncrement = async ()=>{
    try{
      setIsBulkLoading(true);
      await bulkIncrement();
      const data = await fetchAllIncrements(paginationPageIndex, pageSize);
      setIncrementData(data.data);
      setTotalCount(data.totalCount);
  }
  catch(e){
console.error(e);
  }finally {
    setIsBulkLoading(false);
    window.location.reload();

  }
}
const calculateBulkWeightedIncrement =  async ()=>{
  try{
      setIsBulkLoading(true);
      await bulkWeightedIncrement();
      const data = await fetchAllIncrements(paginationPageIndex, pageSize);
      setIncrementData(data.data);
      setTotalCount(data.totalCount);
  }
  catch(e){
      console.error(e);
}
  finally {
    setIsBulkLoading(false);
    window.location.reload();

  }
}

useEffect(()=>{
  async function fetchByReview(){
    if(reviewCycle){
      await fetchIncrementByReview(paginationPageSize,paginationPageIndex,'employee_id','asc',reviewCycle);
    }
  }

  fetchByReview();

},[reviewCycle])
  return (
    <>
    <div className="d-flex justify-content-between align-items-center p-2">
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
        <div className="col-auto" style={{marginRight:10,marginTop:30}}>
          <Dropdown className="d-inline">
                    <Dropdown.Toggle
                              variant="secondary"
                              id="dropdown-basic"
                              className="btn--primary action_button_sec"
                            >
                              ACTIONS
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => setShowUploadExcelInput(true)}
                                className="d-flex align-items-center"
                                >
                                Upload Excel
          
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => downloadTableExcel()}
                              >
                                  Download Excel
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => bulkRatings()}
                              >
                                  Bulk Ratings
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => calculateBulkIncrement()}
                              >
                                  Bulk Increment
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => calculateBulkWeightedIncrement()}
                              >
                                  Bulk Weighted Increment
                              </Dropdown.Item>
                            </Dropdown.Menu>
                            </Dropdown>
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
          <ReactSelect
              styles={customStyles}
              options={reviewData}
              value={reviewCycle}
              onChange={(e)=>setReviewCycle(e.value)}
              placeholder="Review Cycle"
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
    {/* Loading Modal */}
    <Modal
    show={isBulkLoading}
    centered
    backdrop="static"
    keyboard={false}
    animation={true}
  >
    <Modal.Body className="d-flex justify-content-center align-items-center">
      <Spinner />
      <span className="ml-3">Calculating...</span>
    </Modal.Body>
  </Modal>



  {showUploadExcelInput && (
          <Modal
            centered
            size="sm"
            show={true}
            onHide={() => setShowUploadExcelInput(false)}
            animation={false}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header>
              <Modal.Title>Upload Excel</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="uploader-container">
                <input
                  accept=".xlsx, .xls"
                  type="file"
                  name="file-uploader"
                  onChange={handleFileChange}
                  className="form-control mb-3"
                />
                {selectedFile && (
                  <p className="text-center text-primary">
                    Selected File: <strong>{selectedFile.name}</strong>
                  </p>
                )}
                <Button variant="primary" className="w-100" onClick={handleUploadFile}>
                  Upload File
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        )}

  </>

  )
}

export default EmployeeIncrements;