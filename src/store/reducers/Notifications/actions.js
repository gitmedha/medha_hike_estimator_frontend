import { SET_ALERT, RESET_ALERT } from "./types";

export const setAlert = (message, variant) => (dispatch) => {
  dispatch({
    type: SET_ALERT,
    payload: { message, variant },
  });
  setTimeout(() => {
    dispatch(resetAlert());
  }, 5000);
};

export const resetAlert = () => ({
  type: RESET_ALERT,
});
