import InputErr from "./InputErr";
import { Field, ErrorMessage } from "formik";
import styled from "styled-components";

const InputField = styled.div`
  label {
    color: #787B96;
  }
  .required {
    color: red;
    font-size: 16px;
  }
`;

const FieldArray = (props) => {
  let { label, name, required, ...rest } = props;
  return (
    <InputField className="form-group">
      <label className="text-heading leading-24" htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <Field id={name} name={name} {...rest} />
      <ErrorMessage name={name} component={InputErr} />
    </InputField>
  );
};

export default FieldArray;
