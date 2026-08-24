// ==========================================================================
// FOCO NO PAPIRO - GERENCIADOR DE ESTADO E LOCALSTORAGE (STORE)
// ==========================================================================

const STORAGE_KEY = "foco_no_papiro_v1";

class Store {
  constructor() {
    this.listeners = [];
    this.data = this.loadInitialData();
    this.ensureDailyMissions();
  }

  loadInitialData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Garante integridade e campos essenciais
        return this.sanitizeState(parsed);
      }
    } catch (e) {
      console.error("Erro ao carregar dados do LocalStorage:", e);
    }
    return this.getDefaultState();
  }

  getDefaultState() {
    const today = new Date().toISOString().split("T")[0];
    return {
      profile: {
        name: "Max Aldana",
        title: "Aspirante a Federal",
        avatar: "MA",
        xp: 3420,
        streak: 7,
        lastStudyDate: today,
        theme: "dark",
        dailyGoalMinutes: 240,
        weeklyGoalHours: 25,
        soundEnabled: true,
        ambientSound: "none"
      },
      activeConcursoId: "pf-agente",
      concursos: JSON.parse(JSON.stringify(DEFAULT_CONCURSOS)),
      questions: JSON.parse(JSON.stringify(DEFAULT_QUESTIONS)),
      flashcards: JSON.parse(JSON.stringify(DEFAULT_FLASHCARDS)),
      badges: JSON.parse(JSON.stringify(DEFAULT_BADGES)),
      leaderboard: JSON.parse(JSON.stringify(DEFAULT_LEADERBOARD)),
      studySessions: this.generateSeedSessions(),
      questionHistory: this.generateSeedQuestionHistory(),
      cadernoErros: [
        {
          id: "err-1",
          questionId: "q-3",
          reason: "pegadinha",
          note: "Lembrar: mandado judicial é EXCLUSIVAMENTE durante o dia! À noite apenas socorro/desastre/flagrante.",
          date: "2026-08-23",
          resolved: false
        },
        {
          id: "err-2",
          questionId: "q-10",
          reason: "conteudo",
          note: "Fato misto diminutivo: envolveu permuta de contas + variação do PL com juros.",
          date: "2026-08-22",
          resolved: false
        }
      ],
      ciclo: {
        currentSubjectIndex: 1,
        items: [
          { disciplinaId: "pf-port", name: "Português", minutesGoal: 60, minutesDone: 60, icon: "fa-book", color: "#3b82f6" },
          { disciplinaId: "pf-dir-adm", name: "Dir. Administrativo", minutesGoal: 60, minutesDone: 25, icon: "fa-scale-balanced", color: "#10b981" },
          { disciplinaId: "pf-info", name: "Informática & TI", minutesGoal: 90, minutesDone: 0, icon: "fa-network-wired", color: "#06b6d4" },
          { disciplinaId: "pf-dir-const", name: "Dir. Constitucional", minutesGoal: 60, minutesDone: 0, icon: "fa-landmark", color: "#f59e0b" },
          { disciplinaId: "pf-contab", name: "Contabilidade", minutesGoal: 75, minutesDone: 0, icon: "fa-calculator", color: "#8b5cf6" },
          { disciplinaId: "pf-dir-penal", name: "Dir. Penal", minutesGoal: 60, minutesDone: 0, icon: "fa-gavel", color: "#ef4444" },
          { disciplinaId: "pf-rlm", name: "Raciocínio Lógico", minutesGoal: 60, minutesDone: 0, icon: "fa-brain", color: "#ec4899" }
        ]
      },
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
      const dateStr = d.toISOString().split("T")[0];
      
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
    // Simula 45 respostas anteriores com acertos e erros
    for (let i = 0; i < 45; i++) {
      const isCorrect = Math.random() > 0.18; // ~82% acertos
      const d = new Date(today);
      d.setDate(d.getDate() - Math.floor(i / 4));
      history.push({
        id: `qh-${i}`,
        questionId: `q-${(i % 12) + 1}`,
        disciplinaId: ["pf-port", "pf-dir-adm", "pf-info", "pf-dir-const", "pf-dir-penal", "pf-contab"][i % 6],
        selectedOption: isCorrect ? "C" : "E",
        isCorrect: isCorrect,
        timeSpentSeconds: Math.floor(Math.random() * 90) + 30,
        date: d.toISOString().split("T")[0],
        timestamp: d.getTime()
      });
    }
    return history;
  }

  sanitizeState(state) {
    if (!state.concursos || state.concursos.length === 0) {
      state.concursos = JSON.parse(JSON.stringify(DEFAULT_CONCURSOS));
    }
    if (!state.questions || state.questions.length === 0) {
      state.questions = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
    }
    if (!state.flashcards || state.flashcards.length === 0) {
      state.flashcards = JSON.parse(JSON.stringify(DEFAULT_FLASHCARDS));
    }
    if (!state.badges || state.badges.length === 0) {
      state.badges = JSON.parse(JSON.stringify(DEFAULT_BADGES));
    }
    if (!state.leaderboard) {
      state.leaderboard = JSON.parse(JSON.stringify(DEFAULT_LEADERBOARD));
    }
    if (!state.cadernoErros) {
      state.cadernoErros = [];
    }
    if (!state.studySessions) {
      state.studySessions = [];
    }
    if (!state.questionHistory) {
      state.questionHistory = [];
    }
    if (!state.profile) {
      state.profile = this.getDefaultState().profile;
    }
    if (!state.ciclo) {
      state.ciclo = this.getDefaultState().ciclo;
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

  // ================= CONCURSO ATIVO =================
  getActiveConcurso() {
    const found = this.data.concursos.find(c => c.id === this.data.activeConcursoId);
    return found || this.data.concursos[0];
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
    const disc = concurso.disciplinas.find(d => d.id === disciplinaId);
    if (!disc) return;
    const topico = disc.topicos.find(t => t.id === topicoId);
    if (!topico) return;

    Object.assign(topico, fields);
    
    // Concede XP se concluiu teoria ou resumo
    if (fields.teoria === true) this.addXP(30, "Conclusão de Teoria");
    if (fields.resumo === true) this.addXP(20, "Criação de Resumo");
    if (fields.dominio && fields.dominio >= 4) this.addXP(40, "Domínio do Tópico");

    this.checkBadges();
    this.notify("edital_updated", { concursoId, disciplinaId, topicoId });
  }

  addDisciplina(concursoId, disciplina) {
    const concurso = this.data.concursos.find(c => c.id === concursoId);
    if (!concurso) return;
    if (!disciplina.id) disciplina.id = `disc-${Date.now()}`;
    if (!disciplina.topicos) disciplina.topicos = [];
    concurso.disciplinas.push(disciplina);
    this.rebuildCicloForConcurso(concursoId);
    this.notify("disciplina_added", { concursoId, disciplina });
  }

  addTopico(concursoId, disciplinaId, topico) {
    const concurso = this.data.concursos.find(c => c.id === concursoId);
    if (!concurso) return;
    const disc = concurso.disciplinas.find(d => d.id === disciplinaId);
    if (!disc) return;
    if (!topico.id) topico.id = `top-${Date.now()}`;
    disc.topicos.push(topico);
    this.notify("topico_added", { concursoId, disciplinaId, topico });
  }

  deleteTopico(concursoId, disciplinaId, topicoId) {
    const concurso = this.data.concursos.find(c => c.id === concursoId);
    if (!concurso) return;
    const disc = concurso.disciplinas.find(d => d.id === disciplinaId);
    if (!disc) return;
    disc.topicos = disc.topicos.filter(t => t.id !== topicoId);
    this.notify("topico_deleted", { concursoId, disciplinaId, topicoId });
  }

  // ================= SESSÕES DE ESTUDO & CRONÔMETRO =================
  addStudySession(session) {
    const newSession = {
      id: `sess-${Date.now()}`,
      concursoId: session.concursoId || this.data.activeConcursoId,
      disciplinaId: session.disciplinaId,
      topicoId: session.topicoId || null,
      durationMinutes: Math.round(session.durationMinutes),
      type: session.type || "teoria", // teoria, questoes, revisao
      date: new Date().toISOString().split("T")[0],
      timestamp: Date.now(),
      notes: session.notes || ""
    };

    this.data.studySessions.push(newSession);

    // XP por tempo estudado: 2 XP por minuto
    const xpGained = Math.round(newSession.durationMinutes * 2);
    this.addXP(xpGained, `Sessão de ${newSession.durationMinutes} min`);

    // Atualiza Streak diário
    this.updateStreak();

    // Atualiza progresso do ciclo de estudos
    this.advanceCiclo(session.disciplinaId, newSession.durationMinutes);

    // Atualiza missões diárias caso exista missão correspondente
    this.checkMissionsProgress(newSession);

    this.checkBadges();
    this.notify("session_added", newSession);
    return newSession;
  }

  updateStreak() {
    const today = new Date().toISOString().split("T")[0];
    const last = this.data.profile.lastStudyDate;
    
    if (last !== today) {
      const todayDate = new Date(today);
      const lastDate = new Date(last);
      const diffTime = Math.abs(todayDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        this.data.profile.streak += 1;
      } else if (diffDays > 1) {
        this.data.profile.streak = 1;
      }
      this.data.profile.lastStudyDate = today;
    }
  }

  // ================= CICLO DE ESTUDOS =================
  rebuildCicloForConcurso(concursoId) {
    const concurso = this.data.concursos.find(c => c.id === concursoId);
    if (!concurso) return;

    this.data.ciclo.items = concurso.disciplinas.map(d => {
      // Cálculo de minutos baseado no peso (peso 3 = 60m, peso 4 = 75m, peso 5 = 90m)
      const minutes = (d.weight || 3) * 15 + 15;
      return {
        disciplinaId: d.id,
        name: d.name,
        minutesGoal: minutes,
        minutesDone: 0,
        icon: d.icon || "fa-book",
        color: d.color || "#3b82f6"
      };
    });
    this.data.ciclo.currentSubjectIndex = 0;
  }

  advanceCiclo(disciplinaId, minutesStudied) {
    if (!this.data.ciclo || !this.data.ciclo.items) return;
    const item = this.data.ciclo.items.find(i => i.disciplinaId === disciplinaId);
    if (item) {
      item.minutesDone += minutesStudied;
      if (item.minutesDone >= item.minutesGoal) {
        // Passa para a próxima matéria do ciclo
        this.data.ciclo.currentSubjectIndex = (this.data.ciclo.currentSubjectIndex + 1) % this.data.ciclo.items.length;
        // Reseta o item se completou o ciclo todo
        if (this.data.ciclo.currentSubjectIndex === 0) {
          this.data.ciclo.items.forEach(i => i.minutesDone = 0);
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
      date: new Date().toISOString().split("T")[0],
      timestamp: Date.now()
    };

    this.data.questionHistory.push(record);

    // Atualiza estatísticas no tópico do edital se houver
    const concurso = this.getActiveConcurso();
    if (concurso) {
      const disc = concurso.disciplinas.find(d => d.id === data.disciplinaId || d.name.toLowerCase().includes(data.disciplinaName?.toLowerCase() || ""));
      if (disc && disc.topicos && disc.topicos.length > 0) {
        const topico = disc.topicos[0]; // Atualiza o primeiro tópico ou correspondente
        topico.questoesFeitas = (topico.questoesFeitas || 0) + 1;
        if (data.isCorrect) {
          topico.questoesAcertos = (topico.questoesAcertos || 0) + 1;
        }
      }
    }

    // Se errou, adiciona automaticamente ou sugere ao Caderno de Erros
    if (!data.isCorrect) {
      this.addToCadernoErrosAuto(data.questionId);
    } else {
      // Concede XP: 15 XP por acerto
      this.addXP(15, "Questão Correta!");
    }

    this.checkBadges();
    this.notify("question_answered", record);
    return record;
  }

  addToCadernoErrosAuto(questionId) {
    const exists = this.data.cadernoErros.some(e => e.questionId === questionId && !e.resolved);
    if (!exists) {
      this.data.cadernoErros.push({
        id: `err-${Date.now()}`,
        questionId: questionId,
        reason: "desconhecimento",
        note: "Questão errada em sessão de prática. Revisar fundamentos da banca.",
        date: new Date().toISOString().split("T")[0],
        resolved: false
      });
    }
  }

  updateCadernoErro(errorId, updates) {
    const item = this.data.cadernoErros.find(e => e.id === errorId);
    if (item) {
      Object.assign(item, updates);
      if (updates.resolved) {
        this.addXP(25, "Erro Superado no Caderno de Erros! 🎯");
      }
      this.notify("caderno_updated", item);
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
      frente: card.frente,
      verso: card.verso,
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      dueDate: new Date().toISOString().split("T")[0]
    };
    this.data.flashcards.push(newCard);
    this.addXP(10, "Novo Flashcard Criado");
    this.notify("flashcard_added", newCard);
    return newCard;
  }

  reviewFlashcard(cardId, quality) {
    // quality: 0 (Errei), 3 (Difícil), 4 (Bom), 5 (Fácil)
    const card = this.data.flashcards.find(c => c.id === cardId);
    if (!card) return;

    if (quality < 3) {
      card.repetitions = 0;
      card.interval = 1;
    } else {
      if (card.repetitions === 0) {
        card.interval = 1;
      } else if (card.repetitions === 1) {
        card.interval = 6;
      } else {
        card.interval = Math.round(card.interval * card.easeFactor);
      }
      card.repetitions += 1;
    }

    // Calcula novo Ease Factor (Fórmula SuperMemo SM-2)
    card.easeFactor = Math.max(1.3, card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

    // Define nova data de revisão
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + card.interval);
    card.dueDate = nextDate.toISOString().split("T")[0];

    this.addXP(10, "Flashcard Revisado");
    this.checkBadges();
    this.notify("flashcard_reviewed", card);
    return card;
  }

  deleteFlashcard(cardId) {
    this.data.flashcards = this.data.flashcards.filter(c => c.id !== cardId);
    this.notify("flashcard_deleted", cardId);
  }

  // ================= MISSÕES DIÁRIAS =================
  ensureDailyMissions(forceRebuild = false) {
    const today = new Date().toISOString().split("T")[0];
    if (!forceRebuild && this.data.dailyMissions && this.data.dailyMissions.length > 0 && this.data.dailyMissions[0].date === today) {
      return;
    }

    const concurso = this.getActiveConcurso();
    const discs = concurso.disciplinas || [];
    
    // Cria 4 missões inteligentes do dia
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
        xpReward: 90
      },
      {
        id: `mis-2-${today}`,
        date: today,
        title: `Bateria de 20 Questões: ${discs[1]?.name || "Direito Administrativo"}`,
        desc: "Resolver 20 questões no banco com foco em alto percentual de acerto (>80%).",
        type: "questoes",
        disciplinaId: discs[1]?.id || "",
        targetQuestions: 20,
        completed: false,
        xpReward: 120
      },
      {
        id: `mis-3-${today}`,
        date: today,
        title: `Revisão Ativa de Flashcards do Dia`,
        desc: "Revisar todos os cards pendentes com repetição espaçada.",
        type: "flashcards",
        targetCards: 10,
        completed: false,
        xpReward: 75
      },
      {
        id: `mis-4-${today}`,
        date: today,
        title: `Papiro Noturno: ${discs[2]?.name || "Informática"}`,
        desc: "Completar 1 ciclo de 50 minutos de concentração plena no Pomodoro.",
        type: "pomodoro",
        disciplinaId: discs[2]?.id || "",
        targetMinutes: 50,
        completed: false,
        xpReward: 100
      }
    ];

    this.data.dailyMissions = missions;
    this.save();
  }

  toggleMission(missionId) {
    const m = this.data.dailyMissions.find(x => x.id === missionId);
    if (m) {
      m.completed = !m.completed;
      if (m.completed) {
        this.addXP(m.xpReward, `Missão Cumprida: ${m.title}! 🏆`);
      }
      this.notify("mission_updated", m);
    }
  }

  checkMissionsProgress(session) {
    if (!this.data.dailyMissions) return;
    this.data.dailyMissions.forEach(m => {
      if (!m.completed && m.disciplinaId === session.disciplinaId && m.type === session.type) {
        if (session.durationMinutes >= (m.targetMinutes || 30)) {
          m.completed = true;
          this.addXP(m.xpReward, `Missão Concluída Automaticamente: ${m.title} 🎯`);
        }
      }
    });
  }

  // ================= GAMIFICAÇÃO & XP =================
  addXP(amount, reason = "") {
    this.data.profile.xp += amount;
    const oldLevel = this.data.profile.level || 1;
    const newLevel = this.calculateLevel(this.data.profile.xp);
    this.data.profile.level = newLevel;

    // Atualiza leaderboard para o usuário
    const userInLb = this.data.leaderboard.find(l => l.isUser);
    if (userInLb) {
      userInLb.xp = this.data.profile.xp;
    }

    if (newLevel > oldLevel) {
      this.notify("level_up", { newLevel, title: this.getRankTitle(newLevel) });
    }
    this.save();
  }

  calculateLevel(xp) {
    // 500 XP por nível com escalonamento suave
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  getRankTitle(level) {
    const ranks = [
      "Recruta", "Aspirante", "Soldado de 1ª Classe", "Cabo do Papiro",
      "Sargento Operacional", "Subtenente Focado", "Tenente Tático",
      "Capitão Estrategista", "Major da Aprovação", "Coronel Caveira",
      "General Aprovado", "Mestre Supremo do Concurso"
    ];
    return ranks[Math.min(level - 1, ranks.length - 1)] || "General Aprovado";
  }

  checkBadges() {
    const totalMinutes = this.data.studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const totalQuestions = this.data.questionHistory.length;
    const correctQuestions = this.data.questionHistory.filter(q => q.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctQuestions / totalQuestions) * 100 : 0;
    const streak = this.data.profile.streak;

    this.data.badges.forEach(b => {
      if (!b.unlocked) {
        let shouldUnlock = false;
        if (b.id === "badge-first-study" && totalMinutes > 0) shouldUnlock = true;
        if (b.id === "badge-streak-7" && streak >= 7) shouldUnlock = true;
        if (b.id === "badge-50-questions" && totalQuestions >= 50) shouldUnlock = true;
        if (b.id === "badge-centurion" && totalMinutes >= 6000) shouldUnlock = true;
        if (b.id === "badge-simulado-pro" && totalQuestions >= 20 && accuracy >= 80) shouldUnlock = true;

        if (shouldUnlock) {
          b.unlocked = true;
          b.date = new Date().toISOString().split("T")[0];
          this.addXP(200, `Conquista Desbloqueada: ${b.title}! 🎖️`);
          this.notify("badge_unlocked", b);
        }
      }
    });
  }

  // ================= ESTATÍSTICAS E CÁLCULOS =================
  getTodayStats() {
    const today = new Date().toISOString().split("T")[0];
    const todaySessions = this.data.studySessions.filter(s => s.date === today);
    const minutesToday = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    
    const todayQuestions = this.data.questionHistory.filter(q => q.date === today);
    const questionsCount = todayQuestions.length;
    const correctCount = todayQuestions.filter(q => q.isCorrect).length;
    const accuracy = questionsCount > 0 ? Math.round((correctCount / questionsCount) * 100) : 0;

    const cardsDue = this.data.flashcards.filter(c => c.dueDate <= today).length;

    return {
      minutesToday,
      hoursToday: (minutesToday / 60).toFixed(1),
      goalMinutes: this.data.profile.dailyGoalMinutes || 240,
      percentGoal: Math.min(100, Math.round((minutesToday / (this.data.profile.dailyGoalMinutes || 240)) * 100)),
      questionsCount,
      accuracy,
      cardsDue,
      streak: this.data.profile.streak
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
      const dateStr = d.toISOString().split("T")[0];
      const dayName = dayLabels[d.getDay()];
      days.push(dayName);

      const dayMins = this.data.studySessions
        .filter(s => s.date === dateStr)
        .reduce((acc, s) => acc + s.durationMinutes, 0);
      minutesByDay.push(Number((dayMins / 60).toFixed(1)));

      const dayQ = this.data.questionHistory.filter(q => q.date === dateStr).length;
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

    this.data.studySessions.forEach(s => {
      if (map[s.disciplinaId]) {
        map[s.disciplinaId].minutes += s.durationMinutes;
      }
    });

    this.data.questionHistory.forEach(q => {
      if (map[q.disciplinaId]) {
        map[q.disciplinaId].questions += 1;
        if (q.isCorrect) map[q.disciplinaId].correct += 1;
      }
    });

    return Object.values(map);
  }

  getEditalOverallProgress(concursoId = null) {
    const cid = concursoId || this.data.activeConcursoId;
    const concurso = this.data.concursos.find(c => c.id === cid);
    if (!concurso) return { percent: 0, totalTopicos: 0, concluidos: 0 };

    let total = 0;
    let completed = 0;

    concurso.disciplinas.forEach(d => {
      (d.topicos || []).forEach(t => {
        total++;
        if (t.teoria && t.resumo) completed++;
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
    this.save();
    this.notify("data_reset");
  }
}

// Instância global do Store
const store = new Store();
