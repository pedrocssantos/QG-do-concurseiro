// ==========================================================================
// QG DO CONCURSEIRO - TAF MANAGER (TESTE DE APTIDÃO FÍSICA)
// ==========================================================================
import { store } from "../services/store";
import { DEFAULT_TAF_CRITERIA } from "../data/data";
import { showToast } from "../app";

class TafManager {
  selectedOrgao: "pf" | "prf" | "pc" | "pm";
  selectedGender: "M" | "F";
  eventsBound: boolean;

  constructor() {
    this.selectedOrgao = "pf";
    this.selectedGender = "M";
    this.eventsBound = false;
  }

  init() {
    this.renderCalculator();
    this.renderHistory();
    if (!this.eventsBound) {
      this.bindEvents();
      this.eventsBound = true;
    }
  }

  calculateTestScore(orgaoKey: "pf" | "prf" | "pc" | "pm", gender: "M" | "F", testKey: string, value: number): { score: number; isApto: boolean; min: number; max: number; desc: string } {
    const criteria = (DEFAULT_TAF_CRITERIA as any)[orgaoKey]?.genero?.[gender]?.[testKey];
    if (!criteria) {
      return { score: 0, isApto: true, min: 0, max: 0, desc: "Não aplicável neste edital" };
    }

    const { min, max, pesoMin, pesoMax, tipo } = criteria;
    let score = 0;
    let isApto = false;

    if (tipo === "reps" || tipo === "metros" || tipo === "tempo_maior") {
      if (value < min) {
        score = 0;
        isApto = false;
      } else if (value >= max) {
        score = pesoMax;
        isApto = true;
      } else {
        const ratio = (value - min) / (max - min);
        score = pesoMin + ratio * (pesoMax - pesoMin);
        isApto = true;
      }
    } else if (tipo === "tempo_menor") {
      // Para natação: tempo menor é melhor. Valor <= 0 indica que não foi realizado
      if (value <= 0 || value > min) {
        score = 0;
        isApto = false;
      } else if (value <= max) {
        score = pesoMax;
        isApto = true;
      } else {
        const ratio = (min - value) / (min - max);
        score = pesoMin + ratio * (pesoMax - pesoMin);
        isApto = true;
      }
    }

    return {
      score: Math.round(score * 10) / 10,
      isApto,
      min,
      max,
      desc: criteria.nome
    };
  }

  renderCalculator() {
    const orgaoSelect = document.getElementById("taf-select-orgao") as HTMLSelectElement | null;
    const genderSelect = document.getElementById("taf-select-gender") as HTMLSelectElement | null;

    if (orgaoSelect) this.selectedOrgao = (orgaoSelect.value as any) || "pf";
    if (genderSelect) this.selectedGender = (genderSelect.value as any) || "M";

    const criteria = (DEFAULT_TAF_CRITERIA as any)[this.selectedOrgao]?.genero?.[this.selectedGender];
    if (!criteria) return;

    // Atualiza rótulos e placeholders
    const updateInputCard = (idPrefix: string, testKey: string) => {
      const card = document.getElementById(`taf-card-${idPrefix}`);
      const label = document.getElementById(`taf-label-${idPrefix}`);
      const minBadge = document.getElementById(`taf-min-${idPrefix}`);
      const input = document.getElementById(`taf-input-${idPrefix}`) as HTMLInputElement | null;

      const conf = criteria[testKey];
      if (!conf) {
        if (card) card.classList.add("hidden");
        if (input) input.value = "0";
        return;
      }

      if (card) card.classList.remove("hidden");
      if (label) label.textContent = conf.nome;
      if (minBadge) {
        if (conf.tipo === "tempo_menor") {
          minBadge.textContent = `Mínimo: ≤ ${conf.min}s | Máx: ≤ ${conf.max}s`;
        } else if (conf.tipo === "tempo_maior") {
          minBadge.textContent = `Mínimo: ≥ ${conf.min}s | Máx: ≥ ${conf.max}s`;
        } else if (conf.tipo === "metros") {
          minBadge.textContent = `Mínimo: ≥ ${conf.min}m | Máx: ≥ ${conf.max}m`;
        } else {
          minBadge.textContent = `Mínimo: ≥ ${conf.min} reps | Máx: ≥ ${conf.max} reps`;
        }
      }
    };

    updateInputCard("barra", "barra");
    updateInputCard("corrida", "corrida");
    updateInputCard("abdominal", "abdominal");
    updateInputCard("salto", "salto");
    updateInputCard("natacao", "natacao");

    this.recalculateLive();
  }

