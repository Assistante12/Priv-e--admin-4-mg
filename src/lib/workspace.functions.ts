import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type WorkspaceRow = {
  id: string;
  name: string;
  assistance_type: string | null;
  is_personal: boolean;
  is_active: boolean;
  has_password: boolean;
  login_email: string | null;
  created_at: string;
};

const UNLOCK_HOURS = 12;

/** Liste (avec recherche + pagination) des workspaces accessibles au compte. */
export const listWorkspaces = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        search: z.string().max(120).optional(),
        limit: z.number().int().min(1).max(100).optional(),
        offset: z.number().int().min(0).optional(),
      })
      .parse(d ?? {}),
  )
  .handler(async ({ data, context }) => {
    const limit = data.limit ?? 50;
    const offset = data.offset ?? 0;

    const { isCentralAccount } = await import("@/lib/central-account.server");
    const isCentral = await isCentralAccount(context.userId);

    const { data: profile } = await context.supabase
      .from("profiles")
      .select("active_workspace_id")
      .eq("id", context.userId)
      .maybeSingle();
    const activeId =
      (profile as { active_workspace_id?: string | null } | null)?.active_workspace_id ??
      context.userId;

    // Isolation: ny mpampiasa tsotra dia tsy mahita afa-tsy ny workspace-ny
    // (personnel + izay efa nohamarininy tamin'ny mot de passe). Ny kaonty foibe ihany
    // no mahita ny lisitra feno.
    let visibleIds: string[] | null = null;
    if (!isCentral) {
      const { data: unlocks } = await context.supabase
        .from("workspace_unlocks")
        .select("workspace_id,expires_at")
        .eq("user_id", context.userId);
      const valid = (unlocks ?? [])
        .filter((u) => u.expires_at && new Date(u.expires_at).getTime() > Date.now())
        .map((u) => u.workspace_id);
      visibleIds = Array.from(new Set([context.userId, activeId, ...valid]));
    }

    let query = context.supabase
      .from("workspaces")
      .select("id,name,assistance_type,created_at,login_email,password_hash", { count: "exact" })
      .order("created_at", { ascending: true })
      .range(offset, offset + limit - 1);
    if (visibleIds) query = query.in("id", visibleIds);
    if (data.search?.trim()) query = query.ilike("name", `%${data.search.trim()}%`);

    const { data: rows, count, error } = await query;
    if (error) throw new Error(error.message);

    const workspaces: WorkspaceRow[] = (rows ?? []).map((w) => ({
      id: w.id,
      name: w.name,
      assistance_type: w.assistance_type ?? null,
      is_personal: w.id === context.userId,
      is_active: w.id === activeId,
      has_password: !!(w as { password_hash?: string | null }).password_hash,
      login_email: (w as { login_email?: string | null }).login_email ?? null,
      created_at: w.created_at,
    }));

    return {
      workspaces,
      total: count ?? workspaces.length,
      activeId,
      is_central: isCentral,
    };
  });

/** Manondro raha ity kaonty ity no kaonty foibe (admin) — ampiasain'ny menu. */
export const getWorkspaceAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { isCentralAccount } = await import("@/lib/central-account.server");
    return { is_central: await isCentralAccount(context.userId) };
  });


export const createWorkspace = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        name: z.string().trim().min(1).max(80),
        email: z.string().trim().email().max(160),
        password: z.string().min(6).max(200),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { hashWorkspacePassword } = await import("@/lib/workspace-password.server");
    const { salt, hash } = await hashWorkspacePassword(data.password);

    const { data: ws, error } = await context.supabase
      .from("workspaces")
      .insert({
        name: data.name,
        owner_user_id: context.userId,
        login_email: data.email.toLowerCase(),
        password_hash: hash,
        password_salt: salt,
        password_updated_at: new Date().toISOString(),
      })
      .select("id,name")
      .single();
    if (error || !ws) throw new Error(error?.message ?? "Tsy afaka namorona workspace.");

    const { error: memberError } = await context.supabase
      .from("workspace_members")
      .insert({ workspace_id: ws.id, user_id: context.userId, role: "owner" });
    if (memberError) throw new Error(memberError.message);

    // Paramètres par défaut du nouveau workspace (scope = workspace id).
    await context.supabase.from("settings").upsert({ user_id: ws.id }, { onConflict: "user_id" });

    // Le créateur vient de saisir le mot de passe : accès déverrouillé.
    await context.supabase.from("workspace_unlocks").upsert(
      {
        user_id: context.userId,
        workspace_id: ws.id,
        expires_at: new Date(Date.now() + UNLOCK_HOURS * 3600_000).toISOString(),
      },
      { onConflict: "user_id,workspace_id" },
    );

    await context.supabase
      .from("profiles")
      .update({ active_workspace_id: ws.id })
      .eq("id", context.userId);

    return { ok: true, id: ws.id, name: ws.name };
  });

