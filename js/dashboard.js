// ==========================================================================
// QG DO CONCURSEIRO - CONTROLLER DO DASHBOARD PRINCIPAL
// ==========================================================================

class DashboardManager {
  constructor() {
    this.eventsBound = false;
  }

  init() {
    this.renderHeaderInfo();
    this.renderKPICards();
    this.renderTacticalInsights();
    this.renderPendingReviews();
    this.renderDailyMissions();
    this.renderCharts();
    this.renderMotivationalQuote();
    if (!this.eventsBound) {
      this.bindEvents();
      this.eventsBound = true;
    }
  }

  getStreakTier(days) {
    if (days >= 60) return { tier: 5, label: "Caveira Inquebrável (60+ Dias)", icon: "fa-skull-crossbones", class: "tier-5" };
    if (days >= 30) return { tier: 4, label: "Chama Dourada de Elite (30+ Dias)", icon: "fa-fire-flame-curved", class: "tier-4" };
    if (days >= 14) return { tier: 3, label: "Chama de Prata (14+ Dias)", icon: "fa-fire-flame-simple", class: "tier-3" };
    if (days >= 7)  return { tier: 2, label: "Chama de Bronze (7+ Dias)", icon: "fa-fire", class: "tier-2" };
    if (days >= 3)  return { tier: 1, label: "Faísca Operacional (3+ Dias)", icon: "fa-fire", class: "tier-1" };
    return { tier: 0, label: "Sem Ofensiva Ativa", icon: "fa-fire", class: "tier-0" };
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

    if (userNameEl) userNameEl.textContent = profile.name || "Concurseiro";
    if (userRankEl) userRankEl.textContent = rankTitle;
    if (userXpEl) userXpEl.textContent = `${profile.xp} XP`;
    if (userLevelEl) userLevelEl.textContent = `Nível ${profile.level || 1}`;
    if (streakCountEl) streakCountEl.textContent = `${profile.streak || 0}`;

    // Saudação direta e amigável no Hero do Dashboard
    const greetingTitle = document.getElementById("dash-greeting-title");
    const greetingSubtitle = document.getElementById("dash-greeting-subtitle");
    if (greetingTitle) {
      greetingTitle.textContent = `Olá, ${profile.name ? profile.name.split(' ')[0] : 'Concurseiro'}! 👋`;
    }
    const todayStats = store.getTodayStats();
    if (greetingSubtitle) {
      if (todayStats.minutesToday === 0) {
        greetingSubtitle.textContent = "Você ainda não registrou estudos hoje. Que tal iniciar um bloco de foco agora?";
      } else {
        greetingSubtitle.textContent = `Você já acumulou ${todayStats.hoursToday}h de estudos hoje. Mantenha o ritmo!`;
      }
    }

    // Atualiza o visual progressivo do Streak
    const streak = profile.streak || 0;
    const streakInfo = this.getStreakTier(streak);
    const streakPill = document.querySelector(".streak-pill");
    if (streakPill) {
      streakPill.className = `streak-pill ${streakInfo.class}`;
      streakPill.title = `Frequência de Estudos: ${streakInfo.label}`;
      const icon = streakPill.querySelector("i");
      if (icon) {
        icon.className = `fa-solid ${streakInfo.icon}`;
      }
    }

    // Atualiza perfil na barra lateral (Sidebar Footer)
    const sidebarAvatar = document.getElementById("user-avatar-text");
    const sidebarName = document.getElementById("user-profile-name");
    const sidebarRank = document.getElementById("user-profile-rank");
    if (sidebarAvatar) sidebarAvatar.textContent = profile.avatar || (profile.name ? profile.name.substring(0, 2).toUpperCase() : "QG");
    if (sidebarName) sidebarName.textContent = profile.name || "Concurseiro";
    if (sidebarRank) sidebarRank.textContent = rankTitle;

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

  renderTacticalInsights() {
    const list = document.getElementById("dash-insights-list");
    const badge = document.getElementById("dash-insights-badge");
    if (!list) return;
    list.innerHTML = "";

    const concurso = store.getActiveConcurso();
    const sessions = store.data.studySessions || [];
    const questions = store.data.questionHistory || [];
    const insights = [];

    // 1. Contagem Regressiva para a Prova
    if (concurso.targetDate) {
      const target = new Date(concurso.targetDate);
      const today = new Date();
      const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        insights.push({
          type: diffDays < 30 ? "danger" : "info",
          icon: "fa-hourglass-half",
          title: `Faltam ${diffDays} Dias até a Prova`,
          text: `A prova de ${concurso.shortTitle || concurso.title} está se aproximando. Mantenha o ritmo de estudos diário!`
        });
      }
    }

    // 2. Análise de Disciplinas Negligenciadas
    const now = Date.now();
    (concurso.disciplinas || []).forEach(d => {
      const discSessions = sessions.filter(s => s.disciplinaId === d.id);
      if (discSessions.length === 0) {
        insights.push({
          type: "danger",
          icon: "fa-triangle-exclamation",
          title: `Disciplina sem Estudo: ${d.name}`,
          text: `Você ainda não registrou horas em ${d.name} (Peso ${d.weight}). Que tal estudar um bloco hoje?`
        });
      } else {
        const lastSession = Math.max(...discSessions.map(s => s.timestamp || 0));
        const daysSince = Math.floor((now - lastSession) / (1000 * 60 * 60 * 24));
        if (daysSince >= 5) {
          insights.push({
            type: "danger",
            icon: "fa-clock-rotate-left",
            title: `Atenção: ${d.name} sem Estudo há ${daysSince} Dias`,
            text: `Revise a matéria ou resolva uma bateria rápida de questões para manter o conteúdo fresco.`
          });
        }
      }
    });

    // 3. Análise de Aproveitamento por Disciplina
    (concurso.disciplinas || []).forEach(d => {
      const discQuestions = questions.filter(q => q.disciplinaId === d.id);
      if (discQuestions.length >= 5) {
        const correct = discQuestions.filter(q => q.isCorrect).length;
        const acc = Math.round((correct / discQuestions.length) * 100);
        if (acc < 70) {
          insights.push({
            type: "danger",
            icon: "fa-shield-heart",
            title: `Atenção em ${d.name}: ${acc}% de Acertos`,
            text: `Seu aproveitamento está abaixo de 70%. Recomendamos revisar o Caderno de Erros dessa matéria.`
          });
        } else if (acc >= 85 && discQuestions.length >= 10) {
          insights.push({
            type: "success",
            icon: "fa-circle-check",
            title: `Ponto Forte: ${d.name} com ${acc}% de Acertos!`,
            text: `Excelente aproveitamento em ${discQuestions.length} questões resolvidas. Continue praticando regularmente.`
          });
        }
      }
    });

    // Se não houver alertas críticos, dá um feedback positivo
    if (insights.length === 0) {
      insights.push({
        type: "success",
        icon: "fa-circle-check",
        title: "Planejamento em Dia",
        text: "Todas as suas disciplinas estão equilibradas. Continue avançando no ciclo de estudos!"
      });
    }

    if (badge) {
      badge.textContent = `${insights.length} Alertas`;
      badge.className = `badge ${insights.some(i => i.type === "danger") ? "badge-danger" : "badge-warning"}`;
    }

    insights.slice(0, 3).forEach(ins => {
      const el = document.createElement("div");
      el.className = `insight-item ${ins.type}`;
      el.innerHTML = `
        <div class="insight-icon text-${ins.type === 'danger' ? 'danger' : (ins.type === 'success' ? 'success' : 'primary')}">
          <i class="fa-solid ${ins.icon}"></i>
        </div>
        <div class="insight-text">
          <strong>${ins.title}</strong>
          <p>${ins.text}</p>
        </div>
      `;
      list.appendChild(el);
    });
  }

