import React, { useEffect, useState } from 'react';

export default function Mascot({ role, newWord }) {
  const [pulse, setPulse] = useState(false);
  const [showHello, setShowHello] = useState(false);

  useEffect(() => {
    if (role === 'kid') {
      setShowHello(true);
      speak("Salut ! Je suis là pour t'aider.");
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 2200);
      const t2 = setTimeout(() => setShowHello(false), 4200);
      return () => { clearTimeout(t); clearTimeout(t2); };
    }
  }, [role]);

  useEffect(() => {
    if (newWord && role === 'kid') {
      speak(`Nouveau mot : ${newWord}`);
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 1600);
      return () => clearTimeout(t);
    }
  }, [newWord, role]);

  return (
    <div className={`mascot card ${pulse ? 'pulse' : ''}`}>
      <div className="mascot-face" aria-hidden>🦊</div>
      {showHello ? <div className="mascot-bubble">Je suis là ! 🎒</div> : <div className="mascot-bubble">Coucou 👋</div>}
      <div style={{fontSize:12,color:'#bcd7c9'}}>Ton ami SmartPen</div>
      <div style={{marginTop:10}}>
        <button onClick={() => { speak('Allons jouer !'); setPulse(true); setTimeout(()=>setPulse(false),1400); }}>Jouer</button>
      </div>
    </div>
  );
}

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-FR';
  u.rate = 0.95;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}