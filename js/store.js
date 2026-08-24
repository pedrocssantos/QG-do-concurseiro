// ==========================================================================
// QG DO CONCURSEIRO - GERENCIADOR DE ESTADO E LOCALSTORAGE (STORE)
// ==========================================================================

const STORAGE_KEY = "foco_no_papiro_v1";

class Store {
  constructor() {
    this.listeners = [];
    this.data = this.loadInitialData();
    if (!this.data.ciclo || !this.data.ciclo.items || this.data.ciclo.items.length === 0) {
      this.rebuildCicloForConcurso(this.data.activeConcursoId || "pf-agente");
    }
    this.checkStreakLiveness();
    this.ensureDailyMissions();
  }

  // Helper para obter a data local no formato YYYY-MM-DD (Horário de Brasília / Local)
  getLocalDateString(d = new Date()) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  loadInitialData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.sanitizeState(parsed);
      }
    } catch (e) {
      console.error("Erro ao carregar dados do LocalStorage:", e);
    }
    return this.getDefaultState();
  }

  getDefaultState() {
    return {
      profile: {
        name: "Concurseiro(a)",
        title: "Recruta",
        avatar: "QG",
        xp: 0,
        level: 1,
        streak: 0,
        lastStudyDate: null,
        theme: "dark",
        dailyGoalMinutes: 180,
        weeklyGoalHours: 20,
        soundEnabled: true,
        ambientSound: "none",
        onboardingCompleted: false,
        plan_tier: "free"
      },
      activeConcursoId: "pf-agente",
      concursos: JSON.parse(JSON.stringify(DEFAULT_CONCURSOS)),
      questions: JSON.parse(JSON.stringify(DEFAULT_QUESTIONS)),
      flashcards: JSON.parse(JSON.stringify(DEFAULT_FLASHCARDS)),
      badges: JSON.parse(JSON.stringify(DEFAULT_BADGES)),
      leaderboard: JSON.parse(JSON.stringify(DEFAULT_LEADERBOARD)),
      studySessions: [],
      questionHistory: [],
      cadernoErros: [],
      ciclo: {
        currentSubjectIndex: 0,
        items: []
      },
      cicloWeeklyChecks: {},
      dailyMissions: []
    };
  }

  generateSeedSessions() {
    const today = new Date();
    const sessions = [];
    const subjects = ["pf-port", "pf-dir-adm", "pf-info", "pf-dir-const", "pf-contab", "pf-dir-penal", "pf-rlm"];
    
    // Gera dados dos últimos 14 dias para gráficos ricos
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = this.getLocalDateString(d);
      
      const numSessions = (i === 0) ? 3 : Math.floor(Math.random() * 3) + 2;
      for (let j = 0; j < numSessions; j++) {
        const subId = subjects[Math.floor(Math.random() * subjects.length)];
        const mins = (i === 0) ? (j === 0 ? 50 : 45) : (Math.floor(Math.random() * 4) + 3) * 15; // 45 a 90 min
        sessions.push({
          id: `sess-${i}-${j}`,
          concursoId: "pf-agente",
          disciplinaId: subId,
          durationMinutes: mins,
          type: j % 2 === 0 ? "teoria" : (j % 3 === 0 ? "revisao" : "questoes"),
          date: dateStr,
          timestamp: d.getTime() + (j * 3600 * 1000)
        });
      }
    }
    return sessions;
  }

  generateSeedQuestionHistory() {
    const today = new Date();
    const history = [];
    const discMap = {
      "q-1": "pf-dir-adm", "q-2": "pf-dir-adm", "q-3": "pf-dir-const",
      "q-4": "pf-dir-penal", "q-5": "pf-info", "q-6": "pf-info",
      "q-7": "pf-contab", "q-8": "pf-contab", "q-9": "pf-contab",
      "q-10": "pf-contab", "q-11": "pf-rlm", "q-12": "pf-rlm"
    };

    for (let i = 0; i < 45; i++) {
      const isCorrect = Math.random() > 0.18; // ~82% acertos
      const d = new Date(today);
      d.setDate(d.getDate() - Math.floor(i / 4));
      const qId = `q-${(i % 12) + 1}`;
      history.push({
        id: `qh-${i}`,
        questionId: qId,
        disciplinaId: discMap[qId] || "pf-port",
        selectedOption: isCorrect ? "C" : "E",
        isCorrect: isCorrect,
        timeSpentSeconds: Math.floor(Math.random() * 90) + 30,
        date: this.getLocalDateString(d),
        timestamp: d.getTime()
      });
    }
    return history;
  }

  sanitizeState(state) {
    if (!state || typeof state !== "object") return this.getDefaultState();

    if (!Array.isArray(state.concursos) || state.concursos.length === 0) {
      state.concursos = JSON.parse(JSON.stringify(DEFAULT_CONCURSOS));
    }
    if (!Array.isArray(state.questions) || state.questions.length === 0) {
      state.questions = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
    }
    if (!Array.isArray(state.flashcards) || state.flashcards.length === 0) {
      state.flashcards = JSON.parse(JSON.stringify(DEFAULT_FLASHCARDS));
    }
    if (!Array.isArray(state.badges) || state.badges.length === 0) {
      state.badges = JSON.parse(JSON.stringify(DEFAULT_BADGES));
    }
    if (!Array.isArray(state.leaderboard)) {
      state.leaderboard = JSON.parse(JSON.stringify(DEFAULT_LEADERBOARD));
    }
    if (!Array.isArray(state.cadernoErros)) {
      state.cadernoErros = [];
    }
    if (!Array.isArray(state.studySessions)) {
      state.studySessions = [];
    }
    if (!Array.isArray(state.questionHistory)) {
      state.questionHistory = [];
    }
    if (!state.profile || typeof state.profile !== "object") {
      state.profile = this.getDefaultState().profile;
    }

    // Garante propriedades numéricas e seguras no perfil
    state.profile.xp = typeof state.profile.xp === "number" && !isNaN(state.profile.xp) ? state.profile.xp : 0;
    state.profile.level = state.profile.level || this.calculateLevel(state.profile.xp);
    state.profile.streak = typeof state.profile.streak === "number" ? state.profile.streak : 0;
    state.profile.dailyGoalMinutes = state.profile.dailyGoalMinutes || 180;
    state.profile.weeklyGoalHours = state.profile.weeklyGoalHours || 20;
    state.profile.plan_tier = state.profile.plan_tier || "free";
    if (state.profile.onboardingCompleted === undefined) {
      state.profile.onboardingCompleted = false;
    }

    if (!state.ciclo || typeof state.ciclo !== "object") {
      state.ciclo = this.getDefaultState().ciclo;
    }
    if (!state.cicloWeeklyChecks || typeof state.cicloWeeklyChecks !== "object") {
      state.cicloWeeklyChecks = {};
    }
    if (!Array.isArray(state.dailyMissions)) {
      state.dailyMissions = [];
    }
    if (!state.activeConcursoId) {
      state.activeConcursoId = state.concursos[0]?.id || "pf-agente";
    }

    return state;
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error("Erro ao salvar no LocalStorage:", e);
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify(event, payload = {}) {
    this.save();
    this.listeners.forEach(cb => {
      try {
        cb(event, payload);
      } catch (err) {
        console.error("Erro no listener do store:", err);
      }
    });
  }

  isPro() {
    return this.data.profile && (this.data.profile.plan_tier === "pro" || this.data.profile.plan_tier === "vip");
  }

  getSimuladosThisWeek() {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentSimulados = (this.data.studySessions || []).filter(s => s.type === "simulado" && (s.timestamp || 0) >= oneWeekAgo);
    return recentSimulados.length;
  }

  // ================= CONCURSO ATIVO =================
  getActiveConcurso() {
    const found = this.data.concursos.find(c => c.id === this.data.activeConcursoId);
    return found || this.data.concursos[0] || DEFAULT_CONCURSOS[0];
  }

  setActiveConcurso(id) {
    if (this.data.concursos.some(c => c.id === id)) {
      this.data.activeConcursoId = id;
      this.rebuildCicloForConcurso(id);
      this.ensureDailyMissions(true);
      this.notify("concurso_changed", { concursoId: id });
    }
  }

  addConcurso(newConcurso) {
    this.data.concursos.push(newConcurso);
    this.setActiveConcurso(newConcurso.id);
    this.notify("concurso_added", newConcurso);
  }

  // ================= EDITAL / PROGRESSO =================
  updateTopico(concursoId, disciplinaId, topicoId, fields) {
    const concurso = this.data.concursos.find(c => c.id === concursoId);
    if (!concurso) return;
    const disc = (concurso.disciplinas || []).find(d => d.id === disciplinaId);
    if (!disc) return;
    const topico = (disc.topicos || []).find(t => t.id === topicoId);
    if (!topico) return;

    // Idempotência de XP para teoria
    if (fields.teoria === true && !topico.teoria) {
      if (!topico.xpTeoriaAwarded) {
        this.addXP(30, "Conclusão de Teoria");
        topico.xpTeoriaAwarded = true;
      }
      topico.teoriaDate = this.getLocalDateString();
    }

    // Idempotência de XP para resumo
    if (fields.resumo === true && !topico.resumo) {
      if (!topico.xpResumoAwarded) {
        this.addXP(20, "Criação de Resumo");
        topico.xpResumoAwarded = true;
      }
      topico.resumoDate = this.getLocalDateString();
    }

    // Idempotência de XP para domínio avançado (>= 4 estrelas)
    if (fields.dominio && fields.dominio >= 4 && (!topico.dominio || topico.dominio < 4)) {
      if (!topico.xpDominioAwarded) {
        this.addXP(40, "Domínio do Tópico");
        topico.xpDominioAwarded = true;
      }
    }

    Object.assign(topico, fields);

    this.checkBadges();
    this.notify("edital_updated", { concursoId, disciplinaId, topicoId });
  }

  addDisciplina(concursoId, disciplina) {
    const concurso = this.data.concursos.find(c => c.id === concursoId);
    if (!concurso) return;
    if (!disciplina.id) disciplina.id = `disc-${Date.now()}`;
    if (!disciplina.topicos) disciplina.topicos = [];
    if (!concurso.disciplinas) concurso.disciplinas = [];
    concurso.disciplinas.push(disciplina);
    this.rebuildCicloForConcurso(concursoId);
    this.notify("disciplina_added", { concursoId, disciplina });
  }

  addTopico(concursoId, disciplinaId, topico) {
    const concurso = this.data.concursos.find(c => c.id === concursoId);
    if (!concurso) return;
    const disc = (concurso.disciplinas || []).find(d => d.id === disciplinaId);
    if (!disc) return;
    if (!topico.id) topico.id = `top-${Date.now()}`;
    if (!disc.topicos) disc.topicos = [];
    disc.topicos.push(topico);
    this.notify("topico_added", { concursoId, disciplinaId, topico });
  }

  deleteTopico(concursoId, disciplinaId, topicoId) {
    const concurso = this.data.concursos.find(c => c.id === concursoId);
    if (!concurso) return;
    const disc = (concurso.disciplinas || []).find(d => d.id === disciplinaId);
    if (!disc) return;
    disc.topicos = (disc.topicos || []).filter(t => t.id !== topicoId);
    this.notify("topico_deleted", { concursoId, disciplinaId, topicoId });
  }

  // ================= SESSÕES DE ESTUDO & CRONÔMETRO =================
  addStudySession(session) {
    const dateToday = this.getLocalDateString();
    const newSession = {
      id: `sess-${Date.now()}`,
      concursoId: session.concursoId || this.data.activeConcursoId,
      disciplinaId: session.disciplinaId,
      topicoId: session.topicoId || null,
      durationMinutes: Math.round(session.durationMinutes),
      type: session.type || "teoria", // teoria, questoes, revisao, pomodoro, simulado
      date: session.date || dateToday,
      timestamp: Date.now(),
      notes: session.notes || ""
    };

    this.data.studySessions.push(newSession);

    // Se estiver conectado a um tópico do edital, marca teoria/tempo
    if (newSession.topicoId && newSession.concursoId) {
      const concurso = this.data.concursos.find(c => c.id === newSession.concursoId);
      if (concurso) {
        const disc = (concurso.disciplinas || []).find(d => d.id === newSession.disciplinaId);
        if (disc) {
          const topico = (disc.topicos || []).find(t => t.id === newSession.topicoId);
          if (topico && !topico.teoria) {
            topico.teoria = true;
            topico.teoriaDate = dateToday;
            if (!topico.xpTeoriaAwarded) {
              this.addXP(30, "Conclusão de Teoria via Pomodoro");
              topico.xpTeoriaAwarded = true;
            }
          }
        }
      }
    }

    // XP por tempo estudado: 2 XP por minuto
    const xpGained = Math.round(newSession.durationMinutes * 2);
    this.addXP(xpGained, `Sessão de ${newSession.durationMinutes} min`);

    // Atualiza Streak diário (horário local)
    this.updateStreak();

    // Atualiza progresso do ciclo de estudos
    this.advanceCiclo(session.disciplinaId, newSession.durationMinutes);

    // Atualiza missões diárias
    this.checkMissionsProgress(newSession);

    this.checkBadges();
    this.notify("session_added", newSession);

    // Sincroniza em nuvem se o usuário estiver autenticado no Supabase
    if (typeof db !== "undefined" && db.saveSessionToCloud) {
      db.saveSessionToCloud(newSession);
    }

    return newSession;
  }

  checkStreakLiveness() {
    if (!this.data.profile || !this.data.profile.lastStudyDate) return;
    const today = this.getLocalDateString();
    const last = this.data.profile.lastStudyDate;
    if (last === today) return;

    const [y1, m1, d1] = today.split("-").map(Number);
    const [y2, m2, d2] = last.split("-").map(Number);
    const diffDays = Math.round((Date.UTC(y1, m1 - 1, d1) - Date.UTC(y2, m2 - 1, d2)) / 86400000);

    if (diffDays > 1) {
      this.data.profile.streak = 0;
      this.save();
    }
  }

  updateStreak() {
    const today = this.getLocalDateString();
    const last = this.data.profile.lastStudyDate;

    if (last !== today) {
      if (!last) {
        this.data.profile.streak = 1;
      } else {
        const [y1, m1, d1] = today.split("-").map(Number);
        const [y2, m2, d2] = last.split("-").map(Number);
        const diffDays = Math.round((Date.UTC(y1, m1 - 1, d1) - Date.UTC(y2, m2 - 1, d2)) / 86400000);

        if (diffDays === 1) {
          this.data.profile.streak = (this.data.profile.streak || 0) + 1;
        } else if (diffDays > 1) {
          this.data.profile.streak = 1;
        }
      }
      this.data.profile.lastStudyDate = today;
      this.save();
    }
  }

  // ================= CICLO DE ESTUDOS =================
  rebuildCicloForConcurso(concursoId) {
    const concurso = this.data.concursos.find(c => c.id === concursoId) || this.getActiveConcurso();
    if (!concurso) return;

    this.data.ciclo.items = (concurso.disciplinas || []).map(d => {
      const minutes = (d.weight || 3) * 15 + 15;
      return {
        disciplinaId: d.id,
        name: d.name,
        minutesGoal: minutes,
        minutesDone: 0,
        icon: d.icon || "fa-book",
        color: d.color || "#4D7EA8"
      };
    });
    this.data.ciclo.currentSubjectIndex = 0;
  }

  advanceCiclo(disciplinaId, minutesStudied) {
    if (!this.data.ciclo || !this.data.ciclo.items || this.data.ciclo.items.length === 0) return;
    const items = this.data.ciclo.items;
    const item = items.find(i => i.disciplinaId === disciplinaId);
    if (item) {
      item.minutesDone += minutesStudied;
      if (item.minutesDone >= item.minutesGoal) {
        // Se concluiu a matéria atual do ponteiro, avança para a próxima
        const currIdx = this.data.ciclo.currentSubjectIndex || 0;
        if (items[currIdx] && items[currIdx].disciplinaId === disciplinaId) {
          this.data.ciclo.currentSubjectIndex = (currIdx + 1) % items.length;
        }
        // Verifica se todas as matérias foram concluídas para fechar o ciclo
        const allDone = items.every(i => i.minutesDone >= i.minutesGoal);
        if (allDone) {
          items.forEach(i => i.minutesDone = 0);
          this.data.ciclo.currentSubjectIndex = 0;
          this.addXP(100, "Ciclo Completo Fechado! 🔥");
        }
      }
    }
  }

  // ================= BANCO DE QUESTÕES & RESPOSTAS =================
  recordQuestionAnswer(data) {
    const record = {
      id: `qh-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      questionId: data.questionId,
      disciplinaId: data.disciplinaId,
      selectedOption: data.selectedOption,
      isCorrect: data.isCorrect,
      timeSpentSeconds: data.timeSpentSeconds || 45,
      date: this.getLocalDateString(),
      timestamp: Date.now()
    };

    this.data.questionHistory.push(record);

    // Atualiza estatísticas no tópico do edital se houver
    const concurso = this.getActiveConcurso();
    if (concurso) {
      const question = this.data.questions.find(q => q.id === data.questionId);
      const assunto = (question && question.assunto) || data.assunto || "";
      const discId = data.disciplinaId || (question && question.disciplinaId);

      const disc = (concurso.disciplinas || []).find(d => {
        if (discId && d.id === discId) return true;
        if (data.disciplinaName) {
          const dName = d.name.toLowerCase();
          const qDiscName = data.disciplinaName.toLowerCase();
          return dName.includes(qDiscName) || qDiscName.includes(dName);
        }
        return false;
      });

      if (disc && disc.topicos && disc.topicos.length > 0) {
        let topico = null;
        if (assunto) {
          const normAssunto = assunto.toLowerCase().trim();
          topico = disc.topicos.find(t => {
            const normTitle = t.title.toLowerCase().trim();
            return normTitle.includes(normAssunto) || normAssunto.includes(normTitle);
          });

          if (!topico) {
            const keywords = normAssunto.split(/[\s,–—\(\)\-\/]+/).filter(w => w.length > 3);
            if (keywords.length > 0) {
              topico = disc.topicos.find(t => {
                const titleLower = t.title.toLowerCase();
                return keywords.some(kw => titleLower.includes(kw));
              });
            }
          }
        }

        if (!topico) {
          topico = disc.topicos[0];
        }

        if (topico) {
          topico.questoesFeitas = (topico.questoesFeitas || 0) + 1;
          if (data.isCorrect) {
            topico.questoesAcertos = (topico.questoesAcertos || 0) + 1;
          }
        }
      }
    }

    // Se errou, adiciona ao Caderno de Erros com ID único
    if (!data.isCorrect) {
      this.addToCadernoErrosAuto(data.questionId, "conteudo");
    } else {
      this.addXP(15, "Questão Correta!");
    }

    // Atualiza missões de questões
    this.checkMissionsProgress({ type: "questoes", count: 1, disciplinaId: data.disciplinaId });

    this.checkBadges();
    this.notify("question_answered", record);

    if (typeof db !== "undefined" && db.saveQuestionAnswerToCloud) {
      db.saveQuestionAnswerToCloud(record);
    }

    return record;
  }

  addToCadernoErrosAuto(questionId, reason = "conteudo", note = "") {
    const exists = this.data.cadernoErros.some(e => e.questionId === questionId && !e.resolved);
    if (!exists) {
      const errItem = {
        id: `err-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        questionId: questionId,
        reason: reason,
        note: note || "Questão errada em sessão de prática. Revisar fundamentos da banca.",
        date: this.getLocalDateString(),
        resolved: false
      };
      this.data.cadernoErros.push(errItem);
      if (typeof db !== "undefined" && db.saveErrorToCloud) {
        db.saveErrorToCloud(errItem);
      }
    }
  }

  updateCadernoErro(errorId, updates) {
    const item = this.data.cadernoErros.find(e => e.id === errorId);
    if (item) {
      Object.assign(item, updates);
      if (updates.resolved && !item.xpResolvedAwarded) {
        this.addXP(25, "Erro Superado no Caderno de Erros! 🎯");
        item.xpResolvedAwarded = true;
      }
      this.notify("caderno_updated", item);
      if (typeof db !== "undefined" && db.saveErrorToCloud) {
        db.saveErrorToCloud(item);
      }
    }
  }

  removeCadernoErro(errorId) {
    this.data.cadernoErros = this.data.cadernoErros.filter(e => e.id !== errorId);
    this.notify("caderno_updated", { removedId: errorId });
  }

  addQuestion(question) {
    if (!question.id) question.id = `q-custom-${Date.now()}`;
    this.data.questions.push(question);
    this.notify("question_added", question);
    return question;
  }

  // ================= FLASHCARDS (SRS - SM2) =================
  addFlashcard(card) {
    const newCard = {
      id: `fc-${Date.now()}`,
      disciplinaId: card.disciplinaId,
      disciplinaName: card.disciplinaName,
      frente: card.frente || "",
      verso: card.verso || "",
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      dueDate: this.getLocalDateString()
    };
    this.data.flashcards.push(newCard);
    this.addXP(10, "Novo Flashcard Criado");
    this.notify("flashcard_added", newCard);

    if (typeof db !== "undefined" && db.saveFlashcardToCloud) {
      db.saveFlashcardToCloud(newCard);
    }

    return newCard;
  }

  reviewFlashcard(cardId, quality) {
    // quality: 0 (Errei), 3 (Difícil), 4 (Bom), 5 (Fácil)
    const card = this.data.flashcards.find(c => c.id === cardId);
    if (!card) return;

    if (quality < 3) {
      card.repetitions = 0;
      card.interval = 1;
      // Cartão com erro vence amanhã para evitar loop no mesmo dia
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      card.dueDate = this.getLocalDateString(tomorrow);
    } else {
      if (card.repetitions === 0) {
        card.interval = 1;
      } else if (card.repetitions === 1) {
        card.interval = 6;
      } else {
        card.interval = Math.max(1, Math.round(card.interval * (card.easeFactor || 2.5)));
      }
      card.repetitions += 1;

      // Define nova data de vencimento
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + card.interval);
      card.dueDate = this.getLocalDateString(nextDate);
    }

    // Calcula novo Ease Factor (Fórmula SuperMemo SM-2)
    const currentEf = card.easeFactor || 2.5;
    const newEf = currentEf + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    card.easeFactor = Number(Math.max(1.3, newEf).toFixed(2));

    this.addXP(10, "Flashcard Revisado");
    this.checkMissionsProgress({ type: "flashcards", count: 1 });
    this.checkBadges();
    this.notify("flashcard_reviewed", card);

    if (typeof db !== "undefined" && db.saveFlashcardToCloud) {
      db.saveFlashcardToCloud(card);
    }

    return card;
  }

  deleteFlashcard(cardId) {
    this.data.flashcards = this.data.flashcards.filter(c => c.id !== cardId);
    this.notify("flashcard_deleted", cardId);
  }

  // ================= MISSÕES DIÁRIAS =================
  ensureDailyMissions(forceRebuild = false) {
    const today = this.getLocalDateString();
    if (!forceRebuild && this.data.dailyMissions && this.data.dailyMissions.length > 0 && this.data.dailyMissions[0].date === today) {
      return;
    }

    const concurso = this.getActiveConcurso();
    const discs = concurso.disciplinas || [];
    
    const missions = [
      {
        id: `mis-1-${today}`,
        date: today,
        title: `${discs[0]?.name || "Português"} - Teoria & Fixação`,
        desc: "Estudar 45 minutos de teoria e fazer anotações de resumo.",
        type: "teoria",
        disciplinaId: discs[0]?.id || "",
        targetMinutes: 45,
        completed: false,
        xpAwarded: false,
        xpReward: 90
      },
      {
        id: `mis-2-${today}`,
        date: today,
        title: `Bateria de 20 Questões: ${discs[1]?.name || "Direito Administrativo"}`,
        desc: "Resolver 20 questões no banco com foco em alto percentual de acerto.",
        type: "questoes",
        disciplinaId: discs[1]?.id || "",
        targetQuestions: 20,
        progressCount: 0,
        completed: false,
        xpAwarded: false,
        xpReward: 120
      },
      {
        id: `mis-3-${today}`,
        date: today,
        title: `Revisão Ativa de Flashcards do Dia`,
        desc: "Revisar cards pendentes com repetição espaçada.",
        type: "flashcards",
        targetCards: 10,
        progressCount: 0,
        completed: false,
        xpAwarded: false,
        xpReward: 75
      },
      {
        id: `mis-4-${today}`,
        date: today,
        title: `Sessão de Foco no Pomodoro: ${discs[2]?.name || "Informática"}`,
        desc: "Completar 1 ciclo de concentração plena no Pomodoro.",
        type: "pomodoro",
        disciplinaId: discs[2]?.id || "",
        targetMinutes: 25,
        completed: false,
        xpAwarded: false,
        xpReward: 100
      }
    ];

    this.data.dailyMissions = missions;
    this.save();
  }

  toggleMission(missionId) {
    const m = (this.data.dailyMissions || []).find(x => x.id === missionId);
    if (m) {
      m.completed = !m.completed;
      if (m.completed && !m.xpAwarded) {
        this.addXP(m.xpReward, `Meta Concluída: ${m.title}! 🏆`);
        m.xpAwarded = true;
      }
      this.notify("mission_updated", m);
    }
  }

  checkMissionsProgress(action) {
    if (!this.data.dailyMissions || !action) return;
    this.data.dailyMissions.forEach(m => {
      if (m.completed) return;

      // Missões baseadas em tempo (Pomodoro / Teoria)
      if (action.durationMinutes && (m.type === "pomodoro" || m.type === "teoria")) {
        const discMatch = !m.disciplinaId || m.disciplinaId === action.disciplinaId;
        if (discMatch && action.durationMinutes >= (m.targetMinutes || 25)) {
          m.completed = true;
          if (!m.xpAwarded) {
            this.addXP(m.xpReward, `Meta Concluída Automaticamente: ${m.title} 🎯`);
            m.xpAwarded = true;
          }
        }
      }

      // Missões baseadas em questões resolvidas
      if (action.type === "questoes" && m.type === "questoes") {
        const discMatch = !m.disciplinaId || m.disciplinaId === action.disciplinaId;
        if (discMatch) {
          m.progressCount = (m.progressCount || 0) + (action.count || 1);
          if (m.progressCount >= (m.targetQuestions || 20)) {
            m.completed = true;
            if (!m.xpAwarded) {
              this.addXP(m.xpReward, `Meta Concluída: ${m.title} 🎯`);
              m.xpAwarded = true;
            }
          }
        }
      }

      // Missões baseadas em flashcards
      if (action.type === "flashcards" && m.type === "flashcards") {
        m.progressCount = (m.progressCount || 0) + (action.count || 1);
        if (m.progressCount >= (m.targetCards || 10)) {
          m.completed = true;
          if (!m.xpAwarded) {
            this.addXP(m.xpReward, `Meta Concluída: ${m.title} 🎯`);
            m.xpAwarded = true;
          }
        }
      }
    });
  }

  // ================= GAMIFICAÇÃO & XP =================
  addXP(amount, reason = "") {
    if (!amount || isNaN(amount) || amount <= 0) return;
    this.data.profile.xp = (this.data.profile.xp || 0) + amount;
    const oldLevel = this.data.profile.level || 1;
    const newLevel = this.calculateLevel(this.data.profile.xp);
    this.data.profile.level = newLevel;

    // Atualiza leaderboard para o usuário
    const userInLb = (this.data.leaderboard || []).find(l => l.isUser);
    if (userInLb) {
      userInLb.xp = this.data.profile.xp;
    }

    if (newLevel > oldLevel) {
      this.notify("level_up", { newLevel, title: this.getRankTitle(newLevel) });
    }
    this.save();
  }

  calculateLevel(xp) {
    if (!xp || xp < 0) return 1;
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  getRankTitle(level) {
    const ranks = [
      "Recruta", "Aspirante", "Soldado de 1ª Classe", "Cabo de Operações",
      "Sargento Operacional", "Subtenente Focado", "Tenente Estrategista",
      "Capitão do QG", "Major da Aprovação", "Coronel Caveira",
      "General Aprovado", "Mestre dos Concursos"
    ];
    const safeIdx = Math.max(0, Math.min((level || 1) - 1, ranks.length - 1));
    return ranks[safeIdx] || "Recruta";
  }

  checkBadges() {
    const totalMinutes = (this.data.studySessions || []).reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const totalQuestions = (this.data.questionHistory || []).length;
    const correctQuestions = (this.data.questionHistory || []).filter(q => q.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctQuestions / totalQuestions) * 100 : 0;
    const streak = this.data.profile.streak || 0;
    const overallEdital = this.getEditalOverallProgress();
    const flashcardsReviewed = (this.data.flashcards || []).filter(f => (f.repetitions || 0) > 0).length;

    // Checagem de estudo noturno (sessões entre 20h e 04h)
    const hasNightStudy = (this.data.studySessions || []).some(s => {
      if (!s.timestamp) return false;
      const hour = new Date(s.timestamp).getHours();
      return hour >= 20 || hour < 4;
    });

    // Checagem de simulado de alto desempenho
    const hasSimuladoPro = (this.data.studySessions || []).some(s => s.type === "simulado" && (s.accuracy || 0) >= 80) ||
      (totalQuestions >= 20 && accuracy >= 80);

    (this.data.badges || []).forEach(b => {
      if (!b.unlocked) {
        let shouldUnlock = false;
        if (b.id === "badge-first-study" && totalMinutes > 0) shouldUnlock = true;
        if (b.id === "badge-streak-7" && streak >= 7) shouldUnlock = true;
        if (b.id === "badge-50-questions" && totalQuestions >= 50) shouldUnlock = true;
        if (b.id === "badge-centurion" && totalMinutes >= 6000) shouldUnlock = true;
        if (b.id === "badge-edital-25" && overallEdital.percent >= 25) shouldUnlock = true;
        if (b.id === "badge-master-srs" && flashcardsReviewed >= 10) shouldUnlock = true;
        if (b.id === "badge-night-owl" && hasNightStudy) shouldUnlock = true;
        if (b.id === "badge-simulado-pro" && hasSimuladoPro) shouldUnlock = true;

        if (shouldUnlock) {
          b.unlocked = true;
          b.date = this.getLocalDateString();
          this.addXP(200, `Conquista Desbloqueada: ${b.title}! 🎖️`);
          this.notify("badge_unlocked", b);
        }
      }
    });
  }

  // ================= ESTATÍSTICAS E CÁLCULOS =================
  getTodayStats() {
    const today = this.getLocalDateString();
    const todaySessions = (this.data.studySessions || []).filter(s => s.date === today);
    const minutesToday = todaySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    
    const todayQuestions = (this.data.questionHistory || []).filter(q => q.date === today);
    const questionsCount = todayQuestions.length;
    const correctCount = todayQuestions.filter(q => q.isCorrect).length;
    const accuracy = questionsCount > 0 ? Math.round((correctCount / questionsCount) * 100) : 0;

    const cardsDue = (this.data.flashcards || []).filter(c => c.dueDate <= today).length;

    return {
      minutesToday,
      hoursToday: (minutesToday / 60).toFixed(1),
      goalMinutes: this.data.profile.dailyGoalMinutes || 180,
      percentGoal: Math.min(100, Math.round((minutesToday / (this.data.profile.dailyGoalMinutes || 180)) * 100)),
      questionsCount,
      accuracy,
      cardsDue,
      streak: this.data.profile.streak || 0
    };
  }

  getWeeklyStats() {
    const today = new Date();
    const days = [];
    const minutesByDay = [];
    const questionsByDay = [];
    const dayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = this.getLocalDateString(d);
      const dayName = dayLabels[d.getDay()];
      days.push(dayName);

      const dayMins = (this.data.studySessions || [])
        .filter(s => s.date === dateStr)
        .reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
      minutesByDay.push(Number((dayMins / 60).toFixed(1)));

      const dayQ = (this.data.questionHistory || []).filter(q => q.date === dateStr).length;
      questionsByDay.push(dayQ);
    }

    return {
      labels: days,
      hours: minutesByDay,
      questions: questionsByDay
    };
  }

  getSubjectDistribution() {
    const concurso = this.getActiveConcurso();
    const map = {};
    
    (concurso.disciplinas || []).forEach(d => {
      map[d.id] = { name: d.name, color: d.color, minutes: 0, questions: 0, correct: 0 };
    });

    (this.data.studySessions || []).forEach(s => {
      if (map[s.disciplinaId]) {
        map[s.disciplinaId].minutes += s.durationMinutes;
      }
    });

    (this.data.questionHistory || []).forEach(q => {
      if (map[q.disciplinaId]) {
        map[q.disciplinaId].questions += 1;
        if (q.isCorrect) map[q.disciplinaId].correct += 1;
      }
    });

    return Object.values(map);
  }

  getEditalOverallProgress(concursoId = null) {
    const cid = concursoId || this.data.activeConcursoId;
    const concurso = (this.data.concursos || []).find(c => c.id === cid) || this.getActiveConcurso();
    if (!concurso) return { percent: 0, totalTopicos: 0, concluidos: 0 };

    let total = 0;
    let completed = 0;

    (concurso.disciplinas || []).forEach(d => {
      (d.topicos || []).forEach(t => {
        total++;
        // Tópico concluído se completou teoria OU se atingiu domínio avançado (>= 4)
        if (t.teoria || (t.dominio && t.dominio >= 4)) completed++;
      });
    });

    return {
      totalTopicos: total,
      concluidos: completed,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }

  // ================= BACKUP & RESTORE =================
  exportBackup() {
    return JSON.stringify(this.data, null, 2);
  }

  importBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== "object" || !parsed.profile || !Array.isArray(parsed.concursos)) {
        throw new Error("Formato de arquivo JSON incompatível com o sistema.");
      }
      this.data = this.sanitizeState(parsed);
      this.save();
      this.notify("data_imported");
      return true;
    } catch (e) {
      console.error("Erro ao importar dados:", e);
      return false;
    }
  }

  resetData() {
    localStorage.removeItem(STORAGE_KEY);
    this.data = this.getDefaultState();
    this.rebuildCicloForConcurso(this.data.activeConcursoId);
    this.ensureDailyMissions(true);
    this.save();
    this.notify("data_reset");
  }

  loadDemoData() {
    const today = this.getLocalDateString();
    this.data.profile.name = "Max Aldana";
    this.data.profile.title = "Aspirante";
    this.data.profile.avatar = "MA";
    this.data.profile.xp = 3420;
    this.data.profile.level = this.calculateLevel(3420);
    this.data.profile.streak = 7;
    this.data.profile.lastStudyDate = today;
    this.data.profile.dailyGoalMinutes = 240;
    this.data.profile.weeklyGoalHours = 25;
    this.data.profile.onboardingCompleted = true;
    this.data.studySessions = this.generateSeedSessions();
    this.data.questionHistory = this.generateSeedQuestionHistory();
    this.data.cadernoErros = [
      {
        id: "err-1",
        questionId: "q-3",
        reason: "pegadinha",
        note: "Lembrar: mandado judicial é EXCLUSIVAMENTE durante o dia! À noite apenas socorro/desastre/flagrante.",
        date: today,
        resolved: false
      },
      {
        id: "err-2",
        questionId: "q-10",
        reason: "conteudo",
        note: "Fato misto diminutivo: envolveu permuta de contas + variação do PL com juros.",
        date: today,
        resolved: false
      }
    ];

    const concurso = this.getActiveConcurso();
    if (concurso && concurso.disciplinas) {
      concurso.disciplinas.forEach((disc, dIdx) => {
        (disc.topicos || []).forEach((top, tIdx) => {
          if (tIdx === 0) {
            top.teoria = true;
            top.teoriaDate = today;
            top.resumo = true;
            top.r24h = true;
            top.r7d = true;
            top.questoesFeitas = 30;
            top.questoesAcertos = 26;
            top.dominio = 4;
          } else if (tIdx === 1) {
            top.teoria = true;
            top.teoriaDate = today;
            top.resumo = false;
            top.r24h = true;
            top.questoesFeitas = 15;
            top.questoesAcertos = 12;
            top.dominio = 3;
          }
        });
      });
    }

    const demoBadgeIds = ["badge-first-study", "badge-streak-7", "badge-50-questions", "badge-edital-25"];
    (this.data.badges || []).forEach(b => {
      if (demoBadgeIds.includes(b.id)) {
        b.unlocked = true;
        b.date = today;
      }
    });

    this.rebuildCicloForConcurso(this.data.activeConcursoId || "pf-agente");
    this.save();
    this.notify("data_imported");
  }
}

// Instância global do Store
const store = new Store();
