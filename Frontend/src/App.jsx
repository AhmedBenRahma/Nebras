import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Game from './components/Game';
import Login from './components/Login';
import Pricing from './components/Pricing';
import Landing from './components/Landing';

export default function App() {
  const [role, setRole] = useState(null);
  const [view, setView] = useState('landing'); // landing | login | pricing | dashboard | game
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem('nebras_user');
    if (u) { setUser(JSON.parse(u)); setRole(JSON.parse(u).role); setView('dashboard'); }
    const s = localStorage.getItem('nebras_subscription');
    if (s) setSubscription(JSON.parse(s));
  }, []);

  function handleLogout() {
    localStorage.removeItem('nebras_user');
    setUser(null);
    setRole(null);
    setView('landing');
  }

  function onLogin(user) {
    setUser(user); setRole(user.role); setView('dashboard');
  }

  function onSubscribe(plan) {
    setSubscription({ plan: plan.id, ts: Date.now() });
    setView('dashboard');
  }

  return (
    <div className="app">
      <header className="topbar">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          {/* logo plus grand et plus présent */}
          <img src="/Nebras.jpg" alt="Nebras" style={{width:80,height:80,borderRadius:12,objectFit:'cover'}} />
          <div>
            <h1 style={{margin:0}}>Nebras</h1>
            <div style={{fontSize:12,color:'#666'}}>Apprendre ensemble</div>
          </div>
        </div>

        <div className="controls">
          <div style={{marginRight:12}}>
            <strong>{user ? user.name : 'Invité'}</strong>
            {subscription && <div style={{fontSize:11,color:'#666'}}>Plan: {subscription.plan}</div>}
          </div>

          <nav>
            <button onClick={() => setView('landing')}>Accueil</button>
            <button onClick={() => setView('dashboard')}>Dashboard</button>
            <button onClick={() => setView('game')}>Trainer</button>
            <button onClick={() => setView('pricing')}>Plans</button>
            {!user ? <button onClick={() => setView('login')}>Login</button> : <button onClick={handleLogout}>Logout</button>}
          </nav>
        </div>
      </header>

      <main style={{padding:18}}>
        {view === 'landing' && <Landing onLoginClick={() => setView('login')} onPlansClick={() => setView('pricing')} />}
        {view === 'login' && <Login onLogin={onLogin} />}
        {view === 'pricing' && <Pricing onSubscribe={onSubscribe} onBack={() => setView('landing')} />}
        {view === 'dashboard' && <Dashboard role={role} />}
        {view === 'game' && <Game role={role} />}
      </main>

      <footer>© Nebras</footer>
    </div>
  );
}