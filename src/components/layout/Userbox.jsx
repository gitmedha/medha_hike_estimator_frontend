import { useContext } from "react";
import { Dropdown } from "react-bootstrap";
import AuthContext from "../../context/AuthContext";
import { FaUserAlt} from "react-icons/fa";

const Userbox = () => {
  const {user, logout} = useContext(AuthContext);
const userData = JSON.parse(localStorage.getItem("user"));

  return (
    <Dropdown className="user-box">
      <Dropdown.Toggle id="dropdown-basic" variant="white">
       <FaUserAlt size={25} style={{ color: '#787B96'}}/>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item disabled>
          <div className="text-detail-title">Welcome {userData?.name} !</div>
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={() => logout()}>
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Userbox;
