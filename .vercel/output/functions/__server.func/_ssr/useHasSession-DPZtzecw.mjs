import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { r as createServerFn } from "./server-PdCEgQXm.mjs";
import { a as getApp, o as getApps, s as initializeApp } from "../_libs/@firebase/app+[...].mjs";
import "../_libs/firebase.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BNEF6n4w.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BxRoGsb6.mjs";
import { a as objectType, n as booleanType, o as stringType } from "../_libs/zod.mjs";
import { t as supabase } from "./client-BUDkwau_.mjs";
import { i as onMessage, n as getToken, r as isWindowSupported, t as getMessagingInWindow } from "../_libs/firebase__messaging.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useHasSession-DPZtzecw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var appId = {
	"BASE_URL": "/",
	"DEV": true,
	"MODE": "production",
	"PROD": false,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_APP_ID": "1:968036045846:web:d0be8f8804be6a42e71137",
	"VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_PROJECT_ID": "inscription-22047",
	"VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_VAPID_KEY": "BGduAC5saLzgFtOiyVFadtn55e6NoobQBL8OAbwXd6NL47zXuMb-jP1WFOhZr8aF6jZiRXZYFrVO-M2hdYigbjU",
	"VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_WEB_API_KEY": "AIzaSyDC9NUvMPL_kJNjyM8dCc07wc2QQYVTuXA"
}["VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_APP_ID"];
var vapidKey = {
	"BASE_URL": "/",
	"DEV": true,
	"MODE": "production",
	"PROD": false,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_APP_ID": "1:968036045846:web:d0be8f8804be6a42e71137",
	"VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_PROJECT_ID": "inscription-22047",
	"VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_VAPID_KEY": "BGduAC5saLzgFtOiyVFadtn55e6NoobQBL8OAbwXd6NL47zXuMb-jP1WFOhZr8aF6jZiRXZYFrVO-M2hdYigbjU",
	"VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_WEB_API_KEY": "AIzaSyDC9NUvMPL_kJNjyM8dCc07wc2QQYVTuXA"
}["VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_VAPID_KEY"];
var firebaseConfig = {
	apiKey: {
		"BASE_URL": "/",
		"DEV": true,
		"MODE": "production",
		"PROD": false,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_APP_ID": "1:968036045846:web:d0be8f8804be6a42e71137",
		"VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_PROJECT_ID": "inscription-22047",
		"VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_VAPID_KEY": "BGduAC5saLzgFtOiyVFadtn55e6NoobQBL8OAbwXd6NL47zXuMb-jP1WFOhZr8aF6jZiRXZYFrVO-M2hdYigbjU",
		"VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_WEB_API_KEY": "AIzaSyDC9NUvMPL_kJNjyM8dCc07wc2QQYVTuXA"
	}["VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_WEB_API_KEY"],
	projectId: {
		"BASE_URL": "/",
		"DEV": true,
		"MODE": "production",
		"PROD": false,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_APP_ID": "1:968036045846:web:d0be8f8804be6a42e71137",
		"VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_PROJECT_ID": "inscription-22047",
		"VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_VAPID_KEY": "BGduAC5saLzgFtOiyVFadtn55e6NoobQBL8OAbwXd6NL47zXuMb-jP1WFOhZr8aF6jZiRXZYFrVO-M2hdYigbjU",
		"VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_WEB_API_KEY": "AIzaSyDC9NUvMPL_kJNjyM8dCc07wc2QQYVTuXA"
	}["VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_PROJECT_ID"],
	appId,
	messagingSenderId: appId?.split(":")[1] ?? ""
};
var PUSH_APP_NAME = "assistante-virtuelle-push";
/** À appeler depuis un clic utilisateur (les navigateurs exigent un geste). */
async function enablePush() {
	if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !appId || !vapidKey || !firebaseConfig.messagingSenderId) return { status: "not-configured" };
	if (typeof window === "undefined" || !("Notification" in window) || !await isWindowSupported()) return { status: "unsupported" };
	if (window.top !== window.self) return { status: "open-in-new-tab" };
	if ((Notification.permission === "granted" ? "granted" : await Notification.requestPermission()) !== "granted") return { status: "denied" };
	const query = new URLSearchParams(firebaseConfig).toString();
	const registration = await navigator.serviceWorker.register(`/firebase-messaging-sw.js?${query}`);
	const app = getApps().find((a) => a.name === PUSH_APP_NAME) ?? initializeApp(firebaseConfig, PUSH_APP_NAME);
	const messaging = getMessagingInWindow(app);
	const token = await getToken(messaging, {
		vapidKey,
		serviceWorkerRegistration: registration
	});
	return token ? {
		status: "registered",
		token
	} : { status: "denied" };
}
/** Affiche les notifications reçues quand l'onglet est ouvert. */
async function listenForegroundPush() {
	if (typeof window === "undefined" || !await isWindowSupported()) return;
	const app = getApps().find((a) => a.name === PUSH_APP_NAME) ?? getApp();
	onMessage(getMessagingInWindow(app), (payload) => {
		const title = payload.notification?.title ?? "Assistante Virtuelle";
		const body = payload.notification?.body ?? "";
		if (Notification.permission === "granted") new Notification(title, {
			body,
			icon: "/notification-logo.png"
		});
	});
}
/** Écoute les notifications reçues app ouverte, sans créer de doublon système. */
async function subscribeForegroundPush(cb) {
	if (typeof window === "undefined" || !await isWindowSupported()) return () => {};
	if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !appId) return () => {};
	const app = getApps().find((a) => a.name === PUSH_APP_NAME) ?? initializeApp(firebaseConfig, PUSH_APP_NAME);
	return onMessage(getMessagingInWindow(app), (payload) => {
		cb({
			title: payload.notification?.title ?? "Assistante Virtuelle",
			body: payload.notification?.body ?? "",
			link: payload.data?.["link"]
		});
	});
}
/** Statut actuel côté navigateur, sans demander d'autorisation. */
function pushPermissionStatus() {
	if (typeof window === "undefined" || !("Notification" in window)) return "unavailable";
	return Notification.permission;
}
var getPushState = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("683af635b16340adf571c0ca2f7a6bfacf490bf231cf9e4b78df7c3ad9355fbe"));
var savePushToken = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	token: stringType().min(20).max(4e3),
	user_agent: stringType().max(300).optional()
}).parse(d)).handler(createSsrRpc("281f8d7a4a4a30294e6b39063c1a7ccc795c3c154f3ea64df4010cec4c7d0a07"));
var setAutoAiPush = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ enabled: booleanType() }).parse(d)).handler(createSsrRpc("c09f0318d87fcdc7fd0e3c75e13bd71e9885a312708ec77cee06f0ab9a895a7f"));
var removePushDevice = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("730ed6e4e7255918c116c7b35ee9bf18148348ef1ca23464d0e2621431b05eba"));
var sendTestPush = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("f58b21b44b8a2a06145fee076324bf6c4b16dc1ba81aa78a98b43fae6cea4152"));
/**
* Retourne true seulement quand une session Supabase est disponible côté client.
* Évite d'appeler les server functions protégées sans jeton (401).
*/
function useHasSession() {
	const [hasSession, setHasSession] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let active = true;
		supabase.auth.getSession().then(({ data }) => {
			if (active) setHasSession(Boolean(data.session));
		});
		const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
			setHasSession(Boolean(session));
		});
		return () => {
			active = false;
			sub.subscription.unsubscribe();
		};
	}, []);
	return hasSession;
}
//#endregion
export { removePushDevice as a, setAutoAiPush as c, pushPermissionStatus as i, subscribeForegroundPush as l, getPushState as n, savePushToken as o, listenForegroundPush as r, sendTestPush as s, enablePush as t, useHasSession as u };
