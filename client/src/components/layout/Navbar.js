import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>
        <Link to="/">
          <i className="fas fa-laptop-code"></i> CompeteCoder
        </Link>
      </h1>
      <ul>
        <li>
          <Link to="/login">
            <i className="fas fa-sign-in-alt"></i> Login
          </Link>
        </li>
        <li>
          <Link to="/register">
            <i className="fas fa-user-circle"></i> Register
          </Link>
        </li>
        <li>
          <Link to="/logout">
            <i className="fas fa-sign-out-alt"></i> Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
