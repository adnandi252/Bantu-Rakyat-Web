// import React from 'react';
// import { Navbar } from 'react-bootstrap';
// import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
// import './Header.css'; // Import custom CSS

// const Header = () => {
//   return (
//     <Navbar className={`navbar-custom`} expand="lg" style={{width:'100%', position:'fixed', top:'0', zIndex:'1000', backgroundColor:'lightblue', height:'65px'}}>
//       <Navbar.Collapse className="justify-content-end">
//         <div className="d-flex align-items-center">
//           <span className="mr-3">Admin</span>
//           <i className="bi bi-box-arrow-right" style={{ fontSize: '24px', marginLeft: '10px', marginRight:'20px' }}></i> 
//         </div>
//       </Navbar.Collapse>
//     </Navbar>
//   );
// };

// export default Header;


import React from 'react';
import { Navbar } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Header = ({ isSidebarVisible }) => {
  const sidebarWidth = 250; // Sesuaikan dengan lebar sidebar Anda

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
          <span className="mr-3">Admin</span>
          <i className="bi bi-box-arrow-right" style={{ fontSize: '24px', marginLeft: '10px', marginRight: '20px' }}></i>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;