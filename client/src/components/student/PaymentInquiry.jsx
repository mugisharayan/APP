import React, { useState } from 'react';

const PaymentInquiry = ({ isOpen, onClose }) => {
  const [inquiryType, setInquiryType] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send payment inquiry to custodian
    console.log('Payment inquiry:', { inquiryType, message });
    alert('Payment inquiry sent to custodian!');
    setInquiryType('');
    setMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3><i className="fas fa-credit-card"></i> Payment Inquiry</h3>
          <button className="close-modal-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Inquiry Type</label>
            <select value={inquiryType} onChange={(e) => setInquiryType(e.target.value)} required>
              <option value="">Select inquiry type</option>
              <option value="due-date">Payment Due Date</option>
              <option value="dispute">Dispute Charge</option>
              <option value="confirmation">Payment Confirmation</option>
              <option value="extension">Payment Extension</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your payment inquiry..."
              rows="4"
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn secondary">Cancel</button>
            <button type="submit" className="btn primary">Send Inquiry</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentInquiry;