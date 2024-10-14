import React, { useState } from "react";
import styled from "styled-components";
import { Modal, Form, Button } from "react-bootstrap";
import api from "../apis";
import { useHistory } from "react-router-dom";

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
`;

const Login = () => {
 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);
  const [onSuccess,SetSuccess] = useState(false);
  const navigate = useHistory();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post('/api/users/login_user', {
        username,
        password,
      });
      
      if (response.status === 200) {
        SetSuccess(true);
        setTimeout(() =>navigate.push('/employees_details'),3000);        
        localStorage.setItem('user', JSON.stringify(response.data.data[0]));
        localStorage.setItem('token', response.data.token);
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <Styled>
      <div className="container-fluid">
        <div className="row justify-content-center align-items-center">
          <div>
            <Modal
              centered
              size="lg"
              show={show}
              animation={false}
              aria-labelledby="contained-modal-title-vcenter"
              className="form-modal"
            >
              <Modal.Header className="bg-white d-flex justify-content-center">
                <Modal.Title>
                  <h1 className="text--primary bebas-thick mb-0">Log in</h1>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-white">
                <Form onSubmit={handleLogin}>
                  <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  {error && <p style={{ color: "red" }}>{error}</p>}
                  {onSuccess && <p style={{color:'green'}}> Successfully Logged in!</p>}
                  <div className="row justify-content-center">
                    <Button className="btn-ms-login my-2 bebas-thick col-auto" type="submit">
                      Log in
                    </Button>
                  </div>
               
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default Login;
