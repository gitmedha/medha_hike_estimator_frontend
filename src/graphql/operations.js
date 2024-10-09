const operationFields = `
    id
    activity_type
    created_at
    updated_at 
    program_name
    institution {
        name
        id
    }
    area
    state
    batch {
        name
        id
    }
    topic
    start_date
    end_date
    donor
    guest
    designation
    organization
    students_attended
    other_links
    assigned_to{
    username
    id
  }
  createdby {
    username
    id
  }
  updatedby {
    username
    id
  }
  isactive
  student_type
`;

const usersTotsFields = `
    id
    created_at
    updated_at
    user_name
    createdby {
        id
        username
    }
    updatedby {
        id
        username
    }
    trainer_1 {
        id
        username
    }
    start_date
    end_date
    project_name
    certificate_given
    module_name
    project_type
    new_entry
    trainer_2 {
        id
        username
    }
    partner_dept
    college
    city
    state
    age
    gender
    contact
    designation
`;
const studentUpskillingFields = `
    id
    created_at
    program_name
    updated_at
    createdby {
        id
        username
    }
    updatedby {
        id
        username
    }
    assigned_to {
        id
        username
    }
    student_id{
        id
        full_name
    }
    institution {
        id
        name
    }
    batch {
        id
        name
    }
    start_date
    end_date
    course_name
    certificate_received
    category
    sub_category
    issued_org
    published_at
`;

const dteSamarthSditFields = `
    id
    created_at
    registration_id
    registration_date
    batch_name
    student_name
    course_name
    institution_name
    district
    state
    dob
    gender
    father_guardian
    mobile
    email
    annual_income
    full_address
    self_employed
    higher_studies
    placed
    apprenticeship
    doj
    company_placed
    monthly_salary
    data_flag
    position
    trade
    company_apprenticed
    company_self
    institute_admitted
    acad_year
    result
    published_at
`;
const alumniQueriesFields = `
    id
    created_at
    createdby {
        id
        username
    }
    updatedby {
        id
        username
    }
    student_id{
        id
        full_name
        student_id
        name_of_parent_or_guardian
        email
        phone
    }
    query_start
    student_name
    father_name
    email
    phone
    location
    query_type
    query_desc
    conclusion
    status
    query_end
`;
const collegePitchesFields = `
    id
    created_at
    createdby {
        id
        username
    }
    updatedby {
        id
        username
    }
    pitch_date
    student_name
    course_name
    course_year
    college_name
    program_name
    phone
    whatsapp
    email
    remarks
    srm_name {
        id
        username
    }
    area
`;

const mentoshipfeild = `
id
created_at
updated_at
assigned_to {
    id
    username
}
mentor_name
email
mentor_domain
mentor_company_name
designation
contact
mentor_area
mentor_state
outreach
onboarding_date
social_media_profile_link
medha_area
status
isactive
program_name
createdby {
    id
    username
}
updatedby {
    id
    username
}

`;

export const GET_OPERATIONS = `
    query GET_OPERATIONS ($limit:Int, $start:Int, $sort:String){
        allOperations: usersOpsActivitiesConnection(where: { isactive: true }) {
            aggregate {
                count
            }
        }
        activeOperations: usersOpsActivitiesConnection(
            sort: $sort,
            start: $start,
            limit: $limit,
            where: { isactive: true }
        ) {
            values {
                ${operationFields}
            }
        }
    } 
`;

export const GET_USERSTOTS = `
    query GET_USERSTOTS($limit:Int, $start:Int, $sort:String) {
        allUserstots: usersTotsConnection(where: { isactive: true }) {
            aggregate {
                count
            }
        }
        activeUserstots: usersTotsConnection(
            sort: $sort,
            start: $start,
            limit: $limit,
            where: { isactive: true }
        ) {
            values {
                ${usersTotsFields}
            }
        }
    }
`;

export const GET_STUDENTS_UPSKILLINGS = `
    query GET_STUDENTS_UPSKILLINGS($limit: Int, $start: Int, $sort: String) {
        allStudentsUpskillings: studentsUpskillingsConnection(where: { isactive: true }) {
            aggregate {
                count
            }
        }
        activeStudentsUpskillings: studentsUpskillingsConnection(
            sort: $sort,
            start: $start,
            limit: $limit,
            where: { isactive: true }
        ) {
            values {
                ${studentUpskillingFields}
            }
        }
    }
`;

export const GET_DTE_SAMARTH_SDITS = `
    query GET_DTE_SAMARTH_SDITS($limit:Int,$start:Int,$sort:String) {
        dteSamarthSditsConnection(
            sort:$sort,
            start:$start,
            limit:$limit,
            where:{isactive:true}
        ){
            values {
                ${dteSamarthSditFields}
            }
            aggregate {
                count
            }
        }
    }

`;

export const GET_ALUMNI_QUERIES = `
    query GET_ALUMNI_QUERIES($limit: Int, $start: Int, $sort: String) {
        allAlumniQueries: alumniQueriesConnection(where: { isactive: true }) {
            aggregate {
                count
            }
        }
        activeAlumniQueries: alumniQueriesConnection(
            sort: $sort,
            start: $start,
            limit: $limit,
            where: { isactive: true }
        ) {
            values {
                ${alumniQueriesFields}
            }
        }
    }
`;

export const GET_COLLEGE_PITCHES = `
    query GET_COLLEGE_PITCHES($limit: Int, $start: Int, $sort: String) {
        allCollegePitches: collegePitchesConnection(where: { isactive: true }) {
            aggregate {
                count
            }
        }
        activeCollegePitches: collegePitchesConnection(
            sort: $sort,
            start: $start,
            limit: $limit,
            where: { isactive: true }
        ) {
            values {
                ${collegePitchesFields}
            }
        }
    }
`;

