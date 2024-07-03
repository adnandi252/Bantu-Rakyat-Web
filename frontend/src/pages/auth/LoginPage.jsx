// src/components/auth/Login.js
import React, { useContext, useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../services/AuthContext';

const LoginPage = () => {
    const { login, auth } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
        if (auth.role === 'admin') {
            navigate('/admin/dashboard');
        } else if (auth.role === 'user') {
            navigate('/user/home');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Login ke Akun Anda</h2>
                            <p className="card-text">
                            Silakan login dengan email dan password Anda untuk mengakses akun dan fitur-fitur yang tersedia. Pastikan Anda memasukkan informasi yang benar untuk menghindari masalah saat login.
                            </p>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className='mb-2'>Alamat Email</label>
                                    <input type="email" className="form-control" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="form-group mt-3">
                                    <label className='mb-2'>Password</label>
                                    <input type="password" className="form-control" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 mt-3">Log in</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Register Akun</h2>
                            <p className="card-text">
                            Belum punya akun? Daftar sekarang untuk menikmati berbagai layanan dan fitur yang kami tawarkan. Hanya butuh beberapa menit untuk membuat akun baru.
                            </p>
                            <a className="btn btn-outline-primary w-100" href="/register">Register</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
