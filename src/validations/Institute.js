import * as Yup from "yup";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
const pincodeRegExp = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/

// Program Enrollment form fields.
const student = Yup.string().required("Student is required.");
const batch = Yup.string().required("Batch is required.");
const program_enrollment_status = Yup.string().required("Status is required.");
const course_year = Yup.string().nullable().required("Course Year is required.");
const course_name_in_current_sis = Yup.string().nullable().required("Course Name is required.");
const course_level = Yup.string().nullable().required("Course Level is required.");
const course_type = Yup.string().nullable().required("Course Type is required.");
const year_of_course_completion = Yup.string().nullable().required("Year of Completion is required.");
const registration_date = Yup.date().nullable().required("Registration Date is required.");
const fee_status = Yup.string().required("Fee Status is required.");

// Institution form fields.
const name = Yup.string().required("Name is required.");
const status = Yup.string().required("Status is required.");
const type = Yup.string().required("College type is required.");
const full_name = Yup.string().required("Name is required.");
const assigned_to = Yup.string().required("Assignee is required.");
const designation = Yup.string().required("Designation is required.");
const website = Yup.string().required("Website of college is required.");
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
const city = Yup.string().required("City is required.");
const pin_code = Yup.string("Should be a number.")
  .matches(pincodeRegExp, 'Pincode is not valid')
  .max(6, "Number is too long")
  .required("Pincode is required.");
const district = Yup.string().required("District is required.");
const address_line = Yup.object({
  state,
  medha_area,
  address,
  pin_code,
  city
});

const contacts = Yup.array().of(
  Yup.object({
    full_name,
    email,
    phone,
    designation,
  })
);

export const InstituteValidations = Yup.object({
  name: Yup.string().required('Name is required.') // Check for required input
  .test(
    'no-trailing-space',
    'Please remove extra space.',
    (value) => value && !value.endsWith(' ') && !value.startsWith(' ') 
  ),
  type,
  email:Yup.string().required('Email is required.') // Check for required input
  .test(
    'no-trailing-space',
    'Please remove extra space.',
    (value) => value && !value.endsWith(' ') && !value.startsWith(' ') 
  ),
  phone :Yup.string().required('Phone is required.') // Check for required input
  .test(
    'no-trailing-space',
    'Please remove extra space.',
    (value) => value && !value.endsWith(' ') && !value.startsWith(' ') 
  ),
  status,
  assigned_to,
  address:Yup.string().required('Address is required.') // Check for required input
  .test(
    'no-trailing-space',
    'Please remove extra space.',
    (value) => value && !value.endsWith(' ') && !value.startsWith(' ') 
  ),
  state,
  pin_code,
  city:Yup.string().required('City is required.') // Check for required input
  .test(
    'no-trailing-space',
    'Please remove extra space.',
    (value) => value && !value.endsWith(' ') && !value.startsWith(' ') 
  ),
  medha_area,
  contacts,
  district,
});

export const ContactValidations = Yup.object({
  email,
  phone,
  full_name,
  designation,
});

export const ProgramEnrollmentValidations = Yup.object({
  student,
  batch,
  status: program_enrollment_status,
  course_year,
  course_name_in_current_sis,
  course_level,
  course_type,
  year_of_course_completion,
  registration_date,
  fee_status,
});
