import { useState } from 'react';
import type { Ctx } from '../App';
import { Img } from '../components/Tokens';
import { newProfile } from '../engine/model';
import { speak } from '../lib/speech';

const AVATARS = ['gato', 'cachorro', 'leao', 'coelho', 'urso', 'raposa', 'pinguim', 'unicornio', 'dinossauro', 'macaco', 'sapo', 'tartaruga'];

/** Cadastro: o adulto consente (LGPD art. 14) e informa nome/idade; a criança escolhe o avatar. */
export function Onboarding({ ctx }: { ctx: Ctx }) {
  const [step, setStep] = useState<'consent' | 'dados' | 'avatar'>('consent');
  const [consent, setConsent] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState(6);

  if (step === 'consent') {
    return (
      <div className="app adult">
        <div className="screen" style={{ maxWidth: 720 }}>
          <h1>Bem-vindo(a) ao Degrau</h1>
          <div className="card">
            <h2>Privacidade da criança</h2>
            <ul>
              <li>Guardamos apenas: primeiro nome (ou apelido), idade e o progresso nas atividades.</li>
              <li>Tudo fica <strong>somente neste aparelho</strong> (armazenamento local do navegador). Nada é enviado a servidores.</li>
              <li>Sem anúncios, sem rastreadores, sem chat, sem compras dentro do app.</li>
              <li>O reconhecimento de voz (opcional) usa o recurso do próprio navegador; não gravamos o áudio.</li>
              <li>Você pode exportar ou apagar todos os dados a qualquer momento na Área dos adultos.</li>
            </ul>
            <label className="switch">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span>Sou o(a) responsável legal e autorizo o uso desses dados para o aprendizado da criança.</span>
            </label>
          </div>
          <div className="row">
            <button className="btn ghost small" onClick={() => ctx.go({ name: 'perfis' })}>Voltar</button>
            <span className="spacer" />
            <button className="btn primary" disabled={!consent} onClick={() => setStep('dados')}>Continuar</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'dados') {
    return (
      <div className="app adult">
        <div className="screen" style={{ maxWidth: 520 }}>
          <h1>Sobre a criança</h1>
          <div className="card" style={{ display: 'grid', gap: 14 }}>
            <label className="field">Primeiro nome ou apelido
              <input type="text" value={name} maxLength={20} onChange={(e) => setName(e.target.value)} autoFocus />
            </label>
            <label className="field">Idade
              <select value={age} onChange={(e) => setAge(Number(e.target.value))}>
                {[4, 5, 6, 7, 8].map((a) => <option key={a} value={a}>{a} anos</option>)}
              </select>
            </label>
            <p className="muted small">A idade só define o ponto de partida do nivelamento e a duração sugerida da sessão
              ({age <= 5 ? 10 : age === 6 ? 15 : 20} minutos). Você pode ajustar depois.</p>
          </div>
          <div className="row">
            <button className="btn ghost small" onClick={() => setStep('consent')}>Voltar</button>
            <span className="spacer" />
            <button className="btn primary" disabled={!name.trim()} onClick={() => { setStep('avatar'); speak([{ text: `Oi, ${name}! Escolha o seu bichinho!` }]); }}>
              Continuar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="screen center">
        <h1 style={{ fontSize: '2rem' }}>Oi, {name}! Escolha o seu bichinho:</h1>
        <div className="sticker-grid" style={{ maxWidth: 640 }}>
          {AVATARS.map((a) => (
            <button key={a} className="sticker" style={{ border: 'none' }} aria-label={a}
              onClick={() => {
                const p = newProfile(name.trim(), age, a);
                ctx.setData((d) => ({ ...d, profiles: [...d.profiles, p] }));
                ctx.selectProfile(p.id);
                ctx.go({ name: 'nivelamento' });
              }}>
              <Img k={a} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
