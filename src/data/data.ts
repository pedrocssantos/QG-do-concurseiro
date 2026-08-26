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
  },
  {
    id: "q-21",
    disciplinaId: "pf-dir-penal",
    disciplinaName: "Direito Penal & Processual Penal",
    assunto: "Crimes contra a Administração Pública",
    banca: "Cebraspe",
    orgao: "Polícia Federal",
    cargo: "Agente de Polícia",
    ano: 2024,
    tipo: "certo_errado",
    enunciado: "O servidor público que exige, para si ou para outrem, direta ou indiretamente, ainda que fora da função ou antes de assumi-la, mas em razão dela, vantagem indevida, comete o crime de corrupção passiva.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "E",
    explicacao: "Gabarito: **ERRADO**. O verbo nuclear **EXIGIR** tipifica o crime de **CONCUSSÃO** (Art. 316 do CP). Na corrupção passiva (Art. 317 do CP), os verbos nucleares são *solicitar, receber* ou *aceitar promessa* de vantagem indevida."
  },
  {
    id: "q-22",
    disciplinaId: "pf-dir-penal",
    disciplinaName: "Direito Penal & Processual Penal",
    assunto: "Inquérito Policial",
    banca: "Cebraspe",
    orgao: "Polícia Federal",
    cargo: "Escrivão de Polícia",
    ano: 2024,
    tipo: "certo_errado",
    enunciado: "A autoridade policial não poderá mandar arquivar autos de inquérito policial, sendo o arquivamento ato privativo da autoridade judiciária competente mediante provocação do titular da ação penal.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "C",
    explicacao: "Gabarito: **CERTO**. Princípio da Indisponibilidade do Inquérito Policial (Art. 17 do CPP): 'A autoridade policial não poderá mandar arquivar autos de inquérito'."
  },
  {
    id: "q-23",
    disciplinaId: "pf-dir-adm",
    disciplinaName: "Direito Administrativo",
    assunto: "Licitações e Contratos (Nova Lei 14.133/21)",
    banca: "Cebraspe",
    orgao: "Polícia Federal",
    cargo: "Agente de Polícia",
    ano: 2024,
    tipo: "certo_errado",
    enunciado: "De acordo com a Nova Lei de Licitações (Lei nº 14.133/2021), a inexigibilidade de licitação decorre da inviabilidade de competição, como na contratação de profissional do setor artístico consagrado pela crítica especializada ou pela opinião pública.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "C",
    explicacao: "Gabarito: **CERTO**. Art. 74, II, da Lei nº 14.133/2021: 'É inexigível a licitação quando inviável a competição, em especial no caso de: [...] II - contratação de profissional do setor artístico, diretamente ou por meio de empresário exclusivo, desde que consagrado pela crítica especializada ou pela opinião pública'."
  },
  {
    id: "q-24",
    disciplinaId: "pf-dir-adm",
    disciplinaName: "Direito Administrativo",
    assunto: "Lei de Improbidade Administrativa (Lei 8.429/92)",
    banca: "Cebraspe",
    orgao: "PRF",
    cargo: "Policial Rodoviário Federal",
    ano: 2024,
    tipo: "certo_errado",
    enunciado: "Após as alterações introduzidas pela Lei nº 14.230/2021, todos os atos de improbidade administrativa previstos na Lei nº 8.429/1992 passaram a exigir a comprovação do dolo específico, não subsistindo mais a modalidade culposa em nenhuma hipótese.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "C",
    explicacao: "Gabarito: **CERTO**. O art. 1º, §§ 1º e 2º, da Lei 8.429/92 (com redação da Lei 14.230/21) extinguiu a improbidade culposa (inclusive do art. 10 - lesão ao erário), passando a exigir estritamente o dolo específico."
  },
  {
    id: "q-25",
    disciplinaId: "pf-dir-const",
    disciplinaName: "Direito Constitucional",
    assunto: "Remédios Constitucionais",
    banca: "Cebraspe",
    orgao: "Polícia Federal",
    cargo: "Papiloscopista",
    ano: 2024,
    tipo: "certo_errado",
    enunciado: "O habeas data é a ação constitucional cabível para assegurar o conhecimento de informações relativas à pessoa do impetrante, constantes de registros ou bancos de dados de entidades governamentais ou de caráter público, sendo sua impetração condicionada à prévia recusa administrativa.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "C",
    explicacao: "Gabarito: **CERTO**. Súmula nº 2 do STJ: 'Não cabe o habeas data (CF, art. 5º, LXXII, a) se não houve recusa de informações por parte da autoridade administrativa'."
  },
  {
    id: "q-26",
    disciplinaId: "pf-info",
    disciplinaName: "Informática & Tecnologia da Informação",
    assunto: "Criptografia e Segurança da Informação",
    banca: "Cebraspe",
    orgao: "Polícia Federal",
    cargo: "Perito Criminal Federal",
    ano: 2024,
    tipo: "certo_errado",
    enunciado: "Na criptografia assimétrica, a chave pública do destinatário é utilizada para cifrar a mensagem, e apenas a chave privada correspondente do destinatário é capaz de decifrar o conteúdo, garantindo confidencialidade.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "C",
    explicacao: "Gabarito: **CERTO**. Princípio básico da criptografia de chave pública (assimétrica): Quem quer enviar mensagem confidencial cifra com a chave pública do receptor; somente o receptor (de posse de sua chave privada secreta) consegue decifrar."
  },
  {
    id: "q-27",
    disciplinaId: "pf-info",
    disciplinaName: "Informática & Tecnologia da Informação",
    assunto: "Banco de Dados: SQL DDL e DML",
    banca: "Cebraspe",
    orgao: "Polícia Federal",
    cargo: "Agente de Polícia",
    ano: 2024,
    tipo: "certo_errado",
    enunciado: "Em linguagem SQL, os comandos CREATE, ALTER e DROP pertencem à categoria DML (Data Manipulation Language), pois alteram os registros de dados armazenados nas tabelas.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "E",
    explicacao: "Gabarito: **ERRADO**. Os comandos CREATE, ALTER e DROP pertencem à categoria **DDL (Data Definition Language)**, pois definem e modificam a estrutura do banco de dados (schema). DML compreende INSERT, UPDATE e DELETE."
  },
  {
    id: "q-28",
    disciplinaId: "pf-contab",
    disciplinaName: "Contabilidade Geral",
    assunto: "Regime de Competência e Fatos Contábeis",
    banca: "Cebraspe",
    orgao: "Polícia Federal",
    cargo: "Agente de Polícia",
    ano: 2024,
    tipo: "certo_errado",
    enunciado: "Pelo regime de competência, as receitas e as despesas devem ser incluídas na apuração do resultado do período em que ocorrerem os seus respectivos pagamentos ou recebimentos em dinheiro.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "E",
    explicacao: "Gabarito: **ERRADO**. A definição apresentada refere-se ao **Regime de Caixa**. Pelo **Regime de Competência** (NBC TG Estrutura Conceitual), receitas e despesas são reconhecidas no momento do seu fato gerador (quando incorridas/geradas), independentemente do recebimento ou pagamento em dinheiro."
  },
  {
    id: "q-29",
    disciplinaId: "pf-rlm",
    disciplinaName: "Raciocínio Lógico e Estatística",
    assunto: "Equivalências e Negações Lógicas",
    banca: "Cebraspe",
    orgao: "Polícia Federal",
    cargo: "Escrivão de Polícia",
    ano: 2024,
    tipo: "certo_errado",
    enunciado: "A negação lógica da proposição condicional 'Se o suspeito mente, então ele é culpado' é equivalente a 'O suspeito mente e ele não é culpado'.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "C",
    explicacao: "Gabarito: **CERTO**. Regra do **MANÉ** para negação da condicional p → q: Mantém a primeira (p) **E** Nega a segunda (~q). Portanto: ~(p → q) ≡ p ∧ ~q."
  },
  {
    id: "q-30",
    disciplinaId: "prf-transito",
    disciplinaName: "Legislação de Trânsito",
    assunto: "Crimes de Trânsito (Art. 306 CTB)",
    banca: "Cebraspe",
    orgao: "PRF",
    cargo: "Policial Rodoviário Federal",
    ano: 2024,
    tipo: "certo_errado",
    enunciado: "O crime de conduzir veículo automotor com capacidade psicomotora alterada em razão da influência de álcool (art. 306 do CTB) é de perigo abstrato, dispensando a demonstração de perigo concreto à segurança viária.",
    alternativas: [
      { id: "C", text: "Certo" },
      { id: "E", text: "Errado" }
    ],
    respostaCorreta: "C",
    explicacao: "Gabarito: **CERTO**. Jurisprudência pacificada do STJ (Tema 484 / Súmula em Recursos Repetitivos) e STF: O crime do art. 306 do CTB é de **perigo abstrato**, configurando-se com a simples condução de veículo automotor sob influência de álcool nos índices legais, dispensando dano ou perigo concreto."
  }
];

