import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const DataPenyaluran = () => {
  const [distributions, setDistributions] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDistribution, setSelectedDistribution] = useState(null);
  const [tanggalPenyaluran, setTanggalPenyaluran] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:5000/admin/jadwal-penyaluran', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDistributions(response.data); 
      } catch (error){
        setError('Ada masalah saat mengambil data. Pastikan Anda sudah login.');
        console.error('Ada masalah saat mengambil data!', error);
      }
    };

    fetchData();
  }, []);

  const handleShowModal = (distribution) => {
    setSelectedDistribution(distribution);
    // Convert the date format to YYYY-MM-DD
    const date = new Date(distribution.jadwal_penyaluran);
    const formattedDate = date.toISOString().split('T')[0];
    setTanggalPenyaluran(formattedDate);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDistribution(null);
    setTanggalPenyaluran('');
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://127.0.0.1:5000/admin/jadwal-penyaluran/update/${selectedDistribution.jadwalPenyaluranId}`, {
        jadwal_penyaluran: tanggalPenyaluran
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDistributions(prevDistributions =>
        prevDistributions.map(dist =>
          dist.userId === selectedDistribution.userId
            ? { ...dist, jadwal_penyaluran: tanggalPenyaluran }
            : dist
        )
      );
      handleCloseModal();
    } catch (error) {
      console.error('Ada masalah saat menyimpan data!', error);
    }
  };

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
                    <Button variant="link" onClick={() => handleShowModal(distribution)}>
                      <i className="bi bi-eye"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ubah Tanggal Penyaluran</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="tanggalPenyaluran">
              <Form.Label>Tanggal Penyaluran</Form.Label>
              <Form.Control
                type="date"
                value={tanggalPenyaluran}
                onChange={(e) => setTanggalPenyaluran(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="success" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DataPenyaluran;
