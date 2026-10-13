import type { ColorId, MouthShape, ShapeId, Token, Visual } from '../curriculum/types';

const BASE = import.meta.env.BASE_URL;
export const imgUrl = (key: string) => `${BASE}img/${key}.svg`;

export function Img({ k, alt = '', className, size }: { k: string; alt?: string; className?: string; size?: number }) {
  return <img src={imgUrl(k)} alt={alt} className={className} draggable={false} width={size} height={size} />;
}

export const COLORS: Record<ColorId, string> = {
  vermelho: '#e5484d', azul: '#2e86de', amarelo: '#f5c518', verde: '#2fb36d', laranja: '#ff8a3d',
  roxo: '#8e5bd8', rosa: '#f77fb3', marrom: '#8b5a2b', preto: '#2d2a32', branco: '#ffffff',
};

export function ShapeSvg({ shape, color, size = 'm' }: { shape: ShapeId; color: ColorId; size?: 'p' | 'm' | 'g' }) {
  const fill = COLORS[color];
  const scale = size === 'p' ? 0.55 : size === 'g' ? 1 : 0.78;
  const stroke = color === 'branco' ? '#bbb' : 'rgba(0,0,0,0.25)';
  const t = `translate(50 50) scale(${scale}) translate(-50 -50)`;
  let el;
  switch (shape) {
    case 'circulo': el = <circle cx="50" cy="50" r="44" />; break;
    case 'quadrado': el = <rect x="8" y="8" width="84" height="84" rx="6" />; break;
    case 'retangulo': el = <rect x="4" y="24" width="92" height="52" rx="6" />; break;
    case 'triangulo': el = <polygon points="50,6 96,92 4,92" />; break;
    case 'losango': el = <polygon points="50,4 94,50 50,96 6,50" />; break;
    case 'estrela': el = <polygon points="50,4 62,38 98,38 69,59 80,94 50,73 20,94 31,59 2,38 38,38" />; break;
    case 'coracao': el = <path d="M50 90 C 10 60, 0 30, 25 15 C 40 6, 50 20, 50 26 C 50 20, 60 6, 75 15 C 100 30, 90 60, 50 90 Z" />; break;
  }
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={`${shape} ${color}`}>
      <g transform={t} fill={fill} stroke={stroke} strokeWidth="3">{el}</g>
    </svg>
  );
}

const DICE: Record<number, [number, number][]> = {
  1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[25, 25], [50, 50], [75, 75]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]], 5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[28, 22], [72, 22], [28, 50], [72, 50], [28, 78], [72, 78]],
};

export function Dots({ n }: { n: number }) {
  if (n <= 6) {
    return (
      <svg viewBox="0 0 100 100" role="img" aria-label={`${n} pontinhos`}>
        <rect x="3" y="3" width="94" height="94" rx="18" fill="#fff" stroke="#d9cdb8" strokeWidth="3" />
        {DICE[n]?.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="9" fill="#2d2a32" />)}
      </svg>
    );
  }
  // até 20: linhas de 5 (estrutura do quadro de dez)
  const cols = 5;
  const rows = Math.ceil(n / cols);
  const h = rows * 20 + 8;
  return (
    <svg viewBox={`0 0 108 ${h}`} role="img" aria-label={`${n} pontinhos`}>
      <rect x="1" y="1" width="106" height={h - 2} rx="12" fill="#fff" stroke="#d9cdb8" strokeWidth="2" />
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={14 + (i % cols) * 20} cy={14 + Math.floor(i / cols) * 20} r="7" fill={i < 10 ? '#2d2a32' : '#2e86de'} />
      ))}
    </svg>
  );
}

export function Clock({ h, m }: { h: number; m: number }) {
  const ha = ((h % 12) + m / 60) * 30;
  const ma = m * 6;
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={`relógio ${h}:${String(m).padStart(2, '0')}`}>
      <circle cx="50" cy="50" r="46" fill="#fff" stroke="#2d2a32" strokeWidth="4" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = ((i + 1) * 30 * Math.PI) / 180;
        return <text key={i} x={50 + 36 * Math.sin(a)} y={50 - 36 * Math.cos(a) + 4} fontSize="10" fontWeight="700" textAnchor="middle" fill="#2d2a32">{i + 1}</text>;
      })}
      <line x1="50" y1="50" x2={50 + 22 * Math.sin((ha * Math.PI) / 180)} y2={50 - 22 * Math.cos((ha * Math.PI) / 180)} stroke="#e5484d" strokeWidth="5" strokeLinecap="round" />
      <line x1="50" y1="50" x2={50 + 32 * Math.sin((ma * Math.PI) / 180)} y2={50 - 32 * Math.cos((ma * Math.PI) / 180)} stroke="#2e86de" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="50" cy="50" r="4" fill="#2d2a32" />
    </svg>
  );
}

