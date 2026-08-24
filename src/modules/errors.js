// ==========================================================================
// QG DO CONCURSEIRO - CADERNO DE ERROS (ESM)
// ==========================================================================
import { store } from "../services/store.js";
import { showToast } from "../app.js";

// ==========================================================================
// QG DO CONCURSEIRO - CADERNO DE ERROS AUTOMATIZADO
// ==========================================================================

class CadernoErrosManager {
  constructor() {
    this.filterReason = "all";
    this.filterStatus = "all"; // all, pending, resolved
    this.eventsBound = false;
  }

  init() {
    this.renderErrorsList();
    if (!this.eventsBound) {
      this.bindEvents();
      this.eventsBound = true;
    }
  }

  renderErrorsList() {
    const container = document.getElementById("caderno-erros-list");
    const counterBadge = document.getElementById("caderno-total-badge");
    const emptyState = document.getElementById("caderno-empty-state");
    if (!container) return;
    container.innerHTML = "";

    const erros = store.data.cadernoErros || [];
    const allQuestions = store.data.questions || [];

    let filtered = erros.filter(err => {
      if (this.filterReason !== "all" && err.reason !== this.filterReason) return false;
      if (this.filterStatus === "pending" && err.resolved) return false;
      if (this.filterStatus === "resolved" && !err.resolved) return false;
      return true;
    });

    if (counterBadge) {
      const pendingCount = erros.filter(e => !e.resolved).length;
      counterBadge.textContent = `${pendingCount} Erros a Superar`;
    }

    if (filtered.length === 0) {
      if (emptyState) emptyState.classList.remove("hidden");
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    filtered.forEach(err => {
      const q = allQuestions.find(x => x.id === err.questionId) || {
        enunciado: "Questão não encontrada no banco atual.",
        disciplinaName: "Geral",
        assunto: "Revisão",
        banca: "Cebraspe",
        ano: 2024,
        respostaCorreta: "C",
        explicacao: "Sem comentário disponível."
      };

      const card = document.createElement("div");
      card.className = `caderno-card ${err.resolved ? "resolved-error" : ""}`;
      card.id = `caderno-card-${err.id}`;

      card.innerHTML = `
        <div class="caderno-card-header">
          <div class="caderno-tags" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="badge-disc">${q.disciplinaName || "Geral"}</span>
            <span class="badge-assunto">${q.assunto || "Assunto"}</span>
            <select class="form-select" style="padding: 2px 6px; font-size: 0.75rem; width: auto; border-radius: var(--radius-xs); height: 26px; background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border-color);" onchange="cadernoManager.changeReason('${err.id}', this.value)">
              <option value="conteudo" ${err.reason === "conteudo" ? "selected" : ""}>📖 Desconhecimento Teórico</option>
              <option value="pegadinha" ${err.reason === "pegadinha" ? "selected" : ""}>⚠️ Pegadinha da Banca</option>
              <option value="atencao" ${err.reason === "atencao" ? "selected" : ""}>👀 Falta de Atenção</option>
              <option value="desconhecimento" ${err.reason === "desconhecimento" ? "selected" : ""}>❓ Não Lembrava a Regra</option>
            </select>
            <span class="caderno-date"><i class="fa-regular fa-calendar"></i> ${err.date || ""}</span>
          </div>
          <div class="caderno-header-actions">
            <button class="btn btn-sm ${err.resolved ? "btn-success" : "btn-outline-success"}" onclick="cadernoManager.toggleResolved('${err.id}')">
              <i class="fa-solid ${err.resolved ? "fa-circle-check" : "fa-check"}"></i> ${err.resolved ? "Superado" : "Marcar como Dominado"}
            </button>
            <button class="action-btn-icon delete-btn" title="Remover do Caderno" onclick="cadernoManager.removeError('${err.id}')">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>

        <div class="caderno-card-body">
          <p class="caderno-enunciado">${q.enunciado || ""}</p>
          
          <div class="caderno-gabarito-snippet">
            <strong>Gabarito Oficial:</strong> <span class="gabarito-tag">${q.respostaCorreta || ""}</span>
            <p class="gabarito-exp">${(q.explicacao || "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</p>
          </div>

          <div class="caderno-notes-section">
            <label><i class="fa-solid fa-pen-nib"></i> Minha Anotação de Blindagem (Como nunca mais errar isso):</label>
            <div class="notes-input-wrapper">
              <textarea class="caderno-textarea" id="note-${err.id}" placeholder="Escreva aqui a regra ou mnemônico para blindar esse erro...">${err.note || ""}</textarea>
              <button class="btn btn-secondary btn-sm" onclick="cadernoManager.saveNote('${err.id}')">
                <i class="fa-solid fa-floppy-disk"></i> Salvar Anotação
              </button>
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  changeReason(errorId, newReason) {
    store.updateCadernoErro(errorId, { reason: newReason });
    showToast("Motivo do erro atualizado!", "info");
  }

  toggleResolved(errorId) {
    const item = (store.data.cadernoErros || []).find(e => e.id === errorId);
    if (item) {
      store.updateCadernoErro(errorId, { resolved: !item.resolved });
      this.renderErrorsList();
      showToast(item.resolved ? "Erro marcado como Dominado! (+25 XP) 🎯" : "Status alterado para pendente.", "success");
    }
  }

  saveNote(errorId) {
    const textarea = document.getElementById(`note-${errorId}`);
    if (textarea) {
      const note = textarea.value.trim();
      store.updateCadernoErro(errorId, { note });
      showToast("Anotação de blindagem salva com sucesso!", "success");
    }
  }

  removeError(errorId) {
    if (confirm("Deseja remover esta questão do seu Caderno de Erros?")) {
      store.removeCadernoErro(errorId);
      this.renderErrorsList();
      showToast("Item removido do Caderno de Erros.", "info");
    }
  }

  printCaderno() {
    window.print();
  }

  bindEvents() {
    const printBtn = document.getElementById("btn-print-erros");
    if (printBtn) {
      printBtn.addEventListener("click", () => this.printCaderno());
    }

    const reasonFilter = document.getElementById("caderno-filter-reason");
    const statusFilter = document.getElementById("caderno-filter-status");

    if (reasonFilter) {
      reasonFilter.addEventListener("change", (e) => {
        this.filterReason = e.target.value;
        this.renderErrorsList();
      });
    }

    if (statusFilter) {
      statusFilter.addEventListener("change", (e) => {
        this.filterStatus = e.target.value;
        this.renderErrorsList();
      });
    }
  }
}

const cadernoManager = new CadernoErrosManager();
export { CadernoErrosManager, cadernoManager };
if (typeof window !== "undefined") {
  window.CadernoErrosManager = CadernoErrosManager;
  window.cadernoManager = cadernoManager;
}
