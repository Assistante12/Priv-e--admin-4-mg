CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT, display_name TEXT, avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role); $$;

CREATE TABLE public.prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL, content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'global' CHECK (category IN ('global','message','comment','md','tutorial','post')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prompts TO authenticated;
GRANT ALL ON public.prompts TO service_role;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own prompts" ON public.prompts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.gemini_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL, api_key TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_used_at TIMESTAMPTZ, error_count INT NOT NULL DEFAULT 0, disabled_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gemini_keys TO authenticated;
GRANT ALL ON public.gemini_keys TO service_role;
ALTER TABLE public.gemini_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own gemini keys" ON public.gemini_keys FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.facebook_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id TEXT NOT NULL, page_name TEXT NOT NULL,
  page_access_token TEXT NOT NULL, user_access_token TEXT, token_expires_at TIMESTAMPTZ,
  is_connected BOOLEAN NOT NULL DEFAULT true, webhook_subscribed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, page_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.facebook_pages TO authenticated;
GRANT ALL ON public.facebook_pages TO service_role;
ALTER TABLE public.facebook_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own pages" ON public.facebook_pages FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.messages_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id TEXT NOT NULL, sender_id TEXT NOT NULL, sender_name TEXT,
  direction TEXT NOT NULL CHECK (direction IN ('incoming','outgoing')),
  content TEXT, media_type TEXT, media_url TEXT, ai_response TEXT,
  status TEXT NOT NULL DEFAULT 'ok',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages_log TO authenticated;
GRANT ALL ON public.messages_log TO service_role;
ALTER TABLE public.messages_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own messages log" ON public.messages_log FOR SELECT USING (auth.uid() = user_id);
CREATE INDEX ON public.messages_log (user_id, created_at DESC);

CREATE TABLE public.comments_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id TEXT NOT NULL, post_id TEXT NOT NULL, comment_id TEXT NOT NULL UNIQUE,
  author_id TEXT, author_name TEXT, content TEXT,
  replied BOOLEAN NOT NULL DEFAULT false, ai_response TEXT, replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments_log TO authenticated;
GRANT ALL ON public.comments_log TO service_role;
ALTER TABLE public.comments_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own comments log" ON public.comments_log FOR SELECT USING (auth.uid() = user_id);
CREATE INDEX ON public.comments_log (user_id, created_at DESC);

CREATE TABLE public.settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  auto_reply_messages BOOLEAN NOT NULL DEFAULT true,
  auto_reply_comments BOOLEAN NOT NULL DEFAULT true,
  comment_scan_interval_minutes INT NOT NULL DEFAULT 5,
  use_lovable_ai_fallback BOOLEAN NOT NULL DEFAULT true,
  default_model TEXT NOT NULL DEFAULT 'gemini-2.5-flash',
  private_message_link TEXT,
  facebook_app_id TEXT,
  facebook_app_secret TEXT,
  facebook_verify_token TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own settings" ON public.settings FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_settings_facebook_app_id ON public.settings (facebook_app_id) WHERE facebook_app_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_settings_facebook_verify_token ON public.settings (facebook_verify_token) WHERE facebook_verify_token IS NOT NULL;

CREATE TABLE public.scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id UUID REFERENCES public.facebook_pages(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  image_path TEXT, image_url TEXT, ai_description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'once' CHECK (frequency IN ('once','daily')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','published','failed','cancelled')),
  last_published_at TIMESTAMPTZ, last_error TEXT, fb_post_id TEXT,
  enhance_image BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scheduled_posts TO authenticated;
GRANT ALL ON public.scheduled_posts TO service_role;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own scheduled posts" ON public.scheduled_posts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX ON public.scheduled_posts (scheduled_at, status);
CREATE INDEX ON public.scheduled_posts (user_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_prompts_updated BEFORE UPDATE ON public.prompts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_gemini_keys_updated BEFORE UPDATE ON public.gemini_keys FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_facebook_pages_updated BEFORE UPDATE ON public.facebook_pages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_scheduled_posts_updated BEFORE UPDATE ON public.scheduled_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email), NEW.raw_user_meta_data->>'avatar_url');
  INSERT INTO public.settings (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO service_role;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.verify_facebook_webhook_token(_token TEXT)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.settings
    WHERE facebook_verify_token = btrim(_token)
      AND facebook_verify_token IS NOT NULL AND btrim(facebook_verify_token) <> '');
$$;
REVOKE ALL ON FUNCTION public.verify_facebook_webhook_token(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_facebook_webhook_token(TEXT) TO service_role;

CREATE POLICY "post_images_select_own" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'post-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "post_images_insert_own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'post-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "post_images_update_own" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'post-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "post_images_delete_own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'post-images' AND (storage.foldername(name))[1] = auth.uid()::text);

ALTER TABLE public.settings
  ADD COLUMN IF NOT EXISTS assistance_type TEXT NOT NULL DEFAULT 'online_work' CHECK (assistance_type IN ('online_work','training','sales')),
  ADD COLUMN IF NOT EXISTS global_ia_stopped BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  number TEXT NOT NULL,
  instructions TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_methods TO authenticated;
GRANT ALL ON public.payment_methods TO service_role;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own payment_methods" ON public.payment_methods FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_pm_updated BEFORE UPDATE ON public.payment_methods FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  pricing_type TEXT NOT NULL CHECK (pricing_type IN ('free','paid')),
  price NUMERIC(12,2),
  payment_flow TEXT CHECK (payment_flow IN ('admin_numbers','client_contact')),
  video_link TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trainings TO authenticated;
GRANT ALL ON public.trainings TO service_role;
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own trainings" ON public.trainings FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_tr_updated BEFORE UPDATE ON public.trainings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.training_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  training_id UUID NOT NULL REFERENCES public.trainings(id) ON DELETE CASCADE,
  file_path TEXT,
  file_type TEXT NOT NULL CHECK (file_type IN ('video','pdf','document','link')),
  file_name TEXT NOT NULL,
  size_bytes BIGINT,
  external_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.training_files TO authenticated;
GRANT ALL ON public.training_files TO service_role;
ALTER TABLE public.training_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own training_files" ON public.training_files FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  payment_flow TEXT NOT NULL DEFAULT 'admin_numbers' CHECK (payment_flow IN ('admin_numbers','client_contact')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own products" ON public.products FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_pr_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_images TO authenticated;
GRANT ALL ON public.product_images TO service_role;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own product_images" ON public.product_images FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('training','sales')),
  training_id UUID REFERENCES public.trainings(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','awaiting_payment','payment_sent','accepted','refused','delivered')),
  client_fb_id TEXT,
  client_fb_name TEXT,
  client_whatsapp TEXT,
  client_phone TEXT,
  payment_reference TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  page_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own orders" ON public.orders FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_or_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.client_ia_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id TEXT NOT NULL,
  client_fb_id TEXT NOT NULL,
  client_fb_name TEXT,
  ia_stopped BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, page_id, client_fb_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_ia_state TO authenticated;
GRANT ALL ON public.client_ia_state TO service_role;
ALTER TABLE public.client_ia_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own client_ia_state" ON public.client_ia_state FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_cs_updated BEFORE UPDATE ON public.client_ia_state FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP POLICY IF EXISTS "training own read" ON storage.objects;
CREATE POLICY "training own read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'training-files' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "training own write" ON storage.objects;
CREATE POLICY "training own write" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'training-files' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "training own delete" ON storage.objects;
CREATE POLICY "training own delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'training-files' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "product img own read" ON storage.objects;
CREATE POLICY "product img own read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'product-images' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "product img own write" ON storage.objects;
CREATE POLICY "product img own write" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "product img own delete" ON storage.objects;
CREATE POLICY "product img own delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND (storage.foldername(name))[1] = auth.uid()::text);

ALTER TABLE public.prompts
  ADD COLUMN IF NOT EXISTS page_id text,
  ADD COLUMN IF NOT EXISTS assistance_type text;
CREATE INDEX IF NOT EXISTS prompts_user_page_idx ON public.prompts(user_id, page_id);
CREATE INDEX IF NOT EXISTS prompts_user_type_idx ON public.prompts(user_id, assistance_type);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS client_address text;
ALTER TABLE public.client_ia_state ADD COLUMN IF NOT EXISTS product_image_offsets jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.scheduled_posts ADD COLUMN IF NOT EXISTS video_path text;
CREATE POLICY "post-videos owner select" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'post-videos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "post-videos owner insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'post-videos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "post-videos owner update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'post-videos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "post-videos owner delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'post-videos' AND (storage.foldername(name))[1] = auth.uid()::text);

ALTER TABLE public.scheduled_posts ADD COLUMN IF NOT EXISTS ai_prompt text;

ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS page_ids text[] NOT NULL DEFAULT '{}'::text[];
CREATE INDEX IF NOT EXISTS idx_prompts_page_ids ON public.prompts USING gin (page_ids);
ALTER TABLE public.scheduled_posts ADD COLUMN IF NOT EXISTS image_paths text[] NOT NULL DEFAULT '{}'::text[];

ALTER TABLE public.settings
  ADD COLUMN IF NOT EXISTS supabase_project_url TEXT,
  ADD COLUMN IF NOT EXISTS supabase_project_name TEXT,
  ADD COLUMN IF NOT EXISTS supabase_anon_key TEXT,
  ADD COLUMN IF NOT EXISTS supabase_connected BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.supabase_oauth_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at BIGINT,
  organizations JSONB NOT NULL DEFAULT '[]'::jsonb,
  projects JSONB NOT NULL DEFAULT '[]'::jsonb,
  selected_project_id TEXT,
  selected_project_name TEXT,
  selected_project_url TEXT,
  is_connected BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.supabase_oauth_connections TO authenticated;
GRANT ALL ON public.supabase_oauth_connections TO service_role;
ALTER TABLE public.supabase_oauth_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own supabase oauth connection" ON public.supabase_oauth_connections FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_soc_updated BEFORE UPDATE ON public.supabase_oauth_connections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.client_greeted (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  greeted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, page_id, sender_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_greeted TO authenticated;
GRANT ALL ON public.client_greeted TO service_role;
ALTER TABLE public.client_greeted ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own client_greeted" ON public.client_greeted FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE TABLE public.background_job_state (
  job_name text PRIMARY KEY,
  status text NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'paused', 'failed')),
  lease_expires_at timestamptz,
  paused_reason text,
  consecutive_rate_limits integer NOT NULL DEFAULT 0,
  last_started_at timestamptz,
  last_finished_at timestamptz,
  last_result jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.background_job_state TO service_role;
ALTER TABLE public.background_job_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages background job state"
ON public.background_job_state FOR ALL TO service_role USING (true) WITH CHECK (true);

INSERT INTO public.background_job_state (job_name) VALUES ('facebook-automation')
ON CONFLICT (job_name) DO NOTHING;

CREATE OR REPLACE FUNCTION public.claim_background_job(_job_name text, _lease_seconds integer DEFAULT 120)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  claimed boolean;
BEGIN
  INSERT INTO public.background_job_state (job_name)
  VALUES (_job_name)
  ON CONFLICT (job_name) DO NOTHING;

  UPDATE public.background_job_state
  SET status = 'running',
      lease_expires_at = now() + make_interval(secs => greatest(30, least(_lease_seconds, 600))),
      last_started_at = now(),
      updated_at = now()
  WHERE job_name = _job_name
    AND status <> 'paused'
    AND (status <> 'running' OR lease_expires_at IS NULL OR lease_expires_at <= now());

  GET DIAGNOSTICS claimed = ROW_COUNT;
  RETURN claimed;
END;
$$;

CREATE OR REPLACE FUNCTION public.finish_background_job(_job_name text, _status text, _result jsonb DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.background_job_state
  SET status = CASE WHEN _status IN ('idle', 'paused', 'failed') THEN _status ELSE 'failed' END,
      lease_expires_at = NULL,
      last_finished_at = now(),
      last_result = _result,
      updated_at = now()
  WHERE job_name = _job_name;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_background_job(text, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.finish_background_job(text, text, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_background_job(text, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.finish_background_job(text, text, jsonb) TO service_role;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.facebook_pages;

CREATE TABLE public.push_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  user_agent text,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.push_tokens TO authenticated;
GRANT ALL ON public.push_tokens TO service_role;
ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own push_tokens" ON public.push_tokens FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.push_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  auto_ai_enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.push_settings TO authenticated;
GRANT ALL ON public.push_settings TO service_role;
ALTER TABLE public.push_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own push_settings" ON public.push_settings FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.push_dispatch_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_key text NOT NULL UNIQUE,
  title text,
  body text,
  sent_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.push_dispatch_log TO service_role;
ALTER TABLE public.push_dispatch_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service manages push_dispatch_log" ON public.push_dispatch_log FOR ALL TO service_role
  USING (true) WITH CHECK (true);