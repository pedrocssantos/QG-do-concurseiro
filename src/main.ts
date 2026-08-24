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
import { store } from "./services/store";
import { db } from "./services/supabase";
import { audio } from "./services/audio";

// Importação dos módulos da aplicação
import { dashboardManager } from "./modules/dashboard";
import { editalManager } from "./modules/edital";
import { cicloManager } from "./modules/ciclo";
import { questionsManager } from "./modules/questions";
import { flashcardsManager } from "./modules/flashcards";
import { cadernoManager } from "./modules/errors";
import { gamificationManager } from "./modules/gamification";
import { pomodoro, pomodoroManager } from "./modules/pomodoro";
import { PapiroCharts } from "./modules/analytics";
import { localDB } from "./services/dexie";

// Inicialização da aplicação
document.addEventListener("DOMContentLoaded", async () => {
  await localDB.init();
  db.init();
  app.init();
});

console.log("🛡️ QG do Concurseiro - Módulos ESM carregados com sucesso via Vite!");
