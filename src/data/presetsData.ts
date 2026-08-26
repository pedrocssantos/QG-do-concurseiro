// ==========================================================================
// QG DO CONCURSEIRO - CATÁLOGO DE EDITAIS PRONTOS (PRESETS OFICIAIS)
// ==========================================================================

export interface PresetConcurso {
  id: string;
  title: string;
  shortTitle: string;
  category: "Policial" | "Fiscal" | "Previdenciário" | "Tribunais" | "Geral";
  banca: string;
  targetDate: string;
  vagas?: number;
  salario?: string;
  desc: string;
  disciplinas: Array<{
    name: string;
    weight: number;
    color: string;
    icon: string;
    topicos: Array<{
      title: string;
    }>;
  }>;
}

export const PRESET_CONCURSOS: PresetConcurso[] = [
  {
    id: "preset-pf-agente",
    title: "Polícia Federal - Agente de Polícia Federal",
    shortTitle: "PF - Agente",
    category: "Policial",
    banca: "Cebraspe",
    targetDate: "2026-11-15",
    vagas: 1000,
    salario: "R$ 13.930,00",
    desc: "Edital completo com peso dominante em Informática/TI e Contabilidade Geral.",
    disciplinas: [
      {
        name: "Língua Portuguesa",
        weight: 3,
        color: "#38BDF8",
        icon: "fa-book",
        topicos: [
          { title: "Compreensão e interpretação de textos de gêneros variados" },
          { title: "Reconhecimento de tipos e gêneros textuais" },
          { title: "Ortografia oficial, acentuação e crase" },
          { title: "Morfologia e emprego das classes de palavras" },
          { title: "Sintaxe da oração e do período" },
          { title: "Concordância nominal e verbal" },
          { title: "Regência nominal e verbal" },
          { title: "Pontuação e coesão textual" },
          { title: "Redação de correspondências oficiais (Manual da Presidência)" }
        ]
      },
      {
        name: "Direito Administrativo",
        weight: 3,
        color: "#34D399",
        icon: "fa-scale-balanced",
        topicos: [
          { title: "Estado, governo e administração pública: conceitos e princípios" },
          { title: "Organização administrativa da União (Direta e Indireta)" },
          { title: "Atos administrativos: requisitos, atributos, extinção e anulação" },
          { title: "Agentes públicos e Regime Jurídico Único (Lei 8.112/1990)" },
          { title: "Poderes administrativos: vinculado, discricionário, hierárquico e de polícia" },
          { title: "Licitações e contratos administrativos (Lei 14.133/2021)" },
          { title: "Responsabilidade civil do Estado e improbidade (Lei 8.429/1992)" }
        ]
      },
      {
        name: "Direito Constitucional",
        weight: 3,
        color: "#FBBF24",
        icon: "fa-landmark",
        topicos: [
          { title: "Direitos e garantias fundamentais (Art. 5º da CF/88)" },
          { title: "Nacionalidade, cidadania e direitos políticos (Art. 12 a 16)" },
          { title: "Organização do Estado e repartição de competências" },
          { title: "Poder Executivo: atribuições e responsabilidades do Presidente" },
          { title: "Segurança Pública e atribuições da Polícia Federal (Art. 144)" },
          { title: "Defesa do Estado e das instituições democráticas" }
        ]
      },
      {
        name: "Direito Penal & Processual Penal",
        weight: 3,
        color: "#F87171",
        icon: "fa-gavel",
        topicos: [
          { title: "Aplicação da lei penal no tempo e no espaço" },
          { title: "Teoria do crime: fato típico, ilicitude, culpabilidade e imputabilidade" },
          { title: "Crimes contra a pessoa e crimes contra o patrimônio" },
          { title: "Crimes contra a administração pública e abuso de autoridade" },
          { title: "Inquérito policial: instauração, prazos, sigilo e relatório" },
          { title: "Provas no processo penal e cadeia de custódia (Art. 158-A a 158-F)" },
          { title: "Prisão em flagrante e prisões cautelares (preventiva e temporária)" }
        ]
      },
      {
        name: "Informática & TI Avançada",
        weight: 5,
        color: "#22D3EE",
        icon: "fa-network-wired",
        topicos: [
          { title: "Sistemas operacionais Linux e Windows (comandos e arquitetura)" },
          { title: "Redes de computadores, protocolos TCP/IP, DNS, HTTP/HTTPS e portas" },
          { title: "Segurança da informação: criptografia, malware, firewall e SIEM" },
          { title: "Banco de dados: modelo relacional, SQL, normalização e NoSQL" },
          { title: "Programação e análise de dados com Python e R" },
          { title: "Computação em nuvem (SaaS, PaaS, IaaS), Big Data e API REST" }
        ]
      },
      {
        name: "Contabilidade Geral",
        weight: 4,
        color: "#A78BFA",
        icon: "fa-calculator",
        topicos: [
          { title: "Conceitos, objetivos, campo de atuação e patrimônio" },
          { title: "Equação patrimonial fundamental, ativo, passivo e PL" },
          { title: "Escrituração contábil e método das partidas dobradas" },
          { title: "Balancete de verificação e lançamentos de ajuste" },
          { title: "Demonstrações contábeis: Balanço Patrimonial e DRE" }
        ]
      },
      {
        name: "Raciocínio Lógico e Estatística",
        weight: 3,
        color: "#F472B6",
        icon: "fa-brain",
        topicos: [
          { title: "Lógica proposicional, tabelas-verdade, tautologia e equivalências" },
          { title: "Diagramas lógicos, quantificadores e conjuntos" },
          { title: "Análise combinatória e probabilidade básica" },
          { title: "Estatística descritiva: média, mediana, moda, variância e desvio padrão" },
          { title: "Inferência estatística, distribuições e testes de hipóteses" }
        ]
      }
    ]
  },
  {
    id: "preset-prf",
    title: "Polícia Rodoviária Federal - Policial Rodoviário",
    shortTitle: "PRF",
    category: "Policial",
    banca: "Cebraspe",
    targetDate: "2026-12-05",
    vagas: 1500,
    salario: "R$ 11.200,00",
    desc: "Edital oficial com ênfase máxima em Legislação de Trânsito (CTB) e Física Aplicada.",
    disciplinas: [
      {
        name: "Legislação de Trânsito (CTB)",
        weight: 5,
        color: "#34D399",
        icon: "fa-car-side",
        topicos: [
          { title: "Código de Trânsito Brasileiro (Lei 9.503/1997 e alterações)" },
          { title: "Sistema Nacional de Trânsito (SNT) e competências da PRF" },
          { title: "Normas gerais de circulação e conduta" },
          { title: "Sinalização de trânsito e engenharia de tráfego" },
          { title: "Infrações e penalidades de trânsito" },
          { title: "Medidas administrativas e processo administrativo de trânsito" },
          { title: "Crimes de trânsito (Art. 291 a 312 do CTB)" },
          { title: "Resoluções prioritárias do CONTRAN" }
        ]
      },
      {
        name: "Física Mecânica Aplicada",
        weight: 4,
        color: "#FBBF24",
        icon: "fa-atom",
        topicos: [
          { title: "Cinemática escalar: MRU e MRUV aplicados a veículos" },
          { title: "Vetores, cinemática vetorial e movimento circular" },
          { title: "Leis de Newton e forças de atrito estático e dinâmico" },
          { title: "Trabalho, energia cinética, potencial e conservação de energia" },
          { title: "Quantidade de movimento, impulso e colisões de trânsito" }
        ]
      },
      {
        name: "Língua Portuguesa",
        weight: 3,
        color: "#38BDF8",
        icon: "fa-book",
        topicos: [
          { title: "Interpretação e compreensão de textos" },
          { title: "Tipologia e coerência textual" },
          { title: "Ortografia, acentuação e crase" },
          { title: "Morfossintaxe e termos da oração" },
          { title: "Concordância e regência verbal/nominal" },
          { title: "Pontuação e reescrita de frases" }
        ]
      },
      {
        name: "Direito Constitucional & Administrativo",
        weight: 3,
        color: "#34D399",
        icon: "fa-landmark",
        topicos: [
          { title: "Direitos e deveres individuais e coletivos (Art. 5º da CF)" },
          { title: "Segurança pública e competências da PRF (Art. 144 da CF)" },
          { title: "Poder de polícia e atos administrativos" },
          { title: "Regime jurídico dos servidores públicos federais (Lei 8.112/1990)" },
          { title: "Responsabilidade civil do Estado e improbidade administrativa" }
        ]
      },
      {
        name: "Direito Penal & Processual Penal",
        weight: 4,
        color: "#F87171",
        icon: "fa-gavel",
        topicos: [
          { title: "Crime, tipicidade, antijuridicidade e culpabilidade" },
          { title: "Crimes contra a pessoa e crimes patrimoniais" },
          { title: "Lei de Drogas (Lei 11.343/2006)" },
          { title: "Estatuto do Desarmamento (Lei 10.826/2003)" },
          { title: "Prisão em flagrante e busca e apreensão veicular" }
        ]
      },
      {
        name: "RLM e Geopolítica Brasileira",
        weight: 2,
        color: "#F472B6",
        icon: "fa-brain",
        topicos: [
          { title: "Lógica matemática, proposições e quantificadores" },
          { title: "Matriz de transporte brasileira e malha rodoviária federal" },
          { title: "Dinâmica de fronteiras, contrabando e descaminho" },
          { title: "Urbanização, fluxos migratórios e corredores logísticos" }
        ]
      }
    ]
  },
  {
    id: "preset-receita-auditor",
    title: "Receita Federal - Auditor-Fiscal da Receita Federal",
    shortTitle: "Receita - Auditor",
    category: "Fiscal",
    banca: "FGV",
    targetDate: "2026-10-20",
    vagas: 699,
    salario: "R$ 22.920,00",
    desc: "Edital fiscal de elite com peso máximo em Tributário, Contabilidade Avançada e Legislação Aduaneira.",
    disciplinas: [
      {
        name: "Direito Tributário e Previdenciário",
        weight: 5,
        color: "#FBBF24",
        icon: "fa-coins",
        topicos: [
          { title: "Sistema Tributário Nacional na CF/88 e princípios constitucionais" },
          { title: "Competência tributária e limitações constitucionais ao poder de tributar" },
          { title: "Código Tributário Nacional (CTN): obrigação, crédito e lançamento" },
          { title: "Suspensão, extinção e exclusão do crédito tributário" },
          { title: "Impostos federais: IRPF, IRPJ, IPI, IOF, II, IE e ITR" },
          { title: "Contribuições sociais e financiamento da Seguridade Social" }
        ]
      },
      {
        name: "Legislação Tributária & Aduaneira",
        weight: 5,
        color: "#FBBF24",
        icon: "fa-shield",
        topicos: [
          { title: "Regulamento do Imposto sobre a Renda (RIR)" },
          { title: "Regulamento Aduaneiro (Decreto 6.759/2009)" },
          { title: "Jurisdição aduaneira, recinto alfandegado e controle de carga" },
          { title: "Regimes aduaneiros especiais (Drawback, Admissão Temporária, Entreposto)" },
          { title: "Despacho aduaneiro de importação e exportação e valoração aduaneira" },
          { title: "Infrações e penalidades aduaneiras e perdimento de mercadorias" }
        ]
      },
      {
        name: "Contabilidade Geral e Avançada",
        weight: 5,
        color: "#A78BFA",
        icon: "fa-calculator",
        topicos: [
          { title: "Pronunciamentos Técnicos do CPC (Comitê de Pronunciamentos Contábeis)" },
          { title: "Estrutura Conceitual Básica e Princípios Fundamentais" },
          { title: "Mensuração de estoques (CPC 16) e ativo imobilizado (CPC 27)" },
          { title: "Demonstração do Fluxo de Caixa (DFC) e DVA" },
          { title: "Consolidação de demonstrações contábeis e equivalência patrimonial" },
          { title: "Análise econômico-financeira de balanços e índices de liquidez" }
        ]
      },
      {
        name: "Auditoria Fiscal e Fluência em Dados (TI)",
        weight: 4,
        color: "#22D3EE",
        icon: "fa-network-wired",
        topicos: [
          { title: "Normas brasileiras de contabilidade aplicadas à auditoria (NBC TA)" },
          { title: "Procedimentos de auditoria: testes substantivos e de controle" },
          { title: "SPED Fiscal, EFD-Contribuições, ECF e ECD" },
          { title: "Consultas SQL, banco de dados relacionais e modelagem multidimensional" },
          { title: "Análise exploratória com Python/R e mineração de dados para detecção de fraudes" }
        ]
      },
      {
        name: "Direito Constitucional & Administrativo",
        weight: 4,
        color: "#34D399",
        icon: "fa-landmark",
        topicos: [
          { title: "Controle de constitucionalidade (difuso e concentrado)" },
          { title: "Organização do Estado e repartição de competências" },
          { title: "Processo Administrativo Federal (Lei 9.784/1999)" },
          { title: "Processo Administrativo Fiscal (Decreto 70.235/1972)" },
          { title: "Licitações, contratos e serviços públicos" }
        ]
      },
      {
        name: "Língua Portuguesa & Raciocínio Lógico-Quantitativo",
        weight: 3,
        color: "#38BDF8",
        icon: "fa-book",
        topicos: [
          { title: "Interpretação textual e padrão FGV de enunciados" },
          { title: "Sintaxe, pontuação e coesão textual avançada" },
          { title: "Matemática financeira: juros compostos, taxas equivalentes e amortização" },
          { title: "Estatística descritiva e probabilidade condicional" }
        ]
      }
    ]
  },
  {
    id: "preset-inss-tecnico",
    title: "INSS - Técnico do Seguro Social",
    shortTitle: "INSS - Técnico",
    category: "Previdenciário",
    banca: "Cebraspe",
    targetDate: "2026-11-28",
    vagas: 1200,
    salario: "R$ 6.500,00",
    desc: "Edital focado em Direito Previdenciário (70% da prova objetiva) e Regime dos Servidores.",
    disciplinas: [
      {
        name: "Direito Previdenciário (Seguridade Social)",
        weight: 5,
        color: "#34D399",
        icon: "fa-shield-heart",
        topicos: [
          { title: "Seguridade Social: princípios constitucionais e organização" },
          { title: "Regime Geral de Previdência Social (RGPS - Lei 8.213/1991)" },
          { title: "Segurados obrigatórios e facultativos do RGPS" },
          { title: "Manutenção e perda da qualidade de segurado (Período de Graça)" },
          { title: "Benefícios em espécie: Aposentadorias, Pensão por Morte e Auxílios" },
          { title: "Salário de benefício, fator previdenciário e regras de transição (EC 103/2019)" },
          { title: "Financiamento da Seguridade Social (Lei 8.212/1991)" },
          { title: "Crimes contra a Previdência Social no Código Penal" }
        ]
      },
      {
        name: "Língua Portuguesa",
        weight: 3,
        color: "#38BDF8",
        icon: "fa-book",
        topicos: [
          { title: "Compreensão e interpretação de textos" },
          { title: "Ortografia, acentuação e crase" },
          { title: "Morfologia e sintaxe da língua portuguesa" },
          { title: "Concordância e regência nominal/verbal" },
          { title: "Pontuação e redação oficial" }
        ]
      },
      {
        name: "Ética no Serviço Público & Lei 8.112/90",
        weight: 3,
        color: "#FBBF24",
        icon: "fa-scale-balanced",
        topicos: [
          { title: "Código de Ética Profissional do Servidor Público (Decreto 1.171/1994)" },
          { title: "Comissões de ética e deveres funcionais" },
          { title: "Regime Jurídico Único: provimento, vacância, direitos e vantagens" },
          { title: "Regime disciplinar, penalidades e processo administrativo disciplinar (PAD)" }
        ]
      },
      {
        name: "Noções de Direito Constitucional & Administrativo",
        weight: 2,
        color: "#34D399",
        icon: "fa-landmark",
        topicos: [
          { title: "Direitos e garantias fundamentais (Art. 5º da CF)" },
          { title: "Administração Pública (Art. 37 a 41 da CF)" },
          { title: "Poderes e atos administrativos" },
          { title: "Improbidade Administrativa (Lei 8.429/1992)" }
        ]
      },
      {
        name: "Noções de Informática e RLM",
        weight: 2,
        color: "#22D3EE",
        icon: "fa-network-wired",
        topicos: [
          { title: "Sistemas operacionais, editores de texto e planilhas" },
          { title: "Segurança na internet, antivírus e backup" },
          { title: "Estruturas lógicas, lógica de argumentação e diagramas" }
        ]
      }
    ]
  },
  {
    id: "preset-tj-tecnico",
    title: "Tribunal de Justiça - Técnico Judiciário",
    shortTitle: "TJ - Técnico",
    category: "Tribunais",
    banca: "Vunesp / FGV",
    targetDate: "2026-10-12",
    vagas: 400,
    salario: "R$ 7.200,00",
    desc: "Edital oficial de tribunais com foco equilibrado em Processo Civil, Processo Penal e Direito Constitucional.",
    disciplinas: [
      {
        name: "Direito Processual Civil",
        weight: 4,
        color: "#34D399",
        icon: "fa-scale-balanced",
        topicos: [
          { title: "Princípios processuais fundamentais no CPC/2015" },
          { title: "Atos processuais: forma, tempo e prazos processuais" },
          { title: "Comunicação dos atos: citação, intimação e cartas" },
          { title: "Petição inicial, tutela provisória e audiência de conciliação" },
          { title: "Contestação, reconvenção e revelia" },
          { title: "Sentença, coisa julgada e sistema recursal (Apelação e Agravo)" },
          { title: "Juizados Especiais Cíveis (Lei 9.099/1995)" }
        ]
      },
      {
        name: "Direito Processual Penal",
        weight: 4,
        color: "#F87171",
        icon: "fa-gavel",
        topicos: [
          { title: "Inquérito policial e ação penal (pública e privada)" },
          { title: "Jurisdição e competência territorial e funcional" },
          { title: "Provas no processo penal e audiência de instrução" },
          { title: "Prisão em flagrante, preventiva e temporária" },
          { title: "Citação, notificação e prazos processuais penais" },
          { title: "Recursos em geral: RESE, Apelação e Habeas Corpus" }
        ]
      },
      {
        name: "Língua Portuguesa",
        weight: 4,
        color: "#38BDF8",
        icon: "fa-book",
        topicos: [
          { title: "Leitura, compreensão e interpretação de textos jurídicos e literários" },
          { title: "Sinônimos, antônimos e sentido figurado" },
          { title: "Ortografia, acentuação e crase" },
          { title: "Concordância e regência verbal e nominal" },
          { title: "Pontuação, colocação pronominal e coesão" }
        ]
      },
      {
        name: "Direito Constitucional & Administrativo",
        weight: 4,
        color: "#FBBF24",
        icon: "fa-landmark",
        topicos: [
          { title: "Dos direitos e deveres individuais e coletivos (Art. 5º da CF)" },
          { title: "Poder Judiciário: órgãos, garantias e competências (Art. 92 a 126)" },
          { title: "Estatuto dos Servidores Públicos do Tribunal" },
          { title: "Improbidade administrativa e responsabilidade civil do Estado" },
          { title: "Normas da Corregedoria Geral da Justiça" }
        ]
      },
      {
        name: "Matemática, RLM e Informática",
        weight: 3,
        color: "#22D3EE",
        icon: "fa-brain",
        topicos: [
          { title: "Raciocínio lógico dedutivo e equivalências" },
          { title: "Porcentagem, razão, proporção e regra de três" },
          { title: "Sistemas operacionais, Pacote Office e Processo Judicial Eletrônico (PJe)" },
          { title: "Segurança da informação e ferramentas de colaboração" }
        ]
      }
    ]
  }
];
