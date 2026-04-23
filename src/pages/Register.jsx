import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Register.css';
import '../styles/Animations.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validasi
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Semua field harus diisi');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      setIsLoading(false);
      return;
    }

    try {
      // Simulasi delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Ambil data user yang sudah ada
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

      // Cek apakah username sudah terdaftar
      const usernameExists = storedUsers.some(user => user.username === formData.username);
      if (usernameExists) {
        setError('Username sudah terdaftar');
        setIsLoading(false);
        return;
      }

      // Cek apakah email sudah terdaftar
      const emailExists = storedUsers.some(user => user.email === formData.email);
      if (emailExists) {
        setError('Email sudah terdaftar');
        setIsLoading(false);
        return;
      }

      // Buat user baru
      const newUser = {
        id: 'user-' + Date.now(),
        username: formData.username,
        email: formData.email,
        password: formData.password,
        avatar: "/asset/profile.png",
        level: 1,
        joinDate: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        birthday: "01-Jan-2000",
        gender: "Female",
        point: 0,
      };

      // Simpan ke localStorage
      storedUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(storedUsers));

      // Reset form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      setSuccess('Registrasi berhasil! Silakan login.');

      // Auto redirect setelah 2 detik
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ... Background animation sama seperti login ... */}
      
      <main className="register-main">
        <div className="register-container">
          <h2>Register</h2>
          
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input 
                type="text" 
                className="form-control" 
                id="username"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Masukkan username"
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                id="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Masukkan email"
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                id="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Minimal 6 karakter"
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input 
                type="password" 
                className="form-control" 
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Ulangi password"
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Mendaftarkan...' : 'Register'}
            </button>
            
            <div className="mt-3">
              <p>
                Sudah punya akun? <Link to="/login">Login di sini</Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Register;