import { a as getApp, o as getApps, s as initializeApp } from "../_libs/@firebase/app+[...].mjs";
import { c as initializeFirestore, s as getFirestore } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { r as getAuth } from "../_libs/firebase__auth.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/config-CbtXGA-s.js
var firebaseConfig = {
	projectId: "effortless-rainfall-gf38q",
	appId: "1:1006778088935:web:63bb754492f67d1bd85142",
	apiKey: "AIzaSyCB3raOMB1KZT-5saVpuIYDGnB-E7UK944",
	authDomain: "effortless-rainfall-gf38q.firebaseapp.com",
	firestoreDatabaseId: "ai-studio-agencevirtuelle-4025dff0-0f16-4acf-aae5-334da4c38db5",
	storageBucket: "effortless-rainfall-gf38q.firebasestorage.app",
	messagingSenderId: "1006778088935"
};
var FIRESTORE_DATABASE_ID = "ai-studio-agencevirtuelle-4025dff0-0f16-4acf-aae5-334da4c38db5";
var app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
var db;
try {
	db = initializeFirestore(app, {}, FIRESTORE_DATABASE_ID);
} catch {
	db = getFirestore(app, FIRESTORE_DATABASE_ID);
}
var auth = getAuth(app);
var adminAuthInstance = null;
async function getAdminAuth() {
	if (typeof window === "undefined") {
		if (!adminAuthInstance) try {
			const adminAppModule = await import("../_libs/firebase-admin+[...].mjs").then((n) => n.n);
			const adminAuthModule = await import("../_libs/firebase-admin+[...].mjs").then((n) => n.t);
			if (adminAppModule.getApps().length === 0) adminAppModule.initializeApp({ projectId: firebaseConfig.projectId });
			adminAuthInstance = adminAuthModule.getAuth();
		} catch (err) {
			console.warn("[Firebase Admin Auth] fallback:", err);
		}
		return adminAuthInstance;
	}
	return null;
}
//#endregion
export { db as n, getAdminAuth as r, auth as t };
