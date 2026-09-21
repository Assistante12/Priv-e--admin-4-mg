import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { r as createServerFn } from "./server-BRvJ2kb2.mjs";
import { t as requireWorkspaceAuth } from "./workspace-middleware-DCv0kXWS.mjs";
import { t as createSsrRpc } from "./createSsrRpc-6Bh1AQeg.mjs";
import { a as objectType, n as booleanType, o as stringType } from "../_libs/zod.mjs";
import { i as useQuery, o as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { K as CreditCard, S as Plus, l as Trash2, u as SquarePen } from "../_libs/lucide-react.mjs";
import { t as Card } from "./card-CWKLgPMR.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { t as Switch } from "./switch-Bij46GIi.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-B0Ygdo8b.mjs";
import { t as Textarea } from "./textarea-DAtqJF9T.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments--kr18XM0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var listPaymentMethods = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(createSsrRpc("0199c1b4c7815097660cf09f26437f3e4bd7df28b5b33595a666b42732424271"));
var upsertSchema = objectType({
	id: stringType().nullable().optional(),
	label: stringType().min(1).max(100),
	number: stringType().min(1).max(100),
	instructions: stringType().max(1e3).nullable().optional(),
	is_active: booleanType().default(true)
});
var upsertPaymentMethod = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => upsertSchema.parse(d)).handler(createSsrRpc("853b5aa544a7c0a49cc45c1a0f420af5e069af898c609aa61d87c33899afd2a3"));
var deletePaymentMethod = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("55fc0484b9941926147081b475de8d7569a7391edff13c9e7550b50cc47da0d3"));
var _jsxFileName = "/app/applet/src/routes/_authenticated/payments.tsx?tsr-split=component";
function PaymentsPage() {
	const qc = useQueryClient();
	const { data: items = [] } = useQuery({
		queryKey: ["payment-methods"],
		queryFn: async () => {
			try {
				return await listPaymentMethods();
			} catch (e) {
				console.warn("Payment methods query error", e);
				return [];
			}
		}
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		id: void 0,
		label: "",
		number: "",
		instructions: "",
		is_active: true
	});
	const openNew = () => {
		setForm({
			id: void 0,
			label: "",
			number: "",
			instructions: "",
			is_active: true
		});
		setOpen(true);
	};
	const openEdit = (p) => {
		setForm({
			id: p.id,
			label: p.label,
			number: p.number,
			instructions: p.instructions ?? "",
			is_active: p.is_active
		});
		setOpen(true);
	};
	const save = async () => {
		try {
			await upsertPaymentMethod({ data: {
				...form,
				instructions: form.instructions || null
			} });
			toast.success("Enregistré");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["payment-methods"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur");
		}
	};
	const del = async (id) => {
		if (!confirm("Supprimer ?")) return;
		await deletePaymentMethod({ data: { id } });
		qc.invalidateQueries({ queryKey: ["payment-methods"] });
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center justify-between flex-wrap gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-3xl font-bold gradient-text flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CreditCard, { className: "h-8 w-8" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 88,
						columnNumber: 13
					}, this), " Méthodes de paiement"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 87,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-muted-foreground mt-1",
					children: "Numéros MVola, Airtel Money, Orange Money… envoyés au client par l'IA."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 90,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 86,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					onClick: openNew,
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4 mr-2" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 95,
						columnNumber: 11
					}, this), "Nouvelle méthode"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 94,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 85,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-3",
				children: [items.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
					className: "glass p-4 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "font-semibold",
							children: [
								p.label,
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-primary",
									children: ["— ", p.number]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 104,
									columnNumber: 27
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 103,
							columnNumber: 15
						}, this),
						p.instructions && /* @__PURE__ */ (void 0)("div", {
							className: "text-xs text-muted-foreground whitespace-pre-wrap",
							children: p.instructions
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 106,
							columnNumber: 34
						}, this),
						!p.is_active && /* @__PURE__ */ (void 0)("div", {
							className: "text-xs text-warning",
							children: "Inactif"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 109,
							columnNumber: 32
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 102,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "icon",
							variant: "ghost",
							onClick: () => openEdit(p),
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SquarePen, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 113,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 112,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "icon",
							variant: "ghost",
							onClick: () => del(p.id),
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-4 w-4 text-destructive" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 116,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 115,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 111,
						columnNumber: 13
					}, this)]
				}, p.id, true, {
					fileName: _jsxFileName,
					lineNumber: 101,
					columnNumber: 32
				}, this)), items.length === 0 && /* @__PURE__ */ (void 0)(Card, {
					className: "glass p-8 text-center text-muted-foreground",
					children: "Aucune méthode."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 120,
					columnNumber: 32
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 100,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: form.id ? "Modifier" : "Nouvelle méthode" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 126,
					columnNumber: 13
				}, this) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 125,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Nom (ex : MVola)" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 130,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							value: form.label,
							onChange: (e) => setForm({
								...form,
								label: e.target.value
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 131,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 129,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Numéro" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 137,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							value: form.number,
							onChange: (e) => setForm({
								...form,
								number: e.target.value
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 138,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 136,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Instructions (optionnel)" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 144,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
							rows: 3,
							value: form.instructions,
							onChange: (e) => setForm({
								...form,
								instructions: e.target.value
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 145,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 143,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Actif" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 151,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Switch, {
								checked: form.is_active,
								onCheckedChange: (v) => setForm({
									...form,
									is_active: v
								})
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 152,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 150,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: save,
							className: "w-full",
							children: "Enregistrer"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 157,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 128,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 124,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 123,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 84,
		columnNumber: 10
	}, this);
}
//#endregion
export { PaymentsPage as component };
