import React, {useState, useEffect } from 'react'
import { Formik, Form, useFormik } from "formik";
import styled from "styled-components";
import { Input } from "../../utils/Form";
import moment from "moment";
import toaster from 'react-hot-toast';

const Section = styled.div`
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
  margin-top: 15px;
  margin-left:10px
`;

function SearchBar(props) {
  const {
    handleSearch,
    handleSearchPicklist,
    clearFilters,
    isClearDisabled,
    reviewCycle={},setReviewCycle=()=>{}, refreshOnClear=()=>{}, turnSearchOff=()=>{}} = props;
  const [searchValueOptions, setSearchValueOptions] = useState([]);
  const [defaultSearchArray, setDefaultSearchArray] = useState([]);
  const [searchFieldOptions] = useState(props.searchFieldOptions);
  const [progress, setProgress] = useState(0);
  const [searchField,setSearchField] = useState(null);
  const [searchValue,setSearchValue] = useState(null);
  const [isDisable,setIsDisable] = useState(!props.isClearDisabled ?false:true);
  const [dateError, setDateError] = useState(null);
  
  let today = new Date();

  const initialValues = {
    search_by_field: "",
    search_by_value: "",
    search_by_value_date_to: new Date(new Date(today).setDate(today.getDate())),
    search_by_value_date: new Date(new Date(today).setDate(today.getDate())),
  };

  const validateDates = (values) => {
    if (searchField === "date_of_joining") {
      const fromDate = moment(values.search_by_value_date);
      const toDate = moment(values.search_by_value_date_to);
      
      if (fromDate.isAfter(toDate)) {
        setDateError("Start date must be before end date");
        return false;
      }
      setDateError(null);
    }
    return true;
  };

  const handleSubmit = async(values)=>{
    const searchObj = {};    
    if(searchField === "date_of_joining"){
      // Validate dates but don't block submission
      validateDates(values);
      
      searchObj.from = moment(values.search_by_value_date).format("YYYY-MM-DD");
      searchObj.to = moment(values.search_by_value_date_to).format("YYYY-MM-DD");
      searchObj.searchField = searchField;
    }
    else {
      searchObj.searchValue = searchValue;
      searchObj.searchField = searchField;
      searchObj.reviewCycle = reviewCycle;
    }
    handleSearch(searchObj);
  }

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
  });

  const clear = async (formik) => {
    formik.resetForm({
      values: {
        ...initialValues,
        search_by_value_date: new Date(new Date(today).setDate(today.getDate())),
        search_by_value_date_to: new Date(new Date(today).setDate(today.getDate()))
      }
    });
    
    setSearchField(null);
    setSearchValue(null);
    setSearchValueOptions([]);
    setDateError(null);
    
    if (clearFilters) {
      clearFilters();
    } else {
      setIsDisable(true);
    }
    
    setReviewCycle(null);
    await turnSearchOff()
    await refreshOnClear()
  };

  const searchNotFound = async (newValue) => {
    let searchField = '';
    const query = `
    query GET_VALUE($query: String!) {
      studentsConnection(where: {
        ${
          searchField === "assigned_to"
            ? "assigned_to: { username_contains: $query }"
            : `${searchField}_contains: $query`
        }
      }) {
        values {
          ${
            searchField === "assigned_to"
              ? "assigned_to { username }"
              : searchField
          }
        }
      }
    }
  `;
  };

  const filterSearchValue = async (newValue) => {
    const matchedObjects = searchValueOptions.filter(
      (obj) =>
        obj?.label && obj?.label?.toLowerCase()?.includes(newValue?.toLowerCase())
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
          setProgress((prevProgress) =>
            prevProgress >= 90 ? 0 : prevProgress + 5
          );
        }, 1000);

        clearInterval(interval);
        handleLoaderForSearch();

        const data = await handleSearchPicklist(searchField);
        await setSearchValueOptions(data);
        await setDefaultSearchArray(data);
      } catch (error) {
        console.error("error", error);
      }
    };

    if (searchField) {
      if(!props.isClearDisabled) {
        // Additional logic if needed
      }
      
      setIsDisable(false);
      setSearchValueDropDown();
    }
  }, [searchField]);

  return (
    <Formik 
      initialValues={initialValues} 
      onSubmit={handleSubmit}   
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
                  options={searchFieldOptions.sort((a, b) =>
                    a.label.localeCompare(b.label)
                  )}
                  style={{maxWidth: 'fit-content'}}
                  className="form-control"
                  onChange={(e) => {
                    setSearchValueOptions([]);
                    setSearchField(e.value);
                    setDateError(null);
                  }}
                />
              </div>
              {searchField !== "date_of_joining" &&(
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
                        onChange={(e) => setSearchValue(e.value)}
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

              {searchField === "date_of_joining" && (
                <div className="col-lg-4 col-md-4 col-sm-12 mb-2 p-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="mr-3">
                      <Input
                        name="search_by_value_date"
                        label="From"
                        placeholder="Start Date"
                        control="datepicker"
                        className="form-control"
                        autoComplete="off"
                        onChange={(date) => {
                          formik.setFieldValue('search_by_value_date', date);
                          validateDates(formik.values);
                        }}
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
                        onChange={(date) => {
                          formik.setFieldValue('search_by_value_date_to', date);
                          validateDates(formik.values);
                        }}
                      />
                    </div>
                  </div>
                  {dateError && (
                    <div className="text-danger small mt-1">{dateError}</div>
                  )}
                </div>
              )}

              <div className="col-lg-3 col-md-4 col-sm-12 mt-3 d-flex justify-content-around align-items-center search_buttons_container">
                <button
                  className="btn btn-primary action_button_sec search_bar_action_sec"
                  type="submit"
                  disabled={isDisable} // Removed dateError from disabled condition
                >
                  FIND
                </button>
                <button
                  className="btn btn-secondary action_button_sec search_bar_action_sec"
                  type="button"
                  onClick={() => clear(formik)}
                  disabled={isDisable || isClearDisabled}
                  style={{marginLeft:15}}
                >
                  CLEAR
                </button>
              </div>
            </div>
          </Section>
        </Form>
      )}
    </Formik>
  )
}

export default SearchBar