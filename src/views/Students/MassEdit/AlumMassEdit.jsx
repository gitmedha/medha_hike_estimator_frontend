import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import { Modal } from "react-bootstrap";
import {
  filterAssignedTo,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import {
  getAlumniServicePickList,
  getStudentAlumniRange,
  getStudentMassAlumniService,
  getStudentsPickList,
  searchStudents,
} from "../StudentComponents/StudentActions";
import * as Yup from "yup";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { connect } from "react-redux";
import Textarea from "../../../utils/Form/Textarea";
import { Input } from "../../../utils/Form";
import { Formik, Form, Field } from "formik";
import { FaTimes } from "react-icons/fa";
import styled from "styled-components";
import DatePicker from "src/utils/Form/DatePicker";
import moment from "moment";

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

const Section1 = styled.table`
  .create_data_table {
    border-collapse: collapse;
    width: 100%;
    overflow: auto;
  }

  th,
  td {
    padding: 8px;
    text-align: left;
    border: 1px solid #bebfc0;
  }

  th {
    background-color: #257b69;
    color: #fff;
  }

  .table-input,
  .table-input-select {
    width: 8rem;
    padding: 2px;
    margin: 0;
    background-color: initial;
    border-radius: 5px;
    border: 1px solid #bebfc0;
  }

  tr {
    border: 1px solid #000;
  }

  .submitbtn {
    position: absolute;
    right: 0;
  }
  .submitbtnclear {
    position: absolute;
    right: 10%;
  }
  .table-input-select-wrapper {
    width: 8rem;
    padding: 2px;
    margin: 0;
    background-color: initial;
    border-radius: 5px;
    border: 1px solid #bebfc0;
  }

  .select__control {
    border: none; /* Remove the border from the control */
  }

  .select__control:hover {
    border: none; /* Remove the border on hover */
  }

  .select__menu {
    border: 1px solid #bebfc0; /* Add border to the dropdown menu */
  }

  .select__menu-list {
    border: none; /* Remove border from menu items */
  }
`;

const statusOption = [
  { value: "Paid", label: "Paid" },
  { value: "Unpaid", label: "Unpaid" },
];


const AlumMassEdit = (props) => {
  const [studentOptions, setStudentOptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [alumniServiceData, setAlumniServiceData] = useState("");
  const [studentInput, setStudentInput] = useState("");
  const [formStatus, setFormStatus] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState(null);
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [isdisabledStudentlist, setisdisabledStudentlist] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [alumniDisable, setAlumniDisable] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [alumData, setAlumData] = useState([]);
  const [searchNextBool, setSearchNextBool] = useState(true);
  const [noDataBool, setNoDataBool] = useState(false);
  const [searchDisabled, setSearchDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(true);
  // const [selectedTypes, setSelectedTypes] = useState([]);

  const filterStudent = async (filterValue) => {
    try {
      const { data } = await searchStudents(filterValue);
      return data.studentsConnection.values.map((student) => ({
        ...student,
        label: `${student.full_name} (${student.student_id})`,
        value: Number(student.id),
      }));
    } catch (error) {
      return error;
    }
  };

  // useEffect(() => {
  //   filterStudent(studentInput).then((data) => {
  //     setStudentOptions(data);
  //   });
  // }, [studentInput]);

  const handleSubmit = async (values) => {
    try {
      const alumData = await Promise.all(
        students.map(async (obj) => {
          try {
            const data = await getStudentMassAlumniService(
              obj.value,
              startDate,
              endDate
            );
            if (
              !data.data ||
              !data.data.data.alumniServicesConnection ||
              !data.data.data.alumniServicesConnection.values
            ) {
              throw new Error(
                `Unexpected data structure for student ID ${
                  obj.value
                }: ${JSON.stringify(data)}`
              );
            }
            return data.data.data.alumniServicesConnection.values.map(
              (val) => ({
                assigned_to: val.assigned_to.id,
                category: val.category,
                comments: val.comments,
                end_date: val.end_date,
                fee_amount: val.fee_amount,
                fee_submission_date: val.fee_submission_date,
                location: val.location,
                program_mode: val.program_mode,
                receipt_number: val.receipt_number,
                start_date: val.start_date,
                type: val.type,
                student_id: obj.value,
                id: Number(val.id),
              })
            );
          } catch (err) {
            return err.message;
          }
        })
      );
      setAlumniServiceData(alumData.flat());
      setFormStatus(true);

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
          data.category.map((item) => ({
            value: item.value,
            label: item.value,
          }))
        );
        setProgramOptions(
          data.program_mode.map((item) => ({
            value: item.value,
            label: item.value,
          }))
        );
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
    } catch (error) {
      return error;
    }
    // setFormStatus(true)
  };

  function filterEventsByDateRange(events, start, end) {
    return events.filter((event) => {
      // Convert start_date and end_date to Date objects for comparison
      const eventStartDate = new Date(event.start_date);
      const eventEndDate = new Date(event.end_date);
      const rangeStartDate = new Date(start);
      const rangeEndDate = new Date(end);

      // Check if event falls within the specified range
      return eventStartDate >= rangeStartDate && eventEndDate <= rangeEndDate;
    });
  }

  const handleChange = (id, newData) => {
    setStudents(
      students.map((obj) => (obj.id === id ? { ...obj, ...newData } : obj))
    );
  };
  let initialValues = {
    alumni_service_student: "",
    location: "",
    program_mode: "",
    receipt_number: "",
    fee_amount: "",
    comments: "",
    start_date: null,
    end_date: null,
    fee_submission_date: null,
    assigned_to: "",
    category: null,
    type: "",
    status: "",
  };

  const onSubmit = async (values) => {
    let data = alumniServiceData.map((obj) => {
      let initialData = {
        student: obj.student_id,
        id: Number(obj.id),
        type: values.type ? values.type : obj.type,
      };

      let filteredData = Object.keys(values).reduce((acc, key) => {
        if (values[key] !== undefined && values[key] !== "") {
          acc[key] = values[key];
        }
        return acc;
      }, initialData);
      filteredData = {
        ...filteredData,
        assigned_to: filteredData.assigned_to || obj.assigned_to,
        category: filteredData.category || obj.category,
        comments: filteredData.comments || obj.comments,
        end_date: moment(new Date(filteredData.end_date || obj.end_date)).format('YYYY-MM-DD'),
        fee_amount: filteredData.fee_amount || obj.fee_amount,
        fee_submission_date: moment(new Date(filteredData.fee_submission_date || obj.fee_submission_date)).format('YYYY-MM-DD'),
        location: filteredData.location || obj.location,
        program_mode: filteredData.program_mode || obj.program_mode,
        receipt_number: filteredData.receipt_number || obj.receipt_number,
        start_date: moment(new Date(filteredData.start_date || obj.start_date)).format('YYYY-MM-DD'),
      };

      return filteredData; 
    });
    props.handelSubmitMassEdit(data, "AlumniBulkEdit");
  };

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

  const validations = Yup.object({
    start_date: Yup.date()
      .nullable()
      .test(
        "start-required-with-end",
        "Start date is required when end date is provided",
        function (value) {
          const { end_date } = this.parent;
          if (end_date && !value) {
            return false; // Fail validation if end date exists but start date doesn't
          }
          return true;
        }
      )
      .test(
        "start-before-end",
        "Start date must be before End date",
        function (value) {
          const { end_date } = this.parent;
          if (value && end_date && value > end_date) {
            return false; // Fail validation if start date is after end date
          }
          return true;
        }
      ),
    end_date: Yup.date()
      .nullable()
      .test(
        "end-required-with-start",
        "End date is required when start date is provided",
        function (value) {
          const { start_date } = this.parent;
          if (start_date && !value) {
            return false; // Fail validation if start date exists but end date doesn't
          }
          return true;
        }
      )
      .min(Yup.ref("start_date"), "End date can't be before Start date")
      .test(
        "end-after-start",
        "End date must be after Start date",
        function (value) {
          const { start_date } = this.parent;
          if (start_date && value && start_date > value) {
            return false; // Fail validation if end date is before start date
          }
          return true;
        }
      ),
  });
  
  

  const handelCancel = (key) => {
    if (key === "cross") {
      props.handelCancel();
    } else {
      setFormStatus(!formStatus);
      setStudentOptions([]);
      setSelectedOptions([]);
      setisdisabledStudentlist(true);
      setAlumniDisable(true);
      setTypeOptions(null);
      setStudents([]);
      setSearchNextBool(true);
    }
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
  const CustomMenu = (props) => {
    const { options, children, getValue, selectOption } = props;

    const handleValue = () => {
      const selectedValues = getValue();
    };

    return (
      <components.Menu {...props}>
        {children}
        <div style={{ padding: "10px", textAlign: "center" }}>
          <button onClick={handleValue} style={{ width: "100%" }}>
            Submit
          </button>
        </div>
      </components.Menu>
    );
  };

  const customComponents = {
    MultiValue,
    // Menu: CustomMenu,
  };
  const handleInputChange = (inputValue) => {
    setStudentInput(inputValue);
  };

  const handleselectChange = (selectedOptions) => {
    setStudents(selectedOptions);
  };
  const initialValuesStudent = {
    start_date:  null ,
    end_date:  null,
    student_ids: [],
  };

  useEffect(async () => {
    if (startDate && endDate) {
      setTypeOptions([]);
      let data = await getStudentAlumniRange(startDate, endDate);
      setAlumData(data);
      let uniqueStudentsMap = new Map();
      data.forEach((obj) => {
        if (!uniqueStudentsMap.has(obj.student?.id)) {
          uniqueStudentsMap.set(obj?.student?.id, obj);
        }
      });
      const uniqueTypes = [
        ...new Set(
          Array.from(uniqueStudentsMap.values()).map((student) => student.type)
        ),
      ].map((type) => ({
        label: type,
        value: type,
        type: type,
      }));

      setTypeOptions(uniqueTypes);
      setAlumniDisable(false);
    }
  }, [startDate, endDate]);

  const handleTypeChange = (selected) => {
    if (!selectedOptions || selectedOptions.length === 0) {
      setStudentOptions([]);
      setisdisabledStudentlist(true);
      setStudents([]);
      setSearchNextBool(true);
      setSearchDisabled(true);
    }
    if (selectedOptions.length > 0) {
      setSearchDisabled(false);
    }
    setSelectedOptions(selected);

    const matchingData = findMatchingData(alumData, selected, "type");


    let values = matchingData.map((obj) => ({
      label: `${obj.student.full_name} (${obj.student.student_id})`,
      value: Number(obj.student.id),
    }));
    const uniqueData = values.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.value === item.value)
    );
    setStudentOptions(uniqueData);
  };

  const findMatchingData = (array1, array2, key) => {
    return array1.filter((item1) =>
      array2.some((item2) => item1[key] === item2[key])
    );
  };
  const handelSearch = () => {
    setisdisabledStudentlist(false);
    setSearchNextBool(false);
  };

  const handleSearchStudent = () => {
    setisdisabledStudentlist(false);
  };
  const handleDatechange = (event, key) => {
    if (key === "endDate") {
      setEndDate(event.target.value);
    } else {
      setStartDate(event.target.value);
    }
    setAlumniDisable(true);
    setSearchNextBool(true);
    setSelectedOptions([]);
    setStudentOptions([]);
    setStudents([]);
    setisdisabledStudentlist(true);
  };
  return (
    <Modal
      centered
      size="lg"
      responsive
      show={true}
      aria-labelledby="contained-modal-title-vcenter"
      className="form-modal"
      // dialogClassName="fullscreen-modal"
    >
      {!formStatus && (
        <>
          <Modal.Header>
            <Modal.Title
              id="contained-modal-title-vcenter"
              className="d-flex align-items-center"
            >
              <h4 className="text--primary bebas-thick mb-0">
                Mass Alumni Engagement Edit
              </h4>
            </Modal.Title>
            <div className="d-flex justify-content-end align-items-center">
              <button
                onClick={() => props.onHide()}
                style={{
                  border: "none",
                  background: "none",
                  position: "absolute",
                  right: "2rem",
                }}
              >
                <FaTimes />
              </button>
            </div>
          </Modal.Header>
          <Modal.Body className="bg-white" style={{minHeight:"300px"}}>
            <Formik
              initialValues={initialValuesStudent}
              // validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form className="col-sm-12 px-3 d-flex flex-column justify-content-around">
                  <div className="col-12 d-flex justify-content-between ">
                    <div className="col-md-5 col-sm-12 mt-2">
                      <label>Start Date</label>
                      <Field
                        type="date"
                        name="start_date"
                        placeholder="DD/MM/YYYY"
                        className="form-control text-uppercase "
                        required
                        onChange={(e) => {
                          setFieldValue('start_date',e.target.value)
                          handleDatechange(e, "startDate")}}
                      />
                    </div>
                    <div className="col-md-5 col-sm-12 mt-2">
                      <label>End Date</label>
                      <Field
                        type="date"
                        name="end_date"
                        placeholder="DD/MM/YYYY"
                        className="form-control ml-2 text-uppercase"
                        required
                        min={startDate}
                        onChange={(e) => {
                          setFieldValue('end_date',e.target.value)
                          handleDatechange(e, "endDate")}}
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="leading-24">Alumni Service</label>
                    <Select
                      isMulti
                      isDisabled={alumniDisable || typeOptions?.length == 0}
                      onChange={(selectedOptions) => {
                        handleTypeChange(selectedOptions);
                        if (selectedOptions?.length === 0) {
                          setStudents([]);
                          setStudentOptions([]);
                          setisdisabledStudentlist(true);
                          setSearchNextBool(true);
                          setSearchDisabled(true);
                        }
                      }}
                      // components={customComponents}
                      options={typeOptions || []}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      value={selectedOptions}
                    />
                    {selectedOptions?.length === 0 &&
                    typeOptions?.length === 0 ? (
                      <label className="text-danger">No Data Found</label>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="mt-2">
                    <label className="leading-24">Student</label>
                    <Select
                      isMulti
                      name="student_ids"
                      options={studentOptions}
                      closeMenuOnSelect={false}
                      // components={customComponents}
                      isOptionDisabled={() => students?.length >= 10}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      isDisabled={isdisabledStudentlist}
                      // onInputChange={(e) => setStudentInput(e)}
                      onChange={(value) => {
                        handleselectChange(value);
                        if (value?.length == 0) {
                          setSearchDisabled(true);
                          setNextDisabled(true);
                        }
                        if (value?.length > 0) {
                          setNextDisabled(false);
                        }
                      }}
                      // onChange={handleselectChange}
                      value={students}
                    />
                  </div>
                  <div className="d-flex justify-content-end   mt-4 pt-2" >
                    <button
                      type="submit"
                      onClick={() => props.onHide()}
                      className="btn btn-secondary mt-3 mr-3"
                    >
                      Cancel
                    </button>
                    {searchNextBool ? (
                      <button
                        type="button"
                        onClick={handelSearch}
                        disabled={selectedOptions?.length === 0}
                        className="btn btn-primary mt-3 no-decoration "
                      >
                        Search
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSubmit()}
                        disabled={students?.length === 0}
                        className="btn btn-primary mt-3 no-decoration "
                      >
                        Next
                      </button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </>
      )}

      {formStatus &&
        (students.length > 0 ? (
          <>
            <Modal.Header className="bg-white">
              <Modal.Title
                id="contained-modal-title-vcenter"
                className="d-flex align-items-center"
              >
                <h1 className="text--primary bebas-thick mb-0">
                  Mass Edit Alumni Engagement
                </h1>
              </Modal.Title>
            </Modal.Header>
            <Formik
              onSubmit={onSubmit}
              initialValues={initialValues}
              validationSchema={validations}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <>
                    <div className="row px-3 form_sec">
                      <div className="col-md-6 col-sm-12 mt-2">
                        <label className="leading-24">Student</label>
                        <Select
                          isMulti
                          isDisabled={true}
                          name="student_ids"
                          defaultValue={students}
                          components={customComponents}
                          options={studentOptions}
                          className="basic-multi-select"
                          classNamePrefix="select"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          control="lookupAsync"
                          name="assigned_to"
                          label="Assigned To"
                          className="form-control"
                          placeholder="Assigned To"
                          filterData={filterAssignedTo}
                          defaultOptions={assigneeOptions}
                        />
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
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="start_date"
                          label="Start Date"
                          placeholder="Start Date "
                          control="datepicker"
                          onChange={(date) => {
                            // const updatedDate = moment(date).startOf('day').add(5, 'hours').toDate();
                            setFieldValue('start_date', date);
                          }}
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="end_date"
                          label="End Date"
                          placeholder="End Date"
                          onChange={(date) => setFieldValue('end_date',moment(date).startOf('day').add(24, 'hours').toDate())}
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
                          // required={feeFieldsRequired}
                          // onChange={(e) => setStatus(e.value)}
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
                          // onInput={(value) => setFeeSubmissionDateValue(value)}
                          // ={feeFieldsRequired}
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
                          // onInput={(e) => setFeeAmountValue(e.target.value)}
                          // ={feeFieldsRequired}
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
                  </>

                  <div className="row justify-content-end mt-3 mb-2 mx-5 ">
                    <div className="col-auto p-0">
                      <button
                        type="button"
                        onClick={()=>props.onHide()}
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
          </>
        ) : (
          <div className="">
            {/* <button
              className="btn submitbtnclear btn-danger btn-regular my-5"
              onClick={() => handelCancel()}
            >
              Jump Back to previous page 
            </button> */}
          </div>
        ))}
    </Modal>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(AlumMassEdit);
