import React, { useEffect, useState, useRef } from 'react';
import WordTrainer from './WordTrainer';

const WORD_RE = /[A-Za-zÀ-ÖØ-öø-ÿ']+/g;

function computeFrequencies(words) {
  const map = {};
  (words || []).forEach(w => {
    const k = String(w).toLowerCase();
    if (!k) return;
    map[k] = (map[k] || 0) + 1;
  });
  return Object.keys(map).map(k => ({ word: k, count: map[k] })).sort((a, b) => b.count - a.count);
}

const DEFAULT_PHRASES = [
  "Le chien va à l'école",
  "J'aime le chien",
  "Mon ami frappe le chien",
  "Mon ami m'a donné des bonbons"
].join('\n');

export default function Dashboard({ role }) {
  const [text, setText] = useState(DEFAULT_PHRASES);
  const [phrases, setPhrases] = useState([]);
  const [freq, setFreq] = useState([]);
  const [showTrainer, setShowTrainer] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState(() => ({})); // { idx: true }
  const speakQueueRef = useRef(null);
  const cancelRef = useRef(false);

  useEffect(() => {
    analyzeText(text);
    return () => { stopSpeaking(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function analyzeText(t) {
    const lines = (t || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    setPhrases(lines);
    // extract all words
    const words = lines.flatMap(l => (l.match(WORD_RE) || []).map(w => w.replace(/’/g, "'")));
    const frequencies = computeFrequencies(words);
    setFreq(frequencies);
  }

  function handleAnalyzeClick() {
    analyzeText(text);
    // small visual feedback
    const prev = document.querySelector('.toast');
    if (prev) prev.remove();
    const toast = document.createElement('div');
    toast.className = 'toast pop';
    toast.textContent = 'Phrases analysées ✅';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1400);
  }

  // SPEAK helpers
  function stopSpeaking() {
    cancelRef.current = true;
    if (speakQueueRef.current) { clearTimeout(speakQueueRef.current); speakQueueRef.current = null; }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    setPlaying(false);
  }

  function speakOnce(text) {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) { resolve(); return; }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'fr-FR';
      u.rate = 0.95;
      cancelRef.current = false;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      speechSynthesis.cancel(); // stop any existing
      speechSynthesis.speak(u);
    });
  }

  async function playSequence(list = [], gapMs = 600) {
    stopSpeaking();
    if (!list.length) return;
    // allow playback after stopSpeaking() set cancel flag
    cancelRef.current = false;
    setPlaying(true);
    for (let i = 0; i < list.length; i++) {
      if (cancelRef.current) break;
      await speakOnce(list[i]);
      if (cancelRef.current) break;
      // small gap between items
      await new Promise(r => { speakQueueRef.current = setTimeout(r, gapMs); });
    }
    stopSpeaking();
  }

  function playTopWords(n = 5, gapMs = 650) {
    const top = freq.slice(0, n).map(f => f.word);
    if (!top.length) return;
    playSequence(top, gapMs);
  }

  function playAllPhrases() {
    if (!phrases.length) return;
    playSequence(phrases, 850);
  }

  function toggleSelect(idx) {
    setSelected(s => ({ ...s, [idx]: !s[idx] }));
  }

  function playSelectedPhrases() {
    const sel = phrases.filter((p, i) => selected[i]);
    if (!sel.length) return alert('Aucune phrase sélectionnée');
    playSequence(sel, 700);
  }

  function speakWord(word) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = 'fr-FR';
    u.rate = 0.95;
    speechSynthesis.speak(u);
  }

  function startTrainer() {
    const initialWords = freq.flatMap(f => Array(Math.max(1, f.count)).fill(f.word));
    if (!initialWords.length) return alert("Aucun mot à entraîner — analyse des phrases d'abord.");
    setShowTrainer(true);
    // small delay to ensure trainer mounts
    setTimeout(() => {
      // nothing else
    }, 80);
  }

  function exportFrequencies() {
    const blob = new Blob([JSON.stringify({ phrases, frequencies: freq }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nebras_frequencies_today.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section>
      {!showTrainer && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2>Phrases détectées aujourd'hui par votre Smart Pen</h2>
              <small style={{ color: '#666' }}>Collez ou écrivez vos phrases ci‑dessous puis cliquez "Analyser"</small>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" onClick={() => { setText(DEFAULT_PHRASES); handleAnalyzeClick(); }}>Charger exemple</button>
              <button className="btn btn-ghost" onClick={() => { setText(''); setPhrases([]); setFreq([]); }}>Effacer</button>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            style={{ width: '100%', marginTop: 12, padding: 12, borderRadius: 10, border: '1px solid rgba(10,25,45,0.06)', fontSize: 14 }}
          />

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn btn-primary" onClick={handleAnalyzeClick}>Analyser</button>
            <button className="btn" onClick={() => playTopWords(6)}>Lire mots fréquents</button>
            <button className="btn" onClick={() => playTopWords(12)}>Lire top 12</button>
            <button className="btn btn-ghost" onClick={startTrainer}>Lancer le jeu</button>
            <button className="btn btn-ghost" onClick={exportFrequencies} disabled={!freq.length}>Exporter</button>
            <button className="btn" onClick={() => { if (playing) stopSpeaking(); else playAllPhrases(); }}>{playing ? 'Arrêter' : 'Lire toutes les phrases'}</button>
          </div>

          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>
            <div>
              <h3 style={{ marginTop: 0 }}>Phrases</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {phrases.length === 0 && <div style={{ color: '#888' }}>Aucune phrase — utilisez l'exemple ou saisissez les phrases.</div>}
                {phrases.map((p, i) => (
                  <div key={i} className="card" style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
                    <input type="checkbox" checked={!!selected[i]} onChange={() => toggleSelect(i)} />
                    <div style={{ width: 36, textAlign: 'center', color: '#666', fontWeight: 700 }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>{p}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn" onClick={() => playSequence([p], 0)}>🔊</button>
                      <button className="btn" onClick={() => { const words = (p.match(WORD_RE) || []).map(w => w.replace(/’/g, "'")); setFreq(computeFrequencies(words)); }}>Afficher mots</button>
                    </div>
                  </div>
                ))}

                {phrases.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button className="btn btn-primary" onClick={playSelectedPhrases}>Lire sélection</button>
                    <button className="btn btn-ghost" onClick={() => setSelected({})}>Tout désélectionner</button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 style={{ marginTop: 0 }}>Top mots</h3>
              <ul className="word-list" style={{ maxHeight: 360, overflow: 'auto' }}>
                {freq.length === 0 && <li style={{ color: '#888', padding: 8 }}>Aucun mot calculé</li>}
                {freq.map((w, i) => (
                  <li key={w.word}>
                    <div className="rank">{i + 1}</div>
                    <div className="word-text" style={{ marginLeft: 8 }}>{w.word}</div>
                    <div className="word-count">{w.count}</div>
                    <button style={{ marginLeft: 8 }} className="btn" onClick={() => speakWord(w.word)}>🔊</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {showTrainer ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2>Trainer — Nebras</h2>
            <div>
              <button className="btn btn-ghost" onClick={() => setShowTrainer(false)}>Retour</button>
            </div>
          </div>
          <WordTrainer initialWords={freq.flatMap(f => Array(Math.max(1, f.count)).fill(f.word))} />
        </div>
      ) : null}
    </section>
  );
}