/** Manamarina ny mot de passe an'ny workspace dia mamadika ny workspace mavitrika. */
export const unlockWorkspace = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), password: z.string().min(1).max(200) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    // Fanamarinana mot de passe: tsy mila alalana RLS (mety tsy mbola membre ilay olona).
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: ws, error } = await supabaseAdmin
      .from("workspaces")
      .select("id,password_hash,password_salt")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!ws) throw new Error("Tsy hita ity workspace ity.");

    const { verifyWorkspacePassword } = await import("@/lib/workspace-password.server");
    const ok = await verifyWorkspacePassword(
      data.password,
      (ws as { password_salt?: string | null }).password_salt ?? null,
      (ws as { password_hash?: string | null }).password_hash ?? null,
    );
    if (!ok) throw new Error("Mot de passe diso.");

    const { error: unlockError } = await context.supabase.from("workspace_unlocks").upsert(
      {
        user_id: context.userId,
        workspace_id: data.id,
        expires_at: new Date(Date.now() + UNLOCK_HOURS * 3600_000).toISOString(),
      },
      { onConflict: "user_id,workspace_id" },
    );
    if (unlockError) throw new Error(unlockError.message);

    // Antoka: membre sy paramètres misy alohan'ny fidirana.
    const { data: member } = await supabaseAdmin
      .from("workspace_members")
      .select("workspace_id")
      .eq("workspace_id", data.id)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!member) {
      await supabaseAdmin
        .from("workspace_members")
        .insert({ workspace_id: data.id, user_id: context.userId, role: "member" });
    }
    await supabaseAdmin
      .from("settings")
      .upsert({ user_id: data.id }, { onConflict: "user_id", ignoreDuplicates: true });

    const { error: switchError } = await context.supabase
      .from("profiles")
      .update({ active_workspace_id: data.id })
      .eq("id", context.userId);
    if (switchError) throw new Error(switchError.message);

    return { ok: true, id: data.id };
  });

/** "Mot de passe oublié" : ny tompon'ny workspace afaka mamerina mot de passe vaovao. */
export const resetWorkspacePassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        email: z.string().trim().email().max(160),
        new_password: z.string().min(6).max(200),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: ws } = await context.supabase
      .from("workspaces")
      .select("id,login_email")
      .eq("id", data.id)
      .eq("owner_user_id", context.userId)
      .maybeSingle();
    if (!ws) throw new Error("Ianao tsy tompon'ity workspace ity.");

    const currentEmail = ((ws as { login_email?: string | null }).login_email ?? "")
      .trim()
      .toLowerCase();
    if (currentEmail && currentEmail !== data.email.trim().toLowerCase()) {
      throw new Error("Tsy mifanaraka ny email an'ity workspace ity.");
    }

    const { hashWorkspacePassword } = await import("@/lib/workspace-password.server");
    const { salt, hash } = await hashWorkspacePassword(data.new_password);
    const { error } = await context.supabase
      .from("workspaces")
      .update({
        login_email: data.email.trim().toLowerCase(),
        password_hash: hash,
        password_salt: salt,
        password_updated_at: new Date().toISOString(),
      })
      .eq("id", data.id)
      .eq("owner_user_id", context.userId);
    if (error) throw new Error(error.message);

    // Ny fahazoan-dàlana taloha foana: tsy maintsy mampiditra ny mot de passe vaovao.
    await context.supabase.from("workspace_unlocks").delete().eq("workspace_id", data.id);

    return { ok: true };
  });

export type SwitchWorkspaceResult = {
  ok: boolean;
  id: string;
  reason?: "PASSWORD_REQUIRED" | "FORBIDDEN" | "NOT_FOUND";
  message?: string;
};

export const switchWorkspace = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }): Promise<SwitchWorkspaceResult> => {
    if (data.id !== context.userId) {
      // Ny RLS mamela ny SELECT ho an'ny tompona sy ny membre ihany: raha tsy hita → tsy misy alalana.
      const { data: ws } = await context.supabase
        .from("workspaces")
        .select("id,owner_user_id,password_hash")
        .eq("id", data.id)
        .maybeSingle();
      if (!ws) {
        return {
          ok: false,
          id: data.id,
          reason: "FORBIDDEN",
          message: "Tsy manana fahazoan-dàlana amin'ity workspace ity ianao.",
        };
      }

      const isOwner = (ws as { owner_user_id?: string }).owner_user_id === context.userId;
      const { data: member } = await context.supabase
        .from("workspace_members")
        .select("workspace_id")
        .eq("workspace_id", data.id)
        .eq("user_id", context.userId)
        .maybeSingle();
      if (!member && isOwner) {
        // Fanitsiana: ny tompona tsy nisy laharana membre dia ampiana avy hatrany.
        await context.supabase
          .from("workspace_members")
          .insert({ workspace_id: data.id, user_id: context.userId, role: "owner" });
      }
      if (!member && !isOwner) {
        return {
          ok: false,
          id: data.id,
          reason: "FORBIDDEN",
          message: "Tsy manana fahazoan-dàlana amin'ity workspace ity ianao.",
        };
      }

      if ((ws as { password_hash?: string | null }).password_hash) {
        const { data: unlock } = await context.supabase
          .from("workspace_unlocks")
          .select("expires_at")
          .eq("workspace_id", data.id)
          .eq("user_id", context.userId)
          .maybeSingle();
        const valid = unlock?.expires_at && new Date(unlock.expires_at).getTime() > Date.now();
        if (!valid) {
          return {
            ok: false,
            id: data.id,
            reason: "PASSWORD_REQUIRED",
            message: "Mila mot de passe ity workspace ity.",
          };
        }
      }

      // Antoka: misy laharana paramètres ho an'ity workspace ity (tsy hisy erreur amin'ny interface).
      await context.supabase
        .from("settings")
        .upsert({ user_id: data.id }, { onConflict: "user_id", ignoreDuplicates: true });
    }
    const { error } = await context.supabase
      .from("profiles")
      .update({ active_workspace_id: data.id })
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true, id: data.id };
  });

