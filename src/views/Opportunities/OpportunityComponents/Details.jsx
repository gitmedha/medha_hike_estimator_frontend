import styled from "styled-components";
import { useState, useEffect } from "react";
import moment from "moment";
import { FaTrashAlt, FaEye, FaCheckCircle } from "react-icons/fa";
import { Anchor, Badge } from "../../../components/content/Utils";
import DetailField from "../../../components/content/DetailField";
import FileUpload from "../../../components/content/FileUpload";
import Tooltip from "../../../components/content/Tooltip";
import {getOpportunitiesPickList} from "./opportunityAction"
import { urlPath } from "../../../constants";
import { UPDATE_OPPORTUNITY } from "../../../graphql";
import api from "../../../apis";

const Styled = styled.div`
  .section-file {
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
  .file-icon {
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
  const {
    id,
    role_or_designation,
    number_of_opportunities,
    status,
    department_or_team,
    role_description,
    skills_required,
    compensation_type,
    salary,
    type,
    assigned_to,
    employer,
    created_at,
    updated_at,
    created_by_frontend,
    updated_by_frontend,
    job_description_file,
    onJobDescriptionUpdate,
    onJobDescriptionDelete,
  } = props;

  const [pickList, setPickList] = useState([]);

  useEffect(() => {
    getOpportunitiesPickList().then(data => {
      setPickList(data);
    });
  }, []);

  const mapJobDescriptionFile = async (fileId) => {
    await api.post("/graphql", {
      query: UPDATE_OPPORTUNITY,
      variables: {
        data: { job_description_file: fileId },
        id,
      },
    });
  }

  return (
    <Styled>
      <div className="container-fluid my-3">
        <div className="row latto-regular">
          <div className="col-6 col-md-4">
            <DetailField label="Role/Designation" className="capitalize" value={role_or_designation} />
            <DetailField label="Employer" value={<Anchor text={employer ? employer.name : ''} href={`/employer/${employer?.id}`}  />} />
            {/* <DetailField label="Location" value={employer ? employer.address : ''} /> */}
            <DetailField label="No. of openings" value={number_of_opportunities} />
            <DetailField label="Paid" value={<FaCheckCircle size="20" color={compensation_type == 'Yes' ? '#207B69' : '#E0E0E8'} />} />
            <DetailField label="Monthly Salary" value={salary} />
            <DetailField label="Role Description" className="capitalize" value={role_description} />
            &nbsp;
            <DetailField label="Created By" value={created_by_frontend?.username ?`${created_by_frontend?.username} (${created_by_frontend?.email})`: ''} />
            <DetailField label="Created at" value={moment(created_at).format("DD MMM YYYY, h:mm a")} />
          </div>
          <div className="col-6 offset-md-2 col-md-4">
            <DetailField label="Type" value={<Badge value={type} pickList={pickList.type} />} />
            <DetailField label="Assigned To" value={assigned_to ? assigned_to.username : ''} />
            <DetailField label="Status" value={<Badge value={status} pickList={pickList.status} />} />
            <DetailField label="Department/Team" value={<Badge value={department_or_team} pickList={pickList.department} />} />
            <DetailField label="Skills Required" className="capitalize" value={skills_required} />
            <DetailField label="Updated By" value={updated_by_frontend?.username ?`${updated_by_frontend?.username} (${updated_by_frontend?.email})`: ''} />
            <DetailField label="Updated at" value={moment(updated_at).format("DD MMM YYYY, h:mm a")} />
            <DetailField label="Job Description File Upload"  value=
                {job_description_file &&
                  <div>
                    <p className="mb-0">(updated on: {moment(job_description_file.updated_at).format("DD MMM YYYY, h:mm a")})</p>
                  </div>
                  }
              />
              <div className="row">
                <div className="col-md-6"></div>
                <div className="col-md-6 d-flex flex-row">
                  <div className="file-icon">
                    <FileUpload mapFileToEntity={mapJobDescriptionFile} done={() => onJobDescriptionUpdate()} />
                  </div>
                  {job_description_file &&
                    <div className="file-icon">
                      <div className="d-flex flex-column section-file">
                        <Tooltip placement="top" title="Click Here to View Job Description">
                          <a href={urlPath(job_description_file?.url)} target="_blank" ><FaEye size="27" color={job_description_file ? '#207B69' : '#787B96'}/></a>
                          </Tooltip>
                      </div>
                    </div>
                  }
                  {job_description_file &&
                    <div className="file-icon">
                        <Tooltip placement="top" title="Click Here to Delete Job Description">
                          <a href="#" className="menu_links" onClick={() => onJobDescriptionDelete()}> <FaTrashAlt  size="27" color='#787B96' /> </a>
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
