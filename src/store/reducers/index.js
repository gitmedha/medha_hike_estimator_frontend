import Auth from "./Auth";
import notification from "./Notifications";
import sessionAttendance from "./sessionAttendances";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth: Auth,
  notification,
  sessionAttendance,
});

export default rootReducer;
