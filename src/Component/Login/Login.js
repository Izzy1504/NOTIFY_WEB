import React from 'react';
import './Login.css';

const LoginForm = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <form className="login-form">
          <h2>Welcome</h2>
          <div className="input-group">
            <input type="text" placeholder="Email or Username" />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password" />
          </div>
          <button className="login-btn">Login</button>
          <div className="social-login">
            <p>Or login with</p>
            <div className="social-buttons">
              <div className="social-btn facebook">Facebook</div>
              <div className="social-btn google">Google</div>
            </div>
          </div>
          <div className="signup-text">
            <p>Not a member? <a href="#">Signup now</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
