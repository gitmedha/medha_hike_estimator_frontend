import thunk from "redux-thunk";
import logger from "redux-logger";
import rootReducer from "./reducers";
import "regenerator-runtime/runtime";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

const initState = {};

const middleware = [thunk, logger];

const store = createStore(
  rootReducer,
  initState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
