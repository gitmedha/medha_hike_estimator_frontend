import Select from "react-select";
import InputErr from "./InputErr";
import { Field, ErrorMessage } from "formik";

export const SelectField = (props) => {
  const { options, field, form, placeholder, isSearchable = true } = props;

  return (
    <Select
      name={field.name}
      options={options}
      onBlur={field.onBlur}
      placeholder={placeholder}
      isSearchable={isSearchable}
      onChange={(option) => form.setFieldValue(field.name, option.value)}
      value={
        options ? options.find((option) => option.value === field.value) : null
      }
    />
  );
};

const SelectLookup = (props) => {
  const { label, name, ...rest } = props;
  return (
    <div className="form-group">
      <label className="text-heading leading-24" htmlFor={name}>
        {label}
      </label>
      <Field id={name} name={name} component={SelectField} {...rest} />
      <ErrorMessage name={name} component={InputErr} />
    </div>
  );
};

export default SelectLookup;
