// frontend/src/pages/VisitorDashboard.js
import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from '../../components/Tabs';
import EntryInstructions from './EntryInstructions';
import CheckInForm from './CheckInForm';
import CheckInQR from './CheckInQR';
import Feedback from '../Feedback';
import { useNavigate } from 'react-router-dom';
import '../../styles/Visitor/VisitorDashboard.css';

function VisitorDashboard() {
  const navigate = useNavigate();
  const [visitor, setVisitor] = useState(null);

  useEffect(() => {
    const storedVisitor = localStorage.getItem('visitor');
    if (storedVisitor) {
      setVisitor(JSON.parse(storedVisitor));
    } else {
      navigate('/visitor-entry');
    }
  }, [navigate]);

  if (!visitor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="visitor-dashboard-container">
      <h2>Visitor Dashboard</h2>
      <p>Welcome, {visitor.name ? visitor.name : visitor.email}</p>
      <Tabs>
        <Tab label="Entry Instructions">
          <EntryInstructions />
        </Tab>
        <Tab label="Pre-Fill Check-In Form">
          <CheckInForm />
        </Tab>
        <Tab label="Check-In using QR Code">
          <CheckInQR />
        </Tab>
        <Tab label="Submit Feedback">
          <Feedback />
        </Tab>
      </Tabs>
    </div>
  );
}

export default VisitorDashboard;
