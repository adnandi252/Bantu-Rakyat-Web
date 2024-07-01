import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const VerifikasiPenerima = () => {
  const [registrants, setRegistrants] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRegistrant, setSelectedRegistrant] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Ambil token dari localStorage
        const response = await axios.get('http://127.0.0.1:5000/admin/verifikasi-penerima', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRegistrants(response.data);
      } catch (error) {
        setError('Ada masalah saat mengambil data. Pastikan Anda sudah login.');
        console.error('Ada masalah saat mengambil data!', error);
      }
    };

    fetchData();
  }, []);

  const handleViewDetails = (registrant) => {
    setSelectedRegistrant(registrant);
    setSelectedStatus(registrant.status); // Set nilai awal status
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

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
                    <span className={`badge ${registrant.status === 'aktif' ? 'bg-success' :
                      registrant.status === 'nonaktif' ? 'bg-warning' :
                        registrant.status === 'ditolak' ? 'bg-danger' :
                          'bg-secondary'
                      }`}>
                      {registrant.status.charAt(0).toUpperCase() + registrant.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <Button variant="link" onClick={() => handleViewDetails(registrant)}>
                      <i className="bi bi-eye"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>

      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detail Penerima Bantuan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Jenis Program Bantuan</Form.Label>
            <Form.Control type="text" readOnly value={selectedRegistrant?.nama_bantuan || ''} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>NIK</Form.Label>
            <Form.Control type="text" readOnly value={selectedRegistrant?.nik || ''} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nama Lengkap Penerima</Form.Label>
            <Form.Control type="text" readOnly value={selectedRegistrant?.nama_user || ''} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Foto Profil</Form.Label>
            <img
              src={selectedRegistrant?.foto ? `http://localhost:5000${selectedRegistrant.foto}` : 'https://via.placeholder.com/300'}
              alt="Foto Profil"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300";
              }}
              className="card-img-top"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tanggal Pengajuan</Form.Label>
            <Form.Control type="text" readOnly value={selectedRegistrant?.created_at || ''} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tempat Lahir</Form.Label>
            <Form.Control type="text" readOnly value={selectedRegistrant?.tempat_lahir || ''} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tanggal Lahir</Form.Label>
            <Form.Control type="text" readOnly value={selectedRegistrant?.tanggal_lahir || ''} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Telepon</Form.Label>
            <Form.Control type="text" readOnly value={selectedRegistrant?.telepon || ''} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Provinsi</Form.Label>
            <Form.Control type="text" readOnly value={selectedRegistrant?.provinsi || ''} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Pekerjaan</Form.Label>
            <Form.Control type="text" readOnly value={selectedRegistrant?.pekerjaan || ''} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Penghasilan</Form.Label>
            <Form.Control type="text" readOnly value={selectedRegistrant?.penghasilan || ''} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Rekening</Form.Label>
            <Form.Control type="text" readOnly value={selectedRegistrant?.rekening || ''} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Alamat</Form.Label>
            <Form.Control as="textarea" rows={3} readOnly value={selectedRegistrant?.alamat || ''} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Dokumen</Form.Label>
            {selectedRegistrant?.dokumen ? (
              <div>
                <iframe
                  src={`http://localhost:5000${selectedRegistrant.dokumen}`}
                  width="100%"
                  height="500px"
                  title="Dokumen"
                />
              </div>
            ) : (
              <p>Tidak ada dokumen</p>
            )}
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select value={selectedStatus} onChange={handleStatusChange}>
              <option value="belum_verifikasi">Belum Verifikasi</option>
              <option value="terima">Terima</option>
              <option value="tolak">Tolak</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VerifikasiPenerima;
