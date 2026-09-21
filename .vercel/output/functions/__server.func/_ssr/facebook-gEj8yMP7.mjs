import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQuery, n as queryOptions, o as useQueryClient, r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { I as Info, V as Facebook, W as ExternalLink, c as TriangleAlert, l as Trash2, m as Settings, q as Copy } from "../_libs/lucide-react.mjs";
import { T as disconnectFacebookPage, b as getFacebookAppStatus, c as webhookQuery, s as pagesQuery$1, x as getFacebookLoginUrl } from "./router-BAc73aWw.mjs";
import { t as Card } from "./card-CWKLgPMR.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Badge } from "./badge-Di9TvE8n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/facebook-gEj8yMP7.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/facebook.tsx?tsr-split=component";
var appStatusQuery = queryOptions({
	queryKey: ["facebook-app-status"],
	queryFn: async () => {
		try {
			return await getFacebookAppStatus();
		} catch (e) {
			console.warn("FB app status query error", e);
			return null;
		}
	}
});
function FacebookPage() {
	const { data: pages } = useSuspenseQuery(pagesQuery$1);
	const { data: webhookRaw } = useSuspenseQuery(webhookQuery);
	const { data: fbApp } = useQuery(appStatusQuery);
	const webhook = webhookRaw;
	const qc = useQueryClient();
	const connect = async () => {
		try {
			const { url } = await getFacebookLoginUrl();
			window.location.href = url;
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur");
		}
	};
	const disconnect = async (id) => {
		if (!confirm("Déconnecter cette page ?")) return;
		await disconnectFacebookPage({ data: { id } });
		qc.invalidateQueries({ queryKey: ["fb-pages"] });
		toast.success("Déconnectée");
	};
	const copy = (text) => {
		navigator.clipboard.writeText(text);
		toast.success("Copié");
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
				className: "text-3xl font-bold gradient-text",
				children: "Facebook"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 62,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-muted-foreground mt-1",
				children: "Connectez votre page pour activer les réponses automatiques."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 63,
				columnNumber: 9
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 61,
				columnNumber: 7
			}, this),
			fbApp && !fbApp.configured && /* @__PURE__ */ (void 0)(Card, {
				className: "p-4 border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (void 0)(TriangleAlert, { className: "h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 70,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("div", {
						className: "space-y-2 flex-1",
						children: [
							/* @__PURE__ */ (void 0)("div", {
								className: "font-semibold text-sm",
								children: "Configuration Facebook requise (App ID / App Secret manquants)"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 72,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("p", {
								className: "text-xs opacity-90",
								children: "Mbola tsy voapetraka ny mari-pamantarana Facebook Developer (App ID sy App Secret). Ampidiro ao amin'ny pejy Paramètres izany mba hahafahana mampifandray ny pejy Facebook."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 75,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: /* @__PURE__ */ (void 0)(Button, {
								asChild: true,
								size: "sm",
								variant: "outline",
								className: "text-xs",
								children: /* @__PURE__ */ (void 0)(Link, {
									to: "/settings",
									children: [/* @__PURE__ */ (void 0)(Settings, { className: "h-3.5 w-3.5 mr-1.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 82,
										columnNumber: 21
									}, this), "Ouvrir les Paramètres"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 81,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 80,
								columnNumber: 17
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 79,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 71,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 69,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 68,
				columnNumber: 38
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "glass p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between gap-3 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Facebook, { className: "h-6 w-6 text-primary" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 94,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "font-semibold",
								children: "Connecter une page"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 95,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 93,
							columnNumber: 11
						}, this), fbApp?.configured && /* @__PURE__ */ (void 0)(Badge, {
							variant: "outline",
							className: "text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
							children: ["Facebook App foibe efa miasa ", fbApp.app_id_preview ? `(${fbApp.app_id_preview})` : ""]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 97,
							columnNumber: 33
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 92,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-muted-foreground mb-4",
						children: "L'application demandera les permissions : lecture/envoi de messages, gestion des commentaires, lecture des publications."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 101,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						onClick: connect,
						disabled: fbApp && !fbApp.configured,
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Facebook, { className: "h-4 w-4 mr-2" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 106,
							columnNumber: 11
						}, this), "Connecter avec Facebook"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 105,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 91,
				columnNumber: 7
			}, this),
			pages.length > 0 && /* @__PURE__ */ (void 0)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (void 0)("h2", {
					className: "font-semibold",
					children: "Pages connectées"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 112,
					columnNumber: 11
				}, this), pages.map((p) => /* @__PURE__ */ (void 0)(Card, {
					className: "glass p-4 flex items-center gap-4",
					children: [
						/* @__PURE__ */ (void 0)("div", {
							className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary",
							children: /* @__PURE__ */ (void 0)(Facebook, { className: "h-5 w-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 115,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 114,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "font-medium truncate",
								children: p.page_name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 118,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "text-xs text-muted-foreground",
								children: ["ID : ", p.page_id]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 119,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 117,
							columnNumber: 15
						}, this),
						p.webhook_subscribed ? /* @__PURE__ */ (void 0)(Badge, {
							className: "bg-success text-success-foreground",
							children: "Webhook actif"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 121,
							columnNumber: 39
						}, this) : /* @__PURE__ */ (void 0)(Badge, {
							variant: "outline",
							children: "Webhook non configuré"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 121,
							columnNumber: 117
						}, this),
						/* @__PURE__ */ (void 0)(Button, {
							size: "icon",
							variant: "ghost",
							onClick: () => disconnect(p.id),
							children: /* @__PURE__ */ (void 0)(Trash2, { className: "h-4 w-4 text-destructive" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 123,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 122,
							columnNumber: 15
						}, this)
					]
				}, p.id, true, {
					fileName: _jsxFileName,
					lineNumber: 113,
					columnNumber: 27
				}, this))]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 111,
				columnNumber: 28
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "glass p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-3 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Info, { className: "h-5 w-5 text-accent" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 130,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "font-semibold",
							children: "Configuration Webhook Meta"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 131,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 129,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-muted-foreground mb-4",
						children: [
							"Dans",
							" ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
								href: "https://developers.facebook.com/apps",
								target: "_blank",
								rel: "noreferrer",
								className: "text-primary hover:underline inline-flex items-center gap-1",
								children: ["Meta for Developers ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "h-3 w-3" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 136,
									columnNumber: 33
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 135,
								columnNumber: 11
							}, this),
							", ajoutez le produit ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Webhooks" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 138,
								columnNumber: 32
							}, this),
							" puis souscrivez à la page avec :"
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 133,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-xs uppercase text-muted-foreground mb-1",
								children: "URL de callback"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 142,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
									className: "flex-1 rounded bg-muted px-3 py-2 text-xs break-all",
									children: webhook.callback_url
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 144,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => copy(webhook.callback_url),
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Copy, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 148,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 147,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 143,
								columnNumber: 13
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 141,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-xs uppercase text-muted-foreground mb-1",
								children: "URL OAuth redirect valide"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 153,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
									className: "flex-1 rounded bg-muted px-3 py-2 text-xs break-all",
									children: webhook.oauth_redirect_uri
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 157,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => copy(webhook.oauth_redirect_uri),
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Copy, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 161,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 160,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 156,
								columnNumber: 13
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 152,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-xs uppercase text-muted-foreground mb-1",
								children: "Verify token"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 166,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
									className: "flex-1 rounded bg-muted px-3 py-2 text-xs break-all",
									children: webhook.verify_token
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 168,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => copy(webhook.verify_token),
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Copy, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 172,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 171,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 167,
								columnNumber: 13
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 165,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-xs uppercase text-muted-foreground mb-1",
								children: "Champs à souscrire"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 177,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
								className: "block rounded bg-muted px-3 py-2 text-xs",
								children: "messages, messaging_postbacks, feed, message_reactions"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 178,
								columnNumber: 13
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 176,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 140,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 128,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 60,
		columnNumber: 10
	}, this);
}
//#endregion
export { FacebookPage as component };
