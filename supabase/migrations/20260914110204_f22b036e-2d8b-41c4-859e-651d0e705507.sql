-- 1. Workspaces
CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_user_id UUID NOT NULL,
  assistance_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspaces TO authenticated;
GRANT ALL ON public.workspaces TO service_role;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'owner',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_members TO authenticated;
GRANT ALL ON public.workspace_members TO service_role;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS active_workspace_id UUID;

CREATE OR REPLACE FUNCTION public.is_workspace_member(_scope UUID)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = _scope AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.has_workspace_access(_scope UUID)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT _scope IS NOT NULL AND (
    _scope = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_id = _scope AND user_id = auth.uid()
    )
  );
$$;

CREATE POLICY "members read workspaces" ON public.workspaces
  FOR SELECT TO authenticated USING (owner_user_id = auth.uid() OR public.is_workspace_member(id));
CREATE POLICY "owner creates workspaces" ON public.workspaces
  FOR INSERT TO authenticated WITH CHECK (owner_user_id = auth.uid());
CREATE POLICY "owner updates workspaces" ON public.workspaces
  FOR UPDATE TO authenticated USING (owner_user_id = auth.uid()) WITH CHECK (owner_user_id = auth.uid());
CREATE POLICY "owner deletes workspaces" ON public.workspaces
  FOR DELETE TO authenticated USING (owner_user_id = auth.uid());

CREATE POLICY "read own memberships" ON public.workspace_members
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_user_id = auth.uid()
  ));
CREATE POLICY "owner manages memberships" ON public.workspace_members
  FOR ALL TO authenticated USING (EXISTS (
    SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_user_id = auth.uid()
  )) WITH CHECK (EXISTS (
    SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_user_id = auth.uid()
  ));

CREATE TRIGGER trg_workspaces_updated BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. Seed personal workspaces (id = user id) so existing data keeps working
INSERT INTO public.workspaces (id, name, owner_user_id)
SELECT p.id, COALESCE(NULLIF(p.display_name, ''), p.email, 'Workspace'), p.id
FROM public.profiles p
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.workspace_members (workspace_id, user_id, role)
SELECT w.id, w.owner_user_id, 'owner' FROM public.workspaces w
ON CONFLICT (workspace_id, user_id) DO NOTHING;

UPDATE public.profiles SET active_workspace_id = id WHERE active_workspace_id IS NULL;

-- 3. New users get a personal workspace
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url, active_workspace_id)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email), NEW.raw_user_meta_data->>'avatar_url', NEW.id);
  INSERT INTO public.workspaces (id, name, owner_user_id)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'Workspace'), NEW.id)
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (NEW.id, NEW.id, 'owner') ON CONFLICT DO NOTHING;
  INSERT INTO public.settings (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

-- 4. Scoped tables: user_id becomes a workspace scope id
DO $$
DECLARE
  t TEXT;
  fk RECORD;
  scoped TEXT[] := ARRAY['client_greeted','client_ia_state','comments_log','facebook_pages','gemini_keys','messages_log','orders','payment_methods','product_images','products','prompts','scheduled_posts','settings','training_files','trainings'];
BEGIN
  FOREACH t IN ARRAY scoped LOOP
    -- drop FK user_id -> auth.users
    FOR fk IN
      SELECT con.conname FROM pg_constraint con
      JOIN pg_class rel ON rel.oid = con.conrelid
      JOIN pg_namespace ns ON ns.oid = rel.relnamespace
      JOIN pg_class fref ON fref.oid = con.confrelid
      JOIN pg_namespace fns ON fns.oid = fref.relnamespace
      WHERE ns.nspname = 'public' AND rel.relname = t AND con.contype = 'f'
        AND fns.nspname = 'auth' AND fref.relname = 'users'
    LOOP
      EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT %I', t, fk.conname);
    END LOOP;

    -- replace user-scoped policies with workspace-scoped policies
    FOR fk IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = t LOOP
      EXECUTE format('DROP POLICY %I ON public.%I', fk.policyname, t);
    END LOOP;

    IF t IN ('comments_log','messages_log') THEN
      EXECUTE format('CREATE POLICY "workspace reads %1$s" ON public.%1$I FOR SELECT TO authenticated USING (public.has_workspace_access(user_id))', t);
    ELSE
      EXECUTE format('CREATE POLICY "workspace manages %1$s" ON public.%1$I FOR ALL TO authenticated USING (public.has_workspace_access(user_id)) WITH CHECK (public.has_workspace_access(user_id))', t);
    END IF;
  END LOOP;
END $$;

-- 5. Central Facebook pages (Solution 1)
CREATE TABLE public.facebook_central_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL,
  page_id TEXT NOT NULL UNIQUE,
  page_name TEXT NOT NULL,
  page_access_token TEXT NOT NULL,
  user_access_token TEXT,
  token_expires_at TIMESTAMPTZ,
  assigned_workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.facebook_central_pages TO authenticated;
GRANT ALL ON public.facebook_central_pages TO service_role;
ALTER TABLE public.facebook_central_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "central owner manages pages" ON public.facebook_central_pages
  FOR ALL TO authenticated USING (owner_user_id = auth.uid()) WITH CHECK (owner_user_id = auth.uid());
CREATE TRIGGER trg_fb_central_updated BEFORE UPDATE ON public.facebook_central_pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
