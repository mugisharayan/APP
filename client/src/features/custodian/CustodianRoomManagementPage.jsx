import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import '../../styles/modern-dashboard.css';

const CustodianRoomManagementPage = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isRoomActionModalOpen, setIsRoomActionModalOpen] = useState(false);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [newRoom, setNewRoom] = useState({ id: '', roomType: 'Single', block: 'A', floor: '1' });

  const custodianProfile = {
    fullName: 'John K.',
    course: 'Lead Custodian',
    profilePicture: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  // Dummy room data (this would come from a backend)
  const [rooms, setRooms] = useState([
    { id: 'A-101', status: 'Available', occupant: 'None', roomType: 'Single', occupancy: '0/1', occupantGender: 'None' },
    { id: 'A-102', status: 'Partially Occupied', occupant: 'Jane Doe', roomType: 'Double', occupancy: '1/2', occupantGender: 'Female' },
    { id: 'A-103', status: 'Occupied', occupant: 'Peter Jones, Mike Ross', roomType: 'Double', occupancy: '2/2', occupantGender: 'Male,Male' },
    { id: 'A-104', status: 'Booked', occupant: 'Pending Check-in', roomType: 'Single', occupancy: '1/1', occupantGender: 'Female' },
    { id: 'A-105', status: 'Maintenance', occupant: 'N/A', roomType: 'Single', occupancy: '0/1', occupantGender: 'None' },
    { id: 'A-106', status: 'Available', occupant: 'None', roomType: 'Double', occupancy: '0/2', occupantGender: 'None' },
    { id: 'A-107', status: 'Available', occupant: 'None', roomType: 'Single', occupancy: '0/1', occupantGender: 'None' },
    { id: 'A-108', status: 'Occupied', occupant: 'Sarah K.', roomType: 'Single', occupancy: '1/1', occupantGender: 'Female' },
    { id: 'A-109', status: 'Available', occupant: 'None', roomType: 'Double', occupancy: '0/2', occupantGender: 'None' },
    { id: 'A-110', status: 'Available', occupant: 'None', roomType: 'Double', occupancy: '0/2', occupantGender: 'None' },
    { id: 'A-201', status: 'Occupied', occupant: 'Amelia Nakamya', roomType: 'Single', occupancy: '1/1', occupantGender: 'Female' },
    { id: 'A-202', status: 'Available', occupant: 'None', roomType: 'Single', occupancy: '0/1', occupantGender: 'None' },
    { id: 'A-203', status: 'Available', occupant: 'None', roomType: 'Double', occupancy: '0/2', occupantGender: 'None' },
    { id: 'A-204', status: 'Partially Occupied', occupant: 'Mark Otim', roomType: 'Double', occupancy: '1/2', occupantGender: 'Male' },
    { id: 'A-205', status: 'Booked', occupant: 'Pending Check-in', roomType: 'Single', occupancy: '1/1', occupantGender: 'Male' },
    { id: 'A-206', status: 'Available', occupant: 'None', roomType: 'Single', occupancy: '0/1', occupantGender: 'None' },
    { id: 'A-207', status: 'Occupied', occupant: 'David Okello, Ben Carson', roomType: 'Double', occupancy: '2/2', occupantGender: 'Male,Male' },
    { id: 'A-208', status: 'Available', occupant: 'None', roomType: 'Double', occupancy: '0/2', occupantGender: 'None' },
    { id: 'A-209', status: 'Available', occupant: 'None', roomType: 'Single', occupancy: '0/1', occupantGender: 'None' },
    { id: 'A-210', status: 'Maintenance', occupant: 'N/A', roomType: 'Single', occupancy: '0/1', occupantGender: 'None' },
  ]);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsRoomActionModalOpen(true);
  };

  const handleForceAction = (newStatus) => {
    if (!selectedRoom) return;

    // In a real app, you'd send this update to a backend
    setRooms(prevRooms => prevRooms.map(room =>
      room.id === selectedRoom.id ? { ...room, status: newStatus } : room
    ));
    setSelectedRoom(prev => ({ ...prev, status: newStatus })); // Update selected room's status for modal
    // showToast(`Room ${selectedRoom.id} status updated to ${newStatus}.`);
    setIsRoomActionModalOpen(false);
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  const handleAddRoom = () => {
    if (!newRoom.id.trim()) return;
    
    const roomId = `${newRoom.block}-${newRoom.floor}${newRoom.id.padStart(2, '0')}`;
    const newRoomData = {
      id: roomId,
      status: 'Available',
      occupant: 'None',
      roomType: newRoom.roomType,
      occupancy: newRoom.roomType === 'Single' ? '0/1' : '0/2',
      occupantGender: 'None'
    };
    
    setRooms(prev => [...prev, newRoomData]);
    setNewRoom({ id: '', roomType: 'Single', block: 'A', floor: '1' });
    setIsAddRoomModalOpen(false);
  };

  const filteredRooms = rooms.filter(room => {
    if (currentFilter === 'all') return true;
    return room.status.toLowerCase().replace(/ /g, '-') === currentFilter;
  });

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
      <section className="dashboard-hero-section">
        <div className="floating-home-icons">
          <i className="fa-solid fa-door-open floating-home-1"></i>
          <i className="fa-solid fa-bed floating-home-2"></i>
          <i className="fa-solid fa-building floating-home-3"></i>
          <i className="fa-solid fa-key floating-home-4"></i>
          <i className="fa-solid fa-home floating-home-5"></i>
          <i className="fa-solid fa-door-closed floating-home-6"></i>
        </div>
        <div className="dashboard-hero-container">
          <h1 className="dashboard-hero-title">Room <span className="dashboard-animated">Management</span></h1>
          <p className="dashboard-hero-subtitle">Interactive floor plan and real-time room status</p>
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

            <div className="room-management-header">
              <div className="room-filters-new">
                {['all', 'available', 'occupied', 'booked', 'maintenance'].map(filter => (
                  <button
                    key={filter}
                    className={`filter-btn ${currentFilter === filter ? 'active' : ''}`}
                    onClick={() => setCurrentFilter(filter)}
                  >
                    <i className={`fas ${filter === 'all' ? 'fa-border-all' : filter === 'available' ? 'fa-check-circle' : filter === 'occupied' ? 'fa-user-check' : filter === 'booked' ? 'fa-calendar-check' : 'fa-tools'}`}></i> {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
              <button className="btn primary" onClick={() => setIsAddRoomModalOpen(true)}>
                <i className="fas fa-plus"></i> Add Room
              </button>
              <div className="room-status-legend">
                <span className="legend-item"><span className="legend-color available"></span>Available</span>
                <span className="legend-item"><span className="legend-color booked"></span>Booked</span>
                <span className="legend-item"><span className="legend-color occupied"></span>Occupied</span>
                <span className="legend-item"><span className="legend-color partially-occupied"></span>Partially Occupied</span>
                <span className="legend-item"><span className="legend-color maintenance"></span>Maintenance</span>
              </div>
            </div>

            <div className="dashboard-section floor-plan">
              <h3 className="floor-title">Block A - Ground Floor</h3>
              {renderRoomBlocks(filteredRooms.filter(room => room.id.startsWith('A-1')))}
            </div>

            <div className="dashboard-section floor-plan">
              <h3 className="floor-title">Block A - First Floor</h3>
              {renderRoomBlocks(filteredRooms.filter(room => room.id.startsWith('A-2')))}
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

      {/* Room Action Modal */}
      {isRoomActionModalOpen && selectedRoom && (
        <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && setIsRoomActionModalOpen(false)}>
          <div className="modal-content room-modal-content animate-on-scroll">
            <button className="close-modal-btn" onClick={() => setIsRoomActionModalOpen(false)}>&times;</button>
            <h3 id="roomModalTitle">Room {selectedRoom.id} Details</h3>
            <div className="room-modal-body">
              <div className="room-modal-detail">
                <small>Current Status</small>
                <span id="roomModalStatus" className={`status-badge ${selectedRoom.status.toLowerCase().replace(/ /g, '-')}`}>{selectedRoom.status}</span>
              </div>
              <div className="room-modal-detail">
                <small>Current Occupant</small>
                <p id="roomModalOccupant">{selectedRoom.occupant}</p>
              </div>
              {selectedRoom.roomType === 'Double' && (selectedRoom.status === 'Available' || selectedRoom.status === 'Partially Occupied') && (
                <div className="room-modal-assign" id="roomModalAssignSection">
                  <h4>Assign New Student</h4>
                  <div className="form-group">
                    <label htmlFor="newStudentGender" aria-label="New Student's Gender">New Student's Gender</label>
                    <select id="newStudentGender">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              )}
              <div className="room-modal-actions">
                <h4>Force Actions</h4>
                <p className="muted">Manually override the current room status.</p>
                <div className="force-actions-grid">
                  <button className="btn outline small" onClick={() => handleForceAction('Available')}><i className="fas fa-check-circle"></i> Mark as Available</button>
                  <button className="btn outline small" onClick={() => handleForceAction('Maintenance')}><i className="fas fa-tools"></i> Mark for Maintenance</button>
                  <button className="btn outline small" onClick={() => handleForceAction('Booked')}><i className="fas fa-calendar-check"></i> Mark as Booked</button>
                  <button className="btn outline small" onClick={() => handleForceAction('Occupied')}><i className="fas fa-user-check"></i> Mark as Occupied</button>
                  <button className="btn outline small" onClick={() => handleForceAction('Partially Occupied')}><i className="fas fa-user-friends"></i> Mark as Partially Occupied</button>
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
    </>
  );
};

export default CustodianRoomManagementPage;