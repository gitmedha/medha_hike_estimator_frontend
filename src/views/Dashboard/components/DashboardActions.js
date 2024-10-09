import api from "../../../apis";
import { GET_MY_DATA_CERTIFICATIONS, GET_MY_DATA_CERTIFICATIONS_GRAPH, GET_MY_DATA_INTERNSHIPS, GET_MY_DATA_INTERNSHIPS_GRAPH, GET_MY_DATA_PLACEMENTS, GET_MY_DATA_PLACEMENTS_GRAPH, GET_MY_DATA_REGISTRATIONS, GET_MY_DATA_REGISTRATIONS_GRAPH } from "../../../graphql";

export const getMyDataMetrics = async (user, type = 'registrations') => {
  let query = GET_MY_DATA_REGISTRATIONS;
  if (type === 'certifications') {
    query = GET_MY_DATA_CERTIFICATIONS;
  } else if (type === 'internships') {
    query = GET_MY_DATA_INTERNSHIPS;
  } else if (type === 'placements') {
    query = GET_MY_DATA_PLACEMENTS;
  }
  return await api.post('/graphql', {
    query,
    variables: {
      user,
    }
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}

export const getMyDataMetricsGraph = async (user, type = 'registrations') => {
  let query = GET_MY_DATA_REGISTRATIONS_GRAPH;

  if (type === 'certifications') {
    query = GET_MY_DATA_CERTIFICATIONS_GRAPH;
  } else if (type === 'internships') {
    query = GET_MY_DATA_INTERNSHIPS_GRAPH;
  } else if (type === 'placements') {
    query = GET_MY_DATA_PLACEMENTS_GRAPH;
  }

  return await api.post('/graphql', {
    query,
    variables: {
      user,
    }
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}
