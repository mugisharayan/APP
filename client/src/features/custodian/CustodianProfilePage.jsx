import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import '../../styles/modern-dashboard.css';

const CustodianProfilePage = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'John K.',
    email: 'john.k@bookmyhostel.com',
    role: 'Lead Custodian',
    profilePicture: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  });
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setProfileData(prev => ({ ...prev, [id.replace('edit', '').toLowerCase()]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // In a real app, you'd send this to a backend
    // showToast('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const result = event.target.result;
          if (typeof result === 'string' && result.startsWith('data:image/')) {
            setProfileData(prev => ({ ...prev, profilePicture: result }));
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
    // showToast('Notification preferences saved!');
  };

  const handleDarkModeToggle = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleProfilePicClick = () => {
    document.getElementById('profilePicInput').click();
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  return (
    <>
      <section className="dashboard-hero-section">
        <div className="floating-home-icons">
          <i className="fa-solid fa-user floating-home-1"></i>
          <i className="fa-solid fa-user-gear floating-home-2"></i>
          <i className="fa-solid fa-id-card floating-home-3"></i>
          <i className="fa-solid fa-user-shield floating-home-4"></i>
          <i className="fa-solid fa-user-cog floating-home-5"></i>
          <i className="fa-solid fa-address-card floating-home-6"></i>
        </div>
        <div className="dashboard-hero-container">
          <div className="hero-profile-info">
            <img src={profileData.profilePicture} alt="Profile" className="hero-profile-pic" />
            <div className="hero-profile-text">
              <h2 className="hero-profile-name">{profileData.fullName}</h2>
              <p className="hero-profile-role">{profileData.role}</p>
            </div>
          </div>
          <h1 className="dashboard-hero-title">My <span className="dashboard-animated">Profile</span></h1>
          <p className="dashboard-hero-subtitle">Manage your personal information and account settings</p>
        </div>
      </section>
      
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-layout">
            <DashboardSidebar
              user={{ fullName: profileData.fullName, course: profileData.role, profilePicture: profileData.profilePicture }}
              role="custodian"
              onLogout={() => setIsLogoutModalOpen(true)}
            />
            <div className="dashboard-content">

            <div className="profile-content-new">
              <div className="profile-banner-card">
                <div className="profile-pic-banner-wrapper" onClick={handleProfilePicClick}>
                  <img src={profileData.profilePicture} alt="Custodian profile" id="mainProfilePic" />
                  <div className="edit-overlay">Change</div>
                  <input type="file" id="profilePicInput" style={{ display: 'none' }} accept="image/*" onChange={handleProfilePicChange} />
                </div>
                <div className="profile-banner-content">
                  {!isEditing ? (
                    <div id="profile-view">
                      <div className="profile-main-info">
                        <h2>{profileData.fullName}</h2>
                        <button className="btn-icon edit-profile-btn" onClick={handleEditProfile} title="Edit Profile"><i className="fas fa-pen"></i></button>
                      </div>
                      <p className="profile-role">{profileData.role}</p>
                      <div className="profile-contact-grid">
                        <div className="profile-contact-item">
                          <i className="fas fa-envelope"></i>
                          <span>{profileData.email}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form id="profile-edit-form" onSubmit={handleSaveProfile}>
                      <div className="form-group"><label aria-label="Full Name">Full Name</label><input type="text" id="editFullName" value={profileData.fullName} onChange={handleEditChange} /></div>
                      <div className="form-group"><label aria-label="Email Address">Email Address</label><input type="email" id="editEmail" value={profileData.email} onChange={handleEditChange} /></div>
                      <div className="form-group"><label>Role</label><input type="text" id="editRole" value={profileData.role} readOnly /></div>
                      <div className="form-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" className="btn primary">Save Changes</button>
                        <button type="button" className="btn outline" onClick={handleCancelEdit}>Cancel</button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              <div className="profile-page-grid">
                <div className="content-section">
                  <div className="section-header"><h2>Display Settings</h2></div>
                  <div className="notification-toggle">
                    <div><strong>Dark Mode</strong><p className="muted">Reduce eye strain in low-light conditions.</p></div>
                    <label className="switch"><input type="checkbox" id="darkModeToggle" checked={darkMode} onChange={handleDarkModeToggle} /><span className="slider round"></span></label>
                  </div>
                </div>
                <div className="content-section">
                  <div className="section-header"><h2>Security Settings</h2></div>
                  <div className="security-sections-wrapper">
                    <div className="security-section">
                      <div className="security-section-header"><h4>Change Password</h4><small className="muted">Last updated: 3 months ago</small></div>
                      <form id="password-change-form" onSubmit={handlePasswordChange}>
                        <div className="form-group"><label htmlFor="currentPassword" aria-label="Current Password">Current Password</label><div className="password-wrapper"><input type="password" id="currentPassword" name="currentPassword" required /><i className="fas fa-eye-slash toggle-password" onClick={togglePasswordVisibility}></i></div></div>
                        <div className="form-group"><label htmlFor="newPassword" aria-label="New Password">New Password</label><div className="password-wrapper"><input type="password" id="newPassword" name="newPassword" required /><i className="fas fa-eye-slash toggle-password" onClick={togglePasswordVisibility}></i></div></div>
                        <div className="form-group"><label htmlFor="confirmPassword" aria-label="Confirm New Password">Confirm New Password</label><div className="password-wrapper"><input type="password" id="confirmPassword" name="confirmPassword" required /><i className="fas fa-eye-slash toggle-password" onClick={togglePasswordVisibility}></i></div></div>
                        <button type="submit" className="btn primary" style={{ marginTop: '10px' }}>Update Password</button>
                      </form>
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
    </>
  );
};

export default CustodianProfilePage;