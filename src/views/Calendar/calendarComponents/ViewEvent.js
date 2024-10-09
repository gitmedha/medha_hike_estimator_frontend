import React from "react";
import { Modal } from "react-bootstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import styled from "styled-components";
import moment from "moment";
import DetailField from "../../../components/content/DetailField";
import { FaEdit, FaTrash } from "react-icons/fa";
import { deleteEvent } from "./calendarActions";
import NP from "nprogress";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { isAdmin } from "../../../common/commonFunctions";
import { connect } from "react-redux";

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

function ViewEvent(props) {
  const {
    onHide,
    event,
    openEditForm,
    openDeleteAlert,
    setDeleteAlert,
    setAlert,
  } = props;

  const userEmail = localStorage.getItem("user_email");
  const handleDelete = async () => {
    try {
      NP.start();
      await deleteEvent(event.id);
      NP.done();
      setAlert("Event cancelled successfully.", "success");
      props.onRefresh();
      setDeleteAlert(false);
      props.onHide();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      {!openDeleteAlert ? (
        <Modal
          centered
          size="lg"
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
              <h1 className="text--primary bebas-thick mb-0">Event Info</h1>
            </Modal.Title>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              {isAdmin() || event.assgined_to.email === userEmail ? (
                <div
                  style={{ cursor: "pointer", marginRight: "10px" }}
                  onClick={() => openEditForm()}
                >
                  <FaEdit size={25} color="#808080" />
                </div>
              ) : (
                <div></div>
              )}
              {isAdmin() || event.assgined_to.email === userEmail ? (
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => setDeleteAlert(true)}
                >
                  <FaTrash size={22} color="red" />
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </Modal.Header>
          <Styled>
            <Modal.Body className="bg-white">
              <div className="row view_calendar_form_sec">
                <div className="col-md-6 col-sm-12 mb-2">
                  <DetailField
                    label="Assigned To"
                    value={event.assgined_to ? event.assgined_to.username : ""}
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-2">
                  <DetailField
                    label="Alumni Service"
                    value={event.alumni_service ? event.alumni_service : ""}
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-2">
                  <DetailField
                    label="Status"
                    value={event.status ? event.status : ""}
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-2">
                  <DetailField
                    label="Start Date"
                    value={
                      event.start_date
                        ? moment(event.start_date).format("DD MMM YYYY")
                        : ""
                    }
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-2">
                  <DetailField
                    label="End Date"
                    value={
                      event.end_date
                        ? moment(event.end_date).format("DD MMM YYYY")
                        : ""
                    }
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-2">
                  <DetailField
                    label="Location"
                    value={event.location ? event.location : ""}
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-2">
                  <DetailField
                    label="Participants"
                    value={event.participants ? event.participants : ""}
                  />
                </div>
              </div>
            </Modal.Body>
          </Styled>
        </Modal>
      ) : (
        <SweetAlert
          danger
          showCancel
          btnSize="md"
          show={true}
          onConfirm={() => handleDelete()}
          onCancel={() => setDeleteAlert(false)}
          title={
            <span className="text--primary latto-bold">
              Delete {event.alumni_service}?
            </span>
          }
          customButtons={
            <>
              <button
                onClick={() => setDeleteAlert(false)}
                className="btn btn-secondary mx-2 px-4"
              >
                No
              </button>
              <button
                onClick={() => handleDelete()}
                className="btn btn-danger mx-2 px-4"
              >
                Yes
              </button>
            </>
          }
        >
          <p>Are you sure you want to delete this event?</p>
        </SweetAlert>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(ViewEvent);
