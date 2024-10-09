import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import DetailField from '../../../components/content/DetailField';
import { Anchor, Badge } from "../../../components/content/Utils";
import { getEmploymentConnectionsPickList, getOpportunitiesPickList } from "../../Students/StudentComponents/StudentActions";
import CertificateUpload from "../../../components/content/Certificate";
import { UPDATE_EMPLOYMENT_CONNECTION } from "../../../graphql";
import Tooltip from "../../../components/content/Tooltip";
import { urlPath } from "../../../constants";
import styled from "styled-components";
import { isAdmin,getUser } from "../../../common/commonFunctions";

const Styled = styled.div`
.icon-box{
  display:flex;
  padding: 5px;
  justify-content: center;
}
.cv-icon {
  margin-right: 20px;
  padding: 8px;
  border: 1px solid transparent;
  border-radius: 50%;

  &:hover {
    background-color: #EEE;
    box-shadow: 0 0 0 1px #C4C4C4;
  }
}
`;

const EmploymentConnection = (props) => {
  let { onDelete, onUpdate, onHide, show, handleEdit, handleDelete, student, employmentConnection } = props;
  const [employmentConnectionsPickList, setEmploymentConnectionsPickList] = useState([]);
  const [opportunitiesPickList, setOpportunitiesPickList] = useState([]);

  useEffect(() => {
    getEmploymentConnectionsPickList().then(data => {
      setEmploymentConnectionsPickList(data);
    });
    getOpportunitiesPickList().then(data => {
      setOpportunitiesPickList(data);
    });
  }, []);

  const isValidUser = () =>{
    console.log(employmentConnection)
    if(Object.keys(employmentConnection).length > 0 && employmentConnection.assigned_to) {
      return employmentConnection.assigned_to.username.toLowerCase() === getUser().toLowerCase();
    }
  }

  return (
    <Modal
      centered
      size="lg"
      show={show}
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
            Employment Connection Details
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Styled>
        <Modal.Body className="bg-white">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <DetailField label="Student" value={<Anchor text={student?.full_name} href={`/student/${student?.id}`}  />} />
              <DetailField label="Employer" value={<Anchor text={employmentConnection.opportunity && employmentConnection.opportunity.employer ? employmentConnection.opportunity.employer.name : ''} href={`/employer/${ employmentConnection?.opportunity?.employer?.id }`}  />} />
              <DetailField label="Opportunity" value={employmentConnection.opportunity ? employmentConnection.opportunity.role_or_designation : ''} />
              <DetailField label="Opportunity Type" value={employmentConnection.opportunity ? <Badge value={employmentConnection.opportunity.type} pickList={opportunitiesPickList.type} /> : ''} />
              <DetailField label="Status" value={<Badge value={employmentConnection.status} pickList={employmentConnectionsPickList.status} />} />
              <DetailField label="Work Engagement" value={employmentConnection.work_engagement} />
              {employmentConnection.opportunity && employmentConnection.opportunity.type === 'Internship' && <DetailField label="No. of internship hours" value={employmentConnection.number_of_internship_hours} />}
              <DetailField label="Upload Offer Letter" value= {
                employmentConnection.offer_letter &&
                <div>
                  <label>Certificate</label>
                  <p className="mb-0">(updated on: {moment(employmentConnection.offer_letter.updated_at).format("DD MMM YYYY")})</p>
                </div>
              }/>
              <div className ="row">
                <div className="col-md-6"></div>
                <div className="col-md-6 d-flex">
                  <div className="cv-icon">
                    <CertificateUpload query={UPDATE_EMPLOYMENT_CONNECTION} id={employmentConnection.id} certificate='offer_letter' done={() => onUpdate() } />
                  </div>
                  {employmentConnection.offer_letter &&
                    <div className="cv-icon">
                        <div className="col-md-1 d-flex flex-column section-cv">
                          <Tooltip placement="top" title="Click Here to View Offer Letter">
                            <a href={urlPath( employmentConnection.offer_letter?.url)} target="_blank" ><FaEye size="27" color={employmentConnection.offer_letter ? '#207B69' : '#787B96'} /></a>
                          </Tooltip>
                        </div>
                    </div>
                  }
                  {employmentConnection.offer_letter &&
                    <div div className="cv-icon">
                      <Tooltip placement="top" title="Click Here to Delete Offer Letter">
                        <a  href="#" className="menu_links" onClick={() => onDelete('offer_letter')}> <FaTrashAlt  size="27" color='#787B96' /> </a>
                      </Tooltip>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <DetailField label="Assigned To" value={employmentConnection.assigned_to ? employmentConnection.assigned_to?.username : ''} />
              <DetailField label="Start Date" value={employmentConnection.start_date ? moment(employmentConnection.start_date).format("DD MMM YYYY") : ''} />
              <DetailField label="End Date" value={employmentConnection.end_date ? moment(employmentConnection.end_date).format("DD MMM YYYY") : ''} />
              <DetailField label="Rejection reason" value={employmentConnection.reason_if_rejected} />
              {employmentConnection.reason_if_rejected_other && <DetailField label="Specify rejection reason" value={employmentConnection.reason_if_rejected_other} />}
              <DetailField label="Salary offered" value={employmentConnection.salary_offered} />
              <DetailField label="Source" value={<Badge value={employmentConnection.source} pickList={employmentConnectionsPickList.source} />} />
              <DetailField label="Upload Certificate" value= {
                employmentConnection.experience_certificate &&
                <div>
                  <label>Certificate</label>
                  <p className="mb-0">(updated on: {moment(employmentConnection.experience_certificate.updated_at).format("DD MMM YYYY")})</p>
                </div>
              }/>
              <div className ="row">
                <div className="col-md-6"></div>
                <div className="col-md-6 d-flex">
                  <div className="cv-icon">
                    <CertificateUpload query={UPDATE_EMPLOYMENT_CONNECTION} id={employmentConnection.id} certificate='experience_certificate' done={() => onUpdate() } />
                  </div>
                  {employmentConnection.experience_certificate &&
                    <div className="cv-icon">
                        <div className="col-md-1 d-flex flex-column section-cv">
                          <Tooltip placement="top" title="Click Here to View Certificate">
                            <a href={urlPath( employmentConnection.experience_certificate?.url)} target="_blank" ><FaEye size="27" color={employmentConnection.experience_certificate ? '#207B69' : '#787B96'} /></a>
                          </Tooltip>
                        </div>
                    </div>
                  }
                  {employmentConnection.experience_certificate &&
                    <div className="cv-icon">
                      <Tooltip placement="top" title="Click Here to Delete Certificate">
                        <a  href="#" className="menu_links" onClick={() => onDelete('experience_certificate')}> <FaTrashAlt  size="27" color='#787B96' /> </a>
                      </Tooltip>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
          {(isValidUser() || isAdmin()) && <div className="row mt-4">
            <div className="col-md-12 d-flex justify-content-center">
              <button type="button" className="btn btn-primary px-4 mx-4" onClick={handleEdit}>EDIT</button>
              <button type="button" className="btn btn-danger px-4 mx-4" onClick={handleDelete}>DELETE</button>
            </div>
          </div>}
        </Modal.Body>
      </Styled>
    </Modal>
  );
};

export default EmploymentConnection;
