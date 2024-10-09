import NP from "nprogress";
import api from "../../apis";
import { connect } from "react-redux";
import Address from "./EmployerComponents/Address";
import Details from "./EmployerComponents/Details";
import Contacts from "./EmployerComponents/Contacts";
import { useState, useEffect } from "react";
import { TitleWithLogo } from "../../components/content/Avatar";
import SkeletonLoader from "../../components/content/SkeletonLoader";
import Collapsible from "../../components/content/CollapsiblePanels";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { useHistory } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import { GET_EMPLOYER, UPDATE_EMPLOYER } from "../../graphql";
import { deleteEmployer, updateEmployer, getEmployerEmploymentConnections } from "./EmployerComponents/employerAction";
import EmployerForm from "./EmployerComponents/EmployerForm";
import Opportunities from "./EmployerComponents/Opportunities";
import { getEmployerOpportunities } from "../Students/StudentComponents/StudentActions";
import { FaBlackTie, FaBriefcase } from "react-icons/fa";
import Tooltip from "../../components/content/Tooltip";
import styled from 'styled-components';
import EmploymentConnections from "./EmployerComponents/EmploymentConnections";
import { deleteFile } from "../../common/commonActions";
import {isAdmin,getUser} from "../../common/commonFunctions";

const Styled = styled.div`
.button {
  padding: 6px 43px !important;
}

@media screen and (max-width: 360px) {
 .btn-box{
   margin-left: 20px;
  }
 .section-badge {
   margin-left: 2px;
   padding: 0px 20px !important;
  }
}
`
const Employer = (props) => {
  const [isLoading, setLoading] = useState(false);
  const [employerData, setEmployerData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [employerOpportunities, setEmployerOpportunities] = useState([]);
  const [opportunitiesBadge, setOpportunitiesBadge] = useState(<></>);
  const { address, contacts, ...rest } = employerData;
  const [employerEmploymentConnections, setEmployerEmploymentConnections] = useState([]);
  const {setAlert} = props;
  const history = useHistory();
  const employerId = props.match.params.id;

  const hideUpdateModal = async (data) => {
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }
    let {id, show, created_at, created_by_frontend, updated_by_frontend, updated_at, mou_file, ...dataToSave} = data;
    if (typeof data.logo === 'object') {
      dataToSave['logo'] = data.logo?.id;
    }

    NP.start();
    updateEmployer(Number(id), dataToSave).then(data => {
      setAlert("Employer updated successfully.", "success");
    }).catch(err => {
      setAlert("Unable to update employer.", "error");
    }).finally(() => {
      NP.done();
      getThisEmployer();
    });
    setModalShow(false);
  };

  const handleDelete = async () => {
    NP.start();
    deleteEmployer(employerData.id).then(data => {
      setAlert("Employer deleted successfully.", "success");
    }).catch(err => {
      setAlert("Unable to delete employer.", "error");
    }).finally(() => {
      setShowDeleteAlert(false);
      NP.done();
      history.push("/employers");
    });
  }

  const getThisEmployer = async () => {
    setLoading(true);
    NP.start();
    try {
      let { data } = await api.post("/graphql", {
        query: GET_EMPLOYER,
        variables: { id: employerId },
      });
      setEmployerData(data.data.employer);
    } catch (err) {
    }finally {
      setLoading(false);
      NP.done();
    }
  };

  const updateOpportunitiesBadge = (opportunities) => {
    let jobOpportunities = opportunities.filter(opportunity => opportunity.type.toLowerCase() === 'job');
    let internshipOpportunities = opportunities.filter(opportunity => opportunity.type.toLowerCase() === 'internship');
    setOpportunitiesBadge(
      <>
       <Tooltip  placement="top" title="Internships">
        <FaBlackTie width="15" color="#D7D7E0" className="ml-2" />
      </Tooltip>
        <span style={{margin: '0 20px 0 10px', color: "#FFFFFF", fontSize: '16px'}}>{internshipOpportunities.length}</span>
      <Tooltip placement="top" title="Jobs">
        <FaBriefcase width="15" color="#D7D7E0" />
      </Tooltip>
      <span style={{margin: '0 0 0 10px', color: "#FFFFFF", fontSize: '16px'}}>{jobOpportunities.length}</span>

      </>
    );
  }

  const getEmploymentConnections = async () => {
    getEmployerEmploymentConnections(employerId).then(data => {
      let employmentConnections = data.data.data.employmentConnectionsConnection.values;
      setEmployerEmploymentConnections(employmentConnections);
    }).catch(err => {
    });
  }

  const getOpportunities = () => {
    getEmployerOpportunities(employerId).then(data => {
      setEmployerOpportunities(data.data.data.opportunities);
      updateOpportunitiesBadge(data.data.data.opportunities);
    });
  }

  useEffect(() => {
    getThisEmployer();
    getOpportunities();
    getEmploymentConnections();
  }, [employerId]);

  const handleMouDelete = async () => {
    NP.start();
    deleteFile(employerData.mou_file.id).then(data => {
      setAlert("File deleted successfully.", "success");
    }).catch(err => {
      setAlert("Unable to delete file.", "error");
    }).finally(() => {
      setShowDeleteAlert(false);
      NP.done();
      history.push("/employer/" . id);
      getThisEmployer();
    });
  };


  const isValidUser = () =>{
    if(Object.keys(employerData).length > 0) {
      return employerData.assigned_to.username.toLowerCase() === getUser().toLowerCase();
    }
  }

  if (isLoading) {
    return <SkeletonLoader />;
  } else {
    return (
      <Styled>
        <>
        {(isValidUser() || isAdmin()) && <div className="row" style={{margin: '30px 0 0'}}>
          <div className="col-12 d-flex">
            <button
              onClick={() => setModalShow(true)}
              style={{ marginLeft: "0px" }}
              className="btn--primary action_button_sec"
            >
              EDIT
            </button>
            <button onClick={() => setShowDeleteAlert(true)} className="btn--primary action_button_sec">
              DELETE
            </button>
          </div>
        </div>}
        <Collapsible
          opened={true}
          titleContent={
            <TitleWithLogo
              done={() => getThisEmployer()}
              id={rest.id}
              logo={rest.logo}
              title={rest.name}
              query={UPDATE_EMPLOYER}
              icon="employer"
            />
          }
        >
          <Details {...employerData} onMouUpdate={getThisEmployer} onMouDelete={handleMouDelete} />
        </Collapsible>
        <Collapsible title="Address">
          <Address {...employerData} />
        </Collapsible>
        <Collapsible title="Contacts" badge={employerData?.contacts?.length}>
          <Contacts contacts={contacts} id={rest.id} />
        </Collapsible>
        <Collapsible title="Opportunities" badge={opportunitiesBadge}>
          <Opportunities opportunities={employerOpportunities} employer={employerData} onDataUpdate={getOpportunities} />
        </Collapsible>
        <Collapsible title="Employment Connections" badge={employerEmploymentConnections.length}>
            <EmploymentConnections employmentConnections={employerEmploymentConnections} employer={employerData} onDataUpdate={getEmploymentConnections} />
          </Collapsible>
        <EmployerForm
          {...employerData}
          show={modalShow}
          onHide={hideUpdateModal}
        />
        <SweetAlert
          danger
          showCancel
          btnSize="md"
          show={showDeleteAlert}
          onConfirm={() => handleDelete()}
          onCancel={() => setShowDeleteAlert(false)}
          title={
            <span className="text--primary latto-bold">Delete {employerData.name}?</span>
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
            <p>Are you sure, you want to delete this employer?</p>
          </SweetAlert>
        </>
      </Styled>
    );
  }
};
const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Employer);
