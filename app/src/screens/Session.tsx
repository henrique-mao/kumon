import { useEffect, useMemo, useRef, useState } from 'react';
import type { Ctx } from '../App';
import { BOOKS } from '../curriculum/books';
import { getSkill, SKILLS_BY_TRACK } from '../curriculum';
import type { Item } from '../curriculum/types';
import { Certificate } from '../components/Certificate';
import { Guide } from '../components/Guide';
import { ItemRunner, type ItemResult } from '../components/ItemRunner';
import { Img } from '../components/Tokens';
import { applyBlockResult } from '../engine/mastery';
import { today, TRACK_INFO, type Decision, type Profile } from '../engine/model';
import { buildSession, easierBlock, type PlannedBlock } from '../engine/session';
import { nextSticker } from '../engine/stats';
import { createRng } from '../lib/rng';
import { sfx } from '../lib/sound';
import { speak, stopSpeaking } from '../lib/speech';

interface QEntry { item: Item; requeued: boolean }
interface Acc { total: number; ok: number; times: number[]; hints: number; outcomes: boolean[] }
const emptyAcc = (): Acc => ({ total: 0, ok: 0, times: [], hints: 0, outcomes: [] });
const FRUSTRATION = 3;

export function Session({ ctx }: { ctx: Ctx }) {
  const p0 = ctx.profile!;
  const rng = useMemo(() => createRng(), []);
  const plan = useMemo(() => buildSession(p0, SKILLS_BY_TRACK, BOOKS, rng, today()), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [blocks, setBlocks] = useState<PlannedBlock[]>(plan.blocks);
  const [bi, setBi] = useState(0);
  const [queue, setQueue] = useState<QEntry[]>(() => plan.blocks[0]?.items.map((item) => ({ item, requeued: false })) ?? []);
  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState<'intro' | 'item' | 'pausa' | 'parar' | 'fim'>(plan.blocks.length ? 'intro' : 'fim');
  const [doneItems, setDoneItems] = useState(0);
  const acc = useRef<Acc>(emptyAcc());
  const wrongRow = useRef(0);
  const startedAt = useRef(Date.now());
  const decisions = useRef<Decision[]>([]);
  const certsBefore = useRef(p0.certificates.length);
  const [summary, setSummary] = useState<{ stars: number; sticker: string | null; certs: Profile['certificates']; tip: string } | null>(null);
  const starsEarned = useRef(0);
  const pending = useRef<{ errors: Profile['errors']; pcpm: Profile['pcpm'] }>({ errors: [], pcpm: [] });

  const block = blocks[bi];
  const info = block ? TRACK_INFO[block.track] : TRACK_INFO.leitura;
  const totalItems = blocks.reduce((a, b) => a + b.items.length, 0);

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    if (phase !== 'intro' || !block) return;
    const label = block.mode === 'revisao' ? 'Revisão rapidinha' : block.mode === 'livro' ? 'Hora da história' : block.mode === 'familia' ? 'Palavras especiais!' : `Agora: ${info.child}!`;
    speak([{ text: label }]);
    const t = setTimeout(() => setPhase('item'), 2600);
    return () => clearTimeout(t);
  }, [phase, bi]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Aplica o resultado do bloco (ou parcial) ao perfil e devolve o perfil atualizado. */
  const commitBlock = (b: PlannedBlock, a: Acc, base?: Profile): Profile => {
    const p: Profile = structuredClone(base ?? ctx.profile!);
    p.errors = [...p.errors, ...pending.current.errors].slice(-300);
    p.pcpm = [...p.pcpm, ...pending.current.pcpm].slice(-100);
    pending.current = { errors: [], pcpm: [] };
    if (b.mode === 'familia') {
      p.stars += 1;
      starsEarned.current += 1;
      return p;
    }
    if (b.mode === 'livro') {
      const bookId = (b.items[0] as Extract<Item, { kind: 'book' }>).bookId;
      p.booksRead[bookId] = (p.booksRead[bookId] ?? 0) + 1;
      p.stars += 1;
      starsEarned.current += 1;
      return p;
    }
    if (a.total >= 3) {
      const skill = getSkill(b.skillId)!;
      const sorted = [...a.times].sort((x, y) => x - y);
      const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
      decisions.current.push(...applyBlockResult(p, skill, SKILLS_BY_TRACK[skill.track], {
        skillId: b.skillId, date: today(), mode: b.mode === 'revisao' ? 'revisao' : 'novo',
        total: a.total, firstTry: a.ok, avgTimeSec: median, hintsUsed: a.hints, outcomes: a.outcomes,
      }));
      p.stars += 1;
      starsEarned.current += 1;
    }
    return p;
  };

  const replaceProfile = (p: Profile) => ctx.setData((d) => ({ ...d, profiles: d.profiles.map((x) => (x.id === p.id ? p : x)) }));

  const endSession = (p: Profile) => {
    const minutes = Math.max(1, Math.round((Date.now() - startedAt.current) / 60000));
    const sticker = nextSticker(p);
    p.sessions = [...p.sessions, { date: today(), minutes, items: doneItems, firstTry: 0, blocks: bi + 1 }].slice(-120);
    if (sticker && doneItems >= 5) p.stickers = [...p.stickers, sticker];
    replaceProfile(p);
    const firstNew = blocks.find((b) => b.mode === 'novo');
    setSummary({
      stars: starsEarned.current,
      sticker: sticker && doneItems >= 5 ? sticker : null,
      certs: p.certificates.slice(certsBefore.current),
      tip: firstNew ? getSkill(firstNew.skillId)?.offlineTip ?? '' : '',
    });
    setPhase('fim');
    sfx.levelUp(p.settings.calm);
    speak([{ text: `Parabéns, ${p.name}! Você terminou a lição de hoje. Até amanhã!` }]);
  };

  const goToBlock = (p: Profile, next: number, list = blocks) => {
    acc.current = emptyAcc();
    wrongRow.current = 0;
    if (next >= list.length) { endSession(p); return; }
    replaceProfile(p);
    setBi(next);
    setQueue(list[next].items.map((item) => ({ item, requeued: false })));
    setQi(0);
    setPhase('intro');
  };

  const onItemDone = (r: ItemResult) => {
    const entry = queue[qi];
    const a = acc.current;
    if (r.scored && !entry.requeued) {
      a.total++;
      if (r.firstTry) a.ok++;
      a.outcomes.push(r.firstTry);
      a.times.push(r.timeSec);
      a.hints += r.hints;
    }
    if (r.error) pending.current.errors.push({ skillId: block.skillId, date: today(), ...r.error });
    if (r.pcpm) pending.current.pcpm.push({ date: today(), value: r.pcpm });
    setDoneItems((n) => n + 1);
    let q = queue;
    // autocorreção: o item errado volta no fim do bloco (uma vez)
    if (!r.firstTry && !entry.requeued && block.mode !== 'livro') {
      q = [...queue, { item: entry.item, requeued: true }];
      setQueue(q);
    }
    wrongRow.current = r.firstTry ? 0 : wrongRow.current + 1;
    if (wrongRow.current >= FRUSTRATION && block.mode !== 'livro') {
      wrongRow.current = 0;
      setQi(qi + 1);
      setPhase('pausa');
      speak([{ text: 'Vamos respirar fundo? Errar faz parte de aprender. O que você quer fazer?' }]);
      return;
    }
    if (qi + 1 < q.length) setQi(qi + 1);
    else goToBlock(commitBlock(block, a), bi + 1);
  };

  if (phase === 'fim') {
    return (
      <div className="app">
        <div className="screen center">
          <div className="celebrate">🎉</div>
          <h1 style={{ fontSize: '2.2rem' }}>Lição concluída!</h1>
          <Guide captions={ctx.profile!.settings.captions} />
          {summary && (
            <>
              <div className="row" style={{ justifyContent: 'center' }}>
                <span className="pill" style={{ fontSize: '1.4rem' }}><Img k="estrela" /> +{summary.stars}</span>
                {summary.sticker && <span className="pill" style={{ fontSize: '1.2rem' }}>Figurinha nova: <Img k={summary.sticker} /></span>}
              </div>
              {summary.certs.map((c, i) => <Certificate key={i} name={ctx.profile!.name} cert={c} />)}
              {summary.tip && (
                <div className="card adult" style={{ maxWidth: 640, textAlign: 'left' }}>
                  <strong>👨‍👩‍👧 Para fazer junto (5 min, sem tela):</strong>
                  <p style={{ margin: '6px 0 0' }}>{summary.tip}</p>
                </div>
              )}
            </>
          )}
          <button className="btn huge primary" onClick={() => ctx.go({ name: 'inicio' })}>Até amanhã! 👋</button>
        </div>
      </div>
    );
  }

  if (!block) return null;
  const entry = queue[qi];

  return (
    <div className="app">
      <div className="kid-top">
        <span className="track-tag" style={{ background: info.color }}><Img k={info.icon} /> {info.child}</span>
        {block.mode === 'revisao' && <span className="pill">Revisão</span>}
        <div className="progress" style={{ flex: 1 }} aria-label="progresso da lição">
          <div style={{ width: `${Math.min(100, (doneItems / Math.max(1, totalItems)) * 100)}%` }} />
        </div>
        <button className="btn small ghost" onClick={() => { stopSpeaking(); setPhase('parar'); }}>Parar</button>
      </div>
      <div className="screen">
        <Guide captions={ctx.profile!.settings.captions} />
        {phase === 'intro' && (
          <div className="activity">
            <Img k={block.mode === 'livro' ? 'livro' : block.mode === 'familia' ? 'familia' : info.icon} size={140} className="celebrate" />
            <h1 style={{ fontSize: '2.4rem' }}>{block.mode === 'revisao' ? 'Revisão rapidinha' : block.mode === 'livro' ? 'Hora da história' : block.mode === 'familia' ? 'Palavras especiais' : info.child}</h1>
            <button className="btn huge primary" onClick={() => setPhase('item')}>Vamos!</button>
          </div>
        )}
        {phase === 'item' && entry && (
          <ItemRunner key={`${bi}-${qi}`} item={entry.item} color={info.color} calm={ctx.profile!.settings.calm} onDone={onItemDone} />
        )}
        {phase === 'pausa' && (
          <div className="activity">
            <div style={{ fontSize: '4rem' }}>🌬️</div>
            <h1>Que tal uma pausa?</h1>
            <div className="actions">
              <button className="btn huge" onClick={() => {
                if (qi < queue.length) setPhase('item');
                else goToBlock(commitBlock(block, acc.current), bi + 1);
              }}>💪 Continuar</button>
              <button className="btn huge ok" onClick={() => {
                const p = commitBlock(block, acc.current);
                const easy = easierBlock(p, SKILLS_BY_TRACK, block.track, rng, Math.max(3, queue.length - qi));
                p.log = [...p.log, { date: today(), skillId: block.skillId, kind: 'pausa' as const, text: `${p.name} errou ${FRUSTRATION} seguidas em "${getSkill(block.skillId)?.title}". Fez uma pausa e praticou algo mais fácil.` }].slice(-300);
                if (!easy) { goToBlock(p, bi + 1); return; }
                const list = [...blocks.slice(0, bi + 1), easy, ...blocks.slice(bi + 1)];
                setBlocks(list);
                goToBlock(p, bi + 1, list);
              }}>🙂 Algo mais fácil</button>
              <button className="btn huge ghost" onClick={() => endSession(commitBlock(block, acc.current))}>🌙 Parar por hoje</button>
            </div>
          </div>
        )}
        {phase === 'parar' && (
          <div className="activity">
            <h1>Quer parar agora?</h1>
            <div className="actions">
              <button className="btn huge" onClick={() => setPhase('item')}>Continuar</button>
              <button className="btn huge ghost" onClick={() => endSession(commitBlock(block, acc.current))}>Parar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
