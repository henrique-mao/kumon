import { stepsOf } from '../curriculum';
import type { TrackId } from '../curriculum/types';
import { TRACK_INFO } from '../engine/model';
import { Img } from './Tokens';

export function Certificate({ name, cert, printable }: { name: string; cert: { track: TrackId; step: string; date: string }; printable?: boolean }) {
  const info = TRACK_INFO[cert.track];
  const step = stepsOf(cert.track).find((s) => s.step === cert.step);
  const [y, m, d] = cert.date.split('-');
  return (
    <div className="certificate">
      <Img k="trofeu" size={80} />
      <h1>Degrau conquistado!</h1>
      <p style={{ fontSize: '1.3rem' }}>Certificamos que</p>
      <p style={{ fontSize: '2.2rem', fontWeight: 900, margin: 0 }}>{name}</p>
      <p style={{ fontSize: '1.2rem' }}>
        concluiu o degrau <strong>{cert.step}</strong> de <strong style={{ color: info.color }}>{info.name}</strong>
      </p>
      {step && <p className="muted small">{step.skills.map((s) => s.title).join(' · ')}</p>}
      <p className="muted">{d}/{m}/{y}</p>
      {printable && <button className="btn small no-print" onClick={() => window.print()}>🖨️ Imprimir</button>}
    </div>
  );
}
