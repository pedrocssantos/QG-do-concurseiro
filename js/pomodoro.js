// ==========================================================================
// FOCO NO PAPIRO - POMODORO, CRONÔMETRO LÍQUIDO E SINTETIZADOR DE ÁUDIO
// ==========================================================================

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.ambientSource = null;
    this.ambientGain = null;
    this.isPlayingAmbient = false;
  }

  initContext() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {
      console.warn("Audio Context init warning:", e);
    }
  }

  // Efeito sonoro: Bip Suave de Conclusão / Alerta de Pomodoro
  playCompletionChime() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Acorde Maior Vitorioso)

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.85);
      });
    } catch (e) {
      console.warn("Áudio não pôde ser reproduzido:", e);
    }
  }

  // Efeito sonoro: Acerto de Questão
  playSuccessTone() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  // Efeito sonoro: Erro de Questão
  playErrorTone() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.25);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  // Gerador de Som Ambiente Sintetizado (Ruído Rosa / Chuva Suave)
  startAmbientNoise(type = "rain") {
    try {
      this.stopAmbientNoise();
      if (type === "none") return;
      this.initContext();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Gera Ruído Rosa / Browniano (simulando chuva ou ruído de foco)
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      this.ambientSource = this.ctx.createBufferSource();
      this.ambientSource.buffer = buffer;
      this.ambientSource.loop = true;

      // Filtro passa-baixa para som aveludado e relaxante
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(type === "white" ? 2500 : 700, this.ctx.currentTime);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      this.ambientSource.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientSource.start(0);
      this.isPlayingAmbient = true;
    } catch (e) {
      console.warn("Erro ao iniciar som ambiente:", e);
    }
  }

  stopAmbientNoise() {
    if (this.ambientSource) {
      try {
        this.ambientSource.stop();
        this.ambientSource.disconnect();
      } catch (e) {}
      this.ambientSource = null;
      this.isPlayingAmbient = false;
    }
  }
}

const audio = new AudioEngine();

// ================= POMODORO & TIMER CONTROLLER =================
class PomodoroController {
  constructor() {
    this.mode = "pomodoro_25"; // pomodoro_25, pomodoro_50, stopwatch
    this.state = "idle"; // idle, running, paused, break
    this.secondsRemaining = 25 * 60;
    this.secondsElapsed = 0;
    this.totalSessionSeconds = 0;
    this.timerInterval = null;
    this.selectedDisciplinaId = null;
    this.selectedTopicoId = null;
    this.sessionType = "teoria"; // teoria, questoes, revisao
    this.isZenMode = false;
    this.eventsBound = false;
  }

  init() {
    this.updateSubjectDropdown();
    this.render();
    if (!this.eventsBound) {
      this.bindEvents();
      this.eventsBound = true;
    }
  }

