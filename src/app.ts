// ==========================================================================
// QG DO CONCURSEIRO - APP CONTROLLER (ESM)
// ==========================================================================
import { store } from "./services/store";
import { db } from "./services/supabase";
import { dashboardManager } from "./modules/dashboard";
import { editalManager } from "./modules/edital";
import { cicloManager } from "./modules/ciclo";
import { questionsManager } from "./modules/questions";
import { flashcardsManager } from "./modules/flashcards";
import { cadernoManager } from "./modules/errors";
import { gamificationManager } from "./modules/gamification";
import { pomodoro, pomodoroManager } from "./modules/pomodoro";
import { PapiroCharts } from "./modules/analytics";
import { tafManager } from "./modules/taf";
import { discursivaManager } from "./modules/discursiva";
import { leisManager } from "./modules/leis";
import { audio } from "./services/audio";

// ==========================================================================
// QG DO CONCURSEIRO - SPA ROUTER & APLICAÇÃO PRINCIPAL
// ==========================================================================

class App {
  currentRoute: string;
  previousRoute: string | null;
  routes: string[];

  constructor() {
    this.currentRoute = "dashboard";
    this.previousRoute = null;
    this.routes = [
      "dashboard",
      "edital",
      "ciclo",
      "questoes",
      "flashcards",
      "erros",
      "leis",
      "discursiva",
      "taf",
      "desempenho",
      "ranking",
      "pomodoro",
      "configuracoes",
      "landing"
    ];
  }

  init() {
    this.applyTheme(store.data.profile.theme || "dark");
    this.bindGlobalNavigation();
    this.bindModalHandlers();
    this.bindSettingsHandlers();
    this.bindOnboardingHandlers();
    this.registerServiceWorker();
    this.checkPaymentReturn();
    this.checkAuthReturn();
    this.handleRoute();
    this.listenToStore();

    // Exibe onboarding se for a primeira vez do usuário (login opcional)
    if (!store.data.profile.onboardingCompleted) {
      setTimeout(() => {
        this.openOnboardingModal();
      }, 300);
    }

    window.addEventListener("hashchange", () => this.handleRoute());
    window.addEventListener("resize", () => {
      if (this.currentRoute === "dashboard") {
        dashboardManager.renderCharts();
      } else if (this.currentRoute === "desempenho") {
        this.renderDesempenhoView();
      }
    });

    console.log("QG do Concurseiro SPA inicializado.");
  }

