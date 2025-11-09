import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import '../../styles/modern-dashboard.css';
import '../../styles/custodian-profile-modern.css';

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
      <section className="custodian-hero">
        <div className="floating-icons">
          <i className="fa-solid fa-user floating-icon-1"></i>
          <i className="fa-solid fa-user-gear floating-icon-2"></i>
          <i className="fa-solid fa-id-card floating-icon-3"></i>
          <i className="fa-solid fa-user-shield floating-icon-4"></i>
          <i className="fa-solid fa-user-cog floating-icon-5"></i>
          <i className="fa-solid fa-address-card floating-icon-6"></i>
        </div>
        <div className="hero-content">
          <h1>My <span className="dashboard-animated">Profile</span></h1>
          <p>Manage your personal information and account settings</p>
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

              <div className="modern-dashboard-container">
                {/* Profile Header Card */}
                <div className="profile-header-card">
                  <div className="profile-header-content">
                    <div className="profile-avatar-section">
                      <div className="profile-avatar-wrapper" onClick={handleProfilePicClick}>
                        <img src={profileData.profilePicture} alt="Profile" className="profile-avatar" />
                        <div className="avatar-edit-overlay">
                          <i className="fas fa-camera"></i>
                        </div>
                        <input type="file" id="profilePicInput" style={{ display: 'none' }} accept="image/*" onChange={handleProfilePicChange} />
                      </div>
                    </div>
                    <div className="profile-info-section">
                      <div className="profile-name-row">
                        <h2 className="profile-name">{profileData.fullName}</h2>
                        <button className="edit-profile-btn" onClick={handleEditProfile}>
                          <i className="fas fa-edit"></i> Edit Profile
                        </button>
                      </div>
                      <p className="profile-role">{profileData.role}</p>
                      <div className="profile-contact">
                        <i className="fas fa-envelope"></i>
                        <span>{profileData.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Settings Grid */}
                <div className="profile-settings-grid">
                  {/* Personal Information */}
                  <div className="settings-card">
                    <div className="settings-card-header">
                      <div className="settings-icon">
                        <i className="fas fa-user"></i>
                      </div>
                      <div className="settings-title">
                        <h3>Personal Information</h3>
                        <p>Update your personal details</p>
                      </div>
                    </div>
                    {isEditing ? (
                      <form className="settings-form" onSubmit={handleSaveProfile}>
                        <div className="form-group">
                          <label>Full Name</label>
                          <input type="text" id="editFullName" value={profileData.fullName} onChange={handleEditChange} />
                        </div>
                        <div className="form-group">
                          <label>Email Address</label>
                          <input type="email" id="editEmail" value={profileData.email} onChange={handleEditChange} />
                        </div>
                        <div className="form-group">
                          <label>Role</label>
                          <input type="text" id="editRole" value={profileData.role} readOnly className="readonly" />
                        </div>
                        <div className="form-actions">
                          <button type="submit" className="btn primary">
                            <i className="fas fa-save"></i> Save Changes
                          </button>
                          <button type="button" className="btn outline" onClick={handleCancelEdit}>
                            <i className="fas fa-times"></i> Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="settings-content">
                        <div className="info-row">
                          <span className="info-label">Full Name</span>
                          <span className="info-value">{profileData.fullName}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Email</span>
                          <span className="info-value">{profileData.email}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Role</span>
                          <span className="info-value">{profileData.role}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Security Settings */}
                  <div className="settings-card">
                    <div className="settings-card-header">
                      <div className="settings-icon">
                        <i className="fas fa-shield-alt"></i>
                      </div>
                      <div className="settings-title">
                        <h3>Security</h3>
                        <p>Manage your password and security</p>
                      </div>
                    </div>
                    <form className="settings-form" onSubmit={handlePasswordChange}>
                      <div className="form-group">
                        <label>Current Password</label>
                        <div className="password-input">
                          <input type="password" name="currentPassword" required />
                          <i className="fas fa-eye-slash toggle-password" onClick={togglePasswordVisibility}></i>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>New Password</label>
                        <div className="password-input">
                          <input type="password" name="newPassword" required />
                          <i className="fas fa-eye-slash toggle-password" onClick={togglePasswordVisibility}></i>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Confirm New Password</label>
                        <div className="password-input">
                          <input type="password" name="confirmPassword" required />
                          <i className="fas fa-eye-slash toggle-password" onClick={togglePasswordVisibility}></i>
                        </div>
                      </div>
                      <button type="submit" className="btn primary">
                        <i className="fas fa-key"></i> Update Password
                      </button>
                    </form>
                  </div>

                  {/* Preferences */}
                  <div className="settings-card">
                    <div className="settings-card-header">
                      <div className="settings-icon">
                        <i className="fas fa-cog"></i>
                      </div>
                      <div className="settings-title">
                        <h3>Preferences</h3>
                        <p>Customize your experience</p>
                      </div>
                    </div>
                    <div className="settings-content">
                      <div className="preference-item">
                        <div className="preference-info">
                          <h4>Dark Mode</h4>
                          <p>Reduce eye strain in low-light conditions</p>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" checked={darkMode} onChange={handleDarkModeToggle} />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Account Stats */}
                  <div className="settings-card">
                    <div className="settings-card-header">
                      <div className="settings-icon">
                        <i className="fas fa-chart-line"></i>
                      </div>
                      <div className="settings-title">
                        <h3>Account Activity</h3>
                        <p>Your account statistics</p>
                      </div>
                    </div>
                    <div className="settings-content">
                      <div className="stats-grid">
                        <div className="stat-item">
                          <div className="stat-value">156</div>
                          <div className="stat-label">Rooms Managed</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-value">42</div>
                          <div className="stat-label">Maintenance Tasks</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-value">8</div>
                          <div className="stat-label">Months Active</div>
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
    </>
  );
};

export default CustodianProfilePage;