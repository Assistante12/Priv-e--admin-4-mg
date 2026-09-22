import { useEffect, useState } from "react";
import { firestoreClient } from "@/integrations/firebase/firestore-adapter";
import { auth } from "@/integrations/firebase/config";

export type NewOrderAlert = {
  id: string;
  clientName: string;
  item: string;
  quantity: number;
};

/**
 * Real-time order alerts using Firestore.
 */
export function useNewOrderAlerts() {
  const [count, setCount] = useState(0);
  const [latest, setLatest] = useState<NewOrderAlert | null>(null);

  useEffect(() => {
    let channel: any = null;
    let cancelled = false;

    (async () => {
      const authUserId = auth.currentUser?.uid;
      if (!authUserId || cancelled) return;

      const { data: profile } = await firestoreClient
        .from("profiles")
        .select("active_workspace_id")
        .eq("id", authUserId)
        .maybeSingle();
      const userId = profile?.active_workspace_id ?? authUserId;
      if (cancelled) return;

      channel = firestoreClient
        .channel(`orders-alerts-${userId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "orders", filter: `user_id=eq.${userId}` },
          (payload: any) => {
            const row = (payload.new || {}) as Record<string, unknown>;
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
      if (channel) firestoreClient.removeChannel(channel);
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
