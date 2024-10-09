import api from "../../../apis";
import { 
  GET_ALL_STUDENTS, 
  CREATE_STUDENT, 
  CREATE_EMPLOYMENT_CONNECTION, 
  CREATE_PROGRAM_ENROLLMENT, 
  DELETE_EMPLOYMENT_CONNECTION, 
  DELETE_PROGRAM_ENROLLMENT, 
  DELETE_STUDENT, 
  GET_ALL_BATCHES, 
  GET_ALL_EMPLOYERS, 
  GET_ALL_INSTITUTES, 
  GET_EMPLOYER_OPPORTUNITIES, 
  GET_PICKLIST, GET_STUDENT, 
  GET_STUDENT_EMPLOYMENT_CONNECTIONS, 
  GET_STUDENT_PROGRAM_ENROLLMENTS, 
  UPDATE_EMPLOYMENT_CONNECTION, 
  UPDATE_PROGRAM_ENROLLMENT, 
  UPDATE_STUDENT, 
  GET_STUDENT_ALUMNI_SERVICES, 
  CREATE_ALUMNI_SERVICE, 
  UPDATE_ALUMNI_SERVICE, 
  DELETE_ALUMNI_SERVICE, 
  BULK_ALUMNI_SERVICES,
  SEARCH_INSTITUITIONS,
  SEARCH_BY_BATCHES,
  SEARCH_BY_EMPLOYERS,
  SEARCH_BY_STUDENTS,
  GET_COURSE,
  GET_STUDENT_ALUMNI_SERVICES_RANGE,
  GET_UNIQUE_STUDENT_ALUMNI,
  GET_UNIQUE_STUDENT_EMPLOYMENT
} from "../../../graphql";

export const getAlumniServicePickList = async () => {
return await api.post("/graphql", {
  query : GET_PICKLIST, 
  variables: {
    table: 'alumni_services'
  }
}).then(data => {
  let pickList = {};
  data?.data?.data?.picklistFieldConfigs.forEach((item) => {
    pickList[item.field] = item.values;
  });
  return pickList;
}).catch(error => {
  return Promise.reject(error);
});
}

