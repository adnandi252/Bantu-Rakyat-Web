import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        nik: '',
        nama: '',
        email: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        alamat: '',
        telepon: '',
        provinsi: '',
        pekerjaan: '',
        penghasilan: '',
        rekening: '',
        foto: ''
    });
    const [error, setError] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const convertDateToInputFormat = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const id = localStorage.getItem('id');
                const response = await axios.get(`http://127.0.0.1:5000/user/profile/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = response.data;
                setProfile({
                    nik: data.nik || '',
                    nama: data.nama || '',
                    email: data.email || '',
                    tempat_lahir: data.tempat_lahir || '',
                    tanggal_lahir: convertDateToInputFormat(data.tanggal_lahir) || '',
                    alamat: data.alamat || '',
                    telepon: data.telepon || '',
                    provinsi: data.provinsi || '',
                    pekerjaan: data.pekerjaan || '',
                    penghasilan: data.penghasilan || '',
                    rekening: data.rekening || '',
                    foto: data.foto || ''
                });
                setImagePreview(`http://localhost:5000${data.foto}`);
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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const safeFileName = file.name.replace(/[^\w\s\[\]\{\}\.-]/g, '').replace(/\s+/g, '_');
            const uploadPath = `/uploads/${safeFileName}`;
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
            setProfile(prevProfile => ({
                ...prevProfile,
                foto: uploadPath
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const id = localStorage.getItem('id');

            // Jika ada file baru, upload terlebih dahulu
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                await axios.post('http://127.0.0.1:5000/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                // Kita tidak perlu mengambil response dari upload karena kita sudah set path di handleFileChange
            }

            // Kirim data profil yang diperbarui
            const response = await axios.post(`http://127.0.0.1:5000/user/profile/update/${id}`, profile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Profile berhasil disimpan', response.data);
            setProfile(response.data);
            setSelectedFile(null);
        } catch (error) {
            console.error('Ada masalah saat menyimpan data!', error);
            setError('Ada masalah saat menyimpan data.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    return (
        <div>
            <Header />
            <div className="container-fluid">
                <div className="row">
                    <Sidebar />
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        <div className="container mt-5">
                            <h1 className="mb-4">Profile Akun</h1>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="card">
                                        <img
                                            src={imagePreview || 'https://via.placeholder.com/300'}
                                            alt="Foto Profil"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/300";
                                            }}
                                            className="card-img-top"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="nik" className="form-label">NIK</label>
                                            <input type="text" className="form-control" id="nik" name="nik" value={profile.nik} readOnly />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="nama" className="form-label">Nama Lengkap</label>
                                            <input type="text" className="form-control" id="nama" name="nama" value={profile.nama} readOnly />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input type="email" className="form-control" id="email" name="email" value={profile.email} readOnly />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="foto" className="form-label">Foto Profil</label>
                                            <input type="file" className="form-control" id="foto" name="foto" onChange={handleFileChange} accept="image/*" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="tempat_lahir" className="form-label">Tempat Lahir</label>
                                            <input type="text" className="form-control" id="tempat_lahir" name="tempat_lahir" value={profile.tempat_lahir} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="tanggal_lahir" className="form-label">Tanggal Lahir</label>
                                            <input type="date" className="form-control" id="tanggal_lahir" name="tanggal_lahir" value={profile.tanggal_lahir} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="alamat" className="form-label">Alamat</label>
                                            <input type="text" className="form-control" id="alamat" name="alamat" value={profile.alamat} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="telepon" className="form-label">Telepon</label>
                                            <input type="tel" className="form-control" id="telepon" name="telepon" value={profile.telepon} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="provinsi" className="form-label">Provinsi</label>
                                            <input type="text" className="form-control" id="provinsi" name="provinsi" value={profile.provinsi} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="pekerjaan" className="form-label">Pekerjaan</label>
                                            <input type="text" className="form-control" id="pekerjaan" name="pekerjaan" value={profile.pekerjaan} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="penghasilan" className="form-label">Penghasilan</label>
                                            <input type="number" className="form-control" id="penghasilan" name="penghasilan" value={profile.penghasilan} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="rekening" className="form-label">Rekening</label>
                                            <input type="text" className="form-control" id="rekening" name="rekening" value={profile.rekening} onChange={handleChange} />
                                        </div>
                                        <button type="submit" className="btn btn-primary">Simpan</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
