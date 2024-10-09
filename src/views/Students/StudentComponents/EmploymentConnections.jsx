import moment from "moment";
import { useState, useMemo, useEffect } from "react";
import Table from "../../../components/content/Table";
import {
  createEmploymentConnection,
  deleteEmploymentConnection,
  getEmploymentConnectionsPickList,
  updateEmploymentConnection,
  getOpportunitiesPickList,
} from "./StudentActions";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { Badge } from "../../../components/content/Utils";
import SweetAlert from "react-bootstrap-sweetalert";
import EmploymentConnection from "./EmploymentConnection";
import CreateEmploymentConnectionForm from "./EmploymentConnectionForm";
import UpdateEmploymentConnectionForm from "./EmploymentConnectionForm";
import { connect } from "react-redux";
import NP from "nprogress";
import { deleteFile } from "../../../common/commonActions";
import { isAdmin, isSRM } from "../../../common/commonFunctions";


const EmploymentConnections = (props) => {
  let { employmentConnections, student, onDataUpdate } = props;
  const [createModalShow, setCreateModalShow] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [viewModalShow, setViewModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [pickList, setPickList] = useState([]);
  const { setAlert } = props;
  const [employmentConnectionsTableData, setEmploymentConnectionsTableData] =
    useState(employmentConnections);
  const [selectedEmploymentConnection, setSelectedEmploymentConnection] =
    useState({});
  
  const [opportunitiesPickList, setOpportunitiesPickList] = useState([]);

  useEffect(() => {
    getEmploymentConnectionsPickList().then((data) => {
      setPickList(data);
    });
    getOpportunitiesPickList().then((data) => {
      setOpportunitiesPickList(data);
    });
  }, []);

  useEffect(() => {
    let data = employmentConnections.map((employmentConnection) => {
      return {
        ...employmentConnection,
        employer:
          employmentConnection.opportunity &&
          employmentConnection.opportunity.employer
            ? employmentConnection.opportunity.employer.name
            : "",
        opportunity_type: employmentConnection.opportunity
          ? employmentConnection.opportunity.type
          : "",
        status_badge: (
          <Badge
            value={employmentConnection.status}
            pickList={pickList.status}
          />
        ),
        role_or_designation: employmentConnection.opportunity
          ? employmentConnection.opportunity.role_or_designation
          : "",
        registration_date_formatted: moment(
          employmentConnection.registration_date
        ).format("DD MMM YYYY"),
        start_date: employmentConnection.start_date ? moment(employmentConnection.start_date).format(
          "DD MMM YYYY"
        ):null,
        opportunity_type: (
          <Badge
            value={employmentConnection.opportunity?.type}
            pickList={opportunitiesPickList?.type}
          />
        ),
        updated_at: moment(employmentConnection.updated_at).format(
          "DD MMM YYYY"
        ),
      };
    });
   
    setEmploymentConnectionsTableData(data);
  }, [employmentConnections, pickList, opportunitiesPickList]);

  const columns = useMemo(
    () => [
      {
        Header: "Employer",
        accessor: "employer",
      },
      {
        Header: "Role/Designation",
        accessor: "role_or_designation",
      },
      {
        Header: "Opportunity Type",
        accessor: "opportunity_type",
      },
      {
        Header: "Status",
        accessor: "status_badge",
      },
      {
        Header: "Start Date",
        accessor: "start_date",
      },
      {
        Header: "Source",
        accessor: "source",
      },
      {
        Header: "Updated At",
        accessor: "updated_at",
      },
      {
        Header: "",
        accessor: "link",
        disableSortBy: true,
      },
    ],
    []
  );

  const handleRowClick = (programEnrollment) => {
    setSelectedEmploymentConnection(programEnrollment);
    setViewModalShow(true);
  };

  const hideViewModal = () => {
    setViewModalShow(false);
  };

  const hideModal = () => {
    hideViewModal();
    onDataUpdate();
  }

  const handleViewEdit = () => {
    setViewModalShow(false);
    setUpdateModalShow(true);
  };

  const handleViewDelete = () => {
    setViewModalShow(false);
    setShowDeleteAlert(true);
  };

  const hideCreateModal = async (data) => {
    if (!data || data.isTrusted) {
      setCreateModalShow(false);
      return;
    }

    // need to remove some data from the payload that's not accepted by the API
    let {
      id,
      employer,
      employer_id,
      opportunity_id,
      employment_connection_student,
      employment_connection_opportunity,
      registration_date_formatted,
      status_badge,
      role_or_designation,
      opportunity_icon,
      employer_name,
      ...dataToSave
    } = data;
    dataToSave["start_date"] = data.start_date
      ? moment(data.start_date).format("YYYY-MM-DD")
      : null;
    dataToSave["end_date"] = data.end_date
      ? moment(data.end_date).format("YYYY-MM-DD")
      : null;
    dataToSave["salary_offered"] = data.salary_offered
      ? Number(data.salary_offered)
      : null;
    dataToSave["opportunity"] = data.opportunity_id;
    dataToSave["student"] = student.id;
    // dataToSave['assigned_to'] = userId;

    createEmploymentConnection(dataToSave)
      .then((data) => {
        setAlert("Employment Connection created successfully.", "success");
      })
      .catch((err) => {
        
        setAlert("Unable to create Employment Connection.", "error");
      })
      .finally(() => {
        onDataUpdate();
      });
    setCreateModalShow(false);
  };

  const hideUpdateModal = async (data) => {
    if (!data || data.isTrusted) {
      setUpdateModalShow(false);
      return;
    }

    // need to remove some data from the payload that's not accepted by the API
    let {
      id,
      offer_letter,
      employer,
      employer_id,
      created_at,
      updated_at,
      updated_by,
      created_by,
      opportunity_id,
      employment_connection_student,
      employment_connection_opportunity,
      registration_date_formatted,
      status_badge,
      role_or_designation,
      opportunity_icon,
      employer_name,
      opportunity_type,
      experience_certificate,
      ...dataToSave
    } = data;
    dataToSave["start_date"] = data.start_date
      ? moment(data.start_date).format("YYYY-MM-DD")
      : null;
    dataToSave["end_date"] = data.end_date
      ? moment(data.end_date).format("YYYY-MM-DD")
      : null;
    dataToSave["salary_offered"] = data.salary_offered
      ? Number(data.salary_offered)
      : null;
    dataToSave["opportunity"] = data.opportunity_id;
    // dataToSave['assigned_to'] = userId;

    updateEmploymentConnection(Number(id), dataToSave)
      .then((data) => {
        setAlert("Employment Connection updated successfully.", "success");
      })
      .catch((err) => {
        
        setAlert("Unable to update Employment Connection.", "error");
      })
      .finally(() => {
        onDataUpdate();
      });
    setUpdateModalShow(false);
  };

  const handleDelete = async () => {
    deleteEmploymentConnection(selectedEmploymentConnection.id)
      .then((data) => {
        setAlert("Employment Connection deleted successfully.", "success");
      })
      .catch((err) => {
        
        setAlert("Unable to delete Employment Connection.", "error");
      })
      .finally(() => {
        setShowDeleteAlert(false);
        onDataUpdate();
      });
  };

  const deleteCertificateFile = async (value) => {
    NP.start();
    deleteFile(selectedEmploymentConnection[value].id).then(data => {
      setAlert("Certificate deleted successfully.", "success");
    }).catch(err => {
    
      setAlert("Unable to delete Certificate.", "error");
    }).finally(() => {
      NP.done();
      onDataUpdate();
      hideViewModal();
    });
  };

  return (
    <div className="container-fluid my-3">
      {(isSRM() || isAdmin()) && <div className="row">
        <div className="col-md-6 col-sm-12 mb-4">
          <button
            className="btn btn-primary"
            onClick={() => setCreateModalShow(true)}
          >
            + Add More
          </button>
        </div>
      </div>}
      <Table
        columns={columns}
        data={employmentConnectionsTableData}
        paginationPageSize={employmentConnectionsTableData.length}
        totalRecords={employmentConnectionsTableData.length}
        fetchData={() => {}}
        loading={false}
        showPagination={false}
        onRowClick={handleRowClick}
      />
      <EmploymentConnection
        show={viewModalShow}
        onHide={hideViewModal}
        handleEdit={handleViewEdit}
        handleDelete={handleViewDelete}
        student={student}
        employmentConnection={selectedEmploymentConnection}
        onDelete={deleteCertificateFile}
        onUpdate={hideModal}
      />
      <CreateEmploymentConnectionForm
        show={createModalShow}
        onHide={hideCreateModal}
        student={student}
      />
      <UpdateEmploymentConnectionForm
        show={updateModalShow}
        onHide={hideUpdateModal}
        student={student}
        employmentConnection={selectedEmploymentConnection}
      />
      <SweetAlert
        danger
        showCancel
        btnSize="md"
        show={showDeleteAlert}
        onConfirm={() => handleDelete()}
        onCancel={() => setShowDeleteAlert(false)}
        title={
          <span className="text--primary latto-bold">
            Delete Employment Connection?
          </span>
        }
        customButtons={
          <>
            <button
              onClick={() => setShowDeleteAlert(false)}
              className="btn btn-secondary mx-2 px-4"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete()}
              className="btn btn-danger mx-2 px-4"
            >
              Delete
            </button>
          </>
        }
      >
        <p>Are you sure?</p>
      </SweetAlert>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(EmploymentConnections);
