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
import EmployeesGrid from "./EmployeeComponents/EmployeesGrid";
import SearchBar from "../../components/layout/SearchBar";
import {searchEmployees,LoadSearchPicklist,downloadTableExcel} from "./EmployeeComponents/EmployeeActions";
import EmployeeForm from "./EmployeeComponents/EmployeeForm";  
import toaster from 'react-hot-toast'
import { Dropdown,Modal,Button } from 'react-bootstrap';



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
  const [isCreatedSuccess,setIsCreatedSuccess] = useState(false);
  const [isDisable,setIsDisable] = useState(true);
  const [showUploadExcelInput,setShowUploadExcelInput] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);





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
  const getEmployees = async (
    limit = paginationPageSize,
    offset = 0,
    sortBy = "employee_id",
    sortOrder = "asc"
  ) => {
    nProgress.start();
    setLoading(true);
try {
  const params = {
    limit: limit,
    offset: offset,
    sortBy: sortBy,
    sortOrder: sortOrder
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
    ) => {
      let sortByField = "employee_id";
      let sortOrder = "asc";
      if (sortBy.length) {
        sortByField = sortBy[0].id;
        sortOrder = sortBy[0].desc === true ? "desc" : "asc";
        if (isSearchEnable) {
          // getEmployeesBySearchFilter(
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
          getEmployees(
            pageSize,
            pageSize * pageIndex,
            sortByField,
            sortOrder
          );
        }
      } else {
        if (isSearchEnable) {
          // getEmployeesBySearchFilter(
          //   activeStatus,
          //   activeTab.key,
          //   pageSize,
          //   pageSize * pageIndex,
          //   selectedSearchedValue,
          //   selectedSearchField
          // );
        } else {
          getEmployees(
            pageSize,
            pageSize * pageIndex,
            sortByField,
            sortOrder

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
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
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
  const handleUploadFile = async () => {
    if (!selectedFile) {
      toaster.error("No file selected!", { position: "bottom-center" });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      nProgress.start();
      const response = await api.post("/api/employees/upload_excel", formData, {
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

const ToastOnSuccess = ()=>{
  toaster.success("Employee created successfully!",{ position: "bottom-center" })
}
const ToastOnFailure = (value)=>{
  toaster.error("Failed to create employee!",{ position: "bottom-center" })
}
  const hideExcelModal = ()=>{
    setShowUploadExcelInput(false);
  }
  return (
   <>
    <div className="d-flex justify-content-between align-items-center">
        <div className="col">
          <SearchBar
          searchFieldOptions={optionsForSearch}
          defaultSearchOptions={defaultSearchOptions}
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
              onSuccess={ToastOnSuccess}
              onFailure={ToastOnFailure}
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

      </Styled>
   </>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Employees);
