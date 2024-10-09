export const employerFields = `
  id
  name
  phone
  status
  website
  email
  type
  industry
  paid_leaves
  employee_benefits
  employment_contract
  offer_letter
  medha_partner
  address
  district
  pin_code
  state
  medha_area
  address
  city
  created_at
  updated_at
  logo {
    id
    url
  }
  assigned_to{
    id
    username
    email
  }
  mou_file {
    id
    url
    created_at
  }
  created_by_frontend{
    username
    email
  }
  updated_by_frontend{
    username
    email
  }
  logo {
    url
  }
  contacts {
    id
    email
    phone
    full_name
    designation
  }
`;

export const IndustryFields = `
  id
  industry_name
  sub_industry
  category
  active
`;

export const GET_ALL_INDUSTRY =`
query IndustryConnection {
  industries {
    industry_name
    sub_industry
  }
}
`


export const GET_ALL_EMPLOYERS = `
  query GET_ALL_EMPLOYERS {
    employers {
      id
      name
      address
      medha_area
      city
      state
      pin_code
      district
    }
  }
`;

export const GET_EMPLOYER_OPPORTUNITIES = `
  query GET_EMPLOYER_OPPORTUNITIES ($id: ID!){
    opportunities (
      where: {employer: {id: $id}}
    ) {
      id
      number_of_opportunities
      salary
      type
      status
      role_or_designation
      role_description
      assigned_to{
        username
      }
      updated_at
    }
  }
`;

export const GET_MY_EMPLOYER = `
  query GET_EMPLOYERS($id: Int, $limit: Int, $start: Int, $sort: String) {
    employers(
      sort: $sort
      start: $start
      limit: $limit
      where: { assigned_to: { id: $id } }
    ) {
      id
      name
      logo {
        url
      }
      assigned_to {
        id
        username
      }
      contacts {
        email
        phone
        designation
        full_name
      }
      industry
      address
      city
      medha_area
      pin_code
      state
    }
  }
`;

export const GET_USER_EMPLOYERS = `
  query GET_EMPLOYERS($id: Int, $limit: Int, $start: Int, $sort: String, $state: String, $area: String) {
    employersConnection(
      sort: $sort,
      start: $start,
      limit: $limit,
      where: {
        assigned_to: {
          id: $id
        },
        state:$state,
        medha_area:$area,
      }
    ) {
      values {
        id
        name
        contacts {
          id
          email
          phone
          full_name
          designation
        }
        logo {
          url
        }
        assigned_to {
          id
          username
        }
        industry
        address
        city
        medha_area
        pin_code
        state
        district
        created_at
      }
      aggregate {
        count
      }
    }
  }
`;

export const GET_EMPLOYER = `
  query EMPLOYER($id: ID!) {
    employer(id: $id) {
      ${employerFields}
    }
  }
`;

export const CREATE_EMPLOYER = `
  mutation CREATE_EMPLOYER(
    $data: EmployerInput!
  ) {
    createEmployer(
      input: {
        data: $data,
      }
    ) {
      employer {
        ${employerFields}
      }
    }
  }
`;

export const UPDATE_EMPLOYER = `
  mutation UPDATE_EMPLOYER(
    $data: editEmployerInput!
    $id: ID!
  ) {
    updateEmployer(
      input: {
        data: $data,
        where: { id: $id }
      }
    ) {
      employer{
        ${employerFields}
      }
    }
  }
`;

export const DELETE_EMPLOYER = `
  mutation DELETE_EMPLOYER(
    $id: ID!
  ){
    deleteEmployer(
      input:{
        where: { id: $id }
      }
    ){
      employer{
        id
      }
    }
  }
`;

export const GET_EMPLOYER_EMPLOYMENT_CONNECTIONS = `
query GET_EMPLOYER_EMPLOYMENT_CONNECTIONS(
  $id: Int
  $limit: Int
  $start: Int
  $sort: String
) {
  employmentConnectionsConnection(
    sort: $sort
    start: $start
    limit: $limit
    where: { opportunity: { employer: { id: $id } } }
  ) {
    values {
      id
      status
      start_date
      end_date
      source
      reason_if_rejected
      reason_if_rejected_other
      work_engagement
      number_of_internship_hours
      salary_offered
      updated_at
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
      student{
        full_name
        id
        student_id
      }
      opportunity {
        id
        role_description
        role_or_designation
        type
        employer {
          id
          name
        }
      }
    }
    aggregate {
      count
    }
  }
}`;


export const SEARCH_BY_STUDENTS = `
  query SEARCH_BY_STUDENTS($query:String,$limit:Int,$sort:String){
    studentsConnection(
      limit:$limit
      sort:$sort
      where: {
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
    }
  }
`


export const SEARCH_BY_EMPLOYER = `
  query SEARCH_BY_EMPLOYER($query:String,$limit:Int,$sort:String){
    employersConnection(
      limit:$limit,
      sort:$sort,
      where:{
        _or:[
          {name_contains:$query}
        ]
      }
    ){
      values{
        id
        name
      }
    }
  }
`