import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { r as createServerFn } from "./server-BRvJ2kb2.mjs";
import { t as requireWorkspaceAuth } from "./workspace-middleware-DCv0kXWS.mjs";
import { t as createSsrRpc } from "./createSsrRpc-6Bh1AQeg.mjs";
import { i as useQuery, n as queryOptions, o as useQueryClient, r as useSuspenseQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { E as MessageSquare, F as KeyRound, G as Database, H as Eye, N as LifeBuoy, O as MessageCircle, U as EyeOff, V as Facebook, W as ExternalLink, Y as CircleCheck, _ as Save, c as TriangleAlert, d as Sparkles, h as Send, j as LoaderCircle, l as Trash2, nt as Bell, p as ShieldCheck, q as Copy, rt as BellRing, t as Zap, y as RefreshCw } from "../_libs/lucide-react.mjs";
import { D as replyAllPendingMessages, M as updateSettings, b as getFacebookAppStatus, k as scanAndReplyCommentsNow, n as settingsQuery, r as supabaseStatusQuery } from "./router-Bhc7uvGy.mjs";
import { t as Card } from "./card-CWKLgPMR.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { t as Switch } from "./switch-Bij46GIi.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2jkrRSx7.mjs";
import { a as removePushDevice, c as setAutoAiPush, n as getPushState, o as savePushToken, r as listenForegroundPush, s as sendTestPush, t as enablePush, u as useHasSession } from "./useHasSession-C12k1JOv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CT7JmFj7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
/**
* Surveillance des quotas et de l'état du Moteur Multi-Modèles Gemini (> 5 modèles).
* Utilisé par les paramètres pour assurer la surveillance de la rotation.
*/
var getAiQuotaHealth = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(createSsrRpc("e9c551c5997021134409eb261e33aedfa05172b0edcea8974945a04fa951f6f7"));
var _jsxFileName$1 = "/app/applet/src/components/PushNotificationsCard.tsx";
var WHATSAPP_LINK = "https://wa.me/261323911654?text=" + encodeURIComponent("Bonjour, je souhaite installer l'Assistante Virtuelle (IA) sur ma page Facebook et WhatsApp.");
function PushNotificationsCard() {
	const qc = useQueryClient();
	const [activating, setActivating] = (0, import_react.useState)(false);
	const hasSession = useHasSession();
	const state = useQuery({
		queryKey: ["push-state"],
		queryFn: () => getPushState(),
		staleTime: 15e3,
		enabled: hasSession,
		retry: false
	});
	(0, import_react.useEffect)(() => {
		listenForegroundPush().catch(() => {});
	}, []);
	const autoMutation = useMutation({
		mutationFn: (enabled) => setAutoAiPush({ data: { enabled } }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["push-state"] });
			toast.success("Préférence enregistrée");
		},
		onError: (e) => toast.error(e.message)
	});
	const removeMutation = useMutation({
		mutationFn: (id) => removePushDevice({ data: { id } }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["push-state"] });
			toast.success("Appareil retiré");
		},
		onError: (e) => toast.error(e.message)
	});
	const testMutation = useMutation({
		mutationFn: () => sendTestPush(),
		onSuccess: (r) => toast.success(`Notification test envoyée (${r.sent} appareil(s))`),
		onError: (e) => toast.error(e.message)
	});
	async function activate() {
		setActivating(true);
		try {
			const res = await enablePush();
			if (res.status === "registered") {
				await savePushToken({ data: {
					token: res.token,
					user_agent: navigator.userAgent
				} });
				qc.invalidateQueries({ queryKey: ["push-state"] });
				toast.success("Notifications activées sur cet appareil");
			} else if (res.status === "open-in-new-tab") toast.error("Ouvrez l'application dans un onglet séparé pour autoriser les notifications.");
			else if (res.status === "denied") toast.error("Autorisation refusée. Activez les notifications dans votre navigateur.");
			else if (res.status === "unsupported") toast.error("Ce navigateur ne prend pas en charge les notifications push.");
			else toast.error("Notifications non configurées.");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur d'activation");
		} finally {
			setActivating(false);
		}
	}
	const devices = state.data?.devices ?? [];
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
		className: "glass p-6 space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
					src: "/notification-logo.png",
					alt: "Logo Assistante Virtuelle",
					loading: "lazy",
					width: 40,
					height: 40,
					className: "h-10 w-10 rounded-xl"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 96,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "text-lg font-semibold",
					children: "Notifications push"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 105,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs text-muted-foreground",
					children: "Alertes dans la barre de notification, avec le logo Assistante Virtuelle."
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 106,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 104,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 95,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-wrap gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						onClick: activate,
						disabled: activating,
						children: [activating ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 115,
							columnNumber: 13
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BellRing, { className: "h-4 w-4 mr-2" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 117,
							columnNumber: 13
						}, this), "Activer sur cet appareil"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 113,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "secondary",
						onClick: () => testMutation.mutate(),
						disabled: testMutation.isPending || devices.length === 0,
						children: [testMutation.isPending ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 127,
							columnNumber: 13
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bell, { className: "h-4 w-4 mr-2" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 129,
							columnNumber: 13
						}, this), "Envoyer un test IA"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 121,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
							href: WHATSAPP_LINK,
							target: "_blank",
							rel: "noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageCircle, { className: "h-4 w-4 mr-2 text-emerald-500" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 135,
								columnNumber: 13
							}, this), "Discuter sur WhatsApp"]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 134,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 133,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 112,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center justify-between gap-4 rounded-xl border p-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
					className: "text-sm font-medium",
					children: "Notifications automatiques générées par l'IA"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 143,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs text-muted-foreground",
					children: "Deux envois par jour : 13h et 20h (heure de Madagascar). Offre d'installation de l'IA sur Facebook et WhatsApp à 5 000 Ar, payable après configuration, avec bouton WhatsApp direct."
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 144,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 142,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Switch, {
					checked: state.data?.autoAiEnabled ?? true,
					onCheckedChange: (v) => autoMutation.mutate(v),
					disabled: autoMutation.isPending || state.isLoading
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 149,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 141,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs font-medium text-muted-foreground",
					children: [
						"Appareils enregistrés (",
						devices.length,
						")"
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 157,
					columnNumber: 9
				}, this), devices.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs text-muted-foreground",
					children: "Aucun appareil pour l'instant."
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 161,
					columnNumber: 11
				}, this) : devices.map((d) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between gap-3 rounded-lg border px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-xs truncate",
						children: d.user_agent ?? d.token_preview
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 168,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						size: "icon",
						variant: "ghost",
						onClick: () => removeMutation.mutate(d.id),
						"aria-label": "Retirer l'appareil",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-4 w-4 text-destructive" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 175,
							columnNumber: 17
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 169,
						columnNumber: 15
					}, this)]
				}, d.id, true, {
					fileName: _jsxFileName$1,
					lineNumber: 164,
					columnNumber: 13
				}, this))]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 156,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 94,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/_authenticated/settings.tsx?tsr-split=component";
