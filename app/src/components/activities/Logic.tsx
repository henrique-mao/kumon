import { useEffect, useRef, useState } from 'react';
import type { Dir } from '../../curriculum/types';
import { sfx } from '../../lib/sound';
import { Img } from '../Tokens';
import type { ActivityProps } from './common';

/** Sudoku 4x4 com figuras: cada figura aparece uma vez por linha, coluna e quadrado. */
export function Sudoku({ item, hintLevel, disabled, onCorrect, onWrong }: ActivityProps<'sudoku'>) {
  const [cells, setCells] = useState<(number | null)[]>(item.grid);
  const [sel, setSel] = useState<number | null>(null);
  const [bad, setBad] = useState<Set<number>>(new Set());
  useEffect(() => { setCells(item.grid); setSel(item.grid.indexOf(null)); setBad(new Set()); }, [item]);
  const reveal = hintLevel >= 3 ? cells.findIndex((c, i) => c === null && item.grid[i] === null) : -1;

  const put = (sym: number) => {
    if (sel === null || item.grid[sel] !== null) return;
    sfx.tap();
    const next = cells.slice();
    next[sel] = sym;
    setCells(next);
    setBad(new Set());
    const empty = next.indexOf(null);
    setSel(empty >= 0 ? empty : null);
    if (empty < 0) {
      const wrong = new Set(next.map((c, i) => (c !== item.solution[i] ? i : -1)).filter((i) => i >= 0));
      if (!wrong.size) onCorrect();
      else {
        setBad(wrong);
        onWrong();
        setTimeout(() => { setCells((cs) => cs.map((c, i) => (wrong.has(i) ? null : c))); setSel([...wrong][0]); }, 700);
      }
    }
  };

  return (
    <div className="activity" style={{ flex: 'none' }}>
      <div className="sudoku">
        {cells.map((c, i) => (
          <button key={i} disabled={disabled || item.grid[i] !== null}
            className={`cell ${item.grid[i] !== null ? 'given' : ''} ${sel === i ? 'sel' : ''} ${bad.has(i) ? 'bad' : ''}`}
            style={i === reveal ? { outline: '4px dashed var(--ok)' } : undefined}
            onClick={() => setSel(i)} aria-label={`casa ${i + 1}`}>
            {c !== null ? <Img k={item.symbols[c]} /> : i === reveal ? <span style={{ opacity: 0.35 }}><Img k={item.symbols[item.solution[i]]} /></span> : null}
          </button>
        ))}
      </div>
      <div className="actions">
        {item.symbols.map((s, k) => (
          <button key={k} className="btn" disabled={disabled || sel === null} onClick={() => put(k)} aria-label={s}>
            <Img k={s} />
          </button>
        ))}
      </div>
    </div>
  );
}

const DELTA: Record<Dir, [number, number]> = { cima: [0, -1], baixo: [0, 1], esquerda: [-1, 0], direita: [1, 0] };
const ARROW: Record<Dir, string> = { cima: '↑', baixo: '↓', esquerda: '←', direita: '→' };
const ORDER: Dir[] = ['cima', 'direita', 'baixo', 'esquerda'];

function solve(item: ActivityProps<'robot'>['item']): Dir[] {
  const key = (x: number, y: number) => `${x},${y}`;
  const walls = new Set(item.walls.map(([x, y]) => key(x, y)));
  const prev = new Map<string, [string, Dir]>();
  const q: [number, number][] = [item.start];
  const seen = new Set([key(...item.start)]);
  while (q.length) {
    const [x, y] = q.shift()!;
    if (x === item.goal[0] && y === item.goal[1]) break;
    for (const d of ORDER) {
      const nx = x + DELTA[d][0], ny = y + DELTA[d][1];
      const k = key(nx, ny);
      if (nx < 0 || ny < 0 || nx >= item.size || ny >= item.size || walls.has(k) || seen.has(k)) continue;
      seen.add(k); prev.set(k, [key(x, y), d]); q.push([nx, ny]);
    }
  }
  const path: Dir[] = [];
  let cur = key(...item.goal);
  while (prev.has(cur)) { const [p, d] = prev.get(cur)!; path.unshift(d); cur = p; }
  return path;
}

