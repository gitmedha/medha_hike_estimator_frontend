import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";

import { Input } from "../../../utils/Form";
import { BatchValidations} from "../../../validations";
import { getBatchesPickList } from "../batchActions";
import { batchLookUpOptions } from "../../../utils/function/lookupOptions";
import { getAddressOptions, getStateDistricts }  from "../../Address/addressActions";
import { filterAssignedTo, getDefaultAssigneeOptions } from '../../../utils/function/lookupOptions';
import { isAdmin, isPartnership} from "../../../common/commonFunctions";
import {searchInstitutes,searchGrants,searchPrograms} from '../batchActions'


const Section = styled.div`
  padding-top: 30px;
  padding-bottom: 30px;

  &:not(:first-child) {
    border-top: 1px solid #C4C4C4;
  }

  .section-header {
    color: #207B69;
    font-family: 'Latto-Regular';
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 15px;
  }
`;

const BatchForm = (props) => {
  let { onHide, show } = props;
  const [lookUpLoading, setLookUpLoading] = useState(false);
  const [options, setOptions] = useState(null);
  const [institutionOptions, setInstitutionOptions] = useState(null);
  const [stateOptions, setStateOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [enrollmentTypeOptions, setEnrollmentTypeOptions] = useState([]);
  const [enrollmentType, setEnrollmentType] = useState(true);
  const [formValues, setFormValues] = useState(null);
  const [programOptions, setProgramOptions] = useState(null);
  const [grantOptions, setGrantOptions] = useState(null);
  const userId = parseInt(localStorage.getItem('user_id'))
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [modeOfPayment,setModeOfPayment] = useState('')
  const AssignmentFileCertification = [
    {key: true, value: true, label: "Yes"},
    {key: false, value: false, label: "No"},
  ];

  useEffect(() => {
    setEnrollmentType(props?.enrollment_type?.toLowerCase() !=='multi institution')
  }, [props.enrollment_type]);

  useEffect(() => {
    getDefaultAssigneeOptions().then(data => {
      setAssigneeOptions(data);
    });

  }, []);

  const filterGrant = async (filterValue) => {
    try {
      const {data} = await searchGrants(filterValue);

      return data.grantsConnection.values.map(grant=> {
        return {
          ...grant,
          label: `${grant.name} | ${grant.donor}`,
          value: Number(grant.id),
        }
      })
      
    } catch (error) {
      console.error(error);
    }
  }

  const [initialValues, setInitialValues] = useState({
    name: '',
    // name_in_current_sis: '',
    assigned_to: userId.toString(),
    program: '',
    grant: '',
    institution: '',
    status: '',
    number_of_sessions_planned: '',
    per_student_fees: '',
    seats_available: '',
    start_date: '',
    end_date: '',
    enrollment_type:'',
    state:'',
    medha_area:'',
    mode_of_payment:''
  });

  const prepareLookUpFields = async () => {
    setLookUpLoading(true);
    let lookUpOpts = await batchLookUpOptions();
    setOptions(lookUpOpts);
    setLookUpLoading(false);
  };

  useEffect(() => {
    getBatchesPickList().then(data => {
      setEnrollmentTypeOptions(data.enrollment_type.map(enrollment_type => ({
        key: enrollment_type.value,
        value: enrollment_type.value,
        label: enrollment_type.value
      })));

      let filteredStatusOptions = data.status.filter(status => {
        // if admin, return all statuses
        if (isAdmin()) return true;
        // otherwise return only those status that are applicable to all
        return status['applicable-to'] === 'All';
      });

      setPaymentOptions(data.mode_of_payment.map(modeOfPayment => ({
        value: modeOfPayment.value,
        label: modeOfPayment.value
      })));

      setStatusOptions(filteredStatusOptions.map(status => ({
        key: status.value,
        value: status.value,
        label: status.value
      })));
    });


    getAddressOptions().then(data => {
      setStateOptions(data?.data?.data?.geographiesConnection.groupBy.state.map((state) => ({
          key: state.id,
          label: state.key,
          value: state.key,
      })).sort((a, b) => a.label.localeCompare(b.label)));

      if (props.state) {
        onStateChange({
          value: props.state,
        });
      }
    });
  }, []);

  const onStateChange = value => {
    getStateDistricts(value).then(data => {
      setAreaOptions([]);
      setAreaOptions(data?.data?.data?.geographiesConnection.groupBy.area.map((area) => ({
        key: area.id,
        label: area.key,
        value: area.key,
      })).sort((a, b) => a.label.localeCompare(b.label)));
    });
  };

  useEffect(() => {
    if (props.id) {
      setInitialValues({
        ...props,
        grant: Number(props.grant?.id),
        program: Number(props.program?.id),
        institution: props.institution?.id ? Number(props.institution?.id): null ,
        assigned_to: props.assigned_to?.id,
        start_date: new Date(props.start_date),
        end_date: new Date(props.end_date),
      })
    } else {
      // get default grant for SRMs
      if (!isAdmin() && !isPartnership()) {
        filterGrant('None').then(data => {
          setGrantOptions(data);
          if (data.length) {
            initialValues['grant'] = Number(data[0].id);
          }
        });
      }
    }
    if (props.institution) {
      filterInstitution(props.institution.name).then(data => {
        setInstitutionOptions(data);
      });
    }
    if (props.program) {
      filterProgram(props.program.name).then(data => {
        setProgramOptions(data);
      });
    }
    if (props.grant) {
      filterGrant(props.grant.name).then(data => {
        setGrantOptions(data);
      });
    }
  }, [props])

  useEffect(() => {
    if (show && !options) {
      prepareLookUpFields();
    }
  }, [show, options]);

  const onSubmit = async (values) => {

    if(values.mode_of_payment === 'Free'){
      values.per_student_fees = 0
    }

    setFormValues(values);
    onHide(values);
  };

const getModeOfPayment = (event) =>{
  setModeOfPayment(event.value)
}

  const filterInstitution = async (filterValue) => {
    try {
      const {data} = await searchInstitutes(filterValue);

      return data.institutionsConnection.values.map(institution=>{
        return {
          ...institution,
          label: institution.name,
          value: Number(institution.id),
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  const filterProgram = async (filterValue) => {
    try {
      const {data} = await searchPrograms(filterValue);
      return data.programsConnection.values.map(program=>{
        return {
          ...program,
          label:program.name,
          value:Number(program.id)
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Modal
      centered
      size="lg"
      show={show}
      onHide={async()=>{
        await setModeOfPayment()
        onHide()
      }}
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
            {props.id ? props.name : 'Add New Batch'}
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={BatchValidations}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Section>
                <div className="row form_sec">
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="name"
                      label="Name"
                      required
                      control="input"
                      placeholder="Name"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
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
                  <div className="col-md-6 col-sm-12 mt-2">
                    {!lookUpLoading ? (
                      <Input
                        name="program"
                        label="Program"
                        required
                        control="lookupAsync"
                        filterData={filterProgram}
                        defaultOptions={props.id ? programOptions : true}
                        placeholder="Program"
                        className="form-control"
                      />
                    ) : (
                      <Skeleton count={1} height={60} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    {!lookUpLoading ? (
                      <Input
                        control="lookup"
                        icon="down"
                        name="status"
                        label="Status"
                        required
                        placeholder={initialValues.status || "Status"}
                        className="form-control"
                        options={statusOptions}
                        isDisabled={!isAdmin() && initialValues.status === 'Certified'}

                      />
                    ) : (
                      <Skeleton count={1} height={60} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    {!lookUpLoading ? (
                      <Input
                        name="grant"
                        label="Grant"
                        required
                        placeholder="Grant"
                        className="form-control"
                        control="lookupAsync"
                        filterData={filterGrant}
                        defaultOptions={props.id ? grantOptions : true}
                        isDisabled={!isAdmin() && !isPartnership()}
                      />
                    ) : (
                      <Skeleton count={1} height={60} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      icon="down"
                      name="enrollment_type"
                      label="Enrollment Type"
                      required
                      control="lookup"
                      placeholder="Enrollment Type"
                      className="form-control"
                      options={enrollmentTypeOptions}
                      onChange = {
                        (selectedOption) => {
                          const selectedEnrollmentType = selectedOption.value.toLowerCase();
                          setEnrollmentType(selectedEnrollmentType !== 'multi institution');
                          if (selectedEnrollmentType === 'multi institution') {
                            setFieldValue('institution', null);
                          }
                        }
                      }
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    {!lookUpLoading ? (
                      <Input
                        control="lookupAsync"
                        name="institution"
                        label="Institution"
                        filterData={filterInstitution}
                        defaultOptions={props.id ? institutionOptions : true}
                        placeholder="Institution"
                        className="form-control"
                        isClearable
                        isDisabled={!enrollmentType}
                      />
                    ) : (
                      <Skeleton count={1} height={60} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                  {stateOptions.length ? (
                    <Input
                      icon="down"
                      name="state"
                      label="State"
                      required
                      control="lookup"
                      placeholder="State"
                      className="form-control"
                      options={stateOptions}
                      onChange={onStateChange}
                    />
                    ) : (
                      <Skeleton count={1} height={45} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
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
                        <label className="text-heading" style={{color: '#787B96'}}>Please select State to view Medha Areas</label>
                        <Skeleton count={1} height={35} />
                      </>
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      min={0}
                      type="number"
                      control="input"
                      className="form-control"
                      name="number_of_sessions_planned"
                      label="Number of sessions planned"
                      required
                      placeholder="Number of sessions planned"
                    />
                  </div>
                 {modeOfPayment == 'Free'?
                 <div className="col-md-6 col-sm-12 mt-2">
                 <Input
                     min={0}
                     type="number"
                     control="input"
                     name="per_student_fees"
                     className="form-control"
                     label="Per Student Contribution"
                     placeholder="0"
                     disabled={true}
                     value={0}

                   />
                 </div>:
                 <div className="col-md-6 col-sm-12 mt-2">
                  <Input
                      min={0}
                      type="number"
                      control="input"
                      name="per_student_fees"
                      className="form-control"
                      label="Per Student Contribution"
                      required
                      placeholder="Per Student Contribution"

                    />
                  </div>}
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      min={0}
                      type="number"
                      control="input"
                      name="seats_available"
                      className="form-control"
                      label="Seats Available"
                      required
                      placeholder="Seats Available"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="start_date"
                      label="Start Date"
                      required
                      control="datepicker"
                      className="form-control"
                      placeholder="Start Date"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="end_date"
                      label="End Date"
                      required
                      control="datepicker"
                      placeholder="End Date"
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="require_assignment_file_for_certification"
                      label="Require Assignment file for certification?"
                      options={AssignmentFileCertification}
                      className="form-control"
                      placeholder=""
                    />

                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                       <Input
                        control="lookup"
                        icon="down"
                        name="mode_of_payment"
                        label="Mode of Payment"
                        required
                        placeholder="Mode of Payment"
                        className="form-control"
                        options={paymentOptions}
                        onChange = {(e)=>getModeOfPayment(e)}
                      />
                  </div>
                </div>
              </Section>
              <div className="row">
                  <div className="col-12">
                    {props.errors ? props.errors.length !== 0 &&
                      <div className="alert alert-danger">
                        <span>There are some errors. Please resolve them and save again:</span>
                        <ul className="mb-0">
                          {props.errors.map((error, index) => (
                            <li key={index}>{error.message.toLowerCase() === 'duplicate entry' ? `Batch with "${formValues.name}" already exists.` : error.message}</li>
                          ))}
                        </ul>
                      </div>
                    :null
                    }
                  </div>
              </div>
              <div className="row justify-content-end mt-1">
                <div className="col-auto p-0">
                   <button type="button"
                   onClick={onHide} className='btn btn-secondary btn-regular collapse_form_buttons'>
                    CANCEL                    
                  </button>
                </div>
                <div className="col-auto p-0">
                  <button type='submit' className='btn btn-primary btn-regular collapse_form_buttons'>
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

export default BatchForm;
