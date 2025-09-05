import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  console.log("PrivateRoute user", user);
  console.log("PrivateRoute isAuthenticated", isAuthenticated);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};
