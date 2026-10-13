import { useEffect, useRef, useState } from 'react';
import { sfx } from '../../lib/sound';
import { canListen, listen, matchScore, speak } from '../../lib/speech';
import { BaseTenView } from '../Tokens';
import type { ActivityProps } from './common';

const S = 400; // tamanho interno do canvas
const FONT = '"Andika", "Century Gothic", "Avenir Next", "Nunito", sans-serif';

function templatePath(path: NonNullable<ActivityProps<'trace'>['item']['path']>): Path2D {
  const p = new Path2D();
  switch (path) {
    case 'reta': p.moveTo(60, 200); p.lineTo(340, 200); break;
    case 'curva': p.moveTo(70, 280); p.quadraticCurveTo(200, 40, 330, 280); break;
    case 'zigue': p.moveTo(50, 260); [110, 170, 230, 290, 350].forEach((x, i) => p.lineTo(x, i % 2 ? 260 : 140)); break;
    case 'onda': p.moveTo(40, 200); for (let x = 40; x <= 360; x += 4) p.lineTo(x, 200 - 70 * Math.sin(((x - 40) / 320) * Math.PI * 3)); break;
    case 'laco': for (let t = 0; t <= Math.PI * 2 * 3; t += 0.05) { const x = 70 + t * 14 + 30 * Math.cos(t + Math.PI); const y = 200 - 60 * Math.sin(t); if (t === 0) p.moveTo(x, y); else p.lineTo(x, y); } break;
  }
  return p;
}

