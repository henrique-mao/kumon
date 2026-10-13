# Pesquisa: Método Kumon e técnicas complementares para Leitura, Matemática, Lógica e Inglês (foco em Português Brasileiro)

> Documento de base para o MRD do aplicativo **Degrau** (ver `02-MRD-prompt-app-degrau.md`).
> Público-alvo do produto: crianças de 4 a 8 anos, falantes de português brasileiro.
>
> **Aviso importante:** "Kumon" é marca registrada do Kumon Institute of Education (Japão). O app descrito aqui
> é **inspirado em princípios pedagógicos** (muitos deles de domínio público e também presentes em outras
> abordagens), **não** reproduz material didático proprietário, não usa a marca nem os nomes de estágios como
> argumento comercial. As descrições de estágios abaixo são uma síntese aproximada de fontes públicas e devem
> ser tratadas como referência, não como cópia de currículo oficial.

---

## 1. O Método Kumon — origem e alcance

- **Origem:** criado em 1954–1958 em Osaka (Japão) por **Toru Kumon**, professor de matemática, a partir de
  folhas de exercícios que preparou para o filho Takeshi.
- **Brasil:** presente desde 1977; é um dos maiores mercados do Kumon fora do Japão.
- **Disciplinas no Brasil:** Matemática, Português, Inglês (EFL — inglês como língua estrangeira) e Japonês.
- **Formato:** o aluno vai à unidade ~2x por semana e faz folhas de exercícios (blocos numerados) **todos os
  dias** em casa, ~20–30 min por disciplina. Existe também a versão digital (**Kumon Connect**), em tablet.

## 2. Os princípios centrais do Kumon (o "DNA" a ser transposto para o app)

| # | Princípio | Como funciona no Kumon | Tradução para o app |
|---|-----------|------------------------|---------------------|
| 1 | **Ensino individualizado** | Cada aluno tem seu próprio plano e ritmo; não há turma. | Trilha adaptativa por criança, por disciplina. |
| 2 | **Autodidatismo** (*self-learning*) | O material é desenhado para que o aluno descubra a regra pelos exemplos, sem aula expositiva. | Exercícios com exemplo resolvido + dica progressiva; mínima explicação verbal. |
| 3 | **Ponto de partida confortável** | O teste diagnóstico coloca o aluno *abaixo* do nível escolar, em algo que ele faz com 100% e rapidez. Gera confiança e hábito. | Teste de nivelamento lúdico; começar 1–2 degraus abaixo do nível detectado. |
| 4 | **Pequenos passos** (*sukoshi zutsu*) | Cada folha aumenta a dificuldade de forma mínima; um conceito novo por vez. | Microprogressões: no máximo 1 variável nova por bloco. |
| 5 | **Repetição até o domínio** (*mastery learning*) | Bloco é repetido até atingir critério. | Critério de domínio por habilidade; repetição espaçada. |
| 6 | **Tempo-padrão + precisão** | Avança só quando faz com ~100% de acerto **dentro do tempo-padrão** (automatização/fluência). | Medir acurácia **e** fluência (tempo por item), mas sem cronômetro visível para crianças pequenas. |
| 7 | **Autocorreção até 100%** | O orientador marca os erros; o aluno corrige sozinho até tudo ficar certo. | Erro → dica → nova tentativa; o item volta no fim do bloco. Nunca "game over". |
| 8 | **Prática diária curta** | Hábito diário > sessões longas. | Sessão diária de 10–15 min (4–5 anos) a 20 min (6–8 anos); ofensiva (streak) gentil. |
| 9 | **Estudar além da série escolar** | Meta de longo prazo: avançar acima da série. | Sem teto de série; a criança avança conforme o domínio. |
| 10 | **Papel do Orientador** | Observa, decide avanço/repetição, elogia, ajusta o plano. | "Orientador virtual" (algoritmo) + painel para pais/professores com decisões explicáveis. |
| 11 | **Elogio e reconhecimento** | Elogio frequente ao esforço; quadro de honra; certificados de avanço. | Elogio ao esforço (não à "inteligência"), certificados ao concluir degraus. |
| 12 | **Envolvimento familiar** | Pais acompanham a pasta diária. | Relatório semanal, dicas de atividades offline, modo "fazer junto". |
| 13 | **Leitura como hábito** | Lista de Leitura Recomendada (*Recommended Reading List*) por nível. | Biblioteca graduada com livros decodificáveis e leitura em voz alta. |

