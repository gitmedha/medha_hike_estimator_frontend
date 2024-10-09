export const batchesFields = `
  id
  name
  start_date
  end_date
  status
  medha_area
  mode_of_payment
  state
  enrollment_type
  created_at
  updated_at
  per_student_fees
  name_in_current_sis
  require_assignment_file_for_certification
  seats_available
  certificates_generated_at
  certificates_emailed_at
  grant {
    id
    name
    donor
  }
  assigned_to {
    id
    email
    username
  }
  updated_by_frontend{
    username
    email
  }
  institution {
    id
    name
  }
  program {
    id
    name
    status
    start_date
    end_date
  }
  created_by_frontend{
    id
    username
    email
  }
  assigned_to{
    username
  }
  logo {
    url
  }
  link_sent_at
  number_of_sessions_planned
  program {
    name
  }
`;

export const GET_BATCHES = `
query GET_ALL_BATCHES ($id: Int, $limit: Int, $start: Int, $sort: String, $state:String, $area:String ){
    batchesConnection(
      sort: $sort,
      start: $start,
      limit: $limit,
      where: {
        assigned_to: {
          id: $id
        }
      state: $state,
      medha_area:$area,
      }
    ) {
      values {
        ${batchesFields}
      }
      aggregate {
        count
      }
    }
}
`;

/**
 {
     id: 2
 }
 */

export const GET_BATCH = `
query GET_BATCH ($id:ID!) {
  batch(id: $id) {
    ${batchesFields}
  }
}
`;

export const GET_SESSIONS = `
query GET_SESSIONS($id: ID!, $sort: String) {
  sessionsConnection (
    where: {batch: { id: $id }},
    sort: $sort
  ) {
    values{
      id
      date
      batch {
        id
      }
      created_at
      updated_at
      topics_covered
    }
  }
}
`;

export const GET_BATCH_STUDENTS = `
query GET_STUDENTS_IN_BATCH ($id: ID!, $sort: String){
  programEnrollmentsConnection (
    where: {batch: {id: $id}}
    sort: $sort
  ) {
    values {
      id
      status
      batch {
        id
        name
      }
      institution {
        id
        name
      }
      student {
        id
        phone
        alternate_phone
        full_name
      }
    }
  }
}
`;

export const GET_BATCH_STUDENTS_ONLY = `
query GET_STUDENTS_IN_BATCH ($id: ID!){
  programEnrollments (where: {batch: {id: $id}}, sort: "student.full_name:asc") {
    id
    student {
      id
      full_name
      phone
      alternate_phone
      student_id
      name_of_parent_or_guardian
    }
  }
}
`;

export const GET_STUDENT_DETAILS = `
query GET_STUDENT ($id: ID!){
  student(id: $id){
    name_of_parent_or_guardian
    phone
    alternate_phone
    status
    gender
    date_of_birth
    email
    category
    CV {
      id
    }
  }
}
`;

export const CREATE_SESSION = `
mutation CREATE_SESSION($batchID: ID!, $date: DateTime!, $topics: String!) {
  createSession(
    input: {
      data: {
        date: $date,
        batch: $batchID,
        topics_covered: $topics
      }
    }
  ) {
    session {
      id
      date
      batch {
        id
      }
      topics_covered
    }
  }
}
`;

/**
 * Payload Sample
  {
    "batchID": 6,
    "date": "2021-07-22",
    "topics": "Something Someone"
  }
 */

export const MARK_ATTENDANCE = `
mutation CREATE_ATTENDANCE_RECORD (
  $session: ID
  $present: Boolean
  $program_enrollment_id: ID
) {
  createAttendance (
    input : {
        data:   {
          present: $present
          session: $session
          program_enrollment: $program_enrollment_id
        }
    }
  ) {
    attendance {
      id
      program_enrollment {
        id
      }
      session {
        id
      }
      present
    }
  }
}
`;

export const CREATE_NEW_BATCH = `
mutation CREATE_NEW_BATCH(
  $data: BatchInput!
) {
  createBatch(
    input: {
      data: $data,
    }
  ) {
    batch {
      id
      name
      status
      logo {
        url
      }
    }
  }
}
`;

export const DELETE_BATCH = `
mutation DELETE_BATCH($batch: ID!) {
  deleteBatch(input: { where: { id: $batch } }) {
    batch {
      id
    }
  }
}
`;

export const UPDATE_BATCH = `
mutation UPDATE_BATCH($id: ID!, $data: editBatchInput!){
  updateBatch(input:{
    where: { id: $id },
    data: $data
  }){
    batch {
      id
    }
  }
}
`;

export const GET_SESSION = `
query GET_SESSION($id: ID!){
  session(id: $id){
    id
    date
    topics_covered
    date
    created_at
    updated_at
    batch {
      id
    }
  }
}
`;

export const GET_SESSION_ATTENDANCE = `
query GET_SESSION_ATTENDANCE($sessionID: ID!){
  attendances(where: {
    session: {
      id: $sessionID
    }
  }
  ){
    id
    present
    program_enrollment{
      id
      student{
        full_name
      }
    }
  }
}
`;

export const UPDATE_SESSION_ATTENDANCE = `
mutation UPDATE_ATTENDANCE(
  $id: ID!,
  $data: editAttendanceInput!
) {
  updateAttendance(
    input:{
      data: $data,
      where: {
        id: $id
      }
    }
  ){
    attendance{
      id
    }
  }
}
`;
/**
 * Payload
{
  "id": 67,
  "data": {
    "present": false,
  }
}
 */