  registerServiceWorker() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      window.deferredPwaPrompt = e;
      console.log("PWA pronto para instalacao.");
    });
  }

  async checkPaymentReturn() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const isSuccess = urlParams.get("payment") === "success" || 
                        urlParams.get("status") === "success" || 
                        urlParams.get("checkout") === "success" ||
                        urlParams.get("session_id");

      if (isSuccess) {
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);

        if (typeof db !== "undefined" && db.client && db.currentUser) {
          try {
            if (db.loadUserProfile) await db.loadUserProfile(db.currentUser.id);
          } catch (err) {
            console.warn("Aguardando confirmação do webhook do Supabase...", err);
          }
        }

        store.data.profile.plan_tier = "pro";
        store.save();

        if (typeof db !== "undefined" && db.updateAuthUI) {
          db.updateAuthUI();
        }

        store.addXP(500, "Ativação do Plano Pro");
        setTimeout(() => {
          showToast("Plano Pro ativado com sucesso. Todas as ferramentas foram desbloqueadas.", "success", 8000);
        }, 500);
      }
    } catch (e) {
      console.warn("Erro ao verificar retorno de pagamento:", e);
    }
  }

  async checkAuthReturn() {
    try {
      const hash = window.location.hash || "";
      const search = window.location.search || "";
      const urlParams = new URLSearchParams(search);
      const code = urlParams.get("code");

      if (code && typeof db !== "undefined" && db.client) {
        console.log("Código de autenticação PKCE detectado na URL.");
        const { data, error } = await db.client.auth.exchangeCodeForSession(code);
        if (data?.session?.user) {
          store.data.profile.isLoggedIn = true;
          store.data.profile.email = data.session.user.email || store.data.profile.email;
          if (data.session.user.user_metadata?.name) {
            store.data.profile.name = data.session.user.user_metadata.name;
            store.data.profile.avatar = data.session.user.user_metadata.name.substring(0, 2).toUpperCase();
          }
          store.save();
          showToast("E-mail confirmado com sucesso. Sua conta está ativa na nuvem.", "success");
          db.updateAuthUI();
          dashboardManager.renderHeaderInfo();
          window.history.replaceState({}, document.title, window.location.pathname + "#dashboard");
          this.handleRoute();
          return;
        }
      }

      if (hash && (hash.includes("access_token=") || hash.includes("type=signup") || hash.includes("type=recovery"))) {
        console.log("Retorno de confirmação de e-mail do Supabase detectado.");
        setTimeout(async () => {
          if (typeof db !== "undefined" && db.client) {
            const { data: { session } } = await db.client.auth.getSession();
            if (session?.user) {
              store.data.profile.isLoggedIn = true;
              store.data.profile.email = session.user.email || store.data.profile.email;
              if (session.user.user_metadata?.name) {
                store.data.profile.name = session.user.user_metadata.name;
                store.data.profile.avatar = session.user.user_metadata.name.substring(0, 2).toUpperCase();
              }
              store.save();
              showToast("E-mail confirmado com sucesso. Sua conta está ativa.", "success");
              db.updateAuthUI();
              dashboardManager.renderHeaderInfo();
            }
          }
          window.history.replaceState({}, document.title, window.location.pathname + "#dashboard");
          this.handleRoute();
        }, 600);
      }
    } catch (e) {
      console.warn("Aviso ao processar retorno de auth:", e);
    }
  }

  handleRoute() {
    const rawHash = window.location.hash.replace("#", "").trim();
    
    // Suporte a rotas modais de autenticação e recuperação de senha
    if (rawHash === "login") {
      openAuthModal("login");
    } else if (rawHash === "signup") {
      openAuthModal("signup");
    } else if (rawHash === "recuperar-senha" || rawHash === "forgot") {
      openAuthModal("forgot");
    } else if (rawHash === "reset-password" || rawHash.includes("type=recovery")) {
      openResetPasswordModal();
    }

    const route = this.routes.includes(rawHash) ? rawHash : "dashboard";

    this.currentRoute = route;

    // Atualiza links da barra de navegação
    document.querySelectorAll(".nav-link").forEach(link => {
      const target = link.getAttribute("href")?.replace("#", "");
      if (target === route) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Oculta todas as páginas e exibe a página ativa
    document.querySelectorAll(".view-section").forEach(sec => {
      sec.classList.add("hidden");
    });

    const activeView = document.getElementById(`view-${route}`);
    if (activeView) {
      activeView.classList.remove("hidden");
    }

    // Fecha menu mobile se aberto
    this.toggleMobileSidebar(false);

    // Rola para o topo suavemente
    window.scrollTo({ top: 0, behavior: "smooth" });

    this.deactivateViewModule(this.previousRoute);
    this.previousRoute = route;

    // Inicializa o módulo da view ativa
    this.activateViewModule(route);
  }

  deactivateViewModule(route: string) {
    if (!route) return;
    switch (route) {
      case 'dashboard': (dashboardManager as any).destroy?.(); break;
      case 'edital': (editalManager as any).destroy?.(); break;
      case 'ciclo': (cicloManager as any).destroy?.(); break;
      case 'questoes': (questionsManager as any).destroy?.(); break;
      case 'erros': (cadernoManager as any).destroy?.(); break;
      case 'leis': (leisManager as any).destroy?.(); break;
      case 'discursiva': (discursivaManager as any).destroy?.(); break;
      case 'taf': (tafManager as any).destroy?.(); break;
      case 'desempenho': break; // Static render
      case 'ranking': (gamificationManager as any).destroy?.(); break;
      case 'pomodoro': break; // Pomodoro keeps running in background
      case 'configuracoes': break;
    }
  }

  activateViewModule(route) {
    switch (route) {
      case "dashboard":
        dashboardManager.init();
        break;
      case "edital":
        editalManager.init();
        break;
      case "ciclo":
        cicloManager.init();
        break;
      case "questoes":
        questionsManager.init();
        break;
      case "flashcards":
        flashcardsManager.init();
        break;
      case "erros":
        cadernoManager.init();
        break;
      case "leis":
        leisManager.init();
        break;
      case "discursiva":
        discursivaManager.init();
        break;
      case "taf":
        tafManager.init();
        break;
      case "desempenho":
        this.renderDesempenhoView();
        break;
      case "ranking":
        gamificationManager.init();
        break;
      case "pomodoro":
        pomodoro.init();
        break;
      case "configuracoes":
        this.renderSettingsView();
        break;
    }
  }

  renderDesempenhoView() {
    const overall = store.getEditalOverallProgress();
    const weekly = store.getWeeklyStats();
    const totalMinutes = store.data.studySessions.reduce((a, b) => a + b.durationMinutes, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    const totalQ = store.data.questionHistory.length;
    const correctQ = store.data.questionHistory.filter(q => q.isCorrect).length;
    const accuracy = totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0;

    const elHours = document.getElementById("analytics-total-hours");
    const elQ = document.getElementById("analytics-total-questions");
    const elAcc = document.getElementById("analytics-total-accuracy");
    const elProg = document.getElementById("analytics-edital-progress");

    if (elHours) elHours.textContent = `${totalHours}h`;
    if (elQ) elQ.textContent = totalQ;
    if (elAcc) elAcc.textContent = `${accuracy}%`;
    if (elProg) elProg.textContent = `${overall.percent}%`;

    // Gráficos da tela de desempenho
    setTimeout(() => {
      PapiroCharts.renderLineAreaChart("chart-analytics-hours", weekly.labels, weekly.hours);
      
      const subjectDist = store.getSubjectDistribution();
      const donutItems = (subjectDist as any[]).map((s: any) => ({
        label: s.name,
        value: s.minutes,
        color: s.color
      }));
      PapiroCharts.renderDonutChart("chart-analytics-donut", donutItems);

      const barItems = (subjectDist as any[]).map((s: any) => ({
        label: s.name,
        value: s.questions,
        color: s.color
      }));
      PapiroCharts.renderBarChart("chart-analytics-bar", barItems);

      PapiroCharts.renderConsistencyHeatmap("analytics-heatmap-container", store.data.studySessions);
    }, 50);
  }

  renderSettingsView() {
    const profile = store.data.profile;
    const nameInput = document.getElementById("setting-user-name") as HTMLInputElement | null;
    const goalInput = document.getElementById("setting-daily-goal") as HTMLInputElement | null;
    const weeklyGoalInput = document.getElementById("setting-weekly-goal") as HTMLInputElement | null;

    if (nameInput) nameInput.value = profile.name || "";
    if (goalInput) goalInput.value = String(profile.dailyGoalMinutes ? Math.round(profile.dailyGoalMinutes / 60) : 4);
    if (weeklyGoalInput) weeklyGoalInput.value = String(profile.weeklyGoalHours || 25);
  }

  bindGlobalNavigation() {
    // Menu mobile
    const toggleBtn = document.getElementById("mobile-menu-toggle");
    const closeBtn = document.getElementById("sidebar-close-btn");
    const backdrop = document.getElementById("sidebar-backdrop");

    if (toggleBtn) toggleBtn.addEventListener("click", () => this.toggleMobileSidebar(true));
    if (closeBtn) closeBtn.addEventListener("click", () => this.toggleMobileSidebar(false));
    if (backdrop) backdrop.addEventListener("click", () => this.toggleMobileSidebar(false));

    // Botão de Tema
    const themeBtn = document.getElementById("btn-theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const current = store.data.profile.theme || "dark";
        const next = current === "dark" ? "light" : "dark";
        this.applyTheme(next);
      });
    }

    // Botão de Foco Rápido no Header
    const quickFocusBtn = document.getElementById("header-btn-quick-focus");
    if (quickFocusBtn) {
      quickFocusBtn.addEventListener("click", () => {
        window.location.hash = "#pomodoro";
      });
    }
  }

  toggleMobileSidebar(open) {
    const sidebar = document.getElementById("app-sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    if (sidebar && backdrop) {
      if (open) {
        sidebar.classList.add("mobile-open");
        backdrop.classList.remove("hidden");
      } else {
        sidebar.classList.remove("mobile-open");
        backdrop.classList.add("hidden");
      }
    }
  }

  applyTheme(theme) {
    store.data.profile.theme = theme;
    store.save();
    document.documentElement.setAttribute("data-theme", theme);
    
    const themeIcon = document.getElementById("theme-toggle-icon");
    if (themeIcon) {
      themeIcon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }

    if (this.currentRoute === "dashboard") {
      dashboardManager.renderCharts();
    } else if (this.currentRoute === "desempenho") {
      this.renderDesempenhoView();
    }
  }

  bindModalHandlers() {
    // Fechamento de modais ao clicar no X ou fora
    document.querySelectorAll(".modal-dialog").forEach(overlay => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          (overlay as HTMLDialogElement).close();
        }
      });
    });

    document.querySelectorAll(".modal-close-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const modal = btn.closest(".modal-dialog") as HTMLDialogElement;
        if (modal) modal.close();
      });
    });

    // Fechamento de qualquer modal ou tela zen com a tecla Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll("dialog[open]").forEach(m => (m as HTMLDialogElement).close());
        const zenOverlay = document.getElementById("zen-mode-overlay");
        if (zenOverlay && !zenOverlay.classList.contains("hidden")) {
          if (typeof pomodoroManager !== "undefined" && pomodoroManager.toggleZenMode) {
            pomodoroManager.toggleZenMode(false);
          } else {
            zenOverlay.classList.add("hidden");
          }
        }
      }
    });

    // Modal de Novo Concurso
    const openNewConcursoBtn = document.getElementById("btn-open-new-concurso-modal");
    if (openNewConcursoBtn) {
      openNewConcursoBtn.addEventListener("click", () => {
        if (!store.isPro() && store.data.concursos.length >= 1) {
          showToast("Plano Gratuito limitado a 1 concurso ativo. Desbloqueie editais ilimitados com o Caveira PRO!", "warning");
          openUpgradeModal();
          return;
        }
        const m = document.getElementById("modal-new-concurso") as HTMLDialogElement | null;
        if (m) m.showModal();
      });
    }

    const saveConcursoBtn = document.getElementById("btn-save-new-concurso");
    if (saveConcursoBtn) {
      saveConcursoBtn.addEventListener("click", () => this.saveNewConcurso());
    }

    // Modal de Nova Questão
    const openNewQuestionBtn = document.getElementById("btn-open-new-question-modal");
    if (openNewQuestionBtn) {
      openNewQuestionBtn.addEventListener("click", () => {
        const m = document.getElementById("modal-new-question") as HTMLDialogElement | null;
        if (m) m.showModal();
      });
    }

    const saveQuestionBtn = document.getElementById("btn-save-new-question");
    if (saveQuestionBtn) {
      saveQuestionBtn.addEventListener("click", () => this.saveNewQuestion());
    }
  }

  saveNewConcurso() {
    const customCount = (store.data.concursos || []).filter(c => c.category === "Personalizado").length;
    if (!store.isPro() && customCount >= 1) {
      showToast("Plano Gratuito limitado a 1 concurso personalizado extra. Desbloqueie editais ilimitados com o Caveira PRO!", "warning");
      openUpgradeModal();
      return;
    }

    const title = (document.getElementById("new-concurso-title") as HTMLInputElement)?.value.trim();
    const shortTitle = (document.getElementById("new-concurso-short") as HTMLInputElement)?.value.trim() || title;
    const banca = (document.getElementById("new-concurso-banca") as HTMLInputElement)?.value.trim() || "Cebraspe";
    const date = (document.getElementById("new-concurso-date") as HTMLInputElement)?.value || "2026-12-31";

    if (!title) {
      showToast("Preencha o nome do concurso!", "warning");
      return;
    }

    const newConcurso = {
      id: `concurso-${Date.now()}`,
      title,
      shortTitle,
      category: "Personalizado",
      banca,
      targetDate: date,
      totalHoursGoal: 500,
      dailyGoalMinutes: 240,
      disciplinas: [
        {
          id: `disc-${Date.now()}-1`,
          name: "Língua Portuguesa",
          color: "#3b82f6",
          icon: "fa-book",
          weight: 3,
          difficulty: 3,
          topicos: [
            { id: `top-${Date.now()}-1`, title: "Interpretação e Compreensão de Texto", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
          ]
        }
      ]
    };

    store.addConcurso(newConcurso);
    const m = document.getElementById("modal-new-concurso") as HTMLDialogElement | null;
    if (m) m.close();

    dashboardManager.renderHeaderInfo();
    this.activateViewModule(this.currentRoute);
    showToast(`Concurso "${shortTitle}" criado e ativado!`, "success");
  }

  saveNewQuestion() {
    const enunciado = (document.getElementById("new-q-enunciado") as HTMLTextAreaElement)?.value.trim();
    const disciplinaName = (document.getElementById("new-q-disciplina") as HTMLInputElement)?.value.trim() || "Geral";
    const assunto = (document.getElementById("new-q-assunto") as HTMLInputElement)?.value.trim() || "Geral";
    const resposta = (document.getElementById("new-q-resposta") as HTMLSelectElement)?.value || "C";
    const explicacao = (document.getElementById("new-q-explicacao") as HTMLTextAreaElement)?.value.trim();

    if (!enunciado || !explicacao) {
      showToast("Preencha o enunciado e a explicação da questão!", "warning");
      return;
    }

    const activeConcurso = store.getActiveConcurso();
    const matchedDisc = (activeConcurso.disciplinas || []).find(d => 
      d.name.toLowerCase().includes(disciplinaName.toLowerCase()) || 
      disciplinaName.toLowerCase().includes(d.name.toLowerCase())
    );
    const discId = matchedDisc ? matchedDisc.id : (activeConcurso.disciplinas?.[0]?.id || `disc-custom-${Date.now()}`);

    store.addQuestion({
      disciplinaId: discId,
      disciplinaName,
      assunto,
      banca: activeConcurso.banca || "Cebraspe",
      orgao: activeConcurso.shortTitle || "Concurso",
      cargo: "Policial",
      ano: new Date().getFullYear(),
      tipo: "certo_errado",
      enunciado,
      alternativas: [
        { id: "C", text: "Certo" },
        { id: "E", text: "Errado" }
      ],
      respostaCorreta: resposta,
      explicacao
    });

    const m = document.getElementById("modal-new-question") as HTMLDialogElement | null;
    if (m) m.close();

    showToast("Questão adicionada ao banco com sucesso!", "success");
    if (this.currentRoute === "questoes") questionsManager.init();
  }

  bindSettingsHandlers() {
    const saveProfileBtn = document.getElementById("btn-save-settings");
    if (saveProfileBtn) {
      saveProfileBtn.addEventListener("click", () => {
        const name = (document.getElementById("setting-user-name") as HTMLInputElement)?.value.trim();
        const dailyH = parseInt((document.getElementById("setting-daily-goal") as HTMLInputElement)?.value, 10) || 4;
        const weeklyH = parseInt((document.getElementById("setting-weekly-goal") as HTMLInputElement)?.value, 10) || 25;

        if (name) {
          store.data.profile.name = name;
          store.data.profile.avatar = name.substring(0, 2).toUpperCase();
        }
        store.data.profile.dailyGoalMinutes = dailyH * 60;
        store.data.profile.weeklyGoalHours = weeklyH;
        store.save();

        showToast("Configurações e metas salvas com sucesso!", "success");
        dashboardManager.renderHeaderInfo();
      });
    }

    // Exportar Backup
    const exportBtn = document.getElementById("btn-export-backup");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const json = store.exportBackup();
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `qg-do-concurseiro-backup-${store.getLocalDateString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("Backup exportado com sucesso!", "success");
      });
    }

    // Importar Backup
    const importInput = document.getElementById("input-import-backup");
    if (importInput) {
      importInput.addEventListener("change", (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt: any) => {
            const success = store.importBackup(evt.target.result);
            if (success) {
              showToast("Backup restaurado com sucesso!", "success");
              this.handleRoute();
            } else {
              showToast("Arquivo de backup inválido!", "error");
            }
          };
          reader.readAsText(file);
        }
      });
    }

    // Carregar Dados Demo
    const loadDemoBtn = document.getElementById("btn-load-demo");
    if (loadDemoBtn) {
      loadDemoBtn.addEventListener("click", () => {
        if (confirm("Deseja carregar os dados de demonstração (histórico simulado, sessões e estatísticas de exemplo)?")) {
          store.loadDemoData();
          showToast("Dados de demonstração carregados com sucesso!", "success");
          location.reload();
        }
      });
    }

    // Resetar Dados
    const resetBtn = document.getElementById("btn-reset-data");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Tem certeza que deseja resetar todos os dados para o padrão inicial? Todas as anotações e histórico serão limpos.")) {
          store.resetData();
          showToast("Dados reiniciados para o padrão inicial.", "info");
          location.reload();
        }
      });
    }
  }

  openOnboardingModal() {
    const modal = document.getElementById("modal-onboarding") as HTMLDialogElement | null;
    if (!modal) return;
    modal.showModal();

    const step1 = document.getElementById("onboard-step-1");
    const step2 = document.getElementById("onboard-step-2");
    if (step1) step1.classList.remove("hidden");
    if (step2) step2.classList.add("hidden");
  }

  bindOnboardingHandlers() {
    const options = document.querySelectorAll(".onboard-card-option");
    const customFields = document.getElementById("onboard-custom-concurso-fields");

    options.forEach(opt => {
      opt.addEventListener("click", () => {
        options.forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");
        const radio = opt.querySelector("input[type='radio']") as HTMLInputElement | null;
        if (radio) radio.checked = true;

        const concursoId = (opt as HTMLElement).dataset.concursoId;
        if (concursoId === "custom") {
          if (customFields) customFields.classList.remove("hidden");
        } else {
          if (customFields) customFields.classList.add("hidden");
        }
      });
    });

    const nextBtn = document.getElementById("onboard-btn-next-1");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const selectedOpt = document.querySelector(".onboard-card-option.selected") as HTMLElement | null;
        const concursoId = selectedOpt ? selectedOpt.dataset.concursoId : "pf-agente";

        if (concursoId === "custom") {
          const title = (document.getElementById("onboard-custom-title") as HTMLInputElement)?.value.trim();
          if (!title) {
            showToast("Informe o nome do concurso personalizado!", "warning");
            return;
          }
        }

        const step1 = document.getElementById("onboard-step-1");
        const step2 = document.getElementById("onboard-step-2");
        if (step1) step1.classList.add("hidden");
        if (step2) step2.classList.remove("hidden");
      });
    }

    const backBtn = document.getElementById("onboard-btn-back-2");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        const step1 = document.getElementById("onboard-step-1");
        const step2 = document.getElementById("onboard-step-2");
        if (step2) step2.classList.add("hidden");
        if (step1) step1.classList.remove("hidden");
      });
    }

    const finishBtn = document.getElementById("onboard-btn-finish");
    if (finishBtn) {
      finishBtn.addEventListener("click", () => {
        const name = (document.getElementById("onboard-input-name") as HTMLInputElement)?.value.trim() || "Concurseiro(a)";
        const dailyH = parseInt((document.getElementById("onboard-input-daily-hours") as HTMLInputElement)?.value, 10) || 3;
        const weeklyH = parseInt((document.getElementById("onboard-input-weekly-hours") as HTMLInputElement)?.value, 10) || 20;

        const selectedOpt = document.querySelector(".onboard-card-option.selected") as HTMLElement | null;
        const concursoId = selectedOpt ? selectedOpt.dataset.concursoId : "pf-agente";

        if (concursoId === "custom") {
          const title = (document.getElementById("onboard-custom-title") as HTMLInputElement)?.value.trim() || "Meu Concurso";
          const banca = (document.getElementById("onboard-custom-banca") as HTMLInputElement)?.value.trim() || "Cebraspe";

          const newConcurso = {
            id: `concurso-${Date.now()}`,
            title,
            shortTitle: title.substring(0, 16),
            category: "Personalizado",
            banca,
            targetDate: "2026-12-31",
            totalHoursGoal: 500,
            dailyGoalMinutes: dailyH * 60,
            disciplinas: [
              {
                id: `disc-${Date.now()}-1`,
                name: "Língua Portuguesa",
                color: "#3b82f6",
                icon: "fa-book",
                weight: 3,
                difficulty: 3,
                topicos: [
                  { id: `top-${Date.now()}-1`, title: "Interpretação e Compreensão de Texto", teoria: false, resumo: false, questoesFeitas: 0, questoesAcertos: 0, r24h: false, r7d: false, r30d: false, dominio: 1 }
                ]
              }
            ]
          };
          store.addConcurso(newConcurso);
          store.setActiveConcurso(newConcurso.id);
        } else {
          store.setActiveConcurso(concursoId || "pf-agente");
        }

        store.data.profile.name = name;
        store.data.profile.avatar = name.substring(0, 2).toUpperCase();
        store.data.profile.dailyGoalMinutes = dailyH * 60;
        store.data.profile.weeklyGoalHours = weeklyH;
        store.data.profile.onboardingCompleted = true;
        store.save();

        const modal = document.getElementById("modal-onboarding") as HTMLDialogElement | null;
        if (modal) modal.close();

        showToast(`Bem-vindo ao QG, ${name}! Plano operacional ativado com sucesso!`, "success");
        this.handleRoute();
        dashboardManager.init();
      });
    }
  }

  listenToStore() {
    store.subscribe((event, payload) => {
      if (event === "level_up") {
        this.showLevelUpModal(payload);
      }
      if (event === "badge_unlocked") {
        showToast(`Conquista Desbloqueada: ${payload.title}`, "success");
      }
      if (typeof dashboardManager !== "undefined" && dashboardManager.renderHeaderInfo) {
        dashboardManager.renderHeaderInfo();
      }
      if (typeof db !== "undefined" && db.updateAuthUI) {
        db.updateAuthUI();
      }
    });
  }

  showLevelUpModal(data: any) {
    const modal = document.getElementById("modal-level-up") as HTMLDialogElement | null;
    if (modal) {
      const titleEl = document.getElementById("levelup-title");
      if (titleEl) titleEl.textContent = `NÍVEL ${data.newLevel}`;
      const rankEl = document.getElementById("levelup-rank");
      if (rankEl) rankEl.textContent = data.title;
      audio.playCompletionChime();
      modal.showModal();
    }
  }
}

// Toast Notifier
function showToast(message, type = "info", duration = 4000) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast-item toast-${type}`;

  const icons = {
    success: "fa-circle-check",
    warning: "fa-triangle-exclamation",
    error: "fa-circle-xmark",
    info: "fa-circle-info"
  };

  toast.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.info}"></i>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast-fade-out");
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// ==========================================================================
// AUTHENTICATION, PASSWORD RESET & GOOGLE RECAPTCHA SYSTEM
// ==========================================================================
let currentAuthTab: "login" | "signup" | "forgot" = "login";
let recaptchaVerified = false;

