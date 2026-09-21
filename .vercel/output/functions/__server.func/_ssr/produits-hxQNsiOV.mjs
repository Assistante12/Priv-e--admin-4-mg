import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { r as createServerFn } from "./server-D9pwzi9_.mjs";
import { t as requireWorkspaceAuth } from "./workspace-middleware-CoslEc7v.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CQ1D8k7I.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, r as enumType } from "../_libs/zod.mjs";
import { i as useQuery, o as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { L as Image$1, S as Plus, f as ShoppingBag, l as Trash2, n as X, u as SquarePen } from "../_libs/lucide-react.mjs";
import { t as Card } from "./card-CWKLgPMR.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { t as Switch } from "./switch-Bij46GIi.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-B0Ygdo8b.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2jkrRSx7.mjs";
import { t as Textarea } from "./textarea-DAtqJF9T.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/produits-hxQNsiOV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var listProducts = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(createSsrRpc("51ad93d03c52987e0e52d0164e41771f8765a8919d8a537367eaf795dff9b9d8"));
var uploadImageSchema = objectType({
	product_id: stringType().uuid(),
	data_base64: stringType().min(1),
	content_type: stringType().default("image/jpeg"),
	filename: stringType().optional(),
	sort_order: numberType().int().default(0)
});
var uploadProductImageServer = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => uploadImageSchema.parse(d)).handler(createSsrRpc("73194ecd5678bb8991c7deca8a6ecf50be7fccd1d7dcc7e8df175a99f5e1d987"));
var upsertSchema = objectType({
	id: stringType().nullable().optional(),
	name: stringType().min(1, "Veuillez renseigner le nom du produit").max(200),
	price: numberType().min(0),
	stock: numberType().int().min(0),
	description: stringType().max(5e3).nullable().optional(),
	payment_flow: enumType(["admin_numbers", "client_contact"]),
	is_active: booleanType().default(true)
});
var upsertProduct = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => upsertSchema.parse(d)).handler(createSsrRpc("3b4a3c54812b4c0b1ed31ec62bbf2a64c77b8c36025f31e942058a97a061226e"));
var deleteProduct = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("154b8633eea94111b40f7036631572cb49e5f458d27dce468c3338ae0c0dc0db"));
createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({
	product_id: stringType().uuid(),
	image_path: stringType().min(1).max(500),
	sort_order: numberType().int().default(0)
}).parse(d)).handler(createSsrRpc("7a9e83ca489366d7ffab2aacbcb4ec98ba75f6b93aff08fb46695dd1366cc853"));
var deleteProductImage = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("77cbf8b7a360c88aa467c19f7d3bd7de806ac6a7af905570781567f7fae073ce"));
var _jsxFileName = "/app/applet/src/routes/_authenticated/produits.tsx?tsr-split=component";
var emptyForm = {
	id: void 0,
	name: "",
	price: 0,
	stock: 0,
	description: "",
	payment_flow: "admin_numbers",
	is_active: true
};
function ProduitsPage() {
	const qc = useQueryClient();
	const { data: items = [] } = useQuery({
		queryKey: ["products"],
		queryFn: async () => {
			try {
				return await listProducts();
			} catch (e) {
				console.warn("Products query error", e);
				return [];
			}
		}
	});
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [gallery, setGallery] = (0, import_react.useState)(null);
	const openNew = () => {
		setForm(emptyForm);
		setOpen(true);
	};
	const openEdit = (p) => {
		setForm({
			id: p.id,
			name: p.name,
			price: Number(p.price),
			stock: p.stock,
			description: p.description ?? "",
			payment_flow: p.payment_flow,
			is_active: p.is_active
		});
		setOpen(true);
	};
	const save = async () => {
		try {
			await upsertProduct({ data: {
				id: form.id,
				name: form.name,
				price: Number(form.price),
				stock: Number(form.stock),
				description: form.description || null,
				payment_flow: form.payment_flow,
				is_active: form.is_active
			} });
			toast.success("Produit enregistré");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["products"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur");
		}
	};
	const del = async (id) => {
		if (!confirm("Supprimer ce produit ?")) return;
		await deleteProduct({ data: { id } });
		qc.invalidateQueries({ queryKey: ["products"] });
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center justify-between flex-wrap gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-3xl font-bold gradient-text flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShoppingBag, { className: "h-8 w-8" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 95,
						columnNumber: 13
					}, this), " Produits"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 94,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-muted-foreground mt-1",
					children: "Gérez votre catalogue et vos stocks."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 97,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 93,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					onClick: openNew,
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4 mr-2" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 100,
						columnNumber: 11
					}, this), "Nouveau produit"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 99,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 92,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
				children: [items.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
					className: "glass p-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "aspect-square bg-muted rounded-lg overflow-hidden",
							children: p.product_images?.[0]?.url ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
								src: p.product_images[0].url,
								alt: p.name,
								className: "w-full h-full object-cover"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 108,
								columnNumber: 45
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "w-full h-full flex items-center justify-center text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Image$1, { className: "h-10 w-10" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 109,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 108,
								columnNumber: 137
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 107,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "font-semibold",
								children: p.name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 113,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-sm text-primary font-bold",
								children: [Number(p.price).toLocaleString(), " Ar"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 114,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									"Stock : ",
									p.stock,
									" — ",
									p.product_images?.length ?? 0,
									" image(s)"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 117,
								columnNumber: 15
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 112,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "sm",
									variant: "secondary",
									className: "flex-1",
									onClick: () => setGallery(p),
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Image$1, { className: "h-4 w-4 mr-1" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 123,
										columnNumber: 17
									}, this), "Galerie"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 122,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => openEdit(p),
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SquarePen, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 127,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 126,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => del(p.id),
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-4 w-4 text-destructive" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 130,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 129,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 121,
							columnNumber: 13
						}, this)
					]
				}, p.id, true, {
					fileName: _jsxFileName,
					lineNumber: 106,
					columnNumber: 32
				}, this)), items.length === 0 && /* @__PURE__ */ (void 0)(Card, {
					className: "glass p-8 text-center text-muted-foreground col-span-full",
					children: "Aucun produit."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 134,
					columnNumber: 32
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 105,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-lg",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: form.id ? "Modifier" : "Nouveau produit" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 142,
						columnNumber: 13
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 141,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Nom" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 146,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								value: form.name,
								onChange: (e) => setForm({
									...form,
									name: e.target.value
								})
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 147,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 145,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Prix (Ar)" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 153,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								type: "number",
								value: form.price,
								onChange: (e) => setForm({
									...form,
									price: Number(e.target.value)
								})
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 154,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 152,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Stock disponible" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 160,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								type: "number",
								value: form.stock,
								onChange: (e) => setForm({
									...form,
									stock: Number(e.target.value)
								})
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 161,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 159,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Description" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 167,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
								rows: 3,
								value: form.description,
								onChange: (e) => setForm({
									...form,
									description: e.target.value
								})
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 168,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 166,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Méthode de paiement" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 174,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
								value: form.payment_flow,
								onValueChange: (v) => setForm({
									...form,
									payment_flow: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 180,
									columnNumber: 19
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 179,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: "admin_numbers",
									children: "Envoyer numéros de paiement"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 183,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: "client_contact",
									children: "Demander contact client"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 184,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 182,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 175,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 173,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Actif" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 189,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Switch, {
									checked: form.is_active,
									onCheckedChange: (v) => setForm({
										...form,
										is_active: v
									})
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 190,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 188,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								onClick: save,
								className: "w-full",
								children: "Enregistrer"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 195,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 144,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 140,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 139,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GalleryDialog, {
				product: gallery,
				onClose: () => setGallery(null)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 202,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 91,
		columnNumber: 10
	}, this);
}
async function compressProductImage(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (event) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement("canvas");
				let { width, height } = img;
				const maxDim = 1200;
				if (width > maxDim || height > maxDim) {
					if (width > height) {
						height = Math.round(height * maxDim / width);
						width = maxDim;
					} else {
						width = Math.round(width * maxDim / height);
						height = maxDim;
					}
				}
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					reject(/* @__PURE__ */ new Error("Canvas context failed"));
					return;
				}
				ctx.drawImage(img, 0, 0, width, height);
				let quality = .75;
				let dataUrl = canvas.toDataURL("image/jpeg", quality);
				while (dataUrl.length * .75 > 102400 && quality > .2) {
					quality -= .1;
					dataUrl = canvas.toDataURL("image/jpeg", quality);
				}
				resolve({
					data_base64: dataUrl.split(",")[1] || "",
					content_type: "image/jpeg",
					filename: file.name.replace(/\.[^/.]+$/, "") + ".jpg"
				});
			};
			img.onerror = reject;
			img.src = event.target?.result;
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
function GalleryDialog({ product, onClose }) {
	const qc = useQueryClient();
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const maxImages = 50;
	const count = product?.product_images?.length ?? 0;
	const uploadFiles = async (files) => {
		if (!product) return;
		if (count + files.length > maxImages) {
			toast.error(`Maximum ${maxImages} images`);
			return;
		}
		setUploading(true);
		try {
			const fileList = Array.from(files);
			for (let i = 0; i < fileList.length; i++) {
				const file = fileList[i];
				const compressed = await compressProductImage(file);
				await uploadProductImageServer({ data: {
					product_id: product.id,
					data_base64: compressed.data_base64,
					content_type: compressed.content_type,
					filename: compressed.filename,
					sort_order: count + i
				} });
			}
			toast.success("Images ajoutées avec succès");
			qc.invalidateQueries({ queryKey: ["products"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur upload");
		} finally {
			setUploading(false);
		}
	};
	const removeImg = async (id) => {
		await deleteProductImage({ data: { id } });
		qc.invalidateQueries({ queryKey: ["products"] });
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
		open: !!product,
		onOpenChange: (v) => !v && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
			className: "max-w-3xl",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: [
				"Galerie — ",
				product?.name,
				" (",
				count,
				"/",
				maxImages,
				")"
			] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 314,
				columnNumber: 11
			}, this) }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 313,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-3 md:grid-cols-5 gap-2 max-h-96 overflow-y-auto",
					children: (product?.product_images ?? []).map((img) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "relative aspect-square bg-muted rounded overflow-hidden group",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
							src: img.url || img.image_path,
							alt: "",
							className: "w-full h-full object-cover"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 321,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							className: "absolute top-1 right-1 bg-destructive text-destructive-foreground rounded p-1 opacity-0 group-hover:opacity-100 transition",
							onClick: () => removeImg(img.id),
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-3 w-3" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 323,
								columnNumber: 19
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 322,
							columnNumber: 17
						}, this)]
					}, img.id, true, {
						fileName: _jsxFileName,
						lineNumber: 320,
						columnNumber: 64
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 319,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Ajouter des images" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 328,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						type: "file",
						accept: "image/*",
						multiple: true,
						disabled: uploading,
						onChange: (e) => {
							if (e.target.files && e.target.files.length > 0) {
								uploadFiles(e.target.files);
								e.target.value = "";
							}
						}
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 329,
						columnNumber: 13
					}, this),
					uploading && /* @__PURE__ */ (void 0)("p", {
						className: "text-xs text-primary font-medium mt-1",
						children: "Upload en cours…"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 335,
						columnNumber: 27
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs text-muted-foreground mt-1",
						children: "L'IA enverra 4 images à la fois au client, puis 4 autres à sa demande."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 336,
						columnNumber: 13
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 327,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 318,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 312,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 311,
		columnNumber: 10
	}, this);
}
//#endregion
export { ProduitsPage as component };
