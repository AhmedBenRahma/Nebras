import React, { useEffect, useState, useRef } from 'react';
import { triggerConfetti } from '../utils/useConfetti';

const API = (path) => `http://localhost:3000${path}`;

// simplified SM-2 like update
function updateScheduling(card, correct) {
  if (correct) {
    card.reps = (card.reps || 0) + 1;
    if (card.reps === 1) card.interval = 1;
    else if (card.reps === 2) card.interval = 2;
    else card.interval = Math.round((card.interval || 2) * (card.ef || 2.5));
    card.ef = Math.max(1.3, (card.ef || 2.5) + 0.1);
    card.due = Date.now() + (card.interval || 1) * 24 * 3600 * 1000;
    card.streak = (card.streak || 0) + 1;
  } else {
    card.reps = 0;
    card.interval = 1;
    card.ef = Math.max(1.3, (card.ef || 2.5) - 0.3);
    card.due = Date.now() + 1 * 24 * 3600 * 1000;
    card.streak = 0;
  }
  return card;
}

function speak(word) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(word);
  u.lang = 'fr-FR';
  u.rate = 0.95;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

export default function WordTrainer({ initialWords }) {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState('learn'); // learn | quiz
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const mountedRef = useRef(false);

  // load words / progress
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    async function load() {
      let words = initialWords;
      if (!words || words.length === 0) {
        try {
          const res = await fetch(API('/api/frequencies'));
          const data = await res.json();
          words = data.map(d => d.word);
        } catch (e) {
          const mock = localStorage.getItem('mockWords');
          words = mock ? JSON.parse(mock) : ['chat','chien','pomme','maison'];
        }
      }
      const unique = Array.from(new Set(words)).slice(0, 80);
      const cardsInit = unique.map(w => ({
        word: w,
        ef: 2.5,
        interval: 1,
        reps: 0,
        due: Date.now(),
        streak: 0
      }));
      const saved = JSON.parse(localStorage.getItem('trainerProgress') || 'null');
      if (saved && Array.isArray(saved)) {
        const map = Object.fromEntries(saved.map(c => [c.word, c]));
        for (const c of cardsInit) if (map[c.word]) Object.assign(c, map[c.word]);
      }
      setCards(cardsInit);
    }
    load();
  }, [initialWords]);

  useEffect(() => {
    localStorage.setItem('trainerProgress', JSON.stringify(cards));
  }, [cards]);

  if (!cards.length) return <div className="card">Chargement des mots...</div>;

  // queue = due now; if empty, use rotating schedule
  const queue = cards.filter(c => (c.due || 0) <= Date.now()).sort((a,b) => (a.reps||0) - (b.reps||0));
  const current = queue.length ? queue[index % queue.length] : cards[index % cards.length];

  function persistAndSet(updated) {
    setCards(updated);
    localStorage.setItem('trainerProgress', JSON.stringify(updated));
  }

  function handleKnown() {
    triggerConfetti();
    const updated = cards.map(c => c.word === current.word ? updateScheduling({...c}, true) : c);
    persistAndSet(updated);
    setScore(s => ({...s, correct: s.correct+1}));
    setFeedback('good');
    setTimeout(()=>{ setFeedback(null); nextCard(); }, 900);
  }

  function handleWrong() {
    const updated = cards.map(c => c.word === current.word ? updateScheduling({...c}, false) : c);
    persistAndSet(updated);
    setScore(s => ({...s, wrong: s.wrong+1}));
    setFeedback('bad');
    setTimeout(()=>{ setFeedback(null); nextCard(); }, 900);
  }

  // Next card: advance index and ensure current won't reappear immediately
  function nextCard() {
    if (!current) {
      setIndex(i => i + 1);
      return;
    }
    // push current's due slightly forward if it is still due (user skipped)
    const minDelay = 3 * 60 * 1000; // 3 minutes
    const updated = cards.map(c => {
      if (c.word === current.word) {
        const future = Math.max(c.due || 0, Date.now() + minDelay);
        return {...c, due: future};
      }
      return c;
    });
    persistAndSet(updated);
    // move index to next item in the (possibly changed) queue
    setIndex(i => i + 1);
    setInput('');
  }

  function showHint() {
    if (!current) return;
    alert(`Indice: la première lettre est "${current.word.charAt(0)}"`);
  }

  function submitQuiz() {
    if (!current) return;
    if (input.trim().toLowerCase() === current.word.toLowerCase()) {
      handleKnown();
    } else {
      handleWrong();
    }
  }

  function resetProgress() {
    if (!confirm('Réinitialiser la progression ?')) return;
    const reset = cards.map(c => ({...c, ef:2.5, interval:1, reps:0, due:Date.now(), streak:0}));
    persistAndSet(reset);
    setScore({correct:0, wrong:0});
  }

  return (
    <section className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2 style={{margin:0}}>Jeu d'apprentissage</h2>
        <div style={{fontSize:12,color:'#666'}}>Correct: {score.correct} • Wrong: {score.wrong}</div>
      </div>

      <div style={{marginTop:12,textAlign:'center'}}>
        <div style={{fontSize:40,fontWeight:900,color:'#0b1720',marginBottom:8}}>{current ? current.word : '—'}</div>

        <div style={{display:'flex',gap:10,justifyContent:'center',marginBottom:8}}>
          <button className="btn btn-ghost" onClick={()=>speak(current?.word)}>🔊 Hear</button>
          <button className="btn btn-ghost" onClick={showHint}>💡 Indice</button>
          <button className="btn btn-primary" onClick={handleKnown}>✅ Je connais</button>
          <button className="btn" onClick={handleWrong}>❌ Pas encore</button>
        </div>

        <div style={{marginTop:14}}>
          <div style={{marginBottom:6,fontWeight:600}}>Mode Quiz (écrire le mot)</div>
          <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Écris le mot ici" style={{padding:8,borderRadius:8,border:'1px solid rgba(10,25,45,0.06)'}} />
          <button className="btn btn-primary" onClick={submitQuiz} style={{marginLeft:8}}>Valider</button>
        </div>

        {feedback === 'good' && <div style={{color:'green',marginTop:8}}>Bravo ✔</div>}
        {feedback === 'bad' && <div style={{color:'crimson',marginTop:8}}>Presque — on réessaie plus tard</div>}
      </div>

      <div style={{marginTop:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:12,color:'#666'}}>Mots en attente : {queue.length} • Total : {cards.length}</div>
        <div>
          <button className="btn btn-ghost" onClick={resetProgress} style={{marginRight:8}}>Reset</button>
          <button className="btn" onClick={nextCard}>Suivant</button>
        </div>
      </div>
    </section>
  );
}