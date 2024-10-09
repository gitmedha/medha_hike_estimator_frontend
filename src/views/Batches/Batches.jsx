import NP from "nprogress";
import moment from "moment";
import api from "../../apis";
import { useCallback, useState, useEffect, useMemo, useRef } from "react";
import { GET_BATCHES } from "../../graphql";
import Collapse from "../../components/content/CollapsiblePanels";
import Table from "../../components/content/Table";
import { TableRowDetailLink, Badge } from "../../components/content/Utils";
import { useHistory } from "react-router-dom";
import {
  createBatch,
  getBatchesPickList,
  getStudentCountByBatch,
  sendEmailOnCreateBatch
} from "./batchActions";
import BatchForm from "./batchComponents/BatchForm";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { connect } from "react-redux";
import TabPicker from "../../components/content/TabPicker";
import BatchSearchBar from "./batchComponents/BatchSearchBar";

const tabPickerOptions = [
  { title: "My Data", key: "my_data" },
  { title: "My Area", key: "my_area" },
  { title: "My State", key: "my_state" },
  { title: "All Medha", key: "all_medha" },
];

const Batches = (props) => {
  const [batches, setBatches] = useState([]);
  const [batchesAggregate, setBatchesAggregate] = useState([]);
  const [batchesTableData, setBatchesTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pickList, setPickList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const history = useHistory();
  const { setAlert } = props;
  const pageSize = parseInt(localStorage.getItem("tablePageSize")) || 25;
  const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
  const userId = parseInt(localStorage.getItem("user_id"));
  const state = localStorage.getItem("user_state");
  const area = localStorage.getItem("user_area");
  const [selectedSearchField, setSelectedSearchField] = useState(null);
  const [isSearchEnable, setIsSearchEnable] = useState(false);
  const [selectedSearchedValue, setSelectedSearchedValue] = useState(null);
  const [formErrors, setFormErrors] = useState([]);
  const prevIsSearchEnableRef = useRef();

  useEffect(() => {
    if (isSearchEnable) {
      getBatches(activeTab.key);
    }
    
    if (prevIsSearchEnableRef.current !== undefined) {
      if (prevIsSearchEnableRef.current === true && isSearchEnable === false) {
        getBatches(activeTab.key);
      }
    }

    prevIsSearchEnableRef.current = isSearchEnable;
  }, [isSearchEnable, selectedSearchedValue,activeTab.key]);

  const getBatchesBySearchFilter = async (
    selectedTab,
    limit = paginationPageSize,
    offset = 0,
    selectedSearchedValue,
    selectedSearchField,
    sortBy,
    sortOrder
  ) => {
    const batchFields = `
    id
    name
    start_date
    end_date
    status
    medha_area
    mode_of_payment
    state
    enrollment_type
    created_at
    updated_at
    per_student_fees
    name_in_current_sis
    require_assignment_file_for_certification
    seats_available
    certificates_generated_at
    certificates_emailed_at
    grant {
      id
      name
      donor
    }
    assigned_to {
      id
      email
      username
    }
    updated_by_frontend{
      username
      email
    }
    institution {
      id
      name
    }
    program {
      id
      name
      status
      start_date
      end_date
    }
    created_by_frontend{
      id
      username
      email
    }
    assigned_to{
      username
    }
    logo {
      url
    }
    link_sent_at
    number_of_sessions_planned
    program {
      name
    }`;

    let variables = {
      limit,
      start: offset,
      sort: `${sortBy ? sortBy : selectedSearchField}:${
        sortOrder ? sortOrder : "asc"
      }`,
    };

    if (selectedTab === "my_data") {
      if (selectedSearchField === "medha_area") {
        Object.assign(variables, {
          id: userId,
          area: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "state") {
        Object.assign(variables, {
          id: userId,
          state: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "status") {
        Object.assign(variables, {
          id: userId,
          status: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "assigned_to") {
        Object.assign(variables, {
          id: userId,
          username: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "program") {
        Object.assign(variables, {
          id: userId,
          program_name: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "institution") {
        Object.assign(variables, {
          id: userId,
          institution_name: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "name") {
        Object.assign(variables, {
          id: userId,
          name: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "grant") {
        Object.assign(variables, {
          id: userId,
          grant: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "start_date") {
        Object.assign(variables, {
          id: userId,
          from_start_date: selectedSearchedValue.start_date.trim(),
          to_start_date: selectedSearchedValue.end_date.trim(),
        });
      } else if (selectedSearchField === "end_date") {
        Object.assign(variables, {
          id: userId,
          from_end_date: selectedSearchedValue.start_date.trim(),
          to_end_date: selectedSearchedValue.end_date.trim(),
        });
      }
    } else if (selectedTab === "my_state") {
      if (selectedSearchField === "medha_area") {
        Object.assign(variables, {
          state: state,
          area: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "state") {
        Object.assign(variables, { state: selectedSearchedValue.trim() });
      } else if (selectedSearchField === "status") {
        Object.assign(variables, {
          state: state,
          status: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "assigned_to") {
        Object.assign(variables, {
          state: state,
          username: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "program") {
        Object.assign(variables, {
          state: state,
          program_name: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "institution") {
        Object.assign(variables, {
          state: state,
          institution_name: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "name") {
        Object.assign(variables, {
          state: state,
          name: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "grant") {
        Object.assign(variables, {
          state: state,
          grant: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "start_date") {
        Object.assign(variables, {
          state: state,
          from_start_date: selectedSearchedValue.start_date.trim(),
          to_start_date: selectedSearchedValue.end_date.trim(),
        });
      } else if (selectedSearchField === "end_date") {
        Object.assign(variables, {
          state: state,
          from_end_date: selectedSearchedValue.start_date.trim(),
          to_end_date: selectedSearchedValue.end_date.trim(),
        });
      }
    } else if (selectedTab === "my_area") {
      if (selectedSearchField === "medha_area") {
        Object.assign(variables, { area: selectedSearchedValue.trim() });
      } else if (selectedSearchField === "state") {
        Object.assign(variables, {
          area: area,
          state: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "status") {
        Object.assign(variables, {
          area: area,
          status: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "assigned_to") {
        Object.assign(variables, {
          area: area,
          username: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "program") {
        Object.assign(variables, {
          area: area,
          program_name: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "institution") {
        Object.assign(variables, {
          area: area,
          institution_name: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "name") {
        Object.assign(variables, {
          area: area,
          name: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "grant") {
        Object.assign(variables, {
          area: area,
          grant: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "start_date") {
        Object.assign(variables, {
          area: area,
          from_start_date: selectedSearchedValue.start_date.trim(),
          to_start_date: selectedSearchedValue.end_date.trim(),
        });
      } else if (selectedSearchField === "end_date") {
        Object.assign(variables, {
          area: area,
          from_end_date: selectedSearchedValue.start_date.trim(),
          to_end_date: selectedSearchedValue.end_date.trim(),
        });
      }
    } else if (selectedSearchField === "medha_area") {
      Object.assign(variables, { area: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "state") {
      Object.assign(variables, { state: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "status") {
      Object.assign(variables, { status: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "assigned_to") {
      Object.assign(variables, { username: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "program") {
      Object.assign(variables, { program_name: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "institution") {
      Object.assign(variables, {
        institution_name: selectedSearchedValue.trim(),
      });
    } else if (selectedSearchField === "name") {
      Object.assign(variables, { name: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "grant") {
      Object.assign(variables, { grant: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "start_date") {
      Object.assign(variables, {
        from_start_date: selectedSearchedValue.start_date.trim(),
        to_start_date: selectedSearchedValue.end_date.trim(),
      });
    } else if (selectedSearchField === "end_date") {
      Object.assign(variables, {
        from_end_date: selectedSearchedValue.start_date.trim(),
        to_end_date: selectedSearchedValue.end_date.trim(),
      });
    }

    const batchQuery = `query GET_BATCHES(
  $id: Int,
  $limit: Int,
  $start: Int,
  $sort: String,
  $status: String,
  $state: String,
  $area: String,
  $username: String,
  $name: String,
  $institution_name: String,
  $from_start_date: Date,
  $to_start_date: Date,
  $from_end_date: Date,
  $to_end_date: Date,
  $program_name:String,
  $grant:String
) {
  batchesConnection(
    sort: $sort
    start: $start
    limit: $limit
    where: {
      assigned_to: {
        id: $id
        username: $username
      }
      program: {
        name: $program_name
      }
      institution: {
        name: $institution_name
      }
      grant:{
        name:$grant
      }
      medha_area: $area
      state: $state
      status: $status
      start_date_gte: $from_start_date
      start_date_lte: $to_start_date
      end_date_gte: $from_end_date
      end_date_lte: $to_end_date,
      name:$name
    }
  ) {
    values {
      ${batchFields}
    }
    aggregate {
      count
    }
  }
}
`;

    await api
      .post("/graphql", {
        query: batchQuery,
        variables,
      })
      .then((batchesData) => {
        getStudentCountByBatch().then((data) => {
          let batchStudentsCount = {};
          data.data.data.programEnrollmentsConnection.groupBy.batch.map(
            (item) =>
              (batchStudentsCount[item.key] = item.connection.aggregate.count)
          );
          // adding batch students count to batches data
          let batches = batchesData?.data?.data?.batchesConnection.values.map(
            (batch) => {
              return {
                ...batch,
                students_count: batchStudentsCount[batch.id],
              };
            }
          );

          setBatches(batches);
          setBatchesAggregate(
            batchesData?.data?.data?.batchesConnection?.aggregate
          );
          NP.done();
          setLoading(false);
        });
      })
      .catch((error) => {
        NP.done();
        setLoading(false);
        return Promise.reject(error);
      });
  };

  const getBatches = async (
    selectedTab,
    limit = paginationPageSize,
    offset = 0,
    sortBy = "created_at",
    sortOrder = "desc"
  ) => {
    NP.start();
    setLoading(true);

    if (isSearchEnable) {
      await getBatchesBySearchFilter(
        selectedTab,
        limit,
        offset,
        selectedSearchedValue,
        selectedSearchField
      );
    } else {
      let variables = {
        limit: limit,
        start: offset,
        sort: `${sortBy}:${sortOrder}`,
      };

      if (selectedTab == "my_data") {
        Object.assign(variables, { id: userId });
      } else if (selectedTab == "my_state") {
        Object.assign(variables, { state: state });
      } else if (selectedTab == "my_area") {
        Object.assign(variables, { area: area });
      }
      await api
        .post("/graphql", {
          query: GET_BATCHES,
          variables,
        })
        .then((batchesData) => {
          getStudentCountByBatch().then((data) => {
            let batchStudentsCount = {};
            data.data.data.programEnrollmentsConnection.groupBy.batch.map(
              (item) =>
                (batchStudentsCount[item.key] = item.connection.aggregate.count)
            );
            // adding batch students count to batches data
            let batches = batchesData?.data?.data?.batchesConnection.values.map(
              (batch) => {
                return {
                  ...batch,
                  students_count: batchStudentsCount[batch.id],
                };
              }
            );

            setBatches(batches);
            setBatchesAggregate(
              batchesData?.data?.data?.batchesConnection?.aggregate
            );
          });
        })
        .catch((error) => {
          return Promise.reject(error);
        })
        .finally(() => {
          setLoading(false);
          NP.done();
        });
    }
  };

  useEffect(() => {
    getBatchesPickList().then((data) => setPickList(data));
  }, []);

  useEffect(() => {
    let data = batches;
    data = data.map((batch, index) => {
      return {
        ...batch,
        assigned_to: batch.assigned_to?.username,
        start_date: moment(batch.start_date).format("DD MMM YYYY"),
        status: <Badge value={batch.status} pickList={pickList.status || []} />,
        program: batch?.program?.name,
        area: batch.medha_area,
        enrollment_type: (
          <Badge
            value={batch.enrollment_type}
            pickList={pickList.enrollment_type || []}
          />
        ),
        link: <TableRowDetailLink value={batch.id} to={"batch"} />,
        href: `/batch/${batch.id}`,
      };
    });
    setBatchesTableData(data);
  }, [batches, pickList]);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Program",
        accessor: "program",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Students Enrolled",
        accessor: "students_count",
      },
      {
        Header: "Start Date",
        accessor: "start_date",
      },
      {
        Header: "Enrollment Type",
        accessor: "enrollment_type",
      },
      {
        Header: "Area",
        accessor: "area",
      },
      {
        Header: "Assigned To",
        accessor: "assigned_to",
      },
    ],
    []
  );

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
        let sortByField = "created_at";
        let sortOrder = sortBy[0].desc === true ? "desc" : "asc";
        switch (sortBy[0].id) {
          case "name":
          case "status":
          case "start_date":
            sortByField = sortBy[0].id;
            break;
          case "assigned_to":
            sortByField = "assigned_to.username";
            break;

          case "area":
            sortByField = "medha_area";
            break;

          case "program":
            sortByField = "program.name";
            break;

          default:
            sortByField = "created_at";
            break;
        }
        if (isSearchEnable) {
          getBatchesBySearchFilter(
            activeTab.key,
            pageSize,
            pageSize * pageIndex,
            selectedSearchedValue,
            selectedSearchField,
            sortByField,
            sortOrder
          );
        } else {
          getBatches(
            activeTab.key,
            pageSize,
            pageSize * pageIndex,
            sortByField,
            sortOrder
          );
        }
      } else {
        if (isSearchEnable) {
          getBatchesBySearchFilter(
            activeTab.key,
            pageSize,
            pageSize * pageIndex,
            selectedSearchedValue,
            selectedSearchField
          );
        } else {
          getBatches(activeTab.key, pageSize, pageSize * pageIndex);
        }
      }
    },
    [activeTab.key]
  );

  const hideCreateModal = async (data) => {
    setFormErrors([]);
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // need to remove `show` from the payload
    let { show, ...dataToSave } = data;
    dataToSave["start_date"] = moment(data.start_date).format("YYYY-MM-DD");
    dataToSave["end_date"] = moment(data.end_date).format("YYYY-MM-DD");
    dataToSave["institution"] = data?.institution
      ? Number(data?.institution)
      : null;

    NP.start();
    createBatch(dataToSave)
      .then((data) => {
        if (data.data.errors) {
          setFormErrors(data.data.errors);
        } else {
          setAlert("Batch created successfully.", "success");
          // if(data.data.data.createBatch.status === "Enrollment Complete -- To Be Started"){
          //   dataToSave.id = data.data.data.createBatch.batch.id;
          //   sendEmailOnCreateBatch(dataToSave);
          // }
          
          getBatches();
          setModalShow(false);
          history.push(`/batch/${data.data.data.createBatch.batch.id}`);
        }
      })
      .catch((err) => {
        setAlert("Unable to create batch.", "error");
        getBatches();
        setModalShow(false);
      })
      .finally(() => {
        NP.done();
      });
  };

  return (
    <Collapse title="Batches" type="plain" opened={true}>
      <div className="row">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2 navbar_sec">
          <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} />
          <button
            className="btn btn-primary add_button_sec"
            onClick={() => setModalShow(true)}
            style={{ marginLeft: "15px" }}
          >
            Add New
          </button>
        </div>
        <BatchSearchBar
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
          isDisable={batchesAggregate.count ? false : true}
        />
        <Table
          columns={columns}
          data={batchesTableData}
          totalRecords={batchesAggregate.count}
          fetchData={fetchData}
          loading={loading}
          paginationPageSize={paginationPageSize}
          onPageSizeChange={setPaginationPageSize}
          isSearchEnable={isSearchEnable}
          selectedSearchField={selectedSearchField}
          selectedSearchedValue={selectedSearchedValue}
        />
        <BatchForm
          show={modalShow}
          onHide={hideCreateModal}
          errors={formErrors}
        />
      </div>
    </Collapse>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Batches);
