import { useState, useEffect } from "react";
import moment from 'moment';
import { Badge } from "../../../components/content/Utils";
import DetailField from "../../../components/content/DetailField";
import { getStudentsPickList } from "./StudentActions";
import { urlPath } from "../../../constants";
import styled from "styled-components";
import {studentStatusOptions} from "./StudentConfig";
import { FaTrashAlt, FaEye, FaCheckCircle } from "react-icons/fa";
import FileUpload from "../../../components/content/FileUpload";
import { UPDATE_STUDENT } from "../../../graphql";
import Tooltip from "../../../components/content/Tooltip";
import api from "../../../apis";
import { isAdmin, isSRM } from "../../../common/commonFunctions";

const Styled = styled.div`
  p, label {
      color: #787B96;
  }

  @media screen and (min-width: 425px) {
    .col-md-1 {
      flex: 0 0 auto;
      width: 8.33333%;
      padding: 0px 33px 0px 4px;
    }
  }

  @media screen and (max-width: 360px) {
    .col-md-1{
      padding: 0px 15px 0px 0px;
    }
  }

  .container-fluid {
    padding-left: 30px;
    padding-right: 30px;
  }

  .img-profile-container {
    position: relative;
    .status-icon {
      position: absolute;
      top: 0;
      right: 0;
      padding: 1px 5px 5px 5px;
    }
    .img-profile {
      width: 160px;
      margin-left: auto;
    }
  }
  .separator {
    background-color: #C4C4C4;
    margin-top: 30px;
    margin-bottom: 30px;
  }
  hr {
    height: 1px;
  }
  .section-cv {
    color: #787B96;
    label, {
      font-size: 14px;
      line-height: 1.25;
    }
    p {
      font-size: 12px;
      line-height: 1.25;
      margin-bottom: 0;
      margin-left: 15px;
      font-family: 'Latto-Italic';
      color: #787B96;
    }
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

const Details = (props) => {
  let { onUpdate, onDelete } = props;
  const {
    id,
    student_id,
    full_name,
    phone,
    alternate_phone,
    name_of_parent_or_guardian,
    category,
    email,
    status,
    gender,
    date_of_birth,
    income_level,
    family_annual_income,
    logo,
    old_sis_id,
    course_type_latest,
    medha_champion,
    interested_in_employment_opportunities,
    CV,
    assigned_to,
    registered_by,
    created_at,
    updated_at,
    created_by_frontend,
    updated_by_frontend,
    how_did_you_hear_about_us,
    how_did_you_hear_about_us_other,
    your_plan_after_your_current_course
  } = props;

  const [pickList, setPickList] = useState([]);
  const studentStatusData = studentStatusOptions.find(option => option.picklistMatch.toLowerCase() === status?.toLowerCase());


  useEffect(() => {
    getStudentsPickList().then(data => {
      setPickList(data);
    });
  }, []);

  const mapJobDescriptionFile = async (fileId) => {
    await api.post("/graphql", {
      query: UPDATE_STUDENT,
      variables: {
        data: { CV: fileId },
        id,
      },
    });
  }

  return (
    <Styled>
      <div className="container-fluid my-3">
        <div className="row latto-regular">
          <div className="col-md-5">
            <DetailField label="Name" className="capitalize" value={full_name?.toLowerCase()} />
            <DetailField label="Parents Name" className="capitalize" value={name_of_parent_or_guardian?.toLowerCase()} />
            <DetailField label="Phone" value={<a href="tel:+91">{phone}</a>} />
            <DetailField label="Alternate Phone" value={alternate_phone ? <a href="tel:+91">{alternate_phone}</a> : '-'} />
            <DetailField label="Email" value={<a target="_blank" href={`mailto:${email}`} rel="noreferrer">{email}</a>} />
            <DetailField label="Date of Birth" value={moment(date_of_birth).format("DD MMM YYYY")} />
            &nbsp;
            <DetailField label="Created By" value={created_by_frontend?.username ? `${created_by_frontend?.username} (${created_by_frontend?.email})`:''} />
            <DetailField label="Created at" value={moment(created_at).format("DD MMM YYYY, h:mm a")} />
            <DetailField label="How did you hear about us?" value={how_did_you_hear_about_us?.toLowerCase() === 'other' ? how_did_you_hear_about_us_other : how_did_you_hear_about_us} />

          </div>
          <div className="col-md-4">
            <DetailField label="Assigned To" className="capitalize" value={assigned_to?.username?.toLowerCase()} />
            <DetailField label="Registered By" className="capitalize" value={registered_by?.username?.toLowerCase()} />
            <DetailField label=" Student ID" value={student_id} />
            <DetailField label="Status" value={<Badge value={status} pickList={pickList.status} />} />
            <DetailField label="Gender" value={<Badge value={gender} pickList={pickList.gender || []} />} />
            <DetailField label="Category" value={<Badge value={category} pickList={pickList.category || []} />} />
            &nbsp;
            <DetailField label="Updated By" value={updated_by_frontend?.username ?`${updated_by_frontend?.username} (${updated_by_frontend?.email})`: ''} />
            <DetailField label="Updated at" value={moment(updated_at).format("DD MMM YYYY, h:mm a")} />
            <DetailField label="Your plan after your current course" value={your_plan_after_your_current_course?your_plan_after_your_current_course:''} />

            {/*  */}
          </div>

          <div className="col-md-3 d-flex justify-content-end">
            <div className="img-profile-container">
              <div className="status-icon">{studentStatusData?.icon}</div>
              {logo && <img className="img-profile" src={urlPath(logo.url)} alt={full_name} />}
            </div>
          </div>
        </div>
        <hr className="separator" />
        <div className="row">
          {/* <div className="col-md-5">
            <DetailField label="Medhavi Member" value={<FaCheckCircle size="20" color={medha_champion ? '#207B69' : '#E0E0E8'} />} />
            <DetailField label="Interested in Employment Opportunities" value={<FaCheckCircle size="20" color={interested_in_employment_opportunities ? '#207B69' : '#E0E0E8'} />} />
            <DetailField label="ID in SIS 2.0" value={old_sis_id} />
            <DetailField label="Latest Course Type" value={course_type_latest} />
          </div> */}
          <div className="col-md-4">
            <DetailField label="Income Level (INR)" value={income_level} />
            <DetailField label="Family Annual Income (INR)" value={family_annual_income} />
            <DetailField label="CV Upload" value=
              {CV &&
                <div>
                  <label>CV</label>
                  <p className="mb-0">(updated on: {moment(CV.updated_at).format("DD MMM YYYY, h:mm a")})</p>
                </div>
                }
            />
            <div className="row">
              <div className="col-md-6"></div>
              <div className="col-md-6 d-flex">
                {(isSRM() || isAdmin()) && <div className="cv-icon">
                  <FileUpload mapFileToEntity={mapJobDescriptionFile} done={() => onUpdate()} />
                </div>}
                {CV &&
                  <div className="cv-icon">
                    <div className="d-flex flex-column section-cv">
                      <Tooltip placement="top" title="Click Here to View CV">
                        <a href={urlPath(CV?.url)} target="_blank" rel="noreferrer" ><FaEye size="27" color={CV ? '#207B69' : '#787B96'}/></a>
                        </Tooltip>
                    </div>
                 </div>
                }
                {(isSRM() || isAdmin()) && CV &&
                  <div className="cv-icon">
                    <Tooltip placement="top" title="Click Here to Delete CV">
                      <a href="#" className="menu_links" onClick={() => onDelete()}> <FaTrashAlt  size="27" color='#787B96' /> </a>
                    </Tooltip>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default Details;
