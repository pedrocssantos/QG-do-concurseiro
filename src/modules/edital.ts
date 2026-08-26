// ==========================================================================
// QG DO CONCURSEIRO - EDITAL MANAGER (ESM)
// ==========================================================================
import { store } from "../services/store";
import { pomodoro } from "./pomodoro";
import { showToast } from "../app";
import { EditalBulkParser, ParsedDisciplina } from "../services/editalParser";
import { PRESET_CONCURSOS } from "../data/presetsData";

// ==========================================================================
// QG DO CONCURSEIRO - EDITAL VERTICALIZADO & GESTÃO ULTRA-FLEXÍVEL
// ==========================================================================

class EditalManager {
  selectedDisciplinaId: string | null;
  selectedDisciplinaName: string | null;
  eventsBound: boolean;
  searchQuery: string;
  statusFilter: string;
  allExpanded: boolean;
  bulkParsedDisciplinas: ParsedDisciplina[];

  constructor() {
    this.selectedDisciplinaId = null;
    this.selectedDisciplinaName = null;
    this.eventsBound = false;
    this.searchQuery = "";
    this.statusFilter = "all";
    this.allExpanded = false;
    this.bulkParsedDisciplinas = [];
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

    if (disciplinas.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 48px 20px; background: var(--bg-surface); border: 1px dashed var(--border-color-strong); border-radius: var(--radius-lg); margin-top: 10px;">
          <div class="modal-icon-header icon-primary" style="margin: 0 auto 12px;"><i class="fa-solid fa-layer-group"></i></div>
          <h3 style="font-size: 1.1rem; color: var(--text-main); margin-bottom: 6px;">Nenhuma disciplina neste Edital ainda</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 480px; margin: 0 auto 20px;">
            Você pode importar um edital oficial pronto do catálogo, colar o texto bruto do PDF ou adicionar disciplinas manualmente.
          </p>
          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" onclick="editalManager.openCatalogoEditaisModal()">
              <i class="fa-solid fa-layer-group"></i> Ver Catálogo de Editais
            </button>
            <button class="btn btn-secondary btn-sm" onclick="editalManager.openBulkEditalModal()">
              <i class="fa-solid fa-file-lines"></i> Colar Texto do Edital
            </button>
          </div>
        </div>
      `;
      return;
    }

    disciplinas.forEach((disc) => {
      const totalTopicos = disc.topicos?.length || 0;
      const doneTopicos = disc.topicos?.filter(t => t.teoria || (t.dominio && t.dominio >= 4)).length || 0;
      const percent = totalTopicos > 0 ? Math.round((doneTopicos / totalTopicos) * 100) : 0;

      const hasActiveFilter = this.statusFilter !== "all" || this.searchQuery.trim() !== "";
      const isExpanded = this.allExpanded || hasActiveFilter;

      const card = document.createElement("div");
      card.className = `edital-disc-card ${isExpanded ? "expanded" : ""}`;
      card.id = `disc-card-${disc.id}`;

      card.innerHTML = `
        <div class="edital-disc-header" onclick="editalManager.toggleAccordion('${disc.id}')">
          <div class="disc-header-left">
            <div class="disc-icon-badge" style="background: ${disc.color}1a; color: ${disc.color}; border: 1px solid ${disc.color}33;">
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
        <div class="edital-disc-body ${isExpanded ? "" : "hidden"}" id="disc-body-${disc.id}">
          <div class="topics-table-wrapper">
            <table class="topics-table">
              <thead>
                <tr>
                  <th style="width: 36%;">Tópico do Edital</th>
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
          <div class="disc-body-footer" style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-secondary btn-xs" onclick="editalManager.openAddTopicoModal('${disc.id}')">
              <i class="fa-solid fa-plus"></i> Novo Tópico
            </button>
            <button class="btn btn-secondary btn-xs" onclick="editalManager.openAddTopicosBatchModal('${disc.id}', '${disc.name.replace(/'/g, "\\'")}')">
              <i class="fa-solid fa-list-check"></i> Colar Tópicos em Lote
            </button>
            <button class="btn btn-secondary btn-xs" style="color: var(--color-danger); margin-left: auto;" onclick="editalManager.deleteDisciplina('${concurso.id}', '${disc.id}')" title="Excluir disciplina">
              <i class="fa-solid fa-trash-can"></i> Excluir Matéria
            </button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  renderTopicsRows(concursoId, disc) {
    let topicos = disc.topicos || [];
    if (topicos.length === 0) {
      return `<tr><td colspan="9" class="text-center text-muted" style="padding: 20px; font-size: 0.85rem;">Nenhum tópico cadastrado nesta disciplina. Clique em <strong>"Novo Tópico"</strong> ou <strong>"Colar Tópicos em Lote"</strong> abaixo.</td></tr>`;
    }

    if (this.statusFilter === "teoria_pendente") {
      topicos = topicos.filter(t => !t.teoria);
    } else if (this.statusFilter === "resumo_pendente") {
      topicos = topicos.filter(t => !t.resumo);
    } else if (this.statusFilter === "revisoes_pendentes") {
      topicos = topicos.filter(t => !t.r24h || !t.r7d || !t.r30d);
    } else if (this.statusFilter === "baixo_dominio") {
      topicos = topicos.filter(t => !t.dominio || t.dominio <= 2);
    } else if (this.statusFilter === "concluidos") {
      topicos = topicos.filter(t => t.dominio && t.dominio >= 4);
    }

    if (this.searchQuery.trim() !== "") {
      const q = this.searchQuery.toLowerCase().trim();
      topicos = topicos.filter(t => (t.title || "").toLowerCase().includes(q));
    }

    if (topicos.length === 0) {
      return `<tr><td colspan="9" class="text-center text-muted" style="padding: 16px; font-size: 0.85rem;">Nenhum tópico corresponde ao filtro atual.</td></tr>`;
    }

    return topicos.map(t => {
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

  toggleExpandAll() {
    this.allExpanded = !this.allExpanded;
    const bodies = document.querySelectorAll(".edital-disc-body");
    const cards = document.querySelectorAll(".edital-disc-card");
    const btn = document.getElementById("edital-btn-expand-all");

    bodies.forEach(b => {
      if (this.allExpanded) b.classList.remove("hidden");
      else b.classList.add("hidden");
    });
    cards.forEach(c => {
      if (this.allExpanded) c.classList.add("expanded");
      else c.classList.remove("expanded");
    });

    if (btn) {
      btn.innerHTML = this.allExpanded 
        ? `<i class="fa-solid fa-down-left-and-up-right-to-center"></i> Recolher Todos`
        : `<i class="fa-solid fa-up-right-and-down-left-from-center"></i> Expandir Todos`;
    }
  }

  handleCheckToggle(concursoId, discId, topicoId, fieldName, isChecked) {
    store.updateTopico(concursoId, discId, topicoId, { [fieldName]: isChecked });
    this.renderHeader();
    const concurso = store.getActiveConcurso();
    const disc = (concurso?.disciplinas || []).find(d => d.id === discId);
    if (disc) {
      const totalTopicos = disc.topicos?.length || 0;
      const doneTopicos = disc.topicos?.filter(t => t.teoria || (t.dominio && t.dominio >= 4)).length || 0;
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
    this.renderHeader();
  }

  deleteTopico(concursoId, discId, topicoId) {
    if (confirm("Tem certeza que deseja remover este tópico do seu edital?")) {
      store.deleteTopico(concursoId, discId, topicoId);
      this.renderDisciplinasList();
      this.renderHeader();
      showToast("Tópico removido com sucesso.", "info");
    }
  }

  deleteDisciplina(concursoId, discId) {
    if (confirm("Tem certeza que deseja remover esta disciplina inteira do seu edital?")) {
      const concurso = store.data.concursos.find(c => c.id === concursoId);
      if (concurso) {
        concurso.disciplinas = (concurso.disciplinas || []).filter(d => d.id !== discId);
        store.rebuildCicloForConcurso(concursoId);
        store.save();
        this.renderDisciplinasList();
        this.renderHeader();
        showToast("Disciplina removida do edital.", "info");
      }
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
          pomodoro.updateTopicDropdown();
        }
        showToast("Tópico selecionado para sessão de foco!", "info");
      });
    });
  }

  // ================= CATÁLOGO DE EDITAIS PRONTOS (PRESETS) =================
  openCatalogoEditaisModal() {
    const modal = document.getElementById("modal-catalogo-editais") as HTMLDialogElement | null;
    if (!modal) return;
    this.renderCatalogoEditaisGrid();
    modal.showModal();
  }

  renderCatalogoEditaisGrid(filterCategory = "all") {
    const container = document.getElementById("catalogo-editais-grid");
    if (!container) return;
    container.innerHTML = "";

    const list = PRESET_CONCURSOS.filter(p => filterCategory === "all" || p.category === filterCategory);

    list.forEach(p => {
      const card = document.createElement("div");
      card.className = "catalogo-preset-card";
      const totalTopicos = p.disciplinas.reduce((acc, d) => acc + d.topicos.length, 0);

      card.innerHTML = `
        <div class="preset-card-header">
          <div>
            <span class="badge badge-primary" style="font-size: 0.68rem; margin-bottom: 4px; display: inline-block;">${p.category}</span>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin: 0;">${p.shortTitle}</h4>
          </div>
          <span style="font-size: 0.72rem; color: var(--text-dimmed); font-weight: 600;">${p.banca}</span>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin: 8px 0 12px; line-height: 1.4;">${p.desc}</p>
        <div class="preset-card-meta">
          <span><i class="fa-solid fa-book-bookmark"></i> ${p.disciplinas.length} Matérias</span>
          <span><i class="fa-solid fa-list-check"></i> ${totalTopicos} Tópicos</span>
          <span><i class="fa-solid fa-money-bill-wave"></i> ${p.salario}</span>
        </div>
        <button class="btn btn-primary btn-sm" style="width: 100%; margin-top: 12px;" onclick="editalManager.clonePreset('${p.id}')">
          <i class="fa-solid fa-copy"></i> Clonar e Ativar Este Edital
        </button>
      `;
      container.appendChild(card);
    });
  }

  clonePreset(presetId: string) {
    const cloned = store.clonePresetConcurso(presetId);
    if (cloned) {
      const modal = document.getElementById("modal-catalogo-editais") as HTMLDialogElement | null;
      if (modal) modal.close();
      this.renderDisciplinasList();
      this.renderHeader();
      showToast(`Edital "${cloned.title}" importado e ativado com sucesso.`, "success");
    }
  }

  // ================= PARSER DE TEXTO LIVRE (BULK PARSER) =================
  openBulkEditalModal() {
    const modal = document.getElementById("modal-bulk-edital-parser") as HTMLDialogElement | null;
    if (!modal) return;
    const input = document.getElementById("bulk-edital-raw-text") as HTMLTextAreaElement | null;
    const previewContainer = document.getElementById("bulk-edital-preview-container");
    if (input) input.value = "";
    if (previewContainer) previewContainer.innerHTML = "";
    this.bulkParsedDisciplinas = [];
    modal.showModal();
  }

  analyzeBulkText() {
    const input = document.getElementById("bulk-edital-raw-text") as HTMLTextAreaElement | null;
    const previewContainer = document.getElementById("bulk-edital-preview-container");
    const actionsBar = document.getElementById("bulk-edital-actions-footer");
    if (!input || !previewContainer) return;

    const raw = input.value.trim();
    if (!raw) {
      showToast("Cole o texto do edital para analisar!", "warning");
      return;
    }

    const result = EditalBulkParser.parse(raw);
    this.bulkParsedDisciplinas = result.disciplinas;

    if (this.bulkParsedDisciplinas.length === 0) {
      previewContainer.innerHTML = `
        <div style="padding: 16px; background: var(--bg-surface-inset); border: 1px solid var(--color-danger-tint); border-radius: var(--radius-sm); color: var(--color-danger);">
          <i class="fa-solid fa-triangle-exclamation"></i> Nenhuma disciplina ou tópico identificado. Verifique se o texto colado contém nomes de disciplinas e tópicos.
        </div>
      `;
      if (actionsBar) actionsBar.classList.add("hidden");
      return;
    }

    const totalTopics = this.bulkParsedDisciplinas.reduce((acc, d) => acc + d.topicos.length, 0);

    previewContainer.innerHTML = `
      <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 12px 16px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong style="color: var(--text-main); font-size: 0.9rem;"><i class="fa-solid fa-circle-check text-accent"></i> Edital Processado com Sucesso</strong>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">Detectadas <strong>${this.bulkParsedDisciplinas.length} disciplinas</strong> e <strong>${totalTopics} tópicos</strong>.</p>
        </div>
      </div>
      <div class="bulk-preview-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow-y: auto; padding-right: 4px;">
        ${this.bulkParsedDisciplinas.map((d, idx) => `
          <div style="background: var(--bg-surface-inset); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 10px 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="font-size: 0.85rem; color: var(--text-main);"><i class="fa-solid ${d.icon}" style="color: ${d.color}; margin-right: 6px;"></i> ${d.name}</strong>
              <span class="badge-weight">Peso ${d.weight} • ${d.topicos.length} tópicos</span>
            </div>
            <ul style="margin: 0; padding-left: 18px; font-size: 0.78rem; color: var(--text-muted); max-height: 90px; overflow-y: auto;">
              ${d.topicos.slice(0, 5).map(t => `<li>${t.title}</li>`).join("")}
              ${d.topicos.length > 5 ? `<li style="list-style: none; font-style: italic; color: var(--color-primary);">+ ${d.topicos.length - 5} outros tópicos...</li>` : ""}
            </ul>
          </div>
        `).join("")}
      </div>
    `;

    if (actionsBar) actionsBar.classList.remove("hidden");
  }

  applyBulkImport(mode: "replace" | "append" | "newConcurso") {
    if (!this.bulkParsedDisciplinas || this.bulkParsedDisciplinas.length === 0) {
      showToast("Analise o texto antes de gerar o edital!", "warning");
      return;
    }

    const titleInput = document.getElementById("bulk-new-concurso-title") as HTMLInputElement | null;
    const meta = {
      title: titleInput ? titleInput.value.trim() || "Novo Concurso Personalizado" : "Novo Concurso Personalizado",
      shortTitle: titleInput ? titleInput.value.trim().substring(0, 25) : "Personalizado",
      banca: "Geral",
      targetDate: "2026-12-31"
    };

    store.importBulkParsedEdital(this.bulkParsedDisciplinas, mode, meta);

    const modal = document.getElementById("modal-bulk-edital-parser") as HTMLDialogElement | null;
    if (modal) modal.close();

    this.renderDisciplinasList();
    this.renderHeader();
    showToast("Conteúdo do edital gerado e aplicado com sucesso.", "success");
  }

  // ================= ADIÇÃO EM LOTE DE TÓPICOS POR DISCIPLINA =================
  openAddTopicosBatchModal(discId: string, discName: string) {
    this.selectedDisciplinaId = discId;
    this.selectedDisciplinaName = discName;
    const modal = document.getElementById("modal-add-topicos-batch") as HTMLDialogElement | null;
    const titleEl = document.getElementById("batch-topicos-disc-title");
    const textarea = document.getElementById("batch-topicos-text") as HTMLTextAreaElement | null;

    if (titleEl) titleEl.textContent = discName;
    if (textarea) textarea.value = "";
    if (modal) modal.showModal();
  }

  saveTopicosBatch() {
    const textarea = document.getElementById("batch-topicos-text") as HTMLTextAreaElement | null;
    const raw = textarea ? textarea.value.trim() : "";
    if (!raw) {
      showToast("Cole os tópicos para adicionar!", "warning");
      return;
    }

    const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return;

    const concurso = store.getActiveConcurso();
    const created = store.addTopicosBatch(concurso.id, this.selectedDisciplinaId, lines);

    const modal = document.getElementById("modal-add-topicos-batch") as HTMLDialogElement | null;
    if (modal) modal.close();

    this.renderDisciplinasList();
    this.renderHeader();
    if (this.selectedDisciplinaId) {
      this.toggleAccordion(this.selectedDisciplinaId);
    }
    showToast(`${created.length} tópicos adicionados com sucesso em ${this.selectedDisciplinaName}.`, "success");
  }

  // ================= EXPORTAÇÃO & IMPORTAÇÃO JSON =================
  exportEditalJSON() {
    try {
      const concurso = store.getActiveConcurso();
      const jsonStr = store.exportEditalToJSON(concurso.id, true);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const cleanFileName = (concurso.shortTitle || concurso.title).toLowerCase().replace(/[^a-z0-9]/g, "-");
      a.href = url;
      a.download = `edital-${cleanFileName}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Arquivo de edital exportado com sucesso (.json).", "success");
    } catch (e: any) {
      showToast(`Erro ao exportar: ${e.message}`, "warning");
    }
  }

  importEditalJSON(file: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const imported = store.importEditalFromJSON(text);
        this.renderDisciplinasList();
        this.renderHeader();
        showToast(`Edital "${imported.title}" importado com sucesso (.json).`, "success");
      } catch (err: any) {
        showToast(`Falha na importação: ${err.message}`, "warning");
      }
    };
    reader.readAsText(file);
  }

  // ================= ADIÇÃO UNITÁRIA =================
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

  saveNewDisciplina() {
    const nameInput = document.getElementById("new-disc-name") as HTMLInputElement | null;
    const name = nameInput ? nameInput.value.trim() : "";
    const weightInput = document.getElementById("new-disc-weight") as HTMLInputElement | null;
    const weight = weightInput ? (parseInt(weightInput.value, 10) || 3) : 3;
    const colorSelect = document.getElementById("new-disc-color") as HTMLSelectElement | null;
    const color = colorSelect ? colorSelect.value : "#38BDF8";
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

  printEdital() {
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

    const searchInput = document.getElementById("edital-search-input") as HTMLInputElement | null;
    if (searchInput) {
      searchInput.addEventListener("input", (e: any) => {
        this.searchQuery = e.target.value || "";
        this.renderDisciplinasList();
      });
    }

    const filterStatus = document.getElementById("edital-filter-status") as HTMLSelectElement | null;
    if (filterStatus) {
      filterStatus.addEventListener("change", (e: any) => {
        this.statusFilter = e.target.value || "all";
        this.renderDisciplinasList();
      });
    }

    const expandBtn = document.getElementById("edital-btn-expand-all");
    if (expandBtn) {
      expandBtn.addEventListener("click", () => this.toggleExpandAll());
    }

    const catalogoBtn = document.getElementById("btn-open-catalogo-editais");
    if (catalogoBtn) {
      catalogoBtn.addEventListener("click", () => this.openCatalogoEditaisModal());
    }

    const bulkBtn = document.getElementById("btn-open-bulk-edital-modal");
    if (bulkBtn) {
      bulkBtn.addEventListener("click", () => this.openBulkEditalModal());
    }

    const exportBtn = document.getElementById("btn-export-edital-json");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => this.exportEditalJSON());
    }

    const importBtn = document.getElementById("btn-import-edital-json");
    const importFileInput = document.getElementById("input-import-edital-file") as HTMLInputElement | null;
    if (importBtn && importFileInput) {
      importBtn.addEventListener("click", () => importFileInput.click());
      importFileInput.addEventListener("change", (e: any) => {
        if (e.target.files && e.target.files[0]) {
          this.importEditalJSON(e.target.files[0]);
          e.target.value = "";
        }
      });
    }

    const catalogoFilterSelect = document.getElementById("catalogo-category-filter") as HTMLSelectElement | null;
    if (catalogoFilterSelect) {
      catalogoFilterSelect.addEventListener("change", (e: any) => {
        this.renderCatalogoEditaisGrid(e.target.value);
      });
    }
  }
}

const editalManager = new EditalManager();
export { EditalManager, editalManager };
if (typeof window !== "undefined") {
  (window as any).EditalManager = EditalManager;
  (window as any).editalManager = editalManager;
}
