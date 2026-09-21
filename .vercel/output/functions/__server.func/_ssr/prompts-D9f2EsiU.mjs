import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { o as useQueryClient, r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { $ as Check, S as Plus, d as Sparkles, l as Trash2, w as Pencil } from "../_libs/lucide-react.mjs";
import { P as upsertPrompt, a as promptsQuery, i as pagesQuery, w as deletePrompt } from "./router-BAc73aWw.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Card } from "./card-CWKLgPMR.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { t as Switch } from "./switch-Bij46GIi.mjs";
import { t as Badge } from "./badge-Di9TvE8n.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-B0Ygdo8b.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2jkrRSx7.mjs";
import { t as Textarea } from "./textarea-DAtqJF9T.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prompts-D9f2EsiU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/ui/checkbox.tsx";
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 20,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 19,
		columnNumber: 5
	}, void 0)
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 11,
	columnNumber: 3
}, void 0));
Checkbox.displayName = Checkbox$1.displayName;
var _jsxFileName = "/app/applet/src/routes/_authenticated/prompts.tsx?tsr-split=component";
var CATEGORY_LABELS = {
	global: "Global",
	message: "Messages privés",
	comment: "Commentaires",
	md: "Messages directs (MD)",
	tutorial: "Tutoriels"
};
var TYPE_LABELS = {
	online_work: "Travail en ligne",
	training: "Formation",
	sales: "Vente"
};
var ALL_TYPES = "__all__";
function PromptsPage() {
	const { data } = useSuspenseQuery(promptsQuery);
	const { data: pages } = useSuspenseQuery(pagesQuery);
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		content: "",
		category: "global",
		is_active: true,
		page_ids: [],
		assistance_type: ALL_TYPES
	});
	const openNew = () => {
		setEditing(null);
		setForm({
			name: "",
			content: "",
			category: "global",
			is_active: true,
			page_ids: [],
			assistance_type: ALL_TYPES
		});
		setOpen(true);
	};
	const openEdit = (p) => {
		setEditing(p);
		setForm({
			name: p.name,
			content: p.content,
			category: p.category,
			is_active: p.is_active,
			page_ids: p.page_ids?.length ? p.page_ids : p.page_id ? [p.page_id] : [],
			assistance_type: p.assistance_type ?? ALL_TYPES
		});
		setOpen(true);
	};
	const togglePage = (pid) => setForm((f) => ({
		...f,
		page_ids: f.page_ids.includes(pid) ? f.page_ids.filter((x) => x !== pid) : [...f.page_ids, pid]
	}));
	const save = async () => {
		if (form.page_ids.length === 0) {
			toast.error("Choisissez au moins une page Facebook");
			return;
		}
		const categoryLabel = CATEGORY_LABELS[form.category] || form.category;
		const finalName = form.name.trim() || `Prompt ${categoryLabel}`;
		try {
			await upsertPrompt({ data: {
				id: editing?.id,
				name: finalName,
				content: form.content,
				category: form.category,
				is_active: form.is_active,
				page_ids: form.page_ids,
				assistance_type: form.assistance_type === ALL_TYPES ? null : form.assistance_type
			} });
			toast.success("Prompt enregistré");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["prompts"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur");
		}
	};
	const remove = async (id) => {
		if (!confirm("Supprimer ce prompt ?")) return;
		await deletePrompt({ data: { id } });
		toast.success("Supprimé");
		qc.invalidateQueries({ queryKey: ["prompts"] });
	};
	const pageNames = (p) => {
		const ids = p.page_ids?.length ? p.page_ids : p.page_id ? [p.page_id] : [];
		if (ids.length === 0) return ["Aucune page"];
		return ids.map((pid) => pages.find((x) => x.page_id === pid)?.page_name ?? pid);
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex items-start justify-between gap-4 flex-wrap",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
				className: "text-3xl font-bold gradient-text",
				children: "Prompts IA"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 129,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-muted-foreground mt-1",
				children: "Instructions envoyées à l'IA. Une page sans prompt attribué ne recevra pas de réponse automatique."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 130,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 128,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						onClick: openNew,
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4 mr-2" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 138,
							columnNumber: 15
						}, this), "Nouveau prompt"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 137,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 136,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-2xl max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: editing ? "Modifier le prompt" : "Nouveau prompt" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 144,
							columnNumber: 15
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 143,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Nom" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 148,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									value: form.name,
									onChange: (e) => setForm({
										...form,
										name: e.target.value
									}),
									placeholder: "Ex : Ton de la marque"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 149,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 147,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Catégorie" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 155,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
									value: form.category,
									onValueChange: (v) => setForm({
										...form,
										category: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 161,
										columnNumber: 21
									}, this) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 160,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: Object.entries(CATEGORY_LABELS).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
										value: k,
										children: v
									}, k, false, {
										fileName: _jsxFileName,
										lineNumber: 164,
										columnNumber: 70
									}, this)) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 163,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 156,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 154,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Pages Facebook (sélection multiple)" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 172,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												type: "button",
												variant: "ghost",
												size: "sm",
												onClick: () => setForm({
													...form,
													page_ids: pages.map((p) => p.page_id)
												}),
												children: "Tout cocher"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 174,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												type: "button",
												variant: "ghost",
												size: "sm",
												onClick: () => setForm({
													...form,
													page_ids: []
												}),
												children: "Tout décocher"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 180,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 173,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 171,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "mt-2 max-h-52 overflow-y-auto rounded-md border border-input divide-y divide-border",
										children: [pages.length === 0 && /* @__PURE__ */ (void 0)("p", {
											className: "p-3 text-sm text-muted-foreground",
											children: "Aucune page connectée."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 189,
											columnNumber: 42
										}, this), pages.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
											className: "flex items-center gap-3 p-2 text-sm cursor-pointer hover:bg-accent",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Checkbox, {
												checked: form.page_ids.includes(p.page_id),
												onCheckedChange: () => togglePage(p.page_id)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 191,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: p.page_name ?? p.page_id }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 192,
												columnNumber: 23
											}, this)]
										}, p.id, true, {
											fileName: _jsxFileName,
											lineNumber: 190,
											columnNumber: 35
										}, this))]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 188,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs text-muted-foreground mt-1",
										children: "Ce prompt ne s'appliquera qu'aux pages cochées. Une page sans prompt n'aura pas de réponse IA."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 195,
										columnNumber: 17
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 170,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Type d'assistance" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 201,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
									value: form.assistance_type,
									onValueChange: (v) => setForm({
										...form,
										assistance_type: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 207,
										columnNumber: 21
									}, this) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 206,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
										value: ALL_TYPES,
										children: "Tous les types"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 210,
										columnNumber: 21
									}, this), Object.entries(TYPE_LABELS).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
										value: k,
										children: v
									}, k, false, {
										fileName: _jsxFileName,
										lineNumber: 211,
										columnNumber: 66
									}, this))] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 209,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 202,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 200,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Contenu" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 218,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
									value: form.content,
									onChange: (e) => setForm({
										...form,
										content: e.target.value
									}),
									rows: 10,
									placeholder: "Vous êtes une assistante virtuelle sympathique qui répond en malgache..."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 219,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 217,
									columnNumber: 15
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
										lineNumber: 225,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Actif" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 229,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 224,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 146,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "ghost",
							onClick: () => setOpen(false),
							children: "Annuler"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 233,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: save,
							children: "Enregistrer"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 236,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 232,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 142,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 135,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 127,
			columnNumber: 7
		}, this), data.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "glass p-12 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "h-10 w-10 text-primary mx-auto mb-3" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 243,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-muted-foreground",
				children: "Aucun prompt encore. Créez-en un pour guider votre IA."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 244,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 242,
			columnNumber: 28
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: data.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "glass p-4",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
									className: "font-semibold",
									children: p.name
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 252,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
									variant: "secondary",
									children: CATEGORY_LABELS[p.category] ?? p.category
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 253,
									columnNumber: 21
								}, this),
								pageNames(p).map((n) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
									variant: "outline",
									children: n
								}, n, false, {
									fileName: _jsxFileName,
									lineNumber: 254,
									columnNumber: 44
								}, this)),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
									variant: "outline",
									children: p.assistance_type ? TYPE_LABELS[p.assistance_type] ?? p.assistance_type : "Tous les types"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 257,
									columnNumber: 21
								}, this),
								p.is_active ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
									className: "bg-success text-success-foreground",
									children: "Actif"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 260,
									columnNumber: 36
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
									variant: "outline",
									children: "Inactif"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 260,
									columnNumber: 106
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 251,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-sm text-muted-foreground mt-2 line-clamp-3 whitespace-pre-wrap",
							children: p.content
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 262,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 250,
						columnNumber: 17
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "icon",
							variant: "ghost",
							onClick: () => openEdit(p),
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pencil, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 268,
								columnNumber: 21
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 267,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "icon",
							variant: "ghost",
							onClick: () => remove(p.id),
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-4 w-4 text-destructive" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 271,
								columnNumber: 21
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 270,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 266,
						columnNumber: 17
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 249,
					columnNumber: 15
				}, this)
			}, p.id, false, {
				fileName: _jsxFileName,
				lineNumber: 248,
				columnNumber: 43
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 247,
			columnNumber: 19
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 126,
		columnNumber: 10
	}, this);
}
//#endregion
export { PromptsPage as component };
