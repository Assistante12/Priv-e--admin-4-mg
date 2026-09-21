REVOKE ALL ON FUNCTION public.has_workspace_access(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_workspace_member(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_workspace_access(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_workspace_member(uuid) TO authenticated, service_role;