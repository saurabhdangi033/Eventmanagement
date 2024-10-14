// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";


const Navbar = () => {
  return (
    <nav className="navbar">
    
      <Link to="/create">Create Event</Link>
      <Link to="/events">Show Events</Link>
    </nav>
  );
};

export default Navbar;
