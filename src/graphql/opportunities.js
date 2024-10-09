export const opportunitiesFields = `
id
type
role_or_designation
number_of_opportunities
created_at
updated_at
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
district
job_description_file {
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
assigned_to {
  id
  username
  email
}
employer{
  id
  name
  address
  district
  state
  medha_area
  logo{
    url
  }
}
`;

const employmentConnectionFields = `
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
  student {
    student_id
    full_name
    id
  }
`;

export const GET_OPPORTUNITIES = `
query GET_OPPORTUNITIES($id: Int, $limit: Int, $start: Int, $sort: String, $state:String , $area: String) {
opportunitiesConnection(
  sort: $sort,
  start: $start,
  limit: $limit,
  where: {
    assigned_to: {
      id: $id
    },
     state:$state,
     medha_area: $area,
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

export const GET_ALL_OPPORTUNITIES = `
query GET_OPPORTUNITIES() {
opportunitiesConnection() {
  values {
    id,
  }
 }
}`
;

export const GET_OPPORTUNITY=`
query OPPORTUNITY($id:ID!) {
  opportunity(id: $id) {
    ${opportunitiesFields}
  }
}
`;

export const CREATE_OPPORTUNITY = `
  mutation CREATE_OPPORTUNITY(
    $data: OpportunityInput!
  ) {
    createOpportunity(
      input: {
        data: $data,
      }
    ) {
      opportunity {
        ${opportunitiesFields}
      }
    }
  }
`;

export const UPDATE_OPPORTUNITY = `
  mutation UPDATE_OPPORTUNITY(
    $data: editOpportunityInput!
    $id: ID!
  ) {
    updateOpportunity(
      input: {
        data: $data,
        where: { id: $id }
      }
    ) {
      opportunity {
        ${opportunitiesFields}
      }
    }
  }
`;

export const DELETE_OPPORTUNITY = `
  mutation DELETE_OPPORTUNITY(
    $id: ID!
  ){
    deleteOpportunity(
      input:{
        where: { id: $id }
      }
    ){
      opportunity {
        id
      }
    }
  }
`

export const GET_OPPORTUNITY_EMPLOYMENT_CONNECTIONS = `
  query GET_OPPORTUNITY_EMPLOYMENT_CONNECTIONS ($id: Int, $limit: Int, $start: Int, $sort: String){
    employmentConnectionsConnection (
      sort: $sort
      start: $start
      limit: $limit
      where: {
        opportunity: {
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
`
export const SEARCH_BY_EMPLOYERS =`
  query SEARCH_BY_EMPLOYERS($query:String,$limit:Int, $sort:String){
    employersConnections(
      limit:$limit
      sort:$sort
      where:{
        _or:[
          {name_contains:$query}
        ]
      }
    ){
      values {
        id
        name
        state
        district
        city
        pin_code
        medha_area
        address
      }
    }
  }
`
export const SEARCH_BY_STUDENTS = `
  query SEARCH_BY_STUDENTS($query:String,$limit:Int,$sort:String){
    studentsConnection(
      limit:$limit
      sort:$sort
      where:{
        _or:[
          {student_id_contains:$query}
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