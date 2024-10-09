import { Formik, Form, Field } from "formik";
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { FaSchool } from "react-icons/fa";
import { Input } from "../../../utils/Form";
import { StudentValidations } from "../../../validations";
import { urlPath } from "../../../constants";
import {
  getAddressOptions,
  getStateDistricts,
} from "../../Address/addressActions";
import {
  filterAssignedTo,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import AsyncSelect from "react-select/async";
import { MeiliSearch } from "meilisearch";
import { Select } from "@material-ui/core";
// import 'react-select/dist/react-select.css';
import { MenuItem } from "material-ui";
import DetailField from "../../../components/content/DetailField";
import moment from "moment";
import { updateOpsActivity, updateSamarthSdit } from "./operationsActions";
import { getStudentsPickList } from "../../Students/StudentComponents/StudentActions";
import { getProgramEnrollmentsPickList } from "../../Institutions/InstitutionComponents/instituteActions";

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

const meilisearchClient = new MeiliSearch({
  host: process.env.REACT_APP_MEILISEARCH_HOST_URL,
  apiKey: process.env.REACT_APP_MEILISEARCH_API_KEY,
});

const Dtesamarthedit = (props) => {
  let { onHide, show } = props;

  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [course, setcourse] = useState([]);

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
    getProgramEnrollmentsPickList().then((data) => {
      setcourse(
        data?.course?.map((item) => ({ key: item, value: item, label: item }))
      );
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

    getStudentsPickList().then((data) => {
      setGenderOptions(
        data.gender.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
        }))
      );
    });
  }, [props]);

  const filterInstitution = async (filterValue) => {
    return await meilisearchClient
      .index("institutions")
      .search(filterValue, {
        limit: 100,
        attributesToRetrieve: ["id", "name"],
      })
      .then((data) => {
        let filterData = data.hits.map((institution) => {
          return {
            ...institution,
            label: institution.name,
            value: Number(institution.id),
          };
        });

        return filterData;
      });
  };

  const filterBatch = async (filterValue) => {
    return await meilisearchClient
      .index("batches")
      .search(filterValue, {
        limit: 100,
        attributesToRetrieve: ["id", "name"],
      })
      .then((data) => {
        // let programEnrollmentBatch = props.programEnrollment ? props.programEnrollment.batch : null;

        let filterData = data.hits.map((batch) => {
          return {
            ...batch,
            label: batch.name,
            value: Number(batch.id),
          };
        });

        return filterData;
      });
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
  
    const value =await updateSamarthSdit(Number(props.id),values)
    setDisableSaveButton(true);
    onHide(value);
    setDisableSaveButton(false);
  };

  const userId = localStorage.getItem("user_id");
  let initialValues = {
    registration_id: "",
    registration_date: "",
    batch_name: "",
    student_name: "",
    course_name: "",
    institution_name: "",
    district: "",
    state: "",
    dob: "",
    gender: "",
    father_guardian: "",
    mobile: "",
    email: "",
    annual_income: "",
    full_address: "",
    self_employed: "",
    higher_studies: "",
    placed: "",
    apprenticeship: "",
    doj: "",
    company_placed: "",
    monthly_salary: "",
    data_flag: "",
    position: "",
    trade: "",
    company_apprenticed: "",
    company_self: "",
    institute_admitted: "",
    acad_year: "",
    result: "",
    published_at: "",
  };



  if (props) {
    // initialValues ={...props.dtedata}
    initialValues["course_name"] = props.course_name;
    initialValues["annual_income"] = props.annual_income;
    initialValues["full_address"] = props.full_address;
    initialValues["higher_studies"] = props.higher_studies;
    initialValues["self_employed"] = props.self_employed;
    initialValues["student_name"] = props.student_name;
    initialValues["position"] = props.position;
    initialValues["trade"] = props.trade;

    initialValues["district"] = props.district;
    initialValues["state"] = props.state;
    initialValues["gender"] = props.gender;
    initialValues['result']=props.result
    initialValues['acad_year']=props.acad_year
    initialValues['institute_admitted']=props.institute_admitted
    initialValues['company_self']=props.company_self
    initialValues["dob"] = props.dob? new Date(props.dob):"";
    initialValues["doj"] = props.doj ?new Date(props.doj):"";
    initialValues['published_at']=new Date(props.published_at)
    initialValues["institution_name"] = props?.institution_name;
    initialValues["batch_name"] = props.batch_name;
    initialValues["email"] = props.email;
    initialValues["mobile"] = props.mobile;
    initialValues["data_flag"] = props.data_flag;
    initialValues["company_apprenticed"] = props.company_apprenticed ? props.company_apprenticed : null;
    initialValues["monthly_salary"] = props.monthly_salary
    initialValues["company_placed"] = props.company_placed ? props.company_placed : "N/A";
    initialValues["apprenticeship"] = props.apprenticeship ? props.apprenticeship : null;
    initialValues['father_guardian']=props.father_guardian
  }

  useEffect(() => {
    if (props.institution) {
      filterInstitution(props.institution.name).then((data) => {
        setInstitutionOptions(data);
      });
    }
  }, []);


  const [selectedOption, setSelectedOption] = useState(null); // State to hold the selected option

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

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
            <Formik onSubmit={onSubmit} initialValues={initialValues}>
              {({ values, setFieldValue }) => (
                <Form>
                  <Section>
                    <h3 className="section-header">Basic Info</h3>
                    <div className="row">
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="student_name"
                          label="Student Name"
                          className="form-control"
                          placeholder="Student Name"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                         <Input
                          name="course_name"
                          control="lookup"
                          icon="down"
                          label="Course Name"
                          options={course}
                          // onChange={(e)=>handlechange(e,"course1")}
                          className="form-control"
                          placeholder="Course Name"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="institution_name"
                          label="Institution Name"
                          className="form-control"
                          placeholder="Institution Name"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="batch_name"
                          label="Batch Name"
                          className="form-control"
                          placeholder="Batch Name"
                        />
                      </div>
                      

                      

                      

                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="dob"
                          label=" Date Of Birth "
                          // required
                          placeholder="Date of Birth"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="doj"
                          label="Date Of Joining"
                          // required
                          placeholder="Date of Joining"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
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
                          control="input"
                          name="father_guardian"
                          label="Father Guardian"
                          // required
                          className="form-control"
                          placeholder="Topic"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="mobile"
                          label="Mobile"
                          // required
                          className="form-control"
                          placeholder="Mobile"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="email"
                          label=" Email"
                          // required
                          className="form-control"
                          placeholder="email"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          icon="down"
                          control="input"
                          name="annual_income"
                          label="Annual Income"
                          // required
                          className="form-control"
                          placeholder="Annual Income"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        {/* {genderOptions.length ? ( */}
                        <Input
                          icon="down"
                          control="input"
                          name="self_employed"
                          label="Self Employed"
                          // required
                          // options={genderOptions}
                          className="form-control"
                          placeholder="Self Employed"
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
                          name="higher_studies"
                          label="Higher Studies"
                          // required
                          // options={genderOptions}
                          className="form-control"
                          placeholder="Higher Studies"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="placed"
                          label="Placed"
                          // required
                          placeholder="Placed"
                          control="input"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="apprenticeship"
                          label="Apprenticeship"
                          // required
                          placeholder="Apprenticeship"
                          control="input"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="company_placed"
                          label="Company Placed"
                          // required
                          placeholder="Company Placed"
                          control="input"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="monthly_salary"
                          label="Monthly Salary"
                          // required
                          placeholder="Monthly Salary"
                          control="input"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="data_flag"
                          label="Data Flag"
                          // required
                          placeholder="Data Flag"
                          control="input"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="position"
                          label="Position"
                          // required
                          placeholder="Position"
                          control="input"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="trade"
                          label="Trade"
                          // required
                          placeholder="Trade"
                          control="input"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="company_apprenticed"
                          label="Company Apprenticed"
                          // required
                          placeholder="Company Apprenticed"
                          control="input"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="company_self"
                          label="Company Self"
                          // required
                          placeholder="Company Self"
                          control="input"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="institute_admitted"
                          label="Institute Admitted"
                          // required
                          placeholder="Placed"
                          control="input"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="acad_year"
                          label="Acad Year"
                          // required
                          placeholder="Placed"
                          control="input"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="result"
                          label="Result"
                          // required
                          placeholder="Result"
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
                            name="district"
                            label="District"
                            control="lookup"
                            options={areaOptions}
                            // onChange={onStateChange}
                            placeholder="District"
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

export default Dtesamarthedit;
