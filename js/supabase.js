// ==========================================================================
// QG DO CONCURSEIRO - SUPABASE CLIENT & AUTENTICAÇÃO
// ==========================================================================

const SUPABASE_URL = "https://enkdykbbayloriedogzj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_0yq01ZlZNTS-NOYar9cZjQ_TarnMj2t";

class SupabaseService {
  constructor() {
    this.client = null;
    this.currentUser = null;
    this.profile = null;
    this.isInitialized = false;
  }

  init() {
    if (window.supabase && typeof window.supabase.createClient === "function") {
      this.client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      this.isInitialized = true;
      this.checkSession();
      this.listenAuthChanges();
    } else {
      console.warn("SDK do Supabase não carregado. Operando em modo offline/localStorage.");
    }
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
    if (!this.client) throw new Error("Supabase não inicializado.");
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: { name: name }
      }
    });
    if (error) throw error;
    return data;
  }

  async signIn(email, password) {
    if (!this.client) throw new Error("Supabase não inicializado.");
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
    if (!this.client) return;
    await this.client.auth.signOut();
    this.currentUser = null;
    this.profile = null;
    this.updateAuthUI();
    showToast("Você saiu da sua conta.", "info");
  }

  // ================= PERFIL E SINCRONIZAÇÃO EM NUVEM =================

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
        // Atualiza os dados do Store local com os dados da nuvem
        store.data.profile.name = data.name || store.data.profile.name;
        store.data.profile.xp = data.xp || store.data.profile.xp;
        store.data.profile.level = data.level || store.data.profile.level;
        store.data.profile.streak = data.streak || store.data.profile.streak;
        store.data.profile.plan_tier = data.plan_tier || "free";
        store.save();
      }
    } catch (e) {
      console.warn("Perfil sendo criado ou erro na leitura:", e);
    }
  }

  async syncCloudData() {
    if (!this.client || !this.currentUser) return;
    try {
      // 1. Carrega Sessões de Estudo da Nuvem
      const { data: sessions } = await this.client
        .from("study_sessions")
        .select("*")
        .eq("user_id", this.currentUser.id);

      if (sessions && sessions.length > 0) {
        const cloudSessions = sessions.map(s => ({
          id: s.id,
          concursoId: s.concurso_id,
          disciplinaId: s.disciplina_id,
          durationMinutes: s.duration_minutes,
          type: s.type,
          date: s.session_date,
          timestamp: new Date(s.created_at).getTime()
        }));
        const localOnly = (store.data.studySessions || []).filter(ls => !cloudSessions.some(cs => cs.id === ls.id));
        store.data.studySessions = [...cloudSessions, ...localOnly];
      }

      // 2. Carrega Flashcards da Nuvem
      const { data: cards } = await this.client
        .from("flashcards")
        .select("*")
        .eq("user_id", this.currentUser.id);

      if (cards && cards.length > 0) {
        const cloudCards = cards.map(c => ({
          id: c.id,
          disciplinaId: c.disciplina_id,
          frente: c.frente,
          verso: c.verso,
          interval: c.interval_days,
          repetitions: c.repetitions,
          easeFactor: Number(c.ease_factor),
          dueDate: c.due_date
        }));
        const localOnly = (store.data.flashcards || []).filter(lc => !cloudCards.some(cc => cc.id === lc.id));
        store.data.flashcards = [...cloudCards, ...localOnly];
      }

      // 3. Carrega Caderno de Erros da Nuvem
      const { data: errors } = await this.client
        .from("caderno_erros")
        .select("*")
        .eq("user_id", this.currentUser.id);

      if (errors && errors.length > 0) {
        const cloudErrors = errors.map(e => ({
          id: e.id,
          questionId: e.question_id,
          reason: e.reason,
          note: e.note,
          resolved: e.resolved,
          date: e.created_at.split("T")[0]
        }));
        const localOnly = (store.data.cadernoErros || []).filter(le => !cloudErrors.some(ce => ce.id === le.id));
        store.data.cadernoErros = [...cloudErrors, ...localOnly];
      }

      store.save();
      // Atualiza a interface
      if (typeof app !== "undefined" && app.handleRoute) {
        app.activateViewModule(app.currentRoute);
      }
    } catch (err) {
      console.error("Erro na sincronização:", err);
    }
  }

  // ================= SALVAMENTO EM TEMPO REAL =================

  async saveSessionToCloud(session) {
    if (!this.client || !this.currentUser) return;
    try {
      await this.client.from("study_sessions").insert([{
        user_id: this.currentUser.id,
        concurso_id: session.concursoId,
        disciplina_id: session.disciplinaId,
        duration_minutes: session.durationMinutes,
        type: session.type,
        session_date: session.date
      }]);

      // Atualiza XP no perfil
      await this.client.from("profiles").update({
        xp: store.data.profile.xp,
        level: store.data.profile.level,
        streak: store.data.profile.streak
      }).eq("id", this.currentUser.id);
    } catch (e) {
      console.error("Erro ao salvar sessão na nuvem:", e);
    }
  }

  async saveQuestionAnswerToCloud(answer) {
    if (!this.client || !this.currentUser) return;
    try {
      await this.client.from("question_answers").insert([{
        user_id: this.currentUser.id,
        question_id: answer.questionId,
        selected_option: answer.selectedOption,
        is_correct: answer.isCorrect,
        time_spent_seconds: answer.timeSpentSeconds
      }]);
    } catch (e) {
      console.error("Erro ao salvar resposta na nuvem:", e);
    }
  }

  async saveFlashcardToCloud(card) {
    if (!this.client || !this.currentUser) return;
    try {
      await this.client.from("flashcards").upsert([{
        id: card.id.startsWith("fc-custom") ? undefined : card.id,
        user_id: this.currentUser.id,
        disciplina_id: card.disciplinaId,
        frente: card.frente,
        verso: card.verso,
        interval_days: card.interval,
        repetitions: card.repetitions,
        ease_factor: card.easeFactor,
        due_date: card.dueDate
      }]);
    } catch (e) {
      console.error("Erro ao salvar flashcard na nuvem:", e);
    }
  }

  async saveErrorToCloud(errItem) {
    if (!this.client || !this.currentUser) return;
    try {
      await this.client.from("caderno_erros").upsert([{
        user_id: this.currentUser.id,
        question_id: errItem.questionId,
        reason: errItem.reason,
        note: errItem.note,
        resolved: errItem.resolved
      }]);
    } catch (e) {
      console.error("Erro ao salvar no caderno de erros na nuvem:", e);
    }
  }

  // ================= CONTROLE DE MONETIZAÇÃO / PLANOS =================

  isProUser() {
    if (typeof store !== "undefined" && store.isPro && store.isPro()) return true;
    return this.profile && (this.profile.plan_tier === "pro" || this.profile.plan_tier === "vip");
  }

  updateAuthUI() {
    const authBtn = document.getElementById("header-auth-btn");
    const userAvatar = document.getElementById("user-avatar-text");
    const userNameEl = document.getElementById("dash-user-name");
    const userRankEl = document.getElementById("dash-user-rank");
    const planBadge = document.getElementById("header-plan-badge");
    const isPro = this.isProUser();

    if (this.currentUser) {
      const name = this.profile?.name || this.currentUser.user_metadata?.name || "Guerreiro";

      if (authBtn) {
        authBtn.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i> Sair`;
        authBtn.className = "btn btn-secondary btn-sm";
        authBtn.onclick = () => this.signOut();
      }

      if (userAvatar) {
        userAvatar.textContent = name.substring(0, 2).toUpperCase();
      }
      if (userNameEl) userNameEl.textContent = name;
      if (userRankEl) userRankEl.textContent = isPro ? "⭐ Assinante PRO" : "Plano Gratuito";

      if (planBadge) {
        planBadge.innerHTML = isPro 
          ? `<span class="badge-plan-pro"><i class="fa-solid fa-crown"></i> PRO</span>`
          : `<span class="badge-plan-free" onclick="openUpgradeModal()"><i class="fa-solid fa-bolt"></i> Seja PRO</span>`;
      }
    } else {
      if (authBtn) {
        authBtn.innerHTML = `<i class="fa-solid fa-user"></i> Entrar`;
        authBtn.className = "btn btn-primary btn-sm";
        authBtn.onclick = () => openAuthModal();
      }
      if (planBadge) {
        planBadge.innerHTML = isPro
          ? `<span class="badge-plan-pro"><i class="fa-solid fa-crown"></i> PRO</span>`
          : `<span class="badge-plan-free" onclick="openUpgradeModal()"><i class="fa-solid fa-bolt"></i> Seja PRO</span>`;
      }
    }
  }
}

const db = new SupabaseService();
document.addEventListener("DOMContentLoaded", () => {
  db.init();
});
