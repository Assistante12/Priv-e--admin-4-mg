import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as useQueryClient, r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { L as Image$1, S as Plus, _ as Save, d as Sparkles, h as Send, j as LoaderCircle, l as Trash2, n as X, r as Video, w as Pencil } from "../_libs/lucide-react.mjs";
import { _ as uploadPostImage, f as pagesQuery$2, g as publishScheduledPostNow, h as getPostImageUrl, m as deleteScheduledPost, p as postsQuery, v as upsertScheduledPost } from "./router-Bhc7uvGy.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Card } from "./card-CWKLgPMR.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as Label } from "./label-8xz9aKVd.mjs";
import { t as Switch } from "./switch-Bij46GIi.mjs";
import { t as Badge } from "./badge-Di9TvE8n.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-2jkrRSx7.mjs";
import { t as supabase } from "./client-DX3EYOCh.mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auto-post-CJ3paNCp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/ui/progress.tsx";
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Root, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 17,
		columnNumber: 5
	}, void 0)
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 12,
	columnNumber: 3
}, void 0));
Progress.displayName = Root.displayName;
var CHUNK_SIZE = 6291456;
function b64(s) {
	return btoa(unescape(encodeURIComponent(s)));
}
function baseUrl() {
	return {
		"BASE_URL": "/",
		"DEV": true,
		"MODE": "production",
		"PROD": false,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_APP_ID": "1:968036045846:web:d0be8f8804be6a42e71137",
		"VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_PROJECT_ID": "inscription-22047",
		"VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_VAPID_KEY": "BGduAC5saLzgFtOiyVFadtn55e6NoobQBL8OAbwXd6NL47zXuMb-jP1WFOhZr8aF6jZiRXZYFrVO-M2hdYigbjU",
		"VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_WEB_API_KEY": "AIzaSyDC9NUvMPL_kJNjyM8dCc07wc2QQYVTuXA"
	}["VITE_SUPABASE_URL"].replace(/\/$/, "");
}
async function authHeaders() {
	const { data } = await supabase.auth.getSession();
	return {
		Authorization: `Bearer ${data.session?.access_token ?? ""}`,
		"x-upsert": "true",
		"Tus-Resumable": "1.0.0"
	};
}
/** Creates a resumable upload session (call once per file). */
async function createVideoUploadSession(file) {
	const { data } = await supabase.auth.getSession();
	const userId = data.session?.user?.id ?? "anon";
	const bucket = "post-videos";
	const safeName = file.name.replace(/[^\w.\-]/g, "_");
	const path = `${userId}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeName}`;
	const res = await fetch(`${baseUrl()}/storage/v1/upload/resumable`, {
		method: "POST",
		headers: {
			...await authHeaders(),
			"Upload-Length": String(file.size),
			"Upload-Metadata": [
				`bucketName ${b64(bucket)}`,
				`objectName ${b64(path)}`,
				`contentType ${b64(file.type || "video/mp4")}`,
				`cacheControl ${b64("3600")}`
			].join(",")
		}
	});
	if (!res.ok) throw new Error(`Upload tsy afaka nanomboka (${res.status})`);
	const location = res.headers.get("location");
	if (!location) throw new Error("Upload URL tsy hita");
	return {
		bucket,
		path,
		uploadUrl: location.startsWith("http") ? location : `${baseUrl()}${location}`,
		size: file.size
	};
}
/** Asks the server how many bytes are already stored for this session. */
async function getUploadedOffset(session) {
	const res = await fetch(session.uploadUrl, {
		method: "HEAD",
		headers: await authHeaders()
	});
	if (!res.ok) throw new Error(`Tsy hita ny upload (${res.status})`);
	return Number(res.headers.get("upload-offset") ?? 0);
}
function patchChunk(uploadUrl, headers, chunk, offset, onByte, signal) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("PATCH", uploadUrl, true);
		Object.entries({
			...headers,
			"Content-Type": "application/offset+octet-stream",
			"Upload-Offset": String(offset)
		}).forEach(([k, v]) => xhr.setRequestHeader(k, v));
		xhr.upload.onprogress = (e) => onByte(offset + e.loaded);
		xhr.onerror = () => reject(/* @__PURE__ */ new Error("Tapaka ny fifandraisana"));
		xhr.onabort = () => reject(/* @__PURE__ */ new Error("aborted"));
		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) resolve(Number(xhr.getResponseHeader("upload-offset") ?? offset + chunk.size));
			else reject(/* @__PURE__ */ new Error(`Upload nikatona (${xhr.status})`));
		};
		signal?.addEventListener("abort", () => xhr.abort(), { once: true });
		xhr.send(chunk);
	});
}
/**
* Uploads (or resumes) the file. Progress is reported 0-100.
* Throws on failure — the same session can be passed again to continue.
*/
async function uploadVideoResumable(file, session, onProgress, signal) {
	const headers = await authHeaders();
	let offset = await getUploadedOffset(session);
	onProgress(Math.round(offset / file.size * 100), offset);
	while (offset < file.size) {
		if (signal?.aborted) throw new Error("aborted");
		const end = Math.min(offset + CHUNK_SIZE, file.size);
		const chunk = file.slice(offset, end);
		offset = await patchChunk(session.uploadUrl, headers, chunk, offset, (uploaded) => onProgress(Math.min(100, Math.round(uploaded / file.size * 100)), uploaded), signal);
		onProgress(Math.min(100, Math.round(offset / file.size * 100)), offset);
	}
	return { path: session.path };
}
var _jsxFileName = "/app/applet/src/routes/_authenticated/auto-post.tsx?tsr-split=component";
function todayLocalParts() {
	const d = /* @__PURE__ */ new Date();
	const pad = (n) => String(n).padStart(2, "0");
	return {
		date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
		time: `${pad(d.getHours())}:${pad(d.getMinutes())}`
	};
}
function combineToIso(date, time) {
	const [y, m, d] = date.split("-").map(Number);
	const [hh, mm] = time.split(":").map(Number);
	return new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, 0, 0).toISOString();
}
function fromIso(iso) {
	const d = new Date(iso);
	const pad = (n) => String(n).padStart(2, "0");
	return {
		date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
		time: `${pad(d.getHours())}:${pad(d.getMinutes())}`
	};
}
async function compressImageToUnder50KB(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (event) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement("canvas");
				let width = img.width;
				let height = img.height;
				const maxDim = 600;
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
				let quality = .7;
				let dataUrl = canvas.toDataURL("image/jpeg", quality);
				while (dataUrl.length * .75 > 51200 && quality > .15) {
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
function AutoPostPage() {
	const { data: postsRaw } = useSuspenseQuery(postsQuery);
	const posts = postsRaw;
	const { data: pagesRaw } = useSuspenseQuery(pagesQuery$2);
	const pages = pagesRaw;
	const qc = useQueryClient();
	const initial = {
		id: void 0,
		page_id: pages[0]?.id ?? null,
		title: "",
		ai_prompt: "",
		images: [],
		video_path: null,
		video_preview: null,
		date: todayLocalParts().date,
		time: todayLocalParts().time,
		frequency: "once",
		enhance_image: true
	};
	const [form, setForm] = (0, import_react.useState)(initial);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [runningId, setRunningId] = (0, import_react.useState)(null);
	const videoInputRef = (0, import_react.useRef)(null);
	const [videoMode, setVideoMode] = (0, import_react.useState)("link");
	const [videoFile, setVideoFile] = (0, import_react.useState)(null);
	const [videoProgress, setVideoProgress] = (0, import_react.useState)(0);
	const [videoUploading, setVideoUploading] = (0, import_react.useState)(false);
	const [videoError, setVideoError] = (0, import_react.useState)(null);
	const videoSessionRef = (0, import_react.useRef)(null);
	const videoAbortRef = (0, import_react.useRef)(null);
	const runVideoUpload = async (file, session) => {
		setVideoUploading(true);
		setVideoError(null);
		const ctrl = new AbortController();
		videoAbortRef.current = ctrl;
		try {
			const res = await uploadVideoResumable(file, session, (pct) => setVideoProgress(pct), ctrl.signal);
			setForm((f) => ({
				...f,
				video_path: res.path,
				video_preview: null,
				images: []
			}));
			toast.success("Vidéo voatahiry soa aman-tsara");
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Erreur upload";
			setVideoError(msg === "aborted" ? "Najanona ny fandefasana" : msg);
		} finally {
			setVideoUploading(false);
			videoAbortRef.current = null;
		}
	};
	const handleVideoPick = async (e) => {
		const file = e.target.files?.[0];
		e.target.value = "";
		if (!file) return;
		if (file.size > 1073741824) {
			toast.error("Vidéo lehibe loatra (1 Go max)");
			return;
		}
		setVideoFile(file);
		setVideoProgress(0);
		setVideoError(null);
		try {
			const session = await createVideoUploadSession(file);
			videoSessionRef.current = session;
			await runVideoUpload(file, session);
		} catch (err) {
			setVideoError(err instanceof Error ? err.message : "Erreur upload");
		}
	};
	const resumeVideoUpload = async () => {
		const file = videoFile;
		const session = videoSessionRef.current;
		if (!file) return;
		if (!session) {
			await handleVideoPickResumeFallback(file);
			return;
		}
		await runVideoUpload(file, session);
	};
	const handleVideoPickResumeFallback = async (file) => {
		try {
			const session = await createVideoUploadSession(file);
			videoSessionRef.current = session;
			await runVideoUpload(file, session);
		} catch (err) {
			setVideoError(err instanceof Error ? err.message : "Erreur upload");
		}
	};
	const cancelVideoUpload = () => videoAbortRef.current?.abort();
	const editing = Boolean(form.id);
	const resetForm = () => {
		setVideoFile(null);
		setVideoProgress(0);
		setVideoError(null);
		videoSessionRef.current = null;
		setForm({
			...initial,
			...todayLocalParts()
		});
	};
	const handleFileChange = async (e) => {
		const files = Array.from(e.target.files ?? []);
		if (files.length === 0) return;
		setUploading(true);
		try {
			for (const file of files) {
				if (file.size > 20971520) {
					toast.error(`${file.name} : sary lehibe loatra`);
					continue;
				}
				const compressed = await compressImageToUnder50KB(file);
				let path = `data:${compressed.content_type};base64,${compressed.data_base64}`;
				let preview = path;
				try {
					const res = await uploadPostImage({ data: compressed });
					if (res?.path) {
						path = res.path;
						preview = res.signed_url || preview;
					}
				} catch (storageErr) {
					console.warn("Storage upload fallback to base64:", storageErr);
				}
				setForm((f) => ({
					...f,
					images: [...f.images, {
						path,
						preview
					}],
					video_path: null,
					video_preview: null
				}));
			}
			toast.success("Sary voatahiry soa aman-tsara");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Erreur upload");
		} finally {
			setUploading(false);
			e.target.value = "";
		}
	};
	const startEdit = async (row) => {
		const parts = fromIso(row.scheduled_at);
		const paths = Array.isArray(row.image_paths) && row.image_paths.length ? row.image_paths : typeof row.image_path === "string" ? [row.image_path] : [];
		const images = [];
		for (const p of paths) try {
			const r = await getPostImageUrl({ data: { path: p } });
			images.push({
				path: p,
				preview: r.signed_url
			});
		} catch {}
		const vidUrl = row.video_path ?? null;
		setForm({
			id: row.id,
			page_id: row.page_id ?? pages[0]?.id ?? null,
			title: row.title,
			ai_prompt: row.ai_prompt ?? "",
			images,
			video_path: vidUrl,
			video_preview: vidUrl,
			date: parts.date,
			time: parts.time,
			frequency: row.frequency ?? "once",
			enhance_image: row.enhance_image ?? true
		});
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
	const save = async () => {
		if (!form.title.trim()) {
			toast.error("Ampidiro ny lohatenin'ny publication");
			return;
		}
		setSaving(true);
		try {
			let iso;
			if (form.frequency === "daily") {
				let candidate = combineToIso(todayLocalParts().date, form.time);
				if (new Date(candidate).getTime() <= Date.now()) {
					const next = new Date(candidate);
					next.setDate(next.getDate() + 1);
					candidate = next.toISOString();
				}
				iso = candidate;
			} else iso = combineToIso(form.date, form.time);
			await upsertScheduledPost({ data: {
				id: form.id,
				page_id: form.page_id,
				title: form.title.trim(),
				ai_prompt: form.ai_prompt.trim() || null,
				image_paths: form.images.map((i) => i.path),
				video_path: form.video_path,
				scheduled_at: iso,
				frequency: form.frequency,
				enhance_image: form.enhance_image
			} });
			toast.success(editing ? "Publication novaina" : "Publication voatahiry");
			qc.invalidateQueries({ queryKey: ["scheduled-posts"] });
			resetForm();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Erreur");
		} finally {
			setSaving(false);
		}
	};
	const remove = async (id) => {
		if (!confirm("Fafao ity publication ity ?")) return;
		try {
			await deleteScheduledPost({ data: { id } });
			toast.success("Voafafa");
			qc.invalidateQueries({ queryKey: ["scheduled-posts"] });
			if (form.id === id) resetForm();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Erreur");
		}
	};
	const publishNow = async (id) => {
		setRunningId(id);
		try {
			const res = await publishScheduledPostNow({ data: { id } });
			if (res.ok) toast.success("Publication alefa amin'i Facebook !");
			else toast.error(res.error ?? "Erreur publication");
			qc.invalidateQueries({ queryKey: ["scheduled-posts"] });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Erreur");
		} finally {
			setRunningId(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
				className: "text-3xl font-bold gradient-text",
				children: "Auto-poste"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 384,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-muted-foreground mt-1",
				children: "Planifiez vos publications Facebook. L'IA rédige une description professionnelle et publie automatiquement à l'heure choisie."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 385,
				columnNumber: 9
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 383,
				columnNumber: 7
			}, this),
			pages.length === 0 && /* @__PURE__ */ (void 0)(Card, {
				className: "glass p-4 border border-yellow-500/40 bg-yellow-500/5",
				children: /* @__PURE__ */ (void 0)("p", {
					className: "text-sm",
					children: [
						"Aucune page Facebook connectée. Rendez-vous dans ",
						/* @__PURE__ */ (void 0)("strong", { children: "Facebook" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 393,
							columnNumber: 62
						}, this),
						" pour en connecter une avant de planifier une publication."
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 392,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 391,
				columnNumber: 30
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "glass p-6 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "h-5 w-5 text-primary" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 401,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "text-lg font-semibold",
								children: editing ? "Modifier une publication planifiée" : "Nouvelle publication planifiée"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 402,
								columnNumber: 11
							}, this),
							editing && /* @__PURE__ */ (void 0)(Button, {
								variant: "ghost",
								size: "sm",
								className: "ml-auto",
								onClick: resetForm,
								children: [/* @__PURE__ */ (void 0)(X, { className: "h-4 w-4 mr-1" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 406,
									columnNumber: 15
								}, this), "Annuler"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 405,
								columnNumber: 23
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 400,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Titre de la publication" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 412,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							placeholder: "Ex : Promotion spéciale du week-end",
							value: form.title,
							onChange: (e) => setForm({
								...form,
								title: e.target.value
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 413,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: "L'IA génère une description professionnelle à partir de ce titre."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 417,
							columnNumber: 11
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 411,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Description à donner à l'IA (facultatif)" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 423,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
							className: "mt-1 w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
							placeholder: "Ex : mets l'accent sur la livraison gratuite, ton chaleureux, cible les jeunes parents, mentionne la promo -20%…",
							value: form.ai_prompt,
							onChange: (e) => setForm({
								...form,
								ai_prompt: e.target.value
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 424,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: "Ces instructions guident l'IA pour rédiger la meilleure description possible."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 428,
							columnNumber: 11
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 422,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Page Facebook" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 435,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
							value: form.page_id ?? "",
							onValueChange: (v) => setForm({
								...form,
								page_id: v || null
							}),
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, { placeholder: "Choisir une page" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 441,
								columnNumber: 17
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 440,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: pages.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
								value: p.id,
								children: p.page_name
							}, p.id, false, {
								fileName: _jsxFileName,
								lineNumber: 444,
								columnNumber: 33
							}, this)) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 443,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 436,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 434,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Fréquence" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 452,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
							value: form.frequency,
							onValueChange: (v) => setForm({
								...form,
								frequency: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 458,
								columnNumber: 17
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 457,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
								value: "once",
								children: "Une seule fois"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 461,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
								value: "daily",
								children: "Tous les jours"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 462,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 460,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 453,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 451,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 433,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: form.frequency === "daily" ? "" : "grid gap-4 md:grid-cols-2",
						children: [form.frequency !== "daily" && /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)(Label, { children: "Date" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 470,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)(Input, {
							type: "date",
							value: form.date,
							onChange: (e) => setForm({
								...form,
								date: e.target.value
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 471,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 469,
							columnNumber: 42
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Heure (HH:MM)" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 477,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								type: "time",
								value: form.time,
								onChange: (e) => setForm({
									...form,
									time: e.target.value
								})
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 478,
								columnNumber: 13
							}, this),
							form.frequency === "daily" && /* @__PURE__ */ (void 0)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "La publication sera relancée chaque jour à cette heure."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 482,
								columnNumber: 44
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 476,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 468,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Images (plusieurs possibles)" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 489,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
									className: "inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Image$1, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 493,
											columnNumber: 17
										}, this),
										"Ajouter des images",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
											type: "file",
											accept: "image/*",
											multiple: true,
											className: "hidden",
											onChange: handleFileChange,
											disabled: uploading
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 495,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 492,
									columnNumber: 15
								}, this), uploading && /* @__PURE__ */ (void 0)(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 497,
									columnNumber: 29
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 491,
								columnNumber: 13
							}, this), form.images.length > 0 && /* @__PURE__ */ (void 0)("div", {
								className: "flex flex-wrap gap-3",
								children: form.images.map((img) => /* @__PURE__ */ (void 0)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (void 0)("img", {
										src: img.preview,
										alt: "preview",
										className: "h-24 w-24 rounded-md object-cover border"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 501,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)(Button, {
										variant: "secondary",
										size: "icon",
										className: "absolute -right-2 -top-2 h-6 w-6",
										onClick: () => setForm((f) => ({
											...f,
											images: f.images.filter((i) => i.path !== img.path)
										})),
										children: /* @__PURE__ */ (void 0)(X, { className: "h-3 w-3" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 506,
											columnNumber: 23
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 502,
										columnNumber: 21
									}, this)]
								}, img.path, true, {
									fileName: _jsxFileName,
									lineNumber: 500,
									columnNumber: 41
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 499,
								columnNumber: 40
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 490,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: "Plusieurs images = publication album. L'IA n'invente pas de nouvelle image : elle améliore la première."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 511,
							columnNumber: 11
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 488,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Vidéo (optionnel)" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 518,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									type: "button",
									size: "sm",
									variant: videoMode === "link" ? "default" : "secondary",
									onClick: () => setVideoMode("link"),
									children: "Lien vidéo"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 520,
									columnNumber: 13
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									type: "button",
									size: "sm",
									variant: videoMode === "upload" ? "default" : "secondary",
									onClick: () => setVideoMode("upload"),
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Video, { className: "h-4 w-4 mr-2" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 524,
										columnNumber: 15
									}, this), "Depuis la galerie"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 523,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 519,
								columnNumber: 11
							}, this),
							videoMode === "link" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								placeholder: "Ex : https://www.youtube.com/watch?v=... na lien video mp4",
								value: form.video_path || "",
								onChange: (e) => setForm({
									...form,
									video_path: e.target.value.trim() || null,
									video_preview: e.target.value.trim() || null,
									images: e.target.value.trim() ? [] : form.images
								})
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 530,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: "Ampidiro ny rohy (lien) amin'ny vidéo raha misy. Rehefa misy vidéo dia ny vidéo no alefa fa tsy sary."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 536,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 529,
								columnNumber: 35
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									ref: videoInputRef,
									type: "file",
									accept: "video/*",
									className: "hidden",
									onChange: handleVideoPick
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 541,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										type: "button",
										variant: "outline",
										onClick: () => videoInputRef.current?.click(),
										disabled: videoUploading,
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Video, { className: "h-4 w-4 mr-2" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 544,
											columnNumber: 19
										}, this), "Choisir une vidéo (max 1 Go)"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 543,
										columnNumber: 17
									}, this), videoFile && /* @__PURE__ */ (void 0)("span", {
										className: "text-xs text-muted-foreground",
										children: [
											videoFile.name,
											" — ",
											(videoFile.size / 1048576).toFixed(1),
											" Mo"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 547,
										columnNumber: 31
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 542,
									columnNumber: 15
								}, this),
								(videoUploading || videoProgress > 0) && /* @__PURE__ */ (void 0)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (void 0)(Progress, { value: videoProgress }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 553,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											videoProgress,
											"%",
											" ",
											videoUploading ? "— mandeha ny fandefasana…" : videoError ? "— tapaka" : "— vita"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 554,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 552,
									columnNumber: 57
								}, this),
								videoError && !videoUploading && /* @__PURE__ */ (void 0)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (void 0)("p", {
										className: "text-xs text-destructive",
										children: videoError
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 561,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)(Button, {
										type: "button",
										size: "sm",
										variant: "secondary",
										onClick: resumeVideoUpload,
										children: "Continuer"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 562,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 560,
									columnNumber: 49
								}, this),
								videoUploading && /* @__PURE__ */ (void 0)(Button, {
									type: "button",
									size: "sm",
									variant: "ghost",
									onClick: cancelVideoUpload,
									children: "Arrêter"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 567,
									columnNumber: 34
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-muted-foreground",
									children: "Vidéo hatramin'ny 1 Go. Raha tapaka ny fandefasana dia tsindrio \"Continuer\" fa tsy averina amin'ny voalohany."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 571,
									columnNumber: 15
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 540,
								columnNumber: 19
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 517,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between rounded-lg border border-border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							className: "text-sm",
							children: "Améliorer l'image avec l'IA"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 581,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: "Netteté, luminosité, rendu professionnel — sans changer le contenu."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 582,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 580,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Switch, {
							checked: form.enhance_image,
							onCheckedChange: (v) => setForm({
								...form,
								enhance_image: v
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 586,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 579,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: save,
							disabled: saving || uploading,
							children: [saving ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 594,
								columnNumber: 23
							}, this) : editing ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Save, { className: "h-4 w-4 mr-2" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 594,
								columnNumber: 85
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4 mr-2" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 594,
								columnNumber: 121
							}, this), editing ? "Enregistrer les modifications" : "Créer une publication"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 593,
							columnNumber: 11
						}, this), editing && form.id && /* @__PURE__ */ (void 0)(Button, {
							variant: "secondary",
							onClick: () => publishNow(form.id),
							disabled: runningId === form.id,
							children: [runningId === form.id ? /* @__PURE__ */ (void 0)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 598,
								columnNumber: 40
							}, this) : /* @__PURE__ */ (void 0)(Send, { className: "h-4 w-4 mr-2" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 598,
								columnNumber: 92
							}, this), "Publier maintenant"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 597,
							columnNumber: 34
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 592,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 399,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "text-lg font-semibold",
						children: "Publications planifiées"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 606,
						columnNumber: 9
					}, this),
					posts.length === 0 && /* @__PURE__ */ (void 0)(Card, {
						className: "glass p-6 text-sm text-muted-foreground",
						children: "Aucune publication planifiée pour le moment."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 607,
						columnNumber: 32
					}, this),
					posts.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "glass p-4",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col gap-3 md:flex-row md:items-start",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
												className: "font-semibold truncate",
												children: p.title
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 614,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
												variant: statusVariant(p.status),
												children: statusLabel(p.status)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 615,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
												variant: "outline",
												children: p.frequency === "daily" ? "Tous les jours" : "Une fois"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 616,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 613,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs text-muted-foreground mt-1",
										children: [
											"Prévu : ",
											new Date(p.scheduled_at).toLocaleString(),
											p.facebook_pages?.page_name && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [" · Page : ", p.facebook_pages.page_name] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 622,
												columnNumber: 51
											}, this),
											p.last_published_at && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [" · Dernière publication : ", new Date(p.last_published_at).toLocaleString()] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 623,
												columnNumber: 43
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 620,
										columnNumber: 17
									}, this),
									p.last_error && /* @__PURE__ */ (void 0)("p", {
										className: "text-xs text-destructive mt-1",
										children: ["Erreur : ", p.last_error]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 625,
										columnNumber: 34
									}, this),
									p.ai_description && /* @__PURE__ */ (void 0)("details", {
										className: "mt-2",
										children: [/* @__PURE__ */ (void 0)("summary", {
											className: "text-xs cursor-pointer text-muted-foreground hover:text-foreground",
											children: "Voir la description IA"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 627,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("pre", {
											className: "mt-2 whitespace-pre-wrap text-xs bg-muted/30 p-3 rounded-md",
											children: p.ai_description
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 630,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 626,
										columnNumber: 38
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 612,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										size: "sm",
										variant: "secondary",
										onClick: () => publishNow(p.id),
										disabled: runningId === p.id,
										children: [runningId === p.id ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-4 w-4 mr-1 animate-spin" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 637,
											columnNumber: 41
										}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { className: "h-4 w-4 mr-1" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 637,
											columnNumber: 93
										}, this), "Publier"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 636,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => startEdit(p),
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pencil, { className: "h-4 w-4 mr-1" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 641,
											columnNumber: 19
										}, this), "Modifier"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 640,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => remove(p.id),
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 645,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 644,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 635,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 611,
							columnNumber: 13
						}, this)
					}, p.id, false, {
						fileName: _jsxFileName,
						lineNumber: 610,
						columnNumber: 48
					}, this))
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 605,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 382,
		columnNumber: 10
	}, this);
}
function statusLabel(s) {
	switch (s) {
		case "pending": return "En attente";
		case "processing": return "En cours";
		case "published": return "Publié";
		case "failed": return "Échec";
		case "cancelled": return "Annulé";
		default: return s;
	}
}
function statusVariant(s) {
	switch (s) {
		case "published": return "default";
		case "failed": return "destructive";
		case "processing": return "secondary";
		default: return "outline";
	}
}
//#endregion
export { AutoPostPage as component };
