import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getSettings,
  updateSettings,
  replyAllPendingMessages,
  scanAndReplyCommentsNow,
} from "@/lib/dashboard.functions";
import { getAiQuotaHealth } from "@/lib/ai-health.functions";
import { getFacebookAppStatus } from "@/lib/facebook.functions";
import {
  Save,
  Send,
  Loader2,
  Facebook,
  KeyRound,
  Sparkles,
  Database,
  CheckCircle2,
  RefreshCw,
  Zap,
  Copy,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  LifeBuoy,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { PushNotificationsCard } from "@/components/PushNotificationsCard";

const settingsQuery = queryOptions({
  queryKey: ["settings"],
  queryFn: async () => {
    try {
      return await getSettings();
    } catch (e) {
      console.warn("Settings query error", e);
      return null;
    }
  },
});

const aiHealthQuery = queryOptions({
  queryKey: ["ai-quota-health"],
  queryFn: async () => {
    try {
      return await getAiQuotaHealth();
    } catch (e) {
      console.warn("AI health query error", e);
      return null;
    }
  },
  refetchInterval: 60000,
  staleTime: 30000,
});

export const Route = createFileRoute("/_authenticated/settings")({
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(settingsQuery);
  },
  component: SettingsPage,
});

function SettingsPage() {
  const { data } = useSuspenseQuery(settingsQuery);
  const { data: fbApp } = useQuery({
    queryKey: ["facebook-app-status"],
    queryFn: async () => {
      try {
        return await getFacebookAppStatus();
      } catch (e) {
        console.warn("Facebook app status query error", e);
        return null;
      }
    },
  });
  const {
    data: health,
    refetch: refetchHealth,
    isFetching: healthChecking,
  } = useQuery(aiHealthQuery);

  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [replying, setReplying] = useState(false);
  const [scanningComments, setScanningComments] = useState(false);
  const [showFbSecret, setShowFbSecret] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);

  const [form, setForm] = useState({
    assistance_type: (data as any)?.assistance_type ?? "online_work",
    auto_reply_messages: data?.auto_reply_messages ?? true,
    auto_reply_comments: data?.auto_reply_comments ?? true,
    comment_scan_interval_minutes: data?.comment_scan_interval_minutes ?? 5,
    use_lovable_ai_fallback: data?.use_lovable_ai_fallback ?? true,
    default_model: data?.default_model || "gemini-3.8-flash",
    private_message_link: data?.private_message_link ?? "",
    facebook_app_id: data?.facebook_app_id ?? "",
    facebook_app_secret: data?.facebook_app_secret ?? "",
    facebook_verify_token: data?.facebook_verify_token ?? "",
    gemini_api_key: (data as any)?.gemini_api_key ?? "",
  });

  useEffect(() => {
    if (data) {
      setForm((prev) => ({
        ...prev,
        assistance_type: (data as any).assistance_type ?? "online_work",
        auto_reply_messages: data.auto_reply_messages ?? true,
        auto_reply_comments: data.auto_reply_comments ?? true,
        comment_scan_interval_minutes: data.comment_scan_interval_minutes ?? 5,
        use_lovable_ai_fallback: data.use_lovable_ai_fallback ?? true,
        default_model: data.default_model || "gemini-3.8-flash",
        private_message_link: data.private_message_link ?? "",
        facebook_app_id: data.facebook_app_id ?? prev.facebook_app_id,
        facebook_app_secret: data.facebook_app_secret ?? prev.facebook_app_secret,
        facebook_verify_token: data.facebook_verify_token ?? prev.facebook_verify_token,
        gemini_api_key: (data as any).gemini_api_key ?? prev.gemini_api_key,
      }));
    }
  }, [data]);

  const save = async () => {
    setSaving(true);
    try {
      await updateSettings({
        data: {
          ...form,
          private_message_link: form.private_message_link || null,
          facebook_app_id: form.facebook_app_id || null,
          facebook_app_secret: form.facebook_app_secret || null,
          facebook_verify_token: form.facebook_verify_token || null,
          gemini_api_key: form.gemini_api_key || null,
        } as any,
      });
      toast.success("Paramètres sy fanalahidy voatahiry soa aman-tsara !");
      qc.invalidateQueries({ queryKey: ["settings"] });
      qc.invalidateQueries({ queryKey: ["facebook-app-status"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const replyAll = async () => {
    setReplying(true);
    try {
      const res = await replyAllPendingMessages();
      const detailStr = res.details?.length ? `\n${res.details.join("\n")}` : "";
      if (res.errors > 0 && res.replied === 0) {
        toast.error(
          `${res.replied} réponse(s) envoyée(s) sur ${res.processed} conversation(s) — ${res.errors} erreur(s)${detailStr}`,
        );
      } else {
        toast.success(
          `${res.replied} réponse(s) envoyée(s) sur ${res.processed} conversation(s) en attente${
            res.errors ? ` (${res.errors} erreur(s))` : ""
          }${detailStr}`,
        );
      }
      qc.invalidateQueries({ queryKey: ["messages-log"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setReplying(false);
    }
  };

  const scanComments = async () => {
    setScanningComments(true);
    try {
      const res = await scanAndReplyCommentsNow();
      const detailStr = res.details?.length ? `\n${res.details.join("\n")}` : "";
      if (res.errors > 0 && res.replied === 0) {
        toast.error(
          `${res.replied} réponse(s) sur ${res.scanned} commentaire(s) — ${res.errors} erreur(s)${detailStr}`,
        );
      } else {
        toast.success(
          `${res.replied} commentaire(s) répondu(s) sur ${res.scanned} analysé(s)${
            res.errors ? ` (${res.errors} erreur(s))` : ""
          }${detailStr}`,
        );
      }
      qc.invalidateQueries({ queryKey: ["comments-log"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setScanningComments(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié dans le presse-papier !`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Fikajiana ny IA Google AI Studio (Gemini) sy ny fampidirana Facebook &amp; Firebase Firestore.
        </p>
      </div>

      <Card className="glass p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Type d'assistance</h2>
            <p className="text-xs text-muted-foreground">
              Mamolavola ny fitondran-tenan'ny IA sy ny menio mifanaraka amin'ny asanao.
            </p>
          </div>
        </div>
        <Select
          value={form.assistance_type}
          onValueChange={(v) => setForm({ ...form, assistance_type: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="online_work">1. Travail en ligne (Asa an-tserasera)</SelectItem>
            <SelectItem value="training">2. Formation (Fiofanana)</SelectItem>
            <SelectItem value="sales">3. Vente (Varotra &amp; Produits)</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <Card className="glass p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Répondre automatiquement aux messages privés</Label>
            <p className="text-xs text-muted-foreground">
              Mamaly avy hatrany ny hafatra miafina (Messenger DM) amin'ny alalan'ny IA.
            </p>
          </div>
          <Switch
            checked={form.auto_reply_messages}
            onCheckedChange={(v) => setForm({ ...form, auto_reply_messages: v })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Répondre automatiquement aux commentaires</Label>
            <p className="text-xs text-muted-foreground">
              Mitily sy mamaly avy hatrany ireo fanehoan-kevitra (commentaires) vaovao amin'ny pejy.
            </p>
          </div>
          <Switch
            checked={form.auto_reply_comments}
            onCheckedChange={(v) => setForm({ ...form, auto_reply_comments: v })}
          />
        </div>

        <div>
          <Label>Intervalle de scan des commentaires (minutes)</Label>
          <Input
            type="number"
            min={1}
            max={60}
            value={form.comment_scan_interval_minutes}
            onChange={(e) =>
              setForm({ ...form, comment_scan_interval_minutes: Number(e.target.value) })
            }
          />
        </div>

        <div>
          <Label>Modèle IA Google AI Studio par défaut</Label>
          <Select
            value={form.default_model}
            onValueChange={(v) => setForm({ ...form, default_model: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-3.8-flash">Gemini 3.8 Flash (Recommandé &amp; Rapide)</SelectItem>
              <SelectItem value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Ultra-rapide)</SelectItem>
              <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
              <SelectItem value="gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</SelectItem>
              <SelectItem value="gemini-3.5-flash">Gemini 3.5 Flash</SelectItem>
              <SelectItem value="gemini-3.6-flash">Gemini 3.6 Flash</SelectItem>
              <SelectItem value="gemini-flash-latest">Gemini Flash (Dernière version)</SelectItem>
              <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro (Raisonnement avancé)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Modèle Gemini ampiasaina. Raha alefa ny rotation dia mandeha foana amin'ireo modèles Google AI Studio 8 samihafa ny rafitra.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Rotation continue des modèles Gemini (&gt; 5 modèles)</Label>
            <p className="text-xs text-muted-foreground">
              Raha misy fahatarana na fetra dia mifindra ho azy amin'ny modely Gemini manaraka tsy misy fahatapahana.
            </p>
          </div>
          <Switch
            checked={form.use_lovable_ai_fallback}
            onCheckedChange={(v) => setForm({ ...form, use_lovable_ai_fallback: v })}
          />
        </div>

        <div>
          <Label>Lien à envoyer en message privé (optionnel)</Label>
          <Input
            type="url"
            placeholder="https://votresite.com/produit"
            value={form.private_message_link}
            onChange={(e) => setForm({ ...form, private_message_link: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Ity rohy ity dia alefa anaty hafatra miafina (DM) fa tsy apetraka amin'ny fanehoan-kevitra ampahibemaso.
          </p>
        </div>

        <Button onClick={save} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          Tehirizo
        </Button>
      </Card>

      {/* Surveillance des quotas IA */}
      <Card
        className={`glass p-6 space-y-4 ${
          health?.alert ? "border-amber-500/40" : "border-emerald-500/20"
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                health?.alert
                  ? "bg-amber-500/15 text-amber-400"
                  : "bg-emerald-500/15 text-emerald-400"
              }`}
            >
              {health?.alert ? (
                <AlertTriangle className="h-5 w-5" />
              ) : (
                <ShieldCheck className="h-5 w-5" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold">Fanaraha-maso ny Quotas IA Google AI Studio</h2>
              <p className="text-xs text-muted-foreground">
                Fanamarinana ny fiasan'ny motera Gemini sy ny fanalahidy.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchHealth()}
            disabled={healthChecking}
            className="text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${healthChecking ? "animate-spin" : ""}`} />
            Hamarino indray
          </Button>
        </div>

        {health ? (
          <div className="space-y-3 text-sm">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg bg-black/40 border border-white/5 p-3">
                <div className="text-xs text-muted-foreground mb-1">Moteur Multi-Modèles Gemini</div>
                <div className="font-medium text-emerald-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  {health.gemini.modelsInRotation ?? 8} Modèles en rotation continue
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Google AI Studio Multi-Models API
                </div>
              </div>
              <div className="rounded-lg bg-black/40 border border-white/5 p-3">
                <div className="text-xs text-muted-foreground mb-1">Clés Gemini (Manuel &amp; Base)</div>
                <div
                  className={`font-medium ${
                    health.gemini.status === "ok"
                      ? "text-emerald-400"
                      : health.gemini.status === "low"
                        ? "text-amber-400"
                        : "text-red-400"
                  }`}
                >
                  {health.gemini.active} opérationnelle(s) / {health.gemini.total}
                  {health.gemini.hasCustomKey ? " (Clé manuelle active)" : ""}
                  {health.gemini.paused > 0 ? ` (${health.gemini.paused} en pause)` : ""}
                </div>
              </div>
            </div>

            {health.alert && health.alertMessage && (
              <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-amber-300 text-xs font-medium">{health.alertMessage}</p>
                </div>
                {health.suggestion && (
                  <div className="flex items-start gap-2">
                    <LifeBuoy className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      <span className="text-emerald-400 font-medium">Tolo-kevitra : </span>
                      {health.suggestion}
                    </p>
                  </div>
                )}
              </div>
            )}

            {!health.alert && (
              <p className="text-xs text-emerald-400/80">
                Milamina ny zava-drehetra : Miasa tsy misy fahatapahana ny motera Gemini amin'ny famaliana hafatra.
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Eo am-panamarinana...</p>
        )}
      </Card>

      {/* Configuration manuelle des Clés d'API & Intégrations */}
      <Card className="glass p-6 space-y-6 border-primary/30 shadow-lg">
        <div className="flex items-start justify-between flex-wrap gap-4 border-b border-border/40 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Fampidirana ny Fanalahidy (API Keys &amp; Intégrations)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Ampidiro eto ny fanalahidin'ny Meta (Facebook) sy ny Google AI Studio (Gemini).
                </p>
              </div>
            </div>
          </div>
          <Button
            onClick={save}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Tehirizo ireo Clé rehetra
          </Button>
        </div>

        {/* 1. Facebook Developer */}
        <div className="space-y-4 rounded-xl bg-card/40 p-4 border border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Facebook className="h-5 w-5 text-blue-500" />
              <h3 className="text-base font-semibold">1. Identifiants Facebook Developer (Meta)</h3>
            </div>
            {form.facebook_app_id && form.facebook_app_secret ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
                <CheckCircle2 className="h-3.5 w-3.5" /> Clé voaray
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-500">
                <AlertTriangle className="h-3.5 w-3.5" /> Ilaina ampidirina
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Ampidiro eto ny Facebook App ID sy App Secret avy amin'ny Meta for Developers mba hahafahan'ity kaonty ity mampifandray pejy Facebook sy mandray hafatra amin'ny alalan'ny webhook.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Facebook App ID (ID an'ny App)</Label>
              <Input
                placeholder="ohatra: 1234567890123456"
                value={form.facebook_app_id}
                onChange={(e) => setForm({ ...form, facebook_app_id: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Facebook App Secret (Clé miafina)</Label>
                <button
                  type="button"
                  onClick={() => setShowFbSecret(!showFbSecret)}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {showFbSecret ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  {showFbSecret ? "Afeno" : "Asehoy"}
                </button>
              </div>
              <Input
                type={showFbSecret ? "text" : "password"}
                placeholder="ohatra: e1a2b3c4d5e6f7..."
                value={form.facebook_app_secret}
                onChange={(e) => setForm({ ...form, facebook_app_secret: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Verify Token Webhook (Teny fanamarinana)</Label>
            <Input
              placeholder="ohatra: mon-verify-token-2026"
              value={form.facebook_verify_token}
              onChange={(e) => setForm({ ...form, facebook_verify_token: e.target.value })}
            />
          </div>

          {/* Webhook & Callback Helpers */}
          <div className="rounded-lg bg-muted/40 p-3 space-y-2 text-xs border border-border/50">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="font-semibold text-muted-foreground">
                URL Webhook ho an'ny Meta :
              </span>
              <div className="flex items-center gap-2">
                <code className="font-mono text-[11px] bg-background px-2 py-0.5 rounded border">
                  {typeof window !== "undefined"
                    ? `${window.location.origin}/api/public/fb/webhook`
                    : "/api/public/fb/webhook"}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 text-[10px]"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/api/public/fb/webhook`,
                    );
                    toast.success("URL Webhook voakopika !");
                  }}
                >
                  Adikao
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="font-semibold text-muted-foreground">
                Valid OAuth Redirect URI :
              </span>
              <div className="flex items-center gap-2">
                <code className="font-mono text-[11px] bg-background px-2 py-0.5 rounded border">
                  {typeof window !== "undefined"
                    ? `${window.location.origin}/api/public/fb/callback`
                    : "/api/public/fb/callback"}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 text-[10px]"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/api/public/fb/callback`,
                    );
                    toast.success("OAuth Redirect URI voakopika !");
                  }}
                >
                  Adikao
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Google AI Studio (Gemini) */}
        <div className="space-y-4 rounded-xl bg-card/40 p-4 border border-purple-500/30">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h3 className="text-base font-semibold">
                2. Google AI Studio (Gemini API &amp; Rotation continue)
              </h3>
            </div>
            {form.gemini_api_key ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
                <CheckCircle2 className="h-3.5 w-3.5" /> Clé Gemini Voaray
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                Mampiasa clé système / Tsy mbola nasiana
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Ampidiro eto ny <strong>Gemini API Key</strong> avy amin'ny Google AI Studio. Ny rafitra dia manao rotation foana amin'ireo <strong>modèles Gemini 8 mahery</strong> mba tsy hisy fahatapahana mihitsy ny famaliana hafatra sy commentaire.
          </p>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Gemini API Key (Google AI Studio)</Label>
              <button
                type="button"
                onClick={() => setShowGeminiKey(!showGeminiKey)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                {showGeminiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {showGeminiKey ? "Afeno" : "Asehoy"}
              </button>
            </div>
            <Input
              type={showGeminiKey ? "text" : "password"}
              placeholder="ohatra: AIzaSy..."
              value={form.gemini_api_key}
              onChange={(e) => setForm({ ...form, gemini_api_key: e.target.value })}
            />
            <p className="text-[11px] text-muted-foreground">
              Azonao alaina maimaimpoana ao amin'ny Google AI Studio (<a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="text-primary underline">aistudio.google.com</a>).
            </p>
          </div>
        </div>

        {/* 3. Firebase Firestore & Auth (Active Base de données) */}
        <div className="space-y-4 rounded-xl bg-card/40 p-5 border border-primary/40 bg-primary/5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold">3. Base de Données &amp; Authentification Firebase Firestore</h3>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-500 border border-emerald-500/30">
              <CheckCircle2 className="h-4 w-4" /> Firebase Firestore &amp; Auth mavitrika
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Ny angon-drakitra rehetra (base de données) sy ny kaonty (authentification) dia mifandray mivantana sy tehirizina ao amin'ny Google Firebase Firestore sy Firebase Auth.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <div className="p-3 rounded-lg bg-background/80 border border-border">
              <span className="text-muted-foreground block text-[11px]">Firebase Project ID</span>
              <span className="font-mono font-medium text-foreground">effortless-rainfall-gf38q</span>
            </div>
            <div className="p-3 rounded-lg bg-background/80 border border-border">
              <span className="text-muted-foreground block text-[11px]">Firestore Database ID</span>
              <span className="font-mono font-medium text-foreground text-[11px] truncate block">
                ai-studio-agencevirtuelle-4025dff0-0f16-4acf-aae5-334da4c38db5
              </span>
            </div>
            <div className="p-3 rounded-lg bg-background/80 border border-border">
              <span className="text-muted-foreground block text-[11px]">Système d'authentification</span>
              <span className="font-medium text-emerald-500 flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Firebase Auth (Email / Mot de passe / Google)
              </span>
            </div>
            <div className="p-3 rounded-lg bg-background/80 border border-border">
              <span className="text-muted-foreground block text-[11px]">Synchro temps réel</span>
              <span className="font-medium text-emerald-500 flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Firestore Cloud Rules activées
              </span>
            </div>
          </div>
        </div>

        {/* Big Save Button at bottom of card */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={save}
            disabled={saving}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-md"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4 mr-2" />
            )}
            Tehirizo ireo fanalahidy ho an'ity kaonty ity
          </Button>
        </div>
      </Card>

      <Card className="glass p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500 animate-pulse" />
              <h2 className="text-lg font-semibold">Automatisation &amp; Cron IA (Arrière-plan)</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Mamaly amin'ny fotoana tena izy (temps réel) ny hafatra sy fanehoan-kevitra. Misy koa ny fanaraha-maso mandeha ho azy ao ambadika.
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-500 text-xs font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Temps réel</span>
          </div>
        </div>

        <div className="bg-background/60 rounded-lg p-4 border space-y-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Endpoints Cron Publics (Ho an'ny Crons ivelany / Vercel Cron)
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 p-2 bg-muted/40 rounded border text-xs">
              <span className="font-mono truncate text-muted-foreground">
                {typeof window !== "undefined"
                  ? `${window.location.origin}/api/public/hooks/cron`
                  : "/api/public/hooks/cron"}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs shrink-0"
                onClick={() =>
                  copyToClipboard(
                    `${window.location.origin}/api/public/hooks/cron`,
                    "URL Cron Global",
                  )
                }
              >
                <Copy className="h-3.5 w-3.5 mr-1" />
                Copier
              </Button>
            </div>
            <div className="flex items-center justify-between gap-2 p-2 bg-muted/40 rounded border text-xs">
              <span className="font-mono truncate text-muted-foreground">
                {typeof window !== "undefined"
                  ? `${window.location.origin}/api/public/hooks/reply-all-messages`
                  : "/api/public/hooks/reply-all-messages"}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs shrink-0"
                onClick={() =>
                  copyToClipboard(
                    `${window.location.origin}/api/public/hooks/reply-all-messages`,
                    "URL Cron Messages",
                  )
                }
              >
                <Copy className="h-3.5 w-3.5 mr-1" />
                Copier
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t space-y-3">
          <h3 className="text-sm font-semibold">Déclencheurs Manuels Immédiats</h3>
          <div className="flex flex-wrap gap-3">
            <Button onClick={replyAll} disabled={replying} variant="secondary">
              {replying ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2 text-primary" />
              )}
              {replying ? "Réponses en cours…" : "Répondre à tous les messages privés"}
            </Button>

            <Button onClick={scanComments} disabled={scanningComments} variant="outline">
              {scanningComments ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <MessageSquare className="h-4 w-4 mr-2 text-emerald-500" />
              )}
              {scanningComments ? "Scan en cours…" : "Scanner & répondre aux commentaires"}
            </Button>
          </div>
        </div>
      </Card>

      <PushNotificationsCard />
    </div>
  );
}
