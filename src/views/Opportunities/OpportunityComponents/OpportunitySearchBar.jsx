import React, { useState, useEffect } from "react";
import { Formik, Form, useFormik } from "formik";
import styled from "styled-components";
import { Input } from "../../../utils/Form";
import { getFieldValues } from "./opportunityAction";
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

function OpportunitySearchBar({
  selectedSearchField,
  setSelectedSearchField,
  setIsSearchEnable,
  setSelectedSearchedValue,
  tab,
  info,
  isDisable,
}) {
  const initialValues = {
    search_by_field: "",
    search_by_value: "",
  };

  const [searchValueOptions, setSearchValueOptions] = useState([]);
  const [progress, setProgress] = useState(0);

  const [opportunityOptions] = useState([
    { key: 0, label: "Assigned To", value: "assigned_to" },
    { key: 1, label: "Status", value: "status" },
    { key: 2, label: "Area", value: "medha_area" },
    { key: 3, label: "Type", value: "type" },
    { key: 4, label: "Employer Name", value: "employer" },
    { key: 5, label: "Role", value: "role_or_designation" },
  ]);

  const [defaultSearchArray, setDefaultSearchArray] = useState([]);

  const [isDisabled, setDisbaled] = useState(true);

  const handleSubmit = async (values) => {
    try {
      await setSelectedSearchedValue(values.search_by_value);
      setIsSearchEnable(true);
    } catch (error) {
      console.error("error", error);
    }
  };

  const formik = useFormik({
    // Create a Formik reference using useFormik
    initialValues,
    onSubmit: handleSubmit,
  });

  const clear = async (formik) => {
    formik.setValues(initialValues);
    setSelectedSearchField(null);
    setDisbaled(true);
    setSearchValueOptions([]);
    setIsSearchEnable(false);
  };

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
    } else if (searchField === "employer") {
      whereQuery = `employer: {
          name_contains:$query
        }`;

      returnValue = `employer {name}`;
    }
    const query = `
      query GET_VALUE($query: String!) {
        opportunitiesConnection(where: {
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

      if (data?.data?.opportunitiesConnection?.values?.length) {
        let uniqueNames = new Set();
        let matchedOptions = data?.data?.opportunitiesConnection?.values
          .map((value) => {
            if (searchField === "assigned_to") {
              return value.assigned_to.username;
            } else if (searchField === "employer") {
              return value.assigned_to.name;
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

  //setting the value of the value drop down

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

  const handleOpportunityOptions = async (value) => {
    await setSearchValueOptions([]);
    setIsSearchEnable(false);
    setSelectedSearchField(value);
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
          "opportunities",
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
                  options={opportunityOptions}
                  className="form-control"
                  onChange={(e) => handleOpportunityOptions(e.value)}
                />
              </div>
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

export default OpportunitySearchBar;
