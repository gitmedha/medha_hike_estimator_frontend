export const studentFields = `
  id
  full_name
  email
  phone
  alternate_phone
  status
  name_of_parent_or_guardian
  date_of_birth
  category
  gender
  registration_date_latest
  certification_date_latest
  internship_date_latest
  placement_date_latest
  course_type_latest
  income_level
  family_annual_income
  old_sis_id
  medha_champion
  interested_in_employment_opportunities
  city
  pin_code
  medha_area
  address
  state
  how_did_you_hear_about_us
  how_did_you_hear_about_us_other
  your_plan_after_your_current_course
  created_at
  updated_at
  created_by_frontend{
    email
    username
  }
  updated_by_frontend{
    username
    email
  }
  district
  student_id
  assigned_to{
    id
    username
    email
    area
  }
  registered_by{
    id
    username
    email
  }
  logo {
    id
    url
  }
  CV {
    id
    url
    previewUrl
    updated_at
  }
`;

const programEnrollmentFields = `
  id
  status
  course_year
  course_type
  course_level
  year_of_course_completion
  registration_date
  certification_date
  fee_status
  fee_payment_date
  fee_amount
  fee_transaction_id
  fee_refund_status
  fee_refund_date
  course_name_in_current_sis
  course_name_other
  created_at
  updated_at
  program_selected_by_student
  medha_program_certificate_status
  discount_code_id
  higher_education_course_name
  higher_education_year_of_course_completion
  higher_education_proof_of_enrollment {
    id
    url
    created_at
  }
  assignment_file {
    id
    url
    created_at
  }
  medha_program_certificate {
    id
    url
    created_at
  }
  institution {
    id
    name
  }
  batch {
    id
    name
    program {
      name
    }
  }
`;

const alumniServicesFields = `
  id
  type
  start_date
  end_date
  assigned_to {
    id
    email
    username
  }
  fee_submission_date
  location
  receipt_number
  program_mode
  category
  student{
    id
    full_name
  }
  fee_amount
  comments
  status
  created_at
  updated_at
`;

const courseFields = `
createdby {
  username
  id
}
updatedby {
  username
  id
}
  course_type
  course_level
  course_name
  created_at
  updated_at
`;

const employmentConnectionFields = `
  id
  status
  start_date
  end_date
  updated_at
  source
  reason_if_rejected
  reason_if_rejected_other
  work_engagement
  number_of_internship_hours
  salary_offered
  assigned_to {
    id
    username
    email
  }
  experience_certificate{
    id
    url
    previewUrl
    updated_at
  }
  offer_letter{
    id
    url
    previewUrl
    updated_at
  }
  opportunity {
    id
    role_description
    role_or_designation
    type
    updated_at
    employer {
      id
      name
    }
  }
`;

export const GET_STUDENTS = `
  query GET_STUDENTS($id: Int, $limit: Int, $start: Int, $sort: String, $status:String, $state:String, $area:String) {
    studentsConnection (
      sort: $sort
      start: $start
      limit: $limit,
      where: {
        assigned_to: {
          id: $id
        },
        medha_area: $area
        state:$state,
        status:$status,
      }
    ) {
      values {
        ${studentFields}
      }
      aggregate {
        count
      }
    }
  }
`;

export const GET_STUDENT = `
  query GET_STUDENT($id: ID!) {
    student (
      id: $id
    ) {
      ${studentFields}
    }
  }
`;

export const CREATE_STUDENT = `
  mutation CREATE_STUDENT(
    $data: StudentInput!
  ) {
    createStudent(
      input: {
        data: $data,
      }
    ) {
      student {
        ${studentFields}
      }
    }
  }
  `;

export const UPDATE_STUDENT = `
  mutation UPDATE_STUDENT (
      $data: editStudentInput!
      $id: ID!
    ) {
      updateStudent(
        input: {
          data: $data,
          where: { id: $id }
        }
      ) {
        student {
          ${studentFields}
        }
    }
  }
`;

export const DELETE_STUDENT = `
  mutation DELETE_STUDENT(
    $id: ID!
  ) {
    deleteStudent(
      input:{
        where: { id: $id }
      }
    ){
      student {
        id
      }
    }
  }
`;

