import api from "../../apis";
import { 
  GET_ALL_BATCHES, 
  GET_BATCH_PROGRAM_ENROLLMENTS, 
  GET_PICKLIST, 
  DELETE_BATCH, 
  UPDATE_BATCH, 
  CREATE_NEW_BATCH, 
  CREATE_SESSION, 
  GET_SESSIONS, 
  GET_SESSION_ATTENDANCE_STATS, 
  GET_SESSION_ATTENDANCE, 
  UPDATE_SESSION_QUERY, 
  UPDATE_SESSION_ATTENDANCE, 
  MARK_ATTENDANCE, 
  GET_STUDENT_COUNT_BY_BATCH, 
  GET_BATCH_STUDENTS_ATTENDANCE, 
  DELETE_SESSION_QUERY,
  SEARCH_BY_GRANTS,
  SEARCH_BY_INSTITUTIONS,
  SEARCH_BY_PROGRAMS,
  SEARCH_BY_STUDENTS
 } from "../../graphql";

export const getBatchesPickList = async () => {
  return await api.post("/graphql", {
    query: GET_PICKLIST,
    variables: {
      table: 'batches'
    },
  })
  .then(data => {
    let pickList = {};
    data?.data?.data?.picklistFieldConfigs.forEach((item) => {
      pickList[item.field] = item.values;
    });
    return pickList;
  })
  .catch(error => {
    return Promise.reject(error);
  });
};

export const createBatch = async (data) => {
  return await api.post('/graphql', {
    query: CREATE_NEW_BATCH,
    variables: {data},
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
};

export const updateBatch = async (id, data) => {
  return await api.post("/graphql", {
    query: UPDATE_BATCH,
    variables: {
      id,
      data,
    },
  })
  .then(data => {
    return data;
  })
  .catch(error => {
    return Promise.reject(error);
  });
};

export const deleteBatch = async (id) => {
  return await api.post('/graphql', {
    query: DELETE_BATCH,
    variables: {
      batch: id,
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const createBatchSession = async (batchId, data) => {
  return await api.post('/graphql', {
    query: CREATE_SESSION,
    variables: {
      batchID: batchId,
      ...data,
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const updateSession = async (sessionId, data) => {
  return await api.post('/graphql', {
    query: UPDATE_SESSION_QUERY,
    variables: {
      id: sessionId,
      data,
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const deleteSession = async (id, data) => {
  return await api.post('/graphql', {
    query: DELETE_SESSION_QUERY,
    variables: {
      session: id
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getBatchSessions = async (batchId, sortBy='created_at', sortOrder = 'desc') => {
  return await api.post('/graphql', {
    query: GET_SESSIONS,
    variables: {
      id: batchId,
      sort: `${sortBy}:${sortOrder}`,
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getBatchSessionAttendanceStats = async (batchId) => {
  return await api.post('/graphql', {
    query: GET_SESSION_ATTENDANCE_STATS,
    variables: {
      id: batchId,
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getSessionAttendance = async (sessionId) => {
  return await api.post('/graphql', {
    query: GET_SESSION_ATTENDANCE,
    variables: {
      sessionID: sessionId,
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const createSessionAttendance = async (sessionId, data) => {
  return await api.post('/graphql', {
    query: MARK_ATTENDANCE,
    variables: {
      session: sessionId,
      ...data,
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const updateAttendance = async (attendanceId, data) => {
  return await api.post('/graphql', {
    query: UPDATE_SESSION_ATTENDANCE,
    variables: {
      id: attendanceId,
      data,
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getStudentCountByBatch = async () => {
  return await api.post('/graphql', {
    query: GET_STUDENT_COUNT_BY_BATCH,
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getBatchStudentAttendances = async (batchId) => {
  return await api.post('/graphql', {
    query: GET_BATCH_STUDENTS_ATTENDANCE,
    variables: {
      id: batchId,
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getBatchProgramEnrollments = async (batchID, limit=100, offset=0, sortBy='created_at', sortOrder = 'desc') => {
  return await api.post('/graphql', {
    query: GET_BATCH_PROGRAM_ENROLLMENTS,
    variables: {
      id: Number(batchID),
      limit: limit,
      start: offset,
      sort: `${sortBy}:${sortOrder}`,
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getAllBatches = async () => {
  return await api.post('/graphql', {
    query: GET_ALL_BATCHES,
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}
;

export const batchGenerateCertificates = async (batchId) => {
  let url = `${process.env.REACT_APP_STRAPI_API_BASEURL}/batch/${batchId}/generate-certificates`;
  return await api.post(url).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
};

export const batchEmailCertificates = async (batchId) => {
  let url = `${process.env.REACT_APP_STRAPI_API_BASEURL}/batch/${batchId}/email-certificates`;
  return await api.post(url).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
};

export const batchSendLinks = async (batchId) => {
  let url = `${process.env.REACT_APP_STRAPI_API_BASEURL}/batch/${batchId}/send-link`;
  return await api.post(url).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });

}

export const getFieldValues = async (searchField,baseURL,tab,info)=>{
  try{
  
      const data = await api.get(`/${baseURL}/distinct/${searchField}/${tab}/${new URLSearchParams(info).toString()
      }`)
      return data;
  }
  catch(error){
      return console.error("error", error);
  }

}

export const searchInstitutes = async(searchValue)=>{
  try {
    const {data} = await api.post('/graphql', {
      query:SEARCH_BY_INSTITUTIONS, 
      variables:{
        limit:20,
        query:searchValue,
        sort:`name:asc`
      }
    })
  return data
    
  } catch (error) {
    return console.error(error)
  }
}

export const searchGrants = async (searchValue)=>{
  try{

    const {data} = await api.post('/graphql', {
      query:SEARCH_BY_GRANTS,
      variables:{
        limit:20,
        query:searchValue,
        sort:`name:asc`
      }
    })

    return data;
  }catch(error){
    return console.error(error)
  }
}

export const searchPrograms = async(searchValue)=>{
  try {
    const {data} = await api.post('/graphql', {
      query:SEARCH_BY_PROGRAMS,
      variables:{
        limit:20,
        query:searchValue,
        sort:`name:asc`
      }
    })
    return data;
    
  } catch (error) {
    return console.error(error);
  }
}

export const searchStudents = async(searchValue)=>{
  try {
    const {data}= await api.post('/graphql', {
      query:SEARCH_BY_STUDENTS,
      variables:{
        limit:20,
        query:searchValue,
        sort:`full_name:asc`
      }
    })

    return data
  } catch (error) {
    console.error(error.message);
  }
}



/* Send Emails on Creation and Updation */

export const sendEmailOnCreateBatch = async (batchInfo) => {
  let url = `batch/sendEmailONCreationAndUpdate`;
  return await api.post(url, {
    data:batchInfo
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
};