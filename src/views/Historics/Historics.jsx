import nProgress from "nprogress";
import { useState,useMemo, useCallback, useRef } from "react";
import Table from "../../components/content/Table";
import { useHistory } from "react-router-dom";
import toaster from "react-hot-toast";
import api from "../../apis";

import { setAlert } from "../../store/reducers/Notifications/actions";
import { connect } from "react-redux";
import SearchBar from "../../components/layout/SearchBar";
import {searchHistorics,LoadSearchPicklist,downloadTableExcel} from "./HistoricComponents/HistoricActions";
import HistoricForm from "./HistoricComponents/HistoricForm";
import { Dropdown,Modal,Button } from 'react-bootstrap';

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
  
  const [showUploadExcelInput,setShowUploadExcelInput] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);



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
      const response = await api.post("/api/historical_data/upload_excel", formData, {
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
  return (
    <>
    <div className="d-flex justify-content-between align-items-center p-2">
        <div className="col">
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
                  </Dropdown.Menu>
                  </Dropdown>

        <button
            className="btn btn-primary add_button_sec"
            onClick={() => setModalShow(true)}
          >
            Add New
          </button>
        </div>
      </div>
      <div style={{ padding: "0 17px" }}>
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
      {showUploadExcelInput && (
          <Modal
            centered
            size="sm"
            show={true}
            onHide={() => setShowUploadExcelInput(false)}
            animation={false}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header closeButton>
              <Modal.Title>Upload Excel</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="uploader-container">
                <input
                  accept=".xlsx"
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
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Historics);
