import { useEffect, useMemo, useRef, useState } from 'react';
import type { Ctx } from '../App';
import { SKILLS_BY_TRACK } from '../curriculum';
import { classifySondagem, classifyWord, HIPOTESES, SONDAGEM_LISTAS, syllabify } from '../curriculum/escrita';
import type { Say } from '../curriculum/types';
import { Img } from '../components/Tokens';
import { IMAGES } from '../data/images';
import { today, type Hipotese, type Profile } from '../engine/model';
import {
  deleteNarration, deleteReading, hasNarration, listReadings, narrationKey, onNarrationChange, saveNarration, type ReadingClip,
} from '../lib/audioStore';
import { mergeData } from '../lib/merge';
import { canRecord, startRecording, type Recording } from '../lib/recorder';
import { createRng } from '../lib/rng';
import { speak } from '../lib/speech';
import { migrate } from '../lib/storage';

const fmt = (d: string) => d.split('-').reverse().join('/');
const low = (s: string) => s.toLocaleLowerCase('pt-BR');

// ---------------------------------------------------------------------------
// Vozes da família: gravar os sons, sílabas e palavras que a voz sintética fala mal
// ---------------------------------------------------------------------------

/** Coleta os trechos "lentos" (sons e sílabas) que a trilha de leitura realmente fala. */
function collectClips(): { text: string; group: 'Sons e letras' | 'Sílabas' | 'Palavras devagar' }[] {
  const count = new Map<string, number>();
  const add = (s: Say) => {
    if (!s.slow || (s.lang ?? 'pt') !== 'pt') return;
    const t = s.text.trim();
    if (!t || t.length > 14) return;
    count.set(t, (count.get(t) ?? 0) + 1);
  };
  SKILLS_BY_TRACK.leitura.forEach((sk, i) => {
    for (let seed = 1; seed <= 25; seed++) {
      const it = sk.generate(createRng(seed * 31 + i));
      it.prompt.forEach(add);
      it.hints.forEach((h) => h.say.forEach(add));
    }
  });
  return [...count.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([text]) => ({
      text,
      group: /^(.)\1+$/.test(text.replace(/\s/g, '')) || text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').length === 1 ? 'Sons e letras' as const
        : text.includes('...') ? 'Palavras devagar' as const : 'Sílabas' as const,
    }));
}

