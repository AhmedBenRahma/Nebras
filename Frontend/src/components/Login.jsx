import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('parent');
  const [error, setError] = useState('');

  function validate() {
    if (!email || !password) { setError('Email et mot de passe requis'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Email invalide'); return false; }
    setError(''); return true;
  }

  function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    // mock auth: save minimal profile in localStorage
    const user = { email, role, name: email.split('@')[0] };
    localStorage.setItem('nebras_user', JSON.stringify(user));
    if (onLogin) onLogin(user);
  }

  return (
    <div className="card" style={{maxWidth:420,margin:'20px auto',padding:20}}>
      <h2>Connexion — Nebras</h2>
      <form onSubmit={submit}>
        <label style={{display:'block',marginTop:8}}>Rôle</label>
        <select value={role} onChange={e=>setRole(e.target.value)} style={{width:'100%',padding:8}}>
          <option value="parent">Parent</option>
          <option value="teacher">Teacher</option>
        </select>

        <label style={{display:'block',marginTop:8}}>Email</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:8}} />

        <label style={{display:'block',marginTop:8}}>Mot de passe</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:8}} />

        {error && <div style={{color:'crimson',marginTop:8}}>{error}</div>}

        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button type="submit" style={{flex:1}}>Se connecter</button>
          <button type="button" onClick={()=>{
            // quick guest flow
            const guest = { email:'guest@nebras.local', role, name:'Invité' };
            localStorage.setItem('nebras_user', JSON.stringify(guest));
            if (onLogin) onLogin(guest);
          }}>Invité</button>
        </div>
      </form>
    </div>
  );
}