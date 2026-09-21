/**
 * Kaonty foibe (admin / tompon'ny fampiharana).
 * Izy ihany no mahita ny fitantanana ankapobeny: Pages centrales sy lisitry ny workspaces.
 */
export async function isCentralAccount(authUserId: string): Promise<boolean> {
  const envOwner = (process.env["CENTRAL_ADMIN_USER_ID"] ?? "").trim();
  if (envOwner) return envOwner === authUserId;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // 1) Ny mpampiasa mitahiry ny mari-pamantarana Facebook foibe.
  const { data: settings } = await supabaseAdmin
    .from("settings")
    .select("facebook_app_id,facebook_app_secret")
    .eq("user_id", authUserId)
    .maybeSingle();
  if (settings?.facebook_app_id?.trim() && settings?.facebook_app_secret?.trim()) return true;

  // 2) Ny tompon'ny connexion Facebook foibe (pages centrales).
  const { data: pages } = await supabaseAdmin
    .from("facebook_central_pages")
    .select("id")
    .eq("owner_user_id", authUserId)
    .limit(1);
  return !!pages?.length;
}
