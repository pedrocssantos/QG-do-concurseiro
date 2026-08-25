// ==========================================================================
// QG DO CONCURSEIRO - CORE TYPES & INTERFACES (TYPESCRIPT)
// ==========================================================================

export type PlanTier = 'free' | 'pro' | 'vip';
export type ThemeMode = 'dark' | 'light';
export type QuestionType = 'certo_errado' | 'multipla_escolha';
export type ErrorReason = 'conteudo' | 'pegadinha' | 'atencao' | 'desconhecimento';
export type StudySessionType = 'pomodoro' | 'cronometro' | 'revisao';

export interface UserProfile {
  id?: string;
  email: string;
  name: string;
  avatar: string;
  theme: ThemeMode;
  level: number;
  xp: number;
  streak: number;
  dailyGoalMinutes: number;
  weeklyGoalHours: number;
  plan_tier: PlanTier;
  onboardingCompleted: boolean;
  isLoggedIn?: boolean;
  badges: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Topico {
  id: string;
  title: string;
  teoria: boolean;
  teoriaDate?: string;
  resumo: boolean;
  questoesFeitas: number;
  questoesAcertos: number;
  r24h: boolean;
  r24hDate?: string;
  r7d: boolean;
  r7dDate?: string;
  r30d: boolean;
  dominio: number; // 1 a 5
}

export interface Disciplina {
  id: string;
  name: string;
  icon: string;
  color: string;
  peso: number;
  dificuldade: number;
  ordem?: number;
  topicos: Topico[];
}

export interface Concurso {
  id: string;
  name: string;
  banca: string;
  vagas: number;
  salario: string;
  dataProva?: string;
  disciplinas: Disciplina[];
}

export interface StudySession {
  id: string;
  concursoId?: string;
  disciplinaId: string;
  topicId?: string | null;
  durationMinutes: number;
  type: StudySessionType;
  date: string; // YYYY-MM-DD
  timestamp: number;
}

export interface Question {
  id: string;
  disciplinaId: string;
  topicId?: string;
  banca: string;
  concurso: string;
  ano: number;
  tipo: QuestionType;
  enunciado: string;
  opcoes?: string[];
  respostaCorreta: string;
  comentario: string;
  isCustom?: boolean;
}

export interface QuestionAttempt {
  id: string;
  questionId: string;
  selectedAnswer: string;
  userAnswer?: string;
  isCorrect: boolean;
  mode: 'treino' | 'simulado';
  timestamp: number;
  date?: string;
}

export interface Flashcard {
  id: string;
  disciplinaId: string;
  topicId?: string;
  frente: string;
  verso: string;
  isSystem?: boolean;
  // SM-2 parameters
  interval: number;
  repetitions: number;
  easeFactor: number;
  dueDate: string; // YYYY-MM-DD
  lastReviewedAt?: string;
}

export interface UserErrorItem {
  id: string;
  questionId: string;
  reason: ErrorReason;
  note: string;
  notes?: string;
  resolved: boolean;
  date: string;
}

export interface DailyMission {
  id: string;
  title: string;
  type: 'questoes' | 'flashcards' | 'pomodoro' | 'revisao';
  target: number;
  progress: number;
  completed: boolean;
  xpReward: number;
  disciplinaId?: string;
}

export interface CicloStep {
  disciplinaId: string;
  allocatedMinutes: number;
  completedMinutes: number;
  completed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  accuracy: number;
  hours: number;
  isUser?: boolean;
}

export interface MotivationalQuote {
  quote: string;
  author: string;
}

export interface TafRecord {
  id: string;
  date: string;
  gender: 'M' | 'F';
  orgao: 'pf' | 'prf' | 'pc' | 'pm';
  barra: number;       // Repetições (Masc) ou Segundos Isometria (Fem)
  corrida: number;     // Metros em 12 minutos
  abdominal: number;   // Repetições em 1 minuto
  salto: number;       // Metros (Impulsão Horizontal)
  natacao: number;     // Segundos em 50 metros (0 se não aplicável)
  totalScore: number;  // 0 a 100 ou soma de pontos
  isApto: boolean;
  notes?: string;
}

export interface DiscursivaTema {
  id: string;
  title: string;
  orgao: string;
  banca: string;
  ano: number;
  tema: string;
  textoMotivador: string;
  topicosObrigatorios: string[];
  padraoResposta: string;
  dicasEstruturais: string;
  maxLinhas: number;
}

export interface DiscursivaAttempt {
  id: string;
  temaId: string;
  temaTitulo: string;
  texto: string;
  data: string;
  tempoGastoSegundos: number;
  totalLinhas: number;
  autoAvaliacao: {
    apresentacao: number; // Max 2
    tema: number;         // Max 10
    gramatica: number;    // Penalidades / nota
    total: number;        // Nota final
  };
}

export interface LeiArtigo {
  id: string;
  numero: string;
  caput: string;
  incisos?: string[];
  destaque?: boolean;
  tema?: string;
}

export interface LeiItem {
  id: string;
  sigla: string;
  nome: string;
  categoria: string;
  descricao: string;
  artigos: LeiArtigo[];
}

export interface StoreData {
  profile: UserProfile;
  activeConcursoId: string;
  concursos: Concurso[];
  customQuestions: Question[];
  questionHistory: QuestionAttempt[];
  flashcards: Flashcard[];
  cadernoErros: UserErrorItem[];
  studySessions: StudySession[];
  dailyMissions: DailyMission[];
  ciclo: {
    totalHours: number;
    currentStepIndex: number;
    items: CicloStep[];
  };
  cicloWeeklyChecks?: Record<string, boolean>;
  lastStreakCheckDate?: string;
  tafRecords?: TafRecord[];
  discursivaAttempts?: DiscursivaAttempt[];
  leisReadState?: Record<string, boolean>;
}