export const GET_STUDENT_PROGRAM_ENROLLMENTS = `
query GET_STUDENT_PROGRAM_ENROLLMENTS ($id: Int, $limit: Int, $start: Int, $sort: String){
  programEnrollmentsConnection (
    sort: $sort,
    start: $start,
    limit: $limit,
    where: {
      student: {
        id: $id
      }
    }
  ) {
    values {
      ${programEnrollmentFields}
    }
    aggregate {
      count
    }
  }
}
`;

export const CREATE_PROGRAM_ENROLLMENT = `
  mutation CREATE_PROGRAM_ENROLLMENT (
    $data: ProgramEnrollmentInput!
  ) {
    createProgramEnrollment (
      input: {
        data: $data
      }
    ) {
      programEnrollment {
        ${programEnrollmentFields}
      }
    }
  }
`;

export const UPDATE_PROGRAM_ENROLLMENT = `
  mutation UPDATE_PROGRAM_ENROLLMENT (
    $data: editProgramEnrollmentInput!
    $id: ID!
  ) {
    updateProgramEnrollment(
      input: {
        data: $data,
        where: { id: $id }
      }
    ) {
      programEnrollment {
        ${programEnrollmentFields}
      }
    }
  }
`;

export const DELETE_PROGRAM_ENROLLMENT = `
  mutation DELETE_PROGRAM_ENROLLMENT(
    $id: ID!
  ) {
    deleteProgramEnrollment (
      input:{
        where: { id: $id }
      }
    ){
      programEnrollment {
        id
      }
    }
  }
`;

export const GET_STUDENT_EMPLOYMENT_CONNECTIONS = `
  query GET_STUDENT_EMPLOYMENT_CONNECTIONS ($id: Int, $limit: Int, $start: Int, $sort: String){
    employmentConnectionsConnection (
      sort: $sort
      start: $start
      limit: $limit
      where: {
        student: {
          id: $id
        }
      }
    ) {
      values {
        ${employmentConnectionFields}
      }
      aggregate {
        count
      }
    }
  }
`;

export const GET_STUDENT_EMPLOYMENT_CONNECTIONS_RANGE = `
  query GET_STUDENT_EMPLOYMENT_CONNECTIONS_RANGE ($id: Int,$startDate: String, $endDate: String, $limit: Int, $start: Int, $sort: String){
    employmentConnectionsConnection (
      sort: $sort
      start: $start
      limit: $limit
      where: {
        student: {
          id: $id
        }
        start_date_gte: $startDate
      end_date_lte: $endDate
      }
    ) {
      values {
        ${employmentConnectionFields}
      }
      aggregate {
        count
      }
    }
  }
`;

export const CREATE_EMPLOYMENT_CONNECTION = `
  mutation CREATE_EMPLOYMENT_CONNECTION (
    $data: EmploymentConnectionInput!
  ) {
    createEmploymentConnection (
      input: {
        data: $data
      }
    ) {
      employmentConnection {
        ${employmentConnectionFields}
      }
    }
  }
`;

export const UPDATE_EMPLOYMENT_CONNECTION = `
  mutation UPDATE_EMPLOYMENT_CONNECTION (
    $data: editEmploymentConnectionInput!
    $id: ID!
  ) {
    updateEmploymentConnection (
      input: {
        data: $data,
        where: { id: $id }
      }
    ) {
      employmentConnection {
        ${employmentConnectionFields}
      }
    }
  }
`;

export const DELETE_EMPLOYMENT_CONNECTION = `
  mutation DELETE_EMPLOYMENT_CONNECTION(
    $id: ID!
  ) {
    deleteEmploymentConnection (
      input:{
        where: { id: $id }
      }
    ){
      employmentConnection {
        id
      }
    }
  }
`;

export const GET_ALL_STUDENTS = `
query TO_GET_ALL_STUDENTS {
  students{
    id
    full_name
  }
}
`;


export const GET_STUDENT_ALUMNI_SERVICES = `
query GET_STUDENT_ALUMNI_SERVICES ($id: Int, $limit: Int, $start: Int, $sort: String){
  alumniServicesConnection (
    sort: $sort,
    start: $start,
    limit: $limit,
    where: {
      student: {
        id: $id
      }
    }
  ) {
    values {
      ${alumniServicesFields}
    }
    aggregate {
      count
    }
  }
}
`;
export const GET_UNIQUE_STUDENT_ALUMNI = `
query GET_STUDENT_ALUMNI_SERVICES( $startDate: String, $endDate: String, $limit: Int, $start: Int, $sort: String,){
  alumniServicesConnection(
    sort: $sort,
    start: $start,
    limit: $limit,
    where: {
      start_date_gte: $startDate
      end_date_lte: $endDate
    }
  ) {
    values {
      ${alumniServicesFields}
      student {
        id
        full_name
        student_id
      }
    }
    aggregate {
      count
    }
  }
}
`;

