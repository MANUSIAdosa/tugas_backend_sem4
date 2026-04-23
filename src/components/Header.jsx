import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const [userData, setUserData] = useState(null);

  // Load user data dari localStorage saat komponen mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const currentUser = localStorage.getItem('currentUser');
        
        // Cek apakah user login (ada authToken)
        if (authToken && currentUser) {
          const user = JSON.parse(currentUser);
          setUserData(user);
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setUserData(null);
      }
    };

    loadUserData();
    
    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'currentUser' || e.key === 'authToken') {
        loadUserData();
      }
    };

    // Listen for custom events
    const handleUserLoggedIn = () => {
      console.log('User logged in event received');
      loadUserData();
    };

    const handleUserLoggedOut = () => {
      console.log('User logged out event received');
      setUserData(null);
    };

    const handleUserDataUpdated = (e) => {
      console.log('User data updated event received', e.detail);
      if (e.detail) {
        setUserData(e.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLoggedIn', handleUserLoggedIn);
    window.addEventListener('userLoggedOut', handleUserLoggedOut);
    window.addEventListener('userDataUpdated', handleUserDataUpdated);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
      window.removeEventListener('userLoggedOut', handleUserLoggedOut);
      window.removeEventListener('userDataUpdated', handleUserDataUpdated);
    };
  }, []);

  return (
    <header>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <img src="/asset/logo.png" alt="icon_game" width="120px" />
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/promo">Promo</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/contact">Contact</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/login">Login</Link>
              </li>
            </ul>
            <form className="d-flex" role="search">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-primary" style={{ marginRight: '10px' }} type="submit">Search</button>
            </form>
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <img 
                    src={userData?.avatar || "/asset/user.png"} 
                    alt="profile.png" 
                    className="header-profile-icon" 
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginRight: '8px',
                      border: userData ? '2px solid #00f2ff' : 'none'
                    }}
                  />
                  <span style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: '500',
                    color: userData ? '#00f2ff' : '#fff'
                  }}>
                    {userData?.username || 'GUEST'}
                  </span>
                  {userData && (
                    <span style={{
                      marginLeft: '8px',
                      fontSize: '0.7rem',
                      background: 'linear-gradient(135deg, #7000ff, #a100ff)',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      fontWeight: 'bold'
                    }}>
                      Lvl {userData.level || 1}
                    </span>
                  )}
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/profile">View Profile</Link></li>
                  <li><Link className="dropdown-item" to="/history">History</Link></li>
                  <li><Link className="dropdown-item" to="/point">Point</Link></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;