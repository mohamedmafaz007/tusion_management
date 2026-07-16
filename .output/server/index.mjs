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
	"/assets/alert-dialog-GOYfIzQU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"eef-02Ue5ZXYzruyVWxJuAXB2DHVHnI\"",
		"mtime": "2026-07-16T18:18:08.374Z",
		"size": 3823,
		"path": "../public/assets/alert-dialog-GOYfIzQU.js"
	},
	"/assets/calendar-BTZIULzN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f7-fCJVXdrMNaEiktHyrVqIV7eT2vo\"",
		"mtime": "2026-07-16T18:18:08.375Z",
		"size": 247,
		"path": "../public/assets/calendar-BTZIULzN.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"39db3-5qccKVxOKdft5FIDSknd0oDywcY\"",
		"mtime": "2026-07-15T10:32:12.410Z",
		"size": 236979,
		"path": "../public/favicon.ico"
	},
	"/assets/chevron-left-B1OTTp_d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"78-FFQOOPat7jt6EnTWdDcpESoejdY\"",
		"mtime": "2026-07-16T18:18:08.375Z",
		"size": 120,
		"path": "../public/assets/chevron-left-B1OTTp_d.js"
	},
	"/assets/circle-check-big-Dr3E1VOq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b8-dY19lQGc0U3hjZ0YfAuyHEZka4c\"",
		"mtime": "2026-07-16T18:18:08.376Z",
		"size": 184,
		"path": "../public/assets/circle-check-big-Dr3E1VOq.js"
	},
	"/tution-logo.png": {
		"type": "image/png",
		"etag": "\"39db3-5qccKVxOKdft5FIDSknd0oDywcY\"",
		"mtime": "2026-07-15T10:32:12.414Z",
		"size": 236979,
		"path": "../public/tution-logo.png"
	},
	"/assets/circle-x-BUzFPKkL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"143-E+b8IXkiZly5tR1KpHO9b18BXIg\"",
		"mtime": "2026-07-16T18:18:08.376Z",
		"size": 323,
		"path": "../public/assets/circle-x-BUzFPKkL.js"
	},
	"/assets/clock-2JM3Ns2z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9f-c0CQ6KzeHyB3Q1YlK8n9+iDvCEg\"",
		"mtime": "2026-07-16T18:18:08.376Z",
		"size": 159,
		"path": "../public/assets/clock-2JM3Ns2z.js"
	},
	"/assets/derive-4ZPSqEXW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"352-AYs/IQ6Jzt8J2/pPNU32iwXMWBY\"",
		"mtime": "2026-07-16T18:18:08.377Z",
		"size": 850,
		"path": "../public/assets/derive-4ZPSqEXW.js"
	},
	"/assets/attendance-hLYmh7LY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16609-E52iOTed4lnh9mz/0t9g834nUM8\"",
		"mtime": "2026-07-16T18:18:08.375Z",
		"size": 91657,
		"path": "../public/assets/attendance-hLYmh7LY.js"
	},
	"/assets/download-C8ooIsWB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"de-vl3goymdKHxF8va13gvZnFPgB08\"",
		"mtime": "2026-07-16T18:18:08.377Z",
		"size": 222,
		"path": "../public/assets/download-C8ooIsWB.js"
	},
	"/assets/eye-BWzBcXgU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f6-oJRKy0DWw4NXpOyKqcHm3C2tjtw\"",
		"mtime": "2026-07-16T18:18:08.378Z",
		"size": 246,
		"path": "../public/assets/eye-BWzBcXgU.js"
	},
	"/assets/dialog-DNUf5QVp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"811-Jb1MTCMYiePFypus3mHAeYr79ZI\"",
		"mtime": "2026-07-16T18:18:08.377Z",
		"size": 2065,
		"path": "../public/assets/dialog-DNUf5QVp.js"
	},
	"/assets/fees-BuvXKqQO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2761-OIfo2olWwlk/owXt4FG+GaiV5Rg\"",
		"mtime": "2026-07-16T18:18:08.378Z",
		"size": 10081,
		"path": "../public/assets/fees-BuvXKqQO.js"
	},
	"/assets/label-Cyft0Dm0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25b-SKAmq3xA0KejADPvSQrZTqWRBxs\"",
		"mtime": "2026-07-16T18:18:08.379Z",
		"size": 603,
		"path": "../public/assets/label-Cyft0Dm0.js"
	},
	"/assets/loader-circle-BmIUy8vo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"86-rhFHPM2Q9kmo2J2fJuKlI65iED4\"",
		"mtime": "2026-07-16T18:18:08.379Z",
		"size": 134,
		"path": "../public/assets/loader-circle-BmIUy8vo.js"
	},
	"/assets/messages-D6oqFgeg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e75-f+EgXLQdDFCBhk4Y9TTbkQCyT1s\"",
		"mtime": "2026-07-16T18:18:08.380Z",
		"size": 15989,
		"path": "../public/assets/messages-D6oqFgeg.js"
	},
	"/assets/materials-DBxo7Phw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"41b3-hEx5mlK2pPADVFV3tg9ucli2dns\"",
		"mtime": "2026-07-16T18:18:08.380Z",
		"size": 16819,
		"path": "../public/assets/materials-DBxo7Phw.js"
	},
	"/assets/printer-D_w96tRi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"135-IJlK7uU8G4PC/KFD8IWXVHXDcaQ\"",
		"mtime": "2026-07-16T18:18:08.381Z",
		"size": 309,
		"path": "../public/assets/printer-D_w96tRi.js"
	},
	"/assets/reports-CZPKRqQi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19cd-EhUlomWF+AKIXrjoblaq91kkbvI\"",
		"mtime": "2026-07-16T18:18:08.381Z",
		"size": 6605,
		"path": "../public/assets/reports-CZPKRqQi.js"
	},
	"/assets/rolldown-runtime-QTnfLwEv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b6-wnqLLSlp3SaE+lbe74bKNe5Rpds\"",
		"mtime": "2026-07-16T18:18:08.381Z",
		"size": 694,
		"path": "../public/assets/rolldown-runtime-QTnfLwEv.js"
	},
	"/assets/routes-DWGe-f2B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26d8-kEyEl6TyhgLRcZx1YSVcfut2D5w\"",
		"mtime": "2026-07-16T18:18:08.382Z",
		"size": 9944,
		"path": "../public/assets/routes-DWGe-f2B.js"
	},
	"/assets/PieChart-Da98Aqah.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6323f-UcW2w8PWh0ERWHvIoTvnARU/NYE\"",
		"mtime": "2026-07-16T18:18:08.372Z",
		"size": 406079,
		"path": "../public/assets/PieChart-Da98Aqah.js"
	},
	"/assets/index-D_2_vNKk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90472-OUGEfFMonGOy8N2R7kzWagkxoa4\"",
		"mtime": "2026-07-16T18:18:08.370Z",
		"size": 590962,
		"path": "../public/assets/index-D_2_vNKk.js"
	},
	"/assets/select-BjvCAUX7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5727-WBA5+iGodSrguyaNm69UYMc2czY\"",
		"mtime": "2026-07-16T18:18:08.382Z",
		"size": 22311,
		"path": "../public/assets/select-BjvCAUX7.js"
	},
	"/assets/settings-C2WG3vLp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4925-jBDMi5u6inX8MKEysqt7Bvfu7k0\"",
		"mtime": "2026-07-16T18:18:08.383Z",
		"size": 18725,
		"path": "../public/assets/settings-C2WG3vLp.js"
	},
	"/assets/StatCard-Cz6m1yLc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d3-98W95oxX/8geWSnonOaRHvgyjHQ\"",
		"mtime": "2026-07-16T18:18:08.373Z",
		"size": 1235,
		"path": "../public/assets/StatCard-Cz6m1yLc.js"
	},
	"/assets/StatusBadges-DxOb2Lu-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d9-tzd6D9hBsRHedtFdwUHSuweaPnY\"",
		"mtime": "2026-07-16T18:18:08.374Z",
		"size": 729,
		"path": "../public/assets/StatusBadges-DxOb2Lu-.js"
	},
	"/assets/src-Csd3SEQD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"92c4-TRGzyhF28y9RaICzx/PZchHomU0\"",
		"mtime": "2026-07-16T18:18:08.384Z",
		"size": 37572,
		"path": "../public/assets/src-Csd3SEQD.js"
	},
	"/assets/students.index-z_0UEcMt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2802-ET882lazBfvOVruLYL7VfPABiEI\"",
		"mtime": "2026-07-16T18:18:08.384Z",
		"size": 10242,
		"path": "../public/assets/students.index-z_0UEcMt.js"
	},
	"/assets/students._id-Dp3WZtoY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29e6-OJwKT/k6Ntzwu4V1J5BCILzcHZc\"",
		"mtime": "2026-07-16T18:18:08.384Z",
		"size": 10726,
		"path": "../public/assets/students._id-Dp3WZtoY.js"
	},
	"/assets/send-BDO0Kqfb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"118-MnTrEt6yjHrxo8RWm2m1Nr7v/mI\"",
		"mtime": "2026-07-16T18:18:08.383Z",
		"size": 280,
		"path": "../public/assets/send-BDO0Kqfb.js"
	},
	"/assets/students.new-_alhAhtB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9ad2-x6SZknJVD9ig+997Ma+FDIeH6lc\"",
		"mtime": "2026-07-16T18:18:08.385Z",
		"size": 39634,
		"path": "../public/assets/students.new-_alhAhtB.js"
	},
	"/assets/styles-DullDOuD.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"17fe0-GQGC+xinr6kS+BCXi4GaykYIwmY\"",
		"mtime": "2026-07-16T18:18:08.387Z",
		"size": 98272,
		"path": "../public/assets/styles-DullDOuD.css"
	},
	"/assets/textarea-DCTQpz3K.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"324-FbVbL7sBkZyTdnkcR9oOaKaVDcM\"",
		"mtime": "2026-07-16T18:18:08.386Z",
		"size": 804,
		"path": "../public/assets/textarea-DCTQpz3K.js"
	},
	"/assets/table-CW9_Jtq3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"674-HBLZpO+KMKkLRIGhUzWx/9SjAB0\"",
		"mtime": "2026-07-16T18:18:08.386Z",
		"size": 1652,
		"path": "../public/assets/table-CW9_Jtq3.js"
	},
	"/assets/trash-2-B-xLuMjq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13e-/jAjbM3LqT4OWHsQ3MG1suBmu84\"",
		"mtime": "2026-07-16T18:18:08.387Z",
		"size": 318,
		"path": "../public/assets/trash-2-B-xLuMjq.js"
	},
	"/assets/upload-C7j06UA2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-NapwMentJy+bRHZfhlo4Nn+mADA\"",
		"mtime": "2026-07-16T18:18:08.387Z",
		"size": 220,
		"path": "../public/assets/upload-C7j06UA2.js"
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
