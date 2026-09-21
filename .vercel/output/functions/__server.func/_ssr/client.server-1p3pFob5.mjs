import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import { t as firestoreClient } from "./auth-middleware-CKF30rlX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client.server-1p3pFob5.js
var client_server_1p3pFob5_exports = /* @__PURE__ */ __exportAll({
	n: () => supabaseAdmin,
	t: () => client_server_exports
});
var client_server_exports = /* @__PURE__ */ __exportAll$1({ supabaseAdmin: () => supabaseAdmin });
var supabaseAdmin = new Proxy(firestoreClient, { get(target, prop, receiver) {
	if (prop === "from") return (table) => firestoreClient.from(table);
	return Reflect.get(target, prop, receiver);
} });
//#endregion
export { supabaseAdmin as n, client_server_1p3pFob5_exports as t };
