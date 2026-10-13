# Degrau — app web (PWA)

Leitura (alfabetização em PT-BR), Matemática, Lógica e Inglês para crianças de 4 a 8 anos, com os princípios do
ensino individualizado (ponto de partida confortável, pequenos passos, domínio antes de avançar, tempo-padrão,
autocorreção, prática diária) e técnicas consagradas (fônico, consciência fonológica, alfabeto móvel, boquinhas,
CPA, Material Dourado, quadro de dez, TPR, shadowing, pensamento computacional).

## Rodar

```bash
cd app
npm install
npm run dev        # http://localhost:5173
npm test           # testes do motor adaptativo e de todo o currículo
npm run build      # gera dist/ (site estático — pode ser publicado em qualquer hospedagem)
npm run images     # (re)copia as figuras do Twemoji para public/img
```

## Estrutura

```
src/
  curriculum/   trilhas (leitura, matematica, logica, ingles), livros, tipos, validador
  engine/       orientador virtual: domínio, nivelamento, sessão diária, revisão espaçada, estatísticas
  components/   atividades reutilizáveis (Choose, NumberInput, Build, Trace, Speak, TenFrame, BaseTen, Sudoku, Robot, BookReader)
  screens/      perfis, cadastro (LGPD), nivelamento, início, lição, livros, álbum, área dos adultos/escola
  lib/          voz (TTS + reconhecimento), sons, armazenamento local, RNG
public/img/     figuras SVG (Twemoji, CC-BY 4.0)
```

Documentação de produto em `../docs/` (pesquisa, MRD e PRD do MVP).

## Privacidade
Sem servidor, anúncios ou rastreadores: tudo fica no `localStorage` do navegador. A área dos adultos (protegida por
portão parental) permite exportar e apagar os dados.

## Créditos
Figuras: [Twemoji](https://github.com/jdecked/twemoji) — © Twitter/X e colaboradores, licença CC-BY 4.0.
Não afiliado ao Kumon Institute of Education; usa apenas princípios pedagógicos gerais.
