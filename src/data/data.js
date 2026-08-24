// ==========================================================================
// QG DO CONCURSEIRO - DADOS INICIAIS / SEED DATA
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
          { id: "pf-port-1", title: "Compreensão e Interpretação de Textos", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-port-2", title: "Tipologia e Gêneros Textuais", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-port-3", title: "Ortografia Oficial e Acentuação Gráfica", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-port-4", title: "Morfossintaxe: Classes de Palavras", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
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
          { id: "pf-adm-1", title: "Princípios Expressos e Implícitos da Adm. Pública", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-adm-2", title: "Organização Administrativa: Direta e Indireta", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-adm-3", title: "Atos Administrativos (Requisitos, Atributos, Extinção)", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
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
          { id: "pf-const-1", title: "Princípios Fundamentais (Art. 1º a 4º CF)", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-const-2", title: "Direitos e Garantias Fundamentais (Art. 5º)", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-const-3", title: "Direitos Sociais, Nacionalidade e Políticos", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-const-4", title: "Organização Político-Administrativa do Estado", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-const-5", title: "Poder Executivo e Poder Judiciário", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-const-6", title: "Segurança Pública (Art. 144 CF)", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
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
          { id: "pf-penal-1", title: "Aplicação da Lei Penal (Tempo, Lugar, Extraterritorialidade)", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-penal-2", title: "Teoria do Crime (Fato Típico, Ilicitude, Culpabilidade)", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-penal-3", title: "Crimes contra a Pessoa e contra o Patrimônio", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-penal-4", title: "Crimes contra a Administração Pública", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-penal-5", title: "Inquérito Policial (Características, Instauração, Trancamento)", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-penal-6", title: "Prisões em Flagrante, Preventiva e Temporária", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
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
          { id: "pf-info-1", title: "Redes de Computadores: Topologias, Protocolos TCP/IP, DNS, DHCP", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-info-2", title: "Segurança da Informação: Criptografia, Malware, Firewall, IDS", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-info-3", title: "Banco de Dados: Modelo Relacional, SQL, NoSQL, Big Data", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-info-4", title: "Python e R para Ciência de Dados Básica", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-info-5", title: "Sistemas Operacionais Linux e Windows", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-info-6", title: "Computação em Nuvem e Ferramentas Colaborativas", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
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
          { id: "pf-cont-1", title: "Conceitos Básicos, Objeto, Finalidade e Usuários", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-cont-2", title: "Patrimônio: Ativo, Passivo e Patrimônio Líquido", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-cont-3", title: "Equação Fundamental do Patrimônio e Fatos Contábeis", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
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
          { id: "pf-rlm-1", title: "Proposições Lógicas, Conectivos e Tabelas-Verdade", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-rlm-2", title: "Equivalências e Negações Lógicas", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pf-rlm-3", title: "Diagramas Lógicos e Teoria dos Conjuntos", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
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
          { id: "prf-port-1", title: "Interpretação de Texto e Coesão", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
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
          { id: "prf-trans-1", title: "Sistema Nacional de Trânsito e Normas Gerais", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "prf-trans-2", title: "Infrações e Penalidades de Trânsito", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
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
          { id: "prf-fis-1", title: "Cinemática Escalar e Vetorial", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "prf-fis-2", title: "Dinâmica e Leis de Newton aplicadas a acidentes", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
        ]
      }
    ]
  },
  {
    id: "pc-sp-escrivao",
    title: "Polícia Civil - Escrivão e Investigador de Polícia",
    shortTitle: "PC-SP - Escrivão / Investigador",
    category: "Policial",
    banca: "Vunesp",
    targetDate: "2026-12-05",
    totalHoursGoal: 550,
    dailyGoalMinutes: 240,
    disciplinas: [
      {
        id: "pc-port",
        name: "Língua Portuguesa",
        color: "#3b82f6",
        icon: "fa-book",
        weight: 4,
        difficulty: 3,
        topicos: [
          { id: "pc-port-1", title: "Interpretação de Textos Literários e Não Literários", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pc-port-2", title: "Crase, Regência Verbal e Nominal", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pc-port-3", title: "Pontuação, Concordância e Sintaxe", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
        ]
      },
      {
        id: "pc-penal",
        name: "Direito Penal & Processual Penal",
        color: "#ef4444",
        icon: "fa-gavel",
        weight: 5,
        difficulty: 4,
        topicos: [
          { id: "pc-pen-1", title: "Aplicação da Lei Penal e Teoria do Crime", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pc-pen-2", title: "Crimes Contra a Pessoa e Contra o Patrimônio", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pc-pen-3", title: "Inquérito Policial, Ação Penal e Provas no CPP", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pc-pen-4", title: "Prisão em Flagrante, Preventiva e Temporária", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
        ]
      },
      {
        id: "pc-leg-esp",
        name: "Legislação Especial Policial",
        color: "#f59e0b",
        icon: "fa-shield",
        weight: 4,
        difficulty: 3,
        topicos: [
          { id: "pc-leg-1", title: "Lei de Drogas (Lei 11.343/06) e Maria da Penha (Lei 11.340/06)", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pc-leg-2", title: "Estatuto do Desarmamento e Crimes Hediondos (Lei 8.072/90)", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pc-leg-3", title: "Abuso de Autoridade (Lei 13.869/19) e Organizações Criminosas", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
        ]
      },
      {
        id: "pc-criminol",
        name: "Noções de Criminologia & Direitos Humanos",
        color: "#8b5cf6",
        icon: "fa-fingerprint",
        weight: 3,
        difficulty: 3,
        topicos: [
          { id: "pc-crim-1", title: "Conceito, Método e Objetos da Criminologia (Delito, Delinquente, Vítima)", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pc-crim-2", title: "Modelos Teóricos da Criminologia e Prevenção Criminal", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pc-crim-3", title: "Declaração Universal dos Direitos Humanos e Pacto de San José", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
        ]
      },
      {
        id: "pc-info",
        name: "Noções de Informática",
        color: "#06b6d4",
        icon: "fa-desktop",
        weight: 3,
        difficulty: 2,
        topicos: [
          { id: "pc-info-1", title: "Sistemas Operacionais Windows e Linux", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pc-info-2", title: "Segurança da Informação, Golpes Virtuais e Backup", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
        ]
      }
    ]
  },
  {
    id: "pm-sp-soldado",
    title: "Polícia Militar - Soldado PM de 2ª Classe",
    shortTitle: "PM-SP - Soldado",
    category: "Policial",
    banca: "Vunesp / FGV",
    targetDate: "2026-09-20",
    totalHoursGoal: 400,
    dailyGoalMinutes: 180,
    disciplinas: [
      {
        id: "pm-port",
        name: "Língua Portuguesa",
        color: "#3b82f6",
        icon: "fa-book",
        weight: 4,
        difficulty: 3,
        topicos: [
          { id: "pm-port-1", title: "Leitura, Interpretação e Sentido Próprio/Figurado", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pm-port-2", title: "Classes de Palavras, Concordância e Regência", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
        ]
      },
      {
        id: "pm-mat",
        name: "Matemática",
        color: "#f59e0b",
        icon: "fa-calculator",
        weight: 3,
        difficulty: 4,
        topicos: [
          { id: "pm-mat-1", title: "Razão, Proporção, Regra de Três e Porcentagem", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pm-mat-2", title: "Equações de 1º e 2º Graus, Geometria Básica e Áreas", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
        ]
      },
      {
        id: "pm-hist-geo",
        name: "História e Geografia do Brasil",
        color: "#10b981",
        icon: "fa-earth-americas",
        weight: 3,
        difficulty: 2,
        topicos: [
          { id: "pm-hg-1", title: "História do Brasil: República, Ditadura e Redemocratização", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pm-hg-2", title: "Geografia: Clima, Vegetação, Urbanização e População Brasileira", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
        ]
      },
      {
        id: "pm-adm-dir",
        name: "Noções de Adm. Pública e Direitos Humanos",
        color: "#8b5cf6",
        icon: "fa-landmark",
        weight: 3,
        difficulty: 2,
        topicos: [
          { id: "pm-ad-1", title: "Constituição Federal (Art. 5º - Direitos Individuais e Coletivos)", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "pm-ad-2", title: "Segurança Pública (Art. 144 da CF) e Polícia Militar", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
        ]
      }
    ]
  },
  {
    id: "depen-penal",
    title: "Polícia Penal Federal / Estadual - Policial Penal",
    shortTitle: "Polícia Penal (DEPEN)",
    category: "Policial",
    banca: "Cebraspe",
    targetDate: "2026-11-28",
    totalHoursGoal: 500,
    dailyGoalMinutes: 210,
    disciplinas: [
      {
        id: "dep-lep",
        name: "Lei de Execução Penal (LEP - Lei 7.210/84)",
        color: "#ef4444",
        icon: "fa-building-shield",
        weight: 5,
        difficulty: 4,
        topicos: [
          { id: "dep-lep-1", title: "Do Condenado, Do Internado e Dos Deveres e Direitos", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "dep-lep-2", title: "Regime Disciplinar Diferenciado (RDD) e Faltas Disciplinares", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "dep-lep-3", title: "Progressão de Regime, Remição de Pena e Livramento Condicional", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
        ]
      },
      {
        id: "dep-penal",
        name: "Direito Penal & Processo Penal",
        color: "#f59e0b",
        icon: "fa-gavel",
        weight: 4,
        difficulty: 3,
        topicos: [
          { id: "dep-pen-1", title: "Crimes Praticados por Funcionário Público Contra a Adm. Pública", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "dep-pen-2", title: "Tortura (Lei 9.455/97) e Abuso de Autoridade (Lei 13.869/19)", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
        ]
      },
      {
        id: "dep-port",
        name: "Língua Portuguesa & Redação Oficial",
        color: "#3b82f6",
        icon: "fa-book",
        weight: 3,
        difficulty: 3,
        topicos: [
          { id: "dep-port-1", title: "Interpretação de Textos, Gramática e Sintaxe", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
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
          { id: "inss-prev-1", title: "Princípios da Seguridade Social", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "inss-prev-2", title: "Beneficiários do RGPS: Segurados e Dependentes", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 },
          { id: "inss-prev-3", title: "Benefícios em Espécie: Aposentadorias e Pensões", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
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
          { id: "inss-port-1", title: "Interpretação e Gramática Geral", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
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
  },
  {
    id: "q-13",
    disciplinaId: "pc-penal",
    disciplinaName: "Direito Penal",
    assunto: "Aplicação da Lei Penal no Tempo",
    banca: "Vunesp",
    orgao: "Polícia Civil - SP",
    cargo: "Investigador de Polícia",
    ano: 2024,
    tipo: "multipla_escolha",
    enunciado: "A respeito da aplicação da lei penal no tempo, assinale a alternativa correta conforme o Código Penal e a jurisprudência sumulada do STF:",
    alternativas: [
      { id: "A", text: "A lei penal mais grave aplica-se ao crime continuado ou permanente, se a sua vigência é anterior à cessação da continuidade ou da permanência." },
      { id: "B", text: "A lei posterior que de qualquer modo favorecer o agente não retroage para fatos já decididos por sentença condenatória transitada em julgado." },
      { id: "C", text: "Considera-se praticado o crime no momento do resultado, ainda que outro seja o momento da ação ou da omissão." },
      { id: "D", text: "A lei excepcional ou temporária não se aplica ao fato praticado durante sua vigência após decorrido o período de sua duração." }
    ],
    respostaCorreta: "A",
    explicacao: "Gabarito: **A**. Aplicação literal da Súmula 711 do STF: 'A lei penal mais grave aplica-se ao crime continuado ou ao crime permanente, se a sua vigência é anterior à cessação da continuidade ou da permanência'. O art. 4º adota a Teoria da Atividade (tempo do crime = momento da conduta)."
  },
  {
    id: "q-14",
    disciplinaId: "pc-penal",
    disciplinaName: "Processo Penal",
    assunto: "Prisão em Flagrante",
    banca: "Vunesp",
    orgao: "Polícia Civil - SP",
    cargo: "Escrivão de Polícia",
    ano: 2023,
    tipo: "multipla_escolha",
    enunciado: "O agente que é perseguido, logo após a prática do delito, pela autoridade, pelo ofendido ou por qualquer pessoa, em situação que faça presumir ser ele autor da infração, encontra-se em flagrante:",
    alternativas: [
      { id: "A", text: "Próprio (perfeito)." },
      { id: "B", text: "Impróprio (quase-flagrante)." },
      { id: "C", text: "Presumido (ficto)." },
      { id: "D", text: "Preparado (provocado)." }
    ],
    respostaCorreta: "B",
    explicacao: "Gabarito: **B**. Conforme art. 302, III, do CPP: considera-se em flagrante impróprio quem 'é perseguido, logo após, pela autoridade, pelo ofendido ou por qualquer pessoa, em situação que faça presumir ser autor da infração'."
  },
  {
    id: "q-15",
    disciplinaId: "dep-lep",
    disciplinaName: "Lei de Execução Penal",
    assunto: "Faltas Disciplinares e RDD",
    banca: "Cebraspe",
    orgao: "DEPEN / SENAPPEN",
    cargo: "Policial Penal Federal",
    ano: 2024,
    tipo: "certo_errado",
    enunciado: "O Regime Disciplinar Diferenciado (RDD) terá duração máxima de até dois anos, sem prejuízo de repetição da sanção por nova falta grave de mesma espécie, até o limite de um sexto da pena aplicada.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "C",
    explicacao: "Gabarito: **CERTO**. Conforme art. 52, I, da Lei 7.210/84 (redação dada pelo Pacote Anticrime - Lei 13.964/19): 'duração máxima de até 2 (dois) anos, sem prejuízo de repetição da sanção por nova falta grave de mesma espécie, até o limite de um sexto da pena aplicada'."
  },
  {
    id: "q-16",
    disciplinaId: "pm-adm-dir",
    disciplinaName: "Direito Constitucional",
    assunto: "Segurança Pública e Forças Policiais",
    banca: "FGV",
    orgao: "Polícia Militar",
    cargo: "Soldado PM",
    ano: 2024,
    tipo: "multipla_escolha",
    enunciado: "De acordo com o art. 144 da Constituição Federal de 1988, às Polícias Militares cabem a:",
    alternativas: [
      { id: "A", text: "Polícia ostensiva e a preservação da ordem pública." },
      { id: "B", text: "Apuração das infrações penais comuns e militares." },
      { id: "C", text: "Execução com exclusividade da polícia judiciária estadual." },
      { id: "D", text: "Guarda externa dos presídios federais e estaduais privativamente." }
    ],
    respostaCorreta: "A",
    explicacao: "Gabarito: **A**. Art. 144, § 5º, da CF: 'Às polícias militares cabem a polícia ostensiva e a preservação da ordem pública; aos corpos de bombeiros militares, além das atribuições definidas em lei, incumbe a execução de atividades de defesa civil'."
  },
  {
    id: "q-17",
    disciplinaId: "prf-transito",
    disciplinaName: "Legislação de Trânsito",
    assunto: "Infrações e Penalidades de Trânsito",
    banca: "Cebraspe",
    orgao: "PRF",
    cargo: "Policial Rodoviário Federal",
    ano: 2024,
    tipo: "certo_errado",
    enunciado: "O condutor que for flagrado dirigindo sob a influência de álcool comete infração de natureza gravíssima, sujeita a penalidade de multa multiplicada por dez e suspensão do direito de dirigir por doze meses.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "C",
    explicacao: "Gabarito: **CERTO**. Conforme art. 165 do CTB: 'Dirigir sob a influência de álcool ou de qualquer outra substância psicoativa que determine dependência: Infração - gravíssima; Penalidade - multa (dez vezes) e suspensão do direito de dirigir por 12 (doze) meses'."
  },
  {
    id: "q-18",
    disciplinaId: "prf-fisica",
    disciplinaName: "Física Mecânica Aplicada",
    assunto: "Cinemática Escalar e Vetorial",
    banca: "Cebraspe",
    orgao: "PRF",
    cargo: "Policial Rodoviário Federal",
    ano: 2023,
    tipo: "certo_errado",
    enunciado: "Em uma colisão frontal perfeitamente inelástica entre dois veículos em movimento linear, a quantidade de movimento total do sistema se conserva, enquanto a energia cinética total do sistema não se conserva.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "C",
    explicacao: "Gabarito: **CERTO**. Em qualquer choque ou colisão em sistema isolado de forças externas, a quantidade de movimento total sempre se conserva. Porém, no choque perfeitamente inelástico, há máxima perda de energia cinética em forma de calor e deformação mecânica."
  },
  {
    id: "q-19",
    disciplinaId: "inss-prev",
    disciplinaName: "Direito Previdenciário",
    assunto: "Princípios da Seguridade Social",
    banca: "Cebraspe",
    orgao: "INSS",
    cargo: "Técnico do Seguro Social",
    ano: 2024,
    tipo: "certo_errado",
    enunciado: "O princípio da universalidade da cobertura e do atendimento prescreve que as ações da seguridade social devem alcançar todas as pessoas que delas necessitarem, independentemente de contribuição para a assistência social e saúde.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "C",
    explicacao: "Gabarito: **CERTO**. O art. 194, parágrafo único, I, da CF/88 consagra o princípio da universalidade da cobertura (riscos sociais cobertos) e do atendimento (pessoas protegidas), sendo a saúde e a assistência social prestadas independentemente de contribuição previdenciária direta."
  },
  {
    id: "q-20",
    disciplinaId: "inss-prev",
    disciplinaName: "Direito Previdenciário",
    assunto: "Beneficiários do RGPS: Segurados e Dependentes",
    banca: "Cebraspe",
    orgao: "INSS",
    cargo: "Técnico do Seguro Social",
    ano: 2023,
    tipo: "certo_errado",
    enunciado: "O cônjuge ou companheiro é considerado dependente de primeira classe no Regime Geral de Previdência Social, cuja dependência econômica em relação ao segurado falecido é presumida por lei, não exigindo comprovação prévia.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "C",
    explicacao: "Gabarito: **CERTO**. Conforme art. 16, I e § 4º, da Lei 8.213/91: o cônjuge, a companheira e o filho não emancipado menor de 21 anos são dependentes de 1ª classe, e a dependência econômica das pessoas indicadas no inciso I é presumida."
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
    id: "fc-11",
    disciplinaId: "prf-transito",
    disciplinaName: "Legislação de Trânsito",
    frente: "Qual a velocidade máxima permitida em rodovias de pista dupla onde não existir sinalização regulamentadora?",
    verso: "Conforme art. 61 do CTB:\n• **110 km/h** para automóveis, camionetas, caminhonetes e motocicletas.\n• **90 km/h** para os demais veículos (ônibus, caminhões, etc.).",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  },
  {
    id: "fc-12",
    disciplinaId: "inss-prev",
    disciplinaName: "Direito Previdenciário",
    frente: "Quais são as três áreas que compõem o tripé da SEGURIDADE SOCIAL na CF/88?",
    verso: "Mnemônico **PAS**:\n1. **P**revidência Social (contributiva)\n2. **A**ssistência Social (não contributiva)\n3. **S**aúde (direito de todos e dever do Estado, não contributiva)",
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
  },
  {
    id: "fc-7",
    disciplinaId: "pf-dir-adm",
    disciplinaName: "Direito Administrativo",
    frente: "Quais são os Princípios Expressos da Administração Pública na CF/88?",
    verso: "Mnemônico **LIMPE** (Art. 37, caput CF):\n• **L**egalidade\n• **I**mpessoalidade\n• **M**oralidade\n• **P**ublicidade\n• **E**ficiência (incluída pela EC 19/98)",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  },
  {
    id: "fc-8",
    disciplinaId: "pf-dir-penal",
    disciplinaName: "Direito Penal",
    frente: "Quais são as Excludentes de Ilicitude / Antijuridicidade (Art. 23 CP)?",
    verso: "Mnemônico **B.R.E.E.L.** (ou C.L.E.E.):\n• **E**stado de Necessidade (Art. 24)\n• **L**egítima Defesa (Art. 25)\n• **E**strito Cumprimento do Dever Legal\n• **E**xercício Regular de Direito",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  },
  {
    id: "fc-9",
    disciplinaId: "pf-dir-penal",
    disciplinaName: "Direito Penal",
    frente: "Tempo do Crime vs Lugar do Crime: quais teorias o Código Penal adota?",
    verso: "Mnemônico **LUTA**:\n• **L**ugar do Crime = Teoria da **U**biquidade (Art. 6º CP - tanto conduta quanto resultado)\n• **T**empo do Crime = Teoria da **A**tividade (Art. 4º CP - momento da ação ou omissão)",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  },
  {
    id: "fc-10",
    disciplinaId: "pf-dir-const",
    disciplinaName: "Direito Constitucional",
    frente: "Quais são os Fundamentos da República Federativa do Brasil (Art. 1º CF)?",
    verso: "Mnemônico **SO-CI-DI-VA-PLU**:\n• **SO**berania\n• **CI**dadania\n• **DI**gnidade da Pessoa Humana\n• **VA**lores Sociais do Trabalho e da Livre Iniciativa\n• **PLU**ralismo Político",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  }
];

const DEFAULT_BADGES = [
  { id: "badge-first-study", title: "Primeiro Passo", desc: "Completou a primeira sessão de estudos no cronômetro", icon: "fa-fire", unlocked: false, date: null },
  { id: "badge-streak-7", title: "Foco 7 Dias", desc: "Manteve 7 dias ininterruptos de estudos ativos", icon: "fa-shield-halved", unlocked: false, date: null },
  { id: "badge-50-questions", title: "50 Questões", desc: "Resolveu mais de 50 questões no banco", icon: "fa-bullseye", unlocked: false, date: null },
  { id: "badge-edital-25", title: "Avanço no Edital", desc: "Completou 25% dos tópicos do seu edital verticalizado", icon: "fa-map-location-dot", unlocked: false, date: null },
  { id: "badge-master-srs", title: "Revisão Ativa", desc: "Revisou 20+ flashcards com repetição espaçada", icon: "fa-brain", unlocked: false, date: null },
  { id: "badge-simulado-pro", title: "Alto Desempenho", desc: "Concluiu um simulado cronometrado com mais de 80% de acertos", icon: "fa-trophy", unlocked: false, date: null },
  { id: "badge-night-owl", title: "Estudo Noturno", desc: "Estudou mais de 2 horas no período da noite", icon: "fa-moon", unlocked: false, date: null },
  { id: "badge-centurion", title: "100 Horas Líquidas", desc: "Acumulou 100 horas líquidas registradas no sistema", icon: "fa-medal", unlocked: false, date: null }
];

const DEFAULT_LEADERBOARD = [
  { rank: 1, name: "Inspetor Nascimento", avatar: "IN", hoursWeekly: 34.5, questionsWeekly: 310, accuracy: 91, xp: 4850, badge: "Lendário" },
  { rank: 2, name: "Delegada Silva", avatar: "DS", hoursWeekly: 31.0, questionsWeekly: 280, accuracy: 88, xp: 4230, badge: "Veterana" },
  { rank: 3, name: "Você", avatar: "EU", hoursWeekly: 24.2, questionsWeekly: 195, accuracy: 84, xp: 3420, isUser: true, badge: "Aspirante" },
  { rank: 4, name: "Lucas Federal", avatar: "LF", hoursWeekly: 22.5, questionsWeekly: 170, accuracy: 81, xp: 3010, badge: "Combatente" },
  { rank: 5, name: "Mariana PRF", avatar: "MP", hoursWeekly: 19.8, questionsWeekly: 160, accuracy: 79, xp: 2750, badge: "Tática" },
  { rank: 6, name: "Roberto Civil", avatar: "RC", hoursWeekly: 17.0, questionsWeekly: 120, accuracy: 76, xp: 2320, badge: "Operador" },
  { rank: 7, name: "Ana PM", avatar: "AP", hoursWeekly: 15.5, questionsWeekly: 95, accuracy: 72, xp: 1980, badge: "Recruta" }
];

const MOTIVATIONAL_QUOTES = [
  { quote: "Quem não mede, não evolui. Acompanhe suas métricas diariamente.", author: "Gestão de Estudos" },
  { quote: "A disciplina é a ponte entre a meta de passar e a nomeação no Diário Oficial.", author: "QG do Concurseiro" },
  { quote: "A constância nos estudos bate o talento todos os dias. Um bloco de cada vez.", author: "Método de Aprovação" },
  { quote: "O segredo da aprovação é transformar esforço diário em hábito inabalável.", author: "QG do Concurseiro" },
  { quote: "Cada questão resolvida e analisada hoje é um erro a menos no dia da prova.", author: "Estratégia de Prova" },
  { quote: "A persistência diária é o caminho mais seguro até a sua posse.", author: "QG do Concurseiro" }
];

export {
  DEFAULT_CONCURSOS,
  DEFAULT_QUESTIONS,
  DEFAULT_FLASHCARDS,
  DEFAULT_BADGES,
  DEFAULT_LEADERBOARD,
  MOTIVATIONAL_QUOTES
};

if (typeof window !== "undefined") {
  window.DEFAULT_CONCURSOS = DEFAULT_CONCURSOS;
  window.DEFAULT_QUESTIONS = DEFAULT_QUESTIONS;
  window.DEFAULT_FLASHCARDS = DEFAULT_FLASHCARDS;
  window.DEFAULT_BADGES = DEFAULT_BADGES;
  window.DEFAULT_LEADERBOARD = DEFAULT_LEADERBOARD;
  window.MOTIVATIONAL_QUOTES = MOTIVATIONAL_QUOTES;
}