function resetRecaptcha() {
  recaptchaVerified = false;
  const widget = document.getElementById("google-recaptcha-widget");
  const spinner = document.getElementById("recaptcha-spinner");
  const checkMark = document.getElementById("recaptcha-check-mark");
  if (widget) widget.classList.remove("verified");
  if (spinner) spinner.classList.add("hidden");
  if (checkMark) checkMark.classList.add("hidden");
}

function handleRecaptchaClick() {
  if (recaptchaVerified) return;

  const widget = document.getElementById("google-recaptcha-widget");
  const spinner = document.getElementById("recaptcha-spinner");
  const checkMark = document.getElementById("recaptcha-check-mark");

  if (spinner) spinner.classList.remove("hidden");

  setTimeout(() => {
    if (spinner) spinner.classList.add("hidden");
    if (checkMark) checkMark.classList.remove("hidden");
    if (widget) widget.classList.add("verified");
    recaptchaVerified = true;
  }, 500);
}

function togglePasswordVisibility(inputId: string, btnEl: HTMLElement) {
  const input = document.getElementById(inputId) as HTMLInputElement | null;
  if (!input) return;
  const isPass = input.type === "password";
  input.type = isPass ? "text" : "password";
  const icon = btnEl.querySelector("i");
  if (icon) {
    icon.className = isPass ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
  }
}

