import InputErr from "./InputErr";
import DateView from "react-datepicker";
import { Field, ErrorMessage } from "formik";
import styled from "styled-components";
import { FaCalendarAlt } from "react-icons/fa";
import { useRef } from "react";
import PropTypes from 'prop-types';
import moment from 'moment';

const DatePickerField = styled.div`
  .react-datepicker {
    width: 300px !important;  /* Increased calendar width */
    font-size: 0.9rem;
  }

  .react-datepicker__header {
    padding-top: 1em;
    background-color: #f8f9fa;
  }

  .react-datepicker__month-container {
    width: 100%;
  }

  .react-datepicker__month {
    margin: 0.8em;
  }

  .react-datepicker__day-name, 
  .react-datepicker__day {
    width: 2.5em;
    line-height: 2.5em;
    margin: 0.166em;
  }

  .react-datepicker__current-month {
    font-size: 1.1em;
    color: #257b69;
  }

  label {
    color: #787B96;
    margin-bottom: 4px;
    font-size: 14px;
  }

  .datepicker-wrapper {
    position: relative;
    width: 100%;
    max-width: 200px;

    .datepicker-icon {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      color: #6c757d;
      pointer-events: none;
    }
  }

  .react-datepicker__input-container input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
    &:focus {
      border-color: #257b69;
      box-shadow: 0 0 0 0.2rem rgba(37, 123, 105, 0.25);
    }
  }

  .required {
    color: red;
    margin-left: 4px;
  }
`;

const ReviewCycleInput = (props) => {
  const { 
    name, 
    label, 
    required = false, 
    onInput, 
    defaultValue = null,
    showMonthYearPicker = true,
    ...rest 
  } = props;

  const datepickerRef = useRef(null);

  const handleClickDatepickerIcon = () => {
    datepickerRef.current.setFocus(true);
  };

  return (
    <DatePickerField>
      <div className="form-group d-flex flex-column">
        {label && (
          <label htmlFor={name}>
            {label}
            {required && <span className="required">*</span>}
          </label>
        )}
        <Field name={name}>
          {({ form, field }) => {
            const { setFieldValue } = form;
            const currentValue = field.value || defaultValue;

            return (
              <div className="datepicker-wrapper">
                <DateView
                  id={name}
                  {...field}
                  {...rest}
                  ref={datepickerRef}
                  selected={currentValue ? new Date(currentValue) : null}
                  onChange={(date) => {
                    setFieldValue(name, date);
                    onInput?.(date);
                    props.onChange?.(date);
                  }}
                  dateFormat="MMM yyyy"
                  showMonthYearPicker={showMonthYearPicker}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  placeholderText="Select date"
                  className="form-control"
                />
                <span className="datepicker-icon">
                  <FaCalendarAlt size={14} />
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

ReviewCycleInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  onInput: PropTypes.func,
  defaultValue: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
    PropTypes.number
  ]),
  showMonthYearPicker: PropTypes.bool
};

export default ReviewCycleInput;