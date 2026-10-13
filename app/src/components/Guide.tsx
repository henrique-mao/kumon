import { useEffect, useState } from 'react';
import { onCaption } from '../lib/speech';
import { Img } from './Tokens';

/** Juju, a coruja-guia: mostra a legenda do que está sendo narrado. */
export function Guide({ captions = true, fallback }: { captions?: boolean; fallback?: string }) {
  const [text, setText] = useState<string | null>(null);
  const [talking, setTalking] = useState(false);
  useEffect(() => onCaption((t, s) => { if (t !== null) setText(t); setTalking(s); }) as unknown as () => void, []);
  const shown = text ?? fallback;
  return (
    <div className="guide" aria-live="polite">
      <Img k="coruja" className={`mascot ${talking ? 'talking' : ''}`} alt="Juju, a coruja" />
      {captions && shown && <div className="bubble">{shown}</div>}
    </div>
  );
}
