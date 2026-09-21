import { createMiddleware } from "@tanstack/react-start";
import { requireFirebaseAuth } from "@/integrations/firebase/auth-middleware";

/**
 * Middleware "workspace" : identique à requireFirebaseAuth, mais `context.userId`
 * devient l'identifiant du workspace actif (scope des données).
 * Le workspace personnel a le même id que l'utilisateur, donc les données
 * existantes continuent de fonctionner sans aucune migration de contenu.
 * `context.authUserId` reste l'identifiant réel du compte connecté.
 */
export const requireWorkspaceAuth = createMiddleware({ type: "function" })
  .middleware([requireFirebaseAuth])
  .server(async ({ next, context }) => {
    const authUserId = context.userId;
    let scope = authUserId;

    try {
      const { data } = await context.supabase
        .from("profiles")
        .select("active_workspace_id")
        .eq("id", authUserId)
        .maybeSingle();
      const candidate = (data as { active_workspace_id?: string | null } | null)
        ?.active_workspace_id;
      if (candidate && candidate !== authUserId) {
        const { data: ws } = await context.supabase
          .from("workspaces")
          .select("password_hash,owner_user_id")
          .eq("id", candidate)
          .maybeSingle();
        const isOwner = (ws as { owner_user_id?: string } | null)?.owner_user_id === authUserId;
        const { data: member } = await context.supabase
          .from("workspace_members")
          .select("workspace_id")
          .eq("workspace_id", candidate)
          .eq("user_id", authUserId)
          .maybeSingle();
        if (member || isOwner) {
          // Workspace voaaro amin'ny mot de passe: mila fahazoan-dàlana manan-kery.
          const locked = !!(ws as { password_hash?: string | null } | null)?.password_hash;
          if (!locked) {
            scope = candidate;
          } else {
            const { data: unlock } = await context.supabase
              .from("workspace_unlocks")
              .select("expires_at")
              .eq("workspace_id", candidate)
              .eq("user_id", authUserId)
              .maybeSingle();
            if (unlock?.expires_at && new Date(unlock.expires_at).getTime() > Date.now()) {
              scope = candidate;
            }
          }
        }
      }
    } catch (e) {
      console.warn("[workspace] scope resolution fallback", e);
    }

    return next({ context: { ...context, userId: scope, authUserId } });
  });
