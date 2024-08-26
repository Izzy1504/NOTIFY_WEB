import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Login.css';

const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (event) => {
    axios.get()
  }
  const handleSignupClick = () => {
    navigate('/signup'); // Navigate to the Signup page
  };

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
          <button type="button" className="login-btn">Login</button>
          <div className="social-login">
            <p>Or login with</p>
            <div className="social-buttons">
              <div className="social-btn facebook">Facebook</div>
              <div className="social-btn google">Google</div>
            </div>
          </div>
          <div className="signup-text">
            <p>Not a member? <button type="button" onClick={handleSignupClick}>Signup now</button></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
