/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module '*.css' {}
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  [key: string]: any;
  AudioContext: typeof AudioContext;
  webkitAudioContext: any;
  deferredPwaPrompt: any;
  App: any;
  app: any;
  store: any;
  Store: any;
  db: any;
  SupabaseService: any;
  audio: any;
  AudioEngine: any;
  PapiroCharts: any;
  CicloManager: any;
  cicloManager: any;
  EditalManager: any;
  editalManager: any;
  QuestionsManager: any;
  questionsManager: any;
  FlashcardsManager: any;
  flashcardsManager: any;
  CadernoManager: any;
  cadernoManager: any;
  GamificationManager: any;
  gamificationManager: any;
  PomodoroController: any;
  pomodoro: any;
  pomodoroManager: any;
  TafManager: any;
  tafManager: any;
  DiscursivaManager: any;
  discursivaManager: any;
  LeisManager: any;
  leisManager: any;
  localDB: any;
  DEFAULT_CONCURSOS: any;
  DEFAULT_QUESTIONS: any;
  DEFAULT_FLASHCARDS: any;
  DEFAULT_BADGES: any;
  DEFAULT_LEADERBOARD: any;
  MOTIVATIONAL_QUOTES: any;
  DEFAULT_TAF_CRITERIA: any;
  DEFAULT_DISCURSIVA_TEMAS: any;
  DEFAULT_LEIS: any;
  showToast: any;
  openAuthModal: any;
  switchAuthTab: any;
  handleAuthSubmit: any;
  openUpgradeModal: any;
  startCheckout: any;
}

