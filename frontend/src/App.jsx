import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';
import PrivateRoute from './services/PrivateRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomeAdmin from './pages/admin/HomeAdmin';
import ProgramBantuan from './pages/admin/ProgramBantuan';
import VerifikasiPenerima from './pages/admin/VerifikasiPenerima';
import DataPenerima from './pages/admin/DataPenerima';
import DataPenyaluran from './pages/admin/DataPenyaluran';
import HomeUser from './pages/user/HomeUser';
import LihatProgram from './pages/user/LihatProgram';
import RiwayatBantuan from './pages/user/RiwayatBantuan';
import ProfilePage from './pages/user/Profile';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute roles={['admin']}>
              <HomeAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/program-bantuan"
          element={
            <PrivateRoute roles={['admin']}>
              <ProgramBantuan />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/verifikasi-penerima"
          element={
            <PrivateRoute roles={['admin']}>
              <VerifikasiPenerima />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/data-penerima"
          element={
            <PrivateRoute roles={['admin']}>
              <DataPenerima />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/data-penyaluran"
          element={
            <PrivateRoute roles={['admin']}>
              <DataPenyaluran />
            </PrivateRoute>
          }
        />
        <Route path="/user/home"
          element={
            <PrivateRoute roles={['user']}>
              <HomeUser />
            </PrivateRoute>
          }
        />
        <Route path="/user/lihat-program"
          element={
            <PrivateRoute roles={['user']}>
              <LihatProgram />
            </PrivateRoute>
          }
        />
        <Route path="/user/riwayat-bantuan"
          element={
            <PrivateRoute roles={['user']}>
              <RiwayatBantuan />
            </PrivateRoute>
          }
        />
        <Route path="/user/profile"
          element={
            <PrivateRoute roles={['user']}>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
