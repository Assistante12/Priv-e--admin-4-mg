import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { initializeFirestore, getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

export const firebaseConfig = {
  projectId: "effortless-rainfall-gf38q",
  appId: "1:1006778088935:web:63bb754492f67d1bd85142",
  apiKey: "AIzaSyCB3raOMB1KZT-5saVpuIYDGnB-E7UK944",
  authDomain: "effortless-rainfall-gf38q.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-agencevirtuelle-4025dff0-0f16-4acf-aae5-334da4c38db5",
  storageBucket: "effortless-rainfall-gf38q.firebasestorage.app",
  messagingSenderId: "1006778088935",
};

export const FIRESTORE_DATABASE_ID = "ai-studio-agencevirtuelle-4025dff0-0f16-4acf-aae5-334da4c38db5";

const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let db: Firestore;
try {
  db = initializeFirestore(app, {}, FIRESTORE_DATABASE_ID);
} catch {
  db = getFirestore(app, FIRESTORE_DATABASE_ID);
}

const auth: Auth = getAuth(app);

let adminDbInstance: any = null;
let adminAuthInstance: any = null;

export async function getAdminDb(): Promise<Firestore> {
  return db;
}

export async function getAdminAuth() {
  if (typeof window === "undefined") {
    if (!adminAuthInstance) {
      try {
        const adminAppModule = await import("firebase-admin/app");
        const adminAuthModule = await import("firebase-admin/auth");
        if (adminAppModule.getApps().length === 0) {
          adminAppModule.initializeApp({
            projectId: firebaseConfig.projectId,
          });
        }
        adminAuthInstance = adminAuthModule.getAuth();
      } catch (err) {
        console.warn("[Firebase Admin Auth] fallback:", err);
      }
    }
    return adminAuthInstance;
  }
  return null;
}

export { app, db, auth };
