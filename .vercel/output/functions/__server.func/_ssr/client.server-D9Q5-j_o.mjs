import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import { t as firestoreClient } from "./auth-middleware-7JkvY_7z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client.server-D9Q5-j_o.js
var client_server_D9Q5_j_o_exports = /* @__PURE__ */ __exportAll({
	n: () => supabaseAdmin,
	t: () => client_server_exports
});
var client_server_exports = /* @__PURE__ */ __exportAll$1({ supabaseAdmin: () => supabaseAdmin });
var supabaseAdmin = new Proxy(firestoreClient, { get(target, prop, receiver) {
	if (prop === "from") return (table) => firestoreClient.from(table);
	return Reflect.get(target, prop, receiver);
} });
//#endregion
export { supabaseAdmin as n, client_server_D9Q5_j_o_exports as t };
