// ==========================================================================
// QG DO CONCURSEIRO - SUPABASE SERVICE & OFFLINE-FIRST SYNC ENGINE (ESM)
// ==========================================================================
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { store } from "./store";
import { showToast, openUpgradeModal, openAuthModal } from "../app";

const SUPABASE_URL = "https://enkdykbbayloriedogzj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_0yq01ZlZNTS-NOYar9cZjQ_TarnMj2t";

class SupabaseService {
  client: SupabaseClient | null;
  currentUser: User | null;
  profile: any;
  isInitialized: boolean;
  isSyncing: boolean;
  syncTimeout: any;

  constructor() {
    this.client = null;
    this.currentUser = null;
    this.profile = null;
    this.isInitialized = false;
    this.isSyncing = false;
    this.syncTimeout = null;
  }

  init() {
    try {
      this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      this.isInitialized = true;
      this.checkSession();
      this.listenAuthChanges();
      this.bindNetworkListeners();
      console.log("Supabase Client inicializado com sucesso.");
    } catch (e) {
      console.warn("Falha ao inicializar cliente do Supabase. Operando em modo offline/local.", e);
    }
  }

  bindNetworkListeners() {
    window.addEventListener("online", () => {
      console.log("Conexao restabelecida. Disparando sincronizacao em segundo plano...");
      this.scheduleSync(1000);
    });
  }

  async checkSession() {
    if (!this.client) return;
    try {
      const { data: { session }, error } = await this.client.auth.getSession();
      if (session && session.user) {
        this.currentUser = session.user;
        await this.loadUserProfile(session.user.id);
        await this.syncCloudData();
      }
      this.updateAuthUI();
    } catch (e) {
      console.error("Erro ao verificar sessão do Supabase:", e);
    }
  }

