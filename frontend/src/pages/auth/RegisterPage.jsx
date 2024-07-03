import React, { useState } from 'react';
import axios from 'axios';
import './login.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        nik: '',
        nama: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:5000/register', {
                nik: formData.nik,
                nama: formData.nama,
                email: formData.email,
                password: formData.password
            });

            if (response.status === 201) {
                setMessage("Registration successful! Please log in.");
                setFormData({
                    nik: '',
                    nama: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
                setError(null);
            } else {
                setError("Registration failed. Please try again.");
            }
        } catch (error) {
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Register Akun</h2>
                            <p className="card-text">
                            Isi form di bawah ini dengan informasi yang diperlukan untuk mendaftar akun baru. Pastikan semua data yang Anda masukkan adalah benar dan valid.</p>
                            {message && <div className="alert alert-success">{message}</div>}
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className='mb-2'>Nomor Induk Kependudukan</label>
                                    <input 
                                        type="number" 
                                        name="nik" 
                                        className="form-control" 
                                        placeholder="Masukkan NIK" 
                                        value={formData.nik} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label className='mb-2'>Nama Lengkap</label>
                                    <input 
                                        type="text" 
                                        name="nama" 
                                        className="form-control" 
                                        placeholder="Masukkan Nama Lengkap" 
                                        value={formData.nama} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label className='mb-2'>Alamat Email</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        className="form-control" 
                                        placeholder="Masukkan email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label className='mb-2'>Password</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        className="form-control" 
                                        placeholder="Enter password" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label className='mb-2'>Konfirmasi Password</label>
                                    <input 
                                        type="password" 
                                        name="confirmPassword" 
                                        className="form-control" 
                                        placeholder="Enter password" 
                                        value={formData.confirmPassword} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 mt-3">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Login ke Akun Anda</h2>
                            <p className="card-text">
                            Sudah punya akun? Login sekarang untuk mengakses fitur dan layanan kami. Masukkan email dan password yang terdaftar untuk memulai.</p>
                            <a className="btn btn-outline-primary w-100" href="/login">Login</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
