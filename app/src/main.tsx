import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { loadNarrationIndex } from './lib/audioStore';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// PWA: funciona offline depois da primeira visita
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => undefined));
}
// índice das vozes gravadas pela família (IndexedDB)
loadNarrationIndex();
// algumas plataformas só carregam as vozes depois deste evento
window.speechSynthesis?.addEventListener?.('voiceschanged', () => undefined);