/** Rosto com a boca na posição do som (inspirado no Método das Boquinhas). */
export function Mouth({ mouth }: { mouth: MouthShape }) {
  const lips = '#d6455d';
  let m;
  switch (mouth) {
    case 'aberta': m = <ellipse cx="50" cy="70" rx="14" ry="13" fill="#5a1d2a" stroke={lips} strokeWidth="4" />; break;
    case 'sorriso': m = <path d="M33 66 Q50 80 67 66 Q50 72 33 66 Z" fill="#5a1d2a" stroke={lips} strokeWidth="4" />; break;
    case 'redonda': m = <circle cx="50" cy="70" r="8" fill="#5a1d2a" stroke={lips} strokeWidth="5" />; break;
    case 'bico': m = <ellipse cx="50" cy="70" rx="6" ry="5" fill="#5a1d2a" stroke={lips} strokeWidth="6" />; break;
    case 'fechada': m = <path d="M36 70 Q50 64 64 70 Q50 76 36 70 Z" fill={lips} />; break;
    case 'dentes-labio': m = <g><rect x="40" y="63" width="20" height="6" fill="#fff" stroke="#ccc" /><path d="M36 71 Q50 77 64 71" stroke={lips} strokeWidth="5" fill="none" /></g>; break;
    case 'lingua': m = <g><ellipse cx="50" cy="70" rx="13" ry="9" fill="#5a1d2a" stroke={lips} strokeWidth="4" /><ellipse cx="50" cy="66" rx="7" ry="4" fill="#ff8fa3" /></g>; break;
    case 'chiado': m = <g><rect x="38" y="64" width="24" height="10" rx="4" fill="#fff" stroke={lips} strokeWidth="4" /><line x1="38" y1="69" x2="62" y2="69" stroke="#ccc" /></g>; break;
  }
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={`boca: ${mouth}`}>
      <circle cx="50" cy="50" r="46" fill="#ffd9b3" stroke="#e0a878" strokeWidth="3" />
      <circle cx="35" cy="40" r="5" fill="#2d2a32" /><circle cx="65" cy="40" r="5" fill="#2d2a32" />
      {m}
    </svg>
  );
}

export function TokenView({ token }: { token: Token }) {
  switch (token.kind) {
    case 'img': return <Img k={token.img} alt={token.img.replace(/_/g, ' ')} />;
    case 'shape': return <ShapeSvg shape={token.shape} color={token.color} size={token.size} />;
    case 'text': return <span className={`opt-text ${token.text.length > 14 ? 'long' : token.text.length > 6 ? 'mid' : ''}`} lang={token.lang === 'en' ? 'en' : 'pt-BR'}>{token.text}</span>;
    case 'color': return (
      <svg viewBox="0 0 100 100" role="img" aria-label={token.color}>
        <circle cx="50" cy="50" r="42" fill={COLORS[token.color]} stroke="rgba(0,0,0,0.2)" strokeWidth="3" />
      </svg>
    );
    case 'dots': return <Dots n={token.n} />;
    case 'clock': return <Clock h={token.h} m={token.m} />;
    case 'mouth': return <Mouth mouth={token.mouth} />;
  }
}

function money(values: number[]) {
  return (
    <div className="objects" aria-label="dinheiro">
      {values.map((v, i) => v >= 200 ? (
        <svg key={i} viewBox="0 0 120 60" width="120" height="60" role="img" aria-label={`nota de ${v / 100} reais`}>
          <rect x="2" y="2" width="116" height="56" rx="6" fill={({ 200: '#7fb3d5', 500: '#c39bd3', 1000: '#f1948a', 2000: '#f7dc6f', 5000: '#f0b27a', 10000: '#85c1e9' } as Record<number, string>)[v] ?? '#a3e4d7'} stroke="#555" />
          <text x="60" y="40" textAnchor="middle" fontSize="24" fontWeight="900" fill="#2d2a32">R$ {v / 100}</text>
        </svg>
      ) : (
        <svg key={i} viewBox="0 0 60 60" width="60" height="60" role="img" aria-label={v === 100 ? '1 real' : `${v} centavos`}>
          <circle cx="30" cy="30" r="27" fill={v === 100 ? '#f5c518' : v >= 25 ? '#e0c068' : '#d4a373'} stroke="#8b6b2b" strokeWidth="3" />
          <text x="30" y="36" textAnchor="middle" fontSize={v === 100 ? 16 : 17} fontWeight="900" fill="#4a3510">{v === 100 ? 'R$1' : `${v}¢`}</text>
        </svg>
      ))}
    </div>
  );
}

