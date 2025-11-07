// Debug script to check booking data structure
console.log('=== BOOKING DATA DEBUG ===');

// Simulate what might be returned from backend
const mockBookingData = [
  {
    _id: '507f1f77bcf86cd799439011',
    student: '507f1f77bcf86cd799439012',
    hostel: 'Kikoni Hostel', // String instead of ObjectId
    room: 'Single Room',     // String instead of ObjectId
    startDate: '2024-01-15T00:00:00.000Z',
    endDate: '2024-05-15T00:00:00.000Z',
    createdAt: '2024-01-10T10:30:00.000Z',
    payment: {
      amount: 400000,
      paymentMethod: 'Mobile Money',
      status: 'Completed'
    }
  }
];

// Test dashboard service functions
const dashboardService = {
  getHostelName: (booking) => {
    if (typeof booking.hostel === 'object' && booking.hostel.name) {
      return booking.hostel.name;
    }
    return booking.hostel || 'Unknown Hostel';
  },
  
  getRoomName: (booking) => {
    if (typeof booking.room === 'object' && booking.room.name) {
      return booking.room.name;
    }
    return booking.room || 'Unknown Room';
  },
  
  getRoomPrice: (booking) => {
    if (typeof booking.room === 'object' && booking.room.price) {
      return booking.room.price;
    }
    if (booking.payment && booking.payment.amount) {
      return booking.payment.amount;
    }
    if (booking.price) {
      return booking.price;
    }
    return 300000; // fallback
  }
};

// Test the functions
mockBookingData.forEach((booking, index) => {
  console.log(`\nBooking ${index + 1}:`);
  console.log('Hostel:', dashboardService.getHostelName(booking));
  console.log('Room:', dashboardService.getRoomName(booking));
  console.log('Price:', dashboardService.getRoomPrice(booking));
  console.log('Raw booking:', JSON.stringify(booking, null, 2));
});

export default mockBookingData;