var aiHealthQuery = queryOptions({
	queryKey: ["ai-quota-health"],
	queryFn: async () => {
		try {
			return await getAiQuotaHealth();
		} catch (e) {
			console.warn("AI health query error", e);
			return null;
		}
	},
	refetchInterval: 6e4,
	staleTime: 3e4
});
function SettingsPage() {
	const { data } = useSuspenseQuery(settingsQuery);
	const { data: sbStatusRaw } = useSuspenseQuery(supabaseStatusQuery);
	const { data: fbApp } = useQuery({
		queryKey: ["facebook-app-status"],
		queryFn: async () => {
			try {
				return await getFacebookAppStatus();
			} catch (e) {
				console.warn("Facebook app status query error", e);
				return null;
			}
		}
	});
	const { data: health, refetch: refetchHealth, isFetching: healthChecking } = useQuery(aiHealthQuery);
	const qc = useQueryClient();
	const [sbConnecting, setSbConnecting] = (0, import_react.useState)(false);
	const [sbSelecting, setSbSelecting] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [replying, setReplying] = (0, import_react.useState)(false);
	const [scanningComments, setScanningComments] = (0, import_react.useState)(false);
	const [showFbConfig, setShowFbConfig] = (0, import_react.useState)(false);
	const [showFbSecret, setShowFbSecret] = (0, import_react.useState)(false);
	const [showGeminiKey, setShowGeminiKey] = (0, import_react.useState)(false);
	const [showLovableKey, setShowLovableKey] = (0, import_react.useState)(false);
	const [showSbServiceKey, setShowSbServiceKey] = (0, import_react.useState)(false);
	const [showSbAnonKey, setShowSbAnonKey] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		assistance_type: data?.assistance_type ?? "online_work",
		auto_reply_messages: data?.auto_reply_messages ?? true,
		auto_reply_comments: data?.auto_reply_comments ?? true,
		comment_scan_interval_minutes: data?.comment_scan_interval_minutes ?? 5,
		use_lovable_ai_fallback: data?.use_lovable_ai_fallback ?? true,
		default_model: data?.default_model || "gemini-3.8-flash",
		private_message_link: data?.private_message_link ?? "",
		facebook_app_id: data?.facebook_app_id ?? "",
		facebook_app_secret: data?.facebook_app_secret ?? "",
		facebook_verify_token: data?.facebook_verify_token ?? "",
		gemini_api_key: data?.gemini_api_key ?? "",
		lovable_api_key: data?.lovable_api_key ?? "",
		supabase_project_url: data?.supabase_project_url ?? (typeof window !== "undefined" ? localStorage.getItem("supabase_project_url") || "" : ""),
		supabase_anon_key: data?.supabase_anon_key ?? (typeof window !== "undefined" ? localStorage.getItem("supabase_anon_key") || "" : ""),
		supabase_service_role_key: data?.supabase_service_role_key ?? "",
		supabase_project_id: data?.supabase_project_id ?? ""
	});
	(0, import_react.useEffect)(() => {
		if (data) setForm((prev) => ({
			...prev,
			assistance_type: data.assistance_type ?? "online_work",
			auto_reply_messages: data.auto_reply_messages ?? true,
			auto_reply_comments: data.auto_reply_comments ?? true,
			comment_scan_interval_minutes: data.comment_scan_interval_minutes ?? 5,
			use_lovable_ai_fallback: data.use_lovable_ai_fallback ?? true,
			default_model: data.default_model || "gemini-3.6-flash",
			private_message_link: data.private_message_link ?? "",
			facebook_app_id: data.facebook_app_id ?? prev.facebook_app_id,
			facebook_app_secret: data.facebook_app_secret ?? prev.facebook_app_secret,
			facebook_verify_token: data.facebook_verify_token ?? prev.facebook_verify_token,
			gemini_api_key: data.gemini_api_key ?? prev.gemini_api_key,
			lovable_api_key: data.lovable_api_key ?? prev.lovable_api_key,
			supabase_project_url: data.supabase_project_url ?? prev.supabase_project_url,
			supabase_anon_key: data.supabase_anon_key ?? prev.supabase_anon_key,
			supabase_service_role_key: data.supabase_service_role_key ?? prev.supabase_service_role_key,
			supabase_project_id: data.supabase_project_id ?? prev.supabase_project_id
		}));
	}, [data]);
	(0, import_react.useEffect)(() => {
		const handleMessage = (event) => {
			if (event.data?.type === "SUPABASE_OAUTH_SUCCESS") {
				toast.success("Compte Supabase connecté avec succès !");
				qc.invalidateQueries({ queryKey: ["supabase-oauth-status"] });
				qc.invalidateQueries({ queryKey: ["settings"] });
			}
		};
		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, [qc]);
	const save = async () => {
		setSaving(true);
		try {
			if (typeof window !== "undefined") {
				if (form.supabase_project_url) localStorage.setItem("supabase_project_url", form.supabase_project_url.trim());
				if (form.supabase_anon_key) localStorage.setItem("supabase_anon_key", form.supabase_anon_key.trim());
			}
			await updateSettings({ data: {
				...form,
				private_message_link: form.private_message_link || null,
				facebook_app_id: form.facebook_app_id || null,
				facebook_app_secret: form.facebook_app_secret || null,
				facebook_verify_token: form.facebook_verify_token || null,
				gemini_api_key: form.gemini_api_key || null,
				lovable_api_key: form.lovable_api_key || null,
				supabase_project_url: form.supabase_project_url || null,
				supabase_anon_key: form.supabase_anon_key || null,
				supabase_service_role_key: form.supabase_service_role_key || null,
				supabase_project_id: form.supabase_project_id || null
			} });
			toast.success("Paramètres sy fanalahidy voatahiry soa aman-tsara !");
			qc.invalidateQueries({ queryKey: ["settings"] });
			qc.invalidateQueries({ queryKey: ["facebook-app-status"] });
			qc.invalidateQueries({ queryKey: ["supabase-oauth-status"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur");
		} finally {
			setSaving(false);
		}
	};
	const replyAll = async () => {
		setReplying(true);
		try {
			const res = await replyAllPendingMessages();
			const detailStr = res.details?.length ? `\n${res.details.join("\n")}` : "";
			if (res.errors > 0 && res.replied === 0) toast.error(`${res.replied} réponse(s) envoyée(s) sur ${res.processed} conversation(s) — ${res.errors} erreur(s)${detailStr}`);
			else toast.success(`${res.replied} réponse(s) envoyée(s) sur ${res.processed} conversation(s) en attente${res.errors ? ` (${res.errors} erreur(s))` : ""}${detailStr}`);
			qc.invalidateQueries({ queryKey: ["messages-log"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur");
		} finally {
			setReplying(false);
		}
	};
	const scanComments = async () => {
		setScanningComments(true);
		try {
			const res = await scanAndReplyCommentsNow();
			const detailStr = res.details?.length ? `\n${res.details.join("\n")}` : "";
			if (res.errors > 0 && res.replied === 0) toast.error(`${res.replied} réponse(s) sur ${res.scanned} commentaire(s) — ${res.errors} erreur(s)${detailStr}`);
			else toast.success(`${res.replied} commentaire(s) répondu(s) sur ${res.scanned} analysé(s)${res.errors ? ` (${res.errors} erreur(s))` : ""}${detailStr}`);
			qc.invalidateQueries({ queryKey: ["comments-log"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur");
		} finally {
			setScanningComments(false);
		}
	};
	const copyToClipboard = (text, label) => {
		navigator.clipboard.writeText(text);
		toast.success(`${label} copié dans le presse-papier !`);
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
				className: "text-3xl font-bold gradient-text",
				children: "Paramètres"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 269,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-muted-foreground mt-1",
				children: "Comportement de l'IA et de l'automatisation."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 270,
				columnNumber: 9
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 268,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "glass p-6 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "h-5 w-5 text-primary" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 275,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "text-lg font-semibold",
							children: "Type d'assistance"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 277,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: "Change complètement le comportement de l'IA et le menu latéral."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 278,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 276,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 274,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
						value: form.assistance_type,
						onValueChange: (v) => setForm({
							...form,
							assistance_type: v
						}),
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 288,
							columnNumber: 13
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 287,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
								value: "online_work",
								children: "1. Travail en ligne"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 291,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
								value: "training",
								children: "2. Formation"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 292,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
								value: "sales",
								children: "3. Vente"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 293,
								columnNumber: 13
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 290,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 283,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs text-muted-foreground",
						children: "Enregistre pour appliquer ; le menu latéral s'adapte automatiquement."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 296,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 273,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "glass p-6 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							className: "text-base",
							children: "Répondre automatiquement aux messages privés"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 304,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: "L'IA répond aux DM Messenger en temps réel."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 305,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 303,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Switch, {
							checked: form.auto_reply_messages,
							onCheckedChange: (v) => setForm({
								...form,
								auto_reply_messages: v
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 309,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 302,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							className: "text-base",
							children: "Répondre automatiquement aux commentaires"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 317,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: "Scan périodique + réponse automatique des commentaires sans réponse."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 318,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 316,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Switch, {
							checked: form.auto_reply_comments,
							onCheckedChange: (v) => setForm({
								...form,
								auto_reply_comments: v
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 322,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 315,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Intervalle de scan des commentaires (minutes)" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 329,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						type: "number",
						min: 1,
						max: 60,
						value: form.comment_scan_interval_minutes,
						onChange: (e) => setForm({
							...form,
							comment_scan_interval_minutes: Number(e.target.value)
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 330,
						columnNumber: 11
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 328,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Modèle IA par défaut (Point de départ)" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 337,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
							value: form.default_model,
							onValueChange: (v) => setForm({
								...form,
								default_model: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 343,
								columnNumber: 15
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 342,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: "gemini-3.8-flash",
									children: "Gemini 3.8 Flash (Recommandé & Rapide)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 346,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: "gemini-3.1-flash-lite",
									children: "Gemini 3.1 Flash Lite (Ultra-rapide)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 347,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: "gemini-2.5-flash",
									children: "Gemini 2.5 Flash"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 348,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: "gemini-2.5-flash-lite",
									children: "Gemini 2.5 Flash Lite"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 349,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: "gemini-3.5-flash",
									children: "Gemini 3.5 Flash"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 350,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: "gemini-3.6-flash",
									children: "Gemini 3.6 Flash"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 351,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: "gemini-flash-latest",
									children: "Gemini Flash (Dernière version)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 352,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: "gemini-2.5-pro",
									children: "Gemini 2.5 Pro (Raisonnement avancé)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 353,
									columnNumber: 15
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 345,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 338,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: "Le modèle de départ utilisé par l'IA. Si la rotation automatique est activée, le système navigue sans interruption entre 8 modèles Gemini différents."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 356,
							columnNumber: 11
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 336,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							className: "text-base",
							children: "Rotation automatique continue des modèles (> 5 modèles)"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 363,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: "En cas de quota atteint ou de lenteur, bascule immédiatement sur le modèle Gemini suivant dans la boucle de rotation."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 364,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 362,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Switch, {
							checked: form.use_lovable_ai_fallback,
							onCheckedChange: (v) => setForm({
								...form,
								use_lovable_ai_fallback: v
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 368,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 361,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Lien à envoyer en message privé (optionnel)" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 375,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							type: "url",
							placeholder: "https://votresite.com/produit",
							value: form.private_message_link,
							onChange: (e) => setForm({
								...form,
								private_message_link: e.target.value
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 376,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: "Ce lien peut être inséré dans les messages privés mais jamais dans un commentaire."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 380,
							columnNumber: 11
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 374,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						onClick: save,
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Save, { className: "h-4 w-4 mr-2" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 386,
							columnNumber: 11
						}, this), "Enregistrer"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 385,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 301,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: `glass p-6 space-y-4 ${health?.alert ? "border-amber-500/40" : "border-emerald-500/20"}`,
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: `h-10 w-10 rounded-xl flex items-center justify-center ${health?.alert ? "bg-amber-500/15 text-amber-400" : "bg-emerald-500/15 text-emerald-400"}`,
							children: health?.alert ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TriangleAlert, { className: "h-5 w-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 396,
								columnNumber: 32
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "h-5 w-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 396,
								columnNumber: 72
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 395,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "text-lg font-semibold",
							children: "Surveillance des quotas IA"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 399,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: "Alerte quand le crédit Lovable AI ou le quota Gemini passe sous le seuil."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 400,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 398,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 394,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => refetchHealth(),
						disabled: healthChecking,
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RefreshCw, { className: `h-3.5 w-3.5 mr-1.5 ${healthChecking ? "animate-spin" : ""}` }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 406,
							columnNumber: 13
						}, this), "Vérifier"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 405,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 393,
					columnNumber: 9
				}, this), health ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid gap-2 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-lg bg-black/40 border border-white/5 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-xs text-muted-foreground mb-1",
										children: "Moteur Multi-Modèles Gemini"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 414,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "font-medium text-emerald-400 flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-2 w-2 rounded-full bg-emerald-400 animate-pulse" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 416,
												columnNumber: 19
											}, this),
											health.gemini.modelsInRotation ?? 8,
											" Modèles en rotation continue"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 415,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: health.lovable.detail
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 419,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 413,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-lg bg-black/40 border border-white/5 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-xs text-muted-foreground mb-1",
										children: "Clés Gemini (Manuel & Base)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 424,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: `font-medium ${health.gemini.status === "ok" ? "text-emerald-400" : health.gemini.status === "low" ? "text-amber-400" : "text-red-400"}`,
										children: [
											health.gemini.active,
											" opérationnelle(s) / ",
											health.gemini.total,
											health.gemini.hasCustomKey ? " (Clé manuelle active)" : "",
											health.gemini.paused > 0 ? ` (${health.gemini.paused} en pause)` : ""
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 425,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: [
											"Seuil d'alerte : moins de ",
											health.threshold + 1,
											" clé opérationnelle"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 430,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 423,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 412,
							columnNumber: 13
						}, this),
						health.alert && health.alertMessage && /* @__PURE__ */ (void 0)("div", {
							className: "rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 space-y-2",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (void 0)(TriangleAlert, { className: "h-4 w-4 text-amber-400 mt-0.5 shrink-0" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 438,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("p", {
										className: "text-amber-300 text-xs font-medium",
										children: health.alertMessage
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 439,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 437,
									columnNumber: 17
								}, this),
								health.suggestion && /* @__PURE__ */ (void 0)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (void 0)(LifeBuoy, { className: "h-4 w-4 text-emerald-400 mt-0.5 shrink-0" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 442,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)("p", {
										className: "text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-emerald-400 font-medium",
											children: "Suggestion : "
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 444,
											columnNumber: 23
										}, this), health.suggestion]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 443,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 441,
									columnNumber: 39
								}, this),
								health.backupKeyLabel && /* @__PURE__ */ (void 0)("p", {
									className: "text-[11px] text-muted-foreground pl-6",
									children: [
										"Clé de secours recommandée :",
										" ",
										/* @__PURE__ */ (void 0)("span", {
											className: "font-medium text-foreground",
											children: [
												"« ",
												health.backupKeyLabel,
												" »"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 450,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 448,
									columnNumber: 43
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 436,
							columnNumber: 53
						}, this),
						!health.alert && /* @__PURE__ */ (void 0)("p", {
							className: "text-xs text-emerald-400/80",
							children: "Tout est en ordre : Le moteur multi-modèles Gemini et vos clés peuvent répondre sans interruption."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 454,
							columnNumber: 31
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-[10px] text-muted-foreground",
							children: [
								"Dernière vérification : ",
								new Date(health.checkedAt).toLocaleTimeString("fr-FR"),
								" — actualisation automatique toutes les 60 s."
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 458,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 411,
					columnNumber: 19
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs text-muted-foreground",
					children: "Vérification des quotas en cours…"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 462,
					columnNumber: 20
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 392,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "glass p-6 space-y-6 border-primary/30 shadow-lg",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-start justify-between flex-wrap gap-4 border-b border-border/40 pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-1",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "h-9 w-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(KeyRound, { className: "h-5 w-5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 471,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 470,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
									className: "text-lg font-semibold text-foreground",
									children: "Fampidirana ny Clé Manuel (Paramètres des Clés & Intégrations)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 474,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-muted-foreground",
									children: "Isaky ny kaonty dia afaka mampiditra sy mitantana ireo fanalahidy (API keys) ireo ho azy manokana tsy miankina."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 477,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 473,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 469,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 468,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: save,
							disabled: saving,
							className: "bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow",
							children: [saving ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 485,
								columnNumber: 23
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Save, { className: "h-4 w-4 mr-2" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 485,
								columnNumber: 75
							}, this), "Tehirizo ireo Clé rehetra (Enregistrer)"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 484,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 467,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-4 rounded-xl bg-card/40 p-4 border border-border/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Facebook, { className: "h-5 w-5 text-blue-500" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 494,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "text-base font-semibold",
										children: "1. Identifiants Facebook Developer (Meta)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 495,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 493,
									columnNumber: 13
								}, this), form.facebook_app_id && form.facebook_app_secret ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-500",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "h-3.5 w-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 498,
										columnNumber: 17
									}, this), " Clé voaray"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 497,
									columnNumber: 65
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-500",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TriangleAlert, { className: "h-3.5 w-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 500,
										columnNumber: 17
									}, this), " Ilaina ampidirina"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 499,
									columnNumber: 25
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 492,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: "Ampidiro eto ny Facebook App ID sy App Secret avy amin'ny Meta for Developers mba hahafahan'ity kaonty ity mampifandray pejy Facebook sy mandray hafatra amin'ny alalan'ny webhook."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 503,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs font-medium",
										children: "Facebook App ID (ID an'ny App)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 511,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										placeholder: "ohatra: 1234567890123456",
										value: form.facebook_app_id,
										onChange: (e) => setForm({
											...form,
											facebook_app_id: e.target.value
										})
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 512,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 510,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs font-medium",
											children: "Facebook App Secret (Clé miafina)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 520,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											onClick: () => setShowFbSecret(!showFbSecret),
											className: "text-xs text-muted-foreground hover:text-foreground flex items-center gap-1",
											children: [showFbSecret ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EyeOff, { className: "h-3 w-3" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 522,
												columnNumber: 35
											}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-3 w-3" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 522,
												columnNumber: 68
											}, this), showFbSecret ? "Afeno" : "Asehoy"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 521,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 519,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										type: showFbSecret ? "text" : "password",
										placeholder: "ohatra: e1a2b3c4d5e6f7...",
										value: form.facebook_app_secret,
										onChange: (e) => setForm({
											...form,
											facebook_app_secret: e.target.value
										})
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 526,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 518,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 509,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									className: "text-xs font-medium",
									children: "Verify Token Webhook (Teny fanamarinana)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 534,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									placeholder: "ohatra: mon-verify-token-2026",
									value: form.facebook_verify_token,
									onChange: (e) => setForm({
										...form,
										facebook_verify_token: e.target.value
									})
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 535,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 533,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-lg bg-muted/40 p-3 space-y-2 text-xs border border-border/50",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between gap-2 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-semibold text-muted-foreground",
										children: "URL Webhook ho an'ny Meta :"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 544,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
											className: "font-mono text-[11px] bg-background px-2 py-0.5 rounded border",
											children: typeof window !== "undefined" ? `${window.location.origin}/api/public/fb/webhook` : "/api/public/fb/webhook"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 548,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											className: "h-6 text-[10px]",
											onClick: () => {
												navigator.clipboard.writeText(`${window.location.origin}/api/public/fb/webhook`);
												toast.success("URL Webhook voakopika !");
											},
											children: "Adikao"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 551,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 547,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 543,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between gap-2 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-semibold text-muted-foreground",
										children: "Valid OAuth Redirect URI :"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 560,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
											className: "font-mono text-[11px] bg-background px-2 py-0.5 rounded border",
											children: typeof window !== "undefined" ? `${window.location.origin}/api/public/fb/callback` : "/api/public/fb/callback"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 564,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											className: "h-6 text-[10px]",
											onClick: () => {
												navigator.clipboard.writeText(`${window.location.origin}/api/public/fb/callback`);
												toast.success("OAuth Redirect URI voakopika !");
											},
											children: "Adikao"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 567,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 563,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 559,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 542,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 491,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-4 rounded-xl bg-card/40 p-4 border border-purple-500/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "h-5 w-5 text-purple-400" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 582,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "text-base font-semibold",
										children: "2. Moteur Multi-Modèles Gemini & Clé API (Rotation continue > 5 modèles)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 583,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 581,
									columnNumber: 13
								}, this), form.gemini_api_key ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-500",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "h-3.5 w-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 588,
										columnNumber: 17
									}, this), " Clé Gemini Voaray"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 587,
									columnNumber: 36
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-400",
									children: "Mampiasa clé système / Tsy mbola nasiana"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 589,
									columnNumber: 25
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 580,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Ity no misolo tanteraka an'ilay Lovable AI Gateway teo aloha. Isaky ny kaonty noforonina dia afaka mampiditra ny ",
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Gemini API Key" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 595,
										columnNumber: 126
									}, this),
									" azy manokana eto. Ny rafitra avy eo dia manao rotation foana amin'ireto ",
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "modèles Gemini 8 mahery" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 595,
										columnNumber: 230
									}, this),
									" ireto mba tsy hisy fahatapahana mihitsy ny famaliana hafatra sy commentaire."
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 594,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-lg bg-black/30 border border-white/5 p-3 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-xs font-medium text-purple-300 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Zap, { className: "h-3.5 w-3.5 text-purple-400" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 602,
											columnNumber: 17
										}, this), " Modèles ao anaty rotation continue (8 modèles) :"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 601,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full",
										children: "Rotation active"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 604,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 600,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex flex-wrap gap-1.5",
									children: [
										"gemini-3.8-flash",
										"gemini-3.1-flash-lite",
										"gemini-2.5-flash",
										"gemini-2.5-flash-lite",
										"gemini-3.5-flash",
										"gemini-3.6-flash",
										"gemini-flash-latest",
										"gemini-2.5-pro"
									].map((m) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-muted-foreground",
										children: m
									}, m, false, {
										fileName: _jsxFileName,
										lineNumber: 609,
										columnNumber: 197
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 608,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 599,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs font-medium",
											children: "Gemini API Key an'ity kaonty ity (GEMINI_API_KEY)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 617,
											columnNumber: 15
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											onClick: () => setShowGeminiKey(!showGeminiKey),
											className: "text-xs text-muted-foreground hover:text-foreground flex items-center gap-1",
											children: [showGeminiKey ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EyeOff, { className: "h-3 w-3" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 621,
												columnNumber: 34
											}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-3 w-3" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 621,
												columnNumber: 67
											}, this), showGeminiKey ? "Afeno" : "Asehoy"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 620,
											columnNumber: 15
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 616,
										columnNumber: 13
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										type: showGeminiKey ? "text" : "password",
										placeholder: "ohatra: AIzaSy...",
										value: form.gemini_api_key,
										onChange: (e) => setForm({
											...form,
											gemini_api_key: e.target.value
										})
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 625,
										columnNumber: 13
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Azonao alaina maimaimpoana ao amin'ny Google AI Studio (aistudio.google.com)."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 629,
										columnNumber: 13
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 615,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("details", {
								className: "text-xs text-muted-foreground pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("summary", {
									className: "cursor-pointer hover:text-foreground font-medium flex items-center gap-1 text-[11px]",
									children: "Option supplémentaire : Clé Lovable de secours (Optionnel)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 635,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1.5 mt-2 pl-2 border-l border-white/10",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs font-medium",
											children: "Lovable API Key (Optionnel)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 640,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											onClick: () => setShowLovableKey(!showLovableKey),
											className: "text-xs text-muted-foreground hover:text-foreground flex items-center gap-1",
											children: [showLovableKey ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EyeOff, { className: "h-3 w-3" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 642,
												columnNumber: 37
											}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-3 w-3" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 642,
												columnNumber: 70
											}, this), showLovableKey ? "Afeno" : "Asehoy"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 641,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 639,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										type: showLovableKey ? "text" : "password",
										placeholder: "ohatra: lov_live_...",
										value: form.lovable_api_key,
										onChange: (e) => setForm({
											...form,
											lovable_api_key: e.target.value
										})
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 646,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 638,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 634,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 579,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-4 rounded-xl bg-card/40 p-5 border border-primary/40 bg-primary/5",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Database, { className: "h-5 w-5 text-primary" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 658,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "text-base font-semibold",
										children: "3. Base de Données & Authentification Firebase"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 659,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 657,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-500 border border-emerald-500/30",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 662,
										columnNumber: 15
									}, this), " Firebase Firestore & Auth mavitrika"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 661,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 656,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: "Ny angon-drakitra rehetra (base de données) sy ny kaonty (authentification) dia mifandray mivantana sy tehirizina ao amin'ny Google Firebase Firestore sy Firebase Auth."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 665,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid gap-3 sm:grid-cols-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "p-3 rounded-lg bg-background/80 border border-border",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-muted-foreground block text-[11px]",
											children: "Firebase Project ID"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 671,
											columnNumber: 15
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-mono font-medium text-foreground",
											children: "effortless-rainfall-gf38q"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 672,
											columnNumber: 15
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 670,
										columnNumber: 13
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "p-3 rounded-lg bg-background/80 border border-border",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-muted-foreground block text-[11px]",
											children: "Firestore Database ID"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 675,
											columnNumber: 15
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-mono font-medium text-foreground text-[11px] truncate block",
											children: "ai-studio-agencevirtuelle-4025dff0-0f16-4acf-aae5-334da4c38db5"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 676,
											columnNumber: 15
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 674,
										columnNumber: 13
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "p-3 rounded-lg bg-background/80 border border-border",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-muted-foreground block text-[11px]",
											children: "Système d'authentification"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 681,
											columnNumber: 15
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-medium text-emerald-500 flex items-center gap-1.5 mt-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "h-3.5 w-3.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 683,
												columnNumber: 17
											}, this), " Firebase Auth (Email / Mot de passe / Google)"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 682,
											columnNumber: 15
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 680,
										columnNumber: 13
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "p-3 rounded-lg bg-background/80 border border-border",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-muted-foreground block text-[11px]",
											children: "Synchro temps réel"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 687,
											columnNumber: 15
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-medium text-emerald-500 flex items-center gap-1.5 mt-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "h-3.5 w-3.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 689,
												columnNumber: 17
											}, this), " Firestore Cloud Rules activées"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 688,
											columnNumber: 15
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 686,
										columnNumber: 13
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 669,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 655,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex justify-end pt-2",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: save,
							disabled: saving,
							size: "lg",
							className: "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-md",
							children: [saving ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 698,
								columnNumber: 23
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(KeyRound, { className: "h-4 w-4 mr-2" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 698,
								columnNumber: 75
							}, this), "Tehirizo ireo fanalahidy ho an'ity kaonty ity (Enregistrer)"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 697,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 696,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 466,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "glass p-6 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Zap, { className: "h-5 w-5 text-amber-500 animate-pulse" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 708,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
									className: "text-lg font-semibold",
									children: "Automatisation & Cron IA (Arrière-plan)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 709,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 707,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: "Les webhooks répondent en temps réel aux messages et commentaires. Un contrôle de secours automatique s'exécute chaque minute pour récupérer les événements manqués."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 711,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 706,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-600 text-xs font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 717,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Temps réel + secours 1 min" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 718,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 716,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 705,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "bg-background/60 rounded-lg p-4 border space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
								children: "Endpoints Cron Publics (Pour Crons externes / Vercel Cron / pg_cron)"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 723,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between gap-2 p-2 bg-muted/40 rounded border text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-mono truncate text-muted-foreground",
										children: typeof window !== "undefined" ? `${window.location.origin}/api/public/hooks/cron` : "/api/public/hooks/cron"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 728,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										size: "sm",
										variant: "ghost",
										className: "h-7 text-xs shrink-0",
										onClick: () => copyToClipboard(`${window.location.origin}/api/public/hooks/cron`, "URL Cron Global"),
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Copy, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 732,
											columnNumber: 17
										}, this), "Copier"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 731,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 727,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between gap-2 p-2 bg-muted/40 rounded border text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-mono truncate text-muted-foreground",
										children: typeof window !== "undefined" ? `${window.location.origin}/api/public/hooks/reply-all-messages` : "/api/public/hooks/reply-all-messages"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 737,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										size: "sm",
										variant: "ghost",
										className: "h-7 text-xs shrink-0",
										onClick: () => copyToClipboard(`${window.location.origin}/api/public/hooks/reply-all-messages`, "URL Cron Messages"),
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Copy, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 741,
											columnNumber: 17
										}, this), "Copier"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 740,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 736,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 726,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-[11px] text-muted-foreground",
								children: [
									"💡 Vous pouvez utiliser gratuitement un service comme",
									" ",
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
										href: "https://cron-job.org",
										target: "_blank",
										rel: "noreferrer",
										className: "text-primary underline",
										children: "cron-job.org"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 748,
										columnNumber: 13
									}, this),
									" ",
									"ou",
									" ",
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
										href: "https://uptimerobot.com",
										target: "_blank",
										rel: "noreferrer",
										className: "text-primary underline",
										children: "UptimeRobot"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 752,
										columnNumber: 13
									}, this),
									" ",
									"pour appeler cette URL toutes les minutes si vous souhaitez une redondance externe 24/7."
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 746,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 722,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "pt-2 border-t space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
							className: "text-sm font-semibold",
							children: "Déclencheurs Manuels Immédiats"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 760,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								onClick: replyAll,
								disabled: replying,
								variant: "secondary",
								children: [replying ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 763,
									columnNumber: 27
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { className: "h-4 w-4 mr-2 text-primary" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 763,
									columnNumber: 79
								}, this), replying ? "Réponses en cours…" : "Répondre à tous les messages privés"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 762,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								onClick: scanComments,
								disabled: scanningComments,
								variant: "outline",
								children: [scanningComments ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 768,
									columnNumber: 35
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageSquare, { className: "h-4 w-4 mr-2 text-emerald-500" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 768,
									columnNumber: 87
								}, this), scanningComments ? "Scan en cours…" : "Scanner & répondre aux commentaires"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 767,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 761,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 759,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 704,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "glass p-6",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "h-5 w-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 779,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 778,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "text-lg font-semibold",
							children: "Créer votre site Web gratuit"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 782,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: "Lancez votre propre site Web gratuitement en quelques minutes."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 783,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 781,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 777,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
							href: "https://supersite-mg.lovable.app",
							target: "_blank",
							rel: "noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "h-4 w-4 mr-2" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 790,
								columnNumber: 15
							}, this), "Créer votre site Web gratuit"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 789,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 788,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 776,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 775,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PushNotificationsCard, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 797,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 267,
		columnNumber: 10
	}, this);
}
//#endregion
export { SettingsPage as component };
