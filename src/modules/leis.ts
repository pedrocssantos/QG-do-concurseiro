// ==========================================================================
// QG DO CONCURSEIRO - VADE MECUM & LEGISLAÇÃO SECA TÁTICA (ESM)
// ==========================================================================
import { store } from "../services/store";
import { DEFAULT_LEIS } from "../data/data";
import { showToast } from "../app";
import { LeiItem, LeiArtigo } from "../types";

class LeisManager {
  selectedLeiId: string;
  searchTerm: string;
  filterOnlyUnread: boolean;
  eventsBound: boolean;

  constructor() {
    this.selectedLeiId = (DEFAULT_LEIS && DEFAULT_LEIS[0]?.id) || "lei-cf88";
    this.searchTerm = "";
    this.filterOnlyUnread = false;
    this.eventsBound = false;
  }

  init() {
    this.populateLeiTabs();
    this.renderArtigosList();
    this.updateStats();
    if (!this.eventsBound) {
      this.bindEvents();
      this.eventsBound = true;
    }
  }

  populateLeiTabs() {
    const container = document.getElementById("leis-diplomas-tabs");
    if (!container) return;

    container.innerHTML = "";
    DEFAULT_LEIS.forEach(lei => {
      const btn = document.createElement("button");
      btn.className = `lei-tab-btn ${lei.id === this.selectedLeiId ? "active" : ""}`;
      btn.innerHTML = `<strong>${lei.sigla}</strong> <span>${lei.categoria}</span>`;
      btn.onclick = () => {
        this.selectedLeiId = lei.id;
        document.querySelectorAll(".lei-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.renderArtigosList();
        this.updateStats();
      };
      container.appendChild(btn);
    });
  }

  renderArtigosList() {
    const container = document.getElementById("leis-artigos-container");
    const titleEl = document.getElementById("lei-active-title");
    const descEl = document.getElementById("lei-active-desc");

    if (!container) return;

    const currentLei = DEFAULT_LEIS.find(l => l.id === this.selectedLeiId) || DEFAULT_LEIS[0];
    if (!currentLei) return;

    if (titleEl) titleEl.textContent = `${currentLei.sigla} - ${currentLei.nome}`;
    if (descEl) descEl.textContent = currentLei.descricao;

    let artigos = currentLei.artigos || [];

    // Filtro por termo de busca
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      artigos = artigos.filter(a => 
        a.numero.toLowerCase().includes(term) ||
        a.caput.toLowerCase().includes(term) ||
        (a.tema && a.tema.toLowerCase().includes(term)) ||
        (a.incisos && a.incisos.some(inc => inc.toLowerCase().includes(term)))
      );
    }

    // Filtro apenas não lidos
    if (this.filterOnlyUnread) {
      artigos = artigos.filter(a => !store.isLeiArtigoLido(a.id));
    }

    container.innerHTML = "";

    if (artigos.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <i class="fa-solid fa-scale-balanced fa-2x"></i>
          <p>Nenhum artigo encontrado para o filtro atual.</p>
        </div>
      `;
      return;
    }

    artigos.forEach(art => {
      const isLido = store.isLeiArtigoLido(art.id);
      const card = document.createElement("div");
      card.className = `lei-artigo-card ${isLido ? "artigo-lido" : ""} ${art.destaque ? "artigo-destaque" : ""}`;
      card.id = `artigo-card-${art.id}`;

      let incisosHtml = "";
      if (art.incisos && art.incisos.length > 0) {
        incisosHtml = `<ul class="lei-incisos-list">` + 
          art.incisos.map(inc => `<li>${inc}</li>`).join("") + 
        `</ul>`;
      }

      card.innerHTML = `
        <div class="lei-artigo-header">
          <div class="lei-artigo-meta">
            <span class="lei-badge-num">${art.numero}</span>
            ${art.tema ? `<span class="lei-badge-tema">${art.tema}</span>` : ""}
            ${art.destaque ? `<span class="lei-badge-destaque" title="Artigo com altíssima incidência em provas"><i class="fa-solid fa-fire"></i> Alto Rendimento</span>` : ""}
          </div>
          <div class="lei-artigo-actions">
            <button class="btn btn-sm ${isLido ? "btn-success" : "btn-outline-success"}" onclick="leisManager.toggleLido('${art.id}')">
              <i class="fa-solid ${isLido ? "fa-circle-check" : "fa-check"}"></i> ${isLido ? "Lido" : "Marcar Lido"}
            </button>
            <button class="btn btn-sm btn-outline-primary" title="Gerar Flashcard deste Artigo" onclick="leisManager.createFlashcardFromArtigo('${art.id}')">
              <i class="fa-solid fa-bolt"></i> + Flashcard
            </button>
          </div>
        </div>

        <div class="lei-artigo-body">
          <p class="lei-caput-text">${art.caput}</p>
          ${incisosHtml}
        </div>
      `;

      container.appendChild(card);
    });
  }

  toggleLido(artigoId: string) {
    const novoStatus = store.toggleLeiArtigoLido(artigoId);
    this.renderArtigosList();
    this.updateStats();
    showToast(novoStatus ? "Artigo marcado como LIDO (+10 XP)!" : "Artigo desmarcado.", novoStatus ? "success" : "info");
  }

  createFlashcardFromArtigo(artigoId: string) {
    const currentLei = DEFAULT_LEIS.find(l => l.id === this.selectedLeiId);
    const art = currentLei?.artigos.find(a => a.id === artigoId);
    if (!art) return;

    const frente = `[${currentLei?.sigla}] O que dispõe o ${art.numero} (${art.tema || "Legislação"})?`;
    let verso = art.caput;
    if (art.incisos && art.incisos.length > 0) {
      verso += "\n\n" + art.incisos.join("\n");
    }

    store.importFlashcardsBatch(
      [{ frente, verso }],
      "pf-geral",
      currentLei?.categoria || "Legislação"
    );

    showToast(`⚡ Flashcard criado para o ${art.numero} no baralho de ${currentLei?.categoria}!`, "success");
  }

  updateStats() {
    const progressEl = document.getElementById("lei-progress-percent");
    const countEl = document.getElementById("lei-progress-count");

    let totalArtigos = 0;
    let lidos = 0;

    DEFAULT_LEIS.forEach(lei => {
      (lei.artigos || []).forEach(art => {
        totalArtigos++;
        if (store.isLeiArtigoLido(art.id)) lidos++;
      });
    });

    const percent = totalArtigos > 0 ? Math.round((lidos / totalArtigos) * 100) : 0;
    if (progressEl) progressEl.textContent = `${percent}%`;
    if (countEl) countEl.textContent = `${lidos} de ${totalArtigos} artigos dominados`;
  }

  bindEvents() {
    const searchInput = document.getElementById("lei-search-input") as HTMLInputElement | null;
    const filterUnread = document.getElementById("lei-filter-unread") as HTMLInputElement | null;

    if (searchInput) {
      searchInput.addEventListener("input", (e: any) => {
        this.searchTerm = e.target.value.trim();
        this.renderArtigosList();
      });
    }

    if (filterUnread) {
      filterUnread.addEventListener("change", (e: any) => {
        this.filterOnlyUnread = e.target.checked;
        this.renderArtigosList();
      });
    }
  }

  destroy() {
    // Cleanup
  }
}

const leisManager = new LeisManager();
export { LeisManager, leisManager };

if (typeof window !== "undefined") {
  (window as any).LeisManager = LeisManager;
  (window as any).leisManager = leisManager;
}
