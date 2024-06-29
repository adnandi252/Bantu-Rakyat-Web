import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const HomeUser = () => {
  const [dashboardData, setDashboardData] = useState({ total_packages: 0, jenis_bantuan: {} });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userId = localStorage.getItem('id');
        const token = localStorage.getItem('token'); // Ambil token dari localStorage

        if (!userId) {
          throw new Error('User ID tidak ditemukan di localStorage');
        }

        if (!token) {
          throw new Error('Token tidak ditemukan di localStorage');
        }

        const response = await fetch(`http://127.0.0.1:5000/user/dashboard/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Tambahkan token ke header Authorization
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

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <Container fluid>
          <h3 className="mt-4">Paket Bantuan Diterima</h3>
          <p>{dashboardData.total_packages} Paket</p>
          <Row>
            <Col>
              <h3>Informasi Bantuan Diterima</h3>
              <Row>
                {dashboardData.jenis_bantuan && Object.entries(dashboardData.jenis_bantuan).map(([namaBantuan, count]) => (
                  <Col key={namaBantuan}>
                    <Card>
                      <Card.Body>
                        <Card.Title>{namaBantuan}</Card.Title>
                        <Card.Text>{count} paket</Card.Text>
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

export default HomeUser;
