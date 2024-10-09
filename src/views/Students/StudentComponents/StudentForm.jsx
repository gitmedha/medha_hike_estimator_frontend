import { Formik, Form } from "formik";
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { FaSchool } from "react-icons/fa";
import { Input } from "../../../utils/Form";
import { StudentValidations } from "../../../validations";
import { urlPath } from "../../../constants";
import { getStudentsPickList } from "./StudentActions";
import {
  getAddressOptions,
  getStateDistricts,
} from "../../Address/addressActions";
import {
  filterAssignedTo,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import { isAdmin, isSRM } from "../../../common/commonFunctions";
import { capitalizeFirstLetter } from "../../../utils/function/Checker";

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

const StudentForm = (props) => {
  let { onHide, show } = props;
  const [statusOptions, setStatusOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [incomeLevelOptions, setIncomeLevelOptions] = useState([]);
  const [howDidYouHearAboutUsOptions, setHowDidYouHearAboutUsOptions] =
    useState([]);
  const [selectedHowDidYouHearAboutUs, setSelectedHowDidYouHearAboutUs] =
    useState(props?.how_did_you_hear_about_us);
  const [logo, setLogo] = useState(null);
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [showCVSubLabel, setShowCVSubLabel] = useState(
    props.CV && props.CV.url
  );
  const [yourPlanFfterYourCurrentCourse, setyourPlanFfterYourCurrentCourse] =
    useState([]);
  const userId = parseInt(localStorage.getItem("user_id"));
  const medhaChampionOptions = [
    { key: true, value: true, label: "Yes" },
    { key: false, value: false, label: "No" },
  ];
  const interestedInEmploymentOpportunitiesOptions = [
    { key: true, value: true, label: "Yes" },
    { key: false, value: false, label: "No" },
  ];

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
  }, []);

  useEffect(() => {
    getStudentsPickList().then((data) => {
      setStatusOptions(
        data.status.map((item) => {
          if (
            localStorage.getItem("user_role")?.toLowerCase() === "srm" &&
            item.value.toLowerCase() === "unknown"
          ) {
            return { isDisabled: true };
          } else {
            return { key: item.value, value: item.value, label: item.value };
          }
        })
      );
      setGenderOptions(
        data.gender.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
        }))
      );
      setCategoryOptions(
        data.category.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
        }))
      );
      setIncomeLevelOptions(
        data.income_level.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
        }))
      );
      setHowDidYouHearAboutUsOptions(data.how_did_you_hear_about_us.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setyourPlanFfterYourCurrentCourse(data?.your_plan_after_your_current_course?.map(item => ({ key: item,value: item, label: item })));
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
        onStateChange({ value: props.state });
      }
    });

    setShowCVSubLabel(props.CV && props.CV.url);
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
      // .sort((a,b)=>a.label.localeCompare(b.label))
    });
  };

  const onSubmit = async (values) => {
    if (logo) {
      values.logo = logo;
    }
    values.full_name = capitalizeFirstLetter(values.full_name);
    values.name_of_parent_or_guardian = capitalizeFirstLetter(
      values.name_of_parent_or_guardian
    );
    setDisableSaveButton(true);
    await onHide(values);
    setDisableSaveButton(false);
  };

  let initialValues = {
    institution: "",
    batch: "",
    full_name: "",
    phone: "",
    alternate_phone: "",
    name_of_parent_or_guardian: "",
    category: "",
    email: "",
    gender: "",
    assigned_to: userId.toString(),
    status: "",
    income_level: "",
    family_annual_income: "",
    date_of_birth: "",
    city: "",
    pin_code: "",
    medha_area: "",
    address: "",
    state: "",
    district: "",
    logo: "",
    registered_by: userId.toString(),
    how_did_you_hear_about_us: "",
    how_did_you_hear_about_us_other: "",
    // your_plan_after_your_current_course: "",
  };

  let fileName = "";
  if (props.id) {
    initialValues = { ...props };
    initialValues["date_of_birth"] = new Date(props?.date_of_birth);
    initialValues["assigned_to"] = props?.assigned_to?.id;
    initialValues["registered_by"] = props?.registered_by?.id;
    initialValues["district"] = props.district ? props.district : null;
    initialValues["medha_area"] = props.medha_area ? props.medha_area : null;

    if (props.CV && props.CV.url) {
      const cvUrlSplit = props.CV.url.split("/");
      fileName = cvUrlSplit[cvUrlSplit.length - 1];
    }
  }

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
          validationSchema={StudentValidations}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="row form_sec">
                <Section>
                  <div className="row">
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        name="full_name"
                        label="Name"
                        required
                        control="input"
                        placeholder="Name"
                        className="form-control capitalize"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      {/* {statusOptions.length ? ( */}
                      <Input
                        control="lookupAsync"
                        name="assigned_to"
                        label="Assigned To"
                        required
                        className="form-control capitalize"
                        placeholder="Assigned To"
                        filterData={filterAssignedTo}
                        defaultOptions={assigneeOptions}
                      />
                      {/* ) : ( */}
                      {/* <Skeleton count={1} height={45} /> */}
                      {/* )} */}
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        name="name_of_parent_or_guardian"
                        label="Parents Name"
                        required
                        control="input"
                        placeholder="Parents Name"
                        className="form-control capitalize"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        icon="down"
                        control="lookup"
                        name="status"
                        label="Status"
                        required
                        options={statusOptions}
                        className="form-control"
                        placeholder="Status"
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
                        name="alternate_phone"
                        label="Alternate Phone"
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
                        control="input"
                        placeholder="Email"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        icon="down"
                        control="lookup"
                        name="gender"
                        label="Gender"
                        required
                        options={genderOptions}
                        className="form-control"
                        placeholder="Gender"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        name="date_of_birth"
                        label="Date of Birth"
                        required
                        maxDate={new Date(2020, 11, 31)}
                        placeholder="Date of Birth"
                        control="datepicker"
                        className="form-control"
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        icon="down"
                        control="lookup"
                        name="category"
                        label="Category"
                        required
                        options={categoryOptions}
                        className="form-control"
                        placeholder="Category"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        icon="down"
                        control="lookup"
                        name="income_level"
                        label="Income Level (INR)"
                        required
                        options={incomeLevelOptions}
                        className="form-control"
                        placeholder="Income Level (INR)"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        min={0}
                        type="number"
                        name="family_annual_income"
                        label="Family Annual Income"
                        control="input"
                        placeholder="Family Annual Income"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        control="lookupAsync"
                        name="registered_by"
                        label="Registered By"
                        className="form-control"
                        placeholder="Registered By"
                        filterData={filterAssignedTo}
                        defaultOptions={assigneeOptions}
                        isDisabled={!isAdmin()}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      {howDidYouHearAboutUsOptions.length ? (
                        <Input
                          icon="down"
                          control="lookup"
                          name="how_did_you_hear_about_us"
                          label="How did you hear about us?"
                          options={howDidYouHearAboutUsOptions}
                          className="form-control"
                          placeholder="How did you hear about us?"
                          onChange={(option) => {
                            setSelectedHowDidYouHearAboutUs(option.value);
                          }}
                          required
                        />
                      ) : (
                        <Skeleton count={1} height={45} />
                      )}
                    </div>

                    {selectedHowDidYouHearAboutUs?.toLowerCase() ===
                      "other" && (
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="how_did_you_hear_about_us_other"
                          label="If Other, Specify"
                          control="input"
                          placeholder="If Other, Specify"
                          className="form-control"
                          required
                        />
                      </div>
                    )}
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        icon="down"
                        control="lookup"
                        name="your_plan_after_your_current_course"
                        label="Your plan after your current course"
                        options={yourPlanFfterYourCurrentCourse}
                        className="form-control"
                        placeholder="Current Course"
                      />
                    </div>
                    {(isSRM() || isAdmin()) && (
                      <div className="col-sm-12 mb-2">
                        <div className="col-md-6">
                          <Input
                            control="file"
                            name="cv_upload"
                            label="CV"
                            subLabel={
                              showCVSubLabel && (
                                <div className="mb-1">{fileName}</div>
                              )
                            }
                            className="form-control"
                            placeholder="CV"
                            accept=".pdf, .docx"
                            onChange={(event) => {
                              setFieldValue(
                                "cv_file",
                                event.currentTarget.files[0]
                              );
                              setShowCVSubLabel(false);
                            }}
                          />
                        </div>
                      </div>
                    )}
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
                          icon="down"
                          control="lookup"
                          name="city"
                          label="City"
                          className="form-control"
                          placeholder="City"
                          required
                          options={cityOptions}
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
                {/* <Section>
                  <h3 className="section-header">Additional Info</h3>
                  <div className="row">
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        icon="down"
                        control="lookup"
                        name="medha_champion"
                        label="Medhavi Member"
                        options={medhaChampionOptions}
                        className="form-control"
                        placeholder="Medhavi Member"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        icon="down"
                        control="lookup"
                        name="interested_in_employment_opportunities"
                        label="Interested in Employment Opportunities"
                        options={interestedInEmploymentOpportunitiesOptions}
                        className="form-control"
                        placeholder="Opportunities"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        name="old_sis_id"
                        label="ID in SIS 2.0"
                        control="input"
                        placeholder="ID in SIS 2.0"
                        className="form-control"
                      />
                    </div>
                  </div>
                </Section> */}
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
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default StudentForm;
