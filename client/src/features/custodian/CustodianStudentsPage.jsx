import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';

const CustodianStudentsPage = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isViewProfileModalOpen, setIsViewProfileModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');

  const custodianProfile = {
    fullName: 'John K.',
    course: 'Lead Custodian',
    profilePicture: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  // Dummy student data
  const [students, setStudents] = useState([
    { id: 1, name: 'Jane Doe', studentId: '2100712345', room: 'A-102', status: 'Checked-in', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', contact: '0771234567', email: 'jane.doe@student.mak.ac.ug', course: 'B.Sc. Computer Science' },
    { id: 2, name: 'Peter Jones', studentId: '2100712346', room: 'A-103', status: 'Checked-in', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', contact: '0771234568', email: 'peter.jones@student.mak.ac.ug', course: 'B.Sc. Software Engineering' },
    { id: 3, name: 'Amelia Nakamya', studentId: '2100712347', room: 'A-201', status: 'Booked', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', contact: '0771234569', email: 'amelia.n@student.mak.ac.ug', course: 'B.Sc. Information Technology' },
    { id: 4, name: 'Sandra Nabiryo', studentId: '2100712349', room: '-', status: 'Checked-out', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', contact: '0771234570', email: 'sandra.n@student.mak.ac.ug', course: 'B.Sc. Data Science' },
  ]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    student.room.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  const handleAddStudent = (e) => {
    e.preventDefault();
    const form = e.target;
    const newStudent = {
      id: students.length + 1,
      name: form.fullName.value,
      studentId: form.studentId.value,
      room: form.roomAssignment.value || '-',
      status: 'Booked', // Default status for new student
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Placeholder
      contact: '', email: '', course: '' // Placeholder
    };
    setStudents(prev => [...prev, newStudent]);
    // showToast('Student added successfully!');
    setIsAddStudentModalOpen(false);
    form.reset();
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setIsViewProfileModalOpen(true);
  };

  const handleRemoveStudent = (idToRemove) => {
    // In a real app, this would involve a confirmation and backend call
    setStudents(prev => prev.filter(s => s.id !== idToRemove));
    // showToast('Student removed.');
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
              <h2>Student Directory</h2>
              <p className="muted">Search and manage all registered students.</p>
              <div className="section-actions">
                <div className="search-wrapper modern">
                  <input
                    type="search"
                    className="sidebar-search"
                    placeholder="Search by name, ID, room..."
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                  />
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <button className="btn primary small" onClick={() => setIsAddStudentModalOpen(true)}><i className="fas fa-user-plus"></i> Add Student</button>
              </div>
            </div>

            <div className="dashboard-section">
              <div className="student-grid">
                {filteredStudents.length === 0 ? (
                  <p className="muted" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No students found matching your search.</p>
                ) : (
                  filteredStudents.map(student => (
                    <div className="student-card-new" key={student.id}>
                      <div className="student-card-header">
                        <img src={student.avatar} alt={student.name} />
                        <div className="student-card-info">
                          <span className="student-name">{student.name}</span>
                          <span className="student-id">{student.studentId}</span>
                        </div>
                      </div>
                      <div className="student-card-body">
                        <div className="student-detail"><small>Room No.</small><span>{student.room}</span></div>
                        <div className="student-detail"><small>Status</small><span className={`status-indicator ${student.status.toLowerCase().replace('-', '')}`}>{student.status}</span></div>
                      </div>
                      <div className="student-card-actions">
                        <button className="btn-icon view" title="View Profile" onClick={() => handleViewProfile(student)}><i className="fas fa-eye"></i></button>
                        <button className="btn-icon message" title="Send Message"><i className="fas fa-paper-plane"></i></button>
                        <button className="btn-icon remove" title="Remove Student" onClick={() => handleRemoveStudent(student.id)}><i className="fas fa-trash-alt"></i></button>
                      </div>
                    </div>
                  ))
                )}
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

      {/* Add Student Modal */}
      {isAddStudentModalOpen && (
        <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && setIsAddStudentModalOpen(false)}>
          <div className="modal-content animate-on-scroll">
            <button className="close-modal-btn" onClick={() => setIsAddStudentModalOpen(false)}>&times;</button>
            <h3>Add New Student</h3>
            <form id="addStudentForm" className="modal-form" onSubmit={handleAddStudent}>
              <div className="form-grid">
                <div className="form-group"><label>Full Name</label><input type="text" name="fullName" required /></div>
                <div className="form-group"><label aria-label="Student ID">Student ID</label><input type="text" name="studentId" required /></div>
              </div>
              <div className="form-group"><label aria-label="Email Address">Email Address</label><input type="email" name="email" required /></div>
              <div className="form-group"><label aria-label="Room Assignment">Room Assignment</label><input type="text" name="roomAssignment" placeholder="e.g., A-101" /></div>
              <div className="form-actions" style={{ marginTop: '20px' }}>
                <button type="submit" className="btn primary full-width">Add Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {isViewProfileModalOpen && selectedStudent && (
        <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && setIsViewProfileModalOpen(false)}>
          <div className="modal-content profile-modal-content animate-on-scroll">
            <button className="close-modal-btn" onClick={() => setIsViewProfileModalOpen(false)}>&times;</button>
            <div className="profile-modal-header">
              <img src={selectedStudent.avatar} alt={selectedStudent.name} />
              <div>
                <h3>{selectedStudent.name}</h3>
                <p>{selectedStudent.studentId}</p>
                <span className={`status-badge ${selectedStudent.status.toLowerCase().replace('-', '')}`}>{selectedStudent.status}</span>
              </div>
            </div>
            <div className="profile-modal-body">
              <div className="profile-tabs">
                <button className="tab-link active" data-tab="details">Details</button>
                <button className="tab-link" data-tab="bookings">Bookings</button>
                <button className="tab-link" data-tab="payments">Payments</button>
              </div>
              <div className="tab-content active" id="details-tab">
                <p><strong>Contact:</strong> {selectedStudent.contact || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedStudent.email || 'N/A'}</p>
                <p><strong>Course:</strong> {selectedStudent.course || 'N/A'}</p>
              </div>
              <div className="tab-content" id="bookings-tab" style={{ display: 'none' }}>
                <p><strong>Current:</strong> Muhika Hostel, Room B-12 (Aug 2024 - Dec 2024)</p>
                <p><strong>Previous:</strong> Nana Hostel, Room C-04 (Jan 2024 - May 2024)</p>
              </div>
              <div className="tab-content" id="payments-tab" style={{ display: 'none' }}>
                <p><strong>Aug 2024:</strong> UGX 850,000 (Paid)</p>
                <p><strong>Jan 2024:</strong> UGX 800,000 (Paid)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CustodianStudentsPage;