export function FamilyVoices({ p }: { p: Profile }) {
  const clips = useMemo(collectClips, []);
  const [, force] = useState(0);
  const [rec, setRec] = useState<{ key: string; r: Recording } | null>(null);
  const [err, setErr] = useState('');
  const [group, setGroup] = useState<string>('Sons e letras');
  useEffect(() => onNarrationChange(() => force((n) => n + 1)), []);
  const words = (p.customWords ?? []).map((w) => ({ text: low(w.w), group: 'Palavras da família' as const }));
  const all = [...clips, ...words];
  const groups = ['Sons e letras', 'Sílabas', 'Palavras devagar', 'Palavras da família'];
  const shown = all.filter((c) => c.group === group);
  const done = all.filter((c) => hasNarration(narrationKey(c.text, 'pt'))).length;

  const toggle = async (text: string) => {
    const key = narrationKey(text, 'pt');
    setErr('');
    if (rec) {
      const { blob, seconds } = await rec.r.stop();
      const k = rec.key;
      setRec(null);
      if (seconds > 0.3) await saveNarration(k, blob);
      return;
    }
    try {
      setRec({ key, r: await startRecording(4000) });
    } catch {
      setErr('Não foi possível usar o microfone. Verifique a permissão do navegador.');
    }
  };

  if (!canRecord()) return <p className="muted">Este navegador não permite gravar áudio.</p>;
  return (
    <div className="card" style={{ display: 'grid', gap: 10 }}>
      <h2>🎙️ Vozes da família</h2>
      <p className="muted small" style={{ margin: 0 }}>
        A voz sintética do navegador fala mal sons isolados como “mmmm” ou “sss”. Grave com a sua voz e o app passa a usar a
        gravação em todas as atividades. Fale perto do microfone, devagar e com clareza (até 4 segundos). As gravações ficam só neste aparelho.
      </p>
      <div className="pill" style={{ justifySelf: 'start' }}>{done} de {all.length} gravados</div>
      <div className="tabs">{groups.map((g) => <button key={g} className={group === g ? 'on' : ''} onClick={() => setGroup(g)}>{g}</button>)}</div>
      {err && <p style={{ color: 'var(--bad)' }}>{err}</p>}
      {!shown.length && <p className="muted">Nada aqui ainda.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 8 }}>
        {shown.map((c) => {
          const key = narrationKey(c.text, 'pt');
          const has = hasNarration(key);
          const recording = rec?.key === key;
          return (
            <div key={c.text} className="row" style={{ background: has ? 'var(--ok-bg)' : '#faf6ef', borderRadius: 12, padding: '6px 10px', gap: 6 }}>
              <strong style={{ flex: 1, fontSize: '1.1rem' }}>{has ? '✓ ' : ''}{c.text}</strong>
              <button className="btn small ghost" onClick={() => speak([{ text: c.text, lang: 'pt', slow: true }])} aria-label={`ouvir ${c.text}`}>🔊</button>
              <button className={`btn small ${recording ? 'primary' : ''}`} disabled={!!rec && !recording} onClick={() => toggle(c.text)} aria-label={`gravar ${c.text}`}>
                {recording ? '⏹️' : '🎙️'}
              </button>
              {has && <button className="btn small ghost" onClick={() => deleteNarration(key)} aria-label={`apagar ${c.text}`}>🗑️</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gravações de leitura da criança
// ---------------------------------------------------------------------------
export function Readings({ p }: { p: Profile }) {
  const [list, setList] = useState<ReadingClip[] | null>(null);
  const urls = useRef(new Map<number, string>());
  const load = () => listReadings(p.id).then(setList);
  useEffect(() => { load(); return () => urls.current.forEach((u) => URL.revokeObjectURL(u)); }, [p.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const url = (r: ReadingClip) => {
    if (!urls.current.has(r.id!)) urls.current.set(r.id!, URL.createObjectURL(r.blob));
    return urls.current.get(r.id!)!;
  };
  if (!list) return <p className="muted">Carregando…</p>;
  if (!list.length) return (
    <div className="card">
      <h2>🎧 Gravações de leitura</h2>
      <p className="muted">Nos livros, a criança pode tocar em “🎙️ Gravar minha leitura”. As gravações aparecem aqui, em ordem, para vocês ouvirem a evolução da fluência.</p>
    </div>
  );
  return (
    <div className="card">
      <h2>🎧 Gravações de leitura de {p.name}</h2>
      <p className="muted small">Ouça as primeiras e as mais recentes: a evolução da fluência (velocidade, ritmo e entonação) costuma ser emocionante. As gravações ficam só neste aparelho.</p>
      <table>
        <thead><tr><th>Data</th><th>Livro</th><th>Texto</th><th>Áudio</th><th /></tr></thead>
        <tbody>
          {list.slice().reverse().map((r) => (
            <tr key={r.id}>
              <td>{fmt(r.date)}</td>
              <td>{r.bookTitle} <span className="muted small">p. {r.page + 1}</span></td>
              <td className="small">{r.text}</td>
              <td><audio controls src={url(r)} preload="none" style={{ maxWidth: 220 }} /></td>
              <td><button className="btn small ghost" onClick={async () => { await deleteReading(r.id!); load(); }} aria-label="apagar">🗑️</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Palavras da família (palavras geradoras)
// ---------------------------------------------------------------------------
const IMAGE_KEYS = Object.keys(IMAGES).sort();

export function FamilyWords({ ctx, p }: { ctx: Ctx; p: Profile }) {
  const [word, setWord] = useState('');
  const [syl, setSyl] = useState('');
  const [img, setImg] = useState('');
  const words = p.customWords ?? [];
  const upper = word.trim().toLocaleUpperCase('pt-BR').replace(/[^A-ZÁÉÍÓÚÂÊÔÃÕÀÇ]/g, '');
  const parts = (syl || syllabify(upper).join('-')).split('-').map((s) => s.trim().toLocaleUpperCase('pt-BR')).filter(Boolean);
  const valid = upper.length >= 2 && parts.join('') === upper && !words.some((w) => w.w === upper);
  const add = () => {
    ctx.update((x) => { x.customWords = [...(x.customWords ?? []), { w: upper, syl: parts, img: img || undefined }].slice(0, 12); }, p.id);
    setWord(''); setSyl(''); setImg('');
  };
  return (
    <div className="card" style={{ display: 'grid', gap: 12 }}>
      <h2>👨‍👩‍👧 Palavras da família</h2>
      <p className="muted small" style={{ margin: 0 }}>
        Palavras geradoras (Paulo Freire): aprender a ler com palavras cheias de significado — o nome da criança, de quem mora com ela,
        do bichinho, da escola. Elas aparecem em um bloquinho “Palavras especiais” na lição diária (montar a palavra e achar a palavra).
        Grave a sua voz falando cada uma na aba “Vozes da família”.
      </p>
      {!words.some((w) => w.w === p.name.toLocaleUpperCase('pt-BR')) && (
        <button className="btn small" style={{ justifySelf: 'start' }} onClick={() => { setWord(p.name); setSyl(''); }}>+ Usar o nome “{p.name}”</button>
      )}
      <div className="row" style={{ alignItems: 'flex-end' }}>
        <label className="field" style={{ flex: 1, minWidth: 160 }}>Palavra
          <input type="text" value={word} maxLength={14} onChange={(e) => { setWord(e.target.value); setSyl(''); }} placeholder="ex.: Mamãe, Rex, Bia" />
        </label>
        <label className="field" style={{ flex: 1, minWidth: 160 }}>Sílabas (separe com “-”)
          <input type="text" value={syl || syllabify(upper).join('-')} onChange={(e) => setSyl(e.target.value)} />
        </label>
        <label className="field" style={{ minWidth: 160 }}>Figura (opcional)
          <select value={img} onChange={(e) => setImg(e.target.value)}>
            <option value="">Sem figura</option>
            {IMAGE_KEYS.map((k) => <option key={k} value={k}>{k.replace(/_/g, ' ')}</option>)}
          </select>
        </label>
        {img && <Img k={img} size={48} />}
        <button className="btn primary small" disabled={!valid || words.length >= 12} onClick={add}>Adicionar</button>
      </div>
      {upper && !valid && <p className="small" style={{ color: 'var(--bad)', margin: 0 }}>{words.some((w) => w.w === upper) ? 'Esta palavra já está na lista.' : 'As sílabas precisam formar exatamente a palavra.'}</p>}
      <div className="chips">
        {words.map((w) => (
          <span key={w.w} className="chip dominado" style={{ display: 'inline-flex', gap: 6, alignItems: 'center', fontSize: '1rem' }}>
            {w.img && <Img k={w.img} size={24} />} {w.syl.join('-')}
            <button className="btn small ghost" style={{ minHeight: 28, minWidth: 28, padding: 0 }} aria-label={`remover ${w.w}`}
              onClick={() => ctx.update((x) => { x.customWords = x.customWords.filter((c) => c.w !== w.w); }, p.id)}>✕</button>
          </span>
        ))}
        {!words.length && <span className="muted small">Nenhuma palavra ainda.</span>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sondagem de escrita (psicogênese)
// ---------------------------------------------------------------------------
export const hipoteseLabel = (h: Hipotese) => HIPOTESES.find((x) => x.id === h)?.label ?? h;

export function SondagemPanel({ ctx, p }: { ctx: Ctx; p: Profile }) {
  const [lista, setLista] = useState(0);
  const L = SONDAGEM_LISTAS[lista];
  const [written, setWritten] = useState<string[]>(['', '', '', '']);
  const [sentence, setSentence] = useState('');
  const [phase, setPhase] = useState<Hipotese | ''>('');
  const [note, setNote] = useState('');
  const words = L.words.map((target, i) => ({ target, written: written[i] ?? '' }));
  const suggested = classifySondagem(words);
  const save = () => {
    ctx.update((x) => {
      x.sondagens = [...(x.sondagens ?? []), {
        date: today(), words, sentence: { target: L.sentence, written: sentence }, suggested, phase: phase || suggested, note: note || undefined,
      }];
    }, p.id);
    setWritten(['', '', '', '']); setSentence(''); setPhase(''); setNote('');
  };
  const hist = p.sondagens ?? [];
  return (
    <>
      <div className="card" style={{ display: 'grid', gap: 10 }}>
        <h2>✍️ Sondagem de escrita — {p.name}</h2>
        <p className="muted small" style={{ margin: 0 }}>
          Dite as palavras (da maior para a menor) e a frase, sem soletrar nem separar sílabas. A criança escreve no papel, do jeito que
          sabe; depois, peça que leia apontando com o dedo. Digite aqui o que ela escreveu. O app sugere a hipótese de escrita
          (Ferreiro &amp; Teberosky) — a decisão final é sua.
        </p>
        <div className="tabs">{SONDAGEM_LISTAS.map((l, i) => <button key={l.tema} className={lista === i ? 'on' : ''} onClick={() => setLista(i)}>{l.tema}</button>)}</div>
        <table>
          <thead><tr><th>Palavra ditada</th><th>O que a criança escreveu</th><th>Sugestão</th></tr></thead>
          <tbody>
            {L.words.map((w, i) => (
              <tr key={w}>
                <td><strong>{w}</strong> <button className="btn small ghost" onClick={() => speak([{ text: low(w) }])} aria-label={`ditar ${w}`}>🔊</button></td>
                <td><input type="text" className="field" style={{ font: 'inherit', padding: 8, borderRadius: 10, border: '2px solid var(--line)', width: '100%', textTransform: 'uppercase' }}
                  value={written[i]} onChange={(e) => { const n = written.slice(); n[i] = e.target.value; setWritten(n); }} aria-label={`escrita de ${w}`} /></td>
                <td className="small">{written[i].trim() ? hipoteseLabel(classifyWord(w, written[i])) : '—'}</td>
              </tr>
            ))}
            <tr>
              <td><strong>{L.sentence}</strong></td>
              <td><input type="text" style={{ font: 'inherit', padding: 8, borderRadius: 10, border: '2px solid var(--line)', width: '100%', textTransform: 'uppercase' }}
                value={sentence} onChange={(e) => setSentence(e.target.value)} aria-label="escrita da frase" /></td>
              <td className="small muted">frase (registro)</td>
            </tr>
          </tbody>
        </table>
        <div className="row">
          <span>Sugestão: <strong>{hipoteseLabel(suggested)}</strong></span>
          <label className="field" style={{ minWidth: 220 }}>Hipótese registrada
            <select value={phase || suggested} onChange={(e) => setPhase(e.target.value as Hipotese)}>
              {HIPOTESES.map((h) => <option key={h.id} value={h.id}>{h.label}</option>)}
            </select>
          </label>
          <label className="field" style={{ flex: 1, minWidth: 200 }}>Observação
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="ex.: leu apontando, trocou P/B" />
          </label>
          <button className="btn primary small" disabled={!written.some((w) => w.trim())} onClick={save}>Salvar sondagem</button>
        </div>
        <details><summary className="small">O que significa cada hipótese?</summary>
          <ul className="small">{HIPOTESES.map((h) => <li key={h.id}><strong>{h.label}:</strong> {h.desc}</li>)}</ul>
        </details>
      </div>
      {hist.length > 0 && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <h2>Histórico de sondagens</h2>
          <table>
            <thead><tr><th>Data</th><th>Hipótese</th><th>Escritas</th><th>Obs.</th></tr></thead>
            <tbody>
              {hist.slice().reverse().map((s, i) => (
                <tr key={i}>
                  <td>{fmt(s.date)}</td>
                  <td><strong>{hipoteseLabel(s.phase)}</strong>{s.phase !== s.suggested && <span className="muted small"> (sugestão: {hipoteseLabel(s.suggested)})</span>}</td>
                  <td className="small">{s.words.map((w) => `${w.target}: ${w.written.toUpperCase() || '—'}`).join(' · ')}</td>
                  <td className="small">{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Importar dados de outro aparelho
// ---------------------------------------------------------------------------
export function ImportData({ ctx }: { ctx: Ctx }) {
  const [msg, setMsg] = useState('');
  return (
    <div className="field">
      <span>Importar de outro aparelho (arquivo exportado):</span>
      <input type="file" accept="application/json,.json" onChange={async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        try {
          const incoming = migrate(JSON.parse(await f.text()));
          const { data, added, merged } = mergeData(ctx.data, incoming);
          ctx.setData(() => data);
          setMsg(`Pronto! ${added} criança(s) adicionada(s) e ${merged} mesclada(s) com o progresso deste aparelho.`);
        } catch {
          setMsg('Não foi possível ler este arquivo. Use um arquivo exportado pelo Degrau.');
        }
        e.target.value = '';
      }} />
      {msg && <p className="small" style={{ margin: 0 }}>{msg}</p>}
      <p className="small muted" style={{ margin: 0 }}>Para usar em dois aparelhos (ex.: tablet da escola e celular de casa): exporte em um, importe no outro. As gravações de áudio não vão no arquivo.</p>
    </div>
  );
}
