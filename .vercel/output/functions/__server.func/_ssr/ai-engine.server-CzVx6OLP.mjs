import { n as getAccountCustomKeys } from "./ssr.mjs";
import { n as supabaseAdmin } from "./client.server-DlVXYPLr.mjs";
import fs from "fs";
import path from "path";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-engine.server-CzVx6OLP.js
var GEMINI_ROTATION_MODELS = [
	"gemini-3.8-flash",
	"gemini-3.1-flash-lite",
	"gemini-2.5-flash",
	"gemini-2.5-flash-lite",
	"gemini-3.5-flash",
	"gemini-3.6-flash",
	"gemini-flash-latest",
	"gemini-2.5-pro"
];
var geminiRotationIndex = 0;
var GEMINI_MODEL = "gemini-3.8-flash";
/**
* Valide ou remappe le nom de modèle vers les modèles Gemini supportés.
*/
function resolveGeminiModel(rawModel) {
	const m = (rawModel || "").trim().toLowerCase();
	if (!m) return GEMINI_MODEL;
	if (GEMINI_ROTATION_MODELS.includes(m)) return m;
	if (/gemini-(1\.5|2\.0)/.test(m)) return GEMINI_MODEL;
	return m;
}
var INCOMING_DIRECTION = "incoming";
var OUTGOING_DIRECTION = "outgoing";
var MESSENGER_TEXT_LIMIT = 1800;
function directionToRole(direction) {
	return direction === OUTGOING_DIRECTION || direction === "out" ? "assistant" : "user";
}
async function insertMessageLog(payload, label) {
	const { error } = await supabaseAdmin.from("messages_log").insert(payload);
	if (error) console.error(`[messages_log:${label}]`, error.message);
}
/** Sanitize response: strip markdown but PRESERVE URLs exactly (including _ - . chars). */
function sanitizeReply(text, allowLinks = false) {
	const safeText = typeof text === "string" ? text : String(text ?? "");
	const urlRegex = /(https?:\/\/[^\s<>()"']+|www\.[^\s<>()"']+)/gi;
	const urls = [];
	let t = safeText.replace(urlRegex, (m) => {
		urls.push(m);
		return `\u0000URL${urls.length - 1}\u0000`;
	});
	t = t.replace(/[*#`_>]+/g, "").replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
	if (allowLinks) t = t.replace(/\u0000URL(\d+)\u0000/g, (_, i) => urls[Number(i)] ?? "");
	else {
		t = t.replace(/\u0000URL\d+\u0000/g, "");
		t = t.replace(/[ \t]{2,}/g, " ").trim();
	}
	return t;
}
function appendClarityInstructions(systemPrompt) {
	return `${systemPrompt}

RÈGLE ABSOLUE ET STRICTE :
- Valio MIVANTANA amin'ny teny Malagasy (na Frantsay raha niteny frantsay) ny mpanjifa.
- AZA MANORATRA FANDINIHANA (thinking/scratchpad), AZA MANORATRA TENY ANGLAIS, AZA MANORATRA BROUILLON NA AUTO-ÉVALUATION (ohatra : "No markdown? Yes", "Language: ...", "Length: ...", "Expansion: ...", "Closing: ...", "Draft: ...", "Let's expand").
- Valin-teny farany vonona ho vakian'ny mpanjifa ihany no avoaka.`;
}
function looksTruncated(text) {
	const cleaned = text.trim();
	if (!cleaned) return true;
	if (/[.!?…:)]$/.test(cleaned)) return false;
	return /\b(ary|fa|ka|dia|satria|raha|avec|de|du|des|et|ou|pour|par|sur|amin'ny|momba ny)$/i.test(cleaned);
}
async function retryTruncatedReply(opts) {
	const retryPrompt = `Tohizo na avereno feno amin'ny fomba mazava sy fohy ny valiny teo aloha izay toa tapaka. Aza mampiasa teny fampidirana na fandinihana (thinking).

Valiny tapaka:\n"""${opts.currentReply}"""`;
	const retryParts = [...opts.parts, { text: retryPrompt }];
	const strictPrompt = appendClarityInstructions(opts.systemPrompt);
	const key = getAccountCustomKeys(opts.userId).gemini_api_key || process.env.GEMINI_API_KEY;
	if (key) try {
		const res = await callGeminiMultiModelRotation(key, strictPrompt, opts.history, retryParts);
		return {
			raw: res.text,
			provider: `gemini-rotation:${res.model}:completed`
		};
	} catch (e) {
		console.warn("[Gemini rotation retry] fallback error:", e instanceof Error ? e.message : e);
	}
	for (let attempt = 0; attempt < 2; attempt++) {
		const keyRecord = await pickGeminiKey(opts.userId);
		if (!keyRecord) break;
		try {
			const res = await callGeminiMultiModelRotation(keyRecord.api_key, strictPrompt, opts.history, retryParts);
			await markKeyUsed(keyRecord.id);
			return {
				raw: res.text,
				provider: `gemini-rotation:${res.model}:completed`
			};
		} catch (e) {
			const isQuota = Boolean(e?.isQuota || e instanceof Error && (e.message.includes("Quota") || e.message.includes("429")));
			console.error("[Gemini retry] error", keyRecord.label, e);
			await markKeyError(keyRecord.id, keyRecord.error_count ?? 0, isQuota, e);
		}
	}
	return null;
}
function splitMessengerText(text, maxLength = MESSENGER_TEXT_LIMIT) {
	const normalized = (typeof text === "string" ? text : String(text ?? "")).replace(/\r/g, "").trim();
	if (!normalized) return [];
	if (normalized.length <= maxLength) return [normalized];
	const chunks = [];
	let remaining = normalized;
	while (remaining.length > maxLength) {
		const window = remaining.slice(0, maxLength + 1);
		const breakpoints = [
			"\n\n",
			"\n",
			". ",
			"! ",
			"? ",
			"; ",
			", ",
			" "
		];
		let splitAt = -1;
		for (const bp of breakpoints) {
			const idx = window.lastIndexOf(bp);
			if (idx >= Math.floor(maxLength * .55)) {
				splitAt = idx + bp.length;
				break;
			}
		}
		if (splitAt <= 0) splitAt = maxLength;
		chunks.push(remaining.slice(0, splitAt).trim());
		remaining = remaining.slice(splitAt).trim();
	}
	if (remaining) chunks.push(remaining);
	return chunks.filter(Boolean);
}
/** Réactive automatiquement les clés dont la pause courte est terminée. */
async function reviveExpiredGeminiKeys(userId) {
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	await supabaseAdmin.from("gemini_keys").update({
		disabled_until: null,
		error_count: 0
	}).eq("user_id", userId).not("disabled_until", "is", null).lte("disabled_until", nowIso);
}
async function pickGeminiKey(userId) {
	await reviveExpiredGeminiKeys(userId);
	const { data: keys } = await supabaseAdmin.from("gemini_keys").select("*").eq("user_id", userId).eq("is_active", true);
	if (!keys || keys.length === 0) return null;
	const now = Date.now();
	const byOldestUse = (a, b) => {
		return (a.last_used_at ? new Date(a.last_used_at).getTime() : 0) - (b.last_used_at ? new Date(b.last_used_at).getTime() : 0);
	};
	const available = keys.filter((k) => !k.disabled_until || new Date(k.disabled_until).getTime() <= now).sort(byOldestUse);
	if (available.length > 0) return available[0];
	return keys.filter((k) => k.disabled_until).sort((a, b) => new Date(a.disabled_until).getTime() - new Date(b.disabled_until).getTime())[0] ?? null;
}
async function markKeyUsed(id) {
	await supabaseAdmin.from("gemini_keys").update({
		last_used_at: (/* @__PURE__ */ new Date()).toISOString(),
		error_count: 0,
		disabled_until: null
	}).eq("id", id);
}
/** Classement des erreurs : passagère, quota (429), ou clé réellement invalide. */
function classifyGeminiError(err) {
	const msg = (err instanceof Error ? err.message : String(err ?? "")).toLowerCase();
	if (err?.isQuota || msg.includes("429") || msg.includes("quota") || msg.includes("resource_exhausted")) return "quota";
	if (msg.includes("api_key_invalid") || msg.includes("api key not valid") || msg.includes("permission_denied") || msg.includes("unauthorized") || msg.includes("403")) return "fatal";
	return "transient";
}
/** Pauses courtes : un 429 ou un timeout ne doit jamais neutraliser une clé longtemps. */
var QUOTA_COOLDOWN_MS = 45e3;
var TRANSIENT_COOLDOWN_MS = 1e4;
var FATAL_COOLDOWN_MS = 6e5;
async function markKeyError(id, currentErrors, isQuota = false, err) {
	const kind = isQuota ? "quota" : classifyGeminiError(err);
	const next = currentErrors + 1;
	let cooldown = 0;
	if (kind === "quota") cooldown = QUOTA_COOLDOWN_MS;
	else if (kind === "fatal") cooldown = FATAL_COOLDOWN_MS;
	else if (next >= 4) cooldown = TRANSIENT_COOLDOWN_MS;
	await supabaseAdmin.from("gemini_keys").update({
		error_count: kind === "quota" ? currentErrors : next,
		disabled_until: cooldown ? new Date(Date.now() + cooldown).toISOString() : null
	}).eq("id", id);
}
/** Latence : on coupe vite une clé lente pour passer à la suivante. */
var AI_TIMEOUT_MS = 11e3;
/** Model discovery is slow: cache it per key for 10 minutes. */
var modelDiscoveryCache = /* @__PURE__ */ new Map();
var MODEL_CACHE_TTL_MS = 6e5;
/** Auto-detect available Gemini text/chat models dynamically from the Google Gemini API key */
async function fetchAvailableGeminiModels(apiKey) {
	try {
		const cleanKey = (apiKey || "").trim();
		if (!cleanKey) return {
			ok: false,
			models: [],
			error: "Clé API vide"
		};
		const cached = modelDiscoveryCache.get(cleanKey);
		if (cached && Date.now() - cached.at < MODEL_CACHE_TTL_MS) return cached.value;
		const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`, { signal: AbortSignal.timeout(AI_TIMEOUT_MS) });
		if (!res.ok) {
			const t = await res.text();
			return {
				ok: false,
				models: [],
				error: `Google API (${res.status}): ${t.slice(0, 180)}`
			};
		}
		const value = {
			ok: true,
			models: ((await res.json()).models ?? []).filter((m) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes("generateContent")).map((m) => typeof m.name === "string" ? m.name.replace(/^models\//, "") : "").filter((name) => {
				if (!name) return false;
				const lower = name.toLowerCase();
				if (lower.includes("-tts") || lower.includes("embedding") || lower.includes("audio") || lower.includes("imagen") || lower.includes("aqa")) return false;
				return true;
			})
		};
		modelDiscoveryCache.set(cleanKey, {
			at: Date.now(),
			value
		});
		return value;
	} catch (err) {
		return {
			ok: false,
			models: [],
			error: err.message || String(err)
		};
	}
}
/** Safely merge conversation history into strictly alternating user/model turns for Gemini API */
function normalizeContentsForGemini(history, parts) {
	const validItems = [...history.map((t) => ({
		role: t.role === "assistant" ? "model" : "user",
		parts: [{ text: t.text || "" }]
	})), {
		role: "user",
		parts
	}].filter((item) => {
		if (!item.parts || item.parts.length === 0) return false;
		return item.parts.some((p) => {
			if ("text" in p && typeof p.text === "string" && p.text.trim().length > 0) return true;
			if ("inline_data" in p && p.inline_data) return true;
			return false;
		});
	});
	if (validItems.length === 0) return [{
		role: "user",
		parts: [{ text: "(message)" }]
	}];
	const merged = [];
	for (const item of validItems) if (merged.length > 0 && merged[merged.length - 1].role === item.role) merged[merged.length - 1].parts.push(...item.parts);
	else merged.push({
		role: item.role,
		parts: [...item.parts]
	});
	if (merged.length > 0 && merged[0].role === "model") merged.shift();
	if (merged.length === 0) return [{
		role: "user",
		parts: [{ text: "(message)" }]
	}];
	return merged;
}
/** Heuristic: a paragraph that is model reasoning/meta-commentary, not an answer for the client. */
function isReasoningParagraph(p) {
	const low = p.toLowerCase().trim();
	if (!low) return true;
	const hits = [
		/\b(?:the user|the client|the customer) (?:is|wants|asks|asked|says|said)\b/,
		/\b(?:we|i) (?:need to|should|must|will|can) \b/,
		/\b(?:let me|let's|okay,|alright,|first,|so,) \b/,
		/\baccording to the (?:prompt|instructions|system)\b/,
		/\b(?:system prompt|the prompt says|the instructions say|as per the rules)\b/,
		/\b(?:je dois|il faut que je|analysons|réfléchissons|d'abord, je|le client demande|le client veut|ma réponse doit|je vais donc|voyons|notons que|selon le prompt|d'après les instructions|en résumé, je)\b/,
		/\b(?:tokony hamaly aho|mieritreritra aho|ny fanontaniana dia|ny mpanjifa dia mangataka|ny mpanjifa dia manontany|valiny tokony|handinika aho|hamaly toy izao aho|araka ny torolalana|araka ny prompt|voalohany indrindra, izaho|ny tanjoko dia|ny valiny ho|alohan'ny hamaliana)\b/,
		/\b(?:draft|final answer|response plan|my response should)\b/
	].filter((r) => r.test(low)).length;
	if (hits === 0) return false;
	return hits >= 2 || low.length > 160 || /^(?:okay|alright|so|let|the user|we need|je dois|le client|ny mpanjifa|tokony|araka ny)\b/.test(low);
}
function sanitizeAiResponse(text) {
	if (!text) return "";
	let cleaned = text;
	cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "");
	cleaned = cleaned.replace(/<thought>[\s\S]*?<\/thought>/gi, "");
	cleaned = cleaned.replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, "");
	cleaned = cleaned.replace(/<scratchpad>[\s\S]*?<\/scratchpad>/gi, "");
	cleaned = cleaned.replace(/```(?:thinking|thought|reasoning|scratchpad)[\s\S]*?```/gi, "");
	const actionTags = [];
	cleaned = cleaned.replace(/\[\[?\s*(?:SEND_?IMAGE_?ID|IMAGE_?ID|SEND_?IMAGE|SEND_?IMAGES?|SENDIMAGES?|SEND_?PHOTOS?|SENDPHOTOS?|ORDER)[^\]\n]*\]\]?/gi, (match) => {
		let normalized = match.trim();
		if (!normalized.startsWith("[[")) normalized = "[" + normalized;
		if (!normalized.endsWith("]]")) normalized = normalized + "]";
		actionTags.push(normalized);
		return "";
	});
	for (const marker of [/(?:^|\n)\s*(?:final response|reponse finale|réponse finale|valiny mivantana|valiny farany|final answer|final text construction|final text)\s*:\s*\n?/i]) {
		const parts = cleaned.split(marker);
		if (parts.length > 1 && parts[parts.length - 1].trim().length > 5) {
			cleaned = parts[parts.length - 1].trim();
			break;
		}
	}
	const lines = cleaned.split("\n");
	const validLines = [];
	for (const rawLine of lines) {
		let line = rawLine.trim();
		if (!line) {
			validLines.push("");
			continue;
		}
		if (line.startsWith("\"") && line.endsWith("\"") || line.startsWith("'") && line.endsWith("'")) line = line.slice(1, -1).trim();
		const low = line.toLowerCase();
		if (/\?\s*(?:yes|no|ok|done|true|false|check|malagasy|french|english)\b/i.test(low)) continue;
		if (low.startsWith("(") && (low.includes("prompt says") || low.includes("wait,") || low.includes("let's ensure") || low.includes("no characters") || low.includes("catalog is"))) continue;
		if (/^(?:\*|\*\*|\[)?(?:thinking|thought|thoughts|reasoning|analyse|analysis|penser|réflexion|reflexion|internal notes|draft|draft\s*\d+|plan|greeting|response|description|closing|technical block|technical|hook|value proposition|trust|trust\/ease|benefit|check|cta|final cta|urgency|urgency\/engagement|self-correction|step\s*\d+|expansion|length|language|audit|checklist|verification|self-check|rule check|final text construction|final text)\s*(?::|\*|\*\*|\]|\.|\-|\?)/i.test(low) || low.startsWith("no markdown") || low.startsWith("no bold") || low.startsWith("no bullet") || low.startsWith("no italic") || low.startsWith("needs to be around") || low.startsWith("let's expand") || low.startsWith("let us expand") || low.startsWith("add more detail") || low.startsWith("mention that the team") || low.startsWith("do not describe this block") || low.startsWith("only one send") || low.startsWith("the user is asking") || low.startsWith("the customer is asking") || low.startsWith("the product being discussed") || low.startsWith("based on the product name") || low.startsWith("no thinking process") || low.startsWith("no repeating question") || low.startsWith("same language") || low.startsWith("professional/warm") || low.startsWith("professional style") || low.startsWith("one block") || low.startsWith("let me analyze") || low.startsWith("let me check") || low.startsWith("let me see") || low.startsWith("let's analyze") || low.startsWith("let's check") || low.startsWith("let's think") || low.startsWith("let's ensure") || low.startsWith("i will ensure") || low.startsWith("acknowledge the request") || low.startsWith("briefly mention") || low.startsWith("a clear closing") || low === "check." || low === "check" || low === "ready." || low.includes("(text looks good") || low.includes("total length is sufficient") || low.includes("character count")) continue;
		validLines.push(line);
	}
	cleaned = validLines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
	const paragraphs = cleaned.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
	let startIndex = 0;
	for (let i = 0; i < paragraphs.length; i++) {
		const p = paragraphs[i];
		if (/^(?:miala tsiny|salama|manao ahoana|bonjour|bonsoir|misaotra|mankasitraka|eny tompoko|tsia tompoko|ity vokatra|momba ny|raha|ny vidin)/i.test(p)) {
			if (paragraphs.slice(0, i).join(" ") && !/^(?:salama|bonjour|manao ahoana)/i.test(paragraphs[0])) startIndex = i;
			break;
		}
	}
	const candidateParagraphs = paragraphs.slice(startIndex);
	const nonMeta = candidateParagraphs.filter((p) => !isReasoningParagraph(p));
	const usefulParagraphs = candidateParagraphs.length > 0 && nonMeta.length === 0 ? [] : nonMeta;
	const dedupedParagraphs = [];
	const seenParagraphs = /* @__PURE__ */ new Set();
	for (const p of usefulParagraphs) {
		const key = p.toLowerCase().replace(/\s+/g, " ").trim();
		if (seenParagraphs.has(key)) continue;
		seenParagraphs.add(key);
		dedupedParagraphs.push(p);
	}
	cleaned = dedupedParagraphs.join("\n\n").trim();
	cleaned = cleaned.replace(/\[\[[\s\S]*?\]\]/g, "");
	cleaned = cleaned.replace(/\[(?:SEND_?IMAGE_?ID|SEND_?IMAGES?|SENDIMAGES?|SEND_?PHOTOS?|SENDPHOTOS?|ORDER)[^\]]*\]/gi, "");
	if (actionTags.length > 0) cleaned = `${cleaned}\n\n${actionTags[actionTags.length - 1]}`.trim();
	return cleaned;
}
async function callGeminiSingleModel(cleanKey, systemPrompt, contents, m) {
	const thinkingModes = /^gemini-3/.test(m) ? [false] : [true, false];
	let lastError = "";
	for (const disableThinking of thinkingModes) try {
		const genConfig = {
			temperature: .1,
			maxOutputTokens: 1500
		};
		if (disableThinking) genConfig.thinkingConfig = { thinkingBudget: 0 };
		const body = {
			system_instruction: { parts: [{ text: systemPrompt }] },
			contents,
			generationConfig: genConfig
		};
		const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${cleanKey}`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(body),
			signal: AbortSignal.timeout(AI_TIMEOUT_MS)
		});
		if (!res.ok) {
			const t = await res.text();
			if (disableThinking && (t.includes("thinkingConfig") || t.includes("INVALID_ARGUMENT") || t.includes("Unknown name"))) continue;
			lastError = `Gemini (${m}): ${t.slice(0, 180)}`;
			if (res.status === 429 || t.includes("RESOURCE_EXHAUSTED") || t.toLowerCase().includes("quota")) {
				const quotaErr = /* @__PURE__ */ new Error(`Quota dépassé pour cette clé (${m}): ${t.slice(0, 150)}`);
				quotaErr.isQuota = true;
				throw quotaErr;
			}
			throw new Error(lastError);
		}
		const candidateParts = ((await res.json())?.candidates?.[0])?.content?.parts ?? [];
		const nonThoughtParts = candidateParts.filter((p) => !p.thought && !p.thought_process && p.type !== "thought");
		const text = (nonThoughtParts.length > 0 ? nonThoughtParts : candidateParts).map((p) => p.text ?? "").join("").trim();
		if (!text) throw new Error(`Réponse vide du modèle ${m}`);
		return text;
	} catch (err) {
		lastError = err?.message || String(err);
		if (err?.isQuota) throw err;
	}
	throw new Error(lastError || `Échec d'appel pour le modèle ${m}`);
}
/**
* Moteur Multi-Modèles Gemini (> 5 modèles en rotation continue)
* Effectue une rotation automatique sur la collection des modèles officiels Gemini.
* Si un modèle est saturé ou indisponible, il bascule immédiatement sur le modèle suivant.
*/
async function callGeminiMultiModelRotation(apiKey, systemPrompt, history, parts, preferredModel) {
	const cleanKey = (apiKey || "").trim();
	if (!cleanKey) throw new Error("Clé API Gemini vide");
	const contents = normalizeContentsForGemini(history, parts);
	const startIndex = geminiRotationIndex % GEMINI_ROTATION_MODELS.length;
	geminiRotationIndex = (startIndex + 1) % GEMINI_ROTATION_MODELS.length;
	const candidateModels = [];
	const validPreferred = preferredModel ? resolveGeminiModel(preferredModel) : null;
	if (validPreferred && GEMINI_ROTATION_MODELS.includes(validPreferred)) candidateModels.push(validPreferred);
	for (let i = 0; i < GEMINI_ROTATION_MODELS.length; i++) {
		const candidate = GEMINI_ROTATION_MODELS[(startIndex + i) % GEMINI_ROTATION_MODELS.length];
		if (!candidateModels.includes(candidate)) candidateModels.push(candidate);
	}
	let lastError = "";
	for (const model of candidateModels) try {
		const raw = await callGeminiSingleModel(cleanKey, systemPrompt, contents, model);
		if (raw) return {
			text: sanitizeAiResponse(raw),
			model
		};
	} catch (err) {
		lastError = err?.message || String(err);
		console.warn(`[Gemini Rotation] Modèle '${model}' temporairement indisponible, bascule automatique:`, lastError.slice(0, 100));
	}
	throw new Error(`Tous les modèles Gemini en rotation (${candidateModels.length} modèles essayés) ont échoué: ${lastError}`);
}
/** Génération de réponse IA principale avec rotation multi-modèles Gemini (> 5 modèles) */
async function generateAiReply(opts) {
	const { userId, systemPrompt, parts, allowLinks } = opts;
	const history = opts.history ?? [];
	const strictSystemPrompt = appendClarityInstructions(systemPrompt);
	const { data: settings } = await supabaseAdmin.from("settings").select("default_model").eq("user_id", userId).maybeSingle();
	const preferredModel = resolveGeminiModel(settings?.default_model);
	const customKeys = getAccountCustomKeys(userId);
	await reviveExpiredGeminiKeys(userId);
	const { data: allKeys } = await supabaseAdmin.from("gemini_keys").select("*").eq("user_id", userId);
	const candidateKeys = [];
	if (customKeys.gemini_api_key) candidateKeys.push({
		key: customKeys.gemini_api_key,
		label: "Paramètres Compte"
	});
	const nowMs = Date.now();
	const dbKeys = (allKeys ?? []).filter((k) => k.is_active !== false);
	const readyKeys = dbKeys.filter((k) => !k.disabled_until || new Date(k.disabled_until).getTime() <= nowMs).sort((a, b) => (a.error_count ?? 0) - (b.error_count ?? 0));
	const pausedKeys = dbKeys.filter((k) => k.disabled_until && new Date(k.disabled_until).getTime() > nowMs).sort((a, b) => (a.error_count ?? 0) - (b.error_count ?? 0));
	for (const k of [...readyKeys, ...pausedKeys]) if (k.api_key && !candidateKeys.some((c) => c.key === k.api_key)) candidateKeys.push({
		key: k.api_key,
		label: k.label || "Clé DB",
		id: k.id,
		error_count: k.error_count
	});
	if (process.env.GEMINI_API_KEY && !candidateKeys.some((c) => c.key === process.env.GEMINI_API_KEY)) candidateKeys.push({
		key: process.env.GEMINI_API_KEY,
		label: "Système Gemini"
	});
	if (candidateKeys.length === 0) throw new Error("Aucune clé API Gemini configurée. Veuillez ajouter votre clé API Gemini dans les Paramètres.");
	const keyErrors = [];
	for (const keyObj of candidateKeys) try {
		const cleanKey = keyObj.key.trim();
		if (!cleanKey) continue;
		const result = await callGeminiMultiModelRotation(cleanKey, strictSystemPrompt, history, parts, preferredModel);
		if (keyObj.id) await markKeyUsed(keyObj.id);
		const cleaned = sanitizeReply(sanitizeAiResponse(result.text), allowLinks);
		if (looksTruncated(cleaned)) {
			const completed = await retryTruncatedReply({
				userId,
				systemPrompt,
				history,
				parts,
				currentReply: cleaned,
				allowLinks
			});
			if (completed) return {
				text: sanitizeReply(sanitizeAiResponse(completed.raw), allowLinks),
				provider: completed.provider
			};
		}
		return {
			text: cleaned,
			provider: `gemini-rotation:${result.model}`
		};
	} catch (e) {
		const errMsg = e instanceof Error ? e.message : String(e);
		const isQuota = Boolean(e?.isQuota || errMsg.includes("Quota") || errMsg.includes("429"));
		console.warn(`[Gemini Rotation] Erreur clé ${keyObj.label}:`, errMsg);
		keyErrors.push(`${keyObj.label}: ${errMsg}`);
		if (keyObj.id) await markKeyError(keyObj.id, keyObj.error_count ?? 0, isQuota, e);
	}
	throw new Error(keyErrors.length ? `Erreur Moteur Multi-Modèles Gemini [${keyErrors.join(" | ")}]. Vérifiez vos clés dans les Paramètres.` : "Clés API Gemini invalides ou temporairement désactivées.");
}
/** Fetch dynamic catalog context (formations / produits / paiements) selon assistance_type. */
async function buildCatalogContext(userId) {
	const { data: settings } = await supabaseAdmin.from("settings").select("assistance_type").eq("user_id", userId).maybeSingle();
	const type = settings?.assistance_type ?? "online_work";
	const linkRule = "RÈGLE ABSOLUE POUR LES LIENS :\n- Si tu envoies un lien (Google Drive, YouTube, etc.), recopie-le EXACTEMENT caractère par caractère.\n- Garde tous les tirets bas (_), tirets (-), points (.), slashs (/), chiffres et majuscules.\n- Ne jamais réécrire, raccourcir, embellir ou traduire un lien.\n- Colle le lien sur une ligne seule pour qu'il reste cliquable.";
	if (type === "training") {
		const { data: trainings } = await supabaseAdmin.from("trainings").select("name,description,pricing_type,price,payment_flow,video_link").eq("user_id", userId).eq("is_active", true);
		const { data: pmethods } = await supabaseAdmin.from("payment_methods").select("label,number,instructions").eq("user_id", userId).eq("is_active", true);
		if (!trainings || trainings.length === 0) return "";
		const list = trainings.map((t) => {
			const priceInfo = t.pricing_type === "free" ? "Gratuit" : `Payante : ${Number(t.price ?? 0).toLocaleString()} Ar`;
			const flow = t.pricing_type === "paid" ? t.payment_flow === "admin_numbers" ? " — Paiement via nos numéros ci-dessous, envoyer preuve avant réception." : " — Prendre nom Facebook + WhatsApp/téléphone du client avant confirmation." : "";
			return `• ${t.name} — ${priceInfo}${flow}\n   ${t.description ?? ""}${t.video_link ? `\n   Aperçu vidéo : ${t.video_link}` : ""}`;
		}).join("\n");
		const pm = (pmethods ?? []).map((p) => `- ${p.label} : ${p.number}${p.instructions ? ` (${p.instructions})` : ""}`).join("\n");
		return `CATALOGUE FORMATIONS :\n${list}\n\n${pm ? `NUMÉROS DE PAIEMENT :\n${pm}\n\n` : ""}RÈGLES IMPORTANTES :\n- Ne JAMAIS envoyer les fichiers d'une formation payante tant que le paiement n'est pas confirmé.\n- Pour une formation gratuite, propose immédiatement le contenu quand le client le demande.\n- Quand un client accepte une formation payante avec paiement par numéros, envoie les numéros ci-dessus et demande la référence + nom d'envoi.\n- Quand la méthode est "contact client", demande simplement le nom Facebook et un numéro WhatsApp/téléphone joignable.\n- Répète le nom de la formation choisie et le montant pour confirmer.\n\n${linkRule}\n\nPROTOCOLE COMMANDE (OBLIGATOIRE) :
Dès qu'un client confirme vouloir une formation ET que tu as collecté les informations nécessaires (nom Facebook, WhatsApp/téléphone, et pour les payantes la référence de paiement si envoyé), ajoute À LA TOUTE FIN de ta réponse (sur une ligne séparée) un bloc technique EXACTEMENT au format :
[[ORDER:{"type":"training","training":"NOM EXACT DE LA FORMATION","client_fb_name":"...","client_whatsapp":"...","payment_reference":"...","notes":"..."}]]
- Remplis uniquement les champs que tu connais, laisse les autres vides ("").
- Ce bloc est invisible pour le client, ne le commente jamais.
- Un seul bloc ORDER par réponse, uniquement quand la commande est réellement confirmée.`;
	}
	if (type === "sales") {
		const { data: products } = await supabaseAdmin.from("products").select("id,name,price,stock,description,payment_flow, product_images(id, image_path, sort_order)").eq("user_id", userId).eq("is_active", true);
		const { data: pmethods } = await supabaseAdmin.from("payment_methods").select("label,number,instructions").eq("user_id", userId).eq("is_active", true);
		if (!products || products.length === 0) return "";
		const list = products.map((p) => {
			const imgStrs = (p.product_images ?? []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map((img) => `   - Sary [ID_IMAGE: ${img.id}]`).join("\n");
			return `• [ID_PRODUIT: ${p.id}] ${p.name} — ${Number(p.price).toLocaleString()} Ar (stock : ${p.stock})\n   ${p.description ?? ""}\n${imgStrs}`;
		}).join("\n\n");
		const pm = (pmethods ?? []).map((p) => `- ${p.label} : ${p.number}${p.instructions ? ` (${p.instructions})` : ""}`).join("\n");
		return `CATALOGUE PRODUITS :\n${list}\n\n${pm ? `NUMÉROS DE PAIEMENT :\n${pm}\n\n` : ""}RÈGLES IMPORTANTES :\n- Vérifie toujours le stock disponible avant de confirmer.\n- Omeo ny vidiny marina sy ny antsipiriany araka ny voalaza etsy ambony.\n- Tsikelikely foana no manontany ny mombamomba ny mpanjifa (Anarana -> Laharana finday -> Adiresy mazava misy Région, District, Fokontany -> Fomba fandoavana).\n- Confirme toujours nom du produit, prix, quantité ET adresse.\n\n${linkRule}\n\nPROTOCOLE PHOTOS PRODUIT AVEC ID (OBLIGATOIRE) :
MISY FEPETRA HENJANA : SARY IRAY MONJA isaky ny fangatahana, ary tsy alefa raha tsy nangataka sary MAZAVA ny client amin'ilay hafatra farany (ohatra : 'misy sary ve', 'alefaso sary', 'tiako hojerena', 'photo').
- Rehefa mangataka sary izy : jereo ny ID ao amin'ny katalaogy ([ID_IMAGE: ...]) na ny anaran'ny vokatra, ary ampidiro amin'ny andalana manokana any amin'ny farany ny bloc teknika :
[[SEND_IMAGE_ID: ID_DE_LA_SARY]] na [[SEND_IMAGES: NOM_OU_ID_DU_PRODUIT]]
- AZA ampiasaina io bloc io intsony amin'ny valin-teny manaraka rehefa efa nandefa sary ianao : tohizo ny resaka (fanazavana, vidiny, commande).
- Raha miteny 'haka aho', 'hividy aho', 'commander' na manome fampahalalana ny client : TSY MANDEFA SARY MIHITSY, tohizo ny dingan'ny commande.
- Raha mangataka sary hafa indray izy vao mandefa iray hafa.
- Aza tononina na hazavaina amin'ny mpanjifa io bloc io fa miafina izy io.\n\nPROTOCOLE EXPLICATION PRODUIT SY COMMANDE TSIKILIKELY (STRICTEMENT OBLIGATOIRE) :

1. REHEFA MANAZAVA PRODUIT (TANDREMO TSY TONGA DIA MAMPISEHO PAIEMENT NA COMMANDE) :
   - Hazavao amin'ny fomba tsotra sy mazava ny momba ilay vokatra (antsipiriany, tombontsoa, vidiny).
   - Raha nangataka sary izy dia asio [[SEND_IMAGES:NOM EXACT DU PRODUIT]] any amin'ny farany.
   - REHEFA VITA NY FANAZAVANA : ANONTANIO ALOHA NY FANAPAHAN-KEVITRY NY MPANJIFA (DÉCISION) : ohatra 'Mahaliana anao ve ity vokatra ity? Tianao ve ny hanafatra azy sa mbola misy fanazavana fanampiny tianao ho fantatra?'.
   - TSY AZO OMENA LAHARANA FANDOAVAM-BOLA NA ANGATAHINA ADIRESY/COMMANDE NY MPANJIFA raha mbola tsy niteny mazava izy fa HANDRAY NA HIVIDY NA HANAFATRA.

2. REHEFA NANAIKY HIVIDY NY MPANJIFA (FAKANA COMMANDE TSIKILIKELY ISAKY NY VALIN-TENY) :
   Rehefa nilaza mazava ny mpanjifa fa hividy na handray (ohatra: 'Eny handray aho', 'Tiako hovidina', 'Commander-ko', 'Hanafatra aho'), anontanio TSIKILIKELY isaky ny hafatra ireto fampahalalana ireto (TSY AZO ANGATAHINA MIARAKA DAHOLO, ary jereo tsara ny resaka teo aloha mba tsy hamerenana fanontaniana efa voavaly) :
   • Dingana 1 : ANARANA FENO — Anontanio ny anarana fenon'ny mpanjifa (raha mbola tsy voalaza).
   • Dingana 2 : LAHARANA FINDAY — Rehefa azo ny anarana dia anontanio ny laharana finday afaka iantsoana azy na WhatsApp.
   • Dingana 3 : ADIRESY FENO MAZAVA — Rehefa azo ny laharana dia anontanio ny adiresy mazava misy azy (Faritra / RÉGION, Distrika / DISTRICT, FOKONTANY, ary toerana famantarana / REPÈRE).
   • Dingana 4 : FOMBA FANDOAVAM-BOLA SY FAMARANANA :
      - Raha 'Paiement avant livraison / Par numéros' : Omeo ny laharana fandoavam-bola (Mvola, Airtel Money, Orange Money) ary angataho ny référence sy ny anaran'ny mpanefa. Rehefa azo izany dia ampidiro ny bloc ORDER.
      - Raha 'Paiement à la livraison / Contact client' : Rehefa azo ireo 3 voalohany (Anarana, Laharana, Adiresy mazava) dia ampidiro AVY HATRANY ny bloc ORDER ary lazao amin'ny mpanjifa fa voaray soa aman-tsara ny commande-ny ary haterin'ny mpanao livraison aminy.

BLOC TECHNIQUE ORDER (ampidiro eo amin'ny farany indrindra amin'ny andalana manokana, rehefa feno ny fampahalalana) :
[[ORDER:{"type":"sales","product":"NOM EXACT DU PRODUIT","quantity":1,"client_fb_name":"ANARANA","client_phone":"LAHARANA","client_whatsapp":"WHATSAPP","client_address":"ADIRESY (REGION DISTRICT FOKONTANY REPERE)","payment_reference":"REFERENCE NA VIDE","notes":""}]]
- Tsy maintsy ampidirina ity bloc ORDER ity mba hiditra mivantana ao amin'ny pejy Commandes ny commande.
- Tsy hita maso ity bloc ity, aza hazavaina amin'ny mpanjifa.`;
	}
	return linkRule;
}
/** Build system prompt from active prompts, avec directives strictes.
*  Retourne null si aucune prompt active n'est configurée pour cette page :
*  dans ce cas l'IA ne doit PAS répondre. */
async function buildSystemPrompt(userId, category, pageId) {
	const { data: settings } = await supabaseAdmin.from("settings").select("assistance_type").eq("user_id", userId).maybeSingle();
	const assistanceType = settings?.assistance_type ?? "online_work";
	const { data } = await supabaseAdmin.from("prompts").select("content,category,page_id,page_ids,assistance_type").eq("user_id", userId).eq("is_active", true).in("category", ["global", category]);
	let matchedRows = (data ?? []).filter((p) => {
		const ids = Array.isArray(p.page_ids) && p.page_ids.length ? p.page_ids : p.page_id ? [p.page_id] : [];
		const pageOk = ids.length === 0 || (pageId ? ids.includes(pageId) : false);
		const typeOk = !p.assistance_type || p.assistance_type === "all" || p.assistance_type === assistanceType;
		return pageOk && typeOk;
	});
	if (matchedRows.length === 0) matchedRows = (data ?? []).filter((p) => {
		const ids = Array.isArray(p.page_ids) && p.page_ids.length ? p.page_ids : p.page_id ? [p.page_id] : [];
		return ids.length === 0 || (pageId ? ids.includes(pageId) : false);
	});
	if (matchedRows.length === 0) matchedRows = data ?? [];
	let extras = matchedRows.sort((a, b) => a.category === "global" ? -1 : 1).map((p) => (p.content ?? "").trim()).filter(Boolean).join("\n\n");
	if (!extras) extras = "Vous êtes l'assistant virtuel IA professionnel de notre page Facebook. Répondez de manière chaleureuse, amicale, claire et professionnelle aux questions des clients en les orientant efficacement.";
	const styleRules = "RÈGLES ABSOLUES ET STRICTES DE RÉPONSE (PRIORITÉ MAXIMALE) :\n1. MPANJIFA VAOVAO / FIARAHABANA : Rehefa mpanjifa vao manomboka miresaka na manao salama / bonjour / manao ahoana, miarahaba am-pifaliana sy am-panajana, mampahafantatra fohy ireo vokatra misy ao amin'ny pejy, ary manontany hoe inona amin'ireo no tiany ho fantatra kokoa.\n2. RÉPONSE DIRECTE ET PRÉCISE : Réponds DIRECTEMENT à la question du client sans détour, sans préambule inutile et sans répéter la question du client.\n3. AUCUNE PENSÉE NI ANALYSE VISIBLE : INTERDICTION FORMELLE d'inclure ton processus de réflexion, brouillon, 'Thinking:', 'Thought:', 'Hook:', 'Check', 'Let me check', 'Analyse:' ou du texte en anglais. Donne UNIQUEMENT la réponse finale pour le client.\n4. LANGUE EXACTE DU CLIENT : Réponds STRICTEMENT dans la même langue que le client (en malgache si le client écrit en malgache, en français s'il écrit en français). N'utilise JAMAIS l'anglais.\n5. EXPLICATION PUIS DÉCISION : Rehefa manazava produit dia hazavao ny momba azy sy ny vidiny, ary ANONTANIO ALOHA NY DÉCISION-NY ('Mahaliana anao ve? Tianao ve ny hanafatra azy?'). Aza mbola manome laharana fandoavam-bola na maka adiresy raha tsy manaiky mazava hividy izy.\n6. DEMANDE D'INFOS PROGRESSIVE (TSIKILIKELY) : Rehefa nanaiky hividy izy vao maka commande tsikelikely (1. Nom complet -> 2. Numéro -> 3. Adresse Région/District/Fokontany/Repère -> 4. Paiement). Ne pose JAMAIS toutes les questions d'un coup.\n7. PHOTOS DU PRODUIT : Si le client demande à voir ou demande des photos/sary du produit, ajoute [[SEND_IMAGES:NOM DU PRODUIT]] à la fin pour lui envoyer automatiquement les photos de la galerie.\n8. TON NATUREL ET CHALEUREUX : Ton poli, accueillant, bienveillant et professionnel comme un vrai conseiller humain.\n9. FORMAT PROPRE : Phrases courtes, saut de ligne entre les idées pour un texte facile à lire. N'utilise JAMAIS de markdown (* ou #).\n10. HISTORIQUE : Tiens compte des échanges précédents dans la conversation pour ne pas reposer les mêmes questions.";
	const catalog = await buildCatalogContext(userId);
	return [
		"Tu es une assistante virtuelle professionnelle. Tu dois suivre à la lettre les instructions de l'administrateur ci-dessous. Si aucune instruction ne couvre un cas, reste polie et propose de transmettre la demande.",
		`INSTRUCTIONS DE L'ADMINISTRATEUR (à respecter STRICTEMENT, elles priment sur tout comportement par défaut) :\n\n${extras}`,
		catalog,
		styleRules
	].filter(Boolean).join("\n\n");
}
/** Fetch image from URL and encode to base64 for AI multimodal input. */
async function fetchAsInlinePart(url) {
	try {
		const res = await fetch(url);
		if (!res.ok) return null;
		const mime = res.headers.get("content-type") ?? "image/jpeg";
		if (!mime.startsWith("image/")) return null;
		const buf = new Uint8Array(await res.arrayBuffer());
		let bin = "";
		for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
		return { inline_data: {
			mime_type: mime.split(";")[0],
			data: btoa(bin)
		} };
	} catch (e) {
		console.error("[fetchAsInlinePart]", e);
		return null;
	}
}
/** Fetch the parent post text of a comment for context. */
async function fetchPostContext(postId, pageToken) {
	try {
		const j = await (await fetch(`https://graph.facebook.com/v21.0/${postId}?fields=message,story&access_token=${pageToken}`)).json();
		return j.message ?? j.story ?? "";
	} catch {
		return "";
	}
}
/** Historique de conversation Messenger pour un expéditeur donné (mémoire). */
async function fetchMessengerHistory(userId, pageId, senderId, limit = 20) {
	const { data, error } = await supabaseAdmin.from("messages_log").select("content,ai_response,direction,created_at").eq("user_id", userId).eq("page_id", pageId).eq("sender_id", senderId).order("created_at", { ascending: false }).limit(limit);
	if (error) {
		console.error("[fetchMessengerHistory]", error);
		return [];
	}
	const rows = (data ?? []).reverse();
	const turns = [];
	for (const r of rows) {
		const text = (r.content ?? r.ai_response ?? "").toString().trim();
		if (!text) continue;
		turns.push({
			role: directionToRole(r.direction),
			text
		});
	}
	console.log(`[memory] messenger history ${userId}/${pageId}/${senderId}: ${turns.length} turns`);
	return turns;
}
async function fetchGraphMessengerHistory(page, senderId, limit = 24) {
	try {
		const url = `https://graph.facebook.com/v21.0/${page.page_id}/conversations?platform=messenger&user_id=${encodeURIComponent(senderId)}&fields=messages.limit(${Math.min(limit, 50)}){message,from,created_time}&access_token=${page.page_access_token}`;
		const res = await fetch(url);
		if (!res.ok) {
			console.warn(`[memory] graph history ${res.status}: ${(await res.text()).slice(0, 180)}`);
			return [];
		}
		const turns = ((await res.json())?.data?.[0]?.messages?.data ?? []).slice().reverse().map((m) => ({
			role: m.from?.id === page.page_id ? "assistant" : "user",
			text: String(m.message ?? "").trim()
		})).filter((t) => t.text);
		console.log(`[memory] graph history ${page.page_id}/${senderId}: ${turns.length} turns`);
		return turns;
	} catch (e) {
		console.warn("[memory] graph history failed", e instanceof Error ? e.message : e);
		return [];
	}
}
async function fetchMessengerHistoryForReply(page, senderId, currentText, limit = 24) {
	const dbHistory = await fetchMessengerHistory(page.user_id, page.page_id, senderId, limit);
	const graphHistory = await fetchGraphMessengerHistory(page, senderId, limit + 1);
	const current = (currentText || "").trim();
	const graphWithoutCurrent = current && graphHistory.at(-1)?.role === "user" && graphHistory.at(-1)?.text.trim() === current ? graphHistory.slice(0, -1) : graphHistory;
	return (graphWithoutCurrent.length > dbHistory.length ? graphWithoutCurrent : dbHistory).slice(-limit);
}
/** Send a Messenger reply. */
async function sendMessengerReply(pageToken, recipientId, text) {
	const chunks = splitMessengerText(text);
	if (chunks.length === 0) return;
	for (let i = 0; i < chunks.length; i++) {
		const res = await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${pageToken}`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				recipient: { id: recipientId },
				message: { text: chunks[i] },
				messaging_type: "RESPONSE"
			})
		});
		if (!res.ok) throw new Error(`Messenger send part ${i + 1}/${chunks.length} ${res.status}: ${(await res.text()).slice(0, 200)}`);
	}
}
/** Send a single image attachment via Messenger. Supports Data URLs, local file paths, and remote URLs with binary multipart upload. */
var APP_BASE_URL = process.env.APP_URL || process.env.PUBLIC_URL || "https://ais-dev-i7b5jeeh6qqkeyb3nv4dw4-469517843202.europe-west2.run.app";
function resolvePublicImageUrl(imagePathOrId, imageId) {
	if (imageId) return `${APP_BASE_URL}/api/public/img?id=${encodeURIComponent(imageId)}`;
	if (imagePathOrId.startsWith("http://") || imagePathOrId.startsWith("https://")) return imagePathOrId;
	return `${APP_BASE_URL}/api/public/img?path=${encodeURIComponent(imagePathOrId)}`;
}
function tryParseUrl(u) {
	try {
		return new URL(u);
	} catch {
		return null;
	}
}
function stripDataUrl(dataUrl) {
	const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
	if (!match) return null;
	return {
		mime: match[1],
		base64: match[2]
	};
}
/** Safely fetch binary buffer of a Supabase Storage object by path or URL */
async function downloadSupabaseStorageFile(bucket, objectPath, userId) {
	const cleanPath = objectPath.replace(/^https?:\/\/[^\/]+\/storage\/v1\/object\/(?:public|sign|authenticated)\/[^\/]+\//, "").replace(/^\/+/, "");
	try {
		if (supabaseAdmin?.storage && typeof supabaseAdmin.storage.from === "function") {
			const storageBucket = supabaseAdmin.storage.from(bucket);
			if (typeof storageBucket?.download === "function") {
				const { data: stBlob, error: stErr } = await storageBucket.download(cleanPath);
				if (!stErr && stBlob) {
					const arrayBuf = await stBlob.arrayBuffer();
					return {
						buffer: Buffer.from(arrayBuf),
						mimeType: stBlob.type || "image/jpeg"
					};
				}
			}
		}
	} catch (e) {
		console.warn("[downloadSupabaseStorageFile] JS SDK download skipped/failed:", e instanceof Error ? e.message : e);
	}
	const derivedUserId = userId || (cleanPath.includes("/") ? cleanPath.split("/")[0] : null);
	let sbUrl = null;
	let sbKey = null;
	if (derivedUserId) try {
		const { data: settings } = await supabaseAdmin.from("settings").select("supabase_project_url,supabase_anon_key").eq("user_id", derivedUserId).maybeSingle();
		if (settings?.supabase_project_url && settings?.supabase_anon_key) {
			sbUrl = settings.supabase_project_url.replace(/\/$/, "");
			sbKey = settings.supabase_anon_key.trim();
		} else {
			const { data: conn } = await supabaseAdmin.from("supabase_oauth_connections").select("selected_project_url,access_token,projects").eq("user_id", derivedUserId).maybeSingle();
			if (conn?.selected_project_url) {
				sbUrl = conn.selected_project_url.replace(/\/$/, "");
				sbKey = (conn.projects?.find((p) => p.project_url === conn.selected_project_url))?.anon_key || conn.access_token;
			}
		}
	} catch (dbErr) {
		console.warn("[downloadSupabaseStorageFile] DB lookup error:", dbErr);
	}
	if (sbUrl) {
		const endpoints = [
			`${sbUrl}/storage/v1/object/public/${bucket}/${encodeURIComponent(cleanPath)}`,
			`${sbUrl}/storage/v1/object/public/${bucket}/${cleanPath}`,
			`${sbUrl}/storage/v1/object/authenticated/${bucket}/${cleanPath}`
		];
		for (const url of endpoints) try {
			const headers = {};
			if (sbKey) {
				headers["Authorization"] = `Bearer ${sbKey}`;
				headers["apikey"] = sbKey;
			}
			const res = await fetch(url, { headers });
			if (res.ok) {
				const arrayBuf = await res.arrayBuffer();
				const mimeType = res.headers.get("content-type") || "image/jpeg";
				return {
					buffer: Buffer.from(arrayBuf),
					mimeType
				};
			}
		} catch (fetchErr) {}
	}
	return null;
}
async function getMessengerImageSource(rawUrlOrPath, imageId) {
	let target = rawUrlOrPath;
	let mimeType = "image/jpeg";
	let filename = "image.jpg";
	let targetUserId = void 0;
	if (imageId) {
		const { data: imgRow } = await supabaseAdmin.from("product_images").select("image_path, user_id").eq("id", imageId).maybeSingle();
		if (imgRow?.image_path) {
			target = imgRow.image_path;
			if (imgRow.user_id) targetUserId = imgRow.user_id;
		}
	}
	if (!target) return {
		publicUrl: null,
		buffer: null,
		mimeType,
		filename
	};
	if (target.startsWith("data:image/") || target.startsWith("data:application/")) {
		const parsed = stripDataUrl(target);
		if (parsed) {
			const buffer = Buffer.from(parsed.base64, "base64");
			mimeType = parsed.mime || "image/jpeg";
			filename = `image.${mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg"}`;
			return {
				publicUrl: null,
				buffer,
				mimeType,
				filename
			};
		}
	}
	const parsedUrl = target.startsWith("http://") || target.startsWith("https://") ? tryParseUrl(target) : null;
	const cleanPath = (parsedUrl ? parsedUrl.pathname : target).replace(/^\/+/, "");
	const baseName = path.basename(cleanPath);
	const possibleLocalPaths = [
		path.join(process.cwd(), "public", "uploads", baseName),
		path.join(process.cwd(), "public", cleanPath.replace(/^public\//, "")),
		path.join(process.cwd(), cleanPath)
	];
	for (const p of possibleLocalPaths) if (fs.existsSync(p) && fs.statSync(p).isFile()) try {
		const buffer = fs.readFileSync(p);
		const ext = path.extname(p).toLowerCase();
		mimeType = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : ext === ".gif" ? "image/gif" : "image/jpeg";
		filename = baseName || `image${ext || ".jpg"}`;
		return {
			publicUrl: null,
			buffer,
			mimeType,
			filename
		};
	} catch (fsErr) {
		console.warn("[getMessengerImageSource] local read error:", fsErr);
	}
	try {
		const downloaded = await downloadSupabaseStorageFile("product-images", target, targetUserId);
		if (downloaded) {
			mimeType = downloaded.mimeType;
			const ext = mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg";
			filename = baseName || `product.${ext}`;
			return {
				publicUrl: target.startsWith("http") ? target : resolvePublicImageUrl(target, imageId),
				buffer: downloaded.buffer,
				mimeType,
				filename
			};
		}
	} catch (stErr) {
		console.warn("[getMessengerImageSource] Supabase Storage error:", stErr);
	}
	if (target.startsWith("http://") || target.startsWith("https://")) {
		let publicUrl = target.includes("localhost") || target.includes("ais-dev") || target.includes("ais-pre") ? null : target;
		try {
			const res = await fetch(target);
			if (res.ok) {
				const ct = res.headers.get("content-type") || "";
				if (ct.startsWith("image/")) {
					const arrayBuf = await res.arrayBuffer();
					const buffer = Buffer.from(arrayBuf);
					mimeType = ct;
					const ext = ct.includes("png") ? "png" : ct.includes("webp") ? "webp" : "jpg";
					filename = baseName || `image.${ext}`;
					return {
						publicUrl,
						buffer,
						mimeType,
						filename
					};
				}
			}
		} catch (e) {
			console.warn("[getMessengerImageSource] remote fetch failed:", e);
		}
		if (publicUrl) return {
			publicUrl,
			buffer: null,
			mimeType,
			filename
		};
	}
	return {
		publicUrl: resolvePublicImageUrl(target, imageId),
		buffer: null,
		mimeType,
		filename
	};
}
/** Send a single image attachment via Messenger. Supports fast binary FormData upload with URL fallback. */
async function sendMessengerImage(pageToken, recipientId, rawUrlOrPath, imageId) {
	const source = await getMessengerImageSource(rawUrlOrPath, imageId);
	if (source.buffer && source.buffer.length > 0) try {
		const blob = new Blob([source.buffer], { type: source.mimeType });
		const form = new FormData();
		form.append("recipient", JSON.stringify({ id: recipientId }));
		form.append("message", JSON.stringify({ attachment: {
			type: "image",
			payload: {}
		} }));
		form.append("filedata", blob, source.filename);
		form.append("messaging_type", "RESPONSE");
		const res = await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${pageToken}`, {
			method: "POST",
			body: form
		});
		if (res.ok) {
			console.log(`[sendMessengerImage] Sent binary image successfully (${source.buffer.length} bytes, ${source.mimeType})`);
			return;
		}
		const errText = await res.text();
		console.warn(`[sendMessengerImage:binary] Facebook API error ${res.status}: ${errText}, trying public URL...`);
	} catch (binErr) {
		console.warn("[sendMessengerImage:binary] Upload error:", binErr);
	}
	if (source.publicUrl) try {
		const res = await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${pageToken}`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				recipient: { id: recipientId },
				message: { attachment: {
					type: "image",
					payload: { url: source.publicUrl }
				} },
				messaging_type: "RESPONSE"
			})
		});
		if (res.ok) {
			console.log("[sendMessengerImage] Sent successfully via public URL payload");
			return;
		}
		const errText = await res.text();
		console.error(`[sendMessengerImage:url] Facebook API error (${res.status}): ${errText}`);
	} catch (urlErr) {
		console.error("[sendMessengerImage:url] network error:", urlErr);
	}
	throw new Error(`Unable to send Messenger image for: ${rawUrlOrPath}`);
}
var recentMidCache = /* @__PURE__ */ new Map();
function isDuplicateMid(mid) {
	if (!mid) return false;
	const now = Date.now();
	for (const [k, ts] of recentMidCache.entries()) if (now - ts > 3e5) recentMidCache.delete(k);
	if (recentMidCache.has(mid)) return true;
	recentMidCache.set(mid, now);
	return false;
}
async function claimFacebookEvent(eventType, eventId) {
	if (!eventId) return null;
	const jobName = `facebook-${eventType}:${eventId}`.slice(0, 240);
	const { data: claimed, error } = await supabaseAdmin.rpc("claim_background_job", {
		_job_name: jobName,
		_lease_seconds: 300
	});
	if (error) {
		console.error(`[dedup] unable to claim ${eventType}`, error.message);
		return null;
	}
	return claimed ? jobName : null;
}
async function finishFacebookEvent(jobName, succeeded) {
	await supabaseAdmin.rpc("finish_background_job", {
		_job_name: jobName,
		_status: succeeded ? "paused" : "failed",
		_result: {
			completed: succeeded,
			at: (/* @__PURE__ */ new Date()).toISOString()
		}
	});
}
/** Cross-instance lock for ONE conversation, shared by the webhook and the
*  batch/cron path. Both paths use this identical key, which is what actually
*  prevents duplicate replies (message ids differ between the two sources).
*  `retries` lets a caller wait for a busy conversation instead of dropping the
*  client's message: with several people writing at the same time, a short wait
*  is much better than never answering. */
async function claimConversation(pageId, senderId, retries = 0, retryDelayMs = 1500) {
	if (!pageId || !senderId) return null;
	const jobName = `facebook-convo:${pageId}:${senderId}`.slice(0, 240);
	for (let attempt = 0; attempt <= retries; attempt++) {
		const { data: claimed, error } = await supabaseAdmin.rpc("claim_background_job", {
			_job_name: jobName,
			_lease_seconds: 120
		});
		if (error) {
			console.error("[dedup] unable to claim conversation", error.message);
			return null;
		}
		if (claimed) return jobName;
		if (attempt < retries) await new Promise((r) => setTimeout(r, retryDelayMs));
	}
	return null;
}
/** Release the conversation lock so the next incoming message can be answered. */
async function releaseConversation(jobName) {
	if (!jobName) return;
	await supabaseAdmin.rpc("finish_background_job", {
		_job_name: jobName,
		_status: "idle",
		_result: { at: (/* @__PURE__ */ new Date()).toISOString() }
	});
}
function normalizeName(s) {
	return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "");
}
function safeParseOrderJson(jsonStr) {
	if (!jsonStr) return null;
	try {
		return JSON.parse(jsonStr);
	} catch {}
	try {
		let cleaned = jsonStr.trim();
		cleaned = cleaned.replace(/([{,]\s*)'([^']+)'(\s*:)/g, "$1\"$2\"$3");
		cleaned = cleaned.replace(/(:\s*)'([^']*)'(\s*[,}])/g, "$1\"$2\"$3");
		cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");
		cleaned = cleaned.replace(/\r?\n/g, " ");
		return JSON.parse(cleaned);
	} catch {}
	try {
		const extract = (key) => {
			const match = jsonStr.match(new RegExp(`"${key}"\\s*:\\s*"([^"]*)"`, "i")) || jsonStr.match(new RegExp(`'${key}'\\s*:\\s*'([^']*)'`, "i")) || jsonStr.match(new RegExp(`"${key}"\\s*:\\s*(\\d+)`, "i"));
			return match ? match[1] : null;
		};
		const product = extract("product") || extract("training") || extract("article");
		const name = extract("client_fb_name") || extract("client_name") || extract("name");
		const phone = extract("client_phone") || extract("phone") || extract("telephone");
		const whatsapp = extract("client_whatsapp") || extract("whatsapp");
		const address = extract("client_address") || extract("address") || extract("adresse");
		const type = extract("type") || (product ? "sales" : "training");
		const quantity = extract("quantity") ? Number(extract("quantity")) : 1;
		const ref = extract("payment_reference") || extract("reference");
		const notes = extract("notes");
		if (product || name || phone || address) return {
			type,
			product,
			client_fb_name: name,
			client_phone: phone,
			client_whatsapp: whatsapp,
			client_address: address,
			quantity,
			payment_reference: ref,
			notes
		};
	} catch {}
	return null;
}
async function fetchFbSenderName(senderId, pageToken) {
	if (!senderId || !pageToken) return null;
	try {
		const res = await fetch(`https://graph.facebook.com/v21.0/${senderId}?fields=name&access_token=${pageToken}`);
		if (res.ok) return (await res.json()).name || null;
	} catch {}
	return null;
}
/** Parse and strip [[ORDER:{...}]] and [[SEND_IMAGES:name]] markers.
*  Returns cleaned text plus the actions to execute. */
function extractAiActions(text) {
	const safeText = typeof text === "string" ? text : String(text ?? "");
	const orders = [];
	const imageRequests = [];
	let cleaned = safeText;
	cleaned = cleaned.replace(/\[\[?\s*ORDER:\s*(\{[\s\S]*?\})\s*\]\]?/gi, (_, json) => {
		const parsed = safeParseOrderJson(json);
		if (parsed) orders.push(parsed);
		else console.warn("[extractAiActions] bad ORDER json:", json.slice(0, 200));
		return "";
	});
	cleaned = cleaned.replace(/\[\[?\s*(?:SEND_?IMAGE_?ID|IMAGE_?ID|SEND_?IMAGE|SEND_?IMAGES?|SENDIMAGES?|SEND_?PHOTOS?|SENDPHOTOS?|IMAGES?|PHOTOS?|SARY|VOIR_?IMAGES?)(?::\s*([^\]\n]*?))?\s*\]\]?/gi, (_, name) => {
		imageRequests.push(String(name || "").trim());
		return "";
	});
	cleaned = cleaned.replace(/\[\[[\s\S]*?\]\]/g, "");
	cleaned = cleaned.replace(/\[(?:SEND_?IMAGE_?ID|SEND_?IMAGES?|SENDIMAGES?|SEND_?PHOTOS?|SENDPHOTOS?|ORDER)[^\]]*\]/gi, "");
	cleaned = cleaned.replace(/\n{3,}/g, "\n\n").trim();
	return {
		cleanText: cleaned,
		orders,
		imageRequests
	};
}
/** Persist an AI-emitted order into the orders table. */
async function persistAiOrder(userId, pageId, senderId, senderName, order) {
	try {
		const stripPolite = (value) => {
			let out = value.trim();
			const politeRe = /^(?:eny|ie|ok+|okay|d'accord|daccord|misaotra|azafady|tompoko|tompoko\s*o|salama|bonjour|voici|ity|itony|ny\s+anarako\s+dia|anarako\s+dia|anarako|ny\s+adiresiko\s+dia|adiresiko\s+dia|adiresiko|ny\s+laharako\s+dia|laharako\s+dia|laharako|mon\s+nom\s+est|je\s+m'appelle|mon\s+adresse\s+est|nom|anarana|adiresy|adresse|numero|numéro|laharana)\b[\s:,;.\-–]*/i;
			for (let i = 0; i < 6; i++) {
				const next = out.replace(politeRe, "").trim();
				if (next === out) break;
				out = next;
			}
			return out.replace(/^[:,;.\-–\s]+/, "").trim();
		};
		const cleanShortField = (value, maxLength) => {
			if (typeof value !== "string") return null;
			const clean = stripPolite(value.replace(/\s+/g, " ").trim());
			if (!clean || clean.length > maxLength || clean.includes("[[")) return null;
			return clean;
		};
		const cleanPhone = (value) => {
			const clean = cleanShortField(value, 40);
			if (!clean) return null;
			const match = clean.match(/(\+?261\s*[.-]?\s*3[234789](?:\s*[.-]?\s*\d){7}|\b0?3[234789](?:\s*[.-]?\s*\d){7}\b|\b\d{10}\b)/);
			return match ? match[0].replace(/[\s.-]/g, "") : null;
		};
		const NAME_REJECT_RE = /\b(?:region|région|district|commune|fokontany|quartier|lot|adresse|adiresy|repere|repère|rue|villa|cit[ée]|village|whatsapp|facebook|messenger|client|assistant|discussion|commande|kaomandy|produit|vokatra|formation|prix|vidiny|ariary|ar|mvola|orange money|airtel)\b/i;
		const NAME_FILLER_RE = /^(?:eny|ie|oui|non|tsia|ok+|okay|d'accord|daccord|misaotra|merci|azafady|tompoko|salama|bonjour|salut|mbola|izay|io|ity|itony|inona|vita|tsy\s+haiko)$/i;
		const cleanName = (value) => {
			let clean = cleanShortField(value, 80);
			if (!clean) return null;
			clean = clean.split(/[,;.\n/]/)[0].trim();
			clean = clean.replace(/^(?:anarana\s*feno|anaranao|anarana|nom\s*complet|nom|name)\b[\s:=-]*/i, "").replace(/^[:=\-–\s]+/, "").trim();
			if (!clean || clean.length < 3) return null;
			if (/\d|@|https?:|[.!?]{2,}/.test(clean)) return null;
			if (NAME_REJECT_RE.test(clean)) return null;
			if (NAME_FILLER_RE.test(clean)) return null;
			if (!/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ' -]*$/.test(clean)) return null;
			return clean.split(/\s+/).length <= 6 ? clean : null;
		};
		const cleanAddress = (value) => {
			let clean = cleanShortField(value, 400);
			if (!clean || /\b(?:assistant|system prompt|discussion|réponse de l'ia)\b/i.test(clean)) return null;
			clean = clean.replace(/(\+?261[\s.-]?)?\b0?3[234789][\s.-]?\d{2}[\s.-]?\d{3}[\s.-]?\d{2}\b/g, "").replace(/\b(misaotra|merci|azafady|tompoko)\b/gi, "").replace(/\s{2,}/g, " ").replace(/^[\s:,;.\-–/]+|[\s:,;.\-–/]+$/g, "").trim();
			return clean || null;
		};
		let type = "sales";
		if (order.type === "training" || !order.product && order.training) type = "training";
		else if (order.type === "sales" || order.product) type = "sales";
		else {
			const { data: st } = await supabaseAdmin.from("settings").select("assistance_type").eq("user_id", userId).maybeSingle();
			type = st?.assistance_type === "training" ? "training" : "sales";
		}
		let productId = null;
		let trainingId = null;
		if (type === "sales" && order.product) {
			const { data: prods } = await supabaseAdmin.from("products").select("id,name").eq("user_id", userId);
			const target = normalizeName(String(order.product));
			productId = ((prods ?? []).find((p) => normalizeName(p.name) === target) ?? (prods ?? []).find((p) => normalizeName(p.name).includes(target) || target.includes(normalizeName(p.name))))?.id ?? null;
		}
		if (type === "training" && order.training) {
			const { data: trs } = await supabaseAdmin.from("trainings").select("id,name").eq("user_id", userId);
			const target = normalizeName(String(order.training));
			trainingId = ((trs ?? []).find((t) => normalizeName(t.name) === target) ?? (trs ?? []).find((t) => normalizeName(t.name).includes(target) || target.includes(normalizeName(t.name))))?.id ?? null;
		}
		const fbName = senderName || null;
		let finalName = null;
		let finalPhone = null;
		let finalWhatsapp = null;
		let finalAddress = null;
		{
			const { data: recentLogs } = await supabaseAdmin.from("messages_log").select("content, sender_name, direction, created_at").eq("user_id", userId).eq("page_id", pageId).eq("sender_id", senderId).order("created_at", { ascending: false }).limit(40);
			const chronological = [...recentLogs ?? []].reverse();
			const clientMsgs = chronological.filter((l) => directionToRole(l.direction ?? "incoming") === "user").map((l) => String(l.content ?? "").trim()).filter(Boolean);
			const phoneRe = /(\+?261\s*[\s.-]?3[234789][\s.-]?\d{2}[\s.-]?\d{3}[\s.-]?\d{2}|\b0?3[234789][\s.-]?\d{2}[\s.-]?\d{3}[\s.-]?\d{2}\b|\b\d{10}\b)/;
			const addressRe = /(region|région|district|commune|fokontany|quartier|lot\s|adresse|adiresy|repere|repère|antanana|village|rue|villa|cité|cite)/i;
			const nameLabelRe = /(?:anarana\s*feno|anaranao|anarana|nom\s*complet|nom)\s*[:=-]\s*([A-Za-zÀ-ÿ' -]{3,60})/i;
			const nameSelfRe = /(?:ny\s+)?(?:anarako|anarana\s*feno\s*ko)\s*(?:dia|no)?\s*[:=-]?\s*([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ' -]{2,60})|(?:je\s*m'?appelle|mon\s+nom\s+est)\s*[:=-]?\s*([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ' -]{2,60})/i;
			const addressLabelRe = /(?:adiresy|adresse)\s*[:=-]\s*(.{6,400})/i;
			for (const txt of clientMsgs) {
				if (!finalPhone) {
					const m = txt.match(phoneRe);
					if (m) finalPhone = m[0].replace(/[\s.-]/g, "");
				}
				if (!finalAddress) {
					const labelledAddress = txt.match(addressLabelRe)?.[1];
					if (labelledAddress) finalAddress = cleanAddress(labelledAddress);
					else if (addressRe.test(txt) && txt.length >= 6) finalAddress = cleanAddress(txt);
				}
			}
			for (let i = clientMsgs.length - 1; i >= 0 && !finalName; i--) {
				const txt = clientMsgs[i];
				const labelled = txt.match(nameLabelRe)?.[1];
				if (labelled) {
					finalName = cleanName(labelled);
					if (finalName) break;
				}
				const selfMatch = txt.match(nameSelfRe);
				const self = selfMatch?.[1] ?? selfMatch?.[2];
				if (self) finalName = cleanName(self);
			}
			for (let i = chronological.length - 2; i >= 0; i--) {
				const ask = chronological[i];
				const answer = chronological[i + 1];
				if (directionToRole(ask.direction ?? "incoming") !== "assistant") continue;
				if (directionToRole(answer.direction ?? "incoming") !== "user") continue;
				const question = String(ask.content ?? "");
				const value = String(answer.content ?? "").trim();
				const asksName = /anarana(?:o)?(?:\s*feno)?|nom\s*complet/i.test(question);
				const asksPhone = /laharana|finday|téléphone|telephone|whatsapp|numéro|numero/i.test(question);
				const asksAddress = /adiresy|adresse|fokontany|district|région|region|repère|repere/i.test(question);
				if (!finalName && asksName && !asksPhone && !asksAddress) finalName = cleanName(value);
				if (!finalPhone && asksPhone) finalPhone = cleanPhone(value);
				if (!finalAddress && asksAddress) finalAddress = cleanAddress(value);
			}
			if (!finalName) {
				const incomingWithName = [...chronological].reverse().find((l) => directionToRole(l.direction ?? "incoming") === "user" && typeof l.sender_name === "string" && l.sender_name.trim().length >= 2);
				finalName = incomingWithName ? String(incomingWithName.sender_name).trim() : null;
			}
		}
		if (!finalName) finalName = fbName;
		finalWhatsapp = finalPhone;
		const { error: insErr } = await supabaseAdmin.from("orders").insert({
			user_id: userId,
			page_id: pageId,
			type,
			product_id: productId,
			training_id: trainingId,
			client_fb_id: senderId,
			client_fb_name: finalName || "Mpanjifa Messenger",
			client_whatsapp: finalWhatsapp,
			client_phone: finalPhone,
			client_address: finalAddress,
			payment_reference: (() => {
				const ref = cleanShortField(order.payment_reference, 60);
				if (!ref) return null;
				if (/[.!?]|\s{2,}/.test(ref) || ref.split(/\s+/).length > 6) return null;
				return ref;
			})(),
			quantity: Number(order.quantity) > 0 ? Number(order.quantity) : 1,
			notes: !productId && !trainingId ? `Article: ${cleanShortField(order.product ?? order.training, 120) ?? "Produit"}` : null,
			status: "pending"
		});
		if (insErr) console.error("[persistAiOrder] insert error:", insErr.message);
		else {
			console.log(`[persistAiOrder] Successfully created order for ${finalName || senderId} (${type})`);
			try {
				const { notifyNewOrderToAdmin } = await import("./push-notify.server-Bi0V6O-Y.mjs");
				await notifyNewOrderToAdmin(userId, {
					clientName: finalName,
					item: cleanShortField(order.product ?? order.training, 120),
					quantity: Number(order.quantity) > 0 ? Number(order.quantity) : 1,
					type
				});
			} catch (e) {
				console.error("[persistAiOrder] push notify error:", e);
			}
		}
	} catch (e) {
		console.error("[persistAiOrder] Error:", e);
	}
}
/** Send product photos or specific image by ID for a client. */
async function sendProductImagesForClient(userId, pageId, pageToken, senderId, queryParam) {
	const cleanParam = (queryParam || "").trim();
	if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanParam)) {
		const { data: imgRow } = await supabaseAdmin.from("product_images").select("id, image_path, product_id, products(name)").eq("id", cleanParam).maybeSingle();
		if (imgRow?.image_path) try {
			await sendMessengerImage(pageToken, senderId, imgRow.image_path, imgRow.id);
			await insertMessageLog({
				user_id: userId,
				page_id: pageId,
				sender_id: senderId,
				content: `[Sary : ${imgRow.products?.name || "Produit"}]`,
				media_type: "image",
				media_url: resolvePublicImageUrl(imgRow.image_path, imgRow.id),
				direction: OUTGOING_DIRECTION,
				status: "sent"
			}, "image-sent");
			return {
				sent: 1,
				note: `sent-image-id:${imgRow.id}`
			};
		} catch (e) {
			console.error("[sendProductImagesForClient by image ID]", e);
		}
	}
	const { data: prods } = await supabaseAdmin.from("products").select("id,name, product_images(id, image_path, sort_order)").eq("user_id", userId).eq("is_active", true);
	if (!prods || prods.length === 0) return {
		sent: 0,
		note: "no-products"
	};
	let product = null;
	const target = normalizeName(cleanParam);
	if (!(!target || (/* @__PURE__ */ new Set([
		"sary",
		"sarin",
		"photo",
		"photos",
		"image",
		"images",
		"apercu",
		"voir",
		"jereo",
		"produit",
		"produits",
		"all",
		"galerie",
		""
	])).has(target)) && target) product = prods.find((p) => p.id === cleanParam || normalizeName(p.name) === target) ?? prods.find((p) => normalizeName(p.name).includes(target) || target.includes(normalizeName(p.name)));
	if (!product || !Array.isArray(product.product_images) || product.product_images.length === 0) product = prods.find((p) => Array.isArray(p.product_images) && p.product_images.length > 0) || prods[0];
	let images = (product.product_images ?? []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
	if (!images || images.length === 0) {
		const { data: directImgs } = await supabaseAdmin.from("product_images").select("id, image_path").eq("user_id", userId).limit(10);
		if (directImgs && directImgs.length > 0) images = directImgs;
	}
	if (!images || images.length === 0) return {
		sent: 0,
		note: "no-images"
	};
	const { data: state } = await supabaseAdmin.from("client_ia_state").select("product_image_offsets").eq("user_id", userId).eq("page_id", pageId).eq("client_fb_id", senderId).maybeSingle();
	const offsets = state?.product_image_offsets ?? {};
	let offset = offsets[product.id || "default"] ?? 0;
	if (offset >= images.length) offset = 0;
	const batch = images.slice(offset, offset + 1);
	if (batch.length === 0) return {
		sent: 0,
		note: "already-sent-all"
	};
	let sent = 0;
	for (const img of batch) {
		if (!img.image_path) continue;
		try {
			await sendMessengerImage(pageToken, senderId, img.image_path, img.id);
			sent++;
			await insertMessageLog({
				user_id: userId,
				page_id: pageId,
				sender_id: senderId,
				content: `[Sary : ${product.name || "Produit"}]`,
				media_type: "image",
				media_url: resolvePublicImageUrl(img.image_path, img.id),
				direction: OUTGOING_DIRECTION,
				status: "sent"
			}, "image-sent");
		} catch (e) {
			console.error("[sendProductImagesForClient batch]", e);
		}
	}
	const newOffsets = {
		...offsets,
		[product.id || "default"]: offset + sent
	};
	await supabaseAdmin.from("client_ia_state").upsert({
		user_id: userId,
		page_id: pageId,
		client_fb_id: senderId,
		product_image_offsets: newOffsets
	}, { onConflict: "user_id,page_id,client_fb_id" });
	return {
		sent,
		note: `batch:${sent}/${images.length}`
	};
}
/** Process AI actions extracted from a Messenger reply, send standalone images first, then return the cleaned text. */
async function processAiActionsForMessenger(opts) {
	const { cleanText, orders, imageRequests } = extractAiActions(opts.rawReply);
	const msg = opts.userMessageText ?? "";
	const askedPhotos = /(sary|sarin|photo|photos|image|images|aper[cç]u|asehoy|ase[hp]o|montre|montrez|hijery sary|jereo sary)/i.test(msg);
	const alreadyAnsweredWithImage = async () => {
		const { data: lastIn } = await supabaseAdmin.from("messages_log").select("created_at").eq("user_id", opts.userId).eq("page_id", opts.pageId).eq("sender_id", opts.senderId).eq("direction", "incoming").order("created_at", { ascending: false }).limit(1).maybeSingle();
		const { data: lastImg } = await supabaseAdmin.from("messages_log").select("created_at").eq("user_id", opts.userId).eq("page_id", opts.pageId).eq("sender_id", opts.senderId).eq("media_type", "image").eq("direction", OUTGOING_DIRECTION).order("created_at", { ascending: false }).limit(1).maybeSingle();
		if (!lastImg?.created_at) return false;
		if (!lastIn?.created_at) return true;
		return new Date(lastImg.created_at).getTime() >= new Date(lastIn.created_at).getTime();
	};
	let allowedRequests = [];
	if (imageRequests.length > 0 && askedPhotos && !await alreadyAnsweredWithImage()) allowedRequests = [imageRequests[0] ?? ""];
	for (const o of orders) await persistAiOrder(opts.userId, opts.pageId, opts.senderId, opts.senderName, o);
	let totalImagesSent = 0;
	for (const name of allowedRequests) {
		const res = await sendProductImagesForClient(opts.userId, opts.pageId, opts.pageToken, opts.senderId, name);
		totalImagesSent += res.sent;
	}
	let finalText = cleanText;
	if (!finalText.trim()) finalText = totalImagesSent > 0 ? "Indro ny sary tompoko. Inona no azonay anampiana anao momba ity vokatra ity ? Raha te-hividy ianao dia lazao ny anaranao, laharana findainao ary ny adiresinao azafady." : "Misaotra tompoko. Inona no azonay anampiana anao ? Raha mila sary na fanazavana fanampiny dia lazao fotsiny azafady.";
	return {
		cleanText: finalText,
		totalImagesSent
	};
}
/** Reply to a comment publicly. */
async function sendCommentReply(pageToken, commentId, text) {
	const res = await fetch(`https://graph.facebook.com/v21.0/${commentId}/comments?access_token=${pageToken}`, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ message: text })
	});
	if (!res.ok) throw new Error(`Comment reply ${res.status}: ${(await res.text()).slice(0, 200)}`);
}
/** Send a private reply to a comment (redirects user to Messenger). Supports chunked unlimited text. */
async function sendPrivateReply(pageToken, commentId, text) {
	const chunks = splitMessengerText(text);
	if (chunks.length === 0) return;
	const res = await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${pageToken}`, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			recipient: { comment_id: commentId },
			message: { text: chunks[0] },
			messaging_type: "RESPONSE"
		})
	});
	if (!res.ok) throw new Error(`Private reply ${res.status}: ${(await res.text()).slice(0, 200)}`);
}
async function getPage(pageId) {
	const { data } = await supabaseAdmin.from("facebook_pages").select("*").eq("page_id", pageId).eq("is_connected", true).order("updated_at", { ascending: false }).limit(1);
	if (data?.[0]) return data[0];
	const { data: central } = await supabaseAdmin.from("facebook_central_pages").select("page_id,page_name,page_access_token,user_access_token,token_expires_at,assigned_workspace_id").eq("page_id", pageId).not("assigned_workspace_id", "is", null).limit(1);
	const assigned = central?.[0];
	if (!assigned?.assigned_workspace_id || !assigned.page_access_token) return null;
	const { data: restored } = await supabaseAdmin.from("facebook_pages").upsert({
		user_id: assigned.assigned_workspace_id,
		page_id: assigned.page_id,
		page_name: assigned.page_name,
		page_access_token: assigned.page_access_token,
		user_access_token: assigned.user_access_token,
		token_expires_at: assigned.token_expires_at,
		is_connected: true
	}, { onConflict: "user_id,page_id" }).select("*").limit(1);
	return restored?.[0] ?? null;
}
async function handleMessengerEvent(page, ev) {
	const senderId = ev?.sender?.id;
	if (!senderId || senderId === page.page_id) return;
	if (ev.message?.is_echo) return;
	const msg = ev.message;
	if (!msg) return;
	const mid = msg.mid || "";
	if (mid && isDuplicateMid(mid)) {
		console.log("[dedup] ignoring duplicate messenger event mid:", mid);
		return;
	}
	const eventJob = mid ? await claimFacebookEvent("message", mid) : null;
	if (mid && !eventJob) {
		console.log("[dedup] messenger event already claimed:", mid);
		return;
	}
	let eventSucceeded = false;
	const settingsPromise = supabaseAdmin.from("settings").select("auto_reply_messages,private_message_link,global_ia_stopped").eq("user_id", page.user_id).maybeSingle();
	const clientStatePromise = supabaseAdmin.from("client_ia_state").select("ia_stopped").eq("user_id", page.user_id).eq("page_id", page.page_id).eq("client_fb_id", senderId).maybeSingle();
	const systemPromptPromise = buildSystemPrompt(page.user_id, "message", page.page_id).catch(() => null);
	const { data: settings } = await settingsPromise;
	const text = msg.text ?? "";
	const attachments = msg.attachments ?? [];
	const parts = [];
	if (text) parts.push({ text });
	let mediaType = null;
	let mediaUrl = null;
	for (const a of attachments) if (a.type === "image" && a.payload?.url) {
		const p = await fetchAsInlinePart(a.payload.url);
		if (p) parts.push(p);
		mediaType = "image";
		mediaUrl = a.payload.url;
	} else if (a.type === "audio" && a.payload?.url) {
		parts.push({ text: `[Message vocal reçu : ${a.payload.url}]` });
		mediaType = "audio";
		mediaUrl = a.payload.url;
	}
	if (parts.length === 0) parts.push({ text: "(message vide)" });
	const history = await fetchMessengerHistoryForReply(page, senderId, text, 24);
	const incomingLogPromise = insertMessageLog({
		user_id: page.user_id,
		page_id: page.page_id,
		sender_id: senderId,
		content: text || null,
		direction: INCOMING_DIRECTION,
		status: "received",
		media_type: mediaType,
		media_url: mediaUrl
	}, "incoming-webhook");
	if (!(settings?.auto_reply_messages ?? true)) {
		await incomingLogPromise;
		return;
	}
	if (settings?.global_ia_stopped) {
		console.log("[stop-ia] global stopped for user", page.user_id);
		await incomingLogPromise;
		return;
	}
	const { data: clientState } = await clientStatePromise;
	if (clientState?.ia_stopped) {
		console.log("[stop-ia] client stopped", senderId);
		await incomingLogPromise;
		return;
	}
	await incomingLogPromise;
	try {
		const systemPrompt = await systemPromptPromise;
		if (!systemPrompt) {
			console.log("[skip] no prompt configured for page", page.page_id);
			return;
		}
		const { text: reply, provider } = await generateAiReply({
			userId: page.user_id,
			systemPrompt,
			history,
			parts,
			allowLinks: true
		});
		const rawReply = reply || "Misaotra tamin'ny hafatrao. Handray anao tsy ho ela izahay.";
		const senderName = await fetchFbSenderName(senderId, page.page_access_token);
		const { cleanText, totalImagesSent } = await processAiActionsForMessenger({
			userId: page.user_id,
			pageId: page.page_id,
			pageToken: page.page_access_token,
			senderId,
			senderName,
			rawReply,
			userMessageText: text
		});
		if (totalImagesSent > 0) await new Promise((r) => setTimeout(r, 600));
		if (cleanText) {
			await sendMessengerReply(page.page_access_token, senderId, cleanText);
			await insertMessageLog({
				user_id: page.user_id,
				page_id: page.page_id,
				sender_id: senderId,
				content: cleanText,
				ai_response: cleanText,
				direction: OUTGOING_DIRECTION,
				status: `sent:${provider}`
			}, "outgoing-webhook");
		}
		eventSucceeded = true;
	} catch (e) {
		console.error("[messenger reply]", e);
		await insertMessageLog({
			user_id: page.user_id,
			page_id: page.page_id,
			sender_id: senderId,
			direction: OUTGOING_DIRECTION,
			status: `error:${e instanceof Error ? e.message.slice(0, 120) : "unknown"}`
		}, "error-webhook");
	} finally {
		if (eventJob) await finishFacebookEvent(eventJob, eventSucceeded);
	}
}
async function fetchCommentAttachments(commentId, pageToken) {
	const parts = [];
	try {
		const j = await (await fetch(`https://graph.facebook.com/v21.0/${commentId}/attachment?access_token=${pageToken}`)).json();
		const media = j?.media?.image?.src ?? j?.data?.[0]?.media?.image?.src;
		if (media) {
			const p = await fetchAsInlinePart(media);
			if (p) parts.push(p);
		}
	} catch (e) {
		console.warn("[fetchCommentAttachments]", e);
	}
	return parts;
}
/** Historique des commentaires précédents du même auteur sur la même publication. */
async function fetchCommentHistory(userId, postId, authorId, limit = 8) {
	const { data } = await supabaseAdmin.from("comments_log").select("content,ai_response,created_at").eq("user_id", userId).eq("post_id", postId).eq("author_id", authorId).order("created_at", { ascending: false }).limit(limit);
	const rows = (data ?? []).reverse();
	const turns = [];
	for (const r of rows) {
		if (r.content) turns.push({
			role: "user",
			text: r.content
		});
		if (r.ai_response) {
			const cleaned = String(r.ai_response).replace(/^\[[^\]]+\]\s*/, "").split("\n---MP---\n")[0];
			if (cleaned.trim()) turns.push({
				role: "assistant",
				text: cleaned
			});
		}
	}
	return turns;
}
async function handleFeedChange(page, value, force = false) {
	if (value?.item !== "comment" || value.verb !== "add") return;
	const commentId = value.comment_id;
	const postId = value.post_id;
	const authorId = value.from?.id ?? "";
	const authorName = value.from?.name ?? null;
	const content = value.message ?? "";
	if (!commentId || authorId === page.page_id) return;
	if (force) await supabaseAdmin.rpc("finish_background_job", {
		_job_name: `facebook-comment:${commentId}`.slice(0, 240),
		_status: "idle",
		_result: {
			manual_reset: true,
			at: (/* @__PURE__ */ new Date()).toISOString()
		}
	});
	const eventJob = await claimFacebookEvent("comment", commentId);
	if (!eventJob) {
		console.log("[dedup] comment event already claimed:", commentId);
		return;
	}
	let eventSucceeded = false;
	const { data: existing } = await supabaseAdmin.from("comments_log").select("id,replied").eq("comment_id", commentId).maybeSingle();
	if (existing?.replied) {
		await finishFacebookEvent(eventJob, true);
		return;
	}
	const { data: settings } = await supabaseAdmin.from("settings").select("auto_reply_comments,private_message_link,global_ia_stopped").eq("user_id", page.user_id).maybeSingle();
	if (settings?.global_ia_stopped) {
		await finishFacebookEvent(eventJob, false);
		return;
	}
	const history = await fetchCommentHistory(page.user_id, postId, authorId, 8);
	if (!existing) await supabaseAdmin.from("comments_log").insert({
		user_id: page.user_id,
		page_id: page.page_id,
		post_id: postId,
		comment_id: commentId,
		author_id: authorId,
		author_name: authorName,
		content,
		replied: false
	});
	if (!(settings?.auto_reply_comments ?? true)) {
		await finishFacebookEvent(eventJob, false);
		return;
	}
	try {
		const postContext = await fetchPostContext(postId, page.page_access_token);
		const imageParts = await fetchCommentAttachments(commentId, page.page_access_token);
		const systemPrompt = await buildSystemPrompt(page.user_id, "comment", page.page_id);
		if (!systemPrompt) {
			console.log("[skip] no prompt configured for page", page.page_id);
			return;
		}
		const privateLink = settings?.private_message_link ?? "";
		const baseContext = `Publication de la page :\n"""${postContext}"""\n\nCommentaire de ${authorName ?? "l'utilisateur"} :\n"""${content || "(sans texte)"}"""${imageParts.length ? "\n\n(Une image a été jointe au commentaire, analyse-la avant de répondre.)" : ""}`;
		let finalPublic = "";
		let providerUsed = "";
		try {
			const pubPrompt = `${baseContext}\n\nRédige une réponse publique au commentaire de l'utilisateur qui s'aligne STRICTEMENT avec la description de la publication ci-dessus et répond directement à sa question (en malgache si le client écrit en malgache, en français sinon). 1 à 2 phrases chaleureuses, professionnelles et bienveillantes, invitant la personne. Sans lien, sans * ni #.`;
			const pub = await generateAiReply({
				userId: page.user_id,
				systemPrompt,
				history,
				parts: [{ text: pubPrompt }, ...imageParts],
				allowLinks: false
			});
			finalPublic = extractAiActions(pub.text).cleanText;
			providerUsed = pub.provider;
		} catch (e) {
			console.warn("[public reply failed]", e instanceof Error ? e.message : e);
		}
		if (!finalPublic.trim()) finalPublic = "Misaotra tamin'ny hevitrao. Handray anao amin'ny antsipiriany izahay.";
		await sendCommentReply(page.page_access_token, commentId, finalPublic);
		let privateSent = false;
		let privateReply = "";
		try {
			const privPrompt = `${baseContext}\n\nRédige une réponse Messenger privée complète et détaillée basée sur la publication : explication claire, étapes numérotées si besoin (avec des chiffres, pas de #), et si utile le lien : ${privateLink || "(aucun lien fourni)"}. Style calme, aéré, sans * ni #.`;
			const priv = await generateAiReply({
				userId: page.user_id,
				systemPrompt,
				history,
				parts: [{ text: privPrompt }, ...imageParts],
				allowLinks: true
			});
			privateReply = extractAiActions(priv.text).cleanText;
			providerUsed = providerUsed || priv.provider;
			if (privateReply.trim()) {
				await sendPrivateReply(page.page_access_token, commentId, privateReply);
				const chunks = splitMessengerText(privateReply);
				if (chunks.length > 1 && authorId) for (let k = 1; k < chunks.length; k++) await sendMessengerReply(page.page_access_token, authorId, chunks[k]);
				privateSent = true;
			}
		} catch (e) {
			console.warn("[private reply failed]", e instanceof Error ? e.message : e);
		}
		await supabaseAdmin.from("comments_log").update({
			replied: true,
			replied_at: (/* @__PURE__ */ new Date()).toISOString(),
			ai_response: `[${providerUsed}${privateSent ? "+MP" : "+public-only"}] ${finalPublic}${privateReply ? `\n---MP---\n${privateReply}` : ""}`
		}).eq("comment_id", commentId);
		eventSucceeded = true;
	} catch (e) {
		console.error("[comment reply]", e);
	} finally {
		await finishFacebookEvent(eventJob, eventSucceeded);
	}
}
async function processWebhookEvent(body) {
	if (body?.object !== "page") return;
	await Promise.allSettled((body.entry ?? []).map(async (entry) => {
		const page = await getPage(String(entry.id));
		if (!page) return;
		await Promise.allSettled([...(entry.messaging ?? []).map((ev) => handleMessengerEvent(page, ev).catch((e) => console.error("[messenger]", e))), ...(entry.changes ?? []).filter((c) => c.field === "feed").map((c) => handleFeedChange(page, c.value).catch((e) => console.error("[feed]", e)))]);
	}));
}
/** Fetch pending Messenger conversations directly from Facebook Graph API.
*  A conversation is "pending" if its most recent message is from someone other than the page. */
async function fetchPendingConversations(page, maxConversations, lookbackHours) {
	const sinceMs = Date.now() - lookbackHours * 3600 * 1e3;
	const url = `https://graph.facebook.com/v21.0/${page.page_id}/conversations?platform=messenger&fields=participants,updated_time,messages.limit(5){id,message,from,created_time,attachments{mime_type,image_data,file_url,type}}&limit=${Math.min(maxConversations, 50)}&access_token=${page.page_access_token}`;
	const res = await fetch(url);
	if (!res.ok) {
		const t = await res.text();
		throw new Error(`Graph conversations ${res.status}: ${t.slice(0, 200)}`);
	}
	const convos = (await res.json()).data ?? [];
	const pending = [];
	for (const c of convos) {
		const updatedMs = c.updated_time ? Date.parse(c.updated_time) : 0;
		if (updatedMs && updatedMs < sinceMs) continue;
		const msgs = c.messages?.data ?? [];
		if (msgs.length === 0) continue;
		const last = msgs[0];
		const fromId = last.from?.id;
		if (!fromId || fromId === page.page_id) continue;
		const other = (c.participants?.data ?? []).find((p) => p.id && p.id !== page.page_id);
		const senderId = other?.id ?? fromId;
		const senderName = other?.name ?? last.from?.name ?? null;
		const att = last.attachments?.data?.[0];
		const attUrl = att?.image_data?.url ?? att?.image_data?.preview_url ?? att?.file_url ?? null;
		const attType = att?.mime_type?.startsWith("image/") ? "image" : att?.type ?? null;
		pending.push({
			senderId,
			senderName,
			lastText: last.message ?? "",
			lastAttachmentUrl: attUrl,
			lastAttachmentType: attType,
			lastMessageId: last.id ?? null,
			lastMessageTimeMs: last.created_time ? Date.parse(last.created_time) : updatedMs || Date.now()
		});
		if (pending.length >= maxConversations) break;
	}
	return pending;
}
/** Second source of pending conversations, read from our own message log.
*  The Graph "conversations" endpoint sometimes hides threads (paging, page
*  echoes, permissions), which made the manual run report "0 message envoyé"
*  while unanswered messages were clearly visible in the app. */
async function fetchPendingFromLogs(userId, page, lookbackHours, maxConversations) {
	const sinceIso = (/* @__PURE__ */ new Date(Date.now() - lookbackHours * 3600 * 1e3)).toISOString();
	const { data } = await supabaseAdmin.from("messages_log").select("sender_id,sender_name,content,direction,media_type,media_url,created_at").eq("user_id", userId).eq("page_id", page.page_id).gte("created_at", sinceIso).order("created_at", { ascending: false }).limit(600);
	const latestBySender = /* @__PURE__ */ new Map();
	for (const row of data ?? []) {
		if (!row.sender_id) continue;
		if (!latestBySender.has(row.sender_id)) latestBySender.set(row.sender_id, row);
	}
	const pending = [];
	for (const [senderId, row] of latestBySender) {
		if (row.direction !== INCOMING_DIRECTION) continue;
		pending.push({
			senderId,
			senderName: row.sender_name ?? null,
			lastText: row.content ?? "",
			lastAttachmentUrl: row.media_url ?? null,
			lastAttachmentType: row.media_type ?? null,
			lastMessageId: null,
			lastMessageTimeMs: row.created_at ? Date.parse(row.created_at) : Date.now()
		});
		if (pending.length >= maxConversations) break;
	}
	return pending;
}
/** Guard against two overlapping ticks answering the same conversation. */
var inFlightReplies = /* @__PURE__ */ new Set();
/** True when a TEXT reply was already sent after the given moment (start of this turn).
*  Image logs are ignored on purpose: photos sent during the current turn must
*  never block the explanatory text that follows them, otherwise the client has
*  to write twice before the assistant answers again. */
async function alreadyAnsweredAfter(userId, pageId, senderId, sinceMs) {
	const { data } = await supabaseAdmin.from("messages_log").select("created_at,direction,media_type").eq("user_id", userId).eq("page_id", pageId).eq("sender_id", senderId).eq("direction", OUTGOING_DIRECTION).order("created_at", { ascending: false }).limit(5);
	const lastOut = (data ?? []).find((r) => !r.media_type);
	if (!lastOut?.created_at) return false;
	return Date.parse(lastOut.created_at) >= sinceMs;
}
/** Reply to all conversations whose last message is unanswered, for one user.
*  `force` = manual click on "Répondre à tous les messages privés": the run must
*  never be silently skipped by in-memory caches or a stale conversation lock. */
async function replyAllPendingForUser(userId, opts = {}) {
	const force = opts.force ?? false;
	const lookbackHours = opts.lookbackHours ?? (force ? 168 : 23.5);
	const maxConversations = opts.maxConversations ?? 50;
	const details = [];
	let processed = 0;
	let replied = 0;
	let errors = 0;
	const { data: pages } = await supabaseAdmin.from("facebook_pages").select("*").eq("user_id", userId).eq("is_connected", true);
	if (!pages || pages.length === 0) return {
		processed,
		replied,
		errors,
		details: ["Aucune page connectée"]
	};
	const { data: settings } = await supabaseAdmin.from("settings").select("global_ia_stopped").eq("user_id", userId).maybeSingle();
	if (settings?.global_ia_stopped) return {
		processed,
		replied,
		errors,
		details: ["Stop IA global activé"]
	};
	const { data: stopStates } = await supabaseAdmin.from("client_ia_state").select("page_id,client_fb_id,ia_stopped").eq("user_id", userId).eq("ia_stopped", true);
	const stoppedSet = new Set((stopStates ?? []).map((s) => `${s.page_id}::${s.client_fb_id}`));
	for (const page of pages) {
		const systemPrompt = await buildSystemPrompt(userId, "message", page.page_id);
		if (!systemPrompt) {
			details.push(`- ${page.page_name ?? page.page_id} : aucun prompt configuré, IA désactivée`);
			continue;
		}
		let pending = [];
		let graphFailed = false;
		try {
			pending = await fetchPendingConversations(page, maxConversations, lookbackHours);
		} catch (e) {
			graphFailed = true;
			const msg = e instanceof Error ? e.message : String(e);
			details.push(`! ${page.page_name ?? page.page_id} (Graph): ${msg.slice(0, 160)}`);
		}
		try {
			const fromLogs = await fetchPendingFromLogs(userId, page, lookbackHours, maxConversations);
			const known = new Set(pending.map((p) => p.senderId));
			for (const p of fromLogs) if (!known.has(p.senderId)) pending.push(p);
		} catch (e) {
			console.warn("[batch] log fallback failed", e);
		}
		if (pending.length === 0 && graphFailed) {
			errors++;
			continue;
		}
		console.log(`[batch] page ${page.page_name ?? page.page_id}: ${pending.length} conversation(s) en attente`);
		const processOne = async (p) => {
			processed++;
			if (stoppedSet.has(`${page.page_id}::${p.senderId}`)) {
				details.push(`- ${page.page_name ?? page.page_id} → ${p.senderName ?? p.senderId} : IA arrêtée pour ce client`);
				return;
			}
			const lockKey = `${page.page_id}::${p.senderId}`;
			if (inFlightReplies.has(lockKey)) {
				details.push(`- ${p.senderName ?? p.senderId} : réponse déjà en cours`);
				return;
			}
			if (!force && p.lastMessageId && isDuplicateMid(`batch:${p.lastMessageId}`)) return;
			if (await alreadyAnsweredAfter(userId, page.page_id, p.senderId, p.lastMessageTimeMs)) {
				details.push(`- ${p.senderName ?? p.senderId} : déjà répondu`);
				return;
			}
			const convoJob = await claimConversation(page.page_id, p.senderId, force ? 3 : 1, force ? 2500 : 1500);
			if (!convoJob) {
				details.push(`- ${p.senderName ?? p.senderId} : conversation verrouillée, réessayez`);
				return;
			}
			inFlightReplies.add(lockKey);
			try {
				const parts = [];
				if (p.lastText) parts.push({ text: p.lastText });
				if (p.lastAttachmentType === "image" && p.lastAttachmentUrl) {
					const ip = await fetchAsInlinePart(p.lastAttachmentUrl);
					if (ip) parts.push(ip);
				}
				if (parts.length === 0) parts.push({ text: "(message vide)" });
				const history = await fetchMessengerHistoryForReply(page, p.senderId, p.lastText, 24);
				const { text: reply, provider } = await generateAiReply({
					userId,
					systemPrompt,
					history,
					parts,
					allowLinks: true
				});
				const rawReply = reply || "Misaotra tamin'ny hafatrao. Handray anao tsy ho ela izahay.";
				const { cleanText: finalReply } = await processAiActionsForMessenger({
					userId,
					pageId: page.page_id,
					pageToken: page.page_access_token,
					senderId: p.senderId,
					senderName: p.senderName,
					rawReply,
					userMessageText: p.lastText
				});
				if (finalReply && !await alreadyAnsweredAfter(userId, page.page_id, p.senderId, p.lastMessageTimeMs)) await sendMessengerReply(page.page_access_token, p.senderId, finalReply);
				await insertMessageLog([{
					user_id: userId,
					page_id: page.page_id,
					sender_id: p.senderId,
					sender_name: p.senderName,
					content: p.lastText || null,
					direction: INCOMING_DIRECTION,
					status: "received:batch",
					media_type: p.lastAttachmentType,
					media_url: p.lastAttachmentUrl
				}, {
					user_id: userId,
					page_id: page.page_id,
					sender_id: p.senderId,
					sender_name: p.senderName,
					content: finalReply,
					ai_response: finalReply,
					direction: OUTGOING_DIRECTION,
					status: `sent:batch:${provider}`
				}], "batch-success");
				replied++;
				details.push(`✓ ${page.page_name ?? page.page_id} → ${p.senderName ?? p.senderId}`);
			} catch (e) {
				errors++;
				const msg = e instanceof Error ? e.message : String(e);
				console.error("[batch reply]", page.page_id, p.senderId, msg);
				details.push(`✗ ${page.page_name ?? page.page_id} → ${p.senderName ?? p.senderId} : ${msg.slice(0, 160)}`);
				await insertMessageLog({
					user_id: userId,
					page_id: page.page_id,
					sender_id: p.senderId,
					direction: OUTGOING_DIRECTION,
					status: `error:batch:${msg.slice(0, 120)}`
				}, "batch-error");
			} finally {
				inFlightReplies.delete(lockKey);
				await releaseConversation(convoJob);
			}
		};
		const CONCURRENCY = 4;
		for (let i = 0; i < pending.length; i += CONCURRENCY) await Promise.allSettled(pending.slice(i, i + CONCURRENCY).map(processOne));
	}
	return {
		processed,
		replied,
		errors,
		details
	};
}
/** Iterate every connected user's pages: used by the cron job. */
async function replyAllPendingForAllUsers() {
	const { data: pages } = await supabaseAdmin.from("facebook_pages").select("user_id").eq("is_connected", true);
	const userIds = [...new Set((pages ?? []).map((p) => p.user_id).filter(Boolean))].slice(0, 20);
	let processed = 0;
	let replied = 0;
	let errors = 0;
	const runUser = async (uid) => {
		try {
			const { data: settings } = await supabaseAdmin.from("settings").select("auto_reply_messages").eq("user_id", uid).maybeSingle();
			if (!(settings?.auto_reply_messages ?? true)) return;
			const res = await replyAllPendingForUser(uid);
			processed += res.processed;
			replied += res.replied;
			errors += res.errors;
		} catch (e) {
			console.error("[replyAllPendingForAllUsers]", uid, e);
			errors++;
		}
	};
	for (let i = 0; i < userIds.length; i += 3) await Promise.allSettled(userIds.slice(i, i + 3).map(runUser));
	return {
		users: userIds.length,
		processed,
		replied,
		errors
	};
}
/** Scan recent published posts for a user's connected pages and auto-reply to unhandled comments. */
async function scanAndReplyCommentsForUser(userId, opts = {}) {
	const force = opts.force ?? false;
	const details = [];
	let scanned = 0;
	let replied = 0;
	let errors = 0;
	const { data: pages } = await supabaseAdmin.from("facebook_pages").select("*").eq("user_id", userId).eq("is_connected", true);
	if (!pages || pages.length === 0) return {
		scanned,
		replied,
		errors,
		details: ["Aucune page Facebook connectée."]
	};
	for (const page of pages) try {
		const postsUrl = `https://graph.facebook.com/v21.0/${page.page_id}/published_posts?fields=id,message,created_time,comments.limit(25){id,from,message,created_time}&limit=10&access_token=${page.page_access_token}`;
		const res = await fetch(postsUrl);
		if (!res.ok) {
			const t = await res.text();
			errors++;
			const pageName = page.page_name ?? page.page_id;
			details.push(`✗ ${pageName} : Erreur Graph API (${res.status}) ${t.slice(0, 100)}`);
			continue;
		}
		const posts = (await res.json()).data ?? [];
		const todo = [];
		for (const post of posts) for (const c of post.comments?.data ?? []) {
			scanned++;
			if (!c?.id || c.from?.id === page.page_id) continue;
			todo.push({
				post,
				c
			});
		}
		const handleOne = async ({ post, c }) => {
			const commentId = c.id;
			const authorId = c.from?.id;
			try {
				const { data: existing } = await supabaseAdmin.from("comments_log").select("id,replied").eq("comment_id", commentId).maybeSingle();
				if (existing?.replied) return;
				await handleFeedChange(page, {
					item: "comment",
					verb: "add",
					comment_id: commentId,
					post_id: post.id,
					from: c.from ?? {
						id: "",
						name: null
					},
					message: c.message ?? ""
				}, force);
				const { data: updated } = await supabaseAdmin.from("comments_log").select("replied").eq("comment_id", commentId).maybeSingle();
				if (updated?.replied) {
					replied++;
					details.push(`✓ Commentaire de ${c.from?.name ?? authorId} répondu.`);
				} else details.push(`- Commentaire de ${c.from?.name ?? authorId} non répondu.`);
			} catch (e) {
				errors++;
				details.push(`✗ Commentaire ${commentId} : ${e instanceof Error ? e.message.slice(0, 120) : "erreur"}`);
			}
		};
		const CONCURRENCY = 4;
		for (let i = 0; i < todo.length; i += CONCURRENCY) await Promise.allSettled(todo.slice(i, i + CONCURRENCY).map(handleOne));
	} catch (e) {
		errors++;
		const msg = e instanceof Error ? e.message : String(e);
		details.push(`✗ ${page.page_name ?? page.page_id} : ${msg.slice(0, 120)}`);
	}
	return {
		scanned,
		replied,
		errors,
		details
	};
}
/**
* Notify the Messenger client when an order status changes (accepted, refused,
* delivered). Best-effort: never throws to the caller.
*/
async function notifyOrderStatusToClient(userId, orderId, status) {
	try {
		const { data: order } = await supabaseAdmin.from("orders").select("id, page_id, client_fb_id, client_fb_name, quantity, products(name), trainings(name)").eq("id", orderId).eq("user_id", userId).maybeSingle();
		if (!order?.client_fb_id) return {
			sent: false,
			reason: "no_client"
		};
		let pageQuery = supabaseAdmin.from("facebook_pages").select("page_id, page_access_token").eq("user_id", userId).eq("is_connected", true);
		if (order.page_id) pageQuery = pageQuery.eq("page_id", order.page_id);
		const { data: pages } = await pageQuery.limit(1);
		const page = pages?.[0];
		if (!page?.page_access_token) return {
			sent: false,
			reason: "no_page_token"
		};
		const itemName = order.products?.name ?? order.trainings?.name ?? "kaomandy";
		const qty = order.quantity ?? 1;
		let text;
		if (status === "accepted") text = `✅ Salama ${order.client_fb_name || ""}! Voaray sy neken'ny tompon'andraikitra ny kaomandinao : ${itemName}${qty > 1 ? ` (×${qty})` : ""}. Hifandray aminao tsy ho ela izahay ho an'ny fandefasana. Misaotra betsaka! 🙏`;
		else if (status === "delivered") text = `📦 Efa lasa/voatolotra ny kaomandinao : ${itemName}. Misaotra amin'ny fitokisana!`;
		else if (status === "refused") text = `😔 Miala tsiny, tsy afaka nekena ny kaomandinao : ${itemName}. Afaka manontany anay raha mila fanazavana fanampiny.`;
		else return {
			sent: false,
			reason: "status_ignored"
		};
		await sendMessengerReply(page.page_access_token, order.client_fb_id, text);
		return { sent: true };
	} catch (e) {
		console.error("[notifyOrderStatusToClient] error:", e);
		return {
			sent: false,
			reason: "error"
		};
	}
}
//#endregion
export { GEMINI_ROTATION_MODELS, downloadSupabaseStorageFile, fetchAvailableGeminiModels, generateAiReply, notifyOrderStatusToClient, processWebhookEvent, replyAllPendingForAllUsers, replyAllPendingForUser, sanitizeAiResponse, sanitizeReply, scanAndReplyCommentsForUser };
