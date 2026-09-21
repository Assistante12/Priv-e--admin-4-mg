import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { $ as Check, A as Lock, S as Plus, g as Search, l as Trash2 } from "../_libs/lucide-react.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CWKLgPMR.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as renameWorkspace, c as unlockWorkspace, i as listWorkspaces, n as deleteWorkspace, o as resetWorkspacePassword, s as switchWorkspace, t as createWorkspace } from "./workspace.functions-DqBXgD28.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workspaces-DtUm9bzi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/_authenticated/workspaces.tsx?tsr-split=component";
function WorkspacesPage() {
	const queryClient = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const [newName, setNewName] = (0, import_react.useState)("");
	const [newEmail, setNewEmail] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(0);
	const [unlockFor, setUnlockFor] = (0, import_react.useState)(null);
	const [unlockPassword, setUnlockPassword] = (0, import_react.useState)("");
	const [resetFor, setResetFor] = (0, import_react.useState)(null);
	const [resetEmail, setResetEmail] = (0, import_react.useState)("");
	const [resetPassword, setResetPassword] = (0, import_react.useState)("");
	const perPage = 20;
	const list = useServerFn(listWorkspaces);
	const doCreate = useServerFn(createWorkspace);
	const doSwitch = useServerFn(switchWorkspace);
	const doRename = useServerFn(renameWorkspace);
	const doDelete = useServerFn(deleteWorkspace);
	const doUnlock = useServerFn(unlockWorkspace);
	const doReset = useServerFn(resetWorkspacePassword);
	const { data } = useQuery({
		queryKey: [
			"workspaces-page",
			search,
			page
		],
		queryFn: () => list({ data: {
			search: search || void 0,
			limit: perPage,
			offset: page * perPage
		} })
	});
	const refresh = () => queryClient.invalidateQueries();
	const mutate = (fn, ok) => fn().then(() => {
		toast.success(ok);
		return refresh();
	}).catch((e) => toast.error(e?.message ?? "Nisy olana"));
	const enterWorkspace = (w) => doSwitch({ data: { id: w.id } }).then((res) => {
		if (res?.ok === false) {
			if (res.reason === "PASSWORD_REQUIRED") {
				setUnlockFor(w);
				setUnlockPassword("");
				toast.info("Mila mot de passe ity workspace ity.");
				return;
			}
			toast.error(res.message ?? "Nisy olana");
			return;
		}
		toast.success("Workspace novaina");
		return refresh();
	}).catch((e) => {
		if (String(e?.message ?? "").includes("PASSWORD_REQUIRED")) {
			setUnlockFor(w);
			setUnlockPassword("");
			return;
		}
		toast.error(e?.message ?? "Nisy olana");
	});
	const createMutation = useMutation({
		mutationFn: () => doCreate({ data: {
			name: newName.trim(),
			email: newEmail.trim(),
			password: newPassword
		} }),
		onSuccess: async () => {
			toast.success("Workspace noforonina");
			setNewName("");
			setNewEmail("");
			setNewPassword("");
			await refresh();
		},
		onError: (e) => toast.error(e?.message ?? "Tsy nety")
	});
	const total = data?.total ?? 0;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
				className: "text-2xl font-semibold",
				children: "Workspaces"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 102,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-muted-foreground",
				children: "Ny workspace tsirairay manana angon-drakitra voatokana: pejy Facebook, vokatra, formations, kaomandy ary paramètres. Ny Facebook App foibe no ampiasain'izy rehetra."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 103,
				columnNumber: 9
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 101,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
				className: "text-base",
				children: "Workspace vaovao"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 111,
				columnNumber: 11
			}, this) }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 110,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
				className: "grid gap-2 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						value: newName,
						onChange: (e) => setNewName(e.target.value),
						placeholder: "Anarana (oh. Boutique Antananarivo)"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 114,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						type: "email",
						value: newEmail,
						onChange: (e) => setNewEmail(e.target.value),
						placeholder: "Email"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 115,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						type: "password",
						value: newPassword,
						onChange: (e) => setNewPassword(e.target.value),
						placeholder: "Mot de passe (6+ litera)"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 116,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						disabled: !newName.trim() || !newEmail.trim() || newPassword.length < 6 || createMutation.isPending,
						onClick: () => createMutation.mutate(),
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4 mr-1" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 118,
							columnNumber: 13
						}, this), " Hamorona"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 117,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 113,
				columnNumber: 9
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 109,
				columnNumber: 7
			}, this),
			unlockFor && /* @__PURE__ */ (void 0)(Card, { children: [/* @__PURE__ */ (void 0)(CardHeader, { children: /* @__PURE__ */ (void 0)(CardTitle, {
				className: "text-base",
				children: ["Mot de passe — ", unlockFor.name]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 125,
				columnNumber: 13
			}, this) }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 124,
				columnNumber: 11
			}, this), /* @__PURE__ */ (void 0)(CardContent, {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (void 0)(Input, {
						type: "password",
						className: "max-w-xs",
						autoFocus: true,
						value: unlockPassword,
						onChange: (e) => setUnlockPassword(e.target.value),
						placeholder: "Mot de passe an'ity workspace ity"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 128,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)(Button, {
						disabled: !unlockPassword,
						onClick: () => mutate(() => doUnlock({ data: {
							id: unlockFor.id,
							password: unlockPassword
						} }), "Workspace novaina").then(() => {
							setUnlockFor(null);
							setUnlockPassword("");
						}),
						children: "Hiditra"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 129,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)(Button, {
						variant: "ghost",
						onClick: () => setUnlockFor(null),
						children: "Aoka"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 140,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 127,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 123,
				columnNumber: 21
			}, this),
			resetFor && /* @__PURE__ */ (void 0)(Card, { children: [/* @__PURE__ */ (void 0)(CardHeader, { children: /* @__PURE__ */ (void 0)(CardTitle, {
				className: "text-base",
				children: ["Mot de passe oublié — ", resetFor.name]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 148,
				columnNumber: 13
			}, this) }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 147,
				columnNumber: 11
			}, this), /* @__PURE__ */ (void 0)(CardContent, {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (void 0)(Input, {
						type: "email",
						className: "max-w-xs",
						value: resetEmail,
						onChange: (e) => setResetEmail(e.target.value),
						placeholder: "Email an'ny workspace"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 153,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)(Input, {
						type: "password",
						className: "max-w-xs",
						value: resetPassword,
						onChange: (e) => setResetPassword(e.target.value),
						placeholder: "Mot de passe vaovao (6+)"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 154,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)(Button, {
						disabled: !resetEmail.trim() || resetPassword.length < 6,
						onClick: () => mutate(() => doReset({ data: {
							id: resetFor.id,
							email: resetEmail.trim(),
							new_password: resetPassword
						} }), "Mot de passe novaina").then(() => {
							setResetFor(null);
							setResetEmail("");
							setResetPassword("");
						}),
						children: "Enregistrer"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 155,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (void 0)(Button, {
						variant: "ghost",
						onClick: () => setResetFor(null),
						children: "Aoka"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 168,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 152,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 146,
				columnNumber: 20
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
				className: "flex-row items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
					className: "text-base",
					children: [
						"Lisitra (",
						total,
						")"
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 176,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "relative w-56",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 178,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						value: search,
						onChange: (e) => {
							setSearch(e.target.value);
							setPage(0);
						},
						placeholder: "Karohy…",
						className: "pl-8"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 179,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 177,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 175,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
				className: "space-y-2",
				children: [
					(data?.workspaces ?? []).map((w) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap items-center gap-2 rounded-lg border border-border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex-1 min-w-40",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2 font-medium",
									children: [
										w.name,
										w.has_password && /* @__PURE__ */ (void 0)(Lock, { className: "h-3.5 w-3.5 text-muted-foreground" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 190,
											columnNumber: 38
										}, this),
										w.is_active && /* @__PURE__ */ (void 0)(Check, { className: "h-4 w-4 text-primary" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 191,
											columnNumber: 35
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 188,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-xs text-muted-foreground",
									children: w.is_personal ? "Workspace personnel" : w.login_email ?? "Workspace"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 193,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 187,
								columnNumber: 15
							}, this),
							!w.is_active && /* @__PURE__ */ (void 0)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => enterWorkspace(w),
								children: "Hiditra"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 197,
								columnNumber: 32
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => {
									const name = window.prompt("Anarana vaovao", w.name);
									if (name?.trim()) mutate(() => doRename({ data: {
										id: w.id,
										name: name.trim()
									} }), "Anarana novaina");
								},
								children: "Ovaina anarana"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 200,
								columnNumber: 15
							}, this),
							!w.is_personal && /* @__PURE__ */ (void 0)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => {
									setResetFor({
										id: w.id,
										name: w.name,
										email: w.login_email ?? ""
									});
									setResetEmail(w.login_email ?? "");
									setResetPassword("");
								},
								children: "Mot de passe"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 211,
								columnNumber: 34
							}, this),
							!w.is_personal && /* @__PURE__ */ (void 0)(Button, {
								variant: "ghost",
								size: "sm",
								className: "text-destructive",
								onClick: () => {
									if (window.confirm(`Hofafana ny workspace "${w.name}" sy ny angon-drakitra rehetra ao anatiny?`)) mutate(() => doDelete({ data: { id: w.id } }), "Voafafa");
								},
								children: /* @__PURE__ */ (void 0)(Trash2, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 229,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 222,
								columnNumber: 34
							}, this)
						]
					}, w.id, true, {
						fileName: _jsxFileName,
						lineNumber: 186,
						columnNumber: 46
					}, this)),
					data && data.workspaces.length === 0 && /* @__PURE__ */ (void 0)("p", {
						className: "text-sm text-muted-foreground",
						children: "Tsy nisy hita."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 232,
						columnNumber: 52
					}, this),
					total > perPage && /* @__PURE__ */ (void 0)("div", {
						className: "flex items-center justify-between pt-2",
						children: [
							/* @__PURE__ */ (void 0)(Button, {
								variant: "outline",
								size: "sm",
								disabled: page === 0,
								onClick: () => setPage((p) => Math.max(0, p - 1)),
								children: "Aloha"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 234,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("span", {
								className: "text-xs text-muted-foreground",
								children: [
									"Pejy ",
									page + 1,
									" / ",
									Math.ceil(total / perPage)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 237,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)(Button, {
								variant: "outline",
								size: "sm",
								disabled: (page + 1) * perPage >= total,
								onClick: () => setPage((p) => p + 1),
								children: "Manaraka"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 240,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 233,
						columnNumber: 31
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 185,
				columnNumber: 9
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 174,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 100,
		columnNumber: 10
	}, this);
}
//#endregion
export { WorkspacesPage as component };
