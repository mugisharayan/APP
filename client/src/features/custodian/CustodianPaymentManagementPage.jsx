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
import '../../styles/custodian-modern.css';
import '../../styles/payment-modern.css';
import '../../styles/payment-enhanced.css';

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
    fullName: 'John Kamau',
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
      <section className="custodian-hero">
        <div className="floating-icons">
          <i className="fa-solid fa-credit-card floating-icon-1"></i>
          <i className="fa-solid fa-mobile-screen floating-icon-2"></i>
          <i className="fa-solid fa-building-columns floating-icon-3"></i>
          <i className="fa-solid fa-shield-check floating-icon-4"></i>
          <i className="fa-solid fa-chart-line floating-icon-5"></i>
          <i className="fa-solid fa-receipt floating-icon-6"></i>
        </div>
        <div className="hero-content">
          <h1>Payment <span className="dashboard-animated">Management</span></h1>
          <p>Verify, track, and manage all student payments efficiently</p>
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
              <div className="modern-dashboard-container">
                {/* Payment Overview Dashboard */}
                <div className="payment-overview-grid">
<div className="overview-card methods">
                    <div className="card-header">
                      <div className="card-icon"><i className="fa-solid fa-credit-card"></i></div>
                      <span className="card-title">Payment Methods</span>
                    </div>
                    <div className="methods-breakdown">
                      <div className="method-item">
                        <div className="method-icon mobile"><i className="fa-solid fa-mobile-alt"></i></div>
                        <div className="method-info">
                          <span className="method-name">Mobile Money</span>
                          <div className="method-stats">
                            <span className="percentage">65%</span>
                            <div className="progress-bar">
                              <div className="progress" style={{width: '65%'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="method-item">
                        <div className="method-icon card"><i className="fa-solid fa-credit-card"></i></div>
                        <div className="method-info">
                          <span className="method-name">Credit Card</span>
                          <div className="method-stats">
                            <span className="percentage">25%</span>
                            <div className="progress-bar">
                              <div className="progress" style={{width: '25%'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="method-item">
                        <div className="method-icon bank"><i className="fa-solid fa-university"></i></div>
                        <div className="method-info">
                          <span className="method-name">Bank Transfer</span>
                          <div className="method-stats">
                            <span className="percentage">10%</span>
                            <div className="progress-bar">
                              <div className="progress" style={{width: '10%'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="overview-card quick-actions">
                    <div className="card-header">
                      <div className="card-icon"><i className="fa-solid fa-bolt"></i></div>
                      <span className="card-title">Quick Actions</span>
                    </div>
                    <div className="quick-actions-grid">
                      <button className="quick-action-btn" onClick={() => setIsAdvancedSearchOpen(true)}>
                        <i className="fa-solid fa-search"></i>
                        <span>Advanced Search</span>
                      </button>
                      <button className="quick-action-btn" onClick={handleExportData}>
                        <i className="fa-solid fa-download"></i>
                        <span>Export Data</span>
                      </button>
                      <button className="quick-action-btn" onClick={() => setIsFilterSectionVisible(!isFilterSectionVisible)}>
                        <i className="fa-solid fa-filter"></i>
                        <span>Filters</span>
                      </button>
                      <button className="quick-action-btn" onClick={selectAllPayments}>
                        <i className="fa-solid fa-check-double"></i>
                        <span>Select All</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Payment Management Header */}
                <div className="payment-management-header-modern">
                  <div className="header-left">
                    <div className="section-title">
                      <h3><i className="fas fa-shield-check"></i> Payment Verification Center</h3>
                      <div className="real-time-indicator">
                        <div className="status-dot pulsing"></div>
                        <span>Live updates • Last sync: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="header-right">
                    <div className="bulk-actions">
                      <PermissionGuard userRole={custodianProfile.role} permission={PERMISSIONS.BULK_PAYMENT_OPERATIONS}>
                        {selectedPayments.length > 0 && (
                          <div className="bulk-actions-container">
                            <div className="selection-info">
                              <span className="selected-count">{selectedPayments.length} selected</span>
                            </div>
                            <div className="bulk-buttons">
                              <button className="bulk-btn approve" onClick={handleBulkApprove}>
                                <i className="fas fa-check-double"></i>
                                Approve All
                              </button>
                              <button className="bulk-btn reject" onClick={handleBulkReject}>
                                <i className="fas fa-times-circle"></i>
                                Reject All
                              </button>
                            </div>
                          </div>
                        )}
                      </PermissionGuard>
                    </div>
                  </div>
                </div>

              {/* Advanced Filters */}
              <div className={`advanced-filters-section ${isFilterSectionVisible ? 'expanded' : ''}`}>
                <div className="filters-container">
                  <div className="filter-group">
                    <label>Status</label>
                    <select className="filter-select">
                      <option>All Statuses</option>
                      <option>Pending Review</option>
                      <option>Flagged</option>
                      <option>Under Investigation</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Payment Method</label>
                    <select className="filter-select">
                      <option>All Methods</option>
                      <option>Mobile Money</option>
                      <option>Credit Card</option>
                      <option>Bank Transfer</option>
                      <option>Cash</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Amount Range</label>
                    <div className="amount-range">
                      <input type="number" placeholder="Min" className="amount-input" />
                      <span>to</span>
                      <input type="number" placeholder="Max" className="amount-input" />
                    </div>
                  </div>
                  <div className="filter-group">
                    <label>Date Range</label>
                    <div className="date-range">
                      <input type="date" className="date-input" />
                      <span>to</span>
                      <input type="date" className="date-input" />
                    </div>
                  </div>
                  <div className="filter-actions">
                    <button className="filter-btn clear">Clear All</button>
                    <button className="filter-btn apply">Apply Filters</button>
                  </div>
                </div>
              </div>

              {/* Pending Verifications Section */}
              <div className="payments-verification-section">
                <div className="payments-grid-enhanced">
                  {pendingPayments.length === 0 ? (
                    <div className="empty-state">
                      <i className="fas fa-check-circle"></i>
                      <h4>All Caught Up!</h4>
                      <p>No pending payments to review at the moment.</p>
                    </div>
                  ) : (
                    pendingPayments.map(payment => (
                      <div className="payment-card-modern" key={payment.id}>
                        <div className="payment-card-header">
                          <div className="student-section">
                            <input 
                              type="checkbox" 
                              checked={selectedPayments.includes(payment.id)}
                              onChange={() => togglePaymentSelection(payment.id)}
                              className="payment-checkbox"
                            />
                            <div className="student-avatar">
                              <img src={payment.avatar} alt={payment.studentName} />
                            </div>
                            <div className="student-details">
                              <h5>{payment.studentName}</h5>
                              <span className="student-id">{payment.studentId}</span>
                            </div>
                          </div>
                          <div className="payment-status">
                            <span className={`status-badge-modern ${payment.status.toLowerCase()}`}>
                              {payment.status === 'Flagged' && <i className="fas fa-flag"></i>}
                              {payment.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="payment-details-modern">
                          <div className="detail-row">
                            <span className="label">Amount</span>
                            <span className="value amount">UGX {payment.amount}</span>
                          </div>
                          <div className="detail-row">
                            <span className="label">Method</span>
                            <span className={`payment-method ${payment.method.toLowerCase().replace(' ', '-')}`}>
                              <i className={`fas ${payment.method === 'Mobile Money' ? 'fa-mobile-alt' : payment.method === 'Credit Card' ? 'fa-credit-card' : 'fa-university'}`}></i>
                              {payment.method}
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="label">Submitted</span>
                            <span className="value">{payment.date}</span>
                          </div>
                          <div className="detail-row">
                            <span className="label">Proof</span>
                            <button className="proof-btn" onClick={() => setIsViewProofModalOpen(true)}>
                              <i className="fas fa-eye"></i> View Receipt
                            </button>
                          </div>
                        </div>
                        
                        <div className="payment-actions-modern">
                          <button className="action-btn reject" onClick={() => handleRejectPayment(payment.id)}>
                            <i className="fas fa-times"></i> Reject
                          </button>
                          <button className="action-btn approve" onClick={() => handleApprovePayment(payment.id)}>
                            <i className="fas fa-check"></i> Approve
                          </button>
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
      
      {isAdvancedSearchOpen && (
        <AdvancedSearch 
          isOpen={isAdvancedSearchOpen}
          onClose={() => setIsAdvancedSearchOpen(false)}
          onSearch={(filters) => setSearchFilters(filters)}
        />
      )}
      
      <TwoFactorAuth 
        isOpen={is2FAOpen}
        onClose={() => { setIs2FAOpen(false); setPendingAction(null); }}
        onVerify={handle2FAVerify}
      />
    </>
  );
};

export default CustodianPaymentManagementPage;