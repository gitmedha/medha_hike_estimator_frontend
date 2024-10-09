import { queryBuilder } from "../../apis";

import {
  GET_ALL_GRANTS,
  GET_ALL_PROGRAMS,
  GET_ALL_INSTITUTES,
  GET_ASSIGNEES_LIST_OPTS,
  GET_ALL_STUDENTS,
  GET_ALL_BATCHES,
  FILTER_USERS_BY_NAME,
  GET_ALL_USERS,
  GET_USERS_BY_ROLE,
  GET_ALL_STUDENT,
} from "../../graphql";

export const batchLookUpOptions = async () => {
  const statusOptions = [
    {
      label: "Enrollment Ongoing",
      value: "Enrollment Ongoing",
    },
    { label: "Enrollment Complete -- To Be Started", value: "Enrollment Complete -- To Be Started" },
    { label: "In Progress", value: "In Progress" },
    { label: "Complete", value: "Complete" },
    { label: "Certified", value: "Certified" },
    { label: "Discontinued", value: "Discontinued" },
  ];

  let data = await queryBuilder({
    query: GET_ASSIGNEES_LIST_OPTS,
  });
  let assigneesOptions = data?.data?.users.map((assignee) => ({
    label: `${assignee.username} (${assignee.email})`,
    value: assignee.id,
  }));

  data = await queryBuilder({
    query: GET_ALL_PROGRAMS,
  });
  let programOptions = data?.data?.programs.map((program) => ({
    label: program.name,
    value: Number(program.id),
  }));

  data = await queryBuilder({
    query: GET_ALL_GRANTS,
  });
  let grantOptions = data?.data?.grants.map((grant) => ({
    label: `${grant.name} | ${grant.donor}`,
    value: Number(grant.id),
  }));

  data = await queryBuilder({
    query: GET_ALL_INSTITUTES,
  });

  let instituteOptions = data?.data?.institutionsConnection?.values?.map((institution) => ({
    label: institution.name,
    value: Number(institution.id),
  }));

  data = await queryBuilder({
    query: GET_ALL_STUDENTS,
  });
  let studentOptions = data?.data?.students.map((student) => ({
    label: student.full_name,
    value: Number(student.id),
  }));

  data = await queryBuilder({
    query: GET_ALL_BATCHES,
  });
  let batchOptions = data?.data?.batchesConnection?.values?.map((batches) => ({
    label: batches.name,
    value: Number(batches.id),
  }));

  return {
    grantOptions,
    statusOptions,
    programOptions,
    instituteOptions,
    assigneesOptions,
    studentOptions,
    batchOptions,
  };
};

export const getDefaultAssigneeOptions = async () => {
  let userId = localStorage.getItem("user_id");
  let data = await queryBuilder({
    query: GET_ALL_USERS
  });
  let userIdFound = false;
  let filteredData = data?.data?.users.map(user => {
    if (userId === user.id) {
      userIdFound = true;
    }

    return {
      label: `${user.username} (${user.email})`,
      value: user.id,
    }
  });
  if (!userIdFound) {
    let userName = localStorage.getItem("user_name");
    let userEmail = localStorage.getItem("user_email");
    filteredData.unshift({
      label: `${userName} (${userEmail})`,
      value: userId,
    });
  }
  return filteredData;
}



export const getDefaultAssignee = async (id) => {
  let userId = id;
  let data = await queryBuilder({
    query: GET_ALL_USERS
  });
  let userIdFound = false;
  let filteredData = data?.data?.users.map(user => {
    if (userId === user.id) {
      userIdFound = true;
    }

    return {
      label: `${user.username} (${user.email})`,
      value: user.id,
    }
  });
  if (!userIdFound) {
    let userName = localStorage.getItem("user_name");
    let userEmail = localStorage.getItem("user_email");
    filteredData.unshift({
      label: `${userName} (${userEmail})`,
      value: userId,
    });
  }
  return filteredData;
}


export const getAllMedhaUsers = async () => {
  let userId = localStorage.getItem("user_id");
  let data = await queryBuilder({
    query: GET_ALL_USERS
  });
  let userIdFound = false;
  let filteredData = data?.data?.users.map(user => {
    return {
      name: user.username,
      id: user.id,
    }
  });
  return filteredData;
}

export const filterAssignedTo = async (newValue) => {
  let data = await queryBuilder({
    query: FILTER_USERS_BY_NAME,
    variables: {
      name: newValue.trim()
    },
  });
  return data?.data?.users.map(user => ({
    label:`${user.username} (${user.email})`,
    value: user.id,
  }));
}

export const getAllSrm =async(role)=>{
  let data =await queryBuilder({
    query:GET_USERS_BY_ROLE,
    variables:{
      role:1
    },
  });
  return data?.data?.users.map(user => ({
    label: `${user.username} (${user.email})`,
    value: user.id,
  }));
}
export const getAllSrmbyname =async(role)=>{
  let data =await queryBuilder({
    query:GET_USERS_BY_ROLE,
    variables:{
      role:1
    },
  });
  return data?.data?.users.map(user => ({
    label: `${user.username}`,
    value: user.id,
  }));
}


export const getAllStudents =async()=>{
  let data=await queryBuilder({
    query:GET_ALL_STUDENT,
  })
  return data?.data?.users.map(user => ({
    label: `(${user.full_name})`,
    value: user.id,
  }));
}