import React from 'react';
import { Navbar, Form, FormControl, Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons

const Header = () => {
  return (
    <Navbar bg="light" expand="lg" className="d-flex justify-content-between align-items-center">
      <Form inline className="d-flex">
        <FormControl type="text" placeholder="Pencarian" className="mr-sm-2" />
        <Button variant="outline-primary">Cari</Button>
      </Form>
      <div className="d-flex align-items-center">
        <span className="mr-3">Admin</span>
        <i className="bi bi-box-arrow-right" style={{ fontSize: '24px' }}></i> 
      </div>
    </Navbar>
  );
};

export default Header;
