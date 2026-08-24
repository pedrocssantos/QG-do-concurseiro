-- ==========================================================================
-- QG DO CONCURSEIRO - SCHEMA RELACIONAL POSTGRESQL (SUPABASE)
-- ==========================================================================

-- Habilita extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================================================
-- 1. TABELA DE PERFIS DE USUÁRIO (PROFILES)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT DEFAULT 'Concurseiro(a)',
  avatar TEXT DEFAULT 'CO',
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  daily_goal_minutes INT DEFAULT 120,
  weekly_goal_hours INT DEFAULT 18,
  plan_tier TEXT DEFAULT 'free' CHECK (plan_tier IN ('free', 'pro', 'vip')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  onboarding_completed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==========================================================================
-- 2. GAMIFICAÇÃO & PONTUAÇÃO (GAMIFICATION)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.gamification (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  xp INT DEFAULT 0 NOT NULL,
  level INT DEFAULT 1 NOT NULL,
  streak_count INT DEFAULT 0 NOT NULL,
  last_study_date DATE,
  badges JSONB DEFAULT '[]'::jsonb NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==========================================================================
-- 3. CONCURSOS & EDITAIS (CONCURSOS)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.concursos (
  id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  banca TEXT DEFAULT 'Cebraspe',
  vagas INT DEFAULT 1000,
  salario TEXT DEFAULT 'R$ 10.000,00',
  data_prova DATE,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (id, user_id)
);

-- ==========================================================================
-- 4. DISCIPLINAS DO EDITAL (DISCIPLINAS)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.disciplinas (
  id TEXT NOT NULL,
  concurso_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT 'fa-book',
  color TEXT DEFAULT '#4D7EA8',
  peso INT DEFAULT 2,
  dificuldade INT DEFAULT 3,
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (id, user_id)
);

-- ==========================================================================
-- 5. TÓPICOS DO EDITAL & REVISÕES (TOPICOS)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.topicos (
  id TEXT NOT NULL,
  disciplina_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  teoria BOOLEAN DEFAULT false,
  teoria_date DATE,
  resumo BOOLEAN DEFAULT false,
  questoes_feitas INT DEFAULT 0,
  questoes_acertos INT DEFAULT 0,
  r24h BOOLEAN DEFAULT false,
  r7d BOOLEAN DEFAULT false,
  r30d BOOLEAN DEFAULT false,
  dominio INT DEFAULT 1 CHECK (dominio BETWEEN 1 AND 5),
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (id, user_id)
);

-- ==========================================================================
-- 6. SESSÕES DE ESTUDO & POMODORO (STUDY_SESSIONS)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  disciplina_id TEXT,
  topic_id TEXT,
  session_type TEXT DEFAULT 'pomodoro',
  duration_minutes INT NOT NULL,
  date DATE NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (id, user_id)
);

-- ==========================================================================
-- 7. BANCO DE QUESTÕES (QUESTIONS)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  disciplina_id TEXT NOT NULL,
  topic_id TEXT,
  banca TEXT DEFAULT 'Cebraspe',
  concurso TEXT DEFAULT 'Geral',
  ano INT DEFAULT 2024,
  tipo TEXT DEFAULT 'certo_errado' CHECK (tipo IN ('certo_errado', 'multipla_escolha')),
  enunciado TEXT NOT NULL,
  opcoes JSONB DEFAULT '[]'::jsonb,
  resposta_correta TEXT NOT NULL,
  comentario TEXT DEFAULT '',
  is_custom BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==========================================================================
-- 8. HISTÓRICO DE RESPOSTAS & SIMULADOS (QUESTION_ATTEMPTS)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.question_attempts (
  id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  selected_answer TEXT,
  is_correct BOOLEAN NOT NULL,
  mode TEXT DEFAULT 'treino' CHECK (mode IN ('treino', 'simulado')),
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (id, user_id)
);

-- ==========================================================================
-- 9. FLASHCARDS (FLASHCARDS)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.flashcards (
  id TEXT PRIMARY KEY,
  disciplina_id TEXT NOT NULL,
  topic_id TEXT,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  is_system BOOLEAN DEFAULT true,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==========================================================================
-- 10. REPETIÇÃO ESPAÇADA SM-2 (FLASHCARDS_PROGRESS)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.flashcards_progress (
  id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL,
  interval INT DEFAULT 1 NOT NULL,
  repetitions INT DEFAULT 0 NOT NULL,
  ease_factor NUMERIC(4,2) DEFAULT 2.50 NOT NULL,
  due_date DATE NOT NULL,
  last_reviewed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (id, user_id)
);

-- ==========================================================================
-- 11. CADERNO DE ERROS (USER_ERRORS)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.user_errors (
  id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  reason TEXT DEFAULT 'conteudo' CHECK (reason IN ('conteudo', 'pegadinha', 'atencao', 'desconhecimento')),
  notes TEXT DEFAULT '',
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (id, user_id)
);

-- ==========================================================================
-- ÍNDICES PARA PERFORMANCE
-- ==========================================================================
CREATE INDEX IF NOT EXISTS idx_disciplinas_user ON public.disciplinas(user_id, concurso_id);
CREATE INDEX IF NOT EXISTS idx_topicos_user ON public.topicos(user_id, disciplina_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_date ON public.study_sessions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_attempts_user_q ON public.question_attempts(user_id, question_id);
CREATE INDEX IF NOT EXISTS idx_fc_prog_user_due ON public.flashcards_progress(user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_errors_user ON public.user_errors(user_id, resolved);

-- ==========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disciplinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_errors ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public leaderboard view profile preview" ON public.profiles FOR SELECT USING (true);

-- 2. Gamification
CREATE POLICY "Users can manage their gamification stats" ON public.gamification FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public leaderboard can read gamification stats" ON public.gamification FOR SELECT USING (true);

-- 3. Concursos, Disciplinas, Topicos
CREATE POLICY "Users can manage their own concursos" ON public.concursos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own disciplinas" ON public.disciplinas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own topicos" ON public.topicos FOR ALL USING (auth.uid() = user_id);

-- 4. Study Sessions & Question Attempts
CREATE POLICY "Users can manage their study sessions" ON public.study_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their question attempts" ON public.question_attempts FOR ALL USING (auth.uid() = user_id);

-- 5. Questions & Flashcards (System + User Custom)
CREATE POLICY "Users can view all system questions or their own" ON public.questions FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "Users can insert their custom questions" ON public.questions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update/delete their custom questions" ON public.questions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view all system flashcards or their own" ON public.flashcards FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "Users can insert custom flashcards" ON public.flashcards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update/delete custom flashcards" ON public.flashcards FOR UPDATE USING (auth.uid() = user_id);

-- 6. Flashcards Progress & User Errors
CREATE POLICY "Users can manage their flashcards progress" ON public.flashcards_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their error notebook" ON public.user_errors FOR ALL USING (auth.uid() = user_id);

-- ==========================================================================
-- TRIGGER: CRIAÇÃO AUTOMÁTICA DE PERFIL E GAMIFICAÇÃO NO CADASTRO
-- ==========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar, plan_tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    UPPER(SUBSTRING(COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)) FROM 1 FOR 2)),
    'free'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.gamification (user_id, xp, level, streak_count)
  VALUES (NEW.id, 0, 1, 0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
