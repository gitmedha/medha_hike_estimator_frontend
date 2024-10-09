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
import {
  getOpsPickList,
  updateStudetnsUpskills,
  searchStudents,
  searchInstitutions,
  searchBatches
} from "./operationsActions";
import { getProgramEnrollmentsPickList } from "../../Institutions/InstitutionComponents/instituteActions";
import { getUpskillingPicklist } from "../../Students/StudentComponents/StudentActions";

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
const categoryOptions = [
  { value: "Career", label: "Career" },
  { value: "Creative", label: "Creative" },
];

const UpskillUpdate = (props) => {
  let { onHide, show, refreshTableOnDataSaving } = props;
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [lookUpLoading] = useState(false);
  const [course, setCourse] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [studentinput] = useState("");
  const [subcategory, setSubcategory] = useState([]);
  const [programeName, setProgramName] = useState([]);

  useEffect(() => {
    let isMounted = true; // Add a flag to indicate if the component is mounted

    const fetchData = async () => {
        try {
            const assigneeData = await getDefaultAssigneeOptions();
            if (isMounted) {
                setAssigneeOptions(assigneeData);
            }

            const upskillingData = await getUpskillingPicklist();
            if (isMounted) {
                setSubcategory(
                    upskillingData.subCategory.map((item) => ({
                        key: item,
                        value: item,
                        label: item,
                    }))
                );
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();

    return () => {
        isMounted = false; // Cleanup function to set isMounted to false when the component is unmounted
    };
  }, []);

  useEffect(() => {
    if (props.student_id.id) {
      filterStudent(props.student_id.name).then((data) => {
        setStudentOptions(data);
      });
    }
  }, [props]);

  const filterStudent = async (filterValue) => {
    try {
      const { data } = await searchStudents(filterValue);

      let studentFoundInList = false;
      let filterData = data.studentsConnection.values.map((student) => {
        if (student.id === Number(props?.student_id.id)) {
          studentFoundInList = true;
        }
        return {
          ...student,
          label: `${student.full_name} (${student.student_id})`,
          value: Number(student.id),
        };
      });

      return filterData;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    filterStudent(studentinput).then((data) => {
      setStudentOptions(data);
    });
  }, [studentinput]);
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
    const newObject = { ...values };

    newObject["student_id"] = 57588;
    newObject["assigned_to"] = Number(values["assigned_to"]);

    newObject["start_date"] = moment(values["start_date"]).format("YYYY-MM-DD");
    newObject["end_date"] = moment(values["end_date"]).format("YYYY-MM-DD");

    const value = await updateStudetnsUpskills(Number(props.id), newObject);
    refreshTableOnDataSaving();
    setDisableSaveButton(true);
    onHide(value);
    setDisableSaveButton(false);
  };
  function formatDateStringToIndianStandardTime(dateString) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const date = new Date(dateString);
    return date;
  }

  let initialValues = {
    assigned_to: "",
    student_id: "",
    institution: "",
    batch: "",
    start_date: "",
    end_date: "",
    course_name: "",
    certificate_received: "",
    category: "",
    sub_category: "",
    issued_org: "",
    published_at: "",
  };
  if (props) {
    initialValues["category"] = props.category;
    initialValues["program_name"] = props.program_name;
    initialValues["sub_category"] = props.sub_category;
    initialValues["certificate_received"] = props.certificate_received;
    initialValues["issued_org"] = props.issued_org;
    initialValues["course_name"] = props["course_name"];
    initialValues["student_id"] = Number(props.student_id.id);
    initialValues["start_date"] = formatDateStringToIndianStandardTime(
      props.start_date
    );
    initialValues["end_date"] = formatDateStringToIndianStandardTime(
      props.end_date
    );
    initialValues["published_at"] = new Date(props.published_at);
    initialValues["assigned_to"] = Number(props?.assigned_to?.id);
    initialValues["institution"] = Number(props?.institution?.id);
    initialValues["batch"] = Number(props?.batch?.id);
  }

  useEffect(() => {
    if (props.institution) {
      filterInstitution(props.institution.name).then((data) => {
        setInstitutionOptions(data);
      });
    }
  }, []);

useEffect(() => {
    let isMounted = true; 

    const fetchData = async () => {
        try {
            const programEnrollmentsData = await getProgramEnrollmentsPickList();
            if (isMounted) {
                setCourse(
                    programEnrollmentsData?.course?.map((item) => ({
                        key: item,
                        value: item,
                        label: item,
                    }))
                );
            }

            const opsPickListData = await getOpsPickList();
            if (isMounted) {
                const programNameData = opsPickListData.program_name.map((value) => ({
                    key: value,
                    label: value,
                    value: value,
                }));
                setProgramName(programNameData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();

    return () => {
        isMounted = false; 
    };
}, []);


  const certificateoptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

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
                  <div className="row form_sec">
                    <Section>
                      <h3 className="section-header">Basic Info</h3>
                      <div className="row">
                        <div className="col-md-6 col-sm-12">
                          {!lookUpLoading ? (
                            <Input
                              name="student_id"
                              control="lookupAsync"
                              label="Student"
                              className="form-control"
                              placeholder="Student"
                              filterData={filterStudent}
                              defaultOptions={
                                props.student_id.id ? studentOptions : true
                              }
                              required
                            />
                          ) : (
                            <Skeleton count={1} height={60} />
                          )}
                        </div>

                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            control="lookup"
                            name="certificate_received"
                            label="Certificate Received"
                            required
                            className="form-control"
                            placeholder="Certificate Received"
                            options={certificateoptions}
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
                            label="Batch Name"
                            required
                            filterData={filterBatch}
                            defaultOptions={batchOptions}
                            className="form-control1"
                            placeholder="Batch"
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            name="program_name"
                            control="lookup"
                            icon="down"
                            label="Program Name"
                            options={programeName}
                            className="form-control"
                            placeholder="Program Name"
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
                            // required
                            placeholder="Start Date"
                            control="datepicker"
                            className="form-control"
                            autoComplete="off"
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            name="end_date"
                            label="End Date"
                            // required
                            placeholder="End Date"
                            control="datepicker"
                            className="form-control"
                            autoComplete="off"
                          />
                        </div>

                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            name="course_name"
                            control="lookup"
                            icon="down"
                            label="Course Name"
                            options={course}
                            className="form-control"
                            placeholder="Course Name"
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            name="category"
                            control="lookup"
                            icon="down"
                            label="Category"
                            className="form-control"
                            placeholder="Category"
                            options={categoryOptions}
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            name="sub_category"
                            label="Sub Category"
                            control="lookup"
                            icon="down"
                            className="form-control"
                            placeholder="Category"
                            options={subcategory}
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            icon="down"
                            control="input"
                            name="issued_org"
                            label="Certificate Issuing Organization"
                            className="form-control"
                            placeholder="Certificate Issuing Organization"
                          />
                        </div>
                      </div>
                    </Section>

                    <Section>
                      <h3 className="section-header">Other Information</h3>
                      <div className="row">
                        <div className="col-md-6 col-sm-12">
                          <DetailField
                            Bold={""}
                            label="Created By"
                            value={
                              props.createdby
                                ? props.createdby.username
                                : "not found"
                            }
                          />
                          <DetailField
                            Bold={""}
                            label="Created At"
                            value={moment(props.created_at).format(
                              "DD MMM YYYY, h:mm a"
                            )}
                          />
                        </div>

                        <div className="col-md-6 col-sm-12">
                          <DetailField
                            Bold={""}
                            label="Updated By"
                            value={
                              props.updatedby
                                ? props.updatedby.username
                                : "not found"
                            }
                          />
                          <DetailField
                            Bold={""}
                            label="Updated At"
                            value={
                              props.updated_at
                                ? moment(props.updated_at).format(
                                    "DD MMM YYYY, h:mm a"
                                  )
                                : "not found"
                            }
                          />
                        </div>
                      </div>
                    </Section>
                  </div>

                  <div className="row justify-content-end">
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

export default UpskillUpdate;
