import nProgress from "nprogress";
import styled from "styled-components";
import { useState, useEffect, useMemo, useCallback,} from "react";
import { useHistory } from "react-router-dom";
import Table from "../../components/content/Table";
import { FaListUl, FaThLarge } from "react-icons/fa";
import Switch from "@material-ui/core/Switch";
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
  fetchBonusesByReview
} from "./BonusComponents/bonusActions";
import toaster from 'react-hot-toast'
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

      const fetchData = useCallback(async(paginationPageIndex,pageSize,sortBy,reviewCycle)=>{
        nProgress.start();
        setLoading(true);

        if(sortBy.length){
          
          let sortField = sortBy[0].id;
          let sortOrder = sortBy[0].desc? "desc" : "asc";
          if(reviewCycle){
            await fetchAllBonusesByReviewCycle(pageSize,paginationPageIndex,sortField,sortOrder,reviewCycle);
            setLoading(false);
            nProgress.done();
          }
          else {

            const data = await fetchAllBonuses(paginationPageIndex, pageSize,sortField,sortOrder);
            setBonusData(data?.data);
            setTotalCount(data?.totalCount);
            setLoading(false);
            nProgress.done();
          }
          
         

        }else {
          if(reviewCycle){
            await fetchAllBonusesByReviewCycle(pageSize,paginationPageIndex,'employee_id','asc',reviewCycle);
            setLoading(false);
            nProgress.done();
          }
          else {
            const data = await fetchAllBonuses(paginationPageIndex, pageSize);
            setBonusData(data?.data);
            setTotalCount(data?.totalCount);
            setLoading(false);
            nProgress.done();

          }
         
        }
        
      },[paginationPageIndex,pageSize]);

      const handleSearch = async(value)=>{
        try{
        const data = await search(value.searchField, value.searchValue,pageSize,paginationPageIndex);
        setBonusData(data.data);
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
         const data = await fetchAllBonuses(paginationPageIndex,pageSize);
         await getReviews();
        
         setBonusData(data.data);
         setTotalCount(data.totalCount);
         await localStorage.setItem('review_cycle', data.data[0].review_cycle);
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
       const data = await fetchAllBonuses(paginationPageIndex, pageSize);
       setBonusData(data?.data);
       setTotalCount(data?.totalCount);
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

           const handleFileChange = (event) => {
            const file = event.target.files[0];
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
          />
        </div>
       { isAdmin === "true" && <div className="col-auto" style={{marginRight:10,marginTop:30}}>
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
                                          onClick={() => downloadTableExcel(reviewCycle ? reviewCycle : localStorage.getItem('review_cycle'))}
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
                                            Bulk Bonus
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          onClick={() => bulkWeightedBonus()}
                                        >
                                            Bulk Weighted Bonus
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
              value={reviewCycle}
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
            //   isSearchEnable={isSearchEnable}
            //   selectedSearchField={selectedSearchField}
            //   selectedSearchedValue={selectedSearchedValue}
              onRowClick={onRowClick}
              reviewCycle={reviewCycle}

            />
          </div>
        </div>
        {
          modalShow && (
            <BonusForm
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

export default Bonuses;