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
              <DetailField label="Name" className="capitalize" value={`${full_name}`?.toLowerCase()} />
              </div>
              <div className="col-2">
              <DetailField label="Employee ID" className="capitalize" value={employee_id?.toLowerCase()} />
              </div>
              <div className="col-2">
              <DetailField label="Reviewer" className="capitalize" value={manager}/>
              </div>
              <div className="col-2">
              <DetailField label="Review Cycle" value={appraisal_cycle} />
              </div>
              
            </div>
            <div className="row">
            <div className="col-2">
              <DetailField label="KRA" value={kra_vs_goals} />
              </div>
              <div className="col-2">
              
              <DetailField label="Compentency" value={compentency} />
              </div>
              <div className="col-2">
              <DetailField label="Average Rating" value={average} />
              </div>
              <div className="col-2">
              <DetailField label="Normalized Rating" value={normalize_rating} />
              </div>
              
              <div className="col-2">
              <DetailField label="Increment" value={increment} />
              </div>
              
              <div className="col-2">
              <DetailField label="Weighted Increment" value={weighted_increment} />
              </div>  
            </div>
            <div className="row">
              <div className="col-2">
              <DetailField label="New band" value={new_band} />
              </div>
              <div className="col-2">
              <DetailField label="New Salary" value={new_salary} />
              </div>
             
              <div className="col-2">
            <DetailField label="Tenure" value={tenure} />
              </div>
              
              <div className="col-2">
              <DetailField label="Long tenure" value={long_tenure? "Yes":"No"} />
              </div>
              <div className="col-2">
              <DetailField label="Increment adjustments" value={inc_adjustments} />
              </div>
            </div>
            <div className="row">
            <div className="col-2">
              <DetailField label="Current Band" value={current_band} />
              </div>
              
              <div className="col-2">
              <DetailField label="Current Salary" value={current_salary} />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default Details;
