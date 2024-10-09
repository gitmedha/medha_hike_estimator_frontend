import { Formik, FieldArray, Form } from "formik";
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { FaAngleDown, FaAngleRight, FaSchool } from "react-icons/fa";
import { Input } from "../../../utils/Form";
import { EmployerValidations } from "../../../validations";
import { getEmployersPickList } from "./employerAction";
import { urlPath } from "../../../constants";
import {
  getAddressOptions,
  getStateDistricts,
} from "../../Address/addressActions";
import {
  filterAssignedTo,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import { yesOrNoOptions } from "../../../common/commonConstants";
import api from "../../../apis";
import { isEmptyValue } from "../../../utils/function/OpsModulechecker";
import Select, { components } from "react-select";
import { GET_ALL_INDUSTRY } from "src/graphql";

const Section = styled.div`
  padding-top: 30px;
  padding-bottom: 30px;

  label {
    color: #787b96;
  }
  .required {
    color: red;
    font-size: 16px;
  }
  .css-9gakcf-option {
    background-color: #fff !important;
  }
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

const DropdownIndicator = (props) => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        {props.selectProps.menuIsOpen ? "▲" : "▼"}
      </components.DropdownIndicator>
    )
  );
};

const EmployerForm = (props) => {
  let { onHide, show } = props;
  const [industryOptions, setIndustryOptions] = useState([]);
  const [statusOpts, setStatusOpts] = useState([]);
  const [employerTypeOpts, setEmployerTypeOpts] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [logo, setLogo] = useState(null);
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [formValues, setFormValues] = useState(null);
  const [isDuplicate, setDuplicate] = useState(false);
  const userId = parseInt(localStorage.getItem("user_id"));

  const [selectedOption, setSelectedOption] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [industry, setIndustry] = useState("");
  const formikRef = useRef();

  const handleExternalChange = (value) => {
    let data=value.label;
    formikRef.current.setFieldValue("industry", data);
  };

  const handleChange = (selected) => {
    setSelectedOption(selected);
    if (selected?.children) {
      // setDropdownOptions([
      //   ...dropdownOptions.filter((opt) => opt?.value !== selected?.value),
      //   selected,
      //   ...selected.children,
      // ]);

      const additionalItems = selected.children.map(value=>{
        return {
          ...value,isChild:true
        }
      });

      console.log(dropdownOptions,"\n",selected);

      const matchIndex = dropdownOptions.findIndex(
        (obj) => obj.label === selected.label
      );
        console.log(matchIndex);
      let result = [];
      if(!selected.children.includes(dropdownOptions[matchIndex+1])){
        if (matchIndex !== -1) {
          result=[...dropdownOptions.slice(0,matchIndex+1),...additionalItems,...dropdownOptions.slice(matchIndex+1)]
        }
      
      }else{
        result=[...dropdownOptions.slice(0,matchIndex+1),...dropdownOptions.slice(matchIndex+additionalItems.length+1)];

      }
      result[matchIndex].children=additionalItems;
      setDropdownOptions(result)

      setMenuIsOpen(true);
      
    } else {
      
      setDropdownOptions(dropdownOptions);
      setMenuIsOpen(false);
      handleExternalChange(selected);
    }
  };

  const handleMenuOpen = () => {
    if (selectedOption && selectedOption?.children) {
      setDropdownOptions([
        ...dropdownOptions.filter((opt) => opt.value !== selectedOption.value),
        selectedOption,
        ...selectedOption.children,
      ]);
    } else {
      setDropdownOptions(dropdownOptions);
    }
    setMenuIsOpen(true);
  };

  const CustomOption = (props) => {
    const selectedItem=props?.data
    const isParent = props?.data?.children;
    const matchIndex = dropdownOptions.findIndex(
      (obj) => obj.label === selectedItem.label
    );
    
    console.log("selectedItem",selectedItem);
    let isSelectedParent =
      selectedOption && selectedOption?.label === props?.data?.label && selectedItem?.children?.includes(dropdownOptions[matchIndex+1]) ;
    let haschild=!selectedItem?.isChild;
    return (
      <components.Option
        {...props}
        style={{
          backgroundColor: isSelectedParent
            ? "white"
            : props.isFocused
            ? "#f0f0f0"
            : "transparent", 
        }}
      >
        <div
          style={{
            marginLeft: isParent ? "0" : "0",
            fontWeight: isSelectedParent ? "bold" : "normal",
            fontSize:'1rem',
            color: isSelectedParent ? "green" : "black",
            backgroundColor: isSelectedParent ? "white" : "transparent",
            cursor:"pointer"
          }}
        >
          {isParent && <FaAngleDown style={{ marginRight: "8px",transform:isSelectedParent? 'none':"rotate(-90deg)" }} />}
          <span style={{fontSize:haschild ?'16px':'14px',paddingLeft:!haschild?'28px':''}}>{props.data.label}</span>
          
        </div>
      </components.Option>
    );
  };
  const clear = () => {
    setSelectedOption(null);
  };
  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
  }, []);

  useEffect(() => {
    const getAllEmployers = async () => {
      return await api
        .post("/graphql", {
          query: GET_ALL_INDUSTRY,
        })
        .then((values) => {
          const data = values.data.data.industries;
          const grouped = data.reduce(
            (acc, { industry_name, sub_industry }) => {
              if (!acc[industry_name]) {
                acc[industry_name] = [];
              }
              if (sub_industry) {
                acc[industry_name].push(sub_industry);
              }
              return acc;
            },
            {}
          );

          const options = Object.keys(grouped).map((industry_name) => {
            const subIndustries = grouped[industry_name].map(
              (sub_industry) => ({
                label: sub_industry,
                value: sub_industry,
              })
            );
            const industryObject = {
              label: industry_name,
            };

            if (subIndustries.length > 0) {
              industryObject.children = subIndustries;
            }

            return industryObject;
          });
          setDropdownOptions(options);
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    };
    getAllEmployers();
  }, []);

  useEffect(() => {
    getEmployersPickList().then((data) => {
      setStatusOpts(
        data.status.map((item) => {
          return {
            key: item.value,
            label: item.value,
            value: item.value,
          };
        })
      );

      setIndustryOptions(
        data.industry.map((item) => {
          return {
            key: item.value,
            label: item.value,
            value: item.value,
          };
        })
      );
    });

    getAddressOptions().then((data) => {
      setStateOptions(
        data?.data?.data?.geographiesConnection.groupBy.state
          .map((state) => ({
            key: state.id,
            label: state.key,
            value: state.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );

      if (props.state) {
        onStateChange({
          value: props.state,
        });
      }
    });
  }, [props]);

  const onStateChange = (value) => {
    setDistrictOptions([]);
    getStateDistricts(value).then((data) => {
      setDistrictOptions(
        data?.data?.data?.geographiesConnection.groupBy.district
          .map((district) => ({
            key: district.id,
            label: district.key,
            value: district.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
      setAreaOptions([]);
      setAreaOptions(
        data?.data?.data?.geographiesConnection.groupBy.area.map((area) => ({
          key: area.id,
          label: area.key,
          value: area.key,
        }))
      );
      setCityOptions([]);
      setCityOptions(
        data?.data?.data?.geographiesConnection.groupBy.city.map((city) => ({
          key: city.key,
          value: city.key,
          label: city.key,
        }))
      );
    });
  };

  const onSubmit = async (values) => {
    values.contacts = values.contacts.map((value) => {
      value.full_name =
        value.full_name[0].toUpperCase() + value.full_name.slice(1);
      value.designation =
        value.designation[0].toUpperCase() + value.designation.slice(1);
      return value;
    });
    values.name = values.name
      .split(" ")
      .map((word) => {
        if (!isEmptyValue(word)) {
          return word[0].toUpperCase() + word.substring(1);
        }
      })
      .join(" ");
    values.city = values.city[0].toUpperCase() + values.city.slice(1);
    values.address = values.address
      ? values.address
          .split(" ")
          .map((word) => {
            if (word) {
              return word[0].toUpperCase() + word.substring(1);
            }
          })
          .join(" ")
      : "";

    setFormValues(values);
    if (logo) {
      values.logo = logo;
    }
    onHide(values);
  };
  const logoUploadHandler = ({ id }) => setLogo(id);

  let initialValues = {
    name: "",
    industry: "",
    email: "",
    phone: "",
    status: "active",
    address: "",
    assigned_to: userId.toString(),
    state: "",
    pin_code: "",
    city: "",
    medha_area: "",
    district: "",
  };

  if (props.id) {
    initialValues = { ...props };
    initialValues["assigned_to"] = props?.assigned_to?.id;
    initialValues["district"] = props.district ? props.district : null;
    initialValues["medha_area"] = props.medha_area ? props.medha_area : null;
  }

  if (!props.contacts) {
    initialValues["contacts"] = [];
  }

  const FindDuplicate = async (setValue, name) => {
    setValue("name", name);

    try {
      const { data } = await api.post("/employers/findDuplicate", {
        name: name,
      });

      if (data === "Record Found") {
        return setDuplicate(true);
      } else if (data === "Record Not Found") {
        return setDuplicate(false);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <Modal
      centered
      size="lg"
      show={show}
      onHide={onHide}
      animation={false}
      aria-labelledby="contained-modal-title-vcenter"
      className="form-modal"
    >
      <Modal.Header className="bg-white">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-center"
        >
          {props.id && props.logo ? (
            <img
              src={urlPath(props.logo.url)}
              className="avatar mr-2"
              alt="Employer Avatar"
            />
          ) : (
            <div className="flex-row-centered avatar avatar-default mr-2">
              <FaSchool size={25} />
            </div>
          )}
          <h1 className="text--primary bebas-thick mb-0">
            {props.id ? props.name : "Add New Employer"}
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={EmployerValidations}
        >
          {({ values, setFieldValue, errors }) => (
            <Form>
              <div className="row form_sec">
                <Section>
                  <h3 className="section-header">Details</h3>
                  <div className="row">
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        name="name"
                        label="Name"
                        control="input"
                        placeholder="Name"
                        className="form-control capitalize"
                        onChange={(e) =>
                          FindDuplicate(setFieldValue, e.target.value)
                        }
                        required
                      />

                      {isDuplicate && !props.id ? (
                        <p style={{ color: "red" }}>
                          This employer already exist on the system
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      {assigneeOptions.length ? (
                        <Input
                          control="lookupAsync"
                          name="assigned_to"
                          label="Assigned To"
                          filterData={filterAssignedTo}
                          defaultOptions={assigneeOptions}
                          className="form-control"
                          placeholder="Assigned To"
                          required
                        />
                      ) : (
                        <Skeleton count={1} height={45} />
                      )}
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      {/* <Input
                        icon="down"
                        name="industry"
                        label="Industry"
                        control="lookup"
                        options={industryOptions}
                        className="form-control"
                        required
                      /> */}
                      <label className="text-heading leading-24">
                        Industry <span class="required">*</span>
                      </label>
                      <Select
                        options={dropdownOptions}
                        value={selectedOption}
                        name="industry"
                        onChange={(selected) => {
                          handleChange(selected);
                        }}
                        icon={<FaAngleDown size={15} />}
                        placeholder="Select an option..."
                        components={{ Option: CustomOption, DropdownIndicator }}
                        menuIsOpen={menuIsOpen}
                        onMenuOpen={handleMenuOpen}
                        isClearable={() => {
                          clear();
                          setFieldValue("industry", "");
                        }}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        icon="down"
                        name="status"
                        label="Status"
                        control="lookup"
                        options={statusOpts}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        name="website"
                        control="input"
                        label="Website"
                        placeholder="Website"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        name="phone"
                        label="Phone"
                        control="input"
                        placeholder="Phone"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        name="email"
                        label="Email"
                        control="input"
                        placeholder="Email"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                </Section>
                <Section>
                  <h3 className="section-header">Address</h3>
                  <div className="row">
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        control="input"
                        label="Address"
                        name="address"
                        placeholder="Address"
                        className="form-control capitalize"
                        required
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      {stateOptions.length ? (
                        <Input
                          icon="down"
                          name="state"
                          label="State"
                          control="lookup"
                          options={stateOptions}
                          onChange={onStateChange}
                          placeholder="State"
                          className="form-control"
                          required
                        />
                      ) : (
                        <Skeleton count={1} height={45} />
                      )}
                    </div>

                    <div className="col-md-6 col-sm-12 mb-2">
                      {cityOptions.length ? (
                        <Input
                          control="lookup"
                          name="city"
                          label="City"
                          icon="down"
                          className="form-control capitalize"
                          placeholder="City"
                          options={cityOptions}
                          required
                        />
                      ) : (
                        <>
                          <label
                            className="text-heading"
                            style={{ color: "#787B96" }}
                          >
                            Please select State to view City
                          </label>
                          <Skeleton count={1} height={35} />
                        </>
                      )}
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      {districtOptions.length ? (
                        <Input
                          icon="down"
                          control="lookup"
                          name="district"
                          label="District"
                          placeholder="District"
                          className="form-control"
                          required
                          options={districtOptions}
                        />
                      ) : (
                        <>
                          <label
                            className="text-heading"
                            style={{ color: "#787B96" }}
                          >
                            Please select State to view Districts
                          </label>
                          <Skeleton count={1} height={35} />
                        </>
                      )}
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      {areaOptions.length ? (
                        <Input
                          icon="down"
                          control="lookup"
                          name="medha_area"
                          label="Medha Area"
                          className="form-control"
                          placeholder="Medha Area"
                          required
                          options={areaOptions}
                        />
                      ) : (
                        <>
                          <label
                            className="text-heading"
                            style={{ color: "#787B96" }}
                          >
                            Please select State to view Medha Areas
                          </label>
                          <Skeleton count={1} height={35} />
                        </>
                      )}
                    </div>

                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        control="input"
                        name="pin_code"
                        label="Pin Code"
                        placeholder="Pin Code"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                </Section>
                <Section>
                  <h3 className="section-header">Contacts</h3>
                  <FieldArray name="contacts">
                    {({ insert, remove, push }) => (
                      <div>
                        {values.contacts &&
                          values.contacts.length > 0 &&
                          values.contacts.map((contact, index) => (
                            <div
                              key={index}
                              className="row py-2 mx-0 mb-3 border bg-white shadow-sm rounded"
                            >
                              <div className="col-md-6 col-sm-12 mb-2">
                                <Input
                                  control="input"
                                  name={`contacts.${index}.full_name`}
                                  label="Name"
                                  placeholder="Name"
                                  className="form-control capitalize"
                                  required
                                />
                              </div>
                              <div className="col-md-6 col-sm-12 mb-2">
                                <Input
                                  name={`contacts.${index}.email`}
                                  label="Email"
                                  control="input"
                                  placeholder="Email"
                                  className="form-control"
                                  required
                                />
                              </div>
                              <div className="col-md-6 col-sm-12 mb-2">
                                <Input
                                  name={`contacts.${index}.phone`}
                                  control="input"
                                  label="Phone Number"
                                  className="form-control"
                                  placeholder="Phone Number"
                                  required
                                />
                              </div>
                              <div className="col-md-6 col-sm-12 mb-2">
                                <Input
                                  name={`contacts.${index}.designation`}
                                  control="input"
                                  label="Designation"
                                  className="form-control capitalize"
                                  placeholder="Designation"
                                  required
                                />
                              </div>
                              <div className="col-md-6 col-sm-12 mb-2">
                                <button
                                  className="btn btn-danger btn-sm"
                                  type="button"
                                  onClick={() => remove(index)}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        <div className="mt-2">
                          <button
                            className="btn btn-primary btn-sm"
                            type="button"
                            onClick={() => {
                              push({
                                full_name: "",
                                email: "",
                                phone: "",
                                designation: "",
                              });
                            }}
                          >
                            Add Contact
                          </button>
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </Section>
                <Section>
                  <h3 className="section-header">Additional Info</h3>
                  <div className="row">
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        icon="down"
                        control="lookup"
                        name="paid_leaves"
                        label="Paid Leaves"
                        options={yesOrNoOptions}
                        className="form-control"
                        placeholder="Paid Leaves"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        icon="down"
                        control="lookup"
                        name="employee_benefits"
                        label="Employee Benefits"
                        options={yesOrNoOptions}
                        className="form-control"
                        placeholder="Employee Benefits"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        icon="down"
                        control="lookup"
                        name="employment_contract"
                        label="Employment Contract"
                        options={yesOrNoOptions}
                        className="form-control"
                        placeholder="Employment Contract"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        icon="down"
                        control="lookup"
                        name="offer_letter"
                        label="Offer Letter"
                        options={yesOrNoOptions}
                        className="form-control"
                        placeholder="Offer Letter"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        icon="down"
                        control="lookup"
                        name="medha_partner"
                        label="Medha Partner"
                        options={yesOrNoOptions}
                        className="form-control"
                        placeholder="Medha Partner"
                      />
                    </div>
                  </div>
                </Section>
              </div>
              <div className="row mt-3 py-3">
                <div className="col-12">
                  {props.errors
                    ? props.errors.length !== 0 && (
                        <div className="alert alert-danger">
                          <span>
                            There are some errors. Please resolve them and save
                            again:
                          </span>
                          <ul className="mb-0">
                            {props.errors.map((error, index) => (
                              <li key={index}>
                                {error.message.toLowerCase() ===
                                "duplicate entry"
                                  ? `Employer with "${formValues.name}" already exists.`
                                  : error.message}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    : null}
                </div>
                <div className="row justify-content-end mt-1">
                  <div className="col-auto p-0">
                    <button
                      type="button"
                      onClick={onHide}
                      className="btn btn-secondary btn-regular collapse_form_buttons"
                    >
                      CANCEL
                    </button>
                  </div>
                  <div className="col-auto p-0">
                    <button
                      type="submit"
                      className="btn btn-primary btn-regular collapse_form_buttons"
                    >
                      SAVE
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default EmployerForm;
