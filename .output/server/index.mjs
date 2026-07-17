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
	"/assets/alert-dialog-CJ_Pv0td.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f05-p/ptmAUQlwS/Dm37ozG/QTJRXaE\"",
		"mtime": "2026-07-17T10:26:30.028Z",
		"size": 3845,
		"path": "../public/assets/alert-dialog-CJ_Pv0td.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"19-yHADZo6lKl+mSNPU9098EiqzPCE\"",
		"mtime": "2026-07-15T10:32:12.411Z",
		"size": 25,
		"path": "../public/robots.txt"
	},
	"/assets/attendance-BwHuR5lc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16613-EIc4oURevEPpBRNffRUv3PQK1ac\"",
		"mtime": "2026-07-17T10:26:30.036Z",
		"size": 91667,
		"path": "../public/assets/attendance-BwHuR5lc.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"39db3-5qccKVxOKdft5FIDSknd0oDywcY\"",
		"mtime": "2026-07-15T10:32:12.410Z",
		"size": 236979,
		"path": "../public/favicon.ico"
	},
	"/assets/arrow-right-rivIqps3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-hjeI0JNEMOnYc5CAdTxBljYqymo\"",
		"mtime": "2026-07-17T10:26:30.035Z",
		"size": 153,
		"path": "../public/assets/arrow-right-rivIqps3.js"
	},
	"/assets/chevron-left-SSpi7rnr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76-03+0oFGdTaspbIp2q6l+gQ+Vcec\"",
		"mtime": "2026-07-17T10:26:30.037Z",
		"size": 118,
		"path": "../public/assets/chevron-left-SSpi7rnr.js"
	},
	"/assets/calendar-DHNhUifQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f5-SHTGz1CUhXXXbCHjkRE2G8PwdW8\"",
		"mtime": "2026-07-17T10:26:30.036Z",
		"size": 245,
		"path": "../public/assets/calendar-DHNhUifQ.js"
	},
	"/assets/derive-IeO-PG3g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"39a-v1RZyAInXkpjXer+PL8GZVMWsrU\"",
		"mtime": "2026-07-17T10:26:30.038Z",
		"size": 922,
		"path": "../public/assets/derive-IeO-PG3g.js"
	},
	"/tution-logo.png": {
		"type": "image/png",
		"etag": "\"39db3-5qccKVxOKdft5FIDSknd0oDywcY\"",
		"mtime": "2026-07-15T10:32:12.414Z",
		"size": 236979,
		"path": "../public/tution-logo.png"
	},
	"/assets/dialog-DY2JLazT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82d-s973K60c9cfoTxXfQFC2BLDqjas\"",
		"mtime": "2026-07-17T10:26:30.038Z",
		"size": 2093,
		"path": "../public/assets/dialog-DY2JLazT.js"
	},
	"/assets/circle-x-YRUDpmkt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"141-B9hjkzmALEJn5eRSDKg8oPbEpg0\"",
		"mtime": "2026-07-17T10:26:30.037Z",
		"size": 321,
		"path": "../public/assets/circle-x-YRUDpmkt.js"
	},
	"/assets/download-CuFnboQ5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-Og/YJogCo8+iIoKq+sj5isotejI\"",
		"mtime": "2026-07-17T10:26:30.039Z",
		"size": 220,
		"path": "../public/assets/download-CuFnboQ5.js"
	},
	"/assets/eye-cRuwtEiE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f4-O91B40hxAeHkGPrKK+RdKqFcw+E\"",
		"mtime": "2026-07-17T10:26:30.040Z",
		"size": 244,
		"path": "../public/assets/eye-cRuwtEiE.js"
	},
	"/assets/circle-check-big-BzjjJuLp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b6-Al8pWdEqMJsPr1dh3pBhnRX1wv8\"",
		"mtime": "2026-07-17T10:26:30.037Z",
		"size": 182,
		"path": "../public/assets/circle-check-big-BzjjJuLp.js"
	},
	"/assets/dist-wn7ViYkO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d92d-TDJOF0gusBW2Csv3oVPNNA69uU8\"",
		"mtime": "2026-07-17T10:26:30.039Z",
		"size": 121133,
		"path": "../public/assets/dist-wn7ViYkO.js"
	},
	"/assets/fees-JB1v_2_w.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"282f-1FPHH5Mqzfi7oNEECXXi5nAnaeY\"",
		"mtime": "2026-07-17T10:26:30.041Z",
		"size": 10287,
		"path": "../public/assets/fees-JB1v_2_w.js"
	},
	"/assets/label-CZCGwL6d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"276-C4xRgPZb1fft0ZxOS6dpFtcntKs\"",
		"mtime": "2026-07-17T10:26:30.041Z",
		"size": 630,
		"path": "../public/assets/label-CZCGwL6d.js"
	},
	"/assets/loader-circle-CWXH73Li.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"84-rCPU5/72guzhlsGyD1d466YL1gc\"",
		"mtime": "2026-07-17T10:26:30.042Z",
		"size": 132,
		"path": "../public/assets/loader-circle-CWXH73Li.js"
	},
	"/assets/login-DjNkjghl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"beb-SQIpy2HSt+kSzV2UFjS11lUjEcI\"",
		"mtime": "2026-07-17T10:26:30.043Z",
		"size": 3051,
		"path": "../public/assets/login-DjNkjghl.js"
	},
	"/assets/materials-JWlTHKs_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e69-nhRWiVSuW1ku1+5RamF7RLgWTdM\"",
		"mtime": "2026-07-17T10:26:30.043Z",
		"size": 15977,
		"path": "../public/assets/materials-JWlTHKs_.js"
	},
	"/assets/messages-Cp20cIxf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4632-oaxRGwzecyViJxPPk26BcPshoTU\"",
		"mtime": "2026-07-17T10:26:30.043Z",
		"size": 17970,
		"path": "../public/assets/messages-Cp20cIxf.js"
	},
	"/assets/reports-DYqcMixh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4199-/giCHhV3VoJ/rONXhjZQjcpT3hk\"",
		"mtime": "2026-07-17T10:26:30.045Z",
		"size": 16793,
		"path": "../public/assets/reports-DYqcMixh.js"
	},
	"/assets/rolldown-runtime-QTnfLwEv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b6-wnqLLSlp3SaE+lbe74bKNe5Rpds\"",
		"mtime": "2026-07-17T10:26:30.045Z",
		"size": 694,
		"path": "../public/assets/rolldown-runtime-QTnfLwEv.js"
	},
	"/assets/index-TFylK15k.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7320a-/oZQVA7UeARIZ0zhqiV+jsgVyP8\"",
		"mtime": "2026-07-17T10:26:30.024Z",
		"size": 471562,
		"path": "../public/assets/index-TFylK15k.js"
	},
	"/assets/PieChart-CIY528ZU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6323d-CmZB0QzlmoGZXXzPiw/ZuAwK/Eo\"",
		"mtime": "2026-07-17T10:26:30.025Z",
		"size": 406077,
		"path": "../public/assets/PieChart-CIY528ZU.js"
	},
	"/assets/send-BFI-wjH9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"116-gl66Td+RyYV8tEU5y8ny5Puzq/w\"",
		"mtime": "2026-07-17T10:26:30.046Z",
		"size": 278,
		"path": "../public/assets/send-BFI-wjH9.js"
	},
	"/assets/settings-DtdGEY1f.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4936-XCaR+z7P6v8Ehua8MO4DiGAP8qY\"",
		"mtime": "2026-07-17T10:26:30.047Z",
		"size": 18742,
		"path": "../public/assets/settings-DtdGEY1f.js"
	},
	"/assets/routes-CXBMnJxk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f6e-luK2b/QErFDdd4as3N6Y9IpDtm0\"",
		"mtime": "2026-07-17T10:26:30.046Z",
		"size": 12142,
		"path": "../public/assets/routes-CXBMnJxk.js"
	},
	"/assets/select-BFWxDB4M.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5732-VNGqrDBNOQzjpLpvFsp0XnWWgUw\"",
		"mtime": "2026-07-17T10:26:30.046Z",
		"size": 22322,
		"path": "../public/assets/select-BFWxDB4M.js"
	},
	"/assets/StatusBadges-CIfGBjBP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f7-GwgihJkJlQ4PGwFQpLTceZ8zA/M\"",
		"mtime": "2026-07-17T10:26:30.027Z",
		"size": 759,
		"path": "../public/assets/StatusBadges-CIfGBjBP.js"
	},
	"/assets/src-Csd3SEQD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"92c4-TRGzyhF28y9RaICzx/PZchHomU0\"",
		"mtime": "2026-07-17T10:26:30.047Z",
		"size": 37572,
		"path": "../public/assets/src-Csd3SEQD.js"
	},
	"/assets/StatCard-Du2GHmuu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d0-gjLlfCp47Q0DexRUNqWo61RCTG0\"",
		"mtime": "2026-07-17T10:26:30.026Z",
		"size": 1232,
		"path": "../public/assets/StatCard-Du2GHmuu.js"
	},
	"/assets/students.index-Dq6Ebwih.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"277e-lXSY+eYQ0HJk2s7WwIHc/5+r2xg\"",
		"mtime": "2026-07-17T10:26:30.048Z",
		"size": 10110,
		"path": "../public/assets/students.index-Dq6Ebwih.js"
	},
	"/assets/students._id-CB5ajsaB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a0e-hKAb9FR2ocHFY4e8kkaTN47Rgwo\"",
		"mtime": "2026-07-17T10:26:30.048Z",
		"size": 10766,
		"path": "../public/assets/students._id-CB5ajsaB.js"
	},
	"/assets/textarea-A6qgdlU1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31f-ftczdYNxzeSk8ojZX7SvXmC+qF8\"",
		"mtime": "2026-07-17T10:26:30.049Z",
		"size": 799,
		"path": "../public/assets/textarea-A6qgdlU1.js"
	},
	"/assets/trash-2-Bfbe009D.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13c-78KjQ+91+MtThYAA+DYAveN1f84\"",
		"mtime": "2026-07-17T10:26:30.051Z",
		"size": 316,
		"path": "../public/assets/trash-2-Bfbe009D.js"
	},
	"/assets/upload-Dm5sYBGr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"da-nB/AZM46LGq+pOVuiijqczA1P6o\"",
		"mtime": "2026-07-17T10:26:30.051Z",
		"size": 218,
		"path": "../public/assets/upload-Dm5sYBGr.js"
	},
	"/assets/students.new-BZTN2wMC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9aed-TA8+oXm/WAU2IMQX+AS11Fn53Qo\"",
		"mtime": "2026-07-17T10:26:30.049Z",
		"size": 39661,
		"path": "../public/assets/students.new-BZTN2wMC.js"
	},
	"/assets/table-ColaR02z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"670-5K9NdMsphWmhvbqASX6eGxTLJ8M\"",
		"mtime": "2026-07-17T10:26:30.049Z",
		"size": 1648,
		"path": "../public/assets/table-ColaR02z.js"
	},
	"/assets/styles-DCwmuZSf.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"187a4-XXkU9NG7LaWaYSQwaOSM0ssxYbI\"",
		"mtime": "2026-07-17T10:26:30.051Z",
		"size": 100260,
		"path": "../public/assets/styles-DCwmuZSf.css"
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
