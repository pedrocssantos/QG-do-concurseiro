// ==========================================================================
// QG DO CONCURSEIRO - POMODORO CONTROLLER (ESM)
// ==========================================================================
import { store } from "../services/store";
import { audio } from "../services/audio";
import { questionsManager } from "./questions";
import { flashcardsManager } from "./flashcards";
import { showToast } from "../app";

class PomodoroController {
  mode: string;
  state: string;
  lastActiveState: string;
  secondsRemaining: number;
  secondsElapsed: number;
  totalSessionSeconds: number;
  timerInterval: any;
  lastTickTime: number | null;
  selectedDisciplinaId: string | null;
  selectedTopicoId: string | null;
  isZenMode: boolean;
  eventsBound: boolean;
  lastSaveTime: number | null;

  constructor() {
    this.mode = "pomodoro_25"; // pomodoro_25, pomodoro_50, stopwatch
    this.state = "idle"; // idle, running, paused, break
    this.lastActiveState = "running";
    this.secondsRemaining = 25 * 60;
    this.secondsElapsed = 0;
    this.totalSessionSeconds = 0;
    this.timerInterval = null;
    this.lastTickTime = null;
    this.selectedDisciplinaId = null;
    this.selectedTopicoId = null;
    this.isZenMode = false;
    this.eventsBound = false;
    this.lastSaveTime = null;
  }

  init() {
    this.checkSavedSession();
    this.updateSubjectDropdown();
    this.render();
    if (!this.eventsBound) {
      this.bindEvents();
      this.eventsBound = true;
    }
  }

  checkSavedSession() {
    try {
      const saved = localStorage.getItem("qg_pomodoro_active_session");
      if (saved) {
        const session = JSON.parse(saved);
        if (session.state === "running" || session.state === "break" || session.state === "paused") {
          if (confirm("Você tem uma sessão de estudo em andamento. Deseja retomá-la?")) {
            this.mode = session.mode;
            this.state = session.state;
            this.lastActiveState = session.lastActiveState || "running";
            this.secondsRemaining = session.secondsRemaining;
            this.secondsElapsed = session.secondsElapsed;
            this.totalSessionSeconds = session.totalSessionSeconds;
            this.selectedDisciplinaId = session.selectedDisciplinaId;
            
            const modeBtns = document.querySelectorAll(".pomo-mode-btn");
            modeBtns.forEach(b => {
              if ((b as HTMLElement).dataset.mode === this.mode) b.classList.add("active");
              else b.classList.remove("active");
            });

            const now = Date.now();
            let deltaSecs = 0;
            if (this.state === "running" || this.state === "break") {
              deltaSecs = Math.max(0, Math.round((now - (session.savedAt || now)) / 1000));
            }
            
            if (deltaSecs > 0) {
              if (this.mode === "stopwatch") {
                this.secondsElapsed += deltaSecs;
                this.totalSessionSeconds += deltaSecs;
              } else {
                this.secondsRemaining = Math.max(0, this.secondsRemaining - deltaSecs);
                if (this.state !== "break") {
                  this.totalSessionSeconds += deltaSecs;
                }
              }
            }
            
            this.lastTickTime = now;
            this.lastSaveTime = now;
            
            if (this.secondsRemaining === 0 && this.mode !== "stopwatch") {
              this.completeInterval();
            } else if (this.state === "running" || this.state === "break") {
              if (this.timerInterval) clearInterval(this.timerInterval);
              this.timerInterval = setInterval(() => this.tick(), 1000);
            }
          } else {
            this.clearSavedSession();
          }
        }
      }
    } catch (e) {
      console.error("Error loading saved pomodoro session", e);
    }
  }

  saveSession() {
    if (this.state === "idle") return;
    const session = {
      mode: this.mode,
      state: this.state,
      lastActiveState: this.lastActiveState,
      secondsRemaining: this.secondsRemaining,
      secondsElapsed: this.secondsElapsed,
      totalSessionSeconds: this.totalSessionSeconds,
      selectedDisciplinaId: this.selectedDisciplinaId,
      savedAt: Date.now()
    };
    localStorage.setItem("qg_pomodoro_active_session", JSON.stringify(session));
  }

  clearSavedSession() {
    localStorage.removeItem("qg_pomodoro_active_session");
  }

