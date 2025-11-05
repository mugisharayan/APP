import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';

const CustodianRoomAssignmentPage = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAssignRoomModalOpen, setIsAssignRoomModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const custodianProfile = {
    fullName: 'John K.',
    course: 'Lead Custodian',
    profilePicture: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  // Dummy data for pending assignments
  const [pendingAssignments, setPendingAssignments] = useState([
    { id: 1, name: 'John Doe', studentId: '22/U/12345', paidOn: '28 Jul 2024', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 2, name: 'Aisha Bello', studentId: '22/U/98765', paidOn: '27 Jul 2024', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  ]);

  // Dummy data for assignment history
  const [assignmentHistory, setAssignmentHistory] = useState([
    { id: 3, studentName: 'Michael Chen', room: 'A-207', time: '2 hours ago' },
    { id: 4, studentName: 'Sarah K.', room: 'A-108', time: '5 hours ago' },
  ]);

  const handleAssignRoomClick = (student) => {
    setSelectedStudent(student);
    setIsAssignRoomModalOpen(true);
  };

  const handleConfirmAssignment = (e) => {
    e.preventDefault();
    // In a real app, you'd update room status and student's assigned room in a backend
    // showToast(`Room assigned to ${selectedStudent.name}!`);
    setPendingAssignments(prev => prev.filter(s => s.id !== selectedStudent.id));
    setAssignmentHistory(prev => [{ id: Date.now(), studentName: selectedStudent.name, room: e.target.availableRooms.value, time: 'Just now' }, ...prev]);
    setIsAssignRoomModalOpen(false);
    setSelectedStudent(null);
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
          <div className="dashboard-content">
            <div className="dashboard-header">
              <h2>Room Assignment System</h2>
              <p className="muted">Assign rooms to students with verified payments.</p>
            </div>

            <div className="assignment-layout">
              <div className="assignment-column">
                <div className="section-header">
                  <h3>Pending Assignments</h3>
                </div>
                <div className="pending-assignment-list">
                  {pendingAssignments.length === 0 ? (
                    <p className="muted" style={{ textAlign: 'center', padding: '20px' }}>No pending assignments.</p>
                  ) : (
                    pendingAssignments.map(student => (
                      <div className="pending-item" key={student.id}>
                        <div className="student-info">
                          <img src={student.avatar} alt={student.name} />
                          <div>
                            <h5>{student.name}</h5>
                            <p>Paid on: {student.paidOn}</p>
                          </div>
                        </div>
                        <button className="btn primary small assign-room-btn" onClick={() => handleAssignRoomClick(student)}>Assign Room</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="assignment-column">
                <div className="section-header">
                  <h3>Assignment History</h3>
                </div>
                <ul className="activity-feed">
                  {assignmentHistory.map(activity => (
                    <li className="activity-item" key={activity.id}>
                      <div className="activity-icon assignment"><i className="fas fa-key"></i></div>
                      <div className="activity-content">
                        <p><strong>{activity.studentName}</strong> was assigned to Room <strong>{activity.room}</strong>.</p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </li>
                  ))}
                </ul>
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

      {/* Assign Room Modal */}
      {isAssignRoomModalOpen && selectedStudent && (
        <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && setIsAssignRoomModalOpen(false)}>
          <div className="modal-content animate-on-scroll">
            <button className="close-modal-btn" onClick={() => setIsAssignRoomModalOpen(false)}>&times;</button>
            <h3>Assign Room</h3>
            <div className="assign-modal-student">
              <img src={selectedStudent.avatar} alt={selectedStudent.name} />
              <div>
                <h4>{selectedStudent.name}</h4>
                <p>{selectedStudent.studentId}</p>
              </div>
            </div>
            <form className="modal-form" onSubmit={handleConfirmAssignment}>
              <div className="form-group">
                <label htmlFor="availableRooms" aria-label="Select an Available Room">Select an Available Room</label>
                <select id="availableRooms" required>
                  <option value="" disabled selected>Choose a room...</option>
                  <option value="A-101">A-101 (Single)</option>
                  <option value="A-106">A-106 (Double)</option>
                  <option value="A-107">A-107 (Single)</option>
                  <option value="A-202">A-202 (Single)</option>
                </select>
              </div>
              <div className="form-actions" style={{ marginTop: '20px' }}>
                <button type="submit" className="btn primary full-width">Confirm & Generate Access Code</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default CustodianRoomAssignmentPage;