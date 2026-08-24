# 📜 Foco no Papiro - Sistema Completo de Gestão de Estudos (SPA)

Sistema completo de planejamento e execução de estudos para concursos públicos e exames de alto rendimento, construído com **HTML5, CSS3 e JavaScript Puro (Vanilla JS)** em arquitetura **SPA (Single Page Application)**.

Inspirado na plataforma [Foco no Papiro](https://foconopapiro.com.br/dashboard), o sistema transforma editais complexos em um plano tático automatizado, eliminando a perda de tempo com organização e permitindo foco total na execução.

---

## 🚀 Funcionalidades Principais

### 1. 🏠 Dashboard & Missões do Dia
- **Resumo do Dia:** Horas líquidas estudadas vs. meta diária, percentual de conclusão e streak de constância.
- **Missões Inteligentes:** Sugestões diárias de teoria, questões, revisão ativa e blocos de foco com cálculo dinâmico de XP.
- **Gráficos em Tempo Real:** Evolução semanal, distribuição de tempo por disciplina, radar de domínio e mapa de calor (estilo GitHub).

### 2. 🗺️ Edital Verticalizado Interativo
- Acompanhamento detalhado do conteúdo programático (Disciplinas e Tópicos).
- Controle de **Teoria (PDF/Vídeo)**, **Resumos**, **Revisões Periódicas (R24h, R7d, R30d)** e nível de domínio (1 a 5 estrelas).
- Concursos pré-carregados: **Polícia Federal (Agente)**, **PRF (Policial)** e **INSS (Técnico)**, com suporte total para criação de editais customizados.

### 3. 🔄 Ciclo de Estudos & Cronograma Semanal
- Gerador e balanceador automático de blocos de estudo baseado no peso e na dificuldade de cada matéria.
- Indicador da "Matéria da Vez" com botão de disparo direto para o cronômetro.
- Grade semanal sugerida de Segunda a Domingo.

### 4. 📝 Banco de Questões & Modo Simulado Oficial
- Banco de questões comentadas com assertivas Certo/Errado (Cespe) e Múltipla Escolha (FGV/FCC).
- Feedback instantâneo com efeitos sonoros e justificativas doutrinárias/jurisprudenciais detalhadas.
- **Modo Simulado Cronometrado:** Prova com contagem regressiva, grade de marcação e relatório com cálculo de nota líquida no estilo Cebraspe ("uma errada anula uma certa").

### 5. 🛡️ Caderno de Erros Automatizado
- Captura automática de todas as questões respondidas incorretamente.
- Categorização do motivo do erro (*Pegadinha da Banca*, *Desconhecimento Teórico*, *Falta de Atenção*).
- Espaço para anotações de blindagem e memorização de regras.

### 6. 🃏 Flashcards com Repetição Espaçada (SRS - SM2)
- Decks organizados por disciplina com cards interativos 3D (*flip card*).
- Algoritmo baseado no **SuperMemo SM-2** que calcula os intervalos futuros (*Errei*, *Difícil*, *Bom*, *Fácil*) com base na facilidade de retenção.

### 7. ⏱️ Cronômetro Pomodoro & Modo Zen Imersivo
- Modos: **Pomodoro Clássico (25/5)**, **Bloco Tático (50/10)** e **Cronômetro Livre**.
- **Sintetizador de Áudio Nativo via Web Audio API:** Alertas e gerador de som ambiente (Chuva Suave / Ruído Branco) sintetizados diretamente no navegador sem arquivos de áudio externos.
- **Modo Zen:** Interface em tela cheia com visual escuro imersivo e citações motivacionais.

### 8. 🏆 Gamificação, Patentes Militares & Ranking
- Sistema progressivo de XP e Patentes (*Recruta*, *Aspirante*, *Soldado*, *Sargento*, *Capitão*, *Major*, *Coronel*, *General Aprovado*).
- Galeria de Conquistas e Medalhas desbloqueáveis.
- Tabela de Classificação Semanal simulada da Liga dos Concurseiros.

### 9. ⚙️ Backup & Armazenamento 100% Offline
- Persistência total e automática via `localStorage`.
- Exportação e importação de backups completos em formato `.json`.
- Alternância instantânea de tema (Modo Escuro Tático / Modo Claro).

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico:** Estrutura modular para roteamento de Single Page Application.
- **CSS3 Puro:** Variáveis CSS (Design Tokens), Flexbox, CSS Grid, Glassmorphism, animações 3D e responsividade completa para Desktop e Mobile.
- **JavaScript Puro (ES6+):** Arquitetura orientada a componentes/controladores desacoplados, EventEmitter no Store, algoritmos matemáticos para SRS e renderizador customizado de gráficos em HTML5 Canvas.
- **Web Audio API:** Geração de frequências sonoras harmônicas e ruído rosa browniano para concentração.

---

## 📂 Estrutura de Arquivos

```
Estudos/
├── index.html            # Shell SPA e templates de visualização
├── README.md             # Documentação do projeto
├── css/
│   ├── style.css         # Variáveis de tema, resets e layout principal
│   ├── components.css    # Botões, modais, toasts, tabelas e formulários
│   ├── dashboard.css     # Estilos dos cards, missões e widgets do Dashboard
│   ├── edital.css        # Estilos do Edital Verticalizado e tabelas de tópicos
│   ├── questions.css     # Interface do banco de questões e caderno de erros
│   ├── flashcards.css    # Estilização 3D e controles do algoritmo SRS
│   └── pomodoro.css      # Círculo animado do Pomodoro e Modo Zen
└── js/
    ├── data.js           # Dados semente (concursos, questões, flashcards e ranking)
    ├── store.js          # Gerenciamento de estado reativo e LocalStorage
    ├── analytics.js      # Motor gráfico em Canvas puro (Linha, Barra, Donut, Radar, Heatmap)
    ├── pomodoro.js       # Controle do Pomodoro, cronômetro e sintetizador de áudio
    ├── questions.js      # Mecanismo interativo de questões e simulado
    ├── flashcards.js     # Motor de repetição espaçada SuperMemo SM-2
    ├── edital.js         # Gestão do Edital Verticalizado
    ├── ciclo.js          # Balanceador do Ciclo de Estudos e planejamento
    ├── errors.js         # Caderno de Erros automatizado
    ├── gamification.js   # Sistema de XP, patentes e leaderboard
    ├── dashboard.js      # Controlador e renderizador do Dashboard
    └── app.js            # Roteador SPA, gerenciador de modais, temas e eventos globais
```

---

## 💻 Como Executar

Por ter sido desenvolvido em **HTML, CSS e JavaScript puro**, não é necessária a instalação de nenhuma dependência (como Node.js ou bundlers).

1. Abra o arquivo `index.html` diretamente em qualquer navegador moderno (Google Chrome, Firefox, Safari, Edge, Brave);
2. Ou sirva via servidor local HTTP se preferir:
   ```bash
   # Com Python 3:
   python3 -m http.server 8000
   
   # Com Node.js / npx:
   npx serve .
   ```
3. Acesse `http://localhost:8000` no seu navegador.
