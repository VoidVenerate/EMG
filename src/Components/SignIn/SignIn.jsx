import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';
import ForgotPasswordModal from '../ForgotPasswordModal/ForgotPasswordModal'

const SignIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // This is the only state you need for forgot password now
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isTurnupEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@exodusmusicgroup\.com$/.test(email);

  const extractErrorMessage = (err, fallback) => {
    if (!err.response) return "Network error. Please try again.";
    const data = err.response.data;
    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (data.error) return data.error;
    return fallback;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    if (!isTurnupEmail(formData.email)) {
      setError("Only @exodusmusicgroup.com emails are allowed");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://exodus-va6e.onrender.com/auth/login",
        { email: formData.email, password: formData.password }
      );

      localStorage.setItem("token", res.data.access_token);
      setModalMessage("Login successful!");
      setShowSuccessModal(true);

      setTimeout(() => {
        navigate("/adminhome");
      }, 1500);
    } catch (err) {
      setError(extractErrorMessage(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="auth-nav">
        <img src="/emg-logo.png" alt="Logo" width={'179px'} style={{alignItems:'flex-start'}}/>
      </div>

      <div className="form-panel">
        <h2>Sign In</h2>
        <p>Enter your email and password to sign in.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-fields">
            <label>Email <span>*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="mail@simmmple.com"
            />

            <label>Password <span>*</span></label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
              <span onClick={() => setShowPassword(!showPassword)} className="toggle-icon">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading} className='sign-up-submit'>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p onClick={() => navigate("/signup")} className="toggle-link">
          Don't have an account? <span style={{color:'#DFA123'}}>Sign Up</span>
        </p>

        {/* Updated: Now opens the ForgotPasswordModal */}
        <p 
          onClick={() => setShowForgotPasswordModal(true)} 
          className="toggle-link" 
          style={{color:'#0084FF', cursor: 'pointer'}}
        >
          Forgot Password?
        </p>
      </div>

      {/* Success Modal for login */}
      <Modal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title=""
        message={modalMessage}
        type="success"
        subMessage='Redirecting...'
      />

      {/* NEW: Forgot Password Modal - handles everything internally */}
      <ForgotPasswordModal
        show={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </div>
  );
};

export default SignIn;