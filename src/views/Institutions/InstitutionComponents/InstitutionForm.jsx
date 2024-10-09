import { Formik, FieldArray, Form } from "formik";
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { FaSchool } from "react-icons/fa";

import { Input } from "../../../utils/Form";
import { InstituteValidations } from "../../../validations";
import { getInstitutionsPickList } from "./instituteActions";
import {
  getAddressOptions,
  getStateDistricts,
} from "../../Address/addressActions";
import { urlPath } from "../../../constants";
import {
  filterAssignedTo,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import api from "../../../apis";

const Section = styled.div`
  padding-top: 30px;
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

const InstitutionForm = (props) => {
  let { onHide, show } = props;
  const [institutionTypeOpts, setInstitutionTypeOpts] = useState([]);
  const [statusOpts, setStatusOpts] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [logo, setLogo] = useState(null);
  const [stateOptions, setStateOptions] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [formValues, setFormValues] = useState(null);
  const [isDuplicate, setDuplicate] = useState(false);
  const userId = parseInt(localStorage.getItem("user_id"));

  useEffect(() => {
    getInstitutionsPickList().then((data) => {
      setInstitutionTypeOpts(
        data.type.map((item) => {
          return {
            key: item.value,
            label: item.value,
            value: item.value,
          };
        })
      );
      setStatusOpts(
        data.status.map((item) => {
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

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
  }, []);

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
        data?.data?.data?.geographiesConnection.groupBy.area
          .map((area) => ({
            key: area.id,
            label: area.key,
            value: area.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
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
    values.name = values.name
      .split(" ")
      .map((word) => {
        return word[0].toUpperCase() + word.substring(1);
      })
      .join(" ");
    values.city = values.city[0].toUpperCase() + values.city.slice(1);
    values.address = values.address
      .split(" ")
      .map((word) => {
        return word[0].toUpperCase() + word.substring(1);
      })
      .join(" ");

    setFormValues(values);
    if (logo) {
      values.logo = logo;
    }
    setDisableSaveButton(true);
    await onHide(values);
    setDisableSaveButton(false);
  };

  const logoUploadHandler = ({ id }) => setLogo(id);

  let initialValues = {
    name: "",
    type: "",
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

    if (props.mou) {
      initialValues["mou"] = props.mou.map((mou) => ({
        ...mou,
        start_date: mou.start_date ? new Date(mou.start_date) : null,
        end_date: mou.end_date ? new Date(mou.end_date) : null,
      }));
    }
  }

  if (!props.contacts) {
    // create an empty contact if no contacts are present
    initialValues["contacts"] = [];
  }

  if (!props.mou) {
    // create an empty MoU if no MoUs are present
    initialValues["mou"] = [];
  }

  const FindDuplicate = async (setValue, name) => {
    setValue("name", name);

    try {
      const { data } = await api.post("/institutions/findDuplicate", {
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
              alt="Institution Logo"
            />
          ) : (
            <div className="flex-row-centered avatar avatar-default mr-2">
              <FaSchool size={25} />
            </div>
          )}
          <h1 className="text--primary bebas-thick mb-0">
            {props.id ? props.name : "Add New Institution"}
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={InstituteValidations}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="row form_sec">
                <Section>
                  <h3 className="section-header">Details</h3>
                  <div className="row">
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        name="name"
                        label="Name"
                        required
                        control="input"
                        placeholder="Name"
                        onChange={(e) =>
                          FindDuplicate(setFieldValue, e.target.value)
                        }
                        className="form-control capitalize"
                      />
                      {isDuplicate && !props.id ? (
                        <p style={{ color: "red" }}>
                          This instituition already exist on the system
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
                          required
                          className="form-control"
                          placeholder="Assigned To"
                          filterData={filterAssignedTo}
                          defaultOptions={assigneeOptions}
                        />
                      ) : (
                        <Skeleton count={1} height={45} />
                      )}
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      {institutionTypeOpts.length ? (
                        <Input
                          icon="down"
                          control="lookup"
                          name="type"
                          label="Type"
                          required
                          options={institutionTypeOpts}
                          className="form-control"
                          placeholder="Type"
                        />
                      ) : (
                        <Skeleton count={1} height={45} />
                      )}
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      {statusOpts.length ? (
                        <Input
                          icon="down"
                          control="lookup"
                          name="status"
                          label="Status"
                          required
                          options={statusOpts}
                          className="form-control"
                          placeholder="Status"
                        />
                      ) : (
                        <Skeleton count={1} height={45} />
                      )}
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
                        required
                        control="input"
                        placeholder="Phone"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        type="email"
                        name="email"
                        label="Email"
                        required
                        control="input"
                        placeholder="Email"
                        className="form-control"
                      />
                    </div>
                  </div>
                </Section>
                <Section>
                  <h3 className="section-header">MoU</h3>
                  <FieldArray name="mou">
                    {({ remove, push }) => (
                      <div>
                        {values.mou &&
                          values.mou.length > 0 &&
                          values.mou.map((mou, index) => (
                            <div
                              key={index}
                              className="row py-2 mx-0 mb-3 border bg-white shadow-sm rounded"
                            >
                              <div className="col-md-6 col-sm-12">
                                <Input
                                  name={`mou.${index}.start_date`}
                                  label="Start Date of MoU"
                                  placeholder="Start Date"
                                  control="datepicker"
                                  className="form-control"
                                  autoComplete="off"
                                />
                              </div>
                              <div className="col-md-6 col-sm-12 mb-2">
                                <Input
                                  name={`mou.${index}.end_date`}
                                  label="End Date of MoU"
                                  placeholder="End Date"
                                  control="datepicker"
                                  className="form-control"
                                  autoComplete="off"
                                />
                              </div>
                              <div className="col-md-6 col-sm-12 mb-2">
                                {mou && mou.mou_file && mou.mou_file.url ? (
                                  <div>
                                    <label className="text-label leading-24">
                                      MoU
                                    </label>
                                    <div>
                                      {mou.mou_file.url.substring(
                                        mou.mou_file.url.lastIndexOf("/") + 1
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <Input
                                    control="file"
                                    name={`mou.${index}.mou_file`}
                                    label="MoU"
                                    className="form-control"
                                    placeholder="MoU"
                                    accept=".pdf, .docx"
                                    onChange={(event) => {
                                      setFieldValue(
                                        `mou.${index}.mou_file`,
                                        event.currentTarget.files[0]
                                      );
                                    }}
                                  />
                                )}
                                <button
                                  className="btn btn-danger btn-sm mt-3"
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
                                start_date: "",
                                end_date: "",
                                mou_file: "",
                              });
                            }}
                          >
                            Add MoU
                          </button>
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </Section>
                <Section>
                  <h3 className="section-header">Address</h3>
                  <div className="row">
                    <div className="col-md-12 col-sm-12 mb-2">
                      <Input
                        control="input"
                        label="Address"
                        required
                        name="address"
                        placeholder="Address"
                        className="form-control capitalize"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      {stateOptions.length ? (
                        <Input
                          icon="down"
                          name="state"
                          label="State"
                          required
                          control="lookup"
                          options={stateOptions}
                          onChange={onStateChange}
                          placeholder="State"
                          className="form-control"
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
                          options={cityOptions}
                          required
                          placeholder="City"
                          className="form-control capitalize"
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
                          control="lookup"
                          icon="down"
                          label="District"
                          required
                          name="district"
                          options={districtOptions}
                          placeholder="District"
                          className="form-control"
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
                          required
                          options={areaOptions}
                          className="form-control"
                          placeholder="Medha Area"
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
                        required
                        placeholder="Pin Code"
                        className="form-control"
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
                                  required
                                  placeholder="Name"
                                  className="form-control capitalize"
                                />
                              </div>
                              <div className="col-md-6 col-sm-12 mb-2">
                                <Input
                                  name={`contacts.${index}.email`}
                                  label="Email"
                                  required
                                  control="input"
                                  placeholder="Email"
                                  className="form-control "
                                />
                              </div>
                              <div className="col-md-6 col-sm-12 mb-2">
                                <Input
                                  name={`contacts.${index}.phone`}
                                  control="input"
                                  label="Phone Number"
                                  required
                                  className="form-control"
                                  placeholder="Phone Number"
                                />
                              </div>
                              <div className="col-md-6 col-sm-12 mb-2">
                                <Input
                                  name={`contacts.${index}.designation`}
                                  control="input"
                                  label="Designation"
                                  required
                                  className="form-control capitalize"
                                  placeholder="Designation"
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
                                  ? `Institution with "${formValues.name}" already exists.`
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
                      disabled={disableSaveButton}
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

export default InstitutionForm;
