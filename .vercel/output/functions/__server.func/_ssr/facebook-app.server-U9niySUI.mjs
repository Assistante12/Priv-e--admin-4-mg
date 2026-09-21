//#region node_modules/.nitro/vite/services/ssr/assets/facebook-app.server-U9niySUI.js
async function resolveFacebookApp(scope) {
	const { supabaseAdmin } = await import("./client.server-1p3pFob5.mjs").then((n) => n.t).then((n) => n.t);
	let ownerUserId = scope;
	try {
		const { data: ws } = await supabaseAdmin.from("workspaces").select("owner_user_id").eq("id", scope).maybeSingle();
		if (ws?.owner_user_id) ownerUserId = ws.owner_user_id;
	} catch (err) {
		console.warn("[FacebookApp] Error querying workspace owner:", err);
	}
	const ids = Array.from(new Set([ownerUserId, scope].filter(Boolean)));
	let rows = [];
	try {
		const { data } = await supabaseAdmin.from("settings").select("user_id,facebook_app_id,facebook_app_secret,facebook_verify_token").in("user_id", ids);
		if (data) rows = data;
	} catch (err) {
		console.warn("[FacebookApp] Error querying scoped settings:", err);
	}
	const { getAccountCustomKeys } = await import("./ssr.mjs").then((n) => n.t);
	const accountCustom = getAccountCustomKeys(scope);
	const central = rows.find((r) => r.user_id === ownerUserId);
	const own = rows.find((r) => r.user_id === scope);
	const envId = (process.env["FACEBOOK_APP_ID"] ?? "").trim();
	const envSecret = (process.env["FACEBOOK_APP_SECRET"] ?? "").trim();
	const envToken = (process.env["FACEBOOK_VERIFY_TOKEN"] ?? "").trim();
	let centralId = central?.facebook_app_id?.trim() ?? "";
	let centralSecret = central?.facebook_app_secret?.trim() ?? "";
	let appId = own?.facebook_app_id?.trim() || accountCustom.facebook_app_id?.trim() || centralId || envId || "";
	let appSecret = own?.facebook_app_secret?.trim() || accountCustom.facebook_app_secret?.trim() || centralSecret || envSecret || "";
	let verifyToken = own?.facebook_verify_token?.trim() || accountCustom.facebook_verify_token?.trim() || central?.facebook_verify_token?.trim() || envToken || "";
	if (!appId || !appSecret) try {
		if (ownerUserId) {
			const { data: ownerWs } = await supabaseAdmin.from("workspaces").select("id").eq("owner_user_id", ownerUserId);
			if (ownerWs && ownerWs.length > 0) {
				const wsIds = ownerWs.map((w) => w.id);
				const { data: wsSettings } = await supabaseAdmin.from("settings").select("user_id,facebook_app_id,facebook_app_secret,facebook_verify_token").in("user_id", wsIds).not("facebook_app_id", "is", null).not("facebook_app_secret", "is", null);
				const found = (wsSettings ?? []).find((s) => s.facebook_app_id?.trim() && s.facebook_app_secret?.trim());
				if (found) {
					if (!appId) appId = found.facebook_app_id.trim();
					if (!appSecret) appSecret = found.facebook_app_secret.trim();
					if (!verifyToken && found.facebook_verify_token) verifyToken = found.facebook_verify_token.trim();
				}
			}
		}
	} catch (err) {
		console.warn("[FacebookApp] Error querying owner workspaces settings:", err);
	}
	if (!appId || !appSecret) try {
		const { data: anySettings } = await supabaseAdmin.from("settings").select("user_id,facebook_app_id,facebook_app_secret,facebook_verify_token").not("facebook_app_id", "is", null).not("facebook_app_secret", "is", null).neq("facebook_app_id", "").neq("facebook_app_secret", "").limit(1).maybeSingle();
		if (anySettings?.facebook_app_id && anySettings?.facebook_app_secret) {
			if (!appId) appId = anySettings.facebook_app_id.trim();
			if (!appSecret) appSecret = anySettings.facebook_app_secret.trim();
			if (!verifyToken && anySettings.facebook_verify_token) verifyToken = anySettings.facebook_verify_token.trim();
			if (ownerUserId === scope && anySettings.user_id) ownerUserId = anySettings.user_id;
		}
	} catch (err) {
		console.warn("[FacebookApp] Error querying fallback settings:", err);
	}
	if (!verifyToken && envToken) verifyToken = envToken;
	if (appId && appSecret && ownerUserId && (!centralId || !centralSecret)) try {
		await supabaseAdmin.from("settings").upsert({
			user_id: ownerUserId,
			facebook_app_id: appId,
			facebook_app_secret: appSecret,
			...verifyToken ? { facebook_verify_token: verifyToken } : {}
		}, { onConflict: "user_id" });
	} catch (e) {
		console.warn("[FacebookApp] Auto-backfill central settings failed:", e);
	}
	return {
		appId,
		appSecret,
		verifyToken,
		ownerUserId,
		central: !!(appId && appSecret)
	};
}
/** Mamorona sy mitahiry verify token ao amin'ny compte général raha mbola tsy misy. */
async function ensureCentralVerifyToken(ownerUserId, existing) {
	if (existing) return existing;
	const token = `vt_${crypto.randomUUID().replace(/-/g, "")}`;
	const { supabaseAdmin } = await import("./client.server-1p3pFob5.mjs").then((n) => n.t).then((n) => n.t);
	await supabaseAdmin.from("settings").upsert({
		user_id: ownerUserId,
		facebook_verify_token: token
	}, { onConflict: "user_id" });
	return token;
}
//#endregion
export { ensureCentralVerifyToken, resolveFacebookApp };