/** Robô programável: sequência de setas (pensamento computacional desplugado) e depuração. */
export function Robot({ item, hintLevel, disabled, onCorrect, onWrong }: ActivityProps<'robot'>) {
  const debug = !!item.program;
  const [prog, setProg] = useState<Dir[]>(item.program ?? []);
  const [bot, setBot] = useState<[number, number]>(item.start);
  const [running, setRunning] = useState(-1);
  const [crash, setCrash] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => { setProg(item.program ?? []); setBot(item.start); setRunning(-1); setCrash(false); return () => clearTimeout(timer.current); }, [item]);
  const solution = solve(item);
  const wrongIdx = debug ? prog.findIndex((d, i) => d !== solution[i]) : -1;
  const walls = new Set(item.walls.map(([x, y]) => `${x},${y}`));
  const nextHint = !debug && hintLevel >= 3 ? solution[prog.length] : undefined;

  const run = () => {
    if (!prog.length) return;
    let pos: [number, number] = item.start;
    setCrash(false);
    setBot(pos);
    const step = (i: number) => {
      if (i >= prog.length) {
        setRunning(-1);
        if (pos[0] === item.goal[0] && pos[1] === item.goal[1]) onCorrect();
        else { onWrong(); timer.current = window.setTimeout(() => { setBot(item.start); if (!debug) setProg([]); }, 900); }
        return;
      }
      setRunning(i);
      const [dx, dy] = DELTA[prog[i]];
      const n: [number, number] = [pos[0] + dx, pos[1] + dy];
      if (n[0] < 0 || n[1] < 0 || n[0] >= item.size || n[1] >= item.size || walls.has(`${n[0]},${n[1]}`)) {
        setCrash(true);
        sfx.tryAgain();
        setRunning(-1);
        onWrong();
        timer.current = window.setTimeout(() => { setBot(item.start); setCrash(false); if (!debug) setProg([]); }, 900);
        return;
      }
      pos = n;
      setBot(n);
      sfx.tap();
      timer.current = window.setTimeout(() => step(i + 1), 450);
    };
    timer.current = window.setTimeout(() => step(0), 250);
  };

  const busy = disabled || running >= 0;
  return (
    <div className="activity" style={{ flex: 'none' }}>
      <div className="robot-grid" style={{ gridTemplateColumns: `repeat(${item.size}, auto)` }}>
        {Array.from({ length: item.size * item.size }, (_, i) => {
          const x = i % item.size, y = Math.floor(i / item.size);
          return (
            <div key={i} className="cell" style={walls.has(`${x},${y}`) ? { background: '#d9c7a7' } : undefined}>
              {walls.has(`${x},${y}`) && <Img k="tijolo" />}
              {x === item.goal[0] && y === item.goal[1] && <Img k="estrela" />}
              {x === bot[0] && y === bot[1] && <Img k="robo" className="bot" alt="robô" />}
              {crash && x === bot[0] && y === bot[1] && <span style={{ position: 'absolute', fontSize: 28 }}>💥</span>}
            </div>
          );
        })}
      </div>
      <div className="program" aria-label="programa do robô">
        {prog.map((d, i) => (
          <button key={i} className={`arrow ${running === i ? 'cur' : ''} ${debug && hintLevel >= 2 && i === wrongIdx ? 'bad' : ''}`}
            disabled={busy}
            onClick={() => {
              if (debug) { const p = prog.slice(); p[i] = ORDER[(ORDER.indexOf(d) + 1) % 4]; setProg(p); sfx.tap(); }
              else setProg(prog.filter((_, j) => j !== i));
            }}
            aria-label={d}>
            {ARROW[d]}
          </button>
        ))}
        {!prog.length && <span className="muted" style={{ alignSelf: 'center' }}>Toque nas setas ↓</span>}
      </div>
      {!debug && (
        <div className="actions">
          {ORDER.map((d) => (
            <button key={d} className="arrow" style={{ width: 72, height: 72, ...(nextHint === d ? { outline: '4px dashed var(--ok)' } : {}) }}
              disabled={busy || prog.length >= item.maxSteps + 3} onClick={() => { sfx.tap(); setProg([...prog, d]); }} aria-label={d}>
              {ARROW[d]}
            </button>
          ))}
        </div>
      )}
      <div className="actions">
        {!debug && <button className="btn ghost" disabled={busy || !prog.length} onClick={() => setProg(prog.slice(0, -1))}>⌫ Apagar</button>}
        <button className="btn ok" disabled={busy || !prog.length} onClick={run}>▶ Andar!</button>
      </div>
    </div>
  );
}
