import React, { useEffect } from 'react';
import '../styles/main.css';

const Modal = ({ message, onClose }) => {
  useEffect(() => {
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
    
    // Cleanup: restaurar scroll cuando el componente se desmonta
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Cerrar modal al hacer clic fuera de él
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-icon">⚠️</div>
        <div className="modal-message">{message}</div>
        <button className="modal-button" onClick={onClose}>
          Entendido
        </button>
      </div>
    </div>
  );
};

export default Modal;