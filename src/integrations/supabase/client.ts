import { firestoreClient } from "@/integrations/firebase/firestore-adapter";
import { auth } from "@/integrations/firebase/config";
import { signOut } from "firebase/auth";

export const supabase: any = new Proxy(firestoreClient as any, {
  get(target, prop, receiver) {
    if (prop === "auth") {
      return {
        getUser: async () => ({ data: { user: auth.currentUser }, error: null }),
        getSession: async () => {
          const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
          return {
            data: { session: token ? { access_token: token, user: auth.currentUser } : null },
            error: null,
          };
        },
        signOut: async () => {
          await signOut(auth);
          return { error: null };
        },
        onAuthStateChange: (cb: (event: string, session: any) => void) => {
          const unsubscribe = auth.onAuthStateChanged((user) => {
            cb(user ? "SIGNED_IN" : "SIGNED_OUT", user ? { user } : null);
          });
          return { data: { subscription: { unsubscribe } } };
        },
      };
    }
    if (prop === "from") {
      return (table: string) => firestoreClient.from(table);
    }
    return Reflect.get(target, prop, receiver);
  },
});