function calculatePasswordStrength(pass: string): { score: number; label: string; color: string; width: string } {
  if (!pass) return { score: 0, label: "Muito Fraca", color: "var(--color-danger)", width: "10%" };
  let score = 0;
  if (pass.length >= 6) score += 1;
  if (pass.length >= 9) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 1) return { score: 1, label: "Fraca", color: "#ef4444", width: "25%" };
  if (score === 2) return { score: 2, label: "Regular", color: "#f59e0b", width: "50%" };
  if (score === 3 || score === 4) return { score: 3, label: "Boa", color: "#38bdf8", width: "75%" };
  return { score: 5, label: "Excelente", color: "#10b981", width: "100%" };
}

function checkPasswordStrength(val: string) {
  const labelEl = document.getElementById("password-strength-label");
  const barEl = document.getElementById("password-strength-bar");
  const strength = calculatePasswordStrength(val);
  if (labelEl) {
    labelEl.textContent = strength.label;
    labelEl.style.color = strength.color;
  }
  if (barEl) {
    barEl.style.width = strength.width;
    barEl.style.background = strength.color;
  }
}

function checkResetPasswordStrength(val: string) {
  const labelEl = document.getElementById("reset-strength-label");
  const barEl = document.getElementById("reset-strength-bar");
  const strength = calculatePasswordStrength(val);
  if (labelEl) {
    labelEl.textContent = strength.label;
    labelEl.style.color = strength.color;
  }
  if (barEl) {
    barEl.style.width = strength.width;
    barEl.style.background = strength.color;
  }
}

