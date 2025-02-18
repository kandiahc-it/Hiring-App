import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import './navbar.css';
const Navbar = ({isAuthorized}) => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <nav className="navbar">
      {isAuthenticated && isAuthorized && (
    <Link to="/hr-dashboard" className="nav_btn">HR Dashboard</Link>
  )}
  
  {isAuthenticated && !isAuthorized && (
    <Link to="/" className="nav_btn">Customer</Link>
  )}

  {isAuthenticated ? (
    <button onClick={() => logout({ returnTo: window.location.origin })} className="logout_btn">Logout</button>
  ) : (
    <button onClick={loginWithRedirect} className="logout_btn">Login</button>
  )}
    </nav>
  );
};

export default Navbar;
