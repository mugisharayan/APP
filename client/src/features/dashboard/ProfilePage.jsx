import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from './DashboardSidebar';
import { AuthContext } from '../auth/AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userProfile, login, logout } = useContext(AuthContext); // Use context
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(userProfile || {});
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (!userProfile) {
      // If context has no user, try to get from localStorage once
      const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
      if (storedProfile) {
        const storedBookings = JSON.parse(localStorage.getItem('bookingHistory')) || [];
        login(storedProfile, storedBookings); // Hydrate context
      } else {
        navigate('/'); // Redirect if not logged in
      }
    } else {
      setEditFormData(userProfile); // Sync form data when userProfile is available
    }
  }, [userProfile, navigate, login]);

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedProfile = { ...userProfile, ...editFormData };
    const bookings = JSON.parse(localStorage.getItem('bookingHistory')) || [];
    login(updatedProfile, bookings); // Update profile via context
    setIsEditing(false);
    // showToast('Profile updated successfully!');
  };

  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const result = event.target.result;
          if (typeof result === 'string' && result.startsWith('data:image/')) {
            const updatedProfile = { ...userProfile, ...editFormData, profilePicture: result };
            const bookings = JSON.parse(localStorage.getItem('bookingHistory')) || [];
            login(updatedProfile, bookings); // Update profile via context
            // showToast('Profile picture updated!');
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const form = e.target;
    const newPassword = form.newPassword.value;
    const confirmPassword = form.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      // showToast('New passwords do not match.', true);
      return;
    }
    // In a real app, you'd send this to a backend for password update
    // showToast('Password updated successfully!');
    form.reset();
  };

  const togglePasswordVisibility = (e) => {
    const passwordInput = e.target.previousElementSibling;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      e.target.classList.replace('fa-eye-slash', 'fa-eye');
    } else {
      passwordInput.type = 'password';
      e.target.classList.replace('fa-eye', 'fa-eye-slash');
    }
  };

  const handleNotificationSave = (e) => {
    e.preventDefault();
    // Save notification preferences (e.g., to userProfile in localStorage or backend)
    // showToast('Notification preferences saved!');
  };

  const handleProfilePicClick = () => {
    document.getElementById('profilePicInput').click();
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
            <h2>Loading Profile...</h2>
            <p className="muted">Please wait while we fetch your data.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="container">
        <div className="dashboard-layout">
          <DashboardSidebar
            user={userProfile}
            role="student"
            onLogout={() => setIsLogoutModalOpen(true)}
          />

          <div className="dashboard-content">
            <div id="profile" className="dashboard-panel active">
              <div className="dashboard-header">
                <h2>My Profile</h2>
                <p className="muted">Manage your personal information and account settings.</p>
              </div>

              <div className="profile-content-new">
                <div className="content-section">
                  <div className="section-header">
                    <h2>Profile Information</h2>
                    <button className="btn outline small" id="editProfileBtn" onClick={() => setIsEditing(true)} style={{ display: isEditing ? 'none' : 'inline-flex' }}><i className="fas fa-pen"></i> Edit</button>
                  </div>
                  <div className="profile-card-content">
                    <div className="profile-pic-large-wrapper" id="changePicOverlay" onClick={handleProfilePicClick}>
                      <img src={userProfile.profilePicture || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} alt="Student profile" id="mainProfilePic" />
                      <div className="edit-overlay">Change</div>
                      <input type="file" id="profilePicInput" style={{ display: 'none' }} accept="image/*" onChange={handleProfilePicChange} />
                    </div>
                    <div className="profile-details-form-wrapper">
                      {!isEditing ? (
                        <div id="profile-view">
                          <div className="profile-detail-item"><small>Full Name</small><p id="viewName">{userProfile.fullName}</p></div>
                          <div className="profile-detail-item"><small>Email Address</small><p id="viewEmail">{userProfile.email}</p></div>
                          <div className="profile-detail-item"><small>Phone Number</small><p id="viewPhone">{userProfile.phone || 'N/A'}</p></div>
                          <div className="profile-detail-item"><small>Course / Program</small><p id="viewCourse">{userProfile.course}</p></div>
                        </div>
                      ) : (
                        <form id="profile-edit-form" onSubmit={handleSaveProfile}>
                          <div className="form-group"><label aria-label="Full Name">Full Name</label><input type="text" id="fullName" required value={editFormData.fullName} onChange={handleEditChange} /></div>
                          <div className="form-group"><label aria-label="Email Address">Email Address</label><input type="email" id="email" required value={editFormData.email} onChange={handleEditChange} /></div>
                          <div className="form-group"><label aria-label="Phone Number">Phone Number</label><input type="tel" id="phone" required value={editFormData.phone} onChange={handleEditChange} /></div>
                          <div className="form-group"><label aria-label="Course / Program">Course / Program</label><input type="text" id="course" required value={editFormData.course} onChange={handleEditChange} /></div>
                          <div className="form-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button type="submit" className="btn primary">Save Changes</button>
                            <button type="button" className="btn outline" onClick={() => setIsEditing(false)}>Cancel</button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>

                <div className="profile-page-grid">
                  <div className="content-section">
                    <div className="section-header"><h2>Security Settings</h2></div>
                    <div className="security-sections-wrapper">
                      <div className="security-section">
                        <div className="security-section-header"><h4>Change Password</h4><small className="muted">Last updated: 6 months ago</small></div>
                        <form id="password-change-form" onSubmit={handlePasswordChange}>
                          <div className="form-group"><label htmlFor="currentPassword" aria-label="Current Password">Current Password</label><div className="password-wrapper"><input type="password" id="currentPassword" name="currentPassword" required /><i className="fas fa-eye-slash toggle-password" onClick={togglePasswordVisibility}></i></div></div>
                          <div className="form-group"><label htmlFor="newPassword" aria-label="New Password">New Password</label><div className="password-wrapper"><input type="password" id="newPassword" name="newPassword" required /><i className="fas fa-eye-slash toggle-password" onClick={togglePasswordVisibility}></i></div></div>
                          <div className="form-group"><label htmlFor="confirmPassword" aria-label="Confirm New Password">Confirm New Password</label><div className="password-wrapper"><input type="password" id="confirmPassword" name="confirmPassword" required /><i className="fas fa-eye-slash toggle-password" onClick={togglePasswordVisibility}></i></div></div>
                          <button type="submit" className="btn primary" style={{ marginTop: '10px' }}>Update Password</button>
                        </form>
                      </div>
                      <div className="security-section">
                        <div className="security-section-header"><h4>Two-Factor Authentication (2FA)</h4><span className="status-badge-new disabled">Disabled</span></div>
                        <p className="muted">Add an extra layer of security to your account by requiring a second verification step.</p>
                        <button className="btn outline" id="enable2faBtn">Enable 2FA</button>
                      </div>
                      <div className="security-section">
                        <div className="security-section-header"><h4>Login History</h4></div>
                        <ul className="login-history-list">
                          <li><i className="fas fa-desktop"></i><div><strong>Kampala, UG</strong><small>Chrome on Windows - 1 hour ago</small></div></li>
                        </ul>
                        <a href="#" className="link-primary">View all login activity</a>
                      </div>
                    </div>
                  </div>

                  <div className="content-section notification-section-new">
                    <div className="section-header"><h2>Notification Preferences</h2></div>
                    <form id="notification-settings-form" onSubmit={handleNotificationSave}>
                      <p className="muted" style={{ marginBottom: '20px' }}>Select how you want to receive notifications.</p>
                      <div className="notification-table">
                        <div className="notification-table-header">
                          <span>Activity</span>
                          <div className="channels"><span>Email</span><span>Push</span></div>
                        </div>
                        <div className="notification-row">
                          <div className="notification-info">
                            <strong>Booking Confirmations</strong>
                            <p className="muted">When your booking is confirmed or cancelled.</p>
                          </div>
                          <div className="notification-channels">
                            <label className="custom-checkbox"><input type="checkbox" defaultChecked /><span></span></label>
                            <label className="custom-checkbox"><input type="checkbox" defaultChecked /><span></span></label>
                          </div>
                        </div>
                        <div className="notification-row">
                          <div className="notification-info">
                            <strong>Maintenance Updates</strong>
                            <p className="muted">On the status of your maintenance requests.</p>
                          </div>
                          <div className="notification-channels">
                            <label className="custom-checkbox"><input type="checkbox" defaultChecked /><span></span></label>
                            <label className="custom-checkbox"><input type="checkbox" /><span></span></label>
                          </div>
                        </div>
                      </div>
                      <button type="submit" className="btn primary" style={{ marginTop: '20px' }}>Save Preferences</button>
                    </form>
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

export default ProfilePage;