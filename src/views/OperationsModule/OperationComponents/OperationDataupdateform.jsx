import { Formik, Form } from "formik";
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
import { getOpsPickList, updateOpsActivity } from "./operationsActions";
import * as Yup from "yup";
import { numberChecker } from "../../../utils/function/OpsModulechecker";
import { searchBatches, searchInstitutions } from "./operationsActions";

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

const hideBatchName = [
  "New Enrollments -- CAB",
  "New Enrollments -- Lab",
  "New Enrollments -- TAB",
  "New Enrollments -- eCab",
  "New Enrollments -- eTAB",
  "New Enrollments -- CAB Plus Work from Home",
  "New Enrollments -- Svapoorna",
  "New Enrollments -- Swarambh",
  "New Enrollments -- Workshop",
  "New Enrollments -- BMC Design Lab",
  "New Enrollments -- In The Bank",
];

const options = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];
const Activityoptions = [
  { value: "Industry talk/Expert talk", label: "Industry talk/Expert talk" },
  {
    value: "Industry visit/Exposure visit",
    label: "Industry visit/Exposure visit",
  },
  {
    value: "Workshop/Training Session/Activity (In/Off campus)",
    label: "Workshop/Training Session/Activity (In/Off campus)",
  },
  { value: "Alumni Engagement", label: "Alumni Engagement" },
  { value: "Placement Drive", label: "Placement Drive" },
];

