import { r as createServerFn } from "./server-BRvJ2kb2.mjs";
import { t as createServerRpc } from "./createServerRpc-CtiMBgU6.mjs";
import { t as requireWorkspaceAuth } from "./workspace-middleware-DCv0kXWS.mjs";
import { a as objectType, i as numberType, o as stringType, r as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders.functions-C1aLOb_9.js
var listOrders_createServerFn_handler = createServerRpc({
	id: "e004c3669ad9314e0f13dd8e45194bd1d7a95f814599b1d8484097691817695f",
	name: "listOrders",
	filename: "src/lib/orders.functions.ts"
}, (opts) => listOrders.__executeServer(opts));
var listOrders = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ type: enumType([
	"training",
	"sales",
	"all"
]).optional() }).parse(d)).handler(listOrders_createServerFn_handler, async ({ data, context }) => {
	let query = context.supabase.from("orders").select("*, trainings(name), products(name, stock)").eq("user_id", context.userId).order("created_at", { ascending: false });
	if (data?.type && data.type !== "all") query = query.eq("type", data.type);
	const { data: rows, error } = await query;
	if (error) throw new Error(error.message);
	return rows ?? [];
});
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
var createOrder_createServerFn_handler = createServerRpc({
	id: "7f92d135aa3763ddd5bf6d4d9f84832b6b591cbaa35dcc4048b4b1beed8e7bf3",
	name: "createOrder",
	filename: "src/lib/orders.functions.ts"
}, (opts) => createOrder.__executeServer(opts));
var createOrder = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => createSchema.parse(d)).handler(createOrder_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("orders").insert({
		...data,
		user_id: context.userId
	});
	if (error) throw new Error(error.message);
	try {
		const { notifyNewOrderToAdmin } = await import("./push-notify.server-Bi0V6O-Y.mjs");
		await notifyNewOrderToAdmin(context.userId, {
			clientName: data.client_fb_name ?? null,
			item: data.notes ?? null,
			quantity: data.quantity,
			type: data.type
		});
	} catch (e) {
		console.error("[createOrder] push notify error:", e);
	}
	return { ok: true };
});
var updateOrderStatus_createServerFn_handler = createServerRpc({
	id: "ce3247af923fb83e1b50e04a2d3399abe6b8ac7e9c8330b2019de9668492b17f",
	name: "updateOrderStatus",
	filename: "src/lib/orders.functions.ts"
}, (opts) => updateOrderStatus.__executeServer(opts));
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
}).parse(d)).handler(updateOrderStatus_createServerFn_handler, async ({ data, context }) => {
	const { data: order, error } = await context.supabase.from("orders").update({ status: data.status }).eq("id", data.id).eq("user_id", context.userId).select("*").single();
	if (error) throw new Error(error.message);
	if (order.type === "sales" && order.product_id && (data.status === "accepted" || data.status === "delivered")) {
		const { data: prod } = await context.supabase.from("products").select("stock").eq("id", order.product_id).eq("user_id", context.userId).maybeSingle();
		if (prod && prod.stock >= (order.quantity ?? 1)) await context.supabase.from("products").update({ stock: prod.stock - (order.quantity ?? 1) }).eq("id", order.product_id).eq("user_id", context.userId);
	}
	let notified = false;
	if ([
		"accepted",
		"refused",
		"delivered"
	].includes(data.status)) try {
		const { notifyOrderStatusToClient } = await import("./ai-engine.server-CzVx6OLP.mjs");
		notified = (await notifyOrderStatusToClient(context.userId, data.id, data.status)).sent;
	} catch (e) {
		console.error("[updateOrderStatus] notify error", e);
	}
	return {
		ok: true,
		notified
	};
});
var deleteOrder_createServerFn_handler = createServerRpc({
	id: "44cca4472781b72fce225eb66a79e7db8b18f0231cf73c6a965748d52107bf55",
	name: "deleteOrder",
	filename: "src/lib/orders.functions.ts"
}, (opts) => deleteOrder.__executeServer(opts));
var deleteOrder = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteOrder_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("orders").delete().eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { createOrder_createServerFn_handler, deleteOrder_createServerFn_handler, listOrders_createServerFn_handler, updateOrderStatus_createServerFn_handler };
