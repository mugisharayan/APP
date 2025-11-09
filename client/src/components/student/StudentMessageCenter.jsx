import React, { useState } from 'react';

const StudentMessageCenter = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, from: 'custodian', message: 'Your maintenance request has been received', time: '10:30 AM', read: true },
    { id: 2, from: 'student', message: 'When will the plumber arrive?', time: '11:15 AM', read: true },
    { id: 3, from: 'custodian', message: 'The plumber will arrive tomorrow at 2 PM', time: '2:45 PM', read: false }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const message = {
      id: Date.now(),
      from: 'student',
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    };
    setMessages([...messages, message]);
    setNewMessage('');
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