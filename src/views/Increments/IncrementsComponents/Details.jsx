import moment from 'moment';
import DetailField from "../../../components/content/DetailField";
import styled from "styled-components";
import profileImage from '../../../assets/images/profile-user.png'


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
      font-size: 18px;
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

  // Helper function to display value or #
  const displayValue = (value) => {
    return value === undefined || value === null || value === '' ? '#' : value;
  };

  return (
    <Styled>
      <div className="container-fluid my-3">
        <div className="row latto-regular justify-content-between">
          <div className="col-2">
            <div className="img-profile-container">
              <div className="status-icon">
                <i className="far fa-circle text-success"></i>
              </div>
              <img className="img-profile" src={profileImage} alt={full_name} />
            </div>
          </div>
          <div className="col">
            <div className="row">
              <div className="col-2">
                <DetailField 
                  label="Name" 
                  className="capitalize" 
                  value={displayValue(full_name)?.toLowerCase()} 
                />
              </div>
              <div className="col-2">
                <DetailField 
                  label="Employee ID" 
                  className="capitalize" 
                  value={displayValue(employee_id)?.toLowerCase()} 
                />
              </div>
              <div className="col-2">
                <DetailField 
                  label="Reviewer" 
                  className="capitalize" 
                  value={displayValue(manager)}
                />
              </div>
              <div className="col-auto">
                <DetailField 
                  label="Review Cycle" 
                  value={displayValue(appraisal_cycle)} 
                />
              </div>
            </div>
            <div className="row">
              <div className="col-2">
                <DetailField label="KRA" value={displayValue(kra_vs_goals)} />
              </div>
              <div className="col-2">
                <DetailField label="Compentency" value={displayValue(compentency)} />
              </div>
              <div className="col-2">
                <DetailField label="Average Rating" value={displayValue(average)} />
              </div>
              <div className="col-2">
                <DetailField label="Normalized Rating" value={displayValue(normalize_rating)} />
              </div>
              <div className="col-2">
                <DetailField label="Increment" value={displayValue(increment)} />
              </div>
              <div className="col-2">
                <DetailField label="Weighted Increment" value={displayValue(weighted_increment)} />
              </div>  
            </div>
            <div className="row">
              <div className="col-2">
                <DetailField label="New band" value={displayValue(new_band)} />
              </div>
              <div className="col-2">
                <DetailField label="New Salary" value={displayValue(new_salary)} />
              </div>
              <div className="col-2">
                <DetailField label="Tenure" value={displayValue(tenure)} />
              </div>
              <div className="col-2">
                <DetailField 
                  label="Long tenure" 
                  value={long_tenure === undefined || long_tenure === null ? '#' : (long_tenure ? "Yes" : "No")} 
                />
              </div>
              <div className="col-2">
                <DetailField label="Increment adjustments" value={displayValue(inc_adjustments)} />
              </div>
            </div>
            <div className="row">
              <div className="col-2">
                <DetailField label="Current Band" value={displayValue(current_band)} />
              </div>
              <div className="col-2">
                <DetailField label="Current Salary" value={displayValue(current_salary)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default Details;