### 2.1 Materiais e técnicas da primeira infância usados pelo Kumon
- **Baby Kumon / pré-escolar:** canções, leitura em voz alta, cartões de figuras, conversa.
- **Number Board / quadro de números:** peças numeradas 1–50/1–100 para encaixar → sequência numérica.
- **Song Board:** cantigas com tabuleiro de figuras → vocabulário e ritmo.
- **Folhas de traçado ("Zig-zag")**: linhas retas, curvas, zigue-zague e labirintos antes de escrever letras e
  números → controle motor fino e pegada do lápis.
- **Leitura de pontos e figuras (Matemática 6A):** contar quantidades com pontos antes de ver o numeral.
- **E-Pencil / caneta de áudio (Inglês):** a criança toca na palavra e ouve a pronúncia de falante nativo —
  aprende pelo **som + imagem**, sem tradução.

## 3. Estágios do Kumon relevantes para 4–8 anos (síntese aproximada)

### 3.1 Matemática (6A → C cobrem a faixa 4–8 anos)
| Estágio | Conteúdo aproximado |
|---------|---------------------|
| 6A | Contar até 10 → 30 com figuras e pontos; reconhecer quantidade. |
| 5A | Ler e sequenciar números até 50; traçar linhas (coordenação). |
| 4A | Ler e escrever números até 120; tabela numérica. |
| 3A | Sequências; somar +1, +2, +3 (números "seguintes"). |
| 2A | Adição até +10 (fatos básicos automatizados). |
| A  | Subtração básica; adição/subtração horizontal com 2 dígitos. |
| B  | Adição e subtração verticais com reserva ("vai um") e recurso ("empresta"). |
| C  | Multiplicação (tabuadas) e divisão básica. |

**Técnicas-chave:** automatização de fatos (fluência), *counting on* (contar a partir do maior), sequências
numéricas antes de operações, cálculo mental antes de algoritmo escrito, muitos itens curtos por folha.

### 3.2 Leitura / Português (7A → C cobrem a faixa 4–8 anos)
| Estágio | Conteúdo aproximado |
|---------|---------------------|
| 7A | Vocabulário com figuras; ouvir e nomear; rimas e cantigas. |
| 6A | Ler palavras curtas com apoio de figura; letras e seus sons. |
| 5A | Sílabas, formação de palavras, primeiras frases. |
| 4A | Ler e escrever palavras e frases simples; letra bastão/cursiva. |
| 3A–2A | Frases mais longas, pontuação, partes da frase (quem? o quê? onde?). |
| A–C | Parágrafos, compreensão de textos curtos, sequência de fatos, resumo. |

**Técnicas-chave:** ler em voz alta, vocabulário antes da decodificação, frase como unidade de sentido,
leitura de trechos de literatura real em nível crescente, perguntas de compreensão literal → inferencial.

### 3.3 Inglês EFL (7A → A cobrem a faixa 4–8 anos)
- 7A–4A: **som e imagem**, sem tradução; vocabulário do cotidiano com caneta de áudio; repetir em voz alta.
- 3A–2A: frases curtas (*This is a...*, *I like...*), padrões repetitivos.
- A em diante: leitura de frases e pequenos textos, gramática implícita por padrões.

**Técnicas-chave:** imersão auditiva com nativo, *shadowing* (repetir logo após ouvir), padrões de frase,
leitura antes de gramática explícita.

### 3.4 Lógica
O Kumon **não tem disciplina de lógica separada**; o raciocínio lógico é trabalhado dentro de matemática
(sequências, padrões, labirintos, classificação). No app, Lógica será um eixo próprio apoiado em outras técnicas
(seção 5).

---

## 4. Técnicas mundiais de alfabetização e como se aplicam ao **Português Brasileiro**

