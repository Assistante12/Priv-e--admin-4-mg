//#region node_modules/.nitro/vite/services/ssr/assets/push-notify.server-hc-DVgBM.js
var GATEWAY_URL = "https://connector-gateway.lovable.dev/firebase_messaging";
var WHATSAPP_LINK = `https://wa.me/261323911654?text=${encodeURIComponent("Bonjour, je souhaite installer l'Assistante Virtuelle (IA) sur ma page Facebook et WhatsApp.")}`;
var FALLBACK_MESSAGES = [
	{
		title: "Assistante Virtuelle IA – 5 000 Ar monja",
		body: "Maniry ve ianao hametraka IA mamaly ny hafatrao amin'ny Facebook sy WhatsApp 24/24? 5 000 Ar monja, mandoa vola rehefa vita ny fametrahana. Tsindrio eto hifandraisana aminay amin'ny WhatsApp."
	},
	{
		title: "IA mamaly ny mpanjifanao andro sy alina",
		body: "Apetahay ao amin'ny pejy Facebook sy WhatsApp-nao ny Assistante Virtuelle, 5 000 Ar monja. Mandoa vola ianao rehefa vita ny configuration. Tsindrio eto handefa hafatra aminay amin'ny WhatsApp."
	},
	{
		title: "Aza very mpanjifa intsony – Andramo ny IA",
		body: "Ireo hafatra sy fanehoan-kevitra ao amin'ny pejy-nao dia valian'ny IA avy hatrany. 5 000 Ar monja ny fametrahana, mandoa rehefa vita. Raha liana ianao dia tsindrio eto hiresahana aminay amin'ny WhatsApp."
	}
];
async function generateAiPushMessage() {
	const apiKey = process.env["LOVABLE_API_KEY"];
	const fallback = FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
	if (!apiKey) return fallback;
	try {
		const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				model: "google/gemini-2.5-flash",
				messages: [{
					role: "system",
					content: "Manoratra notification push fanaovana dokam-barotra amin'ny teny MALAGASY ianao, matihanina, fohy ary manaja ny mpamaky. Valio amin'ny JSON IHANY: {\"title\": \"...\", \"body\": \"...\"}. Lohateny farafahakeliny 60 tarehintsoratra, vatana farafahakeliny 170 tarehintsoratra. Aza mampiasa emoji be (1 farafahakeliny)."
				}, {
					role: "user",
					content: "Tolotra: fametrahana Assistante Virtuelle (IA) izay mamaly ho azy ny hafatra sy fanehoan-kevitra ao amin'ny pejy Facebook sy WhatsApp. Vidiny: 5 000 Ar monja, mandoa vola rehefa VITA ny fametrahana/configuration. Asao ny mpamaky hanindry ny bokotra/handefa hafatra amin'ny WhatsApp raha liana izy. Asio antso mivantana (call to action) mankany amin'ny WhatsApp. Ovay ny endrika isaky ny manoratra."
				}]
			})
		});
		if (!res.ok) {
			console.error(`[push] AI message failed [${res.status}]: ${await res.text()}`);
			return fallback;
		}
		const match = ((await res.json()).choices?.[0]?.message?.content ?? "").match(/\{[\s\S]*\}/);
		if (!match) return fallback;
		const parsed = JSON.parse(match[0]);
		if (!parsed.title || !parsed.body) return fallback;
		return {
			title: parsed.title.slice(0, 80),
			body: parsed.body.slice(0, 220)
		};
	} catch (e) {
		console.error("[push] AI message error:", e);
		return fallback;
	}
}
async function sendPushToTokens(tokens, message, link = WHATSAPP_LINK) {
	const lovableKey = process.env["LOVABLE_API_KEY"];
	const connectionKey = process.env["FIREBASE_MESSAGING_API_KEY"];
	if (!lovableKey || !connectionKey) throw new Error("Firebase Messaging n'est pas configuré (clés manquantes).");
	let sent = 0;
	let failed = 0;
	const invalidTokens = [];
	for (const token of tokens) try {
		const res = await fetch(`${GATEWAY_URL}/v1/projects/_/messages:send`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${lovableKey}`,
				"X-Connection-Api-Key": connectionKey,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ message: {
				token,
				notification: {
					title: message.title,
					body: message.body
				},
				data: { link },
				webpush: {
					notification: {
						title: message.title,
						body: message.body,
						icon: "/notification-logo.png",
						badge: "/notification-logo.png"
					},
					fcm_options: { link }
				}
			} })
		});
		if (res.ok) sent++;
		else {
			failed++;
			const body = await res.text();
			console.error(`[push] send failed [${res.status}]: ${body}`);
			if (res.status === 404 || res.status === 400) invalidTokens.push(token);
		}
	} catch (e) {
		failed++;
		console.error("[push] send error:", e);
	}
	return {
		sent,
		failed,
		invalidTokens
	};
}
/** Créneaux automatiques: 13h et 20h heure de Madagascar (UTC+3). */
function currentSlot(now) {
	const mgTime = new Date(now.getTime() + 108e5);
	const hour = mgTime.getUTCHours();
	if (hour !== 13 && hour !== 20) return null;
	return {
		key: `${mgTime.toISOString().slice(0, 10)}-${hour}h`,
		hour
	};
}
async function maybeSendScheduledPush() {
	const slot = currentSlot(/* @__PURE__ */ new Date());
	if (!slot) return { skipped: true };
	const { supabaseAdmin } = await import("./client.server-D9Q5-j_o.mjs").then((n) => n.t).then((n) => n.t);
	const { error: claimError } = await supabaseAdmin.from("push_dispatch_log").insert({ slot_key: slot.key });
	if (claimError) return { skipped: true };
	const { data: settings } = await supabaseAdmin.from("push_settings").select("user_id").eq("auto_ai_enabled", true);
	const allowedUsers = new Set((settings ?? []).map((s) => s.user_id));
	const { data: tokenRows } = await supabaseAdmin.from("push_tokens").select("token,user_id").eq("enabled", true);
	const tokens = (tokenRows ?? []).filter((t) => allowedUsers.has(t.user_id)).map((t) => t.token).filter(Boolean);
	if (tokens.length === 0) {
		await supabaseAdmin.from("push_dispatch_log").update({
			sent_count: 0,
			title: "aucun destinataire"
		}).eq("slot_key", slot.key);
		return { sent: 0 };
	}
	const message = await generateAiPushMessage();
	const result = await sendPushToTokens(tokens, message);
	if (result.invalidTokens.length > 0) await supabaseAdmin.from("push_tokens").delete().in("token", result.invalidTokens);
	await supabaseAdmin.from("push_dispatch_log").update({
		title: message.title,
		body: message.body,
		sent_count: result.sent
	}).eq("slot_key", slot.key);
	return { sent: result.sent };
}
/**
* Envoi ciblé aux appareils des administrateurs d'un scope (workspace),
* sans jamais lever d'erreur. Le scope personnel a le même id que l'utilisateur.
*/
async function pushToUser(userId, message, link) {
	try {
		if (!process.env["LOVABLE_API_KEY"] || !process.env["FIREBASE_MESSAGING_API_KEY"]) {
			console.warn("[push] Firebase Messaging non configuré — notification ignorée.");
			return { sent: 0 };
		}
		const { supabaseAdmin } = await import("./client.server-D9Q5-j_o.mjs").then((n) => n.t).then((n) => n.t);
		const recipients = /* @__PURE__ */ new Set([userId]);
		const { data: members } = await supabaseAdmin.from("workspace_members").select("user_id").eq("workspace_id", userId);
		for (const m of members ?? []) if (m.user_id) recipients.add(m.user_id);
		const { data } = await supabaseAdmin.from("push_tokens").select("token").in("user_id", [...recipients]).eq("enabled", true);
		const tokens = (data ?? []).map((t) => t.token).filter(Boolean);
		if (tokens.length === 0) return { sent: 0 };
		const result = await sendPushToTokens(tokens, message, link ?? "/orders");
		if (result.invalidTokens.length > 0) await supabaseAdmin.from("push_tokens").delete().in("token", result.invalidTokens);
		return { sent: result.sent };
	} catch (e) {
		console.error("[push] pushToUser error:", e);
		return { sent: 0 };
	}
}
/** Notification "nouvelle commande" pour l'admin. */
async function notifyNewOrderToAdmin(userId, order) {
	const qty = order.quantity && order.quantity > 1 ? ` ×${order.quantity}` : "";
	const item = order.item?.trim() || (order.type === "training" ? "Formation" : "Produit");
	await pushToUser(userId, {
		title: "🛒 Kaomandy vaovao tonga!",
		body: `${order.clientName?.trim() || "Mpanjifa Messenger"} : ${item}${qty}. Tsindrio hijery ny antsipiriany.`
	}, "/orders");
}
//#endregion
export { generateAiPushMessage, maybeSendScheduledPush, notifyNewOrderToAdmin, sendPushToTokens };
