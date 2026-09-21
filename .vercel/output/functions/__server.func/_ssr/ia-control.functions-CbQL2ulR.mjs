import { r as createServerFn } from "./server-D9pwzi9_.mjs";
import { t as createServerRpc } from "./createServerRpc-DxF-NOaI.mjs";
import { t as requireWorkspaceAuth } from "./workspace-middleware-CoslEc7v.mjs";
import { a as objectType, n as booleanType, o as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ia-control.functions-CbQL2ulR.js
var setGlobalIaStopped_createServerFn_handler = createServerRpc({
	id: "e56f08e782ecfec6c325cc6510b7357e1d5baa16daa0ef608ba50fed9b68ad5a",
	name: "setGlobalIaStopped",
	filename: "src/lib/ia-control.functions.ts"
}, (opts) => setGlobalIaStopped.__executeServer(opts));
var setGlobalIaStopped = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ stopped: booleanType() }).parse(d)).handler(setGlobalIaStopped_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("settings").upsert({
		user_id: context.userId,
		global_ia_stopped: data.stopped
	}, { onConflict: "user_id" });
	if (error) throw new Error(error.message);
	return { ok: true };
});
var listClientIaStates_createServerFn_handler = createServerRpc({
	id: "998a320da8868de47b7f62f38b334dee4911168eb7b2e4f328a373002fcd2d71",
	name: "listClientIaStates",
	filename: "src/lib/ia-control.functions.ts"
}, (opts) => listClientIaStates.__executeServer(opts));
var listClientIaStates = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(listClientIaStates_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("client_ia_state").select("*").order("updated_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var setClientIaStopped_createServerFn_handler = createServerRpc({
	id: "0a45c3d251d1b1dcb05cd08b9f7ee1b20aa4759d01463a1ec8d0727bcd43798e",
	name: "setClientIaStopped",
	filename: "src/lib/ia-control.functions.ts"
}, (opts) => setClientIaStopped.__executeServer(opts));
var setClientIaStopped = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({
	page_id: stringType().min(1),
	client_fb_id: stringType().min(1),
	client_fb_name: stringType().nullable().optional(),
	ia_stopped: booleanType()
}).parse(d)).handler(setClientIaStopped_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("client_ia_state").upsert({
		...data,
		user_id: context.userId
	}, { onConflict: "user_id,page_id,client_fb_id" });
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { listClientIaStates_createServerFn_handler, setClientIaStopped_createServerFn_handler, setGlobalIaStopped_createServerFn_handler };
