import React, { useState, useEffect } from 'react';

const CustodianMessageCenter = ({ isOpen, onClose }) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const conversations = [
    { 
      id: 1, 
      student: 'Sarah Johnson', 
      studentId: 'ST001',
      room: 'A-104',
      lastMessage: 'Payment confirmation needed for Room A-104', 
      time: '2 min ago', 
      unread: true,
      type: 'payment',
      priority: 'high'
    },
    { 
      id: 2, 
      student: 'Michael Chen', 
      studentId: 'ST002',
      room: 'B-205',
      lastMessage: 'Maintenance request - broken faucet', 
      time: '1 hour ago', 
      unread: false,
      type: 'maintenance',
      priority: 'medium'
    },
    { 
      id: 3, 
      student: 'Emma Wilson', 
      studentId: 'ST003',
      room: 'C-301',
      lastMessage: 'Check-in instructions needed', 
      time: '3 hours ago', 
      unread: true,
      type: 'booking',
      priority: 'low'
    }
  ];

  const messages = selectedConversation ? [
    { 
      id: 1, 
      sender: selectedConversation.student, 
      message: 'Hi, I need help with my payment confirmation for Room A-104', 
      time: '10:30 AM', 
      isStudent: true,
      type: 'text'
    },
    { 
      id: 2, 
      sender: 'You', 
      message: 'I can help you with that. Let me check your payment status.', 
      time: '10:35 AM', 
      isStudent: false,
      type: 'text'
    },
    { 
      id: 3, 
      sender: 'You', 
      message: 'Your payment has been received and processed. You should receive a confirmation email shortly.', 
      time: '10:37 AM', 
      isStudent: false,
      type: 'text'
    }
  ] : [];

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // Add message logic here
      setNewMessage('');
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'payment': return 'fa-credit-card';
      case 'maintenance': return 'fa-wrench';
      case 'booking': return 'fa-calendar';
      default: return 'fa-message';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="message-center-overlay">
      <div className="message-center-container">
        {/* Conversations Sidebar */}
        <div className="conversations-sidebar">
          <div className="conversations-header">
            <h4><i className="fas fa-comments"></i> Student Messages</h4>
            <button onClick={onClose} className="close-btn">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="message-controls">
            <div className="search-wrapper">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-tabs">
              <button 
                className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                All
              </button>
              <button 
                className={`filter-tab ${filterType === 'unread' ? 'active' : ''}`}
                onClick={() => setFilterType('unread')}
              >
                Unread
              </button>
              <button 
                className={`filter-tab ${filterType === 'priority' ? 'active' : ''}`}
                onClick={() => setFilterType('priority')}
              >
                Priority
              </button>
            </div>
          </div>

          <div className="conversations-list">
            {conversations
              .filter(conv => {
                if (filterType === 'unread') return conv.unread;
                if (filterType === 'priority') return conv.priority === 'high';
                return true;
              })
              .filter(conv => 
                conv.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
                conv.room.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(conv => (
                <div 
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''}`}
                >
                  <div className="conversation-avatar">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${conv.student}&background=0ea5e9&color=fff`}
                      alt={conv.student}
                    />
                    {conv.unread && <div className="unread-indicator"></div>}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <h5>{conv.student}</h5>
                      <div className="conversation-meta">
                        <i 
                          className={`fas ${getTypeIcon(conv.type)}`}
                          style={{ color: getPriorityColor(conv.priority) }}
                        ></i>
                        <span className="time">{conv.time}</span>
                      </div>
                    </div>
                    <div className="conversation-preview">
                      <span className="room-tag">Room {conv.room}</span>
                      <p>{conv.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="chat-area">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <div className="student-info">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${selectedConversation.student}&background=0ea5e9&color=fff`}
                    alt={selectedConversation.student}
                  />
                  <div>
                    <h4>{selectedConversation.student}</h4>
                    <span>Room {selectedConversation.room} • ID: {selectedConversation.studentId}</span>
                  </div>
                </div>
                <div className="chat-actions">
                  <button className="action-btn" title="View Student Profile">
                    <i className="fas fa-user"></i>
                  </button>
                  <button className="action-btn" title="Call Student">
                    <i className="fas fa-phone"></i>
                  </button>
                  <button className="action-btn" title="Email Student">
                    <i className="fas fa-envelope"></i>
                  </button>
                </div>
              </div>
              
              <div className="messages-container">
                {messages.map(msg => (
                  <div key={msg.id} className={`message ${msg.isStudent ? 'student' : 'custodian'}`}>
                    <div className="message-content">
                      <p>{msg.message}</p>
                      <span className="message-time">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="message-input-area">
                <div className="quick-responses">
                  <button className="quick-response" onClick={() => setNewMessage('Thank you for contacting us. How can I help you today?')}>
                    <i className="fas fa-bolt"></i> Greeting
                  </button>
                  <button className="quick-response" onClick={() => setNewMessage('Your request has been received and is being processed.')}>
                    <i className="fas fa-check"></i> Received
                  </button>
                  <button className="quick-response" onClick={() => setNewMessage('Please provide more details about your issue.')}>
                    <i className="fas fa-question"></i> More Info
                  </button>
                </div>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <div className="input-actions">
                    <button className="attach-btn" title="Attach File">
                      <i className="fas fa-paperclip"></i>
                    </button>
                    <button className="emoji-btn" title="Add Emoji">
                      <i className="fas fa-smile"></i>
                    </button>
                    <button 
                      className="send-btn" 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="no-conversation">
              <i className="fas fa-comments"></i>
              <h3>Select a conversation</h3>
              <p>Choose a student conversation from the sidebar to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustodianMessageCenter;