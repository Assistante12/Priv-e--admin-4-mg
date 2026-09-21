import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export interface AccountCustomKeys {
  facebook_app_id?: string | null;
  facebook_app_secret?: string | null;
  facebook_verify_token?: string | null;
  gemini_api_key?: string | null;
  lovable_api_key?: string | null;
  supabase_project_url?: string | null;
  supabase_anon_key?: string | null;
  supabase_service_role_key?: string | null;
  supabase_project_id?: string | null;
}

const isServerless = Boolean(
  process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NOW_REGION ||
    process.env.NODE_ENV === "production",
);

const DATA_DIR = isServerless
  ? path.join(os.tmpdir(), "agence-virtuelle-data")
  : path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "account-keys.json");

interface KeysStore {
  global: AccountCustomKeys;
  accounts: Record<string, AccountCustomKeys>;
}

// In-memory fallback if disk is completely unavailable
let memoryStore: KeysStore = { global: {}, accounts: {} };

function readStore(): KeysStore {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      return memoryStore;
    }
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    memoryStore = {
      global: parsed.global || {},
      accounts: parsed.accounts || {},
    };
    return memoryStore;
  } catch {
    return memoryStore;
  }
}

function writeStore(store: KeysStore) {
  memoryStore = store;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch {
    // Silently ignore disk write issues in restricted serverless runtimes
  }
}

/**
 * Apply keys into process.env so third-party SDKs and client factories
 * can read them dynamically without container restarts.
 */
export function applyKeysToEnv(keys: AccountCustomKeys) {
  if (keys.supabase_project_url) {
    process.env["SUPABASE_URL"] = keys.supabase_project_url;
    process.env["VITE_SUPABASE_URL"] = keys.supabase_project_url;
  }
  if (keys.supabase_anon_key) {
    process.env["SUPABASE_PUBLISHABLE_KEY"] = keys.supabase_anon_key;
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] = keys.supabase_anon_key;
  }
  if (keys.supabase_service_role_key) {
    process.env["SUPABASE_SERVICE_ROLE_KEY"] = keys.supabase_service_role_key;
  }
  if (keys.supabase_project_id) {
    process.env["SUPABASE_PROJECT_ID"] = keys.supabase_project_id;
    process.env["VITE_SUPABASE_PROJECT_ID"] = keys.supabase_project_id;
  }
  if (keys.lovable_api_key) {
    process.env["LOVABLE_API_KEY"] = keys.lovable_api_key;
  }
  if (keys.gemini_api_key) {
    process.env["GEMINI_API_KEY"] = keys.gemini_api_key;
  }
  if (keys.facebook_app_id) {
    process.env["FACEBOOK_APP_ID"] = keys.facebook_app_id;
  }
  if (keys.facebook_app_secret) {
    process.env["FACEBOOK_APP_SECRET"] = keys.facebook_app_secret;
  }
  if (keys.facebook_verify_token) {
    process.env["FACEBOOK_VERIFY_TOKEN"] = keys.facebook_verify_token;
  }
}

/**
 * Bootstraps stored keys into process.env at server startup.
 */
export function initAccountKeys() {
  const store = readStore();
  applyKeysToEnv(store.global);

  // If environment has any, seed into global
  let updated = false;
  const envFbId = process.env["FACEBOOK_APP_ID"];
  const envFbSecret = process.env["FACEBOOK_APP_SECRET"];
  const envFbToken = process.env["FACEBOOK_VERIFY_TOKEN"];
  const envLovable = process.env["LOVABLE_API_KEY"];
  const envSbUrl = process.env["SUPABASE_URL"];
  const envSbAnon = process.env["SUPABASE_PUBLISHABLE_KEY"];
  const envSbService = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  const envSbProj = process.env["SUPABASE_PROJECT_ID"];

  if (!store.global.facebook_app_id && envFbId) {
    store.global.facebook_app_id = envFbId;
    updated = true;
  }
  if (!store.global.facebook_app_secret && envFbSecret) {
    store.global.facebook_app_secret = envFbSecret;
    updated = true;
  }
  if (!store.global.facebook_verify_token && envFbToken) {
    store.global.facebook_verify_token = envFbToken;
    updated = true;
  }
  if (!store.global.lovable_api_key && envLovable) {
    store.global.lovable_api_key = envLovable;
    updated = true;
  }
  if (!store.global.supabase_project_url && envSbUrl) {
    store.global.supabase_project_url = envSbUrl;
    updated = true;
  }
  if (!store.global.supabase_anon_key && envSbAnon) {
    store.global.supabase_anon_key = envSbAnon;
    updated = true;
  }
  if (!store.global.supabase_service_role_key && envSbService) {
    store.global.supabase_service_role_key = envSbService;
    updated = true;
  }
  if (!store.global.supabase_project_id && envSbProj) {
    store.global.supabase_project_id = envSbProj;
    updated = true;
  }

  if (updated) {
    writeStore(store);
  }
}

