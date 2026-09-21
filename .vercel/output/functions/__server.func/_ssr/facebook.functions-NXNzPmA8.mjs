import { r as createServerFn, s as getRequestHost$1 } from "./server-BRvJ2kb2.mjs";
import { t as createServerRpc } from "./createServerRpc-CtiMBgU6.mjs";
import { t as requireWorkspaceAuth } from "./workspace-middleware-DCv0kXWS.mjs";
import { a as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/facebook.functions-NXNzPmA8.js
var FB_SCOPES = [
	"pages_messaging",
	"pages_manage_engagement",
	"pages_manage_posts",
	"pages_read_engagement",
	"pages_show_list",
	"pages_read_user_content",
	"pages_manage_metadata",
	"public_profile"
].join(",");
function baseUrl() {
	const host = getRequestHost$1();
	if (!host) return process.env.APP_URL || process.env.PUBLIC_URL || "https://ais-dev-bqp7a7twhf5wtekadnjhfa-146955802313.europe-west2.run.app";
	return `${host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https"}://${host}`;
}
var getFacebookLoginUrl_createServerFn_handler = createServerRpc({
	id: "f2f261a9018114c20819bed7223868573b1844bca6dec0694d67ff45108c4484",
	name: "getFacebookLoginUrl",
	filename: "src/lib/facebook.functions.ts"
}, (opts) => getFacebookLoginUrl.__executeServer(opts));
var getFacebookLoginUrl = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(getFacebookLoginUrl_createServerFn_handler, async ({ context }) => {
	const { resolveFacebookApp } = await import("./facebook-app.server-CkqC02Ux.mjs");
	const app = await resolveFacebookApp(context.userId);
	if (!app.appId || !app.appSecret) throw new Error("Mbola tsy voaomana ny Facebook App foibe. Ny tompon'ny kaonty foibe ihany no mampiditra ny App ID sy App Secret indray mandeha ao amin'ny Paramètres.");
	const redirect = `${baseUrl()}/api/public/fb/callback`;
	const state = `${context.userId}.${crypto.randomUUID()}.${app.appId}`;
	const url = new URL("https://www.facebook.com/v21.0/dialog/oauth");
	url.searchParams.set("client_id", app.appId);
	url.searchParams.set("redirect_uri", redirect);
	url.searchParams.set("state", state);
	url.searchParams.set("scope", FB_SCOPES);
	url.searchParams.set("auth_type", "rerequest");
	url.searchParams.set("response_type", "code");
	return {
		url: url.toString(),
		redirect_uri: redirect
	};
});
var getFacebookAppStatus_createServerFn_handler = createServerRpc({
	id: "9799f0b09a19e6992f33a37c049e6a3d7a222b6a60dec8fbce4a1f064e1d1c04",
	name: "getFacebookAppStatus",
	filename: "src/lib/facebook.functions.ts"
}, (opts) => getFacebookAppStatus.__executeServer(opts));
var getFacebookAppStatus = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(getFacebookAppStatus_createServerFn_handler, async ({ context }) => {
	const { resolveFacebookApp } = await import("./facebook-app.server-CkqC02Ux.mjs");
	const app = await resolveFacebookApp(context.userId);
	const isOwner = !app.ownerUserId || context.authUserId === app.ownerUserId || context.userId === app.ownerUserId;
	return {
		configured: !!(app.appId && app.appSecret),
		central: app.central,
		/** true raha ity mpampiasa ity no tompon'ny kaonty / workspace */
		is_central_account: isOwner,
		app_id_preview: app.appId ? `${app.appId.slice(0, 6)}…${app.appId.slice(-4)}` : "",
		app_id: app.appId
	};
});
var getWebhookConfig_createServerFn_handler = createServerRpc({
	id: "e2747fa41361a15b2a26fb26a682fedb2197229f300f56e975795e2c0286b8a5",
	name: "getWebhookConfig",
	filename: "src/lib/facebook.functions.ts"
}, (opts) => getWebhookConfig.__executeServer(opts));
var getWebhookConfig = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(getWebhookConfig_createServerFn_handler, async ({ context }) => {
	const { resolveFacebookApp, ensureCentralVerifyToken } = await import("./facebook-app.server-CkqC02Ux.mjs");
	const app = await resolveFacebookApp(context.userId);
	const token = await ensureCentralVerifyToken(app.ownerUserId, app.verifyToken);
	return {
		callback_url: `${baseUrl()}/api/public/fb/webhook`,
		oauth_redirect_uri: `${baseUrl()}/api/public/fb/callback`,
		verify_token: token
	};
});
var triggerCommentScan_createServerFn_handler = createServerRpc({
	id: "1f4390765d2ca0690b15086abfa82fe927a505b9ae404d08adf9e9291beeeab1",
	name: "triggerCommentScan",
	filename: "src/lib/facebook.functions.ts"
}, (opts) => triggerCommentScan.__executeServer(opts));
var triggerCommentScan = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({}).parse(d ?? {})).handler(triggerCommentScan_createServerFn_handler, async ({ context }) => {
	const { scanAndReplyCommentsForUser } = await import("./ai-engine.server-CzVx6OLP.mjs");
	const res = await scanAndReplyCommentsForUser(context.userId, { force: true });
	return {
		ok: true,
		scanned: res.scanned,
		replied: res.replied,
		errors: res.errors,
		details: res.details,
		note: res.details.length ? res.details.join("\n") : `${res.replied} commentaire(s) répondu(s) sur ${res.scanned} scanné(s).`
	};
});
//#endregion
export { getFacebookAppStatus_createServerFn_handler, getFacebookLoginUrl_createServerFn_handler, getWebhookConfig_createServerFn_handler, triggerCommentScan_createServerFn_handler };
