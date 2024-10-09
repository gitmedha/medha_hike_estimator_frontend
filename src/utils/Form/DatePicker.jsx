import InputErr from "./InputErr";
import DateView from "react-datepicker";
import { Field, ErrorMessage } from "formik";
import styled from "styled-components";
import { FaCalendarAlt } from "react-icons/fa";
import{ useRef } from "react";

const DatePickerField = styled.div`
.react-datepicker {
  font-size: 0.8em;
}

.react-datepicker__header {
  padding-top: 0.9em;
}

.react-datepicker__month {
  margin: 1em 1em;
}

.react-datepicker__day-name, .react-datepicker__day {
  width: 2.2em;
  margin: 0.3em;
}

.react-datepicker__current-month {
  font-size: 1em;
}

.react-datepicker__navigation {
  overflow: visible;
}

.react-datepicker__navigation--next--with-time {
  top: 13px !important;
  right: 100px;
}

.react-datepicker__day{
  padding: 4px;
}

.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected {
  background-color: #257b69;
}

label {
    color: #787B96;
  }

.datepicker-wrapper {
  position: relative;
  .datepicker-icon {
    position: absolute;
    color: hsl(0, 0%, 80%);
    right: 0;
    top: 9px;
    padding: 0 8px;
    border-left: 1px solid hsl(0, 0%, 80%);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50%;
    z-index: 0;
  }
}

.required {
  color: red;
  font-size: 16px;
}

.react-datepicker__day--outside-month {
  color: transparent;
  pointer-events: none;
}

.react-datepicker__month-read-view--down-arrow{
  border-color: #ccc;
  border-style: solid;
  border-width: 3px 3px 0 0;
  content: "";
  display: block;
  height: 9px;
  position: absolute;
  top: 6px;
  width: 9px;
  margin-right:1px;
  padding:2px;
}

.react-datepicker__year-read-view{
  border: 1px solid transparent;
  border-radius: .3rem;
  position: relative;
  margin-left: 25px;
}

.date-picker-ui .react-datepicker__month-option--selected_month {
  color: #257b69;
}

.react-datepicker__month-dropdown{
  background-color:white;
}

.react-datepicker__month-option{
  color:black;
}
`;

const DatePicker = (props) => {
  const { name, showtime, label, required, onInput: onInputCallback, ...rest } = props;
  const datepickerRef = useRef(null);
  function handleClickDatepickerIcon() {
    const datepickerElement = datepickerRef.current;
    datepickerElement.setFocus(true);
  }

  return (
    <DatePickerField>
      <div className="form-group d-flex flex-column date-picker-ui">
        <label htmlFor={name} className="text-heading leading-24">
          {label}
          {required && <span className="required">*</span>}
        </label>
        <Field name={name}>
          {({ form, field }) => {
            const { value } = field;
            const { setFieldValue } = form;
            return (
              <div className="datepicker-wrapper">
                <DateView
                  dateFormat={showtime? "dd MMM yyyy hh:mm a" : "dd MMM yyyy"}
                  showTimeSelect={showtime}
                  showMonthDropdown
                  useShortMonthInDropdown
                  showYearDropdown
                  id={name}
                  {...field}
                  {...rest}
                  selected={value}
                  onChange={(val) => {
                    setFieldValue(name, val);
                    if (typeof onInputCallback === 'function') {
                      onInputCallback(val)
                    }
                  }}
                  ref={datepickerRef}
                />
                <span className="datepicker-icon" onClick={() => handleClickDatepickerIcon()}>
                  <FaCalendarAlt size="15" />
                </span>
              </div>
            );
          }}
        </Field>
        <ErrorMessage name={name} component={InputErr} />
      </div>
    </DatePickerField>
  );
};

export default DatePicker;
