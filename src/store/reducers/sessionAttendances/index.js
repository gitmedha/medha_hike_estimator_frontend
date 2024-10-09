import {
  IS_LOADING,
  DELETE_SESSION,
  GET_SESSION_DETAILS,
  GET_SESSION_ATTENDANCES,
} from "./types";

const initialState = {
  session: null,
  loading: false,
  attendances: [],
};

const sessionAttendanceReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case IS_LOADING:
      return {
        ...state,
        loading: !state.loading,
      };
    case GET_SESSION_DETAILS:
      return {
        ...state,
        session: payload,
      };
    case GET_SESSION_ATTENDANCES:
      return {
        ...state,
        attendances: payload,
      };
    case DELETE_SESSION:
      return {
        ...initialState,
      };
    default:
      return {
        ...state,
      };
  }
};

export default sessionAttendanceReducer;
