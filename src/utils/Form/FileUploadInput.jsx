import InputErr from "./InputErr";
import { ErrorMessage } from "formik";
import styled from "styled-components";

const FileUploadInputField = styled.div`
  label {
    color: #787B96;
  }
  .required {
    color: red;
    font-size: 16px;
  }
`;

const FileUploadInput = (props) => {
  let { label, subLabel = <></>, name, required, ...rest } = props;
  return (
    <FileUploadInputField className="form-group">
      <label className="text-heading leading-24" htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      {subLabel}
      <input
        type="file"
        id={name}
        name={name}
        {...rest}
      />
      <ErrorMessage name={name} component={InputErr} />
    </FileUploadInputField>
  );
};

export default FileUploadInput;
