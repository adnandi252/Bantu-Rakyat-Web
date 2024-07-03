import React, { useContext } from 'react';
import { Navbar } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from '../../services/AuthContext';

const Header = ({ isSidebarVisible }) => {
  const sidebarWidth = 250; // Sesuaikan dengan lebar sidebar Anda
  const { logout } = useContext(AuthContext); // Get the logout function from AuthContext
  const nama = localStorage.getItem('nama');

  return (
    <Navbar 
      className={`navbar-custom ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`} 
      expand="lg" 
      style={{
        width: isSidebarVisible ? `calc(100% - ${sidebarWidth}px)` : '100%',
        position: 'fixed',
        top: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'lightblue',
        height: '65px',
        transition: 'width 0.3s ease-in-out'
      }}
    >
      <Navbar.Collapse className="justify-content-end">
        <div className="d-flex align-items-center">
          <span className="mr-6">{nama}</span>
          <i 
            className="bi bi-box-arrow-right" 
            style={{ fontSize: '24px', marginLeft: '10px', marginRight: '20px', cursor: 'pointer' }} 
            onClick={logout} // Call the logout function when clicked
          ></i>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
