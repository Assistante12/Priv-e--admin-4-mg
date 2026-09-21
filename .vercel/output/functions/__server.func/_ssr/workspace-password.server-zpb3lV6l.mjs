//#region node_modules/.nitro/vite/services/ssr/assets/workspace-password.server-zpb3lV6l.js
/**
* Hash / vérification du mot de passe d'un workspace (PBKDF2-SHA256, WebCrypto).
* Le mot de passe en clair n'est jamais stocké.
*/
var ITERATIONS = 1e5;
var LEGACY_ITERATIONS = 12e4;
function toHex(buf) {
	return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function derive(password, saltHex, iterations) {
	const enc = new TextEncoder();
	const salt = Uint8Array.from(saltHex.match(/.{1,2}/g) ?? [], (h) => parseInt(h, 16));
	const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
	return toHex(await crypto.subtle.deriveBits({
		name: "PBKDF2",
		salt,
		iterations,
		hash: "SHA-256"
	}, key, 256));
}
async function hashWorkspacePassword(password) {
	const salt = toHex(crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16)).buffer);
	return {
		salt,
		hash: await derive(password, salt, ITERATIONS)
	};
}
function safeEqual(a, b) {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}
async function verifyWorkspacePassword(password, saltHex, hash) {
	if (!saltHex || !hash) return false;
	const candidates = [ITERATIONS, LEGACY_ITERATIONS];
	for (const iterations of candidates) try {
		if (safeEqual(await derive(password, saltHex, iterations), hash)) return true;
	} catch {}
	return false;
}
//#endregion
export { hashWorkspacePassword, verifyWorkspacePassword };
