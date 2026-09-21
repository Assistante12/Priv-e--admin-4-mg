import { r as createServerFn } from "./server-D9pwzi9_.mjs";
import { t as createServerRpc } from "./createServerRpc-DxF-NOaI.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZb5fK_L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-overview.functions-CVIS-Oa6.js
var getAdminUsersOverview_createServerFn_handler = createServerRpc({
	id: "52e8f902c3ab8fa862e987e3d3a360c9ae5dcdd4c2e2b2bba2ce1c12f955e7dc",
	name: "getAdminUsersOverview",
	filename: "src/lib/admin-overview.functions.ts"
}, (opts) => getAdminUsersOverview.__executeServer(opts));
var getAdminUsersOverview = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getAdminUsersOverview_createServerFn_handler, async ({ context }) => {
	const { supabaseAdmin } = await import("./client.server-1p3pFob5.mjs").then((n) => n.t).then((n) => n.t);
	const { data: roleRow } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
	if (!!!roleRow) return {
		users: [],
		usersWithPages: [],
		pages: [],
		totalUsers: 0,
		totalPages: 0
	};
	const [{ data: profiles }, { data: pages }] = await Promise.all([supabaseAdmin.from("profiles").select("id,email,display_name,created_at").order("created_at", { ascending: false }), supabaseAdmin.from("facebook_pages").select("id,user_id,page_id,page_name,is_connected,webhook_subscribed").order("created_at", { ascending: false })]);
	const users = profiles ?? [];
	const byId = new Map(users.map((u) => [u.id, u]));
	const pageRows = (pages ?? []).map((p) => ({
		id: p.id,
		page_id: p.page_id,
		page_name: p.page_name,
		is_connected: !!p.is_connected,
		webhook_subscribed: !!p.webhook_subscribed,
		user_email: byId.get(p.user_id)?.email ?? null,
		user_name: byId.get(p.user_id)?.display_name ?? null
	}));
	const withPagesIds = new Set((pages ?? []).map((p) => p.user_id));
	return {
		users,
		usersWithPages: users.filter((u) => withPagesIds.has(u.id)),
		pages: pageRows,
		totalUsers: users.length,
		totalPages: pageRows.length
	};
});
//#endregion
export { getAdminUsersOverview_createServerFn_handler };
