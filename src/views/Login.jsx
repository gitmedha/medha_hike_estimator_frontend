import React, { useState } from "react";
import styled from "styled-components";
import { Modal, Form, Button } from "react-bootstrap";
import api from "../apis";
import { useHistory } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';



const Styled = styled.div`
  .btn-ms-login {
    border: 3px solid #32b89d;
    box-sizing: border-box;
    border-radius: 40px;
    font-size: 15px;
    padding: 8px 30px;
    color: black;
    font-family: "Lato";
    text-decoration: none;
    margin: 31px 19px 19px 6px;
  }

  .custom-login-modal {
    max-width: 100px !important;
    padding: 20px;
  }
`;

const Login = () => {
 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);
  const [onSuccess,SetSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useHistory();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      if(username !== "admin" && password !== "password"){
        toast.error("Invalid username or password")
        setShowPassword(true);
        return;
      }
      else {

        const response = await api.post('/api/users/login_user', {
          username,
          password,
        });
        toast.success("Successfully logged in ! Redirecting ...")
        setTimeout(() =>navigate.push('/employees_details'),3000);        
        localStorage.setItem('user', JSON.stringify(response.data.data[0]));
        localStorage.setItem('token', response.data.token);
      }
      
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Styled>
          <div className="login-container">
            <div className="form-cotainer">
            <Form onSubmit={handleLogin} className="login_form">
              <h3 className="text-center text-success">Login</h3>
                  <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <div style={{position:"relative"}}>
                    <Form.Control
                      type={showPassword ? "text":"password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                      <Button
                        variant="link"
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "10px",
                          transform: "translateY(-50%)",
                          fontSize: "12px",
                          textDecoration: "none",
                        }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>

                    </div>
                  </Form.Group>
                  <div className="d-flex justify-content-center">
                    <Button variant="primary" type="submit" className="mt-3">
                      Login
                    </Button>
                  </div>
                </Form>
            </div>
          </div>
          <Toaster/>
    </Styled>
  );
};

export default Login;