  updateSubjectDropdown() {
    const select = document.getElementById("pomo-subject-select");
    if (!select) return;

    const concurso = store.getActiveConcurso();
    select.innerHTML = `<option value="">-- Selecione a Matéria do Papiro --</option>`;
    
    (concurso.disciplinas || []).forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = `${d.name} (Peso ${d.weight})`;
      select.appendChild(opt);
    });

    if (concurso.disciplinas && concurso.disciplinas.length > 0) {
      this.selectedDisciplinaId = concurso.disciplinas[0].id;
      select.value = this.selectedDisciplinaId;
    }
  }

  bindEvents() {
    const startBtn = document.getElementById("pomo-btn-start");
    const pauseBtn = document.getElementById("pomo-btn-pause");
    const resetBtn = document.getElementById("pomo-btn-reset");
    const modeBtns = document.querySelectorAll(".pomo-mode-btn");
    const zenBtn = document.getElementById("pomo-btn-zen");
    const exitZenBtn = document.getElementById("zen-btn-exit");
    const subjectSelect = document.getElementById("pomo-subject-select");
    const soundSelect = document.getElementById("pomo-sound-select");

    if (startBtn) startBtn.addEventListener("click", () => this.start());
    if (pauseBtn) pauseBtn.addEventListener("click", () => this.pause());
    if (resetBtn) resetBtn.addEventListener("click", () => this.reset());
    if (zenBtn) zenBtn.addEventListener("click", () => this.toggleZenMode(true));
    if (exitZenBtn) exitZenBtn.addEventListener("click", () => this.toggleZenMode(false));

    if (subjectSelect) {
      subjectSelect.addEventListener("change", (e) => {
        this.selectedDisciplinaId = e.target.value;
      });
    }

    if (soundSelect) {
      soundSelect.addEventListener("change", (e) => {
        const val = e.target.value;
        if (this.state === "running") {
          audio.startAmbientNoise(val);
        }
      });
    }

    modeBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        modeBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.setMode(btn.dataset.mode);
      });
    });
  }

  setMode(mode) {
    if (this.state === "running" || this.state === "break") {
      if (!confirm("O cronômetro está rodando. Deseja reiniciar no novo modo?")) return;
    }
    this.reset(false);
    this.mode = mode;
    if (mode === "pomodoro_25") {
      this.secondsRemaining = 25 * 60;
    } else if (mode === "pomodoro_50") {
      this.secondsRemaining = 50 * 60;
    } else if (mode === "stopwatch") {
      this.secondsElapsed = 0;
      this.secondsRemaining = 0;
    }
    this.render();
  }

  start(isBreak = false) {
    if (this.state === "running" && !isBreak) return;
    try {
      audio.initContext();
    } catch (e) {}

    const soundSelect = document.getElementById("pomo-sound-select");
    if (soundSelect && soundSelect.value !== "none" && !isBreak) {
      try {
        audio.startAmbientNoise(soundSelect.value);
      } catch (e) {}
    }

    this.state = isBreak ? "break" : "running";
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.tick(), 1000);
    this.render();
  }

  pause() {
    if (this.state !== "running" && this.state !== "break") return;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.state = "paused";
    try {
      audio.stopAmbientNoise();
    } catch (e) {}
    this.render();
  }

  tick() {
    if (this.mode === "stopwatch") {
      this.secondsElapsed++;
      this.totalSessionSeconds++;
    } else {
      if (this.secondsRemaining > 0) {
        this.secondsRemaining--;
        if (this.state !== "break") {
          this.totalSessionSeconds++;
        }
      } else {
        this.completeInterval();
      }
    }
    this.render();
  }

  completeInterval() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = null;
    try {
      audio.stopAmbientNoise();
      audio.playCompletionChime();
    } catch (e) {}

    if (this.state === "running") {
      // Salva sessão de estudo líquida no Store
      const minutesStudied = Math.max(1, Math.round(this.totalSessionSeconds / 60));
      this.saveCurrentSession(minutesStudied);

      if (this.mode === "pomodoro_25" || this.mode === "pomodoro_50") {
        this.state = "break";
        this.secondsRemaining = this.mode === "pomodoro_25" ? 5 * 60 : 10 * 60;
        this.totalSessionSeconds = 0;
        showToast("Intervalo merecido! Descanse a mente por alguns minutos.", "info");
        this.start(true); // Inicia o intervalo de descanso
      } else {
        this.reset(false);
      }
    } else if (this.state === "break") {
      this.state = "idle";
      this.totalSessionSeconds = 0;
      this.secondsRemaining = this.mode === "pomodoro_25" ? 25 * 60 : 50 * 60;
      showToast("Pausa concluída! Pronto para o próximo bloco de estudo?", "success");
      this.render();
    }
  }

  reset(askToSave = true) {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = null;
    try {
      audio.stopAmbientNoise();
    } catch (e) {}

    if (askToSave && this.totalSessionSeconds >= 60 && this.state !== "break") {
      const minutesStudied = Math.round(this.totalSessionSeconds / 60);
      if (confirm(`Deseja registrar os ${minutesStudied} minutos estudados no seu histórico?`)) {
        this.saveCurrentSession(minutesStudied);
      }
    }

    this.state = "idle";
    this.totalSessionSeconds = 0;

    if (this.mode === "pomodoro_25") this.secondsRemaining = 25 * 60;
    else if (this.mode === "pomodoro_50") this.secondsRemaining = 50 * 60;
    else if (this.mode === "stopwatch") this.secondsElapsed = 0;

    this.render();
  }

  saveCurrentSession(minutes) {
    if (!this.selectedDisciplinaId) {
      const active = store.getActiveConcurso();
      if (active.disciplinas && active.disciplinas[0]) {
        this.selectedDisciplinaId = active.disciplinas[0].id;
      }
    }

    const activeConcurso = store.getActiveConcurso();
    store.addStudySession({
      concursoId: activeConcurso.id,
      disciplinaId: this.selectedDisciplinaId || (activeConcurso.disciplinas[0]?.id || "pf-port"),
      topicoId: this.selectedTopicoId || null,
      durationMinutes: minutes,
      type: "teoria",
      notes: `Sessão de Foco (${minutes} min)`
    });

    const disc = (activeConcurso.disciplinas || []).find(d => d.id === this.selectedDisciplinaId);
    const discName = disc ? disc.name : "Geral";

    this.showPostPomodoroModal(minutes, discName, this.selectedDisciplinaId);
  }

  showPostPomodoroModal(minutes, discName, disciplinaId) {
    const modal = document.getElementById("modal-post-pomodoro");
    if (!modal) return;

    document.getElementById("post-pomo-minutes").textContent = `${minutes} minutos`;
    document.getElementById("post-pomo-disc").textContent = discName;
    modal.classList.remove("hidden");

    // Botão Praticar Questões
    const btnQuestions = document.getElementById("post-pomo-btn-questoes");
    if (btnQuestions) {
      btnQuestions.onclick = () => {
        modal.classList.add("hidden");
        window.location.hash = "#questoes";
        setTimeout(() => {
          const filterDisc = document.getElementById("filter-disciplina");
          if (filterDisc) {
            filterDisc.value = disciplinaId;
            questionsManager.filterDisciplina = disciplinaId;
            questionsManager.applyFilters();
          }
          showToast(`Filtrando questões de ${discName}!`, "info");
        }, 150);
      };
    }

    // Botão Revisar Flashcards
    const btnCards = document.getElementById("post-pomo-btn-flashcards");
    if (btnCards) {
      btnCards.onclick = () => {
        modal.classList.add("hidden");
        window.location.hash = "#flashcards";
        setTimeout(() => {
          flashcardsManager.selectDeck(disciplinaId);
          showToast(`Deck selecionado: Flashcards de ${discName}!`, "info");
        }, 150);
      };
    }

    // Botão Iniciar Descanso
    const btnBreak = document.getElementById("post-pomo-btn-intervalo");
    if (btnBreak) {
      btnBreak.onclick = () => {
        modal.classList.add("hidden");
        this.state = "break";
        this.secondsRemaining = 5 * 60;
        this.start(true);
      };
    }
  }

  toggleZenMode(active) {
    this.isZenMode = active;
    const zenOverlay = document.getElementById("zen-mode-overlay");
    if (zenOverlay) {
      if (active) {
        zenOverlay.classList.remove("hidden");
        document.documentElement.requestFullscreen?.().catch(() => {});
      } else {
        zenOverlay.classList.add("hidden");
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
      }
    }
  }

  formatTime(seconds) {
    const s = Math.max(0, Math.floor(Number(seconds) || 0));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  render() {
    const timeDisplay = document.getElementById("pomo-time-display");
    const zenTimeDisplay = document.getElementById("zen-time-display");
    const progressRing = document.getElementById("pomo-progress-circle");
    const statusText = document.getElementById("pomo-status-badge");

    let currentSecs = this.mode === "stopwatch" ? this.secondsElapsed : this.secondsRemaining;
    const formatted = this.formatTime(currentSecs);

    if (timeDisplay) timeDisplay.textContent = formatted;
    if (zenTimeDisplay) zenTimeDisplay.textContent = formatted;

    // Atualiza o título da aba do navegador se estiver rodando
    if (this.state === "running" || this.state === "break") {
      document.title = `(${formatted}) QG do Concurseiro`;
    }

    if (progressRing) {
      const circumference = 2 * Math.PI * 130; // 816.814
      if (this.mode === "stopwatch") {
        const secInMin = this.secondsElapsed % 60;
        progressRing.style.strokeDashoffset = (circumference * (1 - secInMin / 60)).toString();
      } else {
        const totalSecs = this.state === "break"
          ? (this.mode === "pomodoro_25" ? 5 * 60 : 10 * 60)
          : (this.mode === "pomodoro_25" ? 25 * 60 : 50 * 60);
        const percent = Math.max(0, Math.min(1, this.secondsRemaining / totalSecs));
        progressRing.style.strokeDashoffset = (circumference * (1 - percent)).toString();
      }
    }

    if (statusText) {
      if (this.state === "break") {
        statusText.textContent = "☕ INTERVALO";
        statusText.className = "pomo-badge status-break";
      } else if (this.state === "running") {
        statusText.textContent = "⚡ EM FOCO";
        statusText.className = "pomo-badge status-running";
      } else if (this.state === "paused") {
        statusText.textContent = "⏸️ PAUSADO";
        statusText.className = "pomo-badge status-paused";
      } else {
        statusText.textContent = "🎯 PRONTO PARA INICIAR";
        statusText.className = "pomo-badge status-idle";
      }
    }

    this.renderControls();
  }

  renderControls() {
    const startBtn = document.getElementById("pomo-btn-start");
    const pauseBtn = document.getElementById("pomo-btn-pause");

    if (startBtn && pauseBtn) {
      if (this.state === "running" || this.state === "break") {
        startBtn.classList.add("hidden");
        pauseBtn.classList.remove("hidden");
      } else {
        startBtn.classList.remove("hidden");
        pauseBtn.classList.add("hidden");
      }
    }
  }
}

const pomodoro = new PomodoroController();
const pomodoroManager = pomodoro;

document.addEventListener("DOMContentLoaded", () => {
  if (typeof pomodoro !== "undefined") {
    pomodoro.init();
  }
});
