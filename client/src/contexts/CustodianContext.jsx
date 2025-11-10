import React, { createContext, useContext, useState, useEffect } from 'react';
import custodianService from '../service/custodian.service.js';

const CustodianContext = createContext();

export const useCustodian = () => {
  const context = useContext(CustodianContext);
  if (!context) {
    throw new Error('useCustodian must be used within a CustodianProvider');
  }
  return context;
};

export const CustodianProvider = ({ children }) => {
  const [hostelData, setHostelData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create new hostel
  const createHostel = async (hostelData) => {
    try {
      setLoading(true);
      const data = await custodianService.createHostel(hostelData);
      setHostelData(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get my hostel
  const getMyHostel = async () => {
    try {
      setLoading(true);
      const data = await custodianService.getMyHostel();
      setHostelData(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await custodianService.getDashboardData();
      setHostelData(data.hostel);
      setAnalytics(data.analytics);
      setBookings(data.bookings || []);
      setPayments(data.payments || []);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Load bookings
  const loadBookings = async () => {
    try {
      const data = await custodianService.getBookings();
      setBookings(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  // Load payments
  const loadPayments = async () => {
    try {
      const data = await custodianService.getPayments();
      setPayments(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  return (
    <CustodianContext.Provider value={{
      hostelData,
      analytics,
      bookings,
      payments,
      loading,
      error,
      createHostel,
      getMyHostel,
      loadDashboardData,
      loadBookings,
      loadPayments,
      setHostelData,
      setAnalytics
    }}>
      {children}
    </CustodianContext.Provider>
  );
};