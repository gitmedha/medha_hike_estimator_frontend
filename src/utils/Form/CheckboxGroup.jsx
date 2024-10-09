import InputErr from "./InputErr";
import { Field, ErrorMessage } from "formik";

const CheckboxGroup = (props) => {
  const { label, name, options, ...rest } = props;
  return (
    <div className="form-group">
      <label htmlFor={name} className="text-heading leading-24">
        {label}
      </label>
      <div className="d-flex">
        <Field name={name} {...rest}>
          {({ field }) => {
            return options.map((opt) => (
              <div
                key={opt.key}
                className="mr-3 custom-control custom-checkbox"
              >
                <input
                  {...field}
                  id={opt.value}
                  type="checkbox"
                  value={opt.value}
                  className="custom-control-input"
                  checked={field.value.includes(opt.value)}
                />
                <label
                  htmlFor={opt.value}
                  className="ml-1 custom-control-label"
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
  );
};

export default CheckboxGroup;
