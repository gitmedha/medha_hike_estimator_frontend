import InputErr from "./InputErr";
import { Field, ErrorMessage } from "formik";
import styled from "styled-components";

const TextAreaField = styled.div`
  label {
    color: #787B96;
  }
  .required {
    color: red;
    font-size: 16px;
  }
`;

const Textarea = (props) => {
  const { label, name, required, ...rest } = props;
  return (
    <TextAreaField>
      <div className="form-group">
        <label className="text-heading leading-24" htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
        <Field as="textarea" id={name} name={name} {...rest} />
        <ErrorMessage name={name} component={InputErr} />
      </div>
    </TextAreaField>
  );
};

export default Textarea;
