import React, { createContext, useContext, useState } from 'react';

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

  const addRoom = (room) => {
    setRooms(prev => [...prev, room]);
  };

  const updateRoom = (roomId, updates) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, ...updates } : room
    ));
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
      getMaintenanceStats
    }}>
      {children}
    </RoomDataContext.Provider>
  );
};