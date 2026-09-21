import { r as createServerFn } from "./server-PdCEgQXm.mjs";
import { t as createServerRpc } from "./createServerRpc-CNvf87y9.mjs";
import { t as requireWorkspaceAuth } from "./workspace-middleware-BESKEWcR.mjs";
import { a as objectType, n as booleanType, o as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payment-methods.functions-DeySdcmg.js
var listPaymentMethods_createServerFn_handler = createServerRpc({
	id: "0199c1b4c7815097660cf09f26437f3e4bd7df28b5b33595a666b42732424271",
	name: "listPaymentMethods",
	filename: "src/lib/payment-methods.functions.ts"
}, (opts) => listPaymentMethods.__executeServer(opts));
var listPaymentMethods = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(listPaymentMethods_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("payment_methods").select("*").eq("user_id", context.userId).order("created_at", { ascending: true });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var upsertSchema = objectType({
	id: stringType().nullable().optional(),
	label: stringType().min(1).max(100),
	number: stringType().min(1).max(100),
	instructions: stringType().max(1e3).nullable().optional(),
	is_active: booleanType().default(true)
});
var upsertPaymentMethod_createServerFn_handler = createServerRpc({
	id: "853b5aa544a7c0a49cc45c1a0f420af5e069af898c609aa61d87c33899afd2a3",
	name: "upsertPaymentMethod",
	filename: "src/lib/payment-methods.functions.ts"
}, (opts) => upsertPaymentMethod.__executeServer(opts));
var upsertPaymentMethod = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => upsertSchema.parse(d)).handler(upsertPaymentMethod_createServerFn_handler, async ({ data, context }) => {
	const cleanId = data.id && data.id.trim().length > 0 ? data.id.trim() : void 0;
	const payload = {
		label: data.label.trim(),
		number: data.number.trim(),
		instructions: data.instructions ? data.instructions.trim() : null,
		is_active: data.is_active,
		user_id: context.userId
	};
	if (cleanId) payload.id = cleanId;
	const { error } = await context.supabase.from("payment_methods").upsert(payload);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var deletePaymentMethod_createServerFn_handler = createServerRpc({
	id: "55fc0484b9941926147081b475de8d7569a7391edff13c9e7550b50cc47da0d3",
	name: "deletePaymentMethod",
	filename: "src/lib/payment-methods.functions.ts"
}, (opts) => deletePaymentMethod.__executeServer(opts));
var deletePaymentMethod = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deletePaymentMethod_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("payment_methods").delete().eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { deletePaymentMethod_createServerFn_handler, listPaymentMethods_createServerFn_handler, upsertPaymentMethod_createServerFn_handler };
