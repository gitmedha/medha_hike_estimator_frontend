import React from 'react'
import styled from "styled-components";

const Styled = styled.div`
img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 60%;
}
h3{
    text-align: center;
    position: fixed;
    top: 270px;
    bottom: 150px;
    left: 0;
    right: 0;
}
.button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}
`;
const PageNotFound = () => {
    return (
        <Styled>
            <div id="wrapper">
                <div id="info">
                    <h3>The record/page you are looking for does not exist.
                     <br>
                     </br>
                     Click Here  to go <a href="javascript: history.go(-1)" className="btn btn-primary"> Back </a> or return to the <a href="/" className="btn btn-primary">Dashboard.</a>
                    </h3>
                </div>
            </div>
        </Styled>
    )
}

export default PageNotFound