  listenAuthChanges() {
    if (!this.client) return;
    this.client.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        if (typeof (window as any).openResetPasswordModal === "function") {
          (window as any).openResetPasswordModal();
        }
      }
      if (session && session.user) {
        this.currentUser = session.user;
        await this.loadUserProfile(session.user.id);
        await this.syncCloudData();
      } else {
        this.currentUser = null;
        this.profile = null;
      }
      this.updateAuthUI();
    });
  }

  // ================= AUTENTICAÇÃO =================

  async signUp(name, email, password) {
    if (!this.client) throw new Error("Serviço de autenticação não inicializado.");
    
    // Redireciona sempre para o domínio onde o usuário está acessando
    const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}` : undefined;

    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: { name: name },
        emailRedirectTo: redirectUrl
      }
    });
    if (error) throw error;
    if (data.user && data.session) {
      this.currentUser = data.user;
      await this.pushLocalDataToCloud();
      this.updateAuthUI();
    }
    return data;
  }

  async signIn(email, password) {
    if (!this.client) throw new Error("Serviço de autenticação não inicializado.");
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    this.currentUser = data.user;
    await this.loadUserProfile(data.user.id);
    await this.syncCloudData();
    this.updateAuthUI();
    return data;
  }

  async signOut() {
    if (this.client) {
      try {
        await this.client.auth.signOut();
      } catch (e) {}
    }
    this.currentUser = null;
    this.profile = null;
    this.updateAuthUI();
    showToast("Você saiu da sua conta na nuvem. O app continua em modo local.", "info");
  }

  async resetPasswordForEmail(email: string) {
    if (!this.client) {
      return { message: "E-mail de recuperação enviado." };
    }
    const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}#reset-password` : undefined;
    const { data, error } = await this.client.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    if (error) throw error;
    return data;
  }

  async updateUserPassword(newPassword: string) {
    if (!this.client) {
      return { message: "Senha atualizada." };
    }
    const { data, error } = await this.client.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return data;
  }

  // ================= PERFIL DO USUÁRIO =================

  async loadUserProfile(userId) {
    if (!this.client) return;
    try {
      const { data, error } = await this.client
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (data) {
        this.profile = data;
        store.data.profile.name = data.name || store.data.profile.name;
        store.data.profile.plan_tier = data.plan_tier || store.data.profile.plan_tier || "free";
        store.data.profile.dailyGoalMinutes = data.daily_goal_minutes || store.data.profile.dailyGoalMinutes;
        store.data.profile.weeklyGoalHours = data.weekly_goal_hours || store.data.profile.weeklyGoalHours;
        store.save();
      }
    } catch (e) {
      console.warn("Perfil em criação ou aviso de leitura:", e);
    }
  }

  // ================= MOTOR DE SINCRONIZAÇÃO OFFLINE-FIRST =================

  scheduleSync(delay = 2500) {
    if (!this.client || !this.currentUser || !navigator.onLine) return;
    if (this.syncTimeout) clearTimeout(this.syncTimeout);
    this.syncTimeout = setTimeout(() => {
      this.syncCloudData();
    }, delay);
  }

  async syncCloudData() {
    if (!this.client || !this.currentUser || this.isSyncing) return;
    this.isSyncing = true;

    try {
      const uid = this.currentUser.id;

      // 1. SINCRONIZA GAMIFICAÇÃO & PERFIL (BIDIRECIONAL)
      const { data: cloudGam } = await this.client.from("gamification").select("*").eq("user_id", uid).single();
      if (cloudGam) {
        const localXp = store.data.profile.xp || 0;
        const cloudXp = cloudGam.xp || 0;
        const highestXp = Math.max(localXp, cloudXp);

        const localBadges = store.data.profile.badges || [];
        const cloudBadges = Array.isArray(cloudGam.badges) ? cloudGam.badges : [];
        const mergedBadges = Array.from(new Set([...localBadges, ...cloudBadges]));

        store.data.profile.xp = highestXp;
        store.data.profile.level = store.calculateLevel(highestXp);
        store.data.profile.badges = mergedBadges;
        store.data.profile.streak = Math.max(store.data.profile.streak || 0, cloudGam.streak_count || 0);

        // Atualiza na nuvem se local tinha dados maiores
        if (localXp > cloudXp || mergedBadges.length > cloudBadges.length) {
          await this.client.from("gamification").upsert({
            user_id: uid,
            xp: highestXp,
            level: store.data.profile.level,
            streak_count: store.data.profile.streak,
            badges: mergedBadges,
            updated_at: new Date().toISOString()
          });
        }
      } else {
        // Envia primeira gamificação
        await this.client.from("gamification").upsert({
          user_id: uid,
          xp: store.data.profile.xp || 0,
          level: store.data.profile.level || 1,
          streak_count: store.data.profile.streak || 0,
          badges: store.data.profile.badges || [],
          updated_at: new Date().toISOString()
        });
      }

      // 1.1 SINCRONIZA TABELA DE PERFIL
      try {
        await this.client.from("profiles").upsert({
          id: uid,
          name: store.data.profile.name,
          daily_goal_minutes: store.data.profile.dailyGoalMinutes,
          weekly_goal_hours: store.data.profile.weeklyGoalHours,
          updated_at: new Date().toISOString()
        }, { onConflict: "id" });
      } catch (e) {
        console.warn("Aviso ao sincronizar perfil com Supabase:", e);
      }

      // 2. SINCRONIZA SESSÕES DE ESTUDO (STUDY_SESSIONS)
      const { data: cloudSessions } = await this.client.from("study_sessions").select("*").eq("user_id", uid);
      const localSessions = store.data.studySessions || [];
      const sessionMap = new Map();

      // Mapeia sessões locais
      localSessions.forEach(s => sessionMap.set(s.id, {
        id: s.id,
        user_id: uid,
        disciplina_id: s.disciplinaId,
        topic_id: s.topicId || null,
        session_type: s.type || "pomodoro",
        duration_minutes: s.durationMinutes,
        date: s.date,
        timestamp: s.timestamp || Date.now(),
        updated_at: s.updated_at || new Date().toISOString()
      }));

      // Mescla com sessões da nuvem
      (cloudSessions || []).forEach(cs => {
        const local = sessionMap.get(cs.id);
        if (!local) {
          sessionMap.set(cs.id, cs);
        } else {
          // Cloud wins if it has a more recent update
          const cloudTime = cs.updated_at ? new Date(cs.updated_at).getTime() : 0;
          const localTime = local.updated_at ? new Date(local.updated_at).getTime() : 0;
          if (cloudTime > localTime) {
            sessionMap.set(cs.id, cs);
          }
        }
      });

      const mergedSessions = Array.from(sessionMap.values()).map(s => ({
        id: s.id,
        disciplinaId: s.disciplina_id,
        topicId: s.topic_id,
        type: s.session_type,
        durationMinutes: s.duration_minutes,
        date: s.date,
        timestamp: Number(s.timestamp),
        updated_at: s.updated_at
      }));

      store.data.studySessions = mergedSessions;

      // Envia sessões locais que não estavam na nuvem ou foram atualizadas
      const cloudSessionMap = new Map((cloudSessions || []).map(cs => [cs.id, cs]));
      const newSessionsToUpload = Array.from(sessionMap.values()).filter(s => {
        const cloud = cloudSessionMap.get(s.id);
        if (!cloud) return true; // New record
        const cloudTime = cloud.updated_at ? new Date(cloud.updated_at).getTime() : 0;
        const localTime = s.updated_at ? new Date(s.updated_at).getTime() : 0;
        return localTime > cloudTime; // Updated locally
      });
      if (newSessionsToUpload.length > 0) {
        await this.client.from("study_sessions").upsert(newSessionsToUpload);
      }

      // 3. SINCRONIZA HISTÓRICO DE QUESTÕES (QUESTION_ATTEMPTS)
      const { data: cloudAttempts } = await this.client.from("question_attempts").select("*").eq("user_id", uid);
      const localHistory = store.data.questionHistory || [];
      const attemptMap = new Map();

      localHistory.forEach(h => {
        const attemptId = h.id || `att-${h.timestamp}-${h.questionId}`;
        attemptMap.set(attemptId, {
          id: attemptId,
          user_id: uid,
          question_id: h.questionId,
          selected_answer: h.selectedAnswer || h.userAnswer || "",
          is_correct: !!h.isCorrect,
          mode: h.mode || "treino",
          timestamp: h.timestamp || Date.now(),
          updated_at: h.updated_at || new Date().toISOString()
        });
      });

      (cloudAttempts || []).forEach(ca => {
        const local = attemptMap.get(ca.id);
        if (!local) {
          attemptMap.set(ca.id, ca);
        } else {
          const cloudTime = ca.updated_at ? new Date(ca.updated_at).getTime() : 0;
          const localTime = local.updated_at ? new Date(local.updated_at).getTime() : 0;
          if (cloudTime > localTime) {
            attemptMap.set(ca.id, ca);
          }
        }
      });

      store.data.questionHistory = Array.from(attemptMap.values()).map(a => ({
        id: a.id,
        questionId: a.question_id,
        selectedAnswer: a.selected_answer,
        isCorrect: a.is_correct,
        mode: a.mode,
        timestamp: Number(a.timestamp),
        date: new Date(Number(a.timestamp)).toISOString().split("T")[0],
        updated_at: a.updated_at
      }));

      const cloudAttemptMap = new Map((cloudAttempts || []).map(ca => [ca.id, ca]));
      const newAttemptsToUpload = Array.from(attemptMap.values()).filter(a => {
        const cloud = cloudAttemptMap.get(a.id);
        if (!cloud) return true;
        const cloudTime = cloud.updated_at ? new Date(cloud.updated_at).getTime() : 0;
        const localTime = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        return localTime > cloudTime;
      });
      if (newAttemptsToUpload.length > 0) {
        await this.client.from("question_attempts").upsert(newAttemptsToUpload.slice(0, 100)); // Lotes de 100
      }

      // 4. SINCRONIZA CADERNO DE ERROS (USER_ERRORS)
      const { data: cloudErrors } = await this.client.from("user_errors").select("*").eq("user_id", uid);
      const localErrors = store.data.cadernoErros || [];
      const errorMap = new Map();

      localErrors.forEach(e => errorMap.set(e.id, {
        id: e.id,
        user_id: uid,
        question_id: e.questionId,
        reason: e.reason || "conteudo",
        notes: e.note || e.notes || "",
        resolved: !!e.resolved,
        created_at: e.date ? new Date(e.date).toISOString() : new Date().toISOString(),
        updated_at: e.updated_at || new Date().toISOString()
      }));

      (cloudErrors || []).forEach(ce => {
        const local = errorMap.get(ce.id);
        if (!local) {
          errorMap.set(ce.id, ce);
        } else {
          const cloudTime = ce.updated_at ? new Date(ce.updated_at).getTime() : 0;
          const localTime = local.updated_at ? new Date(local.updated_at).getTime() : 0;
          if (cloudTime > localTime) {
            errorMap.set(ce.id, ce);
          }
        }
      });

      store.data.cadernoErros = Array.from(errorMap.values()).map(e => ({
        id: e.id,
        questionId: e.question_id,
        reason: e.reason,
        note: e.notes,
        resolved: e.resolved,
        date: e.created_at ? e.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
        updated_at: e.updated_at
      }));

      const cloudErrorMap = new Map((cloudErrors || []).map(ce => [ce.id, ce]));
      const newErrorsToUpload = Array.from(errorMap.values()).filter(e => {
        const cloud = cloudErrorMap.get(e.id);
        if (!cloud) return true;
        const cloudTime = cloud.updated_at ? new Date(cloud.updated_at).getTime() : 0;
        const localTime = e.updated_at ? new Date(e.updated_at).getTime() : 0;
        return localTime > cloudTime;
      });
      if (newErrorsToUpload.length > 0) {
        await this.client.from("user_errors").upsert(newErrorsToUpload);
      }

      // 5. SINCRONIZA FLASHCARDS (FLASHCARDS & FLASHCARDS_PROGRESS)
      try {
        const { data: cloudCards } = await this.client.from("flashcards").select("*").eq("user_id", uid);
        const { data: cloudProg } = await this.client.from("flashcards_progress").select("*").eq("user_id", uid);
        const localCards = store.data.flashcards || [];
        const cardMap = new Map();

        localCards.forEach(c => cardMap.set(c.id, {
          id: c.id,
          disciplinaId: c.disciplinaId,
          topicId: c.topicId || null,
          frente: c.frente || (c as any).front || "",
          verso: c.verso || (c as any).back || "",
          interval: c.interval || 1,
          repetitions: c.repetitions || 0,
          easeFactor: c.easeFactor || 2.5,
          dueDate: c.dueDate || store.getLocalDateString(),
          isSystem: !!c.isSystem
        }));

        const progMap = new Map((cloudProg || []).map(p => [p.card_id, p]));

        (cloudCards || []).forEach(cc => {
          const prog = progMap.get(cc.id);
          const existing = cardMap.get(cc.id);
          if (!existing) {
            cardMap.set(cc.id, {
              id: cc.id,
              disciplinaId: cc.disciplina_id,
              topicId: cc.topic_id,
              frente: cc.front,
              verso: cc.back,
              interval: prog ? prog.interval : 1,
              repetitions: prog ? prog.repetitions : 0,
              easeFactor: prog ? Number(prog.ease_factor) : 2.5,
              dueDate: prog ? prog.due_date : store.getLocalDateString(),
              isSystem: !!cc.is_system
            });
          }
        });

        store.data.flashcards = Array.from(cardMap.values());

        // Envia flashcards customizados locais que não estão na nuvem
        const customLocalCards = Array.from(cardMap.values()).filter(c => !c.isSystem);
        if (customLocalCards.length > 0) {
          const cardsToUpload = customLocalCards.map(c => ({
            id: c.id,
            disciplina_id: c.disciplinaId,
            topic_id: c.topicId || null,
            front: c.frente,
            back: c.verso,
            is_system: false,
            user_id: uid
          }));
          await this.client.from("flashcards").upsert(cardsToUpload);

          const progToUpload = customLocalCards.map(c => ({
            id: `prog-${uid}-${c.id}`,
            user_id: uid,
            card_id: c.id,
            interval: c.interval,
            repetitions: c.repetitions,
            ease_factor: c.easeFactor,
            due_date: c.dueDate,
            updated_at: new Date().toISOString()
          }));
          await this.client.from("flashcards_progress").upsert(progToUpload);
        }
      } catch (fcErr) {
        console.warn("Aviso ao sincronizar flashcards na nuvem:", fcErr);
      }

      // 6. Salva estado unificado no store
      store.save();

      console.log("Sincronização em nuvem concluída com sucesso.");
    } catch (err) {
      console.warn("Falha durante a sincronização em nuvem:", err);
    } finally {
      this.isSyncing = false;
    }
  }

  async pushLocalDataToCloud() {
    return this.syncCloudData();
  }

  // ================= SALVAMENTOS PONTUAIS ASSÍNCRONOS =================

  async saveFlashcardToCloud(card: any) {
    if (!this.client || !this.currentUser) return;
    try {
      await this.client.from("flashcards").upsert({
        id: card.id,
        disciplina_id: card.disciplinaId,
        topic_id: card.topicId || null,
        front: card.frente || card.front || "",
        back: card.verso || card.back || "",
        is_system: !!card.isSystem,
        user_id: this.currentUser.id
      });

      await this.client.from("flashcards_progress").upsert({
        id: `prog-${this.currentUser.id}-${card.id}`,
        user_id: this.currentUser.id,
        card_id: card.id,
        interval: card.interval || 1,
        repetitions: card.repetitions || 0,
        ease_factor: card.easeFactor || 2.5,
        due_date: card.dueDate || new Date().toISOString().split("T")[0],
        last_reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn("Erro ao salvar flashcard na nuvem:", e);
    }
  }

  async saveTopicoProgressToCloud(topico: any, disciplinaId: string) {
    if (!this.client || !this.currentUser) return;
    try {
      await this.client.from("topicos").upsert({
        id: topico.id,
        disciplina_id: disciplinaId,
        user_id: this.currentUser.id,
        title: topico.title,
        teoria: !!topico.teoria,
        teoria_date: topico.teoriaDate || null,
        resumo: !!topico.resumo,
        questoes_feitas: topico.questoesFeitas || 0,
        questoes_acertos: topico.questoesAcertos || 0,
        r24h: !!topico.r24h,
        r7d: !!topico.r7d,
        r30d: !!topico.r30d,
        dominio: topico.dominio || 1,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn("Erro ao salvar progresso de tópico na nuvem:", e);
    }
  }

  async saveSessionToCloud(session: any) {
    if (!this.client || !this.currentUser) return;
    try {
      await this.client.from("study_sessions").upsert({
        id: session.id,
        user_id: this.currentUser.id,
        disciplina_id: session.disciplinaId,
        topic_id: session.topicId || null,
        session_type: session.type || "pomodoro",
        duration_minutes: session.durationMinutes,
        date: session.date,
        timestamp: session.timestamp || Date.now(),
        updated_at: new Date().toISOString()
      });
      this.scheduleSync(3000);
    } catch (e) {
      console.warn("Erro ao salvar sessão na nuvem:", e);
    }
  }

  async saveQuestionAnswerToCloud(answer: any) {
    if (!this.client || !this.currentUser) return;
    try {
      await this.client.from("question_attempts").upsert({
        id: answer.id || `att-${Date.now()}-${answer.questionId}`,
        user_id: this.currentUser.id,
        question_id: answer.questionId,
        selected_answer: answer.selectedAnswer || "",
        is_correct: answer.isCorrect,
        mode: answer.mode || "treino",
        timestamp: answer.timestamp || Date.now(),
        updated_at: new Date().toISOString()
      });
      this.scheduleSync(3000);
    } catch (e) {
      console.warn("Erro ao salvar resposta na nuvem:", e);
    }
  }

  async saveErrorToCloud(errItem: any) {
    if (!this.client || !this.currentUser) return;
    try {
      await this.client.from("user_errors").upsert({
        id: errItem.id,
        user_id: this.currentUser.id,
        question_id: errItem.questionId,
        reason: errItem.reason || "conteudo",
        notes: errItem.note || "",
        resolved: !!errItem.resolved,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn("Erro ao salvar erro na nuvem:", e);
    }
  }

  // ================= CONTROLE DE MONETIZAÇÃO / PLANOS =================

  isProUser() {
    if (typeof store !== "undefined" && store.isPro && store.isPro()) return true;
    return this.profile && (this.profile.plan_tier === "pro" || this.profile.plan_tier === "vip");
  }

  isAuthenticated() {
    return !!(this.currentUser);
  }

  updateAuthUI() {
    const authBtn = document.getElementById("header-auth-btn");
    const userAvatar = document.getElementById("user-avatar-text");
    const userNameEl = document.getElementById("dash-user-name");
    const userRankEl = document.getElementById("dash-user-rank");
    const planBadge = document.getElementById("header-plan-badge");
    const isPro = this.isProUser();
    const isAuth = this.isAuthenticated();

    if (isAuth) {
      const name = this.profile?.name || this.currentUser?.user_metadata?.name || store.data?.profile?.name || "Concurseiro";

      if (authBtn) {
        authBtn.innerHTML = `<i class="fa-solid fa-cloud-check"></i> Sair (${name.split(' ')[0]})`;
        authBtn.className = "btn btn-secondary btn-sm";
        authBtn.onclick = () => this.signOut();
      }

      if (userAvatar) {
        userAvatar.textContent = name.substring(0, 2).toUpperCase();
      }
      if (userNameEl) userNameEl.textContent = name;
      if (userRankEl) userRankEl.textContent = isPro ? "⭐ Assinante PRO" : (typeof store !== "undefined" ? store.getRankTitle(store.data.profile?.level || 1) : "Recruta");

      if (planBadge) {
        planBadge.innerHTML = isPro 
          ? `<span class="badge-plan-pro"><i class="fa-solid fa-crown"></i> PRO</span>`
          : `<span class="badge-plan-free" onclick="openUpgradeModal()"><i class="fa-solid fa-bolt"></i> Seja PRO</span>`;
      }
    } else {
      const localName = (typeof store !== "undefined" && store.data?.profile?.name) || "Concurseiro(a)";
      if (authBtn) {
        authBtn.innerHTML = `<i class="fa-solid fa-user"></i> Entrar / Sincronizar`;
        authBtn.className = "btn btn-primary btn-sm";
        authBtn.onclick = () => {
          if (typeof openAuthModal === "function") openAuthModal("login");
        };
      }
      if (userAvatar) {
        userAvatar.textContent = localName.substring(0, 2).toUpperCase();
      }
      if (userNameEl) userNameEl.textContent = localName;
      if (userRankEl) userRankEl.textContent = isPro ? "⭐ Assinante PRO" : (typeof store !== "undefined" ? store.getRankTitle(store.data?.profile?.level || 1) : "Recruta");
      if (planBadge) {
        planBadge.innerHTML = isPro
          ? `<span class="badge-plan-pro"><i class="fa-solid fa-crown"></i> PRO</span>`
          : `<span class="badge-plan-free" onclick="openUpgradeModal()"><i class="fa-solid fa-bolt"></i> Seja PRO</span>`;
      }
    }
  }
}

const db = new SupabaseService();
export { SupabaseService, db };
if (typeof window !== "undefined") {
  window.SupabaseService = SupabaseService;
  window.db = db;
}
