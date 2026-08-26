// ==========================================================================
// QG DO CONCURSEIRO - DASHBOARD MANAGER (ESM)
// ==========================================================================
import { store } from "../services/store";
import { PapiroCharts } from "./analytics";
import { pomodoro } from "./pomodoro";
import { questionsManager } from "./questions";
import { flashcardsManager } from "./flashcards";
import { MOTIVATIONAL_QUOTES } from "../data/data";
import { showToast } from "../app";

// ==========================================================================
// QG DO CONCURSEIRO - CONTROLLER DO DASHBOARD PRINCIPAL
// ==========================================================================

class DashboardManager {
  eventsBound: boolean;

  constructor() {
    this.eventsBound = false;
  }

  init() {
    this.renderHeaderInfo();
    this.renderEditalForecast();
    this.renderKPICards();
    this.renderTacticalInsights();
    this.renderPendingReviews();
    this.renderRankingCountdown();
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
    const concursoSelect = document.getElementById("header-concurso-select") as HTMLSelectElement | null;

    if (userNameEl) userNameEl.textContent = profile.name || "Concurseiro";
    if (userRankEl) userRankEl.textContent = rankTitle;
    if (userXpEl) userXpEl.textContent = `${profile.xp} XP`;
    if (userLevelEl) userLevelEl.textContent = `Nível ${profile.level || 1}`;
    if (streakCountEl) streakCountEl.textContent = `${profile.streak || 0}`;

    const greetingTitle = document.getElementById("dash-greeting-title");
    const greetingSubtitle = document.getElementById("dash-greeting-subtitle");
    if (greetingTitle) {
      greetingTitle.textContent = `Painel de ${profile.name ? profile.name.split(' ')[0] : 'Estudos'}`;
    }
    const todayStats = store.getTodayStats();
    if (greetingSubtitle) {
      if (todayStats.minutesToday === 0) {
        greetingSubtitle.textContent = "Nenhum estudo registrado hoje. Inicie um bloco de foco para avançar.";
      } else {
        greetingSubtitle.textContent = `Total acumulado hoje: ${todayStats.hoursToday}h de estudos líquidos.`;
      }
    }

    const streak = profile.streak || 0;
    const streakInfo = this.getStreakTier(streak);
    const streakPill = document.querySelector(".streak-pill") as HTMLElement | null;
    if (streakPill) {
      streakPill.className = `streak-pill ${streakInfo.class}`;
      streakPill.title = `Frequência de Estudos: ${streakInfo.label}`;
      const icon = streakPill.querySelector("i");
      if (icon) {
        icon.className = `fa-solid ${streakInfo.icon}`;
      }
    }

    const sidebarAvatar = document.getElementById("user-avatar-text");
    const sidebarName = document.getElementById("user-profile-name") || document.getElementById("dash-user-name");
    const sidebarRank = document.getElementById("user-profile-rank") || document.getElementById("dash-user-rank");
    if (sidebarAvatar) sidebarAvatar.textContent = profile.avatar || (profile.name ? profile.name.substring(0, 2).toUpperCase() : "QG");
    if (sidebarName) sidebarName.textContent = profile.name || "Concurseiro";
    if (sidebarRank) sidebarRank.textContent = rankTitle;

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

    const targetPillText = document.getElementById("dash-target-text");
    if (targetPillText && activeConcurso) {
      if (activeConcurso.targetDate) {
        const target = new Date(activeConcurso.targetDate);
        const today = new Date();
        const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
          targetPillText.textContent = `${activeConcurso.shortTitle || activeConcurso.title} • Faltam ${diffDays} dias`;
        } else {
          targetPillText.textContent = `${activeConcurso.shortTitle || activeConcurso.title} • Prova Hoje / Concluída`;
        }
      } else {
        targetPillText.textContent = `${activeConcurso.shortTitle || activeConcurso.title} • Edital Ativo`;
      }
    }
  }

  // ================= PREVISÃO DE CONCLUSÃO DO EDITAL (PASSAGENS) =================
  renderEditalForecast() {
    const forecast = store.getEditalForecast();
    const statusBadge = document.getElementById("dash-forecast-status-badge");
    const forecastText = document.getElementById("dash-forecast-text");
    const hoursMeta = document.getElementById("dash-forecast-hours-meta");

    const weeklyStats = store.getWeeklyStats();
    const weeklyGoal = store.data.profile.weeklyGoalHours || 25;
    const weeklyDoneHours = weeklyStats.hours.reduce((acc: number, h: number) => acc + h, 0).toFixed(1);

    if (hoursMeta) {
      hoursMeta.textContent = `Semanal: ${weeklyDoneHours}h / ${weeklyGoal}h`;
    }

    if (!forecastText) return;

    if (forecast.remainingTopics === 0) {
      if (statusBadge) {
        statusBadge.textContent = "100% Concluído";
        statusBadge.className = "badge badge-success";
      }
      forecastText.innerHTML = `<strong>Edital concluído.</strong> Todos os tópicos foram cobertos. Mantenha o foco em baterias de questões e revisões programadas.`;
      return;
    }

    if (forecast.isOnTrack) {
      if (statusBadge) {
        statusBadge.textContent = "No Ritmo Ideal";
        statusBadge.className = "badge badge-success";
      }
      const beforeText = forecast.daysBeforeExam 
        ? `<strong>${forecast.daysBeforeExam} dias de margem antes da prova</strong> para revisões finais.` 
        : "com antecedência.";
      forecastText.innerHTML = `No ritmo atual (~${forecast.avgDailyHours}h/dia), previsão de conclusão em <strong>${forecast.projectedDateStr}</strong> (${beforeText})`;
    } else {
      if (statusBadge) {
        statusBadge.textContent = "Aumentar Ritmo";
        statusBadge.className = "badge badge-danger";
      }
      forecastText.innerHTML = `No ritmo atual (~${forecast.avgDailyHours}h/dia), previsão de término em <strong>${forecast.projectedDateStr}</strong> (após a data da prova). Recomendamos ajustar a meta diária.`;
    }
  }

  // ================= DIAGNÓSTICO TÁTICO & ATAQUE SUAS FRAQUEZAS =================
  renderTacticalInsights() {
    const list = document.getElementById("dash-insights-list");
    const badge = document.getElementById("dash-insights-badge");
    if (!list) return;
    list.innerHTML = "";

    const concurso = store.getActiveConcurso();
    const sessions = store.data.studySessions || [];
    const insights: any[] = [];

    // 1. Destaque Especial: "Ataque suas Fraquezas" (Pior Matéria / Erros)
    const weakest = store.getWeakestSubject();
    if (weakest) {
      insights.push({
        type: "danger",
        icon: "fa-crosshairs",
        title: `Ataque suas Fraquezas: ${weakest.name}`,
        text: `Aproveitamento de ${weakest.accuracy}% em ${weakest.total} questões (${weakest.pendingErrors} erros pendentes). Reforce agora!`,
        actionHtml: `
          <div style="display: flex; gap: 8px; margin-top: 6px;">
            <button class="btn btn-secondary btn-xs" onclick="questionsManager.filterByDisciplina('${weakest.id}'); window.location.hash = '#questoes';">
              <i class="fa-solid fa-bullseye"></i> Treinar ${weakest.name}
            </button>
            <a href="#erros" class="btn btn-secondary btn-xs"><i class="fa-solid fa-book-bookmark"></i> Caderno de Erros</a>
          </div>
        `
      });
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

    if (insights.length === 0) {
      insights.push({
        type: "success",
        icon: "fa-circle-check",
        title: "Planejamento Tático em Dia",
        text: "Todas as disciplinas estão equilibradas. Continue avançando no ciclo de estudos!"
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
          <p style="margin: 0;">${ins.text}</p>
          ${ins.actionHtml || ""}
        </div>
      `;
      list.appendChild(el);
    });
  }

  // ================= TEMPORIZADOR DO RESET DO RANKING SEMANAL =================
  renderRankingCountdown() {
    const badge = document.getElementById("dash-ranking-reset-badge");
    if (!badge) return;
    const cd = store.getRankingResetCountdown();
    badge.innerHTML = `<i class="fa-solid fa-fire text-warning"></i> Reset em ${cd.text}`;
    badge.title = "A rodada do ranking fecha todos os domingos às 23:59";
  }

  // ================= REGISTRO MANUAL DE ESTUDO (AVULSO) =================
  openManualStudyModal() {
    const modal = document.getElementById("modal-manual-study") as HTMLDialogElement | null;
    if (!modal) return;

    const dateInput = document.getElementById("manual-study-date") as HTMLInputElement | null;
    if (dateInput) dateInput.value = store.getLocalDateString();

    const discSelect = document.getElementById("manual-study-disciplina") as HTMLSelectElement | null;
    const concurso = store.getActiveConcurso();
    if (discSelect && concurso) {
      discSelect.innerHTML = (concurso.disciplinas || []).map(d => `
        <option value="${d.id}">${d.name} (Peso ${d.weight})</option>
      `).join("");

      if (concurso.disciplinas && concurso.disciplinas.length > 0) {
        this.onManualSubjectChange(concurso.disciplinas[0].id);
      }
    }

    const hoursInput = document.getElementById("manual-study-hours") as HTMLInputElement | null;
    const minsInput = document.getElementById("manual-study-mins") as HTMLInputElement | null;
    const qTotalInput = document.getElementById("manual-study-q-total") as HTMLInputElement | null;
    const qCorrectInput = document.getElementById("manual-study-q-correct") as HTMLInputElement | null;
    const notesInput = document.getElementById("manual-study-notes") as HTMLInputElement | null;

    if (hoursInput) hoursInput.value = "1";
    if (minsInput) minsInput.value = "0";
    if (qTotalInput) qTotalInput.value = "";
    if (qCorrectInput) qCorrectInput.value = "";
    if (notesInput) notesInput.value = "";

    modal.showModal();
  }

  onManualSubjectChange(discId: string) {
    const topicoSelect = document.getElementById("manual-study-topico") as HTMLSelectElement | null;
    if (!topicoSelect) return;

    const concurso = store.getActiveConcurso();
    const disc = (concurso?.disciplinas || []).find(d => d.id === discId);
    if (!disc || !disc.topicos || disc.topicos.length === 0) {
      topicoSelect.innerHTML = `<option value="">Geral / Sem vínculo a tópico específico</option>`;
      return;
    }

    topicoSelect.innerHTML = `
      <option value="">Geral / Sem vínculo a tópico específico</option>
      ${disc.topicos.map(t => `<option value="${t.id}">${t.title}</option>`).join("")}
    `;
  }

  saveManualStudy() {
    const dateInput = document.getElementById("manual-study-date") as HTMLInputElement | null;
    const typeSelect = document.getElementById("manual-study-type") as HTMLSelectElement | null;
    const discSelect = document.getElementById("manual-study-disciplina") as HTMLSelectElement | null;
    const topicoSelect = document.getElementById("manual-study-topico") as HTMLSelectElement | null;
    const hoursInput = document.getElementById("manual-study-hours") as HTMLInputElement | null;
    const minsInput = document.getElementById("manual-study-mins") as HTMLInputElement | null;
    const qTotalInput = document.getElementById("manual-study-q-total") as HTMLInputElement | null;
    const qCorrectInput = document.getElementById("manual-study-q-correct") as HTMLInputElement | null;
    const notesInput = document.getElementById("manual-study-notes") as HTMLInputElement | null;

    const hours = parseInt(hoursInput?.value || "0", 10) || 0;
    const mins = parseInt(minsInput?.value || "0", 10) || 0;
    const totalMinutes = (hours * 60) + mins;

    if (totalMinutes <= 0) {
      showToast("Informe a duração do estudo (ao menos 1 minuto)!", "warning");
      return;
    }

    const discId = discSelect?.value;
    if (!discId) {
      showToast("Selecione a disciplina estudada!", "warning");
      return;
    }

    const qTotal = parseInt(qTotalInput?.value || "0", 10) || 0;
    const qCorrect = parseInt(qCorrectInput?.value || "0", 10) || 0;

    if (qCorrect > qTotal) {
      showToast("O número de acertos não pode ser maior que o total de questões!", "warning");
      return;
    }

    store.recordManualStudySession({
      date: dateInput?.value || store.getLocalDateString(),
      disciplinaId: discId,
      topicoId: topicoSelect?.value || undefined,
      durationMinutes: totalMinutes,
      type: typeSelect?.value || "teoria",
      questionsTotal: qTotal > 0 ? qTotal : undefined,
      questionsCorrect: qTotal > 0 ? qCorrect : undefined,
      notes: notesInput?.value?.trim() || ""
    });

    const modal = document.getElementById("modal-manual-study") as HTMLDialogElement | null;
    if (modal) modal.close();

    this.init();
    showToast(`Estudo manual de ${hours > 0 ? `${hours}h ` : ""}${mins}m registrado com sucesso.`, "success");
  }

  renderPendingReviews() {
    const content = document.getElementById("dash-revisoes-content");
    if (!content) return;
    content.innerHTML = "";

    const today = store.getLocalDateString();
    const cards = store.data.flashcards || [];
    const cardsDue = cards.filter(c => c.dueDate <= today);

    const concurso = store.getActiveConcurso();
    const pendingReviewTopics: any[] = [];
    const todayObj = new Date();

    (concurso.disciplinas || []).forEach(d => {
      (d.topicos || []).forEach(t => {
        if (t.teoria) {
          const baseTeoriaDate = t.teoriaDate ? new Date(t.teoriaDate) : todayObj;

          if (!t.r24h) {
            const diffDays = Math.floor((todayObj.getTime() - baseTeoriaDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays >= 1) {
              pendingReviewTopics.push({
                disciplina: d.name,
                disciplinaId: d.id,
                topico: t.title,
                topicoId: t.id,
                revType: "R24h"
              });
            }
          } else if (!t.r7d) {
            const baseR24Date = t.r24hDate ? new Date(t.r24hDate) : baseTeoriaDate;
            const diffDays = Math.floor((todayObj.getTime() - baseR24Date.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays >= 7) {
              pendingReviewTopics.push({
                disciplina: d.name,
                disciplinaId: d.id,
                topico: t.title,
                topicoId: t.id,
                revType: "R7d"
              });
            }
          } else if (!t.r30d) {
            const baseR7Date = t.r7dDate ? new Date(t.r7dDate) : baseTeoriaDate;
            const diffDays = Math.floor((todayObj.getTime() - baseR7Date.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays >= 30) {
              pendingReviewTopics.push({
                disciplina: d.name,
                disciplinaId: d.id,
                topico: t.title,
                topicoId: t.id,
                revType: "R30d"
              });
            }
          }
        }
      });
    });

    const totalPending = cardsDue.length + pendingReviewTopics.length;

    if (totalPending === 0) {
      content.innerHTML = `
        <div style="text-align: center; padding: 20px; color: var(--color-accent);">
          <i class="fa-solid fa-circle-check" style="font-size: 2rem; margin-bottom: 8px;"></i>
          <p style="font-size: 0.9rem; font-weight: 600; color: var(--text-main);">Tudo Revisado!</p>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Você não tem flashcards ou tópicos pendentes para hoje.</span>
        </div>
      `;
      return;
    }

    if (cardsDue.length > 0) {
      const el = document.createElement("div");
      el.className = "review-item";
      el.innerHTML = `
        <div class="review-item-info">
          <strong><i class="fa-solid fa-layer-group text-amber"></i> ${cardsDue.length} Flashcards para Hoje</strong>
          <span>Fila de repetição espaçada SM-2</span>
        </div>
        <a href="#flashcards" class="btn btn-secondary btn-xs"><i class="fa-solid fa-play"></i> Revisar</a>
      `;
      content.appendChild(el);
    }

    pendingReviewTopics.slice(0, 3).forEach(r => {
      const el = document.createElement("div");
      el.className = "review-item";
      el.innerHTML = `
        <div class="review-item-info">
          <strong>${r.topico}</strong>
          <span>${r.disciplina} • Revisão ${r.revType}</span>
        </div>
        <a href="#pomodoro" class="btn btn-secondary btn-xs" onclick="pomodoro.selectedDisciplinaId = '${r.disciplinaId}'; pomodoro.selectedTopicoId = '${r.topicoId}';"><i class="fa-solid fa-stopwatch"></i> Foco</a>
      `;
      content.appendChild(el);
    });
  }

  renderKPICards() {
    const today = store.getTodayStats();
    const edital = store.getEditalOverallProgress();
    const todayStr = store.getLocalDateString();
    const cardsDue = (store.data.flashcards || []).filter(c => c.dueDate <= todayStr).length;

    const hoursTodayEl = document.getElementById("kpi-hours-today");
    const hoursGoalEl = document.getElementById("kpi-hours-goal");
    const hoursBarEl = document.getElementById("kpi-hours-bar");
    const dailyGoalHours = (today.goalMinutes / 60).toFixed(1);
    if (hoursTodayEl) hoursTodayEl.textContent = `${today.hoursToday}h`;
    if (hoursGoalEl) hoursGoalEl.textContent = `Meta: ${dailyGoalHours}h (${today.percentGoal}%)`;
    if (hoursBarEl) hoursBarEl.style.width = `${today.percentGoal}%`;

    const questionsTodayEl = document.getElementById("kpi-questions-today");
    const questionsAccEl = document.getElementById("kpi-questions-accuracy");
    if (questionsTodayEl) questionsTodayEl.textContent = `${today.questionsCount}`;
    if (questionsAccEl) questionsAccEl.textContent = `${today.accuracy}% acertos`;

    const flashcardsDueEl = document.getElementById("kpi-flashcards-due");
    if (flashcardsDueEl) flashcardsDueEl.textContent = `${cardsDue}`;

    const editalPercentEl = document.getElementById("kpi-edital-percent");
    const editalSummaryEl = document.getElementById("kpi-edital-summary");
    const editalBarEl = document.getElementById("kpi-edital-bar");
    if (editalPercentEl) editalPercentEl.textContent = `${edital.percent}%`;
    if (editalSummaryEl) editalSummaryEl.textContent = `${edital.concluidos}/${edital.totalTopicos} tópicos`;
    if (editalBarEl) editalBarEl.style.width = `${edital.percent}%`;
  }

  renderDailyMissions() {
    const list = document.getElementById("dash-missions-list");
    const summary = document.getElementById("dash-missions-summary");
    if (!list) return;
    list.innerHTML = "";

    const missions = store.data.dailyMissions || [];
    const completed = missions.filter((m: any) => m.completed).length;

    if (summary) {
      summary.textContent = `${completed}/${missions.length} Concluídas`;
    }

    missions.forEach((m: any) => {
      const el = document.createElement("div");
      el.className = `mission-item-card ${m.completed ? 'completed' : ''}`;
      el.innerHTML = `
        <div class="mission-item-left">
          <input type="checkbox" class="custom-chk" ${m.completed ? 'checked' : ''} onchange="dashboardManager.toggleMission('${m.id}')">
          <div class="mission-texts">
            <h4 style="margin: 0; font-size: 0.85rem; color: var(--text-main);">${m.title}</h4>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${m.progress}/${m.target} • +${m.xpReward} XP</span>
          </div>
        </div>
        <div class="mission-xp-tag">
          <i class="fa-solid fa-bolt text-warning"></i> +${m.xpReward} XP
        </div>
      `;
      list.appendChild(el);
    });
  }

  toggleMission(id: string) {
    const mission = (store.data.dailyMissions || []).find((m: any) => m.id === id);
    if (mission) {
      mission.completed = !mission.completed;
      if (mission.completed) {
        store.addXP(mission.xpReward, `Missão Diária Concluída: ${mission.title}`);
        showToast(`Missão cumprida: +${mission.xpReward} XP`, "success");
      }
      store.save();
      this.renderDailyMissions();
      this.renderHeaderInfo();
    }
  }

  renderCharts() {
    const weekly = store.getWeeklyStats();
    PapiroCharts.renderLineAreaChart(
      "chart-weekly-hours",
      weekly.labels,
      weekly.hours
    );

    const subjectStats = store.getSubjectDistribution();
    const donutItems = (subjectStats as any[]).map(s => ({
      label: s.name,
      value: Number((s.minutes / 60).toFixed(1)),
      color: s.color
    }));
    PapiroCharts.renderDonutChart("chart-subject-donut", donutItems);

    const activeConcurso = store.getActiveConcurso();
    const radarItems = (activeConcurso.disciplinas || []).map(d => {
      const topicos = d.topicos || [];
      const score = topicos.length > 0
        ? Math.round((topicos.reduce((acc, t) => acc + (t.dominio || 1), 0) / (topicos.length * 5)) * 100)
        : 50;
      return { label: d.name, score };
    });
    PapiroCharts.renderRadarChart("chart-domain-radar", radarItems);

    PapiroCharts.renderConsistencyHeatmap("dash-consistency-heatmap", store.data.studySessions);
  }

  renderMotivationalQuote() {
    const quoteEl = document.getElementById("dash-quote-text");
    const authorEl = document.getElementById("dash-quote-author");
    if (!quoteEl || !authorEl) return;

    const idx = new Date().getDate() % MOTIVATIONAL_QUOTES.length;
    const q = MOTIVATIONAL_QUOTES[idx];
    quoteEl.textContent = `"${q.quote}"`;
    authorEl.textContent = `— ${q.author}`;
  }

  bindEvents() {
    const concursoSelect = document.getElementById("header-concurso-select") as HTMLSelectElement | null;
    if (concursoSelect) {
      concursoSelect.addEventListener("change", (e) => {
        store.setActiveConcurso((e.target as HTMLSelectElement).value);
        this.init();
        showToast("Plano de estudos ativo alterado com sucesso!", "info");
      });
    }
  }
}

const dashboardManager = new DashboardManager();
export { DashboardManager, dashboardManager };
if (typeof window !== "undefined") {
  (window as any).DashboardManager = DashboardManager;
  (window as any).dashboardManager = dashboardManager;
}
