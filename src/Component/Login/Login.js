import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";

const LoginForm = () => {
  const navigate = useNavigate();

  const [user_name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page

    try {
      // Corrected axios.post call
      const response = await axios.post("http://localhost:3001/login", {
        user_name,
        password,
        email,
      });

      if (response.status === 200) {
        // Navigate to the dashboard
        navigate("/home");
      }
    } catch (err) {
      // Set error message if login fails
      setError("Invalid username or password! Please try again.");
      console.error(err);
    }
  };

  const handleSignupClick = () => {
    navigate("/signup"); // Navigate to the Signup page
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form className="login-form" onSubmit={onSubmit}>
          <h2>Notify-Login</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={user_name}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-btn">
            Login
          </button>
          <div className="social-login">
            <p>Or login with</p>
            <div className="social-buttons">
              <div className="social-btn facebook">Facebook</div>
              <div className="social-btn google">Google</div>
            </div>
          </div>
          <div className="signup-text">
            <p>
              Not a member?{" "}
              <button type="button" onClick={handleSignupClick}>
                Signup now
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
