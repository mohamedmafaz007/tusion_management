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
	"/assets/alert-dialog-Du0BPApq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f05-YRwVspA8+O/j8Zcl4Ir8fjU3t9A\"",
		"mtime": "2026-07-19T05:45:14.582Z",
		"size": 3845,
		"path": "../public/assets/alert-dialog-Du0BPApq.js"
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
	"/assets/arrow-right-DfugSr-R.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-MssilHcvejTo+azeSZLVwj9xt5U\"",
		"mtime": "2026-07-19T05:45:14.583Z",
		"size": 153,
		"path": "../public/assets/arrow-right-DfugSr-R.js"
	},
	"/assets/attendance-DWy36Kse.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16700-E2YbxIoJ48wisltUUX1ZtOLg2ko\"",
		"mtime": "2026-07-19T05:45:14.583Z",
		"size": 91904,
		"path": "../public/assets/attendance-DWy36Kse.js"
	},
	"/assets/chevron-left-B_P6vlvf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76-W6xBSjmfbQgvXo30oklX9PTj4aI\"",
		"mtime": "2026-07-19T05:45:14.584Z",
		"size": 118,
		"path": "../public/assets/chevron-left-B_P6vlvf.js"
	},
	"/assets/calendar-DVTY1yFm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f5-7QcoKyMnzvu99THQvxnTjFNo1Qw\"",
		"mtime": "2026-07-19T05:45:14.583Z",
		"size": 245,
		"path": "../public/assets/calendar-DVTY1yFm.js"
	},
	"/assets/circle-check-big-Br0hnqpj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b6-B7CvZ/qtfCwyFY9kOss1ILGqOVo\"",
		"mtime": "2026-07-19T05:45:14.584Z",
		"size": 182,
		"path": "../public/assets/circle-check-big-Br0hnqpj.js"
	},
	"/assets/circle-x-BPYgfJGO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"141-NE/jfo46Z95gyZL41ADohp3hJhs\"",
		"mtime": "2026-07-19T05:45:14.585Z",
		"size": 321,
		"path": "../public/assets/circle-x-BPYgfJGO.js"
	},
	"/assets/derive-DteKvybV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a2-k/CwcGCasqm9rzZzKjWLfWwQciU\"",
		"mtime": "2026-07-19T05:45:14.585Z",
		"size": 1186,
		"path": "../public/assets/derive-DteKvybV.js"
	},
	"/assets/dialog-DTUikvwQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82d-oPQxv47dIuOlNY5axdreEWyUzbc\"",
		"mtime": "2026-07-19T05:45:14.585Z",
		"size": 2093,
		"path": "../public/assets/dialog-DTUikvwQ.js"
	},
	"/assets/dist-DS7RAM19.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1dc2c-Z5pYAyl2TTYo3W5PoMv2xVJVP8I\"",
		"mtime": "2026-07-19T05:45:14.586Z",
		"size": 121900,
		"path": "../public/assets/dist-DS7RAM19.js"
	},
	"/assets/download-CmvHpJS-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-royWB2L1EQSbTjeO/ebkObNnVQA\"",
		"mtime": "2026-07-19T05:45:14.586Z",
		"size": 220,
		"path": "../public/assets/download-CmvHpJS-.js"
	},
	"/assets/eye-wtV264rF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f4-vPpZGzKuFhbrn98HmCqjpKif/rg\"",
		"mtime": "2026-07-19T05:45:14.587Z",
		"size": 244,
		"path": "../public/assets/eye-wtV264rF.js"
	},
	"/assets/fees-Bitqzvrm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2845-QQjeEL7fWOquOlGuqqTvKRL9/W0\"",
		"mtime": "2026-07-19T05:45:14.587Z",
		"size": 10309,
		"path": "../public/assets/fees-Bitqzvrm.js"
	},
	"/assets/label-Br4ka5Fn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"276-Hi1otLlG6irs8ZDERQkD8FUg/Y4\"",
		"mtime": "2026-07-19T05:45:14.587Z",
		"size": 630,
		"path": "../public/assets/label-Br4ka5Fn.js"
	},
	"/assets/login-BYdHCKDh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bc3-TybJpc18BODFAslUcv5UjJnYpmo\"",
		"mtime": "2026-07-19T05:45:14.588Z",
		"size": 3011,
		"path": "../public/assets/login-BYdHCKDh.js"
	},
	"/assets/materials-DAz_CuF2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"43d5-vP+IRBXPLy3FGteW5P3RVYZPogs\"",
		"mtime": "2026-07-19T05:45:14.588Z",
		"size": 17365,
		"path": "../public/assets/materials-DAz_CuF2.js"
	},
	"/assets/messages-5Tf8GawL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"466b-RNzUAptcAZD2dqj5kPh5Qq+gRnk\"",
		"mtime": "2026-07-19T05:45:14.588Z",
		"size": 18027,
		"path": "../public/assets/messages-5Tf8GawL.js"
	},
	"/assets/index-USPZb3XM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"73c45-9swcLhDjU+HLKH/ypA6XQKGWb1k\"",
		"mtime": "2026-07-19T05:45:14.580Z",
		"size": 474181,
		"path": "../public/assets/index-USPZb3XM.js"
	},
	"/assets/reports-DuU-TbYZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4199-1LyCG+n7duFBgAJe0FDFdVf4/1w\"",
		"mtime": "2026-07-19T05:45:14.589Z",
		"size": 16793,
		"path": "../public/assets/reports-DuU-TbYZ.js"
	},
	"/assets/rolldown-runtime-QTnfLwEv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b6-wnqLLSlp3SaE+lbe74bKNe5Rpds\"",
		"mtime": "2026-07-19T05:45:14.589Z",
		"size": 694,
		"path": "../public/assets/rolldown-runtime-QTnfLwEv.js"
	},
	"/assets/routes-D-bGO0w0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"307e-X+zWndi4OMYB5k6tRnWQfuJXj5g\"",
		"mtime": "2026-07-19T05:45:14.589Z",
		"size": 12414,
		"path": "../public/assets/routes-D-bGO0w0.js"
	},
	"/assets/PieChart-BJL1j7TW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6323d-kXirgziA888nJDEpmSYwWQlcVd4\"",
		"mtime": "2026-07-19T05:45:14.581Z",
		"size": 406077,
		"path": "../public/assets/PieChart-BJL1j7TW.js"
	},
	"/assets/select-66Jy1LWy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5732-6xkCBdYO8OQWr5nMmiAZapFp+4k\"",
		"mtime": "2026-07-19T05:45:14.590Z",
		"size": 22322,
		"path": "../public/assets/select-66Jy1LWy.js"
	},
	"/assets/settings-oolvNKYv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"497d-AQZeYSGd+2Dc5OSa2pQlMK0vnzI\"",
		"mtime": "2026-07-19T05:45:14.591Z",
		"size": 18813,
		"path": "../public/assets/settings-oolvNKYv.js"
	},
	"/assets/send-f8iWcXzG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"116-FROaGd2Wx88D4C6JALVmTVF+D5c\"",
		"mtime": "2026-07-19T05:45:14.590Z",
		"size": 278,
		"path": "../public/assets/send-f8iWcXzG.js"
	},
	"/assets/StatCard-DAm9LLCM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d0-SnaPuQI3xpjxNo5BNGdy3CziAX8\"",
		"mtime": "2026-07-19T05:45:14.582Z",
		"size": 1232,
		"path": "../public/assets/StatCard-DAm9LLCM.js"
	},
	"/assets/StatusBadges-Usb2D0ME.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f7-S1jCeNmPFQAihCiJxnqGgMIpg0A\"",
		"mtime": "2026-07-19T05:45:14.582Z",
		"size": 759,
		"path": "../public/assets/StatusBadges-Usb2D0ME.js"
	},
	"/assets/src-Csd3SEQD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"92c4-TRGzyhF28y9RaICzx/PZchHomU0\"",
		"mtime": "2026-07-19T05:45:14.591Z",
		"size": 37572,
		"path": "../public/assets/src-Csd3SEQD.js"
	},
	"/assets/students.index-zt9rzudo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"296b-ZLEweDBa0hkNH4sHr6MjbVUOqKo\"",
		"mtime": "2026-07-19T05:45:14.592Z",
		"size": 10603,
		"path": "../public/assets/students.index-zt9rzudo.js"
	},
	"/assets/students.new-DxW5YLS5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a3a0-qwevbEU2rjpL8/2y7HyWuQDl3u4\"",
		"mtime": "2026-07-19T05:45:14.592Z",
		"size": 41888,
		"path": "../public/assets/students.new-DxW5YLS5.js"
	},
	"/assets/students._id-DsEOsB_S.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3542-kYs6gwVa8/CX2TP6neDGv4iKbUY\"",
		"mtime": "2026-07-19T05:45:14.592Z",
		"size": 13634,
		"path": "../public/assets/students._id-DsEOsB_S.js"
	},
	"/assets/styles-BqL3Lr0d.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"18fef-sJZzyUC6fjyPERk1lysma4nrBTA\"",
		"mtime": "2026-07-19T05:45:14.595Z",
		"size": 102383,
		"path": "../public/assets/styles-BqL3Lr0d.css"
	},
	"/assets/textarea-3gmhw-dH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31f-a31T57F/Rpwnx+0V126eQ4MZqvo\"",
		"mtime": "2026-07-19T05:45:14.594Z",
		"size": 799,
		"path": "../public/assets/textarea-3gmhw-dH.js"
	},
	"/assets/table-CmGLo9cX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"670-3c4RRi1UQnf50JecYjHpw8+DrIQ\"",
		"mtime": "2026-07-19T05:45:14.593Z",
		"size": 1648,
		"path": "../public/assets/table-CmGLo9cX.js"
	},
	"/assets/trash-2-BzLP5ZG5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13c-3817mqwN+XZIfcIvA+Ta5rlF1CI\"",
		"mtime": "2026-07-19T05:45:14.594Z",
		"size": 316,
		"path": "../public/assets/trash-2-BzLP5ZG5.js"
	},
	"/assets/upload-DSj36bze.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"da-02MO67fNrfixQKfnIeViVQzAxQE\"",
		"mtime": "2026-07-19T05:45:14.594Z",
		"size": 218,
		"path": "../public/assets/upload-DSj36bze.js"
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
