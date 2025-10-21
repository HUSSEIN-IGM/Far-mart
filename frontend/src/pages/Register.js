import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    user_type: 'user',
    phone: '',
    address: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log('🔍 Register component - Current state:', { 
      error, 
      isAuthenticated, 
      isLoading 
    });
    
    if (error) {
      console.error('❌ Registration error:', error);
      toast.error(`Registration failed: ${error}`);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    console.log('🔍 Register component - Authentication state changed:', isAuthenticated);
    
    if (isAuthenticated) {
      console.log('✅ Registration successful - navigating to home');
      toast.success('Registration successful!');
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 Form submitted with data:', formData);
    
    // Basic validation
    if (!formData.email || !formData.password || !formData.first_name || !formData.last_name) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    console.log('🚀 Dispatching register action...');
    
    try {
      // Use unwrap() to get the actual result and catch errors properly
      const result = await dispatch(register(formData)).unwrap();
      console.log('🎉 Registration successful with result:', result);
    } catch (error) {
      console.error('💥 Registration failed with error:', error);
      // The error will be handled by the useEffect above
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Join Farmart</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password * (min 6 characters)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>
          <div className="form-group">
            <label>I am a:</label>
            <select
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
            >
              <option value="user">Buyer</option>
              <option value="farmer">Farmer</option>
            </select>
          </div>
          <div className="form-group">
            <label>Phone (Optional)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Address (Optional)</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
        
        {/* Debug info - remove this in production */}
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          background: '#f5f5f5', 
          borderRadius: '5px',
          border: '1px solid #ddd'
        }}>
          <h4>🔧 Debug Information:</h4>
          <p><strong>Loading:</strong> {isLoading ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Error:</strong> {error || 'None'}</p>
          <p><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Form Data:</strong> {JSON.stringify(formData)}</p>
        </div>
      </div>
    </div>
  );
};

export default Register;