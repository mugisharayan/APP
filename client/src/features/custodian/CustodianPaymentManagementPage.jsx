import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';

const CustodianPaymentManagementPage = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isFilterSectionVisible, setIsFilterSectionVisible] = useState(false);
  const [isViewProofModalOpen, setIsViewProofModalOpen] = useState(false);

  const custodianProfile = {
    fullName: 'John K.',
    course: 'Lead Custodian',
    profilePicture: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  // Dummy data for payments
  const [pendingPayments, setPendingPayments] = useState([
    { id: 1, studentName: 'John Doe', studentId: '22/U/12345', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', amount: '850,000', method: 'Mobile Money', date: '2024-07-28 10:30 AM', status: 'Pending' },
    { id: 2, studentName: 'Aisha Bello', studentId: '22/U/98765', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', amount: '850,000', method: 'Mobile Money', date: '2024-07-27 02:11 PM', status: 'Flagged' },
  ]);

  const [paymentHistory, setPaymentHistory] = useState([
    { id: 3, studentName: 'Michael Chen', studentId: '22/U/54321', method: 'Credit Card', amount: '1,200,000', dateVerified: '2024-07-26', status: 'Approved', refundStatus: 'N/A' },
    { id: 4, studentName: 'Sarah K.', studentId: '22/U/11223', method: 'Bank Transfer', amount: '950,000', dateVerified: '2024-07-25', status: 'Approved', refundStatus: 'N/A' },
    { id: 5, studentName: 'David Okello', studentId: '22/U/44556', method: 'Mobile Money', amount: '700,000', dateVerified: '2024-07-25', status: 'Rejected', refundStatus: 'Pending' },
  ]);

  const handleApprovePayment = (id) => {
    setPendingPayments(prev => prev.filter(p => p.id !== id));
    const approvedPayment = pendingPayments.find(p => p.id === id);
    if (approvedPayment) {
      setPaymentHistory(prev => [{ ...approvedPayment, status: 'Approved', dateVerified: new Date().toLocaleDateString('en-GB') }, ...prev]);
      // showToast(`Payment for ${approvedPayment.studentName} approved.`);
    }
  };

  const handleRejectPayment = (id) => {
    setPendingPayments(prev => prev.filter(p => p.id !== id));
    const rejectedPayment = pendingPayments.find(p => p.id === id);
    if (rejectedPayment) {
      setPaymentHistory(prev => [{ ...rejectedPayment, status: 'Rejected', dateVerified: new Date().toLocaleDateString('en-GB'), refundStatus: 'Pending' }, ...prev]);
      // showToast(`Payment for ${rejectedPayment.studentName} rejected.`);
    }
  };

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
              <h2>Payment Management</h2>
              <p className="muted">Verify, track, and manage all student payments.</p>
            </div>

            {/* Pending Verifications Section */}
            <div className="dashboard-section">
              <div className="section-header">
                <h3>Pending Verifications</h3>
                <div className="section-actions">
                  <button className="btn outline small" onClick={() => setIsFilterSectionVisible(!isFilterSectionVisible)}><i className="fas fa-filter"></i> Filter</button>
                  <button className="btn primary small"><i className="fas fa-check-double"></i> Approve Selected</button>
                </div>
              </div>
              {/* Filter Section */}
              <div className={`filter-section ${isFilterSectionVisible ? 'visible' : ''}`} id="filterSection">
                <div className="form-group"><label>Status</label><select><option>All</option><option>Pending</option><option>Flagged</option></select></div>
                <div className="form-group"><label>Payment Method</label><select><option>All</option><option>Mobile Money</option><option>Credit Card</option><option>Bank Transfer</option></select></div>
                <div className="form-group"><label>Date Range</label><input type="date" /></div>
              </div>
              <div className="payment-verification-grid">
                {pendingPayments.length === 0 ? (
                  <p className="muted" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No pending payments.</p>
                ) : (
                  pendingPayments.map(payment => (
                    <div className="payment-card" key={payment.id}>
                      <div className="payment-card-header">
                        <div className="student-info">
                          <img src={payment.avatar} alt={payment.studentName} />
                          <div>
                            <h5>{payment.studentName}</h5>
                            <p>{payment.studentId}</p>
                          </div>
                        </div>
                        <span className={`status-badge ${payment.status.toLowerCase()}`}>{payment.status === 'Flagged' && <i className="fas fa-flag"></i>} {payment.status}</span>
                      </div>
                      <div className="payment-card-body">
                        <div className="payment-detail"><span>Amount:</span> <strong>UGX {payment.amount}</strong></div>
                        <div className="payment-detail"><span>Method:</span> <span className={`payment-tag ${payment.method.toLowerCase().replace(' ', '-')}`}>{payment.method}</span></div>
                        <div className="payment-detail"><span>Date:</span> {payment.date}</div>
                        <div className="payment-detail proof">
                          <span>Proof:</span>
                          <button className="btn-link view-proof-btn" onClick={() => setIsViewProofModalOpen(true)}>View Receipt</button>
                        </div>
                      </div>
                      <div className="payment-card-actions">
                        <button className="btn outline small reject-full" onClick={() => handleRejectPayment(payment.id)}>Reject</button>
                        <button className="btn primary small approve-full" onClick={() => handleApprovePayment(payment.id)}>Approve</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Payment History Section */}
            <div className="dashboard-section">
              <div className="section-header">
                <h3>Payment History</h3>
              </div>
              <div className="custodian-table-wrapper">
                <table className="custodian-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Student ID</th>
                      <th>Payment Method</th>
                      <th>Amount</th>
                      <th>Date Verified</th>
                      <th>Status</th>
                      <th>Refund Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map(record => (
                      <tr key={record.id}>
                        <td>{record.studentName}</td>
                        <td>{record.studentId}</td>
                        <td><span className={`payment-tag ${record.method.toLowerCase().replace(' ', '-')}`}>{record.method}</span></td>
                        <td>UGX {record.amount}</td>
                        <td>{record.dateVerified}</td>
                        <td><span className={`status-badge ${record.status.toLowerCase()}`}>{record.status}</span></td>
                        <td><span className={`status-badge ${record.refundStatus.toLowerCase().replace('n/a', 'neutral')}`}>{record.refundStatus}</span></td>
                        <td><button className="btn-icon download" title="Download Receipt" disabled={record.status !== 'Approved'}><i className="fas fa-download"></i></button></td>
                      </tr>
                    ))}
                    {paymentHistory.length === 0 && (
                      <tr><td colSpan="8" style={{ textAlign: 'center' }}>No payment history available.</td></tr>
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

      {/* View Proof Modal */}
      {isViewProofModalOpen && (
        <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && setIsViewProofModalOpen(false)}>
          <div className="modal-content proof-modal-content animate-on-scroll">
            <button className="close-modal-btn" onClick={() => setIsViewProofModalOpen(false)}>&times;</button>
            <h3>Payment Proof</h3>
            <div className="proof-image-container">
              <img src="https://i.imgur.com/J2yAgdC.png" alt="Sample payment receipt" />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CustodianPaymentManagementPage;