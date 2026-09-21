CREATE SCHEMA IF NOT EXISTS extensions;
DROP EXTENSION IF EXISTS pg_net CASCADE;
CREATE EXTENSION pg_net WITH SCHEMA extensions;

CREATE POLICY "Service role manages background job state"
ON public.background_job_state
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);