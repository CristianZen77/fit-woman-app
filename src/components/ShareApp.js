import React from 'react';
import './ShareApp.css';

const ShareApp = () => {
  // URL de producción de la app
  const appUrl = "https://fit-woman-app.vercel.app";
  const appName = "Fit Woman";
  const shareMessage = `¡Unite a ${appName}! 💪\n\nReservá tus clases de manera fácil y rápida.\n\nDescargá la app aquí: ${appUrl}\n\n¡Te esperamos! 🏋️‍♀️`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${appName} - Descargá la App`,
          text: '¡Unite a nuestra app de reservas de clases! 💪',
          url: appUrl
        });
      } catch (error) {
        console.log('Error compartiendo:', error);
        handleWhatsAppShare();
      }
    } else {
      handleWhatsAppShare();
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareMessage).then(() => {
      const notification = document.createElement('div');
      notification.className = 'copy-notification';
      notification.textContent = '¡Mensaje copiado!';
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 2000);
    });
  };

  return (
    <div className="share-container">
      <h3>¡Compartí la App! 📱</h3>
      <div className="share-buttons">
        <button 
          className="share-button share-native"
          onClick={handleShare}
        >
          Compartir App
        </button>
        
        <button 
          className="share-button share-whatsapp"
          onClick={handleWhatsAppShare}
        >
          Compartir por WhatsApp
        </button>

        <button 
          className="share-button share-copy"
          onClick={handleCopyLink}
        >
          Copiar Mensaje
        </button>
      </div>

      <div className="qr-container">
        <p className="download-text">O escaneá el código QR:</p>
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(appUrl)}`}
          alt="QR Code"
          className="qr-code"
        />
      </div>
    </div>
  );
};

export default ShareApp;