export const getStudentsPickList = async () => {
  return await api.post("/graphql", {
    query: GET_PICKLIST,
    variables: {
      table: 'students'
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

export const getStudent = async (id) => {
  return await api.post("/graphql", {
    query: GET_STUDENT,
    variables: {
      id
    },
  })
  .then(data => {
    return data;
  })
  .catch(error => {
    return Promise.reject(error);
  });
};

export const createStudent = async (data) => {
  return await api.post('/graphql', {
    query: CREATE_STUDENT,
    variables: {data},
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
};

export const updateStudent = async (id, data) => {
  return await api.post('/graphql', {
    query: UPDATE_STUDENT,
    variables: {
      id,
      data
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const deleteStudent = async (id) => {
  return await api.post('/graphql', {
    query: DELETE_STUDENT,
    variables: {
      id
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getStudentProgramEnrollments = async (studentId, limit=100, offset=0, sortBy='created_at', sortOrder = 'desc') => {
  return await api.post('/graphql', {
    query: GET_STUDENT_PROGRAM_ENROLLMENTS,
    variables: {
      id: Number(studentId),
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

export const getAllInstitutions = async () => {
  return await api.post('/graphql', {
    query: GET_ALL_INSTITUTES,
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const createProgramEnrollment = async (data) => {
  return await api.post('/graphql', {
    query: CREATE_PROGRAM_ENROLLMENT,
    variables: {
      data
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const updateProgramEnrollment = async (id, data) => {
  return await api.post('/graphql', {
    query: UPDATE_PROGRAM_ENROLLMENT,
    variables: {
      id,
      data
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const deleteProgramEnrollment = async (id) => {
  return await api.post('/graphql', {
    query: DELETE_PROGRAM_ENROLLMENT,
    variables: {
      id
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getEmploymentConnectionsPickList = async () => {
  return await api.post("/graphql", {
    query: GET_PICKLIST,
    variables: {
      table: 'employment_connections'
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

export const getStudentEmploymentConnections = async (studentId,startDate,endDate, limit=10, offset=0, sortBy='created_at', sortOrder = 'desc') => {
  return await api.post('/graphql', {
    query: GET_STUDENT_EMPLOYMENT_CONNECTIONS,
    variables: {
      id: Number(studentId),
      limit: limit,
      start: offset,
      sort: `${sortBy}:${sortOrder}`,
      startDate:startDate,
      endDate:endDate
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const createEmploymentConnection = async (data) => {
  return await api.post('/graphql', {
    query: CREATE_EMPLOYMENT_CONNECTION,
    variables: {
      data
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const updateEmploymentConnection = async (id, data) => {
  return await api.post('/graphql', {
    query: UPDATE_EMPLOYMENT_CONNECTION,
    variables: {
      id,
      data
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const deleteEmploymentConnection = async (id) => {
  return await api.post('/graphql', {
    query: DELETE_EMPLOYMENT_CONNECTION,
    variables: {
      id
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getOpportunitiesPickList = async () => {
  return await api.post("/graphql", {
    query: GET_PICKLIST,
    variables: {
      table: 'opportunities'
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

export const getAllEmployers = async () => {
  return await api.post('/graphql', {
    query: GET_ALL_EMPLOYERS,
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getEmployerOpportunities = async (employerId) => {
  return await api.post('/graphql', {
    query: GET_EMPLOYER_OPPORTUNITIES,
    variables: {
      id: employerId
    }
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getAllStudents = async () => {
  return await api.post('/graphql', {
    query: GET_ALL_STUDENTS,
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getStudentAlumniServices = async (studentId,limit=100, offset=0, sortBy='created_at', sortOrder = 'desc') => {
  return await api.post('/graphql', {
    query: GET_STUDENT_ALUMNI_SERVICES_RANGE,
    variables: {
      id: Number(studentId),
      limit: limit,
      start: offset,
      sort: `${sortBy}:${sortOrder}`,
    },
  }).then(data => {
    return Promise.resolve(data);
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getStudentMassAlumniService = async (studentId, startDate,endDate,limit=100, offset=0, sortBy='created_at', sortOrder = 'desc') => {
  return await api.post('/graphql', {
    query: GET_STUDENT_ALUMNI_SERVICES_RANGE,
    variables: {
      id: Number(studentId),
      limit: limit,
      start: offset,
      sort: `${sortBy}:${sortOrder}`,
      startDate:startDate,
      endDate:endDate
    },
  }).then(data => {
    return Promise.resolve(data);
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getStudentAlumniRange = async (startDate, endDate, limit = 500, sortBy = 'created_at', sortOrder = 'desc') => {
  let allData = [];
  let offset = 0;
  let hasMoreData = true;

  while (hasMoreData) {
    const result = await api.post('/graphql', {
      query: GET_UNIQUE_STUDENT_ALUMNI,
      variables: {
        limit: limit,
        start: offset,
        sort: `${sortBy}:${sortOrder}`,
        startDate: startDate,
        endDate: endDate
      },
    }).then(data => data)
    .catch(error => {
      return Promise.reject(error);
    });

    const fetchedData = result.data.data.alumniServicesConnection.values;
    allData = allData.concat(fetchedData);

    // Check if the fetched data is less than the limit
    if (fetchedData.length < limit) {
      hasMoreData = false;
    } else {
      offset += limit;
    }
  }
  return allData;
};


export const getStudentEmplymentRange = async (startDate, limit = 500, sortBy = 'created_at', sortOrder = 'desc') => {
  let allData = [];
  let offset = 0;
  let hasMoreData = true;
  while (hasMoreData) {
    const result = await api.post('/graphql', {
      query: GET_UNIQUE_STUDENT_EMPLOYMENT,
      variables: {
        limit: limit,
        start: offset,
        sort: `${sortBy}:${sortOrder}`,
        startDate: startDate,
        // endDate: endDate
      },
    }).then(data => data)
    .catch(error => {
      return Promise.reject(error);
    });
    const fetchedData = result.data.data.employmentConnectionsConnection.values;
    
    allData = allData.concat(fetchedData);

    // Check if the fetched data is less than the limit
    if (fetchedData.length < limit) {
      hasMoreData = false;
    } else {
      offset += limit;
    }
  }

  return allData;
};
// 

export const createAlumniService = async (data) => {
  return await api.post('/graphql', {
    query: CREATE_ALUMNI_SERVICE,
    variables: {
      data
    },
  }).then(data => {
    return Promise.resolve(data);
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const createBulkAlumniService = async (data) => {
  return await api.post('/graphql', {
    query: BULK_ALUMNI_SERVICES,
    variables: {
      data
    },
  }).then(data => {
    return Promise.resolve(data);
  }).catch(error => {
    return Promise.reject(error);
  });
}



export const updateAlumniService = async (id, data) => {
  return await api.post('/graphql', {
    query: UPDATE_ALUMNI_SERVICE,
    variables: {
      id,
      data
    },
  }).then(data => {
    return Promise.resolve(data);
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const deleteAlumniService = async (id) => {
  return await api.post('/graphql', {
    query: DELETE_ALUMNI_SERVICE,
    variables: {
      id
    },
  }).then(data => {
    return Promise.resolve(data);
  }).catch(error => {
    return Promise.reject(error);
  });
}


export const getUpskillingPicklist = async () => {
  return await api.post("/graphql", {
    query: GET_PICKLIST,
    variables: {
      table: 'Students_upskillings'
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


export const searchInstitution = async function(searchValue){
  try {
    const {data} =  await api.post('/graphql', {
      query:SEARCH_INSTITUITIONS,
      variables:{
        limit:20,
        query:searchValue,
        sort:'name:asc'
      }
    })

    return data
    
  } catch (error) {
    console.error("error:",error);
  }
}

export const searchBatch = async function(searchValue){
  try {
    const {data} = await api.post('/graphql', {
      query:SEARCH_BY_BATCHES,
      variables:{
        limit:20,
        query:searchValue,
        sort:'name:asc'
      }
    })

    return data;
    
  } catch (error) {
    console.error(error.message);
  }
}

export const searchEmployers = async function(searchValue){
  try {
    const {data} = await api.post('/graphql', {
      query:SEARCH_BY_EMPLOYERS,
      variables:{
        limit:20,
        query:searchValue,
        sort:'name:asc'
      }
    })

    return data;
    
  } catch (error) {
    console.error(error.message);
  }
}


export const searchStudents = async function(searchValue){
  try {
    const {data} = await api.post('/graphql', {
      query:SEARCH_BY_STUDENTS,
      variables:{
        limit:20,
        query:searchValue,
        sort:'full_name:asc'
      }
    })

    return data;
    
  } catch (error) {
    console.error(error.message);
  }
}

export const getAllCourse = async () => {
  return await api.post('/graphql', {
    query: GET_COURSE,
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}