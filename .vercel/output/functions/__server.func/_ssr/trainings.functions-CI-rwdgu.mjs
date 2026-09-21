import { r as createServerFn } from "./server-PdCEgQXm.mjs";
import { t as createServerRpc } from "./createServerRpc-CNvf87y9.mjs";
import { t as requireWorkspaceAuth } from "./workspace-middleware-BESKEWcR.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, r as enumType } from "../_libs/zod.mjs";
import { t as uploadMediaFile } from "./storage-helper.server-BlDDvwDn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trainings.functions-CI-rwdgu.js
var listTrainings_createServerFn_handler = createServerRpc({
	id: "26c96ef8fc4e3f784b8e2f35fdcadaba86bd11aa876dca3aafdda847af0d376d",
	name: "listTrainings",
	filename: "src/lib/trainings.functions.ts"
}, (opts) => listTrainings.__executeServer(opts));
var listTrainings = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(listTrainings_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("trainings").select("*, training_files(*)").eq("user_id", context.userId).order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
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
var upsertTraining_createServerFn_handler = createServerRpc({
	id: "b2bcf1957c4e3511e2df455156a0eee94fbd878d1f8ed6ed23038bfff09c5e30",
	name: "upsertTraining",
	filename: "src/lib/trainings.functions.ts"
}, (opts) => upsertTraining.__executeServer(opts));
var upsertTraining = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => upsertSchema.parse(d)).handler(upsertTraining_createServerFn_handler, async ({ data, context }) => {
	const cleanId = data.id && data.id.trim().length > 0 ? data.id.trim() : void 0;
	const payload = {
		name: data.name.trim(),
		description: data.description ? data.description.trim() : null,
		pricing_type: data.pricing_type,
		price: data.pricing_type === "free" ? null : Number(data.price ?? 0),
		payment_flow: data.pricing_type === "free" ? null : data.payment_flow,
		video_link: data.video_link ? data.video_link.trim() : null,
		is_active: data.is_active,
		user_id: context.userId
	};
	let res;
	if (cleanId) res = await context.supabase.from("trainings").update(payload).eq("id", cleanId).eq("user_id", context.userId).select().single();
	else res = await context.supabase.from("trainings").insert(payload).select().single();
	if (res.error) throw new Error(res.error.message);
	return res.data;
});
var deleteTraining_createServerFn_handler = createServerRpc({
	id: "a6d2a211946cef37fc5004f226984e8fa811b98cd390031aac4d5759fbca9dcc",
	name: "deleteTraining",
	filename: "src/lib/trainings.functions.ts"
}, (opts) => deleteTraining.__executeServer(opts));
var deleteTraining = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteTraining_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("trainings").delete().eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
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
var addTrainingFile_createServerFn_handler = createServerRpc({
	id: "51b547fe6c95f50b05cc8150afd34c0b3f3a304f79e38fb5dd56c9b964ebe0b8",
	name: "addTrainingFile",
	filename: "src/lib/trainings.functions.ts"
}, (opts) => addTrainingFile.__executeServer(opts));
var addTrainingFile = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => addFileSchema.parse(d)).handler(addTrainingFile_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("training_files").insert({
		...data,
		user_id: context.userId
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
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
var uploadTrainingFileServer_createServerFn_handler = createServerRpc({
	id: "fead9bb27632cd7f0a02f5753aad7882e325726d0656d34709ae381e1cc5ee31",
	name: "uploadTrainingFileServer",
	filename: "src/lib/trainings.functions.ts"
}, (opts) => uploadTrainingFileServer.__executeServer(opts));
var uploadTrainingFileServer = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => uploadTrainingFileSchema.parse(d)).handler(uploadTrainingFileServer_createServerFn_handler, async ({ data, context }) => {
	let finalPath = null;
	if (data.data_base64) {
		const safeName = data.file_name.replace(/[^\w.-]/g, "_");
		const contentType = data.content_type || "application/octet-stream";
		const buffer = Buffer.from(data.data_base64, "base64");
		finalPath = await uploadMediaFile({
			userId: context.userId,
			bucket: "training-files",
			fileName: safeName,
			contentType,
			buffer,
			folder: data.training_id
		});
	}
	const { error } = await context.supabase.from("training_files").insert({
		training_id: data.training_id,
		file_path: finalPath,
		file_type: data.file_type,
		file_name: data.file_name,
		size_bytes: data.size_bytes,
		external_url: data.external_url || null,
		user_id: context.userId
	});
	if (error) throw new Error(error.message);
	return {
		ok: true,
		file_path: finalPath
	};
});
var deleteTrainingFile_createServerFn_handler = createServerRpc({
	id: "c735f2002ab50508e803574d0ff1c9be845aa8f917d54b0697bca4e23f0d6d5c",
	name: "deleteTrainingFile",
	filename: "src/lib/trainings.functions.ts"
}, (opts) => deleteTrainingFile.__executeServer(opts));
var deleteTrainingFile = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteTrainingFile_createServerFn_handler, async ({ data, context }) => {
	const { data: row } = await context.supabase.from("training_files").select("file_path").eq("id", data.id).eq("user_id", context.userId).maybeSingle();
	if (row?.file_path && !row.file_path.startsWith("data:") && !row.file_path.startsWith("http")) try {
		await context.supabase.storage.from("training-files").remove([row.file_path]);
	} catch {}
	const { error } = await context.supabase.from("training_files").delete().eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var getTrainingFileUrl_createServerFn_handler = createServerRpc({
	id: "35752f15047e6baaefbbae8dbe7f0399344e7c622efdef66edd7735c0b294ad4",
	name: "getTrainingFileUrl",
	filename: "src/lib/trainings.functions.ts"
}, (opts) => getTrainingFileUrl.__executeServer(opts));
var getTrainingFileUrl = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ path: stringType() }).parse(d)).handler(getTrainingFileUrl_createServerFn_handler, async ({ data, context }) => {
	if (data.path.startsWith("data:") || data.path.startsWith("http://") || data.path.startsWith("https://")) return { url: data.path };
	try {
		const { data: signed, error } = await context.supabase.storage.from("training-files").createSignedUrl(data.path, 3600);
		if (error || !signed?.signedUrl) return { url: data.path };
		return { url: signed.signedUrl };
	} catch {
		return { url: data.path };
	}
});
//#endregion
export { addTrainingFile_createServerFn_handler, deleteTrainingFile_createServerFn_handler, deleteTraining_createServerFn_handler, getTrainingFileUrl_createServerFn_handler, listTrainings_createServerFn_handler, uploadTrainingFileServer_createServerFn_handler, upsertTraining_createServerFn_handler };
