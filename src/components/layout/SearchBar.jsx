import React, {useState, useEffect } from 'react'
import { Formik, Form, useFormik } from "formik";
import styled from "styled-components";
import { Input } from "../../utils/Form";
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
  const {handleSearch,handleSearchPicklist} = props;
  const [searchValueOptions, setSearchValueOptions] = useState([]);
  const [defaultSearchArray, setDefaultSearchArray] = useState([]);
  const [searchFieldOptions] = useState(props.searchFieldOptions);
  const [progress, setProgress] = useState(0);
  const [searchField,setSearchField] = useState(null);
  const [searchValue,setSearchValue] = useState(null);
  const [isDisable,setIsDisable] = useState(true);
  

  let today = new Date();

  const initialValues = {
    search_by_field: "",
    search_by_value: "",
    search_by_value_date_to: new Date(new Date(today).setDate(today.getDate())),
    search_by_value_date: new Date(new Date(today).setDate(today.getDate())),
  };

  const handleSubmit = async()=>{
    const searchObj = {};    
    if(searchField === "date_of_joining"){

    }
    else {
      searchObj.searchValue = searchValue;
    }
    handleSearch(searchObj);
  }
  const formik = useFormik({
    // Create a Formik reference using useFormik

    initialValues,
    onSubmit: handleSubmit,
  });

  const clear = async (formik) => {
    formik.resetForm();
    // setSelectedSearchField(null);
    // setIsSearchEnable(false);
    setIsDisable(true);
    setSearchValueOptions([]);
  };

  //search values in the table when it is not there in the default array

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

    // try {
    //   const { data } = await api.post("/graphql", {
    //     query: query,
    //     variables: { query: newValue },
    //   });

    //   if (data?.data?.studentsConnection?.values?.length) {
    //     let uniqueNames = new Set();
    //     let matchedOptions = data?.data?.studentsConnection?.values
    //       .map((value) => {
    //         if (searchField === "assigned_to") {
    //           return value.assigned_to.username;
    //         } else {
    //           return value[searchField];
    //         }
    //       })
    //       .filter((value) => {
    //         if (!uniqueNames.has(value)) {
    //           uniqueNames.add(value);
    //           return true;
    //         }
    //         return false;
    //       })
    //       .map((value) => ({
    //         label: value,
    //         value: value,
    //       }));

    //     return matchedOptions;
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
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

  
  useEffect(() => {
    const setSearchValueDropDown = async () => {
      try {
        const interval = setInterval(() => {
          // Simulate progress update
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
                  options={searchFieldOptions}
                  className="form-control"
                  onChange={(e) => {
                    setSearchValueOptions([]);
                    setSearchField(e.value)
                  }}
                  // isDisabled={isDisable}
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
                <div className="col-lg-2 col-md-4 col-sm-12 mb-2 p-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="mr-3">
                      <Input
                        name="search_by_value_date"
                        label="From"
                        placeholder="Start Date"
                        control="datepicker"
                        className="form-control "
                        autoComplete="off"
                        // disabled={isDisabled ? true : false}
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
                        // disabled={isDisabled ? true : false}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="col-lg-3 col-md-4 col-sm-12 mt-3 d-flex justify-content-around align-items-center search_buttons_container">
                <button
                  className="btn btn-primary action_button_sec search_bar_action_sec"
                  type="submit"
                  disabled={isDisable ? true : false}
                >
                  FIND
                </button>
                <button
                  className="btn btn-secondary action_button_sec search_bar_action_sec"
                  type="button"
                  onClick={() => clear(formik)}
                  disabled={isDisable ? true : false}
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