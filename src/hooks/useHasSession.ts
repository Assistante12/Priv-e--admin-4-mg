import { useEffect, useState } from "react";
import { auth } from "@/integrations/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

/**
 * Returns true when a Firebase session/user is available client-side.
 */
export function useHasSession(): boolean {
  const [hasSession, setHasSession] = useState<boolean>(() => Boolean(auth.currentUser));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setHasSession(Boolean(user));
    });
    return () => unsubscribe();
  }, []);

  return hasSession;
}
