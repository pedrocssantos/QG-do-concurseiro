// ==========================================================================
// QG DO CONCURSEIRO - EDITAL MANAGER (ESM)
// ==========================================================================
import { store } from "../services/store";
import { pomodoro } from "./pomodoro";
import { showToast } from "../app";

// ==========================================================================
// QG DO CONCURSEIRO - EDITAL VERTICALIZADO E GESTÃO DE CONTEÚDO PROGRAMÁTICO
// ==========================================================================

class EditalManager {
  selectedDisciplinaId: string | null;
  eventsBound: boolean;

  constructor() {
    this.selectedDisciplinaId = null;
    this.eventsBound = false;
  }

  init() {
    this.renderHeader();
    this.renderDisciplinasList();
    if (!this.eventsBound) {
      this.bindEvents();
      this.eventsBound = true;
    }
  }

  renderHeader() {
    const concurso = store.getActiveConcurso();
    const overall = store.getEditalOverallProgress();

    const titleEl = document.getElementById("edital-concurso-title");
    const bancaEl = document.getElementById("edital-concurso-banca");
    const countdownEl = document.getElementById("edital-countdown-badge");
    const progressTextEl = document.getElementById("edital-progress-text");
    const progressBarEl = document.getElementById("edital-progress-bar-fill");
    const topicosCountEl = document.getElementById("edital-topicos-summary");

    if (titleEl) titleEl.textContent = concurso.title;
    if (bancaEl) bancaEl.textContent = `Banca: ${concurso.banca || "Cebraspe"}`;

    if (concurso.targetDate && countdownEl) {
      const target = new Date(concurso.targetDate);
      const today = new Date();
      const diffTime = target.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      countdownEl.innerHTML = diffDays > 0 
        ? `<i class="fa-solid fa-hourglass-half"></i> Faltam ${diffDays} dias para o combate`
        : `<i class="fa-solid fa-flag-checkered"></i> Dia da Prova`;
    }

    if (progressTextEl) progressTextEl.textContent = `${overall.percent}% Concluído`;
    if (progressBarEl) progressBarEl.style.width = `${overall.percent}%`;
    if (topicosCountEl) topicosCountEl.textContent = `${overall.concluidos} de ${overall.totalTopicos} tópicos dominados`;
  }

