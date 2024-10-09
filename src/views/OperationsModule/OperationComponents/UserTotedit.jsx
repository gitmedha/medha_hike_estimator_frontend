import { Formik, Form} from "formik";
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { FaSchool } from "react-icons/fa";
import { Input } from "../../../utils/Form";
import { urlPath } from "../../../constants";
import {
  getAddressOptions,
  getStateDistricts,
} from "../../Address/addressActions";
import {
  filterAssignedTo,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import DetailField from "../../../components/content/DetailField";
import moment from "moment";
import { updateUserTot,searchInstitutions,searchBatches } from "./operationsActions";
import * as Yup from "yup";

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

const UserTotedit = (props) => {
  let { onHide, show } = props;

  const [assigneeOptions, setAssigneeOptions] = useState([]);

  const [stateOptions, setStateOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
  }, []);

  useEffect(() => {
    if (props.institution) {
      filterInstitution().then((data) => {
        setInstitutionOptions(data);
      });
    }
    if (props.batch) {
      filterBatch().then((data) => {
        setBatchOptions(data);
      });
    }
  }, [props]);

  const filterInstitution = async (filterValue) => {
    try {
      const {data} = await searchInstitutions(filterValue);

      let filterData = data.institutionsConnection.values.map((institution) => {
        return {
          ...institution,
          label: institution.name,
          value: Number(institution.id),
        };
      });

      return filterData;

    } catch (error) {
      console.error(error);
    }
  };

  const filterBatch = async (filterValue) => {
    try {
      const {data} = await searchBatches(filterValue);

      let filterData = data.batchesConnection.values.map((batch) => {
        return {
          ...batch,
          label: batch.name,
          value: Number(batch.id),
        };
      });

      return filterData;

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
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
        onStateChange({ value: props.state });
      }
    });
  }, []);

  const onStateChange = async (value) => {
    await getStateDistricts(value).then((data) => {
      setAreaOptions([]);
      setAreaOptions(
        data?.data?.data?.geographiesConnection?.groupBy?.area
          .map((area) => ({
            key: area.id,
            label: area.key,
            value: area.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    });
  };

  const onSubmit = async (values) => {
    const newValueObject = { ...values };

    // delete newValueObject["institute_name"];
    newValueObject["start_date"] = moment(values["start_date"]).format(
      "YYYY-MM-DD"
    );
    newValueObject["end_date"] = moment(values["end_date"]).format(
      "YYYY-MM-DD"
    );
    // delete newValueObject["start_date"];
    // delete newValueObject["end_date"];
    delete newValueObject["published_at"];
    const value = await updateUserTot(Number(props.id), newValueObject);
    setDisableSaveButton(true);
    onHide(value);
    setDisableSaveButton(false);
  };

  const userId = localStorage.getItem("user_id");
  
  let initialValues = {
    user_name: "",
    trainer_1: "",
    start_date: "",
    end_date: "",
    project_name: "",
    certificate_given: "",
    module_name: "",
    project_type: "",
    new_entry: "",
    trainer_2: "",
    partner_dept: "",
    college: "",
    city: "",
    state: "",
    age: "",
    gender: "",
    contact: "",
    designation: "",
    published_at: "",
  };
  // { "Created At": "2023-04-19T12:18:24.383286Z", "Organization": "Goonj", "Activity Type": "Industry Talk/Expert Talk", "Institution": 329, "Updated At": null, "End Date": "2020-07-06", "Designation": "State Head(U.P)", "Start Date": "2020-07-06", "Assigned To": 123, "Other Links": "0", "Topic": "Goonj fellowship and NGO work", "Donor": false, "Batch": 162, "ID": 2201, "Updated By": null, "Students Attended": 14, "Created By": 2, "State": "Uttar Pradesh", "Area": "Gorakhpur (City)", "Guest": "Mr. Shushil Yadav" },

  function createdDateConvert(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  if (props) {
    initialValues = { ...props.totdata };
  }

  useEffect(() => {
    if (props.institution) {
      filterInstitution(props.institution.name).then((data) => {
        setInstitutionOptions(data);
      });
    }
  }, []);


  const [selectedOption, setSelectedOption] = useState(null); // State to hold the selected option

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };
  const totvalidation = Yup.object().shape({
    start_date: Yup.date().required("Start date is required"),
    end_date: Yup.date()
      .required("End date is required")
      .when("start_date", (start, schema) => {
      
        return schema.min(
          start,
          "End date must be greter than or equal to start date"
        );
      }),
  });

  return (
    <>
      {initialValues && props && (
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
                  alt="Student Profile"
                />
              ) : (
                <div className="flex-row-centered avatar avatar-default mr-2">
                  <FaSchool size={25} />
                </div>
              )}
              <h1 className="text--primary bebas-thick mb-0">
                {props.id ? props.full_name : "Add New Student"}
              </h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-white">
            <Formik
              onSubmit={onSubmit}
              initialValues={initialValues}
              validationSchema={totvalidation}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <Section>
                    <h3 className="section-header">Basic Info</h3>
                    <div className="row">
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="activity_type"
                          label="Activity Type"
                          className="form-control"
                          placeholder="Activity Type"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
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
                      </div>

                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="lookupAsync"
                          name="batch"
                          label="Batch"
                          required
                          filterData={filterBatch}
                          defaultOptions={batchOptions}
                          className="form-control1"
                          placeholder="Batch"
                        />
                      </div>

                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="lookupAsync"
                          name="institution"
                          label="Institution"
                          filterData={filterInstitution}
                          defaultOptions={institutionOptions}
                          placeholder="Institution"
                          className="form-control"
                          isClearable
                        />
                      </div>

                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="start_date"
                          label="Start Date "
                          //
                          placeholder="Date of Birth"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="end_date"
                          label="End Date"
                          placeholder="Date of Birth"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>

                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="donor"
                          label="Donor"
                          // required
                          className="form-control"
                          placeholder="Donor"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="topic"
                          label="Topic"
                          // required
                          className="form-control"
                          placeholder="Topic"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          icon="down"
                          control="input"
                          name="guest"
                          label="Guest"
                          // required
                          className="form-control"
                          placeholder="Guest"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        {/* {genderOptions.length ? ( */}
                        <Input
                          icon="down"
                          control="input"
                          name="designation"
                          label="Designation"
                          // required
                          // options={genderOptions}
                          className="form-control"
                          placeholder="Designation"
                        />
                        {/* ) : ( */}
                        {/* <Skeleton count={1} height={45} /> */}
                        {/* )} */}
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        {/* {genderOptions.length ? ( */}
                        <Input
                          icon="down"
                          control="input"
                          name="organization"
                          label="Organization"
                          // required
                          // options={genderOptions}
                          className="form-control"
                          placeholder="Organization"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="students_attended"
                          label="Student Attended"
                          // required
                          placeholder="Student atended"
                          control="input"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </Section>
                  <Section>
                    <h3 className="section-header">Address</h3>
                    <div className="row">
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
                            // required
                          />
                        ) : (
                          <Skeleton count={1} height={45} />
                        )}
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        {areaOptions.length ? (
                          <Input
                            icon="down"
                            name="area"
                            label="Area"
                            control="lookup"
                            options={areaOptions}
                            // onChange={onStateChange}
                            placeholder="Area"
                            className="form-control"
                            // required
                          />
                        ) : (
                          <>
                            <Skeleton count={1} height={45} />
                          </>
                        )}
                      </div>
                    </div>
                  </Section>

                  <Section>
                    <h3 className="section-header">Other Information</h3>
                    <div className="row">
                      <div className="col-md-6">
                        <DetailField
                          label="Updated By"
                          value={
                            props.Updated_by?.userName
                              ? props.Updated_by?.userName
                              : props.Created_by?.username
                          }
                        />
                        <DetailField
                          label="Updated At"
                          value={moment(
                            props.updated_at
                              ? props.updated_at
                              : props.created_at
                          ).format("DD MMM YYYY, h:mm a")}
                        />
                      </div>
                      <div className="col-md-6">
                        <DetailField
                          label="Created By"
                          value={
                            props.Created_by?.username
                              ? props.Created_by?.username
                              : ""
                          }
                        />
                        <DetailField
                          label="Created At "
                          value={moment(props.created_at).format(
                            "DD MMM YYYY, h:mm a"
                          )}
                        />
                      </div>
                    </div>
                  </Section>

                  <div className="row mt-3 py-3">
                    <div className="d-flex justify-content-start">
                      <button
                        className="btn btn-primary btn-regular mx-0"
                        type="submit"
                        disabled={disableSaveButton}
                      >
                        SAVE
                      </button>
                      <button
                        type="button"
                        onClick={onHide}
                        className="btn btn-secondary btn-regular mr-2"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default UserTotedit;
