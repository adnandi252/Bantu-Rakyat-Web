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
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.
                            </p>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Alamat Email</label>
                                    <input type="email" className="form-control" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" className="form-control" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Log in</button>
                            </form>
                            <a href="#" className="d-block text-right mt-2">Forgot your password?</a>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Register Akun</h2>
                            <p className="card-text">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.
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
