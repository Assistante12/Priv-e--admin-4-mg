import { r as createServerFn } from "./server-D9pwzi9_.mjs";
import { t as createServerRpc } from "./createServerRpc-DxF-NOaI.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZb5fK_L.mjs";
import { a as objectType, o as stringType } from "../_libs/zod.mjs";
import { i as getSupabaseOAuthAuthorizeUrl } from "./supabase-oauth.server-k5N44jkI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-oauth.functions-CuqLpYQO.js
var getSupabaseAuthUrl_createServerFn_handler = createServerRpc({
	id: "13d291e0d0c62882aa81393904578b21a13e9c7eadd05d974bca25c6a7246cdb",
	name: "getSupabaseAuthUrl",
	filename: "src/lib/supabase-oauth.functions.ts"
}, (opts) => getSupabaseAuthUrl.__executeServer(opts));
var getSupabaseAuthUrl = createServerFn({ method: "POST" }).validator((d) => d).handler(getSupabaseAuthUrl_createServerFn_handler, async ({ data }) => {
	const mode = data.mode || "connect";
	const uid = data.userId || "anonymous";
	const clientOrigin = data.redirectUri ? new URL(data.redirectUri).origin : "";
	const state = `${mode}:${uid}:${Date.now()}:${encodeURIComponent(clientOrigin)}`;
	const redirectUri = data.redirectUri || process.env.SUPABASE_OAUTH_REDIRECT_URI || "https://ai-service-client-facebook.lovable.app/api/public/supabase/callback";
	return {
		url: getSupabaseOAuthAuthorizeUrl(redirectUri, state),
		redirectUri
	};
});
var getSupabaseOAuthStatus_createServerFn_handler = createServerRpc({
	id: "3b27e249b9f235cc0d3ab7eeb0a30238e4512f505d25d40658be4131ba3dda90",
	name: "getSupabaseOAuthStatus",
	filename: "src/lib/supabase-oauth.functions.ts"
}, (opts) => getSupabaseOAuthStatus.__executeServer(opts));
var getSupabaseOAuthStatus = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getSupabaseOAuthStatus_createServerFn_handler, async ({ context }) => {
	const { data: conn } = await context.supabase.from("supabase_oauth_connections").select("*").eq("user_id", context.userId).maybeSingle();
	const { data: settings } = await context.supabase.from("settings").select("supabase_project_url,supabase_project_name,supabase_anon_key,supabase_connected").eq("user_id", context.userId).maybeSingle();
	return {
		isConnected: Boolean(conn?.is_connected || settings?.supabase_connected),
		connection: conn || null,
		projects: conn?.projects || [],
		organizations: conn?.organizations || [],
		selectedProjectId: conn?.selected_project_id || null,
		selectedProjectName: conn?.selected_project_name || settings?.supabase_project_name || null,
		selectedProjectUrl: conn?.selected_project_url || settings?.supabase_project_url || null,
		anonKey: settings?.supabase_anon_key || null
	};
});
var selectProjectSchema = objectType({ projectId: stringType().min(1) });
var selectSupabaseProject_createServerFn_handler = createServerRpc({
	id: "7e9f7fa28e2987c330379f6e374f4c3618a05ac8203f5c0dbaf2800c14e867e5",
	name: "selectSupabaseProject",
	filename: "src/lib/supabase-oauth.functions.ts"
}, (opts) => selectSupabaseProject.__executeServer(opts));
var selectSupabaseProject = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => selectProjectSchema.parse(d)).handler(selectSupabaseProject_createServerFn_handler, async ({ data, context }) => {
	const { data: conn } = await context.supabase.from("supabase_oauth_connections").select("*").eq("user_id", context.userId).maybeSingle();
	if (!conn || !conn.projects) throw new Error("Aucune connexion Supabase active trouvée.");
	const targetProject = conn.projects.find((p) => p.id === data.projectId);
	if (!targetProject) throw new Error("Projet introuvable dans votre compte Supabase.");
	await context.supabase.from("supabase_oauth_connections").upsert({
		...conn,
		selected_project_id: targetProject.id,
		selected_project_name: targetProject.name,
		selected_project_url: targetProject.project_url,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	});
	await context.supabase.from("settings").upsert({
		user_id: context.userId,
		supabase_project_url: targetProject.project_url,
		supabase_project_name: targetProject.name,
		supabase_anon_key: targetProject.anon_key || null,
		supabase_connected: true
	}, { onConflict: "user_id" });
	return {
		ok: true,
		project: targetProject
	};
});
var disconnectSupabaseOAuth_createServerFn_handler = createServerRpc({
	id: "38be6894cbd764a15b04328c350232cf665ced948e0591e2d4d60823412af3f8",
	name: "disconnectSupabaseOAuth",
	filename: "src/lib/supabase-oauth.functions.ts"
}, (opts) => disconnectSupabaseOAuth.__executeServer(opts));
var disconnectSupabaseOAuth = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(disconnectSupabaseOAuth_createServerFn_handler, async ({ context }) => {
	await context.supabase.from("supabase_oauth_connections").delete().eq("user_id", context.userId);
	await context.supabase.from("settings").upsert({
		user_id: context.userId,
		supabase_project_url: null,
		supabase_project_name: null,
		supabase_anon_key: null,
		supabase_connected: false
	}, { onConflict: "user_id" });
	return { ok: true };
});
//#endregion
export { disconnectSupabaseOAuth_createServerFn_handler, getSupabaseAuthUrl_createServerFn_handler, getSupabaseOAuthStatus_createServerFn_handler, selectSupabaseProject_createServerFn_handler };
