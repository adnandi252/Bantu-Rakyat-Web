import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const DataPenyaluran = () => {
  const [distributions, setDistrobutions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:5000/admin/jadwal-penyaluran', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDistrobutions(response.data); 
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
          <h3>Data Penyaluran Bantuan Sosial</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>NIK</th>
                <th>Nama Penerima</th>
                <th>Jenis Program Bantuan</th>
                <th>Tanggal Penyaluran</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {distributions.map((distribution) => (
                <tr key={distribution.userId}>
                  <td>{distribution.nik}</td>
                  <td>{distribution.nama_user}</td>
                  <td>{distribution.nama_bantuan}</td>
                  <td>{distribution.jadwal_penyaluran}</td>
                  <td>
                    <span className={`badge ${
                      distribution.status === 'selesai' ? 'bg-success' : 'bg-warning'}`}>
                      {distribution.status.charAt(0).toUpperCase() + distribution.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <Button variant="success" size="sm" className="me-2">Detail</Button>
                    <Button variant="danger" size="sm">Hapus</Button>
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

export default DataPenyaluran;
