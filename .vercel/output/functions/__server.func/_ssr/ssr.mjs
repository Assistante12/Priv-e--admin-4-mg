import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import fs from "node:fs";
import path from "node:path";
//#region node_modules/.nitro/vite/services/ssr/index.js
var lastCapturedError;
var TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => record(event.reason));
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
var account_keys_server_exports = /* @__PURE__ */ __exportAll({
	applyKeysToEnv: () => applyKeysToEnv,
	getAccountCustomKeys: () => getAccountCustomKeys,
	initAccountKeys: () => initAccountKeys,
	saveAccountCustomKeys: () => saveAccountCustomKeys
});
var DATA_DIR = path.join(process.cwd(), "data");
var STORE_PATH = path.join(DATA_DIR, "account-keys.json");
function readStore() {
	try {
		if (!fs.existsSync(STORE_PATH)) return {
			global: {},
			accounts: {}
		};
		const raw = fs.readFileSync(STORE_PATH, "utf-8");
		const parsed = JSON.parse(raw);
		return {
			global: parsed.global || {},
			accounts: parsed.accounts || {}
		};
	} catch (e) {
		console.warn("[AccountKeys] Failed to read store file:", e);
		return {
			global: {},
			accounts: {}
		};
	}
}
function writeStore(store) {
	try {
		if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
		fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
	} catch (e) {
		console.warn("[AccountKeys] Failed to write store file:", e);
	}
}
/**
* Apply keys into process.env so third-party SDKs and client factories
* can read them dynamically without container restarts.
*/
function applyKeysToEnv(keys) {
	if (keys.supabase_project_url) {
		process.env["SUPABASE_URL"] = keys.supabase_project_url;
		process.env["VITE_SUPABASE_URL"] = keys.supabase_project_url;
	}
	if (keys.supabase_anon_key) {
		process.env["SUPABASE_PUBLISHABLE_KEY"] = keys.supabase_anon_key;
		process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] = keys.supabase_anon_key;
	}
	if (keys.supabase_service_role_key) process.env["SUPABASE_SERVICE_ROLE_KEY"] = keys.supabase_service_role_key;
	if (keys.supabase_project_id) {
		process.env["SUPABASE_PROJECT_ID"] = keys.supabase_project_id;
		process.env["VITE_SUPABASE_PROJECT_ID"] = keys.supabase_project_id;
	}
	if (keys.lovable_api_key) process.env["LOVABLE_API_KEY"] = keys.lovable_api_key;
	if (keys.gemini_api_key) process.env["GEMINI_API_KEY"] = keys.gemini_api_key;
	if (keys.facebook_app_id) process.env["FACEBOOK_APP_ID"] = keys.facebook_app_id;
	if (keys.facebook_app_secret) process.env["FACEBOOK_APP_SECRET"] = keys.facebook_app_secret;
	if (keys.facebook_verify_token) process.env["FACEBOOK_VERIFY_TOKEN"] = keys.facebook_verify_token;
}
/**
* Bootstraps stored keys into process.env at server startup.
*/
function initAccountKeys() {
	const store = readStore();
	applyKeysToEnv(store.global);
	let updated = false;
	const envFbId = process.env["FACEBOOK_APP_ID"];
	const envFbSecret = process.env["FACEBOOK_APP_SECRET"];
	const envFbToken = process.env["FACEBOOK_VERIFY_TOKEN"];
	const envLovable = process.env["LOVABLE_API_KEY"];
	const envSbUrl = process.env["SUPABASE_URL"];
	const envSbAnon = process.env["SUPABASE_PUBLISHABLE_KEY"];
	const envSbService = process.env["SUPABASE_SERVICE_ROLE_KEY"];
	const envSbProj = process.env["SUPABASE_PROJECT_ID"];
	if (!store.global.facebook_app_id && envFbId) {
		store.global.facebook_app_id = envFbId;
		updated = true;
	}
	if (!store.global.facebook_app_secret && envFbSecret) {
		store.global.facebook_app_secret = envFbSecret;
		updated = true;
	}
	if (!store.global.facebook_verify_token && envFbToken) {
		store.global.facebook_verify_token = envFbToken;
		updated = true;
	}
	if (!store.global.lovable_api_key && envLovable) {
		store.global.lovable_api_key = envLovable;
		updated = true;
	}
	if (!store.global.supabase_project_url && envSbUrl) {
		store.global.supabase_project_url = envSbUrl;
		updated = true;
	}
	if (!store.global.supabase_anon_key && envSbAnon) {
		store.global.supabase_anon_key = envSbAnon;
		updated = true;
	}
	if (!store.global.supabase_service_role_key && envSbService) {
		store.global.supabase_service_role_key = envSbService;
		updated = true;
	}
	if (!store.global.supabase_project_id && envSbProj) {
		store.global.supabase_project_id = envSbProj;
		updated = true;
	}
	if (updated) writeStore(store);
}
initAccountKeys();
/**
* Retrieve custom keys for a given user or workspace scope.
*/
function getAccountCustomKeys(userId) {
	const store = readStore();
	const accountKeys = userId ? store.accounts[userId] || {} : {};
	const global = store.global || {};
	return {
		facebook_app_id: accountKeys.facebook_app_id || global.facebook_app_id || process.env["FACEBOOK_APP_ID"] || null,
		facebook_app_secret: accountKeys.facebook_app_secret || global.facebook_app_secret || process.env["FACEBOOK_APP_SECRET"] || null,
		facebook_verify_token: accountKeys.facebook_verify_token || global.facebook_verify_token || process.env["FACEBOOK_VERIFY_TOKEN"] || null,
		gemini_api_key: accountKeys.gemini_api_key || global.gemini_api_key || process.env["GEMINI_API_KEY"] || null,
		lovable_api_key: accountKeys.lovable_api_key || global.lovable_api_key || process.env["LOVABLE_API_KEY"] || null,
		supabase_project_url: accountKeys.supabase_project_url || global.supabase_project_url || process.env["SUPABASE_URL"] || null,
		supabase_anon_key: accountKeys.supabase_anon_key || global.supabase_anon_key || process.env["SUPABASE_PUBLISHABLE_KEY"] || null,
		supabase_service_role_key: accountKeys.supabase_service_role_key || global.supabase_service_role_key || process.env["SUPABASE_SERVICE_ROLE_KEY"] || null,
		supabase_project_id: accountKeys.supabase_project_id || global.supabase_project_id || process.env["SUPABASE_PROJECT_ID"] || null
	};
}
/**
* Save keys entered manually by a user for their account / workspace.
*/
async function saveAccountCustomKeys(userId, newKeys) {
	const store = readStore();
	const current = store.accounts[userId] || {};
	const clean = (val) => {
		if (typeof val === "string") {
			const t = val.trim();
			return t.length > 0 ? t : null;
		}
		return val === null ? null : void 0;
	};
	const updatedAccount = {
		...current,
		...clean(newKeys.facebook_app_id) !== void 0 ? { facebook_app_id: clean(newKeys.facebook_app_id) } : {},
		...clean(newKeys.facebook_app_secret) !== void 0 ? { facebook_app_secret: clean(newKeys.facebook_app_secret) } : {},
		...clean(newKeys.facebook_verify_token) !== void 0 ? { facebook_verify_token: clean(newKeys.facebook_verify_token) } : {},
		...clean(newKeys.gemini_api_key) !== void 0 ? { gemini_api_key: clean(newKeys.gemini_api_key) } : {},
		...clean(newKeys.lovable_api_key) !== void 0 ? { lovable_api_key: clean(newKeys.lovable_api_key) } : {},
		...clean(newKeys.supabase_project_url) !== void 0 ? { supabase_project_url: clean(newKeys.supabase_project_url) } : {},
		...clean(newKeys.supabase_anon_key) !== void 0 ? { supabase_anon_key: clean(newKeys.supabase_anon_key) } : {},
		...clean(newKeys.supabase_service_role_key) !== void 0 ? { supabase_service_role_key: clean(newKeys.supabase_service_role_key) } : {},
		...clean(newKeys.supabase_project_id) !== void 0 ? { supabase_project_id: clean(newKeys.supabase_project_id) } : {}
	};
	store.accounts[userId] = updatedAccount;
	for (const [k, v] of Object.entries(updatedAccount)) {
		const key = k;
		if (v && !store.global[key]) store.global[key] = v;
	}
	writeStore(store);
	applyKeysToEnv(updatedAccount);
	return getAccountCustomKeys(userId);
}
function renderErrorPage() {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-PdCEgQXm.mjs").then((n) => n.t).then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!isH3SwallowedErrorBody(body)) return response;
	console.error(consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`));
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
function isH3SwallowedErrorBody(body) {
	try {
		const payload = JSON.parse(body);
		return payload.unhandled === true && payload.message === "HTTPError";
	} catch {
		return false;
	}
}
var server_default = { async fetch(request, env, ctx) {
	try {
		return await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx));
	} catch (error) {
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} };
//#endregion
export { server_default as default, getAccountCustomKeys as n, account_keys_server_exports as t };
