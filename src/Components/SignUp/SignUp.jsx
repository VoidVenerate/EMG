import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';
import UploadProfileModal from '../UploadProfileModal/UploadProfileModal';
import './SignUp.css';

const Signup = ({ signUpKey }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profile_picture: null,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isPasswordStrong = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-[\]{};':"\\|,.<>/?`~\-]).{8,}$/.test(password);

  const isTurnupEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@exodusmg\.com$/.test(email);

  const validateSignUpFields = () => {
    const errors = {};
    if (!formData.first_name.trim()) errors.first_name = "First name is required";
    if (!formData.last_name.trim()) errors.last_name = "Last name is required";

    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!isTurnupEmail(formData.email)) errors.email = "Only @exodusmg.com emails are allowed";

    if (!formData.password) errors.password = "Password is required";
    else if (!isPasswordStrong(formData.password))
      errors.password = "Password must be 8+ chars, include uppercase, lowercase, number, and special character.";

    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!validateSignUpFields()) return;
    setShowUploadModal(true);
  };

  const handleFinalSignup = async () => {
    setShowUploadModal(false);
    setLoading(true);

    try {
      const signupData = new FormData();
      signupData.append("first_name", formData.first_name);
      signupData.append("last_name", formData.last_name);
      signupData.append("email", formData.email);
      signupData.append("password", formData.password);
      if (formData.profile_picture) signupData.append("profile_picture", formData.profile_picture);

      await axios.post(
        "https://exodus-va6e.onrender.com/auth/signup",
        signupData,
      );

      setModalMessage("Signup successful! Please log in.");
      setShowSuccessModal(true);

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(extractErrorMessage(err, "Signup failed"));
    } finally {
      setLoading(false);
    }
  };
  const extractErrorMessage = (err, fallback) => {
    console.error("Signup error object:", err);

    // Axios never got a response (CORS, network, server down)
    if (!err.response) {
        console.error("No response received from server");
        console.error("Request:", err.request);
        return "Network error. Please try again.";
    }

    console.log("Error response status:", err.response.status);
    console.log("Error response headers:", err.response.headers);
    console.log("Error response data:", err.response.data);

    const data = err.response.data;

    if (typeof data === "string") {
        console.error("Server returned string error:", data);
        return data;
    }

    if (data.message) {
        console.error("Server message:", data.message);
        return data.message;
    }

    if (data.error) {
        console.error("Server error field:", data.error);
        return data.error;
    }

    if (data.detail) {
        console.error("Server detail:", data.detail);
        return data.detail;
    }

    if (data.errors) {
        const firstKey = Object.keys(data.errors)[0];
        console.error("Validation errors:", data.errors);
        return data.errors[firstKey][0];
    }

    console.error("Unhandled error format, fallback used");
    return fallback;
    };

  return (
    <div className="signup-container">
        <div className="auth-nav">
            <img src="/emg-logo.png" alt="" width={'179px'} style={{alignItems:'flex-start'}}/>
        </div>
      <div className="form-panel">
        <h2>Sign Up</h2>
        <p>Sign up to manage events, banners, and more on TurnupLagos.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-fields">
            <label>First Name <span>*</span></label>
            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className={fieldErrors.first_name ? 'error-input' : ''} placeholder="Enter your first name" />
            {fieldErrors.first_name && <p className="field-error">{fieldErrors.first_name}</p>}

            <label>Last Name <span>*</span></label>
            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className={fieldErrors.last_name ? 'error-input' : ''} placeholder="Enter your last name" />
            {fieldErrors.last_name && <p className="field-error">{fieldErrors.last_name}</p>}

            <label>Email <span>*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={fieldErrors.email ? 'error-input' : ''} placeholder="mail@simmmple.com" />
            {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}

            <label>Password <span>*</span></label>
            <div className="password-input">
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className={fieldErrors.password ? 'error-input' : ''} placeholder="Enter password" />
              <span onClick={() => setShowPassword(!showPassword)} className="toggle-icon">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
            </div>

            <label>Confirm Password <span>*</span></label>
            <div className="password-input">
              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={fieldErrors.confirmPassword ? 'error-input' : ''} placeholder="Confirm your password" />
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="toggle-icon">
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {fieldErrors.confirmPassword && <p className="field-error">{fieldErrors.confirmPassword}</p>}
            </div>
          </div>

          {error && <p className="error" style={{color:"#ff4444"}}>{error}</p>}
          <button className='sign-up-submit' type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
        </form>

        <p onClick={() => navigate("/login")} className="toggle-link">
          Already have an account? <span style={{color:'#DFA123'}}>Sign In</span>
        </p>
      </div>

      <UploadProfileModal
        show={showUploadModal}
        onClose={handleFinalSignup}
        onFileSelect={(file) => setFormData({ ...formData, profile_picture: file })}
      />

      <Modal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title=""
        message={modalMessage}
        type="success"
        subMessage='Redirecting...'
      />
    </div>
  );
};

export default Signup;
