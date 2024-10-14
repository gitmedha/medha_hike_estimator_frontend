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
  // {
  //   to: "/institutions",
  //   title: "Institutions",
  //   aliases: ['institution'],
  //   icon: <FaSchool {...iconProps} />,
  //   show: isSRM() || isPartnership() || isAdmin() || isMedhavi(),
  // },
  // {
  //   to: "/batches",
  //   title: "Batches",
  //   aliases: ['batch'],
  //   icon: <FaChalkboardTeacher {...iconProps} />,
  //   show: isSRM() || isPartnership() || isAdmin() || isMedhavi(),
  // },
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
  // {
  //   to: "/opportunities",
  //   title: "Opportunities",
  //   aliases: ['opportunity'],
  //   icon: <FaBriefcase {...iconProps} />,
  //   show: isSRM() || isPartnership() || isAdmin() || isMedhavi(),
  // },
  // {
  //   to: "/operation",
  //   title: "Operations",
  //   aliases: ['operations'],
  //   icon: <FaUsersCog {...iconProps} />,
  //   show: isAdmin() || isSRM() || isMedhavi(),
  // },
  // {
  //   to:'/calender',
  //   title:"Calendar",
  //   aliases: ['calender'],
  //   icon:<FaCalendarDay {...iconProps}/>,
  //   show: isAdmin() || isMedhavi(),
  // },
  // {
  //   to: "/dashboard",
  //   title: "Dashboard",
  //   aliases:['dashborad'],
  //   icon: <MdDashboard {...iconProps} />,
  //   show: isSRM() || isPartnership() || isAdmin() || isMedhavi(),
  // },
  // {
  //   to: "https://data.medha.org.in/",
  //   title: "Metabase",
  //   aliases: ['metabase'],
  //   icon: <img
  //     className={"metabase-icon"}
  //     src={require('../../assets/images/logo-metabase.png').default}
  //     alt={`metabase-logo`}
  //     style={{}}
  //   />,
  //   newTab: true,
  //   show: isSRM() || isPartnership() || isAdmin() || isMedhavi(),
  // },
  // {
  //   to: "/admin",
  //   title: "Admin",
  //   icon: <FaUserCog {...iconProps} />
  // },
];

const Sidebar = ({ isOpen, toggleMenu }) => {
  const [activeFirstLevel, setActiveFirstLevel] = useState(() => {
    let activeRoute = routes.filter((route) => {
      if (route.children && route.children.length) {
        for (let i = 0; i < route.children.length; i++) {
          if (route.children[i].to === window.location.pathname) return true;
        }
      }
      return route.to === window.location.pathname;
    });
    return activeRoute.length ? activeRoute[0].title : "Dashboard"; // default to Dashboard
  });

  const menuItemClickHandler = (menuItemTitle) => {
    setActiveFirstLevel(menuItemTitle);
    // close the menu in the mobile
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
            <MenuItem {...route} key={route.title} isOpen={isOpen} activeFirstLevel={activeFirstLevel} setActiveFirstLevel={setActiveFirstLevel} menuItemClickHandler={menuItemClickHandler}  />
          ))}
        </>
      </div>
    </div>
  )};

export default Sidebar;