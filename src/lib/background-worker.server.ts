import { supabaseAdmin } from "@/integrations/supabase/client.server";

let isWorkerRunning = false;
let lastRunTimestamp = 0;

/**
 * Runs one tick of time-based work only:
 * 1. Scheduled AI push notifications.
 * 2. Publishes due scheduled Facebook posts.
 *
 * Messenger replies are NOT handled here: they are triggered directly by the
 * Facebook webhook event (see src/routes/api/public/fb/webhook.ts).
 */
export async function runBackgroundWorkerTick(): Promise<{
  posts?: any;
  skipped?: boolean;
}> {
  if (isWorkerRunning) {
    return { skipped: true };
  }

  const { data: claimed, error: claimError } = await (supabaseAdmin as any).rpc(
    "claim_background_job",
    { _job_name: "facebook-automation", _lease_seconds: 120 },
  );
  if (claimError) throw new Error(`Worker lock failed: ${claimError.message}`);
  if (!claimed) return { skipped: true };

  isWorkerRunning = true;
  lastRunTimestamp = Date.now();

  try {
    // 0. Scheduled AI push notifications (13h & 20h Madagascar)
    try {
      const { maybeSendScheduledPush } = await import("@/lib/push-notify.server");
      await maybeSendScheduledPush();
    } catch (e) {
      console.error("[background-worker] push error:", e);
    }

    // 2. Publish due scheduled posts
    let postsResult = null;
    try {
      const { runScheduledPost } = await import("@/lib/post-publisher.server");
      const nowIso = new Date().toISOString();
      const { data: duePosts } = await supabaseAdmin
        .from("scheduled_posts")
        .select("id")
        .eq("status", "pending")
        .lte("scheduled_at", nowIso)
        .order("scheduled_at", { ascending: true })
        .limit(10);

      if (duePosts && duePosts.length > 0) {
        const results = [];
        for (const post of duePosts) {
          try {
            const r = await runScheduledPost(post.id);
            results.push({ id: post.id, ...r });
          } catch (postErr) {
            results.push({
              id: post.id,
              ok: false,
              error: postErr instanceof Error ? postErr.message : String(postErr),
            });
          }
        }
        postsResult = { processed: results.length, results };
        console.log("[background-worker] Scheduled posts published:", postsResult);
      }
    } catch (e) {
      console.error("[background-worker] Posts error:", e);
    }

    const result = { posts: postsResult };
    await (supabaseAdmin as any).rpc("finish_background_job", {
      _job_name: "facebook-automation",
      _status: "idle",
      _result: result,
    });
    return result;
  } catch (error) {
    await (supabaseAdmin as any).rpc("finish_background_job", {
      _job_name: "facebook-automation",
      _status: "failed",
      _result: { error: error instanceof Error ? error.message : String(error) },
    });
    throw error;
  } finally {
    isWorkerRunning = false;
  }
}

export function getWorkerStatus() {
  return {
    isWorkerRunning,
    lastRunTimestamp,
    lastRunAgoSeconds: lastRunTimestamp ? Math.round((Date.now() - lastRunTimestamp) / 1000) : null,
  };
}
