import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';

const CustodianRoomManagementPage = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isRoomActionModalOpen, setIsRoomActionModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');

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
    <main className="dashboard-page">
      <div className="container">
        <div className="dashboard-layout">
          <DashboardSidebar
            user={custodianProfile}
            role="custodian"
            onLogout={() => setIsLogoutModalOpen(true)}
          />
          <div className="dashboard-content">
            <div className="dashboard-header">
              <h2>Room Management</h2>
              <p className="muted">Interactive floor plan and real-time room status.</p>
            </div>

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
                    <label htmlFor="newStudentGender">New Student's Gender</label>
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
    </main>
  );
};

export default CustodianRoomManagementPage;