export const renameWorkspace = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), name: z.string().trim().min(1).max(80) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("workspaces")
      .update({ name: data.name })
      .eq("id", data.id)
      .eq("owner_user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteWorkspace = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    if (data.id === context.userId) {
      throw new Error("Tsy azo fafana ny workspace personnel.");
    }
    const { data: owned } = await context.supabase
      .from("workspaces")
      .select("id")
      .eq("id", data.id)
      .eq("owner_user_id", context.userId)
      .maybeSingle();
    if (!owned) throw new Error("Ianao tsy tompon'ity workspace ity.");

    // Nettoyage des données du workspace supprimé (scope = workspace id).
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const scopedTables = [
      "client_greeted",
      "client_ia_state",
      "comments_log",
      "messages_log",
      "orders",
      "product_images",
      "products",
      "training_files",
      "trainings",
      "payment_methods",
      "prompts",
      "gemini_keys",
      "scheduled_posts",
      "facebook_pages",
      "settings",
    ] as const;
    for (const table of scopedTables) {
      const { error: cleanupError } = await supabaseAdmin
        .from(table)
        .delete()
        .eq("user_id", data.id);
      if (cleanupError) console.error(`[workspace] cleanup ${table}: ${cleanupError.message}`);
    }

    const { error } = await context.supabase
      .from("workspaces")
      .delete()
      .eq("id", data.id)
      .eq("owner_user_id", context.userId);
    if (error) throw new Error(error.message);


    const { data: profile } = await context.supabase
      .from("profiles")
      .select("active_workspace_id")
      .eq("id", context.userId)
      .maybeSingle();
    if ((profile as { active_workspace_id?: string | null } | null)?.active_workspace_id === data.id) {
      await context.supabase
        .from("profiles")
        .update({ active_workspace_id: context.userId })
        .eq("id", context.userId);
    }
    return { ok: true };
  });

/**
 * Fidirana amin'ny workspace amin'ny alalan'ny Email + Mot de passe.
 * Tsy mila mahita ny lisitry ny workspace hafa ny mpampiasa: ampy ny mari-pamantarana.
 */
export const unlockWorkspaceByEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        email: z.string().trim().email().max(160),
        password: z.string().min(1).max(200),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: ws } = await supabaseAdmin
      .from("workspaces")
      .select("id,name,password_hash,password_salt")
      .eq("login_email", data.email.trim().toLowerCase())
      .order("created_at", { ascending: false })
      .limit(1);
    const target = ws?.[0];
    if (!target) throw new Error("Email na mot de passe diso.");

    const { verifyWorkspacePassword } = await import("@/lib/workspace-password.server");
    const ok = await verifyWorkspacePassword(
      data.password,
      (target as { password_salt?: string | null }).password_salt ?? null,
      (target as { password_hash?: string | null }).password_hash ?? null,
    );
    if (!ok) throw new Error("Email na mot de passe diso.");

    await context.supabase.from("workspace_unlocks").upsert(
      {
        user_id: context.userId,
        workspace_id: target.id,
        expires_at: new Date(Date.now() + UNLOCK_HOURS * 3600_000).toISOString(),
      },
      { onConflict: "user_id,workspace_id" },
    );

    const { data: member } = await supabaseAdmin
      .from("workspace_members")
      .select("workspace_id")
      .eq("workspace_id", target.id)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!member) {
      await supabaseAdmin
        .from("workspace_members")
        .insert({ workspace_id: target.id, user_id: context.userId, role: "member" });
    }
    await supabaseAdmin
      .from("settings")
      .upsert({ user_id: target.id }, { onConflict: "user_id", ignoreDuplicates: true });

    await context.supabase
      .from("profiles")
      .update({ active_workspace_id: target.id })
      .eq("id", context.userId);

    return { ok: true, id: target.id, name: target.name };
  });
