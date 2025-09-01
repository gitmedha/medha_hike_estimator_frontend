import nProgress from "nprogress";
import * as XLSX from "xlsx";
import styled from "styled-components";
import { useState, useEffect, useMemo, useCallback,} from "react";
import { useHistory } from "react-router-dom";
import Table from "../../components/content/Table";
import SearchBar from "../../components/layout/SearchBar";
import BonusForm from "./BonusComponents/BonusForm";  
import {
  fetchAllBonuses,
  fetchSearchDropdown,
  search,
  calculateBulkNormalizeRating,
  bulkBonus,
  downloadTableExcel,
  WeightedBonus,
  getAllReviewCycles,
  fetchBonusesByReview,
  moveToHistoricalCycle
} from "./BonusComponents/bonusActions";
import toaster from 'react-hot-toast'
import Modal from "react-bootstrap/Modal";
import Spinner from "../../utils/Spinners/Spinner";
import { Dropdown,Button } from 'react-bootstrap';
import api from "../../apis";
import ReactSelect from "react-select";
import SweetAlert from "react-bootstrap-sweetalert";




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
    width: "200px",
    marginRight:"15px"
  }),
  control: (provided) => ({
    ...provided,
    width: "200px",
  }),
};


function Bonuses(props) {

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [bonusData, setBonusData] = useState([]);
  const [totalCount, setTotalCount] = useState([]);
  const [layout, setLayout] = useState("list");
  const pageSize = parseInt(localStorage.getItem("tablePageSize")) || 25;
  const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
  const [paginationPageIndex, setPaginationPageIndex] = useState(0);
  const [modalShow,setModalShow] = useState(false);
  const [isClearDisabled,setClearDisabled] = useState(false);
  const [defaultSearchOptions] = useState([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [showUploadExcelInput,setShowUploadExcelInput] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [reviewData,setReviewData] = useState(null);         
  const [reviewCycle,setReviewCycle] = useState(null);
  const isAdmin = localStorage.getItem('admin');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [lastClicked, setLastClicked] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isSearchEnable,setIsSearchable] = useState(false);

  const handleClick = (e, itemId) => {
    e.preventDefault();
    setLastClicked(itemId);
  };
  

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
            accessor: "kra",
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
            accessor: "review_cycle",
          },
          {
            Header: "Normalized Rating",
            accessor: "normalized_ratings",
          },
          {
            Header: "Bonus",
            accessor: "bonus",
          },
          {
            Header:"Weighted Bonus",
            accessor:"weighted_bonus"
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
        value: "kra",
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
        label: "Normalized Rating",
        value: "normalized_ratings",
        key: 6
      }, {
        label: "Bonus",
        value: "bonus",
        key: 7
      }]

      const fetchData = useCallback(async(paginationPageIndex, pageSize, sortBy, isSearchEnable, isFilterApplied) => {
  nProgress.start();
  setLoading(true);
  
  // Use the reviewCycle from component state or localStorage
  const currentReviewCycle = reviewCycle || localStorage.getItem('review_cycle');
  
  if(sortBy.length){
    let sortField = sortBy[0].id;
    let sortOrder = sortBy[0].desc ? "desc" : "asc";
    
    if(currentReviewCycle){
      await fetchAllBonusesByReviewCycle(pageSize, paginationPageIndex, sortField, sortOrder, currentReviewCycle);
    } else {
      const data = await fetchAllBonuses(paginationPageIndex, pageSize, sortField, sortOrder);
      setBonusData(data?.data);
      setTotalCount(data?.totalCount);
    }
  } else {
    console.log('No sorting applied');
    console.log("isSearchable", isSearchEnable);
    if(isSearchEnable){
      const searchField = localStorage.getItem('searchField');
      const searchValue = localStorage.getItem('searchValue');
      console.log('searchField', searchField);
      console.log('searchValue', searchValue);
      const data = await search(searchField, searchValue, paginationPageIndex, pageSize, currentReviewCycle);
      console.log('data', data);
      setBonusData(data?.data);
      setTotalCount(data?.totalCount);
      setLoading(false);
      nProgress.done();
      return;
    }
    if(currentReviewCycle){
      await fetchAllBonusesByReviewCycle(pageSize, paginationPageIndex, 'employee_id', 'asc', currentReviewCycle);
    } else {
      const data = await fetchAllBonuses(paginationPageIndex, pageSize);
      setBonusData(data?.data);
      setTotalCount(data?.totalCount);
    }
  }
  
  setLoading(false);
  nProgress.done();
}, [paginationPageIndex, pageSize, reviewCycle]);

      const handleSearch = async(value)=>{
        
       await localStorage.setItem('searchField',value.searchField);
        await localStorage.setItem('searchValue',value.searchValue);
        try{
        setIsSearchable(true);

        const data = await search(value.searchField, value.searchValue,paginationPageIndex,pageSize,value.reviewCycle);
        setBonusData(data.data);
        setTotalCount(data.totalCount);

        }catch(e){
        console.error(e.message);
        }
      }

      const loadDefaultOptions = async(field)=>{
        try{
          return await fetchSearchDropdown(field, reviewCycle ? reviewCycle : localStorage.getItem('review_cycle'));

        }catch(error){
            console.error(error);
        }
      }

      useEffect(()=>{
        async function mountApis(){
         const data = await fetchAllBonuses(paginationPageIndex,pageSize);
         await getReviews();
        
         setBonusData(data.data);
         setTotalCount(data.totalCount);
         localStorage.setItem('review_cycle', data?.data[0]?.review_cycle);
        }
        mountApis();
      },[])

      const onRowClick = (row)=>{

        history.push({
          pathname:`/bonus/${row.employee_id}`,
          state:{
            review_cycle:row.review_cycle
          }

        });

      }

      const clearFilters = async()=>{
        setIsSearchable(false);
        localStorage.removeItem('searchField');
        localStorage.removeItem('searchValue');
       const data = await fetchAllBonuses(paginationPageIndex, pageSize);
       setBonusData(data?.data);
       setTotalCount(data?.totalCount);
      }

      const ToastOnSuccess = ()=>{
        toaster.success("bonus entry created successfully!",{ position: "bottom-center" })
      }
      const ToastOnFailure = (value)=>{
        toaster.error("Failed to create entry!",{ position: "bottom-center" })
      }

     const bulkRatings = async () =>{
      setShowConfirmationModal(true);
      try{
        setIsBulkLoading(true);
        if(reviewCycle){
         await calculateBulkNormalizeRating(reviewCycle);
        }
        else {
         
         await calculateBulkNormalizeRating(await localStorage.getItem('review_cycle'));
        }
        const data = await fetchAllBonuses(paginationPageIndex, pageSize);
        setBonusData(data?.data);
        setTotalCount(data?.totalCount);

      }catch(e){
        console.error(e.message);
      }finally {
        setIsBulkLoading(false);
        window.location.reload();
      }
           }

  const handleFileChange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel"
      ];

      if (!allowedTypes.includes(file.type)) {
        toaster.error("Only Excel files (.xls, .xlsx) are allowed", { position: "bottom-center" });
        return;
      }

      setUploadStatus("");
      setSelectedFile(file);
    };
        
          const handleUploadFile = async () => {
            if (!selectedFile) {
              toaster.error("No file selected!", { position: "bottom-center" });
              return;
            }
        
              setUploadStatus("Verifying...");

        
            try {
              
                  const data = await selectedFile.arrayBuffer();
                  const workbook = XLSX.read(data);
                  const sheetName = workbook.SheetNames[0];
                  const worksheet = workbook.Sheets[sheetName];
                  const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

                  if (!json.length) {
                        toaster.error("Excel file is empty!", { position: "bottom-center" });
                        setUploadStatus("");
                        return;
                      }
                
    const requiredColumns = ["Employee", "Reviewer", "KRA vs GOALS", "Competency","Final Score","Appraisal Cycle"];
    const firstRow = Object.keys(json[0]);

    // Check for missing columns
        const missingColumns = requiredColumns.filter(col => !firstRow.includes(col));
        if (missingColumns.length > 0) {
          toaster.error(`Missing required columns: ${missingColumns.join(", ")}`, { position: "bottom-center" });
          setUploadStatus("");
          return;
        }

      
    // Validate data types and empty cells
    const hasErrors = json.some((row, i) => {
      return requiredColumns.some((col) => {
        const value = row[col];
        if (value === "") return true;
        if (col === "KRA vs GOALS" || col === "Competency" || col === "Final Score") {
          return isNaN(value); // should be numeric
        }
        return false;
      });
    });

    if (hasErrors) {
          console.log("Error", hasErrors);
          toaster.error("Invalid data found: empty or wrong types", { position: "bottom-center" });
          setUploadStatus("");
          return;
        }

        
    // Passed all checks
    setUploadStatus("Uploading...");

              nProgress.start();

              
    const formData = new FormData();
    formData.append("file", selectedFile);
              const response = await api.post("/api/bonuses/upload_bonus_data", formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
              if (response.status === 200) {
                toaster.success("File uploaded successfully!", { position: "bottom-center" });
              } else {
                toaster.error("File upload failed!", { position: "bottom-center" });
              }
            } catch (error) {
              toaster.error("File upload failed!", { position: "bottom-center" });
            } finally {
              nProgress.done();
                  setUploadStatus("");

              setShowUploadExcelInput(false);
              setSelectedFile(null);
            }
          };
        
          
        
          const calculateBulkIncrement = async ()=>{
            setShowConfirmationModal(true);
            try{
              setIsBulkLoading(true);
              if(reviewCycle){
                await bulkBonus(reviewCycle);

              }
              else {
                await bulkBonus(await localStorage.getItem('review_cycle'));
              }
              const data = await fetchAllBonuses(paginationPageIndex, pageSize);
              setBonusData(data.data);
              setTotalCount(data.totalCount);

              
          }
          catch(e){
        console.error(e);
          }finally {
            setIsBulkLoading(false);
            window.location.reload();
          }
           
        }
        const bulkWeightedBonus = async ()=>{
          setShowConfirmationModal(true);
          try{
            setIsBulkLoading(true);
            if(reviewCycle){
              await WeightedBonus(reviewCycle);
            }
            else {
              await WeightedBonus(await localStorage.getItem('review_cycle'));
            }
            const data = await fetchAllBonuses(paginationPageIndex, pageSize);
            setBonusData(data.data);
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
      const getReviews = async ()=>{
        try{
          const data = await getAllReviewCycles();
          setReviewData(data);
        }
        catch(e){
          console.error(e);
        }
      }

      const fetchAllBonusesByReviewCycle = async(pageSize,pageIndex,sortBy,sortOrder,review_cycle)=>{
        try{
          const [data,totalCount] = await fetchBonusesByReview(pageSize,pageIndex,sortBy,sortOrder,review_cycle);
          setBonusData(data);
          setTotalCount(totalCount);
        }
        catch(e){
          console.error(e);
        }
      }
      useEffect(()=>{
        async function fetchByReview(){
          if(reviewCycle){
            await fetchAllBonusesByReviewCycle(paginationPageSize,paginationPageIndex,'employee_id','asc',reviewCycle);
          }
        }

        fetchByReview();

      },[reviewCycle])

      const handleBulkOperations = async(lastClicked) => {
        switch (lastClicked) {
          case "BulkRatings":
            bulkRatings(reviewCycle || localStorage.getItem('review_cycle'));
            setShowConfirmationModal(false);
            break;
          case "BulkBonus":
            calculateBulkIncrement(reviewCycle || localStorage.getItem('review_cycle'));
            setShowConfirmationModal(false);
            break;
          case "BulkWeightedBonus":
            bulkWeightedBonus(reviewCycle || localStorage.getItem('review_cycle'));
            setShowConfirmationModal(false);
            break;
          case "moveToHistorical":
                  const response = await moveToHistoricalCycle(reviewCycle || localStorage.getItem('appraisal_cycle'));
                  toaster.success(`${response.message}`, { position: "bottom-center" });
                  setShowConfirmationModal(false);
                  break;
          default:
            break;
        }
      }
  return (
    <>
     <div className="d-flex justify-content-between align-items-center p-2">
        <div className="col">
          <SearchBar
          searchFieldOptions={optionsForSearch}
          defaultSearchOptions={defaultSearchOptions}
          handleSearch = {handleSearch}
          handleSearchPicklist = {loadDefaultOptions}
          clearFilters={clearFilters}
          isClearDisabled={isClearDisabled}
          setClearDisabled={setClearDisabled}
          reviewCycle={reviewCycle || localStorage.getItem('review_cycle')}
          setReviewCycle={setReviewCycle}
          />
        </div>
       { isAdmin === "true" && <div className="col-auto" style={{marginRight:10,marginTop:30}}>
            <Dropdown className="d-inline">
                              <Dropdown.Toggle
                                        variant="secondary"
                                        id="dropdown-basic"
                                        className="bulk_action_button_sec"
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
                                          onClick={() => downloadTableExcel(reviewCycle ? reviewCycle : localStorage.getItem('review_cycle'))}
                                        >
                                            Download Excel
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          onClick={(e) => 
                                            {
                                              setShowConfirmationModal(true)
                                              handleClick(e, "BulkRatings")
            
                                            }}
                                        >
                                            Bulk Ratings
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          onClick={(e) => 
                                            {
                                              setShowConfirmationModal(true)
                                              handleClick(e, "BulkBonus")
            
                                            }}
                                        >
                                            Bulk Bonus
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          onClick={(e) => 
                                            {
                                              setShowConfirmationModal(true)
                                              handleClick(e, "BulkWeightedBonus")
                                            }
                                          }
                                        >
                                          Bulk Weighted Bonus
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          onClick={(e) => 
                                          {
                                            setShowConfirmationModal(true)
                                            handleClick(e, "moveToHistorical")

                                          }
                                          }
                                        >
                                          Move to Historical
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                      </Dropdown>
        </div>}
        {isAdmin === "true" && <div className="col-auto">
        <button
            className="btn btn-primary add_button_sec mt-4"
            onClick={() => setModalShow(true)}
          >
            Add New
          </button>
        </div>}
      </div>
      <Styled>
        <div className="row m-1">
          <div className="d-flex justify-content-end py-2">
            <ReactSelect
              styles={customStyles}
              options={reviewData}
              value={
                reviewData
                  ? reviewData.find(option => option.value === reviewCycle) ||
                    reviewData.find(option => option.value === localStorage.getItem("review_cycle"))
                  : null
              }// Prevent errors if reviewData is null
              onChange={(e)=>setReviewCycle(e.value)}
              placeholder="Review Cycle"
            />
          </div>
          <div className={`${layout !== "list" ? "d-none" : "p-0"}`}>
            <Table
              columns={columns}
              data={bonusData}
              totalRecords={totalCount}
              fetchData={fetchData} 
              loading={loading}
              paginationPageSize={paginationPageSize}
              onPageSizeChange={setPaginationPageSize}
              paginationPageIndex={paginationPageIndex}
              onPageIndexChange={setPaginationPageIndex}
              onRowClick={onRowClick}
              reviewCycle={reviewCycle}
              isSearchEnable={isSearchEnable}
            />
          </div>
        </div>
        {
          modalShow && (
            <BonusForm
              reviewCycle={reviewCycle ? reviewCycle : localStorage.getItem('review_cycle')}
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
                 {uploadStatus && (
                    <p className="text-center text-secondary"><strong>{uploadStatus}</strong></p>
                  )}
                <Button variant="primary" className="w-100" onClick={handleUploadFile}>
                  Upload File
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        )}

        {
          showConfirmationModal && (
            <SweetAlert
            icon="question"
            showCancel
            btnSize="md"
            show={true}
            onConfirm={() => handleBulkOperations(lastClicked)}
            onCancel={() => setShowConfirmationModal(false)}
            title={
              <span className="text--primary latto-bold">Run this action?</span>
            }
            cancelBtnStyle={{ backgroundColor: "#dc3545", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "5px" , textDecoration:'none'}}
            confirmBtnStyle={{ backgroundColor: "#28a745", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "5px" }}
          >
            <p>Are you sure you want to run this action?</p>
          </SweetAlert>
          
          )
        }
    </>
  )
}

export default Bonuses;