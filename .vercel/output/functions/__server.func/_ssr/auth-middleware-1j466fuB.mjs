import { n as createMiddleware, o as getRequest } from "./server-DBaxFLiq.mjs";
import { a as collection, i as updateDoc, n as getDocs, o as doc, r as setDoc, t as deleteDoc } from "../_libs/@firebase/firestore+[...].mjs";
import "../_libs/firebase.mjs";
import { n as db, r as getAdminAuth } from "./config-CbtXGA-s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-middleware-1j466fuB.js
var FirestoreQueryBuilder = class FirestoreQueryBuilder {
	collectionName;
	filters = [];
	orderSpecs = [];
	limitCount;
	offsetCount;
	mutationType;
	mutationPayload;
	constructor(collectionName) {
		this.collectionName = collectionName;
	}
	select(_fields) {
		return this;
	}
	eq(field, value) {
		this.filters.push({
			field,
			op: "eq",
			value
		});
		return this;
	}
	neq(field, value) {
		this.filters.push({
			field,
			op: "neq",
			value
		});
		return this;
	}
	not(field, op, value) {
		this.filters.push({
			field,
			op: "not",
			subOp: op,
			value
		});
		return this;
	}
	in(field, value) {
		this.filters.push({
			field,
			op: "in",
			value
		});
		return this;
	}
	is(field, value) {
		this.filters.push({
			field,
			op: "is",
			value
		});
		return this;
	}
	like(field, pattern) {
		this.filters.push({
			field,
			op: "like",
			value: pattern
		});
		return this;
	}
	ilike(field, pattern) {
		this.filters.push({
			field,
			op: "ilike",
			value: pattern
		});
		return this;
	}
	gte(field, value) {
		this.filters.push({
			field,
			op: "gte",
			value
		});
		return this;
	}
	lte(field, value) {
		this.filters.push({
			field,
			op: "lte",
			value
		});
		return this;
	}
	gt(field, value) {
		this.filters.push({
			field,
			op: "gt",
			value
		});
		return this;
	}
	lt(field, value) {
		this.filters.push({
			field,
			op: "lt",
			value
		});
		return this;
	}
	contains(field, value) {
		this.filters.push({
			field,
			op: "contains",
			value
		});
		return this;
	}
	overlaps(field, values) {
		this.filters.push({
			field,
			op: "overlaps",
			value: values
		});
		return this;
	}
	match(query) {
		for (const [field, value] of Object.entries(query)) this.filters.push({
			field,
			op: "eq",
			value
		});
		return this;
	}
	filter(field, op, value) {
		if (op === "not") this.filters.push({
			field,
			op: "not",
			subOp: "eq",
			value
		});
		else this.filters.push({
			field,
			op,
			value
		});
		return this;
	}
	or(_filterString) {
		return this;
	}
	order(field, options) {
		this.orderSpecs.push({
			field,
			ascending: options?.ascending !== false
		});
		return this;
	}
	limit(count) {
		this.limitCount = count;
		return this;
	}
	range(from, to) {
		this.offsetCount = from;
		this.limitCount = to - from + 1;
		return this;
	}
	insert(payload, _options) {
		this.mutationType = "insert";
		this.mutationPayload = payload;
		return this;
	}
	upsert(payload, _options) {
		this.mutationType = "upsert";
		this.mutationPayload = payload;
		return this;
	}
	update(payload) {
		this.mutationType = "update";
		this.mutationPayload = payload;
		return this;
	}
	delete() {
		this.mutationType = "delete";
		return this;
	}
	getFirestoreInstance() {
		return db;
	}
	matchesFilters(item) {
		for (const f of this.filters) {
			const itemVal = item[f.field];
			switch (f.op) {
				case "eq":
					if (itemVal !== f.value) return false;
					break;
				case "neq":
					if (itemVal === f.value) return false;
					break;
				case "in":
					if (!Array.isArray(f.value) || !f.value.includes(itemVal)) return false;
					break;
				case "is":
					if (f.value === null) {
						if (itemVal !== null && itemVal !== void 0) return false;
					} else if (itemVal !== f.value) return false;
					break;
				case "not": {
					const subOp = f.subOp || "eq";
					if (subOp === "is" || subOp === "eq") {
						if (f.value === null) {
							if (itemVal === null || itemVal === void 0) return false;
						} else if (itemVal === f.value) return false;
					} else if (subOp === "neq") {
						if (itemVal !== f.value) return false;
					} else if (subOp === "in") {
						if (Array.isArray(f.value) && f.value.includes(itemVal)) return false;
					} else if (subOp === "gte") {
						if (itemVal >= f.value) return false;
					} else if (subOp === "lte") {
						if (itemVal <= f.value) return false;
					} else if (subOp === "gt") {
						if (itemVal > f.value) return false;
					} else if (subOp === "lt") {
						if (itemVal < f.value) return false;
					}
					break;
				}
				case "like":
					if (typeof itemVal !== "string") return false;
					if (!new RegExp("^" + String(f.value).replace(/%/g, ".*") + "$").test(itemVal)) return false;
					break;
				case "ilike":
					if (typeof itemVal !== "string") return false;
					if (!new RegExp("^" + String(f.value).replace(/%/g, ".*") + "$", "i").test(itemVal)) return false;
					break;
				case "gte":
					if (itemVal < f.value) return false;
					break;
				case "lte":
					if (itemVal > f.value) return false;
					break;
				case "gt":
					if (itemVal <= f.value) return false;
					break;
				case "lt":
					if (itemVal >= f.value) return false;
					break;
				case "contains":
					if (Array.isArray(itemVal)) {
						if (!itemVal.includes(f.value)) return false;
					} else if (typeof itemVal === "string") {
						if (!itemVal.includes(f.value)) return false;
					} else return false;
					break;
				case "overlaps": if (Array.isArray(itemVal) && Array.isArray(f.value)) {
					if (!f.value.some((v) => itemVal.includes(v))) return false;
				}
			}
		}
		return true;
	}
	async execute() {
		try {
			const firestore = this.getFirestoreInstance();
			if (this.mutationType === "insert" || this.mutationType === "upsert") {
				const items = Array.isArray(this.mutationPayload) ? this.mutationPayload : [this.mutationPayload];
				const results = [];
				for (const item of items) {
					const id = item.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15));
					const docData = {
						...item,
						id
					};
					if (!docData.created_at) docData.created_at = (/* @__PURE__ */ new Date()).toISOString();
					docData.updated_at = (/* @__PURE__ */ new Date()).toISOString();
					const docRef = doc(firestore, this.collectionName, id);
					await setDoc(docRef, docData, { merge: this.mutationType === "upsert" });
					results.push(docData);
				}
				return {
					data: Array.isArray(this.mutationPayload) ? results : results[0],
					error: null
				};
			}
			if (this.mutationType === "update") {
				const docs = (await new FirestoreQueryBuilder(this.collectionName).applyFilters(this.filters).execute()).data || [];
				for (const item of docs) {
					const docId = item.id;
					if (!docId) continue;
					const updateData = {
						...this.mutationPayload,
						updated_at: (/* @__PURE__ */ new Date()).toISOString()
					};
					const docRef = doc(firestore, this.collectionName, docId);
					await updateDoc(docRef, updateData);
				}
				return {
					data: docs,
					error: null
				};
			}
			if (this.mutationType === "delete") {
				const docs = (await new FirestoreQueryBuilder(this.collectionName).applyFilters(this.filters).execute()).data || [];
				for (const item of docs) {
					const docId = item.id;
					if (!docId) continue;
					const docRef = doc(firestore, this.collectionName, docId);
					await deleteDoc(docRef);
				}
				return {
					data: docs,
					error: null
				};
			}
			const collRef = collection(firestore, this.collectionName);
			let filtered = (await getDocs(collRef)).docs.map((d) => ({
				id: d.id,
				...d.data()
			})).filter((item) => this.matchesFilters(item));
			if (this.orderSpecs.length > 0) filtered.sort((a, b) => {
				for (const spec of this.orderSpecs) {
					const valA = a[spec.field];
					const valB = b[spec.field];
					if (valA === valB) continue;
					if (valA === void 0 || valA === null) return spec.ascending ? 1 : -1;
					if (valB === void 0 || valB === null) return spec.ascending ? -1 : 1;
					if (valA < valB) return spec.ascending ? -1 : 1;
					if (valA > valB) return spec.ascending ? 1 : -1;
				}
				return 0;
			});
			if (this.offsetCount && this.offsetCount > 0) filtered = filtered.slice(this.offsetCount);
			if (typeof this.limitCount === "number") filtered = filtered.slice(0, this.limitCount);
			return {
				data: filtered,
				error: null
			};
		} catch (err) {
			console.error(`[FirestoreQueryBuilder ${this.collectionName}] error:`, err);
			return {
				data: null,
				error: err
			};
		}
	}
	applyFilters(filters) {
		this.filters = [...filters];
		return this;
	}
	async single() {
		this.limitCount = 1;
		const res = await this.execute();
		if (res.error) return res;
		const items = res.data ?? [];
		if (items.length === 0) return {
			data: null,
			error: {
				message: "Row not found",
				code: "PGRST116"
			}
		};
		return {
			data: items[0],
			error: null
		};
	}
	async maybeSingle() {
		this.limitCount = 1;
		const res = await this.execute();
		if (res.error) return res;
		return {
			data: (res.data ?? [])[0] ?? null,
			error: null
		};
	}
	then(onfulfilled, onrejected) {
		return this.execute().then(onfulfilled, onrejected);
	}
};
function createFirestoreClient() {
	return { from(collectionName) {
		return new FirestoreQueryBuilder(collectionName);
	} };
}
var firestoreClient = createFirestoreClient();
var requireFirebaseAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
	const request = getRequest();
	let userId = "default_user";
	let claims = {};
	if (request?.headers) {
		const authHeader = request.headers.get("authorization");
		if (authHeader && authHeader.startsWith("Bearer ")) {
			const token = authHeader.replace("Bearer ", "").trim();
			if (token) try {
				const adminAuth = await getAdminAuth();
				if (adminAuth) {
					const decoded = await adminAuth.verifyIdToken(token);
					userId = decoded.uid;
					claims = decoded;
				} else {
					const parts = token.split(".");
					if (parts.length === 3) {
						const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
						userId = payload.user_id || payload.sub || "default_user";
						claims = payload;
					}
				}
			} catch (e) {
				try {
					const parts = token.split(".");
					if (parts.length === 3) {
						const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
						userId = payload.user_id || payload.sub || "default_user";
						claims = payload;
					}
				} catch {
					console.warn("[requireFirebaseAuth] Invalid token format:", e);
				}
			}
		}
	}
	return next({ context: {
		supabase: firestoreClient,
		userId,
		claims
	} });
});
//#endregion
export { requireFirebaseAuth as n, firestoreClient as t };
