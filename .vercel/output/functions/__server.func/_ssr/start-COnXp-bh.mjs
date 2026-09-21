import { n as createMiddleware } from "./server-D9pwzi9_.mjs";
import { t as auth } from "./config-CbtXGA-s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/start-COnXp-bh.js
function dedupeSerializationAdapters(deduped, serializationAdapters) {
	for (let i = 0, len = serializationAdapters.length; i < len; i++) {
		const current = serializationAdapters[i];
		if (!deduped.has(current)) {
			deduped.add(current);
			if (current.extends) dedupeSerializationAdapters(deduped, current.extends);
		}
	}
}
var createStart = (getOptions) => {
	return {
		getOptions: async () => {
			const options = await getOptions();
			if (options.serializationAdapters) {
				const deduped = /* @__PURE__ */ new Set();
				dedupeSerializationAdapters(deduped, options.serializationAdapters);
				options.serializationAdapters = Array.from(deduped);
			}
			return options;
		},
		createMiddleware
	};
};
var attachFirebaseAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
	let token;
	if (auth.currentUser) try {
		token = await auth.currentUser.getIdToken();
	} catch (e) {
		console.warn("[attachFirebaseAuth] Could not get ID token:", e);
	}
	return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
});
var errorMiddleware = createMiddleware().server(async ({ next }) => {
	try {
		return await next();
	} catch (error) {
		if (error != null && typeof error === "object" && "statusCode" in error) throw error;
		console.error("[startInstance] Server middleware caught error:", error);
		throw error;
	}
});
var startInstance = createStart(() => ({
	functionMiddleware: [attachFirebaseAuth],
	requestMiddleware: [errorMiddleware]
}));
//#endregion
export { startInstance };
