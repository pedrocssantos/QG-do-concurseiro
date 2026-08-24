// ==========================================================================
// QG DO CONCURSEIRO - FLASHCARDS VUE 3 INTEGRATION (TYPESCRIPT)
// ==========================================================================
import { createApp, type App as VueApp } from "vue";
import FlashcardsApp from "../components/FlashcardsApp.vue";
import { store } from "../services/store";
import { showToast, openUpgradeModal } from "../app";

let flashcardsVueApp: VueApp | null = null;

class FlashcardsManager {
  private eventsBound: boolean = false;

  init() {
    const rootEl = document.getElementById("flashcards-vue-root");
    if (rootEl && !flashcardsVueApp) {
      flashcardsVueApp = createApp(FlashcardsApp);
      flashcardsVueApp.mount(rootEl);
      console.log("⚡ Vue 3 Flashcards Pilot montado com sucesso!");
    }

    if (!this.eventsBound) {
      this.bindNewCardModalEvents();
      this.eventsBound = true;
    }
  }

  bindNewCardModalEvents() {
    const btnNew = document.getElementById("fc-btn-new");
    if (btnNew) {
      btnNew.onclick = () => this.openNewCardModal();
    }

    const form = document.getElementById("form-new-flashcard");
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        this.saveNewFlashcard();
      };
    }
  }

  openNewCardModal() {
    const isPro = store.isPro();
    const currentTotal = (store.data.flashcards || []).length;
    if (!isPro && currentTotal >= 20) {
      openUpgradeModal();
      showToast("Limite de 20 flashcards atingido no Plano Gratuito. Torne-se PRO para cards ilimitados! 🚀", "warning");
      return;
    }

    const select = document.getElementById("new-fc-disciplina") as HTMLSelectElement | null;
    if (select) {
      select.innerHTML = "";
      const concurso = store.getActiveConcurso();
      (concurso?.disciplinas || []).forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.id;
        opt.textContent = d.name;
        select.appendChild(opt);
      });
    }

    const modal = document.getElementById("modal-new-flashcard");
    if (modal) modal.classList.remove("hidden");
  }

  saveNewFlashcard() {
    const discSelect = document.getElementById("new-fc-disciplina") as HTMLSelectElement | null;
    const frenteInput = document.getElementById("new-fc-frente") as HTMLTextAreaElement | null;
    const versoInput = document.getElementById("new-fc-verso") as HTMLTextAreaElement | null;

    if (!discSelect || !frenteInput || !versoInput) return;

    const disciplinaId = discSelect.value;
    const frente = frenteInput.value.trim();
    const verso = versoInput.value.trim();

    if (!frente || !verso) {
      showToast("Preencha a frente e o verso do flashcard!", "warning");
      return;
    }

    const newCard = {
      id: `fc-custom-${Date.now()}`,
      disciplinaId,
      frente,
      verso,
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      dueDate: store.getLocalDateString()
    };

    if (!store.data.flashcards) store.data.flashcards = [];
    store.data.flashcards.push(newCard);
    store.save();
    store.addXP(10, "Novo Flashcard Criado (+10 XP) 🧠");

    showToast("Flashcard cadastrado com sucesso!", "success");

    // Limpa campos e fecha modal
    frenteInput.value = "";
    versoInput.value = "";
    document.getElementById("modal-new-flashcard")?.classList.add("hidden");
  }

  selectDeck(deckId: string) {
    // Compatibilidade com chamadas externas
    console.log("Deck selecionado:", deckId);
  }
}

const flashcardsManager = new FlashcardsManager();
export { FlashcardsManager, flashcardsManager };

if (typeof window !== "undefined") {
  (window as any).FlashcardsManager = FlashcardsManager;
  (window as any).flashcardsManager = flashcardsManager;
}
