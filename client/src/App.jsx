// This file contains the main application component for the Personalized Finance Tracker client.
// It sets up the routing for the application using React Router and imports necessary pages.

import React from 'react';

// Importing necessary libraries and components
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';

// Importing pages
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Dashboard/Home';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';
import UserProvider from './context/userContext';
import { Toaster } from 'react-hot-toast';

const ProtectedRoutes = () => {
    const isAuthenticated = !!localStorage.getItem('token');
    // If the user is authenticated, Outlet renders the child route (e.g., Home).
    // Otherwise, it redirects them to the login page.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Main App component: sets up the routing for the application
const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/* Unprotected Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Home />} />
              <Route path="/income" element={<Income />} />
              <Route path="/expense" element={<Expense />} />
            </Route>
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px"
          },
        }}
      />
    </UserProvider>
  );
};

export default App;

const Root = () => {
  // This component handles the initial route redirection.
  // It checks for an auth token in localStorage to decide if the user
  // should be sent to the dashboard or the login page.
  const isAuthenticated = !!localStorage.getItem('token');

  // Redirect to dashboard if authenticated, otherwise redirect to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};
