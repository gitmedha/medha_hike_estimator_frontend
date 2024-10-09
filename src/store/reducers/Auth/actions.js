import api, { setToken } from "../../../apis";
import { LOGIN_USER, LOGOUT_USER, AUTH_LOADING, GET_AUTH_USER } from "./types";

export const initApp = () => async (dispatch) => {
  try {
    dispatch(setAuthLoading());
    let token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      dispatch(getAuthUser());
    }
  } catch (err) {
   
  } finally {
    dispatch(setAuthLoading());
  }
};

export const authenticateUser = (userDets) => async (dispatch) => {
 
  localStorage.setItem("token", userDets.jwt);
  dispatch({
    type: LOGIN_USER,
    payload: userDets,
  });
};

export const getAuthUser = () => async (dispatch) => {
  try {
    
    let { data } = await api.get("/users/me");
    dispatch({
      payload: data,
      type: GET_AUTH_USER,
    });
  } catch (err) {
    dispatch(logoutUser());
  }
};

export const registerUser = () => async (dispatch) => {};

export const setAuthLoading = () => {
  return {
    type: AUTH_LOADING,
  };
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("token");
  setToken();
  dispatch({
    type: LOGOUT_USER,
  });
};
