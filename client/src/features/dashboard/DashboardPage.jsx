import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import { AuthContext } from '../auth/AuthContext';
import DashboardSidebar from './DashboardSidebar';

const DashboardPage = ({ onOpenReviewModal }) => {
  const navigate = useNavigate();
  const { userProfile, bookingHistory, login, logout } = useContext(AuthContext);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (!userProfile) {
      const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
      const storedBookings = JSON.parse(localStorage.getItem('bookingHistory'));
      if (storedProfile && storedBookings) {
        login(storedProfile, storedBookings);
      } else {
        navigate('/');
        return;
      }
    }
    // Maintenance requests can still be loaded from localStorage for this component
    const storedMaintenance = JSON.parse(localStorage.getItem('maintenanceRequests')) || [];
    setMaintenanceRequests(storedMaintenance);
  }, [userProfile, navigate, login]);

  if (!userProfile) {
    return (
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-panel active" style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Loading Dashboard...</h2>
            <p className="muted">Please wait while we fetch your data.</p>
          </div>
        </div>
      </main>
    );
  }

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  const latestBooking = bookingHistory[0];
  const pastBookingsForReview = bookingHistory.filter((booking, index) => {
    return index > 0 || (index === 0 && booking.status === 'Cancelled');
  });

  return (
    <main className="dashboard-page">
      <div className="container">
        <div className="dashboard-layout">
          {/* Left Column: Sidebar Navigation */}
          <DashboardSidebar
            user={userProfile}
            role="student"
            onLogout={() => setIsLogoutModalOpen(true)}
          />

          {/* Right Column: Main Content */}
          <div className="dashboard-content">
            {/* Dashboard Home Panel */}
            <div id="dashboard-home" className="dashboard-panel active">
              <div className="dashboard-header">
                <h2>Dashboard</h2>
                <p className="muted" id="welcomeMessage">Here's a quick overview of your student dashboard.</p>
              </div>

              <div className="dashboard-section">
                <h3>Alerts & Notifications</h3>
                <div className="notification-card">
                  <div className="icon"><i className="fa-solid fa-calendar-check"></i></div>
                  <div className="content">
                    <h5>Next Semester Bookings</h5>
                    <p>Bookings for the Jan 2025 - May 2025 semester will open on November 1st, 2024. Don't miss out!</p>
                  </div>
                </div>
              </div>

              <div className="dashboard-section">
                <h3>At a Glance</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <i className="fa-solid fa-file-invoice"></i>
                    <div>
                      <h4 className="stat-number" id="statTotalBookings">{bookingHistory.length}</h4>
                      <p className="stat-label muted">Total Bookings</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <i className="fa-solid fa-screwdriver-wrench"></i>
                    <div>
                      <h4 className="stat-number" id="statOpenRequests">{maintenanceRequests.length}</h4>
                      <p className="stat-label muted">Open Requests</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-section">
                <h3>Current Booking</h3>
                <div className="current-booking-card" id="currentBookingCard">
                  {latestBooking ? (
                    <>
                      <h4>{latestBooking.hostel}</h4>
                      <p><strong>Room:</strong> {latestBooking.room}</p>
                      <div className="booking-status confirmed" style={{ marginTop: '15px' }}>
                        <i className="fa-solid fa-circle-check"></i> Confirmed
                      </div>
                    </>
                  ) : (
                    <p className="muted">No current booking found.</p>
                  )}
                </div>
              </div>

              <div className="dashboard-section">
                <h3>Review Your Past Stays</h3>
                <p className="muted">Help other students by sharing your experience.</p>
                <div className="booking-history-list" id="pastBookingsForReview">
                  {pastBookingsForReview.length === 0 ? (
                    <p className="muted" id="noPastBookingsMessage">You have no past bookings to review yet.</p>
                  ) : (
                    pastBookingsForReview.map((booking, index) => (
                      <div className="booking-history-item" key={index}>
                        <div className="item-details">
                          <h4>{booking.hostel}</h4>
                          <p><strong>Room:</strong> {booking.room}</p>
                        </div>
                        <div className="item-actions">
                          <button className="btn primary small write-review-btn" onClick={() => onOpenReviewModal(booking.hostel)}>Write a Review</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="dashboard-section">
                <h3>Quick Actions</h3>
                <div className="quick-actions-grid">
                  <Link to="/my-bookings" className="quick-action-card">
                    <i className="fa-solid fa-file-invoice"></i>
                    <span>View All Bookings</span>
                  </Link>
                  <Link to="/maintenance" className="quick-action-card">
                    <i className="fa-solid fa-screwdriver-wrench"></i>
                    <span>Request Maintenance</span>
                  </Link>
                  <Link to="/profile" className="quick-action-card">
                    <i className="fa-solid fa-user-pen"></i>
                    <span>Update Profile</span>
                  </Link>
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

export default DashboardPage;