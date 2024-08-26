import React, { useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import './Signup.css';

const SignupForm = () => {
    // State variables to hold form data
    const [email, setEmail] = useState('');
    const [user_name, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const onSubmit = (event) => {

        event.preventDefault();

        // Validate password match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Data to be sent to the backend
        const data = {
            email,
            user_name,
            password,
        };

        // Post request to register endpoint
        axios.post("http://localhost:3001/register", data)
            .then((response) => {
                console.log(response);
                navigate('/login')
            })
            .catch((error) => {
                console.error('Error: ', error);
            });
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <form className="signup-form" onSubmit={onSubmit}>
                    <h2>Signup</h2>
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
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button className="signup-btn" type="submit">Signup</button>
                    <div className="social-login">
                        <p>Or signup with</p>
                        <div className="social-buttons">
                            <div className="social-btn facebook">Facebook</div>
                            <div className="social-btn google">Google</div>
                        </div>
                    </div>
                    <div className="login-text">
                        <p>Already a member? <a href="#">Login now</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignupForm;
