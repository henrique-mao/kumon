import { hasImage } from '../data/images';
import type { Item, Skill, Token, Visual } from './types';

/** Valida um item gerado. Retorna lista de problemas (vazia = ok). Usado nos testes. */
export function validateItem(item: Item): string[] {
  const errs: string[] = [];
  const checkToken = (t: Token, where: string) => {
    if (t.kind === 'img' && !hasImage(t.img)) errs.push(`${where}: imagem inexistente "${t.img}"`);
    if (t.kind === 'text' && !t.text) errs.push(`${where}: texto vazio`);
  };
  const checkVisual = (v: Visual | undefined, where: string) => {
    if (!v) return;
    switch (v.type) {
      case 'token': checkToken(v.token, where); break;
      case 'objects': case 'shadow': if (!hasImage(v.img)) errs.push(`${where}: imagem inexistente "${v.img}"`); break;
      case 'groups': if (!hasImage(v.img)) errs.push(`${where}: imagem inexistente "${v.img}"`); break;
      case 'sequence':
        v.items.forEach((t, i) => checkToken(t, `${where}.seq[${i}]`));
        if (v.missing < 0 || v.missing >= v.items.length) errs.push(`${where}: missing fora da sequência`);
        break;
      case 'row': v.tokens.forEach((t, i) => checkToken(t, `${where}.row[${i}]`)); break;
      case 'bars': v.data.forEach((d) => { if (!hasImage(d.img)) errs.push(`${where}: imagem "${d.img}"`); }); break;
      case 'scene': v.parts.forEach((p, i) => checkVisual(p, `${where}.scene[${i}]`)); break;
      default: break;
    }
  };
  if (!item.prompt.length || item.prompt.some((s) => !s.text.trim())) errs.push('prompt vazio');
  if (item.hints.length !== 3) errs.push('precisa de 3 dicas');
  item.hints.forEach((h, i) => { if (!h.say.length) errs.push(`dica ${i} sem fala`); checkVisual(h.visual, `dica${i}`); });
  checkVisual(item.visual, 'visual');

  switch (item.kind) {
    case 'choose': {
      if (item.options.length < 2) errs.push('choose com menos de 2 opções');
      if (item.answer < 0 || item.answer >= item.options.length) errs.push('answer fora do intervalo');
      const keys = item.options.map((o) => JSON.stringify(o.token));
      if (new Set(keys).size !== keys.length) errs.push(`opções repetidas: ${keys.join(' | ')}`);
      item.options.forEach((o, i) => checkToken(o.token, `opção ${i}`));
      break;
    }
    case 'input':
      if (!Number.isInteger(item.answer) || item.answer < 0) errs.push('input: resposta deve ser inteiro ≥ 0');
      break;
    case 'build': {
      if (!item.solution.length) errs.push('build sem solução');
      const pool = [...item.tiles];
      for (const s of item.solution) {
        const i = pool.indexOf(s);
        if (i < 0) errs.push(`build: peça "${s}" não está nas peças`);
        else pool.splice(i, 1);
      }
      if (item.img && !hasImage(item.img)) errs.push(`build: imagem "${item.img}"`);
      break;
    }
    case 'trace':
      if (!item.glyph && !item.path) errs.push('trace sem glyph nem path');
      break;
    case 'speak':
      if (!item.expect.trim()) errs.push('speak sem texto esperado');
      break;
    case 'tenframe':
      if (item.target < 0 || item.target > item.total) errs.push('tenframe alvo inválido');
      break;
    case 'baseten':
      if (item.target < 1 || item.target > 999) errs.push('baseten alvo inválido');
      break;
    case 'sudoku': {
      if (item.grid.length !== 16 || item.solution.length !== 16) errs.push('sudoku precisa de 16 células');
      item.grid.forEach((g, i) => { if (g !== null && g !== item.solution[i]) errs.push('sudoku: pista diferente da solução'); });
      const ok = (cells: number[]) => new Set(cells.map((c) => item.solution[c])).size === 4;
      for (let r = 0; r < 4; r++) if (!ok([0, 1, 2, 3].map((c) => r * 4 + c))) errs.push('sudoku: linha inválida');
      for (let c = 0; c < 4; c++) if (!ok([0, 1, 2, 3].map((r) => r * 4 + c))) errs.push('sudoku: coluna inválida');
      for (const [br, bc] of [[0, 0], [0, 2], [2, 0], [2, 2]])
        if (!ok([0, 1, 4, 5].map((d) => (br + Math.floor(d / 4)) * 4 + bc + (d % 4)))) errs.push('sudoku: bloco inválido');
      item.symbols.forEach((s) => { if (!hasImage(s)) errs.push(`sudoku: imagem "${s}"`); });
      if (!item.grid.some((g) => g === null)) errs.push('sudoku sem casas vazias');
      break;
    }
    case 'robot': {
      const inside = ([x, y]: [number, number]) => x >= 0 && y >= 0 && x < item.size && y < item.size;
      if (!inside(item.start) || !inside(item.goal)) errs.push('robot: início/fim fora da grade');
      if (item.walls.some((w) => (w[0] === item.goal[0] && w[1] === item.goal[1]) || (w[0] === item.start[0] && w[1] === item.start[1])))
        errs.push('robot: parede em cima do início/fim');
      if (shortestPath(item) === null) errs.push('robot: sem caminho possível');
      else if (shortestPath(item)! > item.maxSteps) errs.push('robot: maxSteps menor que o caminho mínimo');
      break;
    }
    case 'book':
      if (!item.bookId) errs.push('book sem id');
      break;
  }
  return errs;
}

export function shortestPath(item: Extract<Item, { kind: 'robot' }>): number | null {
  const key = (x: number, y: number) => `${x},${y}`;
  const walls = new Set(item.walls.map(([x, y]) => key(x, y)));
  const seen = new Set([key(...item.start)]);
  let frontier: [number, number][] = [item.start];
  for (let d = 0; frontier.length; d++) {
    const nextF: [number, number][] = [];
    for (const [x, y] of frontier) {
      if (x === item.goal[0] && y === item.goal[1]) return d;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= item.size || ny >= item.size) continue;
        if (walls.has(key(nx, ny)) || seen.has(key(nx, ny))) continue;
        seen.add(key(nx, ny));
        nextF.push([nx, ny]);
      }
    }
    frontier = nextF;
  }
  return null;
}

export function validateSkill(skill: Skill, seeds = 40, makeRng: (s: number) => import('./types').Rng): string[] {
  const errs: string[] = [];
  if (!skill.bncc.length) errs.push(`${skill.id}: sem BNCC`);
  if (!skill.offlineTip) errs.push(`${skill.id}: sem dica offline`);
  for (let s = 1; s <= seeds; s++) {
    try {
      const item = skill.generate(makeRng(s * 7919));
      for (const e of validateItem(item)) errs.push(`${skill.id} (seed ${s}): ${e}`);
    } catch (e) {
      errs.push(`${skill.id} (seed ${s}): exceção ${(e as Error).message}`);
    }
  }
  return errs;
}
