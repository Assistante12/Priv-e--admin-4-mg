import { r as createServerFn } from "./server-BRvJ2kb2.mjs";
import { t as createServerRpc } from "./createServerRpc-CtiMBgU6.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BGPqiCXF.mjs";
import { a as objectType, o as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/facebook-central.functions-CwkSh7t1.js
var SUBSCRIBE_FIELDS = "messages,messaging_postbacks,feed,message_reactions";
var listCentralPages_createServerFn_handler = createServerRpc({
	id: "95246831230c95276ad5d4ee921579cda1a13417f2a194a5623544593101248d",
	name: "listCentralPages",
	filename: "src/lib/facebook-central.functions.ts"
}, (opts) => listCentralPages.__executeServer(opts));
var listCentralPages = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listCentralPages_createServerFn_handler, async ({ context }) => {
	const [{ data: pages, error }, { data: workspaces }] = await Promise.all([context.supabase.from("facebook_central_pages").select("id,page_id,page_name,assigned_workspace_id").eq("owner_user_id", context.userId).order("page_name", { ascending: true }), context.supabase.from("workspaces").select("id,name").order("name", { ascending: true })]);
	if (error) throw new Error(error.message);
	const nameById = new Map((workspaces ?? []).map((w) => [w.id, w.name]));
	return {
		pages: (pages ?? []).map((p) => ({
			id: p.id,
			page_id: p.page_id,
			page_name: p.page_name,
			assigned_workspace_id: p.assigned_workspace_id ?? null,
			assigned_workspace_name: p.assigned_workspace_id ? nameById.get(p.assigned_workspace_id) ?? null : null
		})),
		workspaces: (workspaces ?? []).map((w) => ({
			id: w.id,
			name: w.name
		}))
	};
});
var assignPageToWorkspace_createServerFn_handler = createServerRpc({
	id: "26006c151a1575627edfc051a8c4b48cc6bd0cf2987762f27a8b1bd6e3e135fe",
	name: "assignPageToWorkspace",
	filename: "src/lib/facebook-central.functions.ts"
}, (opts) => assignPageToWorkspace.__executeServer(opts));
var assignPageToWorkspace = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	page_id: stringType().min(1),
	workspace_id: stringType().uuid()
}).parse(d)).handler(assignPageToWorkspace_createServerFn_handler, async ({ data, context }) => {
	const { data: page, error } = await context.supabase.from("facebook_central_pages").select("page_id,page_name,page_access_token,user_access_token,token_expires_at").eq("owner_user_id", context.userId).eq("page_id", data.page_id).maybeSingle();
	if (error) throw new Error(error.message);
	if (!page) throw new Error("Tsy hita ity pejy ity amin'ny connexion foibe.");
	if (!(data.workspace_id === context.userId ? true : !!(await context.supabase.from("workspace_members").select("workspace_id").eq("workspace_id", data.workspace_id).eq("user_id", context.userId).maybeSingle()).data)) throw new Error("Tsy manana fahazoan-dàlana amin'ity workspace ity ianao.");
	const { supabaseAdmin } = await import("./client.server-DlVXYPLr.mjs").then((n) => n.t).then((n) => n.t);
	await supabaseAdmin.from("facebook_pages").delete().eq("page_id", page.page_id).neq("user_id", data.workspace_id);
	let subscribed = false;
	try {
		subscribed = !!(await (await fetch(`https://graph.facebook.com/v21.0/${page.page_id}/subscribed_apps?subscribed_fields=${SUBSCRIBE_FIELDS}&access_token=${page.page_access_token}`, { method: "POST" })).json()).success;
	} catch (e) {
		console.error("[fb central] subscribe error", page.page_id, e);
	}
	const { error: upsertError } = await supabaseAdmin.from("facebook_pages").upsert({
		user_id: data.workspace_id,
		page_id: page.page_id,
		page_name: page.page_name,
		page_access_token: page.page_access_token,
		user_access_token: page.user_access_token,
		token_expires_at: page.token_expires_at,
		is_connected: true,
		webhook_subscribed: subscribed
	}, { onConflict: "user_id,page_id" });
	if (upsertError) throw new Error(upsertError.message);
	const { error: assignError } = await context.supabase.from("facebook_central_pages").update({ assigned_workspace_id: data.workspace_id }).eq("owner_user_id", context.userId).eq("page_id", page.page_id);
	if (assignError) throw new Error(assignError.message);
	return {
		ok: true,
		webhook_subscribed: subscribed
	};
});
var unassignPage_createServerFn_handler = createServerRpc({
	id: "e6337cca79f25f5c42e4e59721fa6ecdcd59b09572eb1c98391c8bea6445e149",
	name: "unassignPage",
	filename: "src/lib/facebook-central.functions.ts"
}, (opts) => unassignPage.__executeServer(opts));
var unassignPage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ page_id: stringType().min(1) }).parse(d)).handler(unassignPage_createServerFn_handler, async ({ data, context }) => {
	const { data: page } = await context.supabase.from("facebook_central_pages").select("page_id,assigned_workspace_id").eq("owner_user_id", context.userId).eq("page_id", data.page_id).maybeSingle();
	if (!page) throw new Error("Tsy hita ity pejy ity.");
	const { supabaseAdmin } = await import("./client.server-DlVXYPLr.mjs").then((n) => n.t).then((n) => n.t);
	if (page.assigned_workspace_id) await supabaseAdmin.from("facebook_pages").update({ is_connected: false }).eq("page_id", page.page_id).eq("user_id", page.assigned_workspace_id);
	const { error } = await context.supabase.from("facebook_central_pages").update({ assigned_workspace_id: null }).eq("owner_user_id", context.userId).eq("page_id", page.page_id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var refreshCentralPages_createServerFn_handler = createServerRpc({
	id: "9c65ac5b7e6229cbdf1347b00d03d472fd8c79453f8b7d2b617bfed516627065",
	name: "refreshCentralPages",
	filename: "src/lib/facebook-central.functions.ts"
}, (opts) => refreshCentralPages.__executeServer(opts));
var refreshCentralPages = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({}).parse(d ?? {})).handler(refreshCentralPages_createServerFn_handler, async ({ context }) => {
	const { data: rows } = await context.supabase.from("facebook_central_pages").select("user_access_token,updated_at").eq("owner_user_id", context.userId).not("user_access_token", "is", null).order("updated_at", { ascending: false }).limit(1);
	const userToken = rows?.[0]?.user_access_token;
	if (!userToken) throw new Error("Mbola tsy misy connexion Facebook foibe. Tsindrio 'Connecter avec Facebook' ao amin'ny pejy Facebook.");
	const pages = [];
	let nextUrl = `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token&limit=100&access_token=${userToken}`;
	let guard = 0;
	while (nextUrl && guard < 10) {
		guard += 1;
		const json = await (await fetch(nextUrl)).json();
		if (json.error) throw new Error(json.error.message);
		for (const p of json.data ?? []) if (p?.id && !pages.some((e) => e.id === p.id)) pages.push(p);
		nextUrl = json.paging?.next ?? null;
	}
	for (const p of pages) await context.supabase.from("facebook_central_pages").upsert({
		owner_user_id: context.userId,
		page_id: p.id,
		page_name: p.name,
		page_access_token: p.access_token,
		user_access_token: userToken
	}, { onConflict: "page_id" });
	return {
		ok: true,
		count: pages.length
	};
});
//#endregion
export { assignPageToWorkspace_createServerFn_handler, listCentralPages_createServerFn_handler, refreshCentralPages_createServerFn_handler, unassignPage_createServerFn_handler };
