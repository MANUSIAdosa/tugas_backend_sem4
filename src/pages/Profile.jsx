import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import '../styles/Animations.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState({
    username: false,
    email: false,
    password: false,
    birthday: false,
    gender: false
  });
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthday: '',
    gender: 'Female'
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Load user data dari localStorage saat komponen mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('userData');
        const currentUser = localStorage.getItem('currentUser');
        
        // Cek apakah user benar-benar login (ada authToken)
        if (!authToken) {
          setUserData(null);
          setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            birthday: '',
            gender: 'Female'
          });
          return;
        }
        
        // Prioritize currentUser, fallback to userData
        const user = currentUser ? JSON.parse(currentUser) : 
                    storedUser ? JSON.parse(storedUser) : null;
        
        if (user) {
          setUserData(user);
          setFormData({
            username: user.username || '',
            email: user.email || '',
            password: '',
            confirmPassword: '',
            birthday: user.birthday || '01-Jan-2000',
            gender: user.gender || 'Female'
          });
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setUserData(null);
      }
    };

    loadUserData();
    
    // Listen for storage changes (from other tabs or logout)
    const handleStorageChange = (e) => {
      if (e.key === 'userData' || e.key === 'authToken' || e.key === 'currentUser') {
        loadUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Toggle edit mode
  const toggleEditMode = (field) => {
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    
    // Reset errors dan success message
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setSuccessMessage('');
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate field
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch(field) {
      case 'username':
        if (!value.trim()) {
          newErrors.username = 'Username tidak boleh kosong';
        } else if (value.length < 3) {
          newErrors.username = 'Username minimal 3 karakter';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          newErrors.username = 'Username hanya boleh huruf, angka, dan underscore';
        } else {
          delete newErrors.username;
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email tidak boleh kosong';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Format email tidak valid';
        } else {
          delete newErrors.email;
        }
        break;
        
      case 'password':
        if (value && value.length < 6) {
          newErrors.password = 'Password minimal 6 karakter';
        } else {
          delete newErrors.password;
        }
        break;
        
      case 'confirmPassword':
        if (formData.password && value !== formData.password) {
          newErrors.confirmPassword = 'Password tidak cocok';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
        
      case 'birthday':
        if (value && !/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(value)) {
          newErrors.birthday = 'Format: DD-MMM-YYYY (contoh: 01-Jan-2000)';
        } else {
          delete newErrors.birthday;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    // Handle save 
  const handleSave = async (field) => {
    const value = formData[field];
    
    // Validasi field
    if (!validateField(field, value)) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');

    try {
      // Simulasi API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      let updatedData = {};
      
      // Ambil data users dari localStorage
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      switch(field) {
        case 'username':
          // Cek username unique di localStorage
          const usernameExists = allUsers.some(
            user => user.username === value && user.id !== userData?.id
          );
          
          if (usernameExists) {
            setErrors({ username: 'Username sudah digunakan' });
            setIsLoading(false);
            return;
          }
          
          updatedData = { username: value };
          break;
          
        case 'email':
          // Cek email unique
          const emailExists = allUsers.some(
            user => user.email === value && user.id !== userData?.id
          );
          
          if (emailExists) {
            setErrors({ email: 'Email sudah digunakan' });
            setIsLoading(false);
            return;
          }
          
          updatedData = { email: value };
          break;
          
        case 'password':
          if (!value) {
            setErrors({ password: 'Password harus diisi' });
            setIsLoading(false);
            return;
          }
          
          // Update password (dalam produksi harus di-hash)
          updatedData = { password: value };
          
          // Clear password fields setelah save
          setFormData(prev => ({
            ...prev,
            password: '',
            confirmPassword: ''
          }));
          break;
          
        case 'birthday':
          updatedData = { birthday: value };
          break;
          
        case 'gender':
          updatedData = { gender: value };
          break;
          
        default:
          break;
      }

      // Update userData di state
      const updatedUser = { ...userData, ...updatedData };
      setUserData(updatedUser);
      
      // Update localStorage - USERDATA dan CURRENTUSER
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // YANG PENTING: UPDATE JUGA DI ARRAY USERS
      const updatedUsers = allUsers.map(user => 
        user.id === userData?.id ? { ...user, ...updatedData } : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Update form data (kecuali password)
      setFormData(prev => ({
        ...prev,
        ...updatedData,
        ...(field === 'password' ? { password: '', confirmPassword: '' } : {})
      }));
      
      // Tampilkan success message
      setSuccessMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} berhasil diupdate!`);

      window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: updatedUser }));
      
      // Keluar dari edit mode setelah 2 detik
      setTimeout(() => {
        setEditMode(prev => ({ ...prev, [field]: false }));
        setSuccessMessage('');
      }, 2000);

    } catch (error) {
      setErrors({ [field]: 'Terjadi kesalahan. Silakan coba lagi.' });
      console.error('Update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel edit
  const handleCancel = (field) => {
    setEditMode(prev => ({ ...prev, [field]: false }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    
    // Reset ke nilai semula
    if (userData) {
      setFormData(prev => ({
        ...prev,
        [field]: userData[field] || 
                (field === 'birthday' ? '01-Jan-2000' : 
                 field === 'gender' ? 'Female' : '')
      }));
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const avatarUrl = reader.result;
        
        // Update state
        setUserData(prev => ({ ...prev, avatar: avatarUrl }));
        
        // Update localStorage
        const updatedUser = { ...userData, avatar: avatarUrl };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Update users array
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = allUsers.map(user => 
          user.id === userData?.id ? { ...user, avatar: avatarUrl } : user
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Show success message
        setSuccessMessage('Foto profil berhasil diupdate!');
        setTimeout(() => setSuccessMessage(''), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan!')) {
      setIsLoading(true);
      
      try {
        // Hapus dari users array
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = storedUsers.filter(user => user.id !== userData?.id);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Hapus SEMUA session data
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('loginTime');
        
        // Reset state
        setUserData(null);
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          birthday: '',
          gender: 'Female'
        });
        
        // Redirect ke home
        navigate('/');
        
        // Show goodbye message
        alert('Akun berhasil dihapus. Selamat tinggal!');
        
      } catch (error) {
        console.error('Delete account error:', error);
        alert('Terjadi kesalahan saat menghapus akun.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle logout - PERBAIKI INI
  const handleLogout = () => {
    // Hapus SEMUA data user dari localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userData');
    localStorage.removeItem('loginTime');
    
    // Reset state userData ke null
    setUserData(null);

    // Kirim custom event untuk memberi tahu komponen lain
    window.dispatchEvent(new Event('userLoggedOut'));
    
    // Reset form data
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthday: '',
      gender: 'Female'
    });
    
    // Navigate ke home
    navigate('/');
  };

  // Jika belum login, tampilkan notifikasi
  if (!userData) {
    return (
      <div className="profile-main">
        <div className="profile-container">
          <div className="login-required-notification">
            <div className="notification-icon">
              <img src="/asset/lock.png" alt="Lock" />
            </div>
            <h2>Session Expired</h2>
            <p>Your session has ended. Please login or register to continue</p>
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn login-btn">
                Login Now
              </Link>
              <Link to="/register" className="auth-btn register-btn">
                Create Account
              </Link>
            </div>
            <p className="mt-3">
              Or return to <Link to="/">Home Page</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Background Animation */}
      <div className="anim-logo-fall-container">
        <img src="/asset/logo_game/coc.png" alt="logo" className="anim-falling-logo" />
        <img src="/asset/logo_game/mlbb.png" alt="logo" className="anim-falling-logo" />
        <img src="/asset/logo_game/valorant.png" alt="logo" className="anim-falling-logo" />
        <img src="/asset/logo_game/roblox.png" alt="logo" className="anim-falling-logo" />
        <img src="/asset/logo_game/coc.png" alt="logo" className="anim-falling-logo" />
        <img src="/asset/logo_game/mlbb.png" alt="logo" className="anim-falling-logo" />
        <img src="/asset/logo_game/valorant.png" alt="logo" className="anim-falling-logo" />
        <img src="/asset/logo_game/roblox.png" alt="logo" className="anim-falling-logo" />
        <img src="/asset/logo_game/coc.png" alt="logo" className="anim-falling-logo" />
        <img src="/asset/logo_game/mlbb.png" alt="logo" className="anim-falling-logo" />
        <img src="/asset/logo_game/valorant.png" alt="logo" className="anim-falling-logo" />
        <img src="/asset/logo_game/roblox.png" alt="logo" className="anim-falling-logo" />
      </div>

      {/* PROFILE */}
      <main className="profile-main">
        <section className="profile-container">
          
          {/* Success Message */}
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}

          {/* HEADER */}
          <section className="profile-header">
            <div className="avatar-wrapper">
              <img
                src={userData.avatar || "/asset/profile.png"}
                alt="Profile"
                className="profile-avatar"
              />
              <span className="level-badge">{userData.level || 1}</span>
              
              {/* Avatar Upload Button */}
              <div className="avatar-upload">
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="avatar-upload" className="avatar-upload-label">
                  <img src="/asset/camera.svg" alt="Edit avatar" width="20" />
                </label>
              </div>
            </div>

            <div className="profile-info">
              <h1 className="profile-name">
                {userData.username || "GUEST"}
                <span className="edit-icon">
                  <img 
                    src="/asset/pencil-circle.svg" 
                    alt="edit" 
                    onClick={() => toggleEditMode('username')}
                    style={{ cursor: 'pointer' }}
                  />
                </span>
              </h1>

              <div className="profile-details">
                <p>Join since: <span>{userData.joinDate || "15-Nov-2023"}</span></p>
                <p>
                  Bday: 
                  <span>
                    {editMode.birthday ? (
                      <input
                        type="text"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleInputChange}
                        placeholder="DD-MMM-YYYY"
                        className="inline-edit-input"
                      />
                    ) : (
                      userData.birthday || "01-Jan-2000"
                    )}
                    {editMode.birthday ? (
                      <>
                        <button 
                          onClick={() => handleSave('birthday')}
                          disabled={isLoading}
                          className="inline-save-btn"
                        >
                          {isLoading ? '...' : 'Save'}
                        </button>
                        <button 
                          onClick={() => handleCancel('birthday')}
                          className="inline-cancel-btn"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <img 
                        src="/asset/pencil-circle.svg" 
                        alt="edit" 
                        onClick={() => toggleEditMode('birthday')}
                        className="inline-edit-icon"
                      />
                    )}
                  </span>
                </p>
                <p>
                  Gender: 
                  <span>
                    {editMode.gender ? (
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="inline-edit-select"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      userData.gender || "Sex?"
                    )}
                    {editMode.gender ? (
                      <>
                        <button 
                          onClick={() => handleSave('gender')}
                          disabled={isLoading}
                          className="inline-save-btn"
                        >
                          {isLoading ? '...' : 'Save'}
                        </button>
                        <button 
                          onClick={() => handleCancel('gender')}
                          className="inline-cancel-btn"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <img 
                        src="/asset/pencil-circle.svg" 
                        alt="edit" 
                        onClick={() => toggleEditMode('gender')}
                        className="inline-edit-icon"
                      />
                    )}
                  </span>
                </p>
              </div>

              <div>
                <a className="security-link" href="#">Security Settings</a>
                <button 
                  className="logout-btn" 
                  onClick={handleLogout}
                  style={{
                    marginLeft: '15px',
                    background: 'transparent',
                    border: '1px solid #ff5555',
                    color: '#ff5555',
                    padding: '5px 15px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </section>

          {/* ACCOUNT SETTINGS */}
          <section className="account-settings">
            <h2>Account Settings</h2>

            {/* Username */}
            <div className="setting-item">
              <label>Username</label>
              {editMode.username ? (
                <div className="edit-mode-container">
                  <input 
                    type="text" 
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={errors.username ? 'error' : ''}
                  />
                  {errors.username && <span className="error-message">{errors.username}</span>}
                  <div className="edit-buttons">
                    <button 
                      onClick={() => handleSave('username')}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      onClick={() => handleCancel('username')}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <input 
                    type="text" 
                    value={userData.username || "user_name_123"} 
                    readOnly 
                  />
                  <button onClick={() => toggleEditMode('username')}>Edit</button>
                </>
              )}
            </div>

            {/* Email */}
            <div className="setting-item">
              <label>Email</label>
              {editMode.email ? (
                <div className="edit-mode-container">
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                  <div className="edit-buttons">
                    <button 
                      onClick={() => handleSave('email')}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      onClick={() => handleCancel('email')}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <input 
                    type="email" 
                    value={userData.email || "user@example.com"} 
                    readOnly 
                  />
                  <button onClick={() => toggleEditMode('email')}>Edit</button>
                </>
              )}
            </div>

            {/* Password */}
            <div className="setting-item">
              <label>Password</label>
              {editMode.password ? (
                <div className="edit-mode-container">
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="New password"
                    className={errors.password ? 'error' : ''}
                  />
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  {(errors.password || errors.confirmPassword) && (
                    <span className="error-message">
                      {errors.password || errors.confirmPassword}
                    </span>
                  )}
                  <div className="edit-buttons">
                    <button 
                      onClick={() => handleSave('password')}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      onClick={() => handleCancel('password')}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <input type="password" value="********" readOnly />
                  <button onClick={() => toggleEditMode('password')}>Edit</button>
                </>
              )}
            </div>

            {/* Delete Account */}
            <div className="setting-item danger">
              <button 
                className="delete-btn"
                onClick={handleDeleteAccount}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </section>

        </section>
      </main>
    </>
  );
};

export default Profile;