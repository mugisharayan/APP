import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import NotificationBell from '../../components/notifications/NotificationBell';
import CustodianMessageCenter from '../../components/messaging/CustodianMessageCenter';
import NotificationCenter from '../../components/notifications/NotificationCenter';
import SupportTicketSystem from '../../components/support/SupportTicketSystem';
import StudentDirectory from '../../components/communication/StudentDirectory';
import PaymentReminder from '../../components/communication/PaymentReminder';
import BookingManagement from '../../components/booking/BookingManagement';

import RoomLevelManager from '../../components/hostel/RoomLevelManager';
import IntegrationPanel from '../../components/integrations/IntegrationPanel';
import Breadcrumb from '../../components/navigation/Breadcrumb';
import GlobalSearch from '../../components/search/GlobalSearch';
import HeatMap from '../../components/charts/HeatMap';
import Timeline from '../../components/charts/Timeline';
import { AuthContext } from '../auth/AuthContext';
import { useCustodian } from '../../contexts/CustodianContext';
import { useRoomData } from '../../contexts/RoomDataContext';
import HostelLinkingModal from '../../components/custodian/HostelLinkingModal';
import apiService from '../../service/api.service';
import '../../styles/modern-dashboard.css';
import '../../styles/mobile-responsive.css';
import '../../styles/minimalist-dashboard.css';
import '../../styles/communication-components.css';
import '../../styles/custodian-modern.css';

