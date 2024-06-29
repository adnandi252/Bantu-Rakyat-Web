import React, { useEffect, useState } from 'react';
import { Container, Table, Button} from 'react-bootstrap';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const VerifikasiPenerima = () => {
  const [registrants, setRegistrant] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Ambil token dari localStorage
        const response = await axios.get('http://127.0.0.1:5000/admin/verifikasi-penerima', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRegistrant(response.data); 
      } catch (error){
        setError('Ada masalah saat mengambil data. Pastikan Anda sudah login.');
        console.error('Ada masalah saat mengambil data!', error);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <Container fluid className="p-4">
          <h3>Verifikasi Penerima Bantuan Sosial</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Jenis Program Bantuan</th>
                <th>NIK</th>
                <th>Nama Lengkap Penerima</th>
                <th>Tanggal Pengajuan</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {registrants.map((registrant) => (
              <tr key={registrant.userId}>
                <td>{registrant.nama_bantuan}</td>
                <td>{registrant.nik}</td>
                <td>{registrant.nama_user}</td>
                <td>{registrant.created_at}</td>
                <td>
                  <span className={`badge ${
                    registrant.status === 'aktif' ? 'bg-success' : 
                    registrant.status === 'nonaktif' ? 'bg-warning' : 
                    registrant.status === 'ditolak' ? 'bg-danger' : 
                    'bg-secondary'
                  }`}>
                    {registrant.status.charAt(0).toUpperCase() + registrant.status.slice(1)}
                  </span>
                </td>
                <td>
                  <Button variant="link"><i className="bi bi-eye"></i></Button>
                </td>
              </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>
    </div>
  );
};

export default VerifikasiPenerima;
