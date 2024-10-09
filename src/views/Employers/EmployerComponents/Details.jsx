import styled from "styled-components";
import { useState, useEffect } from "react";
import moment from "moment";
import { FaTrashAlt, FaEye, FaCheckCircle } from "react-icons/fa";
import { Badge } from "../../../components/content/Utils";
import DetailField from "../../../components/content/DetailField";
import { getEmployersPickList } from "./employerAction";
import FileUpload from "../../../components/content/FileUpload";
import { urlPath } from "../../../constants";
import { UPDATE_EMPLOYER } from "../../../graphql";
import api from "../../../apis";
import Tooltip from "../../../components/content/Tooltip";

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
    name,
    phone,
    assigned_to,
    website,
    email,
    status,
    industry,
    created_at,
    updated_at,created_by_frontend,
    updated_by_frontend,
    mou_file,
    onMouUpdate,
    onMouDelete,
    paid_leaves,
    employee_benefits,
    employment_contract,
    offer_letter,
    medha_partner,
  } = props;


  const [pickList, setPickList] = useState([]);

  useEffect(() => {
    getEmployersPickList().then(data => {
      setPickList(data);
    });
  }, []);

  const mapMouFile = async (fileId) => {
    await api.post("/graphql", {
      query: UPDATE_EMPLOYER,
      variables: {
        data: { mou_file: fileId },
        id,
      },
    });
  }

  return (
    <Styled>
      <div className="container-fluid my-3">
        <div className="row latto-regular">
          <div className="col-6 col-md-4">
            <DetailField label="Name" className="capitalize"value={name} />
            <DetailField label="Industry" value={<Badge value={industry} pickList={pickList.industry} />} />
            <DetailField label="Website" value={ <a href={website} target="_blank" rel="noreferrer" className="latto-regular" > {website} </a> } />
            <DetailField label="Email" value= {<a target="_blank" href={`mailto:${email}`} rel="noreferrer"> {email} </a> } />
            &nbsp;
            <DetailField label="Paid Leaves" value={<FaCheckCircle size="20" color={paid_leaves ? '#207B69' : '#E0E0E8'} />} />
            <DetailField label="Employee Benefits" value={<FaCheckCircle size="20" color={employee_benefits ? '#207B69' : '#E0E0E8'} />} />
            <DetailField label="Employment Contract" value={<FaCheckCircle size="20" color={employment_contract ? '#207B69' : '#E0E0E8'} />} />
            <DetailField label="Offer Letter" value={<FaCheckCircle size="20" color={offer_letter ? '#207B69' : '#E0E0E8'} />} />
            <DetailField label="Medha Partner" value={<FaCheckCircle size="20" color={medha_partner ? '#207B69' : '#E0E0E8'} />} />
          </div>
          <div className="col-6 offset-md-2 col-md-4">
            <DetailField label="Assigned To" value={assigned_to?.username} />
            <DetailField label="Status" value={<Badge value={status} pickList={pickList.status} />} />
            <DetailField label="Phone number" value={<a href="tel:+91">{phone} </a>} />
            <DetailField label="Created By" value={created_by_frontend?.username ?`${created_by_frontend?.username} (${created_by_frontend?.email})`: ''} />
            <DetailField label="Created at" value={moment(created_at).format("DD MMM YYYY, h:mm a")} />
            <DetailField label="Updated By" value={updated_by_frontend?.username ?`${updated_by_frontend?.username} (${updated_by_frontend?.email})`: ''} />
            <DetailField label="Updated at" value={moment(updated_at).format("DD MMM YYYY, h:mm a")} />
            <DetailField label="MoU File Upload" value=
                  {mou_file &&
                    <div>
                      <p className="mb-0">(updated on: {moment(mou_file.updated_at).format("DD MMM YYYY, h:mm a")})</p>
                    </div>
                    }
                />
                <div className="row">
                  <div className="col-md-6"></div>
                  <div className="col-md-6 d-flex flex-row">
                    <div className="file-icon">
                      <FileUpload mapFileToEntity={mapMouFile} done={() => onMouUpdate()} />
                    </div>
                    {mou_file &&
                      <div className="file-icon">
                        <div className="d-flex flex-column section-file">
                          <Tooltip placement="top" title="Click Here to View MoU">
                            <a href={urlPath(mou_file?.url)} target="_blank" rel="noreferrer" ><FaEye size="27" color={mou_file ? '#207B69' : '#787B96'}/></a>
                            </Tooltip>
                        </div>
                      </div>
                    }
                    {mou_file &&
                      <div className="file-icon">
                          <Tooltip placement="top" title="Click Here to Delete MoU">
                            <a href="#" className="menu_links" onClick={() => onMouDelete()}><FaTrashAlt size="27" color='#787B96' /> </a>
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
