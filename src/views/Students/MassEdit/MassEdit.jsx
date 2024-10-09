import { Formik, Form } from "formik";
import { Modal, Button } from "react-bootstrap";
import styled from "styled-components";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { Input } from "../../../utils/Form";
import { AlumniServiceValidations } from "../../../validations/Student";
import {
  getStudentsPickList,
  getAlumniServicePickList,
  searchStudents,
} from "../StudentComponents/StudentActions";
import Textarea from "../../../utils/Form/Textarea";
import {
  filterAssignedTo,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import Select ,{ components } from "react-select";
import moment from "moment";
import CheckBoxForm from "../StudentComponents/CheckBoxForm";
import AlumMassEdit from "./AlumMassEdit";
import Skeleton from "react-loading-skeleton";

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

const statusOption = [
  { value: "Paid", label: "Paid" },
  { value: "Unpaid", label: "Unpaid" },
];

const MassEdit = (props) => {
  let { onHide, show } = props;
  const [studentOptions, setStudentOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [feeSubmissionDateValue, setFeeSubmissionDateValue] = useState(
    props.alumniService ? props.alumniService.fee_submission_date : null
  );
  const [feeAmountValue, setFeeAmountValue] = useState(
    props.alumniService ? props.alumniService.fee_amount : ""
  );
  const [receiptNumberValue, setReceiptNumberValue] = useState(
    props.alumniService ? props.alumniService.receipt_number : ""
  );
  const [validationRules, setValidationRules] = useState(
    AlumniServiceValidations
  );
  const [feeFieldsRequired, setFeeFieldsRequired] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [students, setStudents] = useState([]);
  const [bulkAddCheck, setBulkAddCheck] = useState(true);
  const [massEditCheck, setMassEditCheck] = useState(false);
  const [studentInput, setStudentInput] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (props.alumniService) {
      setSelectedCategory(
        props.alumniService ? props.alumniService.category : ""
      );
    }
  }, [props.alumniService, show]);

  useEffect(() => {
    getAlumniServicePickList().then((data) => {
      setTypeOptions(
        data.subcategory.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
          category: item.category,
        }))
      );
      setCategoryOptions(
        data.category.map((item) => ({ value: item.value, label: item.value }))
      );
      setProgramOptions(
        data.program_mode.map((item) => ({
          value: item.value,
          label: item.value,
        }))
      );
    });
  }, []);

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });

    getStudentsPickList().then((data) => {
      setLocationOptions(
        data.alumni_service_location.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
        }))
      );
    });
  }, []);

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

  useEffect(() => {
    filterStudent(studentInput).then((data) => {
      setStudentOptions(data);
    });
  }, [studentInput]);

  let initialValues = {
    student_ids: [],
    employer_name: "",
    opportunity_name: "",
    status: "",
    start_date: null,
    end_date: null,
    source: "",
    salary_offered: "",
    category: "",
    subcategory: "",
    assigned_to: "",
  };

  const handleClose = () => {
    setSelectedCategory("");
    onHide([], "Alumn");
  };

  const onSubmit = async (values) => {
    values.students = students;

    let newdata = values.students.map((obj) => {
      let startDate = values.start_date
        ? moment(values.start_date).format("YYYY-MM-DD")
        : null;
      let endDate = values.end_date
        ? moment(values.end_date).format("YYYY-MM-DD")
        : null;
      let feeSubmission = values.fee_submission_date
        ? moment(values.fee_submission_date).format("YYYY-MM-DD")
        : null;
      let feeAmount = values.fee_amount;
       let receiptNumber=values.receipt_number ?values.receipt_number:""
      let comments = values.comments ? values.comments : "";
      return {
        student: obj.id,
        assigned_to: values.assigned_to,
        category: selectedCategory,
        comments: comments,
        end_date: endDate,
        fee_amount: feeAmount,
        fee_submission_date: feeSubmission,
        location: values.location,
        program_mode: values.program_mode,
        receipt_number: receiptNumber,
        start_date: startDate,
        type: values.type,
      };
    });
    props.uploadAlumniData(newdata);
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
      return error;
    }
  };

  const handelSubmit = (data, key) => {
    props.handelSubmit(data, key);
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
  useEffect(()=>{
    let fee_submission_date = Yup.string()
    .nullable()
    .required("Contribution submission date is required.");
  let fee_amount = Yup.string()
    .nullable()
    .required("Contribution amount is required.");
  let receipt_number = Yup.string()
    .nullable()
    .required("Receipt number is required.");
  let fieldsRequired = status === "Paid";
  setFeeFieldsRequired(fieldsRequired);
  if (fieldsRequired) {
    setValidationRules(
      AlumniServiceValidations.shape({
        fee_submission_date,
        fee_amount,
        receipt_number,
      })
    );
  } else {
    setValidationRules(
      AlumniServiceValidations.omit([
        "fee_submission_date",
        "fee_amount",
        "receipt_number",
      ])
    );
  }

  },[status])
  
  
  return (
    <Modal
      centered
      size="lg"
      show={show}
      onHide={handleClose}
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
            {props.alumniService && props.alumniService.id
              ? "Update"
              : "Add New"}{" "}
            Alumni Engagement
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white" >
        
          {/* <CheckBoxForm
            bulkAdd="Bulk Add"
            bulkcheck={bulkAddCheck}
            masscheck={massEditCheck}
            massEdit="Mass Edit"
            setBulkAddCheck={setBulkAddCheck}
            setMassEditCheck={setMassEditCheck}
          /> */}
        
        

        
          <Formik
            onSubmit={onSubmit}
            initialValues={initialValues}
            validationSchema={validationRules}
          >
            {({ values }) => (
              <Form>
                <Section>
                  <div className="row form_sec">
                    <div className="col-md-6 col-sm-12 mt-2">
                      {/* <Input
                      name="student_ids"
                      control="lookupAsync"
                      label="Student"
                      isMulti={true}
                      className="form-control"
                      placeholder="Student"
                      filterData={filterStudent}
                      defaultOptions={ studentOptions}
                      required={true}
                    /> */}
                      <label className="leading-24">Student</label>
                      <Select
                         isMulti
                         name="student_ids"
                         options={studentOptions}
                         closeMenuOnSelect={false}
                        //  components={customComponents}
                         isOptionDisabled={() => students.length >= 10}
                         className="basic-multi-select"
                         classNamePrefix="select"
                         onInputChange={handleInputChange}
                         onChange={handleChange}
                         value={students}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
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
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        name="category"
                        label="Category"
                        placeholder="Category"
                        control="lookup"
                        icon="down"
                        className="form-control"
                        options={categoryOptions}
                        onChange={(e) => setSelectedCategory(e.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      {selectedCategory && (
                        <Input
                          icon="down"
                          control="lookup"
                          name="type"
                          label="Subcategory"
                          options={typeOptions.filter(
                            (option) => option.category === selectedCategory
                          )}
                          className="form-control"
                          placeholder="Subcategory"
                          required
                        />
                      )}
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        control="lookup"
                        icon="down"
                        name="program_mode"
                        label="Program Mode"
                        options={programOptions}
                        className="form-control"
                        placeholder="Program Mode"
                        required
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        icon="down"
                        control="lookup"
                        name="location"
                        label="Location"
                        options={locationOptions}
                        className="form-control"
                        placeholder="Location"
                        required
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        name="start_date"
                        label="Start Date"
                        placeholder="Start Date"
                        control="datepicker"
                        className="form-control"
                        autoComplete="off"
                        required
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        name="end_date"
                        label="End Date"
                        placeholder="End Date"
                        control="datepicker"
                        className="form-control"
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="status"
                      label="Status"
                      placeholder="Status"
                      control="lookup"
                      className="form-control"
                      autoComplete="off"
                      icon="down"
                      options={statusOption}
                      required={feeFieldsRequired}
                      onChange={(e) => setStatus(e.value)}
                    />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        name="fee_submission_date"
                        label="Contribution Submission Date"
                        placeholder="Contribution Submission Date"
                        control="datepicker"
                        className="form-control"
                        autoComplete="off"
                        onInput={(value) => setFeeSubmissionDateValue(value)}
                        required={feeFieldsRequired}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        min={0}
                        type="number"
                        name="fee_amount"
                        label="Contribution Amount"
                        placeholder="Contribution Amount"
                        control="input"
                        className="form-control"
                        autoComplete="off"
                        onInput={(e) => setFeeAmountValue(e.target.value)}
                        required={feeFieldsRequired}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="receipt_number"
                      label="Receipt Number"
                      placeholder="Receipt Number"
                      control="input"
                      className="form-control"
                      autoComplete="off"
                      required={feeFieldsRequired}
                    />
                  </div>

                    <div className="col-md-12 col-sm-12 mt-2">
                      <Textarea
                        name="comments"
                        label="Comments"
                        placeholder="Comments"
                        control="input"
                        className="form-control"
                        autoComplete="off"
                      ></Textarea>
                    </div>
                  </div>
                </Section>

                <div className="row justify-content-end mt-1">
                  <div className="col-auto p-0">
                    <button
                      type="button"
                      onClick={handleClose}
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
              </Form>
            )}
          </Formik>
        
      </Modal.Body>
    </Modal>
  );
};

export default MassEdit;
