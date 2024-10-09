import { Formik, Form } from "formik";
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { Input } from "../../../utils/Form";
import { EmployerOpportunityValidations } from "../../../validations";
import {
  getOpportunitiesPickList,
  getAssigneeOptions,
} from "../../Opportunities/OpportunityComponents/opportunityAction";
import {
  getAddressOptions,
  getStateDistricts,
} from "../../Address/addressActions";

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

  .section-disclaimer {
    color: #5b6369;
    font-family: "Latto-Regular";
    font-style: italic;
    font-size: 14px;
    line-height: 18px;
    margin-top: -10px;
    margin-bottom: 15px;
  }
`;

const OpportunityForm = (props) => {
  let { onHide, show, employer } = props;
  const [statusOptions, setStatusOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [compensationTypeOptions, setCompensationTypeOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const userId = parseInt(localStorage.getItem("user_id"));

  useEffect(() => {
    getOpportunitiesPickList().then((data) => {
      setStatusOptions(
        data.status.map((item) => {
          return {
            key: item.value,
            label: item.value,
            value: item.value,
          };
        })
      );

      setTypeOptions(
        data.type.map((item) => {
          return {
            key: item.value,
            label: item.value,
            value: item.value,
          };
        })
      );

      setDepartmentOptions(
        data.department.map((item) => {
          return {
            key: item.value,
            label: item.value,
            value: item.value,
          };
        })
      );

      setCompensationTypeOptions(
        data.paid.map((item) => {
          return {
            key: item.value,
            label: item.value,
            value: item.value,
          };
        })
      );
    });

    getAssigneeOptions().then((data) => {
      setAssigneeOptions(
        data?.data?.data?.users.map((assignee) => ({
          key: assignee.username,
          label: `${assignee.username} (${assignee.email})`,
          value: assignee.id,
        }))
      );
    });

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

      if (props.employer.state) {
        onStateChange({
          value: props.employer.state,
        });
      }
    });
  }, []);

  const onStateChange = (value) => {
    setDistrictOptions([]);
    getStateDistricts(value).then((data) => {
      setDistrictOptions(
        data?.data?.data?.geographiesConnection.groupBy.district
          .map((district) => ({
            key: district.id,
            label: district.key,
            value: district.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
      setAreaOptions([]);
      setAreaOptions(
        data?.data?.data?.geographiesConnection.groupBy.area
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
    onHide(values);
  };

  let initialValues = {
    employer: employer,
    employer_name: employer.name,
    assigned_to: userId.toString(),
    role_or_designation: "",
    type: "",
    compensation_type: "",
    number_of_opportunities: "",
    status: "",
    department_or_team: "",
    salary: "",
    role_description: "",
    skills_required: "",
    address: employer.address,
    city: employer.city,
    state: employer.state,
    pin_code: employer.pin_code,
    medha_area: employer.medha_area,
    district: employer.district,
  };

  if (props.id) {
    initialValues = { ...props };
    initialValues["assigned_to"] = props.assigned_to
      ? props.assigned_to.id
      : "";
    initialValues["employer"] = props.employer ? Number(props.employer.id) : "";
  }

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
            {props.id ? props.role_or_designation : "Add New Opportunity"}
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={EmployerOpportunityValidations}
        >
          {({ values }) => (
            <Form>
              <div className="row form_sec">
                <Section>
                  <h3 className="section-header">Details</h3>
                  <div className="row">
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        name="employer_name"
                        control="input"
                        label="Employer"
                        placeholder="Employer"
                        className="form-control"
                        // options={employerOptions}
                        disabled={true}
                        required={true}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        name="role_or_designation"
                        label="Role/Designation"
                        control="input"
                        placeholder="Role/Designation"
                        className="form-control"
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
                          control="lookup"
                          name="assigned_to"
                          label="Assigned To"
                          options={assigneeOptions}
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
                        label="Paid"
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
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-sm-12 mb-2">
                      <Input
                        name="role_description"
                        control="textarea"
                        label="Description"
                        placeholder="Description"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                </Section>
                <Section>
                  <h3 className="section-header">Address</h3>
                  <h4 className="section-disclaimer">
                    Defaults to Employer Address
                  </h4>
                  <div className="row">
                    <div className="col-md-12 col-sm-12 mb-2">
                      <Input
                        control="input"
                        label="Address"
                        name="address"
                        placeholder="Address"
                        className="form-control"
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
                        required
                        options={stateOptions}
                        onChange={onStateChange}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        control="input"
                        name="city"
                        label="City"
                        className="form-control"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        icon="down"
                        control="lookup"
                        name="medha_area"
                        label="Medha Area"
                        options={areaOptions}
                        className="form-control"
                        placeholder="Medha Area"
                        required
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-2">
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

export default OpportunityForm;
