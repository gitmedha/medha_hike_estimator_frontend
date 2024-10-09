import { Formik, Form } from "formik";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import Select ,{components} from "react-select";

import { Input } from "../../../utils/Form";
import { EmploymentConnectionValidations } from "../../../validations";
import {
  getEmployerOpportunities,
  getEmploymentConnectionsPickList,
  searchEmployers,
  searchStudents,
} from "../StudentComponents/StudentActions";
import {
  filterAssignedTo,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import moment from "moment";
import CheckBoxForm from "../StudentComponents/CheckBoxForm";
import AlumMassEdit from "./AlumMassEdit";
import EmploymentmassEdit from "./EmploymentmassEdit";

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

const MassEmployerUpload = (props) => {
  let { onHide, show, student, employmentConnection } = props;
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [employerOptions, setEmployerOptions] = useState([]);
  const [allStatusOptions, setAllStatusOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [employerOpportunityOptions, setEmployerOpportunityOptions] = useState(
    []
  );
  const [workEngagementOptions, setWorkEngagementOptions] = useState([]);
  const [selectedOpportunityType, setSelectedOpportunityType] = useState(
    props.employmentConnection?.opportunity?.type
  );
  const [selectedStatus, setSelectedStatus] = useState(
    props?.employmentConnection?.status
  );
  const [showEndDate, setShowEndDate] = useState(false);
  const [endDateMandatory, setEndDateMandatory] = useState(false);
  const [rejectionreason, setrejectionreason] = useState([]);
  const [otherrejection, setotherrejection] = useState(false);
  const [showOther, setShowother] = useState(false);
  const [isRejected, setRejected] = useState(false);
  const [ifSelectedOthers, setIfSelectedOthers] = useState(false);
  const [students, setStudents] = useState([]);
  const [bulkAddCheck, setBulkAddCheck] = useState(true);
  const [massEditCheck, setMassEditCheck] = useState(false);
  const [studentInput, setStudentInput] = useState("");

  const userId = localStorage.getItem("user_id");
  let initialValues = {
    employment_connection_student: "",
    employer_id: "",
    opportunity_id: "",
    status: "",
    start_date: "",
    end_date: "",
    source: "",
    salary_offered: "",
    reason_if_rejected: "",
    reason_if_rejected_other: "",
    assigned_to: userId,
  };

  if (props.employmentConnection) {
    initialValues = { ...initialValues, ...props.employmentConnection };
    // initialValues["employer_id"] = props.employmentConnection
    //   ? Number(props.employmentConnection.opportunity?.employer?.id)
    //   : null;

    let dataval = rejectionreason?.find(
      (obj) => obj.value === employmentConnection.reason_if_rejected
    );
    if (dataval) {
      if (dataval.value == employmentConnection.reason_if_rejected) {
        initialValues["reason_if_rejected"] =
          employmentConnection.reason_if_rejected;
      }
    }

    initialValues["assigned_to"] = props.employmentConnection?.assigned_to?.id;
    initialValues["opportunity_id"] = props.employmentConnection.opportunity
      ? props.employmentConnection.opportunity.id
      : null;
    initialValues["start_date"] = props.employmentConnection.start_date
      ? new Date(props.employmentConnection.start_date)
      : null;
    initialValues["end_date"] = props.employmentConnection.end_date
      ? new Date(props.employmentConnection.end_date)
      : null;
  }
  useEffect(() => {
    filterStudent().then((data) => {
      setStudentOptions(data);
    });
    setStudentOptions(
      props.data.map((obj) => {
        return { value: obj.id, label: obj.full_name };
      })
    );
  }, [props]);

  const onModalClose = () => {
    setStudents([])
    onHide([]);
  };

  const onSubmit = async (data) => {
    data.students = students;
    let newdata = data.students.map((obj) => {
      let startDate = data.start_date
        ? moment(data.start_date).format("YYYY-MM-DD")
        : null;
      let endDate = data.end_date
        ? moment(data.end_date).format("YYYY-MM-DD")
        : null;
      return {
        assigned_to: data.assigned_to,
        end_date: endDate,
        number_of_internship_hours: data.number_of_internship_hours,
        opportunity: data.opportunity_id,
        reason_if_rejected: data.reason_if_rejected,
        reason_if_rejected_other: data.reason_if_rejected_other,
        salary_offered: data.salary_offered,
        source: data.source,
        start_date: startDate,
        status: data.status,
        student: obj.id,
        employer_id:data.employer_id,
        work_engagement: data.work_engagement,
      };
    });
    props.uploadData(newdata);
    
  };
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

  useEffect(() => {
    setSelectedOpportunityType(props.employmentConnection?.opportunity?.type);
    setSelectedStatus(props.employmentConnection?.status);
  }, [props.employmentConnection]);

  useEffect(() => {
    setShowEndDate(
      selectedStatus === "Internship Complete" ||
        selectedStatus === "Offer Accepted by Student"
    );
    setEndDateMandatory(selectedStatus === "Internship Complete");
  }, [selectedStatus]);

  useEffect(() => {
    let isMounted = true;
  
    getDefaultAssigneeOptions().then((data) => {
      if (isMounted) {
        setAssigneeOptions(data);
      }
    });
  
    return () => {
      isMounted = false;
    };
  }, []);
  
  useEffect(() => {
    getEmploymentConnectionsPickList().then((data) => {
      setrejectionreason(
        data.reason_if_rejected?.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
        }))
      );
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
      setSourceOptions(
        data.source.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
        }))
      );
    });

    if (props.employmentConnection) {
      filterEmployer(
        Number(props.employmentConnection?.opportunity?.employer?.name)
      ).then((data) => {
        setEmployerOptions(data);
      });
    }
    if (
      props.employmentConnection &&
      props.employmentConnection.opportunity &&
      props.employmentConnection.opportunity.employer
    ) {
      updateEmployerOpportunityOptions({
        value: Number(props.employmentConnection.opportunity.employer.id),
      });
    }
  }, [props]);

  useEffect(() => {
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
    setStatusOptions(filteredOptions);
  }, [selectedOpportunityType, allStatusOptions]);

  const updateEmployerOpportunityOptions = (employer) => {
    setEmployerOpportunityOptions([]);

    getEmployerOpportunities(Number(employer.value)).then((data) => {
      setEmployerOpportunityOptions(
        data?.data?.data?.opportunities.map((opportunity) => ({
          key: opportunity.role_or_designation,
          label: `${opportunity.role_or_designation} | ${opportunity.type}`,
          type: opportunity.type,
          value: opportunity.id,
        }))
      );
    });
  };

  const filterEmployer = async (filterValue) => {
    try {
      const { data } = await searchEmployers(filterValue);

      let employmentConnectionEmployer = props.employmentConnection
        ? props.employmentConnection.opportunity?.employer
        : null;
      let employerFoundInList = false;

      let filterData = data.employersConnection.values.map((employer) => {
        if (
          props.employmentConnection &&
          employer.id === Number(employmentConnectionEmployer?.id)
        ) {
          employerFoundInList = true;
        }
        return {
          ...employer,
          label: employer.name,
          value: Number(employer.id),
        };
      });
      if (
        props.employmentConnection &&
        employmentConnectionEmployer !== null &&
        !employerFoundInList
      ) {
        filterData.unshift({
          label: employmentConnectionEmployer?.name,
          value: Number(employmentConnectionEmployer?.id),
        });
      }
      return filterData;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (initialValues.reason_if_rejected in rejectionreason) {
      setShowother(true);
    }
  }, []);

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

  useEffect(() => {
    setotherrejection(false);
  }, [employmentConnection]);

  const handelSubmitMassEdit = (data, key) => {
    props.handelSubmitMassEdit(data, key);
  };

  const handelCancel = () => {
    setBulkAddCheck(!bulkAddCheck);
    setMassEditCheck(!massEditCheck);
  };

  const MultiValue = ({ index, getValue, ...props }) => {
    const maxToShow = 1; // Maximum number of values to show
    const overflowCount = getValue().length - maxToShow;

    if (index < maxToShow) {
      return <components.MultiValue {...props} />;
    }

    if (index === maxToShow) {
      return (
        <components.MultiValue {...props}>
          <span>+{overflowCount}</span>
        </components.MultiValue>
      );
    }

    return null;
  };

  const customComponents = {
    MultiValue,
  };
  const handleInputChange = (inputValue) => {
    setStudentInput(inputValue);
  };

  const handleChange = (selectedOptions) => {
    setStudents(selectedOptions);
  };
  useEffect(() => {
    filterStudent(studentInput).then((data) => {
      setStudentOptions(data);
    });
  }, [studentInput]);

  const handleKeyPress = (event) => {
    const charCode = event.which || event.keyCode;
    if (charCode >= 49 && charCode <= 57) {
      return true;
    }
    event.preventDefault();
    return false;
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
            Add New Employment connection
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        {/* {
          <CheckBoxForm
            bulkAdd="Bulk Add"
            bulkcheck={bulkAddCheck}
            masscheck={massEditCheck}
            massEdit="Mass Edit"
            setBulkAddCheck={setBulkAddCheck}
            setMassEditCheck={setMassEditCheck}
          />
        } */}

        {/* {bulkAddCheck ? ( */}
          <Formik
            onSubmit={onSubmit}
            initialValues={initialValues}
            validationSchema={EmploymentConnectionValidations}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Section>
                  <div className="row form_sec">
                    <div className="col-md-6 col-sm-12">
                      <label className="leading-24">Student</label>
                      <Select
                        isMulti
                         name="student_ids"
                         options={studentOptions}
                         closeMenuOnSelect={false}
                         isOptionDisabled={() => students.length >= 10}
                         className="basic-multi-select"
                         classNamePrefix="select"
                         onInputChange={(e)=>setStudentInput(e)}
                         onChange={handleChange}
                         value={students}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 ">
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
                    <div className="col-md-6 col-sm-12 ">
                      <Input
                        control="lookupAsync"
                        name="employer_id"
                        label="Employer"
                        required
                        filterData={filterEmployer}
                        defaultOptions={
                          props.employmentConnection?.id
                            ? employerOptions
                            : true
                        }
                        className="form-control"
                        placeholder="Employer"
                        onChange={(employer) => {
                          setSelectedOpportunityType(null);
                          updateEmployerOpportunityOptions(employer);
                        }}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 ">
                      {employerOpportunityOptions.length ? (
                        <Input
                          icon="down"
                          control="lookup"
                          name="opportunity_id"
                          label="Opportunity"
                          required
                          options={employerOpportunityOptions}
                          className="form-control"
                          placeholder={"Opportunity"}
                          onChange={(e) => setSelectedOpportunityType(e.type)}
                        />
                      ) : (
                        <>
                          <label
                            className="text-heading"
                            style={{ color: "#787B96" }}
                          >
                            Opportunity (select an employer first)
                          </label>
                          <Skeleton count={1} height={35} />
                        </>
                      )}
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <Input
                        icon="down"
                        control="lookup"
                        name="status"
                        label="Status"
                        required
                        options={statusOptions}
                        className="form-control"
                        placeholder="Status"
                        onChange={(e) => {
                          if(e.value === "Student Dropped Out"){
                            setFieldValue('number_of_internship_hours',0)
                          } 
                          handleStatusChange(e.value)}}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 ">
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
                    <div className="col-md-6 col-sm-12 ">
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
                      <div className="col-md-6 col-sm-12 ">
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
                    <div className="col-md-6 col-sm-12 ">
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
                      <div className="col-md-6 col-sm-12 ">
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
                            }
                            else {
                              setIfSelectedOthers(false);
                            }
                          }}
                          placeholder="Reason if Rejected"
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    {ifSelectedOthers ||
                    (initialValues.reason_if_rejected_other &&
                      initialValues.reason_if_rejected_other.length) ? (
                      <div className="col-md-6 col-sm-12 ">
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
                      ""
                    )}
                    <div className="col-md-6 col-sm-12 ">
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
                      <div className="col-md-6 col-sm-12 ">
                        <Input
                          min={0}
                          type="number"
                          control="input"
                          name="number_of_internship_hours"
                          onKeyPress={handleKeyPress}
                          className="form-control"
                          label="Number of Internship hours"
                          required
                          placeholder="Number of Internship hours"
                        />
                      </div>
                    )}
                  </div>
                </Section>

                <div className="row justify-content-end mt-1">
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
                      // onClick={() => onSubmit(values)}
                    >
                      SAVE
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        {/* // ) : (
        //   <EmploymentmassEdit
        //     setBulkAddCheck={setBulkAddCheck}
        //     setMassEditCheck={setMassEditCheck}
        //     handelSubmitMassEdit={handelSubmitMassEdit}
        //     handelCancel={handelCancel}
        //   />
        // )} */}
      </Modal.Body>
    </Modal>
  );
};

export default MassEmployerUpload;