export const UPDATE_SESSION_QUERY = `
mutation UPDATE_SESSION(
    $id: ID!,
    $data: editSessionInput!
  ){
  updateSession(
    input: {
      data: $data,
      where: {
        id: $id
      }
    }
  ){
    session {
      id
    }
  }
}
`;

export const DELETE_SESSION_QUERY = `
mutation DELETE_SESSION($session: ID!) {
  deleteSession(input: { where: { id: $session } }) {
    session {
      id
    }
  }
}
`;

export const GET_SESSION_ATTENDANCE_STATS = `
query GET_SESSION_ATTENDANCE_TEST($id: ID!) {
  attendancesConnection(
    where: { session: { batch: { id: $id } }, present: true }
  ) {
    groupBy {
      session {
        sessionId: key
        connection {
          aggregate {
            studentsPresent: count
          }
        }
      }
    }
  }
  programEnrollmentsConnection(where: { batch: { id: $id } }) {
    groupBy {
      batch {
        batchId: key
        connection {
          aggregate {
            studentsEnrolled: count
          }
        }
      }
    }
  }
}
`;

export const DELETE_ATTENDANCE_RECORD = `
mutation DELETE_ATTENDANCE_RECORD($attendanceID: ID!) {
  deleteAttendance(input: { where: { id: $attendanceID } }) {
    attendance {
      id
    }
  }
}
`;

export const DELETE_SESSION_Q = `
mutation DELETE_SESSION($sessionID: ID!) {
  deleteSession(input: { where: { id: $sessionID } }) {
    session {
      id
    }
  }
}
`;

export const GET_BATCH_ENTROLLED_STUDENTS = `
query GET_BATCH_ENTROLLED_STUDENTS ($id: ID!){
  programEnrollments (
      where: {
      batch: {
        id: $id
      }
    }
  ) {
    id
    student {
      full_name
    }
  }
}
`;

export const GET_STUDENT_COUNT_BY_BATCH = `
query GET_STUDENT_COUNT_BY_BATCH {
  programEnrollmentsConnection {
    groupBy {
      batch {
        key
        connection {
          aggregate {
            count
          }
        }
      }
    }
  }
}
`;

export const GET_ALL_BATCHES = `
query GET_ALL_BATCHES($start:Int ,$limit:Int) {
  batchesConnection(start:$start,limit:$limit){
    values {
      id
      name
      status
    }
  }
  
}
`;

export const GET_BATCH_STUDENTS_ATTENDANCE = `
  query GET_BATCH_STUDENTS_ATTENDANCE ($id: ID!) {
    attendancesConnection (where: {present: true, program_enrollment: {batch: { id: $id }}}) {
      groupBy {
        program_enrollment {
          key
          connection {
            aggregate {
              count
            }
          }
        }
      }
    }

    sessionsConnection (where: {batch: {id: $id}}) {
      aggregate {
        count
      }
    }
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
  updated_at
  discount_code_id
  program_selected_by_student
  medha_program_certificate_status
  higher_education_course_name
  higher_education_year_of_course_completion
  course_name_other
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
  student{
    id
    full_name
    student_id
  }
  batch {
    id
    name
    program {
      name
    }
  }
`;

export const GET_BATCH_PROGRAM_ENROLLMENTS = `
query GET_BATCH_PROGRAM_ENROLLMENTS ($id: Int, $limit: Int, $start: Int, $sort: String){
  programEnrollmentsConnection (
    sort: $sort
    start: $start
    limit: $limit
    where: {
      batch: {
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

// export const GET_ALL_ENROLLMENT_TYPE = `
// query GET_ALL_ENROLLMENT_TYPE {
//   batches {
//     id
//     name
//     status
//     enrollment_type
//   }
// }`;


export const SEARCH_BY_GRANTS = `
  query SEARCH_BY_GRANTS($query:String, $limit:Int,$sort:String){
    grantsConnection(
      sort:$sort
      limit:$limit
      where:{
        _or:[
          {name_contains:$query}
          {donor_contains:$query}
        ]
      }
    ){
      values {
        id
        name
        donor
      }
      aggregate {
        count
      }
    }
  }
`

export const SEARCH_BY_INSTITUTIONS = `
  query SEARCH_BY_INSTITUTIONS($query:String, $limit:Int, $sort:String){
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

export const SEARCH_BY_PROGRAMS = `
  query SEARCH_BY_PROGRAMS($query:String, $limit:Int, $sort:String){
    programsConnection(
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

export const GET_ALL_BATCH = `
query GET_ALL_BATCHES($start:Int ,$limit:Int) {
  batchesConnection(start:$start,limit:$limit){
    values {
      id
      name
      status
    }
  }
  
}
`;

export const SEARCH_BY_STUDENTS = `
  query SEARCH_BY_STUDENTS($query:String,$limit:Int, $sort:String){
    studentsConnection(
      sort:$sort,
      limit:$limit
      where:{
        _or:[
          {full_name_contains:$query}
        ]
      }
    ){
      values {
        id
        full_name
        student_id
      }
      aggregate {
        count
      }
    }
  }

`

export const GET_ALL_BATCHES_UPLOAD_FILE = `
query GET_ALL_BATCHES {
  batches {
    id
    name
    status
  }
}
`;