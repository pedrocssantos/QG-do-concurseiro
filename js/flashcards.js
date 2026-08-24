// ==========================================================================
// FOCO NO PAPIRO - SISTEMA DE FLASHCARDS COM REPETIÇÃO ESPAÇADA (SRS)
// ==========================================================================

class FlashcardsManager {
  constructor() {
    this.currentDeckId = "all";
    this.dueCards = [];
    this.currentIndex = 0;
    this.isFlipped = false;
  }

  init() {
    this.renderDeckSelector();
    this.loadCards();
    this.bindEvents();
  }

  renderDeckSelector() {
    const container = document.getElementById("flashcards-deck-list");
    if (!container) return;
    container.innerHTML = "";

    const cards = store.data.flashcards;
    const concurso = store.getActiveConcurso();
    const today = new Date().toISOString().split("T")[0];

    // Deck Geral
    const totalAll = cards.length;
    const dueAll = cards.filter(c => c.dueDate <= today).length;

    const allDeckBtn = document.createElement("button");
    allDeckBtn.className = `deck-chip ${this.currentDeckId === "all" ? "active" : ""}`;
    allDeckBtn.innerHTML = `
      <span class="deck-name"><i class="fa-solid fa-layer-group"></i> Todos os Decks</span>
      <span class="deck-badge ${dueAll > 0 ? "badge-due" : ""}">${dueAll} pendentes</span>
    `;
    allDeckBtn.addEventListener("click", () => {
      this.currentDeckId = "all";
      this.renderDeckSelector();
      this.loadCards();
    });
    container.appendChild(allDeckBtn);

    // Decks por Disciplina
    (concurso.disciplinas || []).forEach(d => {
      const deckCards = cards.filter(c => c.disciplinaId === d.id);
      const dueCardsCount = deckCards.filter(c => c.dueDate <= today).length;

      const deckBtn = document.createElement("button");
      deckBtn.className = `deck-chip ${this.currentDeckId === d.id ? "active" : ""}`;
      deckBtn.innerHTML = `
        <span class="deck-name"><i class="fa-solid ${d.icon || "fa-book"}" style="color: ${d.color}"></i> ${d.name}</span>
        <span class="deck-badge ${dueCardsCount > 0 ? "badge-due" : ""}">${dueCardsCount}</span>
      `;
      deckBtn.addEventListener("click", () => {
        this.currentDeckId = d.id;
        this.renderDeckSelector();
        this.loadCards();
      });
      container.appendChild(deckBtn);
    });
  }

  loadCards() {
    const today = new Date().toISOString().split("T")[0];
    const all = store.data.flashcards;

    let filtered = all;
    if (this.currentDeckId !== "all") {
      filtered = all.filter(c => c.disciplinaId === this.currentDeckId);
    }

    // Prioriza os cards que estão vencidos para hoje
    this.dueCards = filtered.filter(c => c.dueDate <= today);
    if (this.dueCards.length === 0) {
      this.dueCards = filtered; // Se não houver pendentes, mostra todos do deck para revisão livre
    }

    this.currentIndex = 0;
    this.isFlipped = false;
    this.renderCurrentCard();
  }

  bindEvents() {
    const cardElement = document.getElementById("flashcard-3d-box");
    const flipBtn = document.getElementById("fc-btn-flip");
    const newCardBtn = document.getElementById("fc-btn-new");

    if (cardElement) {
      cardElement.addEventListener("click", () => this.toggleFlip());
    }
    if (flipBtn) {
      flipBtn.addEventListener("click", () => this.toggleFlip());
    }
    if (newCardBtn) {
      newCardBtn.addEventListener("click", () => this.openNewCardModal());
    }

    // Botões de Classificação SM-2
    const gradeButtons = document.querySelectorAll(".fc-grade-btn");
    gradeButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const grade = parseInt(btn.dataset.grade, 10);
        this.rateCard(grade);
      });
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

    if (this.dueCards.length === 0) {
      mainBox.classList.add("hidden");
      if (emptyState) emptyState.classList.remove("hidden");
      return;
    }

    mainBox.classList.remove("hidden");
    if (emptyState) emptyState.classList.add("hidden");

    this.isFlipped = false;
    if (cardInner) cardInner.classList.remove("flipped");
    if (gradeActions) gradeActions.classList.add("hidden");

    const card = this.dueCards[this.currentIndex];
    if (frontText) frontText.innerHTML = card.frente.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    if (backText) backText.innerHTML = card.verso.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
    if (deckTag) deckTag.textContent = card.disciplinaName || "Geral";
    if (counter) counter.textContent = `Card ${this.currentIndex + 1} de ${this.dueCards.length}`;
  }

  rateCard(grade) {
    if (this.dueCards.length === 0) return;
    const card = this.dueCards[this.currentIndex];

    // Registra no algoritmo SM-2 do Store
    store.reviewFlashcard(card.id, grade);

    // Avança para o próximo
    this.currentIndex++;
    if (this.currentIndex >= this.dueCards.length) {
      showToast("🎉 Parabéns! Você finalizou a rodada de Flashcards deste deck!", "success");
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
    (concurso.disciplinas || []).forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = d.name;
      discSelect.appendChild(opt);
    });

    document.getElementById("new-fc-front").value = "";
    document.getElementById("new-fc-back").value = "";

    modal.classList.remove("hidden");
  }

  saveNewCard() {
    const discSelect = document.getElementById("new-fc-disciplina");
    const front = document.getElementById("new-fc-front").value.trim();
    const back = document.getElementById("new-fc-back").value.trim();

    if (!front || !back) {
      showToast("Preencha a frente e o verso do cartão!", "warning");
      return;
    }

    const discName = discSelect.options[discSelect.selectedIndex].text;

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
}

const flashcardsManager = new FlashcardsManager();
