// ==========================================================================
// QG DO CONCURSEIRO - FLASHCARDS MANAGER (ESM)
// ==========================================================================
import { store } from "../services/store.js";
import { showToast, openUpgradeModal } from "../app.js";

// ==========================================================================
// QG DO CONCURSEIRO - FLASHCARDS SRS (SM-2)
// ==========================================================================

class FlashcardsManager {
  constructor() {
    this.currentDeckId = "all";
    this.dueCards = [];
    this.currentIndex = 0;
    this.isFlipped = false;
    this.eventsBound = false;
  }

  init() {
    this.renderDeckSelector();
    this.loadCards();
    if (!this.eventsBound) {
      this.bindEvents();
      this.eventsBound = true;
    }
  }

  renderDeckSelector() {
    const container = document.getElementById("flashcards-deck-list");
    if (!container) return;
    container.innerHTML = "";

    const today = store.getLocalDateString();
    const all = store.data.flashcards || [];

    // Chip "Todos os Decks"
    const allDueCount = all.filter(c => c.dueDate <= today).length;
    const allChip = document.createElement("button");
    allChip.className = `deck-chip ${this.currentDeckId === "all" ? "active" : ""}`;
    allChip.innerHTML = `
      <span>Todos os Decks</span>
      <span class="deck-chip-badge ${allDueCount > 0 ? "has-due" : ""}">${allDueCount}</span>
    `;
    allChip.onclick = () => this.selectDeck("all");
    container.appendChild(allChip);

    // Mapeia disciplinas únicas existentes
    const decksMap = {};
    all.forEach(c => {
      if (!decksMap[c.disciplinaId]) {
        decksMap[c.disciplinaId] = {
          id: c.disciplinaId,
          name: c.disciplinaName || "Geral",
          dueCount: 0,
          total: 0
        };
      }
      decksMap[c.disciplinaId].total += 1;
      if (c.dueDate <= today) {
        decksMap[c.disciplinaId].dueCount += 1;
      }
    });

    Object.values(decksMap).forEach(deck => {
      const chip = document.createElement("button");
      chip.className = `deck-chip ${this.currentDeckId === deck.id ? "active" : ""}`;
      chip.innerHTML = `
        <span>${deck.name}</span>
        <span class="deck-chip-badge ${deck.dueCount > 0 ? "has-due" : ""}">${deck.dueCount}</span>
      `;
      chip.onclick = () => this.selectDeck(deck.id);
      container.appendChild(chip);
    });
  }

  selectDeck(deckId) {
    this.currentDeckId = deckId;
    this.renderDeckSelector();
    this.loadCards();
  }

  loadCards(forceAll = false) {
    const today = store.getLocalDateString();
    const all = store.data.flashcards || [];

    let filtered = all;
    if (this.currentDeckId !== "all") {
      filtered = all.filter(c => c.disciplinaId === this.currentDeckId);
    }

    if (forceAll) {
      this.dueCards = filtered;
    } else {
      this.dueCards = filtered.filter(c => c.dueDate <= today);
    }

    this.currentIndex = 0;
    this.isFlipped = false;
    this.renderCurrentCard();
  }

