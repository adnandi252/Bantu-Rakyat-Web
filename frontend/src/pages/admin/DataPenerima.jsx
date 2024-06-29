import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const DataPenerima = () => {
  const [recipients, setRecipients] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipientId, setSelectedRecipientId] = useState(null);
  const [tanggalPenyaluran, setTanggalPenyaluran] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:5000/admin/penerima-manfaat', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRecipients(response.data);
      } catch (error) {
        setError('Ada masalah saat mengambil data. Pastikan Anda sudah login.');
        console.error('Ada masalah saat mengambil data!', error);
      }
    };

    fetchData();
  }, []);

  const handleShowModal = (recipientId) => {
    setSelectedRecipientId(recipientId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecipientId(null);
    setTanggalPenyaluran('');
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://127.0.0.1:5000/admin/jadwal-penyaluran/tambah', {
        penerimaManfaatId: selectedRecipientId,
        jadwal_penyaluran: tanggalPenyaluran,
        status: 'proses'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        handleCloseModal();
      }
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
          <h3>Data Penerima Bantuan Sosial</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Jenis Program Bantuan</th>
                <th>NIK</th>
                <th>Nama Lengkap Penerima</th>
                <th>Tanggal Mendaftar</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recipients.map((recipient) => (
                <tr key={recipient.userId}>
                  <td>{recipient.nama_bantuan}</td>
                  <td>{recipient.nik}</td>
                  <td>{recipient.nama_user}</td>
                  <td>{recipient.created_at}</td>
                  <td>
                    <span className={`badge ${
                      recipient.status === 'aktif' ? 'bg-success' : 'bg-warning'
                    }`}>
                      {recipient.status.charAt(0).toUpperCase() + recipient.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <Button variant='link'><i className='bi bi-eye'></i></Button>
                    <Button variant="link" onClick={() => handleShowModal(recipient.penerimaManfaatId)}><i className="bi bi-plus-square"></i></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>
      
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Jadwal Penyaluran</Modal.Title>
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
            Tutup
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DataPenerima;
