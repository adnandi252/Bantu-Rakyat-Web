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
          </>
        )}
      </Nav>
    </div>
  );
};

export default Sidebar;
