import React, { useState } from 'react';

const NotificationBell = ({ onClick }) => {
  const [notifications] = useState([
    { id: 1, type: 'payment', message: 'Payment due in 3 days', time: '2h ago', unread: true },
    { id: 2, type: 'maintenance', message: 'Maintenance request approved', time: '1d ago', unread: true },
    { id: 3, type: 'room', message: 'Room inspection scheduled', time: '2d ago', unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="notification-bell" onClick={onClick}>
      <i className="fas fa-bell"></i>
      {unreadCount > 0 && (
        <span className="notification-badge">{unreadCount}</span>
      )}
    </div>
  );
};

export default NotificationBell;