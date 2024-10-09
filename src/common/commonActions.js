import api from "../apis";
import { DELETE_FILE } from "../graphql";

export const deleteFile = async (id) => {
  return await api.post('/graphql', {
    query: DELETE_FILE,
    variables: {
      id
    },
  }).then(data => {
    return data;
  }).catch(error => {
    return Promise.reject(error);
  });
}
