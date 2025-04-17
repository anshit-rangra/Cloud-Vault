import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaCloud } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { sendOtp } from '../../api/apiCalls';

const Register = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData)
      const enter = await sendOtp(formData)

    console.log(enter)
    if(enter.message == 'OTP sent'){
      navigate('/register/otp')
    }
    } catch (error) {
      console.log(error)
    }
    
    
    
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <FaCloud className="auth-icon" />
          <h2>Create Your CloudVault Account</h2>
          <p>Start your secure cloud storage journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              placeholder="Enter your mobile number"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="password-hints">
              <span className={formData.password.length >= 8 ? 'valid' : ''}>
                • 8+ characters
              </span>
              <span className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
                • Uppercase
              </span>
              <span className={/\d/.test(formData.password) ? 'valid' : ''}>
                • Number
              </span>
            </div>
          </div>

          <div className="terms-agreement">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <Link to="/register">Terms of Service</Link> and <Link to="/register">Privacy Policy</Link>
            </label>
          </div>

          <button type="submit" className="auth-btn">
            Register
          </button>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;