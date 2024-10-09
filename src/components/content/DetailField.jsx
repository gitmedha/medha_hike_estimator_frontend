import styled from "styled-components";

const Detail = styled.div`
  margin-bottom: 15px;
  font-family: 'Latto-Regular';
  font-size: 14px;
  line-height: 1.2;

  .detail-label {
    color: #787B96;
  }

  .detail-value {
    color: #424141;
  }
  .capitalize{
    text-transform: capitalize !important;
  }
`;

const DetailField = ({ label, value,className }) => (
  <Detail className="row">
    <div className="mb-1 mb-md-0 col-md-6 detail-label">{label}</div>
    <div className={`col-md-6 detail-value ${className ?className:""}`}>{value} </div>
  </Detail>
)

export default DetailField;
