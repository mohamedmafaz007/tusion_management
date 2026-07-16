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
	"/assets/alert-dialog-Cz6cUgbY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"eed-8SexxTNjr62iZyssMaq66OHQN1E\"",
		"mtime": "2026-07-16T17:50:41.046Z",
		"size": 3821,
		"path": "../public/assets/alert-dialog-Cz6cUgbY.js"
	},
	"/assets/calendar-C4CM7RI6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f7-yGQgiFNzvGC0rvNKMZjKQ4fg1NA\"",
		"mtime": "2026-07-16T17:50:41.048Z",
		"size": 247,
		"path": "../public/assets/calendar-C4CM7RI6.js"
	},
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
	"/tution-logo.png": {
		"type": "image/png",
		"etag": "\"39db3-5qccKVxOKdft5FIDSknd0oDywcY\"",
		"mtime": "2026-07-15T10:32:12.414Z",
		"size": 236979,
		"path": "../public/tution-logo.png"
	},
	"/assets/chevron-left-CZqOL2j5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"78-CvH+9uW9V+9yQw4MIA8TJXmQK4U\"",
		"mtime": "2026-07-16T17:50:41.049Z",
		"size": 120,
		"path": "../public/assets/chevron-left-CZqOL2j5.js"
	},
	"/assets/attendance-DYEuN7zW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1646e-mxDjA6QiRW1Uc7ulo10zMV4sod0\"",
		"mtime": "2026-07-16T17:50:41.048Z",
		"size": 91246,
		"path": "../public/assets/attendance-DYEuN7zW.js"
	},
	"/assets/circle-x-Bq-DqMqs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"143-zCF1pZt7RKnsSVoWGTJhp4Hygt8\"",
		"mtime": "2026-07-16T17:50:41.050Z",
		"size": 323,
		"path": "../public/assets/circle-x-Bq-DqMqs.js"
	},
	"/assets/clock-CPsVM-mk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9f-O+tz7U2CXMb2UvM/J/DOHgdorB4\"",
		"mtime": "2026-07-16T17:50:41.050Z",
		"size": 159,
		"path": "../public/assets/clock-CPsVM-mk.js"
	},
	"/assets/derive-4ZPSqEXW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"352-AYs/IQ6Jzt8J2/pPNU32iwXMWBY\"",
		"mtime": "2026-07-16T17:50:41.051Z",
		"size": 850,
		"path": "../public/assets/derive-4ZPSqEXW.js"
	},
	"/assets/dialog-DmFAKW8x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"811-F7lHuZ6QI6KJKe2VsJS7+Oro/a8\"",
		"mtime": "2026-07-16T17:50:41.052Z",
		"size": 2065,
		"path": "../public/assets/dialog-DmFAKW8x.js"
	},
	"/assets/download-BaGGegB2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"de-QN+vkC0mSM08eX7qqdyYGbLxBH4\"",
		"mtime": "2026-07-16T17:50:41.053Z",
		"size": 222,
		"path": "../public/assets/download-BaGGegB2.js"
	},
	"/assets/eye-BiRHM1Ha.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f6-7V1lDufEBeDSInrcKR75UGmY0pc\"",
		"mtime": "2026-07-16T17:50:41.054Z",
		"size": 246,
		"path": "../public/assets/eye-BiRHM1Ha.js"
	},
	"/assets/fees-CZ7_Lu1a.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2756-ZkaBqr7EyKo+fYyPYfQKu/SswdE\"",
		"mtime": "2026-07-16T17:50:41.055Z",
		"size": 10070,
		"path": "../public/assets/fees-CZ7_Lu1a.js"
	},
	"/assets/label-XT6VOSgQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25b-GnQXeYQ7RBaMMzg2ZEtJngzIMpI\"",
		"mtime": "2026-07-16T17:50:41.055Z",
		"size": 603,
		"path": "../public/assets/label-XT6VOSgQ.js"
	},
	"/assets/loader-circle-D0o7KZkK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"113-8Ovkg/ywiLcF6uIhUElUEv8HfOo\"",
		"mtime": "2026-07-16T17:50:41.055Z",
		"size": 275,
		"path": "../public/assets/loader-circle-D0o7KZkK.js"
	},
	"/assets/materials-DpGfkRiE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"42d2-i2/8lzTyvL64oRqqsDYcpG0rkzo\"",
		"mtime": "2026-07-16T17:50:41.056Z",
		"size": 17106,
		"path": "../public/assets/materials-DpGfkRiE.js"
	},
	"/assets/messages-H0iSk5h5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3861-MxUUDQKFh3yE7fC9tQPxK9avgI8\"",
		"mtime": "2026-07-16T17:50:41.057Z",
		"size": 14433,
		"path": "../public/assets/messages-H0iSk5h5.js"
	},
	"/assets/printer-DZqrQEd8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"135-B/OvrD/ItDoiLJk7EL4M/K11IRc\"",
		"mtime": "2026-07-16T17:50:41.057Z",
		"size": 309,
		"path": "../public/assets/printer-DZqrQEd8.js"
	},
	"/assets/reports-KJ_MaM04.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19ee-KhFdXOicS3PDTlc1+a3QyeMGTtg\"",
		"mtime": "2026-07-16T17:50:41.058Z",
		"size": 6638,
		"path": "../public/assets/reports-KJ_MaM04.js"
	},
	"/assets/PieChart-CZqptnam.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6323f-kEAcDYBxwdN5Vi8yH8lvqrWCm5A\"",
		"mtime": "2026-07-16T17:50:41.043Z",
		"size": 406079,
		"path": "../public/assets/PieChart-CZqptnam.js"
	},
	"/assets/rolldown-runtime-QTnfLwEv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b6-wnqLLSlp3SaE+lbe74bKNe5Rpds\"",
		"mtime": "2026-07-16T17:50:41.060Z",
		"size": 694,
		"path": "../public/assets/rolldown-runtime-QTnfLwEv.js"
	},
	"/assets/routes-Cgi_ekvL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26f9-3ntbRSAoTRnRzEpVonqi6ugmQJg\"",
		"mtime": "2026-07-16T17:50:41.061Z",
		"size": 9977,
		"path": "../public/assets/routes-Cgi_ekvL.js"
	},
	"/assets/select-zNEZFofW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5727-OHiDcUsznuF6QQTNFpUpefAauCE\"",
		"mtime": "2026-07-16T17:50:41.061Z",
		"size": 22311,
		"path": "../public/assets/select-zNEZFofW.js"
	},
	"/assets/index-ChpWcg2q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"901e9-tLPnNlHshW3Rd4NHYEtXBaFvlaU\"",
		"mtime": "2026-07-16T17:50:41.042Z",
		"size": 590313,
		"path": "../public/assets/index-ChpWcg2q.js"
	},
	"/assets/send-D9ty_KUV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"118-utn7n1gY1f2tvDtcVwpnRvQJx/E\"",
		"mtime": "2026-07-16T17:50:41.062Z",
		"size": 280,
		"path": "../public/assets/send-D9ty_KUV.js"
	},
	"/assets/settings-BqgEWPGb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4128-U+W+xYCmvcMVZBoxJbFG46OPE/M\"",
		"mtime": "2026-07-16T17:50:41.062Z",
		"size": 16680,
		"path": "../public/assets/settings-BqgEWPGb.js"
	},
	"/assets/StatCard-BhXWpioa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d3-fLjqrQt6K+iSYCOrE5rAsdekDGk\"",
		"mtime": "2026-07-16T17:50:41.044Z",
		"size": 1235,
		"path": "../public/assets/StatCard-BhXWpioa.js"
	},
	"/assets/src-Csd3SEQD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"92c4-TRGzyhF28y9RaICzx/PZchHomU0\"",
		"mtime": "2026-07-16T17:50:41.063Z",
		"size": 37572,
		"path": "../public/assets/src-Csd3SEQD.js"
	},
	"/assets/StatusBadges-C-GZnoY2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d9-jxlEPdAc2HhAS2HlzLFAkUPgsbU\"",
		"mtime": "2026-07-16T17:50:41.045Z",
		"size": 729,
		"path": "../public/assets/StatusBadges-C-GZnoY2.js"
	},
	"/assets/students.index-C2dT-HDZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2823-2G93Pv9QIJi8bcWsAQyIUKKsyLU\"",
		"mtime": "2026-07-16T17:50:41.064Z",
		"size": 10275,
		"path": "../public/assets/students.index-C2dT-HDZ.js"
	},
	"/assets/students.new-DIRFmPnq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9909-Bza8VvjuFW/LTCosa2a7FqxRI+c\"",
		"mtime": "2026-07-16T17:50:41.064Z",
		"size": 39177,
		"path": "../public/assets/students.new-DIRFmPnq.js"
	},
	"/assets/students._id-d0Hs-Ozc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29e6-Vkn9QFZ6HpyqeafEbLda9DsL6VM\"",
		"mtime": "2026-07-16T17:50:41.063Z",
		"size": 10726,
		"path": "../public/assets/students._id-d0Hs-Ozc.js"
	},
	"/assets/table-CLpXDN3j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"674-KkEVr7k4gMHsRblHvyDm7CIB098\"",
		"mtime": "2026-07-16T17:50:41.066Z",
		"size": 1652,
		"path": "../public/assets/table-CLpXDN3j.js"
	},
	"/assets/textarea-kY2wzdHG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"324-DYkfEW3Y82mF4dtrNYjEHTYeTaY\"",
		"mtime": "2026-07-16T17:50:41.067Z",
		"size": 804,
		"path": "../public/assets/textarea-kY2wzdHG.js"
	},
	"/assets/styles-RTN9NhZf.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"17d15-kohvYZPQL/kEu9fhKD4y9hHjyFQ\"",
		"mtime": "2026-07-16T17:50:41.070Z",
		"size": 97557,
		"path": "../public/assets/styles-RTN9NhZf.css"
	},
	"/assets/trash-2-OgufZXsG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13e-51eHilt+7uOHD982BevJwqbn/w8\"",
		"mtime": "2026-07-16T17:50:41.068Z",
		"size": 318,
		"path": "../public/assets/trash-2-OgufZXsG.js"
	},
	"/assets/types-DR9ELmHb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bb-hwSsg8rwxm59izN9cWkXGLHyzS0\"",
		"mtime": "2026-07-16T17:50:41.069Z",
		"size": 187,
		"path": "../public/assets/types-DR9ELmHb.js"
	},
	"/assets/upload-BxeS7yQr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-kdedXK4py7x90Jd5ZLuUHSTKNDM\"",
		"mtime": "2026-07-16T17:50:41.069Z",
		"size": 220,
		"path": "../public/assets/upload-BxeS7yQr.js"
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
