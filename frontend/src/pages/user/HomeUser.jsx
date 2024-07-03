import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const HomeUser = () => {
  const [dashboardData, setDashboardData] = useState({ total_packages: 0, jenis_bantuan: {} });
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userId = localStorage.getItem('id');
        const token = localStorage.getItem('token');

        if (!userId) {
          throw new Error('User ID tidak ditemukan di localStorage');
        }

        if (!token) {
          throw new Error('Token tidak ditemukan di localStorage');
        }

        const response = await fetch(`http://127.0.0.1:5000/user/dashboard/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSidebarToggle = (isVisible) => {
    setIsSidebarVisible(isVisible);
    console.log('Sidebar is visible:', isVisible);
  };

  return (
    <div className="d-flex" style={{display:'flex', justifyContent:'center', width:'100%', alignItems:'center'}}>
      <Sidebar onToggle={handleSidebarToggle}/>
      <div className={`content-area ${isSidebarVisible ? 'visible' : 'hidden'}`} style={{padding:'0px', width:'100%'}}>
        <Header isSidebarVisible={isSidebarVisible} />
        <Container className="p-4">
          <Alert variant="success">
            <h4>Selamat Datang di Website Bantuan Sosial</h4>
            <p>Anda dapat melihat informasi paket bantuan yang telah diterima dan rincian jenis bantuan di bawah ini.</p>
          </Alert>
          <Alert variant="secondary" className="mt-4">
          <h3>Paket Bantuan Diterima: <span style={{color:'blue'}}>{dashboardData.total_packages}</span></h3>
          <Row className='mt-4'>
            <Col>
              <h3>Informasi Bantuan Diterima</h3>
              <Row>
                {dashboardData.jenis_bantuan && Object.entries(dashboardData.jenis_bantuan).map(([namaBantuan, count]) => (
                  <Col key={namaBantuan} xs={12} sm={6} md={4} lg={4} className="mb-4">
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <Card.Title>{namaBantuan}</Card.Title>
                        <Card.Text><span style={{color:'blue'}}>{count} paket</span></Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
          </Alert>
        </Container>
      </div>
    </div>
  );
};

export default HomeUser;
