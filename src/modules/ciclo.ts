// ==========================================================================
// QG DO CONCURSEIRO - CICLO MANAGER (ESM)
// ==========================================================================
import { store } from "../services/store";
import { pomodoro } from "./pomodoro";
import { showToast } from "../app";

// ==========================================================================
// QG DO CONCURSEIRO - CICLO DE ESTUDOS E PLANEJAMENTO SEMANAL
// ==========================================================================

class CicloManager {
  constructor() {
    this.eventsBound = false;
  }

  init() {
    this.renderCicloVisual();
    this.renderWeeklyPlanner();
    if (!this.eventsBound) {
      this.bindEvents();
      this.eventsBound = true;
    }
  }

  renderCicloVisual() {
    const container = document.getElementById("ciclo-cards-container");
    const currentSubjectBanner = document.getElementById("ciclo-current-banner");
    if (!container) return;
    container.innerHTML = "";

    const ciclo = store.data.ciclo;
    const items = ciclo.items || [];
    const activeIdx = ciclo.currentSubjectIndex || 0;

    if (items.length === 0) {
      store.rebuildCicloForConcurso(store.data.activeConcursoId);
    }

    const currentItem = items[activeIdx] || items[0];

    // Banner da Matéria da Vez
    if (currentSubjectBanner && currentItem) {
      const remainingMins = Math.max(0, currentItem.minutesGoal - currentItem.minutesDone);
      currentSubjectBanner.innerHTML = `
        <div class="current-papiro-card">
          <div class="current-papiro-badge"><i class="fa-solid fa-play"></i> MATÉRIA DA VEZ NO CICLO</div>
          <div class="current-papiro-content">
            <div class="current-papiro-info">
              <h2>${currentItem.name}</h2>
              <p>Meta do bloco: <strong>${currentItem.minutesGoal} min</strong> • Concluído: <strong>${currentItem.minutesDone} min</strong> (${remainingMins} min restantes)</p>
            </div>
            <button class="btn btn-primary btn-lg" onclick="cicloManager.startCurrentPapiro('${currentItem.disciplinaId}')">
              <i class="fa-solid fa-fire"></i> Iniciar Bloco Agora
            </button>
          </div>
        </div>
      `;
    }

    // Grid de Matérias do Ciclo
    items.forEach((item, index) => {
      const isCurrent = index === activeIdx;
      const isDone = item.minutesDone >= item.minutesGoal;
      const percent = Math.min(100, Math.round((item.minutesDone / item.minutesGoal) * 100));

      const card = document.createElement("div");
      card.className = `ciclo-step-card ${isCurrent ? "active-step" : ""} ${isDone ? "completed-step" : ""}`;
      card.onclick = () => {
        store.data.ciclo.currentSubjectIndex = index;
        store.save();
        this.renderCicloVisual();
      };

      card.innerHTML = `
        <div class="ciclo-card-header">
          <span class="ciclo-order-num">#${index + 1}</span>
          <div class="disc-icon-badge" style="background: ${item.color}22; color: ${item.color};">
            <i class="fa-solid ${item.icon || "fa-book"}"></i>
          </div>
        </div>
        <h4 class="ciclo-card-title">${item.name}</h4>
        <div class="ciclo-card-progress">
          <div class="mini-progress-track">
            <div class="mini-progress-fill" style="width: ${percent}%; background: ${item.color};"></div>
          </div>
          <div class="ciclo-card-meta">
            <span>${item.minutesDone}/${item.minutesGoal}m</span>
            <span>${percent}%</span>
          </div>
        </div>
        ${isCurrent ? '<div class="active-badge"><i class="fa-solid fa-arrow-right"></i> Estudar Agora</div>' : ""}
      `;

      container.appendChild(card);
    });
  }

