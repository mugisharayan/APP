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
              <h2>Maintenance Requests</h2>
              <p className="muted">Report an issue with your room or hostel facilities.</p>

              <div className="dashboard-section">
                <h3>Submit a New Request</h3>
                <form className="maintenance-request-form" onSubmit={handleSubmitRequest}>
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

              <div className="dashboard-section">
                <h3>Request History</h3>
                <table className="request-history-table">
                  <thead>
                    <tr><th>Date</th><th>Category</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {maintenanceRequests.map((req, index) => (
                      <tr key={index}>
                        <td>{req.date}</td>
                        <td>{req.category}</td>
                        <td>
                          <div className="status-tracker">
                            <div className={`status-step ${req.status === 'Submitted' || req.status === 'In Progress' || req.status === 'Resolved' ? 'active' : ''}`}>Submitted</div>
                            <div className="status-line"></div>
                            <div className={`status-step ${req.status === 'In Progress' || req.status === 'Resolved' ? 'active' : ''}`}>In Progress</div>
                            <div className="status-line"></div>
                            <div className={`status-step ${req.status === 'Resolved' ? 'active' : ''}`}>Resolved</div>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {maintenanceRequests.length === 0 && (
                      <tr><td colSpan="3" style={{ textAlign: 'center' }}>No maintenance requests submitted yet.</td></tr>
                    )}
                  </tbody>
                </table>
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

export default MaintenancePage;