export const GET_MENTORSHIP = `
    query GET_MENTORSHIP($limit: Int, $start: Int, $sort: String) {
        allMentoshipData: mentorshipsConnection(where: { isactive: true }) {
            aggregate {
                count
            }
        }
        activeMentoshipData: mentorshipsConnection(
            sort: $sort,
            start: $start,
            limit: $limit,
            where: { isactive: true }
        ) {
            values {
                ${mentoshipfeild}
            }
        }
    }
`;

export const CREATE_OPERATION = `
    mutation CREATE_OPERATION (
        $data:OperationInput!
    ){
        createUsersOpsActivity(
            input: {
                data:$data
            }
        ){
            usersOpsActivity {
                ${operationFields}
            }
        }
    }


`;

export const CREATE_USER_TOT = `
    mutation CREATE_USER_TOTS (
        $data:UsersTotInput!
    ){
        createUsersTot(
            input: {
                data:$data
            }
        ){
            usersTot {
                ${usersTotsFields}
            }
        }
    }
`;

export const CREATE_STUDENT_UPSKILL = `
    mutation CREATE_STUDENT_UPSKILL (
        $data:StudentsUpskillingInput!
    ){
        createStudentsUpskilling(
            input: {
                data:$data
            }
        ){
            studentsUpskilling {
                ${studentUpskillingFields}
            }
        }
    }
`;

export const CREATE_SAMARTH_SDIT = `
    mutation CREATE_SAMARTH_SDIT (
        $data:DteSamarthSditInput!
    ) {
        createDteSamarthSdit(
            input: {
                data:$data
            }
        ){
            dteSamarthSdit {
                ${dteSamarthSditFields}
            }
        }
    }
`;

export const CREATE_ALUMNI_QUERY = `
    mutation CREATE_ALUMNI_QUERY (
        $data:AlumniQueryInput!
    ) {
        createAlumniQuery(
            input: {
                data:$data
            }
        ){
            alumniQuery {
                ${alumniQueriesFields}
            }
        }
    }
`;

export const CREATE_COLLEGE_PITCH = `
    mutation CREATE_COLLEGE_PITCH (
        $data:CollegePitchInput!
    ) {
        createCollegePitch(
            input: {
                data:$data
            }
        ){
            collegePitch {
                ${collegePitchesFields}
            }
        }
    }
`;

export const UPDATE_OPERATION = `
    mutation UPDATE_OPERATION (
        $data:editUsersOpsActivityInput!
        $id:ID!
    ){
        updateUsersOpsActivity(
            input: {
                data:$data,
                where: {id: $id}
            }
        ){
            usersOpsActivity{
                ${operationFields}
            }
        }
    }

`;

export const UPDATE_MENTORSHIP = `
    mutation UPDATE_MENTORSHIP (
        $data:editMentorshipInput!
        $id:ID!
    ){
        updateMentorship(
            input: {
                data:$data,
                where: {id: $id}
            }
        ){
            mentorship{
                ${mentoshipfeild}
            }
        }
    }

`;

export const UPDATE_USER_TOT = `
mutation UPDATE_USER_TOT(
    $data: editUsersTotInput!
    $id: ID!
  ) {
    updateUsersTot(input: {
      data: $data
      where: { id: $id }
    }) {
      usersTot {
        ${usersTotsFields}
      }
    }
  }
`;

export const UPDATE_STUDENTS_UPSKILLING = `
  mutation UPDATE_STUDENTS_UPSKILLING(
    $data:editStudentsUpskillingInput!
    $id:ID!
  ){
    updateStudentsUpskilling(input:{
        data: $data
        where: {id: $id}
    }){
        studentsUpskilling {
            ${studentUpskillingFields}
        }
    }
  }
`;

export const UPDATE_SAMARTH_SDIT = `
  mutation UPDATE_SAMARTH_SDIT(
    $data:editDteSamarthSditInput!
    $id:ID!
  ){
    updateDteSamarthSdit(input:{
        data:$data
        where: { id: $id }
    }){
        dteSamarthSdit {
            ${dteSamarthSditFields}
        }
    }
  }
`;

export const UPDATE_ALUMNI_QUERY = `
    mutation UPDATE_ALUMNI_QUERY(
        $data:editAlumniQueryInput!
        $id:ID!
    ){
        updateAlumniQuery(input:{
            data:$data
            where: { id: $id }
        }){
            alumniQuery {
                ${alumniQueriesFields}
            }
        }
    }
`;

export const UPDATE_COLLEGE_PITCH = `
    mutation UPDATE_COLLEGE_PITCH(
        $data:editCollegePitchInput!
        $id:ID!
    ){
        updateCollegePitch(input:{
            data:$data
            where: { id: $id }
        }){
            collegePitch {
                ${collegePitchesFields}
            }
        }
    }
`;

export const GET_ALL_PROGRAMS = `
query GET_ALL_PROGRAMS($limit:Int, $start:Int) {
    programsConnection(
        start:  $start,
        limit:  $limit
  ) {
    values {
        id
        name
        status
    }
  }
}
`;

export const GET_ALL_STUDENTS = `
    query GET_ALL_STUDENTS ($limit:Int, $start: Int){
        studentsConnection(
            start:$start,
            limit:$limit
        ){
            values {
                city
                state
            }
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
`;

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
`;

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
`;

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
`;

export const SEARCH_BY_PROGRAMS = `
  query SEARCH_BY_PROGRAMS($query:String, $limit:Int, $sort:String){
    programsConnection(
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
`;
