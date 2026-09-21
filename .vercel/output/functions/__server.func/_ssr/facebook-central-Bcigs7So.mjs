import { r as createServerFn } from "./server-PdCEgQXm.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BNEF6n4w.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BxRoGsb6.mjs";
import { a as objectType, o as stringType } from "../_libs/zod.mjs";
import { i as useQuery, o as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { y as RefreshCw } from "../_libs/lucide-react.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CWKLgPMR.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/facebook-central-Bcigs7So.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
/** Pejy rehetra avy amin'ny connexion Facebook foibe + ny workspace nanokanana azy. */
var listCentralPages = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("95246831230c95276ad5d4ee921579cda1a13417f2a194a5623544593101248d"));
/** Manokana pejy ho an'ny workspace iray (izy ihany no handray ny hafatra sy ny IA-ny). */
var assignPageToWorkspace = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	page_id: stringType().min(1),
	workspace_id: stringType().uuid()
}).parse(d)).handler(createSsrRpc("26006c151a1575627edfc051a8c4b48cc6bd0cf2987762f27a8b1bd6e3e135fe"));
/** Manala ny fanokanana: tsy voatantan'ny workspace intsony ilay pejy. */
var unassignPage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ page_id: stringType().min(1) }).parse(d)).handler(createSsrRpc("e6337cca79f25f5c42e4e59721fa6ecdcd59b09572eb1c98391c8bea6445e149"));
/** Mamerina maka ny lisitry ny pejy avy amin'ny token foibe efa voatahiry. */
var refreshCentralPages = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({}).parse(d ?? {})).handler(createSsrRpc("9c65ac5b7e6229cbdf1347b00d03d472fd8c79453f8b7d2b617bfed516627065"));
var _jsxFileName = "/app/applet/src/routes/_authenticated/facebook-central.tsx?tsr-split=component";
function FacebookCentralPage() {
	const queryClient = useQueryClient();
	const list = useServerFn(listCentralPages);
	const doAssign = useServerFn(assignPageToWorkspace);
	const doUnassign = useServerFn(unassignPage);
	const doRefresh = useServerFn(refreshCentralPages);
	const { data, isLoading } = useQuery({
		queryKey: ["facebook-central"],
		queryFn: () => list({})
	});
	const run = (fn, ok) => fn().then(() => {
		toast.success(ok);
		return queryClient.invalidateQueries();
	}).catch((e) => toast.error(e?.message ?? "Nisy olana"));
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex flex-wrap items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
				className: "text-2xl font-semibold",
				children: "Pages Facebook centrales"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 28,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-muted-foreground",
				children: "Connexion Facebook iray ihany no ilaina. Zarao isaky ny workspace ny pejy: ny hafatra tonga dia mankany amin'ny workspace tompon'ilay pejy sy ny IA-ny."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 29,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 27,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				variant: "outline",
				onClick: () => run(() => doRefresh({ data: {} }), "Lisitra nohavaozina"),
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RefreshCw, { className: "h-4 w-4 mr-1" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 37,
					columnNumber: 11
				}, this), " Havaozina"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 34,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 26,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
			className: "text-base",
			children: [
				"Pejy (",
				data?.pages.length ?? 0,
				")"
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 43,
			columnNumber: 11
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 42,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
			className: "space-y-2",
			children: [
				isLoading && /* @__PURE__ */ (void 0)("p", {
					className: "text-sm text-muted-foreground",
					children: "Eo am-pakàna…"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 46,
					columnNumber: 25
				}, this),
				(data?.pages ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center gap-3 rounded-lg border border-border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex-1 min-w-40",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "font-medium",
							children: p.page_name
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 49,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-xs text-muted-foreground",
							children: p.assigned_workspace_name ? `Workspace: ${p.assigned_workspace_name}` : "Mbola tsy voatokana"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 50,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 48,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
						className: "h-9 rounded-md border border-input bg-background px-2 text-sm",
						value: p.assigned_workspace_id ?? "",
						onChange: (e) => {
							const id = e.target.value;
							if (!id) run(() => doUnassign({ data: { page_id: p.page_id } }), "Nesorina");
							else run(() => doAssign({ data: {
								page_id: p.page_id,
								workspace_id: id
							} }), "Voatokana");
						},
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
							value: "",
							children: "— Tsy voatokana —"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 71,
							columnNumber: 17
						}, this), (data?.workspaces ?? []).map((w) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
							value: w.id,
							children: w.name
						}, w.id, false, {
							fileName: _jsxFileName,
							lineNumber: 72,
							columnNumber: 52
						}, this))]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 54,
						columnNumber: 15
					}, this)]
				}, p.id, true, {
					fileName: _jsxFileName,
					lineNumber: 47,
					columnNumber: 41
				}, this)),
				data && data.pages.length === 0 && /* @__PURE__ */ (void 0)("p", {
					className: "text-sm text-muted-foreground",
					children: "Mbola tsy misy pejy. Tsindrio \"Connecter avec Facebook\" ao amin'ny pejy Facebook."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 77,
					columnNumber: 47
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 45,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 41,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 25,
		columnNumber: 10
	}, this);
}
//#endregion
export { FacebookCentralPage as component };
