import moment from 'moment';
import DetailField from "../../../components/content/DetailField";
import styled from "styled-components";

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
  const {
    first_name,
    last_name,
    department,
    experience,
    employee_status,
    employee_id,
    current_band,
    email_id,
    title,
    date_of_joining,
    employee_type
  } = props;




  return (
    <Styled>
      <div className="container-fluid my-3">
        <div className="row latto-regular">
          <div className="col-md-5">
            <DetailField label="Name" className="capitalize" value={`${first_name} ${last_name}`?.toLowerCase()} />
            <DetailField label="Department" className="capitalize" value={department?.toLowerCase()} />
            <DetailField label="Email" value={<a target="_blank" href={`mailto:${email_id}`} rel="noreferrer">{email_id}</a>} />
            <DetailField label="Date of Joining" value={moment(date_of_joining).format("DD MMM YYYY")} />
            <DetailField label="Experience" className="capitalize" value={experience?.toLowerCase()} />
            <DetailField label="Employee Status" className="capitalize" value={employee_status?.toLowerCase()} />

          </div>
          <div className="col-md-4">
            <DetailField label="Employee ID" value={employee_id} />
            <DetailField label="Current Band" value={current_band} />
            <DetailField label="Title" className="capitalize" value={title?.toLowerCase()} />
            <DetailField label="Employee Type" className="capitalize" value={employee_type?.toLowerCase()} />
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default Details;
