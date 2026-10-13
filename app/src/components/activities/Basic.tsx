import { useEffect, useState } from 'react';
import { sfx } from '../../lib/sound';
import { speak } from '../../lib/speech';
import { TokenView } from '../Tokens';
import { tokenLabel, type ActivityProps } from './common';

/** Tocar e escolher (figuras, letras, números, formas...). */
export function Choose({ item, hintLevel, disabled, onCorrect, onWrong }: ActivityProps<'choose'>) {
  const [wrong, setWrong] = useState<Set<number>>(new Set());
  const [right, setRight] = useState<number | null>(null);
  useEffect(() => { setWrong(new Set()); setRight(null); }, [item]);
  const n = item.options.length;
  const cols = item.columns ?? (n <= 3 ? n : n === 4 ? 2 : 3);
  return (
    <div className="options" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, maxWidth: cols * 220 }}>
      {item.options.map((o, i) => (
        <button
          key={i}
          className={`option ${wrong.has(i) ? 'wrong' : ''} ${right === i ? 'right' : ''} ${hintLevel >= 3 && i === item.answer && right === null ? 'reveal' : ''}`}
          aria-label={tokenLabel(o.token)}
          disabled={disabled || wrong.has(i)}
          onClick={() => {
            if (i === item.answer) {
              setRight(i);
              onCorrect();
            } else {
              setWrong(new Set(wrong).add(i));
              if (o.say) speak([o.say]);
              onWrong({ expected: tokenLabel(item.options[item.answer].token), chosen: tokenLabel(o.token) });
            }
          }}
        >
          <TokenView token={o.token} />
        </button>
      ))}
    </div>
  );
}

/** Escrever a resposta numérica (como na folha de exercícios). */
export function NumberInput({ item, hintLevel, disabled, onCorrect, onWrong }: ActivityProps<'input'>) {
  const [val, setVal] = useState('');
  const [bad, setBad] = useState(false);
  useEffect(() => { setVal(''); setBad(false); }, [item]);
  const maxLen = Math.max(2, String(item.answer).length + 1);
  const press = (d: string) => { sfx.tap(); setBad(false); setVal((v) => (v.length < maxLen ? v + d : v)); };
  const submit = () => {
    if (!val) return;
    if (Number(val) === item.answer) onCorrect();
    else { setBad(true); onWrong({ expected: String(item.answer), chosen: val }); setTimeout(() => setVal(''), 500); }
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (disabled) return;
      if (/^\d$/.test(e.key)) press(e.key);
      else if (e.key === 'Backspace') setVal((v) => v.slice(0, -1));
      else if (e.key === 'Enter') submit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  return (
    <div className="row" style={{ justifyContent: 'center', gap: 24 }}>
      <div className={`answer-box ${bad ? 'wrong' : ''}`} aria-live="polite">
        {val || (hintLevel >= 3 ? <span style={{ color: 'var(--ok)', opacity: 0.6 }}>{item.answer}</span> : '?')}
      </div>
      <div className="numpad">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button key={d} className="btn" disabled={disabled} onClick={() => press(d)}>{d}</button>
        ))}
        <button className="btn" disabled={disabled} onClick={() => setVal((v) => v.slice(0, -1))} aria-label="apagar">⌫</button>
        <button className="btn" disabled={disabled} onClick={() => press('0')}>0</button>
        <button className="btn ok" disabled={disabled || !val} onClick={submit} aria-label="pronto">✓</button>
      </div>
    </div>
  );
}

/** Alfabeto móvel (Montessori): montar a palavra com letras ou sílabas. */
export function Build({ item, hintLevel, disabled, onCorrect, onWrong }: ActivityProps<'build'>) {
  const [slots, setSlots] = useState<(number | null)[]>([]);
  const [bad, setBad] = useState<Set<number>>(new Set());
  useEffect(() => { setSlots(item.solution.map(() => null)); setBad(new Set()); }, [item]);
  const used = new Set(slots.filter((s): s is number => s !== null));
  const nextSlot = slots.indexOf(null);
  const needed = nextSlot >= 0 ? item.solution[nextSlot] : null;
  const revealTile = hintLevel >= 3 && needed !== null ? item.tiles.findIndex((t, i) => t === needed && !used.has(i)) : -1;

  const place = (ti: number) => {
    if (nextSlot < 0) return;
    sfx.tap();
    speak([{ text: item.tiles[ti].toLowerCase(), lang: item.lang ?? 'pt', slow: true }]);
    const next = slots.slice();
    next[nextSlot] = ti;
    setSlots(next);
    setBad(new Set());
    if (!next.includes(null)) {
      const wrongIdx = new Set(next.map((t, i) => (item.tiles[t!] !== item.solution[i] ? i : -1)).filter((i) => i >= 0));
      if (wrongIdx.size === 0) onCorrect();
      else {
        setBad(wrongIdx);
        onWrong({ expected: item.solution.join(''), chosen: next.map((t) => item.tiles[t!]).join('') });
        setTimeout(() => setSlots((s) => s.map((t, i) => (wrongIdx.has(i) ? null : t))), 700);
      }
    }
  };

  return (
    <div className="activity" style={{ flex: 'none' }}>
      <div className="slots">
        {slots.map((t, i) => (
          <button
            key={i}
            className={`slot ${t !== null ? 'filled' : ''} ${bad.has(i) ? 'bad' : ''}`}
            disabled={disabled || t === null}
            onClick={() => { const s = slots.slice(); s[i] = null; setSlots(s); }}
            aria-label={t !== null ? `tirar ${item.tiles[t]}` : 'espaço vazio'}
          >
            {t !== null ? item.tiles[t] : hintLevel >= 2 ? <span style={{ opacity: 0.25 }}>{item.solution[i]}</span> : ''}
          </button>
        ))}
      </div>
      <div className="tiles">
        {item.tiles.map((t, i) => (
          <button key={i} className={`tile ${used.has(i) ? 'used' : ''} ${i === revealTile ? 'reveal' : ''}`} disabled={disabled || used.has(i)} onClick={() => place(i)}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
