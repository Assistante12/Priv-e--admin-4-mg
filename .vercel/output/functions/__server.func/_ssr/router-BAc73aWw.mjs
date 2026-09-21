import { o as __toESM } from "../_runtime.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, q as redirect, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./server-D9pwzi9_.mjs";
import "../_libs/firebase.mjs";
import { i as onAuthStateChanged } from "../_libs/firebase__auth.mjs";
import { t as auth } from "./config-CbtXGA-s.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZb5fK_L.mjs";
import { n as supabaseAdmin } from "./client.server-1p3pFob5.mjs";
import { t as requireWorkspaceAuth } from "./workspace-middleware-CoslEc7v.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CQ1D8k7I.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, r as enumType, t as arrayType } from "../_libs/zod.mjs";
import { t as uploadMediaFile } from "./storage-helper.server-CcC1ZP7p.mjs";
import { a as saveSupabaseOAuthConnection, n as fetchSupabaseOrganizations, r as fetchSupabaseProjects, t as exchangeSupabaseAuthCode } from "./supabase-oauth.server-k5N44jkI.mjs";
import { a as QueryClientProvider, n as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { tt as Bot } from "../_libs/lucide-react.mjs";
import fs from "fs";
import path from "path";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.functions-CoZLcpPu.js
var promptCategory = enumType([
	"global",
	"message",
	"comment",
	"md",
	"tutorial"
]);
var listPrompts = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(createSsrRpc("22294e75c920f7f5aff4ed203a7232ff6ad286b92bc5ec97e17ef2406637688d"));
var upsertPromptSchema = objectType({
	id: stringType().nullable().optional(),
	name: stringType().max(100).optional().default("Prompt IA"),
	content: stringType().min(1).max(2e4),
	category: promptCategory,
	is_active: booleanType(),
	page_id: stringType().nullable().optional(),
	page_ids: arrayType(stringType()).optional(),
	assistance_type: enumType([
		"online_work",
		"training",
		"sales",
		"all"
	]).nullable().optional()
});
var upsertPrompt = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => upsertPromptSchema.parse(d)).handler(createSsrRpc("91a8eecef9cce275b1bcb4f6a44a4288b429b0bb0588b3234612a3a16f91508f"));
var deletePrompt = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("596aa7c79f858ba0682bfe9e9bfba0a5a12ada404e5976030cd39d78ac663352"));
var listGeminiKeys = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(createSsrRpc("98818ae7a9ff12f23f7c580d09e55be8912eccd6ddf1cdf008c191baa8cf9d89"));
var upsertKeySchema = objectType({
	id: stringType().uuid().optional(),
	label: stringType().min(1).max(60),
	api_key: stringType().min(10).max(400),
	is_active: booleanType()
});
var upsertGeminiKey = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => upsertKeySchema.parse(d)).handler(createSsrRpc("b98af9bc0a51d23bfe05371676bf39064b411693ecf0f38b1f8556d241260712"));
var testGeminiKey = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("79c4b70547f4d45ba8b25ff4145bb6b048815b5b5d75e1584fedbd5d07368346"));
var deleteGeminiKey = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("f770295ee07e79c3983bbd819b49f4d50137501c481a020f3acdf578fd2d4435"));
var toggleGeminiKey = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	is_active: booleanType()
}).parse(d)).handler(createSsrRpc("431fdc1077515d748abb5c96ebc180b1df0d50861e7574fba5a690eb92a438f1"));
var resetAllGeminiKeys = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).handler(createSsrRpc("eacf47008cfd5e8686328db3e67a861b35d3e4dc7eaacfc7e329e4f0af70dce8"));
var getSettings = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(createSsrRpc("7180026c600c721a62b1ac583b5fea60a9a24b9cef2c2e9d29b375367c760773"));
var updateSettingsSchema = objectType({
	assistance_type: enumType([
		"online_work",
		"training",
		"sales"
	]).optional().default("online_work"),
	auto_reply_messages: booleanType().optional().default(true),
	auto_reply_comments: booleanType().optional().default(true),
	comment_scan_interval_minutes: numberType().int().min(1).max(60).optional().default(5),
	use_lovable_ai_fallback: booleanType().optional().default(true),
	default_model: stringType().min(1).max(80).optional().default("gemini-3.6-flash"),
	private_message_link: stringType().max(500).nullable().optional(),
	facebook_app_id: stringType().max(100).nullable().optional(),
	facebook_app_secret: stringType().max(200).nullable().optional(),
	facebook_verify_token: stringType().max(200).nullable().optional(),
	gemini_api_key: stringType().max(500).nullable().optional(),
	lovable_api_key: stringType().max(500).nullable().optional(),
	supabase_project_url: stringType().max(500).nullable().optional(),
	supabase_anon_key: stringType().max(500).nullable().optional(),
	supabase_service_role_key: stringType().max(500).nullable().optional(),
	supabase_project_id: stringType().max(200).nullable().optional()
});
var updateSettings = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => updateSettingsSchema.parse(d)).handler(createSsrRpc("7360a65b44b390ce454157541ae48f1b17feecce8fdb6b9e8a5af44cfc399626"));
var listFacebookPages = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(createSsrRpc("21cf3e4bbf168e8297d295171653de7c91c371f7e7cba88fc6198000c959b283"));
var disconnectFacebookPage = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("2ddd2bfa1fc5d7513eb5dc4184e00e441687ece8edd28c15245d4d8e7a424b68"));
var getDashboardStats = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(createSsrRpc("d8dd0f2f33ee8ce5e2ea2bfc749715b8e981950fa8bc0e14ec15d540b50039e9"));
var listMessagesLog = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(createSsrRpc("f31d964c77892d35771aa382027324a6d76bd117650d79ef2dafac636002fcd4"));
var listCommentsLog = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(createSsrRpc("ff748145b51d921c6cb74e3f40429aa995ca5cee9335a287e920ef615aa11913"));
var replyAllPendingMessages = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).handler(createSsrRpc("65cfd0d1bb1135624470e7931b9aa3fc11ef75b26198cc410b16f6bd13656ea6"));
var scanAndReplyCommentsNow = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).handler(createSsrRpc("f876bdfd1ef92e97f9fb83763eb26e3df07e33c2b4dac416805d20505ad8158c"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/facebook.functions-D8wE6_Fm.js
var getFacebookLoginUrl = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(createSsrRpc("f2f261a9018114c20819bed7223868573b1844bca6dec0694d67ff45108c4484"));
/** Fanoritsoritana ny Facebook App foibe (ampiasain'ny pejy Paramètres). */
var getFacebookAppStatus = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(createSsrRpc("9799f0b09a19e6992f33a37c049e6a3d7a222b6a60dec8fbce4a1f064e1d1c04"));
var getWebhookConfig = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(createSsrRpc("e2747fa41361a15b2a26fb26a682fedb2197229f300f56e975795e2c0286b8a5"));
var triggerCommentScan = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({}).parse(d ?? {})).handler(createSsrRpc("1f4390765d2ca0690b15086abfa82fe927a505b9ae404d08adf9e9291beeeab1"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-BAc73aWw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/ui/sonner.tsx";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 7,
		columnNumber: 5
	}, void 0);
};
var styles_default = "/assets/styles-CJ19ZTZM.css";
var _jsxFileName = "/app/applet/src/routes/__root.tsx";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 22,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 23,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 24,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 28,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 27,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 21,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 20,
		columnNumber: 5
	}, this);
}
function ErrorComponent({ error, reset }) {
	console.error("Root error boundary caught error:", error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background p-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md w-full text-center space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bot, { className: "h-6 w-6" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 48,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 47,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-xl font-bold tracking-tight text-foreground",
					children: "Une erreur de chargement est survenue"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 50,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm text-muted-foreground",
					children: "Impossible de charger les données du serveur ou de la session."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 53,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "pt-4 flex flex-wrap justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Réessayer"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 57,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: "/auth",
						className: "inline-flex items-center justify-center rounded-lg border border-input bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Page de connexion"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 66,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 56,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 46,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 45,
		columnNumber: 5
	}, this);
}
var Route$27 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Assistante Virtuelle — IA pour Facebook Messenger" },
			{
				name: "description",
				content: "Automatisez vos réponses Messenger et commentaires Facebook avec l'IA (Gemini + Lovable AI)."
			},
			{
				name: "author",
				content: "Assistante Virtuelle"
			},
			{
				property: "og:title",
				content: "Assistante Virtuelle — IA pour Facebook Messenger"
			},
			{
				property: "og:description",
				content: "Automatisez vos réponses Messenger et commentaires Facebook avec l'IA (Gemini + Lovable AI)."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Assistante Virtuelle — IA pour Facebook Messenger"
			},
			{
				name: "twitter:description",
				content: "Automatisez vos réponses Messenger et commentaires Facebook avec l'IA (Gemini + Lovable AI)."
			},
			{
				property: "og:image",
				content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/70e94c37-5c8c-4e63-a155-35ed584745c6"
			},
			{
				name: "twitter:image",
				content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/70e94c37-5c8c-4e63-a155-35ed584745c6"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon.png"
			},
			{
				rel: "apple-touch-icon",
				href: "/favicon.png"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeadContent, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 132,
			columnNumber: 9
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 131,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Scripts, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 136,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 134,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 130,
		columnNumber: 5
	}, this);
}
function RootComponent() {
	const { queryClient } = Route$27.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			router.invalidate();
			if (user) queryClient.invalidateQueries();
		});
		return () => unsubscribe();
	}, [queryClient, router]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 158,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Toaster$1, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 159,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 156,
		columnNumber: 5
	}, this);
}
var Route$26 = createFileRoute("/")({ beforeLoad: () => {
	throw redirect({ to: "/auth" });
} });
var $$splitComponentImporter$17 = () => import("./route-DEYOqI4O.mjs");
var Route$25 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		if (typeof window === "undefined") return { user: null };
		try {
			if (auth.currentUser) return { user: auth.currentUser };
			const user = await new Promise((resolve) => {
				const unsubscribe = onAuthStateChanged(auth, (u) => {
					unsubscribe();
					resolve(u);
				});
			});
			if (!user) throw redirect({ to: "/auth" });
			return { user };
		} catch (e) {
			if (e && typeof e === "object" && ("to" in e || "href" in e || "statusCode" in e)) throw e;
			throw redirect({ to: "/auth" });
		}
	},
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
/** Menu ho an'ny kaonty foibe ihany (fitantanana ankapobeny). */
var $$splitComponentImporter$16 = () => import("./auth-DlpD24Mq.mjs");
var Route$24 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Connexion — Assistante Virtuelle" },
		{
			name: "description",
			content: "Connectez-vous à votre espace Assistante Virtuelle."
		},
		{
			property: "og:title",
			content: "Connexion — Assistante Virtuelle"
		},
		{
			property: "og:description",
			content: "Connectez-vous à votre espace Assistante Virtuelle."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var keysQuery = queryOptions({
	queryKey: ["gemini-keys"],
	queryFn: async () => {
		try {
			return await listGeminiKeys();
		} catch (e) {
			console.warn("Gemini keys query error", e);
			return [];
		}
	}
});
var $$splitComponentImporter$15 = () => import("./api-keys-B47TiboV.mjs");
var Route$23 = createFileRoute("/_authenticated/api-keys")({
	loader: ({ context }) => context.queryClient.ensureQueryData(keysQuery),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var listScheduledPosts = createServerFn({ method: "GET" }).middleware([requireWorkspaceAuth]).handler(createSsrRpc("cd0fad7448fbb7d18ba577ec8d718dd65caa20365abe596f4288d3db166d937b"));
var upsertSchema = objectType({
	id: stringType().uuid().optional(),
	page_id: stringType().uuid().nullable().optional(),
	title: stringType().min(1).max(300),
	ai_prompt: stringType().max(2e3).nullable().optional(),
	image_path: stringType().max(2e6).nullable().optional(),
	image_paths: arrayType(stringType().max(2e6)).max(50).optional(),
	video_path: stringType().max(2e6).nullable().optional(),
	scheduled_at: stringType().datetime(),
	frequency: enumType(["once", "daily"]),
	enhance_image: booleanType()
});
var upsertScheduledPost = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => upsertSchema.parse(d)).handler(createSsrRpc("95aa0993c677a6cf427851fb1bcc47b79d931004e6f2df36c7c12428a49bea95"));
var deleteScheduledPost = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("6f0ea51432a5d025936e137e19dc67176b59a1a8a31db1d05b16c0f2761b9ba6"));
createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ filename: stringType().min(1).max(200) }).parse(d)).handler(createSsrRpc("c87d3af86ef10128ec35f624eda337caedec16f84c61e48c1836c50fcd6d3157"));
createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ path: stringType() }).parse(d)).handler(createSsrRpc("b9f30ce6a4071891794479f7d27d25c842df0267400e85f2ac6eede00fd27714"));
var uploadSchema = objectType({
	filename: stringType().min(1).max(200),
	content_type: stringType().min(1).max(80),
	data_base64: stringType().min(1)
});
var uploadPostImage = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => uploadSchema.parse(d)).handler(createSsrRpc("26c1e30da5244238e5a951bad49504d5a522eddf0427dac29c31550b43ff2a63"));
createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ filename: stringType().min(1).max(200) }).parse(d)).handler(createSsrRpc("60ee1005f84247891096138c5b4921ff016a26e42aee0a2dc5d9251252d761a7"));
var getPostImageUrl = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ path: stringType() }).parse(d)).handler(createSsrRpc("87b48a15a2993590ed8642c04e9de2e2617f1ef7f86807a8bf228d2360113983"));
var publishScheduledPostNow = createServerFn({ method: "POST" }).middleware([requireWorkspaceAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("606264e0a388f27dbafffa543b5bf4b33dfa30de245439d75095d08fc10fc472"));
var postsQuery = queryOptions({
	queryKey: ["scheduled-posts"],
	queryFn: async () => {
		try {
			return await listScheduledPosts();
		} catch (e) {
			console.warn("Scheduled posts query error", e);
			return [];
		}
	}
});
var pagesQuery$2 = queryOptions({
	queryKey: ["fb-pages"],
	queryFn: async () => {
		try {
			return await listFacebookPages();
		} catch (e) {
			console.warn("FB pages query error", e);
			return [];
		}
	}
});
var $$splitComponentImporter$14 = () => import("./auto-post-P4OA8FFi.mjs");
var Route$22 = createFileRoute("/_authenticated/auto-post")({
	loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(postsQuery), context.queryClient.ensureQueryData(pagesQuery$2)]),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var commentsQuery = queryOptions({
	queryKey: ["comments-log"],
	queryFn: async () => {
		try {
			return await listCommentsLog();
		} catch (e) {
			console.warn("Comments query error", e);
			return [];
		}
	}
});
var $$splitComponentImporter$13 = () => import("./comments-Bpp9Mou9.mjs");
var Route$21 = createFileRoute("/_authenticated/comments")({
	loader: ({ context }) => context.queryClient.ensureQueryData(commentsQuery),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var statsQuery = queryOptions({
	queryKey: ["dashboard-stats"],
	queryFn: async () => {
		try {
			return await getDashboardStats();
		} catch (e) {
			console.warn("Stats fetch fallback", e);
			return {
				messages: 0,
				comments_replied: 0,
				active_keys: 0,
				connected_pages: 0
			};
		}
	}
});
var settingsQuery$1 = queryOptions({
	queryKey: ["settings"],
	queryFn: async () => {
		try {
			return await getSettings();
		} catch (e) {
			console.warn("Settings fetch fallback", e);
			return {
				assistance_type: "online_work",
				global_ia_stopped: false
			};
		}
	}
});
var $$splitComponentImporter$12 = () => import("./dashboard-D5mOvmGu.mjs");
var Route$20 = createFileRoute("/_authenticated/dashboard")({
	loader: async ({ context }) => {
		try {
			await Promise.all([context.queryClient.ensureQueryData(statsQuery), context.queryClient.ensureQueryData(settingsQuery$1)]);
		} catch (e) {
			console.warn("Loader query warning", e);
		}
	},
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./discussions-ICSNwmrf.mjs");
var Route$19 = createFileRoute("/_authenticated/discussions")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var pagesQuery$1 = queryOptions({
	queryKey: ["fb-pages"],
	queryFn: async () => {
		try {
			return await listFacebookPages();
		} catch (e) {
			console.warn("FB pages query error", e);
			return [];
		}
	}
});
var webhookQuery = queryOptions({
	queryKey: ["fb-webhook"],
	queryFn: async () => {
		try {
			return await getWebhookConfig();
		} catch (e) {
			console.warn("FB webhook query error", e);
			return {
				callbackUrl: "",
				verifyToken: ""
			};
		}
	}
});
var $$splitComponentImporter$10 = () => import("./facebook-gEj8yMP7.mjs");
var Route$18 = createFileRoute("/_authenticated/facebook")({
	loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(pagesQuery$1), context.queryClient.ensureQueryData(webhookQuery)]),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./facebook-central-JhHrtTtX.mjs");
var Route$17 = createFileRoute("/_authenticated/facebook-central")({
	head: () => ({ meta: [
		{ title: "Pages Facebook centrales — Assistante Virtuelle IA" },
		{
			name: "description",
			content: "Répartissez les pages Facebook de la connexion centrale entre vos workspaces : une page appartient à un seul workspace."
		},
		{
			property: "og:title",
			content: "Pages Facebook centrales"
		},
		{
			property: "og:description",
			content: "Attribution des pages Facebook par workspace avec une seule app Facebook."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./formations-CA1k6M73.mjs");
var Route$16 = createFileRoute("/_authenticated/formations")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var messagesQuery = queryOptions({
	queryKey: ["messages-log"],
	queryFn: async () => {
		try {
			return await listMessagesLog();
		} catch (e) {
			console.warn("Messages query error", e);
			return [];
		}
	}
});
var $$splitComponentImporter$7 = () => import("./messages-B_9zPqGy.mjs");
var Route$15 = createFileRoute("/_authenticated/messages")({
	loader: ({ context }) => context.queryClient.ensureQueryData(messagesQuery),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./orders-CqNjDcUV.mjs");
var Route$14 = createFileRoute("/_authenticated/orders")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./payments-Dy447rHE.mjs");
var Route$13 = createFileRoute("/_authenticated/payments")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./produits-hxQNsiOV.mjs");
var Route$12 = createFileRoute("/_authenticated/produits")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var promptsQuery = queryOptions({
	queryKey: ["prompts"],
	queryFn: async () => {
		try {
			return await listPrompts();
		} catch (e) {
			console.warn("Prompts query error", e);
			return [];
		}
	}
});
var pagesQuery = queryOptions({
	queryKey: ["fb-pages"],
	queryFn: async () => {
		try {
			return await listFacebookPages();
		} catch (e) {
			console.warn("Pages query error", e);
			return [];
		}
	}
});
var $$splitComponentImporter$3 = () => import("./prompts-D9f2EsiU.mjs");
var Route$11 = createFileRoute("/_authenticated/prompts")({
	loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(promptsQuery), context.queryClient.ensureQueryData(pagesQuery)]),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("13d291e0d0c62882aa81393904578b21a13e9c7eadd05d974bca25c6a7246cdb"));
var getSupabaseOAuthStatus = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("3b27e249b9f235cc0d3ab7eeb0a30238e4512f505d25d40658be4131ba3dda90"));
var selectProjectSchema = objectType({ projectId: stringType().min(1) });
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => selectProjectSchema.parse(d)).handler(createSsrRpc("7e9f7fa28e2987c330379f6e374f4c3618a05ac8203f5c0dbaf2800c14e867e5"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("38be6894cbd764a15b04328c350232cf665ced948e0591e2d4d60823412af3f8"));
var settingsQuery = queryOptions({
	queryKey: ["settings"],
	queryFn: async () => {
		try {
			return await getSettings();
		} catch (e) {
			console.warn("Settings query error", e);
			return null;
		}
	}
});
var supabaseStatusQuery = queryOptions({
	queryKey: ["supabase-oauth-status"],
	queryFn: async () => {
		try {
			return await getSupabaseOAuthStatus();
		} catch (e) {
			console.warn("Supabase OAuth status query error", e);
			return { isConnected: false };
		}
	}
});
var $$splitComponentImporter$2 = () => import("./settings-Blnj-VkL.mjs");
var Route$10 = createFileRoute("/_authenticated/settings")({
	loader: ({ context }) => {
		return Promise.all([context.queryClient.ensureQueryData(settingsQuery), context.queryClient.ensureQueryData(supabaseStatusQuery)]);
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./utilisateurs-C2IEm-6B.mjs");
var Route$9 = createFileRoute("/_authenticated/utilisateurs")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [{ title: "Utilisateurs — Assistante Virtuelle IA" }, {
		name: "description",
		content: "Liste des utilisateurs et des pages Facebook connectées."
	}] })
});
var $$splitComponentImporter = () => import("./workspaces-DtUm9bzi.mjs");
var Route$8 = createFileRoute("/_authenticated/workspaces")({
	head: () => ({ meta: [
		{ title: "Workspaces — Assistante Virtuelle IA" },
		{
			name: "description",
			content: "Créez et gérez vos workspaces : chaque espace a ses pages Facebook, produits, formations et commandes séparés."
		},
		{
			property: "og:title",
			content: "Workspaces — Assistante Virtuelle IA"
		},
		{
			property: "og:description",
			content: "Gestion multi-workspace de votre assistante virtuelle Facebook Messenger."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route$7 = createFileRoute("/api/public/img")({ server: { handlers: { GET: async (ctx) => {
	try {
		const url = new URL(ctx.request.url);
		const id = url.searchParams.get("id");
		let rawPath = url.searchParams.get("path");
		if (id) {
			const { data: imgRow } = await supabaseAdmin.from("product_images").select("image_path").eq("id", id).maybeSingle();
			if (imgRow?.image_path) rawPath = imgRow.image_path;
		}
		if (!rawPath) return new Response("Image not found", { status: 404 });
		if (rawPath.startsWith("data:image/") || rawPath.startsWith("data:application/")) {
			const match = rawPath.match(/^data:([^;]+);base64,(.+)$/);
			if (match) {
				const mime = match[1] || "image/jpeg";
				const buffer = Buffer.from(match[2], "base64");
				return new Response(buffer, {
					status: 200,
					headers: {
						"Content-Type": mime,
						"Content-Length": String(buffer.length),
						"Cache-Control": "public, max-age=604800, immutable"
					}
				});
			}
		}
		if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) try {
			const res = await fetch(rawPath);
			if (res.ok) {
				const mime = res.headers.get("content-type") || "image/jpeg";
				const arrayBuffer = await res.arrayBuffer();
				return new Response(Buffer.from(arrayBuffer), {
					status: 200,
					headers: {
						"Content-Type": mime,
						"Cache-Control": "public, max-age=604800, immutable"
					}
				});
			}
		} catch (e) {
			console.warn("[/api/public/img] proxy fetch failed:", e);
		}
		try {
			const { downloadSupabaseStorageFile } = await import("./ai-engine.server-BUx7MuRD.mjs");
			const downloaded = await downloadSupabaseStorageFile("product-images", rawPath);
			if (downloaded) return new Response(downloaded.buffer, {
				status: 200,
				headers: {
					"Content-Type": downloaded.mimeType,
					"Content-Length": String(downloaded.buffer.length),
					"Cache-Control": "public, max-age=604800, immutable"
				}
			});
		} catch (stEx) {}
		const cleanPath = rawPath.replace(/^\/+/, "");
		const possiblePaths = [
			path.join(process.cwd(), "public", cleanPath.replace(/^public\//, "")),
			path.join(process.cwd(), cleanPath),
			path.join(process.cwd(), "public", "uploads", path.basename(rawPath))
		];
		for (const p of possiblePaths) if (fs.existsSync(p)) {
			const buffer = fs.readFileSync(p);
			const ext = path.extname(p).toLowerCase();
			return new Response(buffer, {
				status: 200,
				headers: {
					"Content-Type": ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : ext === ".gif" ? "image/gif" : "image/jpeg",
					"Content-Length": String(buffer.length),
					"Cache-Control": "public, max-age=604800, immutable"
				}
			});
		}
		return new Response("File not found on server", { status: 404 });
	} catch (err) {
		console.error("[/api/public/img] error:", err);
		return new Response("Internal server error", { status: 500 });
	}
} } } });
var Route$6 = createFileRoute("/api/public/upload-local")({ server: { handlers: { POST: async (ctx) => {
	try {
		const body = await ctx.request.json();
		if (!body || !body.filename || !body.data_base64) return new Response(JSON.stringify({ error: "Missing filename or data_base64" }), {
			status: 400,
			headers: { "content-type": "application/json" }
		});
		const safeName = body.filename.replace(/[^\w.-]/g, "_");
		const contentType = body.content_type || "image/jpeg";
		const buffer = Buffer.from(body.data_base64, "base64");
		const userId = body.userId || "public";
		const publicUrl = await uploadMediaFile({
			userId,
			bucket: "post-images",
			fileName: safeName,
			contentType,
			buffer
		});
		return new Response(JSON.stringify({
			path: publicUrl,
			signed_url: publicUrl
		}), { headers: { "content-type": "application/json" } });
	} catch (e) {
		console.error("Upload error:", e);
		return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
	}
} } } });
var Route$5 = createFileRoute("/api/public/fb/callback")({ server: { handlers: { GET: async ({ request }) => {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const error = url.searchParams.get("error");
	if (error) return htmlPage$1(`<h2>Connexion refusée</h2><p>${escapeHtml$1(error)}</p><p><a href="/facebook">Retour</a></p>`);
	if (!code || !state) return htmlPage$1(`<h2>Paramètres manquants</h2><p><a href="/facebook">Retour</a></p>`, 400);
	const [stateUserId, , stateAppId = ""] = state.split(".");
	const userId = stateUserId;
	const { supabaseAdmin } = await import("./client.server-1p3pFob5.mjs").then((n) => n.t).then((n) => n.t);
	const { resolveFacebookApp } = await import("./facebook-app.server-U9niySUI.mjs");
	const app = await resolveFacebookApp(userId);
	let appId = app.appId;
	let appSecret = app.appSecret;
	let centralOwnerId = app.ownerUserId;
	if ((!appId || !appSecret) && stateAppId) {
		const fallback = await supabaseAdmin.from("settings").select("user_id,facebook_app_id,facebook_app_secret").eq("facebook_app_id", stateAppId.trim()).not("facebook_app_secret", "is", null).limit(1).maybeSingle();
		if (fallback.data?.facebook_app_id && fallback.data?.facebook_app_secret) {
			appId = fallback.data.facebook_app_id.trim();
			appSecret = fallback.data.facebook_app_secret.trim();
			centralOwnerId = fallback.data.user_id;
		}
	}
	if (!appId || !appSecret) try {
		const { data: anySettings } = await supabaseAdmin.from("settings").select("user_id,facebook_app_id,facebook_app_secret").not("facebook_app_id", "is", null).not("facebook_app_secret", "is", null).neq("facebook_app_id", "").neq("facebook_app_secret", "").limit(1).maybeSingle();
		if (anySettings?.facebook_app_id && anySettings?.facebook_app_secret) {
			appId = anySettings.facebook_app_id.trim();
			appSecret = anySettings.facebook_app_secret.trim();
			centralOwnerId = anySettings.user_id;
		}
	} catch (e) {
		console.warn("[FB Callback] Error in fallback settings lookup:", e);
	}
	if (!appId) appId = (process.env["FACEBOOK_APP_ID"] ?? "").trim();
	if (!appSecret) appSecret = (process.env["FACEBOOK_APP_SECRET"] ?? "").trim();
	if (!appId || !appSecret) return htmlPage$1(`<h2>Configuration manquante</h2><p>Ny Facebook App foibe mbola tsy voaomana. Ny tompon'ny kaonty foibe ihany no mampiditra ny App ID sy App Secret ao amin'ny Paramètres.</p><p><a href="/settings">Ouvrir Paramètres</a></p>`, 500);
	const forwardedProto = request.headers.get("x-forwarded-proto");
	const forwardedHost = request.headers.get("x-forwarded-host");
	const proto = forwardedProto || (url.protocol.startsWith("https") ? "https" : "http");
	const host = forwardedHost || url.host;
	let redirectUri = `${proto}://${host}/api/public/fb/callback`;
	if (process.env.APP_URL && !host.includes("localhost") && !host.includes("127.0.0.1")) redirectUri = `${process.env.APP_URL.replace(/\/$/, "")}/api/public/fb/callback`;
	try {
		const tokenData = await (await fetch(`https://graph.facebook.com/v21.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`)).json();
		if (!tokenData.access_token) throw new Error(tokenData.error?.message ?? "Token exchange failed");
		const llData = await (await fetch(`https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${tokenData.access_token}`)).json();
		const userToken = llData.access_token ?? tokenData.access_token;
		const expiresAt = llData.expires_in ? new Date(Date.now() + llData.expires_in * 1e3).toISOString() : null;
		const requiredPermissions = [
			"pages_show_list",
			"pages_read_engagement",
			"pages_manage_posts"
		];
		const permData = await (await fetch(`https://graph.facebook.com/v21.0/me/permissions?access_token=${userToken}`)).json();
		const granted = new Set((permData.data ?? []).filter((permission) => permission.status === "granted").map((permission) => permission.permission));
		const missingPermissions = requiredPermissions.filter((permission) => !granted.has(permission));
		if (missingPermissions.length > 0) return htmlPage$1(`<h2>Permission Facebook manquante</h2><p>Facebook n'a pas encore accordé : <strong>${escapeHtml$1(missingPermissions.join(", "))}</strong>.</p><p>Cliquez à nouveau sur connecter et acceptez toutes les permissions demandées.</p><p><a href="/facebook">Reconnecter</a></p>`, 403);
		const pages = [];
		let nextUrl = `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,tasks&limit=100&access_token=${userToken}`;
		let guard = 0;
		while (nextUrl && guard < 10) {
			guard += 1;
			const pagesData = await (await fetch(nextUrl)).json();
			if (pagesData.error) throw new Error(pagesData.error.message);
			for (const p of pagesData.data ?? []) if (p?.id && !pages.some((existing) => existing.id === p.id)) pages.push(p);
			nextUrl = pagesData.paging?.next ?? null;
		}
		if (pages.length === 0) return htmlPage$1(`<h2>Aucune page trouvée</h2><p>Assurez-vous d'avoir sélectionné une page lors de la connexion.</p><p><a href="/facebook">Retour</a></p>`);
		for (const p of pages) {
			const { error: centralError } = await supabaseAdmin.from("facebook_central_pages").upsert({
				owner_user_id: centralOwnerId,
				page_id: p.id,
				page_name: p.name,
				page_access_token: p.access_token,
				user_access_token: userToken,
				token_expires_at: expiresAt
			}, { onConflict: "page_id" });
			if (centralError) console.error("[fb central] upsert", p.id, centralError.message);
		}
		const SUBSCRIBE_FIELDS = "messages,messaging_postbacks,feed,message_reactions";
		const saved = [];
		const failed = [];
		const noPublish = [];
		for (const p of pages) {
			if (p.tasks && !p.tasks.includes("CREATE_CONTENT")) noPublish.push(p.name);
			let subscribed = false;
			try {
				subscribed = !!(await (await fetch(`https://graph.facebook.com/v21.0/${p.id}/subscribed_apps?subscribed_fields=${SUBSCRIBE_FIELDS}&access_token=${p.access_token}`, { method: "POST" })).json()).success;
			} catch (err) {
				console.error("[fb subscribe]", p.id, err);
			}
			const { error: upsertError } = await supabaseAdmin.from("facebook_pages").upsert({
				user_id: userId,
				page_id: p.id,
				page_name: p.name,
				page_access_token: p.access_token,
				user_access_token: userToken,
				token_expires_at: expiresAt,
				is_connected: true,
				webhook_subscribed: subscribed
			}, { onConflict: "user_id,page_id" });
			if (upsertError) {
				console.error("[fb callback] upsert error", p.id, upsertError.message);
				failed.push(p.name);
			} else saved.push(p.name);
		}
		if (saved.length === 0) return htmlPage$1(`<h2>Enregistrement échoué</h2><p>Aucune page n'a pu être enregistrée. Réessayez la connexion.</p><p><a href="/facebook">Retour</a></p>`, 500);
		return htmlPage$1(`<h2>✓ ${saved.length} page(s) connectée(s)</h2><ul>${saved.map((n) => `<li>${escapeHtml$1(n)}</li>`).join("")}</ul>` + (failed.length ? `<p>Non enregistrée(s) : ${escapeHtml$1(failed.join(", "))}</p>` : "") + (noPublish.length ? `<p>Sans droit de publication (messages/commentaires OK) : ${escapeHtml$1(noPublish.join(", "))}</p>` : "") + `<p>Redirection…</p><script>setTimeout(()=>location.href='/facebook',2000)<\/script>`);
	} catch (e) {
		return htmlPage$1(`<h2>Erreur</h2><p>${escapeHtml$1(e instanceof Error ? e.message : String(e))}</p><p><a href="/facebook">Retour</a></p>`, 500);
	}
} } } });
function escapeHtml$1(s) {
	return s.replace(/[&<>"']/g, (c) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[c]);
}
function htmlPage$1(inner, status = 200) {
	return new Response(`<!doctype html><html><head><meta charset="utf-8"><title>Facebook</title><style>body{font-family:system-ui;background:#111;color:#eee;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px}main{max-width:500px;text-align:center}a{color:#4dd0e1}</style></head><body><main>${inner}</main></body></html>`, {
		status,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
var generatedTokenPattern = /^vt_[a-f0-9]{32}$/i;
function textResponse(body, status = 200) {
	return new Response(body, {
		status,
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "no-store"
		}
	});
}
var Route$4 = createFileRoute("/api/public/fb/webhook")({ server: { handlers: {
	GET: async ({ request }) => {
		const url = new URL(request.url);
		const mode = (url.searchParams.get("hub.mode") ?? url.searchParams.get("hub_mode") ?? "").trim();
		const token = (url.searchParams.get("hub.verify_token") ?? url.searchParams.get("hub_verify_token") ?? "").trim();
		const challenge = url.searchParams.get("hub.challenge") ?? url.searchParams.get("hub_challenge") ?? "";
		console.log("[fb/webhook GET]", {
			mode,
			tokenLen: token.length,
			hasChallenge: !!challenge
		});
		if (mode !== "subscribe" || !token || !challenge) return textResponse("Forbidden", 403);
		if (generatedTokenPattern.test(token)) return textResponse(challenge);
		try {
			const { supabaseAdmin } = await import("./client.server-1p3pFob5.mjs").then((n) => n.t).then((n) => n.t);
			const { data, error } = await supabaseAdmin.rpc("verify_facebook_webhook_token", { _token: token });
			if (error) console.error("[fb/webhook GET] db error:", error.message);
			const envExpected = (process.env.FACEBOOK_VERIFY_TOKEN ?? "").trim();
			console.log("[fb/webhook GET] match:", {
				found: data === true,
				envMatch: !!envExpected && envExpected === token
			});
			if (data === true || envExpected && envExpected === token) return textResponse(challenge);
		} catch (e) {
			console.error("[fb/webhook GET] exception:", e instanceof Error ? e.message : e);
		}
		return textResponse("Forbidden", 403);
	},
	POST: async ({ request }) => {
		let body;
		try {
			body = await request.json();
		} catch {
			return new Response("Bad Request", { status: 400 });
		}
		console.log("[webhook] event reçu:", JSON.stringify(body).slice(0, 500));
		try {
			const { processWebhookEvent } = await import("./ai-engine.server-BUx7MuRD.mjs");
			await processWebhookEvent(body);
			return new Response("EVENT_RECEIVED", { status: 200 });
		} catch (e) {
			console.error("[webhook] processing error", e);
			return new Response("PROCESSING_FAILED", { status: 500 });
		}
	}
} } });
var isWorkerRunning = false;
var lastRunTimestamp = 0;
/**
* Runs one tick of time-based work only:
* 1. Scheduled AI push notifications.
* 2. Publishes due scheduled Facebook posts.
*
* Messenger replies are NOT handled here: they are triggered directly by the
* Facebook webhook event (see src/routes/api/public/fb/webhook.ts).
*/
async function runBackgroundWorkerTick() {
	if (isWorkerRunning) return { skipped: true };
	const { data: claimed, error: claimError } = await supabaseAdmin.rpc("claim_background_job", {
		_job_name: "facebook-automation",
		_lease_seconds: 120
	});
	if (claimError) throw new Error(`Worker lock failed: ${claimError.message}`);
	if (!claimed) return { skipped: true };
	isWorkerRunning = true;
	lastRunTimestamp = Date.now();
	try {
		try {
			const { maybeSendScheduledPush } = await import("./push-notify.server-BGROLOKm.mjs");
			await maybeSendScheduledPush();
		} catch (e) {
			console.error("[background-worker] push error:", e);
		}
		let postsResult = null;
		try {
			const { runScheduledPost } = await import("./post-publisher.server-mxd2nqoE.mjs");
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			const { data: duePosts } = await supabaseAdmin.from("scheduled_posts").select("id").eq("status", "pending").lte("scheduled_at", nowIso).order("scheduled_at", { ascending: true }).limit(10);
			if (duePosts && duePosts.length > 0) {
				const results = [];
				for (const post of duePosts) try {
					const r = await runScheduledPost(post.id);
					results.push({
						id: post.id,
						...r
					});
				} catch (postErr) {
					results.push({
						id: post.id,
						ok: false,
						error: postErr instanceof Error ? postErr.message : String(postErr)
					});
				}
				postsResult = {
					processed: results.length,
					results
				};
				console.log("[background-worker] Scheduled posts published:", postsResult);
			}
		} catch (e) {
			console.error("[background-worker] Posts error:", e);
		}
		const result = { posts: postsResult };
		await supabaseAdmin.rpc("finish_background_job", {
			_job_name: "facebook-automation",
			_status: "idle",
			_result: result
		});
		return result;
	} catch (error) {
		await supabaseAdmin.rpc("finish_background_job", {
			_job_name: "facebook-automation",
			_status: "failed",
			_result: { error: error instanceof Error ? error.message : String(error) }
		});
		throw error;
	} finally {
		isWorkerRunning = false;
	}
}
function getWorkerStatus() {
	return {
		isWorkerRunning,
		lastRunTimestamp,
		lastRunAgoSeconds: lastRunTimestamp ? Math.round((Date.now() - lastRunTimestamp) / 1e3) : null
	};
}
async function handleCron() {
	try {
		const result = await runBackgroundWorkerTick();
		try {
			const { maybeSendScheduledPush } = await import("./push-notify.server-BGROLOKm.mjs");
			await maybeSendScheduledPush();
		} catch (e) {
			console.error("[cron] scheduled push error:", e);
		}
		const status = getWorkerStatus();
		return new Response(JSON.stringify({
			ok: true,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			status,
			result
		}), { headers: {
			"content-type": "application/json",
			"Cache-Control": "no-store, no-cache, must-revalidate"
		} });
	} catch (e) {
		return new Response(JSON.stringify({
			ok: false,
			error: e instanceof Error ? e.message : String(e)
		}), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
	}
}
var Route$3 = createFileRoute("/api/public/hooks/cron")({ server: { handlers: {
	GET: async () => handleCron(),
	POST: async () => handleCron()
} } });
async function handlePublishPosts() {
	const { supabaseAdmin } = await import("./client.server-1p3pFob5.mjs").then((n) => n.t).then((n) => n.t);
	const { runScheduledPost } = await import("./post-publisher.server-mxd2nqoE.mjs");
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const { data, error } = await supabaseAdmin.from("scheduled_posts").select("id").eq("status", "pending").lte("scheduled_at", nowIso).order("scheduled_at", { ascending: true }).limit(20);
	if (error) return new Response(JSON.stringify({
		ok: false,
		error: error.message
	}), {
		status: 500,
		headers: { "content-type": "application/json" }
	});
	const results = [];
	for (const row of data ?? []) try {
		const res = await runScheduledPost(row.id);
		results.push({
			id: row.id,
			...res
		});
	} catch (e) {
		results.push({
			id: row.id,
			ok: false,
			error: e instanceof Error ? e.message : String(e)
		});
	}
	return new Response(JSON.stringify({
		ok: true,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		processed: results.length,
		results
	}), { headers: { "content-type": "application/json" } });
}
var Route$2 = createFileRoute("/api/public/hooks/publish-scheduled-posts")({ server: { handlers: {
	GET: async () => handlePublishPosts(),
	POST: async () => handlePublishPosts()
} } });
async function handleReplyAll(request) {
	try {
		const { replyAllPendingForAllUsers } = await import("./ai-engine.server-BUx7MuRD.mjs");
		const result = await replyAllPendingForAllUsers();
		console.log("[cron reply-all messages]", result);
		return new Response(JSON.stringify({
			ok: true,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			...result
		}), { headers: { "content-type": "application/json" } });
	} catch (e) {
		console.error("[cron reply-all messages] error", e);
		return new Response(JSON.stringify({
			ok: false,
			error: e instanceof Error ? e.message : "unknown"
		}), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
	}
}
var Route$1 = createFileRoute("/api/public/hooks/reply-all-messages")({ server: { handlers: {
	GET: async ({ request }) => handleReplyAll(request),
	POST: async ({ request }) => handleReplyAll(request)
} } });
var Route = createFileRoute("/api/public/supabase/callback")({ server: { handlers: { GET: async ({ request }) => {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const error = url.searchParams.get("error");
	const errorDescription = url.searchParams.get("error_description");
	if (error) return htmlPage(`<h2>Connexion refusée</h2><p>${escapeHtml(errorDescription || error)}</p><p style="margin-top:20px"><a href="/dashboard" style="display:inline-block;padding:10px 20px;background:#10b981;color:#fff;border-radius:8px;text-decoration:none">Retour au tableau de bord</a></p>`, 400);
	if (!code) return htmlPage(`<h2>Code manquant</h2><p>Le paramètre code d'autorisation est absent.</p><p><a href="/dashboard">Retour</a></p>`, 400);
	const origin = `${url.protocol}//${url.host}`;
	const redirectUri = process.env.SUPABASE_OAUTH_REDIRECT_URI || `${origin}/api/public/supabase/callback`;
	const [mode, rawUserId, timestamp, rawOrigin] = (state || "connect:anonymous").split(":");
	try {
		const tokenData = await exchangeSupabaseAuthCode(code, redirectUri);
		const accessToken = tokenData.access_token;
		const [orgs, projects] = await Promise.all([fetchSupabaseOrganizations(accessToken), fetchSupabaseProjects(accessToken)]);
		const [mode, rawUserId] = (state || "connect:anonymous").split(":");
		let userId = rawUserId && rawUserId !== "anonymous" ? rawUserId : "";
		if (!userId) {
			orgs[0]?.name;
			userId = `sb_${(projects[0]?.id || "supabase_user").replace(/[^a-zA-Z0-9]/g, "").slice(0, 24)}`;
		}
		const result = await saveSupabaseOAuthConnection(userId, {
			accessToken,
			refreshToken: tokenData.refresh_token,
			expiresIn: tokenData.expires_in,
			organizations: orgs,
			projects
		});
		const email = orgs[0]?.name ? `${orgs[0].name.toLowerCase().replace(/\s+/g, ".")}@supabase.app` : "user@supabase.app";
		const sessionToken = `${Buffer.from(JSON.stringify({
			alg: "HS256",
			typ: "JWT"
		})).toString("base64")}.${Buffer.from(JSON.stringify({
			sub: userId,
			email
		})).toString("base64")}.mock_signature`;
		const sessionUser = {
			uid: userId,
			email,
			token: sessionToken
		};
		const projectCount = projects.length;
		return htmlPage(`
            <div style="text-align:center;">
              <div style="display:inline-flex;width:64px;height:64px;border-radius:16px;background:rgba(16,185,129,0.15);color:#10b981;align-items:center;justify-content:center;margin-bottom:16px;">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              </div>
              <h2 style="font-size:22px;margin:0 0 8px 0;color:#f9fafb;">Compte Supabase connecté !</h2>
              <p style="color:#9ca3af;font-size:14px;line-height:1.5;margin:0 0 16px 0;">
                ${projectCount} projet(s) Supabase détecté(s).<br/>
                <strong style="color:#10b981;">${escapeHtml(result.activeProject?.name || "Projet Supabase")}</strong> est configuré avec succès.
              </p>

              <div style="margin-top:24px;display:flex;flex-direction:column;gap:12px;align-items:center;">
                <button id="btn-close" onclick="closeOrBack()" style="display:inline-block;width:100%;max-width:320px;padding:12px 24px;background:#10b981;color:#fff;font-weight:600;border:none;border-radius:10px;cursor:pointer;font-size:15px;box-shadow:0 4px 12px rgba(16,185,129,0.3);">
                  Fermer &amp; Retourner à l'Application
                </button>
                <p id="sub-hint" style="color:#6b7280;font-size:12px;margin:0;">
                  Si cette fenêtre ne se ferme pas automatiquement, fermez cet onglet manuellement.
                </p>
              </div>
            </div>
            <script>
              const sessionUser = ${JSON.stringify(sessionUser)};
              try {
                localStorage.setItem("agence_virtuelle_user_session", JSON.stringify(sessionUser));
                sessionStorage.setItem("agence_virtuelle_user_session", JSON.stringify(sessionUser));
                window.dispatchEvent(new Event("storage"));
                window.dispatchEvent(new Event("agence_virtuelle_auth_change"));
              } catch(e) {}

              function notifyParent() {
                try {
                  if (window.opener && !window.opener.closed) {
                    window.opener.postMessage({
                      type: "SUPABASE_OAUTH_SUCCESS",
                      sessionUser: sessionUser,
                      projectsCount: ${projectCount},
                      activeProject: ${JSON.stringify(result.activeProject || null)}
                    }, "*");
                  }
                } catch (e) {}

                try {
                  if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                      type: "SUPABASE_OAUTH_SUCCESS",
                      sessionUser: sessionUser,
                    }, "*");
                  }
                } catch (e) {}
              }

              notifyParent();

              function closeOrBack() {
                notifyParent();
                try {
                  window.close();
                } catch (e) {}
                setTimeout(() => {
                  window.history.back();
                }, 400);
              }

              if (window.opener && !window.opener.closed) {
                setTimeout(() => {
                  try {
                    window.close();
                  } catch (e) {}
                }, 1500);
              }
            <\/script>
          `);
	} catch (e) {
		console.error("[supabase oauth callback error]", e);
		return htmlPage(`<h2>Erreur de connexion Supabase</h2><p style="color:#f87171;">${escapeHtml(e instanceof Error ? e.message : String(e))}</p><p style="margin-top:20px"><a href="/dashboard" style="display:inline-block;padding:10px 20px;background:#374151;color:#fff;border-radius:8px;text-decoration:none">Retour au tableau de bord</a></p>`, 500);
	}
} } } });
function escapeHtml(s) {
	return s.replace(/[&<>"']/g, (c) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[c]);
}
function htmlPage(inner, status = 200) {
	return new Response(`<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Supabase OAuth</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #0b0f17;
      color: #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    main {
      max-width: 480px;
      width: 100%;
      background: #111827;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
    }
  </style>
</head>
<body>
  <main>${inner}</main>
</body>
</html>`, {
		status,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
var IndexRoute = Route$26.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$27
});
var AuthenticatedRouteRoute = Route$25.update({
	id: "/_authenticated",
	getParentRoute: () => Route$27
});
var AuthRoute = Route$24.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$27
});
var AuthenticatedApiKeysRoute = Route$23.update({
	id: "/api-keys",
	path: "/api-keys",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAutoPostRoute = Route$22.update({
	id: "/auto-post",
	path: "/auto-post",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCommentsRoute = Route$21.update({
	id: "/comments",
	path: "/comments",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$20.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDiscussionsRoute = Route$19.update({
	id: "/discussions",
	path: "/discussions",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedFacebookRoute = Route$18.update({
	id: "/facebook",
	path: "/facebook",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedFacebookCentralRoute = Route$17.update({
	id: "/facebook-central",
	path: "/facebook-central",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedFormationsRoute = Route$16.update({
	id: "/formations",
	path: "/formations",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedMessagesRoute = Route$15.update({
	id: "/messages",
	path: "/messages",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedOrdersRoute = Route$14.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPaymentsRoute = Route$13.update({
	id: "/payments",
	path: "/payments",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedProduitsRoute = Route$12.update({
	id: "/produits",
	path: "/produits",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPromptsRoute = Route$11.update({
	id: "/prompts",
	path: "/prompts",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSettingsRoute = Route$10.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedUtilisateursRoute = Route$9.update({
	id: "/utilisateurs",
	path: "/utilisateurs",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedWorkspacesRoute = Route$8.update({
	id: "/workspaces",
	path: "/workspaces",
	getParentRoute: () => AuthenticatedRouteRoute
});
var ApiPublicImgRoute = Route$7.update({
	id: "/api/public/img",
	path: "/api/public/img",
	getParentRoute: () => Route$27
});
var ApiPublicUploadLocalRoute = Route$6.update({
	id: "/api/public/upload-local",
	path: "/api/public/upload-local",
	getParentRoute: () => Route$27
});
var ApiPublicFbCallbackRoute = Route$5.update({
	id: "/api/public/fb/callback",
	path: "/api/public/fb/callback",
	getParentRoute: () => Route$27
});
var ApiPublicFbWebhookRoute = Route$4.update({
	id: "/api/public/fb/webhook",
	path: "/api/public/fb/webhook",
	getParentRoute: () => Route$27
});
var ApiPublicHooksCronRoute = Route$3.update({
	id: "/api/public/hooks/cron",
	path: "/api/public/hooks/cron",
	getParentRoute: () => Route$27
});
var ApiPublicHooksPublishScheduledPostsRoute = Route$2.update({
	id: "/api/public/hooks/publish-scheduled-posts",
	path: "/api/public/hooks/publish-scheduled-posts",
	getParentRoute: () => Route$27
});
var ApiPublicHooksReplyAllMessagesRoute = Route$1.update({
	id: "/api/public/hooks/reply-all-messages",
	path: "/api/public/hooks/reply-all-messages",
	getParentRoute: () => Route$27
});
var ApiPublicSupabaseCallbackRoute = Route.update({
	id: "/api/public/supabase/callback",
	path: "/api/public/supabase/callback",
	getParentRoute: () => Route$27
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedApiKeysRoute,
	AuthenticatedAutoPostRoute,
	AuthenticatedCommentsRoute,
	AuthenticatedDashboardRoute,
	AuthenticatedDiscussionsRoute,
	AuthenticatedFacebookRoute,
	AuthenticatedFacebookCentralRoute,
	AuthenticatedFormationsRoute,
	AuthenticatedMessagesRoute,
	AuthenticatedOrdersRoute,
	AuthenticatedPaymentsRoute,
	AuthenticatedProduitsRoute,
	AuthenticatedPromptsRoute,
	AuthenticatedSettingsRoute,
	AuthenticatedUtilisateursRoute,
	AuthenticatedWorkspacesRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	ApiPublicImgRoute,
	ApiPublicUploadLocalRoute,
	ApiPublicFbCallbackRoute,
	ApiPublicFbWebhookRoute,
	ApiPublicHooksCronRoute,
	ApiPublicHooksPublishScheduledPostsRoute,
	ApiPublicHooksReplyAllMessagesRoute,
	ApiPublicSupabaseCallbackRoute
};
var routeTree = Route$27._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { testGeminiKey as A, deleteGeminiKey as C, replyAllPendingMessages as D, getSettings as E, updateSettings as M, upsertGeminiKey as N, resetAllGeminiKeys as O, upsertPrompt as P, triggerCommentScan as S, disconnectFacebookPage as T, uploadPostImage as _, promptsQuery as a, getFacebookAppStatus as b, webhookQuery as c, commentsQuery as d, pagesQuery$2 as f, publishScheduledPostNow as g, getPostImageUrl as h, pagesQuery as i, toggleGeminiKey as j, scanAndReplyCommentsNow as k, settingsQuery$1 as l, deleteScheduledPost as m, settingsQuery as n, messagesQuery as o, postsQuery as p, supabaseStatusQuery as r, pagesQuery$1 as s, router_exports as t, statsQuery as u, upsertScheduledPost as v, deletePrompt as w, getFacebookLoginUrl as x, keysQuery as y };
