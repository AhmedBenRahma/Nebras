import React, { useState } from 'react';

const checkSVG = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{display:'block'}}>
    <path d="M20 6L9 17l-5-5" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    priceMonth: 0,
    bullets: ['1 utilisateur', '100 mots / jour', 'Accès au Trainer', 'Export JSON'],
    highlight: false
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonth: 9,
    bullets: ['Jusqu\'à 5 utilisateurs', 'Suivi de progression', 'Export & rapports', 'Support prioritaire'],
    highlight: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonth: 'Custom',
    bullets: ['Utilisateurs illimités', 'Onboarding dédié', 'Intégrations & SSO', 'Formation & support'],
    highlight: false
  }
];

export default function Pricing({ onSubscribe, onBack }) {
  const [billing, setBilling] = useState('month'); // month | year

  function formatPrice(p) {
    if (p === 'Custom') return 'Sur devis';
    if (billing === 'month') return p === 0 ? 'Gratuit' : `$${p}/mois`;
    // yearly price = 10 * monthly (discount)
    if (p === 0) return 'Gratuit';
    const yearly = typeof p === 'number' ? Math.round(p * 10) : p;
    return `$${yearly}/an`;
  }

  function onChoose(plan) {
    if (plan.id === 'enterprise') {
      alert('Un conseiller Nebras vous contactera pour le plan Enterprise.');
    } else {
      const ok = window.confirm(`S'abonner au plan ${plan.name} (${formatPrice(plan.priceMonth)}) ?`);
      if (!ok) return;
      if (onSubscribe) onSubscribe(plan);
    }
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <div>
          <h2 style={{margin:0}}>Plans — Nebras</h2>
          <small style={{color:'#666'}}>Choisissez le plan adapté aux familles et aux établissements.</small>
        </div>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <div style={{fontSize:13,color:'#666'}}>Facturation</div>
          <div style={{display:'flex',background:'#fff',borderRadius:999,padding:4,border:'1px solid rgba(10,25,45,0.04)'}}>
            <button onClick={()=>setBilling('month')} style={{border:0,background:billing==='month'?'#2563eb':'transparent',color:billing==='month'?'#fff':'#2563eb',padding:'8px 12px',borderRadius:8,cursor:'pointer'}}>Mensuel</button>
            <button onClick={()=>setBilling('year')} style={{border:0,background:billing==='year'?'#2563eb':'transparent',color:billing==='year'?'#fff':'#2563eb',padding:'8px 12px',borderRadius:8,cursor:'pointer'}}>Annuel (≈10×)</button>
          </div>
          {/* Retour explicite vers l'accueil via onBack fourni par App */}
          <button className="btn btn-ghost" onClick={() => { if (onBack) onBack(); else setTimeout(()=>window.location.href='/',50); }}>Retour</button>
        </div>
      </div>

      <div className="pricing-grid" style={{marginBottom:18}}>
        {PLANS.map(plan => (
          <div key={plan.id} className="plan card" style={{
            border: plan.highlight ? '2px solid rgba(37,99,235,0.12)' : undefined,
            boxShadow: plan.highlight ? '0 12px 30px rgba(37,99,235,0.08)' : undefined,
            transform: plan.highlight ? 'translateY(-6px)' : undefined
          }}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
              <div>
                <div style={{fontSize:14,fontWeight:700}}>{plan.name}</div>
                <div className="price" style={{marginTop:6}}>{formatPrice(plan.priceMonth)}</div>
              </div>
              {plan.highlight && <div className="badge">Popular</div>}
            </div>

            <div style={{marginTop:12}}>
              <ul style={{padding:0,margin:0,listStyle:'none',display:'flex',flexDirection:'column',gap:8}}>
                {plan.bullets.map(b => (
                  <li key={b} style={{display:'flex',alignItems:'center',gap:10,color:'#334155'}}>
                    <span style={{width:20}}>{checkSVG}</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{marginTop:16,display:'flex',gap:8}}>
              <button className="btn btn-primary" style={{flex:1}} onClick={() => onChoose(plan)}>
                {plan.id === 'free' ? 'Commencer (gratuit)' : plan.id === 'enterprise' ? 'Contactez-nous' : 'S\'abonner'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{padding:14,display:'flex',alignItems:'center',gap:12}}>
        <div style={{flex:1}}>
          <strong>Comparaison rapide</strong>
          <div style={{color:'#555',marginTop:6}}>Free : parfait pour tester Nebras — 1 utilisateur, 100 mots/jour.<br/>Pro : usage familial ou petits établissements. Enterprise : solutions sur-mesure.</div>
        </div>
        <div>
          <button className="btn btn-ghost" onClick={() => { if (onBack) onBack(); else window.history.back(); }}>Retour à l'accueil</button>
        </div>
      </div>
    </div>
  );
}