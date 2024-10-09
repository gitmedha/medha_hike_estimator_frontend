import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { Input } from "../../../utils/Form";
import { OpportunityValidations } from "../../../validations";
import  {getOpportunitiesPickList} from "./opportunityAction"
import { getAllEmployers,searchEmployers } from '../../Students/StudentComponents/StudentActions';
import { getAddressOptions, getStateDistricts }  from "../../Address/addressActions";
import { filterAssignedTo, getDefaultAssigneeOptions } from '../../../utils/function/lookupOptions';

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

  .section-disclaimer {
    color: #5B6369;
    font-family: 'Latto-Regular';
    font-style: italic;
    font-size: 14px;
    line-height: 18px;
    margin-top: -10px;
    margin-bottom: 15px;
  }
`;

const OpportunityForm = (props) => {
  let { onHide, show } = props;
  const [statusOptions, setStatusOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [compensationTypeOptions, setCompensationTypeOptions] = useState([]);
  const [employerOptions, setEmployerOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const userId = parseInt(localStorage.getItem('user_id'))

  const [initialValues, setInitialValues] = useState({
    employer: '',
    assigned_to: userId.toString() ,
    role_or_designation: '',
    type: '',
    compensation_type: '',
    number_of_opportunities: '',
    status: '',
    department_or_team: '',
    salary: '',
    role_description: '',
    skills_required: '',
    address: '',
    city: '',
    state: '',
    pin_code: '',
    medha_area: '',
    district:'',
  });

  useEffect(() => {
    getDefaultAssigneeOptions().then(data => {
      setAssigneeOptions(data);
    });
  }, []);

  useEffect(() => {
    if (props.institution) {
      filterEmployer(props.institution.name).then(data => {
        setEmployerOptions(data);
      });
    }

  }, [props])

  useEffect(() => {
    getOpportunitiesPickList().then(data => {
      setStatusOptions(data.status.map((item) => {
        return {
          key: item.value,
          label: item.value,
          value: item.value,
        };
      }));

      setTypeOptions(data.type.map((item) => {
        return {
          key: item.value,
          label: item.value,
          value: item.value,
        };
      }));

      setDepartmentOptions(data.department.map((item) => {
        return {
          key: item.value,
          label: item.value,
          value: item.value,
        };
      }));
      setCompensationTypeOptions(data.paid.map((item) => {
        return {
          key: item.value,
          label: item.value,
          value: item.value,
        };
      }));
    });

    getAllEmployers().then((data) => {
      const employersData = data?.data?.data?.employers.map((employer) => ({
        key: employer.name,
        label: employer.name,
        value: Number(employer.id),
        details: employer,
      }));
      if (props.id) {
        const searchedEmployer = employersData.find(
          (option) => option.value === Number(props.employer.id)
        );
        if (!searchedEmployer) {
          employersData.push({
            key: props.employer.name,
            label: props.employer.name,
            value: Number(props.employer.id),
          });
        }
      }
      setEmployerOptions(employersData);
    });

    if (props.id) {
      setInitialValues({
        ...props,
        assigned_to: props?.assigned_to?.id,
        employer: props.employer ? Number(props.employer.id) : '',
      });
    }

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
  }, [props]);

  const filterEmployer = async (filterValue) => {
    try {
      const {data} = await searchEmployers(filterValue);
      return data.employersConnection.values.map(employer => {
        return {
          ...employer,
          label: employer.name,
          value: Number(employer.id),
          state: employer.state,
          district:employer.district,
          address: employer.address,
          city: employer.city,
          pin_code: employer.pin_code,
          medha_area: employer.medha_area,
        }
      });
      
    } catch (error) {
      console.error(error);
    }
  }

  const onSubmit = async (values) => {
    
  values.city = values.city[0].toUpperCase() + values.city.slice(1);
  values.role_or_designation = values.role_or_designation[0].toUpperCase() + values.role_or_designation.slice(1);
 delete values.updated_at
  values.skills_required = values.skills_required
    .split(",")
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    }).join(" ")
  values.role_description = values.role_description
    .split(",")
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    }).join(" ")
  values.address = values.address
    .split(" ")
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    }).join(" ")
 
    onHide(values);
  };

  const handleEmployerChange = (employer) => {
    setInitialValues({
      ...initialValues,
      employer: employer.value || '',
      address: employer.address || '',
      city: employer.city || '',
      state: employer.state || '',
      pin_code: employer.pin_code || '',
      medha_area: employer.medha_area || '',
      district: employer.district || '',
    });
  }

  useEffect(() => {
    if (initialValues.state) {
      onStateChange({
        value: initialValues.state,
      });
    }
  }, [initialValues])

  const onStateChange = value => {
    setDistrictOptions([]);
    getStateDistricts(value).then(data => {
      setDistrictOptions(data?.data?.data?.geographiesConnection.groupBy.district.map((district) => ({
        key: district.id,
        label: district.key,
        value: district.key,
      })).sort((a, b) => a.label.localeCompare(b.label)));
      setAreaOptions([]);
      setAreaOptions(data?.data?.data?.geographiesConnection.groupBy.area.map((area) => ({
        key: area.id,
        label: area.key,
        value: area.key,
      })).sort((a, b) => a.label.localeCompare(b.label)));
      setCityOptions([])
      setCityOptions(data?.data?.data?.geographiesConnection.groupBy.city.map((city)=>({
        key:city.key,
        value:city.key,
        label:city.key
      })))
    });
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
            {props.id ? props.role_or_designation : 'Add New Opportunity '}
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
         onSubmit={onSubmit}
         initialValues={initialValues}
         validationSchema={OpportunityValidations}
         enableReinitialize={true}
        >
          {({ values }) => (
            <Form>
              <Section>
                <h3 className="section-header">Details</h3>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="employer"
                      control="lookupAsync"
                      label="Employer"
                      placeholder="Employer"
                      className="form-control"
                      filterData={filterEmployer}
                      defaultOptions={props.id ? employerOptions : true}
                      onChange={handleEmployerChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="role_or_designation"
                      label="Role/Designation"
                      control="input"
                      placeholder="Role/Designation"
                      className="form-control capitalize"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      name="type"
                      label="Type"
                      control="lookup"
                      placeholder="Type"
                      options={typeOptions}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="number_of_opportunities"
                      type="number"
                      control="input"
                      label="No. of opportunities"
                      placeholder="No. of opportunities"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    {assigneeOptions.length ? (
                      <Input
                        control="lookupAsync"
                        name="assigned_to"
                        label="Assigned To"
                        filterData={filterAssignedTo}
                        defaultOptions={assigneeOptions}
                        className="form-control"
                        placeholder="Assigned To"
                        required
                      />
                    ) : (
                      <Skeleton count={1} height={45} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      name="status"
                      label="Status"
                      control="lookup"
                      options={statusOptions}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      name="department_or_team"
                      control="lookup"
                      label="Department/Team"
                      placeholder="Department/Team"
                      className="form-control"
                      required
                      options={departmentOptions}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="salary"
                      type="number"
                      control="input"
                      label="Salary"
                      placeholder="Salary"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      name="compensation_type"
                      control="lookup"
                      label="Compensation type"
                      placeholder="Paid"
                      options={compensationTypeOptions}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="skills_required"
                      control="input"
                      label="Skills Required"
                      placeholder="Skills Required"
                      className="form-control capitalize"
                      required
                    />
                  </div>
                  <div className="col-sm-12 mb-2">
                    <Input
                      name="role_description"
                      control="textarea"
                      label="Description"
                      placeholder="Description"
                      className="form-control capitalize"
                      required
                    />
                  </div>
                </div>
              </Section>
              <Section>
                <h3 className="section-header">Address</h3>
                <h4 className="section-disclaimer">Defaults to Employer Address</h4>
                <div className="row">
                  <div className="col-md-12 col-sm-12 mb-2">
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
                    <Input
                      icon="down"
                      name="state"
                      label="State"
                      control="lookup"
                      placeholder="State"
                      className="form-control"
                      options={stateOptions}
                      onChange={onStateChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    {cityOptions.length ?(<Input
                      control="lookup"
                      name="city"
                      label="City"
                      icon='down'
                      className="form-control capitalize"
                      placeholder="City"
                      options={cityOptions}
                      required
                    />):(
                      <>
                        <label className="text-heading" style={{color: '#787B96'}}>Please select State to view City</label>
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
                      options={districtOptions}
                      className="form-control"
                      required
                    />
                    ) : (
                      <>
                        <label className="text-heading" style={{color: '#787B96'}}>Please select State to view Districts</label>
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
                      options={areaOptions}
                      placeholder="Medha Area"
                      required
                    />
                    ) : (
                      <>
                        <label className="text-heading" style={{color: '#787B96'}}>Please select State to view Medha Areas</label>
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
              
              <div className="row justify-content-center">
                <div className="col-auto">
                  <button type='submit' className='btn btn-primary btn-regular collapse_form_buttons'>
                    SAVE
                  </button>
                </div>
                <div className="col-auto">
                   <button type="button"
                   onClick={onHide} className='btn btn-secondary btn-regular collapse_form_buttons'>
                    CANCEL                    
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

export default OpportunityForm;
