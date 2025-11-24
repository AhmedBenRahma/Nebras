import React from 'react';

export default function Onboarding({ onClose }) {
  return (
    <div className="onboard card" role="dialog" aria-modal="true">
      <h2>Bienvenue à SmartPen !</h2>
      <p>Camembert de jeu, mascotte amicale, et aide vocale. Clique "Je suis prêt" pour commencer.</p>
      <div style={{marginTop:12,textAlign:'right'}}>
        <button onClick={onClose} style={{padding:'8px 12px',borderRadius:10,background:'#ffd166',border:'none'}}>Je suis prêt</button>
      </div>
    </div>
  );
}