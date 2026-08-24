// ==========================================================================
// FOCO NO PAPIRO - DADOS INICIAIS / SEED DATA
// ==========================================================================

const DEFAULT_CONCURSOS = [
  {
    id: "pf-agente",
    title: "Polícia Federal - Agente Administrativo / Policial",
    shortTitle: "PF - Agente",
    category: "Policial",
    banca: "Cebraspe",
    targetDate: "2026-11-15",
    totalHoursGoal: 600,
    dailyGoalMinutes: 240,
    disciplinas: [
      {
        id: "pf-port",
        name: "Língua Portuguesa",
        color: "#3b82f6",
        icon: "fa-book",
        weight: 3,
        difficulty: 3, // 1-5
        topicos: [
          { id: "pf-port-1", title: "Compreensão e Interpretação de Textos", teoria: true, resumo: true, questoesFeitas: 45, questoesAcertos: 40, r24h: true, r7d: true, r30d: false, dominio: 4 },
          { id: "pf-port-2", title: "Tipologia e Gêneros Textuais", teoria: true, resumo: true, questoesFeitas: 30, questoesAcertos: 26, r24h: true, r7d: false, r30d: false, dominio: 3 },
          { id: "pf-port-3", title: "Ortografia Oficial e Acentuação Gráfica", teoria: true, resumo: false, questoesFeitas: 20, questoesAcertos: 18, r24h: false, r7d: false, r30d: false, dominio: 3 },
          { id: "pf-port-4", title: "Morfossintaxe: Classes de Palavras", teoria: false, resumo: false, questoesFeitas: 10, questoesAcertos: 7, r24h: false, r7d: false, r30d: false, dominio: 2 },
          { id: "pf-port-5", title: "Sintaxe do Período Simples e Composto", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-port-6", title: "Pontuação e Uso dos Sinais", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-port-7", title: "Concordância Verbal e Nominal", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-port-8", title: "Regência Verbal e Emprego do Sinal de Crase", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-port-9", title: "Redação de Correspondências Oficiais (Manual da PR)", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
        ]
      },
      {
        id: "pf-dir-adm",
        name: "Direito Administrativo",
        color: "#10b981",
        icon: "fa-scale-balanced",
        weight: 3,
        difficulty: 3,
        topicos: [
          { id: "pf-adm-1", title: "Princípios Expressos e Implícitos da Adm. Pública", teoria: true, resumo: true, questoesFeitas: 40, questoesAcertos: 36, r24h: true, r7d: true, r30d: true, dominio: 5 },
          { id: "pf-adm-2", title: "Organização Administrativa: Direta e Indireta", teoria: true, resumo: true, questoesFeitas: 25, questoesAcertos: 21, r24h: true, r7d: false, r30d: false, dominio: 3 },
          { id: "pf-adm-3", title: "Atos Administrativos (Requisitos, Atributos, Extinção)", teoria: true, resumo: false, questoesFeitas: 15, questoesAcertos: 11, r24h: false, r7d: false, r30d: false, dominio: 2 },
          { id: "pf-adm-4", title: "Poderes da Administração Pública", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-adm-5", title: "Agentes Públicos e Regime da Lei 8.112/90", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-adm-6", title: "Responsabilidade Civil do Estado", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-adm-7", title: "Licitações e Contratos (Nova Lei 14.133/21)", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
        ]
      },
      {
        id: "pf-dir-const",
        name: "Direito Constitucional",
        color: "#f59e0b",
        icon: "fa-landmark",
        weight: 3,
        difficulty: 2,
        topicos: [
          { id: "pf-const-1", title: "Princípios Fundamentais (Art. 1º a 4º CF)", teoria: true, resumo: true, questoesFeitas: 35, questoesAcertos: 32, r24h: true, r7d: true, r30d: true, dominio: 4 },
          { id: "pf-const-2", title: "Direitos e Garantias Fundamentais (Art. 5º)", teoria: true, resumo: true, questoesFeitas: 50, questoesAcertos: 44, r24h: true, r7d: true, r30d: false, dominio: 4 },
          { id: "pf-const-3", title: "Direitos Sociais, Nacionalidade e Políticos", teoria: false, resumo: false, questoesFeitas: 12, questoesAcertos: 9, r24h: false, r7d: false, r30d: false, dominio: 2 },
          { id: "pf-const-4", title: "Organização Político-Administrativa do Estado", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-const-5", title: "Poder Executivo e Poder Judiciário", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-const-6", title: "Segurança Pública (Art. 144 CF)", teoria: true, resumo: true, questoesFeitas: 20, questoesAcertos: 19, r24h: true, r7d: false, r30d: false, dominio: 4 }
        ]
      },
      {
        id: "pf-dir-penal",
        name: "Direito Penal & Processual Penal",
        color: "#ef4444",
        icon: "fa-gavel",
        weight: 3,
        difficulty: 3,
        topicos: [
          { id: "pf-penal-1", title: "Aplicação da Lei Penal (Tempo, Lugar, Extraterritorialidade)", teoria: true, resumo: true, questoesFeitas: 30, questoesAcertos: 27, r24h: true, r7d: true, r30d: false, dominio: 4 },
          { id: "pf-penal-2", title: "Teoria do Crime (Fato Típico, Ilicitude, Culpabilidade)", teoria: true, resumo: false, questoesFeitas: 25, questoesAcertos: 20, r24h: false, r7d: false, r30d: false, dominio: 3 },
          { id: "pf-penal-3", title: "Crimes contra a Pessoa e contra o Patrimônio", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-penal-4", title: "Crimes contra a Administração Pública", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-penal-5", title: "Inquérito Policial (Características, Instauração, Trancamento)", teoria: true, resumo: true, questoesFeitas: 40, questoesAcertos: 38, r24h: true, r7d: true, r30d: true, dominio: 5 },
          { id: "pf-penal-6", title: "Prisões em Flagrante, Preventiva e Temporária", teoria: false, resumo: false, questoesFeitas: 15, questoesAcertos: 12, r24h: false, r7d: false, r30d: false, dominio: 2 },
          { id: "pf-penal-7", title: "Legislação Penal Especial (Drogas, Desarmamento, Tortura)", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
        ]
      },
      {
        id: "pf-info",
        name: "Informática & Tecnologia da Informação",
        color: "#06b6d4",
        icon: "fa-network-wired",
        weight: 5, // Peso altíssimo na PF
        difficulty: 4,
        topicos: [
          { id: "pf-info-1", title: "Redes de Computadores: Topologias, Protocolos TCP/IP, DNS, DHCP", teoria: true, resumo: true, questoesFeitas: 50, questoesAcertos: 42, r24h: true, r7d: true, r30d: false, dominio: 4 },
          { id: "pf-info-2", title: "Segurança da Informação: Criptografia, Malware, Firewall, IDS", teoria: true, resumo: true, questoesFeitas: 35, questoesAcertos: 31, r24h: true, r7d: false, r30d: false, dominio: 3 },
          { id: "pf-info-3", title: "Banco de Dados: Modelo Relacional, SQL, NoSQL, Big Data", teoria: false, resumo: false, questoesFeitas: 15, questoesAcertos: 9, r24h: false, r7d: false, r30d: false, dominio: 2 },
          { id: "pf-info-4", title: "Python e R para Ciência de Dados Básica", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-info-5", title: "Sistemas Operacionais Linux e Windows", teoria: false, resumo: false, questoesFeitas: 10, questoesAcertos: 7, r24h: false, r7d: false, r30d: false, dominio: 2 },
          { id: "pf-info-6", title: "Computação em Nuvem e Ferramentas Colaborativas", teoria: true, resumo: false, questoesFeitas: 15, questoesAcertos: 13, r24h: false, r7d: false, r30d: false, dominio: 3 }
        ]
      },
      {
        id: "pf-contab",
        name: "Contabilidade Geral",
        color: "#8b5cf6",
        icon: "fa-calculator",
        weight: 4,
        difficulty: 4,
        topicos: [
          { id: "pf-cont-1", title: "Conceitos Básicos, Objeto, Finalidade e Usuários", teoria: true, resumo: true, questoesFeitas: 30, questoesAcertos: 27, r24h: true, r7d: true, r30d: false, dominio: 4 },
          { id: "pf-cont-2", title: "Patrimônio: Ativo, Passivo e Patrimônio Líquido", teoria: true, resumo: true, questoesFeitas: 25, questoesAcertos: 22, r24h: true, r7d: false, r30d: false, dominio: 3 },
          { id: "pf-cont-3", title: "Equação Fundamental do Patrimônio e Fatos Contábeis", teoria: false, resumo: false, questoesFeitas: 10, questoesAcertos: 7, r24h: false, r7d: false, r30d: false, dominio: 2 },
          { id: "pf-cont-4", title: "Escrituração: Método das Partidas Dobradas, Razonetes", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-cont-5", title: "Balanço Patrimonial e DRE (Demonstração do Resultado)", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
        ]
      },
      {
        id: "pf-rlm",
        name: "Raciocínio Lógico e Estatística",
        color: "#ec4899",
        icon: "fa-brain",
        weight: 3,
        difficulty: 3,
        topicos: [
          { id: "pf-rlm-1", title: "Proposições Lógicas, Conectivos e Tabelas-Verdade", teoria: true, resumo: true, questoesFeitas: 40, questoesAcertos: 35, r24h: true, r7d: true, r30d: true, dominio: 4 },
          { id: "pf-rlm-2", title: "Equivalências e Negações Lógicas", teoria: true, resumo: true, questoesFeitas: 30, questoesAcertos: 27, r24h: true, r7d: false, r30d: false, dominio: 4 },
          { id: "pf-rlm-3", title: "Diagramas Lógicos e Teoria dos Conjuntos", teoria: false, resumo: false, questoesFeitas: 10, questoesAcertos: 8, r24h: false, r7d: false, r30d: false, dominio: 2 },
          { id: "pf-rlm-4", title: "Análise Combinatória e Probabilidade", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-rlm-5", title: "Estatística Descritiva: Média, Mediana, Moda e Variância", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
        ]
      }
    ]
  },
  {
    id: "prf-policial",
    title: "Polícia Rodoviária Federal - Policial",
    shortTitle: "PRF - Policial",
    category: "Policial",
    banca: "Cebraspe",
    targetDate: "2026-12-20",
    totalHoursGoal: 650,
    dailyGoalMinutes: 240,
    disciplinas: [
      {
        id: "prf-port",
        name: "Língua Portuguesa",
        color: "#3b82f6",
        icon: "fa-book",
        weight: 3,
        difficulty: 3,
        topicos: [
          { id: "prf-port-1", title: "Interpretação de Texto e Coesão", teoria: true, resumo: true, questoesFeitas: 30, questoesAcertos: 26, r24h: true, r7d: true, r30d: false, dominio: 3 },
          { id: "prf-port-2", title: "Sintaxe da Oração e do Período", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
        ]
      },
      {
        id: "prf-transito",
        name: "Legislação de Trânsito (CTB + Resoluções)",
        color: "#10b981",
        icon: "fa-car-side",
        weight: 5,
        difficulty: 4,
        topicos: [
          { id: "prf-trans-1", title: "Sistema Nacional de Trânsito e Normas Gerais", teoria: true, resumo: true, questoesFeitas: 45, questoesAcertos: 40, r24h: true, r7d: true, r30d: false, dominio: 4 },
          { id: "prf-trans-2", title: "Infrações e Penalidades de Trânsito", teoria: false, resumo: false, questoesFeitas: 20, questoesAcertos: 15, r24h: false, r7d: false, r30d: false, dominio: 2 },
          { id: "prf-trans-3", title: "Crimes de Trânsito", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
        ]
      },
      {
        id: "prf-fisica",
        name: "Física Mecânica Aplicada",
        color: "#f59e0b",
        icon: "fa-atom",
        weight: 3,
        difficulty: 5,
        topicos: [
          { id: "prf-fis-1", title: "Cinemática Escalar e Vetorial", teoria: true, resumo: false, questoesFeitas: 15, questoesAcertos: 10, r24h: false, r7d: false, r30d: false, dominio: 2 },
          { id: "prf-fis-2", title: "Dinâmica e Leis de Newton aplicadas a acidentes", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
        ]
      }
    ]
  },
  {
    id: "inss-tecnico",
    title: "INSS - Técnico do Seguro Social",
    shortTitle: "INSS - Técnico",
    category: "Previdenciário",
    banca: "Cebraspe",
    targetDate: "2026-10-10",
    totalHoursGoal: 450,
    dailyGoalMinutes: 180,
    disciplinas: [
      {
        id: "inss-prev",
        name: "Seguridade Social / Direito Previdenciário",
        color: "#10b981",
        icon: "fa-shield-heart",
        weight: 5,
        difficulty: 3,
        topicos: [
          { id: "inss-prev-1", title: "Princípios da Seguridade Social", teoria: true, resumo: true, questoesFeitas: 50, questoesAcertos: 45, r24h: true, r7d: true, r30d: true, dominio: 5 },
          { id: "inss-prev-2", title: "Beneficiários do RGPS: Segurados e Dependentes", teoria: true, resumo: true, questoesFeitas: 35, questoesAcertos: 30, r24h: true, r7d: false, r30d: false, dominio: 3 },
          { id: "inss-prev-3", title: "Benefícios em Espécie: Aposentadorias e Pensões", teoria: false, resumo: false, questoesFeitas: 10, questoesAcertos: 7, r24h: false, r7d: false, r30d: false, dominio: 2 }
        ]
      },
      {
        id: "inss-port",
        name: "Língua Portuguesa",
        color: "#3b82f6",
        icon: "fa-book",
        weight: 3,
        difficulty: 3,
        topicos: [
          { id: "inss-port-1", title: "Interpretação e Gramática Geral", teoria: true, resumo: false, questoesFeitas: 25, questoesAcertos: 22, r24h: false, r7d: false, r30d: false, dominio: 3 }
        ]
      }
    ]
  }
];

const DEFAULT_QUESTIONS = [
  {
    id: "q-1",
    disciplinaId: "pf-dir-adm",
    disciplinaName: "Direito Administrativo",
    assunto: "Princípios da Administração Pública",
    banca: "Cebraspe",
    orgao: "Polícia Federal",
    cargo: "Agente de Polícia",
    ano: 2024,
    tipo: "certo_errado",
    enunciado: "Em decorrência do princípio da impessoalidade, é vedada a utilização de nomes, símbolos ou imagens que caracterizem promoção pessoal de autoridades ou servidores públicos em publicidade de atos, programas, obras, serviços e campanhas dos órgãos públicos.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "C",
    explicacao: "Gabarito: **CERTO**. A assertiva reproduz expressamente o disposto no art. 37, § 1º, da CF/88: 'A publicidade dos atos, programas, obras, serviços e campanhas dos órgãos públicos deverá ter caráter educativo, informativo ou de orientação social, dela não podendo constar nomes, símbolos ou imagens que caracterizem promoção pessoal de autoridades ou servidores públicos'."
  },
  {
    id: "q-2",
    disciplinaId: "pf-dir-adm",
    disciplinaName: "Direito Administrativo",
    assunto: "Poderes Administrativos",
    banca: "Cebraspe",
    orgao: "PRF",
    cargo: "Policial Rodoviário Federal",
    ano: 2023,
    tipo: "certo_errado",
    enunciado: "O poder de polícia administrativa pode ser delegado a pessoas jurídicas de direito privado integrantes da administração pública indireta com capital social majoritariamente público que prestem exclusivamente serviço público de atuação própria do Estado e em regime não concorrencial.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "C",
    explicacao: "Gabarito: **CERTO**. Tese de Repercussão Geral do STF (Tema 532): 'É constitucional a delegação do poder de polícia, por meio de lei, a pessoas jurídicas de direito privado integrantes da Administração Pública indireta de capital social majoritariamente público que prestem exclusivamente serviço público de atuação própria do Estado e em regime não concorrencial'."
  },
  {
    id: "q-3",
    disciplinaId: "pf-dir-const",
    disciplinaName: "Direito Constitucional",
    assunto: "Direitos e Garantias Fundamentais",
    banca: "Cebraspe",
    orgao: "Polícia Federal",
    cargo: "Papiloscopista",
    ano: 2024,
    tipo: "certo_errado",
    enunciado: "A casa é asilo inviolável do indivíduo, ninguém nela podendo penetrar sem consentimento do morador, salvo em caso de flagrante delito ou desastre, ou para prestar socorro, ou, durante a noite, por determinação judicial.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "E",
    explicacao: "Gabarito: **ERRADO**. Por determinação judicial, o ingresso no domicílio só pode ocorrer **DURANTE O DIA** (art. 5º, XI, da CF). À noite, com mandado judicial, NÃO é permitido o ingresso forçado sem o consentimento do morador."
  },
  {
    id: "q-4",
    disciplinaId: "pf-dir-const",
    disciplinaName: "Direito Constitucional",
    assunto: "Segurança Pública (Art. 144)",
    banca: "Cebraspe",
    orgao: "Polícia Federal",
    cargo: "Agente de Polícia",
    ano: 2023,
    tipo: "certo_errado",
    enunciado: "À Polícia Federal, órgão permanente, estruturado em carreira, compete com exclusividade exercer as funções de polícia judiciária da União.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "C",
    explicacao: "Gabarito: **CERTO**. Art. 144, § 1º, IV, da CF: 'A polícia federal, instituída por lei como órgão permanente, organizado e mantido pela União e estruturado em carreira, destina-se a: [...] IV - exercer, com exclusividade, as funções de polícia judiciária da União'."
  },
  {
    id: "q-5",
    disciplinaId: "pf-info",
    disciplinaName: "Informática",
    assunto: "Redes de Computadores",
    banca: "Cebraspe",
    orgao: "Polícia Federal",
    cargo: "Agente de Polícia",
    ano: 2024,
    tipo: "certo_errado",
    enunciado: "O protocolo HTTPS utiliza, por padrão, a porta TCP 443 e garante autenticidade, integridade e confidencialidade na comunicação cliente-servidor através de camadas criptográficas como TLS/SSL.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "C",
    explicacao: "Gabarito: **CERTO**. O HTTPS (HyperText Transfer Protocol Secure) utiliza a porta padrão 443 sobre TCP e emprega os protocolos de criptografia TLS/SSL para assegurar confidencialidade, integridade dos dados e autenticação do servidor."
  },
  {
    id: "q-6",
    disciplinaId: "pf-info",
    disciplinaName: "Informática",
    assunto: "Segurança da Informação",
    banca: "Cebraspe",
    orgao: "Polícia Federal",
    cargo: "Escrivão de Polícia",
    ano: 2023,
    tipo: "certo_errado",
    enunciado: "O ransomware é um tipo de malware que, diferentemente dos vírus tradicionais, não apenas infecta o sistema, mas criptografa arquivos do usuário e exige resgate monetário para disponibilizar a chave de decodificação.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "C",
    explicacao: "Gabarito: **CERTO**. Conceito preciso de Ransomware: código malicioso que torna inacessíveis os dados armazenados em um equipamento por meio de criptografia forte, exigindo o pagamento de resgate (geralmente em criptomoedas) para reestabelecer o acesso."
  },
  {
    id: "q-7",
    disciplinaId: "pf-port",
    disciplinaName: "Língua Portuguesa",
    assunto: "Crase e Regência",
    banca: "FGV",
    orgao: "Receita Federal",
    cargo: "Auditor Fiscal",
    ano: 2023,
    tipo: "multipla_escolha",
    enunciado: "Assinale a alternativa em que o uso do acento indicativo de crase é OBRIGATÓRIO de acordo com a norma-padrão da língua portuguesa:",
    alternativas: [
      { id: "A", text: "O candidato referiu-se a pessoas desconhecidas durante o depoimento." },
      { id: "B", text: "Entregou os documentos à sua chefe na primeira hora do expediente." },
      { id: "C", text: "As investigações foram conduzidas passo a passo com rigor." },
      { id: "D", text: "O delegado obedeceu às determinações da legislação em vigor." },
      { id: "E", text: "Ele estava disposto a colaborar com a justiça." }
    ],
    respostaCorreta: "D",
    explicacao: "Gabarito: **D**. O verbo 'obedecer' é transitivo indireto e rege a preposição 'a' (obedecer a algo/alguém). Somando-se ao artigo feminino plural 'as' ('as determinações'), a crase é OBRIGATÓRIA (às). Na alternativa B, diante de pronome possessivo feminino singular a crase é facultativa; na A, 'a' no singular diante de plural não tem crase; na C, expressões com palavras repetidas não levam crase; na E, não há crase antes de verbo."
  },
  {
    id: "q-8",
    disciplinaId: "pf-dir-penal",
    disciplinaName: "Direito Penal",
    assunto: "Aplicação da Lei Penal",
    banca: "Cebraspe",
    orgao: "Polícia Federal",
    cargo: "Agente",
    ano: 2024,
    tipo: "certo_errado",
    enunciado: "Adota-se no Código Penal brasileiro a teoria da atividade para o tempo do crime e a teoria da ubiquidade para o lugar do crime.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "C",
    explicacao: "Gabarito: **CERTO**. Mnemônico clássico **LUTA**: Lugar = Ubiquidade (art. 6º CP - considera-se praticado o crime no lugar em que ocorreu a ação ou omissão, bem como onde se produziu ou deveria produzir-se o resultado); Tempo = Atividade (art. 4º CP - considera-se praticado o crime no momento da ação ou omissão, ainda que outro seja o momento do resultado)."
  },
  {
    id: "q-9",
    disciplinaId: "pf-rlm",
    disciplinaName: "Raciocínio Lógico",
    assunto: "Equivalências Lógicas",
    banca: "Cebraspe",
    orgao: "Polícia Federal",
    cargo: "Agente",
    ano: 2023,
    tipo: "certo_errado",
    enunciado: "A negação da proposição composta 'Se o agente investiga com rigor, então o crime é elucidado' é logicamente equivalente a 'O agente investiga com rigor e o crime não é elucidado'.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "C",
    explicacao: "Gabarito: **CERTO**. Regra do **MANÉ** para negação da condicional (P → Q): Mantém a primeira parte e Nega a segunda: ~(P → Q) ≡ P ^ ~Q. Portanto: 'O agente investiga com rigor E o crime NÃO é elucidado'."
  },
  {
    id: "q-10",
    disciplinaId: "pf-contab",
    disciplinaName: "Contabilidade Geral",
    assunto: "Fatos Contábeis e Patrimônio",
    banca: "Cebraspe",
    orgao: "Polícia Federal",
    cargo: "Agente",
    ano: 2024,
    tipo: "certo_errado",
    enunciado: "O pagamento de uma duplicata com juros por atraso constitui um fato contábil modificativo diminutivo.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "E",
    explicacao: "Gabarito: **ERRADO**. Trata-se de um fato contábil **MISTO (ou composto) DIMINUTIVO**, pois envolve uma permuta entre contas patrimoniais (diminuição de Passivo e diminuição de Ativo Caixa) associada a uma variação no Patrimônio Líquido devido à despesa financeira com juros."
  },
  {
    id: "q-11",
    disciplinaId: "pf-dir-penal",
    disciplinaName: "Direito Penal",
    assunto: "Inquérito Policial",
    banca: "Cebraspe",
    orgao: "Polícia Federal",
    cargo: "Escrivão",
    ano: 2023,
    tipo: "certo_errado",
    enunciado: "A autoridade policial pode mandar arquivar autos de inquérito policial caso verifique manifesta atipicidade do fato investigado.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "E",
    explicacao: "Gabarito: **ERRADO**. O art. 17 do Código de Processo Penal estabelece expressamente o princípio da indisponibilidade do inquérito: 'A autoridade policial NÃO poderá mandar arquivar autos de inquérito'. O arquivamento é ato exclusivo da autoridade judiciária competente, a requerimento do Ministério Público."
  },
  {
    id: "q-12",
    disciplinaId: "pf-dir-adm",
    disciplinaName: "Direito Administrativo",
    assunto: "Responsabilidade Civil do Estado",
    banca: "Cebraspe",
    orgao: "Polícia Federal",
    cargo: "Agente",
    ano: 2024,
    tipo: "certo_errado",
    enunciado: "A responsabilidade civil das pessoas jurídicas de direito público por atos comissivos de seus agentes é objetiva, prescindindo da comprovação de dolo ou culpa, admitindo-se a exclusão da responsabilidade nos casos de culpa exclusiva da vítima, caso fortuito ou força maior.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "C",
    explicacao: "Gabarito: **CERTO**. Conforme art. 37, § 6º, da CF/88, o Brasil adota a Teoria do Risco Administrativo para condutas comissivas: a responsabilidade é objetiva, mas admite excludentes do nexo causal (culpa exclusiva da vítima, fato de terceiro, caso fortuito ou força maior)."
  }
];

const DEFAULT_FLASHCARDS = [
  {
    id: "fc-1",
    disciplinaId: "pf-port",
    disciplinaName: "Português",
    frente: "Qual é a regra geral para a ocorrência da CRASE?",
    verso: "A crase é a fusão da preposição **'a'** (exigida por um termo regente) com o artigo definido feminino **'a(s)'** ou pronome demonstrativo (**aquele, aquela, aquilo**).\n\n💡 **Dica Prática:** Substitua a palavra feminina por uma masculina correspondente; se virar **'ao'**, ocorre crase!",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  },
  {
    id: "fc-2",
    disciplinaId: "pf-dir-adm",
    disciplinaName: "Direito Administrativo",
    frente: "Quais são os atributos/características do ATO ADMINISTRATIVO?",
    verso: "Mnemônico **PATI**:\n• **P**resunção de Legitimidade e Veracidade\n• **A**utoexecutoriedade\n• **T**ipicidade\n• **I**mperatividade",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  },
  {
    id: "fc-3",
    disciplinaId: "pf-dir-const",
    disciplinaName: "Direito Constitucional",
    frente: "Quando a autoridade policial pode penetrar no domicílio sem mandado e sem consentimento do morador?",
    verso: "A qualquer hora do dia ou da noite nas 3 hipóteses do Art. 5º, XI CF:\n1. **Flagrante delito**\n2. **Desastre**\n3. **Prestar socorro**\n\n⚠️ *(Com determinação judicial: SOMENTE DURANTE O DIA!)*",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  },
  {
    id: "fc-4",
    disciplinaId: "pf-dir-penal",
    disciplinaName: "Direito Penal",
    frente: "Qual a diferença entre Crime Tentado e Desistência Voluntária?",
    verso: "• **Tentativa:** O agente quer prosseguir, mas é impedido por circunstâncias alheias à sua vontade ('Quero, mas não posso').\n• **Desistência Voluntária:** O agente pode prosseguir na execução, mas voluntariamente decide parar ('Posso, mas não quero'). Responde apenas pelos atos já praticados (Ponte de Ouro).",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  },
  {
    id: "fc-5",
    disciplinaId: "pf-info",
    disciplinaName: "Informática",
    frente: "O que é o modelo OSI e quais são as suas 7 camadas (do topo para a base)?",
    verso: "Mnemônico: **A-A-S-T-R-E-F**\n7. Aplicação (HTTP, DNS, FTP)\n6. Apresentação (SSL, JPEG)\n5. Sessão\n4. Transporte (TCP, UDP)\n3. Rede (IP, Roteamento)\n2. Enlace (Ethernet, Switches)\n1. Física (Cabos, Sinais elétricos)",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  },
  {
    id: "fc-6",
    disciplinaId: "pf-rlm",
    disciplinaName: "Raciocínio Lógico",
    frente: "Como fazer a NEGAÇÃO de uma proposição condicional (P → Q)?",
    verso: "Regra do **MANÉ**:\n• **MA**ntém a primeira parte (P)\n• **E** (Conjunção ^)\n• **NE**ga a segunda parte (~Q)\n\n~(P → Q) ≡ P ^ ~Q",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  }
];

const DEFAULT_BADGES = [
  { id: "badge-first-study", title: "Primeiro Papiro", desc: "Completou a primeira sessão de estudos no cronômetro", icon: "fa-fire", unlocked: true, date: "2026-08-20" },
  { id: "badge-streak-7", title: "Guerreiro 7 Dias", desc: "Manteve 7 dias ininterruptos de papiro ativo", icon: "fa-shield-halved", unlocked: true, date: "2026-08-24" },
  { id: "badge-50-questions", title: "Sniper de Questões", desc: "Resolveu mais de 50 questões no banco", icon: "fa-bullseye", unlocked: true, date: "2026-08-23" },
  { id: "badge-edital-25", title: "Marcha Inicial", desc: "Bateu 25% dos tópicos do seu edital verticalizado", icon: "fa-map-location-dot", unlocked: true, date: "2026-08-22" },
  { id: "badge-master-srs", title: "Memória Blindada", desc: "Revisou 20+ flashcards com método espaçado", icon: "fa-brain", unlocked: false, date: null },
  { id: "badge-simulado-pro", title: "Pronto pro Combate", desc: "Concluiu um simulado completo cronometrado com >80% acertos", icon: "fa-trophy", unlocked: false, date: null },
  { id: "badge-night-owl", title: "Sentinela Noturna", desc: "Estudou mais de 2 horas no período da madrugada", icon: "fa-moon", unlocked: false, date: null },
  { id: "badge-centurion", title: "Centurião", desc: "Acumulou 100 horas líquidas registradas no sistema", icon: "fa-medal", unlocked: false, date: null }
];

const DEFAULT_LEADERBOARD = [
  { rank: 1, name: "Inspetor Nascimento", avatar: "IN", hoursWeekly: 34.5, questionsWeekly: 310, accuracy: 91, xp: 4850, badge: "Lendário" },
  { rank: 2, name: "Delegada Silva", avatar: "DS", hoursWeekly: 31.0, questionsWeekly: 280, accuracy: 88, xp: 4230, badge: "Veterana" },
  { rank: 3, name: "Você (QG Operacional)", avatar: "EU", hoursWeekly: 24.2, questionsWeekly: 195, accuracy: 84, xp: 3420, isUser: true, badge: "Sniper" },
  { rank: 4, name: "Lucas Federal", avatar: "LF", hoursWeekly: 22.5, questionsWeekly: 170, accuracy: 81, xp: 3010, badge: "Combatente" },
  { rank: 5, name: "Mariana PRF", avatar: "MP", hoursWeekly: 19.8, questionsWeekly: 160, accuracy: 79, xp: 2750, badge: "Tática" },
  { rank: 6, name: "Roberto Civil", avatar: "RC", hoursWeekly: 17.0, questionsWeekly: 120, accuracy: 76, xp: 2320, badge: "Operador" },
  { rank: 7, name: "Ana PM", avatar: "AP", hoursWeekly: 15.5, questionsWeekly: 95, accuracy: 72, xp: 1980, badge: "Recruta" }
];

const MOTIVATIONAL_QUOTES = [
  { quote: "Treino difícil, combate fácil. Cada questão resolvida hoje é um ponto na prova de domingo.", author: "Doutrina Policial" },
  { quote: "A dor do estudo é passageira. A honra de ostentar o distintivo no peito é eterna.", author: "QG do Concurseiro" },
  { quote: "No combate contra a banca examinadora, quem domina o edital não conta com a sorte.", author: "Manual de Operações" },
  { quote: "A disciplina é a ponte inegociável entre a vontade de passar e a posse no Diário Oficial.", author: "Estratégia Tática" },
  { quote: "Não pare quando estiver cansado. Pare apenas quando o seu nome for publicado na lista de aprovados.", author: "Comando QG" },
  { quote: "Constância bate o talento todos os dias da semana. Um bloco de papiro por vez, até a posse.", author: "Doutrina de Alto Rendimento" }
];
