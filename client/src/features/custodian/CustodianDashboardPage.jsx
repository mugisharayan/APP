import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';

const CustodianDashboardPage = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [activityFilter, setActivityFilter] = useState('');

  // Mock custodian user profile for the sidebar
  const custodianProfile = {
    fullName: 'John K.',
    course: 'Lead Custodian', // Using 'course' field for role display
    profilePicture: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  // Dummy data for activity feed
  const allActivities = [
    { id: 1, iconClass: 'green', icon: 'fa-dollar-sign', text: 'Jane Doe submitted a payment for verification.', time: '15 minutes ago' },
    { id: 2, iconClass: 'blue', icon: 'fa-bed', text: 'New booking received for Room A-104.', time: '1 hour ago' },
    { id: 3, iconClass: 'orange', icon: 'fa-wrench', text: 'New maintenance request for Room B-02 (Jammed Door).', time: '3 hours ago' },
    { id: 4, iconClass: 'green', icon: 'fa-dollar-sign', text: 'John Doe submitted a payment for verification.', time: '4 hours ago' },
    { id: 5, iconClass: 'blue', icon: 'fa-bed', text: 'New booking received for Room C-201.', time: '5 hours ago' },
  ];

  const filteredActivities = allActivities.filter(activity =>
    activity.text.toLowerCase().includes(activityFilter.toLowerCase())
  );

  const handleLogout = () => {
    // In a real app, this would call a logout function from context
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  return (
    <main className="dashboard-page">
      <div className="container">
        <div className="dashboard-layout">
          <DashboardSidebar
            user={custodianProfile}
            role="custodian"
            onLogout={() => setIsLogoutModalOpen(true)}
          />

          {/* Main Content */}
          <div className="dashboard-content">
            {/* Welcome Banner */}
            <div className="welcome-banner">
              <div className="banner-header">
                <div>
                  <h1>Welcome Back, John!</h1>
                  <p>Here’s what’s happening with your hostels today.</p>
                </div>
                <div className="header-actions">
                  <button className="action-btn" title="Notifications"><i className="fas fa-bell"></i><span className="notification-badge">3</span></button>
                  <Link to="/custodian-profile" className="user-profile">
                    <img src="https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="User profile" />
                    <span>John K.</span>
                  </Link>
                </div>
              </div>
              <div className="widgets-grid">
                <div className="widget"><div className="widget-icon blue"><i className="fas fa-file-invoice-dollar"></i></div><div className="widget-info"><p>New Payments</p><h3>5</h3></div></div>
                <div className="widget"><div className="widget-icon red"><i className="fas fa-tools"></i></div><div className="widget-info"><p>Open Tickets</p><h3>3</h3></div></div>
                <div className="widget"><div className="widget-icon green"><i className="fas fa-chart-pie"></i></div><div className="widget-info"><p>Occupancy Rate</p><h3>85%</h3></div></div>
                <div className="widget"><div className="widget-icon orange"><i className="fas fa-key"></i></div><div className="widget-info"><p>Pending Assignments</p><h3>2</h3></div></div>
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="dashboard-grid-new">
              {/* Left Column */}
              <div>
                <div className="content-section">
                  <div className="section-header"><h2>Quick Actions</h2></div>
                  <div className="quick-actions-grid new-style">
                    <Link to="/custodian-payment-management" className="quick-action-btn"><i className="fas fa-check-double"></i><span>Verify Payment</span></Link>
                    <Link to="/custodian-room-assignment" className="quick-action-btn"><i className="fas fa-key"></i><span>Assign Room</span></Link>
                    <Link to="/custodian-maintenance" className="quick-action-btn"><i className="fas fa-plus"></i><span>Create Ticket</span></Link>
                    <Link to="/custodian-students" className="quick-action-btn"><i className="fas fa-user-plus"></i><span>Add Student</span></Link>
                  </div>
                </div>
                <div className="content-section" style={{ marginTop: '30px' }}>
                  <div className="section-header">
                    <h2>Recent Activity</h2>
                    <div className="search-wrapper-sm">
                      <i className="fas fa-search"></i>
                      <input
                        type="text"
                        id="activitySearchInput"
                        placeholder="Filter activity..."
                        value={activityFilter}
                        onChange={(e) => setActivityFilter(e.target.value)}
                      />
                    </div>
                  </div>
                  <ul className="activity-feed" id="activityFeedList">
                    {filteredActivities.length > 0 ? (
                      filteredActivities.map(activity => (
                        <li className="activity-item" key={activity.id}>
                          <div className={`activity-icon ${activity.iconClass}`}><i className={`fas ${activity.icon}`}></i></div>
                          <div className="activity-content"><p><strong>{activity.text.split(' ')[0]} {activity.text.split(' ')[1]}</strong> {activity.text.substring(activity.text.indexOf(' ') + activity.text.indexOf(' ') + 2)}</p><span className="activity-time">{activity.time}</span></div>
                        </li>
                      ))
                    ) : (
                      <p className="no-activity-message" id="noActivityMessage" style={{ textAlign: 'center', color: 'var(--text-light)', padding: '20px 0' }}>No activity found matching your search.</p>
                    )}
                  </ul>
                </div>
              </div>
              {/* Right Column */}
              <div className="content-section">
                <div className="section-header"><h2>Pending Tasks</h2></div>
                <div className="pending-tasks-list" id="pendingTasksList">
                  {/* These would ideally be dynamic from state */}
                  <div className="pending-item">
                    <div className="activity-icon assignment"><i className="fas fa-key"></i></div>
                    <div className="student-info">
                      <h5>Assign Room</h5>
                      <p>A new student booking requires room assignment.</p>
                    </div>
                    <Link to="/custodian-room-assignment" className="btn outline small">View</Link>
                  </div>
                  <div className="pending-item">
                    <div className="activity-icon green"><i className="fas fa-dollar-sign"></i></div>
                    <div className="student-info">
                      <h5>Verify Payment: Jane Doe</h5>
                      <p>Room A-102 - UGX 1,200,000</p>
                    </div>
                    <Link to="/custodian-payment-management" className="btn outline small">Verify</Link>
                  </div>
                  <div className="pending-item">
                    <div className="activity-icon orange"><i className="fas fa-wrench"></i></div>
                    <div className="student-info">
                      <h5>New Ticket: Leaking Pipe</h5>
                      <p>Room A-105 - High Priority</p>
                    </div>
                    <Link to="/custodian-maintenance" className="btn outline small">View</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </main>
  );
};

export default CustodianDashboardPage;