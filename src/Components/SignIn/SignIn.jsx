import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';

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

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

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

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setModalMessage("Please enter your email");
      setShowSuccessModal(true);
      return;
    }

    if (!isTurnupEmail(forgotEmail)) {
      setModalMessage("Only @exodusmusicgroup.com emails are allowed");
      setShowSuccessModal(true);
      return;
    }

    setForgotLoading(true);
    try {
      await axios.post("/email/send-otp-email", {
        to_email: forgotEmail,
        recipient_name: "User",
      });

      setModalMessage("OTP sent! Check your email.");
      setShowSuccessModal(true);
      setShowForgotModal(false);
    } catch (err) {
      setModalMessage(err.response?.data?.message || "Failed to send reset email");
      setShowSuccessModal(true);
    } finally {
      setForgotLoading(false);
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

        <p onClick={() => setShowForgotModal(true)} className="toggle-link" style={{color:'#0084FF'}}>
          Forgot Password?
        </p>
      </div>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title=""
        message={modalMessage}
        type="success"
        subMessage='Redirecting...'
      />

      {/* Forgot Password Modal */}
      <Modal
        show={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Forgot Password"
        message="Enter your email to receive a reset OTP."
        type="info"
        footerButtons={
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
            />
            <button onClick={handleForgotPassword} disabled={forgotLoading}>
              {forgotLoading ? 'Sending...' : 'Send Reset Email'}
            </button>
          </>
        }
      />
    </div>
  );
};

export default SignIn;
