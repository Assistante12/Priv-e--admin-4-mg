ALTER TABLE public.workspaces
  ADD COLUMN IF NOT EXISTS login_email text,
  ADD COLUMN IF NOT EXISTS password_hash text,
  ADD COLUMN IF NOT EXISTS password_salt text,
  ADD COLUMN IF NOT EXISTS password_updated_at timestamptz;

CREATE TABLE IF NOT EXISTS public.workspace_unlocks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, workspace_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_unlocks TO authenticated;
GRANT ALL ON public.workspace_unlocks TO service_role;

ALTER TABLE public.workspace_unlocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own unlocks" ON public.workspace_unlocks;
CREATE POLICY "own unlocks" ON public.workspace_unlocks
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());