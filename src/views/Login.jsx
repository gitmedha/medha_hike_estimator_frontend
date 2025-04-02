import React, { useState } from "react";
import styled from "styled-components";
import { Form, Button } from "react-bootstrap";
import api from "../apis";
import { useHistory } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import bg from "../assets/images/bg-login-ui.png";
import logo from "../assets/images/Medha-logo.svg";

const Styled = styled.div`

  .btn-show-password {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    font-size: 12px;
    text-decoration: none;
  }
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useHistory();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      
      const response = await api.post("/api/users/login_user", {
        username,
        password,
      });
      toast.success("Successfully logged in! Redirecting...",{ position: "bottom-right" ,style: {marginRight:80}});
      setTimeout(() => navigate.push("/employees_details"), 3000);
      localStorage.setItem("user", JSON.stringify(response.data.data[0]));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("admin", response.data.isAdmin);
    } catch (err) {
      if(err.response.status === 401){
        setError("Incorrect password");
        setShowPassword(true);
        setTimeout(() =>setError(""),4000);
      }
      else if(err.response.status === 500){
        toast.error("Internal Server Error! Try again later.",{ position: "bottom-right" , style: {marginRight:80}});
      }
      else if(err.response.status === 404){
        setError("User not found, check your username or sign up!");
        setShowPassword(true);
        setTimeout(() =>setError(""),4000);
      }
      
      console.error(err);
    }
  };

  return (
    <Styled>
       <div className="row">
          <div className="col-8">
            <img src={bg} alt="Team"  className="w-100 login_image"/>
          </div>
          <div className="col d-flex flex-column justify-content-center p-5">
            <Form onSubmit={handleLogin}>
              <img src={logo} alt="Medha Logo"  className="w-100 login_logo"/>
              <div className="text-center text-success login_form_header">
                 Performence &nbsp; <br/> &nbsp; &nbsp; &nbsp; &nbsp; Review App
                </div>

              <Form.Group controlId="username" className="mt-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="password" className="mt-3">
                <Form.Label>Password</Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    variant="link"
                    className="btn-show-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </div>
              </Form.Group>
              {error && <div className="text-danger">{error}</div>}
              <div className="d-flex justify-content-center">
                <Button variant="primary" type="submit" className="mt-4">
                  Login
                </Button>
              </div>
            </Form>
          </div>
        </div>
      <Toaster />
    </Styled>
  );
};

export default Login;
