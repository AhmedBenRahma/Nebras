import React from 'react';

export default function Landing({ onLoginClick, onPlansClick }) {
  return (
    <div className="hero card" style={{maxWidth:980,margin:'36px auto',display:'flex',gap:24,alignItems:'center'}}>
      <img src="/Nebras.jpg" alt="Nebras" style={{width:120,height:120,objectFit:'cover',borderRadius:12,boxShadow:'0 8px 20px rgba(0,0,0,0.08)'}} />
      <div style={{flex:1}}>
        <h1 style={{margin:0,fontSize:28}}>Nebras — Apprendre ensemble</h1>
        <p style={{margin:'8px 0 18px',color:'#556'}}>Transforme les documents scannés en listes de mots fréquents et aide ton enfant à progresser.</p>

        <div style={{display:'flex',gap:12}}>
          <button onClick={onLoginClick} style={{padding:'10px 18px',background:'#2563eb',color:'#fff',border:'none',borderRadius:8}}>Se connecter / S'inscrire</button>
          <button onClick={onPlansClick} style={{padding:'10px 18px',background:'#fff',color:'#2563eb',border:'1px solid #dbeafe',borderRadius:8}}>Voir les plans</button>
        </div>

        <div style={{marginTop:18,fontSize:13,color:'#667'}}>
          <strong>Parents & enseignants :</strong> créez un compte, abonnez‑vous et suivez la progression des élèves.
        </div>
      </div>
    </div>
  );
}