  bindEvents() {
    const cardElement = document.getElementById("flashcard-3d-box");
    const flipBtn = document.getElementById("fc-btn-flip");
    const deleteBtn = document.getElementById("fc-btn-delete");
    const newCardBtn = document.getElementById("fc-btn-new");

    if (cardElement) {
      cardElement.addEventListener("click", () => this.toggleFlip());
    }
    if (flipBtn) {
      flipBtn.addEventListener("click", () => this.toggleFlip());
    }
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => this.deleteCurrentCard());
    }
    if (newCardBtn) {
      newCardBtn.addEventListener("click", () => this.openNewCardModal());
    }

    // Botões de Classificação SM-2
    const gradeButtons = document.querySelectorAll(".fc-grade-btn");
    gradeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const grade = parseInt(btn.dataset.grade, 10);
        this.rateCard(grade);
      });
    });

    // Atalho de Teclado: Barra de Espaço para virar cartão
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" && window.location.hash === "#flashcards") {
        const targetTag = e.target ? e.target.tagName.toLowerCase() : "";
        if (targetTag !== "input" && targetTag !== "textarea") {
          e.preventDefault();
          this.toggleFlip();
        }
      }
    });
  }

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
    const cardInner = document.getElementById("flashcard-inner");
    const gradeActions = document.getElementById("flashcard-grade-actions");

    if (cardInner) {
      if (this.isFlipped) {
        cardInner.classList.add("flipped");
        if (gradeActions) gradeActions.classList.remove("hidden");
      } else {
        cardInner.classList.remove("flipped");
        if (gradeActions) gradeActions.classList.add("hidden");
      }
    }
  }

  renderCurrentCard() {
    const frontText = document.getElementById("fc-front-text");
    const backText = document.getElementById("fc-back-text");
    const deckTag = document.getElementById("fc-tag-deck");
    const counter = document.getElementById("fc-counter-text");
    const cardInner = document.getElementById("flashcard-inner");
    const gradeActions = document.getElementById("flashcard-grade-actions");
    const emptyState = document.getElementById("flashcard-empty-state");
    const mainBox = document.getElementById("flashcard-main-container");

    if (!mainBox) return;

    if (!this.dueCards || this.dueCards.length === 0) {
      mainBox.classList.add("hidden");
      if (emptyState) {
        emptyState.classList.remove("hidden");
        emptyState.innerHTML = `
          <i class="fa-solid fa-shield-halved empty-state-icon text-success"></i>
          <h3>Todas as revisões deste deck estão em dia!</h3>
          <p style="margin-bottom: 16px; color: var(--text-muted);">Você completou todos os flashcards previstos para hoje pela Repetição Espaçada.</p>
          <button class="btn btn-secondary btn-sm" onclick="flashcardsManager.loadCards(true)">
            <i class="fa-solid fa-arrows-rotate"></i> Praticar Todos os Cards Novamente (Modo Livre)
          </button>
        `;
      }
      return;
    }

    mainBox.classList.remove("hidden");
    if (emptyState) emptyState.classList.add("hidden");

    this.isFlipped = false;
    if (cardInner) cardInner.classList.remove("flipped");
    if (gradeActions) gradeActions.classList.add("hidden");

    const card = this.dueCards[this.currentIndex];
    if (card) {
      const f = card.frente || "";
      const v = card.verso || "";
      if (frontText) frontText.innerHTML = f.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      if (backText) backText.innerHTML = v.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
      if (deckTag) deckTag.textContent = card.disciplinaName || "Geral";
      if (counter) counter.textContent = `Card ${this.currentIndex + 1} de ${this.dueCards.length}`;
    }
  }

  rateCard(grade) {
    if (!this.dueCards || this.dueCards.length === 0) return;
    const card = this.dueCards[this.currentIndex];
    if (!card) return;

    // Registra no algoritmo SM-2 do Store
    store.reviewFlashcard(card.id, grade);

    // Avança para o próximo
    this.currentIndex++;
    if (this.currentIndex >= this.dueCards.length) {
      showToast("🎉 Parabéns! Você concluiu a rodada de Flashcards deste deck!", "success");
      this.loadCards();
      this.renderDeckSelector();
    } else {
      this.renderCurrentCard();
    }
  }

  openNewCardModal() {
    const modal = document.getElementById("modal-new-flashcard");
    const discSelect = document.getElementById("new-fc-disciplina");
    if (!modal || !discSelect) return;

    const concurso = store.getActiveConcurso();
    discSelect.innerHTML = "";
    (concurso?.disciplinas || []).forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = d.name;
      discSelect.appendChild(opt);
    });

    const frontIn = document.getElementById("new-fc-front");
    const backIn = document.getElementById("new-fc-back");
    if (frontIn) frontIn.value = "";
    if (backIn) backIn.value = "";

    modal.classList.remove("hidden");
  }

  saveNewCard() {
    const discSelect = document.getElementById("new-fc-disciplina");
    const front = document.getElementById("new-fc-front")?.value.trim();
    const back = document.getElementById("new-fc-back")?.value.trim();

    if (!front || !back) {
      showToast("Preencha a frente e o verso do cartão!", "warning");
      return;
    }

    if (!store.isPro() && (store.data.flashcards || []).length >= 30) {
      showToast("Limite de 30 flashcards no Plano Gratuito atingido. Desbloqueie ilimitados no Plano PRO!", "warning");
      if (typeof openUpgradeModal === "function") openUpgradeModal();
      return;
    }

    if (!discSelect || discSelect.selectedIndex < 0) {
      showToast("Cadastre uma disciplina no seu edital primeiro!", "warning");
      return;
    }

    const discName = discSelect.options[discSelect.selectedIndex]?.text || "Geral";

    store.addFlashcard({
      disciplinaId: discSelect.value,
      disciplinaName: discName,
      frente: front,
      verso: back
    });

    const modal = document.getElementById("modal-new-flashcard");
    if (modal) modal.classList.add("hidden");

    showToast("Flashcard criado com sucesso!", "success");
    this.renderDeckSelector();
    this.loadCards();
  }

  deleteCurrentCard() {
    if (!this.dueCards || this.dueCards.length === 0) return;
    const card = this.dueCards[this.currentIndex];
    if (!card) return;

    if (confirm("Deseja realmente excluir este flashcard?")) {
      store.deleteFlashcard(card.id);
      showToast("Flashcard excluído com sucesso!", "info");
      this.renderDeckSelector();
      this.loadCards();
    }
  }
}

const flashcardsManager = new FlashcardsManager();
export { FlashcardsManager, flashcardsManager };
if (typeof window !== "undefined") {
  window.FlashcardsManager = FlashcardsManager;
  window.flashcardsManager = flashcardsManager;
}
