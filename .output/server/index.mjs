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
	"/assets/alert-dialog-CZP2oL6q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f05-HWH0n/zHZxNWCxE15Xh8crNj75s\"",
		"mtime": "2026-07-17T12:31:14.774Z",
		"size": 3845,
		"path": "../public/assets/alert-dialog-CZP2oL6q.js"
	},
	"/assets/arrow-right-1L5tIqLL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-NkCYYDLEs0qMCmEAZdcWf+3oF38\"",
		"mtime": "2026-07-17T12:31:14.775Z",
		"size": 153,
		"path": "../public/assets/arrow-right-1L5tIqLL.js"
	},
	"/assets/chevron-left-CNLnuoPV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76-v3ao7PpH/RQovXJ+L6q2M1ZNWXg\"",
		"mtime": "2026-07-17T12:31:14.776Z",
		"size": 118,
		"path": "../public/assets/chevron-left-CNLnuoPV.js"
	},
	"/assets/attendance-CC3kadIh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16699-e6PBCyMe43vZZOVE5CWPWHlZyNw\"",
		"mtime": "2026-07-17T12:31:14.775Z",
		"size": 91801,
		"path": "../public/assets/attendance-CC3kadIh.js"
	},
	"/assets/circle-check-big-BA0cZ9-W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b6-yu15VwiRE9JGLtdV+ejTrv45hLc\"",
		"mtime": "2026-07-17T12:31:14.776Z",
		"size": 182,
		"path": "../public/assets/circle-check-big-BA0cZ9-W.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"39db3-5qccKVxOKdft5FIDSknd0oDywcY\"",
		"mtime": "2026-07-15T10:32:12.410Z",
		"size": 236979,
		"path": "../public/favicon.ico"
	},
	"/assets/calendar-Bi5Q2nsD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f5-LQgYZqa+2TkLllOh4I5X+rJex8w\"",
		"mtime": "2026-07-17T12:31:14.776Z",
		"size": 245,
		"path": "../public/assets/calendar-Bi5Q2nsD.js"
	},
	"/assets/circle-x-eHRIpvPp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"141-rdfJhCBN9WzCWyEjbw9j29Tqa+Y\"",
		"mtime": "2026-07-17T12:31:14.777Z",
		"size": 321,
		"path": "../public/assets/circle-x-eHRIpvPp.js"
	},
	"/tution-logo.png": {
		"type": "image/png",
		"etag": "\"39db3-5qccKVxOKdft5FIDSknd0oDywcY\"",
		"mtime": "2026-07-15T10:32:12.414Z",
		"size": 236979,
		"path": "../public/tution-logo.png"
	},
	"/assets/derive-IeO-PG3g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"39a-v1RZyAInXkpjXer+PL8GZVMWsrU\"",
		"mtime": "2026-07-17T12:31:14.777Z",
		"size": 922,
		"path": "../public/assets/derive-IeO-PG3g.js"
	},
	"/assets/dialog-D_FpINij.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82d-9XavWKW5F0DUtyoPyyaq+SbBWzY\"",
		"mtime": "2026-07-17T12:31:14.777Z",
		"size": 2093,
		"path": "../public/assets/dialog-D_FpINij.js"
	},
	"/assets/eye-CSN2i-l_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f4-M9cDw3a1B0P1nWuyNGoXhks0UR0\"",
		"mtime": "2026-07-17T12:31:14.779Z",
		"size": 244,
		"path": "../public/assets/eye-CSN2i-l_.js"
	},
	"/assets/download-C0JmiOx7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-dP1sbBORP5u6cb3FsXWHmm+pp3c\"",
		"mtime": "2026-07-17T12:31:14.779Z",
		"size": 220,
		"path": "../public/assets/download-C0JmiOx7.js"
	},
	"/assets/dist-Dm_v3ZAG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1da60-NCMpnyO902DXL7z66ELRB76RPWM\"",
		"mtime": "2026-07-17T12:31:14.778Z",
		"size": 121440,
		"path": "../public/assets/dist-Dm_v3ZAG.js"
	},
	"/assets/fees-CubQecbA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2808-isOA28U7a7Fwuo/2dURXvqvM48g\"",
		"mtime": "2026-07-17T12:31:14.779Z",
		"size": 10248,
		"path": "../public/assets/fees-CubQecbA.js"
	},
	"/assets/label-BIFVe-Nt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"276-6nDb4oVEdR+6hAzStk/IKgUCQaA\"",
		"mtime": "2026-07-17T12:31:14.780Z",
		"size": 630,
		"path": "../public/assets/label-BIFVe-Nt.js"
	},
	"/assets/login-M9DS6mge.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bc3-6GLGXquzcuAc0ss5GFwfJ2ZcCoo\"",
		"mtime": "2026-07-17T12:31:14.780Z",
		"size": 3011,
		"path": "../public/assets/login-M9DS6mge.js"
	},
	"/assets/materials-Cjg2G3tq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e81-56zwR2rdyMUU7oGZavXmvk/iPSc\"",
		"mtime": "2026-07-17T12:31:14.780Z",
		"size": 16001,
		"path": "../public/assets/materials-Cjg2G3tq.js"
	},
	"/assets/messages-CeJXXhTp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"460a-uZOXFx/c814+puT4hm+KYqAx350\"",
		"mtime": "2026-07-17T12:31:14.781Z",
		"size": 17930,
		"path": "../public/assets/messages-CeJXXhTp.js"
	},
	"/assets/reports-3kbFJVXC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4199-MVyB/hgshM8qE7CCyJ5en1keMW0\"",
		"mtime": "2026-07-17T12:31:14.781Z",
		"size": 16793,
		"path": "../public/assets/reports-3kbFJVXC.js"
	},
	"/assets/rolldown-runtime-QTnfLwEv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b6-wnqLLSlp3SaE+lbe74bKNe5Rpds\"",
		"mtime": "2026-07-17T12:31:14.782Z",
		"size": 694,
		"path": "../public/assets/rolldown-runtime-QTnfLwEv.js"
	},
	"/assets/routes-WZeggn9I.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f6f-s8Jg0EQNtuiH1HsrA878s0lgcbw\"",
		"mtime": "2026-07-17T12:31:14.782Z",
		"size": 12143,
		"path": "../public/assets/routes-WZeggn9I.js"
	},
	"/assets/index-Cz0p1YR-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7395a-5fh52klbq/a3FJRpjlT5RXm9foU\"",
		"mtime": "2026-07-17T12:31:14.772Z",
		"size": 473434,
		"path": "../public/assets/index-Cz0p1YR-.js"
	},
	"/assets/PieChart-BLi-LbxS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6323d-PjhYGqMtbPezqiNqaobCSYQkXrI\"",
		"mtime": "2026-07-17T12:31:14.773Z",
		"size": 406077,
		"path": "../public/assets/PieChart-BLi-LbxS.js"
	},
	"/assets/settings-BhHgtURI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4913-ZoKbDdQWRBN3mn14cAEpPcu7Vu8\"",
		"mtime": "2026-07-17T12:31:14.783Z",
		"size": 18707,
		"path": "../public/assets/settings-BhHgtURI.js"
	},
	"/assets/send-DS9l1pAD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"116-5z9Vtbx6dXw0QyFGCPFQ4jfsIg4\"",
		"mtime": "2026-07-17T12:31:14.783Z",
		"size": 278,
		"path": "../public/assets/send-DS9l1pAD.js"
	},
	"/assets/select-Bu731Oj0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5732-u20osAJFv/KL9AYjbv8kO/8M6RE\"",
		"mtime": "2026-07-17T12:31:14.782Z",
		"size": 22322,
		"path": "../public/assets/select-Bu731Oj0.js"
	},
	"/assets/src-Csd3SEQD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"92c4-TRGzyhF28y9RaICzx/PZchHomU0\"",
		"mtime": "2026-07-17T12:31:14.783Z",
		"size": 37572,
		"path": "../public/assets/src-Csd3SEQD.js"
	},
	"/assets/StatusBadges-Cusz8e1E.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f7-uSI7DtEz7+s5dEH9Avgn4ma5yzM\"",
		"mtime": "2026-07-17T12:31:14.774Z",
		"size": 759,
		"path": "../public/assets/StatusBadges-Cusz8e1E.js"
	},
	"/assets/StatCard-CFqVLAnz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d0-uoqEjsN3KoE0YEmVsx5gqLOnLXM\"",
		"mtime": "2026-07-17T12:31:14.774Z",
		"size": 1232,
		"path": "../public/assets/StatCard-CFqVLAnz.js"
	},
	"/assets/students.index-IwanKZaq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"277e-rQk/61lxe/KJv3omYJBaVGIuAsk\"",
		"mtime": "2026-07-17T12:31:14.784Z",
		"size": 10110,
		"path": "../public/assets/students.index-IwanKZaq.js"
	},
	"/assets/students._id-B8DAeBNe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2e5d-nMHxL375wNBGezsw2lrX8x+wXIg\"",
		"mtime": "2026-07-17T12:31:14.784Z",
		"size": 11869,
		"path": "../public/assets/students._id-B8DAeBNe.js"
	},
	"/assets/students.new-DmTVNmI5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9ddd-v5Shn9Cdx0RzUzVQgeA1aJ7KMxI\"",
		"mtime": "2026-07-17T12:31:14.785Z",
		"size": 40413,
		"path": "../public/assets/students.new-DmTVNmI5.js"
	},
	"/assets/table-BLQRmFKG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"670-puKaA9fZiQc62ahjcakf5SOGFQk\"",
		"mtime": "2026-07-17T12:31:14.785Z",
		"size": 1648,
		"path": "../public/assets/table-BLQRmFKG.js"
	},
	"/assets/textarea-BXCPCJX-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31f-0nRsCTLjW23ZqUdfGppGGq4ed08\"",
		"mtime": "2026-07-17T12:31:14.786Z",
		"size": 799,
		"path": "../public/assets/textarea-BXCPCJX-.js"
	},
	"/assets/styles-BuczggbA.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"18bcf-g6oIeNL5/m81uJ1QAOXFKo/0h28\"",
		"mtime": "2026-07-17T12:31:14.787Z",
		"size": 101327,
		"path": "../public/assets/styles-BuczggbA.css"
	},
	"/assets/trash-2-xNFGlhLU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13c-RcwzUupbaCruA3PDQafy5EZg0+I\"",
		"mtime": "2026-07-17T12:31:14.786Z",
		"size": 316,
		"path": "../public/assets/trash-2-xNFGlhLU.js"
	},
	"/assets/upload-BrKApUtV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"da-IdVFl/Ki8CPQq6AGvOm5u/2V+wg\"",
		"mtime": "2026-07-17T12:31:14.786Z",
		"size": 218,
		"path": "../public/assets/upload-BrKApUtV.js"
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
