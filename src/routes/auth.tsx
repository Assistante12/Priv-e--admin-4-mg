// Auth route updated for Vercel deployment compatibility
import { createFileRoute, useNavigate, useRouter, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Bot, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  
  head: () => ({
    meta: [
      { title: "Connexion — Assistante Virtuelle" },
      { name: "description", content: "Connectez-vous à votre espace Assistante Virtuelle." },
      { property: "og:title", content: "Connexion — Assistante Virtuelle" },
      { property: "og:description", content: "Connectez-vous à votre espace Assistante Virtuelle." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [recovery, setRecovery] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const isRecovery =
      typeof window !== "undefined" &&
      (window.location.hash.includes("type=recovery") ||
        window.location.search.includes("type=recovery"));
    if (isRecovery) setRecovery(true);

    const checkExisting = async () => {
      if (isRecovery) return;
      const { data } = await supabase.auth.getUser();
      if (data.user) await navigate({ to: "/dashboard", replace: true });
    };
    checkExisting();

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "SUPABASE_OAUTH_SUCCESS") {
        toast.success("Connexion Supabase réussie !");
        navigate({ to: "/dashboard" });
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = (resetEmail || email).toLowerCase().trim();
    if (!target) {
      toast.error("Veuillez saisir votre e-mail");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(target, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) throw error;
      toast.success("E-mail de réinitialisation envoyé. Vérifiez votre boîte de réception.");
      setForgotOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Erreur lors de l'envoi de l'e-mail");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Mot de passe mis à jour !");
      setRecovery(false);
      await router.invalidate();
      await navigate({ to: "/dashboard", replace: true });
    } catch (err: any) {
      toast.error(err?.message || "Erreur lors de la mise à jour du mot de passe");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw new Error(result.error.message ?? "Connexion Google impossible");
      if (result.redirected) return;
      await router.invalidate();
      await navigate({ to: "/dashboard", replace: true });
    } catch (err: any) {
      toast.error(err?.message || "Erreur lors de la connexion Google");
    } finally {
      setLoading(false);
    }
  };


  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Veuillez remplir votre e-mail et mot de passe");
      return;
    }
    setLoading(true);
    try {
      const normalizedEmail = email.toLowerCase().trim();

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Compte créé. Confirmez votre adresse e-mail avant de vous connecter.");
          setMode("signin");
          return;
        }
        toast.success("Inscription réussie !");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (error) throw error;
        toast.success("Connexion réussie !");
      }

      const { data: verified, error: verificationError } = await supabase.auth.getUser();
      if (verificationError || !verified.user) {
        throw verificationError ?? new Error("La session n’a pas pu être vérifiée");
      }
      await router.invalidate();
      await navigate({ to: "/dashboard", replace: true });
    } catch (err: any) {
      toast.error(err?.message || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary mb-4">
            <Bot className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Assistante Virtuelle</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            IA automatique pour Facebook Messenger & commentaires
          </p>
        </div>

        <Card className="glass p-6">
          {recovery ? (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input
                  id="new-password"
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 font-semibold"
                disabled={loading}
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Enregistrer le nouveau mot de passe
              </Button>
            </form>
          ) : forgotOpen ? (
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <Label htmlFor="reset-email">Email du compte</Label>
                <Input
                  id="reset-email"
                  type="email"
                  required
                  value={resetEmail || email}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="vous@example.com"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 font-semibold"
                disabled={loading}
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Envoyer le lien de réinitialisation
              </Button>
              <button
                type="button"
                onClick={() => setForgotOpen(false)}
                className="w-full text-xs text-muted-foreground hover:text-foreground"
              >
                ← Retour à la connexion
              </button>
            </form>
          ) : (
            <>
              <div className="flex gap-2 mb-6 rounded-lg bg-muted p-1">
                <button
                  onClick={() => setMode("signin")}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                    mode === "signin" ? "bg-card text-foreground" : "text-muted-foreground"
                  }`}
                >
                  Connexion
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                    mode === "signup" ? "bg-card text-foreground" : "text-muted-foreground"
                  }`}
                >
                  Inscription
                </button>
              </div>

              <form onSubmit={handleEmail} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={4}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 font-semibold"
                  disabled={loading}
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {mode === "signin" ? "Se connecter avec Email" : "Créer un compte Email"}
                </Button>
              </form>

              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">ou</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full font-semibold"
                disabled={loading}
                onClick={handleGoogle}
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Continuer avec Google
              </Button>



              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setForgotOpen(true);
                  }}
                  className="mt-4 w-full text-sm text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              )}
            </>
          )}
        </Card>


        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:text-foreground">
            ← Retour
          </Link>
        </p>
      </div>
    </div>
  );
}
