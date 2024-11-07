import { connect } from "react-redux";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { Switch, Route, useHistory, Redirect } from "react-router-dom";
import ReactTooltip from 'react-tooltip';

// Layout Components
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/AppHeader";
import LayoutContainer from "./components/layout/Container";
import AppContainer from "./components/layout/AppContainer";

// Route Components
import Login from "./views/Login";
import Students from "./views/Students/Employees";
import Historics from "./views/Historics/Historics";
import Employee from "./views/Students/Employee";
import HistoricData from "./views/Historics/HistoricData";

import AuthContext from "./context/AuthContext";
import { PrivateRoute } from "./route/PrivateRoute";
import axios from "axios";
import { apiPath} from "./constants";
import { PublicRoute } from "./route/PublicRoute";
import PageNotFound from "./views/404Page";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

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

  const logout = (callback = () => {}) => {
    setUser(null);
    localStorage.removeItem('token');
    history.push("/")
    callback();
  }

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

  const getUserDetails = () => {
    if (token) {
      // authenticate the token on the server and place set user object
      axios.get(apiPath('/users/me'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        // if res comes back not valid, token is not valid
        // delete the token and log the user out on client
        if (res.status !== 200) {
          localStorage.removeItem('token');
          setUser(null);
          return null;
        }
        setUser(res.data);
        localStorage.setItem("user_id", res.data.id);
        localStorage.setItem("user_name", res.data.username);
        localStorage.setItem("user_email", res.data.email);
        localStorage.setItem("user_role", res.data?.role.name);
        localStorage.setItem("user_state", res.data.state);
        localStorage.setItem("user_area", res.data.area);
      });
    }
  }

  useEffect(() => {

  }, []);


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
                  <PrivateRoute path="/employees_details" exact component={() => <Students isSidebarOpen={isOpen} />} />
                  <PrivateRoute path="/historical_data" exact component={Historics} />
                  <PrivateRoute path="/employee/:id" component={Employee}/>
                  <PrivateRoute path="/historic/:id" component={HistoricData}/>
                  <Route path='/404-page' component={PageNotFound} />
                  <Redirect to='/404-page' />
                </Switch>
              </RouteContainer>
            </LayoutContainer>
            <ReactTooltip />
          </AppContainer>
        </Route>
      </Switch>
    </AuthContext.Provider>
  );
};

const mapStateToProps = (state) => ({
  alert: state.notification,
});

export default connect(mapStateToProps, {})(App);
