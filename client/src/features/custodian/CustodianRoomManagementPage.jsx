import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import RoomLevelManager from '../../components/hostel/RoomLevelManager';
import { useRoomData } from '../../contexts/RoomDataContext';
import '../../styles/modern-dashboard.css';
import '../../styles/custodian-modern.css';
import '../../styles/room-management-modern.css';

const CustodianRoomManagementPage = () => {
  const navigate = useNavigate();
  const { userProfile } = useContext(AuthContext);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isRoomActionModalOpen, setIsRoomActionModalOpen] = useState(false);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isRoomManagerOpen, setIsRoomManagerOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [newRoom, setNewRoom] = useState({ id: '', roomType: 'Single', hotel: 'University Hotel A', block: 'A', floor: '1' });
  const [pendingRooms, setPendingRooms] = useState([]);

  const custodianProfile = {
    fullName: userProfile?.name || 'Custodian',
    course: userProfile?.role || 'Custodian',
    profilePicture: userProfile?.profilePicture || 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  const { rooms, setRooms, updateRoom, addRoom } = useRoomData();

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsRoomActionModalOpen(true);
  };

  const handleForceAction = (newStatus) => {
    if (!selectedRoom) return;

    const updatedRoom = { ...selectedRoom, status: newStatus };
    
    if (newStatus === 'Maintenance') {
      updatedRoom.maintenanceStatus = 'Pending';
      updatedRoom.maintenanceDate = new Date().toISOString();
      updatedRoom.maintenanceDescription = 'Maintenance required';
    }

    updateRoom(selectedRoom.id, updatedRoom);
    setSelectedRoom(updatedRoom);
    setIsRoomActionModalOpen(false);
  };

  const handleMaintenanceStatusUpdate = (newMaintenanceStatus) => {
    if (!selectedRoom) return;

    const updatedRoom = { 
      ...selectedRoom, 
      maintenanceStatus: newMaintenanceStatus,
      maintenanceDate: new Date().toISOString()
    };

    // If setting maintenance status but room isn't in maintenance, force it to maintenance
    if (selectedRoom.status !== 'Maintenance' && newMaintenanceStatus !== 'Resolved') {
      updatedRoom.status = 'Maintenance';
      updatedRoom.maintenanceDescription = 'Maintenance required';
    }

    updateRoom(selectedRoom.id, updatedRoom);
    setSelectedRoom(updatedRoom);
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  const handleAddRoom = async () => {
    if (!newRoom.id.trim()) return;
    
    const capacity = {
      'Single': 1, 'Double': 2, 'Triple': 3,
      'Shared': 4, 'Private': 1, 'Studio': 1
    };
    
    const roomData = {
      roomNumber: `${newRoom.floor}${newRoom.id.padStart(2, '0')}`,
      floor: parseInt(newRoom.floor),
      roomType: newRoom.roomType,
      capacity: capacity[newRoom.roomType] || 1,
      price: parseInt(newRoom.price) || 150000,
      status: 'Available',
      amenities: ['WiFi', 'Study Desk']
    };
    
    try {
      await addRoom(roomData);
      alert('Room added successfully!');
      setNewRoom({ id: '', roomType: 'Single', floor: '1', price: '' });
    } catch (error) {
      console.error('Failed to add room:', error);
      alert('Failed to add room: ' + error.message);
    }
  };

  const confirmRoomsToFloorPlan = async () => {
    try {
      // Add all pending rooms to database
      for (const room of pendingRooms) {
        await addRoom(room);
      }
      setPendingRooms([]);
      alert('All rooms added to floor plan successfully!');
    } catch (error) {
      console.error('Failed to add rooms:', error);
      // Fallback to local state
      setRooms(prev => [...prev, ...pendingRooms]);
      setPendingRooms([]);
    }
  };

  const filteredRooms = rooms;

  const renderRoomBlocks = (blockRooms) => (
    <div className="room-map-grid">
      {blockRooms.map(room => (
        <div
          className={`room-block status-${room.status.toLowerCase().replace(/ /g, '-')}`}
          data-room-id={room.id}
          data-status={room.status}
          data-occupant={room.occupant}
          data-room-type={room.roomType}
          data-occupancy={room.occupancy}
          data-occupant-gender={room.occupantGender}
          key={room.id}
          onClick={() => handleRoomClick(room)}
        >
          <div className="room-block-header">
            <span className="room-id">{room.id}</span>
            <i className={`fas ${room.roomType === 'Single' ? 'fa-bed' : 'fa-users'} room-type-icon`}></i>
          </div>
          <div className="room-block-body">
            <span className="room-status-text">
              {room.status === 'Partially Occupied' ? room.occupancy : room.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <section className="custodian-hero">
        <div className="floating-icons">
          <i className="fa-solid fa-door-open floating-icon-1"></i>
          <i className="fa-solid fa-bed floating-icon-2"></i>
          <i className="fa-solid fa-building floating-icon-3"></i>
          <i className="fa-solid fa-key floating-icon-4"></i>
          <i className="fa-solid fa-home floating-icon-5"></i>
          <i className="fa-solid fa-door-closed floating-icon-6"></i>
        </div>
        <div className="hero-content">
          <h1>Room <span className="dashboard-animated">Management</span></h1>
          <p>Interactive floor plan and real-time room status</p>
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
                {/* Room Stats */}
                <div className="stats-grid-modern">
                  <div className="stat-card-modern green">
                    <div className="stat-icon"><i className="fa-solid fa-check-circle"></i></div>
                    <div className="stat-info">
                      <h3>{rooms.filter(r => r.status === 'Available').length}</h3>
                      <p>Available Rooms</p>
                      <span className="stat-trend positive">Ready for booking</span>
                    </div>
                  </div>
                  <div className="stat-card-modern blue">
                    <div className="stat-icon"><i className="fa-solid fa-users"></i></div>
                    <div className="stat-info">
                      <h3>{rooms.filter(r => r.status === 'Partially Booked' || r.status === 'Partially Available').length}</h3>
                      <p>Partial Rooms</p>
                      <span className="stat-trend positive">Partially occupied</span>
                    </div>
                  </div>
                  <div className="stat-card-modern orange">
                    <div className="stat-icon"><i className="fa-solid fa-calendar-check"></i></div>
                    <div className="stat-info">
                      <h3>{rooms.filter(r => r.status === 'Booked').length}</h3>
                      <p>Booked Rooms</p>
                      <span className="stat-trend positive">Pending check-in</span>
                    </div>
                  </div>
                  <div className="stat-card-modern purple">
                    <div className="stat-icon"><i className="fa-solid fa-tools"></i></div>
                    <div className="stat-info">
                      <h3>{rooms.filter(r => r.status === 'Maintenance').length}</h3>
                      <p>Under Maintenance</p>
                      <span className="stat-trend negative">Needs attention</span>
                    </div>
                  </div>
                </div>

                {/* Add Room Section */}
                <div className="add-room-section-modern">
                  <div className="section-header">
                    <h3><i className="fas fa-plus-circle"></i> Add New Room</h3>
                    <p>Create rooms that will appear on your floor plan</p>
                  </div>
                  
                  <div className="add-room-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Floor</label>
                        <select value={newRoom.floor} onChange={(e) => setNewRoom(prev => ({...prev, floor: e.target.value}))}>
                          <option value="1">Ground Floor</option>
                          <option value="2">First Floor</option>
                          <option value="3">Second Floor</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Room Type</label>
                        <select value={newRoom.roomType} onChange={(e) => setNewRoom(prev => ({...prev, roomType: e.target.value}))}>
                          <option value="Single">Single Room</option>
                          <option value="Double">Double Room</option>
                          <option value="Triple">Triple Room</option>
                          <option value="Shared">Shared Room</option>
                          <option value="Private">Private Room</option>
                          <option value="Studio">Studio</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Room Number</label>
                        <input 
                          type="number" 
                          placeholder="01, 02, 03..." 
                          value={newRoom.id} 
                          onChange={(e) => setNewRoom(prev => ({...prev, id: e.target.value}))}
                          min="1"
                          max="99"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Price (UGX)</label>
                        <input 
                          type="number" 
                          placeholder="150000" 
                          value={newRoom.price} 
                          onChange={(e) => setNewRoom(prev => ({...prev, price: e.target.value}))}
                        />
                      </div>
                      
                      <div className="form-actions">
                        <button className="add-room-btn" onClick={handleAddRoom} disabled={!newRoom.id.trim()}>
                          <i className="fas fa-plus"></i> Add Room
                        </button>
                      </div>
                    </div>
                    
                    {pendingRooms.length > 0 && (
                      <div className="pending-rooms-preview">
                        <div className="pending-header">
                          <h4>Pending Rooms ({pendingRooms.length})</h4>
                          <button className="confirm-all-btn" onClick={confirmRoomsToFloorPlan}>
                            <i className="fas fa-check-circle"></i> Add All to Floor Plan
                          </button>
                        </div>
                        <div className="pending-rooms-list">
                          {pendingRooms.map((room, index) => (
                            <div className="pending-room-item" key={index}>
                              <div className="room-info">
                                <span className="room-id">{room.id}</span>
                                <span className="room-details">{room.hotel} - Block {room.block} - Floor {room.floor}</span>
                                <span className="room-type">{room.roomType}</span>
                              </div>
                              <button className="remove-pending-btn" onClick={() => setPendingRooms(prev => prev.filter((_, i) => i !== index))}>
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                


                {/* Room Status Legend */}
                <div className="room-legend-modern">
                  <h4>Room Status Legend</h4>
                  <div className="legend-items">
                    <div className="legend-item"><div className="legend-dot available"></div>Available</div>
                    <div className="legend-item"><div className="legend-dot booked"></div>Booked</div>
                    <div className="legend-item"><div className="legend-dot partially-booked"></div>Partially Booked</div>
                    <div className="legend-item"><div className="legend-dot partially-available"></div>Partially Available</div>
                    <div className="legend-item"><div className="legend-dot maintenance"></div>Maintenance</div>
                  </div>
                </div>

                {/* Dynamic Floor Plans */}
                <div className="floor-plans-modern">
                  {filteredRooms.length === 0 ? (
                    <div className="empty-floor-state">
                      <div className="empty-icon">
                        <i className="fas fa-building"></i>
                      </div>
                      <h4>No Rooms Added Yet</h4>
                      <p>Click "Add Room" to start creating your floor plan</p>
                    </div>
                  ) : (
                    // Group rooms by hotel and floor
                    Object.entries(
                      filteredRooms.reduce((acc, room) => {
                        const hotelKey = room.hotel || 'Unknown Hotel';
                        const floorKey = `${room.block || 'Unknown'}-${room.floor || '1'}`;
                        const key = `${hotelKey}|${floorKey}`;
                        if (!acc[key]) acc[key] = [];
                        acc[key].push(room);
                        return acc;
                      }, {})
                    ).map(([key, rooms]) => {
                      const [hotel, floorInfo] = key.split('|');
                      const [block, floor] = floorInfo.split('-');
                      const floorName = floor === '1' ? 'Ground Floor' : floor === '2' ? 'First Floor' : `Floor ${floor}`;
                      
                      return (
                        <div className="floor-section-modern" key={key}>
                          <div className="floor-header">
                            <h3><i className="fas fa-building"></i> {hotel} - Block {block} - {floorName}</h3>
                            <span className="room-count">{rooms.length} room{rooms.length > 1 ? 's' : ''}</span>
                          </div>
                          <div className="room-grid-modern">
                            {rooms.map(room => (
                              <div
                                className={`room-card-modern status-${room.status.toLowerCase().replace(/ /g, '-')}`}
                                key={room.id}
                                onClick={() => handleRoomClick(room)}
                              >
                                <div className="room-header">
                                  <span className="room-number">{room.id}</span>
                                  <i className={`fas ${room.roomType === 'Single' ? 'fa-bed' : 'fa-users'} room-type-icon`}></i>
                                </div>
                                <div className="room-body">
                                  <div className="room-status">{room.status}</div>
                                  <div className="room-occupancy">{room.occupancy}</div>
                                </div>
                                <div className="room-footer">
                                  <span className="room-type">{room.roomType}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
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

      {/* Enhanced Room Details Modal */}
      {isRoomActionModalOpen && selectedRoom && (
        <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && setIsRoomActionModalOpen(false)}>
          <div className="modal-content room-details-modal-enhanced animate-on-scroll">
            <button className="close-modal-btn" onClick={() => setIsRoomActionModalOpen(false)}>&times;</button>
            
            <div className="room-details-header">
              <div className="room-title-section">
                <h3><i className="fas fa-door-open"></i> Room {selectedRoom.id}</h3>
                <div className="room-meta">
                  <span className="room-type-badge">{selectedRoom.roomType}</span>
                  <span className="room-location">{selectedRoom.hotel || 'Hotel'} - Block {selectedRoom.block || 'A'} - Floor {selectedRoom.floor || '1'}</span>
                </div>
              </div>
              <div className={`room-status-indicator status-${selectedRoom.status.toLowerCase().replace(/ /g, '-')}`}>
                <i className={`fas ${selectedRoom.status === 'Available' ? 'fa-check-circle' : selectedRoom.status === 'Maintenance' ? 'fa-tools' : selectedRoom.status.includes('Partially') ? 'fa-user-friends' : 'fa-calendar-check'}`}></i>
                <span>{selectedRoom.status}</span>
              </div>
            </div>
            
            <div className="room-details-content">
              <div className="room-info-grid">
                <div className="info-card">
                  <div className="info-header">
                    <i className="fas fa-info-circle"></i>
                    <h4>Room Information</h4>
                  </div>
                  <div className="info-details">
                    <div className="detail-row">
                      <span className="label">Room Type:</span>
                      <span className="value">{selectedRoom.roomType}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Occupancy:</span>
                      <span className="value">{selectedRoom.occupancy}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Current Status:</span>
                      <span className={`value status-${selectedRoom.status.toLowerCase().replace(/ /g, '-')}`}>{selectedRoom.status}</span>
                    </div>
                  </div>
                </div>
                
                <div className="info-card">
                  <div className="info-header">
                    <i className="fas fa-user"></i>
                    <h4>Occupant Details</h4>
                  </div>
                  <div className="info-details">
                    {selectedRoom.occupant === 'None' ? (
                      <div className="empty-occupant">
                        <i className="fas fa-bed"></i>
                        <span>No current occupant</span>
                      </div>
                    ) : (
                      <div className="occupant-info">
                        <div className="occupant-name">{selectedRoom.occupant}</div>
                        <div className="occupant-gender">Gender: {selectedRoom.occupantGender || 'Not specified'}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              

              

              
              <div className="force-actions-section">
                <div className="section-header">
                  <i className="fas fa-cog"></i>
                  <h4>Room Status Management</h4>
                  <p>Override the current room status manually</p>
                </div>
                
                <div className="status-actions-grid">
                  <button className="status-action-btn available" onClick={() => handleForceAction('Available')}>
                    <div className="action-icon">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="action-content">
                      <span className="action-title">Available</span>
                      <span className="action-desc">Ready for booking</span>
                    </div>
                  </button>
                  

                  
                  <button className="status-action-btn booked" onClick={() => handleForceAction('Booked')}>
                    <div className="action-icon">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                    <div className="action-content">
                      <span className="action-title">Booked</span>
                      <span className="action-desc">Reserved for student</span>
                    </div>
                  </button>
                  
                  <button className="status-action-btn maintenance" onClick={() => handleForceAction('Maintenance')}>
                    <div className="action-icon">
                      <i className="fas fa-tools"></i>
                    </div>
                    <div className="action-content">
                      <span className="action-title">Maintenance</span>
                      <span className="action-desc">Needs repair/cleaning</span>
                    </div>
                  </button>
                  
                  {(selectedRoom.roomType === 'Double' || selectedRoom.roomType === 'Triple') && (
                    <>
                      <button className="status-action-btn partial" onClick={() => handleForceAction('Partially Booked')}>
                        <div className="action-icon">
                          <i className="fas fa-user-friends"></i>
                        </div>
                        <div className="action-content">
                          <span className="action-title">Partially Booked</span>
                          <span className="action-desc">Some beds booked</span>
                        </div>
                      </button>
                      <button className="status-action-btn partial" onClick={() => handleForceAction('Partially Available')}>
                        <div className="action-icon">
                          <i className="fas fa-bed"></i>
                        </div>
                        <div className="action-content">
                          <span className="action-title">Partially Available</span>
                          <span className="action-desc">Some beds available</span>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {isAddRoomModalOpen && (
        <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && setIsAddRoomModalOpen(false)}>
          <div className="modal-content room-modal-content animate-on-scroll">
            <button className="close-modal-btn" onClick={() => setIsAddRoomModalOpen(false)}>&times;</button>
            <h3>Add New Room</h3>
            <div className="room-modal-body">
              <div className="form-group">
                <label>Hotel</label>
                <select value={newRoom.hotel} onChange={(e) => setNewRoom(prev => ({...prev, hotel: e.target.value}))}>
                  <option value="University Hotel A">University Hotel A</option>
                  <option value="University Hotel B">University Hotel B</option>
                  <option value="University Hotel C">University Hotel C</option>
                </select>
              </div>
              <div className="form-group">
                <label>Block</label>
                <select value={newRoom.block} onChange={(e) => setNewRoom(prev => ({...prev, block: e.target.value}))}>
                  <option value="A">Block A</option>
                  <option value="B">Block B</option>
                  <option value="C">Block C</option>
                </select>
              </div>
              <div className="form-group">
                <label>Floor</label>
                <select value={newRoom.floor} onChange={(e) => setNewRoom(prev => ({...prev, floor: e.target.value}))}>
                  <option value="1">Ground Floor (1xx)</option>
                  <option value="2">First Floor (2xx)</option>
                  <option value="3">Second Floor (3xx)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Room Number</label>
                <input 
                  type="number" 
                  placeholder="e.g., 01, 02, 03" 
                  value={newRoom.id} 
                  onChange={(e) => setNewRoom(prev => ({...prev, id: e.target.value}))}
                  min="1"
                  max="99"
                />
              </div>
              <div className="form-group">
                <label>Room Type</label>
                <select value={newRoom.roomType} onChange={(e) => setNewRoom(prev => ({...prev, roomType: e.target.value}))}>
                  <option value="Single">Single Room</option>
                  <option value="Double">Double Room</option>
                </select>
              </div>
              <div className="room-modal-actions">
                <button className="btn outline" onClick={() => setIsAddRoomModalOpen(false)}>Cancel</button>
                <button className="btn primary" onClick={handleAddRoom} disabled={!newRoom.id.trim()}>
                  <i className="fas fa-plus"></i> Add Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <RoomLevelManager 
        isOpen={isRoomManagerOpen}
        onClose={() => setIsRoomManagerOpen(false)}
      />
    </>
  );
};

export default CustodianRoomManagementPage;