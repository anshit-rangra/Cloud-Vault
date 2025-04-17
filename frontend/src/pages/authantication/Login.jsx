import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaCloud } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/apiCalls';

const Login = () => {
  
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
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
      const response = await login(formData)
      if(response.message == "User LoggedIn sucessfully !"){
        navigate('/')
        window.location.reload()
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
          <h2>Welcome Back to CloudVault</h2>
          <p>Secure access to your cloud storage</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="tel"
              id="name"
              name="name"
              placeholder="Enter your username"
              value={formData.name}
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
                placeholder="Enter your password"
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
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="auth-btn">
            Login
          </button>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;