import * as Yup from "yup";

const topics = Yup.string().required("Topic covered is required.");
const date = Yup.date().nullable().required("Session Date is required.");

// Program Enrollment form fields.
const student = Yup.string().required("Student is required.");
const program_enrollment_institution = Yup.string().required("Institution is required.");
const program_enrollment_status = Yup.string().required("Status is required.");
const course_year = Yup.string().nullable().required("Course Year is required.");
const course_name_in_current_sis = Yup.string().nullable().required("Course Name is required.");
const course_level = Yup.string().nullable().required("Course Level is required.");
const course_type = Yup.string().nullable().required("Course Type is required.");
const year_of_course_completion = Yup.string().nullable().required("Year of Completion is required.");
const registration_date = Yup.date().nullable().required("Registration Date is required.");
const fee_status = Yup.string().required("Fee Status is required.");

// New Batch Validation Rules
const name = Yup.string().required("Name is required.");
const assigned_to = Yup.string().required("Assignee is required.");
const grant = Yup.string().required("Grant for batch is required.");
const status = Yup.string().required("Status of batch is required.");
const end_date = Yup.date().nullable().required("End Date of batch is required.")
                    .when(
                        "start_date",
                        (start_date, schema) => start_date && schema.min(start_date, "End date can't be before Start date")
                    );
const program = Yup.string().required("Program for the batch is required.");
const start_date = Yup.date().nullable().required("Start Date of batch is required.");
const institution = Yup.string().required("Institution for batch is required.");
const per_student_fees = Yup.string().required("Fees per student is required.");
const seats_available = Yup.string().required("Seats Available is required.");
const name_in_current_sis = Yup.string().required(
  "Name In Current SIS is required."
);
const number_of_sessions_planned = Yup.string().required(
  "Total number of sessions planned is required."
);
const state = Yup.string().required("State is required.");
const mode_of_payment = Yup.string().required("Mode Of Payment is required.");
const medha_area = Yup.string().required("Medha area is required.");
const enrollment_type = Yup.string().required("Enrollment Type is required.");

export const sessionValidations = Yup.object({
  date,
  topics,
});

export const BatchValidations = Yup.object({
  name :Yup.string()
  .required('name is required.') // Check for required input
  .test(
    'no-trailing-space',
    'Please remove extra space.',
    (value) => value && !value.endsWith(' ') && !value.startsWith(' ') 
  ),
  grant,
  status,
  program,
  end_date,
  start_date,
  assigned_to,
  per_student_fees : Yup.string().nullable().when("mode_of_payment",{
    is:(mode_of_payment) => mode_of_payment === "Free",
    then:Yup.string().nullable().optional(),
    otherwise:Yup.string().required("Fees per student is required.")
  }),
  mode_of_payment,
  // name_in_current_sis,
  number_of_sessions_planned,
  seats_available,
  state,
  medha_area,
  enrollment_type,
});


export const ProgramEnrollmentValidations = Yup.object({
  student,
  institution: program_enrollment_institution,
  status: program_enrollment_status,
  course_year,
  course_name_in_current_sis,
  course_level,
  course_type,
  year_of_course_completion,
  registration_date,
  fee_status,
});
