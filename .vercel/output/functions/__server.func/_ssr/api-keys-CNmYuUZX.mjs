import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as useQueryClient, r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { F as KeyRound, S as Plus, l as Trash2, v as RotateCcw } from "../_libs/lucide-react.mjs";
import { A as testGeminiKey, C as deleteGeminiKey, N as upsertGeminiKey, O as resetAllGeminiKeys, j as toggleGeminiKey, y as keysQuery } from "./router-DwpRzv9p.mjs";
import { t as Card } from "./card-CWKLgPMR.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { t as Switch } from "./switch-Bij46GIi.mjs";
import { t as Badge } from "./badge-Di9TvE8n.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-B0Ygdo8b.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-keys-CNmYuUZX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/api-keys.tsx?tsr-split=component";
function ApiKeysPage() {
	const { data } = useSuspenseQuery(keysQuery);
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [testingId, setTestingId] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		label: "",
		api_key: "",
		is_active: true
	});
	const save = async () => {
		if (data.length >= 20) {
			toast.error("Maximum 20 clés atteintes");
			return;
		}
		try {
			await upsertGeminiKey({ data: form });
			toast.success("Clé enregistrée et validée avec succès par Google !");
			setOpen(false);
			setForm({
				label: "",
				api_key: "",
				is_active: true
			});
			qc.invalidateQueries({ queryKey: ["gemini-keys"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur lors de l'enregistrement de la clé");
		}
	};
	const testKey = async (id) => {
		setTestingId(id);
		try {
			const modelCount = (await testGeminiKey({ data: { id } })).models?.length ?? 0;
			toast.success(`Clé fonctionnelle ! ${modelCount} modèlen(s) détecté(s) chez Google.`);
			qc.invalidateQueries({ queryKey: ["gemini-keys"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Clé inaccessible");
		} finally {
			setTestingId(null);
		}
	};
	const remove = async (id) => {
		if (!confirm("Supprimer cette clé ?")) return;
		await deleteGeminiKey({ data: { id } });
		qc.invalidateQueries({ queryKey: ["gemini-keys"] });
		toast.success("Supprimée");
	};
	const toggle = async (id, is_active) => {
		await toggleGeminiKey({ data: {
			id,
			is_active
		} });
		qc.invalidateQueries({ queryKey: ["gemini-keys"] });
	};
	const resetAll = async () => {
		try {
			await resetAllGeminiKeys();
			toast.success("Toutes les clés ont été réactivées et réinitialisées.");
			qc.invalidateQueries({ queryKey: ["gemini-keys"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex items-start justify-between gap-4 flex-wrap",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
				className: "text-3xl font-bold gradient-text",
				children: "Clés API Gemini"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 105,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-muted-foreground mt-1",
				children: [
					"Prise en charge universelle des clés Google Gemini (formats",
					" ",
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "font-mono text-foreground font-semibold",
						children: "AIza..."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 108,
						columnNumber: 13
					}, this),
					" et nouveaux formats ",
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "font-mono text-foreground font-semibold",
						children: "AQ..."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 109,
						columnNumber: 21
					}, this),
					") —",
					" ",
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-foreground font-medium",
						children: [
							data.filter((k) => k.is_active).length,
							"/",
							data.length
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 110,
						columnNumber: 13
					}, this),
					" ",
					"actives."
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 106,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 104,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center gap-2",
				children: [data.length > 0 && /* @__PURE__ */ (void 0)(Button, {
					variant: "outline",
					onClick: resetAll,
					title: "Réinitialiser le statut de toutes les clés",
					children: [/* @__PURE__ */ (void 0)(RotateCcw, { className: "h-4 w-4 mr-2" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 118,
						columnNumber: 15
					}, this), "Réinitialiser"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 117,
					columnNumber: 31
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
					open,
					onOpenChange: setOpen,
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							disabled: data.length >= 20,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4 mr-2" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 124,
								columnNumber: 17
							}, this), "Ajouter une clé"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 123,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 122,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: "Nouvelle clé Gemini" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 130,
							columnNumber: 17
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 129,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Étiquette (Nom)" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 134,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									value: form.label,
									onChange: (e) => setForm({
										...form,
										label: e.target.value
									}),
									placeholder: "Ex : Compte principal"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 135,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 133,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Clé API Google Gemini" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 141,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										type: "password",
										value: form.api_key,
										onChange: (e) => setForm({
											...form,
											api_key: e.target.value
										}),
										placeholder: "AIza... ou AQ..."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 142,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs text-muted-foreground mt-1",
										children: [
											"Les clés commençant par ",
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "AIza..." }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 147,
												columnNumber: 45
											}, this),
											" ou ",
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "AQ..." }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 147,
												columnNumber: 73
											}, this),
											" sont toutes deux prises en charge. Obtenez une clé sur",
											" ",
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
												href: "https://aistudio.google.com/apikey",
												target: "_blank",
												rel: "noreferrer",
												className: "underline text-primary",
												children: "aistudio.google.com/apikey"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 149,
												columnNumber: 21
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 146,
										columnNumber: 19
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 140,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Switch, {
										checked: form.is_active,
										onCheckedChange: (v) => setForm({
											...form,
											is_active: v
										})
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 155,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Active immédiatement" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 159,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 154,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 132,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "ghost",
							onClick: () => setOpen(false),
							children: "Annuler"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 163,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: save,
							children: "Enregistrer & Valider"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 166,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 162,
							columnNumber: 15
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 128,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 121,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 116,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 103,
			columnNumber: 7
		}, this), data.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "glass p-12 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(KeyRound, { className: "h-10 w-10 text-primary mx-auto mb-3" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 174,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-muted-foreground",
				children: "Aucune clé Gemini. Ajoutez-en pour activer les réponses IA."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 175,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 173,
			columnNumber: 28
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-2",
			children: data.map((k) => {
				const disabled = k.disabled_until && new Date(k.disabled_until) > /* @__PURE__ */ new Date();
				const isTesting = testingId === k.id;
				return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
					className: "glass p-4 flex items-center gap-4 flex-wrap sm:flex-nowrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(KeyRound, { className: "h-5 w-5 text-muted-foreground shrink-0" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 183,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex-1 min-w-0",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-medium truncate",
										children: k.label
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 186,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
										className: "text-xs text-muted-foreground",
										children: k.api_key_masked
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 187,
										columnNumber: 21
									}, this),
									disabled && /* @__PURE__ */ (void 0)(Badge, {
										variant: "destructive",
										children: [
											"En pause (",
											k.error_count,
											" err)"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 188,
										columnNumber: 34
									}, this),
									k.last_used_at && !disabled && /* @__PURE__ */ (void 0)(Badge, {
										variant: "secondary",
										children: "Active"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 189,
										columnNumber: 53
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 185,
								columnNumber: 19
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 184,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2 ml-auto",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "sm",
									variant: "outline",
									disabled: isTesting,
									onClick: () => testKey(k.id),
									title: "Tester la clé auprès de Google Gemini API",
									children: isTesting ? "Test en cours..." : "Tester la clé"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 193,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Switch, {
									checked: k.is_active,
									onCheckedChange: (v) => toggle(k.id, v)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 196,
									columnNumber: 19
								}, this),
								disabled && /* @__PURE__ */ (void 0)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => toggle(k.id, true),
									title: "Réactiver",
									children: /* @__PURE__ */ (void 0)(RotateCcw, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 198,
										columnNumber: 23
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 197,
									columnNumber: 32
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => remove(k.id),
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-4 w-4 text-destructive" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 201,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 200,
									columnNumber: 19
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 192,
							columnNumber: 17
						}, this)
					]
				}, k.id, true, {
					fileName: _jsxFileName,
					lineNumber: 182,
					columnNumber: 16
				}, this);
			})
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 178,
			columnNumber: 19
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 102,
		columnNumber: 10
	}, this);
}
//#endregion
export { ApiKeysPage as component };
