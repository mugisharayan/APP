import React, { useState, useEffect } from 'react';
import communicationService from '../../service/communication.service';

const StudentMessageCenter = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await communicationService.getMessages();
      setMessages(data);
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      setLoading(true);
      const messageData = await communicationService.sendMessage({
        message: newMessage.trim(),
        recipientType: 'custodian'
      });
      
      const formattedMessage = {
        id: messageData._id,
        from: 'student',
        message: messageData.message,
        time: new Date(messageData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true
      };
      
      setMessages([...messages, formattedMessage]);
      setNewMessage('');
      setError('');
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
          {messages.map(msg => (
            <div key={msg.id} className={`message-item ${msg.from}`}>
              <div className="message-content">
                <p>{msg.message}</p>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="message-input-area">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} className="btn primary">
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentMessageCenter;