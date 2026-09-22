//#region node_modules/.nitro/vite/services/ssr/assets/central-account.server-DaLAKrKZ.js
/**
* Kaonty foibe (admin / tompon'ny fampiharana).
* Izy ihany no mahita ny fitantanana ankapobeny: Pages centrales sy lisitry ny workspaces.
*/
async function isCentralAccount(authUserId) {
	const envOwner = (process.env["CENTRAL_ADMIN_USER_ID"] ?? "").trim();
	if (envOwner) return envOwner === authUserId;
	const { supabaseAdmin } = await import("./client.server-CXeZe8m9.mjs").then((n) => n.t).then((n) => n.t);
	const { data: settings } = await supabaseAdmin.from("settings").select("facebook_app_id,facebook_app_secret").eq("user_id", authUserId).maybeSingle();
	if (settings?.facebook_app_id?.trim() && settings?.facebook_app_secret?.trim()) return true;
	const { data: pages } = await supabaseAdmin.from("facebook_central_pages").select("id").eq("owner_user_id", authUserId).limit(1);
	return !!pages?.length;
}
//#endregion
export { isCentralAccount };
