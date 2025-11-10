import React, { useState, useEffect } from 'react';
import apiService from '../../service/api.service';

const StudentNotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load notifications from database
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiService.notifications.getAll();
      const dbNotifications = response.data.data.map(notification => ({
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        time: getTimeAgo(notification.createdAt),
        unread: !notification.isRead,
        data: notification.data
      }));
      setNotifications(dbNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const markAsRead = async (id) => {
    try {
      await apiService.notifications.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => n.unread);
      await Promise.all(unreadNotifications.map(n => apiService.notifications.markAsRead(n.id)));
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && onClose()}>
      <div className="modal-content notification-center-modal">
        <div className="modal-header">
          <h3><i className="fas fa-bell"></i> Notifications</h3>
          <div className="header-actions">
            <button onClick={markAllAsRead} className="btn-link">Mark all read</button>
            <button className="close-modal-btn" onClick={onClose}>&times;</button>
          </div>
        </div>
        
        <div className="notification-list">
          {loading ? (
            <div className="loading-notifications">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading notifications...</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.unread ? 'unread' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="notification-icon">
                  <i className={`fas ${
                    notification.type === 'room_assignment' ? 'fa-key' :
                    notification.type === 'payment_update' ? 'fa-credit-card' :
                    notification.type === 'booking_update' ? 'fa-calendar' :
                    notification.type === 'maintenance' ? 'fa-wrench' :
                    'fa-bell'
                  }`}></i>
                </div>
                <div className="notification-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  {notification.data?.accessCode && (
                    <div className="access-code">
                      <strong>Access Code: {notification.data.accessCode}</strong>
                    </div>
                  )}
                  <span className="notification-time">{notification.time}</span>
                </div>
                {notification.unread && <div className="unread-dot"></div>}
              </div>
            ))
          )}
        </div>
        
        {!loading && notifications.length === 0 && (
          <div className="empty-notifications">
            <i className="fas fa-bell-slash"></i>
            <p>No notifications</p>
          </div>
        )}
        
        <style jsx>{`
          .access-code {
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 6px;
            padding: 8px 12px;
            margin: 8px 0;
            font-family: monospace;
            color: #0369a1;
          }
          .loading-notifications {
            text-align: center;
            padding: 40px 20px;
            color: #64748b;
          }
          .loading-notifications i {
            font-size: 2rem;
            margin-bottom: 12px;
            color: #0ea5e9;
          }
        `}</style>
      </div>
    </div>
  );
};

export default StudentNotificationCenter;