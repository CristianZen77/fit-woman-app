// frontend/src/components/Register.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    plan: 'Base'
  });
  const [error, setError] = useState('');

  const plans = {
    Base: { name: 'Plan Base', classes: 8, price: '$20.000' },
    Medio: { name: 'Plan Medio', classes: 12, price: '$25.000' },
    Full: { name: 'Plan Full', classes: 16, price: '$30.000' }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Simulación de registro local
    const mockUser = {
      id: Date.now().toString(),
      username: formData.username,
      plan: formData.plan,
      classesRemaining: plans[formData.plan].classes,
      isAdmin: false
    };

    const mockToken = 'mock-jwt-token';

    // Simular un pequeño retraso
    setTimeout(() => {
      onLogin(mockUser, mockToken);
    }, 500);
  };

  return (
    <div className="form-container">
      <h2>Registro</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Usuario"
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña"
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmar Contraseña"
            required
          />
        </div>
        
        <div>
          <select
            name="plan"
            value={formData.plan}
            onChange={handleChange}
            required
          >
            {Object.entries(plans).map(([key, plan]) => (
              <option key={key} value={key}>
                {plan.name} - {plan.classes} clases - {plan.price}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="button">
          Registrarse
        </button>
      </form>
      
      <p style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>
        ¿Ya tienes una cuenta? <Link to="/" style={{ color: '#FF0080' }}>Inicia sesión aquí</Link>
      </p>
    </div>
  );
};

export default Register;