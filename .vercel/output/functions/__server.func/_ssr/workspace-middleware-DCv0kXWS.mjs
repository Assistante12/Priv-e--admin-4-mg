import { n as createMiddleware } from "./server-BRvJ2kb2.mjs";
import { n as requireFirebaseAuth } from "./auth-middleware-DChct94P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workspace-middleware-DCv0kXWS.js
/**
* Middleware "workspace" : identique à requireFirebaseAuth, mais `context.userId`
* devient l'identifiant du workspace actif (scope des données).
* Le workspace personnel a le même id que l'utilisateur, donc les données
* existantes continuent de fonctionner sans aucune migration de contenu.
* `context.authUserId` reste l'identifiant réel du compte connecté.
*/
var requireWorkspaceAuth = createMiddleware({ type: "function" }).middleware([requireFirebaseAuth]).server(async ({ next, context }) => {
	const authUserId = context.userId;
	let scope = authUserId;
	try {
		const { data } = await context.supabase.from("profiles").select("active_workspace_id").eq("id", authUserId).maybeSingle();
		const candidate = data?.active_workspace_id;
		if (candidate && candidate !== authUserId) {
			const { data: ws } = await context.supabase.from("workspaces").select("password_hash,owner_user_id").eq("id", candidate).maybeSingle();
			const isOwner = ws?.owner_user_id === authUserId;
			const { data: member } = await context.supabase.from("workspace_members").select("workspace_id").eq("workspace_id", candidate).eq("user_id", authUserId).maybeSingle();
			if (member || isOwner) {
				if (!!!ws?.password_hash) scope = candidate;
				else {
					const { data: unlock } = await context.supabase.from("workspace_unlocks").select("expires_at").eq("workspace_id", candidate).eq("user_id", authUserId).maybeSingle();
					if (unlock?.expires_at && new Date(unlock.expires_at).getTime() > Date.now()) scope = candidate;
				}
			}
		}
	} catch (e) {
		console.warn("[workspace] scope resolution fallback", e);
	}
	return next({ context: {
		...context,
		userId: scope,
		authUserId
	} });
});
//#endregion
export { requireWorkspaceAuth as t };
