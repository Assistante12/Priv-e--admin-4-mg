import { firestoreClient } from "@/integrations/firebase/firestore-adapter";

export const supabaseAdmin: any = new Proxy(firestoreClient as any, {
  get(target, prop, receiver) {
    if (prop === "from") {
      return (table: string) => firestoreClient.from(table);
    }
    return Reflect.get(target, prop, receiver);
  },
});
