import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { useState,useEffect } from "react";

import Userbox from "./Userbox";
const AppHeader = styled.div`
  z-index: 3;
  width: 100%;
  display: flex;
  position: sticky;
  padding-left: 30px;
  padding-right: 15px;
  align-items: center;
  background-color: white;
  height: 70px !important;
  justify-content: space-between;
  border-bottom: 2px solid #f2f2f2;
  position: fixed;
  @media (max-width: 767px) {
    width: 100vw !important;
  }
`;

const Header = ({ isOpen, toggleMenu }) => {
  const [title,setTitle] = useState("");
  const { pathname } = useLocation();

  useEffect(() => {
    switch (pathname) {
      case "/employees_details":
        setTitle("Employees Details");
        break;
      case "/historical_data":
        setTitle("Historical Data");
        break;
      case "/employee_increments":
        setTitle("Employees Increment");
        break;
      case "/employee_bonuses":
        setTitle("Employees Bonus");
        break;
      default:
        setTitle("");
    }
  }, [pathname]);
  return (
    <AppHeader style={{width: isOpen ? 'calc(100vw - 275px)' : 'calc(100vw - 80px)'}}>
      <h1 className="bebas-thick text--primary mr-3">{title}</h1><Userbox />
    </AppHeader>
  );
};

export default Header;
