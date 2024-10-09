import React from "react";

const AuthContext = React.createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export default AuthContext;
