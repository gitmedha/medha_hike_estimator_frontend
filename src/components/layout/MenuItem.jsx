import styled from "styled-components";
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from 'react';
import {BsChevronDown, BsChevronRight} from 'react-icons/bs';
import { useLocation } from 'react-router-dom';

const MenuEl = styled.div`
  overflow: hidden;
  justify-content: ${(props) => (props.isOpen ? `start` : "center")};
`;

const MenuItem = (props) => {
  const location = useLocation();

  const { icon, to, title, isOpen, newTab = false, aliases=[] } = props;
  const [isActiveFirstLevel, setIsActiveFirstLevel] = useState(location.pathname === to || props.activeFirstLevel === props.title);
  const [subMenuCollapsed, setSubMenuCollapsed] = useState(!isActiveFirstLevel);
  const showSubMenuIcon = isOpen && props.children?.length;

  useEffect(() => {
    if (location.pathname === to) {
      setIsActiveFirstLevel(true);
    } else if (aliases.length) {
      let aliasMatched = false;
      aliases.forEach(alias => {
        if (location.pathname.includes(alias)) {
          aliasMatched = true;
        }
      });
      setIsActiveFirstLevel(aliasMatched);
    } else {
      setIsActiveFirstLevel(false);
    }
  }, [location, to, aliases]);

  return (
    <MenuEl isOpen={isOpen} className="w-100 d-flex flex-column align-items-center">
      <NavLink
        to={{ pathname: to }}
        className={`menu-item-link d-flex align-items-center ${isOpen ? 'w-100 justify-content-between' : 'justify-content-center'}`}
        style={{paddingLeft: isOpen ? '30px' : '', paddingRight: isOpen ? '30px' : ''}}
        isActive={() => isActiveFirstLevel}
        activeClassName="sidebar-link-active"
        activeStyle={{borderRightColor: isOpen ? '#257b69' : 'transparent'}}
        onClick={() => props.menuItemClickHandler(props.title)}
        target={newTab ? "_blank" : ""}
      >
        <div className="d-flex align-items-center w-100 justify-content-start">
          <div data-tip={isOpen ? '' : props.title}>
            {icon}
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0 }}
                style={{ marginLeft: "10px" }}
              >
                <span>{title}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {showSubMenuIcon && subMenuCollapsed && <BsChevronRight onClick={() => setSubMenuCollapsed(!subMenuCollapsed)} className="c-pointer" />}
        {showSubMenuIcon && !subMenuCollapsed && <BsChevronDown onClick={() => setSubMenuCollapsed(!subMenuCollapsed)} className="c-pointer" />}
      </NavLink>
      <div className={`sub-menu d-flex flex-column align-items-start w-100 ${subMenuCollapsed ? 'd-none' : ''}`}>
        {props.children && props.children.map((child, index) => (
          isOpen && (
            <NavLink
              key={index}
              to={child.to}
              className="menu-item-link d-flex align-items-center w-100"
              style={{paddingLeft: isOpen ? '40px' : ''}}
              isActive={(match, location) =>{
                if (!match) return false;
                return location.hash.substr(1) === child.to.split('#')[1] || location.pathname === child.to;
              }}
              activeClassName="sidebar-link-active"
              activeStyle={{borderRightColor: isOpen ? '#257b69' : 'transparent'}}
              onClick={() => props.menuItemClickHandler(props.title)}
            >
              <div className={`d-flex align-items-center w-100 justify-content-start`}>
                {isOpen && child.icon}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      exit={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      initial={{ opacity: 0 }}
                      transition={{ duration: 0 }}
                      style={{ marginLeft: "15px" }}
                    >
                      <span>{child.title}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </NavLink>
          )
        ))}
      </div>
    </MenuEl>
  );
};

export default MenuItem;
