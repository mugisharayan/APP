import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import EmailService from '../../service/email.service';
import '../../styles/modern-dashboard.css';
import '../../styles/room-assignment-modern.css';

// Mock implementations for missing components/hooks
const useRealTimeUpdates = (initialData) => {
  const [data, setData] = useState(initialData);
  return { data, setData, lastUpdated: new Date() };
};

const AdvancedSearch = ({ isOpen, onClose, onSearch }) => null;

const exportToCSV = (data, filename) => {
  console.log('Export:', filename, data);
};

const formatAssignmentData = (data) => data;

const PermissionGuard = ({ children, userRole, permission }) => children;

const PERMISSIONS = {
  BULK_ROOM_OPERATIONS: 'bulk_room_operations'
};

const ROLES = {
  SENIOR_CUSTODIAN: 'senior_custodian'
};

const CustodianRoomAssignmentPage = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAssignRoomModalOpen, setIsAssignRoomModalOpen] = useState(false);
  const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchFilters, setSearchFilters] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'single', 'double', 'available'
  const [displayCount, setDisplayCount] = useState(3);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isOccupantModalOpen, setIsOccupantModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [currentToken, setCurrentToken] = useState(null);
  const [assignedStudent, setAssignedStudent] = useState(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const custodianProfile = {
    fullName: 'John Kamau',
    course: 'Lead Custodian',
    role: 'senior_custodian',
    profilePicture: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  // Enhanced data for pending assignments with real-time updates
  const initialPendingAssignments = [
    { id: 1, name: 'John Doe', studentId: '22/U/12345', email: 'john.doe@university.edu', paidOn: '28 Jul 2024', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', preferences: 'Single room, Ground floor', priority: 'high', paymentAmount: '850,000' },
    { id: 2, name: 'Aisha Bello', studentId: '22/U/98765', email: 'aisha.bello@university.edu', paidOn: '27 Jul 2024', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', preferences: 'Double room, Any floor', priority: 'medium', paymentAmount: '650,000' },
    { id: 3, name: 'David Wilson', studentId: '22/U/54321', email: 'david.wilson@university.edu', paidOn: '26 Jul 2024', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', preferences: 'Single room, Upper floor', priority: 'low', paymentAmount: '850,000' },
    { id: 4, name: 'Maria Garcia', studentId: '22/U/67890', email: 'maria.garcia@university.edu', paidOn: '25 Jul 2024', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', preferences: 'Double room, Ground floor', priority: 'medium', paymentAmount: '650,000' },
    { id: 5, name: 'James Smith', studentId: '22/U/11111', email: 'james.smith@university.edu', paidOn: '24 Jul 2024', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', preferences: 'Single room, Any floor', priority: 'high', paymentAmount: '850,000' },
    { id: 6, name: 'Lisa Johnson', studentId: '22/U/22222', email: 'lisa.johnson@university.edu', paidOn: '23 Jul 2024', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', preferences: 'Double room, Upper floor', priority: 'low', paymentAmount: '650,000' },
  ];
  const { data: pendingAssignments, setData: setPendingAssignments, lastUpdated } = useRealTimeUpdates(initialPendingAssignments);

  // Enhanced assignment history and room data
  const [assignmentHistory, setAssignmentHistory] = useState([
    { id: 3, studentName: 'Michael Chen', room: 'A-207', time: '2 hours ago', type: 'Single', assignedBy: 'John K.' },
    { id: 4, studentName: 'Sarah K.', room: 'A-108', time: '5 hours ago', type: 'Double', assignedBy: 'John K.' },
    { id: 5, studentName: 'Emma Johnson', room: 'B-301', time: '1 day ago', type: 'Single', assignedBy: 'John K.' },
  ]);

  // Enhanced room and hotel data with detailed occupant information
  const [hotelData, setHotelData] = useState({
    'University Hotel A': {
      floors: {
        1: [
          { id: 'A-101', type: 'Single', capacity: 1, occupied: 0, occupants: [], hotel: 'University Hotel A', floor: 1 },
          { 
            id: 'A-102', 
            type: 'Double', 
            capacity: 2, 
            occupied: 1, 
            hotel: 'University Hotel A', 
            floor: 1,
            occupants: [{ 
              name: 'John Smith', 
              sex: 'Male', 
              course: 'Computer Science', 
              year: '3rd Year', 
              studentId: '22/U/1001',
              checkInDate: '15 Aug 2024',
              email: 'john.smith@university.edu',
              phone: '+256 700 123 456'
            }] 
          },
          { 
            id: 'A-103', 
            type: 'Single', 
            capacity: 1, 
            occupied: 1, 
            hotel: 'University Hotel A', 
            floor: 1,
            occupants: [{ 
              name: 'Michael Chen', 
              sex: 'Male', 
              course: 'Mechanical Engineering', 
              year: '2nd Year', 
              studentId: '22/U/1002',
              checkInDate: '20 Aug 2024',
              email: 'michael.chen@university.edu',
              phone: '+256 700 234 567'
            }] 
          },
          { id: 'A-104', type: 'Double', capacity: 2, occupied: 0, occupants: [], hotel: 'University Hotel A', floor: 1 },
          { id: 'A-105', type: 'Single', capacity: 1, occupied: 0, occupants: [], hotel: 'University Hotel A', floor: 1 },
        ],
        2: [
          { id: 'A-201', type: 'Single', capacity: 1, occupied: 0, occupants: [], hotel: 'University Hotel A', floor: 2 },
          { 
            id: 'A-202', 
            type: 'Double', 
            capacity: 2, 
            occupied: 2, 
            hotel: 'University Hotel A', 
            floor: 2,
            occupants: [
              { 
                name: 'Sarah Johnson', 
                sex: 'Female', 
                course: 'Medicine', 
                year: '4th Year', 
                studentId: '22/U/1003',
                checkInDate: '10 Aug 2024',
                email: 'sarah.johnson@university.edu',
                phone: '+256 700 345 678'
              }, 
              { 
                name: 'Emma Wilson', 
                sex: 'Female', 
                course: 'Law', 
                year: '3rd Year', 
                studentId: '22/U/1004',
                checkInDate: '12 Aug 2024',
                email: 'emma.wilson@university.edu',
                phone: '+256 700 456 789'
              }
            ] 
          },
          { id: 'A-203', type: 'Single', capacity: 1, occupied: 0, occupants: [], hotel: 'University Hotel A', floor: 2 },
          { id: 'A-204', type: 'Double', capacity: 2, occupied: 0, occupants: [], hotel: 'University Hotel A', floor: 2 },
        ]
      }
    },
    'University Hotel B': {
      floors: {
        1: [
          { id: 'B-101', type: 'Single', capacity: 1, occupied: 0, occupants: [], hotel: 'University Hotel B', floor: 1 },
          { 
            id: 'B-102', 
            type: 'Double', 
            capacity: 2, 
            occupied: 1, 
            hotel: 'University Hotel B', 
            floor: 1,
            occupants: [{ 
              name: 'David Brown', 
              sex: 'Male', 
              course: 'Business Administration', 
              year: '2nd Year', 
              studentId: '22/U/1005',
              checkInDate: '18 Aug 2024',
              email: 'david.brown@university.edu',
              phone: '+256 700 567 890'
            }] 
          },
          { id: 'B-103', type: 'Single', capacity: 1, occupied: 0, occupants: [], hotel: 'University Hotel B', floor: 1 },
        ],
        2: [
          { id: 'B-201', type: 'Single', capacity: 1, occupied: 0, occupants: [], hotel: 'University Hotel B', floor: 2 },
          { id: 'B-202', type: 'Double', capacity: 2, occupied: 0, occupants: [], hotel: 'University Hotel B', floor: 2 },
          { id: 'B-203', type: 'Single', capacity: 1, occupied: 0, occupants: [], hotel: 'University Hotel B', floor: 2 },
        ],
        3: [
          { id: 'B-301', type: 'Single', capacity: 1, occupied: 0, occupants: [], hotel: 'University Hotel B', floor: 3 },
          { 
            id: 'B-302', 
            type: 'Double', 
            capacity: 2, 
            occupied: 1, 
            hotel: 'University Hotel B', 
            floor: 3,
            occupants: [{ 
              name: 'Lisa Garcia', 
              sex: 'Female', 
              course: 'Psychology', 
              year: '1st Year', 
              studentId: '22/U/1006',
              checkInDate: '22 Aug 2024',
              email: 'lisa.garcia@university.edu',
              phone: '+256 700 678 901'
            }] 
          },
          { id: 'B-303', type: 'Single', capacity: 1, occupied: 0, occupants: [], hotel: 'University Hotel B', floor: 3 },
        ]
      }
    }
  });

  // Legacy room data for compatibility
  const [roomData, setRoomData] = useState({
    available: [],
    occupied: []
  });

  const handleAssignRoomClick = (student) => {
    setSelectedStudent(student);
    setIsAssignRoomModalOpen(true);
  };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    const allIds = pendingAssignments.map(s => s.id);
    setSelectedStudents(selectedStudents.length === allIds.length ? [] : allIds);
  };

  const handleBulkAssign = () => {
    setIsBulkAssignModalOpen(true);
  };

  const getAllRooms = () => {
    const allRooms = [];
    Object.entries(hotelData).forEach(([hotelName, hotel]) => {
      Object.entries(hotel.floors).forEach(([floorNumber, rooms]) => {
        rooms.forEach(room => {
          allRooms.push({
            ...room,
            hotel: room.hotel || hotelName,
            floor: room.floor || parseInt(floorNumber),
            isAvailable: room.occupied < room.capacity,
            isPartiallyBooked: room.occupied > 0 && room.occupied < room.capacity
          });
        });
      });
    });
    return allRooms;
  };

  const getAvailableRooms = () => {
    return getAllRooms().filter(room => {
      if (filterBy === 'single') return room.type === 'Single' && room.isAvailable;
      if (filterBy === 'double') return room.type === 'Double' && room.isAvailable;
      if (filterBy === 'available') return room.isAvailable;
      return room.isAvailable;
    });
  };

  const handleExportData = () => {
    const formattedData = formatAssignmentData([...pendingAssignments, ...assignmentHistory]);
    exportToCSV(formattedData, `room-assignments-${new Date().toISOString().split('T')[0]}`);
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 3);
  };

  const displayedStudents = pendingAssignments.slice(0, displayCount);
  const hasMoreStudents = pendingAssignments.length > displayCount;



  const handleConfirmAssignment = async (e) => {
    e.preventDefault();
    const roomId = e.target.availableRooms.value;
    const accessToken = EmailService.generateAccessToken();
    
    // Find room details for email
    const roomDetails = getAllRooms().find(room => room.id === roomId);
    
    try {
      // Prepare assignment data for email service
      const assignmentData = {
        student: {
          name: selectedStudent.name,
          studentId: selectedStudent.studentId,
          email: selectedStudent.email || `${selectedStudent.studentId}@university.edu`
        },
        room: roomDetails,
        accessToken: accessToken,
        assignedBy: custodianProfile.fullName,
        assignmentDate: new Date().toLocaleDateString()
      };
      
      // Send email notification
      const emailResult = await EmailService.sendRoomAssignmentNotification(assignmentData);
      
      // Update room occupancy in hotel data
      setHotelData(prev => {
        const newData = { ...prev };
        Object.keys(newData).forEach(hotelName => {
          Object.keys(newData[hotelName].floors).forEach(floorNum => {
            newData[hotelName].floors[floorNum] = newData[hotelName].floors[floorNum].map(room => 
              room.id === roomId ? { 
                ...room, 
                occupied: room.occupied + 1,
                occupants: [...room.occupants, {
                  name: selectedStudent.name,
                  sex: 'Unknown',
                  course: 'Unknown',
                  year: 'Unknown',
                  studentId: selectedStudent.studentId,
                  checkInDate: new Date().toLocaleDateString(),
                  email: selectedStudent.email || `${selectedStudent.studentId}@university.edu`,
                  accessToken: accessToken
                }]
              } : room
            );
          });
        });
        return newData;
      });
      
      setPendingAssignments(prev => prev.filter(s => s.id !== selectedStudent.id));
      setAssignmentHistory(prev => [{ 
        id: Date.now(), 
        studentName: selectedStudent.name, 
        room: roomId, 
        time: 'Just now',
        type: roomDetails?.type || 'Unknown',
        assignedBy: custodianProfile.fullName,
        accessCode: accessToken,
        emailSent: emailResult.success
      }, ...prev]);
      
      // Show secure token modal
      setCurrentToken(accessToken);
      setAssignedStudent({
        ...selectedStudent,
        roomId: roomId,
        emailSent: emailResult.success,
        email: assignmentData.student.email
      });
      setIsTokenModalOpen(true);
      
    } catch (error) {
      console.error('Assignment failed:', error);
      alert('❌ Failed to complete room assignment. Please try again.');
      setIsAssignRoomModalOpen(false);
      setSelectedStudent(null);
    }
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  const handleRoomClick = (room) => {
    if (room.occupants.length > 0) {
      setSelectedRoom(room);
      setIsOccupantModalOpen(true);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - modalPosition.x,
      y: e.clientY - modalPosition.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setModalPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getRoomStats = () => {
    const allRooms = getAllRooms();
    const totalRooms = allRooms.length;
    const occupiedRooms = allRooms.filter(r => r.occupied > 0).length;
    const availableRooms = allRooms.filter(r => r.isAvailable).length;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    
    return { totalRooms, occupiedRooms, availableRooms, occupancyRate };
  };

  const filteredRooms = getAvailableRooms();
  const roomStats = getRoomStats();

  return (
    <>
      <section className="custodian-hero">
        <div className="floating-icons">
          <i className="fa-solid fa-key floating-icon-1"></i>
          <i className="fa-solid fa-bed floating-icon-2"></i>
          <i className="fa-solid fa-door-open floating-icon-3"></i>
          <i className="fa-solid fa-home floating-icon-4"></i>
          <i className="fa-solid fa-building floating-icon-5"></i>
          <i className="fa-solid fa-door-closed floating-icon-6"></i>
        </div>
        <div className="hero-content">
          <h1>Room <span className="dashboard-animated">Assignment</span></h1>
          <p>Smart room allocation with real-time availability tracking</p>
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
                {/* Room Assignment Overview Dashboard */}
                <div className="assignment-overview-grid">
                  <div className="overview-card total-rooms">
                    <div className="card-header">
                      <div className="card-icon"><i className="fa-solid fa-building"></i></div>
                      <span className="card-title">Total Rooms</span>
                    </div>
                    <div className="card-content">
                      <h3 className="counter-animation" data-target="{roomStats.totalRooms}">{roomStats.totalRooms}</h3>
                      <p>Accommodation Units</p>
                      <div className="room-breakdown">
                        <div className="breakdown-item">
                          <span className="count">{getAllRooms().filter(r => r.type === 'Single').length}</span>
                          <span className="label">Single</span>
                        </div>
                        <div className="breakdown-item">
                          <span className="count">{getAllRooms().filter(r => r.type === 'Double').length}</span>
                          <span className="label">Double</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="overview-card available-rooms">
                    <div className="card-header">
                      <div className="card-icon"><i className="fa-solid fa-door-open"></i></div>
                      <span className="card-title">Available Rooms</span>
                    </div>
                    <div className="card-content">
                      <h3 className="counter-animation" data-target="{roomStats.availableRooms}">{roomStats.availableRooms}</h3>
                      <p>Ready for Assignment</p>
                      <div className="availability-indicator">
                        <div className="progress-bar">
                          <div className="progress" style={{width: `${(roomStats.availableRooms / roomStats.totalRooms) * 100}%`}}></div>
                        </div>
                        <span className="percentage">{Math.round((roomStats.availableRooms / roomStats.totalRooms) * 100)}% Available</span>
                      </div>
                    </div>
                  </div>

                  <div className="overview-card pending-students">
                    <div className="card-header">
                      <div className="card-icon"><i className="fa-solid fa-users"></i></div>
                      <div className="urgency-badge">Action Needed</div>
                    </div>
                    <div className="card-content">
                      <h3 className="counter-animation" data-target="{pendingAssignments.length}">{pendingAssignments.length}</h3>
                      <p>Pending Assignments</p>
                      <div className="priority-breakdown">
                        <div className="priority-item high">
                          <span className="count">{pendingAssignments.filter(s => s.priority === 'high').length}</span>
                          <span className="label">High Priority</span>
                        </div>
                        <div className="priority-item medium">
                          <span className="count">{pendingAssignments.filter(s => s.priority === 'medium').length}</span>
                          <span className="label">Medium</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="overview-card occupancy-rate">
                    <div className="card-header">
                      <div className="card-icon"><i className="fa-solid fa-chart-pie"></i></div>
                      <span className="card-title">Occupancy Rate</span>
                    </div>
                    <div className="card-content">
                      <h3 className="counter-animation" data-target="{roomStats.occupancyRate}">{roomStats.occupancyRate}%</h3>
                      <p>Current Utilization</p>
                      <div className="occupancy-chart">
                        <div className="chart-circle">
                          <svg viewBox="0 0 36 36" className="circular-chart">
                            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="circle" strokeDasharray={`${roomStats.occupancyRate}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Assignment Management Header */}
                <div className="assignment-management-header">
                  <div className="header-left">
                    <div className="section-title">
                      <h3><i className="fas fa-key"></i> Room Assignment Center</h3>
                      <div className="real-time-indicator">
                        <div className="status-dot pulsing"></div>
                        <span>Live updates • Last sync: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="header-right">
                    <div className="assignment-controls">
                      <div className="view-controls">
                        <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                          <i className="fas fa-th"></i>
                        </button>
                        <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                          <i className="fas fa-list"></i>
                        </button>
                      </div>
                      <div className="filter-controls">
                        <select className="filter-select" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                          <option value="all">All Rooms</option>
                          <option value="single">Single Rooms</option>
                          <option value="double">Double Rooms</option>
                          <option value="available">Available Only</option>
                        </select>
                      </div>
                      <div className="action-controls">
                        <button className="control-btn" onClick={() => setIsAdvancedSearchOpen(true)}>
                          <i className="fas fa-search"></i> Search
                        </button>
                        <button className="control-btn" onClick={handleExportData}>
                          <i className="fas fa-download"></i> Export
                        </button>
                        {selectedStudents.length > 0 && (
                          <button className="control-btn bulk" onClick={handleBulkAssign}>
                            <i className="fas fa-users"></i> Bulk Assign ({selectedStudents.length})
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Assignment Layout */}
                <div className="assignment-layout-modern">
                  {/* Pending Assignments Section */}
                  <div className="assignment-section pending-section">
                    <div className="section-header-modern">
                      <h4>Pending Assignments</h4>
                      <div className="section-actions">
                        <button className="select-all-btn" onClick={selectAllStudents}>
                          <i className="fas fa-check-double"></i>
                          {selectedStudents.length === pendingAssignments.length ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>
                    </div>
                    <div className="pending-cards-grid">
                      {pendingAssignments.length === 0 ? (
                        <div className="empty-state">
                          <i className="fas fa-check-circle"></i>
                          <h4>All Assignments Complete!</h4>
                          <p>No pending room assignments at the moment.</p>
                        </div>
                      ) : (
                        displayedStudents.map(student => (
                          <div className={`student-card-grid ${selectedStudents.includes(student.id) ? 'selected' : ''}`} key={student.id}>
                            <div className="card-header">
                              <input 
                                type="checkbox" 
                                checked={selectedStudents.includes(student.id)}
                                onChange={() => toggleStudentSelection(student.id)}
                                className="student-checkbox"
                              />
                              <div className={`priority-indicator ${student.priority}`}></div>
                              <div className="student-avatar">
                                <img src={student.avatar} alt={student.name} />
                              </div>
                            </div>
                            <div className="card-content">
                              <h5>{student.name}</h5>
                              <p className="student-id">{student.studentId}</p>
                              <div className="payment-info">
                                <span className="amount">UGX {student.paymentAmount}</span>
                                <span className="date">Paid: {student.paidOn}</span>
                              </div>
                              <div className="preferences">
                                <i className="fas fa-heart"></i>
                                <span>{student.preferences}</span>
                              </div>
                            </div>
                            <div className="card-actions">
                              <button className="assign-btn primary" onClick={() => handleAssignRoomClick(student)}>
                                <i className="fas fa-key"></i> Assign Room
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {hasMoreStudents && (
                      <div className="load-more-container">
                        <button className="load-more-btn" onClick={handleLoadMore}>
                          <i className="fas fa-plus"></i>
                          Load More ({pendingAssignments.length - displayCount} remaining)
                        </button>
                      </div>
                    )}
                  </div>

{/* Assignment History Section */}
                  <div className="assignment-section history-section">
                    <div className="section-header-modern">
                      <h4>Recent Assignments</h4>
                      <button className="view-all-btn">View All History</button>
                    </div>
                    <div className="assignment-history-grid">
                      {assignmentHistory.slice(0, 3).map(activity => (
                        <div className="history-card-grid" key={activity.id}>
                          <div className="history-icon">
                            <i className="fas fa-key"></i>
                          </div>
                          <div className="history-content">
                            <div className="history-main">
                              <strong>{activity.studentName}</strong> assigned to <strong>{activity.room}</strong>
                              <span className="room-type-badge">{activity.type}</span>
                            </div>
                            <div className="history-meta">
                              <span className="time">{activity.time}</span>
                              <span className="separator">•</span>
                              <span className="assignee">by {activity.assignedBy}</span>
                              {activity.accessCode && (
                                <>
                                  <span className="separator">•</span>
                                  <span className="access-code">Code: {activity.accessCode}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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

      {/* Comprehensive Room Assignment Modal */}
      {isAssignRoomModalOpen && selectedStudent && (
        <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && setIsAssignRoomModalOpen(false)}>
          <div className="modal-content assign-room-modal-large animate-on-scroll">
            <button className="close-modal-btn" onClick={() => setIsAssignRoomModalOpen(false)}>&times;</button>
            <div className="modal-header">
              <h3><i className="fas fa-key"></i> Room Assignment - Hotel Overview</h3>
              <div className="modal-subtitle">Select accommodation for {selectedStudent.name}</div>
            </div>
            
            <div className="assign-modal-student-card">
              <div className="student-info-section">
                <div className="student-avatar-large">
                  <img src={selectedStudent.avatar} alt={selectedStudent.name} />
                  <div className={`priority-badge ${selectedStudent.priority}`}>{selectedStudent.priority}</div>
                </div>
                <div className="student-details-section">
                  <h4>{selectedStudent.name}</h4>
                  <p className="student-id">{selectedStudent.studentId}</p>
                  <div className="payment-details">
                    <span className="payment-amount">UGX {selectedStudent.paymentAmount}</span>
                    <span className="payment-date">Paid on {selectedStudent.paidOn}</span>
                  </div>
                  <div className="student-preferences">
                    <i className="fas fa-heart"></i>
                    <span>{selectedStudent.preferences}</span>
                  </div>
                </div>
              </div>
            </div>

            <form className="modal-form-enhanced" onSubmit={handleConfirmAssignment}>
              <div className="hotels-overview">
                {Object.entries(hotelData).map(([hotelName, hotel]) => (
                  <div className="hotel-section" key={hotelName}>
                    <div className="hotel-header">
                      <h4><i className="fas fa-building"></i> {hotelName}</h4>
                      <div className="hotel-stats">
                        <span className="stat">
                          <i className="fas fa-door-open"></i>
                          {Object.values(hotel.floors).flat().filter(r => r.isAvailable || r.occupied < r.capacity).length} Available
                        </span>
                        <span className="stat">
                          <i className="fas fa-users"></i>
                          {Object.values(hotel.floors).flat().filter(r => r.occupied > 0).length} Occupied
                        </span>
                      </div>
                    </div>
                    
                    <div className="floors-container">
                      {Object.entries(hotel.floors).map(([floorNumber, rooms]) => (
                        <div className="floor-section" key={floorNumber}>
                          <div className="floor-header">
                            <h5><i className="fas fa-layer-group"></i> Floor {floorNumber}</h5>
                            <span className="floor-occupancy">
                              {rooms.filter(r => r.occupied > 0).length}/{rooms.length} occupied
                            </span>
                          </div>
                          
                          <div className="rooms-grid-enhanced">
                            {rooms.map(room => {
                              const isAvailable = room.occupied < room.capacity;
                              const isPartiallyBooked = room.occupied > 0 && room.occupied < room.capacity;
                              const statusClass = !isAvailable ? 'occupied' : (isPartiallyBooked ? 'partially-occupied' : 'available');
                              
                              return (
                                <div className={`room-card-enhanced status-${statusClass}`} key={room.id} onClick={() => handleRoomClick(room)}>
                                  {isAvailable && (
                                    <label className="room-selection-enhanced" onClick={(e) => e.stopPropagation()}>
                                      <input type="radio" name="availableRooms" value={room.id} required />
                                      <div className="radio-indicator-enhanced"></div>
                                    </label>
                                  )}
                                  
                                  <div className="room-header-enhanced">
                                    <div className="room-number-enhanced">{room.id}</div>
                                    <i className={`fas ${room.type === 'Single' ? 'fa-bed' : 'fa-users'} room-type-icon-enhanced`}></i>
                                  </div>
                                  
                                  <div className="room-body-enhanced">
                                    <div className={`room-status-enhanced status-${statusClass}`}>
                                      {isAvailable ? (isPartiallyBooked ? 'Partially Occupied' : 'Available') : 'Occupied'}
                                    </div>
                                    <div className="room-occupancy-enhanced">
                                      <i className="fas fa-users"></i>
                                      <span>{room.occupied}/{room.capacity}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="room-footer-enhanced">
                                    <span className="room-type-enhanced">{room.type}</span>
                                    {room.occupants.length > 0 && (
                                      <div className="occupants-indicator">
                                        <i className="fas fa-info-circle"></i>
                                        <span>{room.occupants.length} occupant{room.occupants.length > 1 ? 's' : ''}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="assignment-summary">
                <div className="summary-item">
                  <i className="fas fa-key"></i>
                  <span>Secure access token will be generated automatically</span>
                </div>
                <div className="summary-item">
                  <i className="fas fa-envelope"></i>
                  <span>Email notification with token sent to: {selectedStudent.email || `${selectedStudent.studentId}@university.edu`}</span>
                </div>
                <div className="summary-item">
                  <i className="fas fa-mobile-alt"></i>
                  <span>Student will receive check-in instructions and support contact</span>
                </div>
                <div className="summary-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>Assignment requires custodian approval</span>
                </div>
              </div>

              <div className="form-actions-enhanced">
                <button type="button" className="btn secondary" onClick={() => setIsAssignRoomModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  <i className="fas fa-check"></i>
                  Approve & Assign Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Assignment Modal */}
      {isBulkAssignModalOpen && (
        <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && setIsBulkAssignModalOpen(false)}>
          <div className="modal-content bulk-assign-modal animate-on-scroll">
            <button className="close-modal-btn" onClick={() => setIsBulkAssignModalOpen(false)}>&times;</button>
            <div className="modal-header">
              <h3><i className="fas fa-users"></i> Bulk Room Assignment</h3>
              <div className="modal-subtitle">Assign rooms to {selectedStudents.length} selected students</div>
            </div>
            
            <div className="bulk-assignment-content">
              <div className="selected-students-preview">
                <h4>Selected Students ({selectedStudents.length})</h4>
                <div className="students-preview-list">
                  {pendingAssignments.filter(s => selectedStudents.includes(s.id)).map(student => (
                    <div className="student-preview-item" key={student.id}>
                      <img src={student.avatar} alt={student.name} />
                      <div>
                        <span className="name">{student.name}</span>
                        <span className="id">{student.studentId}</span>
                      </div>
                      <div className={`priority-dot ${student.priority}`}></div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bulk-assignment-options">
                <div className="assignment-strategy">
                  <h4>Assignment Strategy</h4>
                  <div className="strategy-options">
                    <label className="strategy-option">
                      <input type="radio" name="strategy" value="auto" defaultChecked />
                      <div className="strategy-card">
                        <i className="fas fa-magic"></i>
                        <span>Auto-assign based on preferences</span>
                      </div>
                    </label>
                    <label className="strategy-option">
                      <input type="radio" name="strategy" value="priority" />
                      <div className="strategy-card">
                        <i className="fas fa-sort-amount-down"></i>
                        <span>Assign by priority order</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions-enhanced">
              <button type="button" className="btn secondary" onClick={() => setIsBulkAssignModalOpen(false)}>
                Cancel
              </button>
              <button type="button" className="btn primary">
                <i className="fas fa-check-double"></i>
                Assign All Rooms
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced Occupant Information Modal */}
      {isOccupantModalOpen && selectedRoom && (
        <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && setIsOccupantModalOpen(false)}>
          <div className="modal-content occupant-info-modal-enhanced animate-on-scroll">
            <button className="close-modal-btn" onClick={() => setIsOccupantModalOpen(false)}>&times;</button>
            
            <div className="modal-header-enhanced">
              <div className="room-info-header">
                <div className="room-badge">
                  <i className="fas fa-door-open"></i>
                  <span>Room {selectedRoom.id}</span>
                </div>
                <div className={`room-status-badge status-${selectedRoom.occupied < selectedRoom.capacity ? (selectedRoom.occupied > 0 ? 'partially-occupied' : 'available') : 'occupied'}`}>
                  {selectedRoom.occupied < selectedRoom.capacity ? (selectedRoom.occupied > 0 ? 'Partially Occupied' : 'Available') : 'Fully Occupied'}
                </div>
              </div>
              <h3><i className="fas fa-users"></i> Occupant Information</h3>
              <div className="room-details-summary">
                <div className="detail-item">
                  <i className="fas fa-bed"></i>
                  <span>{selectedRoom.type} Room</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-users"></i>
                  <span>{selectedRoom.occupied}/{selectedRoom.capacity} Occupied</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-building"></i>
                  <span>{selectedRoom.hotel}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-layer-group"></i>
                  <span>Floor {selectedRoom.floor}</span>
                </div>
              </div>
            </div>
            
            {selectedRoom.occupants.length > 0 ? (
              <div className="occupants-list-enhanced">
                <div className="occupants-header">
                  <h4>Current Occupants ({selectedRoom.occupants.length})</h4>
                </div>
                {selectedRoom.occupants.map((occupant, index) => (
                  <div className="occupant-card-enhanced" key={index}>
                    <div className="occupant-avatar-enhanced">
                      <div className={`avatar-circle ${occupant.sex?.toLowerCase() || 'unknown'}`}>
                        <i className={`fas ${occupant.sex === 'Male' ? 'fa-user-tie' : occupant.sex === 'Female' ? 'fa-user-graduate' : 'fa-user'}`}></i>
                      </div>
                      <div className={`gender-indicator ${occupant.sex?.toLowerCase() || 'unknown'}`}>
                        <i className={`fas ${occupant.sex === 'Male' ? 'fa-mars' : occupant.sex === 'Female' ? 'fa-venus' : 'fa-question'}`}></i>
                      </div>
                    </div>
                    
                    <div className="occupant-info-enhanced">
                      <div className="occupant-name-section">
                        <h5>{occupant.name}</h5>
                        <span className="student-id-badge">{occupant.studentId}</span>
                      </div>
                      
                      <div className="occupant-details-grid">
                        <div className="detail-card">
                          <div className="detail-icon">
                            <i className={`fas ${occupant.sex === 'Male' ? 'fa-mars' : occupant.sex === 'Female' ? 'fa-venus' : 'fa-question'}`}></i>
                          </div>
                          <div className="detail-content">
                            <span className="detail-label">Gender</span>
                            <span className="detail-value">{occupant.sex || 'Not specified'}</span>
                          </div>
                        </div>
                        
                        <div className="detail-card">
                          <div className="detail-icon">
                            <i className="fas fa-graduation-cap"></i>
                          </div>
                          <div className="detail-content">
                            <span className="detail-label">Course</span>
                            <span className="detail-value">{occupant.course || 'Not specified'}</span>
                          </div>
                        </div>
                        
                        <div className="detail-card">
                          <div className="detail-icon">
                            <i className="fas fa-calendar-alt"></i>
                          </div>
                          <div className="detail-content">
                            <span className="detail-label">Academic Year</span>
                            <span className="detail-value">{occupant.year || 'Not specified'}</span>
                          </div>
                        </div>
                        
                        <div className="detail-card">
                          <div className="detail-icon">
                            <i className="fas fa-clock"></i>
                          </div>
                          <div className="detail-content">
                            <span className="detail-label">Check-in Date</span>
                            <span className="detail-value">{occupant.checkInDate || 'Not available'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="occupant-actions">
                        <button className="action-btn view-profile">
                          <i className="fas fa-user"></i>
                          View Profile
                        </button>
                        <button className="action-btn contact">
                          <i className="fas fa-envelope"></i>
                          Contact
                        </button>
                        <button className="action-btn move-room">
                          <i className="fas fa-exchange-alt"></i>
                          Move Room
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-room-state">
                <div className="empty-icon">
                  <i className="fas fa-bed"></i>
                </div>
                <h4>Room Available</h4>
                <p>This room is currently available for assignment.</p>
                <div className="room-capacity-info">
                  <span>Capacity: {selectedRoom.capacity} student{selectedRoom.capacity > 1 ? 's' : ''}</span>
                </div>
              </div>
            )}
            
            <div className="modal-actions-enhanced">
              <button className="btn secondary" onClick={() => setIsOccupantModalOpen(false)}>
                <i className="fas fa-times"></i>
                Close
              </button>
              {selectedRoom.occupied < selectedRoom.capacity && (
                <button className="btn primary" onClick={() => {
                  setIsOccupantModalOpen(false);
                  // Logic to assign new student to this room
                }}>
                  <i className="fas fa-plus"></i>
                  Assign Student
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Secure Token Display Modal */}
      {isTokenModalOpen && currentToken && assignedStudent && (
        <div 
          className="modal-overlay is-visible draggable-overlay"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div 
            className="modal-content secure-token-modal animate-on-scroll draggable-modal"
            style={{
              transform: `translate(${modalPosition.x}px, ${modalPosition.y}px)`,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleMouseDown}
          >
            <div className="modal-header-secure">
              <div className="security-badge">
                <i className="fas fa-shield-alt"></i>
                <span>CONFIDENTIAL</span>
              </div>
              <h3><i className="fas fa-key"></i> Secure Access Token</h3>
              <p>This token is confidential and should only be shared with the assigned student</p>
            </div>
            
            <div className="assignment-success-info">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h4>Room Assignment Successful!</h4>
              <div className="assignment-details">
                <div className="detail-row">
                  <span className="label">Student:</span>
                  <span className="value">{assignedStudent.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Student ID:</span>
                  <span className="value">{assignedStudent.studentId}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Room:</span>
                  <span className="value">{assignedStudent.roomId}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email Status:</span>
                  <span className={`value ${assignedStudent.emailSent ? 'success' : 'warning'}`}>
                    {assignedStudent.emailSent ? '✅ Sent successfully' : '⚠️ Failed to send'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="token-display-section">
              <div className="token-label">
                <i className="fas fa-key"></i>
                <span>Access Token (Keep Confidential)</span>
              </div>
              <div className="token-container">
                <div className="token-value" id="tokenValue">{currentToken}</div>
                <button className="copy-token-btn" onClick={() => {
                  navigator.clipboard.writeText(currentToken);
                  alert('Token copied to clipboard!');
                }}>
                  <i className="fas fa-copy"></i>
                  Copy
                </button>
              </div>
            </div>
            
            <div className="security-instructions">
              <h5><i className="fas fa-exclamation-triangle"></i> Security Instructions</h5>
              <ul>
                <li>This token is for <strong>{assignedStudent.name}</strong> only</li>
                <li>Do not share via email, SMS, or unsecured channels</li>
                <li>Provide token directly to student in person or via secure method</li>
                <li>Token expires after successful check-in</li>
              </ul>
            </div>
            
            <div className="modal-actions-secure">
              <button className="btn secondary" onClick={() => {
                setIsTokenModalOpen(false);
                setCurrentToken(null);
                setAssignedStudent(null);
                setIsAssignRoomModalOpen(false);
                setSelectedStudent(null);
                setModalPosition({ x: 0, y: 0 });
                setIsDragging(false);
              }}>
                <i className="fas fa-times"></i>
                Close & Clear
              </button>
              <button className="btn primary" onClick={() => {
                const message = `Room Assignment - ${assignedStudent.name}\n\nRoom: ${assignedStudent.roomId}\nAccess Token: ${currentToken}\n\nPlease keep this token secure and present it during check-in.`;
                if (navigator.share) {
                  navigator.share({ title: 'Room Assignment Token', text: message });
                } else {
                  navigator.clipboard.writeText(message);
                  alert('Assignment details copied to clipboard!');
                }
              }}>
                <i className="fas fa-share"></i>
                Share Securely
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default CustodianRoomAssignmentPage;