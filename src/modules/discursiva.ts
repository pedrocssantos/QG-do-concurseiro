// ==========================================================================
// QG DO CONCURSEIRO - DISCURSIVA MANAGER (REDAÇÃO & PROVA DISCURSIVA)
// ==========================================================================
import { store } from "../services/store";
import { DEFAULT_DISCURSIVA_TEMAS } from "../data/data";
import { showToast } from "../app";
import { DiscursivaTema } from "../types";

class DiscursivaManager {
  currentTema: DiscursivaTema | null;
  timerInterval: any;
  secondsRemaining: number;
  isTimerRunning: boolean;
  eventsBound: boolean;

  constructor() {
    this.currentTema = (DEFAULT_DISCURSIVA_TEMAS && DEFAULT_DISCURSIVA_TEMAS[0]) || null;
    this.timerInterval = null;
    this.secondsRemaining = 90 * 60; // 90 minutos padrão
    this.isTimerRunning = false;
    this.eventsBound = false;
  }

  init() {
    this.populateTemasDropdown();
    this.renderCurrentTema();
    this.renderHistory();
    this.updateLineNumbers();
    if (!this.eventsBound) {
      this.bindEvents();
      this.eventsBound = true;
    }
  }

  populateTemasDropdown() {
    const select = document.getElementById("discursiva-tema-select") as HTMLSelectElement | null;
    if (!select) return;

    select.innerHTML = "";
    DEFAULT_DISCURSIVA_TEMAS.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = `[${t.orgao}] ${t.title}`;
      select.appendChild(opt);
    });

    if (this.currentTema) {
      select.value = this.currentTema.id;
    }
  }

  selectTema(temaId: string) {
    const found = DEFAULT_DISCURSIVA_TEMAS.find(t => t.id === temaId);
    if (found) {
      this.currentTema = found;
      this.renderCurrentTema();
      showToast(`Tema carregado: ${found.title}`, "info");
    }
  }

  renderCurrentTema() {
    if (!this.currentTema) return;

    const t = this.currentTema;
    const titleEl = document.getElementById("discursiva-tema-titulo");
    const orgaoEl = document.getElementById("discursiva-tema-orgao");
    const bancaEl = document.getElementById("discursiva-tema-banca");
    const motivadorEl = document.getElementById("discursiva-texto-motivador");
    const topicosList = document.getElementById("discursiva-topicos-list");
    const dicasEl = document.getElementById("discursiva-dicas-estruturais");

    if (titleEl) titleEl.textContent = t.tema;
    if (orgaoEl) orgaoEl.textContent = `${t.orgao} (${t.ano})`;
    if (bancaEl) bancaEl.textContent = t.banca;
    if (motivadorEl) motivadorEl.textContent = t.textoMotivador;
    if (dicasEl) dicasEl.textContent = t.dicasEstruturais;

    if (topicosList) {
      topicosList.innerHTML = "";
      t.topicosObrigatorios.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        topicosList.appendChild(li);
      });
    }
  }

  getEstimatedLines(text: string): number {
    if (!text.trim()) return 0;
    const paragraphs = text.split("\n");
    let total = 0;
    for (const p of paragraphs) {
      if (!p.trim()) {
        total += 1;
        continue;
      }
      // Pauta manuscrita padrão A4: ~72 caracteres por linha
      const linesInParagraph = Math.max(1, Math.ceil(p.length / 72));
      total += linesInParagraph;
    }
    return total;
  }

  updateLineNumbers() {
    const textarea = document.getElementById("discursiva-textarea") as HTMLTextAreaElement | null;
    const gutter = document.getElementById("discursiva-line-gutter");
    const wordCountEl = document.getElementById("discursiva-word-count");
    const lineCountEl = document.getElementById("discursiva-line-count");
    const charCountEl = document.getElementById("discursiva-char-count");

    if (!textarea) return;

    const text = textarea.value;
    const estimatedLines = this.getEstimatedLines(text);
    const lineCount = Math.max(estimatedLines, 1);
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;

    if (gutter) {
      let gutterHtml = "";
      const maxL = Math.max(30, lineCount);
      for (let i = 1; i <= maxL; i++) {
        const isOverLimit = i > 30;
        gutterHtml += `<div class="discursiva-line-number ${isOverLimit ? 'over-limit' : ''}">${String(i).padStart(2, "0")}</div>`;
      }
      gutter.innerHTML = gutterHtml;
    }

    if (lineCountEl) {
      lineCountEl.textContent = `${lineCount} / 30 linhas est.`;
      lineCountEl.className = lineCount > 30 ? "text-danger" : (lineCount >= 25 ? "text-success" : "text-warning");
    }

    if (wordCountEl) wordCountEl.textContent = `${words} palavras`;
    if (charCountEl) charCountEl.textContent = `${chars} caracteres`;
  }

  toggleTimer() {
    const btn = document.getElementById("btn-discursiva-timer-toggle");
    if (this.isTimerRunning) {
      clearInterval(this.timerInterval);
      this.isTimerRunning = false;
      if (btn) btn.innerHTML = `<i class="fa-solid fa-play"></i> Continuar Tempo`;
      showToast("Cronômetro pausado.", "info");
    } else {
      this.isTimerRunning = true;
      if (btn) btn.innerHTML = `<i class="fa-solid fa-pause"></i> Pausar Tempo`;
      this.timerInterval = setInterval(() => {
        if (this.secondsRemaining > 0) {
          this.secondsRemaining--;
          this.renderTimer();
        } else {
          clearInterval(this.timerInterval);
          this.isTimerRunning = false;
          showToast("⏰ Tempo de prova esgotado! Finalize e revise seu rascunho.", "warning");
        }
      }, 1000);
      showToast("Cronômetro de prova iniciado!", "info");
    }
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.isTimerRunning = false;
    this.secondsRemaining = 90 * 60;
    this.renderTimer();
    const btn = document.getElementById("btn-discursiva-timer-toggle");
    if (btn) btn.innerHTML = `<i class="fa-solid fa-play"></i> Iniciar Cronômetro (90 min)`;
  }

  renderTimer() {
    const timerDisplay = document.getElementById("discursiva-timer-display");
    if (!timerDisplay) return;

    const mins = Math.floor(this.secondsRemaining / 60);
    const secs = this.secondsRemaining % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  openEspelhoModal() {
    if (!this.currentTema) return;
    const modal = document.getElementById("modal-discursiva-espelho") as HTMLDialogElement | null;
    const espelhoText = document.getElementById("discursiva-espelho-conteudo");

    if (espelhoText) {
      espelhoText.textContent = this.currentTema.padraoResposta;
    }

    if (modal) modal.showModal();
  }

  finishAndGrade() {
    const textarea = document.getElementById("discursiva-textarea") as HTMLTextAreaElement | null;
    const text = textarea?.value.trim() || "";

    if (!text || text.length < 100) {
      showToast("Escreva ao menos alguns parágrafos antes de salvar e autoavaliar sua redação!", "warning");
      return;
    }

    const lines = text.split("\n").length;
    const modalGrade = document.getElementById("modal-discursiva-avaliacao") as HTMLDialogElement | null;
    if (modalGrade) {
      const elLines = document.getElementById("grade-lines-count");
      if (elLines) elLines.textContent = `${lines} linhas escritas`;
      modalGrade.showModal();
    }
  }

  submitGrade() {
    const textarea = document.getElementById("discursiva-textarea") as HTMLTextAreaElement | null;
    const text = textarea?.value.trim() || "";
    const lines = text.split("\n").length;

    const notaApresentacao = parseFloat((document.getElementById("eval-apresentacao") as HTMLInputElement)?.value) || 2;
    const notaTema = parseFloat((document.getElementById("eval-tema") as HTMLInputElement)?.value) || 8;
    const errosGramatica = parseInt((document.getElementById("eval-erros") as HTMLInputElement)?.value, 10) || 0;

    // Fórmula Cespe: Nota Final = Nota Macro - (2 * Erros / Linhas)
    const penalidade = lines > 0 ? (2 * errosGramatica) / lines : 0;
    const notaFinal = Math.max(0, Math.round((notaApresentacao + notaTema - penalidade) * 100) / 100);

    const attempt = {
      temaId: this.currentTema?.id || "tema-custom",
      temaTitulo: this.currentTema?.title || "Redação Prática",
      texto: text,
      tempoGastoSegundos: (90 * 60) - this.secondsRemaining,
      totalLinhas: lines,
      autoAvaliacao: {
        apresentacao: notaApresentacao,
        tema: notaTema,
        gramatica: errosGramatica,
        total: notaFinal
      }
    };

    store.addDiscursivaAttempt(attempt);

    const modalGrade = document.getElementById("modal-discursiva-avaliacao") as HTMLDialogElement | null;
    if (modalGrade) modalGrade.close();

    showToast(`🎉 Redação salva com sucesso! Nota Final Estimada: ${notaFinal} / 12.0 pontos.`, "success");
    this.renderHistory();
    this.openEspelhoModal();
  }

  renderHistory() {
    const list = document.getElementById("discursiva-history-list");
    const empty = document.getElementById("discursiva-history-empty");
    if (!list) return;

    const attempts = store.data.discursivaAttempts || [];
    if (attempts.length === 0) {
      list.innerHTML = "";
      if (empty) empty.classList.remove("hidden");
      return;
    }

    if (empty) empty.classList.add("hidden");
    list.innerHTML = "";

    attempts.forEach(att => {
      const card = document.createElement("div");
      card.className = "discursiva-history-card";
      card.innerHTML = `
        <div class="discursiva-history-header">
          <div>
            <strong>${att.temaTitulo}</strong>
            <span class="discursiva-history-date"><i class="fa-regular fa-calendar"></i> ${att.data || 'Hoje'}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="discursiva-history-score-badge">
              Nota: <strong>${att.autoAvaliacao?.total || 0} pts</strong>
            </div>
            <button class="action-btn-icon delete-btn" title="Excluir Redação" onclick="discursivaManager.deleteAttempt('${att.id}')">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
        <p class="discursiva-history-preview">${(att.texto || '').substring(0, 180)}...</p>
        <div class="discursiva-history-footer">
          <span><i class="fa-solid fa-align-left"></i> ${att.totalLinhas} linhas</span>
          <span><i class="fa-solid fa-clock"></i> ${Math.round(att.tempoGastoSegundos / 60)} min gastos</span>
        </div>
      `;
      list.appendChild(card);
    });
  }

  deleteAttempt(id: string) {
    if (confirm("Tem certeza que deseja remover esta redação do histórico?")) {
      store.deleteDiscursivaAttempt(id);
      this.renderHistory();
      showToast("Redação removida do histórico.", "info");
    }
  }

  bindEvents() {
    const select = document.getElementById("discursiva-tema-select");
    const textarea = document.getElementById("discursiva-textarea");
    const btnTimer = document.getElementById("btn-discursiva-timer-toggle");
    const btnResetTimer = document.getElementById("btn-discursiva-timer-reset");
    const btnEspelho = document.getElementById("btn-ver-espelho");
    const btnFinish = document.getElementById("btn-finalizar-redacao");
    const btnConfirmGrade = document.getElementById("btn-confirm-grade");

    if (select) {
      select.addEventListener("change", (e: any) => this.selectTema(e.target.value));
    }

    if (textarea) {
      textarea.addEventListener("input", () => this.updateLineNumbers());
    }

    if (btnTimer) btnTimer.addEventListener("click", () => this.toggleTimer());
    if (btnResetTimer) btnResetTimer.addEventListener("click", () => this.resetTimer());
    if (btnEspelho) btnEspelho.addEventListener("click", () => this.openEspelhoModal());
    if (btnFinish) btnFinish.addEventListener("click", () => this.finishAndGrade());
    if (btnConfirmGrade) btnConfirmGrade.addEventListener("click", () => this.submitGrade());
  }

  destroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.isTimerRunning = false;
  }
}

const discursivaManager = new DiscursivaManager();
export { DiscursivaManager, discursivaManager };

if (typeof window !== "undefined") {
  (window as any).DiscursivaManager = DiscursivaManager;
  (window as any).discursivaManager = discursivaManager;
}
