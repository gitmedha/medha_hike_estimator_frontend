import styled from "styled-components";

const Detail = styled.div`
  margin-bottom: 15px;
  font-family: 'Latto-Regular';
  font-size: 19px;
  line-height: 1.2;

  .detail-label {
    color: #787B96;
    font-weight:bold;
    font-size: 15px;
  }

  .detail-value {
    color: #424141;

  }
  .capitalize{
    text-transform: capitalize !important;
  }
`;

const DetailField = ({ label, value,className }) => (
  <Detail>
    <div className="mb-1 mb-md-0 detail-label" style={{paddingLeft:0}}>{label}</div>
    <div className={`detail-value text-start ${className ?className:""}`}>{value} </div>
  </Detail>
)

export default DetailField;
