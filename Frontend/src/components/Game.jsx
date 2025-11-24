import React, { useEffect, useState } from 'react';

const API = (path) => `http://localhost:3000${path}`;

export default function Game({ role }) {
  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [known, setKnown] = useState({});
  const [mode, setMode] = useState('flash');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(API('/api/frequencies'));
        const data = await res.json();
        setWords(data.map(d => d.word).slice(0, 50));
      } catch (e) { /* ignore */ }
    }
    load();
  }, []);

  if (words.length === 0) return <p>Waiting for words from SmartPen app...</p>;

  const current = words[index % words.length];

  function markKnown(val) {
    setKnown((s) => ({ ...s, [current]: (s[current] || 0) + (val ? 1 : 0) }));
    setIndex(i => i + 1);
  }

  function hear(word) {
    const u = new SpeechSynthesisUtterance(word);
    u.lang = 'fr-FR';
    speechSynthesis.speak(u);
  }

  return (
    <section className="game">
      <h2>Learning Game ({mode})</h2>
      <div className="mode-select">
        <button onClick={() => setMode('flash')} className={mode==='flash'?'active':''}>Flashcards</button>
        <button onClick={() => setMode('quiz')} className={mode==='quiz'?'active':''}>Hear & Spell</button>
      </div>

      {mode === 'flash' && (
        <div className="flashcard">
          <div className="card">
            <div className="card-content">
              <h3>{current}</h3>
              <div className="card-actions">
                <button onClick={() => hear(current)}>🔊 Hear</button>
                <button onClick={() => markKnown(true)}>I know</button>
                <button onClick={() => markKnown(false)}>I don't know</button>
              </div>
              <div className="progress">Progress: {Object.keys(known).length} / {words.length}</div>
            </div>
          </div>
        </div>
      )}

      {mode === 'quiz' && <Quiz word={current} onNext={() => setIndex(i => i + 1)} onCorrect={() => setKnown(s => ({...s,[current]:(s[current]||0)+1}))} />}

      <div className="summary">
        <h4>Session summary</h4>
        <ul>
          {Object.keys(known).slice(0,10).map(w => <li key={w}>{w} • {known[w]}</li>)}
        </ul>
      </div>
    </section>
  );
}

function Quiz({ word, onNext, onCorrect }) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);

  function submit() {
    if (answer.trim().toLowerCase() === word.toLowerCase()) {
      setFeedback('correct'); onCorrect();
    } else {
      setFeedback('wrong');
    }
    setTimeout(() => { setFeedback(null); setAnswer(''); onNext(); }, 1200);
  }

  function play() {
    const u = new SpeechSynthesisUtterance(word);
    u.lang = 'fr-FR';
    speechSynthesis.speak(u);
  }

  return (
    <div className="quiz">
      <p>Listen and type the word you hear.</p>
      <button onClick={play}>🔊 Play word</button>
      <div>
        <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type here" />
        <button onClick={submit}>Submit</button>
      </div>
      {feedback === 'correct' && <div className="ok">Correct!</div>}
      {feedback === 'wrong' && <div className="nok">Try next</div>}
    </div>
  );
}