### 4.1 Métodos e teorias
| Técnica | Origem | Ideia central | Uso no app |
|---------|--------|---------------|------------|
| **Método fônico (instrução fônica sistemática)** | Mundial; no Brasil, F. Capovilla e outros | Ensinar explicitamente a correspondência grafema–fonema e a síntese (juntar sons). | **Espinha dorsal** da trilha de leitura. |
| **Fônico sintético** (*Synthetic Phonics* / *Jolly Phonics*) | Reino Unido | 42 sons do inglês com gestos, histórias e músicas; *blending* e *segmenting*. | Gesto + música por som (versão PT-BR e versão EN). |
| **Consciência fonológica** | Ciência da leitura | Rimas → aliteração → sílabas → fonemas, antes/junto das letras. | Pré-leitura (4–5 anos) totalmente oral. |
| **Método silábico** (*ba-be-bi-bo-bu*, cartilha "Caminho Suave") | Brasil | Famílias silábicas; o português é muito silábico (estrutura CV dominante). | Combinar com fônico: fonema → sílaba → palavra. |
| **Método das Boquinhas** | Brasil (Renata Jardini) | Fonovisuoarticulatório: cada letra associada à posição da boca. | Avatar com boca animada mostrando articulação. |
| **Psicogênese da Língua Escrita** | Emília Ferreiro & Ana Teberosky | Hipóteses: pré-silábica → silábica → silábico-alfabética → alfabética. | Diagnóstico de escrita espontânea; feedback por fase. |
| **Palavras geradoras** | Paulo Freire | Partir de palavras significativas para a criança. | Personalizar com o nome da criança, família, pet. |
| **Montessori** | Itália | Letras de lixa (tato), alfabeto móvel, escrever antes de ler. | Traçado com o dedo + "alfabeto móvel" digital (arrastar letras). |
| **Orton-Gillingham** | EUA | Multissensorial (ver, ouvir, falar, tocar), explícito, cumulativo. Excelente para dislexia. | Modo "multissensorial" e suporte a dificuldades. |
| **Leitura dialógica** (*Dialogic Reading*, PEER/CROWD) | EUA | Adulto faz perguntas durante a leitura compartilhada. | Livros com perguntas guiadas para pais. |
| **Livros decodificáveis** | Mundial | Textos que usam só os grafemas já ensinados. | Biblioteca gerada por nível de grafema. |
| **Leitura repetida / fluência** | Ciência da leitura | Reler o mesmo texto aumenta velocidade e prosódia. | "Leia de novo" com medição de palavras por minuto (reconhecimento de voz). |
| **Glenn Doman (cartões)** | EUA | Palavras inteiras em cartões rápidos. | Uso limitado: apenas palavras de alta frequência irregulares. |

**Referência de política pública:** a BNCC define alfabetização até o fim do **2º ano** do Ensino Fundamental
e não prescreve um método único. A PNA (2019) enfatizava o método fônico; foi substituída em 2023 pelo
**Compromisso Nacional Criança Alfabetizada**. O MEC disponibilizou o app **GraphoGame Brasil** (fônico),
útil como benchmark.

### 4.2 Particularidades do Português Brasileiro (o que o app precisa tratar)
1. **Ortografia relativamente transparente** (bem mais que o inglês) → fônico funciona rápido; a maioria das
   crianças decodifica em 6–12 meses de instrução sistemática.
2. **Sílaba CV predominante** → a sílaba é unidade natural; ensinar fonema e logo sintetizar em sílaba.
3. **Ordem sugerida de ensino:**
   1. Vogais orais: A, E, I, O, U (e os sons abertos/fechados é/ê, ó/ô).
   2. Consoantes contínuas e estáveis: **M, N, L, S (inicial), F, V, Z, J** (podem ser "esticadas": mmmm).
   3. Oclusivas estáveis: **P, B, T, D**.
   4. Sílabas complexas: CVC (*mar, sol*), CCV (*prato, bloco*).
   5. Letras com som dependente de contexto: **C** (ca/ce), **G** (ga/ge), **R** (r forte/fraco, rr),
      **S** (s/ss/ç/z entre vogais), **X** (4 sons: xícara, táxi, exame, próximo).
   6. Dígrafos: **CH, LH, NH, RR, SS, QU, GU**.
   7. Nasalização: **ã, õ, am, an, em, en, im, om, um**.
   8. **H** mudo, **L** final com som de U (*sal*), acentos (´ ^ ~).
4. **Letra:** começar com **letra bastão (maiúscula de imprensa)**, depois minúscula de imprensa, e só então
   cursiva (padrão nas escolas brasileiras).
