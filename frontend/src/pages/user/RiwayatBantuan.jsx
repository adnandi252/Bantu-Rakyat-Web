import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const RiwayatBantuan = () => {
  const [distributions, setDistributions] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDistribution, setSelectedDistribution] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');
        const response = await axios.get(`http://127.0.0.1:5000/user/jadwal-penyaluran/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDistributions(response.data);
      } catch (error) {
        setError('Ada masalah saat mengambil data. Pastikan Anda sudah login.');
        console.error('Ada masalah saat mengambil data!', error);
      }
    };

    fetchData();
  }, []);

  const handleShowModal = (distribution) => {
    setSelectedDistribution(distribution);
    setStatus(distribution.status);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDistribution(null);
    setStatus('');
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://127.0.0.1:5000/user/jadwal_penyaluran/update/${selectedDistribution.penyaluranId}`, {
        status: status
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDistributions(prevDistributions =>
        prevDistributions.map(dist =>
          dist.id === selectedDistribution.id
            ? { ...dist, status: status }
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
          <Button variant="primary" className="mb-3">Tambahkan Data</Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nama Bantuan</th>
                <th>Jadwal Penyaluran</th>
                <th>Status</th>
                <th>Anggaran per Paket</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {distributions.map((distribution) => (
                <tr key={distribution.id}>
                  <td>{distribution.nama_bantuan}</td>
                  <td>{distribution.jadwal_penyaluran}</td>
                  <td>
                    <span className={`badge ${
                      distribution.status === 'selesai' ? 'bg-success' : 'bg-warning'}`}>
                      {distribution.status.charAt(0).toUpperCase() + distribution.status.slice(1)}
                    </span>
                  </td>
                  <td>{distribution.anggaran_per_paket}</td>
                  <td>
                    <Button variant="link" onClick={() => handleShowModal(distribution)}>
                      <i className="bi bi-pen"></i>
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
          <Modal.Title>Ubah Status Penyaluran</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="statusPenyaluran">
              <Form.Label>Status Penyaluran</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="proses">Proses</option>
                <option value="selesai">Selesai</option>
              </Form.Control>
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

export default RiwayatBantuan;
