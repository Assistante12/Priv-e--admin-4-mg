import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  type Firestore,
} from "firebase/firestore";
import { db } from "./config";

type FilterOp =
  | "eq"
  | "neq"
  | "in"
  | "is"
  | "gte"
  | "lte"
  | "gt"
  | "lt"
  | "contains"
  | "not"
  | "like"
  | "ilike"
  | "overlaps";

interface Filter {
  field: string;
  op: FilterOp;
  value: any;
  subOp?: string;
}

interface OrderSpec {
  field: string;
  ascending: boolean;
}

export class FirestoreQueryBuilder {
  private collectionName: string;
  private filters: Filter[] = [];
  private orderSpecs: OrderSpec[] = [];
  private limitCount?: number;
  private offsetCount?: number;
  private mutationType?: "insert" | "upsert" | "update" | "delete";
  private mutationPayload?: any;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  select(_fields?: string) {
    return this;
  }

  eq(field: string, value: any) {
    this.filters.push({ field, op: "eq", value });
    return this;
  }

  neq(field: string, value: any) {
    this.filters.push({ field, op: "neq", value });
    return this;
  }

  not(field: string, op: string, value: any) {
    this.filters.push({ field, op: "not", subOp: op, value });
    return this;
  }

  in(field: string, value: any[]) {
    this.filters.push({ field, op: "in", value });
    return this;
  }

  is(field: string, value: any) {
    this.filters.push({ field, op: "is", value });
    return this;
  }

  like(field: string, pattern: string) {
    this.filters.push({ field, op: "like", value: pattern });
    return this;
  }

  ilike(field: string, pattern: string) {
    this.filters.push({ field, op: "ilike", value: pattern });
    return this;
  }

  gte(field: string, value: any) {
    this.filters.push({ field, op: "gte", value });
    return this;
  }

  lte(field: string, value: any) {
    this.filters.push({ field, op: "lte", value });
    return this;
  }

  gt(field: string, value: any) {
    this.filters.push({ field, op: "gt", value });
    return this;
  }

  lt(field: string, value: any) {
    this.filters.push({ field, op: "lt", value });
    return this;
  }

  contains(field: string, value: any) {
    this.filters.push({ field, op: "contains", value });
    return this;
  }

  overlaps(field: string, values: any[]) {
    this.filters.push({ field, op: "overlaps", value: values });
    return this;
  }

  match(query: Record<string, any>) {
    for (const [field, value] of Object.entries(query)) {
      this.filters.push({ field, op: "eq", value });
    }
    return this;
  }

  filter(field: string, op: string, value: any) {
    if (op === "not") {
      this.filters.push({ field, op: "not", subOp: "eq", value });
    } else {
      this.filters.push({ field, op: op as FilterOp, value });
    }
    return this;
  }

