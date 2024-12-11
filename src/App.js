import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout'; // Import Layout
import './output.css';
import './index.css';
import RequestQuoteActivation from './pages/ManageRequestQuoteActivation';


const App = () => {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check sessionStorage on initial load to determine if user is authenticated
  useEffect(() => {
    const authenticated = sessionStorage.getItem('authenticated');
    
    if (authenticated) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear(); // Clear session storage
    setIsAuthenticated(false); // Update the authentication state
    
  };

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <Layout  />
          }
        >
          <Route path="/" element={<RequestQuoteActivation />} />

          
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
