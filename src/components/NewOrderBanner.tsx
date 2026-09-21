import { Link } from "@tanstack/react-router";
import { ShoppingBag, X } from "lucide-react";
import type { NewOrderAlert } from "@/hooks/useNewOrderAlerts";

/** Bannière de notification affichée à l'admin dès qu'une commande arrive. */
export function NewOrderBanner({
  alert,
  onDismiss,
}: {
  alert: NewOrderAlert;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed top-0 inset-x-0 z-[70] px-3 pt-3 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-md rounded-2xl border border-primary/40 bg-card/95 backdrop-blur shadow-lg p-3 flex items-start gap-3 animate-in slide-in-from-top">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary shrink-0">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">🛒 Kaomandy vaovao tonga!</p>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {alert.clientName} : {alert.item}
            {alert.quantity > 1 ? ` ×${alert.quantity}` : ""}
          </p>
          <Link to="/orders" onClick={onDismiss} className="mt-1 inline-block text-xs text-primary">
            Jerena ny komandy
          </Link>
        </div>
        <button
          onClick={onDismiss}
          aria-label="Fermer la notification"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
