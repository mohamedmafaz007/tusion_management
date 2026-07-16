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
	"/assets/alert-dialog-9s9ERJ0x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"eed-jRJ4hR/nNNmE47gfyfkXoOLSlQU\"",
		"mtime": "2026-07-16T17:11:31.027Z",
		"size": 3821,
		"path": "../public/assets/alert-dialog-9s9ERJ0x.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"39db3-5qccKVxOKdft5FIDSknd0oDywcY\"",
		"mtime": "2026-07-15T10:32:12.410Z",
		"size": 236979,
		"path": "../public/favicon.ico"
	},
	"/assets/calendar-D-Da0g-e.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f7-RZCFJIGGLEHz0s17g3x5aamLGBg\"",
		"mtime": "2026-07-16T17:11:31.029Z",
		"size": 247,
		"path": "../public/assets/calendar-D-Da0g-e.js"
	},
	"/assets/attendance-CZiih5Io.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16463-rHZgbhTRA3U0C7k/EEOlYSxme98\"",
		"mtime": "2026-07-16T17:11:31.028Z",
		"size": 91235,
		"path": "../public/assets/attendance-CZiih5Io.js"
	},
	"/assets/chevron-left-tyhkaC0P.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"78-4f3BVRX/gPQEU/pYAqwzmVzu7M0\"",
		"mtime": "2026-07-16T17:11:31.029Z",
		"size": 120,
		"path": "../public/assets/chevron-left-tyhkaC0P.js"
	},
	"/tution-logo.png": {
		"type": "image/png",
		"etag": "\"39db3-5qccKVxOKdft5FIDSknd0oDywcY\"",
		"mtime": "2026-07-15T10:32:12.414Z",
		"size": 236979,
		"path": "../public/tution-logo.png"
	},
	"/assets/circle-x-CXJEbkT9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"143-qlhiVqCk/pvToulZ5ZJsdzFSA6A\"",
		"mtime": "2026-07-16T17:11:31.030Z",
		"size": 323,
		"path": "../public/assets/circle-x-CXJEbkT9.js"
	},
	"/assets/clock-B1zOkrb6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9f-bmqezTDi2Xy6bAh6adW3GTx+WW8\"",
		"mtime": "2026-07-16T17:11:31.031Z",
		"size": 159,
		"path": "../public/assets/clock-B1zOkrb6.js"
	},
	"/assets/derive-4ZPSqEXW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"352-AYs/IQ6Jzt8J2/pPNU32iwXMWBY\"",
		"mtime": "2026-07-16T17:11:31.032Z",
		"size": 850,
		"path": "../public/assets/derive-4ZPSqEXW.js"
	},
	"/assets/dialog-Dl6KABND.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"811-MECRXplyWk5wjt5KrYQgq+Hu5GM\"",
		"mtime": "2026-07-16T17:11:31.033Z",
		"size": 2065,
		"path": "../public/assets/dialog-Dl6KABND.js"
	},
	"/assets/download-C7SEOqE6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"de-jmklC61AHo7SDI5WX6ICbhp9+q0\"",
		"mtime": "2026-07-16T17:11:31.033Z",
		"size": 222,
		"path": "../public/assets/download-C7SEOqE6.js"
	},
	"/assets/eye-1FSKfDIY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f6-RGhW/sFcxZ0kokkGmFB0S5gXTkA\"",
		"mtime": "2026-07-16T17:11:31.034Z",
		"size": 246,
		"path": "../public/assets/eye-1FSKfDIY.js"
	},
	"/assets/loader-circle-CoSMXjxL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"113-oHzKQ2hYehBrzWY/CEQfvzt5ztA\"",
		"mtime": "2026-07-16T17:11:31.036Z",
		"size": 275,
		"path": "../public/assets/loader-circle-CoSMXjxL.js"
	},
	"/assets/fees-CLhdJHh8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2756-ctLF48IDFYlgJ8eITooipJ+HSBo\"",
		"mtime": "2026-07-16T17:11:31.035Z",
		"size": 10070,
		"path": "../public/assets/fees-CLhdJHh8.js"
	},
	"/assets/label-C4f64b3v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25b-CWd3cwrimBViVqVpDXbdBlbLqlQ\"",
		"mtime": "2026-07-16T17:11:31.035Z",
		"size": 603,
		"path": "../public/assets/label-C4f64b3v.js"
	},
	"/assets/materials-Yc8o1sJa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"42cd-7f6azEfJTf9sZINCHrZ3UznwnqE\"",
		"mtime": "2026-07-16T17:11:31.037Z",
		"size": 17101,
		"path": "../public/assets/materials-Yc8o1sJa.js"
	},
	"/assets/messages--DUSX_OY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3866-P8YnTiO/apjmlDDlriUVE4BDBmc\"",
		"mtime": "2026-07-16T17:11:31.037Z",
		"size": 14438,
		"path": "../public/assets/messages--DUSX_OY.js"
	},
	"/assets/printer-Cr3-4tDf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"135-IkxNMIR6uP95RDIg6ZzIRKGqpaE\"",
		"mtime": "2026-07-16T17:11:31.038Z",
		"size": 309,
		"path": "../public/assets/printer-Cr3-4tDf.js"
	},
	"/assets/reports-BACTjBQ8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19ee-l6c1IRogPWjAWtZwa8oxvHCfnwM\"",
		"mtime": "2026-07-16T17:11:31.039Z",
		"size": 6638,
		"path": "../public/assets/reports-BACTjBQ8.js"
	},
	"/assets/rolldown-runtime-QTnfLwEv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b6-wnqLLSlp3SaE+lbe74bKNe5Rpds\"",
		"mtime": "2026-07-16T17:11:31.040Z",
		"size": 694,
		"path": "../public/assets/rolldown-runtime-QTnfLwEv.js"
	},
	"/assets/routes-BlJ7WcK8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26f9-K9XtVlPNHajSXWlX02IfWtx2oRM\"",
		"mtime": "2026-07-16T17:11:31.041Z",
		"size": 9977,
		"path": "../public/assets/routes-BlJ7WcK8.js"
	},
	"/assets/select-6YAfdjZF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5723-BL/PIShTfHghN0uZu/PiLqEzNQ8\"",
		"mtime": "2026-07-16T17:11:31.042Z",
		"size": 22307,
		"path": "../public/assets/select-6YAfdjZF.js"
	},
	"/assets/PieChart-BM9ZTH_0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6323f-qAYcDWzRy3cq95iAfQ+X9Fu6Asg\"",
		"mtime": "2026-07-16T17:11:31.025Z",
		"size": 406079,
		"path": "../public/assets/PieChart-BM9ZTH_0.js"
	},
	"/assets/index-w3xwgw2P.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"901c5-JeqSIEuF0oIjnobyuRg9+PNz2R0\"",
		"mtime": "2026-07-16T17:11:31.023Z",
		"size": 590277,
		"path": "../public/assets/index-w3xwgw2P.js"
	},
	"/assets/send-CmCeq8re.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"118-r/qhYYOgK5+R3zF+TWptGRgMno0\"",
		"mtime": "2026-07-16T17:11:31.043Z",
		"size": 280,
		"path": "../public/assets/send-CmCeq8re.js"
	},
	"/assets/src-Csd3SEQD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"92c4-TRGzyhF28y9RaICzx/PZchHomU0\"",
		"mtime": "2026-07-16T17:11:31.045Z",
		"size": 37572,
		"path": "../public/assets/src-Csd3SEQD.js"
	},
	"/assets/settings-Br_1mjXB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f41-iumZ0xl5lP331WrXyCk6N/IOtqw\"",
		"mtime": "2026-07-16T17:11:31.044Z",
		"size": 16193,
		"path": "../public/assets/settings-Br_1mjXB.js"
	},
	"/assets/StatCard-D3gun-yA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d3-376Ey9fcW/ruC0ap99D0AdFq7f0\"",
		"mtime": "2026-07-16T17:11:31.025Z",
		"size": 1235,
		"path": "../public/assets/StatCard-D3gun-yA.js"
	},
	"/assets/StatusBadges-DCytAIww.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d9-jDNHpPoa2P7JHN2RYP4pzUjKRUk\"",
		"mtime": "2026-07-16T17:11:31.026Z",
		"size": 729,
		"path": "../public/assets/StatusBadges-DCytAIww.js"
	},
	"/assets/students.index-bgVB9Uxg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27d6-UnBP2IcfVC2OFV1UBeok5PY805U\"",
		"mtime": "2026-07-16T17:11:31.046Z",
		"size": 10198,
		"path": "../public/assets/students.index-bgVB9Uxg.js"
	},
	"/assets/students.new-CZcKJ7Ft.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9909-jVR00nFXxe7vCEepvEBgoD3ZM3M\"",
		"mtime": "2026-07-16T17:11:31.047Z",
		"size": 39177,
		"path": "../public/assets/students.new-CZcKJ7Ft.js"
	},
	"/assets/students._id-Bl-nI6i7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29a7-udYN/fg5n7gxIQm6rz1bwzjFVmo\"",
		"mtime": "2026-07-16T17:11:31.045Z",
		"size": 10663,
		"path": "../public/assets/students._id-Bl-nI6i7.js"
	},
	"/assets/styles-RTN9NhZf.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"17d15-kohvYZPQL/kEu9fhKD4y9hHjyFQ\"",
		"mtime": "2026-07-16T17:11:31.052Z",
		"size": 97557,
		"path": "../public/assets/styles-RTN9NhZf.css"
	},
	"/assets/table-BrzShnvf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"674-4WgS06aTiWrCPmw6gCfmN6ZNg9w\"",
		"mtime": "2026-07-16T17:11:31.048Z",
		"size": 1652,
		"path": "../public/assets/table-BrzShnvf.js"
	},
	"/assets/textarea-Ch1hUbSf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"324-t2D/CsnuZHUt8hXti1HqvXzG1uM\"",
		"mtime": "2026-07-16T17:11:31.049Z",
		"size": 804,
		"path": "../public/assets/textarea-Ch1hUbSf.js"
	},
	"/assets/trash-2-FVaKN5o6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13e-kgvs7ui+2FZc+vVFRKKDLDn0rG0\"",
		"mtime": "2026-07-16T17:11:31.050Z",
		"size": 318,
		"path": "../public/assets/trash-2-FVaKN5o6.js"
	},
	"/assets/types-DR9ELmHb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bb-hwSsg8rwxm59izN9cWkXGLHyzS0\"",
		"mtime": "2026-07-16T17:11:31.050Z",
		"size": 187,
		"path": "../public/assets/types-DR9ELmHb.js"
	},
	"/assets/upload-JV8hZSLs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-PkufgvnHseL9A18YODFNfjMHDY0\"",
		"mtime": "2026-07-16T17:11:31.051Z",
		"size": 220,
		"path": "../public/assets/upload-JV8hZSLs.js"
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
