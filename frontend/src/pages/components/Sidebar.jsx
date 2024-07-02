import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
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
      <div className={`d-flex flex-column p-3 bg-light sidebar ${isVisible ? 'visible' : 'hidden'}`}>
        <h2>Bantu Rakyat</h2>
        <Nav className="flex-column">
          {role === 'admin' && (
            <>
              <Nav.Link href="/admin/dashboard" className="text-dark d-flex mt-5"><i className="bi bi-list me-2"></i>Dashboard</Nav.Link>
              <Nav.Link href="/admin/program-bantuan" className="text-dark d-flex mt-4"><i className="bi bi-arrow-right-square me-2"></i>Program Bantuan</Nav.Link>
              <Nav.Link href="/admin/verifikasi-penerima" className="text-dark d-flex mt-4"><i className="bi bi-patch-check me-2"></i>Verifikasi Penerima</Nav.Link>
              <Nav.Link href="/admin/data-penerima" className="text-dark d-flex mt-4"><i className="bi bi-person-lines-fill me-2"></i>Data Penerima</Nav.Link>
              <Nav.Link href="/admin/data-penyaluran" className="text-dark d-flex mt-4"><i className="bi bi-card-list me-2"></i>Data Penyaluran</Nav.Link>
            </>
          )}
          {role === 'user' && (
            <>
              <Nav.Link href="/user/home" className="text-dark d-flex mt-5"><i className="bi bi-list me-2"></i>Home</Nav.Link>
              <Nav.Link href="/user/lihat-program" className="text-dark d-flex mt-4"><i className="bi bi-arrow-right-square me-2"></i>Lihat Program</Nav.Link>
              <Nav.Link href="/user/riwayat-bantuan" className="text-dark d-flex mt-4"><i className="bi bi-patch-check me-2"></i>Riwayat Bantuan</Nav.Link>
              <Nav.Link href="/user/profile" className="text-dark d-flex mt-4"><i className='bi bi-person me-2'></i>Profile</Nav.Link>
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


// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import { Container, Row, Col, Nav } from 'react-bootstrap';

// const Sidebar = () => {
//   const role = localStorage.getItem('role');
//   return (
//     <Container fluid>
//       <Row>
//         <Col md={2} className="bg-light vh-100 sidebar">
//           <div className="sidebar-sticky">
//             <h4 className="text-primary mt-5">Bantu Rakyat</h4>
//             <Nav className="flex-column">
//               {role === 'admin' && (
//                 <>
//                   
//                 </>
//               )}
//               {role === 'user' && (
//                 <>
//                   <Nav.Link href="/user/home" className="text-dark d-flex mt-5"><i className="bi bi-list me-2"></i>Home</Nav.Link>
//                   <Nav.Link href="/user/lihat-program" className="text-dark d-flex mt-4"><i className="bi bi-arrow-right-square me-2"></i>Lihat Program</Nav.Link>
//                   <Nav.Link href="/user/riwayat-bantuan" className="text-dark d-flex mt-4"><i className="bi bi-patch-check me-2"></i>Riwayat Bantuan</Nav.Link>
//                 </>
//               )}
//             </Nav>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default Sidebar;

