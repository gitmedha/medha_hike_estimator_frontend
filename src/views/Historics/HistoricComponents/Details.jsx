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
    kra_vs_goals,
    employee,
    ending_month,
    final_score,
    competency,
    start_month,
    reviewer,
  } = props;



  return (
    <Styled>
      <div className="container-fluid my-3">
        <div className="row latto-regular justify-content-between">
          <div className="col-5">
            <DetailField label="Name" className="capitalize" value={`${employee}`?.toLowerCase()} />
            <DetailField label="Start Month" value={moment(start_month).format("MMMM YYYY")} />
            <DetailField label="Ending Month" value={moment(ending_month).format('MMMM YYYY')} />
            <DetailField label="KRA" className="capitalize" value={kra_vs_goals} />

          </div>
          <div className="col-5">
          <DetailField label="Average" className="capitalize" value={final_score} />
          <DetailField label="Competency" className="capitalize" value={competency} />
            <DetailField label="Reviewer" value={reviewer} />
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default Details;
