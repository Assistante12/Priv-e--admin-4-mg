import { A as isIndexedDBAvailable, L as validateIndexedDBOpenable, T as getModularInstance, _ as areCookiesEnabled, a as getApp, c as registerVersion, h as ErrorFactory, i as _registerComponent, l as deleteDB, n as _getProvider, p as Component, u as openDB } from "./@firebase/app+[...].mjs";
import { t as onIdChange } from "./firebase__installations.mjs";
//#region node_modules/@firebase/messaging/dist/esm/index.esm.js
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var DEFAULT_SW_PATH = "/firebase-messaging-sw.js";
var DEFAULT_SW_SCOPE = "/firebase-cloud-messaging-push-scope";
var DEFAULT_VAPID_KEY = "BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4";
var ENDPOINT = "https://fcmregistrations.googleapis.com/v1";
var CONSOLE_CAMPAIGN_ID = "google.c.a.c_id";
var CONSOLE_CAMPAIGN_NAME = "google.c.a.c_l";
var CONSOLE_CAMPAIGN_TIME = "google.c.a.ts";
/** Set to '1' if Analytics is enabled for the campaign */
var CONSOLE_CAMPAIGN_ANALYTICS_ENABLED = "google.c.a.e";
var DEFAULT_REGISTRATION_TIMEOUT = 1e4;
var MessageType$1;
(function(MessageType) {
	MessageType[MessageType["DATA_MESSAGE"] = 1] = "DATA_MESSAGE";
	MessageType[MessageType["DISPLAY_NOTIFICATION"] = 3] = "DISPLAY_NOTIFICATION";
})(MessageType$1 || (MessageType$1 = {}));
/**
* @license
* Copyright 2018 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
* in compliance with the License. You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software distributed under the License
* is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
* or implied. See the License for the specific language governing permissions and limitations under
* the License.
*/
var MessageType;
(function(MessageType) {
	MessageType["PUSH_RECEIVED"] = "push-received";
	MessageType["NOTIFICATION_CLICKED"] = "notification-clicked";
	MessageType["FID_REGISTERED"] = "fid-registered";
})(MessageType || (MessageType = {}));
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function arrayToBase64(array) {
	const uint8Array = new Uint8Array(array);
	return btoa(String.fromCharCode(...uint8Array)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function base64ToArray(base64String) {
	const base64 = (base64String + "=".repeat((4 - base64String.length % 4) % 4)).replace(/\-/g, "+").replace(/_/g, "/");
	const rawData = atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
	return outputArray;
}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var OLD_DB_NAME = "fcm_token_details_db";
/**
* The last DB version of 'fcm_token_details_db' was 4. This is one higher, so that the upgrade
* callback is called for all versions of the old DB.
*/
var OLD_DB_VERSION = 5;
var OLD_OBJECT_STORE_NAME = "fcm_token_object_Store";
async function migrateOldDatabase(senderId) {
	if ("databases" in indexedDB) {
		if (!(await indexedDB.databases()).map((db) => db.name).includes(OLD_DB_NAME)) return null;
	}
	let tokenDetails = null;
	(await openDB(OLD_DB_NAME, OLD_DB_VERSION, { upgrade: async (db, oldVersion, newVersion, upgradeTransaction) => {
		if (oldVersion < 2) return;
		if (!db.objectStoreNames.contains(OLD_OBJECT_STORE_NAME)) return;
		const objectStore = upgradeTransaction.objectStore(OLD_OBJECT_STORE_NAME);
		const value = await objectStore.index("fcmSenderId").get(senderId);
		await objectStore.clear();
		if (!value) return;
		if (oldVersion === 2) {
			const oldDetails = value;
			if (!oldDetails.auth || !oldDetails.p256dh || !oldDetails.endpoint) return;
			tokenDetails = {
				token: oldDetails.fcmToken,
				createTime: oldDetails.createTime ?? Date.now(),
				subscriptionOptions: {
					auth: oldDetails.auth,
					p256dh: oldDetails.p256dh,
					endpoint: oldDetails.endpoint,
					swScope: oldDetails.swScope,
					vapidKey: typeof oldDetails.vapidKey === "string" ? oldDetails.vapidKey : arrayToBase64(oldDetails.vapidKey)
				}
			};
		} else if (oldVersion === 3) {
			const oldDetails = value;
			tokenDetails = {
				token: oldDetails.fcmToken,
				createTime: oldDetails.createTime,
				subscriptionOptions: {
					auth: arrayToBase64(oldDetails.auth),
					p256dh: arrayToBase64(oldDetails.p256dh),
					endpoint: oldDetails.endpoint,
					swScope: oldDetails.swScope,
					vapidKey: arrayToBase64(oldDetails.vapidKey)
				}
			};
		} else if (oldVersion === 4) {
			const oldDetails = value;
			tokenDetails = {
				token: oldDetails.fcmToken,
				createTime: oldDetails.createTime,
				subscriptionOptions: {
					auth: arrayToBase64(oldDetails.auth),
					p256dh: arrayToBase64(oldDetails.p256dh),
					endpoint: oldDetails.endpoint,
					swScope: oldDetails.swScope,
					vapidKey: arrayToBase64(oldDetails.vapidKey)
				}
			};
		}
	} })).close();
	await deleteDB(OLD_DB_NAME);
	await deleteDB("fcm_vapid_details_db");
	await deleteDB("undefined");
	return checkTokenDetails(tokenDetails) ? tokenDetails : null;
}
function checkTokenDetails(tokenDetails) {
	if (!tokenDetails || !tokenDetails.subscriptionOptions) return false;
	const { subscriptionOptions } = tokenDetails;
	return typeof tokenDetails.createTime === "number" && tokenDetails.createTime > 0 && typeof tokenDetails.token === "string" && tokenDetails.token.length > 0 && typeof subscriptionOptions.auth === "string" && subscriptionOptions.auth.length > 0 && typeof subscriptionOptions.p256dh === "string" && subscriptionOptions.p256dh.length > 0 && typeof subscriptionOptions.endpoint === "string" && subscriptionOptions.endpoint.length > 0 && typeof subscriptionOptions.swScope === "string" && subscriptionOptions.swScope.length > 0 && typeof subscriptionOptions.vapidKey === "string" && subscriptionOptions.vapidKey.length > 0;
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var ERROR_FACTORY = new ErrorFactory("messaging", "Messaging", {
	["missing-app-config-values"]: "Missing App configuration value: \"{$valueName}\"",
	["only-available-in-window"]: "This method is available in a Window context.",
	["only-available-in-sw"]: "This method is available in a service worker context.",
	["permission-default"]: "The notification permission was not granted and dismissed instead.",
	["permission-blocked"]: "The notification permission was not granted and blocked instead.",
	["unsupported-browser"]: "This browser doesn't support the API's required to use the Firebase SDK.",
	["indexed-db-unsupported"]: "This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)",
	["failed-service-worker-registration"]: "We are unable to register the default service worker. {$browserErrorMessage}",
	["token-subscribe-failed"]: "A problem occurred while subscribing the user to FCM: {$errorInfo}",
	["token-subscribe-no-token"]: "FCM returned no token when subscribing the user to push.",
	["fid-registration-failed"]: "A problem occurred while creating an FCM registration via FID: {$errorInfo}",
	["fid-unregister-failed"]: "A problem occurred while unregistering the FCM registration via FID: {$errorInfo}",
	["fid-registration-idb-schema-unavailable"]: "Unable to read or persist FID registration metadata because the messaging IndexedDB schema is unavailable (for example, the database could not be upgraded to the latest version).",
	["token-unsubscribe-failed"]: "A problem occurred while unsubscribing the user from FCM: {$errorInfo}",
	["token-update-failed"]: "A problem occurred while updating the user from FCM: {$errorInfo}",
	["token-update-no-token"]: "FCM returned no token when updating the user to push.",
	["use-sw-after-get-token"]: "The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.",
	["invalid-sw-registration"]: "The input to useServiceWorker() must be a ServiceWorkerRegistration.",
	["invalid-bg-handler"]: "The input to setBackgroundMessageHandler() must be a function.",
	["invalid-vapid-key"]: "The public VAPID key must be a string.",
	["use-vapid-key-after-get-token"]: "The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used.",
	["invalid-on-registered-handler"]: "No onRegistered callback handler was provided or registered. Implement onRegistered() before register()."
});
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var DATABASE_NAME = "firebase-messaging-database";
var DATABASE_VERSION = 2;
var TOKEN_OBJECT_STORE_NAME = "firebase-messaging-store";
var FID_REGISTRATION_OBJECT_STORE_NAME = "firebase-messaging-fid-registration-store";
var idbImpl = {
	openDB,
	deleteDB
};
var dbPromise = null;
function migrateMessagingDb(upgradeDb, oldVersion, targetSchemaVersion) {
	switch (oldVersion) {
		case 0:
			upgradeDb.createObjectStore(TOKEN_OBJECT_STORE_NAME);
			if (targetSchemaVersion === 1) break;
		case 1: if (targetSchemaVersion === 2) upgradeDb.createObjectStore(FID_REGISTRATION_OBJECT_STORE_NAME);
	}
}
function createOpenDbOptions(targetSchemaVersion) {
	return {
		upgrade: (upgradeDb, oldVersion) => {
			migrateMessagingDb(upgradeDb, oldVersion, targetSchemaVersion);
		},
		blocked: () => {},
		blocking: (_currentVersion, _blockedVersion, event) => {
			dbPromise = null;
			event.target?.close();
		},
		terminated: () => {
			dbPromise = null;
		}
	};
}
function getDbPromise() {
	if (!dbPromise) dbPromise = idbImpl.openDB(DATABASE_NAME, DATABASE_VERSION, createOpenDbOptions(2)).catch(() => idbImpl.openDB(DATABASE_NAME, 1, createOpenDbOptions(1)));
	return dbPromise;
}
function hasObjectStore(db, storeName) {
	return db.objectStoreNames.contains(storeName);
}
function assertFidRegistrationObjectStore(db) {
	if (!hasObjectStore(db, FID_REGISTRATION_OBJECT_STORE_NAME)) throw ERROR_FACTORY.create("fid-registration-idb-schema-unavailable");
}
async function dbGet(firebaseDependencies) {
	const key = getKey(firebaseDependencies);
	const tokenDetails = await (await getDbPromise()).transaction(TOKEN_OBJECT_STORE_NAME).objectStore(TOKEN_OBJECT_STORE_NAME).get(key);
	if (tokenDetails) return tokenDetails;
	else {
		const oldTokenDetails = await migrateOldDatabase(firebaseDependencies.appConfig.senderId);
		if (oldTokenDetails) {
			await dbSet(firebaseDependencies, oldTokenDetails);
			return oldTokenDetails;
		}
	}
}
async function dbSet(firebaseDependencies, tokenDetails) {
	const key = getKey(firebaseDependencies);
	const db = await getDbPromise();
	const stores = [TOKEN_OBJECT_STORE_NAME];
	const hasFidStore = hasObjectStore(db, FID_REGISTRATION_OBJECT_STORE_NAME);
	if (hasFidStore) stores.push(FID_REGISTRATION_OBJECT_STORE_NAME);
	const tx = db.transaction(stores, "readwrite");
	await tx.objectStore(TOKEN_OBJECT_STORE_NAME).put(tokenDetails, key);
	if (hasFidStore) await tx.objectStore(FID_REGISTRATION_OBJECT_STORE_NAME).delete(key);
	await tx.done;
	return tokenDetails;
}
async function dbGetFidRegistration(firebaseDependencies) {
	const key = getKey(firebaseDependencies);
	const db = await getDbPromise();
	assertFidRegistrationObjectStore(db);
	return await db.transaction(FID_REGISTRATION_OBJECT_STORE_NAME).objectStore(FID_REGISTRATION_OBJECT_STORE_NAME).get(key);
}
async function dbSetFidRegistration(firebaseDependencies, details) {
	const key = getKey(firebaseDependencies);
	const db = await getDbPromise();
	assertFidRegistrationObjectStore(db);
	const tx = db.transaction([TOKEN_OBJECT_STORE_NAME, FID_REGISTRATION_OBJECT_STORE_NAME], "readwrite");
	await tx.objectStore(FID_REGISTRATION_OBJECT_STORE_NAME).put(details, key);
	await tx.objectStore(TOKEN_OBJECT_STORE_NAME).delete(key);
	await tx.done;
	return details;
}
function getKey({ appConfig }) {
	return appConfig.appId;
}
var name = "@firebase/messaging";
var version = "0.13.3";
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/** Max attempts (initial fetch + retries) when CreateRegistration `fetch()` throws. */
var FID_REGISTRATION_FETCH_MAX_ATTEMPTS = 3;
/** Base delay in ms; backoff is `BASE * 2^attempt` after each failed attempt. */
var FID_REGISTRATION_FETCH_BASE_BACKOFF_MS = 1e3;
async function requestGetToken(firebaseDependencies, subscriptionOptions) {
	const headers = await getHeaders(firebaseDependencies);
	const body = getBody(subscriptionOptions, firebaseDependencies.appConfig.appName, false);
	const subscribeOptions = {
		method: "POST",
		headers,
		body: JSON.stringify(body)
	};
	let responseData;
	try {
		responseData = await (await fetch(getEndpoint(firebaseDependencies.appConfig), subscribeOptions)).json();
	} catch (err) {
		throw ERROR_FACTORY.create("token-subscribe-failed", { errorInfo: err?.toString() });
	}
	if (responseData.error) {
		const message = responseData.error.message;
		throw ERROR_FACTORY.create("token-subscribe-failed", { errorInfo: message });
	}
	if (!responseData.token) throw ERROR_FACTORY.create("token-subscribe-no-token");
	return responseData.token;
}
async function requestCreateRegistration(firebaseDependencies, subscriptionOptions) {
	const headers = await getHeaders(firebaseDependencies);
	const body = getBody(subscriptionOptions, firebaseDependencies.appConfig.appName, true);
	const subscribeOptions = {
		method: "POST",
		headers,
		body: JSON.stringify(body)
	};
	let response;
	try {
		response = await fetchWithExponentialRetry(() => fetch(getEndpoint(firebaseDependencies.appConfig), subscribeOptions), FID_REGISTRATION_FETCH_MAX_ATTEMPTS, FID_REGISTRATION_FETCH_BASE_BACKOFF_MS);
	} catch (err) {
		throw ERROR_FACTORY.create("fid-registration-failed", { errorInfo: err?.toString() });
	}
	if (response.ok) return { responseFid: await parseCreateRegistrationSuccessFid(response) };
	let responseData;
	try {
		responseData = await response.json();
	} catch (err) {
		throw ERROR_FACTORY.create("fid-registration-failed", { errorInfo: response.statusText });
	}
	const message = responseData.error?.message ?? response.statusText;
	throw ERROR_FACTORY.create("fid-registration-failed", { errorInfo: message });
}
/**
* Parses a successful CreateRegistration body. The backend must return JSON with a non-empty
* string `name`: a resource name `projects/{projectId}/registrations/{fid}`
*/
async function parseCreateRegistrationSuccessFid(response) {
	const text = await response.text();
	if (!text.trim()) throw ERROR_FACTORY.create("fid-registration-failed", { errorInfo: "CreateRegistration succeeded but response body is empty" });
	let data;
	try {
		data = JSON.parse(text);
	} catch {
		throw ERROR_FACTORY.create("fid-registration-failed", { errorInfo: "CreateRegistration succeeded but response body is not valid JSON" });
	}
	const name = data.name;
	if (typeof name !== "string" || name.length === 0) throw ERROR_FACTORY.create("fid-registration-failed", { errorInfo: "CreateRegistration succeeded but response did not include a non-empty name" });
	return parseFidFromRegistrationResourceName(name);
}
var REGISTRATIONS_NAME_SEGMENT = "/registrations/";
/** Extracts the Firebase Installation ID from CreateRegistration `name` (resource path). */
function parseFidFromRegistrationResourceName(name) {
	const segmentIndex = name.indexOf(REGISTRATIONS_NAME_SEGMENT);
	if (segmentIndex !== -1) {
		const fid = name.slice(segmentIndex + 15);
		if (fid.length > 0) return fid;
	}
	throw ERROR_FACTORY.create("fid-registration-failed", { errorInfo: "CreateRegistration succeeded but response name is not a valid registration resource name" });
}
async function requestUpdateToken(firebaseDependencies, tokenDetails) {
	const headers = await getHeaders(firebaseDependencies);
	const body = getBody(tokenDetails.subscriptionOptions, firebaseDependencies.appConfig.appName, false);
	const updateOptions = {
		method: "PATCH",
		headers,
		body: JSON.stringify(body)
	};
	let responseData;
	try {
		responseData = await (await fetch(`${getEndpoint(firebaseDependencies.appConfig)}/${tokenDetails.token}`, updateOptions)).json();
	} catch (err) {
		throw ERROR_FACTORY.create("token-update-failed", { errorInfo: err?.toString() });
	}
	if (responseData.error) {
		const message = responseData.error.message;
		throw ERROR_FACTORY.create("token-update-failed", { errorInfo: message });
	}
	if (!responseData.token) throw ERROR_FACTORY.create("token-update-no-token");
	return responseData.token;
}
async function requestDeleteToken(firebaseDependencies, token) {
	const unsubscribeOptions = {
		method: "DELETE",
		headers: await getHeaders(firebaseDependencies)
	};
	try {
		const responseData = await (await fetch(`${getEndpoint(firebaseDependencies.appConfig)}/${token}`, unsubscribeOptions)).json();
		if (responseData.error) {
			const message = responseData.error.message;
			throw ERROR_FACTORY.create("token-unsubscribe-failed", { errorInfo: message });
		}
	} catch (err) {
		throw ERROR_FACTORY.create("token-unsubscribe-failed", { errorInfo: err?.toString() });
	}
}
/**
* Re-runs `operation` when it throws, with exponential backoff between attempts.
* Rethrows the last error if all attempts fail.
*/
async function fetchWithExponentialRetry(operation, maxAttempts, baseBackoffMs) {
	let lastError;
	for (let attempt = 0; attempt < maxAttempts; attempt++) try {
		return await operation();
	} catch (err) {
		lastError = err;
		if (attempt < maxAttempts - 1) {
			const delayMs = baseBackoffMs * Math.pow(2, attempt);
			await new Promise((resolve) => setTimeout(resolve, delayMs));
		}
	}
	throw lastError;
}
function getEndpoint({ projectId }) {
	return `${ENDPOINT}/projects/${projectId}/registrations`;
}
async function getHeaders({ appConfig, installations }) {
	const authToken = await installations.getToken();
	return new Headers({
		"Content-Type": "application/json",
		Accept: "application/json",
		"x-goog-api-key": appConfig.apiKey,
		"x-goog-firebase-installations-auth": `FIS ${authToken}`
	});
}
/**
* Hostname for the registering web client (e.g. `www.example.com`), or the app name
* (`appNameFallback`) when the scope cannot be resolved (e.g. some test environments).
*/
function getRegistrationOrigin(swScope, appNameFallback) {
	try {
		if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(swScope)) return new URL(swScope).host;
	} catch {}
	try {
		if (typeof self !== "undefined" && self.location?.href) return new URL(swScope, self.location.origin).host;
	} catch {}
	if (typeof self !== "undefined" && self.location?.host) return self.location.host;
	return appNameFallback;
}
function getBody({ p256dh, auth, endpoint, vapidKey, swScope }, appNameFallback, includeSdkVersion) {
	const body = { web: {
		origin: getRegistrationOrigin(swScope, appNameFallback),
		endpoint,
		auth,
		p256dh
	} };
	if (includeSdkVersion) body.fcm_sdk_version = version;
	if (vapidKey !== DEFAULT_VAPID_KEY) body.web.applicationPubKey = vapidKey;
	return body;
}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var TOKEN_EXPIRATION_MS = 6048e5;
async function getTokenInternal(messaging) {
	const pushSubscription = await getPushSubscription$1(messaging.swRegistration, messaging.vapidKey);
	const subscriptionOptions = {
		vapidKey: messaging.vapidKey,
		swScope: messaging.swRegistration.scope,
		endpoint: pushSubscription.endpoint,
		auth: arrayToBase64(pushSubscription.getKey("auth")),
		p256dh: arrayToBase64(pushSubscription.getKey("p256dh"))
	};
	const tokenDetails = await dbGet(messaging.firebaseDependencies);
	if (!tokenDetails) return getNewToken(messaging.firebaseDependencies, subscriptionOptions);
	else if (!isTokenValid(tokenDetails.subscriptionOptions, subscriptionOptions)) {
		try {
			await requestDeleteToken(messaging.firebaseDependencies, tokenDetails.token);
		} catch (e) {
			console.warn(e);
		}
		return getNewToken(messaging.firebaseDependencies, subscriptionOptions);
	} else if (Date.now() >= tokenDetails.createTime + TOKEN_EXPIRATION_MS) return updateToken(messaging, {
		token: tokenDetails.token,
		createTime: Date.now(),
		subscriptionOptions
	});
	else return tokenDetails.token;
}
async function updateToken(messaging, tokenDetails) {
	try {
		const updatedToken = await requestUpdateToken(messaging.firebaseDependencies, tokenDetails);
		const updatedTokenDetails = {
			...tokenDetails,
			token: updatedToken,
			createTime: Date.now()
		};
		await dbSet(messaging.firebaseDependencies, updatedTokenDetails);
		return updatedToken;
	} catch (e) {
		throw e;
	}
}
async function getNewToken(firebaseDependencies, subscriptionOptions) {
	const tokenDetails = {
		token: await requestGetToken(firebaseDependencies, subscriptionOptions),
		createTime: Date.now(),
		subscriptionOptions
	};
	await dbSet(firebaseDependencies, tokenDetails);
	return tokenDetails.token;
}
/**
* Gets a PushSubscription for the current user.
*/
async function getPushSubscription$1(swRegistration, vapidKey) {
	const subscription = await swRegistration.pushManager.getSubscription();
	if (subscription) return subscription;
	return swRegistration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: base64ToArray(vapidKey)
	});
}
/**
* Checks if the saved tokenDetails object matches the configuration provided.
*/
function isTokenValid(dbOptions, currentOptions) {
	const isVapidKeyEqual = currentOptions.vapidKey === dbOptions.vapidKey;
	const isEndpointEqual = currentOptions.endpoint === dbOptions.endpoint;
	const isAuthEqual = currentOptions.auth === dbOptions.auth;
	const isP256dhEqual = currentOptions.p256dh === dbOptions.p256dh;
	return isVapidKeyEqual && isEndpointEqual && isAuthEqual && isP256dhEqual;
}
function notifyOnRegistered(messaging, fid) {
	const handler = messaging.onRegisteredHandler;
	if (!handler) return;
	if (typeof handler === "function") handler(fid);
	else handler.next(fid);
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function registerDefaultSw(messaging) {
	try {
		messaging.swRegistration = await navigator.serviceWorker.register(DEFAULT_SW_PATH, { scope: DEFAULT_SW_SCOPE });
		messaging.swRegistration.update().catch(() => {});
		await waitForRegistrationActive(messaging.swRegistration);
	} catch (e) {
		throw ERROR_FACTORY.create("failed-service-worker-registration", { browserErrorMessage: e?.message });
	}
}
/**
* Waits for registration to become active. MDN documentation claims that
* a service worker registration should be ready to use after awaiting
* navigator.serviceWorker.register() but that doesn't seem to be the case in
* practice, causing the SDK to throw errors when calling
* swRegistration.pushManager.subscribe() too soon after register(). The only
* solution seems to be waiting for the service worker registration `state`
* to become "active".
*/
async function waitForRegistrationActive(registration) {
	return new Promise((resolve, reject) => {
		const rejectTimeout = setTimeout(() => reject(/* @__PURE__ */ new Error(`Service worker not registered after ${DEFAULT_REGISTRATION_TIMEOUT} ms`)), DEFAULT_REGISTRATION_TIMEOUT);
		const incomingSw = registration.installing || registration.waiting;
		if (registration.active) {
			clearTimeout(rejectTimeout);
			resolve();
		} else if (incomingSw) incomingSw.onstatechange = (ev) => {
			if (ev.target?.state === "activated") {
				incomingSw.onstatechange = null;
				clearTimeout(rejectTimeout);
				resolve();
			}
		};
		else {
			clearTimeout(rejectTimeout);
			reject(/* @__PURE__ */ new Error("No incoming service worker found."));
		}
	});
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function updateSwReg(messaging, swRegistration) {
	if (!swRegistration && !messaging.swRegistration) await registerDefaultSw(messaging);
	if (!swRegistration && !!messaging.swRegistration) return;
	if (!(swRegistration instanceof ServiceWorkerRegistration)) throw ERROR_FACTORY.create("invalid-sw-registration");
	messaging.swRegistration = swRegistration;
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function updateVapidKey(messaging, vapidKey) {
	if (!!vapidKey) messaging.vapidKey = vapidKey;
	else if (!messaging.vapidKey) messaging.vapidKey = DEFAULT_VAPID_KEY;
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/** Retries when CreateRegistration echoes an FID that does not match Installations.getId(). */
var FID_REGISTRATION_FID_MATCH_MAX_ATTEMPTS = 3;
/**
* For the new FID-based register path:
* - Create (or refresh) an FCM Web registration in the backend via CreateRegistration.
* - Use the FIS auth token produced by the installations instance (implicitly associated with FID).
* - CreateRegistration must echo the installation in `name` (e.g.
*   `projects/{projectId}/registrations/{fid}`); it must match `expectedFid` from
*   Installations.getId(). On mismatch we refresh the auth token and retry, then fail with
*   `fid-registration-failed`.
*/
async function registerFcmRegistrationWithFid(messaging, expectedFid) {
	const pushSubscription = await getPushSubscription(messaging.swRegistration, messaging.vapidKey);
	const subscriptionOptions = {
		vapidKey: messaging.vapidKey,
		swScope: messaging.swRegistration.scope,
		endpoint: pushSubscription.endpoint,
		auth: arrayToBase64(pushSubscription.getKey("auth")),
		p256dh: arrayToBase64(pushSubscription.getKey("p256dh"))
	};
	const installations = messaging.firebaseDependencies.installations;
	for (let attempt = 0; attempt < FID_REGISTRATION_FID_MATCH_MAX_ATTEMPTS; attempt++) {
		const { responseFid } = await requestCreateRegistration(messaging.firebaseDependencies, subscriptionOptions);
		if (responseFid === expectedFid) return;
		if (attempt < 2) await installations.getToken(true);
	}
	throw ERROR_FACTORY.create("fid-registration-failed", { errorInfo: "CreateRegistration response FID does not match Firebase Installation ID" });
}
async function getPushSubscription(swRegistration, vapidKey) {
	const subscription = await swRegistration.pushManager.getSubscription();
	if (subscription) return subscription;
	return swRegistration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: base64ToArray(vapidKey)
	});
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var FID_REGISTRATION_REFRESH_MS = 6048e5;
/**
* Registers the app instance with FCM using its Firebase Installation ID (FID). The FID is
* delivered via the `onRegistered` callback. Call this to establish an FID-based identity.
* Once `onRegistered` provides an FID, instruct your backend to remove any legacy token
* previously associated with this instance. The backend send API supports FID as a target.
*
* When called multiple times, `onRegistered` is invoked on each call with the current FID.
* Backend registration sync runs on first register, when the FID changes, or on weekly refresh.
*
* @param messaging - The MessagingService instance.
* @param options - Optional. Same options as getToken (vapidKey, serviceWorkerRegistration).
*/
async function register$1(messaging, options) {
	if (!navigator) throw ERROR_FACTORY.create("only-available-in-window");
	if (Notification.permission === "default") await Notification.requestPermission();
	if (Notification.permission !== "granted") throw ERROR_FACTORY.create("permission-blocked");
	if (!messaging.onRegisteredHandler) throw ERROR_FACTORY.create("invalid-on-registered-handler");
	await updateVapidKey(messaging, options?.vapidKey);
	await updateSwReg(messaging, options?.serviceWorkerRegistration);
	messaging._registerNotifyChain = messaging._registerNotifyChain.catch(() => {}).then(async () => {
		const fid = await messaging.firebaseDependencies.installations.getId();
		const stored = await dbGetFidRegistration(messaging.firebaseDependencies);
		const now = Date.now();
		if (!stored || stored.fid !== fid || now >= stored.lastRegisterTime + FID_REGISTRATION_REFRESH_MS) {
			await registerFcmRegistrationWithFid(messaging, fid);
			await dbSetFidRegistration(messaging.firebaseDependencies, {
				fid,
				lastRegisterTime: now,
				vapidKey: messaging.vapidKey
			});
		}
		if (!messaging.onRegisteredHandler) throw ERROR_FACTORY.create("invalid-on-registered-handler");
		notifyOnRegistered(messaging, fid);
	});
	return messaging._registerNotifyChain;
}
/**
* @license
* Copyright 2026 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* When the Firebase Installation ID changes, re-run `register()` so FCM registration and
* onRegistered run for the new FID. No-op if no onRegistered handler is set or the app
* instance was never registered with FCM.
*/
function subscribeFidChangeRegistration(messaging, installations) {
	return onIdChange(installations, () => {
		(async () => {
			if (!messaging.onRegisteredHandler) return;
			if (!await dbGetFidRegistration(messaging.firebaseDependencies)) return;
			await register$1(messaging).catch(() => {});
		})();
	});
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function externalizePayload(internalPayload) {
	const payload = {
		from: internalPayload.from,
		collapseKey: internalPayload.collapse_key,
		messageId: internalPayload.fcmMessageId
	};
	propagateNotificationPayload(payload, internalPayload);
	propagateDataPayload(payload, internalPayload);
	propagateFcmOptions(payload, internalPayload);
	return payload;
}
function propagateNotificationPayload(payload, messagePayloadInternal) {
	if (!messagePayloadInternal.notification) return;
	payload.notification = {};
	const title = messagePayloadInternal.notification.title;
	if (!!title) payload.notification.title = title;
	const body = messagePayloadInternal.notification.body;
	if (!!body) payload.notification.body = body;
	const image = messagePayloadInternal.notification.image;
	if (!!image) payload.notification.image = image;
	const icon = messagePayloadInternal.notification.icon;
	if (!!icon) payload.notification.icon = icon;
}
function propagateDataPayload(payload, messagePayloadInternal) {
	if (!messagePayloadInternal.data) return;
	payload.data = messagePayloadInternal.data;
}
function propagateFcmOptions(payload, messagePayloadInternal) {
	if (!messagePayloadInternal.fcmOptions && !messagePayloadInternal.notification?.click_action) return;
	payload.fcmOptions = {};
	const link = messagePayloadInternal.fcmOptions?.link ?? messagePayloadInternal.notification?.click_action;
	if (!!link) payload.fcmOptions.link = link;
	const analyticsLabel = messagePayloadInternal.fcmOptions?.analytics_label;
	if (!!analyticsLabel) payload.fcmOptions.analyticsLabel = analyticsLabel;
}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function isConsoleMessage(data) {
	return typeof data === "object" && !!data && CONSOLE_CAMPAIGN_ID in data;
}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function extractAppConfig(app) {
	if (!app || !app.options) throw getMissingValueError("App Configuration Object");
	if (!app.name) throw getMissingValueError("App Name");
	const configKeys = [
		"projectId",
		"apiKey",
		"appId",
		"messagingSenderId"
	];
	const { options } = app;
	for (const keyName of configKeys) if (!options[keyName]) throw getMissingValueError(keyName);
	return {
		appName: app.name,
		projectId: options.projectId,
		apiKey: options.apiKey,
		appId: options.appId,
		senderId: options.messagingSenderId
	};
}
function getMissingValueError(valueName) {
	return ERROR_FACTORY.create("missing-app-config-values", { valueName });
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var MessagingService = class {
	constructor(app, installations, analyticsProvider) {
		this.deliveryMetricsExportedToBigQueryEnabled = false;
		this.onBackgroundMessageHandler = null;
		this.onMessageHandler = null;
		/** Observer for the event that the app instance is registered with FCM via Firebase Installation ID (FID). */
		this.onRegisteredHandler = null;
		/** Observer for the event that the app instance is unregistered from FCM (FID no longer active). */
		this.onUnregisteredHandler = null;
		/**
		* Serializes the FID get + compare + notify step so concurrent register() calls
		* do not race each other.
		*/
		this._registerNotifyChain = Promise.resolve();
		/** Unsubscribe from Installations `onIdChange` when messaging is deleted. */
		this._fidChangeUnsubscribe = null;
		this.logEvents = [];
		/**
		* Single source of truth for the logging loop lifecycle.
		*
		* `scheduled` holds the active timer id; `flushing` indicates an async dispatch
		* is in progress (prevents duplicate starts); `stopped` means idle.
		*/
		this.logQueue = { state: "stopped" };
		const appConfig = extractAppConfig(app);
		this.firebaseDependencies = {
			app,
			appConfig,
			installations,
			analyticsProvider
		};
	}
	_delete() {
		if (this._fidChangeUnsubscribe) {
			this._fidChangeUnsubscribe();
			this._fidChangeUnsubscribe = null;
		}
		if (this.logQueue.state === "scheduled") clearTimeout(this.logQueue.timerId);
		this.logQueue = { state: "stopped" };
		return Promise.resolve();
	}
};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function getToken$1(messaging, options) {
	if (!navigator) throw ERROR_FACTORY.create("only-available-in-window");
	if (Notification.permission === "default") await Notification.requestPermission();
	if (Notification.permission !== "granted") throw ERROR_FACTORY.create("permission-blocked");
	await updateVapidKey(messaging, options?.vapidKey);
	await updateSwReg(messaging, options?.serviceWorkerRegistration);
	return getTokenInternal(messaging);
}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function logToScion(messaging, messageType, data) {
	const eventType = getEventType(messageType);
	(await messaging.firebaseDependencies.analyticsProvider.get()).logEvent(eventType, {
		message_id: data[CONSOLE_CAMPAIGN_ID],
		message_name: data[CONSOLE_CAMPAIGN_NAME],
		message_time: data[CONSOLE_CAMPAIGN_TIME],
		message_device_time: Math.floor(Date.now() / 1e3)
	});
}
function getEventType(messageType) {
	switch (messageType) {
		case MessageType.NOTIFICATION_CLICKED: return "notification_open";
		case MessageType.PUSH_RECEIVED: return "notification_foreground";
		default: throw new Error();
	}
}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function messageEventListener(messaging, event) {
	const internalPayload = event.data;
	if (!internalPayload.isFirebaseMessaging) return;
	if (messaging.onMessageHandler && internalPayload.messageType === MessageType.PUSH_RECEIVED) {
		if (typeof messaging.onMessageHandler === "function") messaging.onMessageHandler(externalizePayload(internalPayload));
		else messaging.onMessageHandler.next(externalizePayload(internalPayload));
	}
	if (messaging.onRegisteredHandler && internalPayload.messageType === MessageType.FID_REGISTERED) {
		const fid = internalPayload.fid;
		if (typeof messaging.onRegisteredHandler === "function") messaging.onRegisteredHandler(fid);
		else messaging.onRegisteredHandler.next(fid);
	}
	const dataPayload = internalPayload.data;
	if (isConsoleMessage(dataPayload) && dataPayload[CONSOLE_CAMPAIGN_ANALYTICS_ENABLED] === "1") await logToScion(messaging, internalPayload.messageType, dataPayload);
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var WindowMessagingFactory = (container) => {
	const messaging = new MessagingService(container.getProvider("app").getImmediate(), container.getProvider("installations-internal").getImmediate(), container.getProvider("analytics-internal"));
	navigator.serviceWorker.addEventListener("message", (e) => messageEventListener(messaging, e));
	messaging._fidChangeUnsubscribe = subscribeFidChangeRegistration(messaging, container.getProvider("installations").getImmediate());
	return messaging;
};
var WindowMessagingInternalFactory = (container) => {
	const messaging = container.getProvider("messaging").getImmediate();
	return {
		getToken: (options) => getToken$1(messaging, options),
		register: (options) => register$1(messaging, options)
	};
};
function registerMessagingInWindow() {
	_registerComponent(new Component("messaging", WindowMessagingFactory, "PUBLIC"));
	_registerComponent(new Component("messaging-internal", WindowMessagingInternalFactory, "PRIVATE"));
	registerVersion(name, version);
	registerVersion(name, version, "esm2020");
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Checks if all required APIs exist in the browser.
* @returns a Promise that resolves to a boolean.
*
* @public
*/
async function isWindowSupported() {
	try {
		await validateIndexedDBOpenable();
	} catch (e) {
		return false;
	}
	return typeof window !== "undefined" && isIndexedDBAvailable() && areCookiesEnabled() && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window && "fetch" in window && ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification") && PushSubscription.prototype.hasOwnProperty("getKey");
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function onMessage$1(messaging, nextOrObserver) {
	if (!navigator) throw ERROR_FACTORY.create("only-available-in-window");
	messaging.onMessageHandler = nextOrObserver;
	return () => {
		messaging.onMessageHandler = null;
	};
}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2026 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2026 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* Retrieves a Firebase Cloud Messaging instance.
*
* @returns The Firebase Cloud Messaging instance associated with the provided firebase app.
*
* @public
*/
function getMessagingInWindow(app = getApp()) {
	isWindowSupported().then((isSupported) => {
		if (!isSupported) throw ERROR_FACTORY.create("unsupported-browser");
	}, (_) => {
		throw ERROR_FACTORY.create("indexed-db-unsupported");
	});
	return _getProvider(getModularInstance(app), "messaging").getImmediate();
}
/**
* Subscribes the {@link Messaging} instance to push notifications. Returns a Firebase Cloud
* Messaging registration token that can be used to send push messages to that {@link Messaging}
* instance.
*
* If notification permission isn't already granted, this method asks the user for permission. The
* returned promise rejects if the user does not allow the app to show notifications.
*
* @param messaging - The {@link Messaging} instance.
* @param options - Provides an optional vapid key and an optional service worker registration.
*
* @returns The promise resolves with an FCM registration token.
*
* @deprecated Use {@link register} together with {@link onRegistered} for Firebase
* Installation ID-based messaging instead of retrieving an FCM registration token with this API.
*
* @public
*/
async function getToken(messaging, options) {
	messaging = getModularInstance(messaging);
	return getToken$1(messaging, options);
}
/**
* When a push message is received and the user is currently on a page for your origin, the
* message is passed to the page and an `onMessage()` event is dispatched with the payload of
* the push message.
*
*
* @param messaging - The {@link Messaging} instance.
* @param nextOrObserver - This function, or observer object with `next` defined,
*     is called when a message is received and the user is currently viewing your page.
* @returns To stop listening for messages execute this returned function.
*
* @public
*/
function onMessage(messaging, nextOrObserver) {
	messaging = getModularInstance(messaging);
	return onMessage$1(messaging, nextOrObserver);
}
/**
* The Firebase Cloud Messaging Web SDK.
* This SDK does not work in a Node.js environment.
*
* @packageDocumentation
*/
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
registerMessagingInWindow();
//#endregion
export { onMessage as i, getToken as n, isWindowSupported as r, getMessagingInWindow as t };
