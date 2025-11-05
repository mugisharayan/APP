import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';

const CustodianAuditLogPage = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const custodianProfile = {
    fullName: 'John K.',
    course: 'Lead Custodian',
    profilePicture: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  // Dummy audit log data
  const auditLogs = [
    { id: 1, user: 'John K. (Admin)', action: 'Payment Approved', details: 'Approved payment for Jane Doe (Room A-102)', dateTime: '29 Jul 2024, 10:15 AM', statusClass: 'approved' },
    { id: 2, user: 'System', action: 'Room Assigned', details: 'Assigned Room A-102 to Jane Doe', dateTime: '29 Jul 2024, 10:15 AM', statusClass: 'booked' },
    { id: 3, user: 'Jane Doe (Student)', action: 'Maintenance Request', details: 'New ticket for Room A-102 (Broken Window)', dateTime: '28 Jul 2024, 03:45 PM', statusClass: 'submitted' },
    { id: 4, user: 'John K. (Admin)', action: 'Payment Rejected', details: 'Rejected payment for Mike Ross (Insufficient Amount)', dateTime: '28 Jul 2024, 09:00 AM', statusClass: 'rejected' },
  ];

  const handleLogout = () => {
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
            <div className="dashboard-header">
              <h2>System Audit Log</h2>
              <p className="muted">A complete log of all actions taken in the system.</p>
            </div>

            <div className="dashboard-section">
              <div className="custodian-table-wrapper">
                <table className="custodian-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Action</th>
                      <th>Details</th>
                      <th>Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(log => (
                      <tr key={log.id}>
                        <td>{log.user}</td>
                        <td><span className={`status-badge ${log.statusClass}`}>{log.action}</span></td>
                        <td>{log.details}</td>
                        <td>{log.dateTime}</td>
                      </tr>
                    ))}
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

export default CustodianAuditLogPage;