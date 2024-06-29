import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './LihatProgram.css';

const LihatProgram = () => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id'); // Ambil userId dari local storage
        if (!token || !userId) {
          throw new Error('Token atau User ID tidak ditemukan di localStorage');
        }

        const response = await fetch(`http://127.0.0.1:5000/user/lihat-program/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setPrograms(data);
      } catch (error) {
        console.error('Error fetching programs data:', error);
      }
    };

    fetchPrograms();
  }, []);

  const handleRegister = async (programId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
      if (!token || !userId) {
        throw new Error('Token atau User ID tidak ditemukan di localStorage');
      }

      const response = await fetch(`http://127.0.0.1:5000/api/register/${programId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setPrograms((prevPrograms) =>
        prevPrograms.map((program) =>
          program.id === programId ? { ...program, status: data.status } : program
        )
      );
    } catch (error) {
      console.error('Error registering for program:', error);
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
                      onClick={() => handleRegister(program.id)}
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
    </div>
  );
};

export default LihatProgram;
