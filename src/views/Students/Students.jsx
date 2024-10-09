import nProgress from "nprogress";
import styled from "styled-components";
import api from "../../apis";
import {
  TableRowDetailLink,
  Badge,
  uploadFile,
} from "../../components/content/Utils";
import moment from "moment";
import { connect } from "react-redux";
import Avatar from "../../components/content/Avatar";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useHistory } from "react-router-dom";
import { GET_STUDENTS } from "../../graphql";
import TabPicker from "../../components/content/TabPicker";
import Tabs from "../../components/content/Tabs";
import Table from "../../components/content/Table";
import {
  getStudentsPickList,
  createStudent,
  // getAndUpdateStudentFullName,
} from "./StudentComponents/StudentActions";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { FaListUl, FaThLarge } from "react-icons/fa";
import Switch from "@material-ui/core/Switch";
import StudentGrid from "./StudentComponents/StudentGrid";
import { studentStatusOptions } from "./StudentComponents/StudentConfig";
import StudentForm from "./StudentComponents/StudentForm";
import Collapse from "../../components/content/CollapsiblePanels";
import { isAdmin, isSRM } from "../../common/commonFunctions";
import StudentsSearchBar from "./StudentComponents/StudentsSearchBar";
// import ModalShowmassedit from "./MassEdit/ModalShowmassedit";
import ModaltoSelectBulkMassEdit from "./MassEdit/ModaltoSelectBulkMassEdit";

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

  const prevIsSearchEnableRef = useRef();

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

  // useEffect(() => {
  //   if (isSearchEnable) {
  //     getStudents(activeTab.key);
  //   }
  //   if (prevIsSearchEnableRef.current !== undefined) {
  //     if (prevIsSearchEnableRef.current === true && isSearchEnable === false) {
  //       getStudents(activeTab.key);
  //     }
  //   }

  //   prevIsSearchEnableRef.current = isSearchEnable;
  // }, [isSearchEnable, activeTab.key, selectedSearchedValue]);

  // const getStudentsBySearchFilter = async (
  //   status = "All",
  //   selectedTab,
  //   limit = paginationPageSize,
  //   offset = 0,
  //   selectedSearchedValue,
  //   selectedSearchField,
  //   sortBy,
  //   sortOrder
  // ) => {
  //   const studentFields = `
  //   id
  //   full_name
  //   email
  //   phone
  //   alternate_phone
  //   status
  //   name_of_parent_or_guardian
  //   date_of_birth
  //   category
  //   gender
  //   registration_date_latest
  //   certification_date_latest
  //   internship_date_latest
  //   placement_date_latest
  //   course_type_latest
  //   income_level
  //   family_annual_income
  //   old_sis_id
  //   medha_champion
  //   interested_in_employment_opportunities
  //   city
  //   pin_code
  //   medha_area
  //   address
  //   state
  //   how_did_you_hear_about_us
  //   how_did_you_hear_about_us_other
  //   created_at
  //   updated_at
  //   created_by_frontend{
  //     email
  //     username
  //   }
  //   updated_by_frontend{
  //     username
  //     email
  //   }
  //   district
  //   student_id
  //   assigned_to{
  //     id
  //     username
  //     email
  //     area
  //   }
  //   registered_by{
  //     id
  //     username
  //     email
  //   }
  //   logo {
  //     id
  //     url
  //   }
  //   CV {
  //     id
  //     url
  //     previewUrl
  //     updated_at
  //   }
  // `;

  //   let variables = {
  //     limit,
  //     start: offset,
  //     sort: `${sortBy ? sortBy : selectedSearchField}:${
  //       sortOrder ? sortOrder : "asc"
  //     }`,
  //   };

  //   if (status !== "All") {
  //     variables.status = studentStatusOptions.find(
  //       (tabStatus) => tabStatus.title?.toLowerCase() === status.toLowerCase()
  //     )?.picklistMatch;
  //   }
  //   if (selectedTab === "my_data") {
  //     if (selectedSearchField === "medha_area") {
  //       Object.assign(variables, {
  //         id: userId,
  //         area: selectedSearchedValue.trim(),
  //       });
  //     } else if (selectedSearchField === "status") {
  //       Object.assign(variables, {
  //         id: userId,
  //         status: selectedSearchedValue.trim(),
  //       });
  //     } else if (selectedSearchField === "assigned_to") {
  //       Object.assign(variables, {
  //         id: userId,
  //         username: selectedSearchedValue.trim(),
  //       });
  //     } else if (selectedSearchField === "full_name") {
  //       Object.assign(variables, {
  //         id: userId,
  //         full_name: selectedSearchedValue.trim(),
  //       });
  //     } else if (selectedSearchField === "email") {
  //       Object.assign(variables, {
  //         id: userId,
  //         email: selectedSearchedValue.trim(),
  //       });
  //     } else if (selectedSearchField === "phone") {
  //       Object.assign(variables, {
  //         id: userId,
  //         phone: selectedSearchedValue.trim(),
  //       });
  //     } else if (selectedSearchField === "student_id") {
  //       Object.assign(variables, {
  //         id: userId,
  //         student_id: selectedSearchedValue.trim(),
  //       });
  //     } else if (selectedSearchField === "registration_date_latest") {
  //       Object.assign(variables, {
  //         id: userId,
  //         from_registration: selectedSearchedValue.start_date.trim(),
  //         to_registration: selectedSearchedValue.end_date.trim(),
  //       });
  //     }
  //   } else if (selectedTab === "my_state") {
  //     Object.assign(variables, { state: state });
  //     if (selectedSearchField === "medha_area") {
  //       Object.assign(variables, {
  //         state: state,
  //         area: selectedSearchedValue.trim(),
  //       });
  //     } else if (selectedSearchField === "status") {
  //       Object.assign(variables, {
  //         state: state,
  //         status: selectedSearchedValue.trim(),
  //       });
  //     } else if (selectedSearchField === "assigned_to") {
  //       Object.assign(variables, {
  //         state: state,
  //         username: selectedSearchedValue.trim(),
  //       });
  //     } else if (selectedSearchField === "full_name") {
  //       Object.assign(variables, { full_name: selectedSearchedValue.trim() });
  //     } else if (selectedSearchField === "email") {
  //       Object.assign(variables, {
  //         state: state,
  //         email: selectedSearchedValue.trim(),
  //       });
  //     } else if (selectedSearchField === "phone") {
  //       Object.assign(variables, {
  //         state: state,
  //         phone: selectedSearchedValue.trim(),
  //       });
  //     } else if (selectedSearchField === "student_id") {
  //       Object.assign(variables, {
  //         state: state,
  //         student_id: selectedSearchedValue.trim(),
  //       });
  //     } else if (selectedSearchField === "registration_date_latest") {
  //       Object.assign(variables, {
  //         state: state,
  //         from_registration: selectedSearchedValue.start_date.trim(),
  //         to_registration: selectedSearchedValue.end_date.trim(),
  //       });
  //     }
  //   } else if (selectedTab === "my_area") {
  //     if (selectedSearchField === "status") {
  //       Object.assign(variables, {
  //         area: area,
  //         status: selectedSearchedValue.trim(),
  //       });
  //     } else if (selectedSearchField === "assigned_to") {
  //       Object.assign(variables, {
  //         area: area,
  //         username: selectedSearchedValue.trim(),
  //       });
  //     } else if (selectedSearchField === "full_name") {
  //       Object.assign(variables, {
  //         area: area,
  //         full_name: selectedSearchedValue.trim(),
  //       });
  //     } else if (selectedSearchField === "email") {
  //       Object.assign(variables, {
  //         area: area,
  //         email: selectedSearchedValue.trim(),
  //       });
  //     } else if (selectedSearchField === "phone") {
  //       Object.assign(variables, {
  //         area: area,
  //         phone: selectedSearchedValue.trim(),
  //       });
  //     } else if (selectedSearchField === "student_id") {
  //       Object.assign(variables, {
  //         area: area,
  //         student_id: selectedSearchedValue.trim(),
  //       });
  //     } else if (selectedSearchField === "registration_date_latest") {
  //       Object.assign(variables, {
  //         area: area,
  //         from_registration: selectedSearchedValue.start_date.trim(),
  //         to_registration: selectedSearchedValue.end_date.trim(),
  //       });
  //     }
  //   } else if (selectedSearchField === "medha_area") {
  //     Object.assign(variables, { area: selectedSearchedValue.trim() });
  //   } else if (selectedSearchField === "status") {
  //     Object.assign(variables, { status: selectedSearchedValue.trim() });
  //   } else if (selectedSearchField === "assigned_to") {
  //     Object.assign(variables, { username: selectedSearchedValue.trim() });
  //   } else if (selectedSearchField === "full_name") {
  //     Object.assign(variables, { full_name: selectedSearchedValue.trim() });
  //   } else if (selectedSearchField === "email") {
  //     Object.assign(variables, { email: selectedSearchedValue.trim() });
  //   } else if (selectedSearchField === "phone") {
  //     Object.assign(variables, { phone: selectedSearchedValue.trim() });
  //   } else if (selectedSearchField === "student_id") {
  //     Object.assign(variables, { student_id: selectedSearchedValue.trim() });
  //   } else if (selectedSearchField === "registration_date_latest") {
  //     Object.assign(variables, {
  //       from_registration: selectedSearchedValue.start_date.trim(),
  //       to_registration: selectedSearchedValue.end_date.trim(),
  //     });
  //   }

  //   const StudentQuery = `query GET_STUDENTS(
  // $id: Int, 
  // $limit: Int, 
  // $start: Int, 
  // $sort: String, 
  // $status:String, 
  // $state:String, 
  // $area:String,
  // $username:String,
  // $from_registration:String,
  // $to_registration:String,
  // $full_name:String,
  // $email:String,
  // $phone:String,
  // $student_id:String
  // ) {
  //   studentsConnection (
  //     sort: $sort
  //     start: $start
  //     limit: $limit
  //     where: {
  //       assigned_to: {
  //         id: $id
  //         username:$username
  //       }
  //       medha_area: $area
  //       state:$state
  //       status:$status
  //       registration_date_latest_gte:$from_registration
  //       registration_date_latest_lte:$to_registration
  //       full_name:$full_name
  //       email:$email
  //       phone:$phone
  //       student_id:$student_id
  //     }
  //   ) {
  //     values {
  //       ${studentFields}
  //     }
  //     aggregate {
  //       count
  //     }
  //   }
  // }`;

  //   await api
  //     .post("/graphql", {
  //       query: StudentQuery,
  //       variables,
  //     })
  //     .then((data) => {
  //       setStudents(data?.data?.data?.studentsConnection.values);
  //       setStudentsAggregate(data?.data?.data?.studentsConnection?.aggregate);
  //       setLoading(false);
  //       nProgress.done();
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       nProgress.done();
  //       return Promise.reject(error);
  //     });
  // };

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
  console.log(data);
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
    // if (isSearchEnable) {
    //   // await getStudentsBySearchFilter(
    //   //   status,
    //   //   activeTab.key,
    //   //   limit,
    //   //   offset,
    //   //   selectedSearchedValue,
    //   //   selectedSearchField
    //   // );
    // } else {
    //   let variables = {
    //     limit,
    //     start: offset,
    //     sort: `${sortBy}:${sortOrder}`,
    //   };
    //   if (status !== "All") {
    //     variables.status = studentStatusOptions.find(
    //       (tabStatus) => tabStatus.title?.toLowerCase() === status.toLowerCase()
    //     )?.picklistMatch;
    //   }
    //   if (selectedTab == "my_data") {
    //     Object.assign(variables, { id: userId });
    //   } else if (selectedTab == "my_state") {
    //     Object.assign(variables, { state: state });
    //   } else if (selectedTab == "my_area") {
    //     Object.assign(variables, { area: area });
    //   }

    //   await api
    //     .post("/graphql", {
    //       query: GET_STUDENTS,
    //       variables,
    //     })
    //     .then((data) => {
    //       let value = data?.data?.data?.studentsConnection.values.map((obj) => {
    //         obj.full_name = obj.full_name.replace(/\b\w/g, (match) => {
    //           return match.toUpperCase();
    //         });
    //       });

    //       setStudents(data?.data?.data?.studentsConnection.values);
    //       setStudentsAggregate(data?.data?.data?.studentsConnection?.aggregate);
    //       setLoading(false);
    //       nProgress.done();
    //     })
    //     .catch((error) => {
    //       setLoading(false);
    //       nProgress.done();
    //       return Promise.reject(error);
    //     });
    // }
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

  useEffect(() => {
    if (students) {
      let data = students;
      data = data.map((student) => {
        let studentStatusData = studentStatusOptions.find(
          (status) =>
            status.picklistMatch?.toLowerCase() ===
            student?.status?.toLowerCase()
        );
        return {
          ...student,
          avatar: (
            <Avatar
              name={student.full_name}
              logo={student.logo}
              style={{ width: "35px", height: "35px" }}
              icon="student"
            />
          ),
          link: <TableRowDetailLink value={student.id} to={"student"} />,
          status: (
            <Badge value={student.status} pickList={pickList.status || []} />
          ),
          category: (
            <Badge
              value={student.category}
              pickList={pickList.category || []}
            />
          ),
          gender: (
            <Badge value={student.gender} pickList={pickList.gender || []} />
          ),
          statusIcon: studentStatusData?.icon,
          registration_date: student.registration_date_latest
            ? moment(student.registration_date_latest).format("DD MMM YYYY")
            : null,
          title: student.full_name,
          progressPercent: studentStatusData?.progress,
          href: `/student/${student.id}`,
        };
      });
      setStudentsData(data);
    }
  }, [students, pickList]);

  const hideCreateModal = async (data) => {
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // need to remove `show` from the payload
    let { show, institution, batch, cv_file, ...dataToSave } = data;
    dataToSave["date_of_birth"] = data.date_of_birth
      ? moment(data.date_of_birth).format("YYYY-MM-DD")
      : "";
    if (typeof data.CV === "object") {
      dataToSave["CV"] = data.CV?.url;
    }

    if (cv_file) {
      uploadFile(data.cv_file)
        .then((data) => {
          dataToSave["CV"] = data.data.data.upload.id;
          createStudentApi(dataToSave);
        })
        .catch((err) => {
          setAlert("Unable to upload CV.", "error");
        });
    } else {
      createStudentApi(dataToSave);
    }
  };

  const createStudentApi = (dataToSave) => {
    nProgress.start();
    createStudent(dataToSave)
      .then((data) => {
        setAlert("Student created successfully.", "success");
        history.push(`/student/${data.data.data.createStudent.student.id}`);
      })
      .catch((err) => {
        setAlert("Unable to create student.", "error");
      })
      .finally(() => {
        nProgress.done();
        setStudents();
      });
    setModalShow(false);
  };

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
          {/* <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2 stundents_nav_tab">
            <TabPicker
              options={tabPickerOptions}
              setActiveTab={setActiveTab}
              moduleName="Students"
            />
            <Tabs
              options={studentStatusOptions}
              onTabChange={handleStudentStatusTabChange}
            />

            {(isSRM() || isAdmin()) && (
              <div className="d-flex  align-items-center">
                <button
                  className="btn btn-primary add_button_sec"
                  onClick={() => setModalShow(true)}
                  style={{ marginRight: "20px" }}
                >
                  Add New
                </button>
                <button
                  className="btn btn-primary add_button_sec"
                  onClick={() => setModalShowmassEdit(true)}
                >
                  Advanced Options
                </button>
              </div>
            )}
          </div> */}

          {/* <StudentsSearchBar
            selectedSearchField={selectedSearchField}
            setSelectedSearchField={setSelectedSearchField}
            setIsSearchEnable={setIsSearchEnable}
            setSelectedSearchedValue={setSelectedSearchedValue}
            tab={activeTab.key}
            info={{
              id: userId,
              area: area,
              state: state,
            }}
            isDisable={studentsAggregate.count ? false : true}
          /> */}
          <div className={`${layout !== "list" ? "d-none" : "p-0"}`}>
            <Table
              columns={columns}
              data={studentsData}
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
              data={studentsData}
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
