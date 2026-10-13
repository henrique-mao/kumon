import { useMemo, useState } from 'react';

/** Portão parental: uma conta que crianças de 4–8 anos dificilmente resolvem. */
export function ParentGate({ onPass, onCancel }: { onPass: () => void; onCancel: () => void }) {
  const [a, b] = useMemo(() => [12 + Math.floor(Math.random() * 7), 6 + Math.floor(Math.random() * 4)], []);
  const [v, setV] = useState('');
  const [err, setErr] = useState(false);
  return (
    <div className="app adult">
      <div className="screen center">
        <div className="card" style={{ maxWidth: 420, width: '100%' }}>
          <h1>🔒 Área dos adultos</h1>
          <p className="muted">Para continuar, responda:</p>
          <p style={{ fontSize: '2rem', fontWeight: 900 }}>{a} × {b} = ?</p>
          <form onSubmit={(e) => { e.preventDefault(); if (Number(v) === a * b) onPass(); else { setErr(true); setV(''); } }}>
            <div className="field">
              <input type="number" inputMode="numeric" value={v} onChange={(e) => { setV(e.target.value); setErr(false); }} aria-label="resposta" autoFocus />
            </div>
            {err && <p style={{ color: 'var(--bad)' }}>Resposta incorreta.</p>}
            <div className="row" style={{ marginTop: 12 }}>
              <button type="button" className="btn ghost small" onClick={onCancel}>Voltar</button>
              <span className="spacer" />
              <button className="btn primary small">Entrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
