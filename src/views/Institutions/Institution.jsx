import NP from "nprogress";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import api from "../../apis";
import Address from "./InstitutionComponents/Address";
import Contacts from "./InstitutionComponents/Contacts";
import Details from "./InstitutionComponents/Details";
import ProgramEnrollments from "./InstitutionComponents/ProgramEnrollments";
import { GET_INSTITUTE, UPDATE_INSTITUTION } from "../../graphql";
import { TitleWithLogo } from "../../components/content/Avatar";
import Collapsible from "../../components/content/CollapsiblePanels";
import SkeletonLoader from "../../components/content/SkeletonLoader";
import { setAlert } from "../../store/reducers/Notifications/actions";
import {
  deleteInstitution,
  updateInstitution,
  getInstitutionProgramEnrollments,
} from "./InstitutionComponents/instituteActions";
import InstitutionForm from "./InstitutionComponents/InstitutionForm";
import { uploadFile } from "../../components/content/Utils";
import styled from "styled-components";
import MoUs from "./InstitutionComponents/MoUs";

const Styled = styled.div`
  .button {
    font-size: 16px;
    margin: auto 10px;
    border-radius: 5px;
    font-family: Latto-Bold;
    padding: 6px 43px !important;
  }

  @media screen and (max-width: 360px) {
    .section-badge {
      margin-left: 2px;
      padding: 0px 20px !important;
    }
  }
`;

const Institute = (props) => {
  const [institutionProgramEnrollments, setInstitutionProgramEnrollments] =
    useState([]);
  const [isLoading, setLoading] = useState(false);
  const [instituteData, setInstituteData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const history = useHistory();
  const { setAlert } = props;
  const { address, contacts, mou, ...rest } = instituteData;
  const instituteID = props.match.params.id;
  const [programEnrollmentAggregate, setProgramEnrollmentAggregate] = useState(
    []
  );

  const hideUpdateModal = async (data) => {
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // need to remove id and show from the payload
    let {
      id,
      show,
      mou,
      created_at,
      updated_at,
      created_by_frontend,
      updated_by_frontend,
      ...dataToSave
    } = data;
    if (typeof data.logo === "object") {
      dataToSave["logo"] = data.logo?.id;
    }

    dataToSave["mou"] = [];
    if (mou && mou.length) {
      await Promise.all(
        mou.map(async (mouData) => {
          try {
            if (mouData.mou_file && mouData.mou_file.id) {
              dataToSave["mou"].push({
                ...mouData,
                mou_file: mouData.mou_file.id,
              });
            } else {
              const response = await uploadFile(mouData.mou_file);
              dataToSave["mou"].push({
                ...mouData,
                mou_file: response.data.data.upload.id,
              });
            }
          } catch (err) {
            setAlert("Unable to upload MoU.", "error");
          }
        })
      );
    }
    updateInstitutionApi(id, dataToSave);
  };

  const updateInstitutionApi = (id, dataToSave) => {
    NP.start();
    updateInstitution(Number(id), dataToSave)
      .then((data) => {
        setAlert("Institution updated successfully.", "success");
      })
      .catch((err) => {
        setAlert("Unable to update institution.", "error");
      })
      .finally(() => {
        NP.done();
        getThisInstitution();
      });
    setModalShow(false);
  };

  const handleDelete = async () => {
    NP.start();
    deleteInstitution(instituteData.id)
      .then((data) => {
        setAlert("Institution deleted successfully.", "success");
      })
      .catch((err) => {
        setAlert("Unable to delete institution.", "error");
      })
      .finally(() => {
        setShowDeleteAlert(false);
        NP.done();
        history.push("/institutions");
      });
  };

  const getThisInstitution = async () => {
    setLoading(true);
    NP.start();
    try {
      let { data } = await api.post("/graphql", {
        query: GET_INSTITUTE,
        variables: { id: instituteID },
      });
      setInstituteData(data.data.institution);
    } catch (err) {
    } finally {
      setLoading(false);
      NP.done();
    }
  };

  const getProgramEnrollments = async () => {
    getInstitutionProgramEnrollments(instituteID)
      .then((data) => {
        setInstitutionProgramEnrollments(
          data.data.data.programEnrollmentsConnection.values
        );
        setProgramEnrollmentAggregate(
          data?.data?.data?.programEnrollmentsConnection?.aggregate
        );
      })
      .catch((err) => {
      });
  };

  useEffect(()=>{
    getThisInstitution();
    getProgramEnrollments();
  }, [instituteID]);

  if (isLoading) {
    return <SkeletonLoader />;
  } else {
    return (
      <Styled>
        <>
          <div className="row" style={{ margin: "30px 0 0" }}>
            <div className="col-12 d-flex">
              <button
                onClick={() => setModalShow(true)}
                style={{ marginLeft: "0px" }}
                className="btn--primary action_button_sec"
              >
                EDIT
              </button>
              <button
                onClick={() => setShowDeleteAlert(true)}
                className="btn--primary action_button_sec"
              >
                DELETE
              </button>
            </div>
          </div>
          <Collapsible
            opened={true}
            titleContent={
              <TitleWithLogo
                done={() => getThisInstitution()}
                id={rest.id}
                logo={rest.logo}
                title={rest.name}
                query={UPDATE_INSTITUTION}
              />
            }
          >
            <Details {...instituteData} />
          </Collapsible>
          <Collapsible title="Address">
            <Address {...instituteData} id={rest.id} />
          </Collapsible>
          <Collapsible title="MoU" badge={instituteData?.mou?.length}>
            <MoUs mou={mou} id={rest.id} />
          </Collapsible>
          <Collapsible title="Contacts" badge={instituteData?.contacts?.length}>
            <Contacts contacts={contacts} id={rest.id} />
          </Collapsible>
          <Collapsible
            title="Program Enrollments"
            badge={programEnrollmentAggregate.count}
          >
            <ProgramEnrollments
              programEnrollments={institutionProgramEnrollments}
              onDataUpdate={getProgramEnrollments}
              institution={instituteData}
              id={instituteID}
            />
          </Collapsible>
          <InstitutionForm
            {...instituteData}
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
              <span className="text--primary latto-bold">
                Delete {instituteData.name}?
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
            <p>Are you sure, you want to delete this institution?</p>
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

export default connect(mapStateToProps, mapActionsToProps)(Institute);
