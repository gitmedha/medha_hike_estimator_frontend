import styled from "styled-components";
import moment from 'moment';
import { useState, useMemo, useEffect } from "react";
import { connect } from "react-redux";
import NP from "nprogress";
import { useHistory } from "react-router-dom";
import Table from "../../../components/content/Table";
import { Badge } from "../../../components/content/Utils";
import { FaBlackTie, FaBriefcase } from "react-icons/fa";
import { createEmploymentConnection, deleteEmploymentConnection, getEmploymentConnectionsPickList, updateEmploymentConnection } from "../../Students/StudentComponents/StudentActions";
import CreateEmploymentConnectionForm from "./EmploymentConnectionForm";
import UpdateEmploymentConnectionForm from "./EmploymentConnectionForm";
import EmploymentConnection from "./EmploymentConnection";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import SweetAlert from "react-bootstrap-sweetalert";
import  {getOpportunitiesPickList} from "../../Opportunities/OpportunityComponents/opportunityAction";
import { deleteFile } from "../../../common/commonActions";

const StyledOpportunityIcon = styled.div`
  border-radius: 50%;
  height: 35px;
  width: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OpportunityIcon = ({opportunity}) => {
  let bgColor = '#FF9700';
  let icon = null;
  switch (opportunity.type) {
    case 'Job':
      bgColor = '#FF9700';
      icon = <FaBriefcase color="#ffffff" size="16" />;
      break;

    case 'Internship':
      bgColor = '#12314C';
      icon = <FaBlackTie color="#ffffff" size="16" />;
      break;
  }
  if (icon) {
    return <StyledOpportunityIcon style={{backgroundColor: bgColor}}>
      {icon}
    </StyledOpportunityIcon>;
  }
  return <></>;
};

const EmploymentConnections = (props) => {
  let { employmentConnections, employer, onDataUpdate } = props;
  const [createModalShow, setCreateModalShow] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [viewModalShow, setViewModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [pickList, setPickList] = useState([]);
  const {setAlert} = props;
  const [opportunitypickList, setopportunityPickList] = useState([]);
  const [employmentConnectionsTableData, setEmploymentConnectionsTableData] = useState(employmentConnections);
  const [selectedEmploymentConnection, setSelectedEmploymentConnection] = useState({
    employer: {},
  });

  useEffect(() => {
    getOpportunitiesPickList().then(data => {
      setopportunityPickList(data);
    });
  }, [])

  useEffect(() => {
    getEmploymentConnectionsPickList().then(data => {
      setPickList(data);
    });
  }, []);

  useEffect(() => {
    let data = employmentConnections.map(employmentConnection => {
      return {
        ...employmentConnection,
        student_name: employmentConnection.student ? `${employmentConnection.student?.full_name} ( ${employmentConnection.student.student_id} )`:'',
        institution_name: 'To be added',
        opportunity_type: <Badge value={employmentConnection.opportunity.type} pickList={opportunitypickList.type}/>,
        opportunity_icon: employmentConnection.opportunity ? <OpportunityIcon opportunity={employmentConnection.opportunity} /> : '',
        status_badge: <Badge value={employmentConnection.status} pickList={pickList.status} />,
        role_or_designation: employmentConnection.opportunity ? employmentConnection.opportunity.role_or_designation : '',
        registration_date_formatted: moment(employmentConnection.registration_date).format("DD MMM YYYY"),
        date: moment(employmentConnection.created_at).format("DD MMM YYYY"),
        start_date: moment(employmentConnection.start_date).format("DD MMM YYYY"),
        student_id: employmentConnection.student ? employmentConnection.student.student_id : '',
        updated_at:  moment(employmentConnection.updated_at).format("DD MMM YYYY"),
      };
    });
    setEmploymentConnectionsTableData(data);
  }, [employmentConnections, pickList, opportunitypickList]);

  const columns = useMemo(
    () => [
      {
        Header: 'Student',
        accessor: 'student_name',
      },
      {
        Header: 'Role/Designation',
        accessor: 'opportunity.role_or_designation',
      },
      {
        Header: 'Type',
        accessor: 'opportunity_type',
      },
      {
        Header: 'Status',
        accessor: 'status_badge',
      },
      {
        Header: 'Start Date',
        accessor: 'start_date',
      },
      {
        Header: 'Source',
        accessor: 'source',
      },
      {
        Header: 'Updated At',
        accessor: 'updated_at',
      },
      {
        Header: '',
        accessor: 'link',
        disableSortBy: true,
      },
    ],
    []
  );

  const handleRowClick = employmentConnection => {
    setSelectedEmploymentConnection(employmentConnection);
    setViewModalShow(true);
  }

  const hideViewModal = () => {
    setViewModalShow(false);
  }

  const handleViewEdit = () => {
    setViewModalShow(false);
    setUpdateModalShow(true);
  }

  const handleViewDelete = () => {
    setViewModalShow(false);
    setShowDeleteAlert(true);
  }

  const hideModal = () => {
    hideViewModal();
    onDataUpdate();
  }

  const hideCreateModal = async (data) => {
    if (!data || data.isTrusted) {
      setCreateModalShow(false);
      return;
    }

    // need to remove some data from the payload that's not accepted by the API
    let {id, employer_id, opportunity_id, opportunity, date, student_id, student_name, institution_name, employer_name, opportunity_name, employment_connection_student, employment_connection_opportunity, registration_date_formatted, status_badge, role_or_designation, opportunity_icon, ...dataToSave} = data;
    dataToSave['start_date'] = data.start_date ? moment(data.start_date).format("YYYY-MM-DD") : null;
    dataToSave['end_date'] = data.end_date ? moment(data.end_date).format("YYYY-MM-DD") : null;
    dataToSave['salary_offered'] = data.salary_offered ? Number(data.salary_offered) : null;
    dataToSave['opportunity'] = data.opportunity_id;
    dataToSave['student'] = student_id

    createEmploymentConnection(dataToSave).then(data => {
      setAlert("Employment Connection created successfully.", "success");
    }).catch(err => {
      setAlert("Unable to create Employment Connection.", "error");
    }).finally(() => {
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
    let {id, offer_letter, experience_certificate, employer_id, created_at, opportunity_id, updated_at, opportunity_type, employer, date, student_id, student_name, institution_name, employer_name, opportunity_name, employment_connection_student, employment_connection_opportunity, registration_date_formatted, status_badge, role_or_designation, opportunity_icon, ...dataToSave} = data;
    dataToSave['start_date'] = data.start_date ? moment(data.start_date).format("YYYY-MM-DD") : null;
    dataToSave['end_date'] = data.end_date ? moment(data.end_date).format("YYYY-MM-DD") : null;
    dataToSave['salary_offered'] = data.salary_offered ? Number(data.salary_offered) : null;
    dataToSave['opportunity'] = data.opportunity_id;
    dataToSave['student'] = student_id;
    updateEmploymentConnection(Number(id), dataToSave).then(data => {
      setAlert("Employment Connection updated successfully.", "success");
    }).catch(err => {
      setAlert("Unable to update Employment Connection.", "error");
    }).finally(() => {
      onDataUpdate();
    });
    setUpdateModalShow(false);
  };


  const fileDelete = async (value) => {
    NP.start();
    deleteFile(selectedEmploymentConnection[value].id).then(data => {
      setAlert("Certificate deleted successfully.", "success");
    }).catch(err => {
      setAlert("Unable to delete Certificate.", "error");
    }).finally(() => {
      NP.done();
      setShowDeleteAlert(false);
      onDataUpdate();
      hideViewModal();
    });
  };

  const handleDelete = async () => {
    deleteEmploymentConnection(selectedEmploymentConnection.id).then(data => {
      setAlert("Employment Connection deleted successfully.", "success");
    }).catch(err => {
      setAlert("Unable to delete Employment Connection.", "error");
    }).finally(() => {
      setShowDeleteAlert(false);
      onDataUpdate();
    });
  };

  return (
    <div className="container-fluid my-3">
      <div className="row">
        <div className="col-md-6 col-sm-12 mb-4">
          <button
            className="btn btn-primary"
            onClick={() => setCreateModalShow(true)}
          >
            + Add More
          </button>
        </div>
      </div>
      <Table columns={columns} data={employmentConnectionsTableData} paginationPageSize={employmentConnectionsTableData.length} totalRecords={employmentConnectionsTableData.length} fetchData={() => {}} loading={false} showPagination={false} onRowClick={handleRowClick} />
      <EmploymentConnection
        show={viewModalShow}
        onHide={hideViewModal}
        handleEdit={handleViewEdit}
        handleDelete={handleViewDelete}
        student={selectedEmploymentConnection.student}
        employmentConnection={selectedEmploymentConnection}
        onDelete={fileDelete}
        onUpdate={hideModal}
      />
      <CreateEmploymentConnectionForm
        show={createModalShow}
        onHide={hideCreateModal}
        employer={employer}
        rejectionfeild={false}
      />
      <UpdateEmploymentConnectionForm
        show={updateModalShow}
        onHide={hideUpdateModal}
        employer={employer}
        rejectionfeild={false}
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
            <span className="text--primary latto-bold">Delete Employment Connection?</span>
          }
          customButtons={
            <>
              <button
                onClick={() => setShowDeleteAlert(false)}
                className="btn btn-secondary mx-2 px-4"
              >
                Cancel
              </button>
              <button onClick={() => handleDelete()} className="btn btn-danger mx-2 px-4">
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

export default connect(mapStateToProps, mapActionsToProps)(EmploymentConnections);
