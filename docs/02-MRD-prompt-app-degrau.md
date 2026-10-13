# MRD Prompt — Aplicativo Web "Degrau"
### Leitura, Lógica, Matemática e Inglês para crianças de 4 a 8 anos (Português Brasileiro)

> **Como usar:** copie todo o bloco abaixo (da linha `=== INÍCIO DO PROMPT ===` até `=== FIM DO PROMPT ===`)
> e cole em um assistente de IA, numa ferramenta de geração de produto/código, ou entregue ao time de produto.
> O prompt já traz o **MRD completo** (requisitos de mercado) e pede como saída o PRD, a arquitetura e o MVP.
> A base pedagógica está em `01-pesquisa-tecnicas-kumon-e-alfabetizacao.md`.

---

```text
=== INÍCIO DO PROMPT ===

# PAPEL
Você é, ao mesmo tempo:
(1) Gerente de Produto sênior especializado em EdTech infantil;
(2) Pedagogo(a) especialista em alfabetização em Português Brasileiro (método fônico, consciência
    fonológica, psicogênese da escrita) e em ensino de matemática na primeira infância (CPA/Singapura,
    Material Dourado);
(3) Especialista no Método Kumon (ensino individualizado, pequenos passos, domínio antes do avanço);
(4) Professor(a) de inglês para crianças brasileiras (TPR, phonics, som + imagem);
(5) Designer de UX para crianças de 4 a 8 anos e arquiteto(a) de software web.

Responda sempre em Português Brasileiro. Quando algo não estiver definido neste MRD, tome a decisão
mais segura para a criança, registre-a como "Premissa" e siga em frente.

# 1. VISÃO DO PRODUTO
Nome provisório: **Degrau** — "um passinho por dia".
Um aplicativo web (PWA, funciona em tablet, celular e computador) que ensina crianças de 4 a 8 anos a
**ler e escrever em português**, a **pensar logicamente**, a **calcular** e a **dar os primeiros passos
em inglês**, com sessões diárias curtas, trilha 100% individualizada e um "orientador virtual" que
decide quando repetir e quando avançar — inspirado nos princípios do Método Kumon, combinados com
ciência da leitura e ludicidade.

Declaração de posicionamento:
Para famílias e escolas brasileiras com crianças de 4 a 8 anos, que querem alfabetização sólida e
base matemática sem lacunas, o Degrau é o app de aprendizagem diária que leva cada criança do ponto em
que ela está, um degrau de cada vez, até o domínio. Diferente de apps genéricos traduzidos, o Degrau é
nativo em português brasileiro, segue a BNCC e aplica a disciplina do domínio progressivo de forma
lúdica — sem anúncios e sem manipulação.

Restrição de marca: NÃO usar o nome "Kumon", logotipos, nomes de estágios (7A, 6A...) ou conteúdo de
apostilas proprietárias. Usar apenas os princípios pedagógicos.

# 2. PROBLEMA E OPORTUNIDADE DE MERCADO
## 2.1 Problema
- Parte significativa das crianças brasileiras não está plenamente alfabetizada ao fim do 2º ano
  (meta da BNCC e do Compromisso Nacional Criança Alfabetizada); a pandemia ampliou essas lacunas.
- Métodos de reforço presenciais com prática diária individualizada (ex.: Kumon) são eficazes,
  mas custam caro, exigem deslocamento e não alcançam a maioria das famílias.
- A maioria dos apps infantis de qualidade é estrangeira e traduzida: não ensina o código do português
  (sílabas, dígrafos, nasalização, letra bastão) e trata o inglês como língua materna.
- Muitos apps gratuitos competem pela atenção com anúncios, recompensas aleatórias e tempo de tela
  infinito — o oposto do que pais e escolas querem.

## 2.2 Oportunidade
- Um app nativo em PT-BR, que cubra as quatro áreas, adaptativo, com sessões curtas e relatórios claros.
- Dois canais: B2C (famílias, freemium/assinatura) e B2B/B2G (escolas privadas, redes municipais).
- Diferenciais defensáveis: currículo fônico do PT-BR, banco de itens com metadados de habilidade,
  motor de domínio, reconhecimento de voz infantil em português com variantes regionais.

## 2.3 Tamanho de mercado (a ser validado)
Estime TAM/SAM/SOM usando: nº de crianças de 4–8 anos no Brasil (dados IBGE/Censo Escolar INEP),
% de domicílios com internet e dispositivo, gasto médio das famílias com reforço escolar, nº de escolas
privadas de Educação Infantil e Anos Iniciais. Apresente premissas e fontes.

# 3. PÚBLICO-ALVO E PERSONAS
## 3.1 Usuários primários (crianças)
| Persona | Idade | Perfil | Necessidade |
|---|---|---|---|
| **Lia, a exploradora** | 4–5 | Não lê; reconhece algumas letras; atenção de 5–10 min | Tudo por áudio, imagem e toque; consciência fonológica, contagem, padrões, vocabulário em inglês. |
| **Theo, o curioso** | 6 | 1º ano; lê sílabas simples com esforço | Decodificar com fluência, somar e subtrair até 20, frases simples em inglês. |
| **Ana, a quase-leitora** | 7–8 | 2º–3º ano; lê, mas devagar e sem compreensão | Fluência, compreensão, ortografia, cálculo com reserva, tabuada, problemas, leitura em inglês. |
| **Davi, precisa de apoio** | 5–8 | Sinais de dislexia, TDAH ou TEA | Modo multissensorial, menos estímulos, tempos flexíveis, fonte acessível. |

## 3.2 Usuários secundários (adultos)
- **Mãe/pai/responsável**: quer saber "meu filho está aprendendo?", pouco tempo, quer controle de tela.
- **Professor(a)/coordenação**: quer ver a turma, agrupar por necessidade e alinhar à BNCC.
- **Gestor(a) de rede**: quer indicadores agregados de alfabetização.

# 4. PRINCÍPIOS PEDAGÓGICOS (NÃO NEGOCIÁVEIS)
1. **Ponto de partida confortável:** nivelamento lúdico inicial; começar 1–2 degraus ABAIXO do nível
   detectado para garantir sucesso e confiança.
2. **Pequenos passos:** cada atividade introduz no máximo UMA novidade.
3. **Domínio antes do avanço:** avançar somente com ≥ 90–100% de acerto e fluência adequada
   (tempo médio por item dentro do "tempo-padrão" da habilidade) em 2 sessões distintas.
4. **Autocorreção:** errar faz parte; erro → dica em 3 níveis (pista leve → demonstração → resposta
   modelada) → o item volta ao fim do bloco. Nunca há "game over" nem perda de vidas.
5. **Prática diária curta:** 10 min (4–5 anos), 15 min (6 anos), 20 min (7–8 anos), configurável;
   o app sugere parar ao fim da sessão.
6. **CPA:** todo conceito de matemática passa por Concreto (manipulável na tela) → Pictórico → Abstrato.
7. **Fônico sistemático em PT-BR**, com consciência fonológica antes e durante.
8. **Inglês por som + imagem**, sem tradução obrigatória; phonics em inglês só após a criança decodificar
   em português (~6+ anos).
9. **Revisão espaçada** automática do que já foi dominado (intercalada nas sessões).
10. **Elogio ao esforço e à estratégia**, nunca à "inteligência"; sem comparação entre crianças.
11. **Áudio primeiro:** para quem não lê, toda instrução é falada; texto só como apoio.

# 5. ESCOPO CURRICULAR (TRILHAS)
Cada trilha é dividida em **Degraus** (níveis), cada Degrau em **Habilidades**, cada habilidade em
**Blocos** de 5–10 itens. Alinhe cada habilidade a um código da BNCC (EI03ET..., EF01LP..., EF01MA...).

## 5.1 Trilha LEITURA E ESCRITA (Português Brasileiro)
- **D0 — Ouvir e falar (4 anos):** vocabulário com figuras, rimas, cantigas, contar sílabas com palmas,
  som inicial igual, histórias ouvidas com perguntas.
- **D1 — Traçado e letras:** traçado de linhas (retas, curvas, zigue-zague, labirintos) com o dedo/caneta;
  nome da criança; vogais A E I O U (som, traçado em letra bastão, palavras que começam com...).
- **D2 — Primeiros sons:** consoantes contínuas M, N, L, S, F, V, Z, J → sílabas (MA, ME, MI...) →
  palavras CV-CV (MALA, VOVÔ, SUCO). "Alfabeto móvel" digital: arrastar letras para formar a palavra ditada.
- **D3 — Mais consoantes:** P, B, T, D, C/QU (ca, co, cu, que, qui), G/GU, R (inicial e entre vogais),
  pares surda/sonora (P/B, T/D, F/V) com discriminação auditiva.
- **D4 — Sílabas complexas:** CVC (MAR, SOL, PASTA), CCV (PRATO, BLOCO, FLOR), dígrafos CH, LH, NH, RR, SS.
- **D5 — Nasalização e casos especiais:** ã/õ, AM/AN/EM/EN/IM/OM/UM, Ç, S com som de Z, X (4 sons),
  H mudo, L final com som de U, acentos.
- **D6 — Fluência:** leitura de frases e livros decodificáveis (só grafemas já ensinados), leitura
  repetida, medição de palavras corretas por minuto via reconhecimento de voz.
- **D7 — Compreensão:** perguntas literais (quem? onde? o quê?) → inferenciais (por quê?) → sequência de
  fatos → reconto; vocabulário em contexto.
- **D8 — Escrita:** ditado de palavras e frases, ortografia (r/rr, s/ss/ç, m antes de p/b), segmentação
  de palavras, produção de frase a partir de imagem; letra minúscula e introdução à cursiva.
- **Diagnóstico de escrita** (opcional, para professores): classificar a escrita espontânea nas fases
  pré-silábica, silábica, silábico-alfabética e alfabética (Ferreiro & Teberosky).
- Biblioteca graduada com livros curtos ilustrados por nível, narração com destaque palavra a palavra
  e perguntas de leitura dialógica para os pais.

## 5.2 Trilha MATEMÁTICA
- **M0 — Quantidades (4 anos):** subitização (até 5), contar objetos até 10 → 30, correspondência
  um-a-um, mais/menos/igual.
- **M1 — Números:** ler, ordenar e escrever numerais até 50 → 120; quadro numérico; antecessor/sucessor.
- **M2 — Somar pequeno:** +1, +2, +3 (contar a partir do maior), quadro de dez, composição do 10,
  dobros.
- **M3 — Fatos básicos:** adição e subtração até 20 com fluência (revisão espaçada de fatos).
- **M4 — Valor posicional:** dezenas e unidades com Material Dourado digital; até 100 → 1000.
- **M5 — Algoritmos:** adição e subtração verticais com reserva e recurso (visualizando a troca no
  Material Dourado).
- **M6 — Multiplicação e divisão:** grupos iguais, arranjos, tabuadas 2, 5, 10 → todas; divisão como
  repartir.
- **M7 — Grandezas e medidas:** dinheiro (moedas e cédulas de real), horas (relógio analógico/digital),
  calendário, comprimento, massa e capacidade com unidades não padronizadas → padronizadas.
- **M8 — Geometria e dados:** formas planas e espaciais, posição/direção, tabelas e gráficos de barras
  simples.
- **Problemas:** problemas narrados em áudio; a partir de 7 anos, modelo de barras (Singapura).
- **Módulo opcional 7–8 anos:** soroban digital para cálculo mental.

## 5.3 Trilha LÓGICA
- **L0 — Observação:** igual/diferente, sombra correspondente, jogo da memória, encontre os erros.
- **L1 — Classificação:** por cor, forma, tamanho, função; "qual não pertence?"; diagramas de Venn simples.
- **L2 — Padrões e sequências:** ABAB → AABB → ABC → crescentes; completar sequências de figuras e números.
- **L3 — Espacial:** quebra-cabeças, tangram, simetria, rotação, labirintos.
- **L4 — Raciocínio dedutivo:** sudoku 4x4 com figuras → números; "se... então"; enigmas de pistas.
- **L5 — Pensamento computacional desplugado:** guiar um robô com setas (sequência), repetir (laços),
  "encontre o erro no caminho" (depuração), condições simples (se for vermelho, vire).

## 5.4 Trilha INGLÊS
- **E0 — Som e imagem (4–5 anos):** vocabulário temático (cores, números 1–10, animais, família, corpo,
  comida, brinquedos) com áudio de falante nativo + figura; sem tradução; músicas e chants.
- **E1 — TPR:** comandos (jump, clap, sit down, touch your nose); a criança toca/arrasta o personagem
  correto ou executa a ação (câmera desativada por padrão).
- **E2 — Frases-padrão:** This is a..., I like..., I have..., What color is it?, How many...?; histórias
  repetitivas.
- **E3 — Phonics em inglês (6+ anos, após decodificar em PT-BR):** sons das letras, CVC (cat, dog, sun),
  blending, sight words (Dolch pré-primer/primer).
- **E4 — Leitura:** frases e mini-livros, compreensão com figuras.
- **Pronúncia para brasileiros:** treinos específicos de TH, H aspirado, vogais longas/curtas, evitar a
  vogal epentética ("hot-i dog-i"); feedback por voz tolerante.
- Cognatos (animal, banana, hospital) como ponte; alerta lúdico de falsos cognatos para 7–8 anos.

# 6. REQUISITOS FUNCIONAIS (com prioridade MoSCoW)
## 6.1 Criança
- [M] Onboarding sem leitura: escolher avatar/personagem-guia, ouvir o próprio nome.
- [M] Nivelamento lúdico por trilha (5–8 min cada, pode ser feito em dias diferentes).
- [M] **Sessão diária** montada pelo orientador virtual: mistura de trilhas (ex.: 40% leitura, 30% mat.,
  15% lógica, 15% inglês — configurável), com aquecimento (revisão), conteúdo novo e fechamento.
- [M] Tipos de interação: tocar, arrastar e soltar, traçar com o dedo/caneta (com reconhecimento de
  traçado), falar (reconhecimento de voz), ouvir e escolher, montar palavras (alfabeto móvel),
  manipular objetos (Material Dourado, quadro de dez, blocos).
- [M] Dicas em 3 níveis e repetição do item errado ao fim do bloco.
- [M] Botão "ouvir de novo" em toda tela; instrução sempre em áudio.
- [M] Recompensas intrínsecas e previsíveis: estrelas por bloco concluído, "degrau conquistado" com
  certificado imprimível, álbum de figurinhas/coleção, personalização do avatar. Sem loot boxes, sem
  recompensas aleatórias, sem compras pela criança.
- [S] Biblioteca de livros graduados com narração e destaque de palavra.
- [S] Modo offline (PWA) para sessões já baixadas, com sincronização posterior.
- [S] Leitura em voz alta gravada (a família pode ouvir a evolução).
- [C] Modo "dupla" (irmãos/colegas no mesmo dispositivo, alternando vezes).

## 6.2 Orientador virtual (motor adaptativo)
- [M] Modelo de domínio por habilidade (ex.: Bayesian Knowledge Tracing ou Elo por item/habilidade),
  combinando acurácia + tempo de resposta + uso de dicas.
- [M] Regras explícitas estilo "orientador": avança quando atinge critério em 2 sessões; repete o bloco
  quando acerto < 80%; volta um passo quando < 60% duas vezes seguidas; insere revisão espaçada
  (1, 3, 7, 14, 30 dias) de habilidades dominadas.
- [M] Detecção de frustração (erros consecutivos, toques aleatórios, inatividade) → reduzir dificuldade,
  oferecer pausa ou atividade favorita.
- [M] Explicabilidade: toda decisão gera uma frase legível para o adulto ("Theo repetiu 'sílabas com R'
  porque acertou 70%; amanhã revisará com dicas").
- [S] Detecção de padrões de erro (ex.: troca P/B recorrente, inversão de dígitos) com sugestão ao adulto.
- [C] Sinais de alerta para possível dislexia/discalculia, sempre como sugestão de procurar profissional,
  nunca como diagnóstico.

## 6.3 Família (área dos pais, protegida por "portão parental")
- [M] Cadastro do responsável e de até 4 crianças por conta.
- [M] Painel: tempo de prática, sequência de dias, habilidades dominadas/em progresso/com dificuldade
  por trilha, em linguagem simples, com mapa de degraus.
- [M] Controle de tempo diário, horários permitidos e escolha de trilhas.
- [M] Relatório semanal (e-mail/WhatsApp opcional com consentimento) com 1 conquista + 1 dica de
  atividade offline de 5 min (ex.: "procurem objetos que começam com /m/ na cozinha").
- [S] Modo "fazer junto": roteiro de leitura dialógica para o adulto.
- [S] Configurar sotaque da narração (neutro, nordestino, carioca, paulista, sulista).

## 6.4 Escola (B2B)
- [M] Painel do professor: turma, agrupamento automático por necessidade, mapa de calor de habilidades
  alinhadas à BNCC, exportação CSV/PDF.
- [M] Atribuição de trilhas/habilidades para a turma ou grupos.
- [S] Login simplificado para crianças (QR code ou cartão de figuras), SSO Google Workspace/Microsoft.
- [S] Registro de sondagem de escrita (psicogênese) feita pelo professor.
- [C] Painel de rede municipal com indicadores agregados e anonimizados.

## 6.5 Conteúdo e administração
- [M] CMS para pedagogos: criar itens com metadados (trilha, degrau, habilidade, código BNCC, grafemas
  exigidos, dificuldade, tempo-padrão, áudios, imagens, dicas).
- [M] Validação automática de livros decodificáveis (só usar grafemas já ensinados até aquele degrau).
- [M] Fluxo de revisão pedagógica (rascunho → revisão → publicado) e versionamento.
- [S] Geração assistida por IA de itens/variações, SEMPRE com revisão humana antes de publicar.
- [S] Testes A/B de itens com métricas de aprendizagem (não só engajamento).

# 7. REQUISITOS NÃO FUNCIONAIS
## 7.1 UX para 4–8 anos
- Alvos de toque ≥ 64 px (ideal 72–96 px); uma instrução por tela; sem rolagem na tela da criança.
- Navegação por ícones e áudio; nenhum link externo ou menu complexo acessível à criança.
- Feedback imediato (< 200 ms) com som e animação curta; animações de comemoração ≤ 2 s.
- Fonte sem serifa de alta legibilidade, letra bastão (maiúscula) nos degraus iniciais, com "a" e "g" de
  forma escolar; tamanho mínimo 32 px para leitura.
- Paleta acolhedora, alto contraste (WCAG 2.2 AA mínimo), sem piscar > 3 vezes/s.
- Personagem-guia brasileiro e diverso (regiões, etnias, famílias, deficiências representadas).
- Modo calmo (menos animação/som) para crianças sensíveis a estímulos.

## 7.2 Acessibilidade e inclusão
- Opção de fonte para dislexia, espaçamento ampliado, velocidade de narração ajustável.
- Tempo ilimitado por padrão para crianças que precisam (fluência medida, mas não punida).
- Suporte a leitor de tela na área dos adultos; legendas para todo áudio.
- Ponte futura com Libras (vídeos de intérprete) — [C].

## 7.3 Privacidade, segurança e ética (OBRIGATÓRIO)
- Conformidade com **LGPD art. 14** (dados de crianças: consentimento específico e em destaque de pelo
  menos um dos pais/responsável, coleta mínima), **ECA** e **Estatuto Digital da Criança e do Adolescente
  (Lei nº 15.211/2025 — verificar regulamentação vigente)**; se houver lançamento fora do Brasil, COPPA (EUA)
  e GDPR-K (UE).
- Sem publicidade, sem rastreadores de terceiros para marketing, sem venda de dados, sem chat aberto.
- Áudio de voz processado preferencialmente no dispositivo; se enviado ao servidor, é usado só para
  avaliação, não é armazenado por padrão e nunca é usado para treinar modelos sem consentimento expresso.
- Criptografia em trânsito (TLS 1.2+) e em repouso; papéis e permissões (criança, responsável, professor,
  admin); auditoria de acesso; exclusão de conta e dados em autoatendimento.
- Design ético: sem rolagem infinita, sem notificações para a criança, sem dark patterns, sem pressão de
  ofensiva (perder a sequência não remove conquistas); lembrete de pausa ao fim da sessão.
- Portão parental (ex.: pergunta adulta/conta) antes de compras, configurações e links externos.

## 7.4 Desempenho e plataforma
- PWA responsiva; alvo principal: tablets Android de entrada e celulares (2–3 GB RAM), Chrome/Safari.
- Primeira carga < 3 s em 4G; sessão do dia pré-carregada; bundle inicial < 300 KB gzip.
- Funcionamento offline das sessões baixadas; áudio comprimido (Opus/AAC) e imagens SVG/WebP.
- Disponibilidade 99,5%; latência de API p95 < 300 ms.

## 7.5 Stack sugerida (o assistente pode propor alternativa justificada)
- Front-end: React + TypeScript + Vite (ou Next.js), Tailwind, Framer Motion, PixiJS/Canvas para
  manipuláveis e traçado; Workbox para PWA/offline; i18n preparado (pt-BR padrão).
- Voz: Web Speech API onde disponível + modelo de reconhecimento de fala infantil em PT-BR/EN avaliado
  por benchmark próprio; TTS apenas para itens dinâmicos — narração principal gravada por locutores humanos.
- Back-end: Node.js (NestJS) ou Python (FastAPI); PostgreSQL; Redis; armazenamento de objetos para mídia;
  CDN; fila para relatórios.
- Motor adaptativo como serviço isolado, com testes de regressão pedagógica.
- Analytics próprio (ou auto-hospedado), sem SDKs de publicidade.
- Pagamentos: gateway brasileiro com Pix e cartão; área de assinatura apenas no portão parental.

# 8. MODELO DE NEGÓCIO
- **Freemium B2C:** gratuito com 1 trilha completa por idade e sessões limitadas; assinatura familiar
  (mensal/anual, até 4 crianças) libera as 4 trilhas, relatórios e biblioteca. Teste grátis de 14 dias.
  Faixa de preço a validar (benchmark: muito abaixo da mensalidade de reforço presencial).
- **B2B escolas:** licença por aluno/ano com painel do professor.
- **B2G redes públicas:** contratos/licitações com indicadores de alfabetização; versão de baixo consumo
  de dados.
- **Impacto social:** programa de bolsas/gratuidade para famílias de baixa renda (ex.: CadÚnico).

# 9. MÉTRICAS DE SUCESSO (KPIs)
## Aprendizagem (prioridade 1)
- % de crianças de 6–7 anos que atingem leitura fluente de palavras e frases decodificáveis em 6 meses.
- Ganho em palavras corretas por minuto (PCPM) por trimestre.
- Habilidades dominadas por semana de uso; taxa de retenção na revisão espaçada (≥ 85%).
- Ganho em pré/pós-teste validado (estudo com grupo de comparação em parceria com universidade).
## Hábito e engajamento saudável
- Dias ativos por semana (meta: 4+), duração média da sessão dentro da faixa alvo (não maximizar tempo).
- % de sessões concluídas; % de abandono por frustração (meta < 5%).
## Família/escola
- % de responsáveis que abrem o relatório semanal; NPS dos pais ≥ 50; uso semanal do painel do professor.
## Negócio
- Conversão teste → assinatura, churn mensal, CAC/LTV, nº de escolas e redes ativas.

# 10. CONCORRÊNCIA E DIFERENCIAÇÃO
Compare em tabela: Kumon (presencial e Kumon Connect), GraphoGame Brasil, Khan Academy Kids, Duolingo ABC,
Lingokids, Elefante Letrado, Smartick, apps de alfabetização brasileiros. Critérios: idioma nativo,
cobertura das 4 áreas, adaptatividade, fônico do PT-BR, relatórios, preço, privacidade, offline.
Diferenciais do Degrau: (1) disciplina de domínio + ludicidade; (2) 4 áreas com um único orientador;
(3) currículo fônico PT-BR e inglês pensado para brasileiros; (4) ética de tempo de tela; (5) explicabilidade.

# 11. RISCOS E MITIGAÇÕES
| Risco | Mitigação |
|---|---|
| Reconhecimento de voz infantil falha (sotaques, ruído) | Feedback tolerante, nunca penalizar só pela voz; alternativa por toque; benchmark regional. |
| Confusão de marca/propriedade intelectual com Kumon | Não usar marca, nomes de estágios ou conteúdo; revisão jurídica. |
| Excesso de tela | Limites padrão, fim de sessão claro, atividades offline sugeridas. |
| Conteúdo com erro pedagógico | Revisão por pedagogos, validação automática de decodificabilidade, testes com crianças. |
| Dados sensíveis de crianças | Privacy by design, DPO, RIPD/DPIA antes do lançamento. |
| Desmotivação por repetição | Variar contexto visual dos mesmos itens; coleções; escolha entre 2 atividades. |
| Mistura de códigos PT/EN na alfabetização | Phonics em inglês só após decodificação em PT-BR; cores/personagens distintos por idioma. |

# 12. ROADMAP
- **Fase 0 — Descoberta (4–6 semanas):** entrevistas com 20 famílias e 10 professores, protótipo em papel
  e Figma testado com crianças, validação do currículo com especialistas.
- **Fase 1 — MVP (3–4 meses):** Leitura D0–D4, Matemática M0–M3, Lógica L0–L2, Inglês E0–E1;
  nivelamento; sessão diária; motor de domínio por regras; painel familiar básico; PWA online.
- **Fase 2 — (meses 5–8):** demais degraus, biblioteca graduada, reconhecimento de voz para fluência,
  offline, painel do professor, assinatura.
- **Fase 3 — (meses 9–12):** modelo adaptativo estatístico, B2G, estudo de eficácia, acessibilidade
  avançada, soroban, phonics em inglês completo.

# 13. ENTREGÁVEIS QUE VOCÊ (ASSISTENTE) DEVE PRODUZIR
Com base neste MRD, gere, em ordem e em Português Brasileiro:
1. **Resumo executivo** (1 página) e lista de **Premissas** assumidas.
2. **PRD do MVP**: épicos → histórias de usuário ("Como [persona], quero [...] para [...]") com
   critérios de aceite em Gherkin (Dado/Quando/Então) e prioridade MoSCoW.
3. **Mapa curricular detalhado do MVP**: para cada habilidade — código BNCC, objetivo, pré-requisitos,
   tipo de interação, 3 itens de exemplo (com o texto exato da narração em áudio), dicas em 3 níveis,
   critério de domínio e tempo-padrão.
4. **Especificação do motor adaptativo**: modelo de dados de proficiência, pseudocódigo das regras de
   avanço/repetição/retrocesso/revisão espaçada e da montagem da sessão diária.
5. **Fluxos de UX** (texto + diagramas Mermaid): onboarding, nivelamento, sessão diária, erro→dica,
   conquista de degrau, portão parental, painel familiar, painel do professor.
6. **Modelo de dados** (diagrama ER em Mermaid) e **contratos de API** (REST ou GraphQL) principais.
7. **Arquitetura** (diagrama Mermaid), stack escolhida e justificativa; estratégia offline e de mídia.
8. **Plano de privacidade e conformidade** (LGPD art. 14, ECA, Estatuto Digital da Criança):
   inventário de dados, bases legais, fluxo de consentimento parental, retenção e exclusão.
9. **Plano de testes**: unitários, do motor adaptativo, acessibilidade, testes de usabilidade com
   crianças (protocolo ético, com consentimento dos responsáveis e assentimento da criança).
10. **Plano de métricas** (eventos de analytics com nomes e propriedades, sem dados pessoais).
11. **Backlog priorizado** para 6 sprints de 2 semanas.
12. Se solicitado depois: **código inicial** do MVP (estrutura de pastas, componentes de atividade
    reutilizáveis — Tocar-Escolher, Arrastar, Traçar, Falar, Alfabeto Móvel, Material Dourado, Quadro de
    Dez — e o motor de sessão).

# 14. REGRAS DE ESTILO DA RESPOSTA
- Seja concreto: números, exemplos reais de itens, textos de narração prontos.
- Toda narração para a criança: frases curtas (≤ 12 palavras), tom caloroso, segunda pessoa
  ("Toque na figura que começa com /mmm/!"), sem ironia, sem pressão de tempo.
- Ao citar fonemas use /barras/; grafemas em MAIÚSCULAS ou "aspas".
- Sinalize claramente o que é decisão pedagógica fundamentada e o que é hipótese a validar.
- Não invente dados estatísticos: quando estimar, rotule como estimativa e indique a fonte a consultar.

=== FIM DO PROMPT ===
```

