import api from "../../../src/apis";
import { UPDATE_PROGRAM_ENROLLMENT, DELETE_PROGRAM_ENROLLMENT, CREATE_PROGRAM_ENROLLMENT }  from "../../graphql/programEnrollments";

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
};

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
  