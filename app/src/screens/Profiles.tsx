import { useState } from 'react';
import type { Ctx } from '../App';
import { ParentGate } from '../components/ParentGate';
import { Img } from '../components/Tokens';
import { speak } from '../lib/speech';

export function Profiles({ ctx }: { ctx: Ctx }) {
  const [gate, setGate] = useState<null | 'novo' | 'adultos'>(null);
  const { profiles } = ctx.data;
  if (gate) return <ParentGate onCancel={() => setGate(null)} onPass={() => ctx.go(gate === 'novo' ? { name: 'novo' } : { name: 'adultos' })} />;

  if (!profiles.length) {
    return (
      <div className="app">
        <div className="screen center">
          <Img k="coruja" size={140} alt="Juju, a coruja" />
          <h1 style={{ fontSize: '2.6rem' }}>Degrau</h1>
          <p style={{ fontSize: '1.3rem', maxWidth: 560 }}>
            Ler, contar, pensar e brincar em inglês — <strong>um passinho por dia</strong>.
          </p>
          <p className="muted" style={{ maxWidth: 560 }}>
            Para crianças de 4 a 8 anos. Sessões curtas e diárias, no ritmo de cada criança, com os princípios do
            ensino individualizado (pequenos passos, domínio antes de avançar, autocorreção) e alfabetização fônica em português.
          </p>
          <button className="btn huge primary" onClick={() => setGate('novo')}>Começar (adulto)</button>
          <p className="muted small">Sem anúncios. Os dados ficam só neste aparelho.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="screen center">
        <h1 style={{ fontSize: '2.2rem' }}>Quem vai aprender hoje?</h1>
        <div className="row" style={{ justifyContent: 'center', gap: 18 }}>
          {profiles.map((p) => (
            <button key={p.id} className="btn" style={{ flexDirection: 'column', minWidth: 160, minHeight: 170 }}
              onClick={() => {
                ctx.selectProfile(p.id);
                speak([{ text: `Oi, ${p.name}!` }]);
                const placed = Object.values(p.tracks).some((t) => t.placed);
                ctx.go(placed ? { name: 'inicio' } : { name: 'nivelamento' });
              }}>
              <Img k={p.avatar} size={90} />
              <span style={{ fontSize: '1.4rem' }}>{p.name}</span>
            </button>
          ))}
        </div>
        <div className="row" style={{ justifyContent: 'center' }}>
          {profiles.length < 4 && <button className="btn ghost small" onClick={() => setGate('novo')}>+ Adicionar criança</button>}
          <button className="btn ghost small" onClick={() => setGate('adultos')}>🔒 Adultos</button>
        </div>
      </div>
    </div>
  );
}
