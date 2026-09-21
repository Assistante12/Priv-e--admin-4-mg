import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { E as MessageSquare } from "../_libs/lucide-react.mjs";
import { o as messagesQuery } from "./router-BAc73aWw.mjs";
import { t as Card } from "./card-CWKLgPMR.mjs";
import { t as Badge } from "./badge-Di9TvE8n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/messages-B_9zPqGy.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/messages.tsx?tsr-split=component";
function MessagesPage() {
	const { data } = useSuspenseQuery(messagesQuery);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
			className: "text-3xl font-bold gradient-text",
			children: "Messages privés"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 12,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "text-muted-foreground mt-1",
			children: "Historique des conversations Messenger traitées par l'IA."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 13,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 11,
			columnNumber: 7
		}, this), data.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "glass p-12 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageSquare, { className: "h-10 w-10 text-primary mx-auto mb-3" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 19,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-muted-foreground",
				children: "Aucun message. Connectez votre page Facebook pour commencer."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 20,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 18,
			columnNumber: 28
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "space-y-2",
			children: data.map((m) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "glass p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2 flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
								variant: m.direction === "incoming" ? "secondary" : "default",
								children: m.direction === "incoming" ? "Reçu" : "Envoyé"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 26,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-medium",
								children: m.sender_name ?? m.sender_id
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 29,
								columnNumber: 17
							}, this),
							m.media_type && /* @__PURE__ */ (void 0)(Badge, {
								variant: "outline",
								children: m.media_type
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 30,
								columnNumber: 34
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs text-muted-foreground ml-auto",
								children: new Date(m.created_at).toLocaleString("fr-FR")
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 31,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 25,
						columnNumber: 15
					}, this),
					m.content && /* @__PURE__ */ (void 0)("p", {
						className: "text-sm mt-2 whitespace-pre-wrap",
						children: m.content
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 35,
						columnNumber: 29
					}, this),
					m.ai_response && /* @__PURE__ */ (void 0)("div", {
						className: "mt-3 border-l-2 border-primary/50 pl-3 text-sm text-muted-foreground whitespace-pre-wrap",
						children: m.ai_response
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 36,
						columnNumber: 33
					}, this)
				]
			}, m.id, true, {
				fileName: _jsxFileName,
				lineNumber: 24,
				columnNumber: 26
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 23,
			columnNumber: 19
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 10,
		columnNumber: 10
	}, this);
}
//#endregion
export { MessagesPage as component };
