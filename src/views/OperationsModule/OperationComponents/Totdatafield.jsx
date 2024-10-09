import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import DetailField from "../../../components/content/DetailField";
import { Anchor, Badge } from "../../../components/content/Utils";
import CertificateUpload from "../../../components/content/Certificate";
import Tooltip from "../../../components/content/Tooltip";
import { urlPath } from "../../../constants";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import {
  getEmploymentConnectionsPickList,
  getOpportunitiesPickList,
} from "./StudentActions";
import { UPDATE_EMPLOYMENT_CONNECTION } from "../../../graphql";
import styled from "styled-components";
import { isAdmin, isMedhavi, isSRM } from "../../../common/commonFunctions";
import TotEdit from "./TotEdit";
import { deactivate_user_tots ,fetchAllStudents} from "./operationsActions";
import Deletepopup from "./Deletepopup";
import { setAlert } from "../../../store/reducers/Notifications/actions";

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

const Totdatafield = (props) => {
  let { onHide ,refreshTableOnDataSaving,refreshTableOnDeleting} = props;
  const [showModal, setShowModal] = useState({
    dataAndEdit:false,
    delete:false
  });
  const [operationdata, setoperationdata] = useState(props);
  const hideShowModal1 = async (data) => {
    if (!data || data.isTrusted) {
      setShowModal(false);
      onHide()
      return 0;
    }
    else{
      onHide();
    }
    
  };
  useEffect(() => {
    setoperationdata(props);
  }, [props]);
  
  const closeThepopup =async () =>{
    setShowModal({
      ...showModal,
      delete:true,
      dataAndEdit:false 
    });
  }

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
    const data=await deactivate_user_tots(Number(props.id))
    if(data.status==200){
     setAlert("Entry Deleted Successfully.", "success");
     refreshTableOnDeleting()
     onHide()
    }else{
     setAlert("Not Able to delete", "Danger");
     onHide()
    }
    
    
   }
  useEffect(()=>{
    fetchAllStudents()
  },[])
  return (
    <>
      {!showModal.dataAndEdit &&(
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
              <h1 className="text--primary bebas-thick mb-0">
                User TOt Details
              </h1>
            </Modal.Title>
          </Modal.Header>
          <Styled>
            <Modal.Body className="bg-white">
              <h4 className="section-header ">Basic Info</h4>
              <div className="row  ">
                <div className="col-md-6 col-sm-12">
                  <DetailField
                    label="Participant Name"
                    value={props.user_name}
                  />
                  <DetailField
                    label="Trainer 1"
                    value={props.trainer_1?.username}
                  />
                  <DetailField
                    label="Project Name"
                    value={props.project_name}
                  />
                  {/* */}
                  <DetailField
                    Bold={""}
                    label="Start Date"
                    value={
                      moment(props.start_date).format("DD MMM YYYY")
                        ? moment(props.start_date).format("DD MMM YYYY")
                        : ""
                    }
                  />
                  <DetailField
                    label="Project Type"
                    value={props.project_type}
                  />

                  <DetailField
                    label="Partner Department"
                    value={props.partner_dept}
                  />
                  <DetailField label="Age" value={props.age} />
                  <DetailField label="Contact" value={props.contact} />
                  {/* <DetailField
                    label="Published at"
                    value={
                      moment(props.published_at).format("DD MMM YYYY")
                        ? moment(props.published_at).format("DD MMM YYYY")
                        : ""
                    }
                  /> */}
                </div>

                <div className="col-md-6 col-sm-12">
                  {/* <DetailField
                    label="Trainer Name"
                    value={props.trainer_1.id}
                  /> */}
                  {console.log(props)}
                  <DetailField label="Module Name" value={props.module_name} />
                  <DetailField
                    label="Trainer 2"
                    value={props.trainer_2?.username}
                  />
                  <DetailField label="New Entry" value={props.new_entry ? "Yes":"No"} />
                  <DetailField
                    Bold={""}
                    label="End Date"
                    value={
                      moment(props.end_date).format("DD MMM YYYY")
                        ? moment(props.end_date).format("DD MMM YYYY")
                        : ""
                    }
                  />

                  <DetailField label="College" value={props.college} />

                  <DetailField
                    label="Gender"
                    value={props.gender ? props.gender : ""}
                    Bold={""}
                  />
                  <DetailField label="Designation" value={props.designation} />
                </div>
              </div>
              <hr className="mb-4 opacity-1" style={{ color: "#C4C4C4" }} />
              <h4 className="section-header">Address Info</h4>

              <div className="row  ">
                <div className="col-md-6 col-sm-12">
                  <DetailField Bold={""} label="State" value={props.state} />
                </div>

                <div className="col-md-6 col-sm-12">
                  <DetailField Bold={""} label="City" value={props.city} />
                </div>
              </div>

              <hr className="mb-4 opacity-1" style={{ color: "#C4C4C4" }} />
              <h3 className="section-header ">Other Info</h3>
              <div className="row">
                <div className="col-md-6">
                  <DetailField
                    label="Updated By"
                    value={
                      props.updatedby?.username
                        ? props.updatedby?.username
                        : ""
                    }
                  />
                  <DetailField
                    label="Updated At"
                    value={moment(
                      props.updated_at ? props.updated_at : props.created_at
                    ).format("DD MMM YYYY, h:mm a")}
                  />
                </div>
                <div className="col-md-6">
                  <DetailField
                    label="Created By"
                    value={
                      props.createdby?.username ? props.createdby?.username : ""
                    }
                  />
                  <DetailField
                    label="Created At"
                    value={moment(props.created_at).format(
                      "DD MMM YYYY, h:mm a"
                    )}
                  />
                </div>
              </div>
            </Modal.Body>
            {(isSRM() ||isMedhavi() || isAdmin()) && (
              <div className="row mt-4 mb-4">
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
                    Delete
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
          <TotEdit {...operationdata} show={showModal} onHide={hideShowModal1} refreshTableOnDataSaving={refreshTableOnDataSaving}/>
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

export default Totdatafield;
