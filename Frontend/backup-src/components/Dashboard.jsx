import React, { useEffect, useState, useRef } from 'react';

const API = (path) => `http://localhost:3000${path}`;

function computeFreqFromList(list) {
  const m = {};
  (list || []).forEach(w => {
    if (!w) return;
    const k = String(w).toLowerCase();
    m[k] = (m[k] || 0) + 1;
  });
  return Object.keys(m).map(k => ({ word: k, count: m[k] })).sort((a,b)=>b.count-a.count);
}

export default function Dashboard({ role, onNewTop }) {
  const [freq, setFreq] = useState([]);
  const [polling, setPolling] = useState(true);
  const prevTop = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        // If mock words exist in localStorage, use them (quick test mode)
        const mock = localStorage.getItem('mockWords');
        if (mock) {
          const arr = JSON.parse(mock);
          const data = computeFreqFromList(arr);
          if (!mounted) return;
          setFreq(data);
          const top = data[0]?.word || null;
          if (top && top !== prevTop.current) {
            prevTop.current = top;
            if (onNewTop) onNewTop(top);
          }
          return;
        }

        // otherwise fallback to real backend
        const res = await fetch(API('/api/frequencies'));
        const data = await res.json();
        if (!mounted) return;
        setFreq(data);
        const top = data[0]?.word || null;
        if (top && top !== prevTop.current) {
          prevTop.current = top;
          if (onNewTop) onNewTop(top);
        }
      } catch (e) {
        // ignore network errors for prototype
      }
    }
    load();
    const id = setInterval(() => polling && load(), 2500);
    return () => { mounted = false; clearInterval(id); };
  }, [polling, onNewTop]);

  const top = freq.slice(0, 12);

  return (
    <section className="dashboard card">
      <div className="dashboard-head">
        <h2>Words spotted</h2>
        <div className="live">
          <span className={polling ? 'dot live-on' : 'dot'} />
          <label><input type="checkbox" checked={polling} onChange={(e) => setPolling(e.target.checked)} /> Live</label>
        </div>
      </div>

      <div className="grid">
        {top.length === 0 && <div className="empty">No words yet — open the SmartPen app or inject test words.</div>}
        {top.map((w, i) => (
          <div key={w.word} className="word-card">
            <div className="rank">{i + 1}</div>
            <div className="word">{w.word}</div>
            <div className="count">{w.count}</div>
            <button className="hear" onClick={() => speak(w.word)}>🔊</button>
          </div>
        ))}
      </div>

      <div className="help">
        {role === 'kid' && <p>Hi! I see you — press Hear to listen or go play the game 🎮</p>}
        {role === 'parent' && <p>Track frequent words and practice with your child.</p>}
        {role === 'teacher' && <p>Create exercises from high-frequency words (coming soon).</p>}
      </div>
    </section>
  );
}

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-FR';
  u.rate = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

// liste d'exemple (10 mots)
localStorage.removeItem('mockWords');
window.location.reload();