// frontend/src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import ShareApp from './ShareApp';
import './AdminDashboard.css';

const AdminDashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    plan: '',
    email: '',
    phone: ''
  });
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar usuarios desde localStorage
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
    // Convertir objeto de usuarios a array, excluyendo al admin
    const usersArray = Object.values(storedUsers).filter(user => !user.isAdmin);
    setUsers(usersArray);
  }, []);

  // Guardar usuarios en localStorage
  const updateLocalStorage = (updatedUsers) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
    const newStoredUsers = { ...storedUsers };
    
    // Mantener al admin
    updatedUsers.forEach(user => {
      newStoredUsers[user.username.toLowerCase()] = user;
    });

    localStorage.setItem('users', JSON.stringify(newStoredUsers));
  };

  const getInitialClasses = (plan) => {
    switch (plan) {
      case 'Full':
        return 20;
      case 'Medio':
        return 12;
      case 'Base':
        return 8;
      default:
        return 0;
    }
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password || !newUser.plan) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
    if (storedUsers[newUser.username.toLowerCase()]) {
      setError('El usuario ya existe');
      return;
    }

    const userToAdd = {
      ...newUser,
      classesRemaining: getInitialClasses(newUser.plan),
      bookings: [],
      active: true
    };

    storedUsers[newUser.username.toLowerCase()] = userToAdd;
    localStorage.setItem('users', JSON.stringify(storedUsers));
    setUsers(Object.values(storedUsers));
    setNewUser({ username: '', password: '', plan: '', email: '', phone: '' });
    setError('');
    setSuccessMessage('Usuario creado exitosamente');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('¿Estás segura de que deseas eliminar esta usuaria?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      updateLocalStorage(updatedUsers);
      setSuccessMessage('Usuario eliminado exitosamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleToggleBlock = (userId) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, isBlocked: !user.isBlocked }
        : user
    );
    const targetUser = updatedUsers.find(u => u.id === userId);
    setUsers(updatedUsers);
    updateLocalStorage(updatedUsers);
    setSuccessMessage(`Usuario ${targetUser.isBlocked ? 'bloqueado' : 'desbloqueado'} exitosamente`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleUpdatePlan = (userId, newPlan) => {
    const updatedUsers = users.map(user =>
      user.id === userId
        ? { ...user, plan: newPlan, classesRemaining: getInitialClasses(newPlan) }
        : user
    );
    setUsers(updatedUsers);
    updateLocalStorage(updatedUsers);
    setSuccessMessage('Plan actualizado exitosamente');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEditUser = (user) => {
    setEditingUser({
      ...user,
      classesRemaining: getInitialClasses(user.plan)
    });
    setActiveTab('edit');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingUser.username) {
      setError('El nombre de usuario es obligatorio');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
    
    // Si el plan cambió, actualizar las clases restantes
    if (storedUsers[editingUser.username.toLowerCase()].plan !== editingUser.plan) {
      editingUser.classesRemaining = getInitialClasses(editingUser.plan);
    }

    storedUsers[editingUser.username.toLowerCase()] = editingUser;
    localStorage.setItem('users', JSON.stringify(storedUsers));
    setUsers(Object.values(storedUsers));
    setEditingUser(null);
    setActiveTab('users');
    setError('');
    setSuccessMessage('Usuario actualizado exitosamente');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="admin-content">
      <nav className="admin-nav">
        <h1>Panel de Administración</h1>
        <button onClick={onLogout} className="button">Cerrar Sesión</button>
      </nav>

      <ShareApp />

      <div className="admin-tabs">
        <button 
          onClick={() => setActiveTab('users')}
          className={`button ${activeTab === 'users' ? '' : 'button-disabled'}`}
        >
          Gestionar Usuarias
        </button>
        <button 
          onClick={() => setActiveTab('create')}
          className={`button ${activeTab === 'create' ? '' : 'button-disabled'}`}
        >
          Crear Nueva Usuaria
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {activeTab === 'users' && (
        <div className="users-grid">
          {users.map(user => (
            <div key={user.id} className="class-card">
              <h3>{user.username}</h3>
              <p>Plan: {user.plan}</p>
              <p>Clases restantes: {user.classesRemaining}</p>
              <p>Email: {user.email}</p>
              <p>Teléfono: {user.phone}</p>
              {user.bookings && user.bookings.length > 0 && (
                <div className="bookings-list">
                  <h4>Reservas:</h4>
                  {user.bookings.map((booking, index) => (
                    <p key={index}>
                      {new Date(booking.date).toLocaleDateString('es-ES')} - {booking.time} - {booking.type}
                    </p>
                  ))}
                </div>
              )}
              <div className="button-group">
                <button 
                  onClick={() => handleEditUser(user)}
                  className="button"
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleToggleBlock(user.id)}
                  className={`button ${user.isBlocked ? 'button-success' : 'button-danger'}`}
                >
                  {user.isBlocked ? 'Desbloquear' : 'Bloquear'}
                </button>
                <button 
                  onClick={() => handleDeleteUser(user.id)}
                  className="button button-danger"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'create' && (
        <form onSubmit={handleCreateUser} className="form-container">
          <h2>Crear Nueva Usuaria</h2>
          <input
            type="text"
            value={newUser.username}
            onChange={(e) => setNewUser({...newUser, username: e.target.value})}
            placeholder="Nombre de usuario"
            required
          />
          <input
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            placeholder="Contraseña"
            required
          />
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            placeholder="Email"
          />
          <input
            type="tel"
            value={newUser.phone}
            onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
            placeholder="Teléfono"
          />
          <select
            value={newUser.plan}
            onChange={(e) => setNewUser({...newUser, plan: e.target.value})}
            required
          >
            <option value="">Seleccionar Plan</option>
            <option value="Base">Plan Base (8 clases)</option>
            <option value="Medio">Plan Medio (12 clases)</option>
            <option value="Full">Plan Full (20 clases)</option>
          </select>
          <button type="submit" className="button">Crear Usuaria</button>
        </form>
      )}

      {activeTab === 'edit' && editingUser && (
        <form onSubmit={handleSaveEdit} className="form-container">
          <h2>Editar Usuaria</h2>
          <input
            type="text"
            value={editingUser.username}
            onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
            placeholder="Nombre de usuario"
            required
          />
          <input
            type="email"
            value={editingUser.email}
            onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
            placeholder="Email"
          />
          <input
            type="tel"
            value={editingUser.phone}
            onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
            placeholder="Teléfono"
          />
          <select
            value={editingUser.plan}
            onChange={(e) => {
              const newPlan = e.target.value;
              setEditingUser({
                ...editingUser,
                plan: newPlan,
                classesRemaining: getInitialClasses(newPlan)
              });
            }}
          >
            <option value="">Seleccionar Plan</option>
            <option value="Base">Base (8 clases)</option>
            <option value="Medio">Medio (12 clases)</option>
            <option value="Full">Full (20 clases)</option>
          </select>
          <div className="button-group">
            <button type="submit" className="button">Guardar Cambios</button>
            <button 
              type="button" 
              onClick={() => {
                setEditingUser(null);
                setActiveTab('users');
              }}
              className="button button-danger"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminDashboard;