import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, ChevronsUpDown, Lock, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  createWorkspace,
  listWorkspaces,
  switchWorkspace,
  unlockWorkspace,
  unlockWorkspaceByEmail,
} from "@/lib/workspace.functions";


export function WorkspaceSwitcher() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pending, setPending] = useState<{ id: string; name: string } | null>(null);
  const [password, setPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const list = useServerFn(listWorkspaces);
  const doSwitch = useServerFn(switchWorkspace);
  const doCreate = useServerFn(createWorkspace);
  const doUnlock = useServerFn(unlockWorkspace);
  const doUnlockByEmail = useServerFn(unlockWorkspaceByEmail);


  const { data } = useQuery({
    queryKey: ["workspaces", search],
    queryFn: () => list({ data: { search: search || undefined, limit: 50 } }),
  });

  const active = useMemo(
    () => data?.workspaces.find((w) => w.is_active) ?? data?.workspaces[0],
    [data],
  );

  const afterChange = async () => {
    await queryClient.invalidateQueries();
    setOpen(false);
    setPending(null);
    setPassword("");
  };

  const switchMutation = useMutation({
    mutationFn: async (w: { id: string; name: string }) => {
      const res: any = await doSwitch({ data: { id: w.id } });
      return { res, w };
    },
    onSuccess: async ({ res, w }) => {
      if (res?.ok === false) {
        if (res.reason === "PASSWORD_REQUIRED") {
          setPending(w);
          toast.info("Mila mot de passe ity workspace ity.");
          return;
        }
        toast.error(res.message ?? "Tsy nety ny fifamadihana");
        return;
      }
      toast.success("Workspace novaina");
      await afterChange();
    },
    onError: (e: any) => toast.error(e?.message ?? "Tsy nety ny fifamadihana"),
  });

  const unlockMutation = useMutation({
    mutationFn: () => doUnlock({ data: { id: pending!.id, password } }),
    onSuccess: async () => {
      toast.success("Workspace novaina");
      await afterChange();
    },
    onError: (e: any) => toast.error(e?.message ?? "Mot de passe diso"),
  });

  const emailLoginMutation = useMutation({
    mutationFn: () =>
      doUnlockByEmail({ data: { email: loginEmail.trim(), password: loginPassword } }),
    onSuccess: async () => {
      toast.success("Tafiditra amin'ny workspace");
      setLoginEmail("");
      setLoginPassword("");
      await afterChange();
    },
    onError: (e: any) => toast.error(e?.message ?? "Email na mot de passe diso"),
  });


  const createMutation = useMutation({
    mutationFn: () =>
      doCreate({
        data: { name: newName.trim(), email: newEmail.trim(), password: newPassword },
      }),
    onSuccess: async () => {
      toast.success("Workspace vaovao noforonina");
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      await afterChange();
    },
    onError: (e: any) => toast.error(e?.message ?? "Tsy nety ny famoronana"),
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-between">
          <span className="truncate">{active?.name ?? "Workspace"}</span>
          <ChevronsUpDown className="h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-3 space-y-3">
        {pending ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Mot de passe — {pending.name}</p>
            <Input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe an'ny workspace"
              onKeyDown={(e) => {
                if (e.key === "Enter" && password) unlockMutation.mutate();
              }}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1"
                disabled={!password || unlockMutation.isPending}
                onClick={() => unlockMutation.mutate()}
              >
                Hiditra
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setPending(null);
                  setPassword("");
                }}
              >
                Aoka
              </Button>
            </div>
            <a href="/workspaces" className="block text-xs text-primary hover:underline">
              Mot de passe oublié ?
            </a>
          </div>
        ) : (
          <>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Karohy workspace…"
                className="pl-8"
              />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {(data?.workspaces ?? []).map((w) => (
                <button
                  key={w.id}
                  onClick={() => switchMutation.mutate({ id: w.id, name: w.name })}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                >
                  <span className="truncate flex-1">{w.name}</span>
                  {w.has_password && <Lock className="h-3 w-3 text-muted-foreground" />}
                  {w.is_personal && (
                    <span className="text-[10px] text-muted-foreground">personnel</span>
                  )}
                  {w.is_active && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
              {data && data.workspaces.length === 0 && (
                <p className="px-2 py-3 text-sm text-muted-foreground">Tsy nisy hita.</p>
              )}
            </div>
            <div className="space-y-2 border-t border-border pt-3">
              <p className="text-xs font-medium text-muted-foreground">
                Hiditra amin'ny workspace hafa
              </p>
              <Input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Email an'ny workspace"
              />
              <Input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Mot de passe"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && loginEmail.trim() && loginPassword) {
                    emailLoginMutation.mutate();
                  }
                }}
              />
              <Button
                size="sm"
                variant="secondary"
                className="w-full"
                disabled={!loginEmail.trim() || !loginPassword || emailLoginMutation.isPending}
                onClick={() => emailLoginMutation.mutate()}
              >
                Hiditra
              </Button>
            </div>
            <div className="space-y-2 border-t border-border pt-3">

              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Anaran'ny workspace vaovao"
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
                placeholder="Mot de passe (6+)"
              />
              <Button
                size="sm"
                className="w-full"
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
            </div>
            {data && <p className="text-xs text-muted-foreground">{data.total} workspace(s)</p>}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