function openAuthModal(tab: "login" | "signup" | "forgot" | string = "login") {
  const modal = document.getElementById("modal-auth") as HTMLDialogElement | null;
  if (modal) {
    switchAuthTab(tab === "signup" ? "signup" : (tab === "forgot" ? "forgot" : "login"));
    modal.showModal();
  }
}

function switchAuthTab(tab: "login" | "signup" | "forgot") {
  currentAuthTab = tab;
  resetRecaptcha();

  const tabLogin = document.getElementById("tab-login");
  const tabSignup = document.getElementById("tab-signup");
  const tabsContainer = document.getElementById("auth-tabs-container");
  const groupName = document.getElementById("group-auth-name");
  const groupPass = document.getElementById("group-auth-password");
  const groupConfirm = document.getElementById("group-auth-confirm-password");
  const groupStrength = document.getElementById("group-auth-strength");
  const groupTerms = document.getElementById("group-auth-terms");
  const groupBackLogin = document.getElementById("group-auth-back-login");
  const btnSubmit = document.getElementById("btn-auth-submit");
  const title = document.getElementById("auth-modal-title");
  const subtitle = document.getElementById("auth-modal-subtitle");
  const errorBox = document.getElementById("auth-error-box");
  const successBox = document.getElementById("auth-success-box");

  if (errorBox) errorBox.classList.add("hidden");
  if (successBox) successBox.classList.add("hidden");

  if (tab === "login") {
    if (tabsContainer) tabsContainer.classList.remove("hidden");
    tabLogin?.classList.add("active");
    tabSignup?.classList.remove("active");
    groupName?.classList.add("hidden");
    groupPass?.classList.remove("hidden");
    groupConfirm?.classList.add("hidden");
    groupStrength?.classList.add("hidden");
    groupTerms?.classList.add("hidden");
    groupBackLogin?.classList.add("hidden");
    if (btnSubmit) btnSubmit.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Entrar na Plataforma`;
    if (title) title.innerHTML = `Entrar no QG do Concurseiro`;
    if (subtitle) subtitle.innerHTML = `Faça login para sincronizar seu progresso na nuvem.`;
  } else if (tab === "signup") {
    if (tabsContainer) tabsContainer.classList.remove("hidden");
    tabSignup?.classList.add("active");
    tabLogin?.classList.remove("active");
    groupName?.classList.remove("hidden");
    groupPass?.classList.remove("hidden");
    groupConfirm?.classList.remove("hidden");
    groupStrength?.classList.remove("hidden");
    groupTerms?.classList.remove("hidden");
    groupBackLogin?.classList.add("hidden");
    if (btnSubmit) btnSubmit.innerHTML = `<i class="fa-solid fa-user-plus"></i> Criar Conta Gratuita`;
    if (title) title.innerHTML = `Criar Conta no QG`;
    if (subtitle) subtitle.innerHTML = `Crie sua conta para salvar editais, metas e simulados.`;
  } else if (tab === "forgot") {
    if (tabsContainer) tabsContainer.classList.add("hidden");
    groupName?.classList.add("hidden");
    groupPass?.classList.add("hidden");
    groupConfirm?.classList.add("hidden");
    groupStrength?.classList.add("hidden");
    groupTerms?.classList.add("hidden");
    groupBackLogin?.classList.remove("hidden");
    if (btnSubmit) btnSubmit.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Enviar Link de Recuperação`;
    if (title) title.innerHTML = `Recuperar Senha`;
    if (subtitle) subtitle.innerHTML = `Digite seu e-mail cadastrado para receber o link de redefinição.`;
  }
}

