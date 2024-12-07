// frontend/src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import BookingCalendar from './BookingCalendar';

const Dashboard = ({ user, onLogout }) => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  // Cargar reservas del usuario desde localStorage
  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem(`bookings_${user.id}`) || '[]');
    setBookings(storedBookings);
  }, [user.id]);

  // Guardar reservas en localStorage
  const updateLocalStorage = (updatedBookings) => {
    localStorage.setItem(`bookings_${user.id}`, JSON.stringify(updatedBookings));
  };

  const handleCancelBooking = (bookingToCancel) => {
    const updatedBookings = bookings.filter(booking => 
      booking.date !== bookingToCancel.date || 
      booking.time !== bookingToCancel.time
    );
    setBookings(updatedBookings);
    updateLocalStorage(updatedBookings);

    // Actualizar clases restantes
    const updatedUser = {
      ...user,
      classesRemaining: user.classesRemaining + 1
    };
    
    // Actualizar usuario en localStorage
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[user.username.toLowerCase()] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));
  };

  const handleBookingComplete = (newBooking) => {
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    updateLocalStorage(updatedBookings);
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>Bienvenida, {user.username}</h1>
        <button onClick={onLogout} className="button">Cerrar Sesión</button>
      </nav>

      <div className="dashboard-content">
        <div className="user-info">
          <div className="classes-remaining">
            <h3>Clases Restantes</h3>
            <span className="classes-number">{user.classesRemaining}</span>
            <p>Plan: {user.plan}</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="dashboard-section">
          <h2>Mis Reservas</h2>
          <div className="bookings-grid">
            {bookings.map((booking, index) => (
              <div key={index} className="class-card">
                <h3>{booking.type}</h3>
                <p>Fecha: {new Date(booking.date).toLocaleDateString()}</p>
                <p>Hora: {booking.time}</p>
                <button 
                  onClick={() => handleCancelBooking(booking)}
                  className="button button-danger"
                >
                  Cancelar Reserva
                </button>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="no-bookings">No tienes reservas activas</p>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Reservar Nueva Clase</h2>
          <BookingCalendar 
            user={user}
            onBookingComplete={handleBookingComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;