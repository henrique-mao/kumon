# PRD do MVP — Degrau (versão aprimorada e implementada)

Este documento registra o que o MVP em `app/` implementa a partir do MRD (`02-MRD-prompt-app-degrau.md`)
e as **melhorias** incorporadas durante a construção. Serve como PRD vivo do produto.

## 1. Premissas assumidas
| # | Premissa | Motivo |
|---|----------|--------|
| P1 | MVP 100% no navegador (PWA), sem servidor; dados no `localStorage`. | Privacidade máxima por padrão (LGPD art. 14), custo zero de infraestrutura, funciona offline. |
| P2 | Narração por TTS do navegador (pt-BR / en-US) com seleção de voz. | Áudios gravados por locutores ficam para a fase 2 (o MRD prevê). |
| P3 | Figuras do Twemoji (CC-BY 4.0) copiadas para `public/img`. | Imagens consistentes, leves (SVG), sem dependência de rede. |
| P4 | Reconhecimento de voz é **opcional** e nunca penaliza. | Vozes infantis e sotaques regionais têm reconhecimento instável. |
| P5 | Escola = painel da turma com as crianças do mesmo dispositivo (tablet da sala). | Sem backend no MVP; sincronização multi-dispositivo na fase 2. |

## 2. Princípios do Kumon → funcionalidades implementadas
| Princípio | Implementação | Onde |
|-----------|---------------|------|
| Ensino individualizado | Ponteiro por trilha + estado por habilidade, por criança | `engine/model.ts` |
| Ponto de partida confortável | Nivelamento adaptativo (2 itens por degrau, sobe/desce) e início **1 degrau abaixo** do limite | `engine/placement.ts`, `screens/Placement.tsx` |
| Pequenos passos | 70+ habilidades em 4 trilhas, ordenadas, uma novidade por vez | `curriculum/*.ts` |
| Domínio antes de avançar | ≥ 90% de acerto de primeira **e** tempo-padrão, em **2 sessões** | `engine/mastery.ts` |
| Tempo-padrão (fluência) | Mediana do tempo por item vs `stdTimeSec` da habilidade; modo "sem cronômetro" para 4–5 anos | `mastery.ts`, Configurações |
| Autocorreção até 100% | Erro → dica 1 → dica 2 → resposta modelada; o item **volta no fim do bloco** | `components/ItemRunner.tsx`, `screens/Session.tsx` |
| Repetição | Bloco repetido enquanto não há domínio; retrocesso após 2 sessões < 60% | `mastery.ts` |
| Prática diária curta | Sessão de 10/15/20 min por idade, limite diário configurável | `engine/session.ts` |
| Orientador | "Orientador virtual" com **decisões explicadas** em linguagem simples | aba "Decisões do orientador" |
| Elogio e reconhecimento | Elogio ao esforço, estrelas por bloco, figurinha por lição, **certificado** por degrau | `Album.tsx`, `Certificate.tsx` |
| Envolvimento familiar | Relatório semanal copiável/compartilhável, dica offline de 5 min ao fim de cada lição, modo "ler junto" | `Parents.tsx`, `Library.tsx` |
| Leitura como hábito | Biblioteca graduada de livros decodificáveis com destaque palavra a palavra | `curriculum/books.ts`, `BookReader.tsx` |

## 3. Tipos de atividade (componentes reutilizáveis)
| Tipo | Técnica | Componente |
|------|---------|------------|
| Tocar e escolher | Consciência fonológica, som+imagem, padrões | `Choose` |
| Teclado numérico | "Escreva a resposta" das folhas Kumon, fluência | `NumberInput` |
| Alfabeto móvel | Montessori, síntese fonêmica/silábica, ditado | `Build` |
| Traçado com o dedo | Letras de lixa / pré-escrita (cobertura + precisão) | `Trace` |
| Falar | Shadowing, leitura oral, palavras por minuto | `Speak` |
| Quadro de dez | Composição do 10, subitização | `TenFrame` |
| Material Dourado | Valor posicional (placas, barras, cubinhos) | `BaseTen` |
| Sudoku 4x4 | Raciocínio dedutivo | `Sudoku` |
| Robô com setas | Pensamento computacional: sequência e depuração | `Robot` |
| Livro | Decodificáveis, leitura dialógica, compreensão | `BookReader` |
| Boquinhas | Rosto com a articulação do som (dicas) | `Mouth` em `Tokens.tsx` |

