import { Redirect, Route } from "react-router";

// screen if you're not yet authenticated.
export const PrivateRoute = ({ children, ...rest }) => {
  let token = localStorage.getItem('token');
  if (!token) {
    if (rest.location.pathname) {
      localStorage.setItem('next_url', rest.location.pathname);
    }
    return <Redirect to={{pathname: '/'}} />
  }
  return (
    <Route
      {...rest}
      render={() => children}
    />
  );
}
