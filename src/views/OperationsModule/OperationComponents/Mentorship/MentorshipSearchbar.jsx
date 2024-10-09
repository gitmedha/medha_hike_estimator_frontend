import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Input } from "../../../../utils/Form";
import { Formik, Form, useFormik } from "formik";
import styled from "styled-components";
import {
  searchOperationTab,
  resetSearch,
} from "../../../../store/reducers/Operations/actions";
import { getFieldValues } from "../operationsActions";
import * as Yup from "yup";

const Section = styled.div`
  padding-bottom: 30px;

  &:not(:first-child) {
    border-top: 1px solid #c4c4c4;
  }

  .section-header {
    color: #207b69;
    font-family: "Latto-Regular";
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 15px;
  }
`;
const MentorshipSearchbar = ({ searchOperationTab, resetSearch }) => {
  let options = [
    { key: 0, value: "mentor_name", label: "Mentor Name" },
    { key: 1, value: "mentor_domain", label: "Mentor Domain" },
    { key: 2, value: "mentor_company_name", label: "Mentor Company Name" },
    { key: 3, value: "designation", label: "Designation" },
    { key: 4, value: "mentor_area", label: "Mentor Area" },
    { key: 5, value: "mentor_state", label: "Mentor State" },
    // { key: 6, value: "outreach", label: "Outreach" },
    // { key: 7, value: "onboarding_date", label: "Onboarding Date" },
    { key: 8, value: "medha_area", label: "Medha Area" },
    { key: 9, value: "program_name", label: "Program Name" },
    { key: 10, value: "status", label: "Status" },
  ];


  const [mentorNameOption, setMentorNameOption] = useState([]);
  const [areaOption, setAreaOption] = useState([]);
  const [stateOption, setStateOption] = useState([]);
  const [selectedSearchField, setSelectedSearchField] = useState(null);
  const [disabled, setDisbaled] = useState(true);
  const [mentorDomain, setMentorDomain] = useState([]);
  const [mentorCompanyName, setMentorCompanyName] = useState([]);
  const [designationOption, setDesignation] = useState([]);
  const [medhaArea, setMedhaArea] = useState([]);
  const [programName, setProgramName] = useState([]);
  const [status, setStatus] = useState([]);
  const [outreach, setOutreach] = useState(null);
  const [onboardingDate, setOnboardingDate] = useState(null);

 

  const setSearchItem = (value) => {
    setSelectedSearchField(value);
    setDisbaled(false);

    if (value === "mentor_name") {
      setDropdownValues(value);
    }
    if (value === "mentor_domain") {
      setDropdownValues(value);
    }
    if (value === "mentor_company_name") {
      setDropdownValues(value);
    }
    if (value === "designation") {
      setDropdownValues(value);
    }
    if (value === "mentor_area") {
      setDropdownValues(value);
    }
    if (value === "mentor_state") {
      setDropdownValues(value);
    }
    if (value === "outreach") {
      setDropdownValues(value);
    }
    if (value === "onboarding_date") {
      setDropdownValues(value);
    }
    if (value === "medha_area") {
      setDropdownValues(value);
    }
    if (value === "program_name") {
      setDropdownValues(value);
    }
    if (value === "status") {
      setDropdownValues(value);
    }

  };
  const setDropdownValues = async (fieldName) => {
    try {
      console.log(fieldName);
      const { data } = await getFieldValues(fieldName, "mentorship");

      if (fieldName === "mentor_state") {
        setStateOption(data);
      }
      if (fieldName === "mentor_area") {
        console.log("data",data);
        setAreaOption(data);
        console.log(areaOption);
      }
      if (fieldName === "mentor_name") {
        setMentorNameOption(data);
      }
      if (fieldName === "mentor_domain") {
        setMentorDomain(data);
      }
      if (fieldName === "designation") {
        setDesignation(data);
      }
      if (fieldName === "program_name") {
        setProgramName(data);
      }
      if (fieldName === "medha_area") {
        setMedhaArea(data);
      }
      if (fieldName === "status") {
        setStatus(data);
      }
      if (fieldName === "mentor_company_name") {
        setMentorCompanyName(data);
      }
      
      
    } catch (error) {
      console.error("error", error);
    }
  };

  let today = new Date();
  const initialValues = {
    search_by_field: "",
    search_by_value: "",
  };
 
 

  const handleSubmit = async (values) => {
    let baseUrl = "mentorship";
    await searchOperationTab(
      baseUrl,
      values.search_by_field,
      values.search_by_value
    );

    //stores the last searched result in the local storage as cache
    //we will use it to refresh the search results

    let value = await localStorage.setItem(
      "prevSearchedPropsAndValues",
      JSON.stringify({
        baseUrl: baseUrl,
        searchedProp: values.search_by_field,
        searchValue: values.search_by_value,
      })
    );

    console.log(value);
  };
  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
  });

  const clear = async (formik) => {
    formik.setValues(initialValues);
    await resetSearch();
    setSelectedSearchField(null);
    setDisbaled(true);
  };

  return (
    <Fragment>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        // validationSchema={validate}
      >
        {(formik) => (
          <Form>
            <Section>
              <div className="row align-items-center">
                <div className="col-lg-2 col-md-4 col-sm-12 mb-2">
                  <Input
                    icon="down"
                    name="search_by_field"
                    label="Search Field"
                    control="lookup"
                    options={options}
                    className="form-control"
                    onChange={(e) => setSearchItem(e.value)}
                  />
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  {selectedSearchField === null && (
                    <Input
                      name="search_by_value"
                      control="input"
                      label="Search Value"
                      className="form-control"
                      disabled={true}
                    />
                  )}
                  {selectedSearchField === "mentor_name" && (
                    <Input
                    icon="down"
                    name="search_by_value"
                    label="Search Value"
                    control="lookup"
                    options={mentorNameOption}
                    className="form-control"
                    disabled={disabled ? true : false}
                    />
                  )}
                  {selectedSearchField === "medha_area" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={medhaArea}
                      className="form-control"
                      disabled={disabled ? true : false}
                    />
                  )}
                  {selectedSearchField === "status" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={status}
                      className="form-control"
                      disabled={disabled ? true : false}
                    />
                  )}
                  {selectedSearchField === "mentor_domain" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={mentorDomain}
                      className="form-control"
                      disabled={disabled ? true : false}
                    />
                  )}
                  {selectedSearchField === "mentor_company_name" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={mentorCompanyName}
                      className="form-control"
                      disabled={disabled ? true : false}
                    />
                  )}
                  {selectedSearchField === "designation" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={designationOption}
                      className="form-control"
                      disabled={disabled ? true : false}
                    />
                  )}
                  {selectedSearchField === "mentor_area" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      className="form-control"
                      options={areaOption}
                      // onChange={(e) => setSearchItem(e.value)}
                      disabled={disabled ? true : false}
                    />
                  )}
                  {selectedSearchField == "mentor_state" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={stateOption}
                      className="form-control"
                      // onChange={(e) => setSearchItem(e.value)}
                      // disabled={disabled ? true : false}
                    />
                  )}
                  {selectedSearchField === "outreach" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="input"
                      className="form-control"
                      disabled={disabled ? true : false}
                    />
                  )}
                  {selectedSearchField === "program_name" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={programName}
                      className="form-control"
                      disabled={disabled ? true : false}
                    />
                  )}
                  {selectedSearchField === "onboarding_date" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="input"
                      className="form-control"
                      disabled={disabled ? true : false}
                    />
                  )}
                </div>

                <div className="col-lg-3 col-md-4 col-sm-12 mt-3 d-flex justify-content-around align-items-center">
                  <button
                    className="btn btn-secondary action_button_sec search_bar_action_sec"
                    type="button"
                    onClick={() => clear(formik)}
                    disabled={disabled ? true : false}
                  >
                    CLEAR
                  </button>
                  <button
                    className="btn btn-primary action_button_sec search_bar_action_sec"
                    type="submit"
                    disabled={disabled ? true : false}
                  >
                    FIND
                  </button>
                </div>
              </div>
            </Section>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

export default connect(null, { searchOperationTab, resetSearch })(
  MentorshipSearchbar
);