function showAuthError(msg: string) {
  const errorBox = document.getElementById("auth-error-box");
  const errorText = document.getElementById("auth-error-text");
  if (errorBox && errorText) {
    errorText.textContent = msg;
    errorBox.classList.remove("hidden");
  } else {
    showToast(msg, "warning");
  }
}

function translateAuthError(errMsg: string): string {
  const lower = (errMsg || "").toLowerCase();
  if (lower.includes("invalid login credentials") || lower.includes("invalid credentials")) {
    return "E-mail ou senha incorretos. Verifique os dados digitados.";
  }
  if (lower.includes("user already registered") || lower.includes("already registered")) {
    return "Este e-mail já possui cadastro. Clique na aba 'Entrar' para fazer login.";
  }
  if (lower.includes("password should be at least")) {
    return "A senha de segurança deve conter no mínimo 6 caracteres.";
  }
  if (lower.includes("email not confirmed")) {
    return "E-mail não confirmado. Verifique sua caixa de entrada e clique no link de ativação.";
  }
  if (lower.includes("invalid email") || lower.includes("invalid format")) {
    return "Formato de e-mail inválido. Digite um e-mail real (ex: aluno@gmail.com).";
  }
  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "Muitas tentativas em sequência. Aguarde 1 minuto e tente novamente.";
  }
  return errMsg || "Erro ao processar autenticação.";
}

