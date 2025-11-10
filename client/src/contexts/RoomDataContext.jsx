import React, { createContext, useContext, useState, useEffect } from 'react';

const RoomDataContext = createContext();

export const useRoomData = () => {
  const context = useContext(RoomDataContext);
  if (!context) {
    throw new Error('useRoomData must be used within a RoomDataProvider');
  }
  return context;
};

export const RoomDataProvider = ({ children }) => {
  const [rooms, setRooms] = useState([
    {
      id: 1,
      number: 'A101',
      type: 'Single',
      floor: 1,
      capacity: 1,
      occupied: 1,
      status: 'Occupied',
      student: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+256700000001',
        course: 'Computer Science',
        year: 2
      },
      price: 150000,
      amenities: ['WiFi', 'AC', 'Study Desk'],
      lastCleaned: '2024-01-15',
      nextMaintenance: '2024-02-01'
    },
    {
      id: 2,
      number: 'A102',
      type: 'Double',
      floor: 1,
      capacity: 2,
      occupied: 2,
      status: 'Occupied',
      students: [
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+256700000002',
          course: 'Business Administration',
          year: 1
        },
        {
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '+256700000003',
          course: 'Engineering',
          year: 3
        }
      ],
      price: 120000,
      amenities: ['WiFi', 'Shared Bathroom'],
      lastCleaned: '2024-01-14',
      nextMaintenance: '2024-01-28'
    },
    {
      id: 3,
      number: 'B201',
      type: 'Single',
      floor: 2,
      capacity: 1,
      occupied: 0,
      status: 'Available',
      price: 150000,
      amenities: ['WiFi', 'AC', 'Study Desk', 'Private Bathroom'],
      lastCleaned: '2024-01-16',
      nextMaintenance: '2024-02-05'
    },
    {
      id: 4,
      number: 'B202',
      type: 'Triple',
      floor: 2,
      capacity: 3,
      occupied: 1,
      status: 'Available',
      students: [
        {
          name: 'Sarah Wilson',
          email: 'sarah@example.com',
          phone: '+256700000004',
          course: 'Medicine',
          year: 2
        }
      ],
      price: 100000,
      amenities: ['WiFi', 'Shared Bathroom'],
      lastCleaned: '2024-01-13',
      nextMaintenance: '2024-01-30'
    },
    {
      id: 5,
      number: 'C301',
      type: 'Single',
      floor: 3,
      capacity: 1,
      occupied: 0,
      status: 'Maintenance',
      price: 150000,
      amenities: ['WiFi', 'AC', 'Study Desk'],
      lastCleaned: '2024-01-10',
      nextMaintenance: '2024-01-20',
      maintenanceIssue: 'AC repair needed'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get room statistics
  const getRoomStats = () => {
    const total = rooms.length;
    const occupied = rooms.filter(room => room.status === 'Occupied').length;
    const available = rooms.filter(room => room.status === 'Available').length;
    const maintenance = rooms.filter(room => room.status === 'Maintenance').length;
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;
    
    return {
      total,
      occupied,
      available,
      maintenance,
      occupancyRate
    };
  };

  // Add new room
  const addRoom = (roomData) => {
    const newRoom = {
      id: rooms.length + 1,
      ...roomData,
      occupied: 0,
      status: 'Available',
      lastCleaned: new Date().toISOString().split('T')[0],
      nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setRooms(prev => [...prev, newRoom]);
    return newRoom;
  };

  // Update room
  const updateRoom = (roomId, updates) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, ...updates } : room
    ));
  };

  // Delete room
  const deleteRoom = (roomId) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
  };

  const value = {
    rooms,
    loading,
    error,
    getRoomStats,
    addRoom,
    updateRoom,
    deleteRoom,
    setRooms
  };

  return (
    <RoomDataContext.Provider value={value}>
      {children}
    </RoomDataContext.Provider>
  );
};