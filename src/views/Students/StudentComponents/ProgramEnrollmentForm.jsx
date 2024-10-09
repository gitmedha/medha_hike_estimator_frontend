import { Formik, Form } from "formik";
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { Input } from "../../../utils/Form";
import { ProgramEnrollmentValidations } from "../../../validations/Student";
import { getProgramEnrollmentsPickList } from "../../Institutions/InstitutionComponents/instituteActions";
import { batchLookUpOptions } from "../../../utils/function/lookupOptions";
import {searchInstitution,searchBatch, getAllCourse} from "../StudentComponents/StudentActions";

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

const ProgramEnrollmentForm = (props) => {
  let { onHide, show, student, programEnrollment, allBatches } = props;
  const [statusOptions, setStatusOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [feeStatusOptions, setFeeStatusOptions] = useState([]);
  const [yearOfCompletionOptions, setYearOfCompletionOptions] = useState([]);
  const [currentCourseYearOptions, setCurrentCourseYearOptions] = useState([]);
  const [courseLevelOptions, setCourseLevelOptions] = useState([]);
  const [courseTypeOptions, setCourseTypeOptions] = useState([]);
  const [course, setcourse] = useState([]);
  const [requiresFee, setRequiresFee] = useState(true); // Not free by default.
  const [lookUpLoading, setLookUpLoading] = useState(false);
  const [options, setOptions] = useState(null);
  const [OthertargetValue, setOthertargetValue] = useState({
    course1: false,
    course2: false,
  });
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [courseLevel,setCourseLevel]=useState("")
  const [courseType,setCourseType]=useState("")
  const prepareLookUpFields = async () => {
    setLookUpLoading(true);
    let lookUpOpts = await batchLookUpOptions();
    setOptions(lookUpOpts);
    setLookUpLoading(false);
  };
  const [courseName,setCourseName] = useState("");


  useEffect(()=>{
    if(props.programEnrollment){
      setCourseName(programEnrollment.course_name_in_current_sis)
    }
  },[props.programEnrollment])

  useEffect(() => {
    if (props.institution) {
      filterInstitution(props.programEnrollment.institution.name).then(
        (data) => {
          setInstitutionOptions(data);
        }
      );
    }
    if (props.batch) {
      filterInstitution(props.programEnrollment.batch.name).then((data) => {
        setBatchOptions(data);
      });
    }
    setCourseLevel(props.programEnrollment?.course_level)
    setCourseType(props.programEnrollment?.course_type)
  }, [props]);

  useEffect(() => {
    if (show && !options) {
      prepareLookUpFields();
    }
  }, [show, options]);

  useEffect(() => {
    setRequiresFee(
      props?.programEnrollment?.fee_status?.toLowerCase() !== "free"
    );
  }, [props.programEnrollment]);

  
  let initialValues = {
    program_enrollment_student: student.full_name,
    status: "",
    batch: "",
    registration_date: "",
    institution: "",
    certification_date: "",
    fee_payment_date: "",
    fee_refund_date: "",
    course_name_in_current_sis: "",
    course_name_other: "",
    fee_transaction_id: "",
    course_type: "",
    course_level: "",
    course_year: "",
    year_of_course_completion: "",
    fee_status: "",
    certification_date: null,
    fee_payment_date: null,
    fee_refund_date: null,
  };

  if (props.programEnrollment) {
    initialValues = { ...initialValues, ...props.programEnrollment };
    initialValues["batch"] = Number(props.programEnrollment.batch?.id);
    initialValues["institution"] = Number(
      props.programEnrollment.institution?.id
    );
    initialValues["registration_date"] = props.programEnrollment
      .registration_date
      ? new Date(props.programEnrollment.registration_date)
      : null;
    initialValues["certification_date"] = props.programEnrollment
      .certification_date
      ? new Date(props.programEnrollment.certification_date)
      : null;
    initialValues["fee_payment_date"] = props.programEnrollment.fee_payment_date
      ? new Date(props.programEnrollment.fee_payment_date)
      : null;
    initialValues["fee_refund_date"] = props.programEnrollment.fee_refund_date
      ? new Date(props.programEnrollment.fee_refund_date)
      : null;
  }

  const onSubmit = async (values) => {
    if (!showDuplicateWarning) {
      onHide(values);
    }
  };

  useEffect(() => {
    getProgramEnrollmentsPickList().then(data => {
      setcourse(data?.course?.map(item=>({ key: item, value: item, label: item })))
      setStatusOptions(data?.status?.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setFeeStatusOptions(data?.fee_status?.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setYearOfCompletionOptions(data?.year_of_completion?.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setCurrentCourseYearOptions(data?.current_course_year?.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setCourseLevelOptions(data?.course_level?.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setCourseTypeOptions(data?.course_type?.map(item => ({ key: item.value, value: item.value, label: item.value })));
    });
    getAllCourse().then((data)=>{
      const uniqueCourseLevels = new Set(data?.data?.data?.coursesConnection?.values?.map(item => item.course_level));
      const uniqueCourseType=new Set(data?.data?.data?.coursesConnection?.values?.map(item => item.course_type));
      const courseLevelOptions = Array.from(uniqueCourseLevels)?.map(course_level => ({
        key: course_level,
        value: course_level,
        label: course_level
      }));
      setCourseLevelOptions(courseLevelOptions);
      setCourseTypeOptions(Array.from(uniqueCourseType)?.map(course_type => ({
        key: course_type,
        value: course_type,
        label: course_type
      })));

    })
  }, []);

  const filterInstitution = async (filterValue) => {
    try {
      let { data } = await searchInstitution(filterValue);
      let programEnrollmentInstitution = props.programEnrollment
        ? props.programEnrollment.institution
        : null;
      let institutionFoundInList = false;
      let filterData = data?.institutionsConnection?.values?.map((institution) => {
        if (
          props.programEnrollment &&
          institution.id === Number(programEnrollmentInstitution?.id)
        ) {
          institutionFoundInList = true;
        }
        return {
          ...institution,
          label: institution.name,
          value: Number(institution.id),
        };
      });

      if (
        props.programEnrollment &&
        programEnrollmentInstitution !== null &&
        !institutionFoundInList
      ) {
        filterData?.unshift({
          label: programEnrollmentInstitution.name,
          value: Number(programEnrollmentInstitution.id),
        });
      }
      return filterData;
    } catch (error) {
      console.error("error:", error);
    }
  };

  const filterBatch = async (filterValue) => {
    try {
      const { data } = await searchBatch(filterValue);
      let programEnrollmentBatch = props.programEnrollment
        ? props.programEnrollment.batch
        : null;
      let batchFoundInList = false;
      let filterData = data?.batchesConnection?.values.map((batch) => {
        if (
          props.programEnrollment &&
          batch.id === Number(programEnrollmentBatch?.id)
        ) {
          batchFoundInList = true;
        }
        return {
          ...batch,
          label: batch.name,
          value: Number(batch.id),
        };
      });
      if (
        props.programEnrollment &&
        programEnrollmentBatch !== null &&
        !batchFoundInList
      ) {
        filterData?.unshift({
          label: programEnrollmentBatch.name,
          value: Number(programEnrollmentBatch.id),
        });
      }
      return filterData;
    } catch (error) {
      console.error(error);
    }
  };
  const handlechange = (e, target) => {
    if (e.value == "Other") {
      setOthertargetValue({ ...OthertargetValue, [target]: true });
    }
  };
  useEffect(() => {
    setOthertargetValue({ course1: false, course2: false });
  }, [programEnrollment]);

  const handleBatchChange = async (e) => {
    if (props.programEnrollment) {
      let found = false;
      allBatches.forEach((element) => {
        if (props.programEnrollment.batch.id == e.id) {
          found = false;
        } else if (e.id == element.batch.id) {
          found = true;
        }
      });

      if (found) {
        setShowDuplicateWarning(true);
      } else {
        setShowDuplicateWarning(false);
      }
    } else if (props.allBatches) {
      let found = false;
      allBatches.forEach((element) => {
        if (e.id == element.batch.id) {
          found = true;
        }
      });

      if (found) {
        setShowDuplicateWarning(true);
      } else {
        setShowDuplicateWarning(false);
      }
    }
  }
  useEffect(()=>{
    if (courseLevel && courseType) {
      getAllCourse().then((data) => {
        const filteredCourses = data?.data?.data?.coursesConnection?.values?.filter(obj => {
          return obj.course_level === courseLevel && obj.course_type === courseType;
        });
        
        const courseOptions = filteredCourses?.map(obj => ({
          key: obj.course_name,
          value: obj.course_name,
          label: obj.course_name
        }));
        courseOptions?.push({ value: "Other", label: "Other", key: "Other" });
    
      setcourse(courseOptions)
        
      });
    }
      
    
  },[courseLevel,courseType])

 
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
            {props.programEnrollment && props.programEnrollment.id
              ? "Update"
              : "Add New"}{" "}
            Program Enrollment
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={ProgramEnrollmentValidations}
        >
          {({ values,setFieldValue}) => (
            <Form>
              <div className="row form_sec">
                <Section>
                  <h3 className="section-header">Enrollment Details</h3>
                  <div className="row">
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        name="program_enrollment_student"
                        control="input"
                        label="Student"
                        className="form-control capitalize"
                        placeholder="Student"
                        disabled={true}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        icon="down"
                        control="lookup"
                        name="status"
                        label="Program Status"
                        required
                        options={statusOptions}
                        className="form-control"
                        placeholder="Program Status"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      {!lookUpLoading ? (
                        <Input
                          control="lookupAsync"
                          name="batch"
                          label="Batch"
                          required
                          filterData={filterBatch}
                          defaultOptions={props.id ? batchOptions : true}
                          className="form-control"
                          placeholder="Batch"
                          onChange={(e) => handleBatchChange(e)}
                        />
                      ) : (
                        <Skeleton count={1} height={60} />
                      )}

                    {showDuplicateWarning && <div style={{color:'red',fontWeight:'lighter'}}>This batch is already assigned to the existing student. Select a new batch.</div>}
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="registration_date"
                      label="Registration Date"
                      required
                      placeholder="Registration Date"
                      control="datepicker"
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                  {!lookUpLoading ? (
                    <Input
                      control="lookupAsync"
                      name="institution"
                      label="Institution"
                      required
                      filterData={filterInstitution}
                      defaultOptions={props.id ? institutionOptions : true}
                      className="form-control"
                      placeholder="Institution"
                    />
                    ) : (
                      <Skeleton count={1} height={60} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="certification_date"
                      label="Certification Date"
                      placeholder="Certification Date"
                      control="datepicker"
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </Section>
              <Section>
                <h3 className="section-header">Course Details</h3>
                <div className="row">
                <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="course_type"
                      label="Course Type"
                      required
                      options={courseTypeOptions}
                      className="form-control"
                      placeholder="Course Type"
                      onChange={(e)=>{
                        setFieldValue('course_level','')
                        setFieldValue('course_name_in_current_sis','')
                        setFieldValue('course_name_other','')
                        setFieldValue('course_year','')
                        setFieldValue('year_of_course_completion','')
                        setCourseName("")
                        setCourseType(e.value)
                        // setOthertargetValue({course1:false})
                      }}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="course_level"
                      label="Course Level"
                      required
                      options={courseLevelOptions}
                      className="form-control"
                      placeholder="Course Level"
                      // onChange={setcourse([])}
                      onChange={(e)=>{
                        setFieldValue('course_name_in_current_sis','')
                        setCourseName("")
                        setFieldValue('course_name_other','')
                        setCourseLevel(e.value)
                        setOthertargetValue({course1:false})

                      }}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                  {(courseLevel && courseType) 
                  ?
                    <Input
                      name="course_name_in_current_sis"
                      control="lookup"
                      icon="down"
                      label="Course Name"
                      options={course}
                      required
                      onChange={(e)=>{
                        setCourseName(e.value)
                        setOthertargetValue({course1:false})
                        handlechange(e,"course1")}}
                      className="form-control"
                      placeholder="Course Name"
                    />:
                    <Skeleton count={1} height={60} />
                    }
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                  {
                   courseName === "Other" ?
                   <Input
                      name="course_name_other"
                      control="input"
                      label="If Other, Specify"
                      required
                      className="form-control"
                      placeholder="If Other, Specify"
                    /> :<div></div>
                    
                  }
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="course_year"
                      label="Current Course Year"
                      required
                      options={currentCourseYearOptions}
                      className="form-control"
                      placeholder="Current Course Year"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="year_of_course_completion"
                      label="Year of Completion"
                      required
                      options={yearOfCompletionOptions}
                      className="form-control"
                      placeholder="Year of Completion"
                    />
                  </div>
                </div>
              </Section>
              <Section>
                <h3 className="section-header">Higher Education</h3>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mt-2">
                  <Input
                      icon="down"
                      name="higher_education_course_name"
                      control="lookup"
                      label="Course Name"
                      options={course}
                      className="form-control"
                      placeholder="Course Name"
                      
                    />
                  </div>
                  </div>
                </Section>
                <Section>
                  <h3 className="section-header">Contribution Details</h3>
                  <div className="row">
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        icon="down"
                        control="lookup"
                        name="fee_status"
                        label="Contribution Status"
                        required
                        options={feeStatusOptions}
                        className="form-control"
                        placeholder="Contribution Status"
                        onChange={(e) =>
                          setRequiresFee(e.value.toLowerCase() !== "waived off")
                        }
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        name="fee_payment_date"
                        label="Contribution Payment Date"
                        placeholder="Contribution Payment Date"
                        control="datepicker"
                        className="form-control"
                        autoComplete="off"
                        disabled={!requiresFee}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        name="discount_code_id"
                        control="input"
                        label="Discount Code ID"
                        className="form-control"
                        placeholder="Discount Code ID"
                        disabled={true}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        name="fee_transaction_id"
                        control="input"
                        label="Transaction ID / Receipt No."
                        className="form-control"
                        placeholder="Transaction ID / Receipt No."
                        disabled={!requiresFee}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        min={0}
                        type="number"
                        name="fee_amount"
                        control="input"
                        label="Contribution Amount (INR)"
                        className="form-control"
                        placeholder="Contribution Amount"
                        disabled={!requiresFee}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        name="fee_refund_date"
                        label="Contribution Refund Date"
                        placeholder="Date"
                        control="datepicker"
                        className="form-control"
                        autoComplete="off"
                        disabled={!requiresFee}
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

export default ProgramEnrollmentForm;