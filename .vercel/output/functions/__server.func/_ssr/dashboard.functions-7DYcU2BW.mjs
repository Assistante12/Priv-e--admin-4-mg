import { r as createServerFn } from "./server-PdCEgQXm.mjs";
import { t as createServerRpc } from "./createServerRpc-CNvf87y9.mjs";
import { t as requireWorkspaceAuth } from "./workspace-middleware-BESKEWcR.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, r as enumType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.functions-7DYcU2BW.js
var promptCategory = enumType([
	"global",
	"message",
	"comment",
	"md",
	"tutorial"
]);
var listPrompts_createServerFn_handler = createServerRpc({
	id: "22294e75c920f7f5aff4ed203a7232ff6ad286b92bc5ec97e17ef2406637688d",
	name: "listPrompts",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => listPrompts.__executeServer(opts));
var listPrompts = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(listPrompts_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("prompts").select("*").eq("user_id", context.userId).order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var upsertPromptSchema = objectType({
	id: stringType().nullable().optional(),
	name: stringType().max(100).optional().default("Prompt IA"),
	content: stringType().min(1).max(2e4),
	category: promptCategory,
	is_active: booleanType(),
	page_id: stringType().nullable().optional(),
	page_ids: arrayType(stringType()).optional(),
	assistance_type: enumType([
		"online_work",
		"training",
		"sales",
		"all"
	]).nullable().optional()
});
var upsertPrompt_createServerFn_handler = createServerRpc({
	id: "91a8eecef9cce275b1bcb4f6a44a4288b429b0bb0588b3234612a3a16f91508f",
	name: "upsertPrompt",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => upsertPrompt.__executeServer(opts));
var upsertPrompt = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => upsertPromptSchema.parse(d)).handler(upsertPrompt_createServerFn_handler, async ({ data, context }) => {
	const pageIds = data.page_ids ?? (data.page_id ? [data.page_id] : []);
	const cleanId = data.id && data.id.trim().length > 0 ? data.id.trim() : void 0;
	const payload = {
		...data,
		name: data.name?.trim() || "Prompt IA",
		page_ids: pageIds,
		page_id: pageIds.length === 1 ? pageIds[0] : null,
		assistance_type: data.assistance_type ?? null,
		user_id: context.userId
	};
	if (cleanId) payload.id = cleanId;
	else delete payload.id;
	const { error } = await context.supabase.from("prompts").upsert(payload);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var deletePrompt_createServerFn_handler = createServerRpc({
	id: "596aa7c79f858ba0682bfe9e9bfba0a5a12ada404e5976030cd39d78ac663352",
	name: "deletePrompt",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => deletePrompt.__executeServer(opts));
var deletePrompt = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deletePrompt_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("prompts").delete().eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var listGeminiKeys_createServerFn_handler = createServerRpc({
	id: "98818ae7a9ff12f23f7c580d09e55be8912eccd6ddf1cdf008c191baa8cf9d89",
	name: "listGeminiKeys",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => listGeminiKeys.__executeServer(opts));
var listGeminiKeys = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(listGeminiKeys_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("gemini_keys").select("id,label,is_active,last_used_at,error_count,disabled_until,api_key,created_at").eq("user_id", context.userId).order("created_at", { ascending: true });
	if (error) throw new Error(error.message);
	return (data ?? []).map((k) => ({
		...k,
		api_key_masked: k.api_key ? `${k.api_key.slice(0, 6)}…${k.api_key.slice(-4)}` : "",
		api_key: void 0
	}));
});
var upsertKeySchema = objectType({
	id: stringType().uuid().optional(),
	label: stringType().min(1).max(60),
	api_key: stringType().min(10).max(400),
	is_active: booleanType()
});
var upsertGeminiKey_createServerFn_handler = createServerRpc({
	id: "b98af9bc0a51d23bfe05371676bf39064b411693ecf0f38b1f8556d241260712",
	name: "upsertGeminiKey",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => upsertGeminiKey.__executeServer(opts));
var upsertGeminiKey = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => upsertKeySchema.parse(d)).handler(upsertGeminiKey_createServerFn_handler, async ({ data, context }) => {
	const cleanKey = data.api_key.trim();
	const { fetchAvailableGeminiModels } = await import("./ai-engine.server-CTjOATz3.mjs");
	const testRes = await fetchAvailableGeminiModels(cleanKey);
	if (!testRes.ok) throw new Error(`La clé API Gemini est refusée par Google: ${testRes.error}`);
	const payload = {
		...data,
		api_key: cleanKey,
		user_id: context.userId,
		error_count: 0,
		disabled_until: null
	};
	const { error } = await context.supabase.from("gemini_keys").upsert(payload);
	if (error) throw new Error(error.message);
	return {
		ok: true,
		models: testRes.models
	};
});
var testGeminiKey_createServerFn_handler = createServerRpc({
	id: "79c4b70547f4d45ba8b25ff4145bb6b048815b5b5d75e1584fedbd5d07368346",
	name: "testGeminiKey",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => testGeminiKey.__executeServer(opts));
var testGeminiKey = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(testGeminiKey_createServerFn_handler, async ({ data, context }) => {
	const { data: keyData, error } = await context.supabase.from("gemini_keys").select("*").eq("id", data.id).eq("user_id", context.userId).single();
	if (error || !keyData) throw new Error("Clé introuvable");
	const { fetchAvailableGeminiModels } = await import("./ai-engine.server-CTjOATz3.mjs");
	const res = await fetchAvailableGeminiModels((keyData.api_key || "").trim());
	if (!res.ok) {
		await context.supabase.from("gemini_keys").update({ error_count: (keyData.error_count ?? 0) + 1 }).eq("id", data.id);
		throw new Error(res.error || "Clé Gemini invalide ou inaccessible");
	}
	await context.supabase.from("gemini_keys").update({
		error_count: 0,
		disabled_until: null,
		is_active: true
	}).eq("id", data.id);
	return {
		ok: true,
		models: res.models
	};
});
var deleteGeminiKey_createServerFn_handler = createServerRpc({
	id: "f770295ee07e79c3983bbd819b49f4d50137501c481a020f3acdf578fd2d4435",
	name: "deleteGeminiKey",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => deleteGeminiKey.__executeServer(opts));
var deleteGeminiKey = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteGeminiKey_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("gemini_keys").delete().eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var toggleGeminiKey_createServerFn_handler = createServerRpc({
	id: "431fdc1077515d748abb5c96ebc180b1df0d50861e7574fba5a690eb92a438f1",
	name: "toggleGeminiKey",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => toggleGeminiKey.__executeServer(opts));
var toggleGeminiKey = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	is_active: booleanType()
}).parse(d)).handler(toggleGeminiKey_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("gemini_keys").update({
		is_active: data.is_active,
		error_count: 0,
		disabled_until: null
	}).eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var resetAllGeminiKeys_createServerFn_handler = createServerRpc({
	id: "eacf47008cfd5e8686328db3e67a861b35d3e4dc7eaacfc7e329e4f0af70dce8",
	name: "resetAllGeminiKeys",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => resetAllGeminiKeys.__executeServer(opts));
var resetAllGeminiKeys = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).handler(resetAllGeminiKeys_createServerFn_handler, async ({ context }) => {
	const { error } = await context.supabase.from("gemini_keys").update({
		is_active: true,
		error_count: 0,
		disabled_until: null
	}).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var getSettings_createServerFn_handler = createServerRpc({
	id: "7180026c600c721a62b1ac583b5fea60a9a24b9cef2c2e9d29b375367c760773",
	name: "getSettings",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => getSettings.__executeServer(opts));
var getSettings = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(getSettings_createServerFn_handler, async ({ context }) => {
	const { data: allSettings, error } = await context.supabase.from("settings").select("*").eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	if (!allSettings || allSettings.length === 0) {
		const { data: created } = await context.supabase.from("settings").upsert({ user_id: context.userId }, { onConflict: "user_id" }).select("*").maybeSingle();
		return created ?? null;
	}
	if (allSettings.length > 1) {
		const baseSettings = { ...allSettings[0] };
		for (let i = 1; i < allSettings.length; i++) {
			const other = allSettings[i];
			for (const key of Object.keys(other)) if (other[key] !== null && other[key] !== void 0 && other[key] !== "") {
				if (baseSettings[key] == null || baseSettings[key] === "") baseSettings[key] = other[key];
			}
		}
		await context.supabase.from("settings").upsert(baseSettings, { onConflict: "user_id" });
		for (let i = 1; i < allSettings.length; i++) {
			const other = allSettings[i];
			if (other.id !== baseSettings.id) await context.supabase.from("settings").delete().eq("id", other.id);
		}
		return baseSettings;
	}
	const record = allSettings[0];
	try {
		const { getAccountCustomKeys } = await import("./ssr.mjs").then((n) => n.t);
		const customKeys = getAccountCustomKeys(context.userId);
		record.facebook_app_id = record.facebook_app_id || customKeys.facebook_app_id || "";
		record.facebook_app_secret = record.facebook_app_secret || customKeys.facebook_app_secret || "";
		record.facebook_verify_token = record.facebook_verify_token || customKeys.facebook_verify_token || "";
		record.gemini_api_key = record.gemini_api_key || customKeys.gemini_api_key || "";
		record.lovable_api_key = record.lovable_api_key || customKeys.lovable_api_key || "";
		record.supabase_project_url = record.supabase_project_url || customKeys.supabase_project_url || "";
		record.supabase_anon_key = record.supabase_anon_key || customKeys.supabase_anon_key || "";
		record.supabase_service_role_key = record.supabase_service_role_key || customKeys.supabase_service_role_key || "";
		record.supabase_project_id = record.supabase_project_id || customKeys.supabase_project_id || "";
	} catch (err) {
		console.warn("[getSettings] Failed to load account custom keys:", err);
	}
	if (!record.facebook_app_id || !record.facebook_app_secret) try {
		const { resolveFacebookApp } = await import("./facebook-app.server-CJ5Qw0y6.mjs");
		const app = await resolveFacebookApp(context.userId);
		if (app.appId) record.facebook_app_id = record.facebook_app_id || app.appId;
		if (app.appSecret) record.facebook_app_secret = record.facebook_app_secret || app.appSecret;
		if (app.verifyToken) record.facebook_verify_token = record.facebook_verify_token || app.verifyToken;
	} catch (err) {
		console.warn("[getSettings] Failed to resolve Facebook app credentials:", err);
	}
	return record;
});
var updateSettingsSchema = objectType({
	assistance_type: enumType([
		"online_work",
		"training",
		"sales"
	]).optional().default("online_work"),
	auto_reply_messages: booleanType().optional().default(true),
	auto_reply_comments: booleanType().optional().default(true),
	comment_scan_interval_minutes: numberType().int().min(1).max(60).optional().default(5),
	use_lovable_ai_fallback: booleanType().optional().default(true),
	default_model: stringType().min(1).max(80).optional().default("gemini-3.6-flash"),
	private_message_link: stringType().max(500).nullable().optional(),
	facebook_app_id: stringType().max(100).nullable().optional(),
	facebook_app_secret: stringType().max(200).nullable().optional(),
	facebook_verify_token: stringType().max(200).nullable().optional(),
	gemini_api_key: stringType().max(500).nullable().optional(),
	lovable_api_key: stringType().max(500).nullable().optional(),
	supabase_project_url: stringType().max(500).nullable().optional(),
	supabase_anon_key: stringType().max(500).nullable().optional(),
	supabase_service_role_key: stringType().max(500).nullable().optional(),
	supabase_project_id: stringType().max(200).nullable().optional()
});
var updateSettings_createServerFn_handler = createServerRpc({
	id: "7360a65b44b390ce454157541ae48f1b17feecce8fdb6b9e8a5af44cfc399626",
	name: "updateSettings",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => updateSettings.__executeServer(opts));
var updateSettings = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => updateSettingsSchema.parse(d)).handler(updateSettings_createServerFn_handler, async ({ data, context }) => {
	const clean = (value) => {
		return (value?.trim() ?? "") || null;
	};
	const cleanedFbAppId = clean(data.facebook_app_id);
	const cleanedFbAppSecret = clean(data.facebook_app_secret);
	const cleanedFbVerifyToken = clean(data.facebook_verify_token);
	const cleanedGeminiKey = clean(data.gemini_api_key);
	const cleanedLovableKey = clean(data.lovable_api_key);
	const cleanedSbUrl = clean(data.supabase_project_url);
	const cleanedSbAnon = clean(data.supabase_anon_key);
	const cleanedSbService = clean(data.supabase_service_role_key);
	const cleanedSbProjId = clean(data.supabase_project_id);
	let finalFbAppId = cleanedFbAppId;
	let finalFbAppSecret = cleanedFbAppSecret;
	let finalFbVerifyToken = cleanedFbVerifyToken;
	if (cleanedFbAppId === null || cleanedFbAppSecret === null) {
		const { data: existing } = await context.supabase.from("settings").select("facebook_app_id,facebook_app_secret,facebook_verify_token").eq("user_id", context.userId).maybeSingle();
		if (finalFbAppId === null && existing?.facebook_app_id) finalFbAppId = existing.facebook_app_id;
		if (finalFbAppSecret === null && existing?.facebook_app_secret) finalFbAppSecret = existing.facebook_app_secret;
		if (finalFbVerifyToken === null && existing?.facebook_verify_token) finalFbVerifyToken = existing.facebook_verify_token;
	}
	try {
		const { saveAccountCustomKeys } = await import("./ssr.mjs").then((n) => n.t);
		await saveAccountCustomKeys(context.userId, {
			facebook_app_id: finalFbAppId,
			facebook_app_secret: finalFbAppSecret,
			facebook_verify_token: finalFbVerifyToken,
			gemini_api_key: cleanedGeminiKey,
			lovable_api_key: cleanedLovableKey,
			supabase_project_url: cleanedSbUrl,
			supabase_anon_key: cleanedSbAnon,
			supabase_service_role_key: cleanedSbService,
			supabase_project_id: cleanedSbProjId
		});
	} catch (err) {
		console.warn("[updateSettings] Failed to save custom keys:", err);
	}
	const { error } = await context.supabase.from("settings").upsert({
		assistance_type: data.assistance_type,
		auto_reply_messages: data.auto_reply_messages,
		auto_reply_comments: data.auto_reply_comments,
		comment_scan_interval_minutes: data.comment_scan_interval_minutes,
		use_lovable_ai_fallback: data.use_lovable_ai_fallback,
		default_model: data.default_model,
		user_id: context.userId,
		private_message_link: clean(data.private_message_link),
		facebook_app_id: finalFbAppId,
		facebook_app_secret: finalFbAppSecret,
		facebook_verify_token: finalFbVerifyToken,
		...cleanedSbUrl ? { supabase_project_url: cleanedSbUrl } : {},
		...cleanedSbAnon ? { supabase_anon_key: cleanedSbAnon } : {},
		...cleanedSbUrl && cleanedSbAnon ? { supabase_connected: true } : {}
	}, { onConflict: "user_id" });
	if (error) throw new Error(error.message);
	return { ok: true };
});
var listFacebookPages_createServerFn_handler = createServerRpc({
	id: "21cf3e4bbf168e8297d295171653de7c91c371f7e7cba88fc6198000c959b283",
	name: "listFacebookPages",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => listFacebookPages.__executeServer(opts));
var listFacebookPages = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(listFacebookPages_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("facebook_pages").select("id,page_id,page_name,is_connected,webhook_subscribed,token_expires_at,created_at").eq("user_id", context.userId).order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var disconnectFacebookPage_createServerFn_handler = createServerRpc({
	id: "2ddd2bfa1fc5d7513eb5dc4184e00e441687ece8edd28c15245d4d8e7a424b68",
	name: "disconnectFacebookPage",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => disconnectFacebookPage.__executeServer(opts));
var disconnectFacebookPage = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(disconnectFacebookPage_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("facebook_pages").delete().eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var getDashboardStats_createServerFn_handler = createServerRpc({
	id: "d8dd0f2f33ee8ce5e2ea2bfc749715b8e981950fa8bc0e14ec15d540b50039e9",
	name: "getDashboardStats",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => getDashboardStats.__executeServer(opts));
var getDashboardStats = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(getDashboardStats_createServerFn_handler, async ({ context }) => {
	const [msgs, comments, keys, pages] = await Promise.all([
		context.supabase.from("messages_log").select("id", {
			count: "exact",
			head: true
		}).eq("user_id", context.userId),
		context.supabase.from("comments_log").select("id", {
			count: "exact",
			head: true
		}).eq("user_id", context.userId).eq("replied", true),
		context.supabase.from("gemini_keys").select("id", {
			count: "exact",
			head: true
		}).eq("user_id", context.userId).eq("is_active", true),
		context.supabase.from("facebook_pages").select("id", {
			count: "exact",
			head: true
		}).eq("user_id", context.userId).eq("is_connected", true)
	]);
	return {
		messages: msgs.count ?? 0,
		comments_replied: comments.count ?? 0,
		active_keys: keys.count ?? 0,
		connected_pages: pages.count ?? 0
	};
});
var listMessagesLog_createServerFn_handler = createServerRpc({
	id: "f31d964c77892d35771aa382027324a6d76bd117650d79ef2dafac636002fcd4",
	name: "listMessagesLog",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => listMessagesLog.__executeServer(opts));
var listMessagesLog = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(listMessagesLog_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("messages_log").select("*").eq("user_id", context.userId).order("created_at", { ascending: false }).limit(100);
	if (error) throw new Error(error.message);
	return data ?? [];
});
var listCommentsLog_createServerFn_handler = createServerRpc({
	id: "ff748145b51d921c6cb74e3f40429aa995ca5cee9335a287e920ef615aa11913",
	name: "listCommentsLog",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => listCommentsLog.__executeServer(opts));
var listCommentsLog = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(listCommentsLog_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("comments_log").select("*").eq("user_id", context.userId).order("created_at", { ascending: false }).limit(100);
	if (error) throw new Error(error.message);
	return data ?? [];
});
var replyAllPendingMessages_createServerFn_handler = createServerRpc({
	id: "65cfd0d1bb1135624470e7931b9aa3fc11ef75b26198cc410b16f6bd13656ea6",
	name: "replyAllPendingMessages",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => replyAllPendingMessages.__executeServer(opts));
var replyAllPendingMessages = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).handler(replyAllPendingMessages_createServerFn_handler, async ({ context }) => {
	const { replyAllPendingForUser } = await import("./ai-engine.server-CTjOATz3.mjs");
	return await replyAllPendingForUser(context.userId, { force: true });
});
var scanAndReplyCommentsNow_createServerFn_handler = createServerRpc({
	id: "f876bdfd1ef92e97f9fb83763eb26e3df07e33c2b4dac416805d20505ad8158c",
	name: "scanAndReplyCommentsNow",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => scanAndReplyCommentsNow.__executeServer(opts));
var scanAndReplyCommentsNow = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).handler(scanAndReplyCommentsNow_createServerFn_handler, async ({ context }) => {
	const { scanAndReplyCommentsForUser } = await import("./ai-engine.server-CTjOATz3.mjs");
	return await scanAndReplyCommentsForUser(context.userId, { force: true });
});
//#endregion
export { deleteGeminiKey_createServerFn_handler, deletePrompt_createServerFn_handler, disconnectFacebookPage_createServerFn_handler, getDashboardStats_createServerFn_handler, getSettings_createServerFn_handler, listCommentsLog_createServerFn_handler, listFacebookPages_createServerFn_handler, listGeminiKeys_createServerFn_handler, listMessagesLog_createServerFn_handler, listPrompts_createServerFn_handler, replyAllPendingMessages_createServerFn_handler, resetAllGeminiKeys_createServerFn_handler, scanAndReplyCommentsNow_createServerFn_handler, testGeminiKey_createServerFn_handler, toggleGeminiKey_createServerFn_handler, updateSettings_createServerFn_handler, upsertGeminiKey_createServerFn_handler, upsertPrompt_createServerFn_handler };
