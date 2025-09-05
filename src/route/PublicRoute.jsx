import { Redirect, Route } from "react-router";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export const PublicRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useContext(AuthContext);
  console.log("PublicRoute isAuthenticated", isAuthenticated);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Redirect to="/employees_details" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};
