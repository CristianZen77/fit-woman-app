// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import BookingCalendar from './components/BookingCalendar';
import './styles/styles.css';
import logo from './assets/logo.png';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setIsAuthenticated(true);
            setUser(userData);
            setIsAdmin(userData.isAdmin || false);
          } else {
            handleLogout();
          }
        } catch (error) {
          setError('Error de conexión al servidor');
          handleLogout();
        }
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData, token) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      setIsAdmin(userData.isAdmin || false);
      setError('');
    } catch (error) {
      setError('Error durante el inicio de sesión');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
    setError('');
  };

  return (
    <div className="app">
      <img src={logo} alt="Ceci Palacios Gym" className="logo" />
      {error && <div className="error-message">{error}</div>}
      <Routes>
        <Route 
          path="/" 
          element={
            !isAuthenticated ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            !isAuthenticated ? (
              <Register onLogin={handleLogin} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              isAdmin ? (
                <AdminDashboard onLogout={handleLogout} user={user} />
              ) : (
                <Dashboard onLogout={handleLogout} user={user} />
              )
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/booking" 
          element={
            isAuthenticated && !isAdmin ? (
              <BookingCalendar 
                user={user} 
                onBookingComplete={() => {
                  // Actualizar el estado del usuario después de una reserva exitosa
                  const updatedUser = { ...user, classesRemaining: user.classesRemaining - 1 };
                  setUser(updatedUser);
                  localStorage.setItem('user', JSON.stringify(updatedUser));
                }}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </div>
  );
};

export default App;