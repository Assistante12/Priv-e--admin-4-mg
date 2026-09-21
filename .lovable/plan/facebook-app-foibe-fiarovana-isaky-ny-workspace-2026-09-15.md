# Facebook App foibe + fiarovana isaky ny Workspace

## 1. Facebook App foibe iombonana

Tanjona: tsy misy workspace mangataka App ID / App Secret intsony.

- Ny mari-pamantarana Facebook (App ID, App Secret, Webhook verify token) tehirizina indray mandeha ihany ao amin'ny **compte général** (settings an'ny tompon'ny kaonty).
- Fonction vaovao `resolveFacebookApp(scope)`:
  1. mitady ny settings an'ny compte général (tompon'ny workspace),
  2. raha tsy misy, mampiasa ny secrets `FACEBOOK_APP_ID` / `FACEBOOK_APP_SECRET`,
  3. mijery ny settings an'ny workspace ihany raha misy an-tanana efa nampiditra (compatibilité).
- `getFacebookLoginUrl` sy `getWebhookConfig` mampiasa io fonction io; ny `state` an'ny OAuth mitondra ny **workspace id** (scope) mba tsy hiova ny fitehirizana pejy.
- `/api/public/fb/callback` mamaky ny mari-pamantarana foibe amin'io fomba io (fa tsy ny settings an'ny workspace intsony); ny fitehirizana pejy sy ny `facebook_central_pages` mijanona tahaka izao.
- Pejy Paramètres: ny fizarana "Identifiants Facebook Developer" hiseho **ho an'ny compte général ihany**; ny workspace hafa mahita hafatra hoe "Facebook App foibe efa mandeha — tsy mila manao na inona na inona".
- Tsy misy fiovana amin'ny webhook, IA, orders, push.

## 2. Fiarovana isaky ny Workspace (email + mot de passe)

Migration:
- `workspaces` ampiana `login_email text`, `password_hash text`, `password_salt text`, `password_updated_at`.
- Table vaovao `workspace_unlocks` (user_id, workspace_id, expires_at) — mitahiry ny fahazoan-dàlana rehefa voamarina ny mot de passe (valid 12 ora), miaraka amin'ny RLS + GRANT.

Server:
- `createWorkspace` mangataka: anarana, email, mot de passe (min 6). Ny mot de passe hash-ina amin'ny PBKDF2 (WebCrypto) miaraka amin'ny salt; tsy voatahiry mihitsy ny mot de passe madio.
- `unlockWorkspace({ id, password })`: manamarina ny hash → manoratra `workspace_unlocks` → mamadika ny workspace mavitrika.
- `switchWorkspace`: tsy mamela intsony raha tsy misy unlock manan-kery (afa-tsy ny workspace personnel).
- `resetWorkspacePassword({ id, email, new_password })`: azon'ny tompon'ny kaonty (owner) atao — io no "Mot de passe oublié".

UI:
- Mpifamadika workspace: rehefa misafidy workspace voaaro dia miseho boaty mot de passe (miaraka amin'ny rohy "Mot de passe oublié").
- Famoronana workspace: saisie anarana + email + mot de passe.
- Pejy `/workspaces`: bokotra "Mot de passe oublié / Manova mot de passe" isaky ny workspace (ho an'ny owner).

## 3. Fiarovana ny logique efa misy

Tsy kitihina: `ai-engine.server.ts`, `push-notify.server.ts`, `post-publisher.server.ts`, ny webhook POST/GET, ny fanoratana kaomandy, ary ny push Firebase. Ny fiovana rehetra dia ao amin'ny fakana mari-pamantarana Facebook sy ny fidirana amin'ny workspace ihany.

## Fanamarinana

- Migration + typecheck + build.
- Test: workspace vaovao → tsindrio "Connecter avec Facebook" tsy misy fangatahana App ID.
- Test: fifamadihana workspace mila mot de passe; mot de passe diso lavina.
- Fanamarinana fa ny webhook GET verification sy ny valin-tenin'ny IA mijanona miasa.
