import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const ProgramBantuan = () => {
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [newProgram, setNewProgram] = useState({
    nama_bantuan: '',
    anggaran_per_paket: '',
    deskripsi: '',
    status: 'aktif'
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:5000/admin/program-bantuan', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPrograms(response.data);
    } catch (error) {
      setError('Ada masalah saat mengambil data. Pastikan Anda sudah login.');
      console.error('Ada masalah saat mengambil data!', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Ambil token dari localStorage
      await axios.post(
        'http://127.0.0.1:5000/admin/program-bantuan/tambah',
        newProgram,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setNewProgram({
        nama_bantuan: '',
        anggaran_per_paket: '',
        deskripsi: '',
        status: 'aktif'
      }); // Reset the new program form
      handleCloseModal();
      fetchData(); // Fetch the updated data
    } catch (error) {
      console.error('Ada masalah saat menambahkan data!', error);
      setError('Ada masalah saat menambahkan data. Silakan coba lagi.');
    }
  };

  const handleShowDetailModal = (program) => {
    setSelectedProgram(program);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => setShowDetailModal(false);

  const handleDetailInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Ambil token dari localStorage
      await axios.put(
        `http://127.0.0.1:5000/admin/program-bantuan/update/${selectedProgram.id}`,
        selectedProgram,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      handleCloseDetailModal();
      fetchData(); // Fetch the updated data
    } catch (error) {
      console.error('Ada masalah saat memperbarui data!', error);
      setError('Ada masalah saat memperbarui data. Silakan coba lagi.');
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
          <h3>Program Bantuan Sosial</h3>
          <Button variant="primary" className="mb-3" onClick={handleShowModal}>
            <i className="bi bi-plus me-2"></i>Tambahkan Data
          </Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Jenis Program Bantuan</th>
                <th>Jumlah Penerima Aktif</th>
                <th>Anggaran Per Paket</th>
                <th>Jumlah Paket Tersalurkan</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => (
                <tr key={program.id}>
                  <td>{program.nama_bantuan}</td>
                  <td>{program.jumlah_pendaftar}</td>
                  <td>{program.anggaran_per_paket ? parseInt(program.anggaran_per_paket).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : 'N/A'}</td>
                  <td>{program.jumlah_paket_tersalurkan}</td>
                  <td>
                    <span className={`badge ${program.status ? (program.status === 'aktif' ? 'bg-success' : 'bg-danger') : 'bg-secondary'}`}>
                      {program.status ? program.status.charAt(0).toUpperCase() + program.status.slice(1) : 'Unknown'}
                    </span>
                  </td>
                  <td>
                    <Button variant="link" onClick={() => handleShowDetailModal(program)}><i className="bi bi-eye"></i></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Program Bantuan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="nama_bantuan">
              <Form.Label>Nama Bantuan</Form.Label>
              <Form.Control
                type="text"
                name="nama_bantuan"
                value={newProgram.nama_bantuan}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="anggaran_per_paket">
              <Form.Label>Anggaran Per Paket</Form.Label>
              <Form.Control
                type="number"
                name="anggaran_per_paket"
                value={newProgram.anggaran_per_paket}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="deskripsi">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                name="deskripsi"
                value={newProgram.deskripsi}
                onChange={handleInputChange}
                rows={3}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={newProgram.status}
                onChange={handleInputChange}
                required
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </Form.Select>
            </Form.Group>
            <Button variant="success" type="submit">
              Simpan
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDetailModal} onHide={handleCloseDetailModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detail Program Bantuan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProgram ? (
            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3" controlId="nama_bantuan">
                <Form.Label>Nama Bantuan</Form.Label>
                <Form.Control
                  type="text"
                  name="nama_bantuan"
                  value={selectedProgram.nama_bantuan}
                  onChange={handleDetailInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="anggaran_per_paket">
                <Form.Label>Anggaran Per Paket</Form.Label>
                <Form.Control
                  type="number"
                  name="anggaran_per_paket"
                  value={selectedProgram.anggaran_per_paket}
                  onChange={handleDetailInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="deskripsi">
                <Form.Label>Deskripsi</Form.Label>
                <Form.Control
                  as="textarea"
                  name="deskripsi"
                  value={selectedProgram.deskripsi}
                  onChange={handleDetailInputChange}
                  rows={3}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="status">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={selectedProgram.status}
                  onChange={handleDetailInputChange}
                  required
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </Form.Select>
              </Form.Group>
              <Button variant="success" type="submit">
                Update
              </Button>
            </Form>
          ) : (
            <div>Loading...</div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProgramBantuan;
