import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import '../../styles/modern-dashboard.css';
import '../../styles/custodian-modern.css';

const CustodianHostelRegistrationPage = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [hostelData, setHostelData] = useState({
    name: '', description: '', location: '', contact: '', email: '',
    facilities: [], images: [], roomTypes: [], levels: []
  });

  const custodianProfile = {
    fullName: 'John Kamau',
    course: 'Lead Custodian',
    profilePicture: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  const availableFacilities = ['WiFi', 'Laundry', 'Kitchen', 'Study Room', 'Gym', 'Parking', 'Security', 'Cleaning Service'];

  const handleInputChange = (field, value) => {
    setHostelData(prev => ({ ...prev, [field]: value }));
  };

  const handleFacilityToggle = (facility) => {
    setHostelData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const addRoomType = () => {
    setHostelData(prev => ({
      ...prev,
      roomTypes: [...prev.roomTypes, { id: Date.now(), name: '', price: '', capacity: '' }]
    }));
  };

  const updateRoomType = (id, field, value) => {
    setHostelData(prev => ({
      ...prev,
      roomTypes: prev.roomTypes.map(rt => rt.id === id ? { ...rt, [field]: value } : rt)
    }));
  };

  const addLevel = () => {
    setHostelData(prev => ({
      ...prev,
      levels: [...prev.levels, { id: Date.now(), name: '', rooms: [] }]
    }));
  };

  const addRoomToLevel = (levelId) => {
    setHostelData(prev => ({
      ...prev,
      levels: prev.levels.map(level => 
        level.id === levelId 
          ? { ...level, rooms: [...level.rooms, { id: Date.now(), number: '', type: '' }] }
          : level
      )
    }));
  };

  const handleSubmit = () => {
    console.log('Hostel registered:', hostelData);
    // Here you would save to database
    alert('Hostel registered successfully!');
    navigate('/custodian/dashboard');
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  return (
    <>
      <section className="custodian-hero">
        <div className="hero-content">
          <h1>Hostel <span className="dashboard-animated">Registration</span></h1>
          <p>Register and manage your hostel properties</p>
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
            <div className="dashboard-content">
              <div className="modern-dashboard-container">
                <div className="registration-container">
                  <div className="registration-header">
                    <h3>Register Your Hostel - Step {currentStep} of 4</h3>
                    <div className="step-indicator">
                      {[1, 2, 3, 4].map(step => (
                        <div key={step} className={`step ${currentStep >= step ? 'active' : ''}`}>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="registration-content">
                    {currentStep === 1 && (
                      <div className="step-content">
                        <h4>Basic Information</h4>
                        <div className="form-grid">
                          <div className="form-group">
                            <label>Hostel Name</label>
                            <input 
                              type="text" 
                              placeholder="Enter hostel name" 
                              value={hostelData.name} 
                              onChange={(e) => handleInputChange('name', e.target.value)} 
                            />
                          </div>
                          <div className="form-group">
                            <label>Location</label>
                            <input 
                              type="text" 
                              placeholder="Enter location" 
                              value={hostelData.location} 
                              onChange={(e) => handleInputChange('location', e.target.value)} 
                            />
                          </div>
                          <div className="form-group">
                            <label>Contact Phone</label>
                            <input 
                              type="tel" 
                              placeholder="Enter contact phone" 
                              value={hostelData.contact} 
                              onChange={(e) => handleInputChange('contact', e.target.value)} 
                            />
                          </div>
                          <div className="form-group">
                            <label>Email</label>
                            <input 
                              type="email" 
                              placeholder="Enter email address" 
                              value={hostelData.email} 
                              onChange={(e) => handleInputChange('email', e.target.value)} 
                            />
                          </div>
                          <div className="form-group full-width">
                            <label>Description</label>
                            <textarea 
                              placeholder="Describe your hostel" 
                              value={hostelData.description} 
                              onChange={(e) => handleInputChange('description', e.target.value)} 
                              rows="3"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="step-content">
                        <h4>Facilities</h4>
                        <div className="facilities-grid">
                          {availableFacilities.map(facility => (
                            <label key={facility} className="facility-item">
                              <input 
                                type="checkbox" 
                                checked={hostelData.facilities.includes(facility)} 
                                onChange={() => handleFacilityToggle(facility)} 
                              />
                              <span>{facility}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="step-content">
                        <div className="section-header">
                          <h4>Room Types</h4>
                          <button className="btn primary" onClick={addRoomType}>
                            <i className="fas fa-plus"></i> Add Room Type
                          </button>
                        </div>
                        <div className="room-types-list">
                          {hostelData.roomTypes.map(roomType => (
                            <div key={roomType.id} className="room-type-item">
                              <input 
                                type="text" 
                                placeholder="Room type name" 
                                value={roomType.name} 
                                onChange={(e) => updateRoomType(roomType.id, 'name', e.target.value)} 
                              />
                              <input 
                                type="number" 
                                placeholder="Price (UGX)" 
                                value={roomType.price} 
                                onChange={(e) => updateRoomType(roomType.id, 'price', e.target.value)} 
                              />
                              <input 
                                type="number" 
                                placeholder="Capacity" 
                                value={roomType.capacity} 
                                onChange={(e) => updateRoomType(roomType.id, 'capacity', e.target.value)} 
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="step-content">
                        <div className="section-header">
                          <h4>Levels & Rooms</h4>
                          <button className="btn primary" onClick={addLevel}>
                            <i className="fas fa-plus"></i> Add Level
                          </button>
                        </div>
                        <div className="levels-list">
                          {hostelData.levels.map(level => (
                            <div key={level.id} className="level-item">
                              <div className="level-header">
                                <input 
                                  type="text" 
                                  placeholder="Level name (e.g., Ground Floor)" 
                                  value={level.name} 
                                  onChange={(e) => setHostelData(prev => ({ 
                                    ...prev, 
                                    levels: prev.levels.map(l => l.id === level.id ? { ...l, name: e.target.value } : l) 
                                  }))} 
                                />
                                <button className="btn outline small" onClick={() => addRoomToLevel(level.id)}>
                                  <i className="fas fa-plus"></i> Add Room
                                </button>
                              </div>
                              <div className="rooms-grid">
                                {level.rooms.map(room => (
                                  <div key={room.id} className="room-item">
                                    <input 
                                      type="text" 
                                      placeholder="Room number" 
                                      value={room.number} 
                                      onChange={(e) => setHostelData(prev => ({ 
                                        ...prev, 
                                        levels: prev.levels.map(l => l.id === level.id ? { 
                                          ...l, 
                                          rooms: l.rooms.map(r => r.id === room.id ? { ...r, number: e.target.value } : r) 
                                        } : l) 
                                      }))} 
                                    />
                                    <select 
                                      value={room.type} 
                                      onChange={(e) => setHostelData(prev => ({ 
                                        ...prev, 
                                        levels: prev.levels.map(l => l.id === level.id ? { 
                                          ...l, 
                                          rooms: l.rooms.map(r => r.id === room.id ? { ...r, type: e.target.value } : r) 
                                        } : l) 
                                      }))}
                                    >
                                      <option value="">Select Type</option>
                                      {hostelData.roomTypes.map(rt => (
                                        <option key={rt.id} value={rt.name}>{rt.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="registration-footer">
                    <button 
                      className="btn outline" 
                      onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))} 
                      disabled={currentStep === 1}
                    >
                      Previous
                    </button>
                    {currentStep < 4 ? (
                      <button 
                        className="btn primary" 
                        onClick={() => setCurrentStep(prev => Math.min(prev + 1, 4))}
                      >
                        Next
                      </button>
                    ) : (
                      <button className="btn success" onClick={handleSubmit}>
                        <i className="fas fa-check"></i> Register Hostel
                      </button>
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

export default CustodianHostelRegistrationPage;