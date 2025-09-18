import { Redirect, Route } from "react-router";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export const PublicRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const lastPath = localStorage.getItem("lastPath") || "/employees_details";

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Redirect to={lastPath} /> : <Component {...props} />
      }
    />
  );
};

