import React from 'react';
import { useContext } from "react";
import { AuthContext } from "../../context/authContext.js";
import { Link } from 'react-router-dom';
import '../../css/Header.css'; // Import your CSS file for styling

function Header() {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <header className="header-container">
      <div className="logo-container">
        <Link to="/" className="logo">
          Pottery Studio
        </Link>
      </div>
      <nav className="nav-links">
      {currentUser && (
          <div className='userInfo_container'><span className="userInfo"> Hello {currentUser?.username}!!</span></div>
        )}
        
          {currentUser ? (
            <div className='userInfo_container'>
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/contact" className="nav-link">
                Contact Us
              </Link>
              <Link to="/users/${currentUser.username}" className="nav-link">
                Profile
              </Link>
            {/* Render "Admin" link only if the user is an admin */}
            {currentUser && currentUser.username === 'admin' && (
              <Link to="/admin" className="nav-link">
                Admin
              </Link>
            )}
            <Link to="/" className="nav-link" onClick={()=>{console.log(logout())}}>
                Logout
              </Link>
            {/*<button className="logoutbtn nav-link" onClick={()=>{console.log(logout())}}>Logout</button>*/}
            </div>
          ) : (
            <div className='userInfo_container'>
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/contact" className="nav-link">
                Contact US
              </Link>
              <Link className="nav-link" to="/login">
              Login
            </Link> {' '}
            <Link to="/signup" className="nav-link">
            Signup
          </Link>
          </div>
          )}
           

        {/* <Link to="/login" className="nav-link">
          Login
        </Link>
        <Link to="/signup" className="nav-link">
          Signup
        </Link> */}
      </nav>
    </header>
  );
}

export default Header;
