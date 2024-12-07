// frontend/src/components/BookingCalendar.js
import React, { useState, useEffect } from 'react';

const BookingCalendar = ({ user, onBookingComplete }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [bookings, setBookings] = useState({});
  const [error, setError] = useState('');
  const [userBookings, setUserBookings] = useState([]);
  const MAX_SPOTS = 7;

  // Horarios fijos de clases
  const classSchedules = {
    'lunes': [{ time: '20:00', type: 'Full Body' }],
    'martes': [{ time: '20:00', type: 'Functional' }],
    'miércoles': [{ time: '20:00', type: 'Full Body' }],
    'jueves': [{ time: '20:00', type: 'Functional' }],
    'viernes': [{ time: '20:00', type: 'Full Body' }]
  };

  // Cargar reservas existentes y reservas del usuario
  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '{}');
    setBookings(storedBookings);
    
    if (user && user.bookings) {
      const formattedBookings = user.bookings.map(booking => ({
        ...booking,
        date: new Date(booking.date).toISOString().split('T')[0]
      }));
      setUserBookings(formattedBookings);
    }
  }, [user]);

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Fecha no válida';
      }
      return date.toLocaleDateString('es-ES', { 
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha no válida';
    }
  };

  const getClassesForDay = (dateString) => {
    const dayName = getDayName(dateString);
    return classSchedules[dayName] || [];
  };

  const handleBooking = (classType, time) => {
    if (!user.classesRemaining || user.classesRemaining <= 0) {
      setError('No tienes clases disponibles en tu plan');
      return;
    }

    const bookingKey = `${selectedDate}-${time}-${classType}`;
    const currentBookings = bookings[bookingKey] || 0;

    if (currentBookings >= MAX_SPOTS) {
      setError('Lo siento, esta clase está llena');
      return;
    }

    // Crear nueva reserva
    const newBooking = {
      date: selectedDate,
      time: time,
      type: classType
    };

    // Actualizar las reservas globales
    const updatedBookings = {
      ...bookings,
      [bookingKey]: currentBookings + 1
    };
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));

    // Actualizar las reservas del usuario
    const updatedUserBookings = [...userBookings, newBooking];
    setUserBookings(updatedUserBookings);

    // Actualizar el usuario en localStorage
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const updatedUser = {
      ...user,
      classesRemaining: Math.max(0, user.classesRemaining - 1),
      bookings: updatedUserBookings
    };
    users[user.username.toLowerCase()] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));

    // Notificar que la reserva fue exitosa
    onBookingComplete(updatedUser);
    setError('');
  };

  const handleCancelBooking = (index) => {
    // Obtener la reserva a cancelar
    const bookingToCancel = userBookings[index];
    const bookingKey = `${bookingToCancel.date}-${bookingToCancel.time}-${bookingToCancel.type}`;

    // Actualizar las reservas globales
    const updatedBookings = { ...bookings };
    updatedBookings[bookingKey] = (updatedBookings[bookingKey] || 1) - 1;
    if (updatedBookings[bookingKey] <= 0) {
      delete updatedBookings[bookingKey];
    }
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));

    // Actualizar las reservas del usuario
    const updatedUserBookings = userBookings.filter((_, i) => i !== index);
    setUserBookings(updatedUserBookings);

    // Actualizar el usuario en localStorage
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const updatedUser = {
      ...user,
      classesRemaining: Math.min(getMaxClassesForPlan(user.plan), user.classesRemaining + 1),
      bookings: updatedUserBookings
    };
    users[user.username.toLowerCase()] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));

    // Notificar que la reserva fue cancelada
    onBookingComplete(updatedUser);
  };

  const getMaxClassesForPlan = (plan) => {
    return plan === 'Full' ? 20 : plan === 'Base' ? 8 : 0;
  };

  const getMinDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="booking-container">
      <div className="class-info">
        <h2>Clases Restantes</h2>
        <div className="classes-remaining">{user.classesRemaining}</div>
        <p>Plan: {user.plan}</p>
      </div>

      <div className="booking-calendar">
        <h2>Reservar Clase</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={getMinDate()}
          required
        />

        {selectedDate && getClassesForDay(selectedDate).map((classInfo, index) => (
          <div key={index} className="class-card">
            <h3>{classInfo.type}</h3>
            <p>Horario: {classInfo.time}</p>
            <p>Lugares disponibles: {MAX_SPOTS - (bookings[`${selectedDate}-${classInfo.time}-${classInfo.type}`] || 0)}</p>
            <button
              onClick={() => handleBooking(classInfo.type, classInfo.time)}
              className="button"
              disabled={bookings[`${selectedDate}-${classInfo.time}-${classInfo.type}`] >= MAX_SPOTS}
            >
              Reservar
            </button>
          </div>
        ))}
      </div>

      <div className="my-bookings">
        <h2>Mis Reservas</h2>
        {userBookings.map((booking, index) => (
          <div key={index} className="booking-card">
            <p>Fecha: {formatDate(booking.date)}</p>
            <p>Hora: {booking.time}</p>
            <p>Clase: {booking.type}</p>
            <button
              onClick={() => handleCancelBooking(index)}
              className="button button-danger"
            >
              CANCELAR RESERVA
            </button>
          </div>
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default BookingCalendar;