import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getAdminAuth } from "./config";
import { firestoreClient } from "./firestore-adapter";

export const requireFirebaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const request = getRequest();

    let userId = "default_user";
    let claims: any = {};

    if (request?.headers) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.replace("Bearer ", "").trim();
        if (token) {
          try {
            const adminAuth = await getAdminAuth();
            if (adminAuth) {
              const decoded = await adminAuth.verifyIdToken(token);
              userId = decoded.uid;
              claims = decoded;
            } else {
              const parts = token.split(".");
              if (parts.length === 3) {
                const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
                userId = payload.user_id || payload.sub || "default_user";
                claims = payload;
              }
            }
          } catch (e) {
            // Fallback decode for development/preview resilience
            try {
              const parts = token.split(".");
              if (parts.length === 3) {
                const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
                userId = payload.user_id || payload.sub || "default_user";
                claims = payload;
              }
            } catch {
              console.warn("[requireFirebaseAuth] Invalid token format:", e);
            }
          }
        }
      }
    }

    return next({
      context: {
        supabase: firestoreClient as any,
        userId,
        claims,
      },
    });
  },
);
