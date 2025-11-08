import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import NotificationBell from '../../components/notifications/NotificationBell';
import MessageCenter from '../../components/messaging/MessageCenter';
import IntegrationPanel from '../../components/integrations/IntegrationPanel';
import { AuthContext } from '../auth/AuthContext';
import '../../styles/modern-dashboard.css';
import '../../styles/mobile-responsive.css';
import '../../styles/minimalist-dashboard.css';

const CustodianDashboardPage = () => {
  const navigate = useNavigate();
  const { userProfile, logout, loading } = useContext(AuthContext);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMessageCenterOpen, setIsMessageCenterOpen] = useState(false);
  const [isIntegrationPanelOpen, setIsIntegrationPanelOpen] = useState(false);

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
    profilePicture: userProfile?.profilePicture || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Ccircle cx='75' cy='75' r='75' fill='%23f0f0f0'/%3E%3Cpath d='M75 45c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 90c-25 0-45-12-45-27 0-15 20-27 45-27s45 12 45 27c0 15-20 27-45 27z' fill='%23ccc'/%3E%3C/svg%3E"
  };

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  return (
    <div className="minimalist-dashboard">
      <DashboardSidebar
        user={custodianProfile}
        role="custodian"
        onLogout={() => setIsLogoutModalOpen(true)}
      />
      
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Good morning, {userProfile?.name || 'Custodian'}</h1>
              <p>Here's what's happening today</p>
            </div>
            <div className="header-actions">
              <button className="icon-btn" onClick={() => setIsMessageCenterOpen(true)}>
                <i className="fa-solid fa-envelope"></i>
              </button>
              <NotificationBell />
            </div>
          </div>
        </header>

        <div className="dashboard-grid">
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-value">127</div>
              <div className="stat-label">Total Rooms</div>
              <div className="stat-trend positive">+2.5%</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">89%</div>
              <div className="stat-label">Occupancy</div>
              <div className="stat-trend positive">+5.2%</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">5</div>
              <div className="stat-label">Pending</div>
              <div className="stat-trend neutral">-</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">3</div>
              <div className="stat-label">Maintenance</div>
              <div className="stat-trend negative">+1</div>
            </div>
          </div>

          <div className="content-grid">
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="actions-list">
                <Link to="/custodian-payment-management" className="action-item">
                  <div className="action-icon">
                    <i className="fa-solid fa-credit-card"></i>
                  </div>
                  <span>Verify Payments</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </Link>
                <Link to="/custodian-room-assignment" className="action-item">
                  <div className="action-icon">
                    <i className="fa-solid fa-key"></i>
                  </div>
                  <span>Assign Rooms</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </Link>
                <Link to="/custodian-room-management" className="action-item">
                  <div className="action-icon">
                    <i className="fa-solid fa-door-open"></i>
                  </div>
                  <span>Room Management</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </Link>
                <Link to="/custodian-maintenance" className="action-item">
                  <div className="action-icon">
                    <i className="fa-solid fa-wrench"></i>
                  </div>
                  <span>Maintenance</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </Link>
              </div>
            </div>

            <div className="recent-activity">
              <div className="section-header">
                <h3>Recent Activity</h3>
                <Link to="/custodian-audit-log" className="view-all">View all</Link>
              </div>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon payment">
                    <i className="fa-solid fa-dollar-sign"></i>
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">Payment received</div>
                    <div className="activity-subtitle">Jane Doe • Room A-104</div>
                  </div>
                  <div className="activity-time">2m ago</div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon maintenance">
                    <i className="fa-solid fa-wrench"></i>
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">Maintenance request</div>
                    <div className="activity-subtitle">John Smith • Room B-205</div>
                  </div>
                  <div className="activity-time">1h ago</div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon booking">
                    <i className="fa-solid fa-bed"></i>
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">New booking</div>
                    <div className="activity-subtitle">Mary Johnson • Room C-301</div>
                  </div>
                  <div className="activity-time">3h ago</div>
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
      <MessageCenter 
        isOpen={isMessageCenterOpen}
        onClose={() => setIsMessageCenterOpen(false)}
      />
      <IntegrationPanel 
        isOpen={isIntegrationPanelOpen}
        onClose={() => setIsIntegrationPanelOpen(false)}
      />
    </div>
  );
};

export default CustodianDashboardPage;
