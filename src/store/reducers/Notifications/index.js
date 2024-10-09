import { SET_ALERT, RESET_ALERT } from "./types";

const initialState = {
  message: null,
  variant: null,
};

const NotificationReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_ALERT:
      return {
        ...state,
        ...payload,
      };
    case RESET_ALERT: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
};

export default NotificationReducer;
