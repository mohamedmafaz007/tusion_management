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
	"/assets/alert-dialog-Q5VsT5As.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"eef-JG/uFC4UjyZN7ugc162VATM9PEs\"",
		"mtime": "2026-07-17T08:33:40.533Z",
		"size": 3823,
		"path": "../public/assets/alert-dialog-Q5VsT5As.js"
	},
	"/assets/chevron-left-Bp-9ChCQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"78-9ays1PZx43wJZKbFUzrzwTZnLxU\"",
		"mtime": "2026-07-17T08:33:40.534Z",
		"size": 120,
		"path": "../public/assets/chevron-left-Bp-9ChCQ.js"
	},
	"/assets/calendar-BLD89u11.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f7-YfE4qNorryzfTkk675a92ATQ8Eo\"",
		"mtime": "2026-07-17T08:33:40.534Z",
		"size": 247,
		"path": "../public/assets/calendar-BLD89u11.js"
	},
	"/assets/circle-x-CEpfiMl6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"143-t2cCKSkZFaUiy645lEeBu5Uc4BE\"",
		"mtime": "2026-07-17T08:33:40.536Z",
		"size": 323,
		"path": "../public/assets/circle-x-CEpfiMl6.js"
	},
	"/assets/circle-check-big-De2F-RXF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b8-/PlGKeA+x5f/xMS4EI0cjqYLou4\"",
		"mtime": "2026-07-17T08:33:40.536Z",
		"size": 184,
		"path": "../public/assets/circle-check-big-De2F-RXF.js"
	},
	"/tution-logo.png": {
		"type": "image/png",
		"etag": "\"39db3-5qccKVxOKdft5FIDSknd0oDywcY\"",
		"mtime": "2026-07-15T10:32:12.414Z",
		"size": 236979,
		"path": "../public/tution-logo.png"
	},
	"/assets/dialog-CNR0frmr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"811-zuVqWNPsJ9sF7Eph7go1ZVunu94\"",
		"mtime": "2026-07-17T08:33:40.537Z",
		"size": 2065,
		"path": "../public/assets/dialog-CNR0frmr.js"
	},
	"/assets/attendance-CSkTuEgZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16609-0vJE+1LBJTk1IFD4dM2O1fCssQw\"",
		"mtime": "2026-07-17T08:33:40.534Z",
		"size": 91657,
		"path": "../public/assets/attendance-CSkTuEgZ.js"
	},
	"/assets/download-CXvDcJNT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"de-qA0h0pu6T5zvFA8hm8UyViPFrIY\"",
		"mtime": "2026-07-17T08:33:40.537Z",
		"size": 222,
		"path": "../public/assets/download-CXvDcJNT.js"
	},
	"/assets/derive-4ZPSqEXW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"352-AYs/IQ6Jzt8J2/pPNU32iwXMWBY\"",
		"mtime": "2026-07-17T08:33:40.537Z",
		"size": 850,
		"path": "../public/assets/derive-4ZPSqEXW.js"
	},
	"/assets/fees-Ca3sJMb-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2761-wSskO5yBN9UWTqtDNYo8r038Ggo\"",
		"mtime": "2026-07-17T08:33:40.538Z",
		"size": 10081,
		"path": "../public/assets/fees-Ca3sJMb-.js"
	},
	"/assets/eye-Dxt2Bkp-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f6-//8nnPkrUd0h0ZIdYQKt5ujYnWM\"",
		"mtime": "2026-07-17T08:33:40.538Z",
		"size": 246,
		"path": "../public/assets/eye-Dxt2Bkp-.js"
	},
	"/assets/clock-Cq4fofWC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9f-93s7LNag8lULFRtqgjh+vemTtmg\"",
		"mtime": "2026-07-17T08:33:40.536Z",
		"size": 159,
		"path": "../public/assets/clock-Cq4fofWC.js"
	},
	"/assets/label-Dn7Zlyat.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25b-Ygg1uc17JzfAP7zoKY0aF5+XYgY\"",
		"mtime": "2026-07-17T08:33:40.538Z",
		"size": 603,
		"path": "../public/assets/label-Dn7Zlyat.js"
	},
	"/assets/materials-B3F4rEKN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e4f-6GqZZn3wpRpsFd3WQB44ErMxVlo\"",
		"mtime": "2026-07-17T08:33:40.539Z",
		"size": 15951,
		"path": "../public/assets/materials-B3F4rEKN.js"
	},
	"/assets/loader-circle-3l7b5Q64.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"86-iAWT4yELrtQpMi2CcFHA+5eJuYE\"",
		"mtime": "2026-07-17T08:33:40.539Z",
		"size": 134,
		"path": "../public/assets/loader-circle-3l7b5Q64.js"
	},
	"/assets/messages-B_use8RA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e75-7goSyR3thshC9USLWfZtPsPJ8D4\"",
		"mtime": "2026-07-17T08:33:40.540Z",
		"size": 15989,
		"path": "../public/assets/messages-B_use8RA.js"
	},
	"/assets/printer-yezLNcJ3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"135-wDgqYff5sAmQ6jHnaVo4mSaTOgI\"",
		"mtime": "2026-07-17T08:33:40.540Z",
		"size": 309,
		"path": "../public/assets/printer-yezLNcJ3.js"
	},
	"/assets/reports-COO3JRWX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19cd-8053Scse2Qw2VQoS82WB8fknGks\"",
		"mtime": "2026-07-17T08:33:40.540Z",
		"size": 6605,
		"path": "../public/assets/reports-COO3JRWX.js"
	},
	"/assets/rolldown-runtime-QTnfLwEv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b6-wnqLLSlp3SaE+lbe74bKNe5Rpds\"",
		"mtime": "2026-07-17T08:33:40.542Z",
		"size": 694,
		"path": "../public/assets/rolldown-runtime-QTnfLwEv.js"
	},
	"/assets/routes-BVwMKBVk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26d8-iyX3QR9oJLU2G6pJqwStmbNby0M\"",
		"mtime": "2026-07-17T08:33:40.542Z",
		"size": 9944,
		"path": "../public/assets/routes-BVwMKBVk.js"
	},
	"/assets/PieChart-B9ClOJaU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6323f-xsrue3ITeL2ILOnfDK8r6Qer+SU\"",
		"mtime": "2026-07-17T08:33:40.531Z",
		"size": 406079,
		"path": "../public/assets/PieChart-B9ClOJaU.js"
	},
	"/assets/index-ClrhH5Rc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90472-HiGn7yc7a/NcRtyXQkBglLqBzqs\"",
		"mtime": "2026-07-17T08:33:40.531Z",
		"size": 590962,
		"path": "../public/assets/index-ClrhH5Rc.js"
	},
	"/assets/send-LKK7BcmQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"118-qhFuqDRe/p1rmlXmRUpAiVvfHSs\"",
		"mtime": "2026-07-17T08:33:40.543Z",
		"size": 280,
		"path": "../public/assets/send-LKK7BcmQ.js"
	},
	"/assets/select-DK9AEArF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5727-RR5QPMvNAbakBWCJcan91QA5kdI\"",
		"mtime": "2026-07-17T08:33:40.543Z",
		"size": 22311,
		"path": "../public/assets/select-DK9AEArF.js"
	},
	"/assets/src-Csd3SEQD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"92c4-TRGzyhF28y9RaICzx/PZchHomU0\"",
		"mtime": "2026-07-17T08:33:40.544Z",
		"size": 37572,
		"path": "../public/assets/src-Csd3SEQD.js"
	},
	"/assets/settings-7xLVh5AY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4925-yZA1ZW71XC8U/AFqP7EKL3iVyBk\"",
		"mtime": "2026-07-17T08:33:40.544Z",
		"size": 18725,
		"path": "../public/assets/settings-7xLVh5AY.js"
	},
	"/assets/StatusBadges-BANINF45.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d9-W8lL8RSihx2SIqSqDic2UKpU0Gs\"",
		"mtime": "2026-07-17T08:33:40.533Z",
		"size": 729,
		"path": "../public/assets/StatusBadges-BANINF45.js"
	},
	"/assets/StatCard-BH98Shtp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d3-CODmimdZp+mzfIqDz6TSnEy7cBE\"",
		"mtime": "2026-07-17T08:33:40.532Z",
		"size": 1235,
		"path": "../public/assets/StatCard-BH98Shtp.js"
	},
	"/assets/students.index-lFx5Mi4Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2802-RNaonFy3IVu/lbYhLIdBOY9YpMs\"",
		"mtime": "2026-07-17T08:33:40.545Z",
		"size": 10242,
		"path": "../public/assets/students.index-lFx5Mi4Q.js"
	},
	"/assets/students._id-BMdYXRFY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29e6-8fAYJcwgNZeGzD9o119ozvSn6CU\"",
		"mtime": "2026-07-17T08:33:40.544Z",
		"size": 10726,
		"path": "../public/assets/students._id-BMdYXRFY.js"
	},
	"/assets/students.new-BlrkwAfs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9ad2-E6l7YYVlGqVUkp+PyIjPjVvLC2c\"",
		"mtime": "2026-07-17T08:33:40.545Z",
		"size": 39634,
		"path": "../public/assets/students.new-BlrkwAfs.js"
	},
	"/assets/table-DyahIzPb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"674-bwcCngHJF0AZXFFE4OLcsBNz0q4\"",
		"mtime": "2026-07-17T08:33:40.546Z",
		"size": 1652,
		"path": "../public/assets/table-DyahIzPb.js"
	},
	"/assets/styles--nfQ4-1z.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"17fce-vLEaN8NredpF4fCLxAx+1g5KI40\"",
		"mtime": "2026-07-17T08:33:40.547Z",
		"size": 98254,
		"path": "../public/assets/styles--nfQ4-1z.css"
	},
	"/assets/textarea-BBhq5Pxq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"324-kJy92tM0BZzyyozdt9uNObXWFLM\"",
		"mtime": "2026-07-17T08:33:40.546Z",
		"size": 804,
		"path": "../public/assets/textarea-BBhq5Pxq.js"
	},
	"/assets/trash-2-t8Rw2hC8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13e-DVpO4zyXY6tqi5k1V1+3HWU65hc\"",
		"mtime": "2026-07-17T08:33:40.547Z",
		"size": 318,
		"path": "../public/assets/trash-2-t8Rw2hC8.js"
	},
	"/assets/upload-oTANmvpE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-iaPvw2MBRrzJ/d6UJLIrFcubAvo\"",
		"mtime": "2026-07-17T08:33:40.547Z",
		"size": 220,
		"path": "../public/assets/upload-oTANmvpE.js"
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
