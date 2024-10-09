import axios from "axios";
import { baseURL } from "../constants";

const api = axios.create({
  baseURL,
});


// Add a request interceptor
// api.interceptors.request.use(function (config) {
//   // Add authorization header token before request is sent
//   let token = localStorage.getItem('token');
//   if (token) {
//     config.headers['Authorization'] = `Bearer ${token}`;
//   }
//   return config;
// }, function (error) {
//   // Do something with request error
//   return Promise.reject(error);
// });

// // Add a response interceptor
// api.interceptors.response.use(function (response) {
//   // Do something after response is received
//   if (response.data.errors) {
//     let errors = response.data.errors;
//     errors.map(error => {
//       if (error.message === "Invalid token.") {
//         // clear token and push to login
//         localStorage.removeItem('token');
//         // setAlert
//         window.location.href = '/';
//       }
//     })
//   }
//   return response;
// }, function (error) {
//   // Do something with request error
//   return Promise.reject(error);
// });

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
