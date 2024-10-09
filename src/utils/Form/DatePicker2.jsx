import InputErr from "./InputErr";
import DateView from "react-datepicker";
import { Field, ErrorMessage } from "formik";

const DatePicker = (props) => {
  const { name, label, ...rest } = props;

  return (
    <div className="form-group d-flex flex-column date-picker-ui">
      <label htmlFor={name} className="text-heading pb-1">
        {label}
      </label>
      <Field name={name}>
        {({ form, field }) => {
          const { value } = field;
          const { setFieldValue } = form;
          return (
            <DateView
              id={name}
              {...field}
              {...rest}
              selected={value}
              onChange={(val) => setFieldValue(name, val)}
              calendarClassName
            />
          );
        }}
      </Field>
      <ErrorMessage name={name} component={InputErr} />
    </div>
  );
};

export default DatePicker;
