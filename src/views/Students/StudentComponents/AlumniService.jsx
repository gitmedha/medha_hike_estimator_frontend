import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import DetailField from '../../../components/content/DetailField';
import styled from "styled-components";

const FileStyled = styled.div`
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

const Section = styled.div`
  padding-top: 11px;
  padding-bottom: 30px;

  &:not(:first-child) {
    border-top: 1px solid #C4C4C4;
  }

  .section-header {
    color: #207B69;
    font-family: 'Latto-Regular';
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 20px;
    margin-top: px;
  }

  .btn-box{
    padding-right: 1.5rem!important;
    padding-left: 1.5rem!important;
    margin-right: 1.5rem!important;
    margin-left: 1.5rem!important;
  }

  @media screen and (max-width: 360px) {
    .btn-box{
      height: 57px;
      width: 117px;
      padding-right: 0.5rem!important;
      padding-left: 0.5rem!important;
      margin-right: 0.5rem!important;
      margin-left: 0.5rem!important;
    }
  }
`;

const AlumniService = (props) => {
  let { onHide, show, handleEdit, handleDelete, student } = props;
  const [alumniService, setAlumniService] = useState(props.alumniService);

  useEffect(() => {
    setAlumniService(props.alumniService);
  }, [props]);

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
            Alumni Engagement Details
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white">
        <Section>
          <FileStyled>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <DetailField label="Name" className="capitalize"value={student.full_name} />
                <DetailField label="Type" value={alumniService.type} />
                <DetailField label="Start Date" value={alumniService.start_date ? moment(alumniService.start_date).format("DD MMM YYYY") : ''} />
                <DetailField label="Fee Submission Date" value={alumniService.fee_submission_date ? moment(alumniService.fee_submission_date).format("DD MMM YYYY") : ''} />
                <DetailField label="Receipt Number" value={alumniService.receipt_number} />
                <DetailField label="Comments" value={alumniService.comments} />
                <DetailField label="Status" value={alumniService.status ? alumniService.status :'' } />
              </div>
              <div className="col-md-6 col-sm-12">
                <DetailField label="Assigned To" value={alumniService.assigned_to?.username} />
                <DetailField label="Location" value={alumniService.location} />
                <DetailField label="End Date" value={alumniService.end_date ? moment(alumniService.end_date).format("DD MMM YYYY") : ''} />
                <DetailField label="Fee Amount" value={alumniService.fee_amount} />
                <DetailField label="Category" value={alumniService.category}/>
                
                {props.alumniService.category &&  <DetailField label="Subcategory" value={alumniService.type}/>}
              </div>
            </div>
          </FileStyled>
          <div className="row mt-4">
            <div className="col-md-12 d-flex justify-content-center">
              <button type="button" className="btn-box btn btn-primary" onClick={handleEdit}>EDIT</button>
              <button type="button" className="btn-box btn btn-danger" onClick={handleDelete}>DELETE</button>
            </div>
          </div>
          </Section>
        </Modal.Body>
      </Modal>
  );
};

export default AlumniService;
