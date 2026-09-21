import { r as createServerFn } from "./server-BRvJ2kb2.mjs";
import { t as createServerRpc } from "./createServerRpc-CtiMBgU6.mjs";
import { t as requireWorkspaceAuth } from "./workspace-middleware-DCv0kXWS.mjs";
import { a as objectType, o as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discussions.functions-D9qpS5Gp.js
/** List distinct conversations (grouped by page_id + sender_id) from messages_log */
var listConversations_createServerFn_handler = createServerRpc({
	id: "44ff229f2fc68f08d6074c790f566e1f923bdc284c1f960d9f6c492e910aa32d",
	name: "listConversations",
	filename: "src/lib/discussions.functions.ts"
}, (opts) => listConversations.__executeServer(opts));
var listConversations = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(listConversations_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("messages_log").select("page_id,sender_id,sender_name,content,ai_response,direction,created_at").eq("user_id", context.userId).order("created_at", { ascending: false }).limit(500);
	if (error) throw new Error(error.message);
	const map = /* @__PURE__ */ new Map();
	for (const r of data ?? []) {
		if (!r.sender_id || !r.page_id) continue;
		const key = `${r.page_id}::${r.sender_id}`;
		if (!map.has(key)) map.set(key, {
			page_id: r.page_id,
			client_fb_id: r.sender_id,
			client_fb_name: r.sender_name ?? r.sender_id,
			last_message: r.content ?? r.ai_response ?? "",
			last_at: r.created_at
		});
	}
	const list = Array.from(map.values());
	const { data: states } = await context.supabase.from("client_ia_state").select("*").eq("user_id", context.userId);
	const stateMap = new Map((states ?? []).map((s) => [`${s.page_id}::${s.client_fb_id}`, s.ia_stopped]));
	return list.map((c) => ({
		...c,
		ia_stopped: stateMap.get(`${c.page_id}::${c.client_fb_id}`) ?? false
	}));
});
var listConversationMessages_createServerFn_handler = createServerRpc({
	id: "73a2572a6273eb80963faa0325ca5f780d925c2f61992189cab1957cc94b584c",
	name: "listConversationMessages",
	filename: "src/lib/discussions.functions.ts"
}, (opts) => listConversationMessages.__executeServer(opts));
var listConversationMessages = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({
	page_id: stringType(),
	client_fb_id: stringType()
}).parse(d)).handler(listConversationMessages_createServerFn_handler, async ({ data, context }) => {
	const { data: rows, error } = await context.supabase.from("messages_log").select("*").eq("page_id", data.page_id).eq("sender_id", data.client_fb_id).eq("user_id", context.userId).order("created_at", { ascending: true }).limit(300);
	if (error) throw new Error(error.message);
	return rows ?? [];
});
var sendDiscussionMessage_createServerFn_handler = createServerRpc({
	id: "5223d0c7cf3d331be96dcbbd38a887c75555c82c8eef791ef89311e31dc3d215",
	name: "sendDiscussionMessage",
	filename: "src/lib/discussions.functions.ts"
}, (opts) => sendDiscussionMessage.__executeServer(opts));
var sendDiscussionMessage = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({
	page_id: stringType(),
	client_fb_id: stringType(),
	text: stringType().min(1).max(4e3)
}).parse(d)).handler(sendDiscussionMessage_createServerFn_handler, async ({ data, context }) => {
	const { data: page } = await context.supabase.from("facebook_pages").select("page_id,page_access_token,page_name").eq("page_id", data.page_id).eq("user_id", context.userId).maybeSingle();
	if (!page?.page_access_token) throw new Error("Page introuvable ou token manquant");
	const res = await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${page.page_access_token}`, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			recipient: { id: data.client_fb_id },
			message: { text: data.text },
			messaging_type: "RESPONSE"
		})
	});
	if (!res.ok) {
		const t = await res.text();
		throw new Error(`Facebook: ${res.status} ${t.slice(0, 200)}`);
	}
	await context.supabase.from("messages_log").insert({
		user_id: context.userId,
		page_id: data.page_id,
		sender_id: data.client_fb_id,
		direction: "outgoing",
		content: data.text,
		status: "sent"
	});
	return { ok: true };
});
//#endregion
export { listConversationMessages_createServerFn_handler, listConversations_createServerFn_handler, sendDiscussionMessage_createServerFn_handler };
