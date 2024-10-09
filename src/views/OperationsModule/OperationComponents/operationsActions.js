import api from "../../../apis";
import { GET_PICKLIST, GET_STUDENT } from "../../../graphql";
import NP from "nprogress";
import {
  GET_OPERATIONS,
  CREATE_OPERATION,
  UPDATE_OPERATION,
  GET_USERSTOTS,
  CREATE_USER_TOT,
  UPDATE_USER_TOT,
  GET_STUDENTS_UPSKILLINGS,
  CREATE_STUDENT_UPSKILL,
  UPDATE_STUDENTS_UPSKILLING,
  GET_DTE_SAMARTH_SDITS,
  CREATE_SAMARTH_SDIT,
  UPDATE_SAMARTH_SDIT,
  GET_ALUMNI_QUERIES,
  CREATE_ALUMNI_QUERY,
  UPDATE_ALUMNI_QUERY,
  GET_COLLEGE_PITCHES,
  CREATE_COLLEGE_PITCH,
  UPDATE_COLLEGE_PITCH,
  GET_ALL_PROGRAMS,
  GET_ALL_STUDENTS,
  SEARCH_INSTITUITIONS,
  SEARCH_BY_BATCHES,
  SEARCH_BY_STUDENTS,
  SEARCH_BY_PROGRAMS,
  UPDATE_MENTORSHIP,
} from "../../../graphql/operations";

export const searchPrograms = async function (searchValue) {
  try {
    const { data } = await api.post("/graphql", {
      query: SEARCH_BY_PROGRAMS,
      variables: {
        limit: 20,
        sort: "name:asc",
        query: searchValue,
      },
    });

    return data;
  } catch (error) {
    console.error(error.message);
  }
};

export const searchStudents = async function (searchValue) {
  try {
    const { data } = await api.post("/graphql", {
      query: SEARCH_BY_STUDENTS,
      variables: {
        limit: 20,
        sort: "full_name:asc",
        query: searchValue,
      },
    });

    return data;
  } catch (error) {
    console.error(error.message);
  }
};

export const searchBatches = async function (searchValue) {
  try {
    const { data } = await api.post("/graphql", {
      query: SEARCH_BY_BATCHES,
      variables: {
        limit: 20,
        sort: "name:asc",
        query: searchValue,
      },
    });

    return data;
  } catch (error) {
    console.error(error.message);
  }
};

export const searchInstitutions = async function (searchValue) {
  try {
    const { data } = await api.post("/graphql", {
      query: SEARCH_INSTITUITIONS,
      variables: {
        limit: 20,
        sort: "name:asc",
        query: searchValue,
      },
    });

    return data;
  } catch (error) {
    console.error(error.message);
  }
};

export const getAllProgram = async () => {
  return await api.post("/graphql", {
    query: GET_ALL_PROGRAMS,
    variables: {
      limit: 1000,
      start: 0,
    },
  });
};

export const fetchAllStudents = async () => {
  try {
    await api.post("/graphql", {
      query: GET_ALL_STUDENTS,
      variables: {
        limit: 100000,
        start: 0,
      },
    });
  } catch (error) {
    console.error(error);
  }
};
export const getSearchOps = async (searchField, value) => {
  const authToken = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  return await api
    .post(
      "/users-ops-activities/search",
      {
        searchField: searchField,
        searchValue: value,
        // {start}
      },
      { headers }
    )
    .then((data) => data)
    .catch((error) => Promise.reject(error));
};

