import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import { jsPDF } from 'jspdf'; // Assuming jspdf is installed
import { AuthContext } from '../auth/AuthContext';
import DashboardSidebar from './DashboardSidebar';

const MyBookingsPage = ({ onOpenReviewModal }) => {
  const navigate = useNavigate();
  const { userProfile, bookingHistory, login, logout, setBookingHistory } = useContext(AuthContext);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!userProfile) {
      const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
      const storedBookings = JSON.parse(localStorage.getItem('bookingHistory'));
      if (storedProfile && storedBookings) {
        login(storedProfile, storedBookings);
      } else {
        navigate('/');
      }
    }
  }, [userProfile, navigate, login]);

  const handleCancelBooking = (index) => {
    const updatedBookings = [...bookingHistory];
    updatedBookings[index].status = 'Cancelled';
    localStorage.setItem('bookingHistory', JSON.stringify(updatedBookings));
    setBookingHistory(updatedBookings);
    // showToast('Booking has been cancelled.');
  };

  const generateReceipt = (booking, user) => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('Booking Receipt', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('BookMyHostel', 105, 28, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Booking Details', 20, 50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Hostel: ${booking.hostel}`, 20, 60);
    doc.text(`Room Type: ${booking.room}`, 20, 68);
    doc.text(`Booking Date: ${new Date(booking.bookingDate).toLocaleDateString('en-GB')}`, 20, 76);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Billed To', 20, 96);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${user.fullName}`, 20, 106);
    doc.text(`Email: ${user.email}`, 20, 114);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Amount Paid:', 20, 140);
    doc.text(`UGX ${parseInt(booking.price).toLocaleString()}`, 190, 140, { align: 'right' });
    doc.save(`Receipt-${booking.hostel.replace(/\s/g, '-')}.pdf`);
  };

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  if (!userProfile) {
    return (
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-panel active" style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Loading Bookings...</h2>
            <p className="muted">Please wait while we fetch your data.</p>
          </div>
        </div>
      </main>
    );
  }

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
          <h1 className="dashboard-hero-title">My <span className="dashboard-animated">Bookings</span></h1>
          <p className="dashboard-hero-subtitle">Manage your current and past hostel bookings</p>
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
              <div id="my-bookings" className="dashboard-panel active">
              
              {/* Booking Statistics */}
              <div className="stats-grid-modern" style={{marginBottom: '30px'}}>
                <div className="stat-card-modern blue">
                  <div className="stat-icon"><i className="fas fa-calendar-check"></i></div>
                  <div className="stat-info">
                    <h3>{bookingHistory.filter(b => b.status !== 'Cancelled').length}</h3>
                    <p>Active Bookings</p>
                  </div>
                </div>
                <div className="stat-card-modern green">
                  <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
                  <div className="stat-info">
                    <h3>{bookingHistory.length}</h3>
                    <p>Total Bookings</p>
                  </div>
                </div>
                <div className="stat-card-modern orange">
                  <div className="stat-icon"><i className="fas fa-money-bill-wave"></i></div>
                  <div className="stat-info">
                    <h3>UGX {bookingHistory.reduce((sum, b) => sum + parseInt(b.price || 0), 0).toLocaleString()}</h3>
                    <p>Total Spent</p>
                  </div>
                </div>
              </div>

              <div className="dashboard-header">
                <div>
                  <h2>Booking History</h2>
                  <p className="muted">Manage your current and past hostel bookings</p>
                </div>
                <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                  <div className="search-wrapper-sm">
                    <i className="fas fa-search"></i>
                    <input type="text" placeholder="Search bookings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{width: '200px'}} />
                  </div>
                  <div className="filter-buttons">
                    <button className={`filter-btn-small ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}><i className="fas fa-list"></i> All</button>
                    <button className={`filter-btn-small ${filterStatus === 'confirmed' ? 'active' : ''}`} onClick={() => setFilterStatus('confirmed')}><i className="fas fa-check"></i> Active</button>
                    <button className={`filter-btn-small ${filterStatus === 'cancelled' ? 'active' : ''}`} onClick={() => setFilterStatus('cancelled')}><i className="fas fa-times"></i> Cancelled</button>
                  </div>
                  <button className="btn primary small" onClick={() => navigate('/hostels')}><i className="fas fa-plus"></i> New Booking</button>
                </div>
              </div>
              <div className="bookings-grid-modern" id="bookingHistoryList">
                {bookingHistory.length === 0 ? (
                  <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px'}}>
                    <i className="fas fa-calendar-times" style={{fontSize: '64px', color: '#cbd5e1', marginBottom: '20px'}}></i>
                    <h3 style={{color: '#64748b', marginBottom: '10px'}}>No Bookings Yet</h3>
                    <p className="muted">Start exploring hostels and make your first booking!</p>
                  </div>
                ) : (
                  bookingHistory
                    .filter(b => filterStatus === 'all' || b.status?.toLowerCase() === filterStatus)
                    .filter(b => b.hostel.toLowerCase().includes(searchQuery.toLowerCase()) || b.room.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((booking, index) => {
                    const bookingDate = new Date(booking.bookingDate);
                    const formattedDate = bookingDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                    const isCurrent = index === 0 && booking.status !== 'Cancelled';
                    const statusClass = booking.status ? booking.status.toLowerCase() : 'completed';
                    const statusText = booking.status || 'Completed';
                    const semester = isCurrent ? 'Aug 2024 - Dec 2024' : 'Jan 2024 - May 2024';

                    return (
                      <div className="booking-card-modern" key={index}>
                        <div className="booking-card-header">
                          <div className="booking-icon"><i className="fas fa-building"></i></div>
                          <span className={`status-badge-modern ${statusClass}`}>{statusText}</span>
                        </div>
                        <div className="booking-card-body">
                          <h4>{booking.hostel}</h4>
                          <div className="booking-detail-row">
                            <i className="fas fa-door-open"></i>
                            <span>{booking.room}</span>
                          </div>
                          <div className="booking-detail-row">
                            <i className="fas fa-calendar"></i>
                            <span>{semester}</span>
                          </div>
                          <div className="booking-detail-row">
                            <i className="fas fa-clock"></i>
                            <span>Booked on {formattedDate}</span>
                          </div>
                          <div className="booking-price-tag">UGX {parseInt(booking.price).toLocaleString()}</div>
                        </div>
                        <div className="booking-card-actions">
                          <button className="btn-action-modern download" onClick={() => generateReceipt(booking, userProfile)}>
                            <i className="fas fa-download"></i> Receipt
                          </button>
                          {isCurrent ? (
                            <button className="btn-action-modern cancel" onClick={() => handleCancelBooking(index)}>
                              <i className="fas fa-times"></i> Cancel
                            </button>
                          ) : (
                            <button className="btn-action-modern review" onClick={() => onOpenReviewModal(booking.hostel)}>
                              <i className="fas fa-star"></i> Review
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
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

export default MyBookingsPage;