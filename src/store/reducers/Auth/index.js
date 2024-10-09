import { LOGIN_USER, LOGOUT_USER, AUTH_LOADING, GET_AUTH_USER } from "./types";

const INIT_STATE = {
  user: null,
  isAuth: false,
  authLoading: false,
  token: localStorage.getItem("token") || null,
};

const Auth = (state = INIT_STATE, { type, payload }) => {
  switch (type) {
    case AUTH_LOADING:
      return {
        ...state,
        authLoading: !state.authLoading,
      };
    case LOGIN_USER:
      return {
        ...state,
        isAuth: true,
        user: payload.user,
        token: payload.jwt,
      };
    case GET_AUTH_USER:
      return {
        ...state,
        isAuth: true,
        user: payload,
      };
    case LOGOUT_USER:
      return {
        user: null,
        token: null,
        isAuth: false,
        authLoading: false,
      };
    default:
      break;
  }
  return state;
};

export default Auth;
