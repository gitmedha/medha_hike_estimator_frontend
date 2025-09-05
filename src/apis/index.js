import axios from "axios";
import { baseURL } from "../constants";

const api = axios.create({
  baseURL,
  withCredentials: true
});


export const setToken = (token) => {
  if (!token) {
    delete api.defaults.headers["Authorization"];
    return;
  }
  api.defaults.headers["Authorization"] = `Bearer ${token}`;
  return;
};

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

export default api;
