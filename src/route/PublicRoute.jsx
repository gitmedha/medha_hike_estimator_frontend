import { Redirect, Route } from "react-router";

// screen if you're not yet authenticated.
export const PublicRoute = ({ children, ...rest }) => {
  let token = localStorage.getItem('token');
  if (token) {
    return <Redirect to={{pathname: '/employees_details'}} />
  }
  return (
    <Route
      {...rest}
      render={() => children}
    />
  );
}