export const GET_UNIQUE_STUDENT_EMPLOYMENT = `
query GET_UNIQUE_STUDENT_EMPLOYMENT($startDate: String, $limit: Int, $start: Int, $sort: String){
  employmentConnectionsConnection(
    sort: $sort,
    start: $start,
    limit: $limit,
    where: {
      start_date_gte: $startDate
    }
  ) {
    values {
      ${employmentConnectionFields}
      student {
        id
        full_name
        student_id
      }
    }
    aggregate {
      count
    }
  }
}
`;





export const GET_STUDENT_ALUMNI_SERVICES_RANGE = `
query GET_STUDENT_ALUMNI_SERVICES_RANGE ($id: Int, $startDate: String, $endDate: String, $limit: Int, $start: Int, $sort: String ){
  alumniServicesConnection (
    sort: $sort,
    start: $start,
    limit: $limit,
    where: {
      student: {
        id: $id
      }
      start_date_gte: $startDate
      end_date_lte: $endDate
    }
  ) {
    values {
      ${alumniServicesFields}
    }
    aggregate {
      count
    }
  }
}
`;


export const CREATE_ALUMNI_SERVICE = `
  mutation CREATE_ALUMNI_SERVICE (
    $data: AlumniServiceInput!
  ) {
    createAlumniService (
      input: {
        data: $data
      }
    ) {
      alumniService {
        ${alumniServicesFields}
      }
    }
  }
`;


export const BULK_ALUMNI_SERVICES = `
  mutation CREATE_STUDENTS(
    $data: [AlumniServiceInput!]!
  ) {
    createAlumniService(
      input: {
        data: $data
      }
    ) {
      alumniService {
        ${alumniServicesFields}
      }
    }
  }
`;

export const UPDATE_ALUMNI_SERVICE = `
  mutation UPDATE_ALUMNI_SERVICE (
    $data: editAlumniServiceInput!
    $id: ID!
  ) {
    updateAlumniService(
      input: {
        data: $data,
        where: { id: $id }
      }
    ) {
      alumniService {
        ${alumniServicesFields}
      }
    }
  }
`;

export const DELETE_ALUMNI_SERVICE = `
  mutation DELETE_ALUMNI_SERVICE(
    $id: ID!
  ) {
    deleteAlumniService (
      input:{
        where: { id: $id }
      }
    ){
      alumniService {
        id
      }
    }
  }
`;


export const GET_ALL_STUDENT = `
  query GET_STUDENT($id: ID!) {
    student(
      sort:"username:asc"
    ) {
      id,
      username,
      email,
    }
  }
`;


export const SEARCH_INSTITUITIONS = `
  query SEARCH_INSTIUTION($query:String,$limit:Int,$sort:String){
    institutionsConnection(
      sort:$sort
      limit:$limit
      where:{
        _or:[
          {name_contains:$query}
        ]
      }
    ){
      values {
        id
        name
      }
      aggregate {
        count
      }
    }
  }
`


export const SEARCH_BY_BATCHES = `
  query SEARCH_BY_BATCHES($query:String, $limit:Int, $sort:String){
    batchesConnection(
      sort:$sort
      limit:$limit
      where: {
        _or:[
          {name_contains:$query}
        ]
      }
    ){
      values {
        id
        name
      }
    }
  }
`

export const SEARCH_BY_EMPLOYERS = `
  query SEARCH_BY_EMPLOYERS($query:String, $limit:Int, $sort:String){
    employersConnection(
      sort:$sort
      limit:$limit
      where: {
        _or:[
          {name_contains:$query}
        ]
      }
    ){
      values {
        id
        name
      }
    }
  }
`


export const SEARCH_BY_STUDENTS = `
  query SEARCH_BY_STUDENTS($query:String, $limit:Int, $sort:String){
    studentsConnection(
      sort:$sort
      limit:$limit
      where: {
        _or:[
          {full_name_contains:$query}
          {student_id_contains:$query}
        ]
      }
    ){
      values {
        id
        full_name
        student_id
      }
    }
  }
`

export const GET_COURSE = `
  query GetCourse {
    coursesConnection {
      values {
        ${courseFields}
      }
      aggregate {
        count
      }
    }
  }
`;

