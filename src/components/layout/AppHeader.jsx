import styled from "styled-components";

import Userbox from "./Userbox";
import SearchBar from "./Search/SearchBar";

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
  justify-content: flex-end;
  border-bottom: 2px solid #f2f2f2;
  position: fixed;

  @media (max-width: 767px) {
    width: 100vw !important;
  }
`;

const Header = ({ isOpen, toggleMenu }) => {
  return (
    <AppHeader style={{width: isOpen ? 'calc(100vw - 275px)' : 'calc(100vw - 80px)'}}>
      {/* <SearchBar /> */}
      <Userbox />
    </AppHeader>
  );
};

export default Header;
