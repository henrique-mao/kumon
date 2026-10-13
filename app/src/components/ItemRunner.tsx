import { useEffect, useRef, useState } from 'react';
import type { Item, Say } from '../curriculum/types';
import { sfx } from '../lib/sound';
import { speak, stopSpeaking } from '../lib/speech';
import { Build, Choose, NumberInput } from './activities/Basic';
import { BookActivity } from './activities/BookReader';
import type { ActivityProps, CorrectMeta } from './activities/common';
import { BaseTen, Speak, TenFrame, Trace } from './activities/Hands';
import { Robot, Sudoku } from './activities/Logic';
import { VisualView } from './Tokens';

export interface ItemResult {
  firstTry: boolean;
  timeSec: number;
  hints: number;
  scored: boolean;
  pcpm?: number;
  error?: { expected: string; chosen: string };
}

/** Elogio ao esforço e à estratégia (mentalidade de crescimento), nunca à "inteligência". */
const PRAISE = ['Isso!', 'Muito bem!', 'Você prestou atenção!', 'Mandou bem!', 'Você se esforçou!', 'Boa! Você pensou com calma.', 'Uau, que capricho!', 'Conseguiu!'];
const AFTER_RETRY = ['Você não desistiu!', 'Corrigiu sozinho, parabéns!', 'Tentou de novo e conseguiu!'];
const IDLE_MS = 25000;

export function ItemRunner({
  item, color, calm, diagnostic = false, onDone,
}: {
  item: Item;
  color: string;
  calm: boolean;
  /** Nivelamento: sem dicas e sem repetir — erro passa para o próximo com carinho. */
  diagnostic?: boolean;
  onDone: (r: ItemResult) => void;
}) {
  const [attempts, setAttempts] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [done, setDone] = useState(false);
  const start = useRef(performance.now());
  const firstError = useRef<{ expected: string; chosen: string } | undefined>(undefined);
  const idle = useRef<number | undefined>(undefined);

  // A legenda não pode entregar a resposta: no alfabeto móvel (a palavra a escrever) e nas escolhas
  // entre palavras escritas (senão a criança só compara letras, sem ler).
  const letters = (t: string) => t.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '');
  const secrets = new Set(
    item.kind === 'build' ? [letters(item.solution.join(''))]
      : item.kind === 'choose' ? item.options.flatMap((o) => (o.token.kind === 'text' ? [letters(o.token.text)] : []))
        : [],
  );
  secrets.delete('');
  const mask = (s: Say[]) => (secrets.size ? s.map((x) => (secrets.has(letters(x.text)) ? { ...x, hideCaption: true } : x)) : s);
  const say = (s: Say[]) => speak(mask(s));
  const poke = () => {
    clearTimeout(idle.current);
    idle.current = window.setTimeout(() => { if (!done) say(item.prompt); }, IDLE_MS);
  };

  useEffect(() => {
    setAttempts(0); setHintLevel(0); setHintsUsed(0); setDone(false);
    firstError.current = undefined;
    start.current = performance.now();
    // o tempo conta a partir do fim da instrução falada (a criança pode não ler)
    say(item.prompt).then(() => { start.current = performance.now(); });
    poke();
    return () => { clearTimeout(idle.current); stopSpeaking(); };
  }, [item]); // eslint-disable-line react-hooks/exhaustive-deps

  const finish = (firstTry: boolean, meta?: CorrectMeta) => {
    setDone(true);
    clearTimeout(idle.current);
    const timeSec = (performance.now() - start.current) / 1000;
    setTimeout(() => onDone({
      firstTry, timeSec, hints: hintsUsed, scored: meta?.scored ?? true, pcpm: meta?.pcpm, error: firstError.current,
    }), calm ? 500 : 1000);
  };

  const onCorrect = (meta?: CorrectMeta) => {
    poke();
    sfx.correct(calm);
    const pool = attempts === 0 ? PRAISE : AFTER_RETRY;
    say([{ text: pool[Math.floor(Math.random() * pool.length)] }]);
    finish(attempts === 0 && hintsUsed === 0, meta);
  };

  const onWrong = (detail?: { expected: string; chosen: string }) => {
    poke();
    sfx.tryAgain(calm);
    if (attempts === 0 && detail) firstError.current = detail;
    if (diagnostic) {
      say([{ text: 'Tudo bem! Vamos para a próxima.' }]);
      finish(false);
      return;
    }
    const a = attempts + 1;
    setAttempts(a);
    const lvl = Math.min(3, Math.max(hintLevel, a));
    setHintLevel(lvl);
    say(item.hints[lvl - 1].say);
  };

  const askHint = () => {
    poke();
    const lvl = Math.min(3, hintLevel + 1);
    setHintLevel(lvl);
    setHintsUsed((h) => h + 1);
    say(item.hints[lvl - 1].say);
  };

  const props = { hintLevel, disabled: done, color, onCorrect, onWrong };
  const hintVisual = hintLevel > 0 ? item.hints.slice(0, hintLevel).map((h) => h.visual).filter(Boolean).pop() : undefined;

  return (
    <div className="activity" onPointerDown={poke}>
      {item.visual && item.kind !== 'book' && <div className="visual"><VisualView v={item.visual} /></div>}
      {hintVisual && <div className="visual card" style={{ background: '#fffbe8' }}><VisualView v={hintVisual} /></div>}
      {render(item, props)}
      {item.kind !== 'book' && (
        <div className="actions no-print">
          <button className="btn small ghost" onClick={() => { poke(); say(item.prompt); }} aria-label="ouvir de novo">🔊 Ouvir de novo</button>
          {!diagnostic && hintLevel < 3 && !done && (
            <button className="btn small ghost" onClick={askHint} aria-label="pedir dica">💡 Dica</button>
          )}
        </div>
      )}
    </div>
  );
}

function render(item: Item, p: Omit<ActivityProps<'choose'>, 'item'>) {
  switch (item.kind) {
    case 'choose': return <Choose item={item} {...p} />;
    case 'input': return <NumberInput item={item} {...p} />;
    case 'build': return <Build item={item} {...p} />;
    case 'trace': return <Trace item={item} {...p} />;
    case 'speak': return <Speak item={item} {...p} />;
    case 'tenframe': return <TenFrame item={item} {...p} />;
    case 'baseten': return <BaseTen item={item} {...p} />;
    case 'sudoku': return <Sudoku item={item} {...p} />;
    case 'robot': return <Robot item={item} {...p} />;
    case 'book': return <BookActivity item={item} {...p} />;
  }
}
