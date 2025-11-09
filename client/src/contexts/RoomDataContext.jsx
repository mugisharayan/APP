import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../service/api.service.js';

const RoomDataContext = createContext();

export const useRoomData = () => {
  const context = useContext(RoomDataContext);
  if (!context) {
    throw new Error('useRoomData must be used within a RoomDataProvider');
  }
  return context;
};

export const RoomDataProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load rooms from database on mount
  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const response = await apiService.hostels.getAll();
      const hostels = response.data;
      
      // Extract all rooms from all hostels
      const allRooms = [];
      hostels.forEach(hostel => {
        if (hostel.rooms) {
          hostel.rooms.forEach(room => {
            allRooms.push({
              ...room,
              hostelId: hostel._id,
              hostelName: hostel.name
            });
          });
        }
      });
      
      setRooms(allRooms);
      setError(null);
    } catch (err) {
      setError('Failed to load rooms');
      console.error('Error loading rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const addRoom = async (room) => {
    try {
      // In a real implementation, this would create a room via API
      // For now, just add to local state
      setRooms(prev => [...prev, { ...room, id: Date.now().toString() }]);
      return true;
    } catch (error) {
      console.error('Error adding room:', error);
      return false;
    }
  };

  const updateRoom = async (roomId, updates) => {
    try {
      // In a real implementation, this would update room via API
      setRooms(prev => prev.map(room => 
        room.id === roomId ? { ...room, ...updates } : room
      ));
      return true;
    } catch (error) {
      console.error('Error updating room:', error);
      return false;
    }
  };

  const getRoomStats = () => {
    const total = rooms.length;
    const available = rooms.filter(r => r.status === 'Available').length;
    const occupied = rooms.filter(r => r.status === 'Occupied').length;
    const booked = rooms.filter(r => r.status === 'Booked').length;
    const maintenance = rooms.filter(r => r.status === 'Maintenance').length;
    const partiallyOccupied = rooms.filter(r => r.status === 'Partially Occupied').length;

    return {
      total,
      available,
      occupied,
      booked,
      maintenance,
      partiallyOccupied,
      occupancyRate: total > 0 ? Math.round(((occupied + partiallyOccupied) / total) * 100) : 0
    };
  };

  const getRoomTypeStats = () => {
    const single = rooms.filter(r => r.roomType === 'Single').length;
    const double = rooms.filter(r => r.roomType === 'Double').length;
    return { single, double };
  };

  const getMaintenanceStats = () => {
    const maintenanceRooms = rooms.filter(r => r.status === 'Maintenance');
    const pending = maintenanceRooms.filter(r => r.maintenanceStatus === 'Pending').length;
    const inProgress = maintenanceRooms.filter(r => r.maintenanceStatus === 'In Progress').length;
    const resolved = maintenanceRooms.filter(r => r.maintenanceStatus === 'Resolved').length;
    
    return { pending, inProgress, resolved, total: maintenanceRooms.length };
  };

  return (
    <RoomDataContext.Provider value={{
      rooms,
      setRooms,
      addRoom,
      updateRoom,
      getRoomStats,
      getRoomTypeStats,
      getMaintenanceStats,
      loadRooms,
      loading,
      error
    }}>
      {children}
    </RoomDataContext.Provider>
  );
};