  renderDisciplinasList() {
    const container = document.getElementById("edital-disciplinas-accordion");
    if (!container) return;
    container.innerHTML = "";

    const concurso = store.getActiveConcurso();
    const disciplinas = concurso.disciplinas || [];

    disciplinas.forEach((disc) => {
      const totalTopicos = disc.topicos?.length || 0;
      const doneTopicos = disc.topicos?.filter(t => t.teoria && t.resumo).length || 0;
      const percent = totalTopicos > 0 ? Math.round((doneTopicos / totalTopicos) * 100) : 0;

      const card = document.createElement("div");
      card.className = "edital-disc-card";
      card.id = `disc-card-${disc.id}`;

      card.innerHTML = `
        <div class="edital-disc-header" onclick="editalManager.toggleAccordion('${disc.id}')">
          <div class="disc-header-left">
            <div class="disc-icon-badge" style="background: ${disc.color}22; color: ${disc.color}; border: 1px solid ${disc.color}44;">
              <i class="fa-solid ${disc.icon || "fa-book"}"></i>
            </div>
            <div class="disc-info">
              <div class="disc-title-row">
                <h3 class="disc-name">${disc.name}</h3>
                <span class="badge-weight">Peso ${disc.weight || 3}</span>
              </div>
              <div class="disc-meta-row">
                <span class="disc-topics-count">${doneTopicos}/${totalTopicos} tópicos</span>
                <span class="disc-percent-label">${percent}%</span>
              </div>
            </div>
          </div>
          <div class="disc-header-right">
            <div class="mini-progress-track">
              <div class="mini-progress-fill" style="width: ${percent}%; background: ${disc.color};"></div>
            </div>
            <button class="accordion-chevron-btn"><i class="fa-solid fa-chevron-down"></i></button>
          </div>
        </div>
        <div class="edital-disc-body hidden" id="disc-body-${disc.id}">
          <div class="topics-table-wrapper">
            <table class="topics-table">
              <thead>
                <tr>
                  <th style="width: 35%;">Tópico do Edital</th>
                  <th title="Teoria completa estudada">Teoria</th>
                  <th title="Resumo ou mapas mentais produzidos">Resumo</th>
                  <th title="Revisão de 24 horas">R24h</th>
                  <th title="Revisão de 7 dias">R7d</th>
                  <th title="Revisão de 30 dias">R30d</th>
                  <th>Questões</th>
                  <th>Domínio</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody id="topics-tbody-${disc.id}">
                ${this.renderTopicsRows(concurso.id, disc)}
              </tbody>
            </table>
          </div>
          <div class="disc-body-footer">
            <button class="btn btn-secondary btn-sm" onclick="editalManager.openAddTopicoModal('${disc.id}')">
              <i class="fa-solid fa-plus"></i> Adicionar Tópico nesta Matéria
            </button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  renderTopicsRows(concursoId, disc) {
    if (!disc.topicos || disc.topicos.length === 0) {
      return `<tr><td colspan="9" class="text-center text-muted" style="padding: 20px;">Nenhum tópico cadastrado nesta disciplina.</td></tr>`;
    }

    return disc.topicos.map(t => {
      const qTotal = t.questoesFeitas || 0;
      const qCorrect = t.questoesAcertos || 0;
      const qPercent = qTotal > 0 ? Math.round((qCorrect / qTotal) * 100) : 0;

      return `
        <tr class="topic-row">
          <td class="topic-title-cell">
            <strong>${t.title}</strong>
          </td>
          <td class="text-center">
            <input type="checkbox" class="custom-chk" ${t.teoria ? "checked" : ""} 
              onchange="editalManager.handleCheckToggle('${concursoId}', '${disc.id}', '${t.id}', 'teoria', this.checked)">
          </td>
          <td class="text-center">
            <input type="checkbox" class="custom-chk" ${t.resumo ? "checked" : ""} 
              onchange="editalManager.handleCheckToggle('${concursoId}', '${disc.id}', '${t.id}', 'resumo', this.checked)">
          </td>
          <td class="text-center">
            <input type="checkbox" class="custom-chk" ${t.r24h ? "checked" : ""} 
              onchange="editalManager.handleCheckToggle('${concursoId}', '${disc.id}', '${t.id}', 'r24h', this.checked)">
          </td>
          <td class="text-center">
            <input type="checkbox" class="custom-chk" ${t.r7d ? "checked" : ""} 
              onchange="editalManager.handleCheckToggle('${concursoId}', '${disc.id}', '${t.id}', 'r7d', this.checked)">
          </td>
          <td class="text-center">
            <input type="checkbox" class="custom-chk" ${t.r30d ? "checked" : ""} 
              onchange="editalManager.handleCheckToggle('${concursoId}', '${disc.id}', '${t.id}', 'r30d', this.checked)">
          </td>
          <td>
            <div class="q-stat-pill ${qTotal > 0 ? (qPercent >= 80 ? 'q-high' : 'q-med') : 'q-zero'}">
              ${qTotal > 0 ? `${qCorrect}/${qTotal} (${qPercent}%)` : "0 Feitas"}
            </div>
          </td>
          <td>
            <select class="dominio-select" onchange="editalManager.handleDominioChange('${concursoId}', '${disc.id}', '${t.id}', this.value)">
              <option value="1" ${t.dominio === 1 ? "selected" : ""}>⭐ Básico</option>
              <option value="2" ${t.dominio === 2 ? "selected" : ""}>⭐⭐ Em estudo</option>
              <option value="3" ${t.dominio === 3 ? "selected" : ""}>⭐⭐⭐ Bom</option>
              <option value="4" ${t.dominio === 4 ? "selected" : ""}>⭐⭐⭐⭐ Avançado</option>
              <option value="5" ${t.dominio === 5 ? "selected" : ""}>⭐⭐⭐⭐⭐ Dominado</option>
            </select>
          </td>
          <td>
            <div class="actions-group">
              <button class="action-btn-icon" title="Iniciar Sessão de Foco" onclick="editalManager.startPapiroOnTopic('${disc.id}', '${t.id}')">
                <i class="fa-solid fa-stopwatch"></i>
              </button>
              <button class="action-btn-icon delete-btn" title="Excluir Tópico" onclick="editalManager.deleteTopico('${concursoId}', '${disc.id}', '${t.id}')">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  toggleAccordion(discId) {
    const body = document.getElementById(`disc-body-${discId}`);
    const card = document.getElementById(`disc-card-${discId}`);
    if (body && card) {
      body.classList.toggle("hidden");
      card.classList.toggle("expanded");
    }
  }

  handleCheckToggle(concursoId, discId, topicoId, fieldName, isChecked) {
    store.updateTopico(concursoId, discId, topicoId, { [fieldName]: isChecked });
    this.renderHeader();
    const concurso = store.getActiveConcurso();
    const disc = (concurso?.disciplinas || []).find(d => d.id === discId);
    if (disc) {
      const totalTopicos = disc.topicos?.length || 0;
      const doneTopicos = disc.topicos?.filter(t => t.teoria && t.resumo).length || 0;
      const percent = totalTopicos > 0 ? Math.round((doneTopicos / totalTopicos) * 100) : 0;
      const card = document.getElementById(`disc-card-${discId}`);
      if (card) {
        const countEl = card.querySelector(".disc-topics-count");
        const percentLabel = card.querySelector(".disc-percent-label");
        const fillEl = card.querySelector(".mini-progress-fill") as HTMLElement | null;
        if (countEl) countEl.textContent = `${doneTopicos}/${totalTopicos} tópicos`;
        if (percentLabel) percentLabel.textContent = `${percent}%`;
        if (fillEl) fillEl.style.width = `${percent}%`;
      }
    }
  }

  handleDominioChange(concursoId, discId, topicoId, value) {
    store.updateTopico(concursoId, discId, topicoId, { dominio: parseInt(value, 10) });
  }

  deleteTopico(concursoId, discId, topicoId) {
    if (confirm("Tem certeza que deseja remover este tópico do seu edital?")) {
      store.deleteTopico(concursoId, discId, topicoId);
      this.renderDisciplinasList();
      this.renderHeader();
      showToast("Tópico removido com sucesso.", "info");
    }
  }

  startPapiroOnTopic(discId, topicoId) {
    window.location.hash = "#pomodoro";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const select = document.getElementById("pomo-subject-select") as HTMLSelectElement | null;
        if (select) {
          select.value = discId;
          pomodoro.selectedDisciplinaId = discId;
          pomodoro.selectedTopicoId = topicoId;
        }
        showToast("Tópico selecionado para sessão de foco!", "info");
      });
    });
  }

  openAddTopicoModal(discId) {
    this.selectedDisciplinaId = discId;
    const modal = document.getElementById("modal-add-topico") as HTMLDialogElement | null;
    if (modal) {
      const input = document.getElementById("new-topico-title") as HTMLInputElement | null;
      if (input) input.value = "";
      modal.showModal();
    }
  }

  saveNewTopico() {
    const titleInput = document.getElementById("new-topico-title") as HTMLInputElement | null;
    const title = titleInput ? titleInput.value.trim() : "";
    if (!title) {
      showToast("Insira o nome do tópico!", "warning");
      return;
    }

    const concurso = store.getActiveConcurso();
    store.addTopico(concurso.id, this.selectedDisciplinaId, {
      title: title,
      teoria: false,
      resumo: false,
      r24h: false,
      r7d: false,
      r30d: false,
      questoesFeitas: 0,
      questoesAcertos: 0,
      dominio: 1
    });

    const modal = document.getElementById("modal-add-topico") as HTMLDialogElement | null;
    if (modal) modal.close();

    this.renderDisciplinasList();
    this.renderHeader();
    if (this.selectedDisciplinaId) {
      this.toggleAccordion(this.selectedDisciplinaId);
    }
    showToast("Novo tópico adicionado ao seu edital!", "success");
  }

  printEdital() {
    // Abre todos os corpos do acordeão antes de imprimir
    const bodies = document.querySelectorAll(".edital-disc-body");
    bodies.forEach(b => b.classList.remove("hidden"));
    const cards = document.querySelectorAll(".edital-disc-card");
    cards.forEach(c => c.classList.add("expanded"));
    setTimeout(() => {
      window.print();
    }, 150);
  }

  bindEvents() {
    const printBtn = document.getElementById("btn-print-edital");
    if (printBtn) {
      printBtn.addEventListener("click", () => this.printEdital());
    }

    const addDiscBtn = document.getElementById("btn-open-add-disc-modal");
    if (addDiscBtn) {
      addDiscBtn.addEventListener("click", () => {
        const modal = document.getElementById("modal-add-disciplina") as HTMLDialogElement | null;
        if (modal) modal.showModal();
      });
    }
  }

  saveNewDisciplina() {
    const nameInput = document.getElementById("new-disc-name") as HTMLInputElement | null;
    const name = nameInput ? nameInput.value.trim() : "";
    const weightInput = document.getElementById("new-disc-weight") as HTMLInputElement | null;
    const weight = weightInput ? (parseInt(weightInput.value, 10) || 3) : 3;
    const colorSelect = document.getElementById("new-disc-color") as HTMLSelectElement | null;
    const color = colorSelect ? colorSelect.value : "#4D7EA8";
    const iconSelect = document.getElementById("new-disc-icon") as HTMLSelectElement | null;
    const icon = iconSelect ? iconSelect.value : "fa-book";

    if (!name) {
      showToast("Digite o nome da disciplina!", "warning");
      return;
    }

    const concurso = store.getActiveConcurso();
    store.addDisciplina(concurso.id, {
      name,
      weight,
      color,
      icon,
      topicos: []
    });

    const modal = document.getElementById("modal-add-disciplina") as HTMLDialogElement | null;
    if (modal) modal.close();
    if (nameInput) nameInput.value = "";

    this.renderDisciplinasList();
    this.renderHeader();
    showToast(`Disciplina "${name}" adicionada ao edital!`, "success");
  }
}

const editalManager = new EditalManager();
export { EditalManager, editalManager };
if (typeof window !== "undefined") {
  window.EditalManager = EditalManager;
  window.editalManager = editalManager;
}
