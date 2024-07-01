import React from 'react';
import { Nav } from 'react-bootstrap';

const Sidebar = () => {
  // Ambil role dari localStorage
  const role = localStorage.getItem('role');

  return (
    <div className="d-flex flex-column p-3 bg-light" style={{ width: '250px', height: '100vh' }}>
      <h2>Bantu Rakyat</h2>
      <Nav className="flex-column">
        {role === 'admin' && (
          <>
            <Nav.Link href="/admin/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/admin/program-bantuan">Program Bantuan</Nav.Link>
            <Nav.Link href="/admin/verifikasi-penerima">Verifikasi Penerima</Nav.Link>
            <Nav.Link href="/admin/data-penerima">Data Penerima</Nav.Link>
            <Nav.Link href="/admin/data-penyaluran">Data Penyaluran</Nav.Link>
          </>
        )}
        {role === 'user' && (
          <>
            <Nav.Link href="/user/home">Home</Nav.Link>
            <Nav.Link href="/user/lihat-program">Lihat Program</Nav.Link>
            <Nav.Link href="/user/riwayat-bantuan">Riwayat Bantuan</Nav.Link>
            <Nav.Link href="/user/profile">Profile</Nav.Link>
          </>
        )}
      </Nav>
    </div>
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
//                   <Nav.Link href="/admin/dashboard" className="text-dark d-flex mt-5"><i className="bi bi-list me-2"></i>Dashboard</Nav.Link>
//                   <Nav.Link href="/admin/program-bantuan" className="text-dark d-flex mt-4"><i className="bi bi-arrow-right-square me-2"></i>Program Bantuan</Nav.Link>
//                   <Nav.Link href="/admin/verifikasi-penerima" className="text-dark d-flex mt-4"><i className="bi bi-patch-check me-2"></i>Verifikasi Penerima</Nav.Link>
//                   <Nav.Link href="/admin/data-penerima" className="text-dark d-flex mt-4"><i className="bi bi-person-lines-fill me-2"></i>Data Penerima</Nav.Link>
//                   <Nav.Link href="/admin/data-penyaluran" className="text-dark d-flex mt-4"><i className="bi bi-card-list me-2"></i>Data Penyaluran</Nav.Link>
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

