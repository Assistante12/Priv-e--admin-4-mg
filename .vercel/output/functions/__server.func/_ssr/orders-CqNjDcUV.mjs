import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { r as createServerFn } from "./server-D9pwzi9_.mjs";
import { t as requireWorkspaceAuth } from "./workspace-middleware-CoslEc7v.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CQ1D8k7I.mjs";
import { a as objectType, i as numberType, o as stringType, r as enumType } from "../_libs/zod.mjs";
import { i as useQuery, o as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { $ as Check, J as ClipboardList, T as Package, l as Trash2, n as X } from "../_libs/lucide-react.mjs";
import { t as Card } from "./card-CWKLgPMR.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Badge } from "./badge-Di9TvE8n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-CqNjDcUV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var listOrders = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ type: enumType([
	"training",
	"sales",
	"all"
]).optional() }).parse(d)).handler(createSsrRpc("e004c3669ad9314e0f13dd8e45194bd1d7a95f814599b1d8484097691817695f"));
var createSchema = objectType({
	type: enumType(["training", "sales"]),
	training_id: stringType().uuid().nullable().optional(),
	product_id: stringType().uuid().nullable().optional(),
	client_fb_id: stringType().max(200).nullable().optional(),
	client_fb_name: stringType().max(200).nullable().optional(),
	client_whatsapp: stringType().max(50).nullable().optional(),
	client_phone: stringType().max(50).nullable().optional(),
	payment_reference: stringType().max(200).nullable().optional(),
	quantity: numberType().int().min(1).default(1),
	notes: stringType().max(2e3).nullable().optional(),
	page_id: stringType().max(200).nullable().optional(),
	status: enumType([
		"pending",
		"awaiting_payment",
		"payment_sent",
		"accepted",
		"refused",
		"delivered"
	]).default("pending")
});
createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => createSchema.parse(d)).handler(createSsrRpc("7f92d135aa3763ddd5bf6d4d9f84832b6b591cbaa35dcc4048b4b1beed8e7bf3"));
var updateOrderStatus = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	status: enumType([
		"pending",
		"awaiting_payment",
		"payment_sent",
		"accepted",
		"refused",
		"delivered"
	])
}).parse(d)).handler(createSsrRpc("ce3247af923fb83e1b50e04a2d3399abe6b8ac7e9c8330b2019de9668492b17f"));
var deleteOrder = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("44cca4472781b72fce225eb66a79e7db8b18f0231cf73c6a965748d52107bf55"));
var _jsxFileName = "/app/applet/src/routes/_authenticated/orders.tsx?tsr-split=component";
var STATUS_LABELS = {
	pending: "En attente",
	awaiting_payment: "Attente paiement",
	payment_sent: "Paiement envoyé",
	accepted: "Accepté",
	refused: "Refusé",
	delivered: "Livré"
};
var STATUS_COLORS = {
	pending: "bg-warning/20 text-warning",
	awaiting_payment: "bg-warning/20 text-warning",
	payment_sent: "bg-primary/20 text-primary",
	accepted: "bg-accent/20 text-accent",
	refused: "bg-destructive/20 text-destructive",
	delivered: "bg-accent/20 text-accent"
};
function OrdersPage() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("all");
	const qc = useQueryClient();
	const { data: orders = [], isLoading } = useQuery({
		queryKey: ["orders", activeTab],
		queryFn: async () => {
			try {
				return await listOrders({ data: { type: activeTab } });
			} catch (e) {
				console.warn("Orders query error", e);
				return [];
			}
		}
	});
	const setStatus = async (id, status) => {
		try {
			const res = await updateOrderStatus({ data: {
				id,
				status
			} });
			toast.success(res?.notified ? "Statut mis à jour — confirmation envoyée au client" : "Statut mis à jour");
			qc.invalidateQueries({ queryKey: ["orders"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur");
		}
	};
	const remove = async (id) => {
		if (!confirm("Supprimer cette commande ?")) return;
		await deleteOrder({ data: { id } });
		qc.invalidateQueries({ queryKey: ["orders"] });
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex items-center justify-between flex-wrap gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
				className: "text-3xl font-bold gradient-text flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ClipboardList, { className: "h-8 w-8" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 78,
					columnNumber: 13
				}, this), " Commandes"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 77,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-muted-foreground mt-1",
				children: "Vérifiez et validez toutes les commandes créées automatiquement par l'IA."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 80,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 76,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex gap-2 bg-muted/40 p-1 rounded-lg border border-border/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						size: "sm",
						variant: activeTab === "all" ? "default" : "ghost",
						onClick: () => setActiveTab("all"),
						children: "Toutes"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 87,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						size: "sm",
						variant: activeTab === "sales" ? "default" : "ghost",
						onClick: () => setActiveTab("sales"),
						children: "Ventes (Produits)"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 90,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						size: "sm",
						variant: activeTab === "training" ? "default" : "ghost",
						onClick: () => setActiveTab("training"),
						children: "Formations"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 93,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 86,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 75,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "space-y-3",
			children: [orders.map((o) => {
				const itemTitle = o.products?.name ?? o.trainings?.name ?? (o.notes && o.notes.startsWith("Article:") ? o.notes.replace("Article:", "").trim() : null) ?? "Commande produit";
				return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
					className: "glass p-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-start justify-between flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Package, { className: "h-4 w-4 text-primary" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 106,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-semibold text-lg",
										children: itemTitle
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 107,
										columnNumber: 21
									}, this),
									o.quantity > 1 && /* @__PURE__ */ (void 0)("span", {
										className: "text-xs font-semibold px-2 py-0.5 rounded bg-muted",
										children: ["×", o.quantity]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 108,
										columnNumber: 40
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
										className: STATUS_COLORS[o.status] || "bg-muted text-foreground",
										children: STATUS_LABELS[o.status] || o.status
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 111,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
										variant: "outline",
										className: "text-xs uppercase",
										children: o.type === "training" ? "Formation" : "Vente"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 114,
										columnNumber: 21
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 105,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-xs text-muted-foreground",
								children: ["Créée le ", new Date(o.created_at).toLocaleString()]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 118,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 104,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex gap-1",
							children: [
								o.status !== "accepted" && o.status !== "delivered" && /* @__PURE__ */ (void 0)(Button, {
									size: "sm",
									variant: "default",
									onClick: () => setStatus(o.id, "accepted"),
									children: [/* @__PURE__ */ (void 0)(Check, { className: "h-4 w-4 mr-1" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 125,
										columnNumber: 23
									}, this), "Accepter"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 124,
									columnNumber: 75
								}, this),
								o.status !== "refused" && /* @__PURE__ */ (void 0)(Button, {
									size: "sm",
									variant: "secondary",
									onClick: () => setStatus(o.id, "refused"),
									children: [/* @__PURE__ */ (void 0)(X, { className: "h-4 w-4 mr-1" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 129,
										columnNumber: 23
									}, this), "Refuser"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 128,
									columnNumber: 46
								}, this),
								o.status === "accepted" && /* @__PURE__ */ (void 0)(Button, {
									size: "sm",
									variant: "default",
									onClick: () => setStatus(o.id, "delivered"),
									children: "Marquer livré"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 132,
									columnNumber: 47
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => remove(o.id),
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-4 w-4 text-destructive" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 136,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 135,
									columnNumber: 19
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 123,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 103,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid sm:grid-cols-2 gap-2 text-sm bg-muted/40 rounded-lg p-3.5 border border-border/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-muted-foreground font-medium",
									children: "Nom Mpanjifa (Facebook) :"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 143,
									columnNumber: 19
								}, this),
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-semibold text-foreground",
									children: o.client_fb_name || "Mpanjifa Messenger"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 146,
									columnNumber: 19
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 142,
								columnNumber: 17
							}, this),
							(o.client_phone || o.client_whatsapp) && /* @__PURE__ */ (void 0)("div", { children: [
								/* @__PURE__ */ (void 0)("span", {
									className: "text-muted-foreground font-medium",
									children: "Laharana Finday / Phone :"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 152,
									columnNumber: 21
								}, this),
								" ",
								/* @__PURE__ */ (void 0)("span", {
									className: "font-semibold text-primary",
									children: o.client_phone || o.client_whatsapp
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 155,
									columnNumber: 21
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 151,
								columnNumber: 59
							}, this),
							o.client_whatsapp && o.client_whatsapp !== o.client_phone && /* @__PURE__ */ (void 0)("div", { children: [
								/* @__PURE__ */ (void 0)("span", {
									className: "text-muted-foreground font-medium",
									children: "WhatsApp :"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 161,
									columnNumber: 21
								}, this),
								" ",
								/* @__PURE__ */ (void 0)("span", {
									className: "font-semibold",
									children: o.client_whatsapp
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 162,
									columnNumber: 21
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 160,
								columnNumber: 79
							}, this),
							o.client_address && /* @__PURE__ */ (void 0)("div", {
								className: "col-span-full",
								children: [
									/* @__PURE__ */ (void 0)("span", {
										className: "text-muted-foreground font-medium",
										children: "Adiresy Mazava / Adresse :"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 166,
										columnNumber: 21
									}, this),
									" ",
									/* @__PURE__ */ (void 0)("span", {
										className: "font-medium text-foreground bg-background/60 px-2 py-0.5 rounded",
										children: o.client_address
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 169,
										columnNumber: 21
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 165,
								columnNumber: 38
							}, this),
							o.payment_reference && /* @__PURE__ */ (void 0)("div", { children: [
								/* @__PURE__ */ (void 0)("span", {
									className: "text-muted-foreground font-medium",
									children: "Réf. Paiement :"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 175,
									columnNumber: 21
								}, this),
								" ",
								/* @__PURE__ */ (void 0)("span", {
									className: "font-mono text-xs bg-primary/10 px-2 py-0.5 rounded text-primary",
									children: o.payment_reference
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 176,
									columnNumber: 21
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 174,
								columnNumber: 41
							}, this),
							o.notes && !o.notes.startsWith("Article:") && /* @__PURE__ */ (void 0)("div", {
								className: "col-span-full",
								children: [
									/* @__PURE__ */ (void 0)("span", {
										className: "text-muted-foreground font-medium",
										children: "Notes / Tsindrim-peo :"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 182,
										columnNumber: 21
									}, this),
									" ",
									/* @__PURE__ */ (void 0)("span", { children: o.notes }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 185,
										columnNumber: 21
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 181,
								columnNumber: 64
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 141,
						columnNumber: 15
					}, this)]
				}, o.id, true, {
					fileName: _jsxFileName,
					lineNumber: 102,
					columnNumber: 16
				}, this);
			}), orders.length === 0 && !isLoading && /* @__PURE__ */ (void 0)(Card, {
				className: "glass p-8 text-center text-muted-foreground",
				children: "Mbola tsy misy commande voaray (Aucune commande pour le moment)."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 191,
				columnNumber: 47
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 99,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 74,
		columnNumber: 10
	}, this);
}
//#endregion
export { OrdersPage as component };
