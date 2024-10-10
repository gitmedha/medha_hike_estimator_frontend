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
import StudentGrid from "./StudentComponents/StudentGrid";
import Collapse from "../../components/content/CollapsiblePanels";

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

const Students = (props) => {
  let { isSidebarOpen } = props;
  const { setAlert } = props;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsAggregate, setStudentsAggregate] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [pickList, setPickList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [layout, setLayout] = useState("list");
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
  const [activeStatus, setActiveStatus] = useState("All");
  const pageSize = parseInt(localStorage.getItem("tablePageSize")) || 25;
  const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
  const [paginationPageIndex, setPaginationPageIndex] = useState(0);
  const userId = parseInt(localStorage.getItem("user_id"));
  const state = localStorage.getItem("user_state");
  const area = localStorage.getItem("user_area");
  const [selectedSearchField, setSelectedSearchField] = useState(null);
  const [isSearchEnable, setIsSearchEnable] = useState(false);
  const [selectedSearchedValue, setSelectedSearchedValue] = useState(null);
  const [ModalShowmassEdit, setModalShowmassEdit] = useState(false);


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
    console.log('total',data?.data?.total, typeof data?.data?.total);
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
    // getStudentsPickList().then((data) => setPickList(data));
    fetchData(0, paginationPageSize, []);
  }, []);

  useEffect(() => {
    setPaginationPageIndex(0);
  }, [activeTab.key, activeStatus]);




  const handleStudentStatusTabChange = (statusTab) => {
    setActiveStatus(statusTab.title);
    getStudents(
      statusTab.title,
      activeTab.key,
      paginationPageSize,
      paginationPageSize * paginationPageIndex
    );
  };

  const HideMassEmployerCreateModal = async (data) => {
    try {
      // const uniqueStudentIds = [...new Set(data.map((item) => item.student))];
      // for (const id in uniqueStudentIds) {
      //   await getAndUpdateStudentFullName(id);
      // }
      await api.post(
        "/employment-connections/createBulkEmploymentConnections",
        data
      );
      setAlert("Employment Connection data created successfully.", "success");
    } catch (error) {
      setAlert("Unable to create Employment Connection Data.", "error");
    }
  };

  const hideMassCreateModal = async (data) => {
    if (data.length === 0) {
      setAlert("Unable to create Alumni Data.", "error");
    } else {
      try {
        await api.post("/alumni-services/createBulkAlumniServices", data);
        setAlert("Alumni data created successfully.", "success");
      } catch (error) {
        setAlert("Unable to create Alumni Data.", "error");
      }
    }
  };

  const hideCreateMassEdit = (value) => {
    setModalShowmassEdit(value);
  };

  const uploadData = (data) => {
    HideMassEmployerCreateModal(data);
  };

  const uploadAlumniData = (data) => {
    hideMassCreateModal(data);
  };

  const handelSubmitMassEdit = async (data, key) => {
    if (key === "AlumniBulkEdit") {
      await api
        .post("/alumni-services/bulk-update", data)
        .then(async(data) => {
          setAlert("Data Edited Successfully.", "success");
          setTimeout(() => {
            window.location.reload(false);
          }, 3000);
        })
        .catch((err) => {
          setAlert("Unable To Edit.", "error");
          setTimeout(() => {
            window.location.reload(false);
          }, 1000);
        });
    }

    if (key === "EmployerBulkdEdit") {
      await api
        .post("/employment-connections/bulk-update", data)
        .then(async(data) => {
          // Return data
        //   const uniqueStudentIds = [...new Set(data.map(item => item.student))];
        // for(const id in uniqueStudentIds){
        //   await getAndUpdateStudentFullName(id);
        // }
          setAlert("Data Edited Successfully.", "success");
          setTimeout(() => {
            window.location.reload(false);
          }, 3000);
        })
        .catch((err) => {
          setAlert("Unable To Edit", "error");
          setTimeout(() => {
            window.location.reload(false);
          }, 1000);
        });
    }
  };

  return (
    <Collapse title="Employees Details" type="plain" opened={true}>
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
            />
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center m-2">
          <div className={`col-12 ${layout !== "grid" ? "d-none" : ""}`}>
            <StudentGrid
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
          {/* <StudentForm show={modalShow} onHide={hideCreateModal} /> */}

          {/* <ModaltoSelectBulkMassEdit
            id={""}
            name={"name"}
            onHide={() => hideCreateMassEdit(false)}
            show={ModalShowmassEdit}
            handelSubmitMassEdit={handelSubmitMassEdit}
            data={studentsData}
            AddCheck={false}
            EditCheck={false}
            uploadAlumniData={uploadAlumniData}
            uploadData={uploadData}
            
          /> */}

          {/* <ModalShowmassedit
            handelSubmitMassEdit={handelSubmitMassEdit}
            data={studentsData}
            onHide={() => hideCreateMassEdit(false)}
            show={ModalShowmassEdit}
            uploadData={uploadData}
            uploadAlumniData={uploadAlumniData}
          /> */}
        </div>
      </Styled>
    </Collapse>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Students);
