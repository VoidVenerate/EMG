import React, { useState } from 'react';
import { Check, XCircle, Mail, Lock, KeyRound } from 'lucide-react';

const Modal = ({ show, onClose, title, message, subMessage, type, footerButtons, titleAlign = "left" }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-container ${type}`}
        onClick={e => e.stopPropagation()}
      >
        {type === 'success' && (
          <div className="circle-wrapper">
            <Check className="modal-icon success-icon" />
          </div>
        )}
        {type === 'error' && (
          <div className="circle-wrapper">
            <XCircle className="modal-icon error-icon" />
          </div>
        )}

        <h2 className={`modal-title ${titleAlign}`}>{title}</h2>
        <div className="modal-message">{message}</div>
        {subMessage && <div className="modal-subMessage">{subMessage}</div>}

        <div className="modal-footer">
          {footerButtons}
        </div>
      </div>
    </div>
  );
};

const ForgotPasswordModal = ({ show, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResultModal, setShowResultModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const API_BASE_URL = 'https://exodus-va6e.onrender.com'; // Replace with your actual API URL

  const showSuccessModal = (title, message, subMessage, onCloseAction) => {
    setModalConfig({
      type: 'success',
      title,
      message,
      subMessage,
      onClose: onCloseAction || (() => setShowResultModal(false))
    });
    setShowResultModal(true);
  };

  const showErrorModal = (title, message, subMessage) => {
    setModalConfig({
      type: 'error',
      title,
      message,
      subMessage,
      onClose: () => setShowResultModal(false)
    });
    setShowResultModal(true);
  };

  const handleRequestOTP = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        showSuccessModal(
          'Check Your Email',
          'A 6-digit OTP has been sent to your email address.',
          'Please check your inbox and enter the code below to reset your password.',
          () => {
            setShowResultModal(false);
            setStep(2);
          }
        );
      } else {
        showErrorModal(
          'Request Failed',
          data.detail || 'Unable to send reset code.',
          'Please check your email address and try again.'
        );
      }
    } catch (err) {
      showErrorModal(
        'Connection Error',
        'Unable to connect to the server.',
        'Please check your internet connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showSuccessModal(
          'Password Reset Successful',
          'Your password has been reset successfully.',
          'You can now login with your new password.',
          () => {
            setShowResultModal(false);
            setStep(1);
            setEmail('');
            setOtp('');
            setNewPassword('');
            setConfirmPassword('');
            onClose();
          }
        );
      } else {
        showErrorModal(
          'Reset Failed',
          data.detail || 'Unable to reset password.',
          'Please check your OTP and try again.'
        );
      }
    } catch (err) {
      showErrorModal(
        'Connection Error',
        'Unable to connect to the server.',
        'Please check your internet connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-container" onClick={e => e.stopPropagation()} style={{background:'#04060C', border:'1px solid #FFFFFF33', padding: '16px 32px'}}>
          {/* Icon Circle */}
          <div className="circle-wrapper">
            {step === 1 ? (
              <Mail className="modal-icon duration-icon" />
            ) : (
              <KeyRound className="modal-icon duration-icon" />
            )}
          </div>

          {/* Title */}
          <h2 className="modal-title left">
            {step === 1 ? 'Forgot Password?' : 'Reset Password'}
          </h2>

          {/* Message */}
          <div className="modal-message" style={{fontSize:'16px'}}>
            {step === 1 
              ? "Enter your email address and we'll send you a code to reset your password."
              : `Enter the 6-digit code sent to ${email} and your new password.`
            }
          </div>

          {/* Form Fields */}
          {step === 1 ? (
            <div style={{ width: '100%', marginTop: '10px' }}>
              <label style={{ color: '#ccc', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleRequestOTP)}
                placeholder="user@example.com"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#000',
                  border: '1px solid #292929',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          ) : (
            <div style={{ width: '100%', marginTop: '10px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#ccc', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  placeholder="000000"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#000',
                    border: '1px solid #292929',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    letterSpacing: '4px',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#ccc', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#000',
                    border: '1px solid #292929',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#ccc', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleResetPassword)}
                  placeholder="Confirm new password"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#000',
                    border: '1px solid #292929',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {error && (
                <div style={{ 
                  color: '#ef4444', 
                  fontSize: '14px', 
                  marginBottom: '16px',
                  padding: '10px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '6px',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}>
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="modal-btn-group">
            {step === 1 ? (
              <>
                <button
                  onClick={handleRequestOTP}
                  disabled={loading || !email}
                  className="modal-close-btn-primary"
                  style={{ opacity: loading || !email ? 0.5 : 1 }}
                >
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </button>
                <button onClick={handleClose} className="modal-close-btn">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleResetPassword}
                  disabled={loading || !otp || !newPassword || !confirmPassword}
                  className="modal-close-btn-primary"
                  style={{ opacity: loading || !otp || !newPassword || !confirmPassword ? 0.5 : 1 }}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setOtp('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setError('');
                  }}
                  className="modal-close-btn"
                >
                  Back
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Success/Error Modal */}
      <Modal
        show={showResultModal}
        onClose={modalConfig.onClose}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        subMessage={modalConfig.subMessage}
        footerButtons={
          <button
            onClick={modalConfig.onClose}
            className="modal-close-btn-primary"
          >
            {modalConfig.type === 'success' && step === 2 ? 'Continue' : 'Close'}
          </button>
        }
      />
    </>
  );
};
export default ForgotPasswordModal;