export function TenFrameView({ filled, total, small }: { filled: number; total: 10 | 20; small?: boolean }) {
  const frames = total === 20 ? 2 : 1;
  return (
    <div className="row" style={{ justifyContent: 'center' }}>
      {Array.from({ length: frames }, (_, f) => (
        <div key={f} className={`tenframe ${small ? 'small' : ''}`}>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="cell">{f * 10 + i < filled && <div className="ball" />}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function BaseTenView({ hundreds = 0, tens, ones, big }: { hundreds?: number; tens: number; ones: number; big?: boolean }) {
  return (
    <div className={`baseten ${big ? 'big' : ''}`} aria-label={`${hundreds} placas, ${tens} barras e ${ones} cubinhos`}>
      {hundreds > 0 && <div className="group">{Array.from({ length: hundreds }, (_, i) => <div key={i} className="bt-plate" />)}</div>}
      <div className="group">{Array.from({ length: tens }, (_, i) => <div key={i} className="bt-rod" />)}</div>
      <div className="group" style={{ maxWidth: 80 }}>{Array.from({ length: ones }, (_, i) => <div key={i} className="bt-cube" />)}</div>
    </div>
  );
}

export function VisualView({ v }: { v: Visual }) {
  switch (v.type) {
    case 'token':
      if (v.token.kind === 'text') {
        const long = v.token.text.length > 10;
        return <div className={long ? 'med-text' : 'big-text'} lang={v.token.lang === 'en' ? 'en' : 'pt-BR'}>{v.token.text}</div>;
      }
      return <div className="big-token"><TokenView token={v.token} /></div>;
    case 'objects':
      return <div className="objects">{Array.from({ length: v.n }, (_, i) => <Img key={i} k={v.img} />)}</div>;
    case 'sequence':
      return (
        <div className="seq">
          {v.items.map((t, i) => i === v.missing
            ? <div key={i} className="slot missing">?</div>
            : <div key={i} className="slot"><TokenView token={t} /></div>)}
        </div>
      );
    case 'money': return money(v.values);
    case 'vertical': {
      const w = Math.max(String(v.a).length, String(v.b).length) + 1;
      return (
        <div className="vertical" aria-label={`${v.a} ${v.op} ${v.b}`}>
          <div>{String(v.a).padStart(w, ' ')}</div>
          <div>{v.op}{String(v.b).padStart(w - 1, ' ')}</div>
          <div className="line">&nbsp;</div>
        </div>
      );
    }
    case 'equation': return <div className="big-text" style={{ fontFamily: 'var(--font)' }}>{v.text}</div>;
    case 'groups':
      return (
        <div className="row" style={{ justifyContent: 'center' }}>
          {Array.from({ length: v.groups }, (_, g) => (
            <div key={g} className="card objects" style={{ padding: 10, maxWidth: 170 }}>
              {Array.from({ length: v.each }, (_, i) => <Img key={i} k={v.img} size={34} />)}
            </div>
          ))}
        </div>
      );
    case 'baseten': return <BaseTenView hundreds={v.hundreds} tens={v.tens} ones={v.ones} />;
    case 'tenframe': return <TenFrameView filled={v.filled} total={v.total} />;
    case 'bars': {
      const max = Math.max(...v.data.map((d) => d.value), 1);
      return (
        <div className="card" style={{ display: 'flex', gap: 18, alignItems: 'flex-end', height: 260 }}>
          {v.data.map((d, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ fontWeight: 900 }}>{d.value}</div>
              <div style={{ width: 46, height: (d.value / max) * 160, background: ['#ef5d60', '#2e86de', '#2fb36d', '#8e5bd8', '#ff8a3d'][i % 5], borderRadius: '8px 8px 0 0' }} />
              <Img k={d.img} size={44} />
            </div>
          ))}
        </div>
      );
    }
    case 'shadow':
      return <div className="big-token"><img src={imgUrl(v.img)} alt="sombra" style={{ filter: 'brightness(0) opacity(0.75)' }} /></div>;
    case 'row':
      return <div className="seq">{v.tokens.map((t, i) => <div key={i} className="slot"><TokenView token={t} /></div>)}</div>;
    case 'symmetry': {
      const half = v.size / 2;
      return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${v.size}, 40px)`, gap: 3, background: '#3d3a44', padding: 5, borderRadius: 10 }}>
          {Array.from({ length: v.size * v.size }, (_, i) => {
            const r = Math.floor(i / v.size), c = i % v.size;
            const on = c < half && v.left[r * half + c];
            return <div key={i} style={{ width: 40, height: 40, borderRadius: 5, background: on ? '#8e5bd8' : c < half ? '#fff' : '#f2ece2', borderLeft: c === half ? '4px solid #ff8a3d' : undefined }} />;
          })}
        </div>
      );
    }
    case 'scene':
      return <div className="visual">{v.parts.map((p, i) => <VisualView key={i} v={p} />)}</div>;
  }
}
