// src/components/auth/Login.js
import React from 'react';
import './login.css';

const RegisterPage = () => {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Register Akun</h2>
                            <p className="card-text">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.
                            </p>
                            <form>
                                <div className="form-group">
                                    <label>Nomor Induk Kependudukan</label>
                                    <input type="number" className="form-control" placeholder="Masukkan NIK" />
                                </div>
                                <div className="form-group">
                                    <label>Nama Lengkap</label>
                                    <input className="form-control" placeholder="Masukkan Nama Lengkap" />
                                </div>
                                <div className="form-group">
                                    <label>Alamat Email</label>
                                    <input type="email" className="form-control" placeholder="Masukkan email" />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" className="form-control" placeholder="Enter password" />
                                </div>
                                <div className="form-group">
                                    <label>Konfirmasi Password</label>
                                    <input type="password" className="form-control" placeholder="Enter password" />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Login ke Akun Anda</h2>
                            <p className="card-text">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.
                            </p>
                            <a className="btn btn-outline-primary w-100" href="/login">Login</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