async function handleAuthSubmit(e: Event) {
  e.preventDefault();
  const errorBox = document.getElementById("auth-error-box");
  const successBox = document.getElementById("auth-success-box");
  if (errorBox) errorBox.classList.add("hidden");
  if (successBox) successBox.classList.add("hidden");

  const emailInput = document.getElementById("auth-email") as HTMLInputElement | null;
  const passInput = document.getElementById("auth-password") as HTMLInputElement | null;
  const nameInput = document.getElementById("auth-name") as HTMLInputElement | null;
  const confirmPassInput = document.getElementById("auth-password-confirm") as HTMLInputElement | null;
  const termsCheckbox = document.getElementById("auth-terms") as HTMLInputElement | null;
  const btnSubmit = document.getElementById("btn-auth-submit") as HTMLButtonElement | null;

  const email = emailInput?.value.trim() || "";
  const password = passInput?.value || "";
  const name = nameInput?.value.trim() || "";

  // 1. Validação de Formato de E-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    showAuthError("Por favor, informe um endereço de e-mail válido (ex: seu.nome@email.com).");
    emailInput?.focus();
    return;
  }

  // 2. Validação Google reCAPTCHA
  if (!recaptchaVerified) {
    showAuthError("Por favor, confirme que você não é um robô clicando no reCAPTCHA abaixo.");
    return;
  }

  // 3. FLUXO: ESQUECI MINHA SENHA
  if (currentAuthTab === "forgot") {
    try {
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Enviando e-mail...`;
      }
      if (typeof db !== "undefined" && db.client) {
        await db.resetPasswordForEmail(email);
      }
      if (successBox) {
        const successText = document.getElementById("auth-success-text");
        if (successText) successText.textContent = `Enviamos as instruções de recuperação para ${email}. Verifique sua caixa de entrada e spam.`;
        successBox.classList.remove("hidden");
      }
      showToast(`Link de recuperação enviado para ${email}!`, "success");
      resetRecaptcha();
    } catch (err: any) {
      console.error("Erro ao solicitar recuperação de senha:", err);
      showAuthError(translateAuthError(err.message || "Não foi possível enviar o e-mail de recuperação."));
    } finally {
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Enviar Link de Recuperação`;
      }
    }
    return;
  }

  // 4. Validação de Senha para Login e Cadastro
  if (!password || password.length < 6) {
    showAuthError("A senha precisa ter no mínimo 6 caracteres.");
    passInput?.focus();
    return;
  }

  // 5. Validações Específicas da Aba de Cadastro
  if (currentAuthTab === "signup") {
    if (!name || name.length < 3) {
      showAuthError("Por favor, preencha seu nome completo (mínimo de 3 letras).");
      nameInput?.focus();
      return;
    }

    const confirmPassword = confirmPassInput?.value || "";
    if (password !== confirmPassword) {
      showAuthError("As senhas digitadas não coincidem. Digite a mesma senha em ambos os campos.");
      confirmPassInput?.focus();
      return;
    }

    if (termsCheckbox && !termsCheckbox.checked) {
      showAuthError("Você precisa concordar com os Termos de Uso para criar sua conta.");
      termsCheckbox.focus();
      return;
    }
  }

  try {
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${currentAuthTab === "signup" ? "Criando e validando conta..." : "Autenticando..."}`;
    }

    if (currentAuthTab === "signup") {
      if (typeof db !== "undefined" && db.client) {
        const result = await db.signUp(name, email, password);

        if (result?.user && !result?.session) {
          showToast("Cadastro realizado. Enviamos um link de confirmação para seu e-mail.", "info");
          (document.getElementById("modal-auth") as HTMLDialogElement)?.close();
          return;
        }
      }

      store.data.profile.isLoggedIn = true;
      store.data.profile.email = email;
      store.data.profile.name = name;
      store.data.profile.avatar = name.substring(0, 2).toUpperCase();
      store.save();

      showToast(`Conta criada com sucesso. Bem-vindo(a), ${name.split(" ")[0]}.`, "success");
      (document.getElementById("modal-auth") as HTMLDialogElement)?.close();
      if (typeof db !== "undefined") db.updateAuthUI();
      if (typeof app !== "undefined") app.handleRoute();
      if (typeof dashboardManager !== "undefined") dashboardManager.renderHeaderInfo();
    } else {
      if (typeof db !== "undefined" && db.client) {
        await db.signIn(email, password);
      }

      store.data.profile.isLoggedIn = true;
      store.data.profile.email = email;
      if (!store.data.profile.name || store.data.profile.name === "Concurseiro(a)") {
        store.data.profile.name = email.split("@")[0];
      }
      store.save();

      showToast("Login realizado com sucesso. Seus dados foram sincronizados.", "success");
      (document.getElementById("modal-auth") as HTMLDialogElement)?.close();
      if (typeof db !== "undefined") db.updateAuthUI();
      if (typeof app !== "undefined") app.handleRoute();
      if (typeof dashboardManager !== "undefined") dashboardManager.renderHeaderInfo();
    }
  } catch (err: any) {
    console.error("Erro na autenticação:", err);
    const friendlyMsg = translateAuthError(err.message || "Erro ao processar autenticação.");
    showAuthError(friendlyMsg);
  } finally {
    if (btnSubmit) {
      btnSubmit.disabled = false;
      if (currentAuthTab === "login") {
        btnSubmit.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Entrar na Plataforma`;
      } else if (currentAuthTab === "signup") {
        btnSubmit.innerHTML = `<i class="fa-solid fa-user-plus"></i> Criar Conta Gratuita`;
      } else {
        btnSubmit.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Enviar Link de Recuperação`;
      }
    }
  }
}

// ================= MODAL: REDEFINIR NOVA SENHA =================
function openResetPasswordModal() {
  const modal = document.getElementById("modal-reset-password") as HTMLDialogElement | null;
  if (modal) {
    const errorBox = document.getElementById("reset-error-box");
    if (errorBox) errorBox.classList.add("hidden");
    const newPass = document.getElementById("reset-new-password") as HTMLInputElement | null;
    const confirmPass = document.getElementById("reset-confirm-password") as HTMLInputElement | null;
    if (newPass) newPass.value = "";
    if (confirmPass) confirmPass.value = "";
    modal.showModal();
  }
}

async function handleResetPasswordSubmit(e: Event) {
  e.preventDefault();
  const errorBox = document.getElementById("reset-error-box");
  const errorText = document.getElementById("reset-error-text");
  const btnSubmit = document.getElementById("btn-reset-submit") as HTMLButtonElement | null;
  if (errorBox) errorBox.classList.add("hidden");

  const newPass = (document.getElementById("reset-new-password") as HTMLInputElement | null)?.value || "";
  const confirmPass = (document.getElementById("reset-confirm-password") as HTMLInputElement | null)?.value || "";

  if (!newPass || newPass.length < 6) {
    if (errorBox && errorText) {
      errorText.textContent = "A nova senha precisa ter no mínimo 6 caracteres.";
      errorBox.classList.remove("hidden");
    }
    return;
  }

  if (newPass !== confirmPass) {
    if (errorBox && errorText) {
      errorText.textContent = "As senhas digitadas não coincidem.";
      errorBox.classList.remove("hidden");
    }
    return;
  }

  try {
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Atualizando senha...`;
    }

    if (typeof db !== "undefined" && db.client) {
      await db.updateUserPassword(newPass);
    }

    showToast("Senha atualizada com sucesso. Você já pode entrar com sua nova senha.", "success");
    (document.getElementById("modal-reset-password") as HTMLDialogElement)?.close();
  } catch (err: any) {
    console.error("Erro ao redefinir senha:", err);
    if (errorBox && errorText) {
      errorText.textContent = translateAuthError(err.message || "Erro ao atualizar senha.");
      errorBox.classList.remove("hidden");
    }
  } finally {
    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = `<i class="fa-solid fa-check"></i> Salvar Nova Senha`;
    }
  }
}

