import Auth from "./Auth";
import notification from "./Notifications";
import sessionAttendance from "./sessionAttendances";
import Operations from "./Operations";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth: Auth,
  notification,
  sessionAttendance,
  Operations
});

export default rootReducer;
