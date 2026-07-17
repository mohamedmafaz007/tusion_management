globalThis.__nitro_main__ = import.meta.url;
import { a as toEventHandler, c as serve, i as defineLazyEventHandler, n as HTTPError, r as defineHandler, s as NodeResponse, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"19-yHADZo6lKl+mSNPU9098EiqzPCE\"",
		"mtime": "2026-07-15T10:32:12.411Z",
		"size": 25,
		"path": "../public/robots.txt"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"39db3-5qccKVxOKdft5FIDSknd0oDywcY\"",
		"mtime": "2026-07-15T10:32:12.410Z",
		"size": 236979,
		"path": "../public/favicon.ico"
	},
	"/assets/alert-dialog-CoQY7t95.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f05-oW1zqB4UwN3x9r1DftcKcG1XxFk\"",
		"mtime": "2026-07-17T11:00:50.809Z",
		"size": 3845,
		"path": "../public/assets/alert-dialog-CoQY7t95.js"
	},
	"/assets/arrow-right-rivIqps3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-hjeI0JNEMOnYc5CAdTxBljYqymo\"",
		"mtime": "2026-07-17T11:00:50.809Z",
		"size": 153,
		"path": "../public/assets/arrow-right-rivIqps3.js"
	},
	"/tution-logo.png": {
		"type": "image/png",
		"etag": "\"39db3-5qccKVxOKdft5FIDSknd0oDywcY\"",
		"mtime": "2026-07-15T10:32:12.414Z",
		"size": 236979,
		"path": "../public/tution-logo.png"
	},
	"/assets/calendar-DHNhUifQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f5-SHTGz1CUhXXXbCHjkRE2G8PwdW8\"",
		"mtime": "2026-07-17T11:00:50.811Z",
		"size": 245,
		"path": "../public/assets/calendar-DHNhUifQ.js"
	},
	"/assets/attendance-dXlxY-ii.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"165ea-oK5j7mJu7CqdFaJk9RwaEwZ0D+U\"",
		"mtime": "2026-07-17T11:00:50.810Z",
		"size": 91626,
		"path": "../public/assets/attendance-dXlxY-ii.js"
	},
	"/assets/chevron-left-SSpi7rnr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76-03+0oFGdTaspbIp2q6l+gQ+Vcec\"",
		"mtime": "2026-07-17T11:00:50.812Z",
		"size": 118,
		"path": "../public/assets/chevron-left-SSpi7rnr.js"
	},
	"/assets/circle-check-big-BzjjJuLp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b6-Al8pWdEqMJsPr1dh3pBhnRX1wv8\"",
		"mtime": "2026-07-17T11:00:50.812Z",
		"size": 182,
		"path": "../public/assets/circle-check-big-BzjjJuLp.js"
	},
	"/assets/circle-x-YRUDpmkt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"141-B9hjkzmALEJn5eRSDKg8oPbEpg0\"",
		"mtime": "2026-07-17T11:00:50.813Z",
		"size": 321,
		"path": "../public/assets/circle-x-YRUDpmkt.js"
	},
	"/assets/derive-IeO-PG3g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"39a-v1RZyAInXkpjXer+PL8GZVMWsrU\"",
		"mtime": "2026-07-17T11:00:50.813Z",
		"size": 922,
		"path": "../public/assets/derive-IeO-PG3g.js"
	},
	"/assets/dialog-D_lnOiW6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82d-eHbtPufaMl/JiE1xlPnwgVPp+wc\"",
		"mtime": "2026-07-17T11:00:50.814Z",
		"size": 2093,
		"path": "../public/assets/dialog-D_lnOiW6.js"
	},
	"/assets/download-CuFnboQ5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-Og/YJogCo8+iIoKq+sj5isotejI\"",
		"mtime": "2026-07-17T11:00:50.814Z",
		"size": 220,
		"path": "../public/assets/download-CuFnboQ5.js"
	},
	"/assets/dist-wn7ViYkO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d92d-TDJOF0gusBW2Csv3oVPNNA69uU8\"",
		"mtime": "2026-07-17T11:00:50.814Z",
		"size": 121133,
		"path": "../public/assets/dist-wn7ViYkO.js"
	},
	"/assets/fees-CUt-l0QM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2807-QlqIeleBpCMdYKF5syfox6Bg/dg\"",
		"mtime": "2026-07-17T11:00:50.817Z",
		"size": 10247,
		"path": "../public/assets/fees-CUt-l0QM.js"
	},
	"/assets/login-DruSc7qP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bc3-lTCM6Z/+Uef1S5/FS/At7ENqp38\"",
		"mtime": "2026-07-17T11:00:50.818Z",
		"size": 3011,
		"path": "../public/assets/login-DruSc7qP.js"
	},
	"/assets/label-DxoqntRr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"276-AG8yWkb+llsM3e1f+wArtomzZQo\"",
		"mtime": "2026-07-17T11:00:50.817Z",
		"size": 630,
		"path": "../public/assets/label-DxoqntRr.js"
	},
	"/assets/eye-cRuwtEiE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f4-O91B40hxAeHkGPrKK+RdKqFcw+E\"",
		"mtime": "2026-07-17T11:00:50.816Z",
		"size": 244,
		"path": "../public/assets/eye-cRuwtEiE.js"
	},
	"/assets/materials-DS6rZ59Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e81-YulsFRb6MFbZjdRCSl8rufurlCw\"",
		"mtime": "2026-07-17T11:00:50.819Z",
		"size": 16001,
		"path": "../public/assets/materials-DS6rZ59Q.js"
	},
	"/assets/messages-g10N2n_1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4605-WI21JROuNj2iBEQVL6Rnj56wBbo\"",
		"mtime": "2026-07-17T11:00:50.819Z",
		"size": 17925,
		"path": "../public/assets/messages-g10N2n_1.js"
	},
	"/assets/reports-BD-2hucM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4199-7+KoOzjHDmXydLInpW65o1ZTozo\"",
		"mtime": "2026-07-17T11:00:50.820Z",
		"size": 16793,
		"path": "../public/assets/reports-BD-2hucM.js"
	},
	"/assets/rolldown-runtime-QTnfLwEv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b6-wnqLLSlp3SaE+lbe74bKNe5Rpds\"",
		"mtime": "2026-07-17T11:00:50.821Z",
		"size": 694,
		"path": "../public/assets/rolldown-runtime-QTnfLwEv.js"
	},
	"/assets/index-C8APOZpK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"736cb-SS/gOQF9I50aFr29x1FJbtgUfco\"",
		"mtime": "2026-07-17T11:00:50.805Z",
		"size": 472779,
		"path": "../public/assets/index-C8APOZpK.js"
	},
	"/assets/routes-hc55cOC_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f6e-8Yt1UJ3ntiLyQLekuDMo1ZqdJcM\"",
		"mtime": "2026-07-17T11:00:50.822Z",
		"size": 12142,
		"path": "../public/assets/routes-hc55cOC_.js"
	},
	"/assets/PieChart-CIY528ZU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6323d-CmZB0QzlmoGZXXzPiw/ZuAwK/Eo\"",
		"mtime": "2026-07-17T11:00:50.806Z",
		"size": 406077,
		"path": "../public/assets/PieChart-CIY528ZU.js"
	},
	"/assets/send-BFI-wjH9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"116-gl66Td+RyYV8tEU5y8ny5Puzq/w\"",
		"mtime": "2026-07-17T11:00:50.823Z",
		"size": 278,
		"path": "../public/assets/send-BFI-wjH9.js"
	},
	"/assets/select-BzJCN62Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5732-dtKsHeXuvFYk9/crN/HANaUqO/0\"",
		"mtime": "2026-07-17T11:00:50.822Z",
		"size": 22322,
		"path": "../public/assets/select-BzJCN62Y.js"
	},
	"/assets/src-Csd3SEQD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"92c4-TRGzyhF28y9RaICzx/PZchHomU0\"",
		"mtime": "2026-07-17T11:00:50.823Z",
		"size": 37572,
		"path": "../public/assets/src-Csd3SEQD.js"
	},
	"/assets/StatCard-Du2GHmuu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d0-gjLlfCp47Q0DexRUNqWo61RCTG0\"",
		"mtime": "2026-07-17T11:00:50.807Z",
		"size": 1232,
		"path": "../public/assets/StatCard-Du2GHmuu.js"
	},
	"/assets/settings-DnM0yo-q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"490e-GudD82NGlDuTICnUqR3RB3IsnQc\"",
		"mtime": "2026-07-17T11:00:50.823Z",
		"size": 18702,
		"path": "../public/assets/settings-DnM0yo-q.js"
	},
	"/assets/StatusBadges-CPTnf9ic.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f7-0Lp5yeAOQesAYJjSq70TXcKTOdo\"",
		"mtime": "2026-07-17T11:00:50.807Z",
		"size": 759,
		"path": "../public/assets/StatusBadges-CPTnf9ic.js"
	},
	"/assets/students.new-DaKAal5n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9ac2-S6lh1uL3IME6tZuOU1dnvWYCqOI\"",
		"mtime": "2026-07-17T11:00:50.826Z",
		"size": 39618,
		"path": "../public/assets/students.new-DaKAal5n.js"
	},
	"/assets/students.index-CdXvyur9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"277e-TQ/OGgyWCXUW8jWLzX4CAtr7nTM\"",
		"mtime": "2026-07-17T11:00:50.825Z",
		"size": 10110,
		"path": "../public/assets/students.index-CdXvyur9.js"
	},
	"/assets/students._id-kl63JFuW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a0e-AtpsEu7ksUyRpR+OuV5IkVgz6m4\"",
		"mtime": "2026-07-17T11:00:50.825Z",
		"size": 10766,
		"path": "../public/assets/students._id-kl63JFuW.js"
	},
	"/assets/styles-CJWwI19_.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"18bb8-irJN0eFZfyGDiweu+LT/b+G7KV4\"",
		"mtime": "2026-07-17T11:00:50.829Z",
		"size": 101304,
		"path": "../public/assets/styles-CJWwI19_.css"
	},
	"/assets/table-ColaR02z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"670-5K9NdMsphWmhvbqASX6eGxTLJ8M\"",
		"mtime": "2026-07-17T11:00:50.827Z",
		"size": 1648,
		"path": "../public/assets/table-ColaR02z.js"
	},
	"/assets/textarea-A6qgdlU1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31f-ftczdYNxzeSk8ojZX7SvXmC+qF8\"",
		"mtime": "2026-07-17T11:00:50.828Z",
		"size": 799,
		"path": "../public/assets/textarea-A6qgdlU1.js"
	},
	"/assets/upload-Dm5sYBGr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"da-nB/AZM46LGq+pOVuiijqczA1P6o\"",
		"mtime": "2026-07-17T11:00:50.829Z",
		"size": 218,
		"path": "../public/assets/upload-Dm5sYBGr.js"
	},
	"/assets/trash-2-Bfbe009D.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13c-78KjQ+91+MtThYAA+DYAveN1f84\"",
		"mtime": "2026-07-17T11:00:50.828Z",
		"size": 316,
		"path": "../public/assets/trash-2-Bfbe009D.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_8zV2hQ = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_8zV2hQ
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