function drawTemplate(ctx: CanvasRenderingContext2D, item: ActivityProps<'trace'>['item'], mode: 'mask' | 'guide' | 'strong', width: number) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (item.glyph) {
    const size = item.glyph.length > 1 ? 200 : 300;
    ctx.font = `700 ${size}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (mode === 'mask') {
      ctx.lineWidth = width;
      ctx.strokeStyle = '#000';
      ctx.fillStyle = '#000';
      ctx.fillText(item.glyph, S / 2, S / 2 + 10);
      ctx.strokeText(item.glyph, S / 2, S / 2 + 10);
    } else {
      ctx.fillStyle = mode === 'strong' ? 'rgba(47,179,109,0.35)' : '#efe7da';
      ctx.fillText(item.glyph, S / 2, S / 2 + 10);
      ctx.setLineDash([10, 10]);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#b9a98f';
      ctx.strokeText(item.glyph, S / 2, S / 2 + 10);
    }
  } else if (item.path) {
    const p = templatePath(item.path);
    if (mode === 'mask') {
      ctx.lineWidth = width;
      ctx.strokeStyle = '#000';
      ctx.stroke(p);
    } else {
      ctx.lineWidth = 34;
      ctx.strokeStyle = mode === 'strong' ? 'rgba(47,179,109,0.35)' : '#efe7da';
      ctx.stroke(p);
      ctx.setLineDash([12, 12]);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#b9a98f';
      ctx.stroke(p);
    }
  }
  ctx.restore();
}

function alphaPixels(draw: (c: CanvasRenderingContext2D) => void): Uint8ClampedArray {
  const c = document.createElement('canvas');
  c.width = S; c.height = S;
  const ctx = c.getContext('2d')!;
  draw(ctx);
  return ctx.getImageData(0, 0, S, S).data;
}

/** Traçado com o dedo (letras de lixa / pré-escrita). Avalia cobertura e precisão. */
export function Trace({ item, hintLevel, disabled, color, onCorrect, onWrong }: ActivityProps<'trace'>) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<[number, number][][]>([]);
  const drawing = useRef(false);

  const redraw = () => {
    const ctx = canvas.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, S, S);
    drawTemplate(ctx, item, hintLevel >= 2 ? 'strong' : 'guide', 0);
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 22; ctx.strokeStyle = color;
    for (const s of strokes.current) {
      ctx.beginPath();
      s.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      if (s.length === 1) ctx.lineTo(s[0][0] + 0.1, s[0][1]);
      ctx.stroke();
    }
    ctx.restore();
  };
  useEffect(() => { strokes.current = []; redraw(); }, [item]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { redraw(); }, [hintLevel, color]); // eslint-disable-line react-hooks/exhaustive-deps

  const pos = (e: React.PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * S, ((e.clientY - r.top) / r.height) * S] as [number, number];
  };

  const check = () => {
    const pts = strokes.current.flat();
    if (pts.length < 5) return;
    const mask = alphaPixels((c) => drawTemplate(c, item, 'mask', item.glyph ? 8 : 34));
    const wide = alphaPixels((c) => drawTemplate(c, item, 'mask', item.glyph ? 60 : 80));
    const kid = alphaPixels((c) => {
      c.lineCap = 'round'; c.lineJoin = 'round'; c.lineWidth = item.glyph ? 46 : 60; c.strokeStyle = '#000';
      for (const s of strokes.current) { c.beginPath(); s.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.stroke(); }
    });
    let tpl = 0, cov = 0;
    for (let i = 3; i < mask.length; i += 4 * 5) if (mask[i] > 0) { tpl++; if (kid[i] > 0) cov++; }
    let inside = 0;
    for (const [x, y] of pts) {
      const xi = Math.round(x), yi = Math.round(y);
      if (xi >= 0 && yi >= 0 && xi < S && yi < S && wide[(yi * S + xi) * 4 + 3] > 0) inside++;
    }
    const coverage = tpl ? cov / tpl : 0;
    const precision = inside / pts.length;
    if (coverage >= 0.55 && precision >= 0.6) onCorrect();
    else {
      onWrong();
      strokes.current = [];
      redraw();
    }
  };

  return (
    <div className="activity" style={{ flex: 'none' }}>
      <div className="trace-wrap">
        <canvas
          ref={canvas}
          width={S}
          height={S}
          aria-label="área de traçado"
          onPointerDown={(e) => { if (disabled) return; (e.target as Element).setPointerCapture(e.pointerId); drawing.current = true; strokes.current.push([pos(e)]); redraw(); }}
          onPointerMove={(e) => { if (!drawing.current) return; strokes.current[strokes.current.length - 1].push(pos(e)); redraw(); }}
          onPointerUp={() => { drawing.current = false; }}
          onPointerCancel={() => { drawing.current = false; }}
        />
      </div>
      <div className="actions">
        <button className="btn" disabled={disabled} onClick={() => { strokes.current = []; redraw(); }}>Apagar</button>
        <button className="btn ok" disabled={disabled} onClick={check}>Pronto!</button>
      </div>
    </div>
  );
}

/** Falar em voz alta (shadowing / leitura oral). Nunca penaliza a criança só pela voz. */
export function Speak({ item, disabled, onCorrect }: ActivityProps<'speak'>) {
  const [state, setState] = useState<'idle' | 'listening' | 'retry'>('idle');
  const [tries, setTries] = useState(0);
  useEffect(() => { setState('idle'); setTries(0); }, [item]);
  const can = canListen();

  const go = async () => {
    setState('listening');
    const t0 = performance.now();
    const { result } = listen(item.lang);
    const heard = await result;
    const secs = (performance.now() - t0) / 1000;
    if (!heard) {
      // reconhecimento falhou (permissão/ruído): aceita, sem contar para a acurácia
      onCorrect({ scored: false });
      return;
    }
    const m = matchScore(item.expect, heard);
    if (m.score >= 0.6) {
      const words = m.total;
      onCorrect({ scored: true, pcpm: words >= 4 ? Math.round((m.matched / Math.max(secs - 0.8, 1)) * 60) : undefined });
    } else if (tries >= 1) {
      onCorrect({ scored: false });
    } else {
      sfx.tryAgain();
      setTries(tries + 1);
      setState('retry');
      speak([{ text: 'Quase! Escute e tente de novo:' }, { text: item.expect, lang: item.lang, slow: true }]);
    }
  };

  return (
    <div className="activity" style={{ flex: 'none' }}>
      <button className="btn ghost" onClick={() => speak([{ text: item.expect, lang: item.lang, slow: true }])} disabled={disabled}>
        🔊 Ouvir a frase
      </button>
      {can ? (
        <button className="btn huge primary" disabled={disabled || state === 'listening'} onClick={go} aria-label="falar">
          {state === 'listening' ? '👂 Estou ouvindo…' : '🎤 Falar'}
        </button>
      ) : (
        <button className="btn huge primary" disabled={disabled} onClick={() => onCorrect({ scored: false })}>
          🗣️ Eu falei!
        </button>
      )}
      {!can && <p className="muted small">Fale em voz alta e toque no botão. (Este navegador não tem reconhecimento de voz.)</p>}
    </div>
  );
}

/** Quadro de dez interativo. */
export function TenFrame({ item, hintLevel, disabled, onCorrect, onWrong }: ActivityProps<'tenframe'>) {
  const [on, setOn] = useState<boolean[]>([]);
  useEffect(() => setOn(Array(item.total).fill(false)), [item]);
  const count = on.filter(Boolean).length;
  return (
    <div className="activity" style={{ flex: 'none' }}>
      <div className="row" style={{ justifyContent: 'center' }}>
        {Array.from({ length: item.total / 10 }, (_, f) => (
          <div key={f} className="tenframe">
            {Array.from({ length: 10 }, (_, i) => {
              const k = f * 10 + i;
              return (
                <button key={i} className="cell" disabled={disabled} aria-label={`casa ${k + 1}`}
                  style={hintLevel >= 3 && k < item.target && !on[k] ? { outline: '3px dashed var(--ok)' } : undefined}
                  onClick={() => { sfx.tap(); const n = on.slice(); n[k] = !n[k]; setOn(n); }}>
                  {on[k] && <div className="ball" />}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {hintLevel >= 1 && <div className="pill">{count}</div>}
      <button className="btn ok" disabled={disabled} onClick={() => (count === item.target ? onCorrect() : onWrong({ expected: String(item.target), chosen: String(count) }))}>Pronto!</button>
    </div>
  );
}

/** Material Dourado: montar o número com placas (100), barras (10) e cubinhos (1). */
export function BaseTen({ item, hintLevel, disabled, onCorrect, onWrong }: ActivityProps<'baseten'>) {
  const [h, setH] = useState(0);
  const [t, setT] = useState(0);
  const [o, setO] = useState(0);
  useEffect(() => { setH(0); setT(0); setO(0); }, [item]);
  const value = h * 100 + t * 10 + o;
  const add = (f: (n: number) => void, n: number, max: number) => { sfx.tap(); if (n < max) f(n + 1); };
  const tH = Math.floor(item.target / 100), tT = Math.floor((item.target % 100) / 10), tO = item.target % 10;
  return (
    <div className="activity" style={{ flex: 'none' }}>
      <div className="card" style={{ minWidth: 300, minHeight: 170 }}>
        <BaseTenView hundreds={h} tens={t} ones={o} big />
      </div>
      {hintLevel >= 2 && <p className="pill">{tH ? `${tH} placa(s), ` : ''}{tT} barra(s) e {tO} cubinho(s)</p>}
      <div className="actions">
        {item.target >= 100 && <button className="btn" disabled={disabled} onClick={() => add(setH, h, 9)}><span className="bt-plate" style={{ width: 30, height: 30 }} /> +100</button>}
        <button className="btn" disabled={disabled} onClick={() => add(setT, t, 15)}><span className="bt-rod" style={{ height: 40 }} /> +10</button>
        <button className="btn" disabled={disabled} onClick={() => add(setO, o, 19)}><span className="bt-cube" /> +1</button>
        <button className="btn ghost" disabled={disabled} onClick={() => { setH(0); setT(0); setO(0); }}>Apagar</button>
      </div>
      <button className="btn ok" disabled={disabled || value === 0} onClick={() => (value === item.target ? onCorrect() : onWrong({ expected: String(item.target), chosen: String(value) }))}>Pronto!</button>
    </div>
  );
}
