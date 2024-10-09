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
import { isAdmin, isSRM } from "../../../common/commonFunctions";
import Dtesamarthedit from "./Dtesamarthedit";
import { deactivate_user_dte_samarth } from "./operationsActions";

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

const Dtesamarthdatafield = (props) => {
  let { onHide } = props;
  const [showModal, setShowModal] = useState(false);
  const [operationdata, setoperationdata] = useState(props);
  const hideShowModal1 = async (data) => {
    if (!data || data.isTrusted) {
      onHide()
      return 0;
    }else{
      onHide()
    }
  };

  const updatevalue = () => {
    setShowModal(true);
  };
  const closeThepopup =async () =>{
    deactivate_user_dte_samarth(Number(props.id))
    onHide()
  }

  return (
    <>
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
            <h1 className="text--primary bebas-thick mb-0">SDIT Details</h1>
          </Modal.Title>
        </Modal.Header>
        <Styled>
          <Modal.Body className="bg-white">
            <h4 className="section-header ">Basic Info</h4>
            <div className="row  ">
              <div className="col-md-6 col-sm-12">
                <DetailField
                  label="Student Name"
                  value={props.student_name ? props.student_name : ""}
                />
                <DetailField label="DOB" value={props.dob} />
                <DetailField label="Mobile" value={props.mobile} />

                <DetailField label="Batch" value={props.batch_name} />
                <DetailField
                  label="Annual Income"
                  value={props.annual_income}
                />
                <DetailField label="Course Name" value={props.course_name} />
              </div>

              <div className="col-md-6 col-sm-12">
                <DetailField
                  label="Father/Gaurdian"
                  value={props.father_guardian}
                />
                <DetailField
                  label="Gender"
                  value={props.gender ? props.gender : ""}
                />

                <DetailField label="Email" value={props.email} />
                <DetailField label="Institute" value={props.institution_name} />
                <DetailField
                  label="Self Employed"
                  value={props.self_employed}
                />
                <DetailField label="Acad Year" value={props.acad_year} />
                <DetailField label="Result" value={props.result} />
              </div>
            </div>
            <hr className="mb-4 opacity-1" style={{ color: "#C4C4C4" }} />
            <h4 className="section-header ">Company Info</h4>
            <div className="row  ">
              <div className="col-md-6 col-sm-12">
                <DetailField
                  label="Company Placed"
                  value={props.company_placed ? props.company_placed : ""}
                />
                <DetailField label="Position" value={props.position} />

                <DetailField
                  label="Manthly Salary"
                  value={props.monthly_salary}
                />
                <DetailField label="Trade" value={props.trade} />
                <DetailField label="Data Flag" value={props.data_flag} />
              </div>

              <div className="col-md-6 col-sm-12">
                <DetailField
                  label="company_apprenticed"
                  value={props.company_apprenticed}
                />
                <DetailField label="Company Self" value={props.company_self} />
                <DetailField
                  label="Apprenticeship"
                  value={props.apprenticeship}
                />
                <DetailField label="Placed" value={props.placed} />
              </div>
            </div>
            <hr className="mb-4 opacity-1" style={{ color: "#C4C4C4" }} />
            <h4 className="section-header">Address Info</h4>

            <div className="row  ">
              <div className="col-md-6 col-sm-12">
                <DetailField Bold={""} label="State" value={props.state} />
              </div>

              <div className="col-md-6 col-sm-12">
                <DetailField Bold={""} label="District" value={props.district} />
              </div>
            </div>
            <hr className="mb-4 opacity-1" style={{ color: "#C4C4C4" }} />
            <h3 className="section-header ">Other Info</h3>
            <div className="row  ">
              <div className="col-md-6 col-sm-12">
                
                <DetailField
                  Bold={""}
                  label="Created At"
                  value={moment(
                    props.created_at
                      ? props.created_at
                      : props.created_at
                  ).format("DD MMM YYYY, h:mm a")}
                />
              </div>

              <div className="col-md-6 col-sm-12">
               
                <DetailField
                  Bold={""}
                  label="Updated At"
                  value={moment(
                    props.updated_at
                      ? props.updated_at
                      : props.created_at
                  ).format("DD MMM YYYY, h:mm a")}
                />
              </div>
            </div>
          </Modal.Body>
          {(isSRM() || isAdmin()) && (
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
                  onClick={()=>closeThepopup()}
                  className="btn btn-danger px-4 mx-4"
                >
                  Go Back
                </button>
              </div>
            </div>
          )}
        </Styled>
      </Modal>

      {showModal ? (
        <Dtesamarthedit
          {...operationdata}
          show={showModal}
          onHide={hideShowModal1}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Dtesamarthdatafield;