5. **Variação regional de pronúncia** (ex.: "tia" /tʃia/ vs /tia/, R carioca/caipira, S chiado): o
   reconhecimento de voz e os áudios precisam aceitar variantes e o app deve permitir escolher sotaque de
   narração.
6. **Erros ortográficos típicos** a prever: troca surda/sonora (p/b, t/d, f/v), hipersegmentação ("a gora"),
   hipossegmentação ("derepente"), transcrição da fala ("vamu", "pexe").

## 5. Técnicas para **Matemática** e **Lógica** (além do Kumon)

| Técnica | Origem | Uso no app |
|---------|--------|------------|
| **CPA — Concreto → Pictórico → Abstrato** | Singapura (Bruner) | Toda habilidade nova passa por: objetos manipuláveis → desenho → numeral. |
| **Modelo de barras** (*bar model*) | Singapura | Problemas com palavras a partir de 7 anos. |
| **Subitização** | Ciência cognitiva | Reconhecer quantidades até 5–6 sem contar (dados, dedos, pontos). |
| **Quadro de dez** (*ten frame*) e quadro de 100 | EUA/mundial | Composição do 10, base dez. |
| **Material Dourado** | Montessori (popular no Brasil) | Valor posicional, "vai um" e "empresta" visíveis. |
| **Barras Cuisenaire** | Bélgica | Decomposição, comparação, frações intuitivas. |
| **Soroban** | Japão | Cálculo mental avançado (módulo opcional 7–8 anos). |
| **Number Talks / estratégias mentais** | EUA | Mostrar várias estratégias para o mesmo cálculo. |
| **Prática espaçada + recuperação** (*spaced retrieval*) | Ciência cognitiva | Fatos básicos revisados em intervalos crescentes. |
| **Tangram, padrões, sequências, classificação** | Clássico | Eixo de lógica. |
| **Pensamento computacional desplugado** | Code.org, ScratchJr, Bebras | Algoritmos com setas, laços simples, depuração ("encontre o erro"). |
| **Sudoku infantil (4x4), labirintos, "qual não pertence"** | Clássico | Raciocínio dedutivo e atenção. |

**BNCC (Matemática, 4–8 anos):** Educação Infantil — campo "Espaços, tempos, quantidades, relações e
transformações"; 1º–3º ano — Números (até 1000), Álgebra (padrões e sequências), Geometria, Grandezas e
Medidas (dinheiro em reais, tempo, comprimento) e Probabilidade e Estatística (tabelas e gráficos simples).
O **pensamento computacional** foi incorporado como complemento da BNCC (Parecer CNE/CEB nº 2/2022).

## 6. Técnicas para **Inglês** com crianças brasileiras

| Técnica | Uso no app |
|---------|------------|
| **Som + imagem sem tradução** (Kumon EFL) | Vocabulário apresentado com áudio nativo e figura; tradução só como "ajuda" opcional para pais. |
| **TPR — Total Physical Response** (James Asher) | Comandos com ação: *jump, clap, touch your nose* (câmera opcional/ou a criança toca no personagem). |
| **Phonics em inglês** (Jolly Phonics / Letters and Sounds) | Só a partir de ~6 anos e **depois** de a criança ler em português, para não misturar códigos. |
| **Sight words** (listas Dolch / Fry) | *the, is, you, said...* palavras irregulares frequentes. |
| **Canções e chants** | Ritmo e padrões fonológicos. |
| **Histórias repetitivas / *storytelling*** | Padrões tipo "Brown Bear, Brown Bear, what do you see?". |
| **Shadowing + reconhecimento de voz** | Repetir logo após o áudio, com feedback. |
| **CLIL** (conteúdo em inglês) | Cores, números, animais, ciências simples em inglês. |

**Interferências típicas do PT-BR a tratar no inglês:**
- Vogal epentética ("hot-i dog-i", "Facebook-i").
- **TH** /θ/ /ð/ (think, this) trocado por /f/, /t/, /d/.
- **H** inicial aspirado (house) vs R brasileiro; **R** retroflexo do inglês.
- Vogais longas vs curtas (*ship/sheep*, *full/fool*).
- **-ed** pronunciado como sílaba ("work-ed").
- Falsos cognatos (*pretend, push, parents*) e uso de cognatos verdadeiros como atalho (*animal, banana, hospital*).