  renderWeeklyPlanner() {
    const container = document.getElementById("weekly-schedule-grid");
    if (!container) return;
    container.innerHTML = "";

    const concurso = store.getActiveConcurso();
    const disciplines = (concurso && concurso.disciplinas && concurso.disciplinas.length > 0)
      ? concurso.disciplinas
      : [];

    const weeklyChecks = store.data.cicloWeeklyChecks || {};

    const dayMeta = [
      { id: "seg", name: "Segunda-feira", targetHours: 4 },
      { id: "ter", name: "Terça-feira", targetHours: 4 },
      { id: "qua", name: "Quarta-feira", targetHours: 4 },
      { id: "qui", name: "Quinta-feira", targetHours: 4 },
      { id: "sex", name: "Sexta-feira", targetHours: 4 },
      { id: "sab", name: "Sábado", targetHours: 5 },
      { id: "dom", name: "Domingo", targetHours: 2 }
    ];

    let discCounter = 0;
    const days = dayMeta.map((d, index) => {
      const materias = [];
      if (index < 5) {
        if (disciplines.length > 0) {
          const subjectsPerDay = disciplines.length >= 5 ? 2 : 1;
          for (let k = 0; k < subjectsPerDay; k++) {
            const disc = disciplines[discCounter % disciplines.length];
            const estMins = (disc.weight || 3) * 15 + 15;
            materias.push(`${disc.name} (${estMins}m)`);
            discCounter++;
          }
          materias.push(index % 2 === 0 ? "Revisão R24h / Flashcards" : "Bateria de 20 Questões");
        } else {
          materias.push("Teoria da Disciplina (60m)", "Exercícios de Fixação (45m)");
        }
      } else if (index === 5) {
        materias.push("Simulado Semanal Cronometrado", "Revisão e Caderno de Erros");
      } else {
        materias.push("Revisão Espaçada de Flashcards", "Planejamento da Próxima Semana");
      }
      return { ...d, materias };
    });

    days.forEach((day, dayIdx) => {
      const col = document.createElement("div");
      col.className = "weekly-col-card";
      col.innerHTML = `
        <div class="weekly-day-header">
          <strong>${day.name}</strong>
          <span class="weekly-day-goal">${day.targetHours}h meta</span>
        </div>
        <div class="weekly-day-items">
          ${day.materias.map((m, mIdx) => {
            const checkKey = `w-${concurso?.id || "pf"}-${dayIdx}-${mIdx}`;
            const isChecked = !!weeklyChecks[checkKey];
            return `
              <div class="weekly-task-item">
                <input type="checkbox" class="custom-chk-sm" ${isChecked ? "checked" : ""}
                  onchange="cicloManager.handleWeeklyCheck('${checkKey}', this.checked)">
                <span style="${isChecked ? "text-decoration: line-through; opacity: 0.7;" : ""}">${m}</span>
              </div>
            `;
          }).join("")}
        </div>
      `;
      container.appendChild(col);
    });
  }

  handleWeeklyCheck(key, isChecked) {
    if (!store.data.cicloWeeklyChecks) store.data.cicloWeeklyChecks = {};
    store.data.cicloWeeklyChecks[key] = isChecked;
    store.save();
    this.renderWeeklyPlanner();
  }

  startCurrentPapiro(disciplinaId) {
    window.location.hash = "#pomodoro";
    setTimeout(() => {
      const select = document.getElementById("pomo-subject-select");
      if (select) {
        select.value = disciplinaId;
        pomodoro.selectedDisciplinaId = disciplinaId;
      }
      pomodoro.start();
      showToast("Sessão de foco iniciada! Bons estudos!", "success");
    }, 100);
  }

  openRecalibrateModal() {
    const modal = document.getElementById("modal-recalibrate-ciclo");
    if (modal) {
      const input = document.getElementById("recalibrate-weekly-hours");
      if (input) input.value = store.data.profile?.weeklyGoalHours || 25;
      modal.classList.remove("hidden");
    }
  }

  recalibrateFromModal() {
    const input = document.getElementById("recalibrate-weekly-hours");
    const hours = input ? (parseInt(input.value, 10) || 25) : 25;
    this.recalibrateCiclo(hours);
  }

  recalibrateCiclo(weeklyHours) {
    const concurso = store.getActiveConcurso();
    const discs = (concurso && concurso.disciplinas) || [];
    if (discs.length === 0) return;

    const totalWeight = discs.reduce((acc, d) => acc + (d.weight || 3), 0);
    const totalWeeklyMinutes = weeklyHours * 60;

    store.data.ciclo.items = discs.map(d => {
      const proportion = (d.weight || 3) / totalWeight;
      const allocatedMins = Math.round((totalWeeklyMinutes * proportion) / 15) * 15;
      return {
        disciplinaId: d.id,
        name: d.name,
        minutesGoal: Math.max(30, allocatedMins),
        minutesDone: 0,
        icon: d.icon || "fa-book",
        color: d.color || "#4D7EA8"
      };
    });

    store.data.ciclo.currentSubjectIndex = 0;
    store.data.profile.weeklyGoalHours = weeklyHours;
    store.save();
    this.renderCicloVisual();

    const modal = document.getElementById("modal-recalibrate-ciclo");
    if (modal) modal.classList.add("hidden");

    showToast(`Ciclo recalculado com sucesso para ${weeklyHours}h semanais! 🔄`, "success");
  }

  bindEvents() {
    const recalibrateBtn = document.getElementById("btn-recalibrate-ciclo");
    if (recalibrateBtn) {
      recalibrateBtn.addEventListener("click", () => this.openRecalibrateModal());
    }
  }
}

const cicloManager = new CicloManager();
export { CicloManager, cicloManager };
if (typeof window !== "undefined") {
  window.CicloManager = CicloManager;
  window.cicloManager = cicloManager;
}