  or(_filterString: string) {
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderSpecs.push({
      field,
      ascending: options?.ascending !== false,
    });
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  range(from: number, to: number) {
    this.offsetCount = from;
    this.limitCount = to - from + 1;
    return this;
  }

  insert(payload: any, _options?: any) {
    this.mutationType = "insert";
    this.mutationPayload = payload;
    return this;
  }

  upsert(payload: any, _options?: any) {
    this.mutationType = "upsert";
    this.mutationPayload = payload;
    return this;
  }

  update(payload: any) {
    this.mutationType = "update";
    this.mutationPayload = payload;
    return this;
  }

  delete() {
    this.mutationType = "delete";
    return this;
  }

  private getFirestoreInstance(): Firestore {
    return db;
  }

  private matchesFilters(item: any): boolean {
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
            if (itemVal !== null && itemVal !== undefined) return false;
          } else if (itemVal !== f.value) {
            return false;
          }
          break;
        case "not": {
          const subOp = f.subOp || "eq";
          if (subOp === "is" || subOp === "eq") {
            if (f.value === null) {
              if (itemVal === null || itemVal === undefined) return false;
            } else if (itemVal === f.value) {
              return false;
            }
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
        case "like": {
          if (typeof itemVal !== "string") return false;
          const reg = new RegExp("^" + String(f.value).replace(/%/g, ".*") + "$");
          if (!reg.test(itemVal)) return false;
          break;
        }
        case "ilike": {
          if (typeof itemVal !== "string") return false;
          const reg = new RegExp("^" + String(f.value).replace(/%/g, ".*") + "$", "i");
          if (!reg.test(itemVal)) return false;
          break;
        }
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
          } else {
            return false;
          }
          break;
        case "overlaps":
          if (Array.isArray(itemVal) && Array.isArray(f.value)) {
            if (!f.value.some((v: any) => itemVal.includes(v))) return false;
          }
          break;
      }
    }
    return true;
  }

  async execute(): Promise<{ data: any; error: any }> {
    try {
      const firestore = this.getFirestoreInstance();

      if (this.mutationType === "insert" || this.mutationType === "upsert") {
        const items = Array.isArray(this.mutationPayload)
          ? this.mutationPayload
          : [this.mutationPayload];

        const results: any[] = [];
        for (const item of items) {
          const id = item.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15));
          const docData = { ...item, id };
          if (!docData.created_at) docData.created_at = new Date().toISOString();
          docData.updated_at = new Date().toISOString();

          const docRef = doc(firestore, this.collectionName, id);
          await setDoc(docRef, docData, { merge: this.mutationType === "upsert" });
          results.push(docData);
        }

        const outData = Array.isArray(this.mutationPayload) ? results : results[0];
        return { data: outData, error: null };
      }

      if (this.mutationType === "update") {
        // Find matching docs to update
        const selectRes = await new FirestoreQueryBuilder(this.collectionName)
          .applyFilters(this.filters)
          .execute();

        const docs = selectRes.data || [];
        for (const item of docs) {
          const docId = item.id;
          if (!docId) continue;
          const updateData = { ...this.mutationPayload, updated_at: new Date().toISOString() };
          const docRef = doc(firestore, this.collectionName, docId);
          await updateDoc(docRef, updateData);
        }
        return { data: docs, error: null };
      }

      if (this.mutationType === "delete") {
        const selectRes = await new FirestoreQueryBuilder(this.collectionName)
          .applyFilters(this.filters)
          .execute();

        const docs = selectRes.data || [];
        for (const item of docs) {
          const docId = item.id;
          if (!docId) continue;
          const docRef = doc(firestore, this.collectionName, docId);
          await deleteDoc(docRef);
        }
        return { data: docs, error: null };
      }

      // Read / Query
      const collRef = collection(firestore, this.collectionName);
      const snap = await getDocs(collRef);
      const allDocs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Filter in-memory for complete flexibility and composite querying
      let filtered = allDocs.filter((item) => this.matchesFilters(item));

      // Ordering
      if (this.orderSpecs.length > 0) {
        filtered.sort((a, b) => {
          for (const spec of this.orderSpecs) {
            const valA = a[spec.field];
            const valB = b[spec.field];
            if (valA === valB) continue;
            if (valA === undefined || valA === null) return spec.ascending ? 1 : -1;
            if (valB === undefined || valB === null) return spec.ascending ? -1 : 1;
            if (valA < valB) return spec.ascending ? -1 : 1;
            if (valA > valB) return spec.ascending ? 1 : -1;
          }
          return 0;
        });
      }

      // Offset / Range
      if (this.offsetCount && this.offsetCount > 0) {
        filtered = filtered.slice(this.offsetCount);
      }

      // Limit
      if (typeof this.limitCount === "number") {
        filtered = filtered.slice(0, this.limitCount);
      }

      return { data: filtered, error: null };
    } catch (err: any) {
      console.error(`[FirestoreQueryBuilder ${this.collectionName}] error:`, err);
      return { data: null, error: err };
    }
  }

  applyFilters(filters: Filter[]) {
    this.filters = [...filters];
    return this;
  }

  async single(): Promise<{ data: any; error: any }> {
    this.limitCount = 1;
    const res = await this.execute();
    if (res.error) return res;
    const items = res.data ?? [];
    if (items.length === 0) {
      return { data: null, error: { message: "Row not found", code: "PGRST116" } };
    }
    return { data: items[0], error: null };
  }

  async maybeSingle(): Promise<{ data: any; error: any }> {
    this.limitCount = 1;
    const res = await this.execute();
    if (res.error) return res;
    const items = res.data ?? [];
    return { data: items[0] ?? null, error: null };
  }

  // Support direct await on query builder
  then(onfulfilled?: (value: { data: any; error: any }) => any, onrejected?: (reason: any) => any) {
    return this.execute().then(onfulfilled, onrejected);
  }
}

export function createFirestoreClient() {
  return {
    from(collectionName: string) {
      return new FirestoreQueryBuilder(collectionName);
    },
  };
}

export const firestoreClient = createFirestoreClient();
