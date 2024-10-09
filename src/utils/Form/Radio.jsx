import InputErr from "./InputErr";
import { Field, ErrorMessage } from "formik";
import styled from "styled-components";

const RadioField = styled.div`
  label {
    color: #787B96;
  }
`;

const Radio = (props) => {
  const { label, name, options, ...rest } = props;
  return (
    <RadioField>
      <div className="form-group">
        <label htmlFor={name} className="text-heading mr-4 mb-1">
          {label}
        </label>
        <div className="d-flex">
          <Field name={name} {...rest}>
            {({ field }) => {
              return options.map((opt) => (
                <div className="custom-control custom-radio mr-3" key={opt.key}>
                  <input
                    {...field}
                    type="radio"
                    id={opt.value}
                    value={opt.value}
                    className="custom-control-input"
                    checked={field.value === opt.value}
                  />
                  <label
                    htmlFor={opt.value}
                    className="custom-control-label text--md pt-1"
                  >
                    {opt.key}
                  </label>
                </div>
              ));
            }}
          </Field>
        </div>
        <ErrorMessage name={name} component={InputErr} />
      </div>
    </RadioField>
  );
};

export default Radio;
