# Workspaces maro (multi-workspace) + Facebook App foibe iombonana

## Tanjona

- Kaonty iray afaka mamorona workspace maro (1000+) ary mifamadika haingana amin'izy ireo.
- Workspace tsirairay: angona voatokana (pejy Facebook, vokatra/formations, kaomandy, paramètres, prompts, clés, logs).
- Connexion Facebook iray foibe ihany; ny pejy tsirairay atokana ho an'ny workspace iray.
- Tsy misy fiovana amin'ny logique efa mandeha: webhook event-driven, valin-teny avy hatrany avy amin'ny IA, push notifications, fanoratana kaomandy.

## Fototra teknika (fomba tsy mandrava ny code)

Ny angona rehetra dia efa voazara amin'ny alalan'ny tsanganana `user_id`. Ny `user_id` dia hatao "scope id" (workspace id) fa tsy "auth user id" intsony:

- Workspace "personnel" isaky ny mpampiasa efa misy: `workspaces.id = auth.uid()` — ka ny angona efa misy tsy mifindra velively.
- Workspace vaovao: `workspaces.id` = uuid vaovao; ny angona rehetra ao aminy manana `user_id = workspace.id`.

Vokany: ny fanontaniana `.eq("user_id", scope)` sy ny `insert({ user_id: scope })` rehetra mijanona ho toy izao; ny ampahany hiovana dia ny fomba fakana ny `scope`.

## 1. Base de données (migration)

- `workspaces` (name, owner_user_id, assistance_type ho fanoroana fotsiny), `workspace_members` (workspace_id, user_id, role: owner/admin/member), `profiles.active_workspace_id`.
- Fonction `security definer`: `public.has_workspace_access(_scope uuid)` — `true` raha ny `auth.uid()` no mitovy amin'ny `_scope` (workspace personnel) na misy `workspace_members` mifanaraka.
- Seed: workspace personnel isaky ny mpampiasa efa misy (`id = user.id`) + `workspace_members` mifanaraka, ary trigger ho an'ny mpampiasa vaovao.
- Amin'ny tabilao voazara rehetra (settings, prompts, api_keys, facebook_pages, messages, comments, orders, products, trainings, payments, scheduled_posts, logs, push_tokens, sns.): esorina ny FK `user_id -> auth.users`, ary soloina ny RLS policies amin'ny `public.has_workspace_access(user_id)` (SELECT/INSERT/UPDATE/DELETE). Tsy misy tsanganana esorina, tsy misy angona voafafa.
- Tabilao vaovao ho an'ny Facebook foibe: `facebook_central_connection` (token foibe: user token, expires) sy `facebook_central_pages` (page_id, page_name, page_access_token, assigned_workspace_id nullable). Azon'ny mpitantana foibe ihany no mahita ireo; ny workspace mahita ny an'ny tenany ihany.

## 2. Kodra server

- `src/lib/workspace.functions.ts`: `listWorkspaces`, `createWorkspace`, `switchWorkspace`, `renameWorkspace`, `deleteWorkspace` (mila fahefana owner).
- `src/lib/workspace.server.ts`: `resolveScopeId(context)` — mamaky `profiles.active_workspace_id`, manamarina ny fahazoan-dàlana, ary miverina amin'ny workspace personnel raha tsy misy.
- Ao amin'ny server functions efa misy (dashboard, orders, products, trainings, payments, prompts, api-keys, discussions, scheduled-posts, facebook, push, ia-control, admin-overview): ny `context.userId` ampiasaina ho fanasokajiana angona no soloina `scope` avy amin'ny `resolveScopeId(context)`. Ny logique anatiny tsy misy ovaina.
- `src/lib/ai-engine.server.ts`, `push-notify.server.ts`, `post-publisher.server.ts`, `background-worker.server.ts`, ny webhook sy ny callback Facebook: **tsy kitihina**. Miasa amin'ny `facebook_pages.user_id` izy ireo, ka ny scope workspace no efa voarakitra ao.

## 3. Facebook foibe (Vahaolana 1)

- Ny `/api/public/fb/callback` efa misy ampiana fitehirizana ao amin'ny `facebook_central_pages` (ho an'ny kaonty foibe) — ny fitantanana `facebook_pages` efa misy mijanona ho toy izao.
- Pejy vaovao `/facebook-central` (ho an'ny mpitantana foibe): lisitry ny pejy rehetra avy amin'ny connexion foibe + safidy workspace isaky ny pejy.
- Rehefa atokana pejy ho an'ny workspace: `facebook_pages` upsert (`user_id = workspace.id`, page_id, tokens, is_connected, webhook_subscribed) — ka ny webhook sy ny IA efa mandeha dia mandefa ho azy any amin'ny workspace tompony, tsy misy fiovana kodra.
- Fanesorana fanokanana: `is_connected = false` amin'ilay `facebook_pages` mifanaraka; tsy voakasika ny hafa.
- Pejy iray tsy azo atokana ho an'ny workspace roa miaraka (contrainte unique amin'ny `facebook_central_pages.page_id`).

## 4. Interface

- Mpisafidy workspace eo amin'ny sisiny (sidebar) sy amin'ny lohateny mobile: lisitra misy fikarohana (ho an'ny 1000+ workspace, pagination/recherche server-side), bokotra "Workspace vaovao".
- Rehefa mifamadika: `switchWorkspace` avy eo `queryClient.invalidateQueries()` — ka ny pejy rehetra maneho ny angon'ilay workspace.
- Pejy `/workspaces`: lisitra, famoronana, fanovana anarana, famafana.
- Ny badge/bannière kaomandy sy ny realtime alerts voafetra amin'ny workspace mavitrika ihany.

## Fanamarinana

- Build + typecheck.
- Test: mamorona workspace vaovao → foana ny angona (paramètres, kaomandy), tsy mifangaro amin'ny workspace personnel.
- Test: manokana pejy Facebook amin'ny workspace A → ny hafatra tonga miseho ao amin'ny A ihany.
- Fanamarinana fa ny webhook GET/POST, ny valin-tenin'ny IA sy ny push mijanona miasa.
