import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import { AuthContext } from '../auth/AuthContext';
import DashboardSidebar from './DashboardSidebar';

const MaintenancePage = () => {
  const navigate = useNavigate();
  const { userProfile, login, logout } = useContext(AuthContext);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [fileName, setFileName] = useState('No file chosen');

  useEffect(() => {
    if (!userProfile) {
      const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
      if (storedProfile) {
        const storedBookings = JSON.parse(localStorage.getItem('bookingHistory')) || [];
        login(storedProfile, storedBookings);
      } else {
        navigate('/');
        return;
      }
    }
    const storedMaintenance = JSON.parse(localStorage.getItem('maintenanceRequests')) || [];
    setMaintenanceRequests(storedMaintenance);
  }, [userProfile, navigate, login]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('No file chosen');
    }
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    const form = e.target;
    const newRequest = {
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      category: form.issueCategory.value,
      roomNumber: form.roomNumber.value,
      description: form.issueDescription.value,
      status: ['Submitted', 'In Progress', 'Resolved'][Math.floor(Math.random() * 3)], // For demo
      // photo: fileName !== 'No file chosen' ? 'URL_TO_UPLOADED_PHOTO' : null, // In a real app, upload file
    };

    const updatedRequests = [newRequest, ...maintenanceRequests];
    localStorage.setItem('maintenanceRequests', JSON.stringify(updatedRequests));
    setMaintenanceRequests(updatedRequests);
    // showToast('Maintenance request submitted!');
    form.reset();
    setFileName('No file chosen');
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
            <h2>Loading Maintenance...</h2>
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
          <h1 className="dashboard-hero-title">Maintenance <span className="dashboard-animated">Requests</span></h1>
          <p className="dashboard-hero-subtitle">Report and track issues with your room or hostel facilities</p>
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
              <div id="maintenance" className="dashboard-panel active">
              
              {/* Maintenance Statistics */}
              <div className="stats-grid-modern" style={{marginBottom: '30px'}}>
                <div className="stat-card-modern orange">
                  <div className="stat-icon"><i className="fas fa-tools"></i></div>
                  <div className="stat-info">
                    <h3>{maintenanceRequests.filter(r => r.status === 'Submitted').length}</h3>
                    <p>Pending</p>
                  </div>
                </div>
                <div className="stat-card-modern blue">
                  <div className="stat-icon"><i className="fas fa-cog"></i></div>
                  <div className="stat-info">
                    <h3>{maintenanceRequests.filter(r => r.status === 'In Progress').length}</h3>
                    <p>In Progress</p>
                  </div>
                </div>
                <div className="stat-card-modern green">
                  <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
                  <div className="stat-info">
                    <h3>{maintenanceRequests.filter(r => r.status === 'Resolved').length}</h3>
                    <p>Resolved</p>
                  </div>
                </div>
              </div>

              <div className="maintenance-form-card">
                <div className="section-header">
                  <h3><i className="fas fa-plus-circle"></i> Submit New Request</h3>
                  <p className="muted">Report any issues with your room or facilities</p>
                </div>
                <form className="maintenance-form-modern" onSubmit={handleSubmitRequest}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="issueCategory" aria-label="Category">Category</label>
                      <select id="issueCategory" name="issueCategory" required>
                        <option value="plumbing">Plumbing</option>
                        <option value="electrical">Electrical</option>
                        <option value="furniture">Furniture</option>
                        <option value="internet">Wi-Fi/Internet</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="roomNumber" aria-label="Room Number">Room Number</label>
                      <input type="text" id="roomNumber" name="roomNumber" placeholder="e.g., A-25" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="issueDescription" aria-label="Describe the Issue">Describe the Issue</label>
                    <textarea id="issueDescription" name="issueDescription" rows="4" placeholder="Please provide as much detail as possible..." required></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="issuePhoto" aria-label="Upload a Photo (Optional)">Upload a Photo (Optional)</label>
                    <div className="file-upload-wrapper">
                      <input type="file" id="issuePhoto" name="issuePhoto" className="file-input" accept="image/*" onChange={handleFileChange} />
                      <label htmlFor="issuePhoto" className="file-upload-label">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        <span>Choose File</span>
                      </label>
                      <span className="file-name-display">{fileName}</span>
                    </div>
                  </div>
                  <button type="submit" className="btn primary">Submit Request</button>
                </form>
              </div>

              <div className="maintenance-history-section">
                <div className="section-header">
                  <h3><i className="fas fa-history"></i> Request History</h3>
                </div>
                <div className="maintenance-requests-grid">
                  {maintenanceRequests.length === 0 ? (
                    <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px'}}>
                      <i className="fas fa-clipboard-list" style={{fontSize: '64px', color: '#cbd5e1', marginBottom: '20px'}}></i>
                      <h3 style={{color: '#64748b', marginBottom: '10px'}}>No Requests Yet</h3>
                      <p className="muted">Submit your first maintenance request above</p>
                    </div>
                  ) : (
                    maintenanceRequests.map((req, index) => (
                      <div className="maintenance-request-card" key={index}>
                        <div className="request-card-header">
                          <div className="request-icon">
                            <i className={`fas fa-${req.category === 'plumbing' ? 'faucet' : req.category === 'electrical' ? 'bolt' : req.category === 'furniture' ? 'couch' : req.category === 'internet' ? 'wifi' : 'wrench'}`}></i>
                          </div>
                          <span className={`status-badge-modern ${req.status.toLowerCase().replace(' ', '-')}`}>{req.status}</span>
                        </div>
                        <div className="request-card-body">
                          <h4>{req.category.charAt(0).toUpperCase() + req.category.slice(1)}</h4>
                          <div className="request-detail-row">
                            <i className="fas fa-door-open"></i>
                            <span>Room {req.roomNumber}</span>
                          </div>
                          <div className="request-detail-row">
                            <i className="fas fa-calendar"></i>
                            <span>{req.date}</span>
                          </div>
                          <p className="request-description">{req.description}</p>
                        </div>
                        <div className="request-progress-bar">
                          <div className="progress-step" style={{width: req.status === 'Submitted' ? '33%' : req.status === 'In Progress' ? '66%' : '100%'}}></div>
                        </div>
                      </div>
                    ))
                  )}
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

export default MaintenancePage;