  recalculateLive() {
    const valBarra = parseFloat((document.getElementById("taf-input-barra") as HTMLInputElement)?.value) || 0;
    const valCorrida = parseFloat((document.getElementById("taf-input-corrida") as HTMLInputElement)?.value) || 0;
    const valAbdominal = parseFloat((document.getElementById("taf-input-abdominal") as HTMLInputElement)?.value) || 0;
    const valSalto = parseFloat((document.getElementById("taf-input-salto") as HTMLInputElement)?.value) || 0;
    const valNatacao = parseFloat((document.getElementById("taf-input-natacao") as HTMLInputElement)?.value) || 0;

    const resBarra = this.calculateTestScore(this.selectedOrgao, this.selectedGender, "barra", valBarra);
    const resCorrida = this.calculateTestScore(this.selectedOrgao, this.selectedGender, "corrida", valCorrida);
    const resAbdominal = this.calculateTestScore(this.selectedOrgao, this.selectedGender, "abdominal", valAbdominal);
    const resSalto = this.calculateTestScore(this.selectedOrgao, this.selectedGender, "salto", valSalto);
    const resNatacao = this.calculateTestScore(this.selectedOrgao, this.selectedGender, "natacao", valNatacao);

    const criteria = (DEFAULT_TAF_CRITERIA as any)[this.selectedOrgao]?.genero?.[this.selectedGender];

    let totalScore = 0;
    let maxPossible = 0;
    let isAllApto = true;

    const updateScoreBadge = (idPrefix: string, res: any, conf: any) => {
      const badge = document.getElementById(`taf-score-${idPrefix}`);
      if (!badge) return;
      if (!conf) {
        badge.textContent = "N/A";
        badge.className = "taf-status-pill n-a";
        return;
      }

      totalScore += res.score;
      maxPossible += conf.pesoMax || 5;
      if (!res.isApto) isAllApto = false;

      badge.textContent = res.isApto ? `Apto (${res.score} pts)` : `Inapto (${res.score} pts)`;
      badge.className = `taf-status-pill ${res.isApto ? "apto" : "inapto"}`;
    };

    updateScoreBadge("barra", resBarra, criteria?.barra);
    updateScoreBadge("corrida", resCorrida, criteria?.corrida);
    updateScoreBadge("abdominal", resAbdominal, criteria?.abdominal);
    updateScoreBadge("salto", resSalto, criteria?.salto);
    updateScoreBadge("natacao", resNatacao, criteria?.natacao);

    // Linha de corte global por edital
    let globalMinScore = 0;
    if (this.selectedOrgao === "pf") globalMinScore = 10.0;
    else if (this.selectedOrgao === "prf") globalMinScore = 12.0;
    else if (this.selectedOrgao === "pm") globalMinScore = 200.0;
    else if (this.selectedOrgao === "pc") globalMinScore = 10.0;

    const meetsGlobalCut = totalScore >= globalMinScore;
    const isFinalApto = isAllApto && meetsGlobalCut && totalScore > 0;

    // Indicador Geral de Aptidão
    const overallBanner = document.getElementById("taf-overall-result");
    const overallText = document.getElementById("taf-overall-status");
    const overallScoreEl = document.getElementById("taf-overall-score");

    if (overallBanner && overallText && overallScoreEl) {
      if (isFinalApto) {
        overallBanner.className = "taf-banner taf-banner-apto";
        overallText.innerHTML = `<i class="fa-solid fa-circle-check"></i> RESULTADO: <strong>APTO NO TAF</strong>`;
        overallScoreEl.textContent = `Pontuação Geral: ${totalScore.toFixed(1)} / ${maxPossible} pts (Mínimo Geral: ${globalMinScore} pts atingido)`;
      } else {
        overallBanner.className = "taf-banner taf-banner-inapto";
        const reason = !meetsGlobalCut && isAllApto 
          ? `Mínimo global não atingido (${totalScore.toFixed(1)} < ${globalMinScore} pts)` 
          : `Atingir todos os índices mínimos das provas`;
        overallText.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> RESULTADO: <strong>INAPTO (${reason})</strong>`;
        overallScoreEl.textContent = `Pontuação Geral: ${totalScore.toFixed(1)} / ${maxPossible} pts (Corte Global: ${globalMinScore} pts)`;
      }
    }
  }

  saveCurrentTest() {
    const valBarra = parseFloat((document.getElementById("taf-input-barra") as HTMLInputElement)?.value) || 0;
    const valCorrida = parseFloat((document.getElementById("taf-input-corrida") as HTMLInputElement)?.value) || 0;
    const valAbdominal = parseFloat((document.getElementById("taf-input-abdominal") as HTMLInputElement)?.value) || 0;
    const valSalto = parseFloat((document.getElementById("taf-input-salto") as HTMLInputElement)?.value) || 0;
    const valNatacao = parseFloat((document.getElementById("taf-input-natacao") as HTMLInputElement)?.value) || 0;
    const notesInput = document.getElementById("taf-input-notes") as HTMLInputElement | null;
    const notes = notesInput ? notesInput.value.trim() : "";

    const criteria = (DEFAULT_TAF_CRITERIA as any)[this.selectedOrgao]?.genero?.[this.selectedGender];
    const resBarra = this.calculateTestScore(this.selectedOrgao, this.selectedGender, "barra", valBarra);
    const resCorrida = this.calculateTestScore(this.selectedOrgao, this.selectedGender, "corrida", valCorrida);
    const resAbdominal = this.calculateTestScore(this.selectedOrgao, this.selectedGender, "abdominal", valAbdominal);
    const resSalto = this.calculateTestScore(this.selectedOrgao, this.selectedGender, "salto", valSalto);
    const resNatacao = this.calculateTestScore(this.selectedOrgao, this.selectedGender, "natacao", valNatacao);

    let isApto = true;
    let totalScore = 0;

    if (criteria?.barra && !resBarra.isApto) isApto = false;
    if (criteria?.corrida && !resCorrida.isApto) isApto = false;
    if (criteria?.abdominal && !resAbdominal.isApto) isApto = false;
    if (criteria?.salto && !resSalto.isApto) isApto = false;
    if (criteria?.natacao && !resNatacao.isApto) isApto = false;

    totalScore = (criteria?.barra ? resBarra.score : 0) +
                 (criteria?.corrida ? resCorrida.score : 0) +
                 (criteria?.abdominal ? resAbdominal.score : 0) +
                 (criteria?.salto ? resSalto.score : 0) +
                 (criteria?.natacao ? resNatacao.score : 0);

    let globalMinScore = 0;
    if (this.selectedOrgao === "pf") globalMinScore = 10.0;
    else if (this.selectedOrgao === "prf") globalMinScore = 12.0;
    else if (this.selectedOrgao === "pm") globalMinScore = 200.0;
    else if (this.selectedOrgao === "pc") globalMinScore = 10.0;

    if (totalScore < globalMinScore) isApto = false;

    store.addTafRecord({
      gender: this.selectedGender,
      orgao: this.selectedOrgao,
      barra: valBarra,
      corrida: valCorrida,
      abdominal: valAbdominal,
      salto: valSalto,
      natacao: valNatacao,
      totalScore: Math.round(totalScore * 10) / 10,
      isApto,
      notes
    });

    if (notesInput) notesInput.value = "";
    this.renderHistory();
    showToast(isApto ? "Simulado TAF registrado com APTIDÃO! 🏅" : "Simulado TAF registrado. Continue treinando! 💪", isApto ? "success" : "info");
  }

  renderHistory() {
    const list = document.getElementById("taf-history-list");
    const empty = document.getElementById("taf-history-empty");
    if (!list) return;

    const records = store.data.tafRecords || [];
    if (records.length === 0) {
      list.innerHTML = "";
      if (empty) empty.classList.remove("hidden");
      return;
    }

    if (empty) empty.classList.add("hidden");
    list.innerHTML = "";

    records.forEach(rec => {
      const orgaoNome = (DEFAULT_TAF_CRITERIA as any)[rec.orgao]?.nome || rec.orgao.toUpperCase();
      const card = document.createElement("div");
      card.className = `taf-history-card ${rec.isApto ? "apto" : "inapto"}`;
      card.innerHTML = `
        <div class="taf-history-header">
          <div class="taf-history-meta">
            <span class="taf-history-badge ${rec.isApto ? "badge-success" : "badge-danger"}">
              ${rec.isApto ? "APTO" : "INAPTO"}
            </span>
            <strong>${orgaoNome} (${rec.gender === "M" ? "Masculino" : "Feminino"})</strong>
            <span class="taf-history-date"><i class="fa-regular fa-calendar"></i> ${rec.date}</span>
          </div>
          <div class="taf-history-actions">
            <span class="taf-history-score">Pontuação: <strong>${rec.totalScore} pts</strong></span>
            <button class="action-btn-icon delete-btn" title="Excluir Registro" onclick="tafManager.deleteRecord('${rec.id}')">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
        <div class="taf-history-metrics-grid">
          ${rec.barra > 0 ? `<div class="taf-mini-metric"><span>Barra:</span> <strong>${rec.barra} ${rec.gender === 'M' ? 'reps' : 's'}</strong></div>` : ''}
          ${rec.corrida > 0 ? `<div class="taf-mini-metric"><span>Corrida:</span> <strong>${rec.corrida} m</strong></div>` : ''}
          ${rec.abdominal > 0 ? `<div class="taf-mini-metric"><span>Abdominal:</span> <strong>${rec.abdominal} reps</strong></div>` : ''}
          ${rec.salto > 0 ? `<div class="taf-mini-metric"><span>Salto:</span> <strong>${rec.salto} m</strong></div>` : ''}
          ${rec.natacao > 0 ? `<div class="taf-mini-metric"><span>Natação:</span> <strong>${rec.natacao} s</strong></div>` : ''}
        </div>
        ${rec.notes ? `<div class="taf-history-notes"><i class="fa-solid fa-pencil"></i> <em>${rec.notes}</em></div>` : ''}
      `;
      list.appendChild(card);
    });
  }

  deleteRecord(id: string) {
    if (confirm("Deseja excluir este registro de treino TAF?")) {
      store.deleteTafRecord(id);
      this.renderHistory();
      showToast("Registro de TAF removido.", "info");
    }
  }

  bindEvents() {
    const orgaoSelect = document.getElementById("taf-select-orgao");
    const genderSelect = document.getElementById("taf-select-gender");
    const btnSave = document.getElementById("btn-taf-save");

    if (orgaoSelect) orgaoSelect.addEventListener("change", () => this.renderCalculator());
    if (genderSelect) genderSelect.addEventListener("change", () => this.renderCalculator());

    ["barra", "corrida", "abdominal", "salto", "natacao"].forEach(idPrefix => {
      const input = document.getElementById(`taf-input-${idPrefix}`);
      if (input) input.addEventListener("input", () => this.recalculateLive());
    });

    if (btnSave) btnSave.addEventListener("click", () => this.saveCurrentTest());
  }

  destroy() {
    // Cleanup if needed
  }
}

const tafManager = new TafManager();
export { TafManager, tafManager };

if (typeof window !== "undefined") {
  (window as any).TafManager = TafManager;
  (window as any).tafManager = tafManager;
}
