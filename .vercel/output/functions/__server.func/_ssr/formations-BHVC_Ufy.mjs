import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { r as createServerFn } from "./server-BRvJ2kb2.mjs";
import { t as requireWorkspaceAuth } from "./workspace-middleware-DCv0kXWS.mjs";
import { t as createSsrRpc } from "./createSsrRpc-6Bh1AQeg.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, r as enumType } from "../_libs/zod.mjs";
import { i as useQuery, o as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { B as FilePlay, L as Image, M as Link2, R as GraduationCap, S as Plus, W as ExternalLink, l as Trash2, s as Upload, u as SquarePen, z as FileText } from "../_libs/lucide-react.mjs";
import { t as Card } from "./card-CWKLgPMR.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { t as Switch } from "./switch-Bij46GIi.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-B0Ygdo8b.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2jkrRSx7.mjs";
import { t as Textarea } from "./textarea-DAtqJF9T.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/formations-BHVC_Ufy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var listTrainings = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(createSsrRpc("26c96ef8fc4e3f784b8e2f35fdcadaba86bd11aa876dca3aafdda847af0d376d"));
var upsertSchema = objectType({
	id: stringType().nullable().optional(),
	name: stringType().min(1, "Veuillez renseigner le nom de la formation").max(200),
	description: stringType().max(5e3).nullable().optional(),
	pricing_type: enumType(["free", "paid"]),
	price: numberType().nullable().optional(),
	payment_flow: enumType(["admin_numbers", "client_contact"]).nullable().optional(),
	video_link: stringType().max(500).nullable().optional(),
	is_active: booleanType().default(true)
});
var upsertTraining = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => upsertSchema.parse(d)).handler(createSsrRpc("b2bcf1957c4e3511e2df455156a0eee94fbd878d1f8ed6ed23038bfff09c5e30"));
var deleteTraining = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("a6d2a211946cef37fc5004f226984e8fa811b98cd390031aac4d5759fbca9dcc"));
var addFileSchema = objectType({
	training_id: stringType().uuid(),
	file_path: stringType().nullable().optional(),
	file_type: enumType([
		"video",
		"pdf",
		"document",
		"link",
		"image"
	]),
	file_name: stringType().min(1).max(300),
	size_bytes: numberType().nullable().optional(),
	external_url: stringType().nullable().optional()
});
var addTrainingFile = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => addFileSchema.parse(d)).handler(createSsrRpc("51b547fe6c95f50b05cc8150afd34c0b3f3a304f79e38fb5dd56c9b964ebe0b8"));
var uploadTrainingFileSchema = objectType({
	training_id: stringType().uuid(),
	data_base64: stringType().optional(),
	content_type: stringType().optional(),
	file_type: enumType([
		"video",
		"pdf",
		"document",
		"link",
		"image"
	]),
	file_name: stringType().min(1).max(300),
	size_bytes: numberType().nullable().optional(),
	external_url: stringType().nullable().optional()
});
var uploadTrainingFileServer = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => uploadTrainingFileSchema.parse(d)).handler(createSsrRpc("fead9bb27632cd7f0a02f5753aad7882e325726d0656d34709ae381e1cc5ee31"));
var deleteTrainingFile = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("c735f2002ab50508e803574d0ff1c9be845aa8f917d54b0697bca4e23f0d6d5c"));
var getTrainingFileUrl = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ path: stringType() }).parse(d)).handler(createSsrRpc("35752f15047e6baaefbbae8dbe7f0399344e7c622efdef66edd7735c0b294ad4"));
var _jsxFileName = "/app/applet/src/routes/_authenticated/formations.tsx?tsr-split=component";
var emptyForm = {
	id: void 0,
	name: "",
	description: "",
	pricing_type: "free",
	price: 0,
	payment_flow: "admin_numbers",
	video_link: "",
	is_active: true
};
function FormationsPage() {
	const qc = useQueryClient();
	const { data: items = [] } = useQuery({
		queryKey: ["trainings"],
		queryFn: async () => {
			try {
				return await listTrainings();
			} catch (e) {
				console.warn("Trainings query error", e);
				return [];
			}
		}
	});
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [selectedForFiles, setSelectedForFiles] = (0, import_react.useState)(null);
	const openNew = () => {
		setForm(emptyForm);
		setOpen(true);
	};
	const openEdit = (t) => {
		setForm({
			id: t.id,
			name: t.name,
			description: t.description ?? "",
			pricing_type: t.pricing_type,
			price: Number(t.price ?? 0),
			payment_flow: t.payment_flow ?? "admin_numbers",
			video_link: t.video_link ?? "",
			is_active: t.is_active
		});
		setOpen(true);
	};
	const save = async () => {
		try {
			await upsertTraining({ data: {
				id: form.id,
				name: form.name,
				description: form.description || null,
				pricing_type: form.pricing_type,
				price: form.pricing_type === "paid" ? Number(form.price) : null,
				payment_flow: form.pricing_type === "paid" ? form.payment_flow : null,
				video_link: form.video_link || null,
				is_active: form.is_active
			} });
			toast.success("Formation enregistrée");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["trainings"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur");
		}
	};
	const del = async (id) => {
		if (!confirm("Supprimer cette formation ?")) return;
		await deleteTraining({ data: { id } });
		qc.invalidateQueries({ queryKey: ["trainings"] });
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center justify-between flex-wrap gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-3xl font-bold gradient-text flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GraduationCap, { className: "h-8 w-8" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 98,
						columnNumber: 13
					}, this), " Formations"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 97,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-muted-foreground mt-1",
					children: "Gérez vos formations gratuites et payantes."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 100,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 96,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					onClick: openNew,
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4 mr-2" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 103,
						columnNumber: 11
					}, this), "Nouvelle formation"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 102,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 95,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [items.map((t) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
					className: "glass p-5 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "font-semibold text-lg",
								children: t.name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 112,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: t.pricing_type === "free" ? "Gratuit" : `Payante — ${Number(t.price).toLocaleString()} Ar (${t.payment_flow === "admin_numbers" ? "numéros admin" : "contact client"})`
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 113,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 111,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => openEdit(t),
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SquarePen, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 119,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 118,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => del(t.id),
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-4 w-4 text-destructive" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 122,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 121,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 117,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 110,
							columnNumber: 13
						}, this),
						t.description && /* @__PURE__ */ (void 0)("p", {
							className: "text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3",
							children: t.description
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 126,
							columnNumber: 31
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-xs text-muted-foreground",
							children: [t.training_files?.length ?? 0, " fichier(s)"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 129,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "secondary",
							size: "sm",
							onClick: () => setSelectedForFiles(t),
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Upload, { className: "h-4 w-4 mr-2" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 133,
								columnNumber: 15
							}, this), "Fichiers"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 132,
							columnNumber: 13
						}, this)
					]
				}, t.id, true, {
					fileName: _jsxFileName,
					lineNumber: 109,
					columnNumber: 32
				}, this)), items.length === 0 && /* @__PURE__ */ (void 0)(Card, {
					className: "glass p-8 text-center text-muted-foreground col-span-full",
					children: "Aucune formation. Cliquez sur « Nouvelle formation » pour commencer."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 137,
					columnNumber: 32
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 108,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-lg",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: form.id ? "Modifier la formation" : "Nouvelle formation" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 145,
						columnNumber: 13
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 144,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Nom de la formation" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 149,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								value: form.name,
								onChange: (e) => setForm({
									...form,
									name: e.target.value
								})
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 150,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 148,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Type de formation" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 156,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
								value: form.pricing_type,
								onValueChange: (v) => setForm({
									...form,
									pricing_type: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 162,
									columnNumber: 19
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 161,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: "free",
									children: "Gratuit"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 165,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
									value: "paid",
									children: "Payante"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 166,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 164,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 157,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 155,
								columnNumber: 13
							}, this),
							form.pricing_type === "paid" && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)(Label, { children: "Droit de formation (Ar)" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 172,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)(Input, {
								type: "number",
								value: form.price,
								onChange: (e) => setForm({
									...form,
									price: Number(e.target.value)
								})
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 173,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 171,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("div", { children: [
								/* @__PURE__ */ (void 0)(Label, { children: "Méthode de paiement" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 179,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (void 0)(Select, {
									value: form.payment_flow,
									onValueChange: (v) => setForm({
										...form,
										payment_flow: v
									}),
									children: [/* @__PURE__ */ (void 0)(SelectTrigger, { children: /* @__PURE__ */ (void 0)(SelectValue, {}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 185,
										columnNumber: 23
									}, this) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 184,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: [/* @__PURE__ */ (void 0)(SelectItem, {
										value: "admin_numbers",
										children: "Envoyer les numéros de paiement au client"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 188,
										columnNumber: 23
									}, this), /* @__PURE__ */ (void 0)(SelectItem, {
										value: "client_contact",
										children: "Demander seulement contact du client"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 191,
										columnNumber: 23
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 187,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 180,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (void 0)("p", {
									className: "text-xs text-muted-foreground mt-1",
									children: "« Numéros » : l'IA envoie vos numéros MVola/Airtel/Orange et attend confirmation avant d'envoyer les fichiers. « Contact » : l'IA demande juste nom Facebook + WhatsApp/téléphone du client."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 196,
									columnNumber: 19
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 178,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 170,
								columnNumber: 46
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Description" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 204,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
								rows: 4,
								value: form.description,
								onChange: (e) => setForm({
									...form,
									description: e.target.value
								})
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 205,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 203,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Lien vidéo (optionnel)" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 211,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								type: "url",
								placeholder: "https://...",
								value: form.video_link,
								onChange: (e) => setForm({
									...form,
									video_link: e.target.value
								})
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 212,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 210,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Actif" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 218,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Switch, {
									checked: form.is_active,
									onCheckedChange: (v) => setForm({
										...form,
										is_active: v
									})
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 219,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 217,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								onClick: save,
								className: "w-full",
								children: "Enregistrer"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 224,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 147,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 143,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 142,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FilesDialog, {
				training: selectedForFiles,
				onClose: () => setSelectedForFiles(null)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 231,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 94,
		columnNumber: 10
	}, this);
}
function FilesDialog({ training, onClose }) {
	const qc = useQueryClient();
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	const [linkName, setLinkName] = (0, import_react.useState)("");
	const [linkUrl, setLinkUrl] = (0, import_react.useState)("");
	const upload = async (file) => {
		if (!training) return;
		if (file.size > 209715200) {
			toast.error("Fichier trop volumineux (max 200 Mo)");
			return;
		}
		setUploading(true);
		try {
			const isImage = file.type.startsWith("image/");
			const isVideo = file.type.startsWith("video/");
			const isPdf = file.type === "application/pdf";
			const fileType = isImage ? "image" : isVideo ? "video" : isPdf ? "pdf" : "document";
			const base64 = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = (e) => {
					const res = e.target?.result;
					resolve(res.split(",")[1] || "");
				};
				reader.onerror = reject;
				reader.readAsDataURL(file);
			});
			await uploadTrainingFileServer({ data: {
				training_id: training.id,
				data_base64: base64,
				content_type: file.type || "application/octet-stream",
				file_type: fileType,
				file_name: file.name,
				size_bytes: file.size
			} });
			toast.success("Fichier ajouté avec succès");
			qc.invalidateQueries({ queryKey: ["trainings"] });
			if (fileRef.current) fileRef.current.value = "";
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur upload");
		} finally {
			setUploading(false);
		}
	};
	const addLink = async () => {
		if (!training || !linkUrl) return;
		try {
			await addTrainingFile({ data: {
				training_id: training.id,
				file_type: "link",
				file_name: linkName || linkUrl,
				external_url: linkUrl
			} });
			toast.success("Lien ajouté");
			setLinkName("");
			setLinkUrl("");
			qc.invalidateQueries({ queryKey: ["trainings"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur");
		}
	};
	const removeFile = async (id) => {
		if (!confirm("Supprimer ?")) return;
		await deleteTrainingFile({ data: { id } });
		qc.invalidateQueries({ queryKey: ["trainings"] });
	};
	const openFile = async (path) => {
		const { url } = await getTrainingFileUrl({ data: { path } });
		if (url) window.open(url, "_blank");
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
		open: !!training,
		onOpenChange: (v) => !v && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
			className: "max-w-lg",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: ["Fichiers — ", training?.name] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 335,
				columnNumber: 11
			}, this) }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 334,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2 max-h-72 overflow-y-auto",
					children: [(training?.training_files ?? []).map((f) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2 border border-border rounded-lg p-2",
						children: [
							f.file_type === "video" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FilePlay, { className: "h-4 w-4 text-primary shrink-0" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 340,
								columnNumber: 44
							}, this) : f.file_type === "link" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link2, { className: "h-4 w-4 text-primary shrink-0" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 340,
								columnNumber: 127
							}, this) : f.file_type === "image" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Image, { className: "h-4 w-4 text-primary shrink-0" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 340,
								columnNumber: 207
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileText, { className: "h-4 w-4 text-primary shrink-0" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 340,
								columnNumber: 265
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-sm flex-1 truncate",
								children: f.file_name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 341,
								columnNumber: 17
							}, this),
							f.file_type === "link" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
								href: f.external_url,
								target: "_blank",
								rel: "noreferrer",
								className: "text-xs text-primary p-2",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 343,
									columnNumber: 21
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 342,
								columnNumber: 43
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: () => openFile(f.file_path),
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 345,
									columnNumber: 21
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 344,
								columnNumber: 26
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: () => removeFile(f.id),
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-4 w-4 text-destructive" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 348,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 347,
								columnNumber: 17
							}, this)
						]
					}, f.id, true, {
						fileName: _jsxFileName,
						lineNumber: 339,
						columnNumber: 63
					}, this)), (!training?.training_files || training.training_files.length === 0) && /* @__PURE__ */ (void 0)("p", {
						className: "text-xs text-muted-foreground text-center py-2",
						children: "Aucun fichier."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 351,
						columnNumber: 85
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 338,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "border-t pt-4 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Uploader un fichier (Images, PDF, Vidéos, Word)" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 356,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							ref: fileRef,
							type: "file",
							accept: "image/*,video/*,.pdf,.doc,.docx,application/*",
							disabled: uploading,
							onChange: (e) => e.target.files?.[0] && upload(e.target.files[0])
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 357,
							columnNumber: 15
						}, this),
						uploading && /* @__PURE__ */ (void 0)("p", {
							className: "text-xs text-primary font-medium mt-1",
							children: "Upload en cours…"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 358,
							columnNumber: 29
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 355,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Ou ajouter un lien externe (Drive, YouTube, etc.)" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 361,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								placeholder: "Nom",
								value: linkName,
								onChange: (e) => setLinkName(e.target.value)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 363,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								placeholder: "https://...",
								value: linkUrl,
								onChange: (e) => setLinkUrl(e.target.value)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 364,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								onClick: addLink,
								children: "+"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 365,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 362,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 360,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 354,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 337,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 333,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 332,
		columnNumber: 10
	}, this);
}
//#endregion
export { FormationsPage as component };