const DEFAULT_FLASHCARDS = [
  {
    id: "fc-1",
    disciplinaId: "pf-port",
    disciplinaName: "Português",
    frente: "Qual é a regra geral para a ocorrência da CRASE?",
    verso: "A crase é a fusão da preposição **'a'** (exigida por um termo regente) com o artigo definido feminino **'a(s)'** ou pronome demonstrativo (**aquele, aquela, aquilo**).\n\n**Dica Prática:** Substitua a palavra feminina por uma masculina correspondente; se virar **'ao'**, ocorre crase!",
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
    verso: "A qualquer hora do dia ou da noite nas 3 hipóteses do Art. 5º, XI CF:\n1. **Flagrante delito**\n2. **Desastre**\n3. **Prestar socorro**\n\n*(Com determinação judicial: SOMENTE DURANTE O DIA!)*",
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
    disciplinaId: "pf-ti",
    disciplinaName: "Informática e TI",
    frente: "O que é Phishing e qual o seu objetivo?",
    verso: "Técnica de Engenharia Social que utiliza e-mails, sites clonados ou mensagens fraudulentas para induzir a vítima a fornecer dados sensíveis (senhas, cartões, dados bancários).",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  },
  {
    id: "fc-6",
    disciplinaId: "pf-rlm",
    disciplinaName: "Raciocínio Lógico e Matemática",
    frente: "Como se faz a Negação de uma Proposição Condicional (Se P, então Q)?",
    verso: "Regra do **MANÉ**:\n• **MA**ntém a primeira (P)\n• **E** (conectivo ^)\n• **NE**ga a segunda (~Q)\n\nFórmula: **~(P -> Q) <=> P ^ ~Q**",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  },
  {
    id: "fc-7",
    disciplinaId: "pf-contab",
    disciplinaName: "Contabilidade Geral",
    frente: "Qual a natureza dos saldos das contas do ATIVO e do PASSIVO?",
    verso: "• **Contas do Ativo:** Natureza **DEVEDORA** (Aumentam a Débito, Diminuem a Crédito).\n• **Contas do Passivo e PL:** Natureza **CREDORA** (Aumentam a Crédito, Diminuem a Débito).\n• **Contas de Despesa:** Devedoras.\n• **Contas de Receita:** Credoras.",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  },
  {
    id: "fc-8",
    disciplinaId: "pf-port",
    disciplinaName: "Português",
    frente: "Quais são as Conjunções Concessivas mais cobradas em provas?",
    verso: "Mnemônico: **Embora, ainda que, se bem que, mesmo que, conquanto, por mais que, posto que**.\n\n*Expressam ideia de oposição/ressalva sem anular a oração principal.*",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  },
  {
    id: "fc-9",
    disciplinaId: "pf-dir-proc-penal",
    disciplinaName: "Direito Processual Penal",
    frente: "O Inquérito Policial pode ser arquivado pela Autoridade Policial (Delegado)?",
    verso: "**NÃO!** Conforme Art. 17 do CPP: *'A autoridade policial não poderá mandar arquivar autos de inquérito.'* O arquivamento é ato judicial a requerimento do Ministério Público.",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  },
  {
    id: "fc-10",
    disciplinaId: "pf-estat",
    disciplinaName: "Estatística",
    frente: "Qual a relação entre Média, Mediana e Moda em uma Distribuição Simétrica?",
    verso: "Em uma curva perfeitamente simétrica (Gaussiana/Normal):\n\n**Média = Mediana = Moda**",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  },
  {
    id: "fc-13",
    disciplinaId: "pf-ti",
    disciplinaName: "Informática e TI",
    frente: "Qual a diferença entre Chave Primária (PK) e Chave Estrangeira (FK) em Banco de Dados Relacional?",
    verso: "• **Chave Primária (PK):** Identifica de forma única e exclusiva cada tupla (linha) de uma tabela. Não aceita valores nulos nem duplicados.\n• **Chave Estrangeira (FK):** Campo que faz referência à Chave Primária de outra tabela, estabelecendo o relacionamento entre elas.",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  },
  {
    id: "fc-14",
    disciplinaId: "pf-dir-adm",
    disciplinaName: "Direito Administrativo",
    frente: "Quais são as diferenças entre Desconcentração e Descentralização?",
    verso: "• **DesCOncentração:** Criação de **Ó**rgãos dentro da mesma pessoa jurídica (relação de subordinação/hierarquia).\n• **DesCENtralização:** Criação de uma nova **EN**tidade (Autarquia, Fundação, etc.), sem subordinação hierárquica (apenas vinculação/supervisão).",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  },
  {
    id: "fc-15",
    disciplinaId: "pf-dir-penal",
    disciplinaName: "Direito Penal",
    frente: "Quais são os elementos do Fato Típico segundo a Teoria Tripartida?",
    verso: "Fato Típico é composto por:\n1. **Conduta** (ação ou omissão dolosa/culposa)\n2. **Resultado** (nos crimes materiais)\n3. **Nexo de Causalidade**\n4. **Tipicidade** (formal e material)",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  },
  {
    id: "fc-16",
    disciplinaId: "pf-contab",
    disciplinaName: "Contabilidade Geral",
    frente: "Qual é a Equação Fundamental do Patrimônio na Contabilidade?",
    verso: "**ATIVO = PASSIVO EXIGÍVEL + PATRIMÔNIO LÍQUIDO** (A = P + PL)\n\n• **Ativo (A):** Bens e Direitos (Aplicação de Recursos).\n• **Passivo Exigível (P):** Obrigações com Terceiros (Origem de Terceiros).\n• **Patrimônio Líquido (PL):** Capital Próprio / Situação Líquida (Origem Própria).",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  },
  {
    id: "fc-17",
    disciplinaId: "dep-lep",
    disciplinaName: "Lei de Execução Penal (LEP)",
    frente: "Como funciona a REMIÇÃO DE PENA por trabalho e por estudo (Art. 126 LEP)?",
    verso: "• **Por Trabalho:** 1 dia de pena a cada **3 dias de trabalho** (jornada de 6h a 8h).\n• **Por Estudo:** 1 dia de pena a cada **12 horas de frequência escolar** (divididas em no mínimo 3 dias).\n\n*O preso em regime fechado ou semiaberto pode remir a pena por ambas as modalidades cumulativamente.*",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split("T")[0]
  },
  {
    id: "fc-18",
    disciplinaId: "pf-dir-const",
    disciplinaName: "Direito Constitucional",
    frente: "Quais são as principais matérias de Competência Privativa da União (Art. 22 CF)?",
    verso: "Mnemônico **CAPACETE DE P.M.** (Direito...):\n• **C**ivil\n• **A**grário\n• **P**enal\n• **A**eronáutico\n• **C**omercial\n• **E**leitoral\n• **T**rabalho\n• **E**spacial\n• **D**esapropriação\n• **E**nergia\n• **P**rocessual\n• **M**arítimo",
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

const DEFAULT_TAF_CRITERIA = {
  pf: {
    nome: "Polícia Federal (Agente/Escrivão)",
    genero: {
      M: {
        barra: { nome: "Barra Fixa (Repetições)", min: 2, max: 15, pesoMin: 2, pesoMax: 5, tipo: "reps" },
        salto: { nome: "Impulsão Horizontal (Metros)", min: 1.70, max: 2.14, pesoMin: 2, pesoMax: 5, tipo: "metros" },
        natacao: { nome: "Natação 50m (Segundos)", min: 56, max: 38, pesoMin: 2, pesoMax: 5, tipo: "tempo_menor" },
        corrida: { nome: "Corrida 12min (Metros)", min: 2000, max: 2710, pesoMin: 2, pesoMax: 5, tipo: "metros" },
        abdominal: null
      },
      F: {
        barra: { nome: "Barra Fixa - Isometria (Segundos)", min: 15, max: 30, pesoMin: 2, pesoMax: 5, tipo: "tempo_maior" },
        salto: { nome: "Impulsão Horizontal (Metros)", min: 1.30, max: 1.64, pesoMin: 2, pesoMax: 5, tipo: "metros" },
        natacao: { nome: "Natação 50m (Segundos)", min: 64, max: 41, pesoMin: 2, pesoMax: 5, tipo: "tempo_menor" },
        corrida: { nome: "Corrida 12min (Metros)", min: 1600, max: 2310, pesoMin: 2, pesoMax: 5, tipo: "metros" },
        abdominal: null
      }
    }
  },
  prf: {
    nome: "Polícia Rodoviária Federal (Policial)",
    genero: {
      M: {
        barra: { nome: "Barra Fixa (Repetições)", min: 3, max: 9, pesoMin: 2, pesoMax: 5, tipo: "reps" },
        salto: { nome: "Impulsão Horizontal (Metros)", min: 2.00, max: 2.40, pesoMin: 2, pesoMax: 5, tipo: "metros" },
        abdominal: { nome: "Abdominal Remador (1 min)", min: 31, max: 45, pesoMin: 2, pesoMax: 5, tipo: "reps" },
        corrida: { nome: "Corrida 12min (Metros)", min: 2300, max: 2800, pesoMin: 2, pesoMax: 5, tipo: "metros" },
        natacao: null
      },
      F: {
        barra: { nome: "Barra Fixa - Isometria (Segundos)", min: 10, max: 25, pesoMin: 2, pesoMax: 5, tipo: "tempo_maior" },
        salto: { nome: "Impulsão Horizontal (Metros)", min: 1.60, max: 1.95, pesoMin: 2, pesoMax: 5, tipo: "metros" },
        abdominal: { nome: "Abdominal Remador (1 min)", min: 25, max: 37, pesoMin: 2, pesoMax: 5, tipo: "reps" },
        corrida: { nome: "Corrida 12min (Metros)", min: 2000, max: 2400, pesoMin: 2, pesoMax: 5, tipo: "metros" },
        natacao: null
      }
    }
  },
  pc: {
    nome: "Polícia Civil (Agente / Investigador)",
    genero: {
      M: {
        barra: { nome: "Barra Fixa (Repetições)", min: 3, max: 10, pesoMin: 2, pesoMax: 5, tipo: "reps" },
        salto: { nome: "Impulsão Horizontal (Metros)", min: 1.80, max: 2.20, pesoMin: 2, pesoMax: 5, tipo: "metros" },
        abdominal: { nome: "Abdominal Remador (1 min)", min: 30, max: 42, pesoMin: 2, pesoMax: 5, tipo: "reps" },
        corrida: { nome: "Corrida 12min (Metros)", min: 2200, max: 2700, pesoMin: 2, pesoMax: 5, tipo: "metros" },
        natacao: null
      },
      F: {
        barra: { nome: "Barra Fixa - Isometria (Segundos)", min: 12, max: 26, pesoMin: 2, pesoMax: 5, tipo: "tempo_maior" },
        salto: { nome: "Impulsão Horizontal (Metros)", min: 1.40, max: 1.75, pesoMin: 2, pesoMax: 5, tipo: "metros" },
        abdominal: { nome: "Abdominal Remador (1 min)", min: 24, max: 35, pesoMin: 2, pesoMax: 5, tipo: "reps" },
        corrida: { nome: "Corrida 12min (Metros)", min: 1800, max: 2300, pesoMin: 2, pesoMax: 5, tipo: "metros" },
        natacao: null
      }
    }
  },
  pm: {
    nome: "Polícia Militar (Soldado / Oficial)",
    genero: {
      M: {
        barra: { nome: "Barra Fixa / Flexão", min: 3, max: 11, pesoMin: 20, pesoMax: 100, tipo: "reps" },
        salto: { nome: "Impulsão Horizontal (Metros)", min: 1.70, max: 2.10, pesoMin: 20, pesoMax: 100, tipo: "metros" },
        abdominal: { nome: "Abdominal (1 min)", min: 30, max: 46, pesoMin: 20, pesoMax: 100, tipo: "reps" },
        corrida: { nome: "Corrida 12min (Metros)", min: 2100, max: 2800, pesoMin: 20, pesoMax: 100, tipo: "metros" },
        natacao: null
      },
      F: {
        barra: { nome: "Barra Fixa - Isometria", min: 10, max: 28, pesoMin: 20, pesoMax: 100, tipo: "tempo_maior" },
        salto: { nome: "Impulsão Horizontal (Metros)", min: 1.30, max: 1.70, pesoMin: 20, pesoMax: 100, tipo: "metros" },
        abdominal: { nome: "Abdominal (1 min)", min: 22, max: 36, pesoMin: 20, pesoMax: 100, tipo: "reps" },
        corrida: { nome: "Corrida 12min (Metros)", min: 1700, max: 2300, pesoMin: 20, pesoMax: 100, tipo: "metros" },
        natacao: null
      }
    }
  }
};

const DEFAULT_DISCURSIVA_TEMAS = [
  {
    id: "tema-pf-ciber",
    title: "O Papel da Polícia Federal no Combate a Cibercrimes e Crime Organizado",
    orgao: "Polícia Federal",
    banca: "Cebraspe",
    ano: 2026,
    tema: "O papel estratégico da Polícia Federal na investigação de crimes cibernéticos, desarticulação financeira de facções criminosas e cooperação internacional.",
    textoMotivador: "O avanço das tecnologias de informação transformou o modus operandi do crime organizado, com lavagem de capitais via criptoativos, ataques ransomware e tráfico em canais digitais criptografados. Nesse cenário, as forças federais de segurança pública desempenham papel central na repressão qualificada.",
    topicosObrigatorios: [
      "1. A relevância da inteligência policial e da perícia forense digital nas investigações modernas (4,0 pts);",
      "2. O asfixiamento financeiro e o confisco de bens como principal vetor de neutralização das organizações criminosas (4,0 pts);",
      "3. A cooperação policial internacional (ex: Interpol, acordos bilaterais) na persecução de delitos transfronteiriços (2,0 pts)."
    ],
    padraoResposta: "O candidato deve redigir um texto dissertativo-argumentativo claro e coeso, estruturado em introdução, desenvolvimento de cada um dos tópicos indicados e conclusão.\n\nNo Tópico 1, deve destacar ferramentas forenses, cadeia de custódia da prova digital (Art. 158-A do CPP) e interceptações telemáticas.\nNo Tópico 2, enfatizar o desmantelamento patrimonial através da Lei de Lavagem de Dinheiro (Lei 9.613/98) e Lei das Organizações Criminosas (Lei 12.850/13).\nNo Tópico 3, citar a atuação da PF como representante da Interpol no Brasil, cooperação jurídica e extradição.",
    dicasEstruturais: "Utilize conectivos interparágrafos (Ademais, Outrossim, Nesse prisma), mantenha letra legível e distribua em média 7 a 8 linhas por parágrafo, totalizando entre 27 e 30 linhas.",
    maxLinhas: 30
  },
  {
    id: "tema-prf-transito",
    title: "Segurança Viária e Redução da Violência no Trânsito Brasileiro",
    orgao: "Polícia Rodoviária Federal",
    banca: "Cebraspe",
    ano: 2025,
    tema: "Tecnologia, fiscalização tática e educação no trânsito como pilares da PRF para a preservação de vidas nas rodovias federais.",
    textoMotivador: "As mortes e lesões no trânsito constituem grave problema de saúde pública e geram bilhões de prejuízos econômicos anuais ao Brasil. A atuação da PRF combina fiscalização ostensiva com dados de inteligência geoespacial.",
    topicosObrigatorios: [
      "1. A importância da fiscalização com etilômetros e radares no enfrentamento das infrações graves (3,5 pts);",
      "2. O uso de videomonitoramento inteligente e leitura de placas na repressão ao roubo de cargas e contrabando (3,5 pts);",
      "3. Ações educativas continuadas da PRF e conscientização cívica da sociedade (3,0 pts)."
    ],
    padraoResposta: "O texto deve demonstrar o papel multifacetado da PRF: além de fiscalizatória, atua na segurança pública preventiva e na garantia do direito constitucional à segurança viária (Art. 144, § 10 da CF/88).",
    dicasEstruturais: "Apresente dados técnicos do PNATRANS e conceitos do Código de Trânsito Brasileiro (CTB). Evite gírias e construções na primeira pessoa.",
    maxLinhas: 30
  },
  {
    id: "tema-pc-mulher",
    title: "Eficácia da Lei Maria da Penha e Atuação da Polícia Civil",
    orgao: "Polícia Civil",
    banca: "Cebraspe / FGV",
    ano: 2025,
    tema: "A atuação da Polícia Judiciária na proteção integral da mulher vítima de violência doméstica e familiar e a concessão de medidas protetivas de urgência.",
    textoMotivador: "A Lei nº 11.340/2006 (Lei Maria da Penha) e as recentes alterações legislativas ampliaram os poderes cautelares da autoridade policial na concessão imediata de medidas protetivas.",
    topicosObrigatorios: [
      "1. As formas de violência previstas na Lei Maria da Penha (física, psicológica, sexual, patrimonial e moral) (3,0 pts);",
      "2. A atribuição do Delegado de Polícia no afastamento do agressor do lar nos municípios que não são sede de comarca (4,0 pts);",
      "3. O atendimento especializado da DEAM (Delegacia Especializada de Atendimento à Mulher) e a não revitimização (3,0 pts)."
    ],
    padraoResposta: "O candidato deve articular os aspectos materiais e processuais da Lei 11.340/06, citando o Art. 12-C da Lei Maria da Penha e a relevância da oitiva qualificada em ambiente humanizado.",
    dicasEstruturais: "Garanta uma divisão clara em 4 parágrafos: Introdução (contextualização), D1 (formas de violência), D2 (atuação cautelar da polícia), Conclusão (DEAM e acolhimento).",
    maxLinhas: 30
  }
];

const DEFAULT_LEIS = [
  {
    id: "lei-cf88",
    sigla: "CF/88",
    nome: "Constituição da República Federativa do Brasil",
    categoria: "Direito Constitucional",
    descricao: "Artigos fundamentais de Direitos e Garantias (Art. 5º) e Segurança Pública (Art. 144).",
    artigos: [
      {
        id: "cf88-art5-caput",
        numero: "Art. 5º",
        caput: "Todos são iguais perante a lei, sem distinção de qualquer natureza, garantindo-se aos brasileiros e aos estrangeiros residentes no País a inviolabilidade do direito à vida, à liberdade, à igualdade, à segurança e à propriedade.",
        incisos: [
          "II - ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei (Princípio da Legalidade);",
          "XI - a casa é asilo inviolável do indivíduo, ninguém nela podendo penetrar sem consentimento do morador, salvo em caso de flagrante delito ou desastre, ou para prestar socorro, ou, durante o dia, por determinação judicial;",
          "XII - é inviolável o sigilo da correspondência e das comunicações telegráficas, de dados e das comunicações telefônicas, salvo, no último caso, por ordem judicial, nas hipóteses e na forma que a lei estabelecer para fins de investigação criminal ou instrução processual penal;",
          "LVII - ninguém será considerado culpado até o trânsito em julgado de sentença penal condenatória (Presunção de Inocência);"
        ],
        destaque: true,
        tema: "Direitos e Garantias Fundamentais"
      },
      {
        id: "cf88-art144",
        numero: "Art. 144",
        caput: "A segurança pública, dever do Estado, direito e responsabilidade de todos, é exercida para a preservação da ordem pública e da incolumidade das pessoas e do patrimônio, através dos seguintes órgãos:",
        incisos: [
          "I - polícia federal;",
          "II - polícia rodoviária federal;",
          "III - polícia ferroviária federal;",
          "IV - polícias civis;",
          "V - polícias militares e corpos de bombeiros militares;",
          "VI - polícias penais federal, estaduais e distrital."
        ],
        destaque: true,
        tema: "Da Segurança Pública"
      }
    ]
  },
  {
    id: "lei-cp",
    sigla: "CP",
    nome: "Código Penal Brasileiro (Decreto-Lei nº 2.848/1940)",
    categoria: "Direito Penal",
    descricao: "Princípios penais, Teoria do Crime, Ilicitude e Crimes contra a Administração Pública.",
    artigos: [
      {
        id: "cp-art1",
        numero: "Art. 1º",
        caput: "Não há crime sem lei anterior que o defina. Não há pena sem prévia cominação legal.",
        destaque: true,
        tema: "Anterioridade e Legalidade Penal"
      },
      {
        id: "cp-art23",
        numero: "Art. 23",
        caput: "Não há crime quando o agente pratica o fato em estado de necessidade, em legítima defesa, em estrito cumprimento de dever legal ou no exercício regular de direito.",
        destaque: true,
        tema: "Excludentes de Ilicitude"
      },
      {
        id: "cp-art312",
        numero: "Art. 312",
        caput: "Apropriar-se o funcionário público de dinheiro, valor ou qualquer outro bem móvel, público ou particular, de que tem a posse em razão do cargo, ou desviá-lo, em proveito próprio ou alheio (Peculato). Pena - reclusão, de 2 a 12 anos, e multa.",
        destaque: true,
        tema: "Crimes Praticados por Funcionário Público"
      },
      {
        id: "cp-art317",
        numero: "Art. 317",
        caput: "Solicitar ou receber, para si ou para outrem, direta ou indiretamente, ainda que fora da função ou antes de assumi-la, mas em razão dela, vantagem indevida, ou aceitar promessa de tal vantagem (Corrupção Passiva). Pena - reclusão, de 2 a 12 anos, e multa.",
        destaque: true,
        tema: "Corrupção Passiva"
      }
    ]
  },
  {
    id: "lei-cpp",
    sigla: "CPP",
    nome: "Código de Processo Penal (Decreto-Lei nº 3.689/1941)",
    categoria: "Direito Processual Penal",
    descricao: "Inquérito policial, flagrante delito, prisão preventiva e provas.",
    artigos: [
      {
        id: "cpp-art4",
        numero: "Art. 4º",
        caput: "A polícia judiciária será exercida pelas autoridades policiais no território de suas respectivas circunscrições e terá por fim a apuração das infrações penais e da sua autoria.",
        destaque: true,
        tema: "Inquérito Policial"
      },
      {
        id: "cpp-art301",
        numero: "Art. 301",
        caput: "Qualquer do povo poderá e as autoridades policiais e seus agentes deverão prender quem quer que seja encontrado em flagrante delito.",
        destaque: true,
        tema: "Prisão em Flagrante"
      },
      {
        id: "cpp-art312",
        numero: "Art. 312",
        caput: "A prisão preventiva poderá ser decretada como garantia da ordem pública, da ordem econômica, por conveniência da instrução criminal ou para assegurar a aplicação da lei penal, quando houver prova da existência do crime e indício suficiente de autoria e de perigo gerado pelo estado de liberdade do imputado.",
        destaque: true,
        tema: "Prisão Preventiva"
      }
    ]
  },
  {
    id: "lei-8112",
    sigla: "Lei 8.112/90",
    nome: "Regime Jurídico dos Servidores Públicos Civis da União",
    categoria: "Direito Administrativo",
    descricao: "Deveres, proibições, responsabilidades e penalidades disciplinares dos servidores federais.",
    artigos: [
      {
        id: "lei8112-art116",
        numero: "Art. 116",
        caput: "São deveres do servidor: exercer com zelo e dedicação as atribuições do cargo; ser leal às instituições a que servir; observar as normas legais e regulamentares; cumprir as ordens superiores, exceto quando manifestamente ilegais; atender com presteza ao público...",
        destaque: true,
        tema: "Deveres do Servidor Público"
      },
      {
        id: "lei8112-art117",
        numero: "Art. 117",
        caput: "Ao servidor é proibido: ausentar-se do serviço durante o expediente, sem prévia autorização; retirar, sem prévia anuência, qualquer documento ou objeto; recusar fé a documentos públicos; valer-se do cargo para lograr proveito pessoal ou de outrem...",
        destaque: true,
        tema: "Proibições do Servidor"
      },
      {
        id: "lei8112-art132",
        numero: "Art. 132",
        caput: "A demissão será aplicada nos seguintes casos: crime contra a administração pública; abandono de cargo; inassiduidade habitual; improbidade administrativa; aplicação irregular de dinheiros públicos; corrupção; insubordinação grave em serviço...",
        destaque: true,
        tema: "Demissão e Penalidades"
      }
    ]
  },
  {
    id: "lei-drogas",
    sigla: "Lei 11.343/06",
    nome: "Lei de Drogas (Sistema Nacional de Políticas sobre Drogas)",
    categoria: "Legislação Penal Especial",
    descricao: "Crimes de tráfico, posse para consumo pessoal, associação e procedimentos.",
    artigos: [
      {
        id: "drogas-art28",
        numero: "Art. 28",
        caput: "Quem adquirir, guardar, tiver em depósito, transportar ou trouxer consigo, para consumo pessoal, drogas sem autorização ou em desacordo com determinação legal será submetido às seguintes penas: I - advertência; II - prestação de serviços à comunidade; III - medida educativa de comparecimento a programa ou curso educativo (Não há pena privativa de liberdade).",
        destaque: true,
        tema: "Posse para Uso Pessoal"
      },
      {
        id: "drogas-art33",
        numero: "Art. 33",
        caput: "Importar, exportar, remeter, preparar, produzir, fabricar, adquirir, vender, expor à venda, oferecer, ter em depósito, transportar, trazer consigo, guardar, prescrever, ministrar, entregar a consumo ou fornecer drogas, ainda que gratuitamente, sem autorização ou em desacordo com determinação legal. Pena - reclusão de 5 a 15 anos e pagamento de 500 a 1.500 dias-multa.",
        destaque: true,
        tema: "Tráfico Ilícito de Drogas"
      }
    ]
  }
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
  MOTIVATIONAL_QUOTES,
  DEFAULT_TAF_CRITERIA,
  DEFAULT_DISCURSIVA_TEMAS,
  DEFAULT_LEIS
};

if (typeof window !== "undefined") {
  window.DEFAULT_CONCURSOS = DEFAULT_CONCURSOS;
  window.DEFAULT_QUESTIONS = DEFAULT_QUESTIONS;
  window.DEFAULT_FLASHCARDS = DEFAULT_FLASHCARDS;
  window.DEFAULT_BADGES = DEFAULT_BADGES;
  window.DEFAULT_LEADERBOARD = DEFAULT_LEADERBOARD;
  window.MOTIVATIONAL_QUOTES = MOTIVATIONAL_QUOTES;
  window.DEFAULT_TAF_CRITERIA = DEFAULT_TAF_CRITERIA;
  window.DEFAULT_DISCURSIVA_TEMAS = DEFAULT_DISCURSIVA_TEMAS;
  window.DEFAULT_LEIS = DEFAULT_LEIS;
}