## 4. Melhorias em relação ao MRD original
1. **Tempo medido a partir do fim da instrução falada** — a criança que não lê não é penalizada pelo tempo do áudio.
2. **Mediana** (e não média) do tempo por item para o tempo-padrão — robusta a distrações pontuais.
3. **Primeira tentativa sem dica** é o critério de acerto; dica pedida conta como apoio (registrado).
4. **Item errado volta uma única vez** no fim do bloco (autocorreção sem loop infinito).
5. **Detecção de frustração** (3 erros seguidos) → pausa com escolha da criança: continuar, algo mais fácil, ou parar.
6. **Repetição da instrução após 25 s** sem interação (atenção na primeira infância).
7. **Padrões de erro** (ex.: escolheu BATO no lugar de PATO 3x) viram alerta para os pais, **sem diagnóstico**.
8. **Revisões do nivelamento escalonadas** (1–7 dias) para não sobrecarregar a primeira semana.
9. **Livros liberados por grafema aprendido**, validados automaticamente nos testes (decodificabilidade).
10. **Recompensas previsíveis** (1 figurinha por lição), sem sorteio, sem loja, sem perda de conquistas por faltar um dia.
11. **Painel da turma** com grupos por necessidade, mapa de calor por habilidade e exportação CSV com códigos BNCC.
12. **Portabilidade e exclusão** de dados com um toque (LGPD).

## 5. Critérios de aceite principais (Gherkin)
```gherkin
Funcionalidade: Domínio antes do avanço
  Cenário: avançar após duas sessões de domínio
    Dado que Theo está na habilidade "Sílabas com M"
    Quando ele acerta 90% de primeira dentro do tempo-padrão em 2 sessões
    Então a habilidade fica "dominada"
    E a próxima habilidade da trilha é liberada
    E uma revisão é agendada para o dia seguinte

  Cenário: voltar um degrau
    Dado que Ana acertou menos de 60% em "Dígrafos LH/NH" em duas sessões seguidas
    Então o orientador volta para a habilidade anterior
    E registra a decisão explicada para os adultos

Funcionalidade: Autocorreção
  Cenário: erro com dicas progressivas
    Dado um item de escolha
    Quando a criança erra
    Então a narração dá a dica 1
    Quando erra de novo
    Então mostra a dica 2 (demonstração)
    Quando erra a terceira vez
    Então a resposta correta pisca (resposta modelada)
    E o item volta no fim do bloco
```

## 6. Fase 2 — implementada
| Melhoria | Como funciona | Onde |
|----------|---------------|------|
| **Vozes da família** | O adulto grava os sons ("mmmm"), sílabas e palavras que a trilha de leitura realmente fala (lista extraída do currículo). A narração passa a usar a gravação no lugar da voz sintética, em todas as atividades. | aba "Vozes da família"; `lib/audioStore.ts`, `lib/speech.ts` |
| **Gravações de leitura** | Nos livros, a criança toca em "🎙️ Gravar minha leitura"; os pais ouvem a evolução da fluência por data. | `BookReader.tsx`; aba "Gravações de leitura" |
| **Palavras da família** (palavras geradoras — Paulo Freire) | Nome da criança, família, pet... com separação silábica automática (editável) e figura opcional. Entram na lição diária como bloco "Palavras especiais" (montar com sílabas ou letras, conforme o nível; achar a palavra). | aba "Palavras da família"; `curriculum/familia.ts`, `curriculum/escrita.ts` |
| **Sondagem de escrita** (psicogênese) | Listas clássicas (polissílaba → monossílaba + frase); o educador digita a escrita da criança e o app **sugere** a hipótese (pré-silábica → alfabética); histórico por criança, coluna no painel da turma e linha no relatório semanal. | aba "Sondagem de escrita"; `curriculum/escrita.ts` |
| **Modelo estatístico (BKT)** | Bayesian Knowledge Tracing estima a probabilidade de domínio item a item. Exibido no progresso; opcionalmente vira critério extra de avanço ("Regras + BKT ≥ 90%"), permitindo comparar os dois critérios. | `engine/bkt.ts`, `engine/mastery.ts`; Configurações |
| **Dois aparelhos sem servidor** | Exportar em um aparelho e importar no outro: crianças novas são adicionadas e as existentes **mescladas** (históricos unidos, progresso mais avançado mantido). | `lib/merge.ts`; Configurações → Dados |
| **Legendas que não entregam a resposta** | Em ditados e escolhas entre palavras escritas, a legenda mostra "🔊 …" no lugar da palavra-alvo. | `components/ItemRunner.tsx` |

## 7. Próximos passos (fase 3)
- Narração profissional gravada por locutores (sotaques regionais) e reconhecimento de voz infantil treinado em PT-BR.
- Backend opcional (contas de escola, SSO, sincronização automática), mantendo o modo local.
- Teste A/B de aprendizagem: regras vs. regras + BKT, com estudo de eficácia em parceria com universidade.
- CMS para pedagogos com revisão humana de itens; Libras.
