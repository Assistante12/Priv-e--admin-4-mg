import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const SUBSCRIBE_FIELDS = "messages,messaging_postbacks,feed,message_reactions";

export type CentralPageRow = {
  id: string;
  page_id: string;
  page_name: string;
  assigned_workspace_id: string | null;
  assigned_workspace_name: string | null;
};

/** Pejy rehetra avy amin'ny connexion Facebook foibe + ny workspace nanokanana azy. */
export const listCentralPages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: pages, error }, { data: workspaces }] = await Promise.all([
      context.supabase
        .from("facebook_central_pages")
        .select("id,page_id,page_name,assigned_workspace_id")
        .eq("owner_user_id", context.userId)
        .order("page_name", { ascending: true }),
      context.supabase.from("workspaces").select("id,name").order("name", { ascending: true }),
    ]);
    if (error) throw new Error(error.message);

    const nameById = new Map((workspaces ?? []).map((w) => [w.id, w.name]));
    const rows: CentralPageRow[] = (pages ?? []).map((p) => ({
      id: p.id,
      page_id: p.page_id,
      page_name: p.page_name,
      assigned_workspace_id: p.assigned_workspace_id ?? null,
      assigned_workspace_name: p.assigned_workspace_id
        ? (nameById.get(p.assigned_workspace_id) ?? null)
        : null,
    }));
    return {
      pages: rows,
      workspaces: (workspaces ?? []).map((w) => ({ id: w.id, name: w.name })),
    };
  });

/** Manokana pejy ho an'ny workspace iray (izy ihany no handray ny hafatra sy ny IA-ny). */
export const assignPageToWorkspace = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ page_id: z.string().min(1), workspace_id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: page, error } = await context.supabase
      .from("facebook_central_pages")
      .select("page_id,page_name,page_access_token,user_access_token,token_expires_at")
      .eq("owner_user_id", context.userId)
      .eq("page_id", data.page_id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!page) throw new Error("Tsy hita ity pejy ity amin'ny connexion foibe.");

    const accessible =
      data.workspace_id === context.userId
        ? true
        : !!(
            await context.supabase
              .from("workspace_members")
              .select("workspace_id")
              .eq("workspace_id", data.workspace_id)
              .eq("user_id", context.userId)
              .maybeSingle()
          ).data;
    if (!accessible) throw new Error("Tsy manana fahazoan-dàlana amin'ity workspace ity ianao.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Ny pejy tsy mifangaro: esorina amin'ny workspace hafa alohan'ny hanokanana.
    await supabaseAdmin
      .from("facebook_pages")
      .delete()
      .eq("page_id", page.page_id)
      .neq("user_id", data.workspace_id);

    let subscribed = false;
    try {
      const res = await fetch(
        `https://graph.facebook.com/v21.0/${page.page_id}/subscribed_apps?subscribed_fields=${SUBSCRIBE_FIELDS}&access_token=${page.page_access_token}`,
        { method: "POST" },
      );
      const json: any = await res.json();
      subscribed = !!json.success;
    } catch (e) {
      console.error("[fb central] subscribe error", page.page_id, e);
    }

    const { error: upsertError } = await supabaseAdmin.from("facebook_pages").upsert(
      {
        user_id: data.workspace_id,
        page_id: page.page_id,
        page_name: page.page_name,
        page_access_token: page.page_access_token,
        user_access_token: page.user_access_token,
        token_expires_at: page.token_expires_at,
        is_connected: true,
        webhook_subscribed: subscribed,
      },
      { onConflict: "user_id,page_id" },
    );
    if (upsertError) throw new Error(upsertError.message);

    const { error: assignError } = await context.supabase
      .from("facebook_central_pages")
      .update({ assigned_workspace_id: data.workspace_id })
      .eq("owner_user_id", context.userId)
      .eq("page_id", page.page_id);
    if (assignError) throw new Error(assignError.message);

    return { ok: true, webhook_subscribed: subscribed };
  });

/** Manala ny fanokanana: tsy voatantan'ny workspace intsony ilay pejy. */
export const unassignPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ page_id: z.string().min(1) }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: page } = await context.supabase
      .from("facebook_central_pages")
      .select("page_id,assigned_workspace_id")
      .eq("owner_user_id", context.userId)
      .eq("page_id", data.page_id)
      .maybeSingle();
    if (!page) throw new Error("Tsy hita ity pejy ity.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (page.assigned_workspace_id) {
      await supabaseAdmin
        .from("facebook_pages")
        .update({ is_connected: false })
        .eq("page_id", page.page_id)
        .eq("user_id", page.assigned_workspace_id);
    }
    const { error } = await context.supabase
      .from("facebook_central_pages")
      .update({ assigned_workspace_id: null })
      .eq("owner_user_id", context.userId)
      .eq("page_id", page.page_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Mamerina maka ny lisitry ny pejy avy amin'ny token foibe efa voatahiry. */
export const refreshCentralPages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({}).parse(d ?? {}))
  .handler(async ({ context }) => {
    const { data: rows } = await context.supabase
      .from("facebook_central_pages")
      .select("user_access_token,updated_at")
      .eq("owner_user_id", context.userId)
      .not("user_access_token", "is", null)
      .order("updated_at", { ascending: false })
      .limit(1);
    const userToken = rows?.[0]?.user_access_token;
    if (!userToken) {
      throw new Error(
        "Mbola tsy misy connexion Facebook foibe. Tsindrio 'Connecter avec Facebook' ao amin'ny pejy Facebook.",
      );
    }

    const pages: Array<{ id: string; name: string; access_token: string }> = [];
    let nextUrl: string | null = `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token&limit=100&access_token=${userToken}`;
    let guard = 0;
    while (nextUrl && guard < 10) {
      guard += 1;
      const res = await fetch(nextUrl);
      const json: any = await res.json();
      if (json.error) throw new Error(json.error.message);
      for (const p of json.data ?? []) {
        if (p?.id && !pages.some((e) => e.id === p.id)) pages.push(p);
      }
      nextUrl = json.paging?.next ?? null;
    }

    for (const p of pages) {
      await context.supabase.from("facebook_central_pages").upsert(
        {
          owner_user_id: context.userId,
          page_id: p.id,
          page_name: p.name,
          page_access_token: p.access_token,
          user_access_token: userToken,
        },
        { onConflict: "page_id" },
      );
    }
    return { ok: true, count: pages.length };
  });
