import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import '../styles/Reset.css';

const ResetConfirm = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!formData.newPassword.trim() || !formData.confirmPassword.trim()) {
      setError('Semua field harus diisi');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password minimal 6 karakter');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || 'Reset password gagal');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Password berhasil direset! Silakan login dengan password baru.');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Reset password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="reset-main">
        <div className="reset-container">
          <h2>Buat Password Baru</h2>

          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">Password Baru</label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                placeholder="Minimal 6 karakter"
                value={formData.newPassword}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Konfirmasi Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Ulangi password baru"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Menyimpan...
                </>
              ) : 'Simpan Password Baru'}
            </button>

            <div className="row mt-3">
              <div className="col-6 reset-link">
                <div className="mb-3">
                  <div className="login-link">
                    <Link to="/login">Kembali ke Login</Link>
                  </div>
                </div>
              </div>
              <div className="col-6 text-end">
                <div className="mb-3">
                  <div className="register-link">
                    <Link to="/register">Belum punya akun? Register</Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default ResetConfirm;