const CustodianDashboardPage = () => {
  const navigate = useNavigate();
  const { userProfile, logout, loading } = useContext(AuthContext);
  const { hostelData, analytics, loadDashboardData } = useCustodian();
  const { rooms, getRoomStats } = useRoomData();
  const roomStats = getRoomStats();
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [isLinked, setIsLinked] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMessageCenterOpen, setIsMessageCenterOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isSupportTicketOpen, setIsSupportTicketOpen] = useState(false);
  const [isStudentDirectoryOpen, setIsStudentDirectoryOpen] = useState(false);
  const [isPaymentReminderOpen, setIsPaymentReminderOpen] = useState(false);
  const [isBookingManagementOpen, setIsBookingManagementOpen] = useState(false);

  const [isRoomManagerOpen, setIsRoomManagerOpen] = useState(false);
  const [isIntegrationPanelOpen, setIsIntegrationPanelOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [notifications, setNotifications] = useState([]);




  // Generate real notifications based on system state
  useEffect(() => {
    const generateNotifications = () => {
      const realNotifications = [];
      

      // Check for pending payments
      const pendingPayments = JSON.parse(localStorage.getItem('pendingPayments') || '[]');
      if (pendingPayments.length > 0) {
        realNotifications.push({
          id: 'payments',
          type: 'payment',
          message: `${pendingPayments.length} payment${pendingPayments.length > 1 ? 's' : ''} awaiting approval`,
          time: 'Now',
          unread: true,
          priority: 'high',
          action: () => navigate('/custodian-payment-management')
        });
      }
      
      // Check for maintenance rooms
      const maintenanceRooms = rooms.filter(r => r.status === 'Maintenance');
      if (maintenanceRooms.length > 0) {
        realNotifications.push({
          id: 'maintenance',
          type: 'maintenance',
          message: `${maintenanceRooms.length} room${maintenanceRooms.length > 1 ? 's' : ''} need maintenance attention`,
          time: 'Now',
          unread: true,
          priority: 'high',
          action: () => navigate('/custodian-room-management')
        });
      }
      
      // Check for pending room assignments
      const pendingAssignments = JSON.parse(localStorage.getItem('pendingAssignments') || '[]');
      if (pendingAssignments.length > 0) {
        realNotifications.push({
          id: 'assignments',
          type: 'booking',
          message: `${pendingAssignments.length} student${pendingAssignments.length > 1 ? 's' : ''} waiting for room assignment`,
          time: 'Now',
          unread: true,
          priority: 'medium',
          action: () => navigate('/custodian-room-assignment')
        });
      }
      
      setNotifications(realNotifications);
    };
    
    generateNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(generateNotifications, 30000);
    return () => clearInterval(interval);
  }, [rooms, navigate]);
  const [weather, setWeather] = useState({ temp: 24, condition: 'Sunny', humidity: 65 });
  const [widgets, setWidgets] = useState({
    occupancy: true,
    revenue: true,
    maintenance: true,
    weather: true
  });

  // Check hostel link on mount
  useEffect(() => {
    checkHostelLink();
  }, []);

  const checkHostelLink = async () => {
    const linkedHostel = localStorage.getItem('linkedHostel');
    if (linkedHostel) {
      setIsLinked(true);
    } else {
      const data = await loadDashboardData();
      if (data && data.hostel) {
        setIsLinked(true);
      }
    }
  };

  const handleLinkSuccess = (hostelData) => {
    setIsLinked(true);
    // Store linked hostel data
    localStorage.setItem('linkedHostel', JSON.stringify({
      name: 'Lyn Modern Hostel',
      id: 'lyn-modern-001',
      custodianId: userProfile?.id || 'custodian-001',
      linkedAt: new Date().toISOString()
    }));
  };

  // Counter animation effect
  useEffect(() => {
    const counters = document.querySelectorAll('.counter-animation');
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const increment = target / 100;
      let current = 0;
      
      const updateCounter = () => {
        if (current < target) {
          current += increment;
          counter.textContent = target % 1 === 0 ? Math.ceil(current) : current.toFixed(1);
          setTimeout(updateCounter, 20);
        } else {
          counter.textContent = target % 1 === 0 ? target : target.toFixed(1);
        }
      };
      
      setTimeout(updateCounter, 500);
    });
  }, []);

  if (loading || !userProfile) {
    return (
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-panel active" style={{ textAlign: 'center', padding: '50px' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '48px', color: '#0ea5e9', marginBottom: '20px' }}></i>
            <h2>Loading Dashboard...</h2>
            <p className="muted">Please wait while we fetch your data.</p>
          </div>
        </div>
      </main>
    );
  }

  const custodianProfile = {
    fullName: userProfile?.name || 'Custodian',
    course: userProfile?.role || 'Custodian',
    profilePicture: userProfile?.profilePicture || 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.body.classList.toggle('dark-theme', newTheme);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? {...n, unread: false} : n));
  };

  const toggleWidget = (widget) => {
    setWidgets(prev => ({...prev, [widget]: !prev[widget]}));
  };

  useEffect(() => {
    document.body.classList.toggle('dark-theme', darkMode);
  }, [darkMode]);

  return (
    <>
      <section className="custodian-hero">
        <div className="hero-content">
          <h1>Welcome back, <span className="dashboard-animated">{userProfile?.name || 'Custodian'}</span></h1>
          <p>Manage hostel operations and oversee daily activities</p>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={toggleTheme} title={darkMode ? 'Light Mode' : 'Dark Mode'}>
            <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
          <div className="notification-dropdown">
            <button className="icon-btn notification-btn" title="Notifications" onClick={() => setIsNotificationCenterOpen(true)}>
              <i className="fa-solid fa-bell"></i>
              {notifications.filter(n => n.unread).length > 0 && (
                <span className="notification-badge">{notifications.filter(n => n.unread).length}</span>
              )}
            </button>
            <div className="notification-dropdown-content">
              <div className="notification-header">
                <h4>Notifications</h4>
                <button className="mark-all-read">Mark all read</button>
              </div>
              {notifications.length === 0 ? (
                <div className="notification-item">
                  <i className="fa-solid fa-check-circle" style={{color: '#10b981'}}></i>
                  <div className="notification-content">
                    <p>All caught up! No urgent items.</p>
                  </div>
                </div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.unread ? 'unread' : ''} ${notification.priority === 'high' ? 'high-priority' : ''}`} 
                    onClick={() => {
                      markNotificationRead(notification.id);
                      if (notification.action) notification.action();
                    }}
                    style={{cursor: 'pointer'}}
                  >
                    <i className={`fa-solid ${notification.type === 'payment' ? 'fa-dollar-sign' : notification.type === 'maintenance' ? 'fa-wrench' : 'fa-bed'}`}></i>
                    <div className="notification-content">
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                      {notification.priority === 'high' && <span className="priority-badge">URGENT</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <button className="icon-btn" onClick={() => setIsMessageCenterOpen(true)} title="Messages">
            <i className="fa-solid fa-envelope"></i>
          </button>
          <button className="icon-btn" onClick={() => setIsStudentDirectoryOpen(true)} title="Student Directory">
            <i className="fa-solid fa-users"></i>
          </button>
        </div>
      </section>
      
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-layout">
            <DashboardSidebar
              user={custodianProfile}
              role="custodian"
              onLogout={() => setIsLogoutModalOpen(true)}
            />
            <div className="dashboard-content">
              <div className="modern-dashboard-container">
                {/* Stats Overview */}
                {!isLinked ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <i className="fas fa-link" style={{ fontSize: '64px', color: '#0ea5e9', marginBottom: '20px' }}></i>
                    <h2>Link to Your Hostel</h2>
                    <p style={{ marginBottom: '30px', color: '#64748b' }}>
                      Connect to an existing hostel in our database to access all analytics, bookings, and revenue data.
                    </p>
                    <button 
                      className="btn primary" 
                      onClick={() => setShowLinkModal(true)}
                      style={{ padding: '15px 30px', fontSize: '16px' }}
                    >
                      <i className="fas fa-link"></i> Link to Hostel
                    </button>
                  </div>
                ) : (
                  <div className="stats-grid-compact">
                    <div className="stat-card-compact blue">
                      <div className="stat-icon"><i className="fa-solid fa-users"></i></div>
                      <div className="stat-info">
                        <h3 className="counter-animation" data-target={roomStats.occupancyRate}>{roomStats.occupancyRate}</h3>
                        <p>Occupancy %</p>
                        <div className="stat-progress">
                          <div className="progress-bar-mini" style={{width: `${roomStats.occupancyRate}%`}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="stat-card-compact green">
                      <div className="stat-icon"><i className="fa-solid fa-money-bill-wave"></i></div>
                      <div className="stat-info">
                        <h3 className="counter-animation" data-target={analytics?.totalRevenue ? (analytics.totalRevenue / 1000000).toFixed(1) : 0}>
                          {analytics?.totalRevenue ? (analytics.totalRevenue / 1000000).toFixed(1) : 0}
                        </h3>
                        <p>Revenue (M)</p>
                        <div className="stat-trend positive">UGX {analytics?.monthlyRevenue?.toLocaleString() || 0} this month</div>
                      </div>
                    </div>
                    <div className="stat-card-compact orange">
                      <div className="stat-icon"><i className="fa-solid fa-bed"></i></div>
                      <div className="stat-info">
                        <h3 className="counter-animation" data-target={roomStats.occupied + roomStats.booked}>{roomStats.occupied + roomStats.booked}</h3>
                        <p>Active Bookings</p>
                        <div className="stat-trend">{roomStats.total} total rooms</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions Grid */}
                <div className="quick-actions-compact">
                  <h3><i className="fas fa-bolt"></i> Quick Actions</h3>
                  <div className="actions-grid-compact">
                    <Link to="/custodian-payment-management" className="action-card-compact">
                      <div className="action-icon green"><i className="fa-solid fa-credit-card"></i></div>
                      <span>Payments</span>
                    </Link>
                    <Link to="/custodian-room-management" className="action-card-compact">
                      <div className="action-icon orange"><i className="fa-solid fa-door-open"></i></div>
                      <span>Rooms</span>
                    </Link>
                    <button className="action-card-compact" onClick={() => setIsMessageCenterOpen(true)}>
                      <div className="action-icon purple"><i className="fa-solid fa-comments"></i></div>
                      <span>Messages</span>
                    </button>
                  </div>
                </div>

                {/* Main Content */}
                <div className="content-single">
                  <div className="recent-activity-compact">
                    <div className="section-header-compact">
                      <h3><i className="fas fa-clock"></i> Recent Activity</h3>
                      <Link to="/custodian-audit-log" className="view-all-link">View All</Link>
                    </div>
                    <div className="activity-list-compact">
                      <div className="activity-item-compact">
                        <div className="activity-dot payment"></div>
                        <div className="activity-content">
                          <h5>Payment Received - Jane Doe</h5>
                          <span className="activity-time">2m ago</span>
                        </div>
                      </div>
                      <div className="activity-item-compact">
                        <div className="activity-dot maintenance"></div>
                        <div className="activity-content">
                          <h5>Maintenance Request - Room B-205</h5>
                          <span className="activity-time">1h ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
      </main>
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
      <CustodianMessageCenter 
        isOpen={isMessageCenterOpen}
        onClose={() => setIsMessageCenterOpen(false)}
      />
      <NotificationCenter 
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
      <SupportTicketSystem 
        isOpen={isSupportTicketOpen}
        onClose={() => setIsSupportTicketOpen(false)}
      />
      <StudentDirectory 
        isOpen={isStudentDirectoryOpen}
        onClose={() => setIsStudentDirectoryOpen(false)}
      />
      <PaymentReminder 
        isOpen={isPaymentReminderOpen}
        onClose={() => setIsPaymentReminderOpen(false)}
      />
      <BookingManagement 
        isOpen={isBookingManagementOpen}
        onClose={() => setIsBookingManagementOpen(false)}
      />

      <RoomLevelManager 
        isOpen={isRoomManagerOpen}
        onClose={() => setIsRoomManagerOpen(false)}
      />
      <IntegrationPanel 
        isOpen={isIntegrationPanelOpen}
        onClose={() => setIsIntegrationPanelOpen(false)}
      />
      <HostelLinkingModal 
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onSuccess={handleLinkSuccess}
      />
    </>
  );
};

export default CustodianDashboardPage;
