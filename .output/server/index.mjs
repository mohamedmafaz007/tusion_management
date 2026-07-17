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
	"/assets/alert-dialog-BHCzK03X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"eef-hbG9SWvmjk44cju8gN8HvquImSo\"",
		"mtime": "2026-07-17T09:56:01.476Z",
		"size": 3823,
		"path": "../public/assets/alert-dialog-BHCzK03X.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"39db3-5qccKVxOKdft5FIDSknd0oDywcY\"",
		"mtime": "2026-07-15T10:32:12.410Z",
		"size": 236979,
		"path": "../public/favicon.ico"
	},
	"/assets/calendar-DNtwJVGv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f7-gBS34cKnoEoXKIUlADe34tdOdv0\"",
		"mtime": "2026-07-17T09:56:01.477Z",
		"size": 247,
		"path": "../public/assets/calendar-DNtwJVGv.js"
	},
	"/tution-logo.png": {
		"type": "image/png",
		"etag": "\"39db3-5qccKVxOKdft5FIDSknd0oDywcY\"",
		"mtime": "2026-07-15T10:32:12.414Z",
		"size": 236979,
		"path": "../public/tution-logo.png"
	},
	"/assets/attendance-DIRzWi50.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1660b-S2Yv2bWYywUK/xUjitsNZRh0Ipc\"",
		"mtime": "2026-07-17T09:56:01.477Z",
		"size": 91659,
		"path": "../public/assets/attendance-DIRzWi50.js"
	},
	"/assets/chevron-left-C0rTB112.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"78-4dPTn2/N0/zAEC73gd7ynCbDJUU\"",
		"mtime": "2026-07-17T09:56:01.478Z",
		"size": 120,
		"path": "../public/assets/chevron-left-C0rTB112.js"
	},
	"/assets/circle-check-big-mPHKanKv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b8-y4zBMVuzhNj1XHMgrU7ZCsFOsWQ\"",
		"mtime": "2026-07-17T09:56:01.478Z",
		"size": 184,
		"path": "../public/assets/circle-check-big-mPHKanKv.js"
	},
	"/assets/circle-x-ivLa11W-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"143-2POKzD+FQdbFaGeh6DM8Y3MF+Ko\"",
		"mtime": "2026-07-17T09:56:01.479Z",
		"size": 323,
		"path": "../public/assets/circle-x-ivLa11W-.js"
	},
	"/assets/derive-IeO-PG3g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"39a-v1RZyAInXkpjXer+PL8GZVMWsrU\"",
		"mtime": "2026-07-17T09:56:01.479Z",
		"size": 922,
		"path": "../public/assets/derive-IeO-PG3g.js"
	},
	"/assets/dialog-8IaSp2uE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"811-EVg+KHXA1Wa+5bLM9tf4uk+f+oY\"",
		"mtime": "2026-07-17T09:56:01.479Z",
		"size": 2065,
		"path": "../public/assets/dialog-8IaSp2uE.js"
	},
	"/assets/download-Dp1v8YwX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"de-xdrqEkBCE+AoSrILygQJ0HsAEp8\"",
		"mtime": "2026-07-17T09:56:01.480Z",
		"size": 222,
		"path": "../public/assets/download-Dp1v8YwX.js"
	},
	"/assets/eye-BhT9RG_4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f6-Z0PtexO6+H0I+cWR++dsNNBwHaQ\"",
		"mtime": "2026-07-17T09:56:01.480Z",
		"size": 246,
		"path": "../public/assets/eye-BhT9RG_4.js"
	},
	"/assets/fees-4mKLrDa3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2741-zqQrkKnTXM4wo43+ldOOCqqLC48\"",
		"mtime": "2026-07-17T09:56:01.481Z",
		"size": 10049,
		"path": "../public/assets/fees-4mKLrDa3.js"
	},
	"/assets/label-sB0yCXw7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25b-E5HmHrDtVSh/v9qt1GlyJWzawh0\"",
		"mtime": "2026-07-17T09:56:01.481Z",
		"size": 603,
		"path": "../public/assets/label-sB0yCXw7.js"
	},
	"/assets/loader-circle-DLeABT8B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"86-9U9gZbIt4Eq3j+k5aQ6I92TswCU\"",
		"mtime": "2026-07-17T09:56:01.482Z",
		"size": 134,
		"path": "../public/assets/loader-circle-DLeABT8B.js"
	},
	"/assets/messages-BVrDohPb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e5a-Pt7qewhgYD+v9w3u+YHeD0yJIqU\"",
		"mtime": "2026-07-17T09:56:01.483Z",
		"size": 15962,
		"path": "../public/assets/messages-BVrDohPb.js"
	},
	"/assets/materials-DanyCJTR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e4f-0os1pt/bFf32kIhuZFR+B3YNXhs\"",
		"mtime": "2026-07-17T09:56:01.482Z",
		"size": 15951,
		"path": "../public/assets/materials-DanyCJTR.js"
	},
	"/assets/printer-CIozUE7T.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"135-RoRjSa68ynCNYk91bzVe0OMOFxo\"",
		"mtime": "2026-07-17T09:56:01.483Z",
		"size": 309,
		"path": "../public/assets/printer-CIozUE7T.js"
	},
	"/assets/reports-yYx-7Si-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19cd-kxxUidWkdPoFKt/uV2sk1RMnj1Q\"",
		"mtime": "2026-07-17T09:56:01.483Z",
		"size": 6605,
		"path": "../public/assets/reports-yYx-7Si-.js"
	},
	"/assets/rolldown-runtime-QTnfLwEv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b6-wnqLLSlp3SaE+lbe74bKNe5Rpds\"",
		"mtime": "2026-07-17T09:56:01.484Z",
		"size": 694,
		"path": "../public/assets/rolldown-runtime-QTnfLwEv.js"
	},
	"/assets/routes-nlm4Zlxg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26d8-t4aMWDJMeNK/Xr8quKgXYkyq6fQ\"",
		"mtime": "2026-07-17T09:56:01.484Z",
		"size": 9944,
		"path": "../public/assets/routes-nlm4Zlxg.js"
	},
	"/assets/select-CIOrnOUU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5727-/IRwyEQcjlvwvvP3yeMYoivvjWk\"",
		"mtime": "2026-07-17T09:56:01.485Z",
		"size": 22311,
		"path": "../public/assets/select-CIOrnOUU.js"
	},
	"/assets/PieChart-BXrVCgI0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"63241-/Z8UuogwIS0FMnXcT2HqWZkw3+E\"",
		"mtime": "2026-07-17T09:56:01.474Z",
		"size": 406081,
		"path": "../public/assets/PieChart-BXrVCgI0.js"
	},
	"/assets/index-BsuTVZ27.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90789-W75K9DGGUb6Z4uXSZYXrWUcDmVs\"",
		"mtime": "2026-07-17T09:56:01.474Z",
		"size": 591753,
		"path": "../public/assets/index-BsuTVZ27.js"
	},
	"/assets/send-B1MQX-jj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"118-0utTfF9IEnhegE2liTOVxQS4LmA\"",
		"mtime": "2026-07-17T09:56:01.485Z",
		"size": 280,
		"path": "../public/assets/send-B1MQX-jj.js"
	},
	"/assets/src-Csd3SEQD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"92c4-TRGzyhF28y9RaICzx/PZchHomU0\"",
		"mtime": "2026-07-17T09:56:01.486Z",
		"size": 37572,
		"path": "../public/assets/src-Csd3SEQD.js"
	},
	"/assets/settings-Dmcgm9IB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4920-GUwtqyXTua3ehu5OvZt3u7bncf0\"",
		"mtime": "2026-07-17T09:56:01.486Z",
		"size": 18720,
		"path": "../public/assets/settings-Dmcgm9IB.js"
	},
	"/assets/StatCard-DnuuAtJv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d3-s1sWtWV0sAr5D8AigYJ6Li7T/Qc\"",
		"mtime": "2026-07-17T09:56:01.475Z",
		"size": 1235,
		"path": "../public/assets/StatCard-DnuuAtJv.js"
	},
	"/assets/StatusBadges-BikWmDAG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d9-gDwt2Bc0HV9L/Hg6lM+AXDbnb2w\"",
		"mtime": "2026-07-17T09:56:01.475Z",
		"size": 729,
		"path": "../public/assets/StatusBadges-BikWmDAG.js"
	},
	"/assets/students.new-DecQlilO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9ad1-VVK+XTInjZEapJ1ttlQ043JJ+6A\"",
		"mtime": "2026-07-17T09:56:01.487Z",
		"size": 39633,
		"path": "../public/assets/students.new-DecQlilO.js"
	},
	"/assets/students.index-4OoCISrY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2764-6Hefz+mQGr9mgTJNjhpsygaWzFA\"",
		"mtime": "2026-07-17T09:56:01.487Z",
		"size": 10084,
		"path": "../public/assets/students.index-4OoCISrY.js"
	},
	"/assets/students._id-CCBduv5z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29e6-2TzYgY2SJxFWuayMjvc893oCl2c\"",
		"mtime": "2026-07-17T09:56:01.486Z",
		"size": 10726,
		"path": "../public/assets/students._id-CCBduv5z.js"
	},
	"/assets/table-B8Yt-QAy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"674-4mOh7IyJM3sN9ceg+mQ93z7Lnf4\"",
		"mtime": "2026-07-17T09:56:01.487Z",
		"size": 1652,
		"path": "../public/assets/table-B8Yt-QAy.js"
	},
	"/assets/textarea-BshRHhbN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"324-aAvdQxqbrcl9JrxAvWISDGahMZc\"",
		"mtime": "2026-07-17T09:56:01.488Z",
		"size": 804,
		"path": "../public/assets/textarea-BshRHhbN.js"
	},
	"/assets/styles-BgeghLx5.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"17ff9-9fAWLn56m+B9p8/847R/c/iW7h0\"",
		"mtime": "2026-07-17T09:56:01.490Z",
		"size": 98297,
		"path": "../public/assets/styles-BgeghLx5.css"
	},
	"/assets/trash-2-DNf6JeKY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13e-o5rPm/pd4wtt9zBJI3GPQMn525M\"",
		"mtime": "2026-07-17T09:56:01.489Z",
		"size": 318,
		"path": "../public/assets/trash-2-DNf6JeKY.js"
	},
	"/assets/upload-DSFQWfYA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-V92UWnQQ8nODCBCCtwJRjmn4byE\"",
		"mtime": "2026-07-17T09:56:01.489Z",
		"size": 220,
		"path": "../public/assets/upload-DSFQWfYA.js"
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