  updateSubjectDropdown() {
    const select = document.getElementById("pomo-subject-select") as HTMLSelectElement | null;
    if (!select) return;

    const concurso = store.getActiveConcurso();
    select.innerHTML = `<option value="">-- Selecione a Matéria de Estudo --</option>`;
    
    const discs = (concurso && concurso.disciplinas) || [];
    discs.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = `${d.name} (Peso ${d.weight || 3})`;
      select.appendChild(opt);
    });

    if (this.selectedDisciplinaId && discs.some(d => d.id === this.selectedDisciplinaId)) {
      select.value = this.selectedDisciplinaId;
    } else if (discs.length > 0) {
      this.selectedDisciplinaId = discs[0].id;
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

    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement && this.isZenMode) {
        this.toggleZenMode(false);
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        try {
          const saved = localStorage.getItem("qg_pomodoro_active_session");
          if (saved) {
            const session = JSON.parse(saved);
            if (this.state === "running" || this.state === "break") {
              const now = Date.now();
              const deltaSecs = Math.max(0, Math.round((now - session.savedAt) / 1000));
              
              if (this.mode === "stopwatch") {
                this.secondsElapsed = session.secondsElapsed + deltaSecs;
                this.totalSessionSeconds = session.totalSessionSeconds + deltaSecs;
              } else {
                this.secondsRemaining = Math.max(0, session.secondsRemaining - deltaSecs);
                if (this.state !== "break") {
                  this.totalSessionSeconds = session.totalSessionSeconds + deltaSecs;
                }
                if (this.secondsRemaining === 0) {
                  this.completeInterval();
                }
              }
              this.lastTickTime = now;
              this.lastSaveTime = now;
              this.saveSession();
              this.render();
            }
          }
        } catch (e) {
          console.error("Error on visibilitychange restore", e);
        }
      }
    });

    if (subjectSelect) {
      subjectSelect.addEventListener("change", (e: any) => {
        this.selectedDisciplinaId = e.target.value;
      });
    }

    if (soundSelect) {
      soundSelect.addEventListener("change", (e: any) => {
        const val = e.target.value;
        if (this.state === "running") {
          audio.startAmbientNoise(val);
        }
      });
    }

    modeBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        modeBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.setMode((btn as HTMLElement).dataset.mode);
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

  start(isBreak = null) {
    if (this.state === "running" && isBreak !== true) return;
    try {
      audio.initContext();
    } catch (e) {}

    const runningBreak = isBreak === true || (isBreak === null && this.lastActiveState === "break");
    this.state = runningBreak ? "break" : "running";
    this.lastActiveState = this.state;

    const soundSelect = document.getElementById("pomo-sound-select") as HTMLSelectElement | null;
    if (soundSelect && soundSelect.value !== "none" && !runningBreak) {
      try {
        audio.startAmbientNoise(soundSelect.value);
      } catch (e) {}
    }

    this.lastTickTime = Date.now();
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.tick(), 1000);
    this.render();
  }

  pause() {
    if (this.state !== "running" && this.state !== "break") return;
    this.lastActiveState = this.state;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.state = "paused";
    try {
      audio.stopAmbientNoise();
    } catch (e) {}
    this.saveSession();
    this.render();
  }

  tick() {
    const now = Date.now();
    const deltaSeconds = Math.max(1, Math.round((now - (this.lastTickTime || now)) / 1000));
    this.lastTickTime = now;

    if (this.mode === "stopwatch") {
      this.secondsElapsed += deltaSeconds;
      this.totalSessionSeconds += deltaSeconds;
    } else {
      if (this.secondsRemaining > 0) {
        this.secondsRemaining = Math.max(0, this.secondsRemaining - deltaSeconds);
        if (this.state !== "break") {
          this.totalSessionSeconds += deltaSeconds;
        }
      } else {
        this.completeInterval();
      }
    }

    if (!this.lastSaveTime || now - this.lastSaveTime >= 30000) {
      this.saveSession();
      this.lastSaveTime = now;
    }

    this.render();
  }

  completeInterval() {
    this.clearSavedSession();
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = null;
    try {
      audio.stopAmbientNoise();
      audio.playCompletionChime();
    } catch (e) {}

    if (this.state === "running") {
      const minutesStudied = Math.max(1, Math.round(this.totalSessionSeconds / 60));
      this.saveCurrentSession(minutesStudied);

      this.state = "idle";
      this.totalSessionSeconds = 0;
      this.secondsRemaining = this.mode === "pomodoro_25" ? 5 * 60 : 10 * 60;
      this.render();
    } else if (this.state === "break") {
      this.state = "idle";
      this.totalSessionSeconds = 0;
      this.secondsRemaining = this.mode === "pomodoro_25" ? 25 * 60 : 50 * 60;
      showToast("Pausa concluída! Pronto para o próximo bloco de estudo?", "success");
      this.render();
    }
  }

  reset(askToSave = true) {
    this.clearSavedSession();
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
    this.lastActiveState = "running";
    this.totalSessionSeconds = 0;

    if (this.mode === "pomodoro_25") this.secondsRemaining = 25 * 60;
    else if (this.mode === "pomodoro_50") this.secondsRemaining = 50 * 60;
    else if (this.mode === "stopwatch") this.secondsElapsed = 0;

    document.title = "QG do Concurseiro";
    this.render();
  }

  saveCurrentSession(minutes) {
    if (!this.selectedDisciplinaId) {
      const active = store.getActiveConcurso();
      if (active && active.disciplinas && active.disciplinas[0]) {
        this.selectedDisciplinaId = active.disciplinas[0].id;
      }
    }

    const activeConcurso = store.getActiveConcurso();
    const primaryDiscId = this.selectedDisciplinaId || (activeConcurso && activeConcurso.disciplinas && activeConcurso.disciplinas[0]?.id) || "pf-port";

    store.addStudySession({
      concursoId: activeConcurso?.id || "pf-agente",
      disciplinaId: primaryDiscId,
      topicoId: this.selectedTopicoId || null,
      durationMinutes: minutes,
      type: "teoria",
      notes: `Sessão de Foco (${minutes} min)`
    });

    const disc = ((activeConcurso && activeConcurso.disciplinas) || []).find(d => d.id === primaryDiscId);
    const discName = disc ? disc.name : "Geral";

    this.showPostPomodoroModal(minutes, discName, primaryDiscId);
  }

  showPostPomodoroModal(minutes, discName, disciplinaId) {
    const modal = document.getElementById("modal-post-pomodoro") as HTMLDialogElement | null;
    if (!modal) return;

    const minEl = document.getElementById("post-pomo-minutes");
    const discEl = document.getElementById("post-pomo-disc");
    if (minEl) minEl.textContent = `${minutes} minutos`;
    if (discEl) discEl.textContent = discName;

    // Botão Praticar Questões
    const btnQuestions = document.getElementById("post-pomo-btn-questoes");
    if (btnQuestions) {
      btnQuestions.onclick = () => {
        modal.close();
        window.location.hash = "#questoes";
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (typeof questionsManager !== "undefined") {
              questionsManager.setDisciplinaFilter(disciplinaId);
            }
            showToast(`Filtrando questões de ${discName}!`, "info");
          });
        });
      };
    }

    // Botão Revisar Flashcards
    const btnCards = document.getElementById("post-pomo-btn-flashcards");
    if (btnCards) {
      btnCards.onclick = () => {
        modal.close();
        window.location.hash = "#flashcards";
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (typeof flashcardsManager !== "undefined") {
              flashcardsManager.selectDeck(disciplinaId);
            }
            showToast(`Deck selecionado: Flashcards de ${discName}!`, "info");
          });
        });
      };
    }

    // Botão Iniciar Descanso
    const btnBreak = document.getElementById("post-pomo-btn-intervalo");
    if (btnBreak) {
      const breakMins = this.mode === "pomodoro_50" ? 10 : 5;
      btnBreak.innerHTML = `<i class="fa-solid fa-mug-hot"></i> Iniciar Descanso (${breakMins} min)`;
      btnBreak.onclick = () => {
        modal.close();
        this.state = "break";
        this.secondsRemaining = breakMins * 60;
        this.start(true);
      };
    }

    modal.showModal();
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

    if (this.state === "running" || this.state === "break") {
      document.title = `(${formatted}) QG do Concurseiro`;
    } else {
      document.title = "QG do Concurseiro";
    }

    if (progressRing) {
      const circumference = 2 * Math.PI * 130; // 816.814
      if (this.mode === "stopwatch") {
        const secInMin = this.secondsElapsed % 60;
        progressRing.style.strokeDashoffset = (circumference * (1 - secInMin / 60)).toString();
      } else {
        const totalSecs = this.state === "break"
          ? (this.mode === "pomodoro_50" ? 10 * 60 : 5 * 60)
          : (this.mode === "pomodoro_50" ? 50 * 60 : 25 * 60);
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
export { PomodoroController, pomodoro, pomodoroManager };
if (typeof window !== "undefined") {
  window.PomodoroController = PomodoroController;
  window.pomodoro = pomodoro;
  window.pomodoroManager = pomodoroManager;
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof pomodoro !== "undefined") {
    pomodoro.init();
  }
});
