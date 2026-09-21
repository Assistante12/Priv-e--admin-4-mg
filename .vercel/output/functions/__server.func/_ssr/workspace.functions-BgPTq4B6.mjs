import { r as createServerFn } from "./server-BRvJ2kb2.mjs";
import { t as createServerRpc } from "./createServerRpc-CtiMBgU6.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BGPqiCXF.mjs";
import { a as objectType, i as numberType, o as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workspace.functions-BgPTq4B6.js
var UNLOCK_HOURS = 12;
/** Liste (avec recherche + pagination) des workspaces accessibles au compte. */
var listWorkspaces_createServerFn_handler = createServerRpc({
	id: "095b6437ed3d46ebaa6b6b39fdd5999d3f0a0aa23855f81bc0462589a2f44f79",
	name: "listWorkspaces",
	filename: "src/lib/workspace.functions.ts"
}, (opts) => listWorkspaces.__executeServer(opts));
var listWorkspaces = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	search: stringType().max(120).optional(),
	limit: numberType().int().min(1).max(100).optional(),
	offset: numberType().int().min(0).optional()
}).parse(d ?? {})).handler(listWorkspaces_createServerFn_handler, async ({ data, context }) => {
	const limit = data.limit ?? 50;
	const offset = data.offset ?? 0;
	const { isCentralAccount } = await import("./central-account.server-6RwCxlEc.mjs");
	const isCentral = await isCentralAccount(context.userId);
	const { data: profile } = await context.supabase.from("profiles").select("active_workspace_id").eq("id", context.userId).maybeSingle();
	const activeId = profile?.active_workspace_id ?? context.userId;
	let visibleIds = null;
	if (!isCentral) {
		const { data: unlocks } = await context.supabase.from("workspace_unlocks").select("workspace_id,expires_at").eq("user_id", context.userId);
		const valid = (unlocks ?? []).filter((u) => u.expires_at && new Date(u.expires_at).getTime() > Date.now()).map((u) => u.workspace_id);
		visibleIds = Array.from(/* @__PURE__ */ new Set([
			context.userId,
			activeId,
			...valid
		]));
	}
	let query = context.supabase.from("workspaces").select("id,name,assistance_type,created_at,login_email,password_hash", { count: "exact" }).order("created_at", { ascending: true }).range(offset, offset + limit - 1);
	if (visibleIds) query = query.in("id", visibleIds);
	if (data.search?.trim()) query = query.ilike("name", `%${data.search.trim()}%`);
	const { data: rows, count, error } = await query;
	if (error) throw new Error(error.message);
	const workspaces = (rows ?? []).map((w) => ({
		id: w.id,
		name: w.name,
		assistance_type: w.assistance_type ?? null,
		is_personal: w.id === context.userId,
		is_active: w.id === activeId,
		has_password: !!w.password_hash,
		login_email: w.login_email ?? null,
		created_at: w.created_at
	}));
	return {
		workspaces,
		total: count ?? workspaces.length,
		activeId,
		is_central: isCentral
	};
});
var getWorkspaceAccess_createServerFn_handler = createServerRpc({
	id: "55c70ed2a1bb2110bea0e0d3e4e7b032555a10c0f442f3aad1da31e755b10b21",
	name: "getWorkspaceAccess",
	filename: "src/lib/workspace.functions.ts"
}, (opts) => getWorkspaceAccess.__executeServer(opts));
var getWorkspaceAccess = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getWorkspaceAccess_createServerFn_handler, async ({ context }) => {
	const { isCentralAccount } = await import("./central-account.server-6RwCxlEc.mjs");
	return { is_central: await isCentralAccount(context.userId) };
});
var createWorkspace_createServerFn_handler = createServerRpc({
	id: "744b6be0a8526d2232e099596abc01cd200195c5b263342ffdad45ca40c4d37d",
	name: "createWorkspace",
	filename: "src/lib/workspace.functions.ts"
}, (opts) => createWorkspace.__executeServer(opts));
var createWorkspace = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	name: stringType().trim().min(1).max(80),
	email: stringType().trim().email().max(160),
	password: stringType().min(6).max(200)
}).parse(d)).handler(createWorkspace_createServerFn_handler, async ({ data, context }) => {
	const { hashWorkspacePassword } = await import("./workspace-password.server-zpb3lV6l.mjs");
	const { salt, hash } = await hashWorkspacePassword(data.password);
	const { data: ws, error } = await context.supabase.from("workspaces").insert({
		name: data.name,
		owner_user_id: context.userId,
		login_email: data.email.toLowerCase(),
		password_hash: hash,
		password_salt: salt,
		password_updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).select("id,name").single();
	if (error || !ws) throw new Error(error?.message ?? "Tsy afaka namorona workspace.");
	const { error: memberError } = await context.supabase.from("workspace_members").insert({
		workspace_id: ws.id,
		user_id: context.userId,
		role: "owner"
	});
	if (memberError) throw new Error(memberError.message);
	await context.supabase.from("settings").upsert({ user_id: ws.id }, { onConflict: "user_id" });
	await context.supabase.from("workspace_unlocks").upsert({
		user_id: context.userId,
		workspace_id: ws.id,
		expires_at: new Date(Date.now() + UNLOCK_HOURS * 36e5).toISOString()
	}, { onConflict: "user_id,workspace_id" });
	await context.supabase.from("profiles").update({ active_workspace_id: ws.id }).eq("id", context.userId);
	return {
		ok: true,
		id: ws.id,
		name: ws.name
	};
});
var unlockWorkspace_createServerFn_handler = createServerRpc({
	id: "b1210d9098378b1f0d6e15450419b1f306257d88168cd5ba8e6ea95cf6d44297",
	name: "unlockWorkspace",
	filename: "src/lib/workspace.functions.ts"
}, (opts) => unlockWorkspace.__executeServer(opts));
var unlockWorkspace = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	password: stringType().min(1).max(200)
}).parse(d)).handler(unlockWorkspace_createServerFn_handler, async ({ data, context }) => {
	const { supabaseAdmin } = await import("./client.server-DlVXYPLr.mjs").then((n) => n.t).then((n) => n.t);
	const { data: ws, error } = await supabaseAdmin.from("workspaces").select("id,password_hash,password_salt").eq("id", data.id).maybeSingle();
	if (error) throw new Error(error.message);
	if (!ws) throw new Error("Tsy hita ity workspace ity.");
	const { verifyWorkspacePassword } = await import("./workspace-password.server-zpb3lV6l.mjs");
	if (!await verifyWorkspacePassword(data.password, ws.password_salt ?? null, ws.password_hash ?? null)) throw new Error("Mot de passe diso.");
	const { error: unlockError } = await context.supabase.from("workspace_unlocks").upsert({
		user_id: context.userId,
		workspace_id: data.id,
		expires_at: new Date(Date.now() + UNLOCK_HOURS * 36e5).toISOString()
	}, { onConflict: "user_id,workspace_id" });
	if (unlockError) throw new Error(unlockError.message);
	const { data: member } = await supabaseAdmin.from("workspace_members").select("workspace_id").eq("workspace_id", data.id).eq("user_id", context.userId).maybeSingle();
	if (!member) await supabaseAdmin.from("workspace_members").insert({
		workspace_id: data.id,
		user_id: context.userId,
		role: "member"
	});
	await supabaseAdmin.from("settings").upsert({ user_id: data.id }, {
		onConflict: "user_id",
		ignoreDuplicates: true
	});
	const { error: switchError } = await context.supabase.from("profiles").update({ active_workspace_id: data.id }).eq("id", context.userId);
	if (switchError) throw new Error(switchError.message);
	return {
		ok: true,
		id: data.id
	};
});
var resetWorkspacePassword_createServerFn_handler = createServerRpc({
	id: "958d450de5ff86fd27160e5f846f99500d27f1037c20002fe121e01fe947364e",
	name: "resetWorkspacePassword",
	filename: "src/lib/workspace.functions.ts"
}, (opts) => resetWorkspacePassword.__executeServer(opts));
var resetWorkspacePassword = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	email: stringType().trim().email().max(160),
	new_password: stringType().min(6).max(200)
}).parse(d)).handler(resetWorkspacePassword_createServerFn_handler, async ({ data, context }) => {
	const { data: ws } = await context.supabase.from("workspaces").select("id,login_email").eq("id", data.id).eq("owner_user_id", context.userId).maybeSingle();
	if (!ws) throw new Error("Ianao tsy tompon'ity workspace ity.");
	const currentEmail = (ws.login_email ?? "").trim().toLowerCase();
	if (currentEmail && currentEmail !== data.email.trim().toLowerCase()) throw new Error("Tsy mifanaraka ny email an'ity workspace ity.");
	const { hashWorkspacePassword } = await import("./workspace-password.server-zpb3lV6l.mjs");
	const { salt, hash } = await hashWorkspacePassword(data.new_password);
	const { error } = await context.supabase.from("workspaces").update({
		login_email: data.email.trim().toLowerCase(),
		password_hash: hash,
		password_salt: salt,
		password_updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.id).eq("owner_user_id", context.userId);
	if (error) throw new Error(error.message);
	await context.supabase.from("workspace_unlocks").delete().eq("workspace_id", data.id);
	return { ok: true };
});
var switchWorkspace_createServerFn_handler = createServerRpc({
	id: "7bdf26987ed3e55771579c731ccfe1d76586780ba65644698a45f4f777e085ea",
	name: "switchWorkspace",
	filename: "src/lib/workspace.functions.ts"
}, (opts) => switchWorkspace.__executeServer(opts));
var switchWorkspace = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(switchWorkspace_createServerFn_handler, async ({ data, context }) => {
	if (data.id !== context.userId) {
		const { data: ws } = await context.supabase.from("workspaces").select("id,owner_user_id,password_hash").eq("id", data.id).maybeSingle();
		if (!ws) return {
			ok: false,
			id: data.id,
			reason: "FORBIDDEN",
			message: "Tsy manana fahazoan-dàlana amin'ity workspace ity ianao."
		};
		const isOwner = ws.owner_user_id === context.userId;
		const { data: member } = await context.supabase.from("workspace_members").select("workspace_id").eq("workspace_id", data.id).eq("user_id", context.userId).maybeSingle();
		if (!member && isOwner) await context.supabase.from("workspace_members").insert({
			workspace_id: data.id,
			user_id: context.userId,
			role: "owner"
		});
		if (!member && !isOwner) return {
			ok: false,
			id: data.id,
			reason: "FORBIDDEN",
			message: "Tsy manana fahazoan-dàlana amin'ity workspace ity ianao."
		};
		if (ws.password_hash) {
			const { data: unlock } = await context.supabase.from("workspace_unlocks").select("expires_at").eq("workspace_id", data.id).eq("user_id", context.userId).maybeSingle();
			if (!(unlock?.expires_at && new Date(unlock.expires_at).getTime() > Date.now())) return {
				ok: false,
				id: data.id,
				reason: "PASSWORD_REQUIRED",
				message: "Mila mot de passe ity workspace ity."
			};
		}
		await context.supabase.from("settings").upsert({ user_id: data.id }, {
			onConflict: "user_id",
			ignoreDuplicates: true
		});
	}
	const { error } = await context.supabase.from("profiles").update({ active_workspace_id: data.id }).eq("id", context.userId);
	if (error) throw new Error(error.message);
	return {
		ok: true,
		id: data.id
	};
});
var renameWorkspace_createServerFn_handler = createServerRpc({
	id: "b5e84fec666cd2831592eea985291bfa7fa56c8690bbe5aabf157eddbf425261",
	name: "renameWorkspace",
	filename: "src/lib/workspace.functions.ts"
}, (opts) => renameWorkspace.__executeServer(opts));
var renameWorkspace = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	name: stringType().trim().min(1).max(80)
}).parse(d)).handler(renameWorkspace_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("workspaces").update({ name: data.name }).eq("id", data.id).eq("owner_user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var deleteWorkspace_createServerFn_handler = createServerRpc({
	id: "84f6237ee7a4389bfd3d9596a4a7980368f4e83bdae80dad74e0027555a07dca",
	name: "deleteWorkspace",
	filename: "src/lib/workspace.functions.ts"
}, (opts) => deleteWorkspace.__executeServer(opts));
var deleteWorkspace = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteWorkspace_createServerFn_handler, async ({ data, context }) => {
	if (data.id === context.userId) throw new Error("Tsy azo fafana ny workspace personnel.");
	const { data: owned } = await context.supabase.from("workspaces").select("id").eq("id", data.id).eq("owner_user_id", context.userId).maybeSingle();
	if (!owned) throw new Error("Ianao tsy tompon'ity workspace ity.");
	const { supabaseAdmin } = await import("./client.server-DlVXYPLr.mjs").then((n) => n.t).then((n) => n.t);
	for (const table of [
		"client_greeted",
		"client_ia_state",
		"comments_log",
		"messages_log",
		"orders",
		"product_images",
		"products",
		"training_files",
		"trainings",
		"payment_methods",
		"prompts",
		"gemini_keys",
		"scheduled_posts",
		"facebook_pages",
		"settings"
	]) {
		const { error: cleanupError } = await supabaseAdmin.from(table).delete().eq("user_id", data.id);
		if (cleanupError) console.error(`[workspace] cleanup ${table}: ${cleanupError.message}`);
	}
	const { error } = await context.supabase.from("workspaces").delete().eq("id", data.id).eq("owner_user_id", context.userId);
	if (error) throw new Error(error.message);
	const { data: profile } = await context.supabase.from("profiles").select("active_workspace_id").eq("id", context.userId).maybeSingle();
	if (profile?.active_workspace_id === data.id) await context.supabase.from("profiles").update({ active_workspace_id: context.userId }).eq("id", context.userId);
	return { ok: true };
});
var unlockWorkspaceByEmail_createServerFn_handler = createServerRpc({
	id: "c74f0594f7f044233a3b6b96fbd193b3c7348d55356d196254980d7826a96194",
	name: "unlockWorkspaceByEmail",
	filename: "src/lib/workspace.functions.ts"
}, (opts) => unlockWorkspaceByEmail.__executeServer(opts));
var unlockWorkspaceByEmail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	email: stringType().trim().email().max(160),
	password: stringType().min(1).max(200)
}).parse(d)).handler(unlockWorkspaceByEmail_createServerFn_handler, async ({ data, context }) => {
	const { supabaseAdmin } = await import("./client.server-DlVXYPLr.mjs").then((n) => n.t).then((n) => n.t);
	const { data: ws } = await supabaseAdmin.from("workspaces").select("id,name,password_hash,password_salt").eq("login_email", data.email.trim().toLowerCase()).order("created_at", { ascending: false }).limit(1);
	const target = ws?.[0];
	if (!target) throw new Error("Email na mot de passe diso.");
	const { verifyWorkspacePassword } = await import("./workspace-password.server-zpb3lV6l.mjs");
	if (!await verifyWorkspacePassword(data.password, target.password_salt ?? null, target.password_hash ?? null)) throw new Error("Email na mot de passe diso.");
	await context.supabase.from("workspace_unlocks").upsert({
		user_id: context.userId,
		workspace_id: target.id,
		expires_at: new Date(Date.now() + UNLOCK_HOURS * 36e5).toISOString()
	}, { onConflict: "user_id,workspace_id" });
	const { data: member } = await supabaseAdmin.from("workspace_members").select("workspace_id").eq("workspace_id", target.id).eq("user_id", context.userId).maybeSingle();
	if (!member) await supabaseAdmin.from("workspace_members").insert({
		workspace_id: target.id,
		user_id: context.userId,
		role: "member"
	});
	await supabaseAdmin.from("settings").upsert({ user_id: target.id }, {
		onConflict: "user_id",
		ignoreDuplicates: true
	});
	await context.supabase.from("profiles").update({ active_workspace_id: target.id }).eq("id", context.userId);
	return {
		ok: true,
		id: target.id,
		name: target.name
	};
});
//#endregion
export { createWorkspace_createServerFn_handler, deleteWorkspace_createServerFn_handler, getWorkspaceAccess_createServerFn_handler, listWorkspaces_createServerFn_handler, renameWorkspace_createServerFn_handler, resetWorkspacePassword_createServerFn_handler, switchWorkspace_createServerFn_handler, unlockWorkspaceByEmail_createServerFn_handler, unlockWorkspace_createServerFn_handler };
