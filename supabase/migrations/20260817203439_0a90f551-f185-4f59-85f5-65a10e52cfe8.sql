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