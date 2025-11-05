import React from 'react';
import { NavLink } from 'react-router-dom';

const studentLinks = [
  { to: "/dashboard", icon: "fa-house-user", text: "Dashboard" },
  { to: "/my-bookings", icon: "fa-file-invoice", text: "My Bookings" },
  { to: "/maintenance", icon: "fa-screwdriver-wrench", text: "Maintenance" },
  { to: "/profile", icon: "fa-user-pen", text: "My Profile" },
];

const custodianLinks = [
    { to: "/custodian-dashboard", icon: "fa-inbox", text: "Dashboard" },
    { to: "/custodian-payment-management", icon: "fa-file-invoice-dollar", text: "Payment Management" },
    { to: "/custodian-room-assignment", icon: "fa-key", text: "Room Assignment" },
    { to: "/custodian-room-management", icon: "fa-bed", text: "Room Management" },
    { to: "/custodian-students", icon: "fa-users", text: "Student Management" },
    { to: "/custodian-analytics", icon: "fa-chart-line", text: "Analytics & Reports" },
    { to: "/custodian-maintenance", icon: "fa-screwdriver-wrench", text: "Maintenance" },
    { to: "/custodian-profile", icon: "fa-user-pen", text: "My Profile" },
];

const DashboardSidebar = ({ user, onLogout, role = 'student' }) => {
  const links = role === 'custodian' ? custodianLinks : studentLinks;

  return (
    <aside className={`dashboard-sidebar ${role === 'custodian' ? 'custodian-sidebar' : ''}`}>
      <div className="profile-summary">
        <img src={user.profilePicture || `https://i.pravatar.cc/80?u=${user.email}`} alt={`${user.fullName} profile`} />
        <h4>{user.fullName}</h4>
        <p>{user.course || 'Custodian'}</p>
      </div>
      <nav className="dashboard-nav">
        {links.map(link => <NavLink key={link.to} to={link.to} className="dashboard-link"><i className={`fa-solid ${link.icon}`}></i> {link.text}</NavLink>)}
        <button className="dashboard-link logout" onClick={onLogout}><i className="fa-solid fa-right-from-bracket"></i> Logout</button>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;