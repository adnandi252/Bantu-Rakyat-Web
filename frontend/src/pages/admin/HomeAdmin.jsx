import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './HomeAdmin.css'; // Import custom CSS

const HomeAdmin = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:5000/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setData(response.data);
        
      } catch (error) {
        setError('Ada masalah saat mengambil data. Pastikan Anda sudah login.');
        console.error('Ada masalah saat mengambil data!', error);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const { pendaftar_bantuan_sosial, bantuan_tersalurkan, jenis_bantuan } = data;


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
          <Row>
            <Col>
              <h3>Informasi Pendaftaran Bantuan Sosial</h3>
              <Row>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>Diterima</Card.Title>
                      <Card.Text>{pendaftar_bantuan_sosial.diterima}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>Ditolak</Card.Title>
                      <Card.Text>{pendaftar_bantuan_sosial.ditolak}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>Belum Diverifikasi</Card.Title>
                      <Card.Text>{pendaftar_bantuan_sosial.belum_diverifikasi}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <h3 className="mt-4">Informasi Bantuan Tersalurkan</h3>
              <p>{bantuan_tersalurkan.total} Paket</p>
              <h3 className="mt-4">Informasi Jenis Bantuan</h3>
              <Row>
                {jenis_bantuan.map((jenis, index) => (
                  <Col key={index} md={6} lg={4}>
                    <Card>
                      <Card.Body>
                        <Card.Title>{jenis.nama}</Card.Title>
                        <Card.Text>{jenis.jumlah_penerima} Penerima</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default HomeAdmin;
