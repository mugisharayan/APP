const dashboardService = {
  // Calculate booking statistics
  calculateBookingStats: (bookings) => {
    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(b => 
      (b.status || 'confirmed').toLowerCase() === 'confirmed'
    ).length;
    const totalSpent = bookings.reduce((sum, booking) => {
      // Try to get price from multiple sources
      let price = 0;
      if (typeof booking.room === 'object' && booking.room.price) {
        price = booking.room.price;
      } else if (booking.payment && booking.payment.amount) {
        price = booking.payment.amount;
      } else if (booking.price) {
        price = booking.price;
      } else {
        // Fallback price based on room type
        const roomName = typeof booking.room === 'object' ? booking.room.name : booking.room;
        price = dashboardService.getRoomPriceByName(roomName);
      }
      return sum + parseInt(price);
    }, 0);
    
    return {
      totalBookings,
      activeBookings,
      totalSpent,
      cancelledBookings: totalBookings - activeBookings
    };
  },

  // Get room price by name (fallback)
  getRoomPriceByName: (roomName) => {
    const roomPrices = {
      'Single Room': 400000,
      'Double Room': 300000,
      'Triple Room': 250000,
      'Quad Room': 200000
    };
    return roomPrices[roomName] || 300000;
  },

  // Get recent activity
  getRecentActivity: (bookings, limit = 5) => {
    return bookings
      .sort((a, b) => new Date(b.createdAt || b.bookingDate) - new Date(a.createdAt || a.bookingDate))
      .slice(0, limit)
      .map(booking => ({
        id: booking._id,
        type: 'booking',
        title: `Booked ${typeof booking.hostel === 'object' ? booking.hostel.name : booking.hostel}`,
        subtitle: typeof booking.room === 'object' ? booking.room.name : booking.room,
        date: booking.createdAt || booking.bookingDate,
        status: booking.status || 'confirmed'
      }));
  },

  // Get booking trends (mock data for now)
  getBookingTrends: () => {
    return {
      thisMonth: Math.floor(Math.random() * 10) + 1,
      lastMonth: Math.floor(Math.random() * 10) + 1,
      growth: Math.floor(Math.random() * 50) - 25 // -25% to +25%
    };
  },

  // Format currency
  formatCurrency: (amount) => {
    return `UGX ${parseInt(amount).toLocaleString()}`;
  },

  // Get booking status color
  getStatusColor: (status) => {
    const colors = {
      confirmed: '#10b981',
      pending: '#f59e0b',
      cancelled: '#ef4444',
      completed: '#6b7280'
    };
    return colors[(status || 'confirmed').toLowerCase()] || colors.confirmed;
  },

  // Extract hostel name from booking
  getHostelName: (booking) => {
    if (typeof booking.hostel === 'object' && booking.hostel.name) {
      return booking.hostel.name;
    }
    
    // Check localStorage for hostel name
    const localBookings = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    const localBooking = localBookings.find(b => b._id === booking._id);
    if (localBooking && localBooking.hostel && typeof localBooking.hostel === 'string') {
      return localBooking.hostel;
    }
    
    // If it's an ObjectId, show a user-friendly message
    if (typeof booking.hostel === 'string' && booking.hostel.match(/^[0-9a-fA-F]{24}$/)) {
      return 'Hostel Booking';
    }
    
    return booking.hostel || 'Unknown Hostel';
  },

  // Extract room name from booking
  getRoomName: (booking) => {
    if (typeof booking.room === 'object' && booking.room.name) {
      return booking.room.name;
    }
    
    // Check localStorage for room name
    const localBookings = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    const localBooking = localBookings.find(b => b._id === booking._id);
    if (localBooking && localBooking.room && typeof localBooking.room === 'string') {
      return localBooking.room;
    }
    
    // If it's an ObjectId, show a user-friendly message
    if (typeof booking.room === 'string' && booking.room.match(/^[0-9a-fA-F]{24}$/)) {
      return 'Room Booking';
    }
    
    return booking.room || 'Unknown Room';
  },

  // Extract room price from booking
  getRoomPrice: (booking) => {
    // Try payment amount first (most reliable)
    if (booking.payment && booking.payment.amount) {
      return booking.payment.amount;
    }
    
    // Try room object price
    if (typeof booking.room === 'object' && booking.room.price) {
      return booking.room.price;
    }
    
    // Try direct price field
    if (booking.price) {
      return booking.price;
    }
    
    // Check localStorage for booking with same ID
    const localBookings = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    const localBooking = localBookings.find(b => b._id === booking._id);
    if (localBooking && localBooking.price) {
      return localBooking.price;
    }
    
    // Fallback based on room name
    const roomName = dashboardService.getRoomName(booking);
    return dashboardService.getRoomPriceByName(roomName);
  }
};

export default dashboardService;