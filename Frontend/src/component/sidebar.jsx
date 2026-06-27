import React, { useState } from "react";
import "../styles/sidebar.css";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaHistory,
  FaUserShield,
  FaSignOutAlt,
  

} from "react-icons/fa";
import { RiArticleFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const Location=useLocation()
    const navigate=useNavigate()
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      path:"/dashboard"
    },
    
    {
      title: "Analytics",
      icon: <FaUserShield />,
      path:"/analytics"
    },
  ];

  

  return (
    <>
    {open && (
    <div
        className="sidebar-overlay"
        onClick={() => setOpen(false)}
    ></div>
)}
     {!open && (
  <button
    className="menu-btn"
    onClick={() => setOpen(true)}
  >
    <FaBars />
  </button>
)}

      <div className={`sidebar ${open ? "show" : ""}`}>
        <div className="close-btn" onClick={() => setOpen(false)}>
          <FaTimes />
        </div>

        <div className="logo-section">
          <div className="logo">
            <RiArticleFill/>
          </div>

          <h2>Resume Screening</h2>
        </div>

     <ul className="menu">
  {menuItems.map((item, index) => (
    <li key={index}>
      <NavLink
        to={item.path}
        onClick={() => setOpen(false)}
        className={({ isActive }) =>
          isActive ? "menu-item active" : "menu-item"
        }
      >
        {item.icon}
        <span>{item.title}</span>
      </NavLink>
    </li>
  ))}
</ul>
      </div>

    </>
  );
};

export default Sidebar;