import React from "react";
import App from "./App.jsx";
import ReactDOM from "react-dom";
import "./assets/scss/main.scss";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import store from "./store";
import { ToastProvider } from "react-toast-notifications";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastProvider placement="top-center">
        <Router>
          <App />
        </Router>
      </ToastProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