const OperationDataupdateform = (props) => {
  let { onHide, show, closeopsedit, refreshTableOnDataSaving } = props;
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [programeName, setProgramName] = useState([]);
  const [disablevalue, setdisablevalue] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
  }, []);

  useEffect(() => {
    if (props.institution) {
      filterInstitution(props.institution.name).then((data) => {
        setInstitutionOptions(data);
      });
    }
    if (props.batch) {
      filterBatch(props.batch.name).then((data) => {
        setBatchOptions(data);
      });
    }
  }, [props]);

  const filterInstitution = async (filterValue) => {
    try {
      const { data } = await searchInstitutions(filterValue);
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
      const { data } = await searchBatches(filterValue);
      let batchInformtion = props ? props.batch : null;
        let batchFoundInList = false;
        let filterData = data.batchesConnection.values.map((batch) => {
          if (props && batch.id === Number(batchInformtion?.id)) {
            batchFoundInList = true;
          }
          if (hideBatchName.includes(batch.name)) {
            return {};
          } else {
            return {
              ...batch,
              label: batch.name,
              value: Number(batch.id),
            };
          }
        });
        if (props && batchInformtion !== null && !batchFoundInList) {
          filterData.unshift({
            label: batchInformtion.name,
            value: Number(batchInformtion.id),
          });
        }
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
    newValueObject["assigned_to"] = Number(values["assigned_to"]);
    newValueObject["batch"] = Number(values["batch"]);
    newValueObject["students_attended"] = Number(values["students_attended"]);
    newValueObject["start_date"] = moment(values["start_date"]).format(
      "YYYY-MM-DD"
    );
    newValueObject["end_date"] = moment(values["end_date"]).format(
      "YYYY-MM-DD"
    );
    newValueObject["institution"] = Number(values["institution"]);
    newValueObject["donor"] = values["donor"] === "Yes" || "yes" ? true : false;
    newValueObject["updatedby"] = Number(userId);
    delete newValueObject["updated_at"];
    delete newValueObject["created_at"];
    delete newValueObject["institute_name"];

    const value = await updateOpsActivity(Number(props.id), newValueObject);
    refreshTableOnDataSaving();
    setDisableSaveButton(true);
    onHide(value);
    closeopsedit();
    setDisableSaveButton(false);
  };

  const userId = localStorage.getItem("user_id");
  let initialValues = {
    topic: "",
    assigned_to: props.assigned_to.id.toString(),
    state: "",
    activity_type: "",
    institution: "",
    guest: "",
    organization: "",
    updated_at: "",
    start_date: "",
    end_date: "",
    designation: "",
    updatedby: "",
    area: "",
    students_attended: "",
    batch: "",
  };

  if (props) {
    initialValues["batch"] = Number(props.batch.id);
    initialValues["institution"] = Number(props.institution.id);
    initialValues["topic"] = props.topic;
    initialValues["activity_type"] = props.activity_type;
    initialValues["assigned_to"] = props.assigned_to.id.toString();
    initialValues["program_name"] = props.program_name;
    initialValues["start_date"] = new Date(props.start_date);
    initialValues["end_date"] = new Date(props.end_date);
    initialValues["students_attended"] = props?.students_attended;
    initialValues["created_at"] = props.created_at;
    initialValues["organization"] = props.organization;
    initialValues["designation"] = props.designation;
    initialValues["guest"] = props.guest;
    initialValues["state"] = props.state ? props.state : null;
    initialValues["institute_name"] = Number(props?.institution?.id);
    initialValues["donor"] = props.donor ? "Yes" : "No";
    initialValues["area"] = props.area ? props.area : null;
  }

  useEffect(() => {
    if (props.institution) {
      filterInstitution(props.institution.name).then((data) => {
        setInstitutionOptions(data);
      });
    }
  }, []);

  const operationvalidation = Yup.object().shape({
    start_date: Yup.date().required("Start date is required"),
    end_date: Yup.date()
      .required("End date is required")
      .when("start_date", (start, schema) => {
        return schema.min(
          start,
          "End date must be greater than or equal to start date"
        );
      }),
  });
  useEffect(async () => {
    let data = await getOpsPickList().then((data) => {
      return data.program_name.map((value) => ({
        key: value,
        label: value,
        value: value,
      }));
    });

    setProgramName(data);
  }, []);

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
              className="d-flex  justify-content-evenly"
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
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-white">
            <Formik
              onSubmit={onSubmit}
              initialValues={initialValues}
              validationSchema={operationvalidation}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div className="row form_sec">
                    <Section>
                      <h3 className="section-header">Basic Info</h3>
                      <div className="row">
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            icon="down"
                            control="lookup"
                            name="activity_type"
                            label="Activity Type"
                            required
                            options={Activityoptions}
                            className="form-control"
                            placeholder="Activity Type"
                          />
                        </div>

                        <div className="col-md-6 col-sm-12 mb-2">
                          {assigneeOptions.length && (
                            <Input
                              control="lookupAsync"
                              name="assigned_to"
                              label="Assigned To"
                              className="form-control"
                              placeholder="Assigned To"
                              filterData={filterAssignedTo}
                              defaultOptions={assigneeOptions}
                            />
                          )}
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            icon="down"
                            control="lookup"
                            name="program_name"
                            label="Program Name"
                            required
                            options={programeName}
                            className="form-control"
                            placeholder="Program Name"
                          />
                        </div>

                        <div className="col-md-6 col-sm-12 mb-2">
                          {batchOptions.length && (
                            <Input
                              control="lookupAsync"
                              name="batch"
                              label="Batch Name"
                              filterData={filterBatch}
                              defaultOptions={batchOptions}
                              className="form-control1"
                              placeholder="Batch"
                            />
                          )}
                        </div>

                        <div className="col-md-6 col-sm-12 mb-2">
                          {institutionOptions.length && (
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
                          )}
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
                            icon="down"
                            control="lookup"
                            name="donor"
                            label="Donor"
                            required
                            options={options}
                            className="form-control"
                            placeholder="New Entry"
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            control="input"
                            name="topic"
                            label="Topic"
                            className="form-control"
                            placeholder="Topic"
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            icon="down"
                            control="input"
                            name="guest"
                            label="Guest Name"
                            className="form-control"
                            placeholder="Guest"
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            icon="down"
                            control="input"
                            name="designation"
                            label="Designation"
                            className="form-control"
                            placeholder="Designation"
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            icon="down"
                            control="input"
                            name="organization"
                            label="Organization"
                            className="form-control"
                            placeholder="Organization"
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            name="students_attended"
                            label="Student Attended"
                            placeholder="Student atended"
                            control="input"
                            className="form-control"
                            autoComplete="off"
                            onKeyPress={numberChecker}
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
                              label="Medha Area"
                              control="lookup"
                              options={areaOptions}
                              placeholder="Area"
                              className="form-control"
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
                              props.updatedby?.userName
                                ? props.updatedby?.userName
                                : props.createdby?.username
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
                              props.createdby?.username
                                ? props.createdby?.username
                                : ""
                            }
                          />
                          <DetailField
                            label="Created At"
                            value={moment(props.created_at).format(
                              "DD MMM YYYY, h:mm a"
                            )}
                          />
                        </div>
                      </div>
                    </Section>
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
      )}
    </>
  );
};

export default OperationDataupdateform;