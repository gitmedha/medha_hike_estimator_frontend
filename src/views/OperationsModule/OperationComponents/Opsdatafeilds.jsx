import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import DetailField from "../../../components/content/DetailField";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { connect } from "react-redux";
import styled from "styled-components";
import { isAdmin, isMedhavi, isSRM } from "../../../common/commonFunctions";
import OperationDataupdateform from "./OperationDataupdateform";
import {deactivate_user_ops} from "./operationsActions";
import Deletepopup from "./Deletepopup";
import { Link } from "react-router-dom";
import { Anchor } from "../../../components/content/Utils";

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

const Opsdatafeilds = (props) => {
  let { onHide,refreshTableOnDataSaving,refreshTableOnDeleting} = props;
  const { setAlert } = props;
  const [showModal, setShowModal] = useState({
    dataAndEdit:false,
    delete:false
  });
  const [operationdata] = useState(props);
  const hideShowModal1 = async (data) => {
    if (!data || data.isTrusted) {
      onHide()
      return 0;
    }else{
      onHide()
    }

  };
 
  const updatevalue = () => {
    setShowModal({
      ...showModal,
      dataAndEdit:true
    });
  };
  const closepop =()=>{
   
    setShowModal({
      ...showModal,
      delete:false,
    });
  }

  const deleteEntry=async()=>{
   const data=await deactivate_user_ops(Number(props.id))
   if(data.status===200){
    setAlert("Entry Deleted Successfully.", "success");
    refreshTableOnDeleting()
    onHide()
   }else{
    setAlert("Not Able to delete", "Danger");
    onHide()
   }
   
   
  }

  const closeThepopup =async () =>{
    // 
    
    setShowModal({
      ...showModal,
      delete:true,
      dataAndEdit:false 
    });
  }

  

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
              <h1 className="text--primary bebas-thick mb-0">
                Field Details
              </h1>
            </Modal.Title>
          </Modal.Header>
          <Styled>
            <Modal.Body className="bg-white">
              <h4 className="section-header ">Basic Info</h4>
              <div className="row  ">
              <div className="col-md-6 col-sm-12">
    <DetailField className='' Bold={""} label="Activity Type" value={props.activity_type} />
    <DetailField className='' Bold={""} label="Batch" value={<Anchor text={props.batch?.name} target="_blank" rel="noopener noreferrer" href={`/batch/${props.batch?.id}`} />} />
    <DetailField className='' Bold={""} label="Start Date" value={moment(props.start_date).format("DD MMM YYYY") ? moment(props.start_date).format("DD MMM YYYY") : ""} />
    <DetailField className='' Bold={""} label="Donor" value={props.donor ? "Yes" : "No"} />
    <DetailField className='' Bold={""} label="Guest Name" value={props.guest} />
    <DetailField className='' Bold={""} label="Organization" value={props.organization} />
    <DetailField className='' Bold={""} label="Student Attended" value={props.students_attended} />
    
  </div>
  <div className="col-md-6 col-sm-12">
    <DetailField className='' label="Assigned to" value={props.assigned_to?.username ? props.assigned_to?.username : ""} Bold={""} />
    <DetailField className='' Bold={""} label="Institution" value={<Anchor text={props.institution?.name} target="_blank" rel="noopener noreferrer" href={`/institution/${props.institution?.id}`} />} />
    <DetailField className='' Bold={""} label="End Date" value={moment(props.end_date).format("DD MMM YYYY") ? moment(props.end_date).format("DD MMM YYYY") : ""} />
    <DetailField className='' Bold={""} label="Topic" value={props.topic} />
    <DetailField className='' Bold={""} label="Designation" value={props.designation ? props.designation : "Not found"} />
    <DetailField className='' Bold={""} label="Program Name" value={props.program_name ? props.program_name : "Not found"} />
    <DetailField className='' Bold={""} label="Student Type" value={props.student_type}/>
  </div>
              </div>
              <div className="">
                <hr className="mb-4 opacity-1" style={{ color: "#C4C4C4" }} />
                <h4 className="section-header">Address Info</h4>

                <div className="row  ">
                  <div className="col-md-6 col-sm-12">
                    <DetailField Bold={""} label="State" value={props.state} />
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <DetailField
                      Bold={""}
                      label="Medha Area"
                      value={props.area}
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
                        props.createdby
                          ? props.createdby.username
                          : "not found"
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
                        props.updatedby
                          ? props.updatedby.username
                          : "not found"
                      }
                    />
                    <DetailField
                      Bold={""}
                      label="Updated At"
                      value={props.updated_at ? moment(props.updated_at).format(
                        "DD MMM YYYY, h:mm a"
                      ): "not found"}
                    />
                  </div>
                </div>

                {/* <DetailField label="Assigned to" value={props.institute.name} /> */}
              </div>
            </Modal.Body>
            {(isSRM() ||isMedhavi() || isAdmin()) && (
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
      {
        showModal.dataAndEdit &&
        (
          <OperationDataupdateform
            {...operationdata}
            show={showModal}
            onHide={hideShowModal1}
            refreshTableOnDataSaving={refreshTableOnDataSaving}
          />
        )
      }
      {

showModal.delete && (
  <Deletepopup  setShowModal={closepop} deleteEntry={deleteEntry}/>
)
      }
    </>
  );
};

// export default Opsdatafeilds;

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Opsdatafeilds);
