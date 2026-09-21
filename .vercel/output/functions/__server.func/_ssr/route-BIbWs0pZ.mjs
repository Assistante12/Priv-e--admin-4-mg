import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Link, g as Outlet, p as useRouterState, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import "../_libs/firebase.mjs";
import { c as signOut } from "../_libs/firebase__auth.mjs";
import { t as auth } from "./config-CbtXGA-s.mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { $ as Check, A as Lock, D as MessagesSquare, E as MessageSquare, F as KeyRound, J as ClipboardList, K as CreditCard, P as LayoutDashboard, R as GraduationCap, S as Plus, V as Facebook, W as ExternalLink, X as ChevronsUpDown, d as Sparkles, et as Building2, f as ShoppingBag, g as Search, h as Send, i as Users, j as LoaderCircle, k as LogOut, m as Settings, n as X, rt as BellRing, tt as Bot } from "../_libs/lucide-react.mjs";
import { E as getSettings } from "./router-Bhc7uvGy.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-8n41GpW2.mjs";
import { t as Input } from "./input-Bi36govA.mjs";
import { n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-B0Ygdo8b.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/@radix-ui/react-popover+[...].mjs";
import { t as supabase } from "./client-DX3EYOCh.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { i as pushPermissionStatus, l as subscribeForegroundPush, n as getPushState, o as savePushToken, t as enablePush, u as useHasSession } from "./useHasSession-C12k1JOv.mjs";
import { c as unlockWorkspace, i as listWorkspaces, l as unlockWorkspaceByEmail, r as getWorkspaceAccess, s as switchWorkspace, t as createWorkspace } from "./workspace.functions-D44E-g8F.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-BIbWs0pZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$4 = "/app/applet/src/components/PushGate.tsx";
/**
* Bandeau de notification en haut de l'écran + fenêtre d'activation obligatoire.
* N'altère aucune logique existante : composant additionnel.
*/
function PushGate() {
	const qc = useQueryClient();
	const [banner, setBanner] = (0, import_react.useState)(null);
	const [activating, setActivating] = (0, import_react.useState)(false);
	const [permission, setPermission] = (0, import_react.useState)("default");
	const [inIframe, setInIframe] = (0, import_react.useState)(false);
	const [dismissedOnce, setDismissedOnce] = (0, import_react.useState)(false);
	const hasSession = useHasSession();
	const state = useQuery({
		queryKey: ["push-state"],
		queryFn: () => getPushState(),
		staleTime: 15e3,
		enabled: hasSession,
		retry: false
	});
	(0, import_react.useEffect)(() => {
		setPermission(pushPermissionStatus());
		setInIframe(typeof window !== "undefined" && window.top !== window.self);
	}, []);
	(0, import_react.useEffect)(() => {
		let off;
		subscribeForegroundPush((n) => {
			setBanner(n);
			window.setTimeout(() => setBanner(null), 9e3);
		}).then((u) => {
			off = u;
		}).catch(() => {});
		return () => off?.();
	}, []);
	const activate = (0, import_react.useCallback)(async () => {
		setActivating(true);
		try {
			const res = await enablePush();
			if (res.status === "registered") {
				await savePushToken({ data: {
					token: res.token,
					user_agent: navigator.userAgent
				} });
				setPermission("granted");
				qc.invalidateQueries({ queryKey: ["push-state"] });
			} else if (res.status === "open-in-new-tab") setInIframe(true);
			else if (res.status === "denied") setPermission(pushPermissionStatus());
		} finally {
			setActivating(false);
		}
	}, [qc]);
	(0, import_react.useEffect)(() => {
		if (permission === "granted" && state.data && state.data.devices.length === 0 && !activating) activate();
	}, [
		permission,
		state.data,
		activate,
		activating
	]);
	const needsActivation = state.isSuccess && (permission !== "granted" || state.data.devices.length === 0);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [banner && /* @__PURE__ */ (void 0)("div", {
		className: "fixed top-0 inset-x-0 z-[60] px-3 pt-3 pointer-events-none",
		children: /* @__PURE__ */ (void 0)("div", {
			className: "pointer-events-auto mx-auto max-w-md rounded-2xl border border-border bg-card/95 backdrop-blur shadow-lg p-3 flex items-start gap-3 animate-in slide-in-from-top",
			children: [
				/* @__PURE__ */ (void 0)("img", {
					src: "/notification-logo.png",
					alt: "Assistante Virtuelle",
					width: 36,
					height: 36,
					className: "h-9 w-9 rounded-lg"
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 89,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (void 0)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (void 0)("p", {
							className: "text-sm font-semibold truncate",
							children: banner.title
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 97,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)("p", {
							className: "text-xs text-muted-foreground line-clamp-3",
							children: banner.body
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 98,
							columnNumber: 15
						}, this),
						banner.link && /* @__PURE__ */ (void 0)("a", {
							href: banner.link,
							target: "_blank",
							rel: "noreferrer",
							className: "mt-1 inline-flex items-center gap-1 text-xs text-primary",
							children: ["Ouvrir ", /* @__PURE__ */ (void 0)(ExternalLink, { className: "h-3 w-3" }, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 106,
								columnNumber: 26
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 100,
							columnNumber: 17
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 96,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (void 0)("button", {
					onClick: () => setBanner(null),
					"aria-label": "Fermer la notification",
					className: "text-muted-foreground hover:text-foreground",
					children: /* @__PURE__ */ (void 0)(X, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 115,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 110,
					columnNumber: 13
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$4,
			lineNumber: 88,
			columnNumber: 11
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 87,
		columnNumber: 9
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
		open: Boolean(needsActivation) && !dismissedOnce,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
			className: "max-w-sm [&>button]:hidden",
			onPointerDownOutside: (e) => e.preventDefault(),
			onEscapeKeyDown: (e) => e.preventDefault(),
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col items-center text-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
						src: "/notification-logo.png",
						alt: "Assistante Virtuelle",
						width: 64,
						height: 64,
						className: "h-16 w-16 rounded-2xl"
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 128,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: "Activez les notifications" }, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 135,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: "Recevez les alertes de l'Assistante Virtuelle directement dans la barre de notification de votre téléphone, en temps réel." }, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 136,
						columnNumber: 13
					}, this),
					inIframe ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "w-full space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: "Ouvrez l'application dans un onglet séparé pour autoriser les notifications."
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 143,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							asChild: true,
							className: "w-full",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
								href: window.location.href,
								target: "_blank",
								rel: "noreferrer",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "h-4 w-4 mr-2" }, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 148,
									columnNumber: 21
								}, this), "Ouvrir dans un onglet"]
							}, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 147,
								columnNumber: 19
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 146,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 142,
						columnNumber: 15
					}, this) : permission === "denied" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs text-destructive",
						children: "Les notifications sont bloquées. Autorisez-les dans les réglages du navigateur pour ce site, puis rechargez la page."
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 154,
						columnNumber: 15
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						className: "w-full",
						onClick: activate,
						disabled: activating,
						children: [activating ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 161,
							columnNumber: 19
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BellRing, { className: "h-4 w-4 mr-2" }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 163,
							columnNumber: 19
						}, this), "Activer maintenant"]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 159,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						className: "text-xs text-muted-foreground underline",
						onClick: () => setDismissedOnce(true),
						children: "Plus tard"
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 169,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 127,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 122,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 121,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 85,
		columnNumber: 5
	}, this);
}
var _jsxFileName$3 = "/app/applet/src/components/NewOrderBanner.tsx";
/** Bannière de notification affichée à l'admin dès qu'une commande arrive. */
function NewOrderBanner({ alert, onDismiss }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "fixed top-0 inset-x-0 z-[70] px-3 pt-3 pointer-events-none",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "pointer-events-auto mx-auto max-w-md rounded-2xl border border-primary/40 bg-card/95 backdrop-blur shadow-lg p-3 flex items-start gap-3 animate-in slide-in-from-top",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShoppingBag, { className: "h-5 w-5" }, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 17,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 16,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-sm font-semibold",
							children: "🛒 Kaomandy vaovao tonga!"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 20,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground line-clamp-2",
							children: [
								alert.clientName,
								" : ",
								alert.item,
								alert.quantity > 1 ? ` ×${alert.quantity}` : ""
							]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 21,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/orders",
							onClick: onDismiss,
							className: "mt-1 inline-block text-xs text-primary",
							children: "Jerena ny komandy"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 25,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 19,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					onClick: onDismiss,
					"aria-label": "Fermer la notification",
					className: "text-muted-foreground hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 34,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 29,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 15,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$3,
		lineNumber: 14,
		columnNumber: 5
	}, this);
}
/**
* Écoute en temps réel les nouvelles commandes de l'utilisateur connecté et
* expose un compteur (badge) + la dernière commande (bannière).
*/
function useNewOrderAlerts() {
	const [count, setCount] = (0, import_react.useState)(0);
	const [latest, setLatest] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let channel = null;
		let cancelled = false;
		(async () => {
			const { data } = await supabase.auth.getUser();
			const authUserId = data?.user?.id;
			if (!authUserId || cancelled) return;
			const { data: profile } = await supabase.from("profiles").select("active_workspace_id").eq("id", authUserId).maybeSingle();
			const userId = profile?.active_workspace_id ?? authUserId;
			if (cancelled) return;
			channel = supabase.channel(`orders-alerts-${userId}`).on("postgres_changes", {
				event: "INSERT",
				schema: "public",
				table: "orders",
				filter: `user_id=eq.${userId}`
			}, (payload) => {
				const row = payload.new;
				setCount((c) => c + 1);
				setLatest({
					id: String(row["id"] ?? ""),
					clientName: String(row["client_fb_name"] ?? "Mpanjifa Messenger"),
					item: String(row["notes"] ?? (row["type"] === "training" ? "Formation" : "Produit")),
					quantity: Number(row["quantity"] ?? 1)
				});
			}).subscribe();
		})();
		return () => {
			cancelled = true;
			if (channel) supabase.removeChannel(channel);
		};
	}, []);
	return {
		count,
		latest,
		clear: () => {
			setCount(0);
			setLatest(null);
		},
		dismissLatest: () => setLatest(null)
	};
}
var _jsxFileName$2 = "/app/applet/src/components/ui/popover.tsx";
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Portal, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$2,
	lineNumber: 17,
	columnNumber: 5
}, void 0) }, void 0, false, {
	fileName: _jsxFileName$2,
	lineNumber: 16,
	columnNumber: 3
}, void 0));
PopoverContent.displayName = Content2.displayName;
var _jsxFileName$1 = "/app/applet/src/components/WorkspaceSwitcher.tsx";
function WorkspaceSwitcher() {
	const queryClient = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const [newName, setNewName] = (0, import_react.useState)("");
	const [newEmail, setNewEmail] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(null);
	const [password, setPassword] = (0, import_react.useState)("");
	const [loginEmail, setLoginEmail] = (0, import_react.useState)("");
	const [loginPassword, setLoginPassword] = (0, import_react.useState)("");
	const list = useServerFn(listWorkspaces);
	const doSwitch = useServerFn(switchWorkspace);
	const doCreate = useServerFn(createWorkspace);
	const doUnlock = useServerFn(unlockWorkspace);
	const doUnlockByEmail = useServerFn(unlockWorkspaceByEmail);
	const { data } = useQuery({
		queryKey: ["workspaces", search],
		queryFn: () => list({ data: {
			search: search || void 0,
			limit: 50
		} })
	});
	const active = (0, import_react.useMemo)(() => data?.workspaces.find((w) => w.is_active) ?? data?.workspaces[0], [data]);
	const afterChange = async () => {
		await queryClient.invalidateQueries();
		setOpen(false);
		setPending(null);
		setPassword("");
	};
	const switchMutation = useMutation({
		mutationFn: async (w) => {
			return {
				res: await doSwitch({ data: { id: w.id } }),
				w
			};
		},
		onSuccess: async ({ res, w }) => {
			if (res?.ok === false) {
				if (res.reason === "PASSWORD_REQUIRED") {
					setPending(w);
					toast.info("Mila mot de passe ity workspace ity.");
					return;
				}
				toast.error(res.message ?? "Tsy nety ny fifamadihana");
				return;
			}
			toast.success("Workspace novaina");
			await afterChange();
		},
		onError: (e) => toast.error(e?.message ?? "Tsy nety ny fifamadihana")
	});
	const unlockMutation = useMutation({
		mutationFn: () => doUnlock({ data: {
			id: pending.id,
			password
		} }),
		onSuccess: async () => {
			toast.success("Workspace novaina");
			await afterChange();
		},
		onError: (e) => toast.error(e?.message ?? "Mot de passe diso")
	});
	const emailLoginMutation = useMutation({
		mutationFn: () => doUnlockByEmail({ data: {
			email: loginEmail.trim(),
			password: loginPassword
		} }),
		onSuccess: async () => {
			toast.success("Tafiditra amin'ny workspace");
			setLoginEmail("");
			setLoginPassword("");
			await afterChange();
		},
		onError: (e) => toast.error(e?.message ?? "Email na mot de passe diso")
	});
	const createMutation = useMutation({
		mutationFn: () => doCreate({ data: {
			name: newName.trim(),
			email: newEmail.trim(),
			password: newPassword
		} }),
		onSuccess: async () => {
			toast.success("Workspace vaovao noforonina");
			setNewName("");
			setNewEmail("");
			setNewPassword("");
			await afterChange();
		},
		onError: (e) => toast.error(e?.message ?? "Tsy nety ny famoronana")
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				variant: "outline",
				size: "sm",
				className: "w-full justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "truncate",
					children: active?.name ?? "Workspace"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 116,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronsUpDown, { className: "h-4 w-4 opacity-60" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 117,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 115,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 114,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PopoverContent, {
			align: "start",
			className: "w-72 p-3 space-y-3",
			children: pending ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm font-medium",
						children: ["Mot de passe — ", pending.name]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 123,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						type: "password",
						autoFocus: true,
						value: password,
						onChange: (e) => setPassword(e.target.value),
						placeholder: "Mot de passe an'ny workspace",
						onKeyDown: (e) => {
							if (e.key === "Enter" && password) unlockMutation.mutate();
						}
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 124,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							className: "flex-1",
							disabled: !password || unlockMutation.isPending,
							onClick: () => unlockMutation.mutate(),
							children: "Hiditra"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 135,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => {
								setPending(null);
								setPassword("");
							},
							children: "Aoka"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 143,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 134,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: "/workspaces",
						className: "block text-xs text-primary hover:underline",
						children: "Mot de passe oublié ?"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 154,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 122,
				columnNumber: 11
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 161,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Karohy workspace…",
						className: "pl-8"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 162,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 160,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "max-h-64 overflow-y-auto space-y-1",
					children: [(data?.workspaces ?? []).map((w) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => switchMutation.mutate({
							id: w.id,
							name: w.name
						}),
						className: "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "truncate flex-1",
								children: w.name
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 176,
								columnNumber: 19
							}, this),
							w.has_password && /* @__PURE__ */ (void 0)(Lock, { className: "h-3 w-3 text-muted-foreground" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 177,
								columnNumber: 38
							}, this),
							w.is_personal && /* @__PURE__ */ (void 0)("span", {
								className: "text-[10px] text-muted-foreground",
								children: "personnel"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 179,
								columnNumber: 21
							}, this),
							w.is_active && /* @__PURE__ */ (void 0)(Check, { className: "h-4 w-4 text-primary" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 181,
								columnNumber: 35
							}, this)
						]
					}, w.id, true, {
						fileName: _jsxFileName$1,
						lineNumber: 171,
						columnNumber: 17
					}, this)), data && data.workspaces.length === 0 && /* @__PURE__ */ (void 0)("p", {
						className: "px-2 py-3 text-sm text-muted-foreground",
						children: "Tsy nisy hita."
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 185,
						columnNumber: 17
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 169,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2 border-t border-border pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs font-medium text-muted-foreground",
							children: "Hiditra amin'ny workspace hafa"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 189,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							type: "email",
							value: loginEmail,
							onChange: (e) => setLoginEmail(e.target.value),
							placeholder: "Email an'ny workspace"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 192,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							type: "password",
							value: loginPassword,
							onChange: (e) => setLoginPassword(e.target.value),
							placeholder: "Mot de passe",
							onKeyDown: (e) => {
								if (e.key === "Enter" && loginEmail.trim() && loginPassword) emailLoginMutation.mutate();
							}
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 198,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							variant: "secondary",
							className: "w-full",
							disabled: !loginEmail.trim() || !loginPassword || emailLoginMutation.isPending,
							onClick: () => emailLoginMutation.mutate(),
							children: "Hiditra"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 209,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 188,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2 border-t border-border pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							value: newName,
							onChange: (e) => setNewName(e.target.value),
							placeholder: "Anaran'ny workspace vaovao"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 221,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							type: "email",
							value: newEmail,
							onChange: (e) => setNewEmail(e.target.value),
							placeholder: "Email"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 226,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							type: "password",
							value: newPassword,
							onChange: (e) => setNewPassword(e.target.value),
							placeholder: "Mot de passe (6+)"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 232,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							className: "w-full",
							disabled: !newName.trim() || !newEmail.trim() || newPassword.length < 6 || createMutation.isPending,
							onClick: () => createMutation.mutate(),
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4 mr-1" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 249,
								columnNumber: 17
							}, this), " Hamorona"]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 238,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 219,
					columnNumber: 13
				}, this),
				data && /* @__PURE__ */ (void 0)("p", {
					className: "text-xs text-muted-foreground",
					children: [data.total, " workspace(s)"]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 252,
					columnNumber: 22
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 159,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 120,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 113,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/_authenticated/route.tsx?tsr-split=component";
var COMMON_HEAD = [{
	to: "/dashboard",
	label: "Vue d'ensemble",
	icon: LayoutDashboard
}, {
	to: "/prompts",
	label: "Prompts IA",
	icon: Sparkles
}];
var COMMON_TAIL = [
	{
		to: "/utilisateurs",
		label: "Utilisateurs",
		icon: Users
	},
	{
		to: "/api-keys",
		label: "Clés Gemini",
		icon: KeyRound
	},
	{
		to: "/facebook",
		label: "Facebook",
		icon: Facebook
	},
	{
		to: "/settings",
		label: "Paramètres",
		icon: Settings
	}
];
/** Menu ho an'ny kaonty foibe ihany (fitantanana ankapobeny). */
var CENTRAL_ONLY = [{
	to: "/facebook-central",
	label: "Pages centrales",
	icon: Facebook
}, {
	to: "/workspaces",
	label: "Workspaces",
	icon: Building2
}];
var NAV_BY_TYPE = {
	online_work: [
		...COMMON_HEAD,
		{
			to: "/auto-post",
			label: "Auto-poste",
			icon: Send
		},
		{
			to: "/comments",
			label: "Commentaires",
			icon: MessagesSquare
		},
		{
			to: "/messages",
			label: "Messages",
			icon: MessageSquare
		},
		...COMMON_TAIL
	],
	training: [
		...COMMON_HEAD,
		{
			to: "/formations",
			label: "Formations",
			icon: GraduationCap
		},
		{
			to: "/payments",
			label: "Paiements",
			icon: CreditCard
		},
		{
			to: "/orders",
			label: "Commandes",
			icon: ClipboardList
		},
		{
			to: "/discussions",
			label: "Discussions",
			icon: Users
		},
		...COMMON_TAIL
	],
	sales: [
		...COMMON_HEAD,
		{
			to: "/produits",
			label: "Produits",
			icon: ShoppingBag
		},
		{
			to: "/payments",
			label: "Paiements",
			icon: CreditCard
		},
		{
			to: "/orders",
			label: "Commandes",
			icon: ClipboardList
		},
		{
			to: "/discussions",
			label: "Discussions",
			icon: Users
		},
		...COMMON_TAIL
	]
};
function AuthenticatedLayout() {
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { data: settings } = useQuery({
		queryKey: ["settings"],
		queryFn: async () => {
			try {
				return await getSettings();
			} catch (e) {
				console.warn("Settings query error", e);
				return { assistance_type: "online_work" };
			}
		}
	});
	const assistanceType = settings?.assistance_type ?? "online_work";
	const orderAlerts = useNewOrderAlerts();
	(0, import_react.useEffect)(() => {
		if (pathname === "/orders" && orderAlerts.count > 0) orderAlerts.clear();
	}, [pathname, orderAlerts]);
	const { data: access } = useQuery({
		queryKey: ["workspace-access"],
		queryFn: async () => {
			try {
				return await getWorkspaceAccess();
			} catch {
				return { is_central: false };
			}
		}
	});
	const navItems = [...NAV_BY_TYPE[assistanceType] ?? NAV_BY_TYPE.online_work, ...access?.is_central ? CENTRAL_ONLY : []];
	const signOut$1 = async () => {
		await signOut(auth);
		toast.success("Déconnecté");
		navigate({ to: "/auth" });
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PushGate, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 155,
				columnNumber: 7
			}, this),
			orderAlerts.latest && /* @__PURE__ */ (void 0)(NewOrderBanner, {
				alert: orderAlerts.latest,
				onDismiss: orderAlerts.dismissLatest
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 156,
				columnNumber: 30
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
				className: "hidden md:flex w-64 flex-col border-r border-sidebar-border bg-sidebar",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2 px-6 py-6 border-b border-sidebar-border",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bot, { className: "h-5 w-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 161,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 160,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "font-semibold text-sidebar-foreground leading-tight",
							children: "Assistante"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 164,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-xs text-muted-foreground",
							children: assistanceType === "training" ? "Formation" : assistanceType === "sales" ? "Vente" : "Virtuelle IA"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 165,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 163,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 159,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "px-3 pt-3",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(WorkspaceSwitcher, {}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 171,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 170,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
						className: "flex-1 px-3 py-4 space-y-1 overflow-y-auto",
						children: navItems.map((item) => {
							const active = pathname === item.to;
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: item.to,
								className: `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent/50"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 178,
										columnNumber: 17
									}, this),
									item.label,
									item.to === "/orders" && orderAlerts.count > 0 && /* @__PURE__ */ (void 0)("span", {
										className: "ml-auto inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground",
										children: orderAlerts.count
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 180,
										columnNumber: 68
									}, this)
								]
							}, item.to, true, {
								fileName: _jsxFileName,
								lineNumber: 177,
								columnNumber: 18
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 173,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "p-3 border-t border-sidebar-border",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "ghost",
							size: "sm",
							className: "w-full justify-start",
							onClick: signOut$1,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogOut, { className: "h-4 w-4 mr-2" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 188,
								columnNumber: 13
							}, this), "Déconnexion"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 187,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 186,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 157,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "md:hidden fixed top-0 inset-x-0 z-40 flex items-center gap-2 border-b border-border bg-card/80 backdrop-blur px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bot, { className: "h-5 w-5 text-primary" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 195,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "font-semibold",
						children: "Assistante Virtuelle"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 196,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "ghost",
						size: "sm",
						className: "ml-auto",
						onClick: signOut$1,
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogOut, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 198,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 197,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 194,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
				className: "flex-1 min-w-0 pt-16 md:pt-0",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "max-w-6xl mx-auto p-6 md:p-8 pb-40 md:pb-8",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 204,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 203,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
					className: "md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur grid grid-cols-5 gap-1 px-1 py-2",
					children: navItems.map((item) => {
						const active = pathname === item.to;
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: item.to,
							className: `flex flex-col items-center gap-1 rounded-md py-1 px-1 text-[10px] ${active ? "text-primary" : "text-muted-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 212,
									columnNumber: 19
								}, this), item.to === "/orders" && orderAlerts.count > 0 && /* @__PURE__ */ (void 0)("span", {
									className: "absolute -top-1.5 -right-2 inline-flex min-w-4 h-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground",
									children: orderAlerts.count
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 213,
									columnNumber: 70
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 211,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "truncate w-full text-center",
								children: item.label.split(" ")[0]
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 217,
								columnNumber: 17
							}, this)]
						}, item.to, true, {
							fileName: _jsxFileName,
							lineNumber: 210,
							columnNumber: 18
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 206,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 202,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 154,
		columnNumber: 10
	}, this);
}
//#endregion
export { AuthenticatedLayout as component };
