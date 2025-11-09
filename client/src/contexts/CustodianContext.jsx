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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Link to existing hostel
  const linkToHostel = async (hostelName) => {
    try {
      setLoading(true);
      const data = await custodianService.linkToHostel(hostelName);
      setHostelData(data.hostel);
      setAnalytics(data.analytics);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
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
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustodianContext.Provider value={{
      hostelData,
      analytics,
      loading,
      error,
      linkToHostel,
      loadDashboardData,
      setHostelData,
      setAnalytics
    }}>
      {children}
    </CustodianContext.Provider>
  );
};