import React, { useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import '../../styles/booking-page.css';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const hostelName = searchParams.get('hostel');
  const roomName = searchParams.get('room');
  const roomPrice = searchParams.get('price');
  const hostelImage = searchParams.get('image');

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    course: '',
    yearOfStudy: '',
    studentNumber: '',
    residence: '',
    nextOfKinName: '',
    nextOfKinContact: '',
    guardianName: '',
    guardianContact: '',
    notes: '',
    healthIssues: '',
    studentIdUpload: null,
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fileName, setFileName] = useState('No file chosen');
  const [paymentMethod, setPaymentMethod] = useState('mobile-money');
  const [paymentFileName, setPaymentFileName] = useState('No file chosen');
  const [mobileMoneyPhone, setMobileMoneyPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  
  const price = parseInt(roomPrice || '0');
  const serviceFee = 5000;
  const totalPrice = price + serviceFee;
  const MERCHANT_NUMBER = '0740099098';

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));

    if (type === 'file' && files.length > 0) {
      setFileName(files[0].name);
    } else if (type === 'file') {
      setFileName('No file chosen');
    }
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setPaymentFileName('No file chosen');
  };

  const handlePaymentFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setPaymentFileName(e.target.files[0].name);
    } else {
      setPaymentFileName('No file chosen');
    }
  };

  const handleConfirmPayment = () => {
    // Validate payment method specific fields
    if (paymentMethod === 'mobile-money' && !mobileMoneyPhone) {
      alert('Please enter your mobile money phone number');
      return;
    }
    if (paymentMethod === 'credit-card' && (!cardNumber || !cardExpiry || !cardCVC)) {
      alert('Please fill in all card details');
      return;
    }
    if (paymentMethod === 'bank-transfer' && paymentFileName === 'No file chosen') {
      alert('Please upload payment proof for bank transfer');
      return;
    }
    
    // Show PIN modal for mobile money
    if (paymentMethod === 'mobile-money') {
      setShowPinModal(true);
      return;
    }
    
    // Process other payment methods directly
    completeBooking();
  };
  
  const completeBooking = () => {
    const newBooking = {
      hostel: hostelName,
      room: roomName,
      price,
      bookingDate: new Date().toISOString(),
      status: 'Confirmed',
      paymentMethod,
      paymentDetails: paymentMethod === 'mobile-money' ? { phone: mobileMoneyPhone } : {},
    };
    const userProfile = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      course: formData.course,
      profilePicture: '',
      role: 'student',
    };
    login(userProfile, [newBooking]);
    navigate('/dashboard');
  };
  
  const handlePinSubmit = async () => {
    if (!pin || pin.length < 4) {
      alert('Please enter a valid PIN');
      return;
    }
    
    setIsProcessing(true);
    setPaymentStatus('Initiating payment...');
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPaymentStatus('Sending request to ' + mobileMoneyPhone + '...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPaymentStatus('Verifying PIN...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPaymentStatus('Processing payment to ' + MERCHANT_NUMBER + '...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPaymentStatus('Payment successful! ✓');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsProcessing(false);
    setShowPinModal(false);
    setPin('');
    setPaymentStatus('');
    
    // Move to confirmation step
    setCurrentStep(3);
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      return;
    }
    setCurrentStep(2);
  };

  return (
    <main className="booking-page">
      {/* Hero Section */}
      <section className="booking-hero-section">
        <div className="floating-home-icons">
          <i className="fa-solid fa-home floating-home-1"></i>
          <i className="fa-solid fa-home floating-home-2"></i>
          <i className="fa-solid fa-home floating-home-3"></i>
          <i className="fa-solid fa-home floating-home-4"></i>
          <i className="fa-solid fa-home floating-home-5"></i>
          <i className="fa-solid fa-home floating-home-6"></i>
        </div>
        <div className="booking-hero-container">
          <div className="booking-hero-content">
            <h1 className="booking-hero-title">Complete Your <span className="booking-animated">Booking</span></h1>
            <p className="booking-hero-subtitle">Please fill in your details to secure your room. This should only take a few minutes.</p>
            <button onClick={() => navigate(-1)} className="back-link">
              <i className="fa-solid fa-arrow-left"></i> Back to Hostel
            </button>
          </div>
        </div>
      </section>
      
      <div className="progress-steps">
        <div className={`step ${currentStep === 1 ? 'active' : ''}`}>
          <span className="step-number">1</span>
          <span>Booking Details</span>
        </div>
        <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
          <span className="step-number">2</span>
          <span>Payment</span>
        </div>
        <div className={`step ${currentStep === 3 ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span>Confirmation</span>
        </div>
      </div>

      <div className="booking-fullwidth-section">
            {/* Booking Summary at Top - Only show on step 1 */}
            {currentStep === 1 && (
            <div className="booking-summary-top">
              <div>
                <div className="summary-hostel-image">
                  <img src={hostelImage || 'https://via.placeholder.com/300x200.png?text=Hostel+Image'} alt="Selected hostel image" />
                </div>
                <div className="summary-details">
                  <h3>Booking Summary</h3>
                  <div className="summary-grid">
                    <div className="summary-item-inline">
                      <small>Hostel</small>
                      <span>{hostelName || 'N/A'}</span>
                    </div>
                    <div className="summary-item-inline">
                      <small>Room Type</small>
                      <span>{roomName || 'N/A'}</span>
                    </div>
                    <div className="summary-item-inline total-inline">
                      <small>Total Price</small>
                      <span>UGX {parseInt(roomPrice || 0).toLocaleString()} <small>/ semester</small></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
            
            {/* Form Below */}
            <div className="booking-form-col">
            {currentStep === 1 && (
            <form className="booking-form" onSubmit={handleProceedToPayment}>
              <div className="form-sections-row">
              <div className="form-section">
                <h3><span className="section-number">1</span> Personal Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="fullName" aria-label="Full Name">Full Name</label>
                    <input type="text" id="fullName" name="fullName" placeholder="e.g., Jane Doe" required value={formData.fullName} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" aria-label="Email Address">Email Address</label>
                    <input type="email" id="email" name="email" placeholder="e.g., jane.doe@student.mak.ac.ug" required value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone" aria-label="Telephone Number">Telephone Number</label>
                    <input type="tel" id="phone" name="phone" placeholder="e.g., 0771234567" required value={formData.phone} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender" aria-label="Gender">Gender</label>
                    <select id="gender" name="gender" required value={formData.gender} onChange={handleInputChange}>
                      <option value="" disabled aria-label="Select your gender">Select your gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="dob" aria-label="Date of Birth">Date of Birth</label>
                    <input type="date" id="dob" name="dob" required value={formData.dob} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
              <div className="form-section">
                <h3><span className="section-number">2</span> Academic Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="course" aria-label="Course / Program">Course / Program</label>
                    <input type="text" id="course" name="course" placeholder="e.g., Bachelor of Computer Science" required value={formData.course} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="yearOfStudy" aria-label="Year of Study">Year of Study</label>
                    <select id="yearOfStudy" name="yearOfStudy" required value={formData.yearOfStudy} onChange={handleInputChange}>
                      <option value="" disabled>Select your year</option>
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                      <option value="5">Postgraduate</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="studentNumber" aria-label="Student Number">Student Number</label>
                    <input type="text" id="studentNumber" name="studentNumber" placeholder="e.g., 2100712345" required value={formData.studentNumber} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label htmlFor="studentIdUpload" aria-label="Upload University ID or Admission Letter">Upload University ID or Admission Letter</label>
                  <div className="file-upload-wrapper">
                    <input type="file" id="studentIdUpload" name="studentIdUpload" className="file-input" required accept="image/*,.pdf" onChange={handleInputChange} />
                    <label htmlFor="studentIdUpload" className="file-upload-label">
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                      <span>Choose File</span>
                    </label>
                    <span className="file-name-display">{fileName}</span>
                  </div>
                </div>
              </div>
              </div>

              <div className="form-sections-row">
              <div className="form-section">
                <h3><span className="section-number">3</span> Contact & Emergency Details</h3>
                <div className="form-group">
                  <label htmlFor="residence" aria-label="Place of Residence">Place of Residence</label>
                  <input type="text" id="residence" name="residence" placeholder="e.g., Mbarara, Uganda" required value={formData.residence} onChange={handleInputChange} />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="nextOfKinName" aria-label="Next of Kin's Name">Next of Kin's Name</label>
                    <input type="text" id="nextOfKinName" name="nextOfKinName" required value={formData.nextOfKinName} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nextOfKinContact" aria-label="Next of Kin's Contact">Next of Kin's Contact</label>
                    <input type="tel" id="nextOfKinContact" name="nextOfKinContact" required value={formData.nextOfKinContact} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="guardianName" aria-label="Parent/Guardian's Name">Parent/Guardian's Name</label>
                    <input type="text" id="guardianName" name="guardianName" required value={formData.guardianName} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="guardianContact" aria-label="Parent/Guardian's Contact">Parent/Guardian's Contact</label>
                    <input type="tel" id="guardianContact" name="guardianContact" required value={formData.guardianContact} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
              <div className="form-section">
                <h3><span className="section-number">4</span> Additional Information</h3>
                <div className="form-group">
                  <label htmlFor="notes" aria-label="Additional Notes or Special Requests (Optional)">Additional Notes or Special Requests (Optional)</label>
                  <textarea id="notes" name="notes" rows="4" placeholder="e.g., I prefer a quiet room on a lower floor..." value={formData.notes} onChange={handleInputChange}></textarea>
                </div>
                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label htmlFor="healthIssues" aria-label="Health Issues or Allergies (Optional)">Health Issues or Allergies (Optional)</label>
                  <textarea id="healthIssues" name="healthIssues" rows="3" placeholder="e.g., Asthma, peanut allergy. This information is kept confidential." value={formData.healthIssues} onChange={handleInputChange}></textarea>
                </div>
              </div>
              </div>
              
              <div className="terms-agreement">
                <input type="checkbox" id="terms" name="terms" required checked={termsAccepted} onChange={handleTermsChange} />
                <label htmlFor="terms" aria-label="I have read and agree to the Terms and Conditions and the hostel's booking policy.">I have read and agree to the <a href="#">Terms and Conditions</a> and the hostel's booking policy.</label>
              </div>
              <p className="summary-note">
                By proceeding, you agree to our Terms of Service and the hostel's rules and regulations.
              </p>
              <div style={{ textAlign: 'center' }}>
                <button type="submit" className="btn primary book-btn" id="paymentBtn" disabled={!termsAccepted}>Proceed to Payment</button>
              </div>
            </form>
            )}
            
            {currentStep === 3 && (
              <div style={{ padding: '80px 50px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', width: '120px', height: '120px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', boxShadow: '0 20px 60px rgba(16, 185, 129, 0.4)' }}>
                  <i className="fa-solid fa-check" style={{ fontSize: '60px', color: 'white' }}></i>
                </div>
                <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#1e293b', marginBottom: '16px' }}>Congratulations!</h2>
                <h3 style={{ fontSize: '24px', fontWeight: 600, color: '#10b981', marginBottom: '30px' }}>Your Payment Has Been Received</h3>
                <p style={{ fontSize: '16px', color: '#64748b', lineHeight: '1.8', marginBottom: '20px' }}>Thank you for booking with us! Your payment of <strong style={{ color: '#0ea5e9' }}>UGX {totalPrice.toLocaleString()}</strong> has been successfully processed.</p>
                <p style={{ fontSize: '16px', color: '#64748b', lineHeight: '1.8', marginBottom: '40px' }}>You will receive a confirmation email at <strong style={{ color: '#0ea5e9' }}>{formData.email}</strong> with your booking details.</p>
                <div style={{ background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', padding: '30px', borderRadius: '16px', border: '2px solid #bae6fd', marginBottom: '40px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>Booking Summary</h4>
                  <div style={{ display: 'grid', gap: '12px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e0f2fe' }}>
                      <span style={{ color: '#64748b', fontSize: '14px' }}>Hostel:</span>
                      <strong style={{ color: '#1e293b', fontSize: '14px' }}>{hostelName}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e0f2fe' }}>
                      <span style={{ color: '#64748b', fontSize: '14px' }}>Room Type:</span>
                      <strong style={{ color: '#1e293b', fontSize: '14px' }}>{roomName}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e0f2fe' }}>
                      <span style={{ color: '#64748b', fontSize: '14px' }}>Payment Method:</span>
                      <strong style={{ color: '#1e293b', fontSize: '14px' }}>Mobile Money</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                      <span style={{ color: '#64748b', fontSize: '14px' }}>Total Paid:</span>
                      <strong style={{ color: '#10b981', fontSize: '16px' }}>UGX {totalPrice.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '40px' }}>
                  <button onClick={() => setCurrentStep(2)} style={{ padding: '16px 32px', background: 'white', border: '2px solid #e2e8f0', color: '#64748b', borderRadius: '12px', fontWeight: 600, fontSize: '16px', cursor: 'pointer' }}>Stay Here</button>
                  <button onClick={completeBooking} style={{ padding: '16px 32px', background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', border: 'none', color: 'white', borderRadius: '12px', fontWeight: 600, fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(14, 165, 233, 0.3)' }}>Go to Dashboard</button>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="booking-layout" style={{ padding: '50px', maxWidth: '1400px', margin: '0 auto' }}>
                <div className="payment-options-col">
                  <h3 style={{ color: '#fbbf24', animation: 'rubberBand 2s ease-in-out infinite' }}>1. Choose Payment Method</h3>
                  <div className="payment-method-selector">
                    <label className="payment-method-option">
                      <input type="radio" name="payment-method" value="mobile-money" checked={paymentMethod === 'mobile-money'} onChange={handlePaymentMethodChange} />
                      <div className="payment-method-content">
                        <i className="fa-solid fa-mobile-screen-button"></i>
                        <span>Mobile Money</span>
                      </div>
                    </label>
                    <label className="payment-method-option">
                      <input type="radio" name="payment-method" value="credit-card" checked={paymentMethod === 'credit-card'} onChange={handlePaymentMethodChange} />
                      <div className="payment-method-content">
                        <i className="fa-solid fa-credit-card"></i>
                        <span>Credit/Debit Card</span>
                      </div>
                    </label>
                    <label className="payment-method-option">
                      <input type="radio" name="payment-method" value="bank-transfer" checked={paymentMethod === 'bank-transfer'} onChange={handlePaymentMethodChange} />
                      <div className="payment-method-content">
                        <i className="fa-solid fa-building-columns"></i>
                        <span>Bank Transfer</span>
                      </div>
                    </label>
                  </div>

                  <div className="payment-details-forms">
                    {paymentMethod === 'mobile-money' && (
                      <div className="payment-form">
                        <h4>Enter Mobile Money Number</h4>
                        <div className="form-group">
                          <label htmlFor="mm-phone">Phone Number</label>
                          <input 
                            type="tel" 
                            id="mm-phone" 
                            placeholder="e.g., 0771234567" 
                            value={mobileMoneyPhone}
                            onChange={(e) => setMobileMoneyPhone(e.target.value)}
                            required
                          />
                        </div>
                        <p className="form-note">A payment prompt will be sent to this number.</p>
                      </div>
                    )}
                    {paymentMethod === 'credit-card' && (
                      <div className="payment-form">
                        <h4>Enter Card Details</h4>
                        <div className="form-group">
                          <label htmlFor="card-number">Card Number</label>
                          <input 
                            type="text" 
                            id="card-number" 
                            placeholder="0000 0000 0000 0000" 
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-grid">
                          <div className="form-group">
                            <label htmlFor="card-expiry">Expiry Date</label>
                            <input 
                              type="text" 
                              id="card-expiry" 
                              placeholder="MM / YY" 
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="card-cvc">CVC</label>
                            <input 
                              type="text" 
                              id="card-cvc" 
                              placeholder="123" 
                              value={cardCVC}
                              onChange={(e) => setCardCVC(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {paymentMethod === 'bank-transfer' && (
                      <div className="payment-form">
                        <h4>Bank Transfer Instructions</h4>
                        <p>Please transfer the total amount to the following bank account and use your student number as the payment reference.</p>
                        <ul className="bank-details-list">
                          <li><strong>Bank Name:</strong> Stanbic Bank</li>
                          <li><strong>Account Name:</strong> BookMyHostel Ltd</li>
                          <li><strong>Account Number:</strong> 9030012345678</li>
                        </ul>
                        <div className="form-group" style={{ marginTop: '20px' }}>
                          <label htmlFor="paymentProofUpload">Upload Payment Proof</label>
                          <div className="file-upload-wrapper">
                            <input type="file" id="paymentProofUpload" className="file-input" accept="image/*,.pdf" required onChange={handlePaymentFileUpload} />
                            <label htmlFor="paymentProofUpload" className="file-upload-label">
                              <i className="fa-solid fa-cloud-arrow-up"></i>
                              <span>Choose File</span>
                            </label>
                            <span className="file-name-display">{paymentFileName}</span>
                          </div>
                          <p className="form-note">Please upload a screenshot or PDF of your transaction receipt.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="security-info-section">
                    <i className="fa-solid fa-lock"></i>
                    <div>
                      <strong>Secure Payment</strong>
                      <p>All transactions are secure and encrypted. We do not store your payment details.</p>
                    </div>
                  </div>
                </div>

                <div className="booking-summary-col">
                  <div className="summary-card">
                    <h3>Final Summary</h3>
                    <div className="summary-item">
                      <small>Hostel</small>
                      <span>{hostelName || 'N/A'}</span>
                    </div>
                    <div className="summary-item">
                      <small>Room Type</small>
                      <span>{roomName || 'N/A'}</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-item">
                      <small>Room Price</small>
                      <span>UGX {price.toLocaleString()}</span>
                    </div>
                    <div className="summary-item">
                      <small>Service Fee</small>
                      <span>UGX {serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="summary-item total">
                      <small>Total Price</small>
                      <span>UGX {totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-item">
                      <small>Full Name</small>
                      <span>{formData.fullName || 'N/A'}</span>
                    </div>
                    <div className="summary-item">
                      <small>Email</small>
                      <span>{formData.email || 'N/A'}</span>
                    </div>
                    <div className="summary-item">
                      <small>Phone</small>
                      <span>{formData.phone || 'N/A'}</span>
                    </div>
                    <div className="summary-item">
                      <small>Course</small>
                      <span>{formData.course || 'N/A'}</span>
                    </div>
                    <button className="btn primary full-width book-btn" style={{ marginTop: '20px' }} onClick={handleConfirmPayment}>
                      {paymentMethod === 'mobile-money' ? 'Pay with Mobile Money' : paymentMethod === 'credit-card' ? 'Pay with Card' : 'Confirm Booking'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
      </div>
      
      {/* PIN Modal */}
      {showPinModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={() => !isProcessing && setShowPinModal(false)}>
          <div style={{ background: 'white', padding: '0', borderRadius: '16px', maxWidth: '450px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 30px', borderBottom: '2px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>{isProcessing ? 'Processing Payment' : 'Enter Mobile Money PIN'}</h3>
              {!isProcessing && (
                <button onClick={() => setShowPinModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#64748b', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '8px' }}>
                  <i className="fa-solid fa-times"></i>
                </button>
              )}
            </div>
            <div style={{ padding: '30px' }}>
              {!isProcessing ? (
                <>
                  <p style={{ color: '#475569', fontSize: '15px', marginBottom: '16px' }}>Payment will be sent from <strong style={{ color: '#0ea5e9' }}>{mobileMoneyPhone}</strong></p>
                  <p style={{ color: '#475569', fontSize: '15px', marginBottom: '16px' }}>To merchant number: <strong style={{ color: '#0ea5e9' }}>{MERCHANT_NUMBER}</strong></p>
                  <p style={{ color: '#475569', fontSize: '15px', marginBottom: '24px' }}>Amount: <strong style={{ color: '#0ea5e9' }}>UGX {totalPrice.toLocaleString()}</strong></p>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>PIN</label>
                  <input 
                    type="password" 
                    placeholder="Enter 4-digit PIN" 
                    maxLength="4"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    autoFocus
                    style={{ width: '100%', padding: '14px 18px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '24px', textAlign: 'center', letterSpacing: '8px', fontWeight: 700, boxSizing: 'border-box' }}
                  />
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div className="spinner"></div>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: '#0ea5e9', margin: '24px 0 0 0' }}>{paymentStatus}</p>
                </div>
              )}
            </div>
            {!isProcessing && (
              <div style={{ display: 'flex', gap: '12px', padding: '20px 30px', borderTop: '2px solid #e2e8f0' }}>
                <button onClick={() => setShowPinModal(false)} style={{ flex: 1, padding: '14px 24px', background: 'white', border: '2px solid #e2e8f0', color: '#64748b', borderRadius: '10px', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handlePinSubmit} style={{ flex: 1, padding: '14px 24px', background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', border: 'none', color: 'white', borderRadius: '10px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(14, 165, 233, 0.3)' }}>Confirm Payment</button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default BookingPage;