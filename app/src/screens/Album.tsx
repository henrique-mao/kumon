import type { Ctx } from '../App';
import { Certificate } from '../components/Certificate';
import { Img } from '../components/Tokens';
import { STICKERS } from '../engine/stats';

/** Álbum de figurinhas (recompensa previsível: 1 por lição concluída) e certificados. */
export function Album({ ctx }: { ctx: Ctx }) {
  const p = ctx.profile!;
  return (
    <div className="app">
      <div className="kid-top">
        <button className="btn small" onClick={() => ctx.go({ name: 'inicio' })}>◀ Voltar</button>
        <h1 style={{ margin: 0 }}>Meu álbum</h1>
        <span className="spacer" />
        <span className="pill">{p.stickers.length}/{STICKERS.length}</span>
      </div>
      <div className="screen">
        <div className="sticker-grid">
          {STICKERS.map((s) => (
            <div key={s} className={`sticker ${p.stickers.includes(s) ? '' : 'empty'}`}>
              {p.stickers.includes(s) ? <Img k={s} /> : <span className="muted">?</span>}
            </div>
          ))}
        </div>
        {p.certificates.length > 0 && <h2>Degraus conquistados</h2>}
        {p.certificates.slice().reverse().map((c, i) => <Certificate key={i} name={p.name} cert={c} />)}
      </div>
    </div>
  );
}
