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
  const { icon, to, title, isOpen, newTab = false, aliases = [], isActive } = props;
  const [subMenuCollapsed, setSubMenuCollapsed] = useState(!isActive);
  const showSubMenuIcon = isOpen && props.children?.length;

  const isActiveRoute = () => {
    if (location.pathname === to) return true;
    if (aliases.some(alias => location.pathname.includes(alias))) return true;
    return false;
  };

  return (
    <MenuEl isOpen={isOpen} className="w-100 d-flex flex-column align-items-center">
      <NavLink
        to={{ pathname: to }}
        className={`menu-item-link d-flex align-items-center ${isOpen ? 'w-100 justify-content-between' : 'justify-content-center'} ${isActive ? 'sidebar-link-active' : ''}`}
        style={{
          paddingLeft: isOpen ? '30px' : '',
          paddingRight: isOpen ? '30px' : '',
          borderRight: isActive ? '4px solid #257b69' : '4px solid transparent'
        }}
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
              style={{
                paddingLeft: isOpen ? '40px' : '',
                borderRight: location.pathname === child.to ? '4px solid #257b69' : '4px solid transparent'
              }}
              activeClassName="sidebar-link-active"
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