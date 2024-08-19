import React from 'react'
import './Signup.css'

const signupForm = () => {
    return (
        <div className="signup-page">
            <div className="signup-container">
                <form className="signup-form">
                    <h2>Signup</h2>
                    <div className="input-group">
                        <input type="text" placeholder="Email" />
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder="Password" />
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder="Confirm Password" />
                    </div>
                    <button className="signup-btn">Signup</button>
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
    )
}

export default signupForm;