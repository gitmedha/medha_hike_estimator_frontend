export const GET_STATE_METRICS = `
    query MetricsState($state: String) {
    metricsStates(where: {state_name: $state }) {
        registrations
        certifications
        internships
        placements
    }
    }`
;

export const GET_DISTRICT_METRICS = `
query MetricsDistrict ($district: String){
  metricsDistricts(where: { district_name: $district}) {
      registrations
      certifications
      internships
      placements
    }
  }`
;

export const GET_AREA_METRICS = `
  query MetricsArea($area: String) {
    metricsAreas(where: {area_name: $area }) {
      registrations
      certifications
      internships
      placements
    }
  }`
;

export const GET_ALL_METRICS = `
  query MetricsAll {
    metricsAlls {
      registrations
      certifications
      internships
      placements
    }
  }`
;

export const GET_MY_DATA_REGISTRATIONS = `
  query GET_MY_DATA_REGISTRATIONS ($user: Int){
    programEnrollmentsConnection (
      where:{
        student: {
          assigned_to:{
            id: $user
          }
        }
        status_nin: ["Enrollment Request Received", "Enrollment Request Rejected by Medha"]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_MY_DATA_CERTIFICATIONS = `
  query GET_MY_DATA_CERTIFICATIONS ($user: Int){
    programEnrollmentsConnection (
      where:{
        student: {
          assigned_to:{
            id: $user
          }
        }
        status: "Certified by Medha"
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_MY_DATA_INTERNSHIPS = `
  query GET_MY_DATA_INTERNSHIPS ($user: Int){
    employmentConnectionsConnection (
      where:{
        student: {
          assigned_to:{
            id: $user
          }
        }
        opportunity:{
          type: "Internship"
        }
        status: "Internship Complete"
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_MY_DATA_PLACEMENTS = `
  query GET_MY_DATA_PLACEMENTS ($user: Int){
    employmentConnectionsConnection (
      where:{
        student: {
          assigned_to:{
            id: $user
          }
        }
        opportunity:{
          type: "Job"
        }
        status: "Offer Accepted"
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

const opportunitiesFields = `
id
type
role_or_designation
number_of_opportunities
created_at
status
department_or_team
role_description
skills_required
compensation_type
salary
address
city
state
pin_code
medha_area
assigned_to {
  id
  username
}
employer{
  id
  name
  address
  logo{
    url
  }
}
`;

export const GET_OPPORTUNITIES = `
query GET_OPPORTUNITIES($limit: Int, $start: Int, $status: String) {
  opportunitiesConnection(
    sort:"created_at:desc"
    start: $start
    limit: $limit
    where: {
      status: $status,
    }
    ) {
      values {
        ${opportunitiesFields}
      }
      aggregate {
        count
      }
    }
  }`
;

export const GET_DASHBOARD_PROGRAM_ENROLLMENTS = `
query GET_DASHBOARD_PROGRAM_ENROLLMENTS(
  $id: Int
  $limit: Int
  $start: Int
) {
  programEnrollmentsConnection(
    sort:"created_at:desc"
    start: $start
    limit: $limit
    where: { institution: { assigned_to: { id: $id } },
             status:"Enrollment Request Received"
            }
  ) {
    values {
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
      created_at
      updated_at
      program_selected_by_student
      medha_program_certificate_status
      institution {
        id
        name
        medha_area
        assigned_to {
          id
          username
        }
      }
      batch {
        id
        name
        program{
          name
        }
      }
      student{
        id
        full_name
      }
    }
    aggregate {
      count
    }
  }
}
`;

const studentFields = `
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
old_sis_id
medha_champion
interested_in_employment_opportunities
city
pin_code
medha_area
address
state
assigned_to{
  id
  username
  email
}
logo {
  id
  url
}
CV {
  url
  previewUrl
  updated_at
}
`;

export const GET_STUDENTS = `
query GET_DASHBOARD_PROGRAM_ENROLLMENTS(
  $limit: Int
  $start: Int
) {
  programEnrollmentsConnection(
    sort:"certification_date:desc"
    start: $start
    limit: $limit
    where: { status:"Certified by Medha"}
  ) {
    values {
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
      created_at
      updated_at
      program_selected_by_student
      medha_program_certificate_status
      institution {
        id
        name
        medha_area
        assigned_to {
          id
          username
        }
      }
      batch {
        id
        name
        program{
          name
          status
        }
      }
      student{
        id
        full_name
        medha_area
      }
    }
    aggregate {
      count
    }
  }
}
`;

export const GET_MY_DATA_REGISTRATIONS_GRAPH = `
  query GET_MY_DATA_REGISTRATIONS_GRAPH ($user: Int){
    programEnrollmentsConnection (
      where:{
        student: {
          assigned_to:{
            id: $user
          }
        }
        status_nin: ["Enrollment Request Received", "Enrollment Request Rejected by Medha"]
      }
    ) {
      groupBy {
        registration_date {
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

export const GET_MY_DATA_CERTIFICATIONS_GRAPH = `
  query GET_MY_DATA_CERTIFICATIONS_GRAPH ($user: Int){
    programEnrollmentsConnection (
      where:{
        student: {
          assigned_to:{
            id: $user
          }
        }
        status: "Certified by Medha"
      }
    ) {
      groupBy {
        certification_date {
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

export const GET_MY_DATA_INTERNSHIPS_GRAPH = `
  query GET_MY_DATA_INTERNSHIPS_GRAPH ($user: Int){
    employmentConnectionsConnection (
      where:{
        student: {
          assigned_to:{
            id: $user
          }
        }
        opportunity:{
          type: "Internship"
        }
        status: "Internship Complete"
      }
    ) {
      groupBy {
        start_date {
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

export const GET_MY_DATA_PLACEMENTS_GRAPH = `
  query GET_MY_DATA_PLACEMENTS_GRAPH ($user: Int){
    employmentConnectionsConnection (
      where:{
        student: {
          assigned_to:{
            id: $user
          }
        }
        opportunity:{
          type: "Job"
        }
        status: "Offer Accepted"
      }
    ) {
      groupBy {
        start_date {
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
