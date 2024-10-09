import InputErr from "./InputErr";
import { Field, ErrorMessage } from "formik";
import styled from "styled-components";

const SelectField = styled.div`
  label {
    color: #787B96;
  }
  .required {
    color: red;
    font-size: 16px;
  }
`;

const Select = (props) => {
  const { label, name, required, options, ...rest } = props;

  return (
    <SelectField>
      <div className="form-group">
        <label className="text-heading leading-24" htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
        <Field as="select" id={name} name={name} {...rest}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.key}
            </option>
          ))}
        </Field>
        <ErrorMessage name={name} component={InputErr} />
      </div>
    </SelectField>
  );
};

export default Select;
