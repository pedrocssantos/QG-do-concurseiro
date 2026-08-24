// ==========================================================================
// FOCO NO PAPIRO - CICLO DE ESTUDOS E PLANEJAMENTO SEMANAL
// ==========================================================================

class CicloManager {
  constructor() {}

  init() {
    this.renderCicloVisual();
    this.renderWeeklyPlanner();
    this.bindEvents();
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
              <p>Meta do bloco: <strong>${currentItem.minutesGoal} min</strong> • Já estudado: <strong>${currentItem.minutesDone} min</strong> (${remainingMins} min restantes)</p>
            </div>
            <button class="btn btn-primary btn-lg pulse-glow" onclick="cicloManager.startCurrentPapiro('${currentItem.disciplinaId}')">
              <i class="fa-solid fa-fire"></i> Iniciar Papiro Agora
            </button>
          </div>
          <div class="current-papiro-progress-track">
            <div class="current-papiro-progress-fill" style="width: ${Math.min(100, Math.round((currentItem.minutesDone / currentItem.minutesGoal) * 100))}%; background: ${currentItem.color || '#3b82f6'};"></div>
          </div>
        </div>
      `;
    }

    // Grid do Ciclo Completo
    items.forEach((item, idx) => {
      const isActive = idx === activeIdx;
      const percent = Math.min(100, Math.round((item.minutesDone / item.minutesGoal) * 100));

      const card = document.createElement("div");
      card.className = `ciclo-step-card ${isActive ? "active-step" : ""} ${percent >= 100 ? "completed-step" : ""}`;
      
      card.innerHTML = `
        <div class="ciclo-step-num">${idx + 1}</div>
        <div class="ciclo-step-icon" style="color: ${item.color || '#3b82f6'}">
          <i class="fa-solid ${item.icon || 'fa-book'}"></i>
        </div>
        <div class="ciclo-step-details">
          <h4>${item.name}</h4>
          <span class="ciclo-step-time">${item.minutesDone} / ${item.minutesGoal} min</span>
        </div>
        <div class="ciclo-step-bar">
          <div class="ciclo-step-bar-fill" style="width: ${percent}%; background: ${item.color || '#3b82f6'};"></div>
        </div>
        ${isActive ? '<span class="tag-in-progress">Em Andamento</span>' : ''}
      `;

      card.addEventListener("click", () => {
        store.data.ciclo.currentSubjectIndex = idx;
        store.save();
        this.renderCicloVisual();
      });

      container.appendChild(card);
    });
  }

  renderWeeklyPlanner() {
    const container = document.getElementById("weekly-schedule-grid");
    if (!container) return;
    container.innerHTML = "";

    const days = [
      { id: "seg", name: "Segunda-feira", targetHours: 4, materias: ["Português (60m)", "Dir. Administrativo (60m)", "Informática (90m)"] },
      { id: "ter", name: "Terça-feira", targetHours: 4, materias: ["Dir. Constitucional (60m)", "Contabilidade (75m)", "Raciocínio Lógico (60m)"] },
      { id: "qua", name: "Quarta-feira", targetHours: 4, materias: ["Dir. Penal (60m)", "Português (60m)", "Informática (90m)"] },
      { id: "qui", name: "Quinta-feira", targetHours: 4, materias: ["Dir. Administrativo (60m)", "Contabilidade (75m)", "Dir. Constitucional (60m)"] },
      { id: "sex", name: "Sexta-feira", targetHours: 4, materias: ["Raciocínio Lógico (60m)", "Dir. Penal (60m)", "Revisões R7d / Flashcards"] },
      { id: "sab", name: "Sábado", targetHours: 5, materias: ["Bateria 50 Questões", "Simulado Quinzenal", "Caderno de Erros"] },
      { id: "dom", name: "Domingo", targetHours: 2, materias: ["Revisão Geral Semanal", "Planejamento da Próxima Semana"] }
    ];

    days.forEach(day => {
      const col = document.createElement("div");
      col.className = "weekly-day-col";
      col.innerHTML = `
        <div class="weekly-day-header">
          <h4>${day.name}</h4>
          <span class="weekly-day-goal">${day.targetHours}h meta</span>
        </div>
        <div class="weekly-day-items">
          ${day.materias.map(m => `
            <div class="weekly-task-item">
              <input type="checkbox" class="custom-chk-sm">
              <span>${m}</span>
            </div>
          `).join("")}
        </div>
      `;
      container.appendChild(col);
    });
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
      showToast("Foco total iniciado! Bom papiro guerreiro(a)!", "success");
    }, 100);
  }

  openRecalibrateModal() {
    const modal = document.getElementById("modal-recalibrate-ciclo");
    if (modal) modal.classList.remove("hidden");
  }

  recalibrateCiclo(weeklyHours) {
    const concurso = store.getActiveConcurso();
    const discs = concurso.disciplinas || [];
    if (discs.length === 0) return;

    const totalWeight = discs.reduce((acc, d) => acc + (d.weight || 3), 0);
    const totalWeeklyMinutes = weeklyHours * 60;

    store.data.ciclo.items = discs.map(d => {
      const proportion = (d.weight || 3) / totalWeight;
      const allocatedMins = Math.round((totalWeeklyMinutes * proportion) / 15) * 15; // Múltiplo de 15 min
      return {
        disciplinaId: d.id,
        name: d.name,
        minutesGoal: Math.max(30, allocatedMins),
        minutesDone: 0,
        icon: d.icon || "fa-book",
        color: d.color || "#3b82f6"
      };
    });

    store.data.ciclo.currentSubjectIndex = 0;
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
