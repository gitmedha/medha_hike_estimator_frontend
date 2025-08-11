import styled from "styled-components";
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from 'react';
import { BsChevronDown, BsChevronRight } from 'react-icons/bs';

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

  const active = isActiveRoute();

  return (
    <MenuEl isOpen={isOpen} className="w-100 d-flex flex-column align-items-center">
      <NavLink
        to={{ pathname: to }}
        className={`menu-item-link d-flex align-items-center ${isOpen ? 'w-100 justify-content-between' : 'justify-content-center'} ${active ? 'sidebar-link-active' : ''}`}
        style={{
          paddingLeft: isOpen ? '30px' : '',
          paddingRight: isOpen ? '30px' : '',
          borderRight: '4px solid transparent' // Removed highlight border
        }}
        onClick={() => props.menuItemClickHandler(props.title)}
        target={newTab ? "_blank" : ""}
      >
        <div className="d-flex align-items-center w-100 justify-content-start">
          <motion.div
            animate={{ color: active ? '#257b69' : '#888' }}
            transition={{ duration: 0.2 }}
            data-tip={isOpen ? '' : props.title}
          >
            {React.isValidElement(icon)
              ? React.cloneElement(icon, { color: active ? '#257b69' : '#888' })
              : icon}
          </motion.div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0 }}
                style={{ marginLeft: "10px", color: active ? '#257b69' : '#000' }}
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
        {props.children && props.children.map((child, index) => {
          const childActive = location.pathname === child.to;
          return (
            isOpen && (
              <NavLink
                key={index}
                to={child.to}
                className="menu-item-link d-flex align-items-center w-100"
                style={{
                  paddingLeft: isOpen ? '40px' : '',
                  borderRight: '4px solid transparent'
                }}
                onClick={() => props.menuItemClickHandler(props.title)}
              >
                <div className="d-flex align-items-center w-100 justify-content-start">
                  <motion.div
                    animate={{ color: childActive ? '#257b69' : '#888' }}
                    transition={{ duration: 0.2 }}
                  >
                    {React.isValidElement(child.icon)
                      ? React.cloneElement(child.icon, { color: childActive ? '#257b69' : '#888' })
                      : child.icon}
                  </motion.div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        exit={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0 }}
                        style={{ marginLeft: "15px", color: childActive ? '#257b69' : '#000' }}
                      >
                        <span>{child.title}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </NavLink>
            )
          );
        })}
      </div>
    </MenuEl>
  );
};

export default MenuItem;
