import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
// import DetailField from "../../../../components/DetailField";
import { setAlert } from "../../../../store/reducers/Notifications/actions";
import { connect } from "react-redux";
import styled from "styled-components";
import { isAdmin, isSRM } from "../../../../common/commonFunctions";
import OperationDataupdateform from "../OperationDataupdateform";
import {
  deactivate_mentorship,
  deactivate_user_ops,
  updateMentorshipData,
} from "../operationsActions";
import Deletepopup from "../Deletepopup";
import { Link } from "react-router-dom";
import { Anchor } from "../../../../components/content/Utils";
import UpdateMentorship from "./UpdateMentorship";
import DetailField from "src/components/content/DetailField";

const Styled = styled.div`
  .icon-box {
    display: flex;
    padding: 5px;
    justify-content: center;
  }
  .cv-icon {
    margin-right: 20px;
    padding: 8px;
    border: 1px solid transparent;
    border-radius: 50%;

    &:hover {
      background-color: #eee;
      box-shadow: 0 0 0 1px #c4c4c4;
    }
  }
  .section-header {
    color: #207b69;
    font-family: "Latto-Regular";
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 15px;
  }
`;

const MentorshipdataField = (props) => {
  let { onHide, refreshTableOnDataSaving, refreshTableOnDeleting } = props;
  const { setAlert } = props;
  const [showModal, setShowModal] = useState({
    dataAndEdit: false,
    delete: false,
  });
  const [operationdata] = useState(props);
  const hideShowModal1 = async (data) => {
    if (!data || data.isTrusted) {
      onHide();
      return 0;
    } else {
      onHide();
    }
  };

  const updatevalue = () => {
    setShowModal({
      ...showModal,
      dataAndEdit: true,
    });
  };
  const closepop = () => {
    setShowModal({
      ...showModal,
      delete: false,
    });
  };

  const deleteEntry = async () => {
    const data = await deactivate_mentorship(Number(props.id));
    if (data.status === 200) {
      setAlert("Entry Deleted Successfully.", "success");
      refreshTableOnDeleting();
      onHide();
    } else {
      setAlert("Not Able to delete", "Danger");
      onHide();
    }
  };

  const closeThepopup = async () => {
    //

    setShowModal({
      ...showModal,
      delete: true,
      dataAndEdit: false,
    });
  };
  console.log(props);

  return (
    <>
      {!showModal.dataAndEdit && (
        <Modal
          centered
          size="xl"
          show={true}
          onHide={onHide}
          animation={false}
          aria-labelledby="contained-modal-title-vcenter"
          className="form-modal"
        >
          <Modal.Header className="bg-white">
            <Modal.Title
              id="contained-modal-title-vcenter"
              className="d-flex align-items-center"
            >
              <h1 className="text--primary bebas-thick mb-0">Field Details</h1>
            </Modal.Title>
          </Modal.Header>
          <Styled>
            <Modal.Body className="bg-white">
              <h4 className="section-header ">Basic Info</h4>
              <div className="row  ">
                <div className="col-md-6 col-sm-12">
                  <DetailField
                    className=""
                    Bold={""}
                    label="Mentor Name"
                    value={props.mentor_name}
                  />
                  <DetailField
                    className=""
                    Bold={""}
                    label="Program Name"
                    value={props.program_name}
                  />
                  <DetailField
                    className=""
                    Bold={""}
                    label="Contact"
                    value={props.contact}
                  />
                  {/*  */}
                  <DetailField
                    className=""
                    Bold={""}
                    label="Outreach (Offline/Online)"
                    value={props.outreach}
                  />
                  {/*  */}
                  <DetailField
                    className=""
                    Bold={""}
                    label="Onboarding Date"
                    value={
                      moment(props.outreach).format("DD MMM YYYY")
                        ? moment(props.start_date).format("DD MMM YYYY")
                        : ""
                    }
                  />
                  <DetailField
                    className=""
                    Bold={""}
                    label="Email"
                    value={props.email}
                  />
                  <DetailField
                    className=""
                    Bold={""}
                    label="Mentor's Company Name"
                    value={props.mentor_company_name}
                  />
                  {/* <DetailField className='' Bold={""} label="Organization" value={props.organization} />
    <DetailField className='' Bold={""} label="Student Attended" value={props.students_attended} /> */}
                </div>
                <div className="col-md-6 col-sm-12">
                  <DetailField
                    className=""
                    label="Assigned to"
                    value={
                      props.assigned_to?.username
                        ? props.assigned_to?.username
                        : ""
                    }
                    Bold={""}
                  />
                  <DetailField
                    className=""
                    Bold={""}
                    label="Status"
                    value={props.status}
                  />

                  {/* contact */}
                  <DetailField
                    className=""
                    Bold={""}
                    label="Onboarding Date"
                    value={
                      moment(props.onboarding_date).format("DD MMM YYYY")
                        ? moment(props.end_date).format("DD MMM YYYY")
                        : ""
                    }
                  />
                  <DetailField
                    className=""
                    Bold={""}
                    label="Mentor's Domain"
                    value={props.mentor_domain}
                  />
                  <DetailField
                    className=""
                    Bold={""}
                    label="Medha Area"
                    value={
                      props.medha_area
                        ? props.medha_area
                        : "Not found"
                    }
                  />
                  <DetailField
                    className=""
                    Bold={""}
                    label="Designation"
                    value={props.designation ? props.designation : "Not found"}
                  />
                  <DetailField
                    className=""
                    Bold={""}
                    label="Social Media Profile Link"
                    value={
                      props.social_media_profile_link
                        ? props.social_media_profile_link
                        : "Not found"
                    }
                  />


                  {/* medha_area */}
                </div>
              </div>
              <div className="">
                <hr className="mb-4 opacity-1" style={{ color: "#C4C4C4" }} />
                <h4 className="section-header">Address Info</h4>

                <div className="row  ">
                  <div className="col-md-6 col-sm-12">
                    <DetailField
                      Bold={""}
                      label="Mentor State"
                      value={props.mentor_state}
                    />
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <DetailField
                      Bold={""}
                      label="Mentor Area"
                      value={props.mentor_area}
                    />
                  </div>
                </div>
                <hr className="mb-4 opacity-1" style={{ color: "#C4C4C4" }} />
                <h3 className="section-header ">Other Info</h3>
                <div className="row  ">
                  <div className="col-md-6 col-sm-12">
                    <DetailField
                      Bold={""}
                      label="Created By"
                      value={
                        props.createdby ? props.createdby.username : "not found"
                      }
                    />
                    <DetailField
                      Bold={""}
                      label="Created At"
                      value={moment(props.created_at).format(
                        "DD MMM YYYY, h:mm a"
                      )}
                    />
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <DetailField
                      Bold={""}
                      label="Updated By"
                      value={
                        props.updatedby ? props.updatedby.username : "not found"
                      }
                    />
                    <DetailField
                      Bold={""}
                      label="Updated At"
                      value={
                        props.updated_at
                          ? moment(props.updated_at).format(
                              "DD MMM YYYY, h:mm a"
                            )
                          : "not found"
                      }
                    />
                  </div>
                </div>

                {/* <DetailField label="Assigned to" value={props.institute.name} /> */}
              </div>
            </Modal.Body>
            {(isSRM() || isAdmin()) && (
              <div className="row mt-2 mb-4">
                <div className="col-md-12 d-flex justify-content-center">
                  <button
                    type="button"
                    onClick={() => updatevalue()}
                    className="btn btn-primary px-4 mx-4"
                  >
                    EDIT
                  </button>
                  <button
                    type="button"
                    onClick={() => closeThepopup()}
                    className="btn btn-danger px-4 mx-4"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            )}
          </Styled>
        </Modal>
      )}
      {showModal.dataAndEdit && (
        <UpdateMentorship
          {...operationdata}
          show={showModal}
          onHide={hideShowModal1}
          refreshTableOnDataSaving={refreshTableOnDataSaving}
        />
      )}
      {showModal.delete && (
        <Deletepopup setShowModal={closepop} deleteEntry={deleteEntry} />
      )}
    </>
  );
};

// export default MentorshipdataField;

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(MentorshipdataField);
