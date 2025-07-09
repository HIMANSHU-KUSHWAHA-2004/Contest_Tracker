import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeSidebar();
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // or however you store auth
    navigate('/');
    closeSidebar();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !event.target.closest('.hamburger-btn')) {
        closeSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Button */}
      <button 
        className="hamburger-btn" 
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
      </button>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <div ref={sidebarRef} className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">⚡</div>
            <h2 className="sidebar-title">Contest Tracker</h2>
          </div>
          <div className="header-decoration"></div>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <button 
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                onClick={() => handleNavigation('/dashboard')}
              >
                <div className="nav-icon-wrapper">
                  <span className="nav-icon">📊</span>
                </div>
                <span className="nav-text">Dashboard</span>
                <div className="nav-indicator"></div>
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${location.pathname === '/calendar' ? 'active' : ''}`}
                onClick={() => handleNavigation('/calendar')}
              >
                <div className="nav-icon-wrapper">
                  <span className="nav-icon">📅</span>
                </div>
                <span className="nav-text">Calendar</span>
                <div className="nav-indicator"></div>
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                onClick={() => handleNavigation('/about')}
              >
                <div className="nav-icon-wrapper">
                  <span className="nav-icon">💻</span>
                </div>
                <span className="nav-text">About Contests</span>
                <div className="nav-indicator"></div>
              </button>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <div className="logout-icon-wrapper">
              <span className="nav-icon">🚪</span>
            </div>
            <span className="logout-text">Logout</span>
            <div className="logout-ripple"></div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;