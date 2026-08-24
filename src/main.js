// ==========================================================================
// QG DO CONCURSEIRO - MAIN ENTRY POINT (VITE ESM BUNDLE)
// ==========================================================================

// Importação centralizada de estilos
import "../css/style.css";
import "../css/components.css";
import "../css/dashboard.css";
import "../css/edital.css";
import "../css/questions.css";
import "../css/flashcards.css";
import "../css/pomodoro.css";
import "../css/landing.css";

// Importação dos serviços e dados
import { store } from "./services/store.js";
import { db } from "./services/supabase.js";
import { audio } from "./services/audio.js";

// Importação dos módulos da aplicação
import { dashboardManager } from "./modules/dashboard.js";
import { editalManager } from "./modules/edital.js";
import { cicloManager } from "./modules/ciclo.js";
import { questionsManager } from "./modules/questions.js";
import { flashcardsManager } from "./modules/flashcards.js";
import { cadernoManager } from "./modules/errors.js";
import { gamificationManager } from "./modules/gamification.js";
import { pomodoro, pomodoroManager } from "./modules/pomodoro.js";
import { PapiroCharts } from "./modules/analytics.js";
import { app, showToast, openAuthModal, switchAuthTab, handleAuthSubmit, openUpgradeModal, startCheckout } from "./app.js";

// Inicialização da aplicação
document.addEventListener("DOMContentLoaded", () => {
  db.init();
  app.init();
});

console.log("🛡️ QG do Concurseiro - Módulos ESM carregados com sucesso via Vite!");
