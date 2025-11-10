import React, { useState, useEffect } from 'react';
import custodianService from '../../service/custodian.service';

const CustodianMessageCenter = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen]);

  const loadMessages = async () => {
    try {
      const response = await custodianService.getMessages();
      const msgs = response.data || [];
      setMessages(msgs);
      
      // Extract unique students
      const uniqueStudents = msgs.reduce((acc, msg) => {
        if (msg.senderRole === 'student' && !acc.find(s => s._id === msg.sender._id)) {
          acc.push(msg.sender);
        }
        return acc;
      }, []);
      setStudents(uniqueStudents);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const getConversationMessages = () => {
    if (!selectedStudent) return [];
    return messages.filter(msg => 
      (msg.sender._id === selectedStudent._id) || 
      (msg.recipient._id === selectedStudent._id)
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedStudent) return;
    
    try {
      setLoading(true);
      await custodianService.sendMessage(selectedStudent._id, newMessage.trim());
      setNewMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
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
    <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && onClose()}>
      <div className="modal-content message-center-modal" style={{ maxWidth: '800px', width: '90vw', height: '600px', display: 'flex', flexDirection: 'row' }}>
        {/* Conversations Sidebar */}
        <div className="conversations-sidebar" style={{ width: '300px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
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
            {students.map(student => (
              <div 
                key={student._id}
                onClick={() => setSelectedStudent(student)}
                className={`conversation-item ${selectedStudent?._id === student._id ? 'active' : ''}`}
              >
                <div className="conversation-avatar">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${student.name}&background=0ea5e9&color=fff`}
                    alt={student.name}
                  />
                </div>
                <div className="conversation-info">
                  <div className="conversation-header">
                    <h5>{student.name}</h5>
                  </div>
                  <div className="conversation-preview">
                    <p>{student.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="chat-area" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedStudent ? (
            <>
              <div className="chat-header">
                <div className="student-info">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${selectedStudent.name}&background=0ea5e9&color=fff`}
                    alt={selectedStudent.name}
                  />
                  <div>
                    <h4>{selectedStudent.name}</h4>
                    <span>{selectedStudent.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="messages-container">
                {getConversationMessages().map(msg => (
                  <div key={msg._id} className={`message ${msg.senderRole}`}>
                    <div className="message-content">
                      <p>{msg.content}</p>
                      <span className="message-time">{new Date(msg.createdAt).toLocaleTimeString()}</span>
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
                      disabled={!newMessage.trim() || loading}
                    >
                      {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
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