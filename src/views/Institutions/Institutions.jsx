import nProgress from "nprogress";
import api from "../../apis";
import {
  TableRowDetailLink,
  Badge,
  uploadFile,
} from "../../components/content/Utils";
import Avatar from "../../components/content/Avatar";
import { useState, useEffect, useMemo, useCallback ,useRef} from "react";
import { useHistory } from "react-router-dom";
import { GET_USER_INSTITUTES } from "../../graphql";
import TabPicker from "../../components/content/TabPicker";
import Table from "../../components/content/Table";
import {
  getInstitutionsPickList,
  createInstitution,
} from "./InstitutionComponents/instituteActions";
import InstitutionForm from "./InstitutionComponents/InstitutionForm";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { connect } from "react-redux";
import Collapse from "../../components/content/CollapsiblePanels";
import InstitutionSearchBar from "./InstitutionComponents/InstitutionSearchBar";

const tabPickerOptions = [
  { title: "My Data", key: "my_data" },
  { title: "My Area", key: "my_area" },
  { title: "My State", key: "my_state" },
  { title: "All Medha", key: "all_medha" },
];

const Institutions = (props) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [institutionsAggregate, setInstitutionsAggregate] = useState([]);
  const [institutionsTableData, setInstitutionsTableData] = useState([]);
  const [pickList, setPickList] = useState([]);
  const [formErrors, setFormErrors] = useState([]);
  const { setAlert } = props;
  const [modalShow, setModalShow] = useState(false);
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
  const pageSize = parseInt(localStorage.getItem("tablePageSize")) || 25;
  const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
  const userId = parseInt(localStorage.getItem("user_id"));
  const state = localStorage.getItem("user_state");
  const area = localStorage.getItem("user_area");
  const [selectedSearchField, setSelectedSearchField] = useState(null);
  const [isSearchEnable, setIsSearchEnable] = useState(false);
  const [selectedSearchedValue, setSelectedSearchedValue] = useState(null);
  const prevIsSearchEnableRef = useRef();

  
  useEffect(() => {
    if (isSearchEnable) {
      getInstitutions(activeTab.key);
    }
    
    if (prevIsSearchEnableRef.current !== undefined) {
      if (prevIsSearchEnableRef.current === true && isSearchEnable === false) {
        getInstitutions(activeTab.key);
      }
    }

    prevIsSearchEnableRef.current = isSearchEnable;
  }, [isSearchEnable, selectedSearchedValue,activeTab.key]);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "avatar",
      },
      {
        Header: "Area",
        accessor: "medha_area",
      },
      {
        Header: "State",
        accessor: "state",
      },
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Assigned To",
        accessor: "assigned_to.username",
      },
    ],
    []
  );

  const getInstitutionsBySearchFilter = async (
    selectedTab,
    limit = paginationPageSize,
    offset = 0,
    selectedSearchedValue,
    selectedSearchField,
    sortBy,
    sortOrder
  ) => {
    const InstitutionFields = `
      id
      name
      state
      city
      medha_area
      contacts{
        id
        email
        phone
        full_name
        designation
      }
      logo{
        url
      }
      assigned_to{
        id
        username
        email
      }
      status
      type
      created_at
  `;

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
      } else if (selectedSearchField === "type") {
        Object.assign(variables, {
          id: userId,
          type: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "assigned_to") {
        Object.assign(variables, {
          id: userId,
          username: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "name") {
        Object.assign(variables, {
          id: userId,
          name: selectedSearchedValue.trim(),
        });
      }
    } else if (selectedTab === "my_state") {
      if (selectedSearchField === "state") {
        Object.assign(variables, {
          state: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "medha_area") {
        Object.assign(variables, {
          state: state,
          area: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "status") {
        Object.assign(variables, {
          state: state,
          status: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "type") {
        Object.assign(variables, {
          state: state,
          type: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "assigned_to") {
        Object.assign(variables, {
          state: state,
          username: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "name") {
        Object.assign(variables, {
          state: state,
          name: selectedSearchedValue.trim(),
        });
      }
    } else if (selectedTab === "my_area") {
      if (selectedSearchField === "medha_area") {
        Object.assign(variables, {
          area: selectedSearchedValue.trim(),
        });
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
      } else if (selectedSearchField === "type") {
        Object.assign(variables, {
          area: area,
          type: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "assigned_to") {
        Object.assign(variables, {
          area: area,
          username: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "name") {
        Object.assign(variables, {
          area: area,
          name: selectedSearchedValue.trim(),
        });
      }
    } else if (selectedSearchField === "medha_area") {
      Object.assign(variables, { area: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "state") {
      Object.assign(variables, { state: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "status") {
      Object.assign(variables, { status: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "type") {
      Object.assign(variables, { type: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "assigned_to") {
      Object.assign(variables, { username: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "name") {
      Object.assign(variables, { name: selectedSearchedValue.trim() });
    }

    const InstitutionQuery = `query GET_INSTITUTES($id: Int, $limit: Int, $start: Int, $sort: String, $status:String, $state:String, $area:String,$username:String,$type:String, $name:String) {
  institutionsConnection (
      sort: $sort
      start: $start
      limit: $limit,
      where: {
        assigned_to: {
          id: $id,
          username:$username
        }
        medha_area: $area
        state:$state,
        status:$status,
        type:$type,
        name:$name
      }
    ) {
      values {
        ${InstitutionFields}
      }
      aggregate {
        count
      }
    }
  }`;

    await api
      .post("/graphql", {
        query: InstitutionQuery,
        variables,
      })
      .then((data) => {
        setInstitutions(data?.data?.data?.institutionsConnection.values);
        setInstitutionsAggregate(
          data?.data?.data?.institutionsConnection?.aggregate
        );
        setLoading(false);
        nProgress.done();
      })
      .catch((error) => {
        setLoading(false);
        nProgress.done();
        return Promise.reject(error);
      });
  };

  const getInstitutions = async (
    selectedTab,
    limit = paginationPageSize,
    offset = 0,
    sortBy = "created_at",
    sortOrder = "desc"
  ) => {
    nProgress.start();
    setLoading(true);

    if (isSearchEnable) {
      await getInstitutionsBySearchFilter(
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
          query: GET_USER_INSTITUTES,
          variables,
        })
        .then((data) => {
          setInstitutions(data?.data?.data?.institutionsConnection.values);
          setInstitutionsAggregate(
            data?.data?.data?.institutionsConnection?.aggregate
          );
        })
        .catch((error) => {
          return Promise.reject(error);
        })
        .finally(() => {
          setLoading(false);
          nProgress.done();
        });
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
        let sortByField = "name";
        let sortOrder = sortBy[0].desc === true ? "desc" : "asc";

        switch (sortBy[0].id) {
          case "status":
          case "type":
          case "medba_area":
            sortByField = sortBy[0].id;
            break;

          case "assignedTo":
            sortByField = "assigned_to.username";
            break;

          case "state":
            sortByField = sortBy[0].id;
            break;
          case "avatar":
          default:
            sortByField = "name";
            break;
        }

        if (sortBy[0].id == "medha_area") {
          sortByField = sortBy[0].id;
        }
        if (isSearchEnable) {
          getInstitutionsBySearchFilter(
            activeTab.key,
            pageSize,
            pageSize * pageIndex,
            selectedSearchedValue,
            selectedSearchField,
            sortByField,
            sortOrder
          );
        } else {
          getInstitutions(
            activeTab.key,
            pageSize,
            pageSize * pageIndex,
            sortByField,
            sortOrder
          );
        }
      } else {
        if (isSearchEnable) {
          getInstitutionsBySearchFilter(
            activeTab.key,
            pageSize,
            pageSize * pageIndex,
            selectedSearchedValue,
            selectedSearchField
          );
        } else {
          getInstitutions(activeTab.key, pageSize, pageSize * pageIndex);
        }
      }
    },
    [activeTab.key]
  );

  useEffect(() => {
    getInstitutionsPickList().then((data) => setPickList(data));
  }, []);

  useEffect(() => {
    let data = institutions;
    data = data.map((institution, index) => {
      return {
        ...institution,
        avatar: (
          <Avatar
            name={institution.name}
            logo={institution.logo}
            style={{ width: "35px", height: "35px" }}
          />
        ),
        status: (
          <Badge value={institution.status} pickList={pickList.status || []} />
        ),
        type: <Badge value={institution.type} pickList={pickList.type || []} />,
        link: <TableRowDetailLink value={institution.id} to={"institution"} />,
        href: `/institution/${institution.id}`,
      };
    });
    setInstitutionsTableData(data);
  }, [institutions, pickList]);

  const hideCreateModal = async (data) => {
    setFormErrors([]);

    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // need to remove `show` from the payload
    let { id, show, mou, ...dataToSave } = data;
    dataToSave["mou"] = [];
    if (mou && mou.length) {
      await Promise.all(
        mou.map(async (mouData) => {
          try {
            const response = await uploadFile(mouData.mou_file);
            dataToSave["mou"].push({
              ...mouData,
              mou_file: response.data.data.upload.id,
            });
          } catch (err) {
            setAlert("Unable to upload MoU.", "error");
          }
        })
      );
    }
    createInstitutionApi(id, dataToSave);
  };

  const createInstitutionApi = (id, dataToSave) => {
    nProgress.start();
    createInstitution(dataToSave)
      .then((data) => {
        if (data.data.errors) {
          setFormErrors(data.data.errors);
        } else {
          setAlert("Institution created successfully.", "success");
          setModalShow(false);
          getInstitutions();
          history.push(
            `/institution/${data.data.data.createInstitution.institution.id}`
          );
        }
      })
      .catch((err) => {
        setAlert("Unable to create institution.", "error");
        setModalShow(false);
        getInstitutions();
      })
      .finally(() => {
        nProgress.done();
      });
  };

  return (
    <Collapse title="INSTITUTIONS" type="plain" opened={true}>
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
        <InstitutionSearchBar
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
          isDisable={institutionsAggregate.count ? false : true}
        />
        <Table
          columns={columns}
          data={institutionsTableData}
          totalRecords={institutionsAggregate.count}
          fetchData={fetchData}
          loading={loading}
          paginationPageSize={paginationPageSize}
          onPageSizeChange={setPaginationPageSize}
          isSearchEnable={isSearchEnable}
          selectedSearchField={selectedSearchField}
          selectedSearchedValue={selectedSearchedValue}
        />
        <InstitutionForm
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

export default connect(mapStateToProps, mapActionsToProps)(Institutions);
