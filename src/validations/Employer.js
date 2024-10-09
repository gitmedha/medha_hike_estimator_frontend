import * as Yup from "yup";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const pincodeRegExp = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/;
const name = Yup.string().required("Name is required.");
const status = Yup.string().required("Status is required.");
const full_name = Yup.string().required("Name is required.");
const assigned_to = Yup.string().required("Assignee is required.");
const designation = Yup.string().required("Designation is required.");
const email = Yup.string()
  .email("Please enter a valid email.")
  .required("Email is required.");
const phone = Yup.string()
  .matches(phoneRegExp, 'Phone number is not valid')
  .min(10, "Number is too short")
  .max(10, "Number is too long")
  .required("Phone Number is required.");
const state = Yup.string().required("State is required.");
const medha_area = Yup.string().required("Medha area is required.");
const address = Yup.string().required("Address is required.");
const pin_code = Yup.string("Should be a number.")
  .matches(pincodeRegExp, 'Pincode is not valid')
  .max(6, "Pincode is too long")
  .required("Pincode is required.");
const industry = Yup.string().required("Industry is required.");
const city = Yup.string().required("City is required.");
const district= Yup.string().required("District is required.");

// Employment Connection form fields.
const start_date = Yup.date().nullable().required("Start Date is required.");
const end_date = Yup.date().nullable().required("End Date is required.")
                    .when(
                      "start_date",
                      (start_date, schema) => start_date && schema.min(start_date, "End date can't be before Start date")
                    );
const employment_connection_status = Yup.string().nullable().required("Employment Connection status is required.");
// const status = Yup.string().nullable().required("Employment Connection status is required.");
const employer_id = Yup.string().required("Employer is required.");
const opportunity_id = Yup.string().required("Opportunity is required.");
const student_id = Yup.string().required("Student is required.");
const source = Yup.string().required("Source is required.");
const salary_offered = Yup.number().nullable().required("Salary Offered is required.")
                          .min(0, 'Min value 0.')
                          .max(1000000, 'Salary should be in range of between 0 to 10 Lakh.');
const work_engagement = Yup.string().required("Work Engagement is required.");

const contacts = Yup.array().of(
  Yup.object({
    full_name,
    email,
    phone,
    designation,
  })
);

export const EmploymentConnectionValidations = Yup.object({
  status,
  employer_id,
  opportunity_id,
  start_date,
  source,
  salary_offered,
  student_id,
  reason_if_rejected: Yup.string().nullable().when("status", {
    is: (status) => status === 'Offer Rejected by Student',
    then: Yup.string().nullable().required('Reason for rejection is required when offer rejected by student.')
  }),
  end_date: Yup.string().nullable().when("status", {
    is: (status) => status === 'Internship Complete',
    then: Yup.string().nullable().required('End date is required when internship complete.')
  }),
  work_engagement,
});

export const EmployerValidations = Yup.object({
    name:Yup.string().required('Name is required.') // Check for required input
    .test(
      'no-trailing-space',
      'Please remove extra space.',
      (value) => value && !value.endsWith(' ') && !value.startsWith(' ') 
    ),
    status,
    phone:Yup.string().required('Phone is required.') // Check for required input
    .test(
      'no-trailing-space',
      'Please remove extra space.',
      (value) => value && !value.endsWith(' ') && !value.startsWith(' ') 
    ),
    assigned_to,
    industry,
    address:Yup.string().required('Address is required.') // Check for required input
    .test(
      'no-trailing-space',
      'Please remove extra space.',
      (value) => value && !value.endsWith(' ') && !value.startsWith(' ') 
    ),
    medha_area,
    state,
    city:Yup.string().required('City is required.') // Check for required input
    .test(
      'no-trailing-space',
      'Please remove extra space.',
      (value) => value && !value.endsWith(' ') && !value.startsWith(' ') 
    ),
    pin_code,
    contacts,
    email:Yup.string().required('Email is required.') // Check for required input
    .test(
      'no-trailing-space',
      'Please remove extra space.',
      (value) => value && !value.endsWith(' ') && !value.startsWith(' ') 
    ),
    district,
});

export const ContactValidations = Yup.object({
  phone,
  full_name,
  designation,
  email,
});
