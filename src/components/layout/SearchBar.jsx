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
    reviewCycle={},setReviewCycle=()=>{}, refreshOnClear=()=>{}, turnSearchOff=()=>{},setIsSearchable=null} = props;
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
    if(setIsSearchable){
      setIsSearchable(false);
    }
    
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
      const ratings = [
        { label: "0-1", value: "0-1" },
        { label: "1-2", value: "1-2" },
        { label: "2-3", value: "2-3" },
        { label: "3-4", value: "3-4" },
        { label: "4-5", value: "4-5" },
      ]
      const normalizedRatingRanges = [
      { label: "-2.00 – -1.50", value: "-2.00 – -1.50" },
      { label: "-1.50 – -1.00", value: "-1.50 – -1.00" },
      { label: "-1.00 – -0.50", value: "-1.00 – -0.50" },
      { label: "-0.50 – 0.00", value: "-0.50 – 0.00" },
      { label: "0.00 – 0.50", value: "0.00 – 0.50" },
      { label: "0.50 – 1.00", value: "0.50 – 1.00" },
      { label: "1.00 – 1.50", value: "1.00 – 1.50" },
      { label: "1.50 – 2.00", value: "1.50 – 2.00" },
    ];
    
      try {
        const interval = setInterval(() => {
          setProgress((prevProgress) =>
            prevProgress >= 90 ? 0 : prevProgress + 5
          );
        }, 1000);

        clearInterval(interval);
        handleLoaderForSearch();

        // if(searchField === 'final_score' || searchField === 'kra_vs_goals' || searchField === 'competency' || searchField === 'compentency' || searchField === 'average'){
          
        // await setSearchValueOptions(ratings);
        // await setDefaultSearchArray(ratings);

        // }
        // else if (searchField === 'normalize_rating'){
        //   await setSearchValueOptions(normalizedRatingRanges);
        //   await setDefaultSearchArray(normalizedRatingRanges);
        // }
        // else if (searchField === 'increment'){

        // }
        // else {
        
        // }
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
                          setSearchValue(null);
                          setSearchField("date_of_joining");
                          setDateError(null);
                          formik.setFieldValue("search_by_value_date", date);
                          formik.setFieldValue("search_by_value_date_to", null);
                          validateDates({ ...formik.values, search_by_value_date: date });
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
                        minDate={formik.values.search_by_value_date || new Date()}
                        onChange={(date) => {
                          formik.setFieldValue("search_by_value_date_to", date);
                          validateDates({ ...formik.values, search_by_value_date_to: date });
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