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

  const bookings = bookingHistory || [];
  const latestBooking = bookings[0];
  const pastBookingsForReview = bookings.filter((booking, index) => {
    return index > 0 || (index === 0 && booking.status === 'Cancelled');
  });

  return (
    <>
      <section className="dashboard-hero-section">
        <div className="floating-home-icons">
          <i className="fa-solid fa-home floating-home-1"></i>
          <i className="fa-solid fa-home floating-home-2"></i>
          <i className="fa-solid fa-home floating-home-3"></i>
          <i className="fa-solid fa-home floating-home-4"></i>
          <i className="fa-solid fa-home floating-home-5"></i>
          <i className="fa-solid fa-home floating-home-6"></i>
        </div>
        <div className="dashboard-hero-container">
          <h1 className="dashboard-hero-title">Welcome Back, <span className="dashboard-animated">{userProfile?.fullName || 'Student'}</span>!</h1>
          <p className="dashboard-hero-subtitle">Here's what's happening with your bookings today</p>
        </div>
      </section>
      
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-layout">
            <DashboardSidebar
              user={userProfile}
              role="student"
              onLogout={() => setIsLogoutModalOpen(true)}
            />

            <div className="dashboard-content">
              <div id="dashboard-home" className="dashboard-panel active">

              <div className="stats-grid-modern">
                <div className="stat-card-modern blue">
                  <div className="stat-icon"><i className="fa-solid fa-file-invoice"></i></div>
                  <div className="stat-info">
                    <h3>{bookings.length}</h3>
                    <p>Total Bookings</p>
                  </div>
                </div>
                <div className="stat-card-modern green">
                  <div className="stat-icon"><i className="fa-solid fa-circle-check"></i></div>
                  <div className="stat-info">
                    <h3>{bookings.filter(b => b.status === 'Confirmed').length}</h3>
                    <p>Active Bookings</p>
                  </div>
                </div>
                <div className="stat-card-modern orange">
                  <div className="stat-icon"><i className="fa-solid fa-screwdriver-wrench"></i></div>
                  <div className="stat-info">
                    <h3>{maintenanceRequests.length}</h3>
                    <p>Maintenance Requests</p>
                  </div>
                </div>
              </div>

              <div className="alert-card-modern">
                <div className="alert-icon"><i className="fa-solid fa-bell"></i></div>
                <div className="alert-content">
                  <h4>Next Semester Bookings Opening Soon!</h4>
                  <p>Bookings for Jan 2025 - May 2025 semester open on November 1st, 2024</p>
                </div>
              </div>

              {latestBooking && (
                <div className="current-booking-modern">
                  <div className="booking-header-modern">
                    <h3><i className="fa-solid fa-home"></i> Current Booking</h3>
                    <span className="status-badge-modern confirmed">Active</span>
                  </div>
                  <div className="booking-details-modern">
                    <div className="booking-info-row">
                      <div className="info-item">
                        <i className="fa-solid fa-building"></i>
                        <div>
                          <small>Hostel</small>
                          <strong>{latestBooking.hostel}</strong>
                        </div>
                      </div>
                      <div className="info-item">
                        <i className="fa-solid fa-door-open"></i>
                        <div>
                          <small>Room</small>
                          <strong>{latestBooking.room}</strong>
                        </div>
                      </div>
                      <div className="info-item">
                        <i className="fa-solid fa-calendar"></i>
                        <div>
                          <small>Booked On</small>
                          <strong>{new Date(latestBooking.bookingDate).toLocaleDateString()}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="quick-actions-modern">
                <h3>Quick Actions</h3>
                <div className="actions-grid-modern">
                  <Link to="/my-bookings" className="action-card-modern">
                    <div className="action-icon blue"><i className="fa-solid fa-file-invoice"></i></div>
                    <span>My Bookings</span>
                    <i className="fa-solid fa-arrow-right arrow"></i>
                  </Link>
                  <Link to="/maintenance" className="action-card-modern">
                    <div className="action-icon orange"><i className="fa-solid fa-screwdriver-wrench"></i></div>
                    <span>Maintenance</span>
                    <i className="fa-solid fa-arrow-right arrow"></i>
                  </Link>
                  <Link to="/profile" className="action-card-modern">
                    <div className="action-icon green"><i className="fa-solid fa-user-pen"></i></div>
                    <span>My Profile</span>
                    <i className="fa-solid fa-arrow-right arrow"></i>
                  </Link>
                  <Link to="/hostels" className="action-card-modern">
                    <div className="action-icon purple"><i className="fa-solid fa-search"></i></div>
                    <span>Browse Hostels</span>
                    <i className="fa-solid fa-arrow-right arrow"></i>
                  </Link>
                </div>
              </div>

              <div className="booking-history-section">
                <div className="section-header-flex">
                  <h3>Booking History</h3>
                  <Link to="/my-bookings" className="view-all-link">View All <i className="fa-solid fa-arrow-right"></i></Link>
                </div>
                <div className="history-table-wrapper">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Hostel</th>
                        <th>Room</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 3).map((booking, index) => (
                        <tr key={index}>
                          <td>{booking.hostel}</td>
                          <td>{booking.room}</td>
                          <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                          <td>UGX {booking.price?.toLocaleString()}</td>
                          <td><span className={`status-pill ${booking.status.toLowerCase()}`}>{booking.status}</span></td>
                          <td>
                            <button className="btn-icon-small" title="View Details"><i className="fa-solid fa-eye"></i></button>
                            <button className="btn-icon-small" title="Download Receipt"><i className="fa-solid fa-download"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {pastBookingsForReview.length > 0 && (
                <div className="review-section-modern">
                  <h3>Share Your Experience</h3>
                  <p className="muted">Help other students by reviewing your past stays</p>
                  <div className="review-list-modern">
                    {pastBookingsForReview.map((booking, index) => (
                      <div className="review-card-modern" key={index}>
                        <div className="review-info">
                          <h4>{booking.hostel}</h4>
                          <p>{booking.room}</p>
                        </div>
                        <button className="btn-review-modern" onClick={() => onOpenReviewModal(booking.hostel)}>
                          <i className="fa-solid fa-star"></i> Write Review
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="help-support-section">
                <div className="help-card">
                  <i className="fa-solid fa-circle-question"></i>
                  <h4>Need Help?</h4>
                  <p>Contact our support team for assistance</p>
                  <button className="btn-help">Get Support</button>
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
    </>
  );
};

export default DashboardPage;