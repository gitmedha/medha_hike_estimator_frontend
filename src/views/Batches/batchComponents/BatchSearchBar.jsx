import React, { useState, useEffect } from "react";
import { Formik, Form, useFormik } from "formik";
import styled from "styled-components";
import { Input } from "../../../utils/Form";
import { getFieldValues } from "../batchActions";
import api from "../../../apis";

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

function BatchSearchBar({
  selectedSearchField,
  setSelectedSearchField,
  setIsSearchEnable,
  setSelectedSearchedValue,
  tab,
  info,
  isDisable,
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

  const [searchValueOptions, setSearchValueOptions] = useState([]);
  const [progress, setProgress] = useState(0);

  const [batchOptions] = useState([
    { key: 0, label: "Program", value: "program" },
    { key: 1, label: "Start Date", value: "start_date" },
    { key: 2, label: "End Date", value: "end_date" },
    { key: 3, label: "Assigned To", value: "assigned_to" },
    { key: 4, label: "Area", value: "medha_area" },
    { key: 5, label: "Status", value: "status" },
    { key: 6, label: "Institution", value: "institution" },
    { key: 7, label: "Name", value: "name" },
    { key: 8, label: "Grant", value: "grant" },
  ]);

  const [defaultSearchArray, setDefaultSearchArray] = useState([]);

  const [isDisabled, setDisbaled] = useState(true);

  const formatdate = (dateval) => {
    const date = new Date(dateval);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const dd = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${yyyy}-${mm}-${dd}`;
    return formattedDate;
  };

  const handleSubmit = async (values) => {
    try {
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
          await setSelectedSearchedValue(val);
        }
        if (values.search_by_field === "end_date") {
          const date1 = formatdate(values.search_by_value_date_end_from);
          const date2 = formatdate(values.search_by_value_date_end_to);
          let val = {
            start_date: date1,
            end_date: date2,
          };
          await setSelectedSearchedValue(val);
        }

        setIsSearchEnable(true);
      } else {
        await setSelectedSearchedValue(values.search_by_value);
        setIsSearchEnable(true);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleBatchOptions = async (value) => {
    await setSearchValueOptions([]);
    setIsSearchEnable(false);
    setSelectedSearchField(value);
  };

  const formik = useFormik({
    // Create a Formik reference using useFormik
    initialValues,
    onSubmit: handleSubmit,
  });

  const clear = async (formik) => {
    formik.setValues(initialValues);
    setSelectedSearchField(null);
    setIsSearchEnable(false);
    setDisbaled(true);
    setSearchValueOptions([]);
  };

  //setting the value of the value drop down

  //search values in the table when it is not there in the default array

  const searchNotFound = async (newValue) => {
    let searchField = selectedSearchField;

    let whereQuery = `${searchField}_contains:$query`;
    let returnValue = `${searchField}`;

    if (searchField === "assigned_to") {
      whereQuery = `assigned_to: {
          username_contains:$query
        }`;

      returnValue = `assigned_to {username}`;
    } else if (searchField === "program") {
      whereQuery = `program: {
          name_contains:$query
        }`;

      returnValue = `program {name}`;
    } else if (searchField === "institution") {
      whereQuery = `institution: {
          name_contains:$query
        }`;

      returnValue = `institution {name}`;
    } else if (searchField === "grant") {
      whereQuery = `grant: {
          name_contains:$query
        }`;

      returnValue = `grant {name}`;
    }

    const query = `
  query GET_VALUE($query: String!) {
    batchesConnection(where: {
      ${whereQuery}
    }) {
      values {
        ${returnValue}
      }
    }
  }
`;

    try {
      const { data } = await api.post("/graphql", {
        query: query,
        variables: { query: newValue },
      });

      if (data?.data?.batchesConnection?.values?.length) {
        let uniqueNames = new Set();
        let matchedOptions = data?.data?.batchesConnection?.values
          .map((value) => {
            if (searchField === "assigned_to") {
              return value.assigned_to.username;
            } else if (searchField === "program") {
              return value.program.name;
            } else if (searchField === "institution") {
              return value.institution.name;
            } else if (searchField === "grant") {
              return value.grant.name;
            } else {
              return value[searchField];
            }
          })
          .filter((value) => {
            if (!uniqueNames.has(value)) {
              uniqueNames.add(value);
              return true;
            }
            return false;
          })
          .map((value) => ({
            label: value,
            value: value,
          }));

        return matchedOptions;
      }
    } catch (error) {
      console.error(error);
    }
  };
  const filterSearchValue = async (newValue) => {
    const matchedObjects = searchValueOptions.filter(
      (obj) =>
        obj.label && obj.label.toLowerCase().includes(newValue.toLowerCase())
    );
    if (!matchedObjects.length) {
      return searchNotFound(newValue);
    } else {
      return matchedObjects;
    }
  };

  const handleLoaderForSearch = async () => {
    setProgress(0);
  };

  useEffect(() => {
    const setSearchValueDropDown = async () => {
      try {
        const interval = setInterval(() => {
          // Simulate progress update
          setProgress((prevProgress) =>
            prevProgress >= 90 ? 0 : prevProgress + 5
          );
        }, 1000);

        const { data } = await getFieldValues(
          selectedSearchField,
          "batch",
          tab,
          info
        );
        clearInterval(interval);
        handleLoaderForSearch();

        await setSearchValueOptions(data);
        await setDefaultSearchArray(data);
      } catch (error) {
        console.error("error", error);
      }
    };

    if (selectedSearchField) {
      setDisbaled(false);
      setSearchValueDropDown();
    }
  }, [selectedSearchField]);

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {(formik) => (
        <Form>
          <Section>
            <div className="row align-items-center px-1">
              <div className="col-lg-2 col-md-4 col-sm-12 mb-2">
                <Input
                  icon="down"
                  name="search_by_field"
                  label="Search Field"
                  control="lookup"
                  options={batchOptions}
                  className="form-control"
                  onChange={(e) => handleBatchOptions(e.value)}
                />
              </div>
              {selectedSearchField !== "start_date" &&
                selectedSearchField !== "end_date" && (
                  <div
                    className="col-lg-3 col-md-4 col-sm-12 mb-2"
                    style={{ position: "relative" }}
                  >
                    {searchValueOptions.length ? (
                      <>
                        <Input
                          name="search_by_value"
                          label="Search Value"
                          className="form-control"
                          control="lookupAsync"
                          defaultOptions={defaultSearchArray}
                          filterData={filterSearchValue}
                        />
                        <div
                          style={{
                            position: "absolute",
                            width: `${progress}%`,
                            height: "4px",
                            backgroundColor: "#198754",
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <Input
                          name="search_by_value"
                          control="input"
                          label="Search Value"
                          className="form-control"
                          disabled={true}
                        />
                        <div
                          style={{
                            position: "absolute",
                            width: `${progress}%`,
                            height: "4px",
                            backgroundColor: "#198754",
                          }}
                        />
                      </>
                    )}
                  </div>
                )}

              {selectedSearchField === "start_date" && (
                <div className="col-lg-2 col-md-4 col-sm-12 mb-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="mr-3">
                      <Input
                        name="search_by_value_date"
                        label="From"
                        placeholder="Start Date"
                        control="datepicker"
                        className="form-control "
                        autoComplete="off"
                        disabled={isDisabled ? true : false}
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
                        disabled={isDisabled ? true : false}
                      />
                    </div>
                  </div>
                </div>
              )}
              {selectedSearchField === "end_date" && (
                <div className="col-lg-2 col-md-4 col-sm-12 mb-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="mr-3">
                      <Input
                        name="search_by_value_date_end_from"
                        label="From"
                        placeholder="Start Date"
                        control="datepicker"
                        className="form-control "
                        autoComplete="off"
                        disabled={isDisabled ? true : false}
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
                        disabled={isDisabled ? true : false}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="col-lg-3 col-md-4 col-sm-12 mt-3 d-flex justify-content-around align-items-center search_buttons_container">
                <button
                  className="btn btn-primary action_button_sec search_bar_action_sec"
                  type="submit"
                  disabled={isDisabled ? true : false}
                >
                  FIND
                </button>
                <button
                  className="btn btn-secondary mr-2 action_button_sec search_bar_action_sec"
                  type="button"
                  onClick={() => clear(formik)}
                  disabled={isDisabled ? true : false}
                >
                  CLEAR
                </button>
              </div>
            </div>
          </Section>
        </Form>
      )}
    </Formik>
  );
}

export default BatchSearchBar;