---

## Apêndice A — Exemplo de item (para calibrar o assistente)

**Trilha:** Leitura · **Degrau:** D2 · **Habilidade:** sílabas com M · **BNCC:** EF01LP06/EF01LP07 (verificar códigos)

- **Narração:** "Escute: MA. Toque na figura que começa com MA!"
- **Opções (figuras):** MACACO · BOLA · SAPO
- **Dica 1:** "Escute de novo: MMMA... MACACO."
- **Dica 2:** a boca do personagem mostra os lábios fechados de /m/ e a sílaba MA brilha sob o macaco.
- **Dica 3:** a mãozinha aponta para o macaco: "MACACO começa com MA. Toque nele!"
- **Critério de domínio:** ≥ 9/10 em 2 sessões, tempo médio ≤ 6 s por item.

## Apêndice B — Exemplo de sessão diária (criança de 6 anos, 15 min)

| Min | Atividade | Trilha | Tipo |
|-----|-----------|--------|------|
| 0–2 | Aquecimento: fatos +2 (revisão espaçada) | Matemática | Revisão |
| 2–7 | Sílabas com R entre vogais (novo) + leitura de 3 palavras | Leitura | Novo |
| 7–10 | Livro decodificável "O rato e a uva" com perguntas | Leitura | Aplicação |
| 10–12 | Sequência ABC com formas | Lógica | Novo |
| 12–14 | *Colors* + TPR: "Touch the red ball!" | Inglês | Revisão/Novo |
| 14–15 | Conquista do dia + sugestão offline para a família | — | Fechamento |
