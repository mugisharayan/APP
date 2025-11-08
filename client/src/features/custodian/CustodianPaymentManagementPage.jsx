import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import useRealTimeUpdates from '../../hooks/useRealTimeUpdates';
import AdvancedSearch from '../../components/search/AdvancedSearch';
import { exportToCSV, formatPaymentData } from '../../utils/exportUtils';
import PermissionGuard from '../../components/auth/PermissionGuard';
import TwoFactorAuth from '../../components/auth/TwoFactorAuth';
import { PERMISSIONS, ROLES } from '../../utils/permissions';
import '../../styles/modern-dashboard.css';
import '../../styles/mobile-responsive.css';

const CustodianPaymentManagementPage = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isFilterSectionVisible, setIsFilterSectionVisible] = useState(false);
  const [isViewProofModalOpen, setIsViewProofModalOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({});
  const [is2FAOpen, setIs2FAOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const custodianProfile = {
    fullName: 'John K.',
    course: 'Lead Custodian',
    role: ROLES.SENIOR_CUSTODIAN,
    profilePicture: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  // Real-time data for payments
  const initialPayments = [
    { id: 1, studentName: 'John Doe', studentId: '22/U/12345', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', amount: '850,000', method: 'Mobile Money', date: '2024-07-28 10:30 AM', status: 'Pending', selected: false },
    { id: 2, studentName: 'Aisha Bello', studentId: '22/U/98765', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', amount: '850,000', method: 'Mobile Money', date: '2024-07-27 02:11 PM', status: 'Flagged', selected: false },
  ];
  const { data: pendingPayments, setData: setPendingPayments, lastUpdated } = useRealTimeUpdates(initialPayments);
  const [selectedPayments, setSelectedPayments] = useState([]);

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

  const togglePaymentSelection = (id) => {
    setSelectedPayments(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectAllPayments = () => {
    const allIds = pendingPayments.map(p => p.id);
    setSelectedPayments(selectedPayments.length === allIds.length ? [] : allIds);
  };

  const handleBulkApprove = () => {
    setPendingAction('bulk_approve');
    setIs2FAOpen(true);
  };

  const executeBulkApprove = () => {
    const approvedPayments = pendingPayments.filter(p => selectedPayments.includes(p.id));
    setPendingPayments(prev => prev.filter(p => !selectedPayments.includes(p.id)));
    setPaymentHistory(prev => [
      ...approvedPayments.map(p => ({ ...p, status: 'Approved', dateVerified: new Date().toLocaleDateString('en-GB') })),
      ...prev
    ]);
    setSelectedPayments([]);
  };

  const handleBulkReject = () => {
    const rejectedPayments = pendingPayments.filter(p => selectedPayments.includes(p.id));
    setPendingPayments(prev => prev.filter(p => !selectedPayments.includes(p.id)));
    setPaymentHistory(prev => [
      ...rejectedPayments.map(p => ({ ...p, status: 'Rejected', dateVerified: new Date().toLocaleDateString('en-GB'), refundStatus: 'Pending' })),
      ...prev
    ]);
    setSelectedPayments([]);
  };

  const handleExportData = () => {
    const formattedData = formatPaymentData([...pendingPayments, ...paymentHistory]);
    exportToCSV(formattedData, `payment-data-${new Date().toISOString().split('T')[0]}`);
  };

  const handle2FAVerify = (code) => {
    if (code === '123456') { // Simulate verification
      if (pendingAction === 'bulk_approve') {
        executeBulkApprove();
      }
      setIs2FAOpen(false);
      setPendingAction(null);
    }
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  return (
    <>
      <section className="dashboard-hero-section">
        <div className="floating-home-icons">
          <i className="fa-solid fa-credit-card floating-home-1"></i>
          <i className="fa-solid fa-mobile-screen floating-home-2"></i>
          <i className="fa-solid fa-building-columns floating-home-3"></i>
          <i className="fa-solid fa-shield-check floating-home-4"></i>
          <i className="fa-solid fa-chart-line floating-home-5"></i>
          <i className="fa-solid fa-receipt floating-home-6"></i>
        </div>
        <div className="dashboard-hero-container">
          <h1 className="dashboard-hero-title">Payment <span className="dashboard-animated">Management</span></h1>
          <p className="dashboard-hero-subtitle">Verify, track, and manage all student payments efficiently</p>
        </div>
      </section>
      
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                  Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
                </div>
              </div>

              {/* Pending Verifications Section */}
              <div className="dashboard-section">
                <div className="section-header">
                  <h3>Pending Verifications</h3>
                  <div className="section-actions">
                    <button className="btn outline small" onClick={() => setIsAdvancedSearchOpen(true)}><i className="fas fa-search"></i> Advanced Search</button>
                    <button className="btn outline small" onClick={() => setIsFilterSectionVisible(!isFilterSectionVisible)}><i className="fas fa-filter"></i> Filter</button>
                    <button className="btn outline small" onClick={handleExportData}><i className="fas fa-download"></i> Export CSV</button>
                    <PermissionGuard userRole={custodianProfile.role} permission={PERMISSIONS.BULK_PAYMENT_OPERATIONS}>
                      {selectedPayments.length > 0 && (
                        <>
                          <button className="btn primary small" onClick={handleBulkApprove}><i className="fas fa-check-double"></i> Approve ({selectedPayments.length})</button>
                          <button className="btn outline small" onClick={handleBulkReject} style={{color: '#dc2626', borderColor: '#dc2626'}}><i className="fas fa-times"></i> Reject ({selectedPayments.length})</button>
                        </>
                      )}
                    </PermissionGuard>
                  </div>
                </div>
                {/* Filter Section */}
                <div className={`filter-section ${isFilterSectionVisible ? 'visible' : ''}`} id="filterSection">
                  <div className="form-group"><label aria-label="Status">Status</label><select><option>All</option><option>Pending</option><option>Flagged</option></select></div>
                  <div className="form-group"><label aria-label="Payment Method">Payment Method</label><select><option>All</option><option>Mobile Money</option><option>Credit Card</option><option>Bank Transfer</option></select></div>
                  <div className="form-group"><label aria-label="Date Range">Date Range</label><input type="date" /></div>
                </div>
                <div className="payment-verification-grid">
                  {pendingPayments.length === 0 ? (
                    <p className="muted" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No pending payments.</p>
                  ) : (
                    pendingPayments.map(payment => (
                      <div className="payment-card" key={payment.id}>
                        <div className="payment-card-header">
                          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                            <input 
                              type="checkbox" 
                              checked={selectedPayments.includes(payment.id)}
                              onChange={() => togglePaymentSelection(payment.id)}
                              style={{width: '16px', height: '16px'}}
                            />
                            <div className="student-info">
                              <img src={payment.avatar} alt={payment.studentName} />
                              <div>
                                <h5>{payment.studentName}</h5>
                                <p>{payment.studentId}</p>
                              </div>
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
      </main>
      
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
      
      <AdvancedSearch 
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        onSearch={(filters) => setSearchFilters(filters)}
      />
      
      <TwoFactorAuth 
        isOpen={is2FAOpen}
        onClose={() => { setIs2FAOpen(false); setPendingAction(null); }}
        onVerify={handle2FAVerify}
      />
    </>
  );
};

export default CustodianPaymentManagementPage;