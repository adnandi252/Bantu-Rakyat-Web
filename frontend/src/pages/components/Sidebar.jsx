import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import './Sidebar.css'; // Import custom CSS

const Sidebar = ({ onToggle }) => {
  const role = localStorage.getItem('role');
  const [isVisible, setIsVisible] = useState(true);

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
    if (typeof onToggle === 'function') {
      onToggle(!isVisible);
    }
  };

  return (
    <>
      <div className={`d-flex flex-column p-3 sidebar ${isVisible ? 'visible' : 'hidden'}`} style={{ backgroundColor: 'lightblue' }}>
        <h2>Bantu Rakyat</h2>
        <Nav className="flex-column">
          {role === 'admin' && (
            <>
              <NavLink to="/admin/dashboard" className="nav-link text-dark d-flex mt-5"><i className="bi bi-list me-2"></i>Dashboard</NavLink>
              <NavLink to="/admin/program-bantuan" className="nav-link text-dark d-flex mt-4"><i className="bi bi-arrow-right-square me-2"></i>Program Bantuan</NavLink>
              <NavLink to="/admin/verifikasi-penerima" className="nav-link text-dark d-flex mt-4"><i className="bi bi-patch-check me-2"></i>Verifikasi Penerima</NavLink>
              <NavLink to="/admin/data-penerima" className="nav-link text-dark d-flex mt-4"><i className="bi bi-person-lines-fill me-2"></i>Data Penerima</NavLink>
              <NavLink to="/admin/data-penyaluran" className="nav-link text-dark d-flex mt-4"><i className="bi bi-card-list me-2"></i>Data Penyaluran</NavLink>
            </>
          )}
          {role === 'user' && (
            <>
              <NavLink to="/user/home" className="nav-link text-dark d-flex mt-5"><i className="bi bi-list me-2"></i>Home</NavLink>
              <NavLink to="/user/lihat-program" className="nav-link text-dark d-flex mt-4"><i className="bi bi-arrow-right-square me-2"></i>Lihat Program</NavLink>
              <NavLink to="/user/riwayat-bantuan" className="nav-link text-dark d-flex mt-4"><i className="bi bi-patch-check me-2"></i>Riwayat Bantuan</NavLink>
              <NavLink to="/user/profile" className="nav-link text-dark d-flex mt-4"><i className="bi bi-person me-2"></i>Profile</NavLink>
            </>
          )}
        </Nav>
      </div>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isVisible ? <i className="bi bi-arrow-left"></i> : <i className="bi bi-arrow-right"></i>}
      </button>
    </>
  );
};

export default Sidebar;
