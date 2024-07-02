import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const DataPenerima = () => {
  const [recipients, setRecipients] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [tanggalPenyaluran, setTanggalPenyaluran] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [status, setStatus] = useState('');
  const [keterangan, setKeterangan] = useState('');

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

  const handleShowModal = (recipient) => {
    setSelectedRecipient(recipient);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecipient(null);
    setTanggalPenyaluran('');
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://127.0.0.1:5000/admin/jadwal-penyaluran/tambah', {
        penerimaManfaatId: selectedRecipient.penerimaManfaatId,
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

  const handleShowDetailsModal = (recipient) => {
    setSelectedRecipient(recipient);
    setStatus(recipient.status);
    setKeterangan(recipient.keterangan || '');
    setShowDetailsModal(true);
    console.log(recipient);  // Tambahkan log untuk debugging
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedRecipient(null);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleKeteranganChange = (e) => {
    setKeterangan(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://127.0.0.1:5000/admin/verifikasi-penerima-manfaat/update/${selectedRecipient.userId}`, {
        status,
        keterangan
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        // Update the local state with the new status and keterangan
        setRecipients(prevRecipients =>
          prevRecipients.map(recipient => 
            recipient.userId === selectedRecipient.userId
              ? { ...recipient, status, keterangan }
              : recipient
          )
        );
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error('Ada masalah saat mengupdate data!', error);
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
                    <Button variant='link' onClick={() => handleShowDetailsModal(recipient)}><i className='bi bi-eye'></i></Button>
                    <Button variant="link" onClick={() => handleShowModal(recipient)}><i className="bi bi-plus-square"></i></Button>
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
          <Button variant="success" onClick={handleSave}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detail Penerima Bantuan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecipient && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Jenis Program Bantuan</Form.Label>
                <Form.Control type="text" readOnly value={selectedRecipient.nama_bantuan || ''} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>NIK</Form.Label>
                <Form.Control type="text" readOnly value={selectedRecipient.nik || ''} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nama Lengkap Penerima</Form.Label>
                <Form.Control type="text" readOnly value={selectedRecipient.nama_user || ''} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Foto Profil</Form.Label>
                <img
                  src={selectedRecipient.foto ? `http://localhost:5000${selectedRecipient.foto}` : 'https://via.placeholder.com/300'}
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
                <Form.Control type="text" readOnly value={selectedRecipient.created_at || ''} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tempat Lahir</Form.Label>
                <Form.Control type="text" readOnly value={selectedRecipient.tempat_lahir || ''} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tanggal Lahir</Form.Label>
                <Form.Control type="text" readOnly value={selectedRecipient.tanggal_lahir || ''} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Alamat</Form.Label>
                <Form.Control type="text" readOnly value={selectedRecipient.alamat || ''} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nomor Telepon</Form.Label>
                <Form.Control type="text" readOnly value={selectedRecipient.telepon || ''} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Pekerjaan</Form.Label>
                <Form.Control type="text" readOnly value={selectedRecipient.pekerjaan || ''} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Penghasilan</Form.Label>
                <Form.Control type="text" readOnly value={selectedRecipient.penghasilan || ''} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select value={status} onChange={handleStatusChange}>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Keterangan</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={keterangan}
                  onChange={handleKeteranganChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Tutup
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DataPenerima;
