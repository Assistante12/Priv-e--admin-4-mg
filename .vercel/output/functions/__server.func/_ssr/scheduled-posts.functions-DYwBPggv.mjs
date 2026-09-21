import { r as createServerFn } from "./server-BRvJ2kb2.mjs";
import { t as createServerRpc } from "./createServerRpc-CtiMBgU6.mjs";
import { t as requireWorkspaceAuth } from "./workspace-middleware-DCv0kXWS.mjs";
import { a as objectType, n as booleanType, o as stringType, r as enumType, t as arrayType } from "../_libs/zod.mjs";
import { t as uploadMediaFile } from "./storage-helper.server-CQaPlMbg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scheduled-posts.functions-DYwBPggv.js
async function ensureBucket(supabase, bucketName) {
	try {
		const { data: buckets } = await supabase.storage.listBuckets();
		if (!buckets?.some((b) => b.name === bucketName)) await supabase.storage.createBucket(bucketName, { public: false });
	} catch (e) {}
}
var listScheduledPosts_createServerFn_handler = createServerRpc({
	id: "cd0fad7448fbb7d18ba577ec8d718dd65caa20365abe596f4288d3db166d937b",
	name: "listScheduledPosts",
	filename: "src/lib/scheduled-posts.functions.ts"
}, (opts) => listScheduledPosts.__executeServer(opts));
var listScheduledPosts = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(listScheduledPosts_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("scheduled_posts").select("*, facebook_pages(page_name)").eq("user_id", context.userId).order("scheduled_at", { ascending: true });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var upsertSchema = objectType({
	id: stringType().uuid().optional(),
	page_id: stringType().uuid().nullable().optional(),
	title: stringType().min(1).max(300),
	ai_prompt: stringType().max(2e3).nullable().optional(),
	image_path: stringType().max(2e6).nullable().optional(),
	image_paths: arrayType(stringType().max(2e6)).max(50).optional(),
	video_path: stringType().max(2e6).nullable().optional(),
	scheduled_at: stringType().datetime(),
	frequency: enumType(["once", "daily"]),
	enhance_image: booleanType()
});
var upsertScheduledPost_createServerFn_handler = createServerRpc({
	id: "95aa0993c677a6cf427851fb1bcc47b79d931004e6f2df36c7c12428a49bea95",
	name: "upsertScheduledPost",
	filename: "src/lib/scheduled-posts.functions.ts"
}, (opts) => upsertScheduledPost.__executeServer(opts));
var upsertScheduledPost = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => upsertSchema.parse(d)).handler(upsertScheduledPost_createServerFn_handler, async ({ data, context }) => {
	const paths = data.image_paths ?? (data.image_path ? [data.image_path] : []);
	const payload = {
		...data,
		image_paths: paths,
		image_path: paths[0] ?? null,
		user_id: context.userId,
		status: "pending",
		last_error: null
	};
	let targetId = data.id;
	if (targetId) {
		const { error } = await context.supabase.from("scheduled_posts").update(payload).eq("id", targetId).eq("user_id", context.userId);
		if (error) throw new Error(error.message);
	} else {
		const { data: row, error } = await context.supabase.from("scheduled_posts").insert(payload).select("id").maybeSingle();
		if (error) throw new Error(error.message);
		targetId = row?.id;
	}
	return {
		ok: true,
		id: targetId
	};
});
var deleteScheduledPost_createServerFn_handler = createServerRpc({
	id: "6f0ea51432a5d025936e137e19dc67176b59a1a8a31db1d05b16c0f2761b9ba6",
	name: "deleteScheduledPost",
	filename: "src/lib/scheduled-posts.functions.ts"
}, (opts) => deleteScheduledPost.__executeServer(opts));
var deleteScheduledPost = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteScheduledPost_createServerFn_handler, async ({ data, context }) => {
	const { data: row } = await context.supabase.from("scheduled_posts").select("image_path,image_paths,video_path").eq("id", data.id).eq("user_id", context.userId).maybeSingle();
	const imgs = [...row?.image_paths ?? [], ...row?.image_path ? [row.image_path] : []].filter((v, i, a) => v && a.indexOf(v) === i);
	if (imgs.length) await context.supabase.storage.from("post-images").remove(imgs);
	if (row?.video_path) await context.supabase.storage.from("post-videos").remove([row.video_path]);
	const { error } = await context.supabase.from("scheduled_posts").delete().eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var createVideoUploadUrl_createServerFn_handler = createServerRpc({
	id: "c87d3af86ef10128ec35f624eda337caedec16f84c61e48c1836c50fcd6d3157",
	name: "createVideoUploadUrl",
	filename: "src/lib/scheduled-posts.functions.ts"
}, (opts) => createVideoUploadUrl.__executeServer(opts));
var createVideoUploadUrl = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ filename: stringType().min(1).max(200) }).parse(d)).handler(createVideoUploadUrl_createServerFn_handler, async ({ data, context }) => {
	await ensureBucket(context.supabase, "post-videos");
	const safeName = data.filename.replace(/[^\w.\-]/g, "_");
	const path = `${context.userId}/${crypto.randomUUID()}-${safeName}`;
	const { data: signed, error } = await context.supabase.storage.from("post-videos").createSignedUploadUrl(path);
	if (error) throw new Error(error.message);
	return {
		path,
		token: signed.token,
		signed_url: signed.signedUrl
	};
});
var getPostVideoUrl_createServerFn_handler = createServerRpc({
	id: "b9f30ce6a4071891794479f7d27d25c842df0267400e85f2ac6eede00fd27714",
	name: "getPostVideoUrl",
	filename: "src/lib/scheduled-posts.functions.ts"
}, (opts) => getPostVideoUrl.__executeServer(opts));
var getPostVideoUrl = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ path: stringType() }).parse(d)).handler(getPostVideoUrl_createServerFn_handler, async ({ data, context }) => {
	const { data: signed, error } = await context.supabase.storage.from("post-videos").createSignedUrl(data.path, 604800);
	if (error) throw new Error(error.message);
	return { signed_url: signed.signedUrl };
});
var uploadSchema = objectType({
	filename: stringType().min(1).max(200),
	content_type: stringType().min(1).max(80),
	data_base64: stringType().min(1)
});
var uploadPostImage_createServerFn_handler = createServerRpc({
	id: "26c1e30da5244238e5a951bad49504d5a522eddf0427dac29c31550b43ff2a63",
	name: "uploadPostImage",
	filename: "src/lib/scheduled-posts.functions.ts"
}, (opts) => uploadPostImage.__executeServer(opts));
var uploadPostImage = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => uploadSchema.parse(d)).handler(uploadPostImage_createServerFn_handler, async ({ data, context }) => {
	const safeName = data.filename.replace(/[^\w.\-]/g, "_");
	const buffer = Buffer.from(data.data_base64, "base64");
	const contentType = data.content_type || "image/jpeg";
	const publicUrl = await uploadMediaFile({
		userId: context.userId,
		bucket: "post-images",
		fileName: safeName,
		contentType,
		buffer
	});
	return {
		path: publicUrl,
		signed_url: publicUrl
	};
});
var createImageUploadUrl_createServerFn_handler = createServerRpc({
	id: "60ee1005f84247891096138c5b4921ff016a26e42aee0a2dc5d9251252d761a7",
	name: "createImageUploadUrl",
	filename: "src/lib/scheduled-posts.functions.ts"
}, (opts) => createImageUploadUrl.__executeServer(opts));
var createImageUploadUrl = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ filename: stringType().min(1).max(200) }).parse(d)).handler(createImageUploadUrl_createServerFn_handler, async ({ data, context }) => {
	await ensureBucket(context.supabase, "post-images");
	const safeName = data.filename.replace(/[^\w.\-]/g, "_");
	const path = `${context.userId}/${crypto.randomUUID()}-${safeName}`;
	const { data: signed, error } = await context.supabase.storage.from("post-images").createSignedUploadUrl(path);
	if (error) throw new Error(error.message);
	return {
		path,
		token: signed.token,
		signed_url: signed.signedUrl
	};
});
var getPostImageUrl_createServerFn_handler = createServerRpc({
	id: "87b48a15a2993590ed8642c04e9de2e2617f1ef7f86807a8bf228d2360113983",
	name: "getPostImageUrl",
	filename: "src/lib/scheduled-posts.functions.ts"
}, (opts) => getPostImageUrl.__executeServer(opts));
var getPostImageUrl = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ path: stringType() }).parse(d)).handler(getPostImageUrl_createServerFn_handler, async ({ data, context }) => {
	if (data.path.startsWith("http://") || data.path.startsWith("https://")) return { signed_url: data.path };
	const { data: signed, error } = await context.supabase.storage.from("post-images").createSignedUrl(data.path, 604800);
	if (error) throw new Error(error.message);
	return { signed_url: signed.signedUrl };
});
var publishScheduledPostNow_createServerFn_handler = createServerRpc({
	id: "606264e0a388f27dbafffa543b5bf4b33dfa30de245439d75095d08fc10fc472",
	name: "publishScheduledPostNow",
	filename: "src/lib/scheduled-posts.functions.ts"
}, (opts) => publishScheduledPostNow.__executeServer(opts));
var publishScheduledPostNow = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(publishScheduledPostNow_createServerFn_handler, async ({ data, context }) => {
	const { data: row, error } = await context.supabase.from("scheduled_posts").select("id,user_id").eq("id", data.id).maybeSingle();
	if (error) throw new Error(error.message);
	if (!row || row.user_id !== context.userId) throw new Error("Publication tsy hita.");
	const { runScheduledPost } = await import("./post-publisher.server-a_WaKHzy.mjs");
	return await runScheduledPost(data.id);
});
//#endregion
export { createImageUploadUrl_createServerFn_handler, createVideoUploadUrl_createServerFn_handler, deleteScheduledPost_createServerFn_handler, getPostImageUrl_createServerFn_handler, getPostVideoUrl_createServerFn_handler, listScheduledPosts_createServerFn_handler, publishScheduledPostNow_createServerFn_handler, uploadPostImage_createServerFn_handler, upsertScheduledPost_createServerFn_handler };
