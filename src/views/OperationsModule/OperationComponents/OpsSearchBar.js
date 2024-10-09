import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import { Input } from "../../../utils/Form";
import { Formik, Form, useFormik } from "formik";
import styled from "styled-components";
import {
  searchOperationTab,
  resetSearch,
} from "../../../store/reducers/Operations/actions";
import { getFieldValues } from "./operationsActions";

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
const OpsSearchDropdown = function OpsSearchBar({
  searchOperationTab,
  resetSearch,
}) {
  let today = new Date();

  const initialValues = {
    search_by_field: "",
    search_by_value: "",
    search_by_value_date_to: new Date(new Date(today).setDate(today.getDate())),
    search_by_value_date: new Date(new Date(today).setDate(today.getDate())),
    search_by_value_date_end_from: new Date(
      new Date(today).setDate(today.getDate())
    ),
    search_by_value_date_end_to: new Date(
      new Date(today).setDate(today.getDate())
    ),
  };

  const [selectedSearchField, setSelectedSearchField] = useState(null);
  const [isFieldEmpty, setIsFieldEmpty] = useState(false);
  const [assignedToOptions, setAssignedOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [disabled, setDisbaled] = useState(true);

  const formatdate = (dateval) => {
    const date = new Date(dateval);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const dd = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${yyyy}-${mm}-${dd}`;
    return formattedDate;
  };

  const handleSubmit = async (values) => {
    let baseUrl = "users-ops-activities";

    if (
      values.search_by_field === "start_date" ||
      values.search_by_field === "end_date"
    ) {
      if (values.search_by_field === "start_date") {
        const date1 = formatdate(values.search_by_value_date);
        const date2 = formatdate(values.search_by_value_date_to);
        let val = {
          start_date: date1,
          end_date: date2,
        };
        await searchOperationTab(baseUrl, values.search_by_field, val);

        //stores the last searched result in the local storage as cache
        //we will use it to refresh the search results

        await localStorage.setItem(
          "prevSearchedPropsAndValues",
          JSON.stringify({
            baseUrl: baseUrl,
            searchedProp: values.search_by_field,
            searchValue: val,
          })
        );
      }
      if (values.search_by_field === "end_date") {
        const date1 = formatdate(values.search_by_value_date_end_from);
        const date2 = formatdate(values.search_by_value_date_end_to);
        let val = {
          start_date: date1,
          end_date: date2,
        };
        await searchOperationTab(baseUrl, values.search_by_field, val);

        //stores the last searched result in the local storage as cache
        //we will use it to refresh the search results

        await localStorage.setItem(
          "prevSearchedPropsAndValues",
          JSON.stringify({
            baseUrl: baseUrl,
            searchedProp: values.search_by_field,
            searchValue: val,
          })
        );
      }
    } else {
      await searchOperationTab(
        baseUrl,
        values.search_by_field,
        values.search_by_value
      );

      //stores the last searched result in the local storage as cache
      //we will use it to refresh the search results

      await localStorage.setItem(
        "prevSearchedPropsAndValues",
        JSON.stringify({
          baseUrl: baseUrl,
          searchedProp: values.search_by_field,
          searchValue: values.search_by_value,
        })
      );
    }
  };

  const options = [
    { key: 0, value: "assigned_to.username", label: "Assigned To" },
    { key: 1, value: "activity_type", label: "Activity Type" },
    { key: 2, value: "batch.name", label: "Batch" },
    { key: 3, value: "area", label: "Medha Area" },
    { key: 4, value: "program_name", label: "Program Name" },
    { key: 5, value: "start_date", label: "Start Date" },
    { key: 6, value: "end_date", label: "End Date" },
  ].sort((a, b) => a.label - b.label);
  const formik = useFormik({
    // Create a Formik reference using useFormik
    initialValues,
    onSubmit: handleSubmit,
  });

  const activityTypes = [
    {
      key: 0,
      label: "Workshop/Training Session/Activity (In/Off campus)",
      value: "Workshop/Training Session/Activity (In/Off campus)",
    },
    {
      key: 1,
      label: "Industry Talk/Expert Talk",
      value: "Industry Talk/Expert Talk",
    },
    { key: 2, label: "Alumni Engagement", value: "Alumni Engagement" },
    {
      key: 3,
      label: "Industry Visit/Exposure Visit",
      value: "Industry Visit/Exposure Visit",
    },
    { key: 4, label: "Placement Drive", value: "Placement Drive" },
  ];

  const clear = async (formik) => {
    formik.setValues(initialValues);
    await resetSearch();
    setSelectedSearchField(null);
    setDisbaled(true);
  };
  const setSearchItem = (value) => {
    setSelectedSearchField(value);
    setDisbaled(false);
    setIsFieldEmpty(false);

    if (value.includes("assigned_to")) {
      setDropdownValues("assigned_to");
    } else if (value.includes("batch")) {
      setDropdownValues("batch");
    } else if (value === "area") {
      setDropdownValues("area");
    } else if (value === "program_name") {
      setDropdownValues("program_name");
    }
  };

  const setDropdownValues = async (fieldName) => {
    try {
      const { data } = await getFieldValues(fieldName, "users-ops-activities");

      if (fieldName === "assigned_to") {
        setAssignedOptions(data);
      } else if (fieldName === "batch") {
        setBatchOptions(data);
      } else if (fieldName === "area") {
        setAreaOptions(data);
      } else if (fieldName === "program_name") {
        setProgramOptions(data);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <Fragment>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
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
                      onClick={() => setIsFieldEmpty(true)}
                      disabled={true}
                    />
                  )}

                  {selectedSearchField === "program_name" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={programOptions}
                      className="form-control"
                      disabled={disabled ? true : false}
                    />
                  )}

                  {selectedSearchField === "activity_type" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={activityTypes}
                      className="form-control"
                      disabled={disabled ? true : false}
                    />
                  )}

                  {selectedSearchField === "assigned_to.username" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={assignedToOptions}
                      className="form-control"
                      disabled={disabled ? true : false}
                    />
                  )}
                  {selectedSearchField === "batch.name" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={batchOptions}
                      className="form-control"
                      disabled={disabled ? true : false}
                    />
                  )}
                  {selectedSearchField === "area" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={areaOptions}
                      className="form-control"
                      disabled={disabled ? true : false}
                    />
                  )}
                  {selectedSearchField === "start_date" && (
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="mr-3">
                        <Input
                          name="search_by_value_date"
                          label="From"
                          placeholder="Start Date"
                          control="datepicker"
                          className="form-control "
                          autoComplete="off"
                          disabled={disabled ? true : false}
                        />
                      </div>
                      <div className="ml-2">
                        <Input
                          name="search_by_value_date_to"
                          label="To"
                          placeholder="End Date"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
                          disabled={disabled ? true : false}
                        />
                      </div>
                    </div>
                  )}

                  {selectedSearchField === "end_date" && (
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="mr-3">
                        <Input
                          name="search_by_value_date_end_from"
                          label="From"
                          placeholder="Start Date"
                          control="datepicker"
                          className="form-control "
                          autoComplete="off"
                          disabled={disabled ? true : false}
                        />
                      </div>
                      <div className="ml-2">
                        <Input
                          name="search_by_value_date_end_to"
                          label="To"
                          placeholder="End Date"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
                          disabled={disabled ? true : false}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 mt-3 d-flex justify-content-around align-items-center search_buttons_container">
                  <button
                    className="btn btn-primary action_button_sec search_bar_action_sec"
                    type="submit"
                    disabled={disabled ? true : false}
                  >
                    FIND
                  </button>
                  <button
                    className="btn btn-secondary action_button_sec search_bar_action_sec"
                    type="button"
                    onClick={() => clear(formik)}
                    disabled={disabled ? true : false}
                  >
                    CLEAR
                  </button>
                </div>
              </div>

              <div className="row align-items-center">
                <div className="col-lg-2 col-md-4 col-sm-12 mb-2"></div>

                <div className="col-lg-2 col-md-4 col-sm-12 mb-2">
                  {isFieldEmpty && (
                    <p style={{ color: "red" }}>
                      Please select any field first.
                    </p>
                  )}
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
  OpsSearchDropdown
);
