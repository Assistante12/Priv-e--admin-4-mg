import { r as createServerFn } from "./server-D9pwzi9_.mjs";
import { t as createServerRpc } from "./createServerRpc-DxF-NOaI.mjs";
import { n as getAccountCustomKeys } from "./ssr.mjs";
import { GEMINI_ROTATION_MODELS } from "./ai-engine.server-BUx7MuRD.mjs";
import { t as requireWorkspaceAuth } from "./workspace-middleware-CoslEc7v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-health.functions-CouNDUuS.js
/**
* Surveillance des quotas et de l'état du Moteur Multi-Modèles Gemini (> 5 modèles).
* Utilisé par les paramètres pour assurer la surveillance de la rotation.
*/
var GEMINI_ACTIVE_THRESHOLD = 1;
var getAiQuotaHealth_createServerFn_handler = createServerRpc({
	id: "e9c551c5997021134409eb261e33aedfa05172b0edcea8974945a04fa951f6f7",
	name: "getAiQuotaHealth",
	filename: "src/lib/ai-health.functions.ts"
}, (opts) => getAiQuotaHealth.__executeServer(opts));
var getAiQuotaHealth = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(getAiQuotaHealth_createServerFn_handler, async ({ context }) => {
	const customKeys = getAccountCustomKeys(context.userId);
	const hasCustomKey = Boolean(customKeys.gemini_api_key && customKeys.gemini_api_key.trim().length > 0);
	const { data: keys } = await context.supabase.from("gemini_keys").select("id, label, error_count, disabled_until, is_active, last_used_at").eq("user_id", context.userId);
	const now = Date.now();
	const enabled = (keys ?? []).filter((k) => k.is_active !== false);
	const ready = enabled.filter((k) => !k.disabled_until || new Date(k.disabled_until).getTime() <= now);
	const paused = enabled.length - ready.length;
	const totalOperationalKeys = ready.length + (hasCustomKey ? 1 : 0) + (process.env.GEMINI_API_KEY ? 1 : 0);
	let geminiStatus = "ok";
	if (totalOperationalKeys === 0) geminiStatus = "exhausted";
	else if (totalOperationalKeys <= GEMINI_ACTIVE_THRESHOLD) geminiStatus = "low";
	const lovable = {
		status: "ok",
		detail: `Moteur Gemini Multi-Modèles actif (${GEMINI_ROTATION_MODELS.length} modèles en rotation)`
	};
	let backupKeyLabel = null;
	if (hasCustomKey) backupKeyLabel = "Clé personnalisée du compte";
	else {
		const backup = ready.slice().sort((a, b) => (a.error_count ?? 0) - (b.error_count ?? 0) || new Date(a.last_used_at ?? 0).getTime() - new Date(b.last_used_at ?? 0).getTime())[0] ?? null;
		if (backup) backupKeyLabel = backup.label || "Clé DB";
		else if (process.env.GEMINI_API_KEY) backupKeyLabel = "Clé système Gemini";
	}
	let alertMessage = null;
	let suggestion = null;
	if (totalOperationalKeys === 0) {
		alertMessage = "Aucune clé Gemini active : le moteur multi-modèles ne peut pas répondre.";
		suggestion = "Saisissez votre clé Gemini dans les options paramètres pour activer la rotation.";
	} else if (geminiStatus === "low") {
		alertMessage = `1 seule clé Gemini active pour alimenter les ${GEMINI_ROTATION_MODELS.length} modèles en rotation.`;
		suggestion = "Vous pouvez ajouter une clé de secours supplémentaire pour garantir une disponibilité maximale.";
	}
	return {
		lovable,
		gemini: {
			total: enabled.length + (hasCustomKey ? 1 : 0),
			active: ready.length + (hasCustomKey ? 1 : 0),
			paused,
			status: geminiStatus,
			hasCustomKey,
			modelsInRotation: GEMINI_ROTATION_MODELS.length,
			modelsList: GEMINI_ROTATION_MODELS
		},
		threshold: GEMINI_ACTIVE_THRESHOLD,
		alert: alertMessage !== null,
		alertMessage,
		suggestion,
		backupKeyLabel,
		checkedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
});
//#endregion
export { getAiQuotaHealth_createServerFn_handler };
