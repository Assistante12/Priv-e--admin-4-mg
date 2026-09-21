import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { r as createServerFn } from "./server-PdCEgQXm.mjs";
import { t as requireWorkspaceAuth } from "./workspace-middleware-BESKEWcR.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BxRoGsb6.mjs";
import { a as objectType, o as stringType } from "../_libs/zod.mjs";
import { i as useQuery, o as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { a as User, h as Send, i as Users, tt as Bot } from "../_libs/lucide-react.mjs";
import { t as Card } from "./card-CWKLgPMR.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Switch } from "./switch-Bij46GIi.mjs";
import { t as setClientIaStopped } from "./ia-control.functions-gIVLVAs5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discussions-DDoQOEyH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
/** List distinct conversations (grouped by page_id + sender_id) from messages_log */
var listConversations = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(createSsrRpc("44ff229f2fc68f08d6074c790f566e1f923bdc284c1f960d9f6c492e910aa32d"));
var listConversationMessages = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({
	page_id: stringType(),
	client_fb_id: stringType()
}).parse(d)).handler(createSsrRpc("73a2572a6273eb80963faa0325ca5f780d925c2f61992189cab1957cc94b584c"));
var sendDiscussionMessage = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({
	page_id: stringType(),
	client_fb_id: stringType(),
	text: stringType().min(1).max(4e3)
}).parse(d)).handler(createSsrRpc("5223d0c7cf3d331be96dcbbd38a887c75555c82c8eef791ef89311e31dc3d215"));
var _jsxFileName = "/app/applet/src/routes/_authenticated/discussions.tsx?tsr-split=component";
function DiscussionsPage() {
	const qc = useQueryClient();
	const { data: convs = [] } = useQuery({
		queryKey: ["conversations"],
		queryFn: async () => {
			try {
				return await listConversations();
			} catch (e) {
				console.warn("Conversations query error", e);
				return [];
			}
		},
		refetchInterval: 15e3
	});
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [text, setText] = (0, import_react.useState)("");
	const [sending, setSending] = (0, import_react.useState)(false);
	const { data: messages = [] } = useQuery({
		queryKey: [
			"conversation",
			selected?.page_id,
			selected?.client_fb_id
		],
		queryFn: async () => {
			try {
				return await listConversationMessages({ data: {
					page_id: selected.page_id,
					client_fb_id: selected.client_fb_id
				} });
			} catch (e) {
				console.warn("Conversation messages query error", e);
				return [];
			}
		},
		enabled: !!selected,
		refetchInterval: 1e4
	});
	const send = async () => {
		if (!selected || !text.trim()) return;
		setSending(true);
		try {
			await sendDiscussionMessage({ data: {
				page_id: selected.page_id,
				client_fb_id: selected.client_fb_id,
				text: text.trim()
			} });
			setText("");
			qc.invalidateQueries({ queryKey: [
				"conversation",
				selected.page_id,
				selected.client_fb_id
			] });
			qc.invalidateQueries({ queryKey: ["conversations"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur");
		} finally {
			setSending(false);
		}
	};
	const toggleIa = async (v) => {
		if (!selected) return;
		try {
			await setClientIaStopped({ data: {
				page_id: selected.page_id,
				client_fb_id: selected.client_fb_id,
				client_fb_name: selected.client_fb_name,
				ia_stopped: v
			} });
			toast.success(v ? "IA arrêtée pour ce client" : "IA réactivée");
			qc.invalidateQueries({ queryKey: ["conversations"] });
			setSelected({
				...selected,
				ia_stopped: v
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
			className: "text-3xl font-bold gradient-text flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "h-8 w-8" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 100,
				columnNumber: 11
			}, this), " Discussions"]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 99,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "text-muted-foreground mt-1",
			children: "Reprenez la main sur une conversation client."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 102,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 98,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid md:grid-cols-3 gap-4 h-[70vh]",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "glass p-3 overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-xs font-medium text-muted-foreground mb-2 px-2",
					children: [convs.length, " conversation(s)"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 107,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-1",
					children: [convs.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => setSelected(c),
						className: `w-full text-left rounded-lg p-3 transition ${selected?.client_fb_id === c.client_fb_id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/50"}`,
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-medium truncate text-sm",
								children: c.client_fb_name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 113,
								columnNumber: 19
							}, this), c.ia_stopped && /* @__PURE__ */ (void 0)("span", {
								className: "text-[10px] px-1.5 py-0.5 rounded bg-destructive/20 text-destructive",
								children: "IA off"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 114,
								columnNumber: 36
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 112,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-xs text-muted-foreground truncate",
							children: c.last_message
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 118,
							columnNumber: 17
						}, this)]
					}, `${c.page_id}::${c.client_fb_id}`, true, {
						fileName: _jsxFileName,
						lineNumber: 111,
						columnNumber: 36
					}, this)), convs.length === 0 && /* @__PURE__ */ (void 0)("div", {
						className: "text-center text-xs text-muted-foreground py-6",
						children: "Aucune conversation."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 120,
						columnNumber: 36
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 110,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 106,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "glass p-0 md:col-span-2 flex flex-col",
				children: selected ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "p-3 border-b border-border flex items-center justify-between gap-3 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "font-semibold",
							children: selected.client_fb_name
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 130,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-xs text-muted-foreground",
							children: ["Page : ", selected.page_id]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 131,
							columnNumber: 19
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 129,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Stop IA" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 134,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Switch, {
								checked: selected.ia_stopped ?? false,
								onCheckedChange: toggleIa
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 135,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 133,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 128,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex-1 overflow-y-auto p-4 space-y-3",
						children: [messages.map((m) => {
							const isAi = m.direction === "outgoing";
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: `flex ${isAi ? "justify-end" : "justify-start"}`,
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: `max-w-[80%] rounded-2xl px-4 py-2 text-sm ${isAi ? "bg-primary text-primary-foreground" : "bg-muted"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-1 text-[10px] opacity-70 mb-1",
											children: [isAi ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bot, { className: "h-3 w-3" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 145,
												columnNumber: 35
											}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(User, { className: "h-3 w-3" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 145,
												columnNumber: 65
											}, this), new Date(m.created_at).toLocaleTimeString()]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 144,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "whitespace-pre-wrap",
											children: m.content || m.ai_response
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 148,
											columnNumber: 25
										}, this),
										m.media_url && /* @__PURE__ */ (void 0)("div", {
											className: "mt-2 overflow-hidden rounded-lg border border-white/10 max-w-xs",
											children: /* @__PURE__ */ (void 0)("img", {
												src: m.media_url,
												alt: "Sary",
												className: "w-full max-h-64 object-cover hover:scale-105 transition-transform duration-200",
												loading: "lazy"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 150,
												columnNumber: 29
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 149,
											columnNumber: 41
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 143,
									columnNumber: 23
								}, this)
							}, m.id, false, {
								fileName: _jsxFileName,
								lineNumber: 142,
								columnNumber: 22
							}, this);
						}), messages.length === 0 && /* @__PURE__ */ (void 0)("div", {
							className: "text-center text-sm text-muted-foreground py-8",
							children: "Aucun message."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 155,
							columnNumber: 43
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 139,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "p-3 border-t border-border flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							placeholder: "Écrire un message…",
							value: text,
							onChange: (e) => setText(e.target.value),
							onKeyDown: (e) => e.key === "Enter" && !e.shiftKey && send()
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 161,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: send,
							disabled: sending || !text.trim(),
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 163,
								columnNumber: 19
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 162,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 160,
						columnNumber: 15
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 127,
					columnNumber: 23
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex-1 flex items-center justify-center text-muted-foreground text-sm",
					children: "Sélectionnez une conversation."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 166,
					columnNumber: 19
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 126,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 105,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 97,
		columnNumber: 10
	}, this);
}
//#endregion
export { DiscussionsPage as component };
