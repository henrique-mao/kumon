import { useEffect, useState } from 'react';
import type { Ctx } from '../App';
import { SKILLS_BY_TRACK, stepsOf } from '../curriculum';
import { Guide } from '../components/Guide';
import { ParentGate } from '../components/ParentGate';
import { Img } from '../components/Tokens';
import { TRACK_INFO, TRACKS } from '../engine/model';
import { minutesOn, streak } from '../engine/stats';
import { speak } from '../lib/speech';

export function Home({ ctx }: { ctx: Ctx }) {
  const p = ctx.profile!;
  const [gate, setGate] = useState(false);
  const used = minutesOn(p);
  const overLimit = used >= p.settings.dailyLimitMin;
  const needsPlacement = TRACKS.some((t) => p.settings.enabled[t] && !p.tracks[t].placed);
  const st = streak(p);

  useEffect(() => {
    speak([{ text: overLimit ? `Você já praticou bastante hoje, ${p.name}! Que tal ler um livrinho ou brincar lá fora?` : `Oi, ${p.name}! Vamos subir mais um degrau?` }]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (gate) return <ParentGate onCancel={() => setGate(false)} onPass={() => ctx.go({ name: 'adultos' })} />;

  return (
    <div className="app">
      <div className="kid-top">
        <button className="avatar" style={{ border: 'none' }} onClick={() => ctx.go({ name: 'perfis' })} aria-label="trocar criança"><Img k={p.avatar} /></button>
        <strong style={{ fontSize: '1.3rem' }}>{p.name}</strong>
        <span className="spacer" />
        <span className="pill" title="dias seguidos"><Img k="foguinho" /> {st}</span>
        <span className="pill" title="estrelas"><Img k="estrela" /> {p.stars}</span>
        <button className="btn icon-btn small" onClick={() => setGate(true)} aria-label="área dos adultos"><Img k="cadeado" /></button>
      </div>
      <div className="screen">
        <Guide captions={p.settings.captions} />
        <div className="row" style={{ justifyContent: 'center' }}>
          {needsPlacement ? (
            <button className="btn huge primary" onClick={() => ctx.go({ name: 'nivelamento' })}>✨ Vamos nos conhecer!</button>
          ) : overLimit ? (
            <div className="card center" style={{ maxWidth: 520 }}>
              <div style={{ fontSize: '3rem' }}>🌙</div>
              <h2>Por hoje é só!</h2>
              <p>Você treinou {used} minutos hoje. Amanhã tem mais um degrau esperando.</p>
            </div>
          ) : (
            <button className="btn huge primary" onClick={() => ctx.go({ name: 'sessao' })}>
              <Img k="foguete" /> Lição de hoje
            </button>
          )}
        </div>

        <div className="tracks">
          {TRACKS.filter((t) => p.settings.enabled[t]).map((t) => {
            const info = TRACK_INFO[t];
            const steps = stepsOf(t);
            const pointer = p.tracks[t].pointer;
            const cur = SKILLS_BY_TRACK[t][pointer];
            return (
              <div key={t} className="track-card" style={{ background: info.color }}>
                <div className="title"><Img k={info.icon} /> {info.child}</div>
                <div className="stairs" aria-label={`degrau atual ${cur?.step}`}>
                  {steps.map((s, i) => {
                    const done = s.skills.every((k) => p.skills[k.id]?.status === 'dominado');
                    const here = s.step === cur?.step;
                    return (
                      <div key={s.step} className={`stair ${done ? 'done' : ''} ${here ? 'here' : ''}`} style={{ height: `${30 + (i / Math.max(1, steps.length - 1)) * 70}%` }}>
                        {here && <Img k="pegada" />}
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontWeight: 700, opacity: 0.95 }}>Degrau {cur?.step}</div>
              </div>
            );
          })}
        </div>

        <div className="row" style={{ justifyContent: 'center' }}>
          <button className="btn" onClick={() => ctx.go({ name: 'biblioteca' })}><Img k="livro" /> Livros</button>
          <button className="btn" onClick={() => ctx.go({ name: 'album' })}><Img k="medalha" /> Álbum</button>
        </div>
      </div>
    </div>
  );
}
