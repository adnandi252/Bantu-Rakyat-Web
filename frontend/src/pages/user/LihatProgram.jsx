import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './LihatProgram.css';

const LihatProgram = () => {
  const [programs, setPrograms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id');
        if (!token || !userId) {
          throw new Error('Token atau User ID tidak ditemukan di localStorage');
        }

        const response = await axios.get(`http://127.0.0.1:5000/user/lihat-program/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setPrograms(response.data);
      } catch (error) {
        console.error('Error fetching programs data:', error);
      }
    };

    fetchPrograms();
  }, []);

  const handleRegisterClick = (programId) => {
    setSelectedProgramId(programId);
    setShowModal(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setDocumentFile(file);
      setPdfUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
      if (!token || !userId) {
        throw new Error('Token atau User ID tidak ditemukan di localStorage');
      }

      // Upload file
      const safeFileName = selectedFile.name.replace(/[^\w\s\[\]\{\}\.-]/g, '').replace(/\s+/g, '_');;
      const formData = new FormData();
      formData.append('file', selectedFile, safeFileName);

      const uploadResponse = await axios.post('http://127.0.0.1:5000/upload', formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      });

      const documentPath = `/uploads/${safeFileName}`;

      // Submit registration
      const response = await axios.post(`http://127.0.0.1:5000/user/daftar-penerima-manfaat/tambah/${userId}`, {
        userId,
        jenisBantuanId: selectedProgramId,
        dokumen: documentPath
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setPrograms((prevPrograms) =>
        prevPrograms.map((program) =>
          program.id === selectedProgramId ? { ...program, status: 'belum diverifikasi' } : program
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error('Error submitting registration:', error);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <Container fluid>
          <h3 className="mt-4">Program Bantuan</h3>
          <Row>
            {programs.map((program) => (
              <Col key={program.id} md={4} className="mb-4 d-flex align-items-stretch">
                <Card className="program-card">
                  <Card.Header>{program.namaBantuan}</Card.Header>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>Anggaran per Paket: {program.anggaranPerPaket.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</Card.Title>
                    <Card.Text>{program.deskripsi}</Card.Text>
                    <Button
                      className="mt-auto"
                      onClick={() => handleRegisterClick(program.id)}
                      disabled={program.status !== 'Belum Didaftari'}
                      variant={
                        program.status === 'aktif'
                          ? 'success'
                          : program.status === 'belum diverifikasi'
                          ? 'warning'
                          : program.status === 'ditolak'
                          ? 'danger'
                          : 'primary'
                      }
                    >
                      {program.status === 'aktif'
                        ? 'Terdaftar'
                        : program.status === 'belum diverifikasi'
                        ? 'Mengirim Pengajuan'
                        : program.status === 'ditolak'
                        ? 'Pengajuan Ditolak'
                        : 'Daftar'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Dokumen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Dokumen</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} accept=".pdf" />
            </Form.Group>
            {pdfUrl && (
              <embed src={pdfUrl} type="application/pdf" width="100%" height="400px" />
            )}
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LihatProgram;