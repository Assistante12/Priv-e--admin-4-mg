import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as useQueryClient, r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { C as Play, D as MessagesSquare, y as RefreshCw } from "../_libs/lucide-react.mjs";
import { S as triggerCommentScan, d as commentsQuery } from "./router-Bhc7uvGy.mjs";
import { t as Card } from "./card-CWKLgPMR.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Badge } from "./badge-Di9TvE8n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/comments-4dEiSv7q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/comments.tsx?tsr-split=component";
function CommentsPage() {
	const { data } = useSuspenseQuery(commentsQuery);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const qc = useQueryClient();
	const scan = async () => {
		setLoading(true);
		try {
			const res = await triggerCommentScan({ data: {} });
			if (res.errors && res.errors > 0 && res.replied === 0) toast.error(res.note ?? `${res.replied} réponse(s) envoyée(s) — ${res.errors} erreur(s)`);
			else toast.success(res.note ?? `${res.replied} réponse(s) envoyée(s)`);
			qc.invalidateQueries({ queryKey: ["comments-log"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-start justify-between gap-4 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-3xl font-bold gradient-text",
					children: "Commentaires"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 39,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-muted-foreground mt-1",
					children: "Scan automatique toutes les 5 min — l'IA répond aux commentaires sans réponse."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 40,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 38,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					onClick: scan,
					disabled: loading,
					children: [loading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RefreshCw, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 45,
						columnNumber: 22
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Play, { className: "h-4 w-4 mr-2" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 45,
						columnNumber: 76
					}, this), "Scanner maintenant"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 44,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 37,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "glass p-4 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
					className: "text-foreground",
					children: "Règle :"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 51,
					columnNumber: 9
				}, this), " l'IA lit la publication complète avant de répondre, ne poste jamais de lien dans un commentaire, et invite l'utilisateur à passer en message privé pour recevoir un lien."]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 50,
				columnNumber: 7
			}, this),
			data.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "glass p-12 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessagesSquare, { className: "h-10 w-10 text-primary mx-auto mb-3" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 57,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-muted-foreground",
					children: "Aucun commentaire encore. Connectez d'abord votre page."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 58,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 56,
				columnNumber: 28
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-2",
				children: data.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
					className: "glass p-4",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-start justify-between gap-4",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex-1 min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2 flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-medium",
											children: c.author_name ?? "Anonyme"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 66,
											columnNumber: 21
										}, this),
										c.replied ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
											className: "bg-success text-success-foreground",
											children: "Répondu"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 67,
											columnNumber: 34
										}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
											variant: "outline",
											children: "En attente"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 67,
											columnNumber: 106
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-xs text-muted-foreground",
											children: new Date(c.created_at).toLocaleString("fr-FR")
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 68,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 65,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-sm mt-2 whitespace-pre-wrap",
									children: c.content
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 72,
									columnNumber: 19
								}, this),
								c.ai_response && /* @__PURE__ */ (void 0)("div", {
									className: "mt-3 border-l-2 border-primary/50 pl-3 text-sm text-muted-foreground whitespace-pre-wrap",
									children: c.ai_response
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 73,
									columnNumber: 37
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 64,
							columnNumber: 17
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 63,
						columnNumber: 15
					}, this)
				}, c.id, false, {
					fileName: _jsxFileName,
					lineNumber: 62,
					columnNumber: 26
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 61,
				columnNumber: 19
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 36,
		columnNumber: 10
	}, this);
}
//#endregion
export { CommentsPage as component };