export const getAllOpsActivities = async (
  limit = 100,
  offset = 0,
  sortBy = "created_at",
  sortOrder = "desc"
) => {
  const authToken = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  return await api
    .post(
      "/graphql",
      {
        query: GET_OPERATIONS,
        variables: {
          limit: limit,
          start: offset,
          sort: `${sortBy}:${sortOrder}`,
        },
      },
      { headers }
    )
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const getAllUsersTots = async (
  limit = 100,
  offset = 0,
  sortBy = "created_at",
  sortOrder = "desc"
) => {
  const authToken = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  return await api
    .post(
      "/graphql",
      {
        query: GET_USERSTOTS,
        variables: {
          limit: limit,
          start: offset,
          sort: `${sortBy}:${sortOrder}`,
        },
      },
      { headers }
    )
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

export const getAllUpSkills = async (
  limit = 100,
  offset = 0,
  sortBy = "created_at",
  sortOrder = "desc"
) => {
  const authToken = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  return await api
    .post(
      "/graphql",
      {
        query: GET_STUDENTS_UPSKILLINGS,
        variables: {
          limit: limit,
          start: offset,
          sort: `${sortBy}:${sortOrder}`,
        },
      },
      { headers }
    )
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

export const getAllSamarthSdits = async (
  limit = 100,
  offset = 0,
  sortBy = "created_at",
  sortOrder = "desc"
) => {
  const authToken = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  return await api
    .post(
      "/graphql",
      {
        query: GET_DTE_SAMARTH_SDITS,
        variables: {
          limit: limit,
          start: offset,
          sort: `${sortBy}:${sortOrder}`,
        },
      },
      { headers }
    )
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

export const getAllAlumniQueries = async (
  limit = 100,
  offset = 0,
  sortBy = "created_at",
  sortOrder = "desc"
) => {
  const authToken = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  return await api
    .post(
      "/graphql",
      {
        query: GET_ALUMNI_QUERIES,
        variables: {
          limit: limit,
          start: offset,
          sort: `${sortBy}:${sortOrder}`,
        },
      },
      { headers }
    )
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

export const getAllCollegePitches = async (
  limit = 100,
  offset = 0,
  sortBy = "created_at",
  sortOrder = "desc"
) => {
  const authToken = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  return await api
    .post(
      "/graphql",
      {
        query: GET_COLLEGE_PITCHES,
        variables: {
          limit: limit,
          start: offset,
          sort: `${sortBy}:${sortOrder}`,
        },
      },
      { headers }
    )
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
export const createOpsActivity = async (data) => {
  return await api
    .post("/graphql", {
      query: CREATE_OPERATION,
      variables: { data },
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const createUsersTot = async (data) => {
  return await api
    .post("/graphql", {
      query: CREATE_USER_TOT,
      variables: { data },
    })
    .then((data) => data)
    .catch((error) => Promise.reject(error));
};

export const createStudentsUpskill = async (data) => {
  return await api
    .post("/graphql", {
      query: CREATE_STUDENT_UPSKILL,
      variables: { data },
    })
    .then((data) => data)
    .catch((error) => Promise.reject(error));
};

export const createSamarthSdit = async (data) => {
  return await api
    .post("/graphql", {
      query: CREATE_SAMARTH_SDIT,
      variables: { data },
    })
    .then((data) => data)
    .catch((error) => Promise.reject(error));
};

export const createAlumniQuery = async (data) => {
  return await api
    .post("/graphql", {
      query: CREATE_ALUMNI_QUERY,
      variables: { data },
    })
    .then((data) => data)
    .catch((error) => Promise.reject(error));
};

export const createCollegePitch = async (data) => {
  return await api
    .post("/graphql", {
      query: CREATE_COLLEGE_PITCH,
      variables: { data },
    })
    .then((data) => data)
    .catch((error) => Promise.reject(error));
};

export const updateOpsActivity = async (id, data) => {
  return await api
    .post("/graphql", {
      query: UPDATE_OPERATION,
      variables: {
        id,
        data,
      },
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const updateMentorshipData = async (id, data) => {
  return await api
    .post("/graphql", {
      query: UPDATE_MENTORSHIP,
      variables: {
        id,
        data,
      },
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const updateUserTot = async (id, data) => {
  return await api
    .post("/graphql", {
      query: UPDATE_USER_TOT,
      variables: {
        id,
        data,
      },
    })
    .then((data) => data)
    .catch((error) => Promise.reject(error));
};

export const updateStudetnsUpskills = async (id, data) => {
  return await api
    .post("/graphql", {
      query: UPDATE_STUDENTS_UPSKILLING,
      variables: {
        id,
        data,
      },
    })
    .then((data) => data)
    .catch((error) => Promise.reject(error));
};

export const updateSamarthSdit = async (id, data) => {
  return await api
    .post("/graphql", {
      query: UPDATE_SAMARTH_SDIT,
      variables: {
        id,
        data,
      },
    })
    .then((data) => data)
    .catch((error) => Promise.reject(error));
};

export const updateAlumniQuery = async (id, data) => {
  return await api
    .post("/graphql", {
      query: UPDATE_ALUMNI_QUERY,
      variables: {
        id,
        data,
      },
    })
    .then((data) => data)
    .catch((error) => Promise.reject(error));
};

export const updateCollegePitch = async (id, data) => {
  return await api
    .post("/graphql", {
      query: UPDATE_COLLEGE_PITCH,
      variables: {
        id,
        data,
      },
    })
    .then((data) => data)
    .catch((error) => Promise.reject(error));
};

export const bulkCreateOpsActivities = async (data) => {
  try {
    const response = await api.post(
      "/users-ops-activities/createBulkOperations",
      data
    );
    return response;
  } catch (error) {
    return console.error(error);
  }
};
export const bulkCreateUsersTots = async (data) => {
  try {
    const response = await api.post("/users-tots/createBulkTots", data);
    return response;
  } catch (error) {
    return console.error(error);
  }
};
export const bulkCreateMentorship = async (data) => {
  try {
    const response = await api.post("/mentorships/createBulkmentorship", data);
    return response;
  } catch (error) {
    return console.error(error);
  }
};
export const bulkCreateStudentsUpskillings = async (data) => {
  try {
    const response = await api.post(
      "/students-upskillings/createBulkUpSkills",
      data
    );
    return response;
  } catch (error) {
    return console.error(error);
  }
};
export const bulkCreateSamarth = async (data) => {
  try {
    const response = await api.post(
      "/dte-samarth-sdits/createBulkSamarths",
      data
    );
    return response;
  } catch (error) {
    return console.error(error);
  }
};

export const bulkCreateCollegePitch = async (data) => {
  try {
    const response = await api.post(
      "/college-pitches/create-bulk-college-pitch",
      data
    );
    return response;
  } catch (error) {
    return console.error(error);
  }
};

export const bulkCreateAlumniQueries = async (data) => {
  try {
    const response = await api.post(
      "/alumni-queries/create-bulk-alumni-queries",
      data
    );
    return response;
  } catch (error) {
    return console.error(error);
  }
};

export const deactivate_user_ops = async (id) => {
  let data = { isactive: false };

  return await api
    .post("/graphql", {
      query: UPDATE_OPERATION,
      variables: {
        id,
        data,
      },
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
export const deactivate_user_tots = async (id) => {
  let data = { isactive: false };

  return await api
    .post("/graphql", {
      query: UPDATE_USER_TOT,
      variables: {
        id,
        data,
      },
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
export const deactivate_user_dte_samarth = async (id) => {
  let data = { isactive: false };

  return await api
    .post("/graphql", {
      query: UPDATE_SAMARTH_SDIT,
      variables: {
        id,
        data,
      },
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
export const deactivate_user_students_upskills = async (id) => {
  let data = { isactive: false };

  return await api
    .post("/graphql", {
      query: UPDATE_STUDENTS_UPSKILLING,
      variables: {
        id,
        data,
      },
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
export const deactivate_user_alumni_query = async (id) => {
  let data = { isactive: false };

  return await api
    .post("/graphql", {
      query: UPDATE_ALUMNI_QUERY,
      variables: {
        id,
        data,
      },
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
export const deactivate_mentorship = async (id) => {
  let data = { isactive: false };

  return await api
    .post("/graphql", {
      query: UPDATE_MENTORSHIP,
      variables: {
        id,
        data,
      },
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
export const deactivate_user_college_pitch = async (id) => {
  let data = { isactive: false };

  return await api
    .post("/graphql", {
      query: UPDATE_COLLEGE_PITCH,
      variables: {
        id,
        data,
      },
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const getFieldValues = async (searchField, baseURL) => {
  try {
    const data = await api.get(`/${baseURL}/distinct/${searchField}`);

    return data;
  } catch (error) {
    return console.error("error", error);
  }
};
export const getStudent = async (id) => {
  NP.start();
  try {
    let { data } = await api.post("/graphql", {
      query: GET_STUDENT,
      variables: { id: id },
    });

    let values = data.data.student;

    return values;
  } catch (err) {
  } finally {
    NP.done();
  }
};

export const getPitchingPickList = async () => {
  return await api
    .post("/graphql", {
      query: GET_PICKLIST,
      variables: {
        table: "Pitching",
      },
    })
    .then((data) => {
      let pickList = {};
      data?.data?.data?.picklistFieldConfigs.forEach((item) => {
        pickList[item.field] = item.values;
      });
      return pickList;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const getAlumniPickList = async () => {
  return await api
    .post("/graphql", {
      query: GET_PICKLIST,
      variables: {
        table: "alum_queries",
      },
    })
    .then((data) => {
      let pickList = {};
      data?.data?.data?.picklistFieldConfigs.forEach((item) => {
        pickList[item.field] = item.values;
      });
      return pickList;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const getTotPickList = async () => {
  return await api
    .post("/graphql", {
      query: GET_PICKLIST,
      variables: {
        table: "tot",
      },
    })
    .then((data) => {
      let pickList = {};
      data?.data?.data?.picklistFieldConfigs.forEach((item) => {
        pickList[item.field] = item.values;
      });
      return pickList;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const getOpsPickList = async () => {
  return await api
    .post("/graphql", {
      query: GET_PICKLIST,
      variables: {
        table: "user_ops",
      },
    })
    .then((data) => {
      let pickList = {};
      data?.data?.data?.picklistFieldConfigs.forEach((item) => {
        pickList[item.field] = item.values;
      });
      return pickList;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
