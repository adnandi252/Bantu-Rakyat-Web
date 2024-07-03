import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './LihatProgram.css';

const LihatProgram = () => {
  const [programs, setPrograms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

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

  const handleRegisterClick = (program) => {
    setSelectedProgram(program);
    setPdfUrl(program.dokumen ? `http://127.0.0.1:5000${program.dokumen}` : '');
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

      let documentPath = selectedProgram.dokumen;

      if (documentFile) {
        const safeFileName = documentFile.name.replace(/[^\w\s\[\]\{\}\.-]/g, '').replace(/\s+/g, '_');
        const formData = new FormData();
        formData.append('file', documentFile, safeFileName);

        await axios.post('http://127.0.0.1:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        documentPath = `/uploads/${safeFileName}`;
      }

      await axios.post(`http://127.0.0.1:5000/user/daftar-penerima-manfaat/tambah/${userId}`, {
        userId,
        jenisBantuanId: selectedProgram.id,
        dokumen: documentPath
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setPrograms((prevPrograms) =>
        prevPrograms.map((program) =>
          program.id === selectedProgram.id ? { ...program, status: 'belum diverifikasi', dokumen: documentPath } : program
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error('Error submitting registration:', error);
    }
  };

  const handleCancel = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
      if (!token || !userId) {
        throw new Error('Token atau User ID tidak ditemukan di localStorage');
      }

      await axios.delete(`http://127.0.0.1:5000/user/daftar-penerima-manfaat/delete/${selectedProgram.penerimaManfaatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setPrograms((prevPrograms) =>
        prevPrograms.map((program) =>
          program.id === selectedProgram.id ? { ...program, status: 'Belum Didaftari', dokumen: '' } : program
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error('Error cancelling registration:', error);
    }
  };

  const handleWithdraw = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
      if (!token || !userId) {
        throw new Error('Token atau User ID tidak ditemukan di localStorage');
      }

      await axios.put(`http://127.0.0.1:5000/admin/verifikasi-penerima-manfaat/update/${selectedProgram.penerimaManfaatId}`, {
        status: 'nonaktif',
        keterangan: selectedProgram.keterangan
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setPrograms((prevPrograms) =>
        prevPrograms.map((program) =>
          program.id === selectedProgram.id ? { ...program, status: 'Belum Didaftari', dokumen: '' } : program
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error('Error withdrawing from program:', error);
    }
  };

  const handleAppeal = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
      if (!token || !userId) {
        throw new Error('Token atau User ID tidak ditemukan di localStorage');
      }

      let documentPath = selectedProgram.dokumen;

      if (documentFile) {
        const safeFileName = documentFile.name.replace(/[^\w\s\[\]\{\}\.-]/g, '').replace(/\s+/g, '_');
        const formData = new FormData();
        formData.append('file', documentFile, safeFileName);

        await axios.post('http://127.0.0.1:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        documentPath = `/uploads/${safeFileName}`;
      }

      await axios.put(`http://127.0.0.1:5000/user/daftar-penerima-manfaat/ajukan-ulang/${selectedProgram.penerimaManfaatId}`, {
        dokumen: documentPath
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setPrograms((prevPrograms) =>
        prevPrograms.map((program) =>
          program.id === selectedProgram.id ? { ...program, status: 'belum diverifikasi', dokumen: documentPath } : program
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error('Error submitting appeal:', error);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
      if (!token || !userId) {
        throw new Error('Token atau User ID tidak ditemukan di localStorage');
      }

      if (documentFile) {
        const safeFileName = documentFile.name.replace(/[^\w\s\[\]\{\}\.-]/g, '').replace(/\s+/g, '_');
        const formData = new FormData();
        formData.append('file', documentFile, safeFileName);

        await axios.post('http://127.0.0.1:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const documentPath = `/uploads/${safeFileName}`;

        await axios.put(`http://127.0.0.1:5000/user/daftar-penerima-manfaat/update/${selectedProgram.penerimaManfaatId}`, {
          dokumen: documentPath
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setPrograms((prevPrograms) =>
          prevPrograms.map((program) =>
            program.id === selectedProgram.id ? { ...program, dokumen: documentPath } : program
          )
        );
      }

      setShowModal(false);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const handleSidebarToggle = (isVisible) => {
    setIsSidebarVisible(isVisible);
    console.log('Sidebar is visible:', isVisible);
  };

  return (
    <div className="d-flex" style={{display:'flex', justifyContent:'center', width:'100%', alignItems:'center'}}>
      <Sidebar onToggle={handleSidebarToggle}/>
      <div className={`content-area ${isSidebarVisible ? 'visible' : 'hidden'}`} style={{padding:'0px'}}>
      <Header isSidebarVisible={isSidebarVisible} />
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
                      onClick={() => handleRegisterClick(program)}
                      variant={
                        program.status === 'aktif'
                          ? 'success'
                          : program.status === 'belum diverifikasi'
                          ? 'warning'
                          : program.status === 'ditolak'
                          ? 'danger'
                          : program.status === 'Belum Didaftari'
                          ? 'primary'
                          : 'primary'
                      }
                    >
                      {program.status === 'aktif'
                        ? 'Terdaftar'
                        : program.status === 'belum diverifikasi'
                        ? 'Mengirim Pengajuan'
                        : program.status === 'ditolak'
                        ? 'Pengajuan Ditolak'
                        : program.status === 'Belum Didaftari'
                        ? 'Daftar'
                        : 'Nonaktif'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {selectedProgram && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedProgram.namaBantuan}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              {selectedProgram.keterangan && (
                <Form.Group controlId="formKeterangan" className="mb-3">
                  <Form.Label>Keterangan</Form.Label>
                  <Form.Control as="textarea" rows={3} readOnly value={selectedProgram.keterangan} />
                </Form.Group>
              )}
              {selectedProgram.status === 'belum diverifikasi' && (
                <>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Dokumen</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} accept=".pdf" />
                  </Form.Group>
                  {pdfUrl && (
                    <embed src={pdfUrl} type="application/pdf" width="100%" height="400px" />
                  )}
                  <Button variant="primary" onClick={handleUpdate}>
                    Update
                  </Button>
                  <Button variant="danger" className="ms-2" onClick={handleCancel}>
                    Batalkan Pengajuan
                  </Button>
                </>
              )}
              {selectedProgram.status === 'aktif' && (
                <>
                  {selectedProgram.dokumen && (
                    <embed src={`http://127.0.0.1:5000${selectedProgram.dokumen}`} type="application/pdf" width="100%" height="400px" />
                  )}
                  <Button variant="danger" onClick={handleWithdraw}>
                    Mengundurkan Diri
                  </Button>
                </>
              )}
              {selectedProgram.status === 'ditolak' && (
                <>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Dokumen</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} accept=".pdf" />
                  </Form.Group>
                  {pdfUrl && (
                    <embed src={pdfUrl} type="application/pdf" width="100%" height="400px" />
                  )}
                  <Button variant="primary" onClick={handleAppeal}>
                    Ajukan Banding
                  </Button>
                </>
              )}
              {selectedProgram.status === 'Belum Didaftari' && (
                <>
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
                </>
              )}
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default LihatProgram;
