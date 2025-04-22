// frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Tab } from '../components/Tabs';
import PreRegistration from './Resident/PreRegistration';
import DigitalVisitorPass from './Resident/DigitalVisitorPass';
import VisitorStatus from './Resident/VisitorStatus';
import VisitorHistory from './Resident/VisitorHistory';
import Feedback from './Feedback';
import VerifyVisitor from './Security/VerifyVisitor';
import ArrivalSchedules from './Security/ArrivalSchedules';
import VisitorTraffic from './Security/VisitorTraffic';
import VerifyExit from './Security/VerifyExit';
import VisitorLogs from './Management/VisitorLogs';
import SecurityPolicies from './Management/SecurityPolicies';
import MassNotifications from './Management/MassNotifications';
import CapacityLimits from './Management/CapacityLimits';
import Register from './Auth/Register';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Define the tabbed interface for all roles that use tabs:
  const renderTabs = () => {
    switch (user.role) {
      case 'resident':
        return (
          <Tabs>
            <Tab label="Pre-Register Visitor">
              <PreRegistration />
            </Tab>
            <Tab label="Digital Visitor Pass">
              <DigitalVisitorPass />
            </Tab>
            <Tab label="Visitor Status">
              <VisitorStatus />
            </Tab>
            <Tab label="Visitor History">
              <VisitorHistory />
            </Tab>
            <Tab label="Submit Feedback">
              <Feedback />
            </Tab>
          </Tabs>
        );
      case 'security':
        return (
          <Tabs>
            <Tab label="Verify Visitor Information">
              <VerifyVisitor />
            </Tab>
            <Tab label="Visitor Arrival Schedules">
              <ArrivalSchedules />
            </Tab>
            <Tab label="Monitor Visitor Traffic">
              <VisitorTraffic />
            </Tab>
            <Tab label="Verify Visitor Exit">
              <VerifyExit />
            </Tab>
          </Tabs>
        );
      case 'management':
        return (
          <Tabs>
            <Tab label="Real-time Visitor Logs">
              <VisitorLogs />
            </Tab>
            <Tab label="Pre-Registration Setup">
              <PreRegistration />
            </Tab>
            <Tab label="Update Security Policies">
              <SecurityPolicies />
            </Tab>
            <Tab label="Send Mass Notifications">
              <MassNotifications />
            </Tab>
            <Tab label="Visitor Capacity Limits">
              <CapacityLimits />
            </Tab>
            <Tab label="Register">
              <Register />
            </Tab>
          </Tabs>
        );
      default:
        return (
          <div>Welcome to the Dashboard. Select a tab to get started.</div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h2>Dashboard</h2>
        <p>
          Welcome, {user.name} (<em>{user.role}</em>)
        </p>
        <button onClick={handleLogout} className="btn logout-btn">
          Logout
        </button>
      </nav>

      <div className="dashboard-content">{renderTabs()}</div>
    </div>
  );
}

export default Dashboard;
