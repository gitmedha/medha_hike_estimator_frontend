import moment from 'moment';
import DetailField from "../../../components/content/DetailField";
import styled from "styled-components";
import { Dropdown } from 'react-bootstrap';


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
    appraisal_cycle,
    average,
    compentency,
    current_band,
    current_salary,
    employee_id,
    full_name,
    inc_adjustments,
    increment,
    kra_vs_goals,
    long_tenure,
    manager,
    new_band,
    new_salary,
    normalize_rating,
    tenure,
    weighted_increment
  } = props;
  console.log(props)


  return (
    <Styled>
      <div className="container-fluid my-3">
        <div className="row latto-regular justify-content-between">
          <div className="col-5">
            <DetailField label="Name" className="capitalize" value={`${full_name}`?.toLowerCase()} />
            <DetailField label="Employee ID" className="capitalize" value={employee_id?.toLowerCase()} />
            <DetailField label="Reviewer" className="capitalize" value={manager}/>
            <DetailField label="Review Cycle" value={appraisal_cycle} />
            <DetailField label="Average Rating" value={average} />
            <DetailField label="Compentency" value={compentency} />
            <DetailField label="Increment adjustments" value={inc_adjustments} />
            <DetailField label="Increment" value={increment} />
            <DetailField label="KRA" value={kra_vs_goals} />
          </div>
          <div className="col-5">
         
            <DetailField label="Long tenure" value={long_tenure? "Yes":"No"} />
            <DetailField label="New band" value={new_band} />
            <DetailField label="New Salary" value={new_salary} />
            <DetailField label="Normalized Rating" value={normalize_rating} />
            <DetailField label="Tenure" value={tenure} />
            <DetailField label="Weighted Increment" value={weighted_increment} />
            <DetailField label="Current Band" value={current_band} />
            <DetailField label="Current Salary" value={current_salary} />

          </div>
        </div>
      </div>
    </Styled>
  );
};

export default Details;
