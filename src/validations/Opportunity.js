import * as Yup from "yup";

const pincodeRegExp = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/;
const status = Yup.string().required("Status is required.");
const assigned_to = Yup.string().required("Assignee is required.");
const type = Yup.string().required("Type is required.");
const employer = Yup.string().required("Employer is required.");
const role_or_designation = Yup.string().required("Role/Designation is required.");
const number_of_opportunities = Yup.string().required("No. of opportunities is required.");
const department_or_team = Yup.string().required("Department/Team is required.");
const salary = Yup.string().required("Salary is required.");
const compensation_type = Yup.string().required("Paid/Unpaid is required.");
const skills_required = Yup.string().required("Skills required is required.");
const role_description = Yup.string().required("Description is required.");
const state = Yup.string().required("State is required.");
const medha_area = Yup.string().required("Medha area is required.");
const address = Yup.string().required("Address is required.");
const pin_code = Yup.string("Should be a number.")
  .matches(pincodeRegExp, 'Pincode is not valid')
  .max(6, "Pincode is too long")
  .required("Pincode is required.");
const city = Yup.string().required("City is required.");
const district= Yup.string().required("District is required.");

export const OpportunityValidations = Yup.object({
  status,
  assigned_to,
  type,
  employer,
  role_or_designation :Yup.string().required('Role is required.') // Check for required input
  .test(
    'no-trailing-space',
    'Please remove extra space.',
    (value) => value && !value.endsWith(' ') && !value.startsWith(' ') 
  ),
  number_of_opportunities,
  department_or_team,
  salary,
  compensation_type,
  skills_required :Yup.string().required('Skill is required.') // Check for required input
  .test(
    'no-trailing-space',
    'Please remove extra space.',
    (value) => value && !value.endsWith(' ') && !value.startsWith(' ') 
  ),
  role_description:Yup.string().required('Description is required.') // Check for required input
  .test(
    'no-trailing-space',
    'Please remove extra space.',
    (value) => value && !value.endsWith(' ') && !value.startsWith(' ') 
  ),
  address:Yup.string().required('Address is required.') // Check for required input
  .test(
    'no-trailing-space',
    'Please remove extra space.',
    (value) => value && !value.endsWith(' ') && !value.startsWith(' ') 
  ),
  medha_area,
  district,
  state,
  city:Yup.string().required('City is required.') // Check for required input
  .test(
    'no-trailing-space',
    'Please remove extra space.',
    (value) => value && !value.endsWith(' ') && !value.startsWith(' ') 
  ),
  pin_code,
});

export const EmployerOpportunityValidations = Yup.object({
  status,
  assigned_to,
  type,
  role_or_designation,
  number_of_opportunities,
  department_or_team,
  salary,
  compensation_type,
  skills_required,
  role_description,
  address,
  medha_area,
  state,
  city,
  pin_code,
  district,
});
