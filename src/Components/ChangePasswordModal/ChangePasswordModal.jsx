import React, { useState } from 'react';
import { Check, XCircle, KeyRound, Mail, ShieldHalf } from 'lucide-react';

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

const ForgotPasswordModal = ({ show, onClose, onBackToChangePassword }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const API_BASE_URL = 'https://exodus-va6e.onrender.com';

  const showSuccessModal = (title, message, subMessage) => {
    setModalConfig({
      type: 'success',
      title,
      message,
      subMessage,
      onClose: () => {
        setShowResultModal(false);
        setEmail('');
        onClose();
      }
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

  const handleForgotPassword = async () => {
    if (!email || !email.includes('@')) {
      showErrorModal(
        'Invalid Email',
        'Please enter a valid email address.',
        ''
      );
      return;
    }

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
          'Reset Link Sent',
          'Password reset instructions have been sent to your email.',
          'Please check your inbox and follow the instructions.'
        );
      } else {
        showErrorModal(
          'Request Failed',
          data.detail || 'Unable to send reset link.',
          'Please verify your email and try again.'
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

  const handleClose = () => {
    setEmail('');
    onClose();
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-overlay" onClick={handleClose} style={{fontFamily:'DM Sans'}}>
        <div className="modal-container" onClick={e => e.stopPropagation()}>
          {/* Icon Circle */}
          <div className="circle-wrapper">
            <Mail className="modal-icon duration-icon" />
          </div>

          {/* Title */}
          <h2 className="modal-title left">Forgot Password</h2>

          {/* Message */}
          <div className="modal-message">
            Enter your email address and we'll send you instructions to reset your password.
          </div>

          {/* Form Fields */}
          <div style={{ width: '100%', marginTop: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#ccc', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleForgotPassword()}
                placeholder="Enter your email"
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

            {/* Buttons */}
            <div className="modal-btn-group">
              <button
                onClick={handleForgotPassword}
                disabled={loading || !email}
                className="modal-close-btn-primary"
                style={{ opacity: loading || !email ? 0.5 : 1 }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <button onClick={handleClose} className="modal-close-btn">
                Cancel
              </button>
            </div>

            {/* Back to Change Password Link */}
            {onBackToChangePassword && (
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onBackToChangePassword();
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#0084FF',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  Back to Change Password
                </button>
              </div>
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
            Close
          </button>
        }
      />
    </>
  );
};

const ChangePasswordModal = ({ show, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResultModal, setShowResultModal] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const API_BASE_URL = 'https://exodus-va6e.onrender.com';
  const token = localStorage.getItem('token');

  const isPasswordStrong = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

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

  const handleChangePassword = async () => {
    setError('');

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (!isPasswordStrong(newPassword)) {
      setError('Password must be 8+ chars with uppercase, lowercase, number, and special character');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showSuccessModal(
          'Password Changed Successfully',
          'Your password has been updated.',
          'You can now use your new password to login.',
          () => {
            setShowResultModal(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setError('');
            onClose();
          }
        );
      } else {
        showErrorModal(
          'Change Failed',
          data.detail || 'Unable to change password.',
          'Please check your current password and try again.'
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
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleBackToChangePassword = () => {
    setShowForgotPassword(false);
  };

  if (!show) return null;

  return (
    <>
      {/* Change Password Modal */}
      {!showForgotPassword && (
        <div className="modal-overlay" onClick={handleClose} style={{fontFamily:'DM Sans'}}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
             {/* Icon Circle */}
                <div className="circle-wrapper">
                <ShieldHalf className="modal-icon duration-icon" />
                </div>

                {/* Title */}
                <h2 className="modal-title left">Change Password</h2>

            {/* Message */}
            <div className="modal-message">
              Enter your current password and choose a new secure password.
            </div>

            {/* Form Fields */}
            <div style={{ width: '100%', marginTop: '10px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#ccc', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
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
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleChangePassword)}
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

              {/* Buttons */}
              <div className="modal-btn-group">
                <button
                  onClick={handleChangePassword}
                  disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                  className="modal-close-btn-primary"
                  style={{ opacity: loading || !currentPassword || !newPassword || !confirmPassword ? 0.5 : 1 }}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
                <button onClick={handleClose} className="modal-close-btn">
                  Cancel
                </button>
              </div>

              {/* Forgot Password Link */}
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={handleForgotPasswordClick}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#0084FF',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  Forgot your current password?
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        show={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onBackToChangePassword={handleBackToChangePassword}
      />

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
            Close
          </button>
        }
      />
    </>
  );
};

export { ChangePasswordModal, ForgotPasswordModal };
export default ChangePasswordModal;