import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Reset.css';
import '../styles/Animations.css';

const Reset = () => {
  return (
    <>
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

      <main className='reset-main'>
        <div className="reset-container">
          <h2>Reset Password</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username/Email</label>
              <input type="text" className="form-control" id="username" placeholder="Enter your username/email" />
            </div>

            <div className="mb-3">
              <label htmlFor="new-password" className="form-label">New Password</label>
              <input type="password" className="form-control" id="new-password" placeholder="Enter your new password" />
            </div>

            <div className="mb-3">
              <label htmlFor="confirm-password" className="form-label">Confirm New Password</label>
              <input type="password" className="form-control" id="confirm-password" placeholder="Confirm your new password" />
            </div>

            <button type="submit" className="btn btn-primary">Reset</button>

            <div className="row mt-3">
              <div className="col-6 reset-link">
                <div className="mb-3">
                  <div className="login-link">
                    <Link to="/login">Login</Link>
                  </div>
                </div>
              </div>
              <div className="col-6 text-end">
                <div className="mb-3">
                  <div className="register-link">
                    <Link to="/register">Don't have an account? Register</Link>
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

export default Reset;