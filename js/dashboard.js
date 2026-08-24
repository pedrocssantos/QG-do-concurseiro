// ==========================================================================
// FOCO NO PAPIRO - CONTROLLER DO DASHBOARD PRINCIPAL
// ==========================================================================

class DashboardManager {
  constructor() {
    this.eventsBound = false;
  }

  init() {
    this.renderHeaderInfo();
    this.renderKPICards();
    this.renderDailyMissions();
    this.renderCharts();
    this.renderMotivationalQuote();
    if (!this.eventsBound) {
      this.bindEvents();
      this.eventsBound = true;
    }
  }

  renderHeaderInfo() {
    const profile = store.data.profile;
    const activeConcurso = store.getActiveConcurso();
    const rankTitle = store.getRankTitle(profile.level || 1);

    const userNameEl = document.getElementById("dash-user-name");
    const userRankEl = document.getElementById("dash-user-rank");
    const userXpEl = document.getElementById("dash-user-xp");
    const userLevelEl = document.getElementById("dash-user-level");
    const streakCountEl = document.getElementById("dash-streak-count");
    const concursoSelect = document.getElementById("header-concurso-select");

    if (userNameEl) userNameEl.textContent = profile.name || "Guerreiro(a)";
    if (userRankEl) userRankEl.textContent = rankTitle;
    if (userXpEl) userXpEl.textContent = `${profile.xp} XP`;
    if (userLevelEl) userLevelEl.textContent = `Nível ${profile.level || 1}`;
    if (streakCountEl) streakCountEl.textContent = `${profile.streak || 0}`;

    // Popula o Seletor de Concurso Ativo no Header
    if (concursoSelect) {
      concursoSelect.innerHTML = "";
      store.data.concursos.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.shortTitle || c.title;
        if (c.id === store.data.activeConcursoId) opt.selected = true;
        concursoSelect.appendChild(opt);
      });
    }
  }

  renderKPICards() {
    const stats = store.getTodayStats();
    const overall = store.getEditalOverallProgress();

    // Horas Estudadas Hoje
    const hoursEl = document.getElementById("kpi-hours-today");
    const hoursGoalEl = document.getElementById("kpi-hours-goal");
    const hoursBarEl = document.getElementById("kpi-hours-bar");
    if (hoursEl) hoursEl.textContent = `${stats.hoursToday}h`;
    if (hoursGoalEl) hoursGoalEl.textContent = `Meta: ${(stats.goalMinutes / 60).toFixed(1)}h (${stats.percentGoal}%)`;
    if (hoursBarEl) hoursBarEl.style.width = `${stats.percentGoal}%`;

    // Questões Resolvidas Hoje
    const qCountEl = document.getElementById("kpi-questions-today");
    const qAccEl = document.getElementById("kpi-questions-accuracy");
    if (qCountEl) qCountEl.textContent = stats.questionsCount;
    if (qAccEl) qAccEl.innerHTML = stats.questionsCount > 0
      ? `<i class="fa-solid fa-arrow-trend-up"></i> ${stats.accuracy}% de acertos`
      : `Nenhuma questão feita hoje`;

    // Flashcards Pendentes
    const cardsEl = document.getElementById("kpi-flashcards-due");
    if (cardsEl) cardsEl.textContent = stats.cardsDue;

    // Progresso do Edital
    const editalPercentEl = document.getElementById("kpi-edital-percent");
    const editalSummaryEl = document.getElementById("kpi-edital-summary");
    const editalBarEl = document.getElementById("kpi-edital-bar");
    if (editalPercentEl) editalPercentEl.textContent = `${overall.percent}%`;
    if (editalSummaryEl) editalSummaryEl.textContent = `${overall.concluidos}/${overall.totalTopicos} tópicos`;
    if (editalBarEl) editalBarEl.style.width = `${overall.percent}%`;
  }

  renderDailyMissions() {
    const container = document.getElementById("dash-missions-list");
    const summaryBadge = document.getElementById("dash-missions-summary");
    if (!container) return;
    container.innerHTML = "";

    const missions = store.data.dailyMissions || [];
    const completedCount = missions.filter(m => m.completed).length;

    if (summaryBadge) {
      summaryBadge.textContent = `${completedCount}/${missions.length} Missões Cumpridas`;
    }

    missions.forEach(m => {
      const item = document.createElement("div");
      item.className = `mission-item-card ${m.completed ? "mission-completed" : ""}`;

      let typeIcon = "fa-book-open";
      let actionLabel = "Iniciar";
      let actionTarget = "#pomodoro";

      if (m.type === "questoes") {
        typeIcon = "fa-circle-question";
        actionLabel = "Praticar";
        actionTarget = "#questoes";
      } else if (m.type === "flashcards") {
        typeIcon = "fa-layer-group";
        actionLabel = "Revisar";
        actionTarget = "#flashcards";
      } else if (m.type === "pomodoro") {
        typeIcon = "fa-stopwatch";
        actionLabel = "Focar";
        actionTarget = "#pomodoro";
      }

      item.innerHTML = `
        <div class="mission-left">
          <input type="checkbox" class="mission-checkbox" ${m.completed ? "checked" : ""} onchange="dashboardManager.toggleMission('${m.id}')">
          <div class="mission-icon"><i class="fa-solid ${typeIcon}"></i></div>
          <div class="mission-texts">
            <h4 class="mission-title">${m.title}</h4>
            <p class="mission-desc">${m.desc}</p>
          </div>
        </div>
        <div class="mission-right">
          <span class="mission-xp-badge">+${m.xpReward} XP</span>
          ${!m.completed ? `
            <button class="btn btn-secondary btn-sm" onclick="dashboardManager.startMissionAction('${actionTarget}', '${m.disciplinaId || ''}')">
              ${actionLabel} <i class="fa-solid fa-arrow-right"></i>
            </button>
          ` : `
            <span class="badge-done"><i class="fa-solid fa-check"></i> Concluída</span>
          `}
        </div>
      `;

      container.appendChild(item);
    });
  }

  toggleMission(id) {
    store.toggleMission(id);
    this.renderDailyMissions();
    this.renderHeaderInfo();
  }

  startMissionAction(route, disciplinaId) {
    window.location.hash = route;
    if (disciplinaId && route === "#pomodoro") {
      setTimeout(() => {
        const select = document.getElementById("pomo-subject-select");
        if (select) {
          select.value = disciplinaId;
          pomodoro.selectedDisciplinaId = disciplinaId;
        }
      }, 100);
    }
  }

  renderCharts() {
    // 1. Gráfico Semanal de Horas
    const weekly = store.getWeeklyStats();
    PapiroCharts.renderLineAreaChart("chart-weekly-hours", weekly.labels, weekly.hours);

    // 2. Gráfico Donut de Disciplinas
    const subjectDist = store.getSubjectDistribution();
    const donutItems = subjectDist.map(s => ({
      label: s.name,
      value: s.minutes,
      color: s.color
    }));
    PapiroCharts.renderDonutChart("chart-subject-donut", donutItems);

    // 3. Gráfico Radar de Domínio
    const activeConcurso = store.getActiveConcurso();
    const radarItems = (activeConcurso.disciplinas || []).map(d => {
      const topicos = d.topicos || [];
      const score = topicos.length > 0
        ? Math.round((topicos.reduce((acc, t) => acc + (t.dominio || 1), 0) / (topicos.length * 5)) * 100)
        : 50;
      return { label: d.name, score };
    });
    PapiroCharts.renderRadarChart("chart-domain-radar", radarItems);

    // 4. Heatmap de Constância
    PapiroCharts.renderConsistencyHeatmap("dash-consistency-heatmap", store.data.studySessions);
  }

  renderMotivationalQuote() {
    const quoteEl = document.getElementById("dash-quote-text");
    const authorEl = document.getElementById("dash-quote-author");
    if (!quoteEl || !authorEl) return;

    // Escolhe citação baseada no dia
    const idx = new Date().getDate() % MOTIVATIONAL_QUOTES.length;
    const q = MOTIVATIONAL_QUOTES[idx];
    quoteEl.textContent = `"${q.quote}"`;
    authorEl.textContent = `— ${q.author}`;
  }

  bindEvents() {
    const concursoSelect = document.getElementById("header-concurso-select");
    if (concursoSelect) {
      concursoSelect.addEventListener("change", (e) => {
        store.setActiveConcurso(e.target.value);
        this.init();
        showToast("Plano de estudos ativo alterado com sucesso!", "info");
      });
    }
  }
}

const dashboardManager = new DashboardManager();
