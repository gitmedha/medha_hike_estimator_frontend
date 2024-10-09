import InputErr from "./InputErr";
import React, { useState } from 'react';
import styled from "styled-components";
import { FaSearch, FaAngleDown } from "react-icons/fa";
import { Field, ErrorMessage } from "formik";
import { components } from "react-select";
import AsyncSelect from 'react-select/async';

const SelectSearchLookupAsyncField = styled.div`
  label {
    color: #787B96;
  }
  .required {
    color: red;
    font-size: 16px;
  }
`;

const style = {
  control: (base) => ({
    ...base,
    border: "1px solid #ced4da",
    borderRadius: "2px",
    "&:hover": {
      borderColor: "#ced4da",
    },
  }),
  singleValue: (provided, state) => {
    if (state.selectProps.icon === 'down') {
      // don't do anything if it's a dropdown
      return {};
    }
    // when the menu is open, remove the text displayed in the input
    // this is done to make lookup field as type & search
    return {
      display: state.selectProps.menuIsOpen ? 'none' : 'block',
    }
  }
};

const IconRenderer = ({ icon }) => {
  switch (icon) {
    case "down":
      return <FaAngleDown size={15} />;
    default:
      return <FaSearch size={15} />;
  }
};

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <IconRenderer icon={props.selectProps.icon} />
    </components.DropdownIndicator>
  );
};

const SelectField = (props) => {
  const {
    icon,
    form,
    field,
    placeholder,
    onChange = () => {},
    isSearchable = false,
    filterData,
    defaultOptions,
    isDisabled,
    isClearable,
    isMulti
  } = props;
  // const [inputValue, setInputValue] = useState('');
  // const [options, setOptions] = useState(Array.isArray(defaultOptions) ? defaultOptions: []);
  const [selectedOpt, setSelectedOption] = useState(null)

  const loadOptions = (inputValue, callback) => {
    filterData(inputValue).then(data => {
      // setOptions(data);
      callback(data);
    });
  };
  // useEffect(() => {
  //   if (Array.isArray(defaultOptions)) {
  //     setOptions(defaultOptions);
  //   }
  // }, [defaultOptions]);

  const handleInputChange = (newValue) => {
    // setInputValue(newValue);
    return newValue;
  };

  return (
      <AsyncSelect
        icon={icon}
        name={field.name}
        styles={style}
        loadOptions={loadOptions}
        onInputChange={handleInputChange}
        placeholder={placeholder}
        isSearchable={isSearchable || icon !== 'down'}
        components={{ DropdownIndicator }}
        onChange={option => {
          setSelectedOption(option)
          // console.log(field.name, option ? option.value : null)
            form.setFieldValue(field.name, option ? option.value : null);
            onChange(option);
          }
        }
        // value={
        //   options ? options.find((option) => option.value === field.value) || field.value  : null
        // }
        value={selectedOpt}
        defaultOptions={defaultOptions}
        cacheOptions
        isMulti={isMulti}
        isDisabled={isDisabled}
        isClearable={isClearable}
      />
  );
};

const SelectSearchLookUp = (props) => {
  const { label, name, required, ...rest } = props;
  return (
    <SelectSearchLookupAsyncField>
      <div className="form-group">
        <label className="text-heading leading-24" htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
        <Field id={name} name={name} component={SelectField} {...rest} />
        <ErrorMessage name={name} component={InputErr} />
      </div>
    </SelectSearchLookupAsyncField>
  );
};

export default SelectSearchLookUp;

