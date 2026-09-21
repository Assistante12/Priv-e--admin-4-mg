import { createServerFn } from "@tanstack/react-start";
import { requireWorkspaceAuth } from "@/lib/workspace-middleware";
import { z } from "zod";
import { getRequestHost } from "@tanstack/react-start/server";

const FB_SCOPES = [
  "pages_messaging",
  "pages_manage_engagement",
  "pages_manage_posts",
  "pages_read_engagement",
  "pages_show_list",
  "pages_read_user_content",
  "pages_manage_metadata",
  "public_profile",
].join(",");

function baseUrl() {
  const host = getRequestHost();
  if (!host) {
    return (
      process.env.APP_URL ||
      process.env.PUBLIC_URL ||
      "https://ais-dev-bqp7a7twhf5wtekadnjhfa-146955802313.europe-west2.run.app"
    );
  }
  const proto = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  return `${proto}://${host}`;
}

export const getFacebookLoginUrl = createServerFn({ method: "GET" })
  .middleware([requireWorkspaceAuth])
  .handler(async ({ context }) => {
    const { resolveFacebookApp } = await import("@/lib/facebook-app.server");
    const app = await resolveFacebookApp(context.userId);
    if (!app.appId || !app.appSecret) {
      throw new Error(
        "Mbola tsy voaomana ny Facebook App foibe. Ny tompon'ny kaonty foibe ihany no mampiditra ny App ID sy App Secret indray mandeha ao amin'ny Paramètres.",
      );
    }
    const redirect = `${baseUrl()}/api/public/fb/callback`;
    const state = `${context.userId}.${crypto.randomUUID()}.${app.appId}`;
    const url = new URL("https://www.facebook.com/v21.0/dialog/oauth");
    url.searchParams.set("client_id", app.appId);
    url.searchParams.set("redirect_uri", redirect);
    url.searchParams.set("state", state);
    url.searchParams.set("scope", FB_SCOPES);
    url.searchParams.set("auth_type", "rerequest");
    url.searchParams.set("response_type", "code");
    return { url: url.toString(), redirect_uri: redirect };
  });

/** Fanoritsoritana ny Facebook App foibe (ampiasain'ny pejy Paramètres). */
export const getFacebookAppStatus = createServerFn({ method: "GET" })
  .middleware([requireWorkspaceAuth])
  .handler(async ({ context }) => {
    const { resolveFacebookApp } = await import("@/lib/facebook-app.server");
    const app = await resolveFacebookApp(context.userId);
    const isOwner =
      !app.ownerUserId ||
      context.authUserId === app.ownerUserId ||
      context.userId === app.ownerUserId;
    return {
      configured: !!(app.appId && app.appSecret),
      central: app.central,
      /** true raha ity mpampiasa ity no tompon'ny kaonty / workspace */
      is_central_account: isOwner,
      app_id_preview: app.appId ? `${app.appId.slice(0, 6)}…${app.appId.slice(-4)}` : "",
      app_id: app.appId,
    };
  });

export const getWebhookConfig = createServerFn({ method: "GET" })
  .middleware([requireWorkspaceAuth])
  .handler(async ({ context }) => {
    const { resolveFacebookApp, ensureCentralVerifyToken } = await import(
      "@/lib/facebook-app.server"
    );
    const app = await resolveFacebookApp(context.userId);
    const token = await ensureCentralVerifyToken(app.ownerUserId, app.verifyToken);
    return {
      callback_url: `${baseUrl()}/api/public/fb/webhook`,
      oauth_redirect_uri: `${baseUrl()}/api/public/fb/callback`,
      verify_token: token,
    };
  });

export const triggerCommentScan = createServerFn({ method: "POST" })
  .middleware([requireWorkspaceAuth])
  .inputValidator((d: unknown) => z.object({}).parse(d ?? {}))
  .handler(async ({ context }) => {
    const { scanAndReplyCommentsForUser } = await import("@/lib/ai-engine.server");
    const res = await scanAndReplyCommentsForUser(context.userId, { force: true });
    return {
      ok: true,
      scanned: res.scanned,
      replied: res.replied,
      errors: res.errors,
      details: res.details,
      note: res.details.length
        ? res.details.join("\n")
        : `${res.replied} commentaire(s) répondu(s) sur ${res.scanned} scanné(s).`,
    };
  });
