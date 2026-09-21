import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listFacebookPages, disconnectFacebookPage } from "@/lib/dashboard.functions";
import { getFacebookLoginUrl, getWebhookConfig, getFacebookAppStatus } from "@/lib/facebook.functions";
import { Facebook, Trash2, Copy, ExternalLink, Info, Settings, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const appStatusQuery = queryOptions({
  queryKey: ["facebook-app-status"],
  queryFn: async () => {
    try {
      return await getFacebookAppStatus();
    } catch (e) {
      console.warn("FB app status query error", e);
      return null;
    }
  },
});

const pagesQuery = queryOptions({
  queryKey: ["fb-pages"],
  queryFn: async () => {
    try {
      return await listFacebookPages();
    } catch (e) {
      console.warn("FB pages query error", e);
      return [];
    }
  },
});
const webhookQuery = queryOptions({
  queryKey: ["fb-webhook"],
  queryFn: async () => {
    try {
      return await getWebhookConfig();
    } catch (e) {
      console.warn("FB webhook query error", e);
      return { callbackUrl: "", verifyToken: "" };
    }
  },
});

export const Route = createFileRoute("/_authenticated/facebook")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(pagesQuery),
      context.queryClient.ensureQueryData(webhookQuery),
    ]),
  component: FacebookPage,
});

function FacebookPage() {
  const { data: pages } = useSuspenseQuery(pagesQuery);
  const { data: webhookRaw } = useSuspenseQuery(webhookQuery);
  const { data: fbApp } = useQuery(appStatusQuery);
  const webhook = webhookRaw as any;
  const qc = useQueryClient();

  const connect = async () => {
    try {
      const { url } = await getFacebookLoginUrl();
      window.location.href = url;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  };
  const disconnect = async (id: string) => {
    if (!confirm("Déconnecter cette page ?")) return;
    await disconnectFacebookPage({ data: { id } });
    qc.invalidateQueries({ queryKey: ["fb-pages"] });
    toast.success("Déconnectée");
  };
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Facebook</h1>
        <p className="text-muted-foreground mt-1">
          Connectez votre page pour activer les réponses automatiques.
        </p>
      </div>

      {fbApp && !fbApp.configured && (
        <Card className="p-4 border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="font-semibold text-sm">
                Configuration Facebook requise (App ID / App Secret manquants)
              </div>
              <p className="text-xs opacity-90">
                Mbola tsy voapetraka ny mari-pamantarana Facebook Developer (App ID sy App Secret).
                Ampidiro ao amin'ny pejy Paramètres izany mba hahafahana mampifandray ny pejy Facebook.
              </p>
              <div>
                <Button asChild size="sm" variant="outline" className="text-xs">
                  <Link to="/settings">
                    <Settings className="h-3.5 w-3.5 mr-1.5" />
                    Ouvrir les Paramètres
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="glass p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Facebook className="h-6 w-6 text-primary" />
            <h2 className="font-semibold">Connecter une page</h2>
          </div>
          {fbApp?.configured && (
            <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              Facebook App foibe efa miasa {fbApp.app_id_preview ? `(${fbApp.app_id_preview})` : ""}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          L'application demandera les permissions : lecture/envoi de messages, gestion des
          commentaires, lecture des publications.
        </p>
        <Button onClick={connect} disabled={fbApp && !fbApp.configured}>
          <Facebook className="h-4 w-4 mr-2" />
          Connecter avec Facebook
        </Button>
      </Card>

      {pages.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold">Pages connectées</h2>
          {pages.map((p) => (
            <Card key={p.id} className="glass p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Facebook className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{p.page_name}</div>
                <div className="text-xs text-muted-foreground">ID : {p.page_id}</div>
              </div>
              {p.webhook_subscribed ? (
                <Badge className="bg-success text-success-foreground">Webhook actif</Badge>
              ) : (
                <Badge variant="outline">Webhook non configuré</Badge>
              )}
              <Button size="icon" variant="ghost" onClick={() => disconnect(p.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Card className="glass p-6">
        <div className="flex items-center gap-3 mb-4">
          <Info className="h-5 w-5 text-accent" />
          <h2 className="font-semibold">Configuration Webhook Meta</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Dans{" "}
          <a
            href="https://developers.facebook.com/apps"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            Meta for Developers <ExternalLink className="h-3 w-3" />
          </a>
          , ajoutez le produit <strong>Webhooks</strong> puis souscrivez à la page avec :
        </p>
        <div className="space-y-3">
          <div>
            <div className="text-xs uppercase text-muted-foreground mb-1">URL de callback</div>
            <div className="flex gap-2">
              <code className="flex-1 rounded bg-muted px-3 py-2 text-xs break-all">
                {webhook.callback_url}
              </code>
              <Button size="icon" variant="ghost" onClick={() => copy(webhook.callback_url)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground mb-1">
              URL OAuth redirect valide
            </div>
            <div className="flex gap-2">
              <code className="flex-1 rounded bg-muted px-3 py-2 text-xs break-all">
                {webhook.oauth_redirect_uri}
              </code>
              <Button size="icon" variant="ghost" onClick={() => copy(webhook.oauth_redirect_uri)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground mb-1">Verify token</div>
            <div className="flex gap-2">
              <code className="flex-1 rounded bg-muted px-3 py-2 text-xs break-all">
                {webhook.verify_token}
              </code>
              <Button size="icon" variant="ghost" onClick={() => copy(webhook.verify_token)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground mb-1">Champs à souscrire</div>
            <code className="block rounded bg-muted px-3 py-2 text-xs">
              messages, messaging_postbacks, feed, message_reactions
            </code>
          </div>
        </div>
      </Card>
    </div>
  );
}
