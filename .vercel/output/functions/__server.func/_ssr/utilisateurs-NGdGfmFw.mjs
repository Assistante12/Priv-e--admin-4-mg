import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { r as createServerFn } from "./server-PdCEgQXm.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BNEF6n4w.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BxRoGsb6.mjs";
import { i as useQuery, o as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { V as Facebook, i as Users, o as UserCheck, y as RefreshCw } from "../_libs/lucide-react.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CWKLgPMR.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Badge } from "./badge-Di9TvE8n.mjs";
import { t as supabase } from "./client-BUDkwau_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utilisateurs-NGdGfmFw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var getAdminUsersOverview = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("52e8f902c3ab8fa862e987e3d3a360c9ae5dcdd4c2e2b2bba2ce1c12f955e7dc"));
var _jsxFileName = "/app/applet/src/routes/_authenticated/utilisateurs.tsx?tsr-split=component";
function fmtDate(d) {
	if (!d) return "—";
	try {
		return new Date(d).toLocaleDateString("fr-FR", {
			day: "2-digit",
			month: "short",
			year: "numeric"
		});
	} catch {
		return d;
	}
}
function UtilisateursPage() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["admin-users-overview"],
		queryFn: () => getAdminUsersOverview(),
		staleTime: 0,
		refetchInterval: 1e4,
		refetchOnWindowFocus: true
	});
	const data = q.data;
	(0, import_react.useEffect)(() => {
		const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-users-overview"] });
		const channel = supabase.channel("admin-users-overview").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "profiles"
		}, invalidate).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "facebook_pages"
		}, invalidate).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [qc]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center justify-between gap-3 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-2xl font-bold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "h-6 w-6 text-primary" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 52,
						columnNumber: 13
					}, this), " Utilisateurs"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 51,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-muted-foreground text-sm",
					children: "Liste des utilisateurs inscrits et des pages Facebook connectées."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 54,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 50,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => q.refetch(),
					disabled: q.isFetching,
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RefreshCw, { className: `h-4 w-4 mr-2 ${q.isFetching ? "animate-spin" : ""}` }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 59,
						columnNumber: 11
					}, this), "Actualiser"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 58,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 49,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
						className: "pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Utilisateurs inscrits" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 67,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
							className: "text-3xl",
							children: data?.totalUsers ?? "—"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 68,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 66,
						columnNumber: 11
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 65,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
						className: "pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Utilisateurs avec page" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 73,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
							className: "text-3xl",
							children: data?.usersWithPages.length ?? "—"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 74,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 72,
						columnNumber: 11
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 71,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
						className: "pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Pages connectées" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 79,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
							className: "text-3xl",
							children: data?.totalPages ?? "—"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 80,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 78,
						columnNumber: 11
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 77,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 64,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 88,
					columnNumber: 13
				}, this), " Tous les utilisateurs inscrits"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 87,
				columnNumber: 11
			}, this) }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 86,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
						className: "border-b text-left text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
								className: "py-2 pr-4 font-medium",
								children: "Nom"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 95,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
								className: "py-2 pr-4 font-medium",
								children: "Email"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 96,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
								className: "py-2 font-medium",
								children: "Inscrit le"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 97,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 94,
						columnNumber: 15
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 93,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { children: [(data?.users ?? []).map((u) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
						className: "border-b last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "py-2 pr-4",
								children: u.display_name || "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 102,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "py-2 pr-4",
								children: u.email || "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 103,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "py-2",
								children: fmtDate(u.created_at)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 104,
								columnNumber: 19
							}, this)
						]
					}, u.id, true, {
						fileName: _jsxFileName,
						lineNumber: 101,
						columnNumber: 45
					}, this)), data && data.users.length === 0 && /* @__PURE__ */ (void 0)("tr", { children: /* @__PURE__ */ (void 0)("td", {
						colSpan: 3,
						className: "py-4 text-center text-muted-foreground",
						children: "Aucun utilisateur."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 107,
						columnNumber: 19
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 106,
						columnNumber: 51
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 100,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 92,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 91,
				columnNumber: 9
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 85,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UserCheck, { className: "h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 119,
					columnNumber: 13
				}, this), " Utilisateurs ayant connecté une page"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 118,
				columnNumber: 11
			}, this) }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 117,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
						className: "border-b text-left text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
								className: "py-2 pr-4 font-medium",
								children: "Nom"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 126,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
								className: "py-2 pr-4 font-medium",
								children: "Email"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 127,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
								className: "py-2 font-medium",
								children: "Inscrit le"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 128,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 125,
						columnNumber: 15
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 124,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { children: [(data?.usersWithPages ?? []).map((u) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
						className: "border-b last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "py-2 pr-4",
								children: u.display_name || "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 133,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "py-2 pr-4",
								children: u.email || "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 134,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "py-2",
								children: fmtDate(u.created_at)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 135,
								columnNumber: 19
							}, this)
						]
					}, u.id, true, {
						fileName: _jsxFileName,
						lineNumber: 132,
						columnNumber: 54
					}, this)), data && data.usersWithPages.length === 0 && /* @__PURE__ */ (void 0)("tr", { children: /* @__PURE__ */ (void 0)("td", {
						colSpan: 3,
						className: "py-4 text-center text-muted-foreground",
						children: "Aucun utilisateur avec page."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 138,
						columnNumber: 19
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 137,
						columnNumber: 60
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 131,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 123,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 122,
				columnNumber: 9
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 116,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Facebook, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 150,
						columnNumber: 13
					}, this),
					" Pages connectées (",
					data?.totalPages ?? 0,
					")"
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 149,
				columnNumber: 11
			}, this) }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 148,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
						className: "border-b text-left text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
								className: "py-2 pr-4 font-medium",
								children: "Page"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 157,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
								className: "py-2 pr-4 font-medium",
								children: "Propriétaire"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 158,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
								className: "py-2 pr-4 font-medium",
								children: "Statut"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 159,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
								className: "py-2 font-medium",
								children: "Webhook"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 160,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 156,
						columnNumber: 15
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 155,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { children: [(data?.pages ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
						className: "border-b last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "py-2 pr-4 font-medium",
								children: p.page_name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 165,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "py-2 pr-4",
								children: p.user_name || p.user_email || "—"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 166,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "py-2 pr-4",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
									variant: p.is_connected ? "default" : "secondary",
									children: p.is_connected ? "Connectée" : "Déconnectée"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 168,
									columnNumber: 21
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 167,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "py-2",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
									variant: p.webhook_subscribed ? "default" : "outline",
									children: p.webhook_subscribed ? "Actif" : "Inactif"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 173,
									columnNumber: 21
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 172,
								columnNumber: 19
							}, this)
						]
					}, p.id, true, {
						fileName: _jsxFileName,
						lineNumber: 164,
						columnNumber: 45
					}, this)), data && data.pages.length === 0 && /* @__PURE__ */ (void 0)("tr", { children: /* @__PURE__ */ (void 0)("td", {
						colSpan: 4,
						className: "py-4 text-center text-muted-foreground",
						children: "Aucune page connectée."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 179,
						columnNumber: 19
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 178,
						columnNumber: 51
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 163,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 154,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 153,
				columnNumber: 9
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 147,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 48,
		columnNumber: 10
	}, this);
}
//#endregion
export { UtilisateursPage as component };
