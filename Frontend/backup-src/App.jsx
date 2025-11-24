import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Game from './components/Game';
import Mascot from './components/Mascot';
import './styles.css';

export default function App() {
  const [role, setRole] = useState(null); // 'kid' | 'parent' | 'teacher'
  const [view, setView] = useState('dashboard');
  const [newTopWord, setNewTopWord] = useState(null);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="logo">✎</div>
          <div>
            <h1>SmartPen</h1>
            <div className="tag">Learning made playful</div>
          </div>
        </div>

        <div className="controls">
          <select value={role || ''} onChange={(e) => setRole(e.target.value || null)}>
            <option value="">Who are you?</option>
            <option value="kid">Kid</option>
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
          </select>

          <nav className="nav">
            <button onClick={() => setView('dashboard')}>Dashboard</button>
            <button onClick={() => setView('game')}>Game</button>
          </nav>
        </div>
      </header>

      <main>
        <div className="layout">
          <div className="main-panel">
            {view === 'dashboard' && <Dashboard role={role} onNewTop={(w) => setNewTopWord(w)} />}
            {view === 'game' && <Game role={role} />}
          </div>

          <aside className="side-panel">
            <Mascot role={role} newWord={newTopWord} />
          </aside>
        </div>
      </main>

      <footer>Prototype · SmartPen hackathon</footer>
    </div>
  );
}