  renderPendingReviews() {
    const content = document.getElementById("dash-revisoes-content");
    const badge = document.getElementById("dash-revisoes-badge");
    if (!content) return;
    content.innerHTML = "";

    const today = store.getLocalDateString();
    const cards = store.data.flashcards || [];
    const cardsDue = cards.filter(c => c.dueDate <= today);

    const concurso = store.getActiveConcurso();
    const pendingReviewTopics = [];
    const todayObj = new Date();

    (concurso.disciplinas || []).forEach(d => {
      (d.topicos || []).forEach(t => {
        if (t.teoria) {
          const tDate = t.teoriaDate ? new Date(t.teoriaDate) : todayObj;
          const diffDays = Math.floor((todayObj - tDate) / (1000 * 60 * 60 * 24));

          if (!t.r24h && diffDays >= 1) {
            pendingReviewTopics.push({
              disciplina: d.name,
              disciplinaId: d.id,
              topico: t.title,
              topicoId: t.id,
              revType: "R24h"
            });
          } else if (t.r24h && !t.r7d && diffDays >= 7) {
            pendingReviewTopics.push({
              disciplina: d.name,
              disciplinaId: d.id,
              topico: t.title,
              topicoId: t.id,
              revType: "R7d"
            });
          } else if (t.r7d && !t.r30d && diffDays >= 30) {
            pendingReviewTopics.push({
              disciplina: d.name,
              disciplinaId: d.id,
              topico: t.title,
              topicoId: t.id,
              revType: "R30d"
            });
          }
        }
      });
    });

    const totalPending = cardsDue.length + pendingReviewTopics.length;

    if (badge) {
      badge.textContent = `${totalPending} Pendências`;
      badge.className = `badge ${totalPending > 0 ? "badge-primary" : "badge-success"}`;
    }

    if (totalPending === 0) {
      content.innerHTML = `
        <div style="text-align: center; padding: 16px 0; color: var(--text-muted);">
          <div style="font-size: 1.8rem; margin-bottom: 6px;">🛡️</div>
          <strong style="color: var(--text-main); font-size: 0.9rem;">Todas as Revisões em Dia!</strong>
          <p style="font-size: 0.8rem; margin-top: 4px;">Nenhum flashcard ou ciclo de revisão pendente para hoje.</p>
        </div>
      `;
      return;
    }

    // Card de Flashcards SRS se houver
    if (cardsDue.length > 0) {
      const item = document.createElement("div");
      item.className = "revisao-item";
      item.innerHTML = `
        <div class="revisao-info">
          <strong><i class="fa-solid fa-layer-group text-warning"></i> ${cardsDue.length} Flashcards SRS Vencidos</strong>
          <span>Repetição Espaçada • SuperMemo SM-2</span>
        </div>
        <a href="#flashcards" class="btn btn-primary btn-xs" style="padding: 4px 10px; font-size: 0.75rem;">
          Revisar <i class="fa-solid fa-arrow-right"></i>
        </a>
      `;
      content.appendChild(item);
    }

    // Até 2 tópicos prioritários de revisão
    pendingReviewTopics.slice(0, 2).forEach(rev => {
      const item = document.createElement("div");
      item.className = "revisao-item";
      item.innerHTML = `
        <div class="revisao-info">
          <strong><i class="fa-solid fa-book-bookmark text-primary"></i> ${rev.topico}</strong>
          <span>${rev.disciplina} • Ciclo ${rev.revType}</span>
        </div>
        <a href="#edital" class="btn btn-secondary btn-xs" style="padding: 4px 10px; font-size: 0.75rem;">
          Ver no Edital <i class="fa-solid fa-arrow-right"></i>
        </a>
      `;
      content.appendChild(item);
    });
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
      summaryBadge.textContent = `${completedCount}/${missions.length} Concluídas`;
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
    if (disciplinaId) {
      setTimeout(() => {
        if (route === "#pomodoro") {
          const select = document.getElementById("pomo-subject-select");
          if (select) {
            select.value = disciplinaId;
            if (typeof pomodoro !== "undefined") pomodoro.selectedDisciplinaId = disciplinaId;
          }
        } else if (route === "#questoes") {
          if (typeof questionsManager !== "undefined") {
            questionsManager.setDisciplinaFilter(disciplinaId);
          }
        } else if (route === "#flashcards") {
          if (typeof flashcardsManager !== "undefined") {
            flashcardsManager.selectDeck(disciplinaId);
          }
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
