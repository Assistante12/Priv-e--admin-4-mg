import { r as createServerFn } from "./server-PdCEgQXm.mjs";
import { t as requireWorkspaceAuth } from "./workspace-middleware-BESKEWcR.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BxRoGsb6.mjs";
import { a as objectType, n as booleanType, o as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ia-control.functions-gIVLVAs5.js
var setGlobalIaStopped = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ stopped: booleanType() }).parse(d)).handler(createSsrRpc("e56f08e782ecfec6c325cc6510b7357e1d5baa16daa0ef608ba50fed9b68ad5a"));
createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(createSsrRpc("998a320da8868de47b7f62f38b334dee4911168eb7b2e4f328a373002fcd2d71"));
var setClientIaStopped = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({
	page_id: stringType().min(1),
	client_fb_id: stringType().min(1),
	client_fb_name: stringType().nullable().optional(),
	ia_stopped: booleanType()
}).parse(d)).handler(createSsrRpc("0a45c3d251d1b1dcb05cd08b9f7ee1b20aa4759d01463a1ec8d0727bcd43798e"));
//#endregion
export { setGlobalIaStopped as n, setClientIaStopped as t };
