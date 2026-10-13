import { useState } from 'react';
import type { Ctx } from '../App';
import { BOOKS } from '../curriculum/books';
import { SKILLS_BY_TRACK } from '../curriculum';
import type { Book } from '../curriculum/types';
import { BookReader } from '../components/activities/BookReader';
import { Img } from '../components/Tokens';
import { TRACK_INFO } from '../engine/model';
import { stopSpeaking } from '../lib/speech';

/** Biblioteca graduada: livros liberados conforme os sons já aprendidos. */
export function Library({ ctx }: { ctx: Ctx }) {
  const p = ctx.profile!;
  const [open, setOpen] = useState<Book | null>(null);
  const [together, setTogether] = useState(false);
  const unlocked = (b: Book) => {
    const track = b.lang === 'pt' ? 'leitura' : 'ingles';
    const idx = SKILLS_BY_TRACK[track].findIndex((s) => s.id === b.level);
    return idx >= 0 && idx <= p.tracks[track].pointer;
  };

  if (open) {
    const color = open.lang === 'pt' ? TRACK_INFO.leitura.color : TRACK_INFO.ingles.color;
    return (
      <div className="app">
        <div className="kid-top">
          <button className="btn small" onClick={() => { stopSpeaking(); setOpen(null); }}>◀ Livros</button>
          <span className="spacer" />
          <label className="switch small"><input type="checkbox" checked={together} onChange={(e) => setTogether(e.target.checked)} /> Ler junto (adulto)</label>
        </div>
        <div className="screen center">
          <BookReader book={open} color={color} showDialogic={together} onFinish={() => {
            ctx.update((pp) => { pp.booksRead[open.id] = (pp.booksRead[open.id] ?? 0) + 1; });
            setOpen(null);
          }} />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="kid-top">
        <button className="btn small" onClick={() => ctx.go({ name: 'inicio' })}>◀ Voltar</button>
        <h1 style={{ margin: 0 }}>Livros</h1>
      </div>
      <div className="screen">
        <div className="sticker-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
          {BOOKS.map((b) => {
            const ok = unlocked(b);
            return (
              <button key={b.id} className="card" disabled={!ok} onClick={() => setOpen(b)}
                style={{ border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: ok ? 1 : 0.5 }}>
                <Img k={ok ? b.pages[0]?.img ?? 'livro' : 'cadeado'} size={84} />
                <strong>{b.title}</strong>
                <span className="small muted">{b.lang === 'en' ? 'English' : 'Português'}{p.booksRead[b.id] ? ` · lido ${p.booksRead[b.id]}x` : ''}</span>
              </button>
            );
          })}
        </div>
        <p className="muted small">Os livros com cadeado abrem quando a criança aprende os sons usados neles (livros decodificáveis).</p>
      </div>
    </div>
  );
}
