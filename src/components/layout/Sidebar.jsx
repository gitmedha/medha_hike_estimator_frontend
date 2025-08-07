import React, { useState } from 'react';
import { MdDashboard } from "react-icons/md";
import { FaUserGraduate, FaChalkboardTeacher, FaUserTie, FaSchool, FaBriefcase, FaUsersCog ,FaCalendarDay} from "react-icons/fa";
import MenuItem from "./MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { motion, AnimatePresence } from "framer-motion";
import { isAdmin, isMedhavi, isPartnership, isSRM } from '../../common/commonFunctions';

const iconStyle = {
  marginRight: "5px",
};

const iconProps = {
  size: 24,
  style: { iconStyle },
};

const routes = [
  {
    to: "/employees_details",
    title: "Employees Details",
    aliases: ['student'],
    icon:  (
      <img
        className="employees_details_icon"
        src={require('../../assets/images/employee-data.png').default}
        alt="employee details"
        style={{ width: '24px', height: '24px', objectFit: 'contain' }}
      />
    ),
    show: true,
  },
  {
    to: "/historical_data",
    title: "Historical Data",
    aliases: ['employer'],
    icon:  (
      <img
        className="historical_details_icon"
        src={require('../../assets/images/historic-data.png').default}
        alt="historic-logo"
        style={{ width: '24px', height: '24px', objectFit: 'contain' }}
      />
    ),
    show: true,
  },
  {
    to: "/employee_increments",
    title: "Employees Increment",
    aliases: ['increment'],
    icon:  (
      <img
        className="employees_increment_icon"
        src={require('../../assets/images/raise.png').default}
        alt="employee increment"
        style={{ width: '24px', height: '24px', objectFit: 'contain' }}
      />
    ),
    show: true,
  },
  {
    to:"/employee_bonuses",
    title:"Employees Bonus",
    aliases: ['bonus'],
    icon:  (
      <img
        className="employees_increment_icon"
        src={require('../../assets/images/bonus.png').default}
        alt="employee bonus"
        style={{ width: '24px', height: '24px', objectFit: 'contain' }}
      />
    ),
    show: true,
  }
];

const Sidebar = ({ isOpen, toggleMenu }) => {
  const [activeFirstLevel, setActiveFirstLevel] = useState(() => {
    const currentPath = window.location.pathname;
    const activeRoute = routes.find((route) => {
      if (route.to === currentPath) return true;
      if (route.aliases && route.aliases.some(alias => currentPath.includes(alias))) return true;
      return false;
    });
    return activeRoute ? activeRoute.title : "";
  });

  const menuItemClickHandler = (menuItemTitle) => {
    setActiveFirstLevel(menuItemTitle);
    if (window.innerWidth < 768) {
      toggleMenu();
    }
  };

  return (
    <div className={`d-flex flex-column position-relative sidebar-container ${isOpen ? 'open' : ''}`}>
      {/* hamburger */}
      <div className={`d-flex align-items-center justify-content-center mt-3 z-10 ${isOpen ? 'position-absolute right-10' : 'position-absolute left-10 top-0 position-md-relative left-md-0'}`}>
        <AnimatePresence>
          {!isOpen ? (
            <motion.div
              exit={{ rotate: -90 }}
              animate={{ rotate: 0 }}
              initial={{ rotate: -90 }}
              transition={{ duration: 0.3 }}
            >
              <MenuIcon className="c-pointer" style={{ color: "#207B69" }} onClick={toggleMenu} />
            </motion.div>
          ) : (
            <motion.div
              exit={{ opacity: -90 }}
              animate={{ rotate: 0 }}
              initial={{ rotate: -90 }}
              transition={{ duration: 1 }}
            >
              <ArrowBackIcon className="c-pointer" onClick={toggleMenu} style={{ color: "#207B69" }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className={`sidebar ${isOpen ? "" : "d-none d-md-block"}`} isOpen={isOpen}>
        <img
          src={require('../../assets/images/Medha-logo.svg').default}
          alt="Medha SIS"
          className={`mx-auto d-block ${isOpen ? '' : 'mt-3'}`}
          style={{width: isOpen ? '120px' : '60px', marginBottom: '30px'}}
        />
        <>
          {routes.filter(route => route.show).map((route) => (
            <MenuItem 
              {...route} 
              key={route.title} 
              isOpen={isOpen} 
              isActive={activeFirstLevel === route.title}
              menuItemClickHandler={menuItemClickHandler}  
            />
          ))}
        </>
      </div>
    </div>
  )};

export default Sidebar;