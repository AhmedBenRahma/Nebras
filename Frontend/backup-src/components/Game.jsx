import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

const API = (path) => `http://localhost:3000${path}`;

export default function Game({ role }) {
  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState('flash');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(API('/api/frequencies'));
        const data = await res.json();
        setWords(data.map(d => d.word).slice(0, 80));
      } catch (e) { /* ignore */ }
    }
    load();
    const id = setInterval(load, 4000);
    return () => clearInterval(id);
  }, []);

  if (!words.length) return <div className="card">En attente de mots depuis SmartPen...</div>;
  const current = words[index % words.length];

  function correctHit() {
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.4 } });
    setIndex(i => i + 1);
  }

  return (
    <section className="game card">
      <h2>Learning Game</h2>
      <div className="mode-select">
        <button onClick={()=>setMode('flash')} className={mode==='flash'?'active':''}>Flash</button>
        <button onClick={()=>setMode('quiz')} className={mode==='quiz'?'active':''}>Quiz</button>
      </div>

      {mode==='flash' && (
        <div className="flashcard">
          <div className="card">
            <h3>{current}</h3>
            <div className="game-controls">
              <button onClick={() => speak(current)}>🔊 Hear</button>
              <button onClick={correctHit}>I got it ✅</button>
              <button onClick={()=>setIndex(i=>i+1)}>Skip</button>
            </div>
          </div>
        </div>
      )}

      {mode==='quiz' && <Quiz word={current} onCorrect={correctHit} onNext={()=>setIndex(i=>i+1)} />}
    </section>
  );
}

function speak(text){
  if(!('speechSynthesis' in window)) return;
  const u=new SpeechSynthesisUtterance(text);u.lang='fr-FR';u.rate=0.95;speechSynthesis.cancel();speechSynthesis.speak(u);
}

function Quiz({ word, onCorrect, onNext }) {
  const [ans,setAns]=useState(''); const [fb,setFb]=useState(null);
  function submit(){
    if(ans.trim().toLowerCase()===word.toLowerCase()){ setFb('ok'); onCorrect(); }
    else { setFb('no'); }
    setTimeout(()=>{ setFb(null); setAns(''); onNext(); },900);
  }
  return (
    <div className="card" style={{padding:18,textAlign:'center'}}>
      <p>Écoute puis écris le mot :</p>
      <button onClick={()=>speak(word)}>🔊 Play</button>
      <div style={{marginTop:12}}>
        <input value={ans} onChange={(e)=>setAns(e.target.value)} placeholder="Écris ici" style={{padding:8,borderRadius:8}} />
        <button onClick={submit} style={{marginLeft:8}}>Submit</button>
      </div>
      {fb==='ok' && <div style={{color:'#8ef5b1',marginTop:8}}>Bravo 🎉</div>}
      {fb==='no' && <div style={{color:'#ffd6d6',marginTop:8}}>Presque</div>}
    </div>
  );
}