// Copia os SVGs do Twemoji usados pelo app para public/img/<chave>.svg.
// Uso: npm run images
import { readFileSync, copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'src/data/images.ts'), 'utf8');
const twemojiDir = join(root, 'node_modules/@twemoji/svg');
const outDir = join(root, 'public/img');
mkdirSync(outDir, { recursive: true });

const entries = [...src.matchAll(/(\w+):\s*'([^']+)'/g)];
let missing = 0;
for (const [, key, emoji] of entries) {
  const file = [...emoji].map((c) => c.codePointAt(0).toString(16)).filter((cp) => cp !== 'fe0f').join('-');
  const from = join(twemojiDir, `${file}.svg`);
  if (!existsSync(from)) {
    console.error(`Sem SVG para ${key} (${emoji} → ${file})`);
    missing++;
    continue;
  }
  copyFileSync(from, join(outDir, `${key}.svg`));
}
console.log(`${entries.length - missing} imagens copiadas para public/img`);
if (missing) process.exit(1);
