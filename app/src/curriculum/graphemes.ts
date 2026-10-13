// Tokenizador de grafemas do português brasileiro — usado para checar se uma palavra é
// "decodificável" com os grafemas já ensinados (livros decodificáveis da trilha de leitura).
//
// Unidades produzidas (todas em minúsculas):
//   Vogais orais .......... 'a' 'e' 'i' 'o' 'u'  (á à â é ê í ó ô ú ü contam como a vogal base)
//   Vogais com til ........ 'ã' 'õ'
//   Vogal nasal + m/n ..... 'am' 'an' 'em' 'en' 'im' 'in' 'om' 'on' 'um' 'un'
//                           (só quando o m/n fecha a sílaba: antes de consoante ou no fim; nunca antes de 'h')
//   Dígrafos .............. 'ch' 'lh' 'nh' 'rr' 'ss' 'qu' (qu + vogal) 'gu' (gu antes de e/i)
//   C e G suaves .......... 'ce' (c antes de e/i: "cebola", "cinema"), 'ge' (g antes de e/i: "gelo", "girafa")
//                           — a unidade só representa a consoante; a vogal seguinte vira outra unidade.
//   'ç' ................... cê-cedilha
//   R ..................... 'R'  = R forte (início de palavra ou depois de n/l/s: "rato", "honra")
//                           'r'  = R fraco entre vogais ("pera")
//                           'r_' = R em final de sílaba ("mar", "porta")
//                           'r2' = R de encontro consonantal ("prato", "cobra")
//   S ..................... 's'   = S com som de S (início, ou depois de consoante: "sapo", "pulso")
//                           's_z' = S entre vogais, som de Z ("casa")
//                           's_'  = S em final de sílaba ("pasta", "lápis")
//   L ..................... 'l'   = L comum; 'l_' = L em final de sílaba ("sol", "sal"); 'l2' = encontro ("flor", "bloco")
//   Demais letras ......... a própria letra ('m','n','p','b','t','d','f','v','j','z','c','g','x','h','k','w','y')

const ACCENT_MAP: Record<string, string> = {
  á: 'a', à: 'a', â: 'a', é: 'e', ê: 'e', í: 'i', î: 'i', ó: 'o', ô: 'o', ú: 'u', û: 'u', ü: 'u',
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'ã', 'õ']);
/** Consoantes que podem formar encontro com r/l (pr, br, tr, dr, cr, gr, fr, vr, pl, bl, cl, gl, fl, tl). */
const CLUSTER_HEADS = new Set(['p', 'b', 't', 'd', 'c', 'g', 'f', 'v', 'k']);

const isVowel = (c: string | undefined) => c !== undefined && VOWELS.has(c);

/** Normaliza: minúsculas, acentos agudo/grave/circunflexo removidos (ã, õ e ç são mantidos). */
export function normalizeWord(word: string): string {
  return [...word.toLowerCase()]
    .map((c) => ACCENT_MAP[c] ?? c)
    .filter((c) => /[a-zãõç]/.test(c))
    .join('');
}

/** Divide uma palavra em grafemas do PT-BR (ver tabela no topo do arquivo). */
export function toGraphemes(word: string): string[] {
  const w = [...normalizeWord(word)];
  const out: string[] = [];
  let i = 0;
  while (i < w.length) {
    const c = w[i];
    const prev = w[i - 1];
    const next = w[i + 1];
    const next2 = w[i + 2];

    // Vogal nasal com m/n em final de sílaba (am, en, im, om, um...).
    if ('aeiou'.includes(c) && (next === 'm' || next === 'n') && !isVowel(next2) && next2 !== 'h') {
      out.push(c + next);
      i += 2;
      continue;
    }
    switch (c) {
      case 'c':
        if (next === 'h') { out.push('ch'); i += 2; continue; }
        out.push(next === 'e' || next === 'i' ? 'ce' : 'c');
        break;
      case 'l':
        if (next === 'h') { out.push('lh'); i += 2; continue; }
        if (!isVowel(next)) out.push('l_');
        else if (prev !== undefined && CLUSTER_HEADS.has(prev)) out.push('l2');
        else out.push('l');
        break;
      case 'n':
        if (next === 'h') { out.push('nh'); i += 2; continue; }
        out.push('n');
        break;
      case 'q':
        if (next === 'u') { out.push('qu'); i += 2; continue; }
        out.push('q');
        break;
      case 'g':
        if (next === 'u' && (next2 === 'e' || next2 === 'i')) { out.push('gu'); i += 2; continue; }
        out.push(next === 'e' || next === 'i' ? 'ge' : 'g');
        break;
      case 'r':
        if (next === 'r') { out.push('rr'); i += 2; continue; }
        if (i === 0 || prev === 'n' || prev === 'l' || prev === 's') out.push('R');
        else if (CLUSTER_HEADS.has(prev) && isVowel(next)) out.push('r2');
        else if (isVowel(next)) out.push('r');
        else out.push('r_');
        break;
      case 's':
        if (next === 's') { out.push('ss'); i += 2; continue; }
        if (i > 0 && isVowel(prev) && isVowel(next)) out.push('s_z');
        else if (i > 0 && !isVowel(next)) out.push('s_');
        else out.push('s');
        break;
      default:
        out.push(c);
    }
    i += 1;
  }
  return out;
}

/** Palavra decodificável = todos os seus grafemas estão no conjunto `known`. */
export function isDecodable(word: string, known: Set<string>): boolean {
  const g = toGraphemes(word);
  return g.length > 0 && g.every((x) => known.has(x));
}

/**
 * Palavras de alta frequência liberadas nos livros mesmo antes de todos os seus grafemas
 * serem ensinados (lidas globalmente, por memorização — BNCC EF12LP01).
 */
export const HIGH_FREQ_WORDS = new Set([
  'é', 'e', 'o', 'a', 'os', 'as', 'do', 'da', 'dos', 'das', 'no', 'na', 'nos', 'nas', 'um', 'uma', 'de', 'em', 'com', 'que', 'ele', 'ela',
]);

/** Separa um texto em palavras (minúsculas, sem pontuação). */
export function wordsOf(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-zà-úãõç]+/i)
    .filter(Boolean);
}
