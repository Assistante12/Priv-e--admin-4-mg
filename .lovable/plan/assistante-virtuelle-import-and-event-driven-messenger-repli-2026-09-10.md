# ASSISTANTE VIRTUELLE — import and event-driven Messenger replies

## What you get

The full app from your archive (dashboard, Messenger conversations, comments, products, orders, payments, trainings, prompts, scheduled posts, users) running here, with sign-in by email and by Google, and the complete database.

Then one behaviour change: when someone writes to your Facebook page, the reply is produced and sent right away, on the spot. No waiting loop, no queue, no message that stays stuck because another process holds it.

## Step 1 — Import the project

- Copy all application files, pages, styles and settings from the archive into this project (no repository metadata).
- Install the same packages as the archive.
- Keep every database migration file exactly as-is and apply them, so tables, security rules and functions are identical.
- Turn on the built-in backend so the database, logins and server code work here.

## Step 2 — Sign-in

Email/password and Google sign-in stay exactly as they are in the code. Google needs to be switched on in the backend settings; the login page and protected pages are unchanged.

## Step 3 — Make Facebook replies purely event-driven

Current behaviour: a Facebook message can be picked up by three different paths (the webhook, a repeating background loop every 8 seconds, and cron endpoints). To stop double answers, the code locks each conversation in the database. When a lock is not released in time, the client's message is silently skipped.

New behaviour:

- The webhook is the only path that answers a Messenger message. It reads the event, asks the AI, sends the reply back to Messenger, and logs it — in one pass.
- Duplicate protection changes from "lock the conversation" to "only handle each Facebook message id once". Two people writing at the same time, or the same person sending several messages, are all answered; nothing gets blocked.
- The repeating loop and the automatic scanning of conversations are removed for messages and comments, so nothing polls Facebook.
- Scheduled posts and the timed notifications keep their own schedule — they are time-based, not message-based, so they stay.
- The manual "reply to all pending messages" button in Settings stays as a rescue tool you press yourself.
- Verification of the webhook address by Facebook (the token check) is unchanged.

## Technical notes

- `src/routes/api/public/fb/webhook.ts`: keeps GET verification; POST validates, then processes the event and returns `EVENT_RECEIVED`.
- `src/lib/ai-engine.server.ts`: `handleMessengerEvent` keeps `claimFacebookEvent` (per-`mid` idempotency) and drops `claimConversation` / `releaseConversation` / the `inFlightReplies` early-return; keeps the "already answered after turn start" guard. Same treatment for the comment path where a conversation lock blocks.
- `src/lib/background-worker.server.ts`: remove `startBackgroundWorker`, `setInterval` and `maybeTickOnRequest`; keep a tick that only publishes due scheduled posts and sends scheduled pushes.
- `src/server.ts`: drop the worker boot and per-request tick, keep the template's error capture wrapper.
- `src/routes/api/public/hooks/reply-all-messages.ts` removed; `hooks/cron.ts` kept for scheduled posts/pushes only.
- Secrets needed: `FACEBOOK_VERIFY_TOKEN`, Facebook app id/secret for page connection, `LOVABLE_API_KEY` for the AI. I will ask for the Facebook values through the secure form once the app builds.

## Verification

Build and typecheck, load the main pages, confirm the webhook address answers Facebook's verification, and simulate an incoming message event to confirm one reply is generated and one outgoing message is logged.
