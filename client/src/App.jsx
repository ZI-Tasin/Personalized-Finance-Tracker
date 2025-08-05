// This file contains the main application component for the Personalized Finance Tracker client.
// It sets up the routing for the application using React Router and imports necessary pages.

import React from 'react';

// Importing necessary libraries and components
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

// Importing pages
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Dashboard/Home';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';
import UserProvider from './context/userContext';
import { Toaster } from 'react-hot-toast';

// Main App component: sets up the routing for the application
const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/signUp" exact element={<SignUp />} />
            <Route path="/dashboard" exact element={<Home />} />
            <Route path="/income" exact element={<Income />} />
            <Route path="/expense" exact element={<Expense />} />
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