// Links Oficiais de Pagamento da Stripe
const STRIPE_CHECKOUT_LINKS = {
  mensal: "https://buy.stripe.com/6oUaEW4Wc1uG6WE8kzgjC01",
  anual: "https://buy.stripe.com/8x228qbkA0qCdl258ngjC00"
};

function openUpgradeModal() {
  const modal = document.getElementById("modal-upgrade-pro") as HTMLDialogElement | null;
  if (modal) modal.showModal();
}

function startCheckout(planType) {
  const baseLink = STRIPE_CHECKOUT_LINKS[planType] || STRIPE_CHECKOUT_LINKS.mensal;
  const userEmail = (typeof db !== "undefined" && db.currentUser?.email) || store.data.profile?.email || "";
  const userId = (typeof db !== "undefined" && db.currentUser?.id) || store.data.profile?.id || "";

  try {
    const url = new URL(baseLink);
    if (userEmail) {
      url.searchParams.set("prefilled_email", userEmail);
    }
    if (userId) {
      url.searchParams.set("client_reference_id", userId);
    }

    showToast(`Redirecionando para o checkout seguro (${planType === 'anual' ? 'Plano Anual' : 'Plano Mensal'})...`, "info");
    
    (document.getElementById("modal-upgrade-pro") as HTMLDialogElement)?.close();

    setTimeout(() => {
      window.location.href = url.toString();
    }, 600);
  } catch (e) {
    window.location.href = baseLink;
  }
}

// Inicialização Global
const app = new App();

export {
  App,
  app,
  showToast,
  openAuthModal,
  switchAuthTab,
  handleAuthSubmit,
  togglePasswordVisibility,
  checkPasswordStrength,
  checkResetPasswordStrength,
  handleRecaptchaClick,
  resetRecaptcha,
  openResetPasswordModal,
  handleResetPasswordSubmit,
  openUpgradeModal,
  startCheckout
};

if (typeof window !== "undefined") {
  (window as any).App = App;
  (window as any).app = app;
  (window as any).showToast = showToast;
  (window as any).openAuthModal = openAuthModal;
  (window as any).switchAuthTab = switchAuthTab;
  (window as any).handleAuthSubmit = handleAuthSubmit;
  (window as any).togglePasswordVisibility = togglePasswordVisibility;
  (window as any).checkPasswordStrength = checkPasswordStrength;
  (window as any).checkResetPasswordStrength = checkResetPasswordStrength;
  (window as any).handleRecaptchaClick = handleRecaptchaClick;
  (window as any).resetRecaptcha = resetRecaptcha;
  (window as any).openResetPasswordModal = openResetPasswordModal;
  (window as any).handleResetPasswordSubmit = handleResetPasswordSubmit;
  (window as any).openUpgradeModal = openUpgradeModal;
  (window as any).startCheckout = startCheckout;
}

