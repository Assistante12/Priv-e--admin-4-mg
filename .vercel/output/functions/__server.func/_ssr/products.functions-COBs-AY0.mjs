import { r as createServerFn } from "./server-PdCEgQXm.mjs";
import { t as createServerRpc } from "./createServerRpc-CNvf87y9.mjs";
import { t as requireWorkspaceAuth } from "./workspace-middleware-BESKEWcR.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, r as enumType } from "../_libs/zod.mjs";
import { t as uploadMediaFile } from "./storage-helper.server-BlDDvwDn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products.functions-COBs-AY0.js
var listProducts_createServerFn_handler = createServerRpc({
	id: "51ad93d03c52987e0e52d0164e41771f8765a8919d8a537367eaf795dff9b9d8",
	name: "listProducts",
	filename: "src/lib/products.functions.ts"
}, (opts) => listProducts.__executeServer(opts));
var listProducts = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(listProducts_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("products").select("*, product_images(*)").eq("user_id", context.userId).order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return await Promise.all((data ?? []).map(async (p) => {
		const imgs = p.product_images ?? [];
		const signed = await Promise.all(imgs.map(async (img) => {
			if (!img.image_path) return {
				...img,
				url: ""
			};
			if (img.image_path.startsWith("data:") || img.image_path.startsWith("http://") || img.image_path.startsWith("https://")) return {
				...img,
				url: img.image_path
			};
			try {
				if (context.supabase?.storage && typeof context.supabase.storage.from === "function") {
					const bucket = context.supabase.storage.from("product-images");
					if (typeof bucket?.createSignedUrl === "function") {
						const { data: s } = await bucket.createSignedUrl(img.image_path, 3600);
						return {
							...img,
							url: s?.signedUrl || img.image_path
						};
					}
				}
				return {
					...img,
					url: img.image_path
				};
			} catch {
				return {
					...img,
					url: img.image_path
				};
			}
		}));
		return {
			...p,
			product_images: signed
		};
	}));
});
var uploadImageSchema = objectType({
	product_id: stringType().uuid(),
	data_base64: stringType().min(1),
	content_type: stringType().default("image/jpeg"),
	filename: stringType().optional(),
	sort_order: numberType().int().default(0)
});
var uploadProductImageServer_createServerFn_handler = createServerRpc({
	id: "73194ecd5678bb8991c7deca8a6ecf50be7fccd1d7dcc7e8df175a99f5e1d987",
	name: "uploadProductImageServer",
	filename: "src/lib/products.functions.ts"
}, (opts) => uploadProductImageServer.__executeServer(opts));
var uploadProductImageServer = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => uploadImageSchema.parse(d)).handler(uploadProductImageServer_createServerFn_handler, async ({ data, context }) => {
	const safeName = (data.filename || "image.jpg").replace(/[^\w.-]/g, "_");
	const contentType = data.content_type || "image/jpeg";
	const buffer = Buffer.from(data.data_base64, "base64");
	const publicUrl = await uploadMediaFile({
		userId: context.userId,
		bucket: "product-images",
		fileName: safeName,
		contentType,
		buffer,
		folder: data.product_id
	});
	const { error: insErr } = await context.supabase.from("product_images").insert({
		product_id: data.product_id,
		image_path: publicUrl,
		sort_order: data.sort_order,
		user_id: context.userId
	});
	if (insErr) throw new Error(insErr.message);
	return {
		ok: true,
		image_path: publicUrl
	};
});
var upsertSchema = objectType({
	id: stringType().nullable().optional(),
	name: stringType().min(1, "Veuillez renseigner le nom du produit").max(200),
	price: numberType().min(0),
	stock: numberType().int().min(0),
	description: stringType().max(5e3).nullable().optional(),
	payment_flow: enumType(["admin_numbers", "client_contact"]),
	is_active: booleanType().default(true)
});
var upsertProduct_createServerFn_handler = createServerRpc({
	id: "3b4a3c54812b4c0b1ed31ec62bbf2a64c77b8c36025f31e942058a97a061226e",
	name: "upsertProduct",
	filename: "src/lib/products.functions.ts"
}, (opts) => upsertProduct.__executeServer(opts));
var upsertProduct = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => upsertSchema.parse(d)).handler(upsertProduct_createServerFn_handler, async ({ data, context }) => {
	let res;
	const cleanId = data.id && data.id.trim().length > 0 ? data.id.trim() : void 0;
	const payload = {
		name: data.name.trim(),
		price: Number(data.price),
		stock: Number(data.stock),
		description: data.description ? data.description.trim() : null,
		payment_flow: data.payment_flow,
		is_active: data.is_active,
		user_id: context.userId
	};
	if (cleanId) res = await context.supabase.from("products").update(payload).eq("id", cleanId).eq("user_id", context.userId).select().single();
	else res = await context.supabase.from("products").insert(payload).select().single();
	if (res.error) throw new Error(res.error.message);
	return res.data;
});
var deleteProduct_createServerFn_handler = createServerRpc({
	id: "154b8633eea94111b40f7036631572cb49e5f458d27dce468c3338ae0c0dc0db",
	name: "deleteProduct",
	filename: "src/lib/products.functions.ts"
}, (opts) => deleteProduct.__executeServer(opts));
var deleteProduct = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteProduct_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("products").delete().eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var addProductImage_createServerFn_handler = createServerRpc({
	id: "7a9e83ca489366d7ffab2aacbcb4ec98ba75f6b93aff08fb46695dd1366cc853",
	name: "addProductImage",
	filename: "src/lib/products.functions.ts"
}, (opts) => addProductImage.__executeServer(opts));
var addProductImage = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({
	product_id: stringType().uuid(),
	image_path: stringType().min(1).max(500),
	sort_order: numberType().int().default(0)
}).parse(d)).handler(addProductImage_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("product_images").insert({
		...data,
		user_id: context.userId
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
var deleteProductImage_createServerFn_handler = createServerRpc({
	id: "77cbf8b7a360c88aa467c19f7d3bd7de806ac6a7af905570781567f7fae073ce",
	name: "deleteProductImage",
	filename: "src/lib/products.functions.ts"
}, (opts) => deleteProductImage.__executeServer(opts));
var deleteProductImage = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteProductImage_createServerFn_handler, async ({ data, context }) => {
	const { data: row } = await context.supabase.from("product_images").select("image_path").eq("id", data.id).eq("user_id", context.userId).maybeSingle();
	if (row?.image_path && context.supabase?.storage && typeof context.supabase.storage.from === "function") try {
		const bucket = context.supabase.storage.from("product-images");
		if (typeof bucket?.remove === "function") await bucket.remove([row.image_path]);
	} catch (e) {
		console.warn("[deleteProductImage] storage remove error:", e);
	}
	const { error } = await context.supabase.from("product_images").delete().eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { addProductImage_createServerFn_handler, deleteProductImage_createServerFn_handler, deleteProduct_createServerFn_handler, listProducts_createServerFn_handler, uploadProductImageServer_createServerFn_handler, upsertProduct_createServerFn_handler };
