-- ==============================================================================
-- SCHÉMA DE BASE DE DONNÉES SUPABASE POUR NICHELEAD FINDER / REZO
-- Tout-en-un : 29 Tables, Index, Triggers updated_at, et Politiques RLS
-- ==============================================================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Fonction Trigger pour mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. PROFILES (Utilisateurs / Candidats / Freelances)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  title TEXT,
  profession TEXT,
  sector TEXT,
  country TEXT,
  city TEXT,
  avatar_url TEXT,
  cover_photo_url TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  experience_years INT DEFAULT 0,
  desired_salary NUMERIC(10,2),
  currency VARCHAR(10) DEFAULT 'USD',
  availability TEXT DEFAULT 'Immédiate',
  work_preference TEXT DEFAULT 'Remote',
  resume_url TEXT,
  portfolio_url TEXT,
  website_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  id_verified BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  followers_count INT DEFAULT 0,
  following_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COMPANIES (Entreprises / Recruteurs)
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  cover_url TEXT,
  description TEXT,
  sector TEXT,
  website TEXT,
  country TEXT,
  city TEXT,
  size TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. POSTS (Fil d'actualité social)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  author_type VARCHAR(20) DEFAULT 'user', -- 'user' | 'company'
  post_type VARCHAR(50) NOT NULL, -- 'text', 'photo', 'video', 'document', 'cv', 'job_offer', 'job_request', 'service', 'announcement'
  content TEXT NOT NULL,
  media_url TEXT,
  document_url TEXT,
  document_name TEXT,
  job_title TEXT,
  salary_text TEXT,
  service_price NUMERIC(10,2),
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  shares_count INT DEFAULT 0,
  is_boosted BOOLEAN DEFAULT false,
  boost_type VARCHAR(20), -- 'standard' | 'double'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. POST_MEDIA (Médias multiples joints aux publications)
CREATE TABLE IF NOT EXISTS public.post_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type VARCHAR(20) DEFAULT 'image', -- 'image' | 'video' | 'pdf'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LIKES (J'aime sur les publications)
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 6. COMMENTS (Commentaires sur publications)
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SHARES (Partages de publications)
CREATE TABLE IF NOT EXISTS public.shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FOLLOWERS (Abonnements entre utilisateurs / entreprises)
CREATE TABLE IF NOT EXISTS public.followers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- 9. JOB_POSTS (Offres d'emploi)
CREATE TABLE IF NOT EXISTS public.job_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sector TEXT NOT NULL,
  location TEXT NOT NULL,
  country TEXT,
  contract_type TEXT DEFAULT 'CDI', -- 'CDI' | 'Freelance' | 'CDD' | 'Stage'
  work_mode TEXT DEFAULT 'Remote', -- 'Remote' | 'Présentiel' | 'Hybride'
  salary_min NUMERIC(10,2),
  salary_max NUMERIC(10,2),
  currency VARCHAR(10) DEFAULT 'USD',
  required_skills TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  applications_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. JOB_REQUESTS (Demandes d'emploi / recherches actives)
CREATE TABLE IF NOT EXISTS public.job_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_title TEXT NOT NULL,
  description TEXT NOT NULL,
  desired_salary NUMERIC(10,2),
  currency VARCHAR(10) DEFAULT 'USD',
  country TEXT,
  availability TEXT DEFAULT 'Immédiate',
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. APPLICATIONS (Candidatures envoyées)
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.job_posts(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  resume_url TEXT,
  status VARCHAR(30) DEFAULT 'submitted', -- 'submitted' | 'under_review' | 'interview_scheduled' | 'accepted' | 'rejected'
  ai_match_score INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. SERVICES (Services freelances proposés)
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  delivery_days INT DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. SERVICE_REQUESTS (Demandes de prestations)
CREATE TABLE IF NOT EXISTS public.service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  requirements TEXT NOT NULL,
  status VARCHAR(30) DEFAULT 'pending', -- 'pending' | 'in_progress' | 'completed' | 'cancelled'
  amount NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. TALENT_SEARCHES (Historique de recherche de candidats)
CREATE TABLE IF NOT EXISTS public.talent_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  search_query TEXT,
  filters_json JSONB,
  results_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. MATCHES (Matching IA Candidats-Offres)
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.job_posts(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  compatibility_score INT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. CONVERSATIONS (Salons de messagerie)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_1 UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant_2 UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. MESSAGES (Messages privés / instantanés)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. VIDEO_INTERVIEWS (Salles d'entretiens vidéo WebRTC)
CREATE TABLE IF NOT EXISTS public.video_interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id TEXT UNIQUE NOT NULL,
  host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  guest_email TEXT NOT NULL,
  guest_name TEXT,
  scheduled_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(30) DEFAULT 'scheduled', -- 'scheduled' | 'active' | 'completed'
  recording_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. NOTIFICATIONS (Notifications in-app)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'general',
  link_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. EMAIL_NOTIFICATIONS (Historique des e-mails professionnels envoyés)
CREATE TABLE IF NOT EXISTS public.email_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'sent', -- 'sent' | 'failed' | 'queued'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. BOOST_CAMPAIGNS (Campagnes de boost de visibilité)
CREATE TABLE IF NOT EXISTS public.boost_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  boost_type VARCHAR(20) NOT NULL, -- 'standard' ($5) | 'double' ($20)
  amount NUMERIC(10,2) NOT NULL,
  target_country TEXT,
  target_sector TEXT,
  target_profession TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- 22. BOOST_PAYMENTS (Paiements de boost)
CREATE TABLE IF NOT EXISTS public.boost_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES public.boost_campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  payment_method VARCHAR(50) DEFAULT 'card', -- 'card' | 'moncash' | 'stripe'
  status VARCHAR(20) DEFAULT 'completed',
  transaction_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. SUBSCRIPTIONS (Abonnements Premium)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_name VARCHAR(50) NOT NULL, -- 'free' | 'pro' | 'enterprise'
  amount NUMERIC(10,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. SAVED_POSTS (Publications sauvegardées)
CREATE TABLE IF NOT EXISTS public.saved_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- 25. REPORTS (Signalements de contenu)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'reviewed' | 'dismissed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. AI_REQUESTS (Logs d'appels API Gemini AI)
CREATE TABLE IF NOT EXISTS public.ai_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  request_type VARCHAR(50) NOT NULL, -- 'job_search_nl' | 'candidate_search_nl' | 'cv_parser' | 'cover_letter'
  prompt_input TEXT NOT NULL,
  json_output JSONB,
  tokens_used INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 27. AI_RECOMMENDATIONS (Recommandations IA sauvegardées)
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL,
  content_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 28. FILES (Gestionnaire de fichiers / CV / documents)
CREATE TABLE IF NOT EXISTS public.files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT DEFAULT 0,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 29. ACTIVITY_LOGS (Logs d'activités audit)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEX POUR PERFORMANCES OPTIMALES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_boosted ON public.posts(is_boosted, boost_type);
CREATE INDEX IF NOT EXISTS idx_likes_post ON public.likes(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_job_posts_active ON public.job_posts(is_active);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- ==============================================================================
-- TRIGGERS D'AUTOMATISATION UPDATED_AT
-- ==============================================================================
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_companies_modtime BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_posts_modtime BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_comments_modtime BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_job_posts_modtime BEFORE UPDATE ON public.job_posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_applications_modtime BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ==============================================================================
-- SECURITÉ ROW LEVEL SECURITY (RLS) SUPABASE
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique pour le réseau
CREATE POLICY "Lecture publique des profils" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Mise à jour par le propriétaire du profil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Lecture publique des publications" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Création de publication authentifiée" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Suppression de publication par l'auteur" ON public.posts FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Lecture publique des offres" ON public.job_posts FOR SELECT USING (true);
CREATE POLICY "Création d'offre par recruteur" ON public.job_posts FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Lecture des messages par les participants" ON public.messages FOR SELECT USING (auth.uid() = sender_id);
CREATE POLICY "Envoi de messages par utilisateur authentifié" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Lecture des notifications personnelles" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

-- ==============================================================================
-- 30. REGIONAL_PROSPECTS (Entreprises & Prospects par Région)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.regional_prospects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  niche TEXT NOT NULL,
  region TEXT NOT NULL,
  phone TEXT,
  public_email TEXT,
  website_url TEXT,
  social_url TEXT,
  lead_score INT DEFAULT 80,
  suggested_angle TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 31. COMPANY_REQUESTS (Toutes les Sortes de Demandes en Région)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.company_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(50) NOT NULL, -- 'Demande de Devis', 'Offre de Service', 'Intervention Urgente', 'Partenariat B2B', 'Plainte & Signalement', 'Recrutement'
  title TEXT NOT NULL,
  requester_name TEXT,
  company_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  region TEXT NOT NULL,
  description TEXT,
  urgency VARCHAR(20) DEFAULT 'Normale', -- 'Urgente', 'Elevée', 'Normale'
  status VARCHAR(20) DEFAULT 'Ouverte', -- 'Ouverte', 'En cours', 'Traitée'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherches régionales rapides
CREATE INDEX IF NOT EXISTS idx_regional_prospects_region ON public.regional_prospects(region, niche);
CREATE INDEX IF NOT EXISTS idx_company_requests_region ON public.company_requests(region, category);

-- RLS
ALTER TABLE public.regional_prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des prospects régionaux" ON public.regional_prospects FOR SELECT USING (true);
CREATE POLICY "Insertion de prospects régionaux" ON public.regional_prospects FOR INSERT WITH CHECK (true);

CREATE POLICY "Lecture publique des demandes régionales" ON public.company_requests FOR SELECT USING (true);
CREATE POLICY "Insertion des demandes régionales" ON public.company_requests FOR INSERT WITH CHECK (true);

