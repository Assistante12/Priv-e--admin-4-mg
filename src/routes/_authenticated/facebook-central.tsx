import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  assignPageToWorkspace,
  listCentralPages,
  refreshCentralPages,
  unassignPage,
} from "@/lib/facebook-central.functions";

export const Route = createFileRoute("/_authenticated/facebook-central")({
  head: () => ({
    meta: [
      { title: "Pages Facebook centrales — Assistante Virtuelle IA" },
      {
        name: "description",
        content:
          "Répartissez les pages Facebook de la connexion centrale entre vos workspaces : une page appartient à un seul workspace.",
      },
      { property: "og:title", content: "Pages Facebook centrales" },
      {
        property: "og:description",
        content: "Attribution des pages Facebook par workspace avec une seule app Facebook.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FacebookCentralPage,
});

function FacebookCentralPage() {
  const queryClient = useQueryClient();
  const list = useServerFn(listCentralPages);
  const doAssign = useServerFn(assignPageToWorkspace);
  const doUnassign = useServerFn(unassignPage);
  const doRefresh = useServerFn(refreshCentralPages);

  const { data, isLoading } = useQuery({
    queryKey: ["facebook-central"],
    queryFn: () => list({}),
  });

  const run = (fn: () => Promise<unknown>, ok: string) =>
    fn()
      .then(() => {
        toast.success(ok);
        return queryClient.invalidateQueries();
      })
      .catch((e: any) => toast.error(e?.message ?? "Nisy olana"));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Pages Facebook centrales</h1>
          <p className="text-sm text-muted-foreground">
            Connexion Facebook iray ihany no ilaina. Zarao isaky ny workspace ny pejy: ny hafatra
            tonga dia mankany amin'ny workspace tompon'ilay pejy sy ny IA-ny.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => run(() => doRefresh({ data: {} }), "Lisitra nohavaozina")}
        >
          <RefreshCw className="h-4 w-4 mr-1" /> Havaozina
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pejy ({data?.pages.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading && <p className="text-sm text-muted-foreground">Eo am-pakàna…</p>}
          {(data?.pages ?? []).map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3"
            >
              <div className="flex-1 min-w-40">
                <div className="font-medium">{p.page_name}</div>
                <div className="text-xs text-muted-foreground">
                  {p.assigned_workspace_name
                    ? `Workspace: ${p.assigned_workspace_name}`
                    : "Mbola tsy voatokana"}
                </div>
              </div>
              <select
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                value={p.assigned_workspace_id ?? ""}
                onChange={(e) => {
                  const id = e.target.value;
                  if (!id) {
                    run(() => doUnassign({ data: { page_id: p.page_id } }), "Nesorina");
                  } else {
                    run(
                      () => doAssign({ data: { page_id: p.page_id, workspace_id: id } }),
                      "Voatokana",
                    );
                  }
                }}
              >
                <option value="">— Tsy voatokana —</option>
                {(data?.workspaces ?? []).map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
          {data && data.pages.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Mbola tsy misy pejy. Tsindrio "Connecter avec Facebook" ao amin'ny pejy Facebook.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
