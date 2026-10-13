import { useEffect, useMemo, useRef, useState } from 'react';
import { getBook } from '../../curriculum/books';
import type { Book, Item } from '../../curriculum/types';
import { sfx } from '../../lib/sound';
import { speak, stopSpeaking } from '../../lib/speech';
import { Img } from '../Tokens';
import { Choose } from './Basic';
import type { ActivityProps } from './common';

/** Leitor de livro decodificável: narração com destaque palavra a palavra, toque para ouvir a palavra,
 *  e perguntas de compreensão (literal → inferencial → sequência). */
export function BookReader({ book, color, showDialogic, onFinish }: { book: Book; color: string; showDialogic?: boolean; onFinish: (score: number) => void }) {
  const [page, setPage] = useState(0);
  const [hl, setHl] = useState(-1);
  const [q, setQ] = useState(-1); // -1 = lendo; >=0 = pergunta
  const [firstTry, setFirstTry] = useState(0);
  const [missed, setMissed] = useState(false);
  const [hint, setHint] = useState(0);
  const fallback = useRef<number | undefined>(undefined);
  const lang = book.lang;
  const text = book.pages[page]?.text ?? '';
  const words = useMemo(() => {
    const out: { w: string; start: number }[] = [];
    const re = /\S+/g;
    let m;
    while ((m = re.exec(text))) out.push({ w: m[0], start: m.index });
    return out;
  }, [text]);

  const read = () => {
    clearInterval(fallback.current);
    let gotBoundary = false;
    setHl(0);
    let i = 0;
    fallback.current = window.setInterval(() => {
      if (gotBoundary) return clearInterval(fallback.current);
      i++;
      if (i >= words.length) { clearInterval(fallback.current); return; }
      setHl(i);
    }, 480);
    speak([{ text, lang }], (_seg, ch) => {
      gotBoundary = true;
      const idx = words.findIndex((w, k) => ch >= w.start && (k === words.length - 1 || ch < words[k + 1].start));
      if (idx >= 0) setHl(idx);
    }).then(() => { clearInterval(fallback.current); setHl(-1); });
  };

  useEffect(() => { if (q < 0) read(); return () => clearInterval(fallback.current); }, [page]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { stopSpeaking(); clearInterval(fallback.current); }, []);

  const question = q >= 0 ? book.questions[q] : null;
  const qItem: Item | null = question && {
    kind: 'choose',
    prompt: [{ text: question.q }],
    options: question.options.map((o) => (o.img ? { token: { kind: 'img', img: o.img } } : { token: { kind: 'text', text: o.text, lang } })),
    answer: question.answer,
    hints: [{ say: [{ text: question.q }] }, { say: [{ text: 'Volte na história e pense.' }] }, { say: [{ text: 'Esta é a resposta.' }], showAnswer: true }],
  };
  useEffect(() => { if (question) speak([{ text: question.q }]); setHint(0); setMissed(false); }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const nextQuestion = (ok: boolean) => {
    const ft = firstTry + (ok ? 1 : 0);
    setFirstTry(ft);
    if (q + 1 < book.questions.length) setQ(q + 1);
    else onFinish(book.questions.length ? ft / book.questions.length : 1);
  };

  if (question && qItem) {
    return (
      <div className="book">
        <div className="pill">Pergunta {q + 1} de {book.questions.length}</div>
        <div className="med-text card" style={{ fontSize: '1.6rem', fontWeight: 800 }}>{question.q}</div>
        <button className="btn ghost small" onClick={() => speak([{ text: question.q }])}>🔊 Ouvir</button>
        <Choose
          item={qItem as Extract<Item, { kind: 'choose' }>}
          hintLevel={hint}
          disabled={false}
          color={color}
          onCorrect={() => { sfx.correct(); speak([{ text: 'Isso mesmo!' }]); setTimeout(() => nextQuestion(!missed), 900); }}
          onWrong={() => { sfx.tryAgain(); setMissed(true); setHint((h) => Math.min(3, h + 1)); speak([{ text: hint >= 1 ? 'Olhe a resposta que está piscando.' : 'Pense na história e tente de novo.' }]); }}
        />
      </div>
    );
  }

  const p = book.pages[page];
  return (
    <div className="book">
      <div className="pill" style={{ background: color, color: '#fff' }}>{book.title} · {page + 1}/{book.pages.length}</div>
      <Img k={p.img} className="page-img" alt="" />
      <div className="page-text" lang={lang === 'en' ? 'en' : 'pt-BR'}>
        {words.map((w, i) => (
          <span key={i}>
            <span className={`word ${i === hl ? 'hl' : ''}`} onClick={() => { setHl(i); speak([{ text: w.w.replace(/[.,!?;:]/g, ''), lang, slow: true }]); }}>{w.w}</span>{' '}
          </span>
        ))}
      </div>
      <div className="actions">
        <button className="btn" disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="página anterior">◀</button>
        <button className="btn" onClick={read}>🔊 Ler para mim</button>
        <button className="btn primary" onClick={() => { if (page + 1 < book.pages.length) setPage(page + 1); else if (book.questions.length) setQ(0); else onFinish(1); }} aria-label="próxima página">▶</button>
      </div>
      {showDialogic && book.dialogic.length > 0 && (
        <div className="card adult" style={{ maxWidth: 640 }}>
          <strong>👨‍👩‍👧 Para o adulto (leitura dialógica):</strong>
          <ul>{book.dialogic.map((d, i) => <li key={i}>{d}</li>)}</ul>
        </div>
      )}
    </div>
  );
}

export function BookActivity({ item, color, onCorrect }: ActivityProps<'book'>) {
  const book = getBook(item.bookId);
  if (!book) return <button className="btn" onClick={() => onCorrect({ scored: false })}>Continuar</button>;
  return <BookReader book={book} color={color} onFinish={() => onCorrect({ scored: false })} />;
}
