import { i as useQuery, o as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { D as MessagesSquare, E as MessageSquare, F as KeyRound, V as Facebook, b as Power, tt as Bot, x as PowerOff } from "../_libs/lucide-react.mjs";
import { l as settingsQuery$1, u as statsQuery } from "./router-DwpRzv9p.mjs";
import { t as Card } from "./card-CWKLgPMR.mjs";
import { t as Switch } from "./switch-Bij46GIi.mjs";
import { n as setGlobalIaStopped } from "./ia-control.functions-gIVLVAs5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-BEq75xxe.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/dashboard.tsx?tsr-split=component";
function Dashboard() {
	const { data: statsData } = useQuery(statsQuery);
	const { data: settings } = useQuery(settingsQuery$1);
	const qc = useQueryClient();
	const data = statsData || {
		messages: 0,
		comments_replied: 0,
		active_keys: 0,
		connected_pages: 0
	};
	const stopped = settings?.global_ia_stopped ?? false;
	const toggle = async (v) => {
		try {
			await setGlobalIaStopped({ data: { stopped: v } });
			toast.success(v ? "IA arrêtée pour tous les clients" : "IA réactivée");
			qc.invalidateQueries({ queryKey: ["settings"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur");
		}
	};
	const cards = [
		{
			label: "Messages traités",
			value: data.messages,
			icon: MessageSquare,
			color: "text-primary"
		},
		{
			label: "Commentaires répondus",
			value: data.comments_replied,
			icon: MessagesSquare,
			color: "text-accent"
		},
		{
			label: "Clés Gemini actives",
			value: data.active_keys,
			icon: KeyRound,
			color: "text-warning"
		},
		{
			label: "Pages connectées",
			value: data.connected_pages,
			icon: Facebook,
			color: "text-primary"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
				className: "text-3xl font-bold gradient-text",
				children: "Vue d'ensemble"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 62,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-muted-foreground mt-1",
				children: "Bienvenue dans votre tableau de bord Assistante Virtuelle."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 63,
				columnNumber: 9
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 61,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: `glass p-6 border-2 ${stopped ? "border-destructive/50 bg-destructive/5" : "border-primary/30"}`,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between gap-4 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: `h-11 w-11 rounded-lg flex items-center justify-center ${stopped ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"}`,
							children: stopped ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PowerOff, { className: "h-5 w-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 72,
								columnNumber: 26
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Power, { className: "h-5 w-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 72,
								columnNumber: 61
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 71,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "font-semibold text-lg",
							children: "Stop IA global"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 75,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: stopped ? "L'IA ne répond à personne actuellement." : "L'IA répond automatiquement aux messages et commentaires."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 76,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 74,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 70,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-sm font-medium",
							children: stopped ? "Arrêtée" : "Active"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 82,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Switch, {
							checked: stopped,
							onCheckedChange: toggle
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 83,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 81,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 69,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 68,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
				children: cards.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
					className: "glass p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: `inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${c.color}`,
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(c.icon, { className: "h-5 w-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 91,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 90,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-4 text-3xl font-bold",
							children: c.value
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 93,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-xs text-muted-foreground mt-1",
							children: c.label
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 94,
							columnNumber: 13
						}, this)
					]
				}, c.label, true, {
					fileName: _jsxFileName,
					lineNumber: 89,
					columnNumber: 25
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 88,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "glass p-6",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-start gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bot, { className: "h-5 w-5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 101,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 100,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "font-semibold",
							children: "Démarrage rapide"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 104,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ol", {
							className: "mt-3 space-y-2 text-sm text-muted-foreground list-decimal list-inside",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [
									"Choisissez le ",
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
										className: "text-foreground",
										children: "type d'assistance"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 107,
										columnNumber: 31
									}, this),
									" dans Paramètres."
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 106,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [
									"Ajoutez vos ",
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
										className: "text-foreground",
										children: "prompts"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 111,
										columnNumber: 29
									}, this),
									" pour guider l'IA."
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 110,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [
									"Ajoutez vos ",
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
										className: "text-foreground",
										children: "clés Gemini"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 114,
										columnNumber: 29
									}, this),
									"."
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 113,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [
									"Connectez votre ",
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
										className: "text-foreground",
										children: "page Facebook"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 117,
										columnNumber: 33
									}, this),
									"."
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 116,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 105,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 103,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 99,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 98,
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
export { Dashboard as component };
