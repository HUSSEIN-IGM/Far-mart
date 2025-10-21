import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import './Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Farmart
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/animals" className="nav-link">Browse Animals</Link>
          
          {isAuthenticated ? (
            <>
              {/* Add these links to the Navbar component */}
              {user?.user_type === 'farmer' && (
                <Link to="/farmer-dashboard" className="nav-link">Dashboard</Link>
              )}
              <Link to="/cart" className="nav-link">Cart</Link>
              <Link to="/orders" className="nav-link">Orders</Link>
              
              <span className="nav-welcome">
                Hello, {user?.first_name}
              </span>
              <button 
                className="nav-link nav-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;