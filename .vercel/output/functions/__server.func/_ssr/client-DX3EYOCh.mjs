import "../_libs/firebase.mjs";
import { c as signOut } from "../_libs/firebase__auth.mjs";
import { t as auth } from "./config-CbtXGA-s.mjs";
import { t as firestoreClient } from "./auth-middleware-DChct94P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-DX3EYOCh.js
var supabase = new Proxy(firestoreClient, { get(target, prop, receiver) {
	if (prop === "auth") return {
		getUser: async () => ({
			data: { user: auth.currentUser },
			error: null
		}),
		getSession: async () => {
			const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
			return {
				data: { session: token ? {
					access_token: token,
					user: auth.currentUser
				} : null },
				error: null
			};
		},
		signOut: async () => {
			await signOut(auth);
			return { error: null };
		},
		onAuthStateChange: (cb) => {
			return { data: { subscription: { unsubscribe: auth.onAuthStateChanged((user) => {
				cb(user ? "SIGNED_IN" : "SIGNED_OUT", user ? { user } : null);
			}) } } };
		}
	};
	if (prop === "from") return (table) => firestoreClient.from(table);
	return Reflect.get(target, prop, receiver);
} });
//#endregion
export { supabase as t };
