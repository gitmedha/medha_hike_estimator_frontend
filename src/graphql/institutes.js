export const institutionFields =`
      id
      name
      state
      city
      medha_area
      contacts{
        id
        email
        phone
        full_name
        designation
      }
      logo{
        url
      }
      assigned_to{
        id
        username
        email
      }
      status
      type
      created_at
`
export const GET_MY_INSTITUTES = `
query GET_INSTITUTES($id: Int, $limit: Int, $start: Int, $sort: String) {
  institutions(
    sort: $sort
    start: $start
    limit: $limit
    where: {
      assigned_to: {
        id: $id
      }
    }
  ) {
    id
    name
    logo{
      url
    }
    assigned_to{
      id
      username
    }
    status
    assigned_to {
      id
      email
    }
    type
    created_at
  }
}
`;

export const GET_USER_INSTITUTES = `
query GET_INSTITUTES($id: Int, $limit: Int, $start: Int, $sort: String, $state: String, $area:String) {
  institutionsConnection(
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
      state
      city
      medha_area
      contacts{
        id
        email
        phone
        full_name
        designation
      }
      logo{
        url
      }
      assigned_to{
        id
        username
        email
      }
      status
      type
      created_at
    }
    aggregate {
      count
    }
  }
}
`;

export const CREATE_NEW_INSTITUTE = `
mutation CREATE_INSTITUTIONS(
  $data: InstitutionInput!
) {
  createInstitution(
    input: {
      data: $data,
    }
  )
  {
    institution {
      id
      name
      type
      phone
      email
      status
      website
      address
      pin_code
      state
      medha_area
      district
      city
      logo{
        url
      }
      contacts {
        full_name
        email
        phone
      }
      mou {
        mou_file
        {
          id
        }
        start_date
        end_date
      }
    }
  }
}
`;

/**
 * SAMPLE PAYLOAD TO CREATE NEW INSTITUTE
{
    "assigned_to": 2,
    "status": "active",
    "phone": "1234567890",
    "email": "someone@au1.com",
    "name": "Awesome University 1",
    "website": "www.awesome2-university.com",
    "contacts": [
        {
            "last_name": "Maurya",
            "phone": "6360535414",
            "first_name": "Narendra",
            "email": "mauryanarendra09@gmail.com",
            "address_line": "29,30, Varsha Enclave, Narona, Kakori Road, Lucknow"
        }
    ],
    "address": {
        "pin_code": "226101",
        "medha_area": "lucknow",
        "state": "Uttar_Pradesh",
        "address_line": "29,30, Varsha Enclave, Narona, Kakori Road, Lucknow"
    }
}
*/

export const UPDATE_INSTITUTION = `
mutation UPDATE_INSTITUTIONS(
    $data: editInstitutionInput!
    $id: ID!
  ) {
    updateInstitution(
      input: {
        data: $data,
        where: { id: $id }
      }
    ) {
      institution {
        id
        name
        website
        phone
        status
        email
        pin_code
        address
        state
        medha_area
        city
        district
        contacts {
          full_name
          email
          phone
        }
        mou {
          mou_file
          {
            id
          }
          start_date
          end_date
        }
      }
  }
}
`;
/**
 * SAMPLE PAYLOAD TO UPDATE INSTITUTION
 {
  "data": {
    "name": "Awesome University 3",
    "website": "www.awesome3-university.com",
    "phone": "1234567891",
    "email": "someone123@au1.com",
    "status": "active",
    assigned_to: 4,
    "contacts": [
      {
        "first_name": "Narendra",
        "last_name": "Maurya",
        "email": "mauryanarendra09@gmail.com",
        "phone": "6360535414",
        "address_line": "29,30, Varsha Enclave, Narona, Kakori Road, Lucknow"
      }
    ],
    "address": {
      "pin_code": "226101",
      "address_line": "29,30, Varsha Enclave, Narona, Kakori Road, Lucknow",
      "state": "Uttar_Pradesh",
      "medha_area": "lucknow"
    }
  },
  "id": 8
}
 */

export const DELETE_INSTITUTION = `
mutation DELETE_INSTITUTION(
    $id: ID!
  ){
    deleteInstitution(
      input:{
        where: { id: $id }
      }
    ){
      institution{
        id
      }
    }
}
`;
/**
 * SAMPLE PLAYLOAD TO DELETE AN INSTITUTE
{
  "id": 8
}
*/

export const GET_INSTITUTE = `
query INSTITUTION(
    $id: ID!
  ){
    institution(id: $id){
      name
      id
      email
      phone
      status
      website
      type
      address
      state
      pin_code
      medha_area
      city
      created_at
      updated_at
      created_by_frontend{
        username
        email
      }
      updated_by_frontend{
        username
        email
      }
      district
      logo {
        id
        url
      }
      assigned_to {
        id
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
      mou {
        mou_file
        {
          id
          url
        }
        start_date
        end_date
      }
    }
  }
`;
/**
 * SAMPLE PLAYLOAD TO AN INSTITUTE DETAILS
{
  "id": 8
}
*/

export const GET_ALL_INSTITUTES = `
query GET_ALL_INSTITUTES($start:Int ,$limit:Int) {
  institutionsConnection(start:$start,limit:$limit){
    values {
      id
      name
      status
    }
  }
  
}
`;

export const GET_INSTITUTES_COUNT = `
query GET_INSTITUTES_COUNT {
  institutionsConnection {
    aggregate {
      count
    }
  }
  
}
`;

export const GET_INSTITUTION_STUDENTS = `
query GET_STUDENTS_IN_INSTITUTION ($id: Int, $limit: Int, $start: Int, $sort: String){
  programEnrollmentsConnection (
    sort: $sort
    start: $start
    limit: $limit
    where: {
      institution: {
        id: $id
      }
    }
  ) {
    values {
      id
      status
      course_year
      year_of_course_completion
      institution {
        id
        name
      }
      student {
        id
        phone
        alternate_phone
        full_name
        logo {
          url
        }
        address
        city
      }
    }
    aggregate {
      count
    }
  }
}
`;

export const GET_INSTITUTION_STUDENTS_DETAILS = `
query GET_STUDENT ($id: ID!){
  student(id: $id){
    full_name
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
  program_selected_by_student
  medha_program_certificate_status
  discount_code_id
  created_at
  updated_at
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
  }
  batch {
    id
    name
    program {
      name
    }
  }
`;

export const GET_INSTITUTION_PROGRAM_ENROLLMENTS = `
query GET_INSTITUTION_PROGRAM_ENROLLMENTS ($id: Int, $limit: Int, $start: Int, $sort: String){
  programEnrollmentsConnection (
    sort: $sort,
    start: $start,
    limit: $limit,
    where: {
      institution: {
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


export const SEARCH_BY_STUDENTS = `
  query SEARCH_BY_STUDENTS($query:String,$limit:Int,$sort:String){
    studentsConnection(
      limit:$limit,
      sort:$sort,
      where:{
        _or:[
          {full_name_contains:$query}
          {student_id_contains:$query}
        ]
      }
    )
    {
      values {
        id
        full_name
        student_id
      }
    }
  }
`
export const SEARCH_BY_BATCHES = `
  query SEARCH_BY_BATCHES($query:String, $limit:Int, $sort:String){
    batchesConnection(
      limit:$limit,
      sort:$sort,
      where:{
        _or:[{name_contains:$query}]
      }
    )
    {
      values {
        id
        name
      }
    }
  }
`