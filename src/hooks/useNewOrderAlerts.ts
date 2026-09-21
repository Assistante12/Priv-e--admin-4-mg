import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type NewOrderAlert = {
  id: string;
  clientName: string;
  item: string;
  quantity: number;
};

/**
 * Écoute en temps réel les nouvelles commandes de l'utilisateur connecté et
 * expose un compteur (badge) + la dernière commande (bannière).
 */
export function useNewOrderAlerts() {
  const [count, setCount] = useState(0);
  const [latest, setLatest] = useState<NewOrderAlert | null>(null);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    (async () => {
      const { data } = await supabase.auth.getUser();
      const authUserId = data?.user?.id;
      if (!authUserId || cancelled) return;

      // Le scope des commandes est le workspace actif (le workspace personnel
      // porte le même identifiant que le compte).
      const { data: profile } = await supabase
        .from("profiles")
        .select("active_workspace_id")
        .eq("id", authUserId)
        .maybeSingle();
      const userId = profile?.active_workspace_id ?? authUserId;
      if (cancelled) return;

      channel = supabase
        .channel(`orders-alerts-${userId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "orders", filter: `user_id=eq.${userId}` },
          (payload) => {
            const row = payload.new as Record<string, unknown>;
            setCount((c) => c + 1);
            setLatest({
              id: String(row["id"] ?? ""),
              clientName: String(row["client_fb_name"] ?? "Mpanjifa Messenger"),
              item: String(row["notes"] ?? (row["type"] === "training" ? "Formation" : "Produit")),
              quantity: Number(row["quantity"] ?? 1),
            });
          },
        )
        .subscribe();
    })();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return {
    count,
    latest,
    clear: () => {
      setCount(0);
      setLatest(null);
    },
    dismissLatest: () => setLatest(null),
  };
}
