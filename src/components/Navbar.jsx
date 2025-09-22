// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        🌱 Campus Care
      </div>
      <div className="navbar-links">
        {/* we keep it empty for now */}
      </div>
    </nav>
  );
}


export default Navbar;

