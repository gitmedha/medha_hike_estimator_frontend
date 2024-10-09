import { Formik, Form } from "formik";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { Input } from "../../../utils/Form";
import { OpportunityEmploymentConnectionValidations } from "../../../validations";
import { getEmploymentConnectionsPickList } from "../../Students/StudentComponents/StudentActions";
import {
  filterAssignedTo,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import { searchStudents } from "./opportunityAction";

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

const EnrollmentConnectionForm = (props) => {
  let { onHide, show, opportunity, employmentConnection } = props;
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [allStatusOptions, setAllStatusOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [showEndDate, setShowEndDate] = useState(false);
  const [endDateMandatory, setEndDateMandatory] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    props.employmentConnection ? props.employmentConnection.status : null
  );
  const [selectedOpportunityType, setSelectedOpportunityType] = useState(
    props.opportunity.type
  );
  const [workEngagementOptions, setWorkEngagementOptions] = useState([]);
  const [rejectionreason, setrejectionreason] = useState([]);
  const [otherrejection, setotherrejection] = useState(false);
  const [isRejected, setRejected] = useState(false);
  const [ifSelectedOthers, setIfSelectedOthers] = useState(false);

  const userId = localStorage.getItem("user_id");
  let initialValues = {
    student: "",
    employer_name: opportunity.employer.name,
    opportunity_name: opportunity.role_or_designation,
    status: "",
    start_date: "",
    end_date: "",
    source: "",
    salary_offered: "",
    reason_if_rejected_other: "",
    reason_if_rejected: "",
    assigned_to: userId,
    work_engagement:''
  };

  if (props.employmentConnection) {
    initialValues = { ...initialValues, ...props.employmentConnection };
    initialValues["student_id"] = props.employmentConnection.student
      ? Number(props.employmentConnection.student.id)
      : null;
    initialValues["assigned_to"] = props.employmentConnection?.assigned_to?.id;
    initialValues["employer_name"] =
      props.employmentConnection.opportunity &&
      props.employmentConnection.opportunity.employer
        ? props.employmentConnection.opportunity.employer.name
        : null;
    initialValues["opportunity_name"] = props.employmentConnection.opportunity
      ? props.employmentConnection.opportunity.role_or_designation
      : null;
    initialValues["start_date"] =
      props.employmentConnection?.start_date != "Invalid date"
        ? new Date(props.employmentConnection?.start_date)
        : null;
    initialValues["end_date"] =
      props.employmentConnection?.end_date != "Invalid date"
        ? new Date(props.employmentConnection?.end_date)
        : null;
  }

  useEffect(() => {
    setShowEndDate(
      selectedStatus === "Internship Complete" ||
        selectedStatus === "Offer Accepted by Student"
    );
    setEndDateMandatory(selectedStatus === "Internship Complete");
  }, [selectedStatus]);

  const onModalClose = () => {
    onHide();
  };

  const onSubmit = async (values) => {
    onHide(values);
  };

  useEffect(() => {
    let fetchdata=async()=>{
      getEmploymentConnectionsPickList().then((data) => {
        setWorkEngagementOptions(
          data.work_engagement.map((item) => ({
            ...item,
            key: item.value,
            value: item.value,
            label: item.value,
          }))
        );
        setAllStatusOptions(
          data.status.map((item) => ({
            ...item,
            key: item.value,
            value: item.value,
            label: item.value,
          }))
        );
        setrejectionreason(
          data.reason_if_rejected.map((item) => ({
            key: item.value,
            value: item.value,
            label: item.value,
          }))
        );
        setSourceOptions(
          data.source.map((item) => ({
            key: item.value,
            value: item.value,
            label: item.value,
          }))
        );
      });

      if (props.employmentConnection && props.employmentConnection.student) {
        filterStudent(props.employmentConnection.student.name).then((data) => {
          setStudentOptions(data);
        });
      }
    }
   fetchdata()
    
  }, [props]);

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
  }, []);
  useEffect(() => {
    setotherrejection(false);
  }, [employmentConnection]);

  useEffect(() => {
    setSelectedStatus(null);
    let filteredOptions = allStatusOptions;
    if (
      selectedOpportunityType === "Job" ||
      selectedOpportunityType === "Internship" ||
      selectedOpportunityType === "UnPaid GIG" ||
      selectedOpportunityType === "Paid GIG" ||
      selectedOpportunityType === "Apprenticeship"
    ) {
      filteredOptions = allStatusOptions.filter(
        (item) =>
          item["applicable-to"].includes(selectedOpportunityType) ||
          item["applicable-to"] === "Both"
      );
    } else {
      filteredOptions = allStatusOptions.filter(
        (item) => item["applicable-to"] === "Both"
      );
    }
    setStatusOptions(
      filteredOptions.map((item) => {
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
  }, [selectedOpportunityType, allStatusOptions]);

  const filterStudent = async (filterValue) => {
    try {
      const { data } = await searchStudents(filterValue);
      let employmentConnectionStudent = props.employmentConnection
        ? props.employmentConnection.student
        : null;
      let studentFoundInEmploymentList = false;
      let filterData = data.studentsConnection.values.map((student) => {
        if (
          props.employmentConnection &&
          student.id === Number(employmentConnectionStudent?.id)
        ) {
          studentFoundInEmploymentList = true;
        }
        return {
          ...student,
          label: `${student.full_name} (${student.student_id})`,
          value: Number(student.id),
        };
      });
      if (
        props.employmentConnection &&
        employmentConnectionStudent !== null &&
        !studentFoundInEmploymentList
      ) {
        filterData.unshift({
          label: employmentConnectionStudent.full_name,
          value: Number(employmentConnectionStudent.id),
        });
      }
      return filterData;
    } catch (error) {
      console.error(error);
    }
  };
  const handlechange = (e) => {
    if (e.value == "Others") {
      setotherrejection(true);
    }
  };

  const handleStatusChange = async (value) => {
    setSelectedStatus(value);

    if (value === "Rejected by Employer") {
      setRejected(true);
    } else if (value === "Student Dropped Out") {
      setRejected(true);
    } else if (value === "Offer Rejected by Student") {
      setRejected(true);
    } else {
      setRejected(false);
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
          <h1 className="text--primary bebas-thick mb-0">
            {props.employmentConnection && props.employmentConnection.id
              ? "Update"
              : "Add New"}{" "}
            Employment Connection
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={OpportunityEmploymentConnectionValidations}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Section>
                <div className="row form_sec">
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="student_id"
                      control="lookupAsync"
                      label="Student"
                      className="form-control"
                      placeholder="Student"
                      filterData={filterStudent}
                      defaultOptions={
                        props.employmentConnection ? studentOptions : true
                      }
                      required={true}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    {/* {statusOptions.length ? ( */}
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
                    {/* ) : ( */}
                    {/* <Skeleton count={1} height={45} /> */}
                    {/* )} */}
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      control="input"
                      name="employer_name"
                      label="Employer"
                      className="form-control"
                      placeholder="Employer"
                      disabled={true}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      control="input"
                      name="opportunity_name"
                      label="Opportunity"
                      className="form-control"
                      placeholder={"Opportunity"}
                      disabled={true}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="status"
                      label="Status"
                      required
                      options={statusOptions}
                      className="form-control"
                      placeholder="Status"
                      onChange={(e) => handleStatusChange(e.value)}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="start_date"
                      label="Start Date"
                      required
                      placeholder="Start Date"
                      control="datepicker"
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      min={0}
                      type="number"
                      name="salary_offered"
                      control="input"
                      label="Salary Offered"
                      required
                      className="form-control"
                      placeholder="Salary Offered"
                    />
                  </div>
                  {showEndDate && (
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        name="end_date"
                        label="End Date"
                        placeholder="End Date"
                        control="datepicker"
                        className="form-control"
                        autoComplete="off"
                        required={endDateMandatory}
                      />
                    </div>
                  )}
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="source"
                      label="Source"
                      required
                      options={sourceOptions}
                      className="form-control"
                      placeholder="Source"
                    />
                  </div>
                  {isRejected ||
                  (initialValues.reason_if_rejected &&
                    initialValues.reason_if_rejected.length) ? (
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        icon="down"
                        control="lookup"
                        name="reason_if_rejected"
                        label="Reason if Rejected"
                        required={
                          selectedStatus === "Offer Rejected by Student"
                        }
                        options={rejectionreason}
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("reason_if_rejected", e.value);
                          if (e.value === "Others") {
                            setIfSelectedOthers(true);
                          } else {
                            setIfSelectedOthers(false);
                          }
                        }}
                        placeholder="Reason if Rejected"
                      />
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {ifSelectedOthers ||
                  (initialValues.reason_if_rejected_other &&
                    initialValues.reason_if_rejected_other.length) ? (
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        name="reason_if_rejected_other"
                        control="input"
                        label="If Other, Specify"
                        required
                        className="form-control"
                        placeholder="If Other, Specify"
                      />
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="work_engagement"
                      label="Work Engagement"
                      options={workEngagementOptions}
                      className="form-control"
                      placeholder="Work Engagement"
                      required
                    />
                  </div>

                  {selectedOpportunityType === "Internship" && (
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        min={0}
                        type="number"
                        control="input"
                        name="number_of_internship_hours"
                        className="form-control"
                        label="Number of Internship hours"
                        required
                        placeholder="Number of Internship hours"
                      />
                    </div>
                  )}
                </div>
              </Section>
              <div className="row justify-content-end mt-1fo">
                <div className="col-auto p-0">
                  <button
                    type="button"
                    onClick={onModalClose}
                    className="btn btn-secondary btn-regular collapse_form_buttons"
                  >
                    CANCEL
                  </button>
                </div>
                <div className="col-auto p-0">
                  <button
                    type="submit"
                    className="btn btn-primary btn-regular collapse_form_buttons"
                    onClick={() => onSubmit(values)}
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

export default EnrollmentConnectionForm;
