import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Check, Lock, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createWorkspace,
  deleteWorkspace,
  listWorkspaces,
  renameWorkspace,
  resetWorkspacePassword,
  switchWorkspace,
  unlockWorkspace,
} from "@/lib/workspace.functions";

export const Route = createFileRoute("/_authenticated/workspaces")({
  head: () => ({
    meta: [
      { title: "Workspaces — Assistante Virtuelle IA" },
      {
        name: "description",
        content:
          "Créez et gérez vos workspaces : chaque espace a ses pages Facebook, produits, formations et commandes séparés.",
      },
      { property: "og:title", content: "Workspaces — Assistante Virtuelle IA" },
      {
        property: "og:description",
        content: "Gestion multi-workspace de votre assistante virtuelle Facebook Messenger.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WorkspacesPage,
});

function WorkspacesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [page, setPage] = useState(0);
  const [unlockFor, setUnlockFor] = useState<{ id: string; name: string } | null>(null);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [resetFor, setResetFor] = useState<{ id: string; name: string; email: string } | null>(
    null,
  );
  const [resetEmail, setResetEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const perPage = 20;

  const list = useServerFn(listWorkspaces);
  const doCreate = useServerFn(createWorkspace);
  const doSwitch = useServerFn(switchWorkspace);
  const doRename = useServerFn(renameWorkspace);
  const doDelete = useServerFn(deleteWorkspace);
  const doUnlock = useServerFn(unlockWorkspace);
  const doReset = useServerFn(resetWorkspacePassword);

  const { data } = useQuery({
    queryKey: ["workspaces-page", search, page],
    queryFn: () =>
      list({ data: { search: search || undefined, limit: perPage, offset: page * perPage } }),
  });

  const refresh = () => queryClient.invalidateQueries();

  const mutate = (fn: () => Promise<unknown>, ok: string) =>
    fn()
      .then(() => {
        toast.success(ok);
        return refresh();
      })
      .catch((e: any) => toast.error(e?.message ?? "Nisy olana"));

  const enterWorkspace = (w: { id: string; name: string }) =>
    doSwitch({ data: { id: w.id } })
      .then((res: any) => {
        if (res?.ok === false) {
          if (res.reason === "PASSWORD_REQUIRED") {
            setUnlockFor(w);
            setUnlockPassword("");
            toast.info("Mila mot de passe ity workspace ity.");
            return;
          }
          toast.error(res.message ?? "Nisy olana");
          return;
        }
        toast.success("Workspace novaina");
        return refresh();
      })
      .catch((e: any) => {
        if (String(e?.message ?? "").includes("PASSWORD_REQUIRED")) {
          setUnlockFor(w);
          setUnlockPassword("");
          return;
        }
        toast.error(e?.message ?? "Nisy olana");
      });

  const createMutation = useMutation({
    mutationFn: () =>
      doCreate({
        data: { name: newName.trim(), email: newEmail.trim(), password: newPassword },
      }),
    onSuccess: async () => {
      toast.success("Workspace noforonina");
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      await refresh();
    },
    onError: (e: any) => toast.error(e?.message ?? "Tsy nety"),
  });

  const total = data?.total ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Workspaces</h1>
        <p className="text-sm text-muted-foreground">
          Ny workspace tsirairay manana angon-drakitra voatokana: pejy Facebook, vokatra,
          formations, kaomandy ary paramètres. Ny Facebook App foibe no ampiasain'izy rehetra.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workspace vaovao</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-4">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Anarana (oh. Boutique Antananarivo)"
          />
          <Input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Email"
          />
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mot de passe (6+ litera)"
          />
          <Button
            disabled={
              !newName.trim() ||
              !newEmail.trim() ||
              newPassword.length < 6 ||
              createMutation.isPending
            }
            onClick={() => createMutation.mutate()}
          >
            <Plus className="h-4 w-4 mr-1" /> Hamorona
          </Button>
        </CardContent>
      </Card>

      {unlockFor && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mot de passe — {unlockFor.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Input
              type="password"
              className="max-w-xs"
              autoFocus
              value={unlockPassword}
              onChange={(e) => setUnlockPassword(e.target.value)}
              placeholder="Mot de passe an'ity workspace ity"
            />
            <Button
              disabled={!unlockPassword}
              onClick={() =>
                mutate(
                  () => doUnlock({ data: { id: unlockFor.id, password: unlockPassword } }),
                  "Workspace novaina",
                ).then(() => {
                  setUnlockFor(null);
                  setUnlockPassword("");
                })
              }
            >
              Hiditra
            </Button>
            <Button variant="ghost" onClick={() => setUnlockFor(null)}>
              Aoka
            </Button>
          </CardContent>
        </Card>
      )}

      {resetFor && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Mot de passe oublié — {resetFor.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Input
              type="email"
              className="max-w-xs"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Email an'ny workspace"
            />
            <Input
              type="password"
              className="max-w-xs"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              placeholder="Mot de passe vaovao (6+)"
            />
            <Button
              disabled={!resetEmail.trim() || resetPassword.length < 6}
              onClick={() =>
                mutate(
                  () =>
                    doReset({
                      data: {
                        id: resetFor.id,
                        email: resetEmail.trim(),
                        new_password: resetPassword,
                      },
                    }),
                  "Mot de passe novaina",
                ).then(() => {
                  setResetFor(null);
                  setResetEmail("");
                  setResetPassword("");
                })
              }
            >
              Enregistrer
            </Button>
            <Button variant="ghost" onClick={() => setResetFor(null)}>
              Aoka
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3">
          <CardTitle className="text-base">Lisitra ({total})</CardTitle>
          <div className="relative w-56">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Karohy…"
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {(data?.workspaces ?? []).map((w) => (
            <div
              key={w.id}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-3"
            >
              <div className="flex-1 min-w-40">
                <div className="flex items-center gap-2 font-medium">
                  {w.name}
                  {w.has_password && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                  {w.is_active && <Check className="h-4 w-4 text-primary" />}
                </div>
                <div className="text-xs text-muted-foreground">
                  {w.is_personal ? "Workspace personnel" : (w.login_email ?? "Workspace")}
                </div>
              </div>
              {!w.is_active && (
                <Button variant="outline" size="sm" onClick={() => enterWorkspace(w)}>
                  Hiditra
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const name = window.prompt("Anarana vaovao", w.name);
                  if (name?.trim())
                    mutate(
                      () => doRename({ data: { id: w.id, name: name.trim() } }),
                      "Anarana novaina",
                    );
                }}
              >
                Ovaina anarana
              </Button>
              {!w.is_personal && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setResetFor({ id: w.id, name: w.name, email: w.login_email ?? "" });
                    setResetEmail(w.login_email ?? "");
                    setResetPassword("");
                  }}
                >
                  Mot de passe
                </Button>
              )}
              {!w.is_personal && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Hofafana ny workspace "${w.name}" sy ny angon-drakitra rehetra ao anatiny?`,
                      )
                    )
                      mutate(() => doDelete({ data: { id: w.id } }), "Voafafa");
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {data && data.workspaces.length === 0 && (
            <p className="text-sm text-muted-foreground">Tsy nisy hita.</p>
          )}
          {total > perPage && (
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Aloha
              </Button>
              <span className="text-xs text-muted-foreground">
                Pejy {page + 1} / {Math.ceil(total / perPage)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={(page + 1) * perPage >= total}
                onClick={() => setPage((p) => p + 1)}
              >
                Manaraka
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
