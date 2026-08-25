// ==========================================================================
// QG DO CONCURSEIRO - QUESTIONS MANAGER (ESM)
// ==========================================================================
import { store } from "../services/store";
import { audio } from "../services/audio";
import { showToast, openUpgradeModal } from "../app";

// ==========================================================================
// QG DO CONCURSEIRO - MOTOR DE BANCO DE QUESTÕES E SIMULADOS
// ==========================================================================

function sanitizeHTML(html: string): string {
  if (!html) return "";
  return String(html).replace(/<\/?([a-zA-Z0-9\-]+)([^>]*)>/g, (match, tag, attrs) => {
    const t = tag.toLowerCase();
    const allowed = ['strong', 'em', 'br', 'p', 'code', 'ul', 'li', 'ol'];
    
    if (t === 'script' || /on[a-z]+\s*=/i.test(attrs)) {
      return match.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    
    if (allowed.includes(t)) {
      return match.startsWith('</') ? `</${t}>` : `<${t}>`;
    }
    
    return '';
  });
}

class QuestionsManager {
  constructor() {
    this._searchDebounce = null;
    this.filteredQuestions = [];
    this.currentIndex = 0;
    this.selectedOption = null;
    this.isAnswered = false;
    this.simuladoMode = false;
    this.simuladoTimer = null;
    this.simuladoSecondsLeft = 0;
    this.simuladoTotalSeconds = 0;
    this.simuladoAnswers = {}; // { questionId: selectedOption }
    this.filters = {
      disciplinaId: "all",
      banca: "all",
      ano: "all",
      status: "all", // all, nao_feitas, erradas
      search: ""
    };
    this.eventsBound = false;
  }

  init() {
    this.populateFilterDropdowns();
    if (!this.simuladoMode) {
      this.applyFilters();
    } else {
      this.renderCurrentQuestion();
      this.renderSimuladoGrid();
    }
    if (!this.eventsBound) {
      this.bindEvents();
      this.eventsBound = true;
    }
  }

  populateFilterDropdowns() {
    const discSelect = document.getElementById("q-filter-disciplina");
    const bancaSelect = document.getElementById("q-filter-banca");
    const anoSelect = document.getElementById("q-filter-ano");
    if (!discSelect) return;

    const concurso = store.getActiveConcurso();
    discSelect.innerHTML = `<option value="all">Todas as Disciplinas</option>`;
    ((concurso && concurso.disciplinas) || []).forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = d.name;
      discSelect.appendChild(opt);
    });
    if (this.filters.disciplinaId) {
      discSelect.value = this.filters.disciplinaId;
    }

    if (bancaSelect) {
      const bancas = [...new Set((store.data.questions || []).map(q => q.banca).filter(Boolean))];
      bancaSelect.innerHTML = `<option value="all">Todas as Bancas</option>`;
      bancas.forEach(b => {
        const opt = document.createElement("option");
        opt.value = b;
        opt.textContent = b;
        bancaSelect.appendChild(opt);
      });
      if (this.filters.banca) {
        bancaSelect.value = this.filters.banca;
      }
    }

    if (anoSelect) {
      const anos = [...new Set((store.data.questions || []).map(q => q.ano).filter(Boolean))].sort((a, b) => b - a);
      anoSelect.innerHTML = `<option value="all">Todos os Anos</option>`;
      anos.forEach(a => {
        const opt = document.createElement("option");
        opt.value = a.toString();
        opt.textContent = `Ano ${a}`;
        anoSelect.appendChild(opt);
      });
      if (this.filters.ano) {
        anoSelect.value = this.filters.ano;
      }
    }
  }

  setDisciplinaFilter(disciplinaId) {
    this.filters.disciplinaId = disciplinaId;
    const filterSelect = document.getElementById("q-filter-disciplina");
    if (filterSelect) {
      filterSelect.value = disciplinaId;
    }
    this.applyFilters();
  }

  startTreinoCadernoErros() {
    const errorIds = (store.data.cadernoErros || []).filter(e => !e.resolved).map(e => e.questionId);
    if (errorIds.length === 0) {
      showToast("Você não possui erros pendentes no momento! Parabéns!", "success");
      return;
    }
    const all = store.data.questions || [];
    this.filteredQuestions = all.filter(q => errorIds.includes(q.id));
    if (this.filteredQuestions.length === 0) {
      showToast("As questões do caderno não foram encontradas no banco ativo.", "warning");
      return;
    }
    this.currentIndex = 0;
    this.isAnswered = false;
    this.selectedOption = null;
    this.simuladoMode = false;
    this.renderCurrentQuestion();
    showToast(`🎯 Modo Treino de Erros ativado: ${this.filteredQuestions.length} questões para superar!`, "info");
  }

  bindEvents() {
    const discSelect = document.getElementById("q-filter-disciplina");
    const bancaSelect = document.getElementById("q-filter-banca");
    const anoSelect = document.getElementById("q-filter-ano");
    const statusSelect = document.getElementById("q-filter-status");
    const searchInput = document.getElementById("q-filter-search");
    const prevBtn = document.getElementById("q-btn-prev");
    const nextBtn = document.getElementById("q-btn-next");
    const submitBtn = document.getElementById("q-btn-submit");
    const startSimuladoBtn = document.getElementById("btn-start-simulado");
    const finishSimuladoBtn = document.getElementById("btn-finish-simulado");

    if (discSelect) discSelect.addEventListener("change", (e) => { this.filters.disciplinaId = e.target.value; this.applyFilters(); });
    if (bancaSelect) bancaSelect.addEventListener("change", (e) => { this.filters.banca = e.target.value; this.applyFilters(); });
    if (anoSelect) anoSelect.addEventListener("change", (e) => { this.filters.ano = e.target.value; this.applyFilters(); });
    if (statusSelect) statusSelect.addEventListener("change", (e) => { this.filters.status = e.target.value; this.applyFilters(); });
    if (searchInput) searchInput.addEventListener("input", (e) => {
      this.filters.search = e.target.value.toLowerCase();
      if (this._searchDebounce) clearTimeout(this._searchDebounce);
      this._searchDebounce = setTimeout(() => this.applyFilters(), 300);
    });

    if (prevBtn) prevBtn.addEventListener("click", () => this.navigate(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => this.navigate(1));
    if (submitBtn) submitBtn.addEventListener("click", () => this.submitAnswer());

    if (startSimuladoBtn) startSimuladoBtn.addEventListener("click", () => this.openSimuladoConfigModal());
    if (finishSimuladoBtn) finishSimuladoBtn.addEventListener("click", () => this.finishSimulado());
    this.bindSimuladoConfigHandlers();
  }

  applyFilters() {
    const all = store.data.questions || [];
    const history = store.data.questionHistory || [];
    const activeConcurso = store.getActiveConcurso();

    this.filteredQuestions = all.filter(q => {
      // Filtro por disciplina
      if (this.filters.disciplinaId !== "all") {
        const selectedDisc = ((activeConcurso && activeConcurso.disciplinas) || []).find(d => d.id === this.filters.disciplinaId);
        const matchId = q.disciplinaId === this.filters.disciplinaId;
        const matchName = selectedDisc && q.disciplinaName && (
          q.disciplinaName.toLowerCase().includes(selectedDisc.name.toLowerCase()) ||
          selectedDisc.name.toLowerCase().includes(q.disciplinaName.toLowerCase())
        );
        if (!matchId && !matchName) return false;
      }
      // Filtro por banca
      if (this.filters.banca !== "all" && q.banca !== this.filters.banca) {
        return false;
      }
      // Filtro por ano
      if (this.filters.ano !== "all" && (!q.ano || q.ano.toString() !== this.filters.ano)) {
        return false;
      }
      // Filtro por busca de texto
      if (this.filters.search) {
        const text = `${q.enunciado || ""} ${q.assunto || ""} ${q.disciplinaName || ""}`.toLowerCase();
        if (!text.includes(this.filters.search)) return false;
      }
      // Filtro por status
      if (this.filters.status === "nao_feitas") {
        return !history.some(h => h.questionId === q.id);
      }
      if (this.filters.status === "erradas") {
        const errorHistory = history.filter(h => h.questionId === q.id);
        const last = errorHistory[errorHistory.length - 1];
        return last && !last.isCorrect;
      }
      return true;
    });

    this.currentIndex = 0;
    this.selectedOption = null;
    this.isAnswered = false;
    this.renderCurrentQuestion();
    this.renderQuestionsCounter();
  }

  renderCurrentQuestion() {
    const container = document.getElementById("question-display-container");
    const emptyState = document.getElementById("questions-empty-state");
    if (!container) return;

    if (!this.filteredQuestions || this.filteredQuestions.length === 0) {
      container.classList.add("hidden");
      if (emptyState) emptyState.classList.remove("hidden");
      this.renderQuestionsCounter();
      return;
    }

    container.classList.remove("hidden");
    if (emptyState) emptyState.classList.add("hidden");

    const q = this.filteredQuestions[this.currentIndex];
    this.selectedOption = this.simuladoMode ? (this.simuladoAnswers[q.id] || null) : null;
    this.isAnswered = false;

    // Cabeçalho da Questão
    const tagDisc = document.getElementById("q-tag-disciplina");
    const tagAssunto = document.getElementById("q-tag-assunto");
    const tagBanca = document.getElementById("q-tag-banca");
    const tagOrgao = document.getElementById("q-tag-orgao");
    const enunciadoEl = document.getElementById("q-enunciado");

    if (tagDisc) tagDisc.textContent = q.disciplinaName || "Geral";
    if (tagAssunto) tagAssunto.textContent = q.assunto || "Tópico Geral";
    if (tagBanca) tagBanca.textContent = `${q.banca || "Cebraspe"} • ${q.ano || "2024"}`;
    if (tagOrgao) tagOrgao.textContent = `${q.orgao || "Concurso"} - ${q.cargo || "Oficial"}`;
    if (enunciadoEl) enunciadoEl.textContent = q.enunciado || "";

    // Renderiza Alternativas
    const optionsContainer = document.getElementById("q-alternativas-container");
    if (optionsContainer) {
      optionsContainer.innerHTML = "";
      (q.alternativas || []).forEach(alt => {
        const btn = document.createElement("button");
        btn.className = `option-item ${this.selectedOption === alt.id ? "selected" : ""}`;
        btn.dataset.optId = alt.id;
        btn.innerHTML = `
          <span class="option-badge">${sanitizeHTML(String(alt.id))}</span>
          <span class="option-text">${sanitizeHTML(String(alt.text))}</span>
        `;

        btn.addEventListener("click", () => {
          if (this.isAnswered && !this.simuladoMode) return;
          this.selectOption(alt.id);
        });

        optionsContainer.appendChild(btn);
      });
    }

    // Oculta explicação até responder
    const feedbackBox = document.getElementById("q-feedback-box");
    if (feedbackBox) feedbackBox.classList.add("hidden");

    const submitBtn = document.getElementById("q-btn-submit");
    if (submitBtn) {
      submitBtn.disabled = this.simuladoMode;
      submitBtn.textContent = "Responder Questão";
    }

    this.renderQuestionsCounter();
    this.questionStartTime = Date.now();
  }

  selectOption(optId) {
    if (this.simuladoMode) {
      const q = this.filteredQuestions[this.currentIndex];
      if (this.selectedOption === optId) {
        this.selectedOption = null;
        delete this.simuladoAnswers[q.id];
      } else {
        this.selectedOption = optId;
        this.simuladoAnswers[q.id] = optId;
      }
      this.renderSimuladoGrid();
    } else {
      this.selectedOption = optId;
    }

    const options = document.querySelectorAll("#q-alternativas-container .option-item");
    options.forEach(opt => {
      if (opt.dataset.optId === this.selectedOption) {
        opt.classList.add("selected");
      } else {
        opt.classList.remove("selected");
      }
    });
  }

  submitAnswer() {
    if (!this.selectedOption) {
      showToast("Selecione uma alternativa antes de responder!", "warning");
      return;
    }
    if (this.isAnswered) return;

    const q = this.filteredQuestions[this.currentIndex];
    const isCorrect = this.selectedOption === q.respostaCorreta;
    this.isAnswered = true;

    // Efeito sonoro
    if (typeof audio !== "undefined") {
      if (isCorrect && typeof audio.playSuccessTone === "function") audio.playSuccessTone();
      else if (!isCorrect && typeof audio.playErrorTone === "function") audio.playErrorTone();
    }

    const timeSpent = this.questionStartTime 
      ? Math.max(2, Math.round((Date.now() - this.questionStartTime) / 1000))
      : 45;

    // Registra no Store
    store.recordQuestionAnswer({
      questionId: q.id,
      disciplinaId: q.disciplinaId,
      disciplinaName: q.disciplinaName,
      assunto: q.assunto,
      selectedOption: this.selectedOption,
      isCorrect: isCorrect,
      timeSpentSeconds: timeSpent
    });

    // Destaca as opções
    const options = document.querySelectorAll("#q-alternativas-container .option-item");
    options.forEach(opt => {
      const optId = opt.dataset.optId;
      if (optId === q.respostaCorreta) {
        opt.classList.add("correct");
      } else if (optId === this.selectedOption && !isCorrect) {
        opt.classList.add("incorrect");
      }
    });

    // Mostra caixa de explicação e gabarito
    const feedbackBox = document.getElementById("q-feedback-box");
    const feedbackStatus = document.getElementById("q-feedback-status");
    const feedbackText = document.getElementById("q-feedback-text");

    if (feedbackBox) {
      feedbackBox.classList.remove("hidden");
      if (feedbackStatus) {
        feedbackStatus.innerHTML = isCorrect
          ? `<div class="badge-success-feedback"><i class="fa-solid fa-circle-check"></i> RESPOSTA CORRETA (+15 XP)</div>`
          : `<div class="badge-error-feedback"><i class="fa-solid fa-circle-xmark"></i> RESPOSTA INCORRETA (Enviado para o Caderno de Erros)</div>`;
      }
      if (feedbackText) {
        feedbackText.innerHTML = sanitizeHTML((q.explicacao || "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"));
      }
    }

    const submitBtn = document.getElementById("q-btn-submit");
    if (submitBtn) submitBtn.disabled = true;
  }

  navigate(direction) {
    const newIdx = this.currentIndex + direction;
    if (newIdx >= 0 && newIdx < this.filteredQuestions.length) {
      this.currentIndex = newIdx;
      this.renderCurrentQuestion();
    }
  }

  renderQuestionsCounter() {
    const counter = document.getElementById("q-counter-text");
    if (counter) {
      if (!this.filteredQuestions || this.filteredQuestions.length === 0) {
        counter.textContent = "0 questões encontradas";
      } else {
        counter.textContent = `Questão ${this.currentIndex + 1} de ${this.filteredQuestions.length}`;
      }
    }

    const prevBtn = document.getElementById("q-btn-prev");
    const nextBtn = document.getElementById("q-btn-next");
    if (prevBtn) prevBtn.disabled = this.currentIndex === 0 || !this.filteredQuestions || this.filteredQuestions.length === 0;
    if (nextBtn) nextBtn.disabled = !this.filteredQuestions || this.currentIndex >= this.filteredQuestions.length - 1 || this.filteredQuestions.length === 0;
  }

  // ================= MODO SIMULADO CRONOMETRADO =================
  openSimuladoConfigModal() {
    const modal = document.getElementById("modal-config-simulado");
    if (!modal) return;

    const isPro = store.isPro();
    const weeklySimulados = store.getSimuladosThisWeek();

    let usageBanner = document.getElementById("sim-free-usage-banner");
    const modalBody = modal.querySelector(".modal-body");
    if (!isPro && modalBody) {
      if (!usageBanner) {
        usageBanner = document.createElement("div");
        usageBanner.id = "sim-free-usage-banner";
        usageBanner.style.cssText = "font-size: 0.78rem; color: var(--color-warning); background: rgba(245, 158, 11, 0.08); padding: 8px 12px; border-radius: var(--radius-xs); margin-bottom: 14px; border: 1px solid rgba(245, 158, 11, 0.25); display: flex; justify-content: space-between; align-items: center;";
        modalBody.prepend(usageBanner);
      }
      usageBanner.innerHTML = `
        <span><i class="fa-solid fa-crown text-warning"></i> Plano Gratuito: <strong>${weeklySimulados}/3 simulados</strong> esta semana</span>
        <button type="button" onclick="if(typeof openUpgradeModal===function)openUpgradeModal();" class="btn btn-primary btn-xs" style="padding: 2px 8px; font-size: 0.72rem;">Seja PRO</button>
      `;
    } else if (usageBanner) {
      usageBanner.remove();
    }

    // Popula checkboxes das disciplinas
    const container = document.getElementById("sim-disciplinas-checkboxes");
    const concurso = store.getActiveConcurso();

    if (container) {
      container.innerHTML = "";
      ((concurso && concurso.disciplinas) || []).forEach(d => {
        const item = document.createElement("label");
        item.style.display = "flex";
        item.style.alignItems = "center";
        item.style.gap = "6px";
        item.style.fontSize = "0.8rem";
        item.style.cursor = "pointer";
        item.innerHTML = `
          <input type="checkbox" class="custom-chk-sm sim-disc-chk" value="${sanitizeHTML(String(d.id))}" checked>
          <span>${sanitizeHTML(String(d.name))}</span>
        `;
        container.appendChild(item);
      });
    }

    modal.showModal();
  }

  bindSimuladoConfigHandlers() {
    document.querySelectorAll(".sim-btn-count").forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll(".sim-btn-count").forEach(b => {
          b.classList.remove("active", "btn-primary");
          b.classList.add("btn-secondary");
        });
        btn.classList.remove("btn-secondary");
        btn.classList.add("active", "btn-primary");
      };
    });

    document.querySelectorAll(".sim-btn-time").forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll(".sim-btn-time").forEach(b => {
          b.classList.remove("active", "btn-primary");
          b.classList.add("btn-secondary");
        });
        btn.classList.remove("btn-secondary");
        btn.classList.add("active", "btn-primary");
      };
    });

    const selectAllBtn = document.getElementById("sim-select-all-disciplinas");
    if (selectAllBtn) {
      selectAllBtn.onclick = () => {
        const chks = document.querySelectorAll(".sim-disc-chk");
        const allChecked = Array.from(chks).every(c => c.checked);
        chks.forEach(c => c.checked = !allChecked);
        selectAllBtn.textContent = allChecked ? "Selecionar Todas" : "Desmarcar Todas";
      };
    }

    const confirmBtn = document.getElementById("btn-confirm-start-simulado");
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        if (!store.isPro() && store.getSimuladosThisWeek() >= 3) {
          showToast("Você atingiu o limite de 3 simulados semanais no Plano Gratuito. Assine o PRO para simulados ilimitados!", "warning");
          const modal = document.getElementById("modal-config-simulado");
          if (modal) modal.close();
          if (typeof openUpgradeModal === "function") openUpgradeModal();
          return;
        }

        const activeCountBtn = document.querySelector(".sim-btn-count.active");
        const count = activeCountBtn ? parseInt(activeCountBtn.dataset.count, 10) : 10;

        const activeTimeBtn = document.querySelector(".sim-btn-time.active");
        const minutes = activeTimeBtn ? parseInt(activeTimeBtn.dataset.time, 10) : 30;

        const scoringModel = document.getElementById("sim-scoring-model")?.value || "cespe";
        const selectedDiscIds = Array.from(document.querySelectorAll(".sim-disc-chk:checked")).map(c => c.value);

        const modal = document.getElementById("modal-config-simulado");
        if (modal) modal.close();

        this.startSimulado(count, minutes * 60, selectedDiscIds, scoringModel);
      };
    }
  }

  startSimulado(questionCount = 10, totalSeconds = 1800, selectedDiscIds = [], scoringModel = "cespe") {
    if (this.simuladoTimer) {
      clearInterval(this.simuladoTimer);
      this.simuladoTimer = null;
    }

    this.simuladoMode = true;
    this.simuladoAnswers = {};
    this.simuladoSecondsLeft = totalSeconds;
    this.simuladoTotalSeconds = totalSeconds;
    this.simuladoStartTime = Date.now();
    this.simuladoScoringModel = scoringModel;

    let baseQuestions = store.data.questions || [];
    if (selectedDiscIds.length > 0) {
      baseQuestions = baseQuestions.filter(q => selectedDiscIds.includes(q.disciplinaId));
    }
    if (baseQuestions.length === 0) {
      baseQuestions = store.data.questions || [];
    }

    this.filteredQuestions = [...baseQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, questionCount);

    this.currentIndex = 0;

    const simuladoBar = document.getElementById("simulado-active-bar");
    const filtersBar = document.getElementById("questions-filter-toolbar");
    if (simuladoBar) simuladoBar.classList.remove("hidden");
    if (filtersBar) filtersBar.classList.add("hidden");

    this.simuladoTimer = setInterval(() => {
      this.simuladoSecondsLeft--;
      const timeDisplay = document.getElementById("simulado-timer-text");
      if (timeDisplay) {
        const mins = Math.max(0, Math.floor(this.simuladoSecondsLeft / 60));
        const secs = Math.max(0, this.simuladoSecondsLeft % 60);
        timeDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
      }

      if (this.simuladoSecondsLeft <= 0) {
        clearInterval(this.simuladoTimer);
        this.simuladoTimer = null;
        showToast("Tempo esgotado para o Simulado!", "warning");
        this.finishSimulado();
      }
    }, 1000);

    this.renderCurrentQuestion();
    this.renderSimuladoGrid();
    showToast(`Simulado iniciado! ${this.filteredQuestions.length} itens • ${Math.round(totalSeconds / 60)} min.`, "info");
  }

  renderSimuladoGrid() {
    const grid = document.getElementById("simulado-questions-grid");
    if (!grid) return;
    grid.innerHTML = "";

    this.filteredQuestions.forEach((q, idx) => {
      const btn = document.createElement("button");
      const isAnswered = Boolean(this.simuladoAnswers[q.id]);
      btn.className = `simulado-grid-btn ${idx === this.currentIndex ? "current" : ""} ${isAnswered ? "answered" : ""}`;
      btn.textContent = `${idx + 1}`;
      btn.addEventListener("click", () => {
        this.currentIndex = idx;
        this.renderCurrentQuestion();
        this.renderSimuladoGrid();
      });
      grid.appendChild(btn);
    });
  }

  finishSimulado() {
    if (this.simuladoTimer) {
      clearInterval(this.simuladoTimer);
      this.simuladoTimer = null;
    }
    this.simuladoMode = false;

    const elapsedSeconds = this.simuladoStartTime
      ? Math.max(10, Math.round((Date.now() - this.simuladoStartTime) / 1000))
      : 300;
    const avgTimePerQuestion = Math.max(5, Math.round(elapsedSeconds / (this.filteredQuestions.length || 1)));

    let correct = 0;
    let incorrect = 0;
    let blank = 0;

    this.filteredQuestions.forEach(q => {
      const userAns = this.simuladoAnswers[q.id];
      if (!userAns) {
        blank++;
      } else if (userAns === q.respostaCorreta) {
        correct++;
        store.recordQuestionAnswer({
          questionId: q.id,
          disciplinaId: q.disciplinaId,
          disciplinaName: q.disciplinaName,
          assunto: q.assunto,
          selectedOption: userAns,
          isCorrect: true,
          timeSpentSeconds: avgTimePerQuestion
        });
      } else {
        incorrect++;
        store.recordQuestionAnswer({
          questionId: q.id,
          disciplinaId: q.disciplinaId,
          disciplinaName: q.disciplinaName,
          assunto: q.assunto,
          selectedOption: userAns,
          isCorrect: false,
          timeSpentSeconds: avgTimePerQuestion
        });
      }
    });

    const isCespe = this.simuladoScoringModel !== "standard";
    const netScore = isCespe ? Math.max(0, correct - incorrect) : correct;
    const accuracy = this.filteredQuestions.length > 0 ? Math.round((correct / this.filteredQuestions.length) * 100) : 0;

    const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    const activeConcurso = store.getActiveConcurso();
    const primaryDiscId = this.filteredQuestions[0]?.disciplinaId || (activeConcurso?.disciplinas && activeConcurso.disciplinas[0]?.id) || "pf-port";

    store.addStudySession({
      concursoId: activeConcurso?.id || "pf-agente",
      disciplinaId: primaryDiscId,
      durationMinutes,
      type: "simulado",
      accuracy,
      notes: `Simulado (${correct}C/${incorrect}E/${blank}B - ${accuracy}% - Nota Líquida: ${netScore})`
    });

    const simuladoBar = document.getElementById("simulado-active-bar");
    const filtersBar = document.getElementById("questions-filter-toolbar");
    if (simuladoBar) simuladoBar.classList.add("hidden");
    if (filtersBar) filtersBar.classList.remove("hidden");

    this.showSimuladoResultModal({
      total: this.filteredQuestions.length,
      correct,
      incorrect,
      blank,
      netScore,
      accuracy,
      isCespe
    });

    this.applyFilters();
  }

  showSimuladoResultModal(stats) {
    const modal = document.getElementById("modal-simulado-result");
    if (!modal) return;

    const totalEl = document.getElementById("res-simulado-total");
    const correctEl = document.getElementById("res-simulado-correct");
    const incEl = document.getElementById("res-simulado-incorrect");
    const blankEl = document.getElementById("res-simulado-blank");
    const netEl = document.getElementById("res-simulado-net");
    const accEl = document.getElementById("res-simulado-accuracy");

    if (totalEl) totalEl.textContent = stats.total;
    if (correctEl) correctEl.textContent = stats.correct;
    if (incEl) incEl.textContent = stats.incorrect;
    if (blankEl) blankEl.textContent = stats.blank;
    if (netEl) netEl.textContent = stats.netScore;
    if (accEl) accEl.textContent = `${stats.accuracy}%`;

    const labelEl = document.getElementById("res-simulado-net-label");
    if (labelEl) {
      labelEl.textContent = stats.isCespe ? "Nota Líquida (Cespe):" : "Pontuação Total:";
    }

    const xpBonus = 100;
    store.addXP(xpBonus, "Bônus de Simulado Concluído! 🎓");

    modal.showModal();
  }
}

const questionsManager = new QuestionsManager();
export { QuestionsManager, questionsManager };
if (typeof window !== "undefined") {
  window.QuestionsManager = QuestionsManager;
  window.questionsManager = questionsManager;
}
