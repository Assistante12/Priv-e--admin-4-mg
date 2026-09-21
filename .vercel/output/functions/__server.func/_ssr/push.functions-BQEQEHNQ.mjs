import { r as createServerFn } from "./server-PdCEgQXm.mjs";
import { t as createServerRpc } from "./createServerRpc-CNvf87y9.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BNEF6n4w.mjs";
import { a as objectType, n as booleanType, o as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/push.functions-BQEQEHNQ.js
var getPushState_createServerFn_handler = createServerRpc({
	id: "683af635b16340adf571c0ca2f7a6bfacf490bf231cf9e4b78df7c3ad9355fbe",
	name: "getPushState",
	filename: "src/lib/push.functions.ts"
}, (opts) => getPushState.__executeServer(opts));
var getPushState = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getPushState_createServerFn_handler, async ({ context }) => {
	const [tokens, settings] = await Promise.all([context.supabase.from("push_tokens").select("id,token,enabled,user_agent,created_at").eq("user_id", context.userId).order("created_at", { ascending: false }), context.supabase.from("push_settings").select("auto_ai_enabled").eq("user_id", context.userId).maybeSingle()]);
	return {
		devices: (tokens.data ?? []).map((t) => ({
			id: t.id,
			enabled: t.enabled,
			user_agent: t.user_agent,
			created_at: t.created_at,
			token_preview: `${(t.token ?? "").slice(0, 10)}…`
		})),
		autoAiEnabled: settings.data?.auto_ai_enabled ?? true
	};
});
var savePushToken_createServerFn_handler = createServerRpc({
	id: "281f8d7a4a4a30294e6b39063c1a7ccc795c3c154f3ea64df4010cec4c7d0a07",
	name: "savePushToken",
	filename: "src/lib/push.functions.ts"
}, (opts) => savePushToken.__executeServer(opts));
var savePushToken = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	token: stringType().min(20).max(4e3),
	user_agent: stringType().max(300).optional()
}).parse(d)).handler(savePushToken_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("push_tokens").upsert({
		user_id: context.userId,
		token: data.token,
		user_agent: data.user_agent ?? null,
		enabled: true,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}, { onConflict: "token" });
	if (error) throw new Error(error.message);
	return { ok: true };
});
var setAutoAiPush_createServerFn_handler = createServerRpc({
	id: "c09f0318d87fcdc7fd0e3c75e13bd71e9885a312708ec77cee06f0ab9a895a7f",
	name: "setAutoAiPush",
	filename: "src/lib/push.functions.ts"
}, (opts) => setAutoAiPush.__executeServer(opts));
var setAutoAiPush = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ enabled: booleanType() }).parse(d)).handler(setAutoAiPush_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("push_settings").upsert({
		user_id: context.userId,
		auto_ai_enabled: data.enabled,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}, { onConflict: "user_id" });
	if (error) throw new Error(error.message);
	return { ok: true };
});
var removePushDevice_createServerFn_handler = createServerRpc({
	id: "730ed6e4e7255918c116c7b35ee9bf18148348ef1ca23464d0e2621431b05eba",
	name: "removePushDevice",
	filename: "src/lib/push.functions.ts"
}, (opts) => removePushDevice.__executeServer(opts));
var removePushDevice = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(removePushDevice_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("push_tokens").delete().eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var sendTestPush_createServerFn_handler = createServerRpc({
	id: "f58b21b44b8a2a06145fee076324bf6c4b16dc1ba81aa78a98b43fae6cea4152",
	name: "sendTestPush",
	filename: "src/lib/push.functions.ts"
}, (opts) => sendTestPush.__executeServer(opts));
var sendTestPush = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(sendTestPush_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("push_tokens").select("token").eq("user_id", context.userId).eq("enabled", true);
	if (error) throw new Error(error.message);
	const tokens = (data ?? []).map((t) => t.token).filter(Boolean);
	if (tokens.length === 0) throw new Error("Aucun appareil enregistré pour les notifications.");
	const { generateAiPushMessage, sendPushToTokens } = await import("./push-notify.server-hc-DVgBM.mjs");
	const message = await generateAiPushMessage();
	return {
		...await sendPushToTokens(tokens, message),
		message
	};
});
//#endregion
export { getPushState_createServerFn_handler, removePushDevice_createServerFn_handler, savePushToken_createServerFn_handler, sendTestPush_createServerFn_handler, setAutoAiPush_createServerFn_handler };
