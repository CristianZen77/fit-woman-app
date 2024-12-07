// frontend/src/components/Login.js
import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Inicializar usuarios si no existen
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (!storedUsers) {
      const initialUsers = {
        'admin': {
          username: 'admin',
          password: 'admin123',
          isAdmin: true,
          plan: 'Admin',
          classesRemaining: 0,
          email: 'admin@example.com',
          phone: '1234567890'
        },
        'maria': {
          username: 'maria',
          password: 'maria123',
          isAdmin: false,
          plan: 'Full',
          classesRemaining: 20,
          email: 'maria@example.com',
          phone: '9876543210'
        },
        'ana': {
          username: 'ana',
          password: 'ana123',
          isAdmin: false,
          plan: 'Base',
          classesRemaining: 8,
          email: 'ana@example.com',
          phone: '5555555555'
        }
      };
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[username.toLowerCase()];

    if (user && user.password === password) {
      if (user.isBlocked) {
        setError('Tu cuenta está bloqueada. Por favor, contacta al administrador.');
        return;
      }
      onLogin(user);
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="form-container">
      <h1>Iniciar Sesión</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuario"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
        </div>
        <button type="submit" className="button">
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default Login;