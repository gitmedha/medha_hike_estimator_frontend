import api from "../../../apis";
import { 
  GET_ALL_INSTITUTES, 
  GET_INSTITUTION_PROGRAM_ENROLLMENTS, 
  GET_PICKLIST, 
  GET_ASSIGNEES_LIST, 
  GET_INSTITUTION_STUDENTS, 
  UPDATE_INSTITUTION, 
  CREATE_NEW_INSTITUTE, 
  DELETE_INSTITUTION,
  SEARCH_BY_STUDENTS,
  SEARCH_BY_BATCHES 
} from "../../../graphql";

export const queryBuilder = async (params) => {
  try {
    let { data } = await api.post("/graphql", {
      ...params,
    });
    return data;
  } catch (err) {
    throw err;
  }
};

export const getInstitutionsPickList = async () => {
  return await api.post("/graphql", {
    query: GET_PICKLIST,
    variables: {
      table: 'institutions'
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

export const getAssigneeOptions = async () => {
  return await api.post('/graphql', {
    query: GET_ASSIGNEES_LIST,
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
};

export const createInstitution = async (data) => {
  return await api.post('/graphql', {
    query: CREATE_NEW_INSTITUTE,
    variables: { data },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const updateInstitution = async (id, data) => {
  return await api.post('/graphql', {
    query: UPDATE_INSTITUTION,
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

export const deleteInstitution = async (id) => {
  return await api.post('/graphql', {
    query: DELETE_INSTITUTION,
    variables: {
      id
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getInstitutionStudents = async (institutionId, limit = 10, offset = 0, sortBy = 'created_at', sortOrder = 'desc') => {
  return await api.post('/graphql', {
    query: GET_INSTITUTION_STUDENTS,
    variables: {
      id: Number(institutionId),
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

export const getProgramEnrollmentsPickList = async () => {
  return await api.post("/graphql", {
    query: GET_PICKLIST,
    variables: {
      table: 'program_enrollments'
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
}

export const getInstitutionProgramEnrollments = async (instituteID, limit = 100, offset = 0, sortBy = 'created_at', sortOrder = 'desc') => {
  return await api.post('/graphql', {
    query: GET_INSTITUTION_PROGRAM_ENROLLMENTS,
    variables: {
      id: Number(instituteID),
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

export const getAllInstitutions = async () => {
  return await api.post('/graphql', {
    query: GET_ALL_INSTITUTES,
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}
  ;


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

  export const searchStudents = async function(searchValue){
    try {
      const {data}= await api.post('/graphql', {
        query:SEARCH_BY_STUDENTS,
        variables:{
          query:searchValue,
          limit:20,
          sort:'full_name:asc'
        }
      })

      return data;
    } catch (error) {
      console.error(error.message);
    }

  }

  export const searchBatch = async function(searchValue){
    try {
      const {data}= await api.post('/graphql', {
        query:SEARCH_BY_BATCHES,
        variables:{
          query:searchValue,
          limit:20,
          sort:'name:asc'
        }
      })

      return data;
    } catch (error) {
      console.error(error.message);
    }

  }

