import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import { getProgramEnrollmentsPickList } from "../../Institutions/InstitutionComponents/instituteActions";
import DetailField from '../../../components/content/DetailField';
import { Anchor, Badge } from "../../../components/content/Utils";
import { FaDownload, FaEye, FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";
import { deleteCertificate, generateCertificate } from "../../../utils/function/certificate";
import Tooltip from "../../../components/content/Tooltip";
import CertificateUpload from "../../../components/content/Certificate";
import { UPDATE_PROGRAM_ENROLLMENT } from "../../../graphql";
import { urlPath } from "../../../constants";
import { isAdmin } from "../../../common/commonFunctions";

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

const ProgramEnrollment = (props) => {
  let { onUpdate, onDelete, onHide, show, handleEdit, handleDelete } = props;
  const [pickList, setPickList] = useState([]);
  const [loadingCertificationButton, setLoadingCertificationButton] = useState(false);
  const [programEnrollment, setProgramEnrollment] = useState(props.programEnrollment);
  const [programEnrollmentCertificate, setProgramEnrollmentCertificate] = useState(null);

  const handleGenerateCertificate = async () => {
    try {
      setLoadingCertificationButton(true);
      let { data } = await generateCertificate(programEnrollment.id);
      if (data.programEnrollment) {
        setProgramEnrollment(data.programEnrollment);
      }
    } catch (error) {
    } finally {
      setLoadingCertificationButton(false);
    }
  }

  const handleDeleteCertificate = async () => {
    try {
      setLoadingCertificationButton(true);
      let { data } = await deleteCertificate(programEnrollment.id);
      if (data.programEnrollment) {
        setProgramEnrollment(data.programEnrollment);
      }
    } catch (error) {
    } finally {
      setLoadingCertificationButton(false);
    }
  }

  useEffect(() => {
    setProgramEnrollment(props.programEnrollment);
  }, [props]);

  useEffect(() => {
    if (programEnrollment) {
      let certificateFieldValue = '';
      if (programEnrollment.medha_program_certificate) {
        certificateFieldValue = <div><a href={programEnrollment.medha_program_certificate.url} target="_blank" className="c-pointer mb-1 d-block" ><FaDownload size="20" color="#6C6D78" /></a><div style={{fontSize: '12px', fontFamily: 'Latto-Italic', color: '#787B96'}}>(updated on: {moment(programEnrollment.medha_program_certificate.created_at).format("DD MMM YYYY")})</div></div>;
      } else if (programEnrollment.medha_program_certificate_status == 'processing') {
        certificateFieldValue = 'Processing';
      } else if (programEnrollment.medha_program_certificate_status == 'low-attendance') {
        certificateFieldValue = 'Failed - Low Attendance';
      }
      setProgramEnrollmentCertificate(certificateFieldValue);
    }
  }, [programEnrollment])

  useEffect(() => {
    getProgramEnrollmentsPickList().then(data => {
      setPickList(data);
    });
  }, []);

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
              Program Enrollment Details
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white">
        <Section>
          <h2 className="section-header">Enrollment Details</h2>
          <FileStyled>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <DetailField label="Name" className="capitalize"value={<Anchor text ={programEnrollment.student?.full_name} href={`/student/${programEnrollment.student?.id}`}   />} />
                <DetailField label="Batch" value={<Anchor text={programEnrollment.batch?.name} href={`/batch/${programEnrollment.batch?.id}`} />} />
                <DetailField label="Institution" value={programEnrollment.institution?.name} />
              </div>
              <div className="col-md-6 col-sm-12">
                <DetailField label="Program Status" value={<Badge value={programEnrollment.status} pickList={pickList.status} />} />
                <DetailField label="Registration Date" value={programEnrollment.registration_date ? moment(programEnrollment.registration_date).format("DD MMM YYYY") : ''} />
                <DetailField label="Program Name" value={programEnrollment.batch?.program.name} />
              </div>
              <div className="col-md-6 col-sm-12">
                <DetailField label="Upload Assignment File" value= {
                    programEnrollment.assignment_file &&
                    <div>
                      <p className="mb-0">(updated on: {moment(programEnrollment.assignment_file.updated_at).format("DD MMM YYYY")})</p>
                    </div>
                }/>
                <div className ="row">
                  <div className="col-md-6"></div>
                  <div className="col-md-6 d-flex">
                    <div className="cv-icon">
                      <CertificateUpload query={UPDATE_PROGRAM_ENROLLMENT} id={programEnrollment.id} certificate='assignment_file' done={() => onUpdate() } />
                    </div>
                    {programEnrollment.assignment_file &&
                      <div className="cv-icon">
                        <div className="col-md-1 d-flex flex-column section-cv">
                          <Tooltip placement="top" title="Click Here to View Proof of Enrollment">
                            <a href={urlPath( programEnrollment.assignment_file?.url)} target="_blank" ><FaEye size="27" color={programEnrollment.assignment_file ? '#207B69' : '#787B96'} /></a>
                          </Tooltip>
                        </div>
                      </div>
                    }
                    {programEnrollment.assignment_file &&
                      <div div className="cv-icon">
                        <Tooltip placement="top" title="Click Here to Delete Proof of Enrollment">
                          <a  href="#" className="menu_links" onClick={() => onDelete('assignment_file')}> <FaTrashAlt  size="27" color='#787B96' /> </a>
                        </Tooltip>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </FileStyled>
          <hr className="mb-4 opacity-1" style={{color: '#C4C4C4'}} />
          <h2 className="section-header">Course Details</h2>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <DetailField label="Course Level" value={<Badge value={programEnrollment.course_level} pickList={pickList.course_level} />} />
              <DetailField label="Course Type" value={<Badge value={programEnrollment.course_type} pickList={pickList.course_type} />} />
              <DetailField label="Current Course Year" value={<Badge value={programEnrollment.course_year} pickList={pickList.current_course_year} />} />
            </div>
            <div className="col-md-6 col-sm-12">
              <DetailField label="Year of Completion" value={<Badge value={programEnrollment.year_of_course_completion} pickList={pickList.year_of_completion} />} />
              <DetailField label="Program Enrollment ID" value={`To Be Decided`} />
              <DetailField label="Course Name" value={programEnrollment.course_name_in_current_sis} />
              {programEnrollment.course_name_other && <DetailField label="Specify Course name" value={programEnrollment.course_name_other}/>}
            </div>
          </div>
          <hr className="mb-4 opacity-1" style={{color: '#C4C4C4'}} />
          <h2 className="section-header">Higher Education</h2>
          <FileStyled>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <DetailField label="Course Name" value={programEnrollment.higher_education_course_name} />
              </div>
              <div className="col-md-6 col-sm-12">
                <DetailField label="Year of Completion" value={<Badge value={programEnrollment.higher_education_year_of_course_completion} pickList={pickList.year_of_completion} />} />
              </div>
              <div className="col-md-6 col-sm-12">
                <DetailField label="Upload Proof of Enrollment" value= {
                    programEnrollment.higher_education_proof_of_enrollment &&
                    <div>
                      <p className="mb-0">(updated on: {moment(programEnrollment.higher_education_proof_of_enrollment.updated_at).format("DD MMM YYYY")})</p>
                    </div>
                }/>
                <div className ="row">
                  <div className="col-md-6"></div>
                  <div className="col-md-6 d-flex">
                    <div className="cv-icon">
                      <CertificateUpload query={UPDATE_PROGRAM_ENROLLMENT} id={programEnrollment.id} certificate='higher_education_proof_of_enrollment' done={() => onUpdate() } />
                    </div>
                    {programEnrollment.higher_education_proof_of_enrollment &&
                      <div className="cv-icon">
                        <div className="col-md-1 d-flex flex-column section-cv">
                          <Tooltip placement="top" title="Click Here to View Proof of Enrollment">
                            <a href={urlPath( programEnrollment.higher_education_proof_of_enrollment?.url)} target="_blank" ><FaEye size="27" color={programEnrollment.higher_education_proof_of_enrollment ? '#207B69' : '#787B96'} /></a>
                          </Tooltip>
                        </div>
                      </div>
                    }
                    {programEnrollment.higher_education_proof_of_enrollment &&
                      <div div className="cv-icon">
                        <Tooltip placement="top" title="Click Here to Delete Proof of Enrollment">
                          <a  href="#" className="menu_links" onClick={() => onDelete('higher_education_proof_of_enrollment')}> <FaTrashAlt  size="27" color='#787B96' /> </a>
                        </Tooltip>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </FileStyled>
          <hr className="mb-4 opacity-1" style={{color: '#C4C4C4'}} />
          <h2 className="section-header">Contribution Details</h2>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <DetailField label="Contribution Status" value={<Badge value={programEnrollment.fee_status} pickList={pickList.fee_status} />} />
              <DetailField label="Discount Code ID" value={programEnrollment.discount_code_id} />
              <DetailField label="Contribution Amount (INR)" value={programEnrollment.fee_amount} />
            </div>
            <div className="col-md-6 col-sm-12">
              <DetailField label="Contribution Payment Date" value={programEnrollment.fee_payment_date ? moment(programEnrollment.fee_payment_date).format("DD MMM YYYY") : ''} />
              <DetailField label="Transaction ID / Receipt No." value={programEnrollment.fee_transaction_id} />
              <DetailField label="Contribution Refund Date" value={programEnrollment.fee_refund_date ? moment(programEnrollment.fee_refund_date).format("DD MMM YYYY") : ''} />
            </div>
          </div>
          <hr className="mb-4 opacity-1" style={{color: '#C4C4C4'}} />
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <DetailField label="Certification Date" value={programEnrollment.certification_date ? moment(programEnrollment.certification_date).format("DD MMM YYYY") : ''} />
            </div>
            <div className="col-md-6 col-sm-12">
              <DetailField label="Certificate" value={programEnrollmentCertificate} />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12 d-flex justify-content-between">
              <div className="d-flex">
                <button type="button" className="btn btn-primary" onClick={handleEdit}>EDIT</button>
                <button type="button" className="btn btn-danger mx-2" onClick={handleDelete}>DELETE</button>
              </div>
              {
                isAdmin() &&
                <div className="d-flex">
                  <button type="button" className="btn btn-primary mx-2" onClick={handleGenerateCertificate} disabled={loadingCertificationButton}>
                    {programEnrollment.medha_program_certificate ? 'REGENERATE CERTIFICATE' : 'GENERATE CERTIFICATE'}
                  </button>
                  {programEnrollment.medha_program_certificate &&
                    <button type="button" className="btn btn-danger" onClick={handleDeleteCertificate} disabled={loadingCertificationButton}>DELETE CERTIFICATE</button>
                  }
                </div>
              }
            </div>
          </div>
          </Section>
        </Modal.Body>
      </Modal>
  );
};

export default ProgramEnrollment;
