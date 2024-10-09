import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import DetailField from "../../../components/content/DetailField";
import { Anchor, } from "../../../components/content/Utils";
import {
  getEmploymentConnectionsPickList,
  getOpportunitiesPickList,
} from "./StudentActions";
import styled from "styled-components";
import { isAdmin, isMedhavi, isSRM } from "../../../common/commonFunctions";
import Opsdatafeilds from "./Opsdatafeilds";
import UpskillUpdate from "./UpskillUpdate";
import { deactivate_user_students_upskills } from "./operationsActions";
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

const Upskillingdatafield = (props) => {
  let { onHide,refreshTableOnDataSaving,refreshTableOnDeleting } = props;
  const [showedit, setshowedit] = useState({
    dataAndEdit:false,
    delete:false
  });
  
  const [operationdata, setoperationdata] = useState(props);
  const hideShowModal1 = async (data) => {
    if (!data || data.isTrusted) {
      onHide()
      return 0;
    }else{
      onHide()
    }
  };
  useEffect(() => {
    setoperationdata(props);
  }, []);
  const updatevalue = () => {
    setshowedit({
      ...showedit,
      dataAndEdit:true
    });
  };

  const closeThepopup =async () =>{
    setshowedit({
      ...showedit,
      dataAndEdit:false,
      delete:true
    });
  }

  const deleteEntry=async()=>{
    const data=await deactivate_user_students_upskills(Number(props.id))
    if(data.status==200){
     setAlert("Entry Deleted Successfully.", "success");
     refreshTableOnDeleting()
     onHide()
    }else{
     setAlert("Not Able to delete", "Danger");
     onHide()
    }
    
    
   }

   const closepop =()=>{
   
    setshowedit({
      ...showedit,
      delete:false,
    });
  }
  return (
    <>
      {!showedit.dataAndEdit && (
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
                Student Upskilling Details
              </h1>
            </Modal.Title>
          </Modal.Header>
          <Styled>
            <Modal.Body className="bg-white">
              <h4 className="section-header ">Basic Info</h4>
              <div className="row  ">
                <div className="col-md-6 col-sm-12">
                <DetailField
                    
                    label="Student Name"
                    value={<Anchor text={props.student_id.full_name} target="_blank" rel="noopener noreferrer" href={`/student/${props.student_id?.id}`} />}
                  />
                  
                  <DetailField
                    Bold={""}
                    label="Batch"
                    value={<Anchor text={props.batch?.name} target="_blank" rel="noopener noreferrer" href={`/batch/${props.batch?.id}`} />}
                  />
                  <DetailField
                    
                    label="Start Date"
                    value={
                      moment(props.start_date).format("DD MMM YYYY")
                        ? moment(props.start_date).format("DD MMM YYYY")
                        : ""
                    }
                  />
                  <DetailField
                    
                    label="Certificate Received"
                    value={props.certificate_received ? "Yes" : "No"}
                  />

                  
                  <DetailField
                    
                    label="Course Name"
                    value={props.course_name}
                  />
                  <DetailField
                    
                    label="Category"
                    value={props.category}
                  />
                  <DetailField
                    
                    label="Issued Org"
                    value={props.issued_org}
                  />
                  
                </div>

                <div className="col-md-6 col-sm-12">
                  <DetailField
                    
                    label="Assigned to"
                    value={
                      props.assigned_to?.username
                        ? props.assigned_to?.username
                        : ""
                    }
                  />
                 <DetailField
                    Bold={""}
                    label="Institute"
                    value={<Anchor text={props.institution?.name} target="_blank" rel="noopener noreferrer" href={`/institution/${props.institution?.id}`} />}
                  />
                  <DetailField
                    
                    label="End Date"
                    value={
                      moment(props.end_date).format("DD MMM YYYY")
                        ? moment(props.end_date).format("DD MMM YYYY")
                        : ""
                    }
                  />
                <DetailField
                    label="Published At"
                    value={
                      moment(props.published_at).format("DD MMM YYYY")
                        ? moment(props.published_at).format("DD MMM YYYY")
                        : ""
                    }
                  />
                  <DetailField label="Sub Category" value={props.sub_category} />
                </div>
              </div>

              <hr className="mb-4 opacity-1" style={{ color: "#C4C4C4" }} />
              <h3 className="section-header ">Other Info</h3>
              <div className="row">
                      <div className="col-md-6">
                        <DetailField
                          label="Updated By"
                          value={
                            props.updatedby?.userName
                              ? props.updatedby?.userName
                              : props.createdby?.username
                          }
                        />
                        <DetailField
                          label="Updated At"
                          value={moment(
                            props.updated_at
                              ? props.updated_at
                              : ""
                          ).format("DD MMM YYYY, h:mm a")}
                        />
                      </div>
                      <div className="col-md-6">
                        <DetailField
                          label="Created By"
                          value={
                            props.createdby?.username
                              ? props.createdby?.username
                              : ""
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

      { showedit.dataAndEdit &&
        (
          <UpskillUpdate
            {...operationdata}
            show={showedit}
            onHide={hideShowModal1}
            refreshTableOnDataSaving={refreshTableOnDataSaving}
          />
        )
      }

      {
       showedit.delete && (
        <Deletepopup  setShowModal={closepop} deleteEntry={deleteEntry}/>
      ) 
      }
    </>
  );
};

export default Upskillingdatafield;
