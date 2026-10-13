import { useMemo, useState } from 'react';
import type { Ctx } from '../App';
import { checkpoints, SKILLS_BY_TRACK } from '../curriculum';
import type { Item, TrackId } from '../curriculum/types';
import { Guide } from '../components/Guide';
import { ItemRunner } from '../components/ItemRunner';
import { Img } from '../components/Tokens';
import { applyPlacement } from '../engine/mastery';
import { today, TRACK_INFO, TRACKS } from '../engine/model';
import { placementItem, placementPointer, recordPlacement, startPlacement, type PlacementState } from '../engine/placement';
import { createRng } from '../lib/rng';
import { speak } from '../lib/speech';

/** Nivelamento lúdico: poucos itens por trilha, sem dicas, para achar o ponto de partida confortável. */
export function Placement({ ctx }: { ctx: Ctx }) {
  const p = ctx.profile!;
  const pending = useMemo(() => TRACKS.filter((t) => p.settings.enabled[t] && !p.tracks[t].placed), []); // eslint-disable-line react-hooks/exhaustive-deps
  const rng = useMemo(() => createRng(), []);
  const [ti, setTi] = useState(-1);
  const [st, setSt] = useState<PlacementState | null>(null);
  const [cur, setCur] = useState<{ item: Item; n: number } | null>(null);

  const startTrack = (i: number) => {
    if (i >= pending.length) {
      speak([{ text: `Pronto, ${p.name}! Já sei por onde começar. Vamos aprender!` }]);
      ctx.go({ name: 'inicio' });
      return;
    }
    const t = pending[i];
    const s = startPlacement(checkpoints(t), p.age);
    setTi(i);
    setSt(s);
    setCur({ item: placementItem(s, SKILLS_BY_TRACK[t], rng).item, n: 0 });
  };

  const finishTrack = (t: TrackId, s: PlacementState) => {
    ctx.update((pp) => { applyPlacement(pp, SKILLS_BY_TRACK[t], placementPointer(s), today()); });
    startTrack(ti + 1);
  };

  if (ti < 0) {
    return (
      <div className="app">
        <div className="screen center">
          <Img k="coruja" size={130} />
          <h1 style={{ fontSize: '2rem' }}>{p.name}, vamos brincar um pouquinho?</h1>
          <p style={{ fontSize: '1.2rem' }}>Quero conhecer você para escolher as atividades certinhas.</p>
          <button className="btn huge primary" onClick={() => { speak([{ text: 'Vamos lá! Faça do seu jeito, sem pressa.' }]); startTrack(0); }}>Vamos!</button>
          <button className="btn ghost small" onClick={() => {
            ctx.update((pp) => { for (const t of pending) applyPlacement(pp, SKILLS_BY_TRACK[t], 0, today()); });
            ctx.go({ name: 'inicio' });
          }}>Adulto: pular e começar do início</button>
        </div>
      </div>
    );
  }

  const track = pending[ti];
  const info = TRACK_INFO[track];
  return (
    <div className="app">
      <div className="screen">
        <div className="row">
          <span className="track-tag" style={{ background: info.color }}><Img k={info.icon} /> {info.child}</span>
          <span className="muted">Conhecendo você: {ti + 1} de {pending.length}</span>
          <span className="spacer" />
          <button className="btn small ghost" onClick={() => st && finishTrack(track, { ...st, done: true })}>Pular</button>
        </div>
        <Guide captions={p.settings.captions} />
        {cur && st && (
          <ItemRunner
            key={`${track}-${cur.n}`}
            item={cur.item}
            color={info.color}
            calm={p.settings.calm}
            diagnostic
            onDone={(r) => {
              const next = recordPlacement(st, r.firstTry);
              if (next.done) finishTrack(track, next);
              else {
                setSt(next);
                setCur({ item: placementItem(next, SKILLS_BY_TRACK[track], rng).item, n: cur.n + 1 });
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
