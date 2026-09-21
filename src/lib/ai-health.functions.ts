import { createServerFn } from "@tanstack/react-start";
import { requireWorkspaceAuth } from "@/lib/workspace-middleware";
import { getAccountCustomKeys } from "@/lib/account-keys.server";
import { GEMINI_ROTATION_MODELS } from "@/lib/ai-engine.server";

/**
 * Surveillance des quotas et de l'état du Moteur Multi-Modèles Gemini (> 5 modèles).
 * Utilisé par les paramètres pour assurer la surveillance de la rotation.
 */

export type AiQuotaHealth = {
  lovable: {
    status: "ok" | "exhausted" | "error" | "unknown";
    detail: string;
  };
  gemini: {
    total: number;
    active: number;
    paused: number;
    status: "ok" | "low" | "exhausted" | "none";
    hasCustomKey: boolean;
    modelsInRotation: number;
    modelsList: string[];
  };
  /** Seuil d'alerte : nombre minimal de clés Gemini opérationnelles. */
  threshold: number;
  alert: boolean;
  alertMessage: string | null;
  suggestion: string | null;
  backupKeyLabel: string | null;
  checkedAt: string;
};

const GEMINI_ACTIVE_THRESHOLD = 1;

export const getAiQuotaHealth = createServerFn({ method: "GET" })
  .middleware([requireWorkspaceAuth])
  .handler(async ({ context }): Promise<AiQuotaHealth> => {
    // --- 1. Vérification des clés Gemini (Manuel Compte + DB + Système) ---
    const customKeys = getAccountCustomKeys(context.userId);
    const hasCustomKey = Boolean(customKeys.gemini_api_key && customKeys.gemini_api_key.trim().length > 0);

    const { data: keys } = await context.supabase
      .from("gemini_keys")
      .select("id, label, error_count, disabled_until, is_active, last_used_at")
      .eq("user_id", context.userId);

    const now = Date.now();
    const all = (keys ?? []) as any[];
    const enabled = all.filter((k) => k.is_active !== false);
    const ready = enabled.filter(
      (k) => !k.disabled_until || new Date(k.disabled_until).getTime() <= now,
    );
    const paused = enabled.length - ready.length;

    const totalOperationalKeys = ready.length + (hasCustomKey ? 1 : 0) + (process.env.GEMINI_API_KEY ? 1 : 0);

    let geminiStatus: AiQuotaHealth["gemini"]["status"] = "ok";
    if (totalOperationalKeys === 0) geminiStatus = "exhausted";
    else if (totalOperationalKeys <= GEMINI_ACTIVE_THRESHOLD) geminiStatus = "low";

    // --- 2. État de la rotation Multi-Modèles ---
    const lovable: AiQuotaHealth["lovable"] = {
      status: "ok",
      detail: `Moteur Gemini Multi-Modèles actif (${GEMINI_ROTATION_MODELS.length} modèles en rotation)`,
    };

    // --- 3. Suggestion de clé / modèle ---
    let backupKeyLabel: string | null = null;
    if (hasCustomKey) {
      backupKeyLabel = "Clé personnalisée du compte";
    } else {
      const backup = ready
        .slice()
        .sort(
          (a, b) =>
            (a.error_count ?? 0) - (b.error_count ?? 0) ||
            new Date(a.last_used_at ?? 0).getTime() - new Date(b.last_used_at ?? 0).getTime(),
        )[0] ?? null;
      if (backup) backupKeyLabel = backup.label || "Clé DB";
      else if (process.env.GEMINI_API_KEY) backupKeyLabel = "Clé système Gemini";
    }

    // --- 4. Alertes ---
    let alertMessage: string | null = null;
    let suggestion: string | null = null;

    if (totalOperationalKeys === 0) {
      alertMessage = "Aucune clé Gemini active : le moteur multi-modèles ne peut pas répondre.";
      suggestion = "Saisissez votre clé Gemini dans les options paramètres pour activer la rotation.";
    } else if (geminiStatus === "low") {
      alertMessage = `1 seule clé Gemini active pour alimenter les ${GEMINI_ROTATION_MODELS.length} modèles en rotation.`;
      suggestion = "Vous pouvez ajouter une clé de secours supplémentaire pour garantir une disponibilité maximale.";
    }

    return {
      lovable,
      gemini: {
        total: enabled.length + (hasCustomKey ? 1 : 0),
        active: ready.length + (hasCustomKey ? 1 : 0),
        paused,
        status: geminiStatus,
        hasCustomKey,
        modelsInRotation: GEMINI_ROTATION_MODELS.length,
        modelsList: GEMINI_ROTATION_MODELS,
      },
      threshold: GEMINI_ACTIVE_THRESHOLD,
      alert: alertMessage !== null,
      alertMessage,
      suggestion,
      backupKeyLabel,
      checkedAt: new Date().toISOString(),
    };
  });
