import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import logo from '../../assets/cit_white_logo.webp';
import './navbar.css';
import Sidebar from "../SideBar/Sidebar";
const Navbar = ({isAuthorized}) => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <nav className="navbar">
      <div className="nav_logo">
        <Link to="/" className="nav_logo"><img src={logo} className="nav-img"/></Link>
      </div>
      {isAuthenticated && isAuthorized && (
        <>
    <Link to="/hr-dashboard" className="nav_btn">Home</Link>
    <Link to='/hr-dashboard/profile' className="nav_btn">Profile</Link>
    <Link to='/hr-dashboard/create-job' className="nav_btn">Create Job</Link>
    <Sidebar/>
    </>
  )}
  
  {isAuthenticated && !isAuthorized && (
    <Link to="/" className="nav_btn">Candidate Portal</Link>
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
