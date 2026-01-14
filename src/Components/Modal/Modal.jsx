// Modal.jsx
import React from 'react';
import { BookImage, Check, LogOut, MessageSquareWarning, XCircle } from 'lucide-react';
import './Modal.css';

const Modal = ({ show, onClose, title, message, subMessage, type, footerButtons, titleAlign = "center" }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-container ${type}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="iconxtitle">
          {/* === Circle Icon === */}
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
          {type === 'logout' && (
            <div className="circle-wrapper">
              <LogOut className="modal-icon logout-icon" />
            </div>
          )}
          {type === 'duration' && (
            <div className="circle-wrapper">
              <MessageSquareWarning className="modal-icon duration-icon" />
            </div>
          )}
          {type === 'image' && (
            <div className="circle-wrapper">
              <BookImage className="modal-icon image-icon" />
            </div>
          )}

          {/* === Title === */}
          <h2 className={`modal-title ${titleAlign}`}>{title}</h2>

        </div>
        {/* === Message Content === */}
        <div className="modal-message">{message}</div>
        {subMessage && <div className="modal-subMessage">{subMessage}</div>}

        <div className="modal-footer">
          {footerButtons}
        </div>
      </div>
    </div>
  );
};

export default Modal;