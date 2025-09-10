import nProgress from "nprogress";
import styled from "styled-components";
import api from "../../apis";
import { connect } from "react-redux";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Table from "../../components/content/Table";
import { setAlert } from "../../store/reducers/Notifications/actions";

import EmployeesGrid from "./EmployeeComponents/EmployeesGrid";
import SearchBar from "../../components/layout/SearchBar";
import { searchEmployees, LoadSearchPicklist, downloadTableExcel,syncEmployeesWithZoho } from "./EmployeeComponents/EmployeeActions";
import EmployeeForm from "./EmployeeComponents/EmployeeForm";  
import toaster from 'react-hot-toast'
import { Dropdown, Modal, Button } from 'react-bootstrap';
import UploadExcel from "src/components/layout/UploadExcel";


const tabPickerOptions = [
  { title: "My Data", key: "my_data" },
  { title: "My Area", key: "my_area" },
  { title: "My State", key: "my_state" },
  { title: "All Medha", key: "all_medha" },
];

const Styled = styled.div`
  .MuiSwitch-root {
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
  const [studentsAggregate, setStudentsAggregate] = useState(0);
  const [layout, setLayout] = useState("list");
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
  const [activeStatus, setActiveStatus] = useState("All");
  const pageSize = parseInt(localStorage.getItem("tablePageSize")) || 25;
  const isAdmin = localStorage.getItem("admin");
  const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
  const [paginationPageIndex, setPaginationPageIndex] = useState(0);
  const [defaultSearchOptions, setDefaultSearchOptions] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [showUploadExcelInput, setShowUploadExcelInput] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  
  // Search related state
  const [searchParams, setSearchParams] = useState({
    isActive: false,
    field: null,
    value: null
  });

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
        Header: "Status",
        accessor: "employee_status",
      },
      {
        Header: "Type",
        accessor: "employee_type",
      },
    ],
    []
  );

  const optionsForSearch = [
    { label: "Employee ID", value: "employee_id", key: 0 },
    { label: "First Name", value: "first_name", key: 1 },
    { key: 2, label: "Type", value: "employee_type" },
    { key: 3, label: "Last Name", value: "last_name" },
    { key: 4, label: "Email", value: "email_id" },
    { key: 5, label: "Department", value: "department" },
    { key: 6, label: "Title", value: "title" },
    { key: 7, label: "Date of Joining", value: "date_of_joining" },
    { key: 8, label: "Status", value: "employee_status" }
  ];

  const getEmployees = useCallback(async (limit, offset, sortBy, sortOrder) => {
  nProgress.start();
  setLoading(true);
  try {
    const params = {
      limit,
      offset,
      sortBy,
      sortOrder
    };

    if (searchParams.isActive && searchParams.field) {
      params.searchField = searchParams.field;
      
      if (searchParams.field === "date_of_joining" && typeof searchParams.value === 'object') {
        params.from = searchParams.value.from;
        params.to = searchParams.value.to;
      } else {
        params.searchValue = searchParams.value;
      }
    }

    const data = await api.get('/api/employees/get_employees', { params });
    if (data.status === 200) {
      setStudents(data?.data?.data);
      setStudentsAggregate(data?.data?.total);
    }
  } catch (error) {
    console.error("Error fetching employees:", error);
    toaster.error("Failed to load employees");
  } finally {
    setLoading(false);
    nProgress.done();
  }
}, [searchParams]);

  const fetchData = useCallback(
    (pageIndex, pageSize, sortBy) => {
      let sortByField = "employee_id";
      let sortOrder = "asc";

      if (sortBy.length) {
        sortByField = sortBy[0].id;
        sortOrder = sortBy[0].desc ? "desc" : "asc";
      }

      const offset = pageIndex * pageSize;
      getEmployees(pageSize, offset, sortByField, sortOrder);
    },
    [getEmployees]
  );

  const onRowClick = (row) => {
    history.push(`/employee/${row.id}`);
  };

  const loadDefaultOptions = async (dropDownField) => {
    const searchPickList = await LoadSearchPicklist(dropDownField);
    return searchPickList;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const search = async (SearchProps) => {
    try {
      setSearchParams({
        isActive: true,
        field: SearchProps.searchField,
        value: SearchProps.from && SearchProps.to 
          ? { from: SearchProps.from, to: SearchProps.to }
          : SearchProps.searchValue
      });
      
      // Reset to first page when searching
      setPaginationPageIndex(0);
    } catch (error) {
      console.error("Search error:", error);
      toaster.error("Search failed");
    }
  };

  const clearSearch = () => {
    setSearchParams({
      isActive: false,
      field: null,
      value: null
    });
    setPaginationPageIndex(0);
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
      const response = await api.post("/api/employees/upload_excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        toaster.success("File uploaded successfully!", { position: "bottom-center" });
        // Refresh data after upload
        fetchData(0, paginationPageSize, []);
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

  const ToastOnSuccess = () => {
    toaster.success("Employee created successfully!", { position: "bottom-center" });
  };

  const ToastOnFailure = (value) => {
    toaster.error("Failed to create employee!", { position: "bottom-center" });
  };

  useEffect(() => {
    fetchData(0, paginationPageSize, []);
  }, [fetchData, paginationPageSize]);

  

const refreshEmployees = async () => {
  try {
    nProgress.start();
    setLoading(true);

    const response = await syncEmployeesWithZoho();

    if (response.success) {
      toaster.success(response.message, { position: "bottom-center" });
    } else {
      toaster.error(response.message || "Failed to sync employees", { position: "bottom-center" });
    }

    // Fetch updated employee data
    await fetchData(paginationPageIndex, paginationPageSize, []);

    setLastRefreshed(new Date());

  } catch (error) {
    console.error("Error syncing employees:", error);
    toaster.error("Something went wrong while syncing", { position: "bottom-center" });
  } finally {
    setLoading(false);
    nProgress.done();
  }
};



  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div className="col">
          <SearchBar
            searchFieldOptions={optionsForSearch}
            defaultSearchOptions={defaultSearchOptions}
            searchValueOptions={[]}
            handleSearch={search}
            handleSearchPicklist={loadDefaultOptions}
            isDisable={!searchParams.isActive}
            turnSearchOff={clearSearch}
            storeField={(e) => setSearchParams(prev => ({...prev, field: e}))}
            storeValue={(e) => setSearchParams(prev => ({...prev, value: e}))}
          />
        </div>
        {isAdmin === "true" && (
          <div className="col-2 d-flex justify-content-end mr-2 mt-4">
            <Dropdown className="d-inline">
              <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="bulk_action_button_sec mr-3">
                ACTIONS
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setShowUploadExcelInput(true)} className="d-flex align-items-center">
                  Upload Excel
                </Dropdown.Item>
                <Dropdown.Item onClick={() => downloadTableExcel()}>
                  Download Excel
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <button className="btn btn-primary add_button_sec" onClick={() => setModalShow(true)}>
              Add New
            </button>
          </div>
        )}
      </div>
      <div className="d-flex align-items-center justify-content-end refresh_button_container">
        <div>
          <button
          className="btn btn-outline-primary mr-3"
          onClick={refreshEmployees}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
          
        </div>
        
      </div>


      <Styled>
        <div className="row m-1">
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
              isSearchEnable={searchParams.isActive}
              onRowClick={onRowClick}
            />
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center m-2">
          <div className={`col-12 ${layout !== "grid" ? "d-none" : ""}`}>
            <EmployeesGrid
              data={students}
              isSidebarOpen={isSidebarOpen}
              totalRecords={studentsAggregate}
              fetchData={() => {}}
              paginationPageSize={paginationPageSize}
              onPageSizeChange={setPaginationPageSize}
              paginationPageIndex={paginationPageIndex}
              onPageIndexChange={setPaginationPageIndex}
            />
          </div>
        </div>
        {modalShow && (
          <EmployeeForm
            show={modalShow}
            onHide={() => setModalShow(false)}
            onSuccess={ToastOnSuccess}
            onFailure={ToastOnFailure}
            refreshData={() => fetchData(paginationPageIndex, paginationPageSize, [])}
          />
        )}
        
      {showUploadExcelInput && (
  <UploadExcel
        expectedColumns={[
          "Employee ID",
          "First Name",
          "Last Name",
          "Email ID",
          "Department",
          "Title",
          "Date of Joining",
          "Employee Status",
          "Employee Type",
          "Experience",
          "Current Band",
          "Gross Monthly Salary/ Fee (Rs.)"
        ]}
        validationRules={{
  "Employee ID": (val) => /^M\d{4}$/.test(val),
  "First Name": (val) => !!val,
  "Last Name": (val) => !!val,
  "Email ID": (val) => /\S+@\S+\.\S+/.test(val),
  "Department": (val) => {
      const allowedDepartments = [
        "Core Programs",
        "Admin & Internal Controls",
        "System Adoption",
        "Partnerships",
        "Finance",
        "People",
        "MarCom",
        "Technology",
        "Data & Impact",
        "Medhavi",
        "Admin",
        "Management",
      ];
      return allowedDepartments.includes(val?.trim());
    },

      "Title": (val) => {
      const allowedTitles = [
        "Associate",
        "Student Relationship Manager",
        "Senior Manager",
        "Manager",
        "Design Manager",
        "Associate - Social Media Design",
        "Career Connections Manager",
        "Senior Manager - Curriculum Design & Capacity Building",
        "Student Relationship Manager - Teampreneur",
        "Program Lead",
        "Strategic Innovation Partner",
        "Visual Designer",
        "Associate, Copywriter, Social Media",
        "Strategic Partner",
        "Senior Manager, Data Analytics",
        "Backend Developer - Meet",
        "Front End Developer - Meet",
        "Assistant, Content Creation & Auditing - Meet",
        "Security Personnel",
        "Associate, Student Support & Company Review - Meet",
        "Manager - Svapoorna",
        "Assistant Vice President",
        "Associate, Career  Connections",
        "Associate, Graphic Design",
        "Manager, Content Writing",
        "Assistant",
        "Manager, Social Media",
        "Program Manager",
        "Student Relationship Manager, Program Implementation",
        "State Lead",
        "Senior Manager, Communications",
        "Associate, Career  Communities",
        "Manager, Chapter Model",
        "Project Lead",
        "Office Assistant",
        "Full Stack Engineer",
        "Designer - TAB",
        "Senior Manager, Alumni Programs",
        "Relationship Manager",
        "Senior Manager, M&E",
        "Career Connection Manager",
        "Program Manager - Career Connections",
        "Lead - Career Communities",
        "Senior Program Manager",
        "Manager, Program Design",
        "Program  Manager - Learning Experience",
        "Tech Associate",
        "Associate - Meet",
        "Graphic and UI Designer",
        "Senior Manager, Digital Marketing",
        "Associate,  Story Lab",
        "Board Member",
        "Quality Analyst",
        "Program  Manager - Career Communities",
        "Senior Manager, Story Lab",
        "Technology Consultant",
        "Data Manager",
        "Manager, Growth",
        "Content Writer",
        "Senior Manager, Alumni Chapter",
        "Student Relationship Manager - CAB",
        "Manager - Story Lab",
        "Manager, Videos",
        "Assistant Vice President, Project Management",
        "Assistant Vice President, Program Design",
        "Program Manager - TAB",
        "Program Manager - Svapoorna",
        "Lead - Career Connections",
        "Manager, Data Management",
        "Assistant Vice President, Data Management",
        "Assistant Vice President, Data Analytics",
        "Institutional Partnership Lead",
        "Design Lead",
        "Program Lead - Learning Experience",
        "Chief of Staff",
        "Senior Relationship Manager",
        "Lead - Learning Experience",
        "Assistant Vice President,Curriculum Design & Capacity Building",
        "Executive Director",
        "Co-Founder",
        "Lead - Data & Design",
        "Senior Manager, Public Relations",
        "Senior Manager, Communications",
        "Design & Data Manager - Youthscape",
        "Vice President",
        "Data Lead",
        "Career Progression Manager - TAB",
      ];
      return allowedTitles.includes(val?.trim());
    },

  "Date of Joining": (val) => {
    if (!val) return false;
    const date = new Date(val);
    const today = new Date();
    return !isNaN(date) && date <= today;
  },
  "Employee Status": (val) => {
  const allowedStatuses = [
    "Active",
    "Resigned",
    "End of Contract",
    "Terminated",
    "Deceased",
    "Probation not confirmed",
  ];
  return allowedStatuses.includes(val?.trim());
},
  "Employee Type": (val) => {
  const allowedTypes = [
    "Full Time Employee",
    "Full Time Consultant",
    "On Contract",
    "Board Member",
    "Full Time Consultant (M.Corp)",
  ];
  return allowedTypes.includes(val?.trim());
},

  "Experience": (val) => {
  if (!val || isNaN(parseFloat(val))) return false;

  const uploadedExp = parseFloat(val);

  return uploadedExp <= 14.7;
},
  "Current Band": (val) => {
    const allowedBands = ["I","II","III","IV","V","VI","VII","VIII"];
    return allowedBands.includes(val?.toString().trim());
  },
  "Gross Monthly Salary/ Fee (Rs.)": (val) => !isNaN(parseFloat(val))
}}

        uploadApi="/api/employees/upload_excel"
        onValidData={(valid) => console.log("Valid rows:", valid)}
        onInvalidData={(invalid) => console.log("Invalid rows:", invalid)}
        refreshData={() => {
          fetchData(paginationPageIndex, paginationPageSize, []);
          setShowUploadExcelInput(false);
        }}
        onClose={() => setShowUploadExcelInput(false)}
      />
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