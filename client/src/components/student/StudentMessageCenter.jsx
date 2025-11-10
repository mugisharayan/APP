import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../features/auth/AuthContext';
import apiService from '../../service/api.service';

const StudentMessageCenter = ({ isOpen, onClose }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hostelId, setHostelId] = useState(null);
  const { userProfile } = useContext(AuthContext);

  useEffect(() => {
    if (isOpen) {
      loadMessages();
      // Find hostel ID from user's bookings or default to first hostel
      setHostelId('673f8b8b123456789abcdef0'); // Default hostel ID for demo
    }
  }, [isOpen]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await apiService.messages.getAll();
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !hostelId) return;
    
    try {
      setLoading(true);
      await apiService.messages.send(hostelId, newMessage.trim());
      setNewMessage('');
      setError('');
      await loadMessages(); // Reload messages
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && onClose()}>
      <div className="modal-content message-center-modal">
        <div className="modal-header">
          <h3><i className="fas fa-comments"></i> Message Custodian</h3>
          <button className="close-modal-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="message-list">
          {loading ? (
            <p>Loading messages...</p>
          ) : messages.length === 0 ? (
            <p>No messages yet. Start a conversation!</p>
          ) : (
            messages.map(msg => (
              <div key={msg._id} className={`message-item ${msg.senderRole}`}>
                <div className="message-content">
                  <div className="message-header">
                    <strong>{msg.sender.name}</strong>
                    <span className="message-time">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="message-input-area">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage} className="btn primary" disabled={loading}>
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentMessageCenter;