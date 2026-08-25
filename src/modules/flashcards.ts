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
      this.bindImportModalEvents();
      this.eventsBound = true;
    }
  }

  bindImportModalEvents() {
    const form = document.getElementById("form-import-flashcards");
    const fileInput = document.getElementById("import-fc-file") as HTMLInputElement | null;

    if (fileInput) {
      fileInput.addEventListener("change", (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          const content = evt.target?.result as string;
          const textarea = document.getElementById("import-fc-text") as HTMLTextAreaElement | null;
          if (textarea && content) {
            textarea.value = content;
            showToast(`Arquivo "${file.name}" carregado. Clique em Importar para processar.`, "info");
          }
        };
        reader.readAsText(file);
      });
    }

    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        this.processImportedText();
      };
    }
  }

  processImportedText() {
    const isPro = store.isPro();
    const select = document.getElementById("import-fc-disciplina") as HTMLSelectElement | null;
    const textarea = document.getElementById("import-fc-text") as HTMLTextAreaElement | null;

    if (!select || !textarea) return;

    const rawText = textarea.value.trim();
    if (!rawText) {
      showToast("Insira ou cole o texto com os flashcards para importar!", "warning");
      return;
    }

    const disciplinaId = select.value;
    const disciplinaName = select.options[select.selectedIndex]?.text || "Geral";

    const lines = rawText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    const parsedCards: { frente: string; verso: string }[] = [];

    lines.forEach(line => {
      // Suporta separadores: Tab (\t), Ponto-e-vírgula (;), Barra vertical (|) ou dois pontos duplo (::)
      let parts: string[] = [];
      if (line.includes("\t")) {
        parts = line.split("\t");
      } else if (line.includes("::")) {
        parts = line.split("::");
      } else if (line.includes(";")) {
        parts = line.split(";");
      } else if (line.includes("|")) {
        parts = line.split("|");
      }

      if (parts.length >= 2) {
        const frente = parts[0].trim().replace(/^"|"$/g, "");
        const verso = parts.slice(1).join(" - ").trim().replace(/^"|"$/g, "");
        if (frente && verso) {
          parsedCards.push({ frente, verso });
        }
      }
    });

    if (parsedCards.length === 0) {
      showToast("Não foi possível reconhecer o formato dos cartões. Use separador ';' ou 'TAB' entre a pergunta e a resposta.", "error");
      return;
    }

    if (!isPro && parsedCards.length > 30) {
      openUpgradeModal();
      showToast("No Plano Gratuito você pode importar até 30 cards por vez. Torne-se Caveira PRO para importações ilimitadas!", "warning");
      parsedCards.splice(30);
    }

    const imported = store.importFlashcardsBatch(parsedCards, disciplinaId, disciplinaName);
    showToast(`🎉 Sucesso! ${imported} flashcards foram importados para ${disciplinaName}!`, "success");

    textarea.value = "";
    document.getElementById("modal-import-flashcards")?.close();
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

    const modal = document.getElementById("modal-new-flashcard") as HTMLDialogElement | null;
    if (modal) modal.showModal();
  }

  saveNewFlashcard() {
    const discSelect = document.getElementById("new-fc-disciplina") as HTMLSelectElement | null;
    const frenteInput = (document.getElementById("new-fc-frente") || document.getElementById("new-fc-front")) as HTMLTextAreaElement | null;
    const versoInput = (document.getElementById("new-fc-verso") || document.getElementById("new-fc-back")) as HTMLTextAreaElement | null;

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
    (document.getElementById("modal-new-flashcard") as HTMLDialogElement | null)?.close();
  }

  saveNewCard() {
    return this.saveNewFlashcard();
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
