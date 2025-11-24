import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

localStorage.removeItem('mockWords');
localStorage.clear(); // si besoin
window.location.reload();

createRoot(document.getElementById('root')).render(<App />);