## 7. Ciência da aprendizagem aplicada (transversal)

- **Mastery learning** (Benjamin Bloom) — avançar só com domínio.
- **Zona de Desenvolvimento Proximal** (Vygotsky) e *scaffolding* — dica certa no momento certo.
- **Prática espaçada e intercalada** — revisão automática do que já foi dominado.
- **Efeito de testagem** — recuperar da memória fixa mais do que reler.
- **Carga cognitiva** (Sweller) — telas limpas, uma instrução por vez, áudio em vez de texto para quem não lê.
- **Mentalidade de crescimento** (Carol Dweck) — elogiar esforço e estratégia.
- **Teoria da autodeterminação** — autonomia (escolhas), competência (sucesso) e vínculo (personagem, família).
- **Atenção na primeira infância** — sessões curtas: ~5–10 min de foco aos 4–5 anos, ~15–20 min aos 7–8.

## 8. Benchmarks de produtos

| Produto | Destaque | Lacuna que o app pode ocupar |
|---------|----------|------------------------------|
| **Kumon Connect** | Digitaliza as folhas; exige matrícula presencial. | Não é autônomo nem lúdico. |
| **GraphoGame Brasil** | Fônico gratuito, validado em PT-BR. | Só leitura; pouco engajamento de longo prazo. |
| **Khan Academy Kids** | Gratuito, amplo, bonito. | Tradução para PT-BR limitada; sem foco em fônico do português. |
| **Duolingo ABC / Duolingo** | Gamificação excelente; ABC só em inglês. | Não alfabetiza em português. |
| **Lingokids** | Inglês para crianças com bom conteúdo. | Só inglês; modelo de assinatura agressivo. |
| **Elefante Letrado** | Biblioteca digital brasileira graduada. | Foco em leitura de livros, não em alfabetização inicial. |
| **Eye Level, Mathnasium, Smartick** | Concorrentes do Kumon (individualização). | Pouca presença ou preço alto no Brasil. |

**Oportunidade:** um app **em português brasileiro nativo**, que una a **disciplina do Kumon** (pequenos passos,
domínio, prática diária) à **ludicidade** dos melhores apps, cobrindo **as quatro áreas** com um único
"orientador" adaptativo e um painel para família/escola.

## 9. Fontes consultadas

- UNIR — *Método Kumon: cómo desarrollar el autodidactismo y el potencial de los niños*:
  https://www.unir.net/educacion/revista/noticias/metodo-kumon-como-desarrollar-el-autodidactismo-y-el-potencial-de-los-ninos/549203735292/
- Guia da Semana — *Os segredos do Kumon*: https://www.guiadasemana.com.br/filhos/noticia/os-segredos-do-kumon
- São Paulo para Crianças — Kumon: https://saopauloparacriancas.com.br/kumon/
- Repositório UFPB (estudo sobre Kumon e alfabetização): https://repositorio.ufpb.br/jspui/handle/123456789/3590?mode=full
- UENF — Informações sobre o Kumon Inglês: https://pgmp.uenf.br/ingles-kumon
- Cenpec — Sumário executivo da PNA: https://saberesepraticas.cenpec.org.br/wp-content/uploads/2021/07/Sumario-executivo_Política-Nacional-de-Alfabetização-PNA.pdf
- Tribuna PR — Decreto sobre alfabetização prioriza método fônico: https://www.tribunapr.com.br/noticias/brasil/decreto-sobre-alfabetizacao-prioriza-metodo-fonico/amp/
- Revista Brasileira de Alfabetização (ABALF): https://revistaabalf.com.br/index.html/index.php/rabalf/article/view/584/390
- Perspectivas em Diálogo (UFMS): https://periodicos.ufms.br/index.php/persdia/article/download/12011/9150

Demais itens (Jolly Phonics, Singapore Math, Montessori, Orton-Gillingham, Ferreiro & Teberosky, Método das
Boquinhas, TPR etc.) vêm de literatura pedagógica amplamente conhecida. **Recomenda-se validar com Kumon Brasil
ou um orientador credenciado** o conteúdo exato de cada estágio antes de usá-lo como referência de produto.