// Auto-run bootstrap on module load
initAccountKeys();

/**
 * Retrieve custom keys for a given user or workspace scope.
 */
export function getAccountCustomKeys(userId?: string): AccountCustomKeys {
  const store = readStore();
  const accountKeys = userId ? store.accounts[userId] || {} : {};
  const global = store.global || {};

  return {
    facebook_app_id: accountKeys.facebook_app_id || global.facebook_app_id || process.env["FACEBOOK_APP_ID"] || null,
    facebook_app_secret: accountKeys.facebook_app_secret || global.facebook_app_secret || process.env["FACEBOOK_APP_SECRET"] || null,
    facebook_verify_token: accountKeys.facebook_verify_token || global.facebook_verify_token || process.env["FACEBOOK_VERIFY_TOKEN"] || null,
    gemini_api_key: accountKeys.gemini_api_key || global.gemini_api_key || process.env["GEMINI_API_KEY"] || null,
    lovable_api_key: accountKeys.lovable_api_key || global.lovable_api_key || process.env["LOVABLE_API_KEY"] || null,
    supabase_project_url: accountKeys.supabase_project_url || global.supabase_project_url || process.env["SUPABASE_URL"] || null,
    supabase_anon_key: accountKeys.supabase_anon_key || global.supabase_anon_key || process.env["SUPABASE_PUBLISHABLE_KEY"] || null,
    supabase_service_role_key: accountKeys.supabase_service_role_key || global.supabase_service_role_key || process.env["SUPABASE_SERVICE_ROLE_KEY"] || null,
    supabase_project_id: accountKeys.supabase_project_id || global.supabase_project_id || process.env["SUPABASE_PROJECT_ID"] || null,
  };
}

/**
 * Save keys entered manually by a user for their account / workspace.
 */
export async function saveAccountCustomKeys(
  userId: string,
  newKeys: Partial<AccountCustomKeys>,
): Promise<AccountCustomKeys> {
  const store = readStore();
  const current = store.accounts[userId] || {};

  const clean = (val: unknown) => {
    if (typeof val === "string") {
      const t = val.trim();
      return t.length > 0 ? t : null;
    }
    return val === null ? null : undefined;
  };

  const updatedAccount: AccountCustomKeys = {
    ...current,
    ...(clean(newKeys.facebook_app_id) !== undefined ? { facebook_app_id: clean(newKeys.facebook_app_id) } : {}),
    ...(clean(newKeys.facebook_app_secret) !== undefined ? { facebook_app_secret: clean(newKeys.facebook_app_secret) } : {}),
    ...(clean(newKeys.facebook_verify_token) !== undefined ? { facebook_verify_token: clean(newKeys.facebook_verify_token) } : {}),
    ...(clean(newKeys.gemini_api_key) !== undefined ? { gemini_api_key: clean(newKeys.gemini_api_key) } : {}),
    ...(clean(newKeys.lovable_api_key) !== undefined ? { lovable_api_key: clean(newKeys.lovable_api_key) } : {}),
    ...(clean(newKeys.supabase_project_url) !== undefined ? { supabase_project_url: clean(newKeys.supabase_project_url) } : {}),
    ...(clean(newKeys.supabase_anon_key) !== undefined ? { supabase_anon_key: clean(newKeys.supabase_anon_key) } : {}),
    ...(clean(newKeys.supabase_service_role_key) !== undefined ? { supabase_service_role_key: clean(newKeys.supabase_service_role_key) } : {}),
    ...(clean(newKeys.supabase_project_id) !== undefined ? { supabase_project_id: clean(newKeys.supabase_project_id) } : {}),
  };

  store.accounts[userId] = updatedAccount;

  // Also update global store if global values are empty or if this is the first account
  for (const [k, v] of Object.entries(updatedAccount)) {
    const key = k as keyof AccountCustomKeys;
    if (v && !store.global[key]) {
      store.global[key] = v;
    }
  }

  writeStore(store);

  // Apply to process.env immediately
  applyKeysToEnv(updatedAccount);

  return getAccountCustomKeys(userId);
}
