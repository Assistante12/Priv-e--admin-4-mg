import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/fb/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const error = url.searchParams.get("error");

        if (error) {
          return htmlPage(
            `<h2>Connexion refusée</h2><p>${escapeHtml(error)}</p><p><a href="/facebook">Retour</a></p>`,
          );
        }
        if (!code || !state) {
          return htmlPage(
            `<h2>Paramètres manquants</h2><p><a href="/facebook">Retour</a></p>`,
            400,
          );
        }

        // `state` = <workspace scope>.<nonce>.<app id foibe>
        const [stateUserId, , stateAppId = ""] = state.split(".");
        const userId = stateUserId;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { resolveFacebookApp } = await import("@/lib/facebook-app.server");
        const app = await resolveFacebookApp(userId);
        let appId = app.appId;
        let appSecret = app.appSecret;
        let centralOwnerId = app.ownerUserId;

        if ((!appId || !appSecret) && stateAppId) {
          const fallback = await supabaseAdmin
            .from("settings")
            .select("user_id,facebook_app_id,facebook_app_secret")
            .eq("facebook_app_id", stateAppId.trim())
            .not("facebook_app_secret", "is", null)
            .limit(1)
            .maybeSingle();
          if (fallback.data?.facebook_app_id && fallback.data?.facebook_app_secret) {
            appId = fallback.data.facebook_app_id.trim();
            appSecret = fallback.data.facebook_app_secret.trim();
            centralOwnerId = fallback.data.user_id;
          }
        }

        // Comprehensive search if still missing
        if (!appId || !appSecret) {
          try {
            const { data: anySettings } = await supabaseAdmin
              .from("settings")
              .select("user_id,facebook_app_id,facebook_app_secret")
              .not("facebook_app_id", "is", null)
              .not("facebook_app_secret", "is", null)
              .neq("facebook_app_id", "")
              .neq("facebook_app_secret", "")
              .limit(1)
              .maybeSingle();
            if (anySettings?.facebook_app_id && anySettings?.facebook_app_secret) {
              appId = anySettings.facebook_app_id.trim();
              appSecret = anySettings.facebook_app_secret.trim();
              centralOwnerId = anySettings.user_id;
            }
          } catch (e) {
            console.warn("[FB Callback] Error in fallback settings lookup:", e);
          }
        }

        if (!appId) appId = (process.env["FACEBOOK_APP_ID"] ?? "").trim();
        if (!appSecret) appSecret = (process.env["FACEBOOK_APP_SECRET"] ?? "").trim();

        if (!appId || !appSecret) {
          return htmlPage(
            `<h2>Configuration manquante</h2><p>Ny Facebook App foibe mbola tsy voaomana. Ny tompon'ny kaonty foibe ihany no mampiditra ny App ID sy App Secret ao amin'ny Paramètres.</p><p><a href="/settings">Ouvrir Paramètres</a></p>`,
            500,
          );
        }

        const forwardedProto = request.headers.get("x-forwarded-proto");
        const forwardedHost = request.headers.get("x-forwarded-host");
        const proto = forwardedProto || (url.protocol.startsWith("https") ? "https" : "http");
        const host = forwardedHost || url.host;
        let redirectUri = `${proto}://${host}/api/public/fb/callback`;
        if (process.env.APP_URL && !host.includes("localhost") && !host.includes("127.0.0.1")) {
          redirectUri = `${process.env.APP_URL.replace(/\/$/, "")}/api/public/fb/callback`;
        }

        try {
          // 1. Exchange code -> short-lived user token
          const tokenRes = await fetch(
            `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`,
          );
          const tokenData: any = await tokenRes.json();
          if (!tokenData.access_token)
            throw new Error(tokenData.error?.message ?? "Token exchange failed");

          // 2. Exchange for long-lived token
          const llRes = await fetch(
            `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${tokenData.access_token}`,
          );
          const llData: any = await llRes.json();
          const userToken = llData.access_token ?? tokenData.access_token;
          const expiresAt = llData.expires_in
            ? new Date(Date.now() + llData.expires_in * 1000).toISOString()
            : null;

          const requiredPermissions = [
            "pages_show_list",
            "pages_read_engagement",
            "pages_manage_posts",
          ];
          const permRes = await fetch(
            `https://graph.facebook.com/v21.0/me/permissions?access_token=${userToken}`,
          );
          const permData: any = await permRes.json();
          const granted = new Set(
            (permData.data ?? [])
              .filter((permission: any) => permission.status === "granted")
              .map((permission: any) => permission.permission),
          );
          const missingPermissions = requiredPermissions.filter(
            (permission) => !granted.has(permission),
          );
          if (missingPermissions.length > 0) {
            return htmlPage(
              `<h2>Permission Facebook manquante</h2><p>Facebook n'a pas encore accordé : <strong>${escapeHtml(missingPermissions.join(", "))}</strong>.</p><p>Cliquez à nouveau sur connecter et acceptez toutes les permissions demandées.</p><p><a href="/facebook">Reconnecter</a></p>`,
              403,
            );
          }

          // 3. List every selected page (follow pagination so nothing is lost)
          const pages: Array<{ id: string; name: string; access_token: string; tasks?: string[] }> =
            [];
          let nextUrl: string | null =
            `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,tasks&limit=100&access_token=${userToken}`;
          let guard = 0;
          while (nextUrl && guard < 10) {
            guard += 1;
            const pagesRes = await fetch(nextUrl);
            const pagesData: any = await pagesRes.json();
            if (pagesData.error) throw new Error(pagesData.error.message);
            for (const p of pagesData.data ?? []) {
              if (p?.id && !pages.some((existing) => existing.id === p.id)) pages.push(p);
            }
            nextUrl = pagesData.paging?.next ?? null;
          }
          if (pages.length === 0) {
            return htmlPage(
              `<h2>Aucune page trouvée</h2><p>Assurez-vous d'avoir sélectionné une page lors de la connexion.</p><p><a href="/facebook">Retour</a></p>`,
            );
          }

          // Catalogue central des pages (Solution 1) : réparties ensuite par workspace.
          for (const p of pages) {
            const { error: centralError } = await supabaseAdmin
              .from("facebook_central_pages")
              .upsert(
                {
                  owner_user_id: centralOwnerId,
                  page_id: p.id,
                  page_name: p.name,
                  page_access_token: p.access_token,
                  user_access_token: userToken,
                  token_expires_at: expiresAt,
                },
                { onConflict: "page_id" },
              );
            if (centralError) console.error("[fb central] upsert", p.id, centralError.message);
          }

          const SUBSCRIBE_FIELDS = "messages,messaging_postbacks,feed,message_reactions";
          const saved: string[] = [];
          const failed: string[] = [];
          const noPublish: string[] = [];

          // Every selected page is saved (multi-pages). A page without publish rights
          // is still connected for messages/comments; we only warn about it.
          for (const p of pages) {
            if (p.tasks && !p.tasks.includes("CREATE_CONTENT")) noPublish.push(p.name);

            let subscribed = false;
            try {
              const subRes = await fetch(
                `https://graph.facebook.com/v21.0/${p.id}/subscribed_apps?subscribed_fields=${SUBSCRIBE_FIELDS}&access_token=${p.access_token}`,
                { method: "POST" },
              );
              const subJson: any = await subRes.json();
              subscribed = !!subJson.success;
            } catch (err) {
              console.error("[fb subscribe]", p.id, err);
            }
            const { error: upsertError } = await supabaseAdmin.from("facebook_pages").upsert(
              {
                user_id: userId,
                page_id: p.id,
                page_name: p.name,
                page_access_token: p.access_token,
                user_access_token: userToken,
                token_expires_at: expiresAt,
                is_connected: true,
                webhook_subscribed: subscribed,
              },
              { onConflict: "user_id,page_id" },
            );
            if (upsertError) {
              console.error("[fb callback] upsert error", p.id, upsertError.message);
              failed.push(p.name);
            } else {
              saved.push(p.name);
            }
          }

          if (saved.length === 0) {
            return htmlPage(
              `<h2>Enregistrement échoué</h2><p>Aucune page n'a pu être enregistrée. Réessayez la connexion.</p><p><a href="/facebook">Retour</a></p>`,
              500,
            );
          }

          return htmlPage(
            `<h2>✓ ${saved.length} page(s) connectée(s)</h2><ul>${saved.map((n) => `<li>${escapeHtml(n)}</li>`).join("")}</ul>` +
              (failed.length
                ? `<p>Non enregistrée(s) : ${escapeHtml(failed.join(", "))}</p>`
                : "") +
              (noPublish.length
                ? `<p>Sans droit de publication (messages/commentaires OK) : ${escapeHtml(noPublish.join(", "))}</p>`
                : "") +
              `<p>Redirection…</p><script>setTimeout(()=>location.href='/facebook',2000)</script>`,
          );
        } catch (e) {
          return htmlPage(
            `<h2>Erreur</h2><p>${escapeHtml(e instanceof Error ? e.message : String(e))}</p><p><a href="/facebook">Retour</a></p>`,
            500,
          );
        }
      },
    },
  },
});

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

function htmlPage(inner: string, status = 200) {
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><title>Facebook</title><style>body{font-family:system-ui;background:#111;color:#eee;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px}main{max-width:500px;text-align:center}a{color:#4dd0e1}</style></head><body><main>${inner}</main></body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}
