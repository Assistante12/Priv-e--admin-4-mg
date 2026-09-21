import "../_runtime.mjs";
import { n as getRequestHost, r as toResponse, t as H3Event } from "../_libs/h3-v2+rou3+srvx.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { E as fromJSON, F as resolveManifestCssLink, G as isRedirect, H as isDangerousProtocol, I as waitForReason, J as rootRouteId, K as parseRedirect, L as _getRenderedMatches, M as getScriptPreloadAttrs, N as getStylesheetHref, O as toCrossJSONAsync, P as resolveManifestAssetLink, R as executeRewriteInput, U as isPromise, Y as isNotFound, a as isSsrResponse, c as stripSsrResponseBody, i as disposeSsrResponse, k as toCrossJSONStream, m as RouterProvider, n as bindSsrResponseToRequest, o as normalizeSsrResponse, r as defineHandlerCallback, s as replaceSsrResponse, t as renderRouterToStream } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as createServerHistory } from "../_libs/tanstack__history.mjs";
import { a as defaultSerovalDeserializerPlugins, i as createRawStreamRPCPlugin, n as attachRouterServerSsrUtils, o as makeSerovalPlugin, r as getNormalizedURL, s as createSerializationAdapter, t as mergeHeaders } from "../_libs/@tanstack/router-core+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { AsyncLocalStorage } from "node:async_hooks";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function StartServer(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouterProvider, { router: props.router });
}
var defaultStreamHandler = defineHandlerCallback(({ request, router, responseHeaders }) => renderRouterToStream({
	request,
	router,
	responseHeaders,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartServer, { router })
}));
var GLOBAL_EVENT_STORAGE_KEY = Symbol.for("tanstack-start:event-storage");
var globalObj$1 = globalThis;
if (!globalObj$1[GLOBAL_EVENT_STORAGE_KEY]) globalObj$1[GLOBAL_EVENT_STORAGE_KEY] = new AsyncLocalStorage();
var eventStorage = globalObj$1[GLOBAL_EVENT_STORAGE_KEY];
function isPromiseLike(value) {
	return typeof value.then === "function";
}
function getSetCookieValues(headers) {
	const headersWithSetCookie = headers;
	if (typeof headersWithSetCookie.getSetCookie === "function") return headersWithSetCookie.getSetCookie();
	const value = headers.get("set-cookie");
	return value ? [value] : [];
}
function mergeEventResponseHeaders(response, event) {
	if (response.ok) return;
	const eventSetCookies = getSetCookieValues(event.res.headers);
	if (eventSetCookies.length === 0) return;
	const responseSetCookies = getSetCookieValues(response.headers);
	response.headers.delete("set-cookie");
	for (const cookie of responseSetCookies) response.headers.append("set-cookie", cookie);
	for (const cookie of eventSetCookies) response.headers.append("set-cookie", cookie);
}
function attachResponseHeaders(value, event) {
	if (isPromiseLike(value)) return value.then((resolved) => {
		if (resolved instanceof Response) mergeEventResponseHeaders(resolved, event);
		return resolved;
	});
	if (value instanceof Response) mergeEventResponseHeaders(value, event);
	return value;
}
function requestHandler(handler) {
	return (request, requestOpts) => {
		let h3Event;
		try {
			h3Event = new H3Event(request);
		} catch (error) {
			if (error instanceof URIError) return new Response(null, {
				status: 400,
				statusText: "Bad Request"
			});
			throw error;
		}
		return toResponse(attachResponseHeaders(eventStorage.run({ h3Event }, () => handler(request, requestOpts)), h3Event), h3Event);
	};
}
function getH3Event() {
	const event = eventStorage.getStore();
	if (!event) throw new Error(`No StartEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
	return event.h3Event;
}
function getRequest() {
	return getH3Event().req;
}
/**
* Get the request hostname.
*
* If `xForwardedHost` is `true`, it will use the `x-forwarded-host` header if it exists.
*
* If no host header is found, it will default to "localhost".
*/
function getRequestHost$1(opts) {
	return getRequestHost(getH3Event(), opts);
}
function getResponse() {
	return getH3Event().res;
}
var HEADERS = { TSS_SHELL: "X-TSS_SHELL" };
/**
* @description Returns the router manifest data that should be sent to the client.
* This includes only the assets and preloads for the current route and any
* special assets that are needed for the client. It does not include relationships
* between routes or any other data that is not needed for the client.
*
* @param matchedRoutes - In dev mode, the matched routes are used to build
* the dev styles URL for route-scoped CSS collection.
*/
async function getStartManifest(matchedRoutes) {
	const { tsrStartManifest } = await import("../_tanstack-start-manifest_v-CWdiWzTE.mjs");
	const startManifest = tsrStartManifest();
	let routes = startManifest.routes;
	routes[rootRouteId];
	const manifestRoutes = {};
	for (const k in routes) {
		const v = routes[k];
		const result = {};
		if (v.preloads && v.preloads.length > 0) result.preloads = v.preloads;
		if (v.scripts && v.scripts.length > 0) result.scripts = v.scripts;
		if (v.css?.length) result.css = v.css;
		if (result.preloads || result.scripts || result.css) manifestRoutes[k] = result;
	}
	return {
		...startManifest.scriptFormat ? { scriptFormat: startManifest.scriptFormat } : {},
		...startManifest.inlineCss ? { inlineCss: startManifest.inlineCss } : {},
		routes: manifestRoutes
	};
}
var manifest = {
	"0199c1b4c7815097660cf09f26437f3e4bd7df28b5b33595a666b42732424271": {
		functionName: "listPaymentMethods_createServerFn_handler",
		importer: () => import("./payment-methods.functions-LF3DfwvR.mjs")
	},
	"095b6437ed3d46ebaa6b6b39fdd5999d3f0a0aa23855f81bc0462589a2f44f79": {
		functionName: "listWorkspaces_createServerFn_handler",
		importer: () => import("./workspace.functions-DlyBIoq9.mjs")
	},
	"0a45c3d251d1b1dcb05cd08b9f7ee1b20aa4759d01463a1ec8d0727bcd43798e": {
		functionName: "setClientIaStopped_createServerFn_handler",
		importer: () => import("./ia-control.functions-CbQL2ulR.mjs")
	},
	"13d291e0d0c62882aa81393904578b21a13e9c7eadd05d974bca25c6a7246cdb": {
		functionName: "getSupabaseAuthUrl_createServerFn_handler",
		importer: () => import("./supabase-oauth.functions-CuqLpYQO.mjs")
	},
	"154b8633eea94111b40f7036631572cb49e5f458d27dce468c3338ae0c0dc0db": {
		functionName: "deleteProduct_createServerFn_handler",
		importer: () => import("./products.functions-DuUeEOiH.mjs")
	},
	"1f4390765d2ca0690b15086abfa82fe927a505b9ae404d08adf9e9291beeeab1": {
		functionName: "triggerCommentScan_createServerFn_handler",
		importer: () => import("./facebook.functions-Ck1dAoP5.mjs")
	},
	"21cf3e4bbf168e8297d295171653de7c91c371f7e7cba88fc6198000c959b283": {
		functionName: "listFacebookPages_createServerFn_handler",
		importer: () => import("./dashboard.functions-B4Ti_bIr.mjs")
	},
	"22294e75c920f7f5aff4ed203a7232ff6ad286b92bc5ec97e17ef2406637688d": {
		functionName: "listPrompts_createServerFn_handler",
		importer: () => import("./dashboard.functions-B4Ti_bIr.mjs")
	},
	"26006c151a1575627edfc051a8c4b48cc6bd0cf2987762f27a8b1bd6e3e135fe": {
		functionName: "assignPageToWorkspace_createServerFn_handler",
		importer: () => import("./facebook-central.functions-BmxLuKHx.mjs")
	},
	"26c1e30da5244238e5a951bad49504d5a522eddf0427dac29c31550b43ff2a63": {
		functionName: "uploadPostImage_createServerFn_handler",
		importer: () => import("./scheduled-posts.functions-DsgyNjE-.mjs")
	},
	"26c96ef8fc4e3f784b8e2f35fdcadaba86bd11aa876dca3aafdda847af0d376d": {
		functionName: "listTrainings_createServerFn_handler",
		importer: () => import("./trainings.functions-CY4aW9W7.mjs")
	},
	"281f8d7a4a4a30294e6b39063c1a7ccc795c3c154f3ea64df4010cec4c7d0a07": {
		functionName: "savePushToken_createServerFn_handler",
		importer: () => import("./push.functions-Do5savU_.mjs")
	},
	"2ddd2bfa1fc5d7513eb5dc4184e00e441687ece8edd28c15245d4d8e7a424b68": {
		functionName: "disconnectFacebookPage_createServerFn_handler",
		importer: () => import("./dashboard.functions-B4Ti_bIr.mjs")
	},
	"35752f15047e6baaefbbae8dbe7f0399344e7c622efdef66edd7735c0b294ad4": {
		functionName: "getTrainingFileUrl_createServerFn_handler",
		importer: () => import("./trainings.functions-CY4aW9W7.mjs")
	},
	"38be6894cbd764a15b04328c350232cf665ced948e0591e2d4d60823412af3f8": {
		functionName: "disconnectSupabaseOAuth_createServerFn_handler",
		importer: () => import("./supabase-oauth.functions-CuqLpYQO.mjs")
	},
	"3b27e249b9f235cc0d3ab7eeb0a30238e4512f505d25d40658be4131ba3dda90": {
		functionName: "getSupabaseOAuthStatus_createServerFn_handler",
		importer: () => import("./supabase-oauth.functions-CuqLpYQO.mjs")
	},
	"3b4a3c54812b4c0b1ed31ec62bbf2a64c77b8c36025f31e942058a97a061226e": {
		functionName: "upsertProduct_createServerFn_handler",
		importer: () => import("./products.functions-DuUeEOiH.mjs")
	},
	"431fdc1077515d748abb5c96ebc180b1df0d50861e7574fba5a690eb92a438f1": {
		functionName: "toggleGeminiKey_createServerFn_handler",
		importer: () => import("./dashboard.functions-B4Ti_bIr.mjs")
	},
	"44cca4472781b72fce225eb66a79e7db8b18f0231cf73c6a965748d52107bf55": {
		functionName: "deleteOrder_createServerFn_handler",
		importer: () => import("./orders.functions-CCWvVOOR.mjs")
	},
	"44ff229f2fc68f08d6074c790f566e1f923bdc284c1f960d9f6c492e910aa32d": {
		functionName: "listConversations_createServerFn_handler",
		importer: () => import("./discussions.functions-konYM5yO.mjs")
	},
	"51ad93d03c52987e0e52d0164e41771f8765a8919d8a537367eaf795dff9b9d8": {
		functionName: "listProducts_createServerFn_handler",
		importer: () => import("./products.functions-DuUeEOiH.mjs")
	},
	"51b547fe6c95f50b05cc8150afd34c0b3f3a304f79e38fb5dd56c9b964ebe0b8": {
		functionName: "addTrainingFile_createServerFn_handler",
		importer: () => import("./trainings.functions-CY4aW9W7.mjs")
	},
	"5223d0c7cf3d331be96dcbbd38a887c75555c82c8eef791ef89311e31dc3d215": {
		functionName: "sendDiscussionMessage_createServerFn_handler",
		importer: () => import("./discussions.functions-konYM5yO.mjs")
	},
	"52e8f902c3ab8fa862e987e3d3a360c9ae5dcdd4c2e2b2bba2ce1c12f955e7dc": {
		functionName: "getAdminUsersOverview_createServerFn_handler",
		importer: () => import("./admin-overview.functions-CVIS-Oa6.mjs")
	},
	"55c70ed2a1bb2110bea0e0d3e4e7b032555a10c0f442f3aad1da31e755b10b21": {
		functionName: "getWorkspaceAccess_createServerFn_handler",
		importer: () => import("./workspace.functions-DlyBIoq9.mjs")
	},
	"55fc0484b9941926147081b475de8d7569a7391edff13c9e7550b50cc47da0d3": {
		functionName: "deletePaymentMethod_createServerFn_handler",
		importer: () => import("./payment-methods.functions-LF3DfwvR.mjs")
	},
	"596aa7c79f858ba0682bfe9e9bfba0a5a12ada404e5976030cd39d78ac663352": {
		functionName: "deletePrompt_createServerFn_handler",
		importer: () => import("./dashboard.functions-B4Ti_bIr.mjs")
	},
	"606264e0a388f27dbafffa543b5bf4b33dfa30de245439d75095d08fc10fc472": {
		functionName: "publishScheduledPostNow_createServerFn_handler",
		importer: () => import("./scheduled-posts.functions-DsgyNjE-.mjs")
	},
	"60ee1005f84247891096138c5b4921ff016a26e42aee0a2dc5d9251252d761a7": {
		functionName: "createImageUploadUrl_createServerFn_handler",
		importer: () => import("./scheduled-posts.functions-DsgyNjE-.mjs")
	},
	"65cfd0d1bb1135624470e7931b9aa3fc11ef75b26198cc410b16f6bd13656ea6": {
		functionName: "replyAllPendingMessages_createServerFn_handler",
		importer: () => import("./dashboard.functions-B4Ti_bIr.mjs")
	},
	"683af635b16340adf571c0ca2f7a6bfacf490bf231cf9e4b78df7c3ad9355fbe": {
		functionName: "getPushState_createServerFn_handler",
		importer: () => import("./push.functions-Do5savU_.mjs")
	},
	"6f0ea51432a5d025936e137e19dc67176b59a1a8a31db1d05b16c0f2761b9ba6": {
		functionName: "deleteScheduledPost_createServerFn_handler",
		importer: () => import("./scheduled-posts.functions-DsgyNjE-.mjs")
	},
	"7180026c600c721a62b1ac583b5fea60a9a24b9cef2c2e9d29b375367c760773": {
		functionName: "getSettings_createServerFn_handler",
		importer: () => import("./dashboard.functions-B4Ti_bIr.mjs")
	},
	"730ed6e4e7255918c116c7b35ee9bf18148348ef1ca23464d0e2621431b05eba": {
		functionName: "removePushDevice_createServerFn_handler",
		importer: () => import("./push.functions-Do5savU_.mjs")
	},
	"73194ecd5678bb8991c7deca8a6ecf50be7fccd1d7dcc7e8df175a99f5e1d987": {
		functionName: "uploadProductImageServer_createServerFn_handler",
		importer: () => import("./products.functions-DuUeEOiH.mjs")
	},
	"7360a65b44b390ce454157541ae48f1b17feecce8fdb6b9e8a5af44cfc399626": {
		functionName: "updateSettings_createServerFn_handler",
		importer: () => import("./dashboard.functions-B4Ti_bIr.mjs")
	},
	"73a2572a6273eb80963faa0325ca5f780d925c2f61992189cab1957cc94b584c": {
		functionName: "listConversationMessages_createServerFn_handler",
		importer: () => import("./discussions.functions-konYM5yO.mjs")
	},
	"744b6be0a8526d2232e099596abc01cd200195c5b263342ffdad45ca40c4d37d": {
		functionName: "createWorkspace_createServerFn_handler",
		importer: () => import("./workspace.functions-DlyBIoq9.mjs")
	},
	"77cbf8b7a360c88aa467c19f7d3bd7de806ac6a7af905570781567f7fae073ce": {
		functionName: "deleteProductImage_createServerFn_handler",
		importer: () => import("./products.functions-DuUeEOiH.mjs")
	},
	"79c4b70547f4d45ba8b25ff4145bb6b048815b5b5d75e1584fedbd5d07368346": {
		functionName: "testGeminiKey_createServerFn_handler",
		importer: () => import("./dashboard.functions-B4Ti_bIr.mjs")
	},
	"7a9e83ca489366d7ffab2aacbcb4ec98ba75f6b93aff08fb46695dd1366cc853": {
		functionName: "addProductImage_createServerFn_handler",
		importer: () => import("./products.functions-DuUeEOiH.mjs")
	},
	"7bdf26987ed3e55771579c731ccfe1d76586780ba65644698a45f4f777e085ea": {
		functionName: "switchWorkspace_createServerFn_handler",
		importer: () => import("./workspace.functions-DlyBIoq9.mjs")
	},
	"7e9f7fa28e2987c330379f6e374f4c3618a05ac8203f5c0dbaf2800c14e867e5": {
		functionName: "selectSupabaseProject_createServerFn_handler",
		importer: () => import("./supabase-oauth.functions-CuqLpYQO.mjs")
	},
	"7f92d135aa3763ddd5bf6d4d9f84832b6b591cbaa35dcc4048b4b1beed8e7bf3": {
		functionName: "createOrder_createServerFn_handler",
		importer: () => import("./orders.functions-CCWvVOOR.mjs")
	},
	"84f6237ee7a4389bfd3d9596a4a7980368f4e83bdae80dad74e0027555a07dca": {
		functionName: "deleteWorkspace_createServerFn_handler",
		importer: () => import("./workspace.functions-DlyBIoq9.mjs")
	},
	"853b5aa544a7c0a49cc45c1a0f420af5e069af898c609aa61d87c33899afd2a3": {
		functionName: "upsertPaymentMethod_createServerFn_handler",
		importer: () => import("./payment-methods.functions-LF3DfwvR.mjs")
	},
	"87b48a15a2993590ed8642c04e9de2e2617f1ef7f86807a8bf228d2360113983": {
		functionName: "getPostImageUrl_createServerFn_handler",
		importer: () => import("./scheduled-posts.functions-DsgyNjE-.mjs")
	},
	"91a8eecef9cce275b1bcb4f6a44a4288b429b0bb0588b3234612a3a16f91508f": {
		functionName: "upsertPrompt_createServerFn_handler",
		importer: () => import("./dashboard.functions-B4Ti_bIr.mjs")
	},
	"95246831230c95276ad5d4ee921579cda1a13417f2a194a5623544593101248d": {
		functionName: "listCentralPages_createServerFn_handler",
		importer: () => import("./facebook-central.functions-BmxLuKHx.mjs")
	},
	"958d450de5ff86fd27160e5f846f99500d27f1037c20002fe121e01fe947364e": {
		functionName: "resetWorkspacePassword_createServerFn_handler",
		importer: () => import("./workspace.functions-DlyBIoq9.mjs")
	},
	"95aa0993c677a6cf427851fb1bcc47b79d931004e6f2df36c7c12428a49bea95": {
		functionName: "upsertScheduledPost_createServerFn_handler",
		importer: () => import("./scheduled-posts.functions-DsgyNjE-.mjs")
	},
	"9799f0b09a19e6992f33a37c049e6a3d7a222b6a60dec8fbce4a1f064e1d1c04": {
		functionName: "getFacebookAppStatus_createServerFn_handler",
		importer: () => import("./facebook.functions-Ck1dAoP5.mjs")
	},
	"98818ae7a9ff12f23f7c580d09e55be8912eccd6ddf1cdf008c191baa8cf9d89": {
		functionName: "listGeminiKeys_createServerFn_handler",
		importer: () => import("./dashboard.functions-B4Ti_bIr.mjs")
	},
	"998a320da8868de47b7f62f38b334dee4911168eb7b2e4f328a373002fcd2d71": {
		functionName: "listClientIaStates_createServerFn_handler",
		importer: () => import("./ia-control.functions-CbQL2ulR.mjs")
	},
	"9c65ac5b7e6229cbdf1347b00d03d472fd8c79453f8b7d2b617bfed516627065": {
		functionName: "refreshCentralPages_createServerFn_handler",
		importer: () => import("./facebook-central.functions-BmxLuKHx.mjs")
	},
	"a6d2a211946cef37fc5004f226984e8fa811b98cd390031aac4d5759fbca9dcc": {
		functionName: "deleteTraining_createServerFn_handler",
		importer: () => import("./trainings.functions-CY4aW9W7.mjs")
	},
	"b1210d9098378b1f0d6e15450419b1f306257d88168cd5ba8e6ea95cf6d44297": {
		functionName: "unlockWorkspace_createServerFn_handler",
		importer: () => import("./workspace.functions-DlyBIoq9.mjs")
	},
	"b2bcf1957c4e3511e2df455156a0eee94fbd878d1f8ed6ed23038bfff09c5e30": {
		functionName: "upsertTraining_createServerFn_handler",
		importer: () => import("./trainings.functions-CY4aW9W7.mjs")
	},
	"b5e84fec666cd2831592eea985291bfa7fa56c8690bbe5aabf157eddbf425261": {
		functionName: "renameWorkspace_createServerFn_handler",
		importer: () => import("./workspace.functions-DlyBIoq9.mjs")
	},
	"b98af9bc0a51d23bfe05371676bf39064b411693ecf0f38b1f8556d241260712": {
		functionName: "upsertGeminiKey_createServerFn_handler",
		importer: () => import("./dashboard.functions-B4Ti_bIr.mjs")
	},
	"b9f30ce6a4071891794479f7d27d25c842df0267400e85f2ac6eede00fd27714": {
		functionName: "getPostVideoUrl_createServerFn_handler",
		importer: () => import("./scheduled-posts.functions-DsgyNjE-.mjs")
	},
	"c09f0318d87fcdc7fd0e3c75e13bd71e9885a312708ec77cee06f0ab9a895a7f": {
		functionName: "setAutoAiPush_createServerFn_handler",
		importer: () => import("./push.functions-Do5savU_.mjs")
	},
	"c735f2002ab50508e803574d0ff1c9be845aa8f917d54b0697bca4e23f0d6d5c": {
		functionName: "deleteTrainingFile_createServerFn_handler",
		importer: () => import("./trainings.functions-CY4aW9W7.mjs")
	},
	"c74f0594f7f044233a3b6b96fbd193b3c7348d55356d196254980d7826a96194": {
		functionName: "unlockWorkspaceByEmail_createServerFn_handler",
		importer: () => import("./workspace.functions-DlyBIoq9.mjs")
	},
	"c87d3af86ef10128ec35f624eda337caedec16f84c61e48c1836c50fcd6d3157": {
		functionName: "createVideoUploadUrl_createServerFn_handler",
		importer: () => import("./scheduled-posts.functions-DsgyNjE-.mjs")
	},
	"cd0fad7448fbb7d18ba577ec8d718dd65caa20365abe596f4288d3db166d937b": {
		functionName: "listScheduledPosts_createServerFn_handler",
		importer: () => import("./scheduled-posts.functions-DsgyNjE-.mjs")
	},
	"ce3247af923fb83e1b50e04a2d3399abe6b8ac7e9c8330b2019de9668492b17f": {
		functionName: "updateOrderStatus_createServerFn_handler",
		importer: () => import("./orders.functions-CCWvVOOR.mjs")
	},
	"d8dd0f2f33ee8ce5e2ea2bfc749715b8e981950fa8bc0e14ec15d540b50039e9": {
		functionName: "getDashboardStats_createServerFn_handler",
		importer: () => import("./dashboard.functions-B4Ti_bIr.mjs")
	},
	"e004c3669ad9314e0f13dd8e45194bd1d7a95f814599b1d8484097691817695f": {
		functionName: "listOrders_createServerFn_handler",
		importer: () => import("./orders.functions-CCWvVOOR.mjs")
	},
	"e2747fa41361a15b2a26fb26a682fedb2197229f300f56e975795e2c0286b8a5": {
		functionName: "getWebhookConfig_createServerFn_handler",
		importer: () => import("./facebook.functions-Ck1dAoP5.mjs")
	},
	"e56f08e782ecfec6c325cc6510b7357e1d5baa16daa0ef608ba50fed9b68ad5a": {
		functionName: "setGlobalIaStopped_createServerFn_handler",
		importer: () => import("./ia-control.functions-CbQL2ulR.mjs")
	},
	"e6337cca79f25f5c42e4e59721fa6ecdcd59b09572eb1c98391c8bea6445e149": {
		functionName: "unassignPage_createServerFn_handler",
		importer: () => import("./facebook-central.functions-BmxLuKHx.mjs")
	},
	"e9c551c5997021134409eb261e33aedfa05172b0edcea8974945a04fa951f6f7": {
		functionName: "getAiQuotaHealth_createServerFn_handler",
		importer: () => import("./ai-health.functions-CouNDUuS.mjs")
	},
	"eacf47008cfd5e8686328db3e67a861b35d3e4dc7eaacfc7e329e4f0af70dce8": {
		functionName: "resetAllGeminiKeys_createServerFn_handler",
		importer: () => import("./dashboard.functions-B4Ti_bIr.mjs")
	},
	"f2f261a9018114c20819bed7223868573b1844bca6dec0694d67ff45108c4484": {
		functionName: "getFacebookLoginUrl_createServerFn_handler",
		importer: () => import("./facebook.functions-Ck1dAoP5.mjs")
	},
	"f31d964c77892d35771aa382027324a6d76bd117650d79ef2dafac636002fcd4": {
		functionName: "listMessagesLog_createServerFn_handler",
		importer: () => import("./dashboard.functions-B4Ti_bIr.mjs")
	},
	"f58b21b44b8a2a06145fee076324bf6c4b16dc1ba81aa78a98b43fae6cea4152": {
		functionName: "sendTestPush_createServerFn_handler",
		importer: () => import("./push.functions-Do5savU_.mjs")
	},
	"f770295ee07e79c3983bbd819b49f4d50137501c481a020f3acdf578fd2d4435": {
		functionName: "deleteGeminiKey_createServerFn_handler",
		importer: () => import("./dashboard.functions-B4Ti_bIr.mjs")
	},
	"f876bdfd1ef92e97f9fb83763eb26e3df07e33c2b4dac416805d20505ad8158c": {
		functionName: "scanAndReplyCommentsNow_createServerFn_handler",
		importer: () => import("./dashboard.functions-B4Ti_bIr.mjs")
	},
	"fead9bb27632cd7f0a02f5753aad7882e325726d0656d34709ae381e1cc5ee31": {
		functionName: "uploadTrainingFileServer_createServerFn_handler",
		importer: () => import("./trainings.functions-CY4aW9W7.mjs")
	},
	"ff748145b51d921c6cb74e3f40429aa995ca5cee9335a287e920ef615aa11913": {
		functionName: "listCommentsLog_createServerFn_handler",
		importer: () => import("./dashboard.functions-B4Ti_bIr.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ??= await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
var TSS_FORMDATA_CONTEXT = "__TSS_CONTEXT";
var TSS_SERVER_FUNCTION = Symbol.for("TSS_SERVER_FUNCTION");
var TSS_SERVER_FUNCTION_FACTORY = Symbol.for("TSS_SERVER_FUNCTION_FACTORY");
var X_TSS_SERIALIZED = "x-tss-serialized";
var X_TSS_RAW_RESPONSE = "x-tss-raw";
/** Content-Type for multiplexed framed responses (RawStream support) */
var TSS_CONTENT_TYPE_FRAMED = "application/x-tss-framed";
/** Largest payload accepted by one framed-protocol record. */
var MAX_FRAME_PAYLOAD_SIZE = 16777216;
/** Largest number of raw streams accepted in one framed response. */
var MAX_FRAMED_STREAMS = 1024;
/** Full Content-Type header value with version parameter */
var TSS_CONTENT_TYPE_FRAMED_VERSIONED = `${TSS_CONTENT_TYPE_FRAMED}; v=1`;
var GLOBAL_STORAGE_KEY = Symbol.for("tanstack-start:start-storage-context");
var globalObj = globalThis;
if (!globalObj[GLOBAL_STORAGE_KEY]) globalObj[GLOBAL_STORAGE_KEY] = new AsyncLocalStorage();
var startStorage = globalObj[GLOBAL_STORAGE_KEY];
async function runWithStartContext(context, fn) {
	return startStorage.run(context, fn);
}
function getStartContext(opts) {
	const context = startStorage.getStore();
	if (!context && opts?.throwIfNotFound !== false) throw new Error(`No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
	return context;
}
var getStartOptions = () => getStartContext().startOptions;
/** Start's serialization adapters followed by `routerPlugins`. */
function getSerovalPlugins(routerPlugins) {
	return [...(getStartOptions()?.serializationAdapters)?.map(makeSerovalPlugin) ?? [], ...routerPlugins];
}
/**
* Binary frame protocol for multiplexing JSON and raw streams over HTTP.
*
* Frame format: [type:1][streamId:4][length:4][payload:length]
* - type: 1 byte - frame type (JSON, CHUNK, END, ERROR)
* - streamId: 4 bytes big-endian uint32 - stream identifier
* - length: 4 bytes big-endian uint32 - payload length
* - payload: variable length bytes
*/
/** Cached TextEncoder for frame encoding */
var textEncoder$1 = new TextEncoder();
/** Shared empty payload for END frames - avoids allocation per call */
var EMPTY_PAYLOAD = /* @__PURE__ */ new Uint8Array(0);
var MAX_ERROR_MESSAGE_CODE_UNITS = 4096;
/**
* Encodes a single frame with header and payload.
*/
function encodeFrame(type, streamId, payload) {
	if (payload.byteLength > 16777216) throw new RangeError(`Frame payload exceeds ${MAX_FRAME_PAYLOAD_SIZE} bytes`);
	const frame = new Uint8Array(9 + payload.length);
	frame[0] = type;
	frame[1] = streamId >>> 24 & 255;
	frame[2] = streamId >>> 16 & 255;
	frame[3] = streamId >>> 8 & 255;
	frame[4] = streamId & 255;
	frame[5] = payload.length >>> 24 & 255;
	frame[6] = payload.length >>> 16 & 255;
	frame[7] = payload.length >>> 8 & 255;
	frame[8] = payload.length & 255;
	frame.set(payload, 9);
	return frame;
}
/** Encodes an error message payload, truncated to a bounded length. */
function encodeErrorPayload(error) {
	const originalMessage = error instanceof Error ? error.message : String(error ?? "Unknown error");
	const message = originalMessage.length > MAX_ERROR_MESSAGE_CODE_UNITS ? `${originalMessage.slice(0, MAX_ERROR_MESSAGE_CODE_UNITS)}…` : originalMessage;
	return textEncoder$1.encode(message);
}
/**
* Creates a multiplexed ReadableStream from serialized response records.
*
* A record's JSON frame is admitted before any raw stream referenced by that
* record starts. Raw streams from admitted records are pumped concurrently.
* The caller bounds the stream count before records reach this function.
*/
function createMultiplexedStream(recordStream, options = {}) {
	let controller;
	let stopped = false;
	let activePumps = 0;
	let wakeDemand;
	let admission;
	const readers = /* @__PURE__ */ new Set();
	const pendingRawStreams = /* @__PURE__ */ new Set();
	const abortOutput = () => errorOutput(options.signal?.reason);
	const wakeAdmission = () => {
		const wake = wakeDemand;
		wakeDemand = void 0;
		wake?.();
	};
	const cancelReader = (reader, reason) => {
		reader.cancel(reason).catch(() => {});
	};
	const cancelStream = (stream, reason) => {
		stream.cancel(reason).catch(() => {});
	};
	const stop = (reason) => {
		if (stopped) return false;
		stopped = [reason];
		options.signal?.removeEventListener("abort", abortOutput);
		wakeAdmission();
		for (const reader of readers) cancelReader(reader, reason);
		for (const stream of pendingRawStreams) cancelStream(stream, reason);
		pendingRawStreams.clear();
		return true;
	};
	const errorOutput = (error) => {
		if (!stop(error)) return;
		try {
			controller.error(error);
		} catch {}
	};
	const waitForDemand = async () => {
		while (!stopped && (controller.desiredSize ?? 0) <= 0) await new Promise((resolve) => {
			wakeDemand = resolve;
		});
		return !stopped;
	};
	const admitFrame = (type, streamId, payload) => {
		if (stopped) return false;
		if (!admission && (controller.desiredSize ?? 0) > 0) {
			controller.enqueue(encodeFrame(type, streamId, payload));
			return true;
		}
		const runAdmission = async () => {
			if (!await waitForDemand()) return false;
			controller.enqueue(encodeFrame(type, streamId, payload));
			return true;
		};
		const result = admission ? admission.then(runAdmission) : runAdmission();
		const clearAdmission = () => {
			if (admission === tail) admission = void 0;
		};
		const tail = result.then(clearAdmission, clearAdmission);
		admission = tail;
		return result;
	};
	const maybeClose = () => {
		if (activePumps !== 0 || !stop()) return;
		try {
			controller.close();
		} catch {}
	};
	const startPump = (pump) => {
		activePumps++;
		pump().then(() => {
			activePumps--;
			maybeClose();
		}, (error) => {
			activePumps--;
			errorOutput(error);
		});
	};
	async function pumpRawStream(streamId, stream) {
		const reader = stream.getReader();
		readers.add(reader);
		try {
			while (!stopped) {
				const { done, value } = await reader.read();
				if (stopped) return;
				if (done) {
					const frameAdmission = admitFrame(2, streamId, EMPTY_PAYLOAD);
					if (frameAdmission !== true) await frameAdmission;
					return;
				}
				if (!(value instanceof Uint8Array)) throw new TypeError("RawStream chunks must be Uint8Array");
				let offset = 0;
				do {
					const frameAdmission = admitFrame(1, streamId, value.byteLength <= 16777216 ? value : value.subarray(offset, offset + MAX_FRAME_PAYLOAD_SIZE));
					if (frameAdmission !== true && (frameAdmission === false || !await frameAdmission)) return;
					offset += MAX_FRAME_PAYLOAD_SIZE;
				} while (offset < value.byteLength);
			}
		} catch (error) {
			if (!stopped) {
				const frameAdmission = admitFrame(3, streamId, encodeErrorPayload(error));
				if (frameAdmission !== true) await frameAdmission;
			}
		} finally {
			readers.delete(reader);
			reader.releaseLock();
		}
	}
	async function pumpRecords() {
		const reader = recordStream.getReader();
		readers.add(reader);
		try {
			while (!stopped) {
				const { done, value } = await reader.read();
				if (stopped) {
					if (!done) for (const registration of value.rawStreams) cancelStream(registration.stream, stopped[0]);
					return;
				}
				if (done) return;
				for (const registration of value.rawStreams) pendingRawStreams.add(registration.stream);
				const frameAdmission = admitFrame(0, 0, value.json);
				if (frameAdmission !== true && (frameAdmission === false || !await frameAdmission)) return;
				for (const registration of value.rawStreams) {
					pendingRawStreams.delete(registration.stream);
					startPump(pumpRawStream.bind(void 0, registration.id, registration.stream));
				}
			}
		} catch (error) {
			if (!stopped) errorOutput(error);
		} finally {
			readers.delete(reader);
			reader.releaseLock();
		}
	}
	return new ReadableStream({
		start(ctrl) {
			controller = ctrl;
			if (options.signal?.aborted) {
				cancelStream(recordStream, options.signal.reason);
				errorOutput(options.signal.reason);
				return;
			}
			options.signal?.addEventListener("abort", abortOutput, { once: true });
			startPump(pumpRecords);
		},
		pull() {
			wakeAdmission();
		},
		cancel(reason) {
			if (stop(reason)) options.onCancel?.(reason);
		}
	});
}
function isSafeKey(key) {
	return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}
/**
* Merge target and source into a new null-proto object, filtering dangerous keys.
*/
function safeObjectMerge(target, source) {
	const result = Object.create(null);
	if (target) {
		for (const key of Object.keys(target)) if (isSafeKey(key)) result[key] = target[key];
	}
	if (source && typeof source === "object") {
		for (const key of Object.keys(source)) if (isSafeKey(key)) result[key] = source[key];
	}
	return result;
}
/**
* Create a null-prototype object, optionally copying from source.
*/
function createNullProtoObject(source) {
	if (!source) return Object.create(null);
	const obj = Object.create(null);
	for (const key of Object.keys(source)) if (isSafeKey(key)) obj[key] = source[key];
	return obj;
}
var getStartContextServerOnly = getStartContext;
var createServerFn = (options, __opts) => {
	const resolvedOptions = __opts || options || {};
	if (typeof resolvedOptions.method === "undefined") resolvedOptions.method = "GET";
	const setValidator = (validator) => {
		return createServerFn(void 0, {
			...resolvedOptions,
			validator,
			inputValidator: validator
		});
	};
	const res = {
		options: resolvedOptions,
		middleware: (middleware) => {
			const newMiddleware = [...resolvedOptions.middleware || []];
			middleware.map((m) => {
				if (TSS_SERVER_FUNCTION_FACTORY in m) {
					if (m.options.middleware) newMiddleware.push(...m.options.middleware);
				} else newMiddleware.push(m);
			});
			const res = createServerFn(void 0, {
				...resolvedOptions,
				middleware: newMiddleware
			});
			res[TSS_SERVER_FUNCTION_FACTORY] = true;
			return res;
		},
		validator: setValidator,
		inputValidator: setValidator,
		handler: (...args) => {
			const [extractedFn, serverFn] = args;
			const newOptions = {
				...resolvedOptions,
				extractedFn,
				serverFn
			};
			const resolvedMiddleware = [...newOptions.middleware || [], serverFnBaseToMiddleware(newOptions)];
			extractedFn.method = resolvedOptions.method;
			return Object.assign(async (opts) => {
				const result = await executeMiddleware$1(resolvedMiddleware, "client", {
					...extractedFn,
					...newOptions,
					data: opts?.data,
					headers: opts?.headers,
					signal: opts?.signal,
					fetch: opts?.fetch,
					context: createNullProtoObject()
				});
				const redirect = parseRedirect(result.error);
				if (redirect) throw redirect;
				if (result.error) throw result.error;
				return result.result;
			}, {
				...extractedFn,
				method: resolvedOptions.method,
				__executeServer: async (opts) => {
					const startContext = getStartContextServerOnly();
					const serverContextAfterGlobalMiddlewares = startContext.contextAfterGlobalMiddlewares;
					return await executeMiddleware$1(resolvedMiddleware, "server", {
						...extractedFn,
						...opts,
						serverFnMeta: extractedFn.serverFnMeta,
						context: safeObjectMerge(opts.context, serverContextAfterGlobalMiddlewares),
						request: startContext.request
					}).then((d) => ({
						result: d.result,
						error: d.error,
						context: d.sendContext
					}));
				}
			});
		}
	};
	const fun = (options) => {
		return createServerFn(void 0, {
			...resolvedOptions,
			...options
		});
	};
	return Object.assign(fun, res);
};
async function executeMiddleware$1(middlewares, env, opts) {
	let flattenedMiddlewares = flattenMiddlewares([...getStartOptions()?.functionMiddleware || [], ...middlewares]);
	if (env === "server") {
		const startContext = getStartContextServerOnly({ throwIfNotFound: false });
		if (startContext?.executedRequestMiddlewares) flattenedMiddlewares = flattenedMiddlewares.filter((m) => !startContext.executedRequestMiddlewares.has(m));
	}
	const callNextMiddleware = async (ctx) => {
		const nextMiddleware = flattenedMiddlewares.shift();
		if (!nextMiddleware) return ctx;
		try {
			let validator = "validator" in nextMiddleware.options ? nextMiddleware.options.validator : void 0;
			if (!validator && "inputValidator" in nextMiddleware.options) validator = nextMiddleware.options.inputValidator;
			if (validator && env === "server") ctx.data = await execValidator(validator, ctx.data);
			let middlewareFn = void 0;
			if (env === "client") {
				if ("client" in nextMiddleware.options) middlewareFn = nextMiddleware.options.client;
			} else if ("server" in nextMiddleware.options) middlewareFn = nextMiddleware.options.server;
			if (middlewareFn) {
				const userNext = async (userCtx = {}) => {
					const result = await callNextMiddleware({
						...ctx,
						...userCtx,
						context: safeObjectMerge(ctx.context, userCtx.context),
						sendContext: safeObjectMerge(ctx.sendContext, userCtx.sendContext),
						headers: mergeHeaders(ctx.headers, userCtx.headers),
						_callSiteFetch: ctx._callSiteFetch,
						fetch: ctx._callSiteFetch ?? userCtx.fetch ?? ctx.fetch,
						result: userCtx.result !== void 0 ? userCtx.result : userCtx instanceof Response ? userCtx : ctx.result,
						error: userCtx.error ?? ctx.error
					});
					if (result.error) throw result.error;
					return result;
				};
				const result = await middlewareFn({
					...ctx,
					next: userNext
				});
				if (isRedirect(result)) return {
					...ctx,
					error: result
				};
				if (result instanceof Response) return {
					...ctx,
					result
				};
				if (!result) throw new Error("User middleware returned undefined. You must call next() or return a result in your middlewares.");
				return result;
			}
			return callNextMiddleware(ctx);
		} catch (error) {
			return {
				...ctx,
				error
			};
		}
	};
	return callNextMiddleware({
		...opts,
		headers: opts.headers || {},
		sendContext: opts.sendContext || {},
		context: opts.context || createNullProtoObject(),
		_callSiteFetch: opts.fetch
	});
}
function flattenMiddlewares(middlewares, maxDepth = 100) {
	const seen = /* @__PURE__ */ new Set();
	const flattened = [];
	const recurse = (middleware, depth) => {
		if (depth > maxDepth) throw new Error(`Middleware nesting depth exceeded maximum of ${maxDepth}. Check for circular references.`);
		middleware.forEach((m) => {
			if (m.options.middleware) recurse(m.options.middleware, depth + 1);
			if (!seen.has(m)) {
				seen.add(m);
				flattened.push(m);
			}
		});
	};
	recurse(middlewares, 0);
	return flattened;
}
async function execValidator(validator, input) {
	if (validator == null) return {};
	if ("~standard" in validator) {
		const result = await validator["~standard"].validate(input);
		if (result.issues) throw new Error(JSON.stringify(result.issues, void 0, 2));
		return result.value;
	}
	if ("parse" in validator) return validator.parse(input);
	if (typeof validator === "function") return validator(input);
	throw new Error("Invalid validator type!");
}
function serverFnBaseToMiddleware(options) {
	return {
		"~types": void 0,
		options: {
			inputValidator: options.validator ?? options.inputValidator,
			client: async ({ next, sendContext, fetch, ...ctx }) => {
				const payload = {
					...ctx,
					context: sendContext,
					fetch
				};
				return next(await options.extractedFn?.(payload));
			},
			server: async ({ next, ...ctx }) => {
				const result = await options.serverFn?.(ctx);
				return next({
					...ctx,
					result
				});
			}
		}
	};
}
var createMiddleware = (options, __opts) => {
	const resolvedOptions = {
		type: "request",
		...__opts || options
	};
	const setValidator = (validator) => {
		return createMiddleware({}, Object.assign(resolvedOptions, {
			validator,
			inputValidator: validator
		}));
	};
	return {
		options: resolvedOptions,
		middleware: (middleware) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { middleware }));
		},
		validator: setValidator,
		inputValidator: setValidator,
		client: (client) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { client }));
		},
		server: (server) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { server }));
		}
	};
};
var csrfSymbol = Symbol.for("tanstack-start:csrf-middleware");
var innerCreateCsrfMiddleware = (opts = {}) => {
	const middleware = createMiddleware().server(async (ctx) => {
		const csrfCtx = ctx;
		if (opts.filter && !await opts.filter(csrfCtx)) return ctx.next();
		if (await isCsrfRequestAllowed(opts, csrfCtx)) return ctx.next();
		return getFailureResponse(opts, csrfCtx);
	});
	Object.defineProperty(middleware, csrfSymbol, { value: true });
	return middleware;
};
var createCsrfMiddleware = innerCreateCsrfMiddleware;
async function isCsrfRequestAllowed(opts, ctx) {
	const result = await getCsrfRequestValidationResult(opts, ctx);
	return result === true || result === void 0 && opts.allowRequestsWithoutOriginCheck === true;
}
async function getCsrfRequestValidationResult(opts, ctx) {
	const fetchSite = ctx.request.headers.get("Sec-Fetch-Site");
	if (fetchSite !== null) return matchValue(opts.secFetchSite ?? "same-origin", fetchSite, ctx);
	const origin = ctx.request.headers.get("Origin");
	if (origin !== null) {
		if (opts.origin) return matchValue(opts.origin, origin, ctx);
		return origin === new URL(ctx.request.url).origin;
	}
	const referer = ctx.request.headers.get("Referer");
	if (referer === null || opts.referer === false) return;
	if (typeof opts.referer === "function") return opts.referer(referer, ctx);
	if (opts.origin) {
		const refererOrigin = getOriginFromUrl(referer);
		return refererOrigin !== void 0 && matchValue(opts.origin, refererOrigin, ctx);
	}
	return isRefererSameOrigin(referer, new URL(ctx.request.url).origin);
}
async function matchValue(matcher, value, ctx) {
	if (typeof matcher === "function") return matcher(value, ctx);
	if (Array.isArray(matcher)) return matcher.includes(value);
	return value === matcher;
}
function getOriginFromUrl(url) {
	try {
		return new URL(url).origin;
	} catch {
		return;
	}
}
function isRefererSameOrigin(referer, requestOrigin) {
	if (referer === requestOrigin) return true;
	if (!referer.startsWith(requestOrigin)) return false;
	if (referer.length === requestOrigin.length) return true;
	const code = referer.charCodeAt(requestOrigin.length);
	return code === 47 || code === 63 || code === 35;
}
async function getFailureResponse(opts, ctx) {
	if (typeof opts.failureResponse === "function") return opts.failureResponse(ctx);
	return opts.failureResponse?.clone() ?? new Response("Forbidden", { status: 403 });
}
var serovalPlugins = void 0;
var FORM_DATA_CONTENT_TYPES = ["multipart/form-data", "application/x-www-form-urlencoded"];
var MAX_PAYLOAD_SIZE = 1e6;
var MAX_PENDING_SERIALIZATION_RECORDS = 1024;
var MAX_PENDING_SERIALIZATION_BYTES = 33554432;
var textEncoder = new TextEncoder();
function encodeSerializationRecord(value) {
	return textEncoder.encode(JSON.stringify(value));
}
function exceedsPendingSerializationLimit(record, recordCount, pendingBytes) {
	return recordCount >= MAX_PENDING_SERIALIZATION_RECORDS || pendingBytes + record.byteLength > MAX_PENDING_SERIALIZATION_BYTES;
}
function runSerializationCleanup(dispose) {
	try {
		dispose();
	} catch {}
}
function cancelRawStream(stream, reason) {
	stream.cancel(reason).catch(() => {});
}
var handleServerAction = async ({ request, context, serverFnId }) => {
	const methodUpper = request.method.toUpperCase();
	const url = new URL(request.url);
	const action = await getServerFnById(serverFnId, { origin: "client" });
	if (action.method && methodUpper !== action.method) return new Response(`expected ${action.method} method. Got ${methodUpper}`, {
		status: 405,
		headers: { Allow: action.method }
	});
	const isServerFn = request.headers.get("x-tsr-serverFn") === "true";
	serovalPlugins ??= getSerovalPlugins(defaultSerovalDeserializerPlugins);
	const contentType = request.headers.get("Content-Type");
	try {
		let res;
		if (FORM_DATA_CONTENT_TYPES.some((type) => contentType && contentType.includes(type))) {
			if (methodUpper === "GET") throw new Error("Invariant failed: GET requests with FormData payloads are not supported");
			const formData = await request.formData();
			const serializedContext = formData.get(TSS_FORMDATA_CONTEXT);
			formData.delete(TSS_FORMDATA_CONTEXT);
			const params = {
				context,
				data: formData,
				method: methodUpper
			};
			if (typeof serializedContext === "string") try {
				const deserializedContext = fromJSON(JSON.parse(serializedContext), { plugins: serovalPlugins });
				if (typeof deserializedContext === "object" && deserializedContext) params.context = safeObjectMerge(deserializedContext, context);
			} catch (e) {
				console.warn("Failed to parse FormData context:", e);
			}
			res = await action(params);
		} else if (methodUpper === "GET") {
			const payloadParam = url.searchParams.get("payload");
			if (payloadParam && payloadParam.length > MAX_PAYLOAD_SIZE) throw new Error("Payload too large");
			const payload = payloadParam ? fromJSON(JSON.parse(payloadParam), { plugins: serovalPlugins }) : {};
			payload.context = safeObjectMerge(payload.context, context);
			payload.method = methodUpper;
			res = await action(payload);
		} else {
			const payload = contentType?.includes("application/json") ? fromJSON(await request.json(), { plugins: serovalPlugins }) : {};
			payload.context = safeObjectMerge(payload.context, context);
			payload.method = methodUpper;
			res = await action(payload);
		}
		const unwrapped = res.result !== void 0 ? res.result : res.error;
		if (isNotFound(res)) res = isNotFoundResponse(res);
		if (!isServerFn) return unwrapped;
		if (unwrapped instanceof Response) {
			if (isRedirect(unwrapped)) return unwrapped;
			unwrapped.headers.set(X_TSS_RAW_RESPONSE, "true");
			return unwrapped;
		}
		return serializeResult(res, request.signal, serovalPlugins);
	} catch (error) {
		if (error instanceof Response) return error;
		if (isNotFound(error)) return isNotFoundResponse(error);
		console.error("Server Fn Error!", error);
		const serializedError = JSON.stringify(await toCrossJSONAsync(error, {
			refs: /* @__PURE__ */ new Map(),
			plugins: serovalPlugins
		}));
		const response = getResponse();
		const headers = {
			"Content-Type": "application/json",
			[X_TSS_SERIALIZED]: "true"
		};
		try {
			return new Response(serializedError, {
				status: response.status ?? 500,
				statusText: response.statusText,
				headers
			});
		} catch {
			return new Response(serializedError, {
				status: 500,
				statusText: "",
				headers
			});
		}
	}
};
/**
* Serializes a server-function result. A result that Seroval completes
* synchronously without RawStreams becomes plain JSON; everything else is a
* framed response whose records and raw streams are multiplexed in order.
*/
function serializeResult(res, signal, plugins) {
	const alsResponse = getResponse();
	const initialRecords = [];
	let initialBytes = 0;
	const pendingRawStreams = [];
	let done = false;
	let initialParsed = false;
	let serializationFailure;
	let disposeSerialization;
	let onParse = (value, initial) => {
		if (serializationFailure) return;
		initialParsed ||= initial;
		const record = encodeSerializationRecord(value);
		if (exceedsPendingSerializationLimit(record, initialRecords.length, initialBytes)) {
			serializationFailure = [/* @__PURE__ */ new Error("Server function serialization exceeded its pending output limit")];
			return;
		}
		initialRecords.push(record);
		initialBytes += record.byteLength;
	};
	let onDone = () => {
		if (initialParsed) done = true;
	};
	let onError = (error) => {
		serializationFailure ??= [error];
	};
	const rawStreamPlugin = createRawStreamRPCPlugin((id, stream) => {
		if (serializationFailure) {
			cancelRawStream(stream, serializationFailure[0]);
			return;
		}
		if (id > 1024) {
			const error = /* @__PURE__ */ new Error(`Too many raw streams in framed response (max ${MAX_FRAMED_STREAMS})`);
			cancelRawStream(stream, error);
			onError(error);
			return;
		}
		pendingRawStreams.push({
			id,
			stream
		});
	});
	const dispose = toCrossJSONStream(res, {
		refs: /* @__PURE__ */ new Map(),
		plugins: [rawStreamPlugin, ...plugins],
		onParse(value, initial) {
			onParse(value, initial);
		},
		onDone() {
			onDone();
		},
		onError: (error) => {
			onError(error);
		}
	});
	if (serializationFailure) {
		runSerializationCleanup(dispose);
		for (const registration of pendingRawStreams) cancelRawStream(registration.stream, serializationFailure[0]);
		throw serializationFailure[0];
	}
	if (!done) disposeSerialization = dispose;
	if (done && pendingRawStreams.length === 0 && initialRecords.length === 1) return new Response(initialRecords[0], {
		status: alsResponse.status,
		statusText: alsResponse.statusText,
		headers: {
			"Content-Type": "application/json",
			[X_TSS_SERIALIZED]: "true"
		}
	});
	if (done && initialRecords.length === 1) {
		const json = initialRecords[0];
		if (json.byteLength > 16777216) {
			const error = /* @__PURE__ */ new Error("Server function serialization exceeded its pending output limit");
			for (const registration of pendingRawStreams) cancelRawStream(registration.stream, error);
			throw error;
		}
		const rawStreams = pendingRawStreams.splice(0);
		initialRecords.length = 0;
		return createFramedResponse(new ReadableStream({
			start(controller) {
				controller.enqueue({
					json,
					rawStreams
				});
				controller.close();
			},
			cancel(reason) {
				for (const registration of rawStreams) cancelRawStream(registration.stream, reason);
			}
		}), { signal });
	}
	const { readable, writable } = new TransformStream();
	const writer = writable.getWriter();
	const recordAbortController = new AbortController();
	let pendingBytes = 0;
	const pendingRecords = /* @__PURE__ */ new Set();
	const abortRecordStream = (error) => {
		if (serializationFailure) return;
		serializationFailure = [error];
		const disposeCurrentSerialization = disposeSerialization;
		disposeSerialization = void 0;
		for (const registration of pendingRawStreams.splice(0)) cancelRawStream(registration.stream, error);
		for (const record of pendingRecords) for (const registration of record.rawStreams) cancelRawStream(registration.stream, error);
		pendingRecords.clear();
		recordAbortController.abort(error);
		writer.abort(error).catch(() => {});
		if (disposeCurrentSerialization) runSerializationCleanup(disposeCurrentSerialization);
	};
	const writeRecord = (json, rawStreams) => {
		if (serializationFailure) {
			for (const registration of rawStreams) cancelRawStream(registration.stream, serializationFailure[0]);
			return false;
		}
		if (json.byteLength > 16777216 || exceedsPendingSerializationLimit(json, pendingRecords.size, pendingBytes)) {
			const error = /* @__PURE__ */ new Error("Server function serialization exceeded its pending output limit");
			for (const registration of rawStreams) cancelRawStream(registration.stream, error);
			onError(error);
			return false;
		}
		pendingBytes += json.byteLength;
		const record = {
			json,
			rawStreams
		};
		pendingRecords.add(record);
		writer.write(record).then(() => {
			pendingRecords.delete(record);
			pendingBytes -= json.byteLength;
		}, (error) => {
			const stillOwned = pendingRecords.delete(record);
			pendingBytes -= json.byteLength;
			if (stillOwned) for (const registration of rawStreams) cancelRawStream(registration.stream, error);
		});
		return true;
	};
	onParse = (value) => {
		if (serializationFailure) return;
		writeRecord(encodeSerializationRecord(value), pendingRawStreams.splice(0));
	};
	onDone = () => {
		if (serializationFailure) return;
		disposeSerialization = void 0;
		writer.close().catch(() => {});
	};
	onError = (error) => {
		abortRecordStream(error);
	};
	const initialRawStreams = pendingRawStreams.splice(0);
	for (let index = 0; index < initialRecords.length; index++) {
		const isLast = index === initialRecords.length - 1;
		if (!writeRecord(initialRecords[index], isLast ? initialRawStreams : [])) {
			if (!isLast) for (const registration of initialRawStreams) cancelRawStream(registration.stream, serializationFailure[0]);
			initialRecords.length = 0;
			throw serializationFailure[0];
		}
	}
	initialRecords.length = 0;
	if (done) onDone();
	writer.closed.catch((error) => {
		abortRecordStream(error);
	});
	return createFramedResponse(readable, {
		signal: AbortSignal.any([recordAbortController.signal, signal]),
		onCancel: abortRecordStream
	});
	function createFramedResponse(records, options) {
		const multiplexedStream = createMultiplexedStream(records, options);
		try {
			return new Response(multiplexedStream, {
				status: alsResponse.status,
				statusText: alsResponse.statusText,
				headers: {
					"Content-Type": TSS_CONTENT_TYPE_FRAMED_VERSIONED,
					[X_TSS_SERIALIZED]: "true"
				}
			});
		} catch (error) {
			cancelRawStream(multiplexedStream, error);
			throw error;
		}
	}
}
function isNotFoundResponse(error) {
	const { headers, ...rest } = error;
	return new Response(JSON.stringify(rest), {
		status: 404,
		headers: {
			"Content-Type": "application/json",
			...headers || {}
		}
	});
}
var LINK_PARAM_TOKEN_RE = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
var PRELOAD_AS_VALUES = /* @__PURE__ */ new Set([
	"fetch",
	"font",
	"image",
	"script",
	"style",
	"track"
]);
function buildLinkParam(name, value) {
	if (value === void 0) return name;
	if (LINK_PARAM_TOKEN_RE.test(value)) return `${name}=${value}`;
	return `${name}=${JSON.stringify(value)}`;
}
function serializeEarlyHint(hint) {
	const parts = [`<${hint.href}>`, buildLinkParam("rel", hint.rel)];
	if (hint.as) parts.push(buildLinkParam("as", hint.as));
	if (hint.crossOrigin !== void 0) parts.push(buildLinkParam("crossorigin", hint.crossOrigin || void 0));
	if (hint.type) parts.push(buildLinkParam("type", hint.type));
	if (hint.integrity) parts.push(buildLinkParam("integrity", hint.integrity));
	if (hint.referrerPolicy) parts.push(buildLinkParam("referrerpolicy", hint.referrerPolicy));
	if (hint.fetchPriority) parts.push(buildLinkParam("fetchpriority", hint.fetchPriority));
	return parts.join("; ");
}
function getStringAttr(attrs, name, fallbackName) {
	const value = attrs?.[name] ?? (fallbackName ? attrs?.[fallbackName] : void 0);
	return typeof value === "string" ? value : void 0;
}
function getPreloadAs(attrs) {
	const as = getStringAttr(attrs, "as");
	return as && PRELOAD_AS_VALUES.has(as) ? as : void 0;
}
function addEarlyHintFetchAttrs(hint, attrs) {
	const crossOrigin = getStringAttr(attrs, "crossOrigin", "crossorigin");
	const type = getStringAttr(attrs, "type");
	const integrity = getStringAttr(attrs, "integrity");
	const referrerPolicy = getStringAttr(attrs, "referrerPolicy", "referrerpolicy");
	const fetchPriority = getStringAttr(attrs, "fetchPriority", "fetchpriority");
	if (crossOrigin !== void 0) hint.crossOrigin = crossOrigin;
	if (type) hint.type = type;
	if (integrity) hint.integrity = integrity;
	if (referrerPolicy) hint.referrerPolicy = referrerPolicy;
	if (fetchPriority) hint.fetchPriority = fetchPriority;
}
function linkAttrsToEarlyHint(attrs) {
	const href = getStringAttr(attrs, "href");
	const rel = getStringAttr(attrs, "rel");
	if (!href || !rel) return void 0;
	const relTokens = rel.split(/\s+/);
	let hintRel;
	let hintAs;
	if (relTokens.includes("modulepreload")) {
		hintRel = "modulepreload";
		hintAs = "script";
	} else if (relTokens.includes("stylesheet")) {
		hintRel = "preload";
		hintAs = "style";
	} else if (relTokens.includes("preload")) {
		hintAs = getPreloadAs(attrs);
		if (!hintAs) return void 0;
		hintRel = "preload";
	} else if (relTokens.includes("preconnect")) {
		hintRel = "preconnect";
		hintAs = void 0;
	} else if (relTokens.includes("dns-prefetch")) {
		hintRel = "dns-prefetch";
		hintAs = void 0;
	}
	if (!hintRel) return void 0;
	const hint = {
		href,
		rel: hintRel
	};
	if (hintAs) hint.as = hintAs;
	addEarlyHintFetchAttrs(hint, attrs);
	return hint;
}
function collectStaticHintsFromManifest(manifest, matchedRoutes) {
	const hints = [];
	for (const route of matchedRoutes) {
		const routeManifest = manifest.routes[route.id];
		if (!routeManifest) continue;
		for (const link of routeManifest.preloads ?? []) {
			const attrs = getScriptPreloadAttrs(manifest, link);
			const hint = {
				href: attrs.href,
				rel: attrs.rel,
				as: "script"
			};
			if (attrs.crossOrigin !== void 0) hint.crossOrigin = attrs.crossOrigin;
			hints.push(hint);
		}
		for (const link of routeManifest.css ?? []) {
			const stylesheetHref = getStylesheetHref(link);
			if (manifest.inlineCss?.styles[stylesheetHref] !== void 0) continue;
			const resolvedLink = resolveManifestCssLink(link);
			const hint = {
				href: stylesheetHref,
				rel: "preload",
				as: "style"
			};
			if (resolvedLink.crossOrigin !== void 0) hint.crossOrigin = resolvedLink.crossOrigin;
			hints.push(hint);
		}
	}
	return hints;
}
function collectDynamicHintsFromMatches(matches) {
	const hints = [];
	for (const match of matches) {
		const links = match.links;
		if (!Array.isArray(links)) continue;
		for (const link of links) {
			const hint = linkAttrsToEarlyHint(link);
			if (hint) hints.push(hint);
		}
	}
	return hints;
}
function createEarlyHintsEvent(opts) {
	const nextHints = [];
	const nextLinks = [];
	for (const hint of opts.hints) {
		const link = serializeEarlyHint(hint);
		if (opts.sentLinks.has(link)) continue;
		opts.sentLinks.add(link);
		opts.sentHints.push(hint);
		nextHints.push(hint);
		nextLinks.push(link);
	}
	if (!nextHints.length && opts.phase !== "dynamic") return void 0;
	return {
		phase: opts.phase,
		hints: nextHints,
		links: nextLinks,
		allHints: opts.sentHints.slice(),
		allLinks: Array.from(opts.sentLinks)
	};
}
function createResponseLinkHeaderEntries(opts) {
	for (const hint of opts.hints) {
		const link = serializeEarlyHint(hint);
		if (opts.sentLinks.has(link)) continue;
		opts.sentLinks.add(link);
		opts.entries.push({
			phase: opts.phase,
			hint,
			link
		});
	}
}
function getResponseLinkHeaderEntries(opts) {
	if (!opts.filter) return opts.entries.map((entry) => entry.link);
	try {
		const links = [];
		for (const entry of opts.entries) if (opts.filter(entry)) links.push(entry.link);
		return links;
	} catch (err) {
		console.error("Error filtering response Link headers:", err);
		return [];
	}
}
function notifyEarlyHints(phase, event, onEarlyHints) {
	try {
		const result = onEarlyHints(event);
		if (result) Promise.resolve(result).catch((err) => {
			console.error(`Error sending ${phase} early hints:`, err);
		});
	} catch (err) {
		console.error(`Error sending ${phase} early hints:`, err);
	}
}
function getResponseLinkHeaderFilter(responseLinkHeader) {
	if (typeof responseLinkHeader !== "object") return;
	return responseLinkHeader.filter;
}
function appendResponseLinkHeaders(opts) {
	for (const link of getResponseLinkHeaderEntries(opts)) opts.responseHeaders.append("Link", link);
}
function collectResponseLinkHeaderEntries(opts) {
	for (let index = 0; index < opts.event.hints.length; index++) opts.entries.push({
		phase: opts.phase,
		hint: opts.event.hints[index],
		link: opts.event.links[index]
	});
}
function collectEarlyHintsPhase(opts) {
	const event = opts.onEarlyHints ? createEarlyHintsEvent({
		phase: opts.phase,
		hints: opts.hints,
		sentLinks: opts.sentLinks,
		sentHints: opts.sentHints
	}) : void 0;
	if (event) notifyEarlyHints(opts.phase, event, opts.onEarlyHints);
	if (!opts.responseLinkHeaderEntries) return;
	if (event) {
		collectResponseLinkHeaderEntries({
			phase: opts.phase,
			event,
			entries: opts.responseLinkHeaderEntries
		});
		return;
	}
	createResponseLinkHeaderEntries({
		phase: opts.phase,
		hints: opts.hints,
		sentLinks: opts.sentLinks,
		entries: opts.responseLinkHeaderEntries
	});
}
function createEarlyHintsCollector(opts) {
	if (!opts?.onEarlyHints && !opts?.responseLinkHeader) return;
	const sentLinks = /* @__PURE__ */ new Set();
	const sentHints = opts.onEarlyHints ? new Array() : void 0;
	const responseLinkHeaderEntries = opts.responseLinkHeader ? new Array() : void 0;
	const responseLinkHeaderFilter = getResponseLinkHeaderFilter(opts.responseLinkHeader);
	return {
		collectStatic: ({ manifest, matchedRoutes }) => {
			if (!matchedRoutes?.length) return;
			collectEarlyHintsPhase({
				phase: "static",
				hints: collectStaticHintsFromManifest(manifest, matchedRoutes),
				sentLinks,
				sentHints,
				onEarlyHints: opts.onEarlyHints,
				responseLinkHeaderEntries
			});
		},
		collectDynamic: (matches) => {
			collectEarlyHintsPhase({
				phase: "dynamic",
				hints: collectDynamicHintsFromMatches(matches),
				sentLinks,
				sentHints,
				onEarlyHints: opts.onEarlyHints,
				responseLinkHeaderEntries
			});
		},
		appendResponseHeaders: (headers) => {
			if (!responseLinkHeaderEntries?.length) return;
			appendResponseLinkHeaders({
				responseHeaders: headers,
				entries: responseLinkHeaderEntries,
				filter: responseLinkHeaderFilter
			});
		}
	};
}
function normalizeTransformAssetResult(result) {
	if (typeof result === "string") return { href: result };
	return result;
}
function escapeCssString(value) {
	return value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\a ").replace(/\r/g, "\\d ").replace(/\f/g, "\\c ");
}
async function transformInlineCssTemplate(options) {
	const { strings, urls } = options.template;
	if (strings.length !== urls.length + 1) throw new Error(`TanStack Start inlineCss template for ${options.stylesheetHref} is invalid`);
	let css = strings[0];
	for (let index = 0; index < urls.length; index++) {
		const transformed = normalizeTransformAssetResult(await options.transformFn({
			kind: "css-url",
			url: urls[index],
			stylesheetHref: options.stylesheetHref
		}));
		css += escapeCssString(transformed.href) + strings[index + 1];
	}
	return css;
}
async function transformInlineCssStyles(inlineCss, transformFn) {
	const transformedStyles = {};
	const transformedEntries = await Promise.all(Object.entries(inlineCss.styles).map(async ([stylesheetHref, css]) => {
		const template = inlineCss.templates?.[stylesheetHref];
		return [stylesheetHref, template ? await transformInlineCssTemplate({
			stylesheetHref,
			template,
			transformFn
		}) : css];
	}));
	for (const [stylesheetHref, css] of transformedEntries) transformedStyles[stylesheetHref] = css;
	return {
		styles: transformedStyles,
		...inlineCss.templates ? { templates: inlineCss.templates } : {}
	};
}
function resolveTransformAssetsCrossOrigin(config, kind) {
	if (!config) return void 0;
	if (typeof config === "string") return config;
	return config[kind];
}
function isObjectShorthand(transform) {
	return "prefix" in transform;
}
function resolveTransformAssetsConfig(transform) {
	if (typeof transform === "string") {
		const prefix = transform;
		return {
			type: "transform",
			transformFn: ({ url }) => ({ href: `${prefix}${url}` }),
			cache: true
		};
	}
	if (typeof transform === "function") return {
		type: "transform",
		transformFn: transform,
		cache: true
	};
	if (isObjectShorthand(transform)) {
		const { prefix, crossOrigin } = transform;
		return {
			type: "transform",
			transformFn: ({ url, kind }) => {
				const href = `${prefix}${url}`;
				if (kind === "css-url") return { href };
				const co = resolveTransformAssetsCrossOrigin(crossOrigin, kind);
				return co ? {
					href,
					crossOrigin: co
				} : { href };
			},
			cache: true
		};
	}
	if ("createTransform" in transform && transform.createTransform) return {
		type: "createTransform",
		createTransform: transform.createTransform,
		cache: transform.cache !== false
	};
	return {
		type: "transform",
		transformFn: typeof transform.transform === "string" ? (({ url }) => ({ href: `${transform.transform}${url}` })) : transform.transform,
		cache: transform.cache !== false
	};
}
function assignManifestLink(link, next) {
	if (typeof link === "string") return next.crossOrigin ? next : next.href;
	const nextLink = {
		...link,
		href: next.href
	};
	if (next.crossOrigin) nextLink.crossOrigin = next.crossOrigin;
	else delete nextLink.crossOrigin;
	return nextLink;
}
async function transformManifestAssets(source, transformFn, _opts) {
	const manifest = structuredClone(source);
	const inlineCssEnabled = _opts?.inlineCss !== false;
	const scriptTransforms = /* @__PURE__ */ new Map();
	const transformScript = (url) => {
		const cached = scriptTransforms.get(url);
		if (cached) return cached;
		const transformed = Promise.resolve(transformFn({
			url,
			kind: "script"
		})).then(normalizeTransformAssetResult);
		scriptTransforms.set(url, transformed);
		return transformed;
	};
	if (!inlineCssEnabled) delete manifest.inlineCss;
	else if (manifest.inlineCss) manifest.inlineCss = await transformInlineCssStyles(manifest.inlineCss, transformFn);
	for (const route of Object.values(manifest.routes)) {
		if (route.preloads?.length) route.preloads = await Promise.all(route.preloads.map(async (link) => {
			const result = await transformScript(resolveManifestAssetLink(link).href);
			return assignManifestLink(link, {
				href: result.href,
				crossOrigin: result.crossOrigin
			});
		}));
		if (route.css?.length && !manifest.inlineCss) route.css = await Promise.all(route.css.map(async (link) => {
			const result = normalizeTransformAssetResult(await transformFn({
				url: resolveManifestCssLink(link).href,
				kind: "stylesheet"
			}));
			return assignManifestLink(link, {
				href: result.href,
				crossOrigin: result.crossOrigin
			});
		}));
		if (route.scripts?.length) for (const script of route.scripts) {
			const src = script.attrs?.src;
			if (typeof src !== "string") continue;
			const result = await transformScript(src);
			script.attrs = {
				...script.attrs,
				src: result.href
			};
			if (result.crossOrigin) script.attrs.crossOrigin = result.crossOrigin;
			else delete script.attrs.crossOrigin;
		}
	}
	return manifest;
}
/**
* Builds a final ServerManifest without URL transforms. Used when no
* transformAssets option is provided.
*
* Returns a new manifest object so the cached base manifest is never mutated.
*/
function buildManifest(source, opts) {
	return {
		...source.scriptFormat ? { scriptFormat: source.scriptFormat } : {},
		...opts?.inlineCss !== false && source.inlineCss ? { inlineCss: structuredClone(source.inlineCss) } : {},
		routes: { ...source.routes }
	};
}
function getStaticHandlerInlineCssDefault(handlerInlineCss) {
	if (typeof handlerInlineCss === "function") return;
	return handlerInlineCss ?? true;
}
async function resolveInlineCssForRequest(opts) {
	if (opts.requestInlineCss !== void 0) return opts.requestInlineCss;
	if (typeof opts.handlerInlineCss === "function") return await opts.handlerInlineCss({ request: opts.request });
	return opts.handlerInlineCss ?? true;
}
function createCachedBaseManifestLoader(loadBaseManifest) {
	let baseManifestPromise;
	return () => {
		if (!baseManifestPromise) baseManifestPromise = loadBaseManifest().catch((error) => {
			baseManifestPromise = void 0;
			throw error;
		});
		return baseManifestPromise;
	};
}
function createFinalManifestTransformResolver(transformAssets, opts) {
	const transformConfig = transformAssets !== void 0 ? resolveTransformAssetsConfig(transformAssets) : void 0;
	const cache = transformConfig ? transformConfig.cache : true;
	const warmup = !!transformAssets && typeof transformAssets === "object" && "warmup" in transformAssets && transformAssets.warmup === true;
	let cachedCreateTransformPromise;
	const clearCachedCreateTransform = () => {
		cachedCreateTransformPromise = void 0;
	};
	return {
		cache,
		warmup,
		clearCachedCreateTransform,
		getTransformFn: async (ctx) => {
			if (!transformConfig) return void 0;
			if (transformConfig.type !== "createTransform") return transformConfig.transformFn;
			if (!cache || !opts.cacheCreateTransform) return transformConfig.createTransform(ctx);
			if (!cachedCreateTransformPromise) cachedCreateTransformPromise = Promise.resolve(transformConfig.createTransform(ctx)).catch((error) => {
				clearCachedCreateTransform();
				throw error;
			});
			return cachedCreateTransformPromise;
		}
	};
}
function createFinalManifestResolver(opts) {
	const finalManifestCache = /* @__PURE__ */ new Map();
	const transformResolver = createFinalManifestTransformResolver(opts.transformAssets, { cacheCreateTransform: opts.cacheCreateTransform });
	const handlerDefaultInlineCss = getStaticHandlerInlineCssDefault(opts.inlineCss);
	const getRequestManifestOptions = async (requestOpts) => {
		const transformFn = await transformResolver.getTransformFn({
			warmup: false,
			request: requestOpts.request
		});
		const inlineCss = await resolveInlineCssForRequest({
			request: requestOpts.request,
			handlerInlineCss: opts.inlineCss,
			requestInlineCss: requestOpts.requestInlineCss
		});
		return {
			getBaseManifest: requestOpts.getBaseManifest,
			transformFn,
			cache: transformResolver.cache,
			inlineCss
		};
	};
	const resolveRequest = async (requestOpts, cache) => {
		return resolveFinalManifest({
			...await getRequestManifestOptions(requestOpts),
			finalManifestCache: cache
		});
	};
	return {
		warmup: ({ getBaseManifest }) => warmupFinalManifest({
			enabled: transformResolver.warmup,
			handlerDefaultInlineCss,
			cache: transformResolver.cache,
			finalManifestCache,
			getBaseManifest,
			getTransformFn: () => transformResolver.getTransformFn({ warmup: true }),
			onError: transformResolver.clearCachedCreateTransform
		}),
		resolveCached: (requestOpts) => resolveRequest(requestOpts, finalManifestCache),
		resolveUncached: (requestOpts) => resolveRequest(requestOpts, void 0)
	};
}
function getFinalManifestCacheKey(inlineCss) {
	return inlineCss ? "inline-css" : "linked-css";
}
function cacheFinalManifestPromise(cachedFinalManifestPromises, cacheKey, promise) {
	const cachedFinalManifestPromise = promise.catch((error) => {
		if (cachedFinalManifestPromises.get(cacheKey) === cachedFinalManifestPromise) cachedFinalManifestPromises.delete(cacheKey);
		throw error;
	});
	cachedFinalManifestPromises.set(cacheKey, cachedFinalManifestPromise);
	return cachedFinalManifestPromise;
}
function getOrCreateCachedFinalManifestPromise(cachedFinalManifestPromises, cacheKey, computeFinalManifest) {
	const cachedFinalManifestPromise = cachedFinalManifestPromises.get(cacheKey);
	if (cachedFinalManifestPromise) return cachedFinalManifestPromise;
	return cacheFinalManifestPromise(cachedFinalManifestPromises, cacheKey, Promise.resolve().then(computeFinalManifest));
}
async function buildFinalManifest(opts) {
	return opts.transformFn ? await transformManifestAssets(opts.base, opts.transformFn, { inlineCss: opts.inlineCss }) : buildManifest(opts.base, { inlineCss: opts.inlineCss });
}
async function resolveFinalManifest(opts) {
	const computeFinalManifest = async () => {
		return buildFinalManifest({
			base: await opts.getBaseManifest(),
			transformFn: opts.transformFn,
			inlineCss: opts.inlineCss
		});
	};
	if (opts.finalManifestCache && (!opts.transformFn || opts.cache)) return getOrCreateCachedFinalManifestPromise(opts.finalManifestCache, getFinalManifestCacheKey(opts.inlineCss), computeFinalManifest);
	return computeFinalManifest();
}
function warmupFinalManifest(opts) {
	if (!opts.enabled || opts.handlerDefaultInlineCss === void 0 || !opts.cache) return;
	const inlineCss = opts.handlerDefaultInlineCss;
	const warmupPromise = getOrCreateCachedFinalManifestPromise(opts.finalManifestCache, getFinalManifestCacheKey(inlineCss), async () => {
		const [base, transformFn] = await Promise.all([opts.getBaseManifest(), opts.getTransformFn()]);
		return buildFinalManifest({
			base,
			transformFn,
			inlineCss
		});
	});
	if (opts.onError) warmupPromise.catch(opts.onError);
	return warmupPromise;
}
var ServerFunctionSerializationAdapter = createSerializationAdapter({
	key: "$TSS/serverfn",
	test: (v) => {
		if (typeof v !== "function") return false;
		if (!(TSS_SERVER_FUNCTION in v)) return false;
		return !!v[TSS_SERVER_FUNCTION];
	},
	toSerializable: ({ serverFnMeta }) => ({ functionId: serverFnMeta.id }),
	fromSerializable: ({ functionId }) => {
		const fn = async (opts, signal) => {
			return (await (await getServerFnById(functionId, { origin: "client" }))(opts ?? {}, signal)).result;
		};
		return fn;
	}
});
function getStartResponseHeaders(opts) {
	return mergeHeaders({ "Content-Type": "text/html; charset=utf-8" }, ..._getRenderedMatches(opts.router.stores.matches.get()).map((match) => {
		return match.headers;
	}));
}
var entriesPromise;
var hasWarnedMissingCsrfMiddleware = false;
var defaultCsrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var getCachedBaseManifest = createCachedBaseManifestLoader(() => getStartManifest());
var getProdBaseManifest = () => getCachedBaseManifest();
var getBaseManifest = getProdBaseManifest;
var createEarlyHintsForRequest = createEarlyHintsCollector;
async function loadEntries() {
	const [routerEntry, startEntry, pluginAdapters] = await Promise.all([
		import("./router-BAc73aWw.mjs").then((n) => n.t),
		import("./start-COnXp-bh.mjs"),
		import("./empty-plugin-adapters-D9UWiqvJ.mjs")
	]);
	return {
		routerEntry,
		startEntry,
		pluginAdapters
	};
}
function getEntries() {
	if (!entriesPromise) entriesPromise = loadEntries();
	return entriesPromise;
}
function hasCsrfMiddleware(middlewares) {
	return middlewares.some((middleware) => csrfSymbol in middleware);
}
function warnMissingCsrfMiddlewareOnce() {
	if (hasWarnedMissingCsrfMiddleware) return;
	hasWarnedMissingCsrfMiddleware = true;
	console.warn(`TanStack Start server functions are not protected by the CSRF middleware.

Server functions are same-origin RPC endpoints and should be protected from cross-site requests.

Add the CSRF middleware in src/start.ts:

  const csrfMiddleware = createCsrfMiddleware({
    filter: (ctx) => ctx.handlerType === 'serverFn',
  })

  export const startInstance = createStart(() => ({
    requestMiddleware: [csrfMiddleware],
  }))

If you intentionally handle CSRF another way, disable this warning:

  tanstackStart({
    serverFns: {
      disableCsrfMiddlewareWarning: true,
    },
  })`);
}
var ROUTER_BASEPATH = "/";
var SERVER_FN_BASE = "/_serverFn/";
var IS_PRERENDERING = process.env.TSS_PRERENDERING === "true";
var IS_SHELL_ENV = process.env.TSS_SHELL === "true";
var IS_DEV = true;
var ERR_NO_RESPONSE = IS_DEV ? `It looks like you forgot to return a response from your server route handler. If you want to defer to the app router, make sure to have a component set in this route.` : "Internal Server Error";
var ERR_NO_DEFER = IS_DEV ? `You cannot defer to the app router if there is no component defined on this route.` : "Internal Server Error";
function throwRouteHandlerError() {
	throw new Error(ERR_NO_RESPONSE);
}
function throwIfMayNotDefer() {
	throw new Error(ERR_NO_DEFER);
}
function getResponseFromResult(result) {
	return isSsrResponse(result) || result instanceof Response ? result : result?.response;
}
var responseBodySources = /* @__PURE__ */ new WeakMap();
function disposeResponseResult(result, reason) {
	const response = getResponseFromResult(result);
	if (isSsrResponse(response) || response instanceof Response) disposeSsrResponse(response, reason);
}
function hasResponseBody(value) {
	return value instanceof Response && value.body !== null;
}
function inheritsResponseOwnership(ownership, candidate) {
	return hasResponseBody(candidate) && (candidate.body === ownership.response.body || responseBodySources.get(candidate) === ownership.response);
}
function disposeResponseOwnership(ownership, reason) {
	const { response, sourceBody, streamResponse } = ownership;
	streamResponse?.dispose(reason);
	if (!streamResponse || response.body !== sourceBody) response.body.cancel(reason).catch(() => {});
}
function getOwnedResponse(ownership) {
	const { response, sourceBody, streamResponse } = ownership;
	if (!streamResponse) return response;
	if (streamResponse.response === response && response.body === sourceBody) return streamResponse;
	if (response.body === sourceBody) return {
		...streamResponse,
		response
	};
	return {
		...streamResponse,
		response,
		dispose(reason) {
			disposeResponseOwnership(ownership, reason);
		}
	};
}
function createLateResponseDisposer(signal) {
	return (result) => disposeResponseResult(result, signal.reason);
}
/**
* Compose middleware around a terminal response handler. With no middleware
* the terminal runs directly.
*/
async function executeMiddleware(middlewares, terminal, ctx, signal, terminalNext) {
	let index = -1;
	let responseOwnership;
	let settled = false;
	const disposeAbandonedResult = createLateResponseDisposer(signal);
	const setResponse = (response) => {
		const ssrResponse = isSsrResponse(response) ? response : void 0;
		const streamResponse = ssrResponse?.serverSsrCleanup === "stream" ? ssrResponse : void 0;
		const exposed = ssrResponse ? ssrResponse.response : response;
		const current = responseOwnership;
		if (settled) {
			if (exposed !== ctx.response) disposeResponseResult(response, "late middleware response");
			return;
		}
		if (current && current.response === exposed) current.streamResponse ??= streamResponse;
		else if (current && inheritsResponseOwnership(current, exposed)) {
			current.response = exposed;
			current.streamResponse ??= streamResponse;
		} else {
			if (current) disposeResponseOwnership(current, "middleware response replaced");
			if (hasResponseBody(exposed)) responseOwnership = {
				response: exposed,
				sourceBody: exposed.body,
				streamResponse
			};
			else responseOwnership = void 0;
		}
		ctx.response = exposed;
	};
	const reconcileCtxResponse = () => {
		if (ctx.response !== responseOwnership?.response) setResponse(ctx.response);
	};
	let nextPromise;
	function next(nextCtx) {
		const result = runNext(nextCtx);
		nextPromise = result;
		return result;
	}
	async function runNext(nextCtx) {
		signal.throwIfAborted();
		if (nextCtx) {
			if (nextCtx.context) ctx.context = safeObjectMerge(ctx.context, nextCtx.context);
			for (const key of Object.keys(nextCtx)) if (key === "response") setResponse(nextCtx.response);
			else if (key !== "context") ctx[key] = nextCtx[key];
		}
		index++;
		const isTerminal = index === middlewares.length;
		const middleware = index < middlewares.length ? middlewares[index] : isTerminal ? terminal : void 0;
		const middlewareNext = isTerminal && terminalNext ? terminalNext : next;
		if (!middleware) return ctx;
		let result;
		try {
			const pending = middleware({
				...ctx,
				next: middlewareNext
			});
			if (nextPromise && pending === nextPromise) {
				nextPromise = void 0;
				await pending;
				if (signal.aborted) throw signal.reason;
				return ctx;
			} else if (!isPromise(pending)) {
				result = pending;
				signal.throwIfAborted();
			} else result = await waitForReason(pending, signal, disposeAbandonedResult, disposeAbandonedResult);
		} catch (err) {
			reconcileCtxResponse();
			if (signal.aborted) {
				if (result !== void 0) disposeAbandonedResult(result);
				if (err !== signal.reason) disposeAbandonedResult(err);
				throw signal.reason;
			}
			if (err instanceof Response) {
				setResponse(err);
				return ctx;
			}
			throw err;
		}
		if (isTerminal && terminalNext && !result) throwRouteHandlerError();
		reconcileCtxResponse();
		if (result && result !== ctx) {
			const response = getResponseFromResult(result);
			if (response !== void 0 && response !== ctx.response) setResponse(response);
			if (response !== result && result.context && result.context !== ctx.context) ctx.context = safeObjectMerge(ctx.context, result.context);
		}
		return ctx;
	}
	try {
		await runNext();
		const response = ctx.response;
		if (!response) throwRouteHandlerError();
		reconcileCtxResponse();
		if (signal.aborted) throw signal.reason;
		settled = true;
		return responseOwnership ? getOwnedResponse(responseOwnership) : response;
	} catch (err) {
		settled = true;
		if (responseOwnership) disposeResponseOwnership(responseOwnership, signal.aborted ? signal.reason : err);
		throw err;
	}
}
/**
* Creates the TanStack Start request handler.
*
* @example Backwards-compatible usage (handler callback only):
* ```ts
* export default createStartHandler(defaultStreamHandler)
* ```
*
* @example With CDN URL rewriting:
* ```ts
* export default createStartHandler({
*   handler: defaultStreamHandler,
*   transformAssets: 'https://cdn.example.com',
* })
* ```
*
* @example With per-request URL rewriting:
* ```ts
* export default createStartHandler({
*   handler: defaultStreamHandler,
*   transformAssets: {
*     transform: ({ url }) => {
*       const cdnBase = getRequest().headers.get('x-cdn-base') || ''
*       return { href: `${cdnBase}${url}` }
*     },
*     cache: false,
*   },
* })
* ```
*/
function createStartHandler(cbOrOptions) {
	const handlerOptions = typeof cbOrOptions === "function" ? {} : cbOrOptions;
	const cb = typeof cbOrOptions === "function" ? cbOrOptions : cbOrOptions.handler;
	const finalManifestResolver = createFinalManifestResolver({
		...handlerOptions,
		cacheCreateTransform: true
	});
	const resolveManifestForRequest = finalManifestResolver.resolveCached;
	finalManifestResolver.warmup({ getBaseManifest: () => getBaseManifest(void 0) });
	const startRequestResolver = async (request, requestOpts) => {
		const signal = request.signal;
		let router;
		let routerPromise;
		let responseOwnsCleanup = false;
		try {
			signal.throwIfAborted();
			const { url, handledProtocolRelativeURL } = getNormalizedURL(request.url);
			const href = url.pathname + url.search + url.hash;
			const origin = url.origin;
			if (handledProtocolRelativeURL) return Response.redirect(url, 308);
			const entries = await waitForReason(getEntries(), signal);
			const isServerFnRequest = !!SERVER_FN_BASE && url.pathname.startsWith(SERVER_FN_BASE);
			const startInstance = entries.startEntry.startInstance;
			let startOptions;
			if (startInstance) {
				const pendingStartOptions = startInstance.getOptions();
				startOptions = isPromise(pendingStartOptions) ? await waitForReason(pendingStartOptions, signal) : pendingStartOptions;
				signal.throwIfAborted();
			} else startOptions = {};
			const { hasPluginAdapters, pluginSerializationAdapters } = entries.pluginAdapters;
			const serializationAdapters = [
				...startOptions.serializationAdapters || [],
				...hasPluginAdapters ? pluginSerializationAdapters : [],
				ServerFunctionSerializationAdapter
			];
			const requestStartOptions = {
				...startOptions,
				requestMiddleware: startInstance ? startOptions.requestMiddleware : isServerFnRequest ? [defaultCsrfMiddleware] : void 0,
				serializationAdapters
			};
			const flattenedRequestMiddlewares = requestStartOptions.requestMiddleware ? flattenMiddlewares(requestStartOptions.requestMiddleware) : [];
			const executedRequestMiddlewares = new Set(flattenedRequestMiddlewares);
			const getRouter = () => {
				routerPromise ??= (async () => {
					signal.throwIfAborted();
					const requestRouter = await waitForReason(entries.routerEntry.getRouter(), signal);
					let isShell = IS_SHELL_ENV;
					if (IS_PRERENDERING && !isShell) isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
					const history = createServerHistory(href);
					requestRouter.update({
						history,
						isShell,
						isPrerendering: IS_PRERENDERING,
						origin: requestRouter.options.origin ?? origin,
						defaultSsr: requestStartOptions.defaultSsr,
						serializationAdapters: [...requestStartOptions.serializationAdapters, ...requestRouter.options.serializationAdapters || []],
						basepath: ROUTER_BASEPATH
					});
					router = requestRouter;
					return requestRouter;
				})();
				return routerPromise;
			};
			const handlerType = isServerFnRequest ? "serverFn" : "router";
			const startContext = {
				getRouter,
				startOptions: requestStartOptions,
				request,
				executedRequestMiddlewares,
				handlerType
			};
			let terminal;
			if (isServerFnRequest) {
				if (!hasCsrfMiddleware(flattenedRequestMiddlewares)) warnMissingCsrfMiddlewareOnce();
				const serverFnId = url.pathname.slice(SERVER_FN_BASE.length).split("/")[0];
				if (!serverFnId) throw new Error("Invalid server action param for serverFnId");
				terminal = ({ context }) => runWithStartContext({
					...startContext,
					contextAfterGlobalMiddlewares: context
				}, () => handleServerAction({
					request,
					context: requestOpts?.context,
					serverFnId
				}));
			} else {
				const executeRouter = async (serverContext, matchedRoutes) => {
					if (!/(^|,)\s*(\*\/\*|text\/html)/.test(request.headers.get("Accept") || "*/*")) return normalizeSsrResponse(Response.json({ error: "Only HTML requests are supported here" }, { status: 406 }));
					const manifest = await waitForReason(resolveManifestForRequest({
						request,
						requestInlineCss: requestOpts?.inlineCss,
						getBaseManifest: () => getBaseManifest(matchedRoutes)
					}), signal);
					const earlyHints = createEarlyHintsForRequest({
						onEarlyHints: requestOpts?.onEarlyHints,
						responseLinkHeader: requestOpts?.responseLinkHeader
					});
					earlyHints?.collectStatic({
						manifest,
						matchedRoutes
					});
					const routerInstance = await getRouter();
					attachRouterServerSsrUtils({
						router: routerInstance,
						manifest,
						getRequestAssets: () => getStartContext({ throwIfNotFound: false })?.requestAssets
					});
					routerInstance.options.additionalContext = { serverContext };
					await routerInstance.load({ _signal: signal });
					signal.throwIfAborted();
					if (routerInstance._serverResult?.type === "redirect") return normalizeSsrResponse(routerInstance._serverResult.redirect);
					earlyHints?.collectDynamic(_getRenderedMatches(routerInstance.stores.matches.get()));
					const ctx = getStartContext({ throwIfNotFound: false });
					await routerInstance.serverSsr.dehydrate({
						requestAssets: ctx?.requestAssets,
						signal
					});
					signal.throwIfAborted();
					const responseHeaders = getStartResponseHeaders({ router: routerInstance });
					earlyHints?.appendResponseHeaders(responseHeaders);
					signal.throwIfAborted();
					const disposeLate = createLateResponseDisposer(signal);
					return normalizeSsrResponse(await waitForReason(cb({
						request,
						router: routerInstance,
						responseHeaders
					}), signal, disposeLate, disposeLate));
				};
				terminal = ({ context }) => runWithStartContext({
					...startContext,
					contextAfterGlobalMiddlewares: context
				}, () => handleServerRoutes({
					getRouter,
					request,
					url,
					executeRouter,
					context,
					executedRequestMiddlewares
				}));
			}
			const middlewareResponse = await executeMiddleware(flattenedRequestMiddlewares.map((d) => d.options.server), terminal, {
				request,
				pathname: url.pathname,
				handlerType,
				context: createNullProtoObject(requestOpts?.context)
			}, signal);
			let result;
			try {
				result = await handleRedirectResponse(middlewareResponse, getRouter, signal, isServerFnRequest && request.headers.get("x-tsr-serverFn") === "true");
				if (request.method === "HEAD") result = stripSsrResponseBody(result, "HEAD body stripped");
			} catch (error) {
				disposeResponseResult(middlewareResponse, signal.aborted ? signal.reason : error);
				throw error;
			}
			bindSsrResponseToRequest(router, result, signal);
			signal.throwIfAborted();
			responseOwnsCleanup = result.serverSsrCleanup === "stream";
			return result.response;
		} finally {
			if (router?.serverSsr && !responseOwnsCleanup) router.serverSsr.cleanup();
		}
	};
	return requestHandler(startRequestResolver);
}
var relativeRedirectProtocols = /* @__PURE__ */ new Set();
async function handleRedirectResponse(response, getRouter, signal, serializeRedirect) {
	signal.throwIfAborted();
	const ssrResponse = normalizeSsrResponse(response);
	const redirect = ssrResponse.response;
	if (!isRedirect(redirect)) return ssrResponse;
	const opts = redirect.options;
	const href = redirect.headers.get("Location") || opts.href;
	if (!href && opts.to && typeof opts.to === "string" && !opts.to.startsWith("/")) throw new Error(`Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(opts)}`);
	if (!href && [
		"params",
		"search",
		"hash"
	].some((d) => typeof opts[d] === "function")) throw new Error(`Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(opts).filter((d) => typeof opts[d] === "function").map((d) => `"${d}"`).join(", ")}`);
	signal.throwIfAborted();
	if (href && !isDangerousProtocol(href, relativeRedirectProtocols)) {
		opts.href = href;
		redirect.headers.set("Location", href);
	} else {
		const router = await getRouter();
		signal.throwIfAborted();
		router.resolveRedirect(redirect);
	}
	if (serializeRedirect) {
		const redirectOptions = { ...opts };
		delete redirectOptions.headers;
		const responseHeaders = new Headers(redirect.headers);
		responseHeaders.set("content-type", "application/json");
		return replaceSsrResponse(ssrResponse, Response.json({
			...redirectOptions,
			isSerializedRedirect: true
		}, { headers: responseHeaders }), "redirect response replaced");
	}
	return ssrResponse;
}
async function handleServerRoutes({ getRouter, request, url, executeRouter, context, executedRequestMiddlewares }) {
	const router = await getRouter();
	const pathname = executeRewriteInput(router.rewrite, url).pathname;
	const [matchedRoutes, rawParams, foundRoute] = router.getMatchedRoutes(pathname);
	const isExactMatch = foundRoute && rawParams["**"] === void 0;
	const routeMiddlewares = [];
	let terminalHandler = (ctx) => executeRouter(ctx.context, matchedRoutes);
	let terminalNext;
	for (const route of matchedRoutes) {
		const serverMiddleware = route.options.server?.middleware;
		if (serverMiddleware) {
			const flattened = flattenMiddlewares(serverMiddleware);
			for (const m of flattened) if (!executedRequestMiddlewares.has(m)) routeMiddlewares.push(m.options.server);
		}
	}
	const server = foundRoute?.options.server;
	if (server?.handlers && isExactMatch) {
		const handlers = typeof server.handlers === "function" ? server.handlers({ createHandlers: (d) => d }) : server.handlers;
		const requestMethod = request.method.toUpperCase();
		const handler = requestMethod === "HEAD" ? handlers["HEAD"] ?? handlers["GET"] ?? handlers["ANY"] : handlers[requestMethod] ?? handlers["ANY"];
		if (handler) {
			const mayDefer = !!foundRoute.options.component;
			if (typeof handler === "function") if (!mayDefer) {
				terminalHandler = handler;
				terminalNext = throwIfMayNotDefer;
			} else routeMiddlewares.push(handler);
			else {
				if (handler.middleware?.length) {
					const handlerMiddlewares = flattenMiddlewares(handler.middleware);
					for (const m of handlerMiddlewares) routeMiddlewares.push(m.options.server);
				}
				if (handler.handler) if (!mayDefer) {
					terminalHandler = handler.handler;
					terminalNext = throwIfMayNotDefer;
				} else routeMiddlewares.push(handler.handler);
			}
		}
	}
	return normalizeSsrResponse(await executeMiddleware(routeMiddlewares, terminalHandler, {
		request,
		context,
		params: rawParams,
		pathname,
		handlerType: "router"
	}, request.signal, terminalNext));
}
var server_exports = /* @__PURE__ */ __exportAll({
	createServerEntry: () => createServerEntry,
	default: () => server_default
});
var fetch = createStartHandler(defaultStreamHandler);
function createServerEntry(entry) {
	return { async fetch(...args) {
		return await entry.fetch(...args);
	} };
}
var server_default = createServerEntry({ fetch });
//#endregion
export { getServerFnById as a, TSS_SERVER_FUNCTION as i, createMiddleware as n, getRequest as o, createServerFn as r, getRequestHost$1 as s, server_exports as t };
