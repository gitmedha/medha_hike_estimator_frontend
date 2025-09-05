import { connect } from "react-redux";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { Switch, Route, useHistory, Redirect } from "react-router-dom";
import ReactTooltip from 'react-tooltip';
import { Toaster } from 'react-hot-toast';


// Layout Components
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/AppHeader";
import LayoutContainer from "./components/layout/Container";
import AppContainer from "./components/layout/AppContainer";

// Route Components
import Login from "./views/Login";
import Employees from "./views/Employees/Employees";
import Historics from "./views/Historics/Historics";
import Employee from "./views/Employees/Employee";
import HistoricData from "./views/Historics/HistoricData";
import EmployeeIncrements from "./views/Increments/EmployeeIncrements";
import IncrementEmployee from "./views/Increments/IncrementsComponents/Employee";
import Bonuses from "./views/Bonus/Bonuses";
import Bonus from "./views/Bonus/BonusComponents/Bonus";

import AuthContext from "./context/AuthContext";
import { PrivateRoute } from "./route/PrivateRoute";
import axios from "axios";
import { apiPath} from "./constants";
import { PublicRoute } from "./route/PublicRoute";
import PageNotFound from "./views/404Page";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import api from "./apis"

const RouteContainer = styled.div`
  flex: 1;
  z-index: 2;
  overflow: auto;
  margin-top: 70px;
`;

const App = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { addToast, removeAllToasts } = useToasts();
  const toggleMenu = () => setIsOpen(!isOpen);
  const history = useHistory();
  const token = localStorage.getItem("token");

const logout = async (callback = () => {}) => {
  try {
    await api.post("/api/users/logout", {}, { withCredentials: true });

    // Clear context state
    setUser(null);

    // Redirect
    history.push("/");

    callback();
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

  //add Sentry Plugin for error handling
  if (process.env.NODE_ENV === "production") {
    Sentry.init({
      dsn: "https://86b276c15e5842c48353b938934f69f3@o1107979.ingest.sentry.io/6136338",
      integrations: [new Integrations.BrowserTracing()],

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    });
  }

  useEffect(() => {
    if (props.alert.message && props.alert.variant) {
      addToast(props.alert.message, { appearance: props.alert.variant });
    } else {
      removeAllToasts();
    }
  }, [props.alert]);



useEffect(() => {
  api.get('/api/users/me', { withCredentials: true })
    .then(res => {
      setUser(res.data);
    })
    .catch(() => {
      setUser(null);
    });
}, []);

console.log("user",user)

  return (
    <AuthContext.Provider
      value={{
        user: user,
        setUser: setUser,
        isAuthenticated: !!user,
        logout: logout,
      }}
    >
      <Switch>
        <PublicRoute path="/" exact component={Login} />
        <Route>
          <AppContainer>
            <Sidebar isOpen={isOpen} toggleMenu={toggleMenu} />
            <LayoutContainer>
              <Header isOpen={isOpen} />
              <RouteContainer id="main-content">
                <Switch>
                  <PrivateRoute path="/employees_details" exact component={() => <Employees isSidebarOpen={isOpen} />} />
                  <PrivateRoute path="/historical_data" exact component={Historics} />
                  <PrivateRoute path="/employee_details/:id" component={Employee}/>
                  <PrivateRoute path="/employee_increments" component={EmployeeIncrements}/>
                  <PrivateRoute path="/increment_employee/:id" component={IncrementEmployee}/>
                  <PrivateRoute path="/employee/:id" component={Employee}/>
                  <PrivateRoute path="/historic/:id" component={HistoricData}/>
                  <PrivateRoute path="/employee_bonuses" component={Bonuses}/>
                  <PrivateRoute path="/bonus/:id" component={Bonus}/>
                  <Route path='/404-page' component={PageNotFound} />
                  <Redirect to='/404-page' />
                </Switch>
              </RouteContainer>
            </LayoutContainer>
            <ReactTooltip />
          </AppContainer>
        </Route>
      </Switch>
      <Toaster/>
    </AuthContext.Provider>
  );
};

const mapStateToProps = (state) => ({
  alert: state.notification,
});

export default connect(mapStateToProps, {})(App);
