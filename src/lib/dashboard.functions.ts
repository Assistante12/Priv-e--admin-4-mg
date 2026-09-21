import { createServerFn } from "@tanstack/react-start";
import { requireWorkspaceAuth } from "@/lib/workspace-middleware";
import { z } from "zod";

/* ---------------- Prompts ---------------- */

const promptCategory = z.enum(["global", "message", "comment", "md", "tutorial"]);

export const listPrompts = createServerFn({ method: "GET" })
  .middleware([requireWorkspaceAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("prompts")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const upsertPromptSchema = z.object({
  id: z.string().nullable().optional(),
  name: z.string().max(100).optional().default("Prompt IA"),
  content: z.string().min(1).max(20000),
  category: promptCategory,
  is_active: z.boolean(),
  page_id: z.string().nullable().optional(),
  page_ids: z.array(z.string()).optional(),
  assistance_type: z.enum(["online_work", "training", "sales", "all"]).nullable().optional(),
});

export const upsertPrompt = createServerFn({ method: "POST" })
  .middleware([requireWorkspaceAuth])
  .inputValidator((d: unknown) => upsertPromptSchema.parse(d))
  .handler(async ({ data, context }) => {
    const pageIds = data.page_ids ?? (data.page_id ? [data.page_id] : []);
    const cleanId = data.id && data.id.trim().length > 0 ? data.id.trim() : undefined;
    const payload: Record<string, any> = {
      ...data,
      name: data.name?.trim() || "Prompt IA",
      page_ids: pageIds,
      page_id: pageIds.length === 1 ? pageIds[0] : null,
      assistance_type: data.assistance_type ?? null,
      user_id: context.userId,
    };
    if (cleanId) payload.id = cleanId;
    else delete payload.id;

    const { error } = await context.supabase.from("prompts").upsert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deletePrompt = createServerFn({ method: "POST" })
  .middleware([requireWorkspaceAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("prompts")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------- Gemini Keys ---------------- */

export const listGeminiKeys = createServerFn({ method: "GET" })
  .middleware([requireWorkspaceAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("gemini_keys")
      .select("id,label,is_active,last_used_at,error_count,disabled_until,api_key,created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    // Mask keys
    return (data ?? []).map((k) => ({
      ...k,
      api_key_masked: k.api_key ? `${k.api_key.slice(0, 6)}…${k.api_key.slice(-4)}` : "",
      api_key: undefined,
    }));
  });

const upsertKeySchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().min(1).max(60),
  api_key: z.string().min(10).max(400),
  is_active: z.boolean(),
});

export const upsertGeminiKey = createServerFn({ method: "POST" })
  .middleware([requireWorkspaceAuth])
  .inputValidator((d: unknown) => upsertKeySchema.parse(d))
  .handler(async ({ data, context }) => {
    const cleanKey = data.api_key.trim();
    const { fetchAvailableGeminiModels } = await import("@/lib/ai-engine.server");
    const testRes = await fetchAvailableGeminiModels(cleanKey);
    if (!testRes.ok) {
      throw new Error(`La clé API Gemini est refusée par Google: ${testRes.error}`);
    }

    const payload = {
      ...data,
      api_key: cleanKey,
      user_id: context.userId,
      error_count: 0,
      disabled_until: null,
    };
    const { error } = await context.supabase.from("gemini_keys").upsert(payload);
    if (error) throw new Error(error.message);
    return { ok: true, models: testRes.models };
  });

export const testGeminiKey = createServerFn({ method: "POST" })
  .middleware([requireWorkspaceAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: keyData, error } = await context.supabase
      .from("gemini_keys")
      .select("*")
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .single();
    if (error || !keyData) throw new Error("Clé introuvable");

    const { fetchAvailableGeminiModels } = await import("@/lib/ai-engine.server");
    const cleanKey = (keyData.api_key || "").trim();
    const res = await fetchAvailableGeminiModels(cleanKey);
    if (!res.ok) {
      await context.supabase
        .from("gemini_keys")
        .update({ error_count: (keyData.error_count ?? 0) + 1 })
        .eq("id", data.id);
      throw new Error(res.error || "Clé Gemini invalide ou inaccessible");
    }

    await context.supabase
      .from("gemini_keys")
      .update({ error_count: 0, disabled_until: null, is_active: true })
      .eq("id", data.id);

    return { ok: true, models: res.models };
  });

export const deleteGeminiKey = createServerFn({ method: "POST" })
  .middleware([requireWorkspaceAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("gemini_keys")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const toggleGeminiKey = createServerFn({ method: "POST" })
  .middleware([requireWorkspaceAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), is_active: z.boolean() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("gemini_keys")
      .update({ is_active: data.is_active, error_count: 0, disabled_until: null })
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const resetAllGeminiKeys = createServerFn({ method: "POST" })
  .middleware([requireWorkspaceAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase
      .from("gemini_keys")
      .update({ is_active: true, error_count: 0, disabled_until: null })
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------- Settings ---------------- */

export const getSettings = createServerFn({ method: "GET" })
  .middleware([requireWorkspaceAuth])
  .handler(async ({ context }) => {
    const { data: allSettings, error } = await context.supabase
      .from("settings")
      .select("*")
      .eq("user_id", context.userId);

    if (error) throw new Error(error.message);

    if (!allSettings || allSettings.length === 0) {
      // Workspace vaovao: mamorona ny laharana paramètres default mba tsy hisy erreur.
      const { data: created } = await context.supabase
        .from("settings")
        .upsert({ user_id: context.userId }, { onConflict: "user_id" })
        .select("*")
        .maybeSingle();
      return created ?? null;
    }

    // Proactive DB Auto-repair: Merge duplicate settings rows and clean up extras
    if (allSettings.length > 1) {
      const baseSettings: any = { ...allSettings[0] };
      for (let i = 1; i < allSettings.length; i++) {
        const other: any = allSettings[i];
        for (const key of Object.keys(other)) {
          if (other[key] !== null && other[key] !== undefined && other[key] !== "") {
            if (baseSettings[key] == null || baseSettings[key] === "") {
              baseSettings[key] = other[key];
            }
          }
        }
      }

      // Re-upsert the fully merged record
      await context.supabase.from("settings").upsert(baseSettings as any, { onConflict: "user_id" });

      // Clean up the duplicate rows
      for (let i = 1; i < allSettings.length; i++) {
        const other: any = allSettings[i];
        if (other.id !== baseSettings.id) {
          await context.supabase.from("settings").delete().eq("id" as any, other.id);
        }
      }

      return baseSettings;
    }

    const record = allSettings[0];

    // Load account-specific custom keys
    try {
      const { getAccountCustomKeys } = await import("@/lib/account-keys.server");
      const customKeys = getAccountCustomKeys(context.userId);
      record.facebook_app_id = record.facebook_app_id || customKeys.facebook_app_id || "";
      record.facebook_app_secret = record.facebook_app_secret || customKeys.facebook_app_secret || "";
      record.facebook_verify_token = record.facebook_verify_token || customKeys.facebook_verify_token || "";
      (record as any).lovable_api_key = (record as any).lovable_api_key || customKeys.lovable_api_key || "";
      (record as any).supabase_project_url = (record as any).supabase_project_url || customKeys.supabase_project_url || "";
      (record as any).supabase_anon_key = (record as any).supabase_anon_key || customKeys.supabase_anon_key || "";
      (record as any).supabase_service_role_key = (record as any).supabase_service_role_key || customKeys.supabase_service_role_key || "";
      (record as any).supabase_project_id = (record as any).supabase_project_id || customKeys.supabase_project_id || "";
    } catch (err) {
      console.warn("[getSettings] Failed to load account custom keys:", err);
    }

    if (!record.facebook_app_id || !record.facebook_app_secret) {
      try {
        const { resolveFacebookApp } = await import("@/lib/facebook-app.server");
        const app = await resolveFacebookApp(context.userId);
        if (app.appId) {
          record.facebook_app_id = record.facebook_app_id || app.appId;
        }
        if (app.appSecret) {
          record.facebook_app_secret = record.facebook_app_secret || app.appSecret;
        }
        if (app.verifyToken) {
          record.facebook_verify_token = record.facebook_verify_token || app.verifyToken;
        }
      } catch (err) {
        console.warn("[getSettings] Failed to resolve Facebook app credentials:", err);
      }
    }

    return record;
  });

const updateSettingsSchema = z.object({
  assistance_type: z.enum(["online_work", "training", "sales"]).optional().default("online_work"),
  auto_reply_messages: z.boolean().optional().default(true),
  auto_reply_comments: z.boolean().optional().default(true),
  comment_scan_interval_minutes: z.number().int().min(1).max(60).optional().default(5),
  use_lovable_ai_fallback: z.boolean().optional().default(true),
  default_model: z.string().min(1).max(80).optional().default("gemini-3.6-flash"),
  private_message_link: z.string().max(500).nullable().optional(),
  facebook_app_id: z.string().max(100).nullable().optional(),
  facebook_app_secret: z.string().max(200).nullable().optional(),
  facebook_verify_token: z.string().max(200).nullable().optional(),
  lovable_api_key: z.string().max(500).nullable().optional(),
  supabase_project_url: z.string().max(500).nullable().optional(),
  supabase_anon_key: z.string().max(500).nullable().optional(),
  supabase_service_role_key: z.string().max(500).nullable().optional(),
  supabase_project_id: z.string().max(200).nullable().optional(),
});

export const updateSettings = createServerFn({ method: "POST" })
  .middleware([requireWorkspaceAuth])
  .inputValidator((d: unknown) => updateSettingsSchema.parse(d))
  .handler(async ({ data, context }) => {
    const clean = (value?: string | null) => {
      const trimmed = value?.trim() ?? "";
      return trimmed || null;
    };

    const cleanedFbAppId = clean(data.facebook_app_id);
    const cleanedFbAppSecret = clean(data.facebook_app_secret);
    const cleanedFbVerifyToken = clean(data.facebook_verify_token);
    const cleanedLovableKey = clean(data.lovable_api_key);
    const cleanedSbUrl = clean(data.supabase_project_url);
    const cleanedSbAnon = clean(data.supabase_anon_key);
    const cleanedSbService = clean(data.supabase_service_role_key);
    const cleanedSbProjId = clean(data.supabase_project_id);

    // If facebook credentials were not explicitly provided in the payload, preserve existing database values
    let finalFbAppId = cleanedFbAppId;
    let finalFbAppSecret = cleanedFbAppSecret;
    let finalFbVerifyToken = cleanedFbVerifyToken;

    if (cleanedFbAppId === null || cleanedFbAppSecret === null) {
      const { data: existing } = await context.supabase
        .from("settings")
        .select("facebook_app_id,facebook_app_secret,facebook_verify_token")
        .eq("user_id", context.userId)
        .maybeSingle();

      if (finalFbAppId === null && existing?.facebook_app_id) {
        finalFbAppId = existing.facebook_app_id;
      }
      if (finalFbAppSecret === null && existing?.facebook_app_secret) {
        finalFbAppSecret = existing.facebook_app_secret;
      }
      if (finalFbVerifyToken === null && existing?.facebook_verify_token) {
        finalFbVerifyToken = existing.facebook_verify_token;
      }
    }

    // Save account-specific custom keys persistently
    try {
      const { saveAccountCustomKeys } = await import("@/lib/account-keys.server");
      await saveAccountCustomKeys(context.userId, {
        facebook_app_id: finalFbAppId,
        facebook_app_secret: finalFbAppSecret,
        facebook_verify_token: finalFbVerifyToken,
        lovable_api_key: cleanedLovableKey,
        supabase_project_url: cleanedSbUrl,
        supabase_anon_key: cleanedSbAnon,
        supabase_service_role_key: cleanedSbService,
        supabase_project_id: cleanedSbProjId,
      });
    } catch (err) {
      console.warn("[updateSettings] Failed to save custom keys:", err);
    }

    const { error } = await context.supabase.from("settings").upsert(
      {
        assistance_type: data.assistance_type,
        auto_reply_messages: data.auto_reply_messages,
        auto_reply_comments: data.auto_reply_comments,
        comment_scan_interval_minutes: data.comment_scan_interval_minutes,
        use_lovable_ai_fallback: data.use_lovable_ai_fallback,
        default_model: data.default_model,
        user_id: context.userId,
        private_message_link: clean(data.private_message_link),
        facebook_app_id: finalFbAppId,
        facebook_app_secret: finalFbAppSecret,
        facebook_verify_token: finalFbVerifyToken,
        ...(cleanedSbUrl ? { supabase_project_url: cleanedSbUrl } : {}),
        ...(cleanedSbAnon ? { supabase_anon_key: cleanedSbAnon } : {}),
        ...(cleanedSbUrl && cleanedSbAnon ? { supabase_connected: true } : {}),
      },
      { onConflict: "user_id" },
    );
    if (error) throw new Error(error.message);

    return { ok: true };
  });

/* ---------------- Facebook pages ---------------- */

export const listFacebookPages = createServerFn({ method: "GET" })
  .middleware([requireWorkspaceAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("facebook_pages")
      .select("id,page_id,page_name,is_connected,webhook_subscribed,token_expires_at,created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const disconnectFacebookPage = createServerFn({ method: "POST" })
  .middleware([requireWorkspaceAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("facebook_pages")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------- Stats / logs ---------------- */

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireWorkspaceAuth])
  .handler(async ({ context }) => {
    const [msgs, comments, keys, pages] = await Promise.all([
      context.supabase
        .from("messages_log")
        .select("id", { count: "exact", head: true })
        .eq("user_id", context.userId),
      context.supabase
        .from("comments_log")
        .select("id", { count: "exact", head: true })
        .eq("user_id", context.userId)
        .eq("replied", true),
      context.supabase
        .from("gemini_keys")
        .select("id", { count: "exact", head: true })
        .eq("user_id", context.userId)
        .eq("is_active", true),
      context.supabase
        .from("facebook_pages")
        .select("id", { count: "exact", head: true })
        .eq("user_id", context.userId)
        .eq("is_connected", true),
    ]);
    return {
      messages: msgs.count ?? 0,
      comments_replied: comments.count ?? 0,
      active_keys: keys.count ?? 0,
      connected_pages: pages.count ?? 0,
    };
  });

export const listMessagesLog = createServerFn({ method: "GET" })
  .middleware([requireWorkspaceAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("messages_log")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listCommentsLog = createServerFn({ method: "GET" })
  .middleware([requireWorkspaceAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("comments_log")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/* ---------------- Batch reply ---------------- */

export const replyAllPendingMessages = createServerFn({ method: "POST" })
  .middleware([requireWorkspaceAuth])
  .handler(async ({ context }) => {
    const { replyAllPendingForUser } = await import("@/lib/ai-engine.server");
    return await replyAllPendingForUser(context.userId, { force: true });
  });

export const scanAndReplyCommentsNow = createServerFn({ method: "POST" })
  .middleware([requireWorkspaceAuth])
  .handler(async ({ context }) => {
    const { scanAndReplyCommentsForUser } = await import("@/lib/ai-engine.server");
    return await scanAndReplyCommentsForUser(context.userId, { force: true });
  });
