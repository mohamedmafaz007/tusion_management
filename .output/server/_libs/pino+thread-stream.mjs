import { a as __toCommonJS, i as __require, n as __esmMin, r as __exportAll, t as __commonJSMin } from "../_runtime.mjs";
import { a as require_atomic_sleep, i as require_sonic_boom, n as require_safe_stable_stringify, o as require_quick_format_unescaped, r as require_on_exit_leak_free, s as require_pino_std_serializers } from "./@whiskeysockets/baileys.mjs";
import { t as require_redact } from "./pinojs__redact.mjs";
//#region node_modules/pino/lib/caller.js
var require_caller = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function noOpPrepareStackTrace(_, stack) {
		return stack;
	}
	module.exports = function getCallers() {
		const originalPrepare = Error.prepareStackTrace;
		Error.prepareStackTrace = noOpPrepareStackTrace;
		const stack = (/* @__PURE__ */ new Error()).stack;
		Error.prepareStackTrace = originalPrepare;
		if (!Array.isArray(stack)) return;
		const entries = stack.slice(2);
		const fileNames = [];
		for (const entry of entries) {
			if (!entry) continue;
			fileNames.push(entry.getFileName());
		}
		return fileNames;
	};
}));
//#endregion
//#region node_modules/pino/lib/symbols.js
var require_symbols = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var setLevelSym = Symbol("pino.setLevel");
	var getLevelSym = Symbol("pino.getLevel");
	var levelValSym = Symbol("pino.levelVal");
	var levelCompSym = Symbol("pino.levelComp");
	var useLevelLabelsSym = Symbol("pino.useLevelLabels");
	var useOnlyCustomLevelsSym = Symbol("pino.useOnlyCustomLevels");
	var mixinSym = Symbol("pino.mixin");
	var lsCacheSym = Symbol("pino.lsCache");
	var chindingsSym = Symbol("pino.chindings");
	var asJsonSym = Symbol("pino.asJson");
	var writeSym = Symbol("pino.write");
	var redactFmtSym = Symbol("pino.redactFmt");
	var timeSym = Symbol("pino.time");
	var timeSliceIndexSym = Symbol("pino.timeSliceIndex");
	var streamSym = Symbol("pino.stream");
	var stringifySym = Symbol("pino.stringify");
	var stringifySafeSym = Symbol("pino.stringifySafe");
	var stringifiersSym = Symbol("pino.stringifiers");
	var endSym = Symbol("pino.end");
	var formatOptsSym = Symbol("pino.formatOpts");
	var messageKeySym = Symbol("pino.messageKey");
	var errorKeySym = Symbol("pino.errorKey");
	var nestedKeySym = Symbol("pino.nestedKey");
	var nestedKeyStrSym = Symbol("pino.nestedKeyStr");
	var mixinMergeStrategySym = Symbol("pino.mixinMergeStrategy");
	var msgPrefixSym = Symbol("pino.msgPrefix");
	var wildcardFirstSym = Symbol("pino.wildcardFirst");
	var serializersSym = Symbol.for("pino.serializers");
	var formattersSym = Symbol.for("pino.formatters");
	var hooksSym = Symbol.for("pino.hooks");
	module.exports = {
		setLevelSym,
		getLevelSym,
		levelValSym,
		levelCompSym,
		useLevelLabelsSym,
		mixinSym,
		lsCacheSym,
		chindingsSym,
		asJsonSym,
		writeSym,
		serializersSym,
		redactFmtSym,
		timeSym,
		timeSliceIndexSym,
		streamSym,
		stringifySym,
		stringifySafeSym,
		stringifiersSym,
		endSym,
		formatOptsSym,
		messageKeySym,
		errorKeySym,
		nestedKeySym,
		wildcardFirstSym,
		needsMetadataGsym: Symbol.for("pino.metadata"),
		useOnlyCustomLevelsSym,
		formattersSym,
		hooksSym,
		nestedKeyStrSym,
		mixinMergeStrategySym,
		msgPrefixSym
	};
}));
//#endregion
//#region node_modules/pino/lib/redaction.js
var require_redaction = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Redact = require_redact();
	var { redactFmtSym, wildcardFirstSym } = require_symbols();
	var rx = /[^.[\]]+|\[([^[\]]*?)\]/g;
	var CENSOR = "[Redacted]";
	var strict = false;
	function redaction(opts, serialize) {
		const { paths, censor, remove } = handle(opts);
		const shape = paths.reduce((o, str) => {
			rx.lastIndex = 0;
			const first = rx.exec(str);
			const next = rx.exec(str);
			let ns = first[1] !== void 0 ? first[1].replace(/^(?:"|'|`)(.*)(?:"|'|`)$/, "$1") : first[0];
			if (ns === "*") ns = wildcardFirstSym;
			if (next === null) {
				o[ns] = null;
				return o;
			}
			if (o[ns] === null) return o;
			const { index } = next;
			const nextPath = `${str.substr(index, str.length - 1)}`;
			o[ns] = o[ns] || [];
			if (ns !== wildcardFirstSym && o[ns].length === 0) o[ns].push(...o[wildcardFirstSym] || []);
			if (ns === wildcardFirstSym) Object.keys(o).forEach(function(k) {
				if (o[k]) o[k].push(nextPath);
			});
			o[ns].push(nextPath);
			return o;
		}, {});
		const result = { [redactFmtSym]: Redact({
			paths,
			censor,
			serialize,
			strict,
			remove
		}) };
		const topCensor = (...args) => {
			return typeof censor === "function" ? serialize(censor(...args)) : serialize(censor);
		};
		return [...Object.keys(shape), ...Object.getOwnPropertySymbols(shape)].reduce((o, k) => {
			if (shape[k] === null) o[k] = (value) => topCensor(value, [k]);
			else {
				const wrappedCensor = typeof censor === "function" ? (value, path) => {
					return censor(value, [k, ...path]);
				} : censor;
				o[k] = Redact({
					paths: shape[k],
					censor: wrappedCensor,
					serialize,
					strict,
					remove
				});
			}
			return o;
		}, result);
	}
	function handle(opts) {
		if (Array.isArray(opts)) {
			opts = {
				paths: opts,
				censor: CENSOR
			};
			return opts;
		}
		let { paths, censor = CENSOR, remove } = opts;
		if (Array.isArray(paths) === false) throw Error("pino – redact must contain an array of strings");
		if (remove === true) censor = void 0;
		return {
			paths,
			censor,
			remove
		};
	}
	module.exports = redaction;
}));
//#endregion
//#region node_modules/pino/lib/time.js
var require_time = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var nullTime = () => "";
	var epochTime = () => `,"time":${Date.now()}`;
	var unixTime = () => `,"time":${Math.round(Date.now() / 1e3)}`;
	var isoTime = () => `,"time":"${new Date(Date.now()).toISOString()}"`;
	var NS_PER_MS = 1000000n;
	var NS_PER_SEC = 1000000000n;
	var startWallTimeNs = BigInt(Date.now()) * NS_PER_MS;
	var startHrTime = process.hrtime.bigint();
	var isoTimeNano = () => {
		const currentTimeNs = startWallTimeNs + (process.hrtime.bigint() - startHrTime);
		const secondsSinceEpoch = currentTimeNs / NS_PER_SEC;
		const nanosWithinSecond = currentTimeNs % NS_PER_SEC;
		const msSinceEpoch = Number(secondsSinceEpoch * 1000n + nanosWithinSecond / 1000000n);
		const date = new Date(msSinceEpoch);
		return `,"time":"${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}T${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}:${date.getUTCSeconds().toString().padStart(2, "0")}.${nanosWithinSecond.toString().padStart(9, "0")}Z"`;
	};
	module.exports = {
		nullTime,
		epochTime,
		unixTime,
		isoTime,
		isoTimeNano
	};
}));
//#endregion
//#region node_modules/thread-stream/package.json
var package_exports = /* @__PURE__ */ __exportAll({
	author: () => author,
	bugs: () => bugs,
	default: () => package_default,
	dependencies: () => dependencies,
	description: () => description,
	devDependencies: () => devDependencies,
	engines: () => engines,
	homepage: () => homepage,
	keywords: () => keywords,
	license: () => "MIT",
	main: () => main,
	name: () => name,
	repository: () => repository,
	scripts: () => scripts,
	types: () => types,
	version: () => version
}), name, version, description, main, types, engines, dependencies, devDependencies, scripts, repository, keywords, author, bugs, homepage, package_default;
var init_package = __esmMin((() => {
	name = "thread-stream";
	version = "4.2.0";
	description = "A streaming way to send data to a Node.js Worker Thread";
	main = "index.js";
	types = "index.d.ts";
	engines = { "node": ">=20" };
	dependencies = { "real-require": "^1.0.0" };
	devDependencies = {
		"@types/node": "^25.0.2",
		"@yao-pkg/pkg": "^6.0.0",
		"borp": "^1.0.0",
		"desm": "^1.3.0",
		"eslint": "^9.39.1",
		"fastbench": "^1.0.1",
		"neostandard": "^0.13.0",
		"pino-elasticsearch": "^9.0.0",
		"sonic-boom": "^5.0.0",
		"ts-node": "^10.8.0",
		"typescript": "~5.7.3"
	};
	scripts = {
		"build": "tsc --noEmit",
		"lint": "eslint",
		"test": "npm run lint && npm run build && npm run transpile && borp --pattern \"test/*.test.{js,mjs}\"",
		"test:ci": "npm run lint && npm run transpile && borp --pattern \"test/*.test.{js,mjs}\"",
		"test:yarn": "npm run transpile && borp --pattern \"test/*.test.js\"",
		"transpile": "sh ./test/ts/transpile.sh"
	};
	repository = {
		"type": "git",
		"url": "git+https://github.com/mcollina/thread-stream.git"
	};
	keywords = [
		"worker",
		"thread",
		"threads",
		"stream"
	];
	author = "Matteo Collina <hello@matteocollina.com>";
	bugs = { "url": "https://github.com/mcollina/thread-stream/issues" };
	homepage = "https://github.com/mcollina/thread-stream#readme";
	package_default = {
		name,
		version,
		description,
		main,
		types,
		engines,
		dependencies,
		devDependencies,
		scripts,
		repository,
		keywords,
		author,
		license: "MIT",
		bugs,
		homepage
	};
}));
//#endregion
//#region node_modules/thread-stream/lib/wait.js
var require_wait = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var WAIT_MS = 1e4;
	function wait(state, index, expected, timeout, done) {
		const max = timeout === Infinity ? Infinity : Date.now() + timeout;
		const check = () => {
			const current = Atomics.load(state, index);
			if (current === expected) {
				done(null, "ok");
				return;
			}
			if (max !== Infinity && Date.now() > max) {
				done(null, "timed-out");
				return;
			}
			const remaining = max === Infinity ? WAIT_MS : Math.min(WAIT_MS, Math.max(1, max - Date.now()));
			const result = Atomics.waitAsync(state, index, current, remaining);
			if (result.async) result.value.then(check);
			else setImmediate(check);
		};
		check();
	}
	function waitDiff(state, index, expected, timeout, done) {
		const max = timeout === Infinity ? Infinity : Date.now() + timeout;
		const check = () => {
			if (Atomics.load(state, index) !== expected) {
				done(null, "ok");
				return;
			}
			if (max !== Infinity && Date.now() > max) {
				done(null, "timed-out");
				return;
			}
			const remaining = max === Infinity ? WAIT_MS : Math.min(WAIT_MS, Math.max(1, max - Date.now()));
			const result = Atomics.waitAsync(state, index, expected, remaining);
			if (result.async) result.value.then((res) => {
				if (res === "ok") {
					done(null, "ok");
					return;
				}
				check();
			});
			else setImmediate(check);
		};
		check();
	}
	module.exports = {
		wait,
		waitDiff
	};
}));
//#endregion
//#region node_modules/thread-stream/lib/indexes.js
var require_indexes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		WRITE_INDEX: 4,
		READ_INDEX: 8,
		SEQ_INDEX: 2
	};
}));
//#endregion
//#region node_modules/thread-stream/index.js
var require_thread_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { version } = (init_package(), __toCommonJS(package_exports).default);
	var { EventEmitter: EventEmitter$1 } = __require("events");
	var { Worker } = __require("worker_threads");
	var { join: join$1 } = __require("path");
	var { pathToFileURL } = __require("url");
	var { wait } = require_wait();
	var { WRITE_INDEX, READ_INDEX, SEQ_INDEX } = require_indexes();
	var buffer = __require("buffer");
	var assert = __require("assert");
	var kImpl = Symbol("kImpl");
	var MAX_STRING = buffer.constants.MAX_STRING_LENGTH;
	function noop() {}
	function updateState(stream, fn) {
		Atomics.add(stream[kImpl].state, SEQ_INDEX, 1);
		fn();
		Atomics.add(stream[kImpl].state, SEQ_INDEX, 1);
		Atomics.notify(stream[kImpl].state, SEQ_INDEX);
	}
	function resetIndexes(stream) {
		updateState(stream, () => {
			Atomics.store(stream[kImpl].state, READ_INDEX, 0);
			Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
		});
	}
	var FakeWeakRef = class {
		constructor(value) {
			this._value = value;
		}
		deref() {
			return this._value;
		}
	};
	var FakeFinalizationRegistry = class {
		register() {}
		unregister() {}
	};
	var FinalizationRegistry = process.env.NODE_V8_COVERAGE ? FakeFinalizationRegistry : global.FinalizationRegistry || FakeFinalizationRegistry;
	var WeakRef = process.env.NODE_V8_COVERAGE ? FakeWeakRef : global.WeakRef || FakeWeakRef;
	var registry = new FinalizationRegistry((worker) => {
		if (worker.exited) return;
		worker.terminate();
	});
	function createWorker(stream, opts) {
		const { filename, workerData } = opts;
		const worker = new Worker(("__bundlerPathsOverrides" in globalThis ? globalThis.__bundlerPathsOverrides : {})["thread-stream-worker"] || join$1(__dirname, "lib", "worker.js"), {
			...opts.workerOpts,
			name: opts.workerOpts?.name || "thread-stream",
			trackUnmanagedFds: false,
			workerData: {
				filename: filename.indexOf("file://") === 0 ? filename : pathToFileURL(filename).href,
				dataBuf: stream[kImpl].dataBuf,
				stateBuf: stream[kImpl].stateBuf,
				workerData: {
					$context: { threadStreamVersion: version },
					...workerData
				}
			}
		});
		worker.stream = new FakeWeakRef(stream);
		worker.on("message", onWorkerMessage);
		worker.on("exit", onWorkerExit);
		registry.register(stream, worker);
		return worker;
	}
	function drain(stream) {
		assert(!stream[kImpl].sync);
		if (stream[kImpl].needDrain) {
			stream[kImpl].needDrain = false;
			stream.emit("drain");
		}
	}
	function nextFlush(stream) {
		while (true) {
			const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
			const leftover = stream[kImpl].data.length - writeIndex;
			if (leftover > 0) {
				if (stream[kImpl].bufLen === 0) {
					stream[kImpl].flushing = false;
					if (stream[kImpl].ending) end(stream);
					else if (stream[kImpl].needDrain) process.nextTick(drain, stream);
					return;
				}
				write(stream, leftover, noop);
				continue;
			}
			if (leftover === 0) {
				if (writeIndex === 0 && stream[kImpl].bufLen === 0) return;
				waitForRead(stream, () => {
					if (stream.destroyed) return;
					resetIndexes(stream);
					nextFlush(stream);
				});
				return;
			}
			destroy(stream, /* @__PURE__ */ new Error("overwritten"));
			return;
		}
	}
	function onWorkerMessage(msg) {
		const stream = this.stream.deref();
		if (stream === void 0) {
			this.exited = true;
			this.terminate();
			return;
		}
		if (msg?.code == null) return;
		switch (msg.code) {
			case "READY":
				this.stream = new WeakRef(stream);
				waitForRead(stream, () => {
					stream[kImpl].ready = true;
					stream.emit("ready");
				});
				break;
			case "ERROR":
				destroy(stream, msg.err);
				break;
			case "EVENT":
				if (Array.isArray(msg.args)) stream.emit(msg.name, ...msg.args);
				else stream.emit(msg.name, msg.args);
				break;
			case "FLUSHED": {
				if (msg.context !== "thread-stream") {
					destroy(stream, /* @__PURE__ */ new Error("this should not happen: " + msg.code));
					break;
				}
				const cb = stream[kImpl].flushCallbacks.get(msg.id);
				if (cb) {
					stream[kImpl].flushCallbacks.delete(msg.id);
					process.nextTick(cb);
				}
				break;
			}
			case "WARNING":
				process.emitWarning(msg.err);
				break;
			default: destroy(stream, /* @__PURE__ */ new Error("this should not happen: " + msg.code));
		}
	}
	function onWorkerExit(code) {
		const stream = this.stream.deref();
		if (stream === void 0) return;
		registry.unregister(stream);
		stream.worker.exited = true;
		stream.worker.off("exit", onWorkerExit);
		destroy(stream, code !== 0 ? /* @__PURE__ */ new Error("the worker thread exited") : null);
	}
	var ThreadStream = class extends EventEmitter$1 {
		constructor(opts = {}) {
			super();
			if (opts.bufferSize < 4) throw new Error("bufferSize must at least fit a 4-byte utf-8 char");
			this[kImpl] = {};
			this[kImpl].stateBuf = new SharedArrayBuffer(128);
			this[kImpl].state = new Int32Array(this[kImpl].stateBuf);
			this[kImpl].dataBuf = new SharedArrayBuffer(opts.bufferSize || 4 * 1024 * 1024);
			this[kImpl].data = Buffer.from(this[kImpl].dataBuf);
			this[kImpl].sync = opts.sync || false;
			this[kImpl].ending = false;
			this[kImpl].ended = false;
			this[kImpl].needDrain = false;
			this[kImpl].destroyed = false;
			this[kImpl].flushing = false;
			this[kImpl].ready = false;
			this[kImpl].finished = false;
			this[kImpl].errored = null;
			this[kImpl].closed = false;
			this[kImpl].buf = [];
			this[kImpl].bufHead = 0;
			this[kImpl].bufLen = 0;
			this[kImpl].flushCallbacks = /* @__PURE__ */ new Map();
			this[kImpl].nextFlushId = 0;
			this.worker = createWorker(this, opts);
			this.on("message", (message, transferList) => {
				this.worker.postMessage(message, transferList);
			});
		}
		write(data) {
			const dataBuf = Buffer.isBuffer(data) ? data : Buffer.from(data);
			if (this[kImpl].destroyed) {
				error(this, /* @__PURE__ */ new Error("the worker has exited"));
				return false;
			}
			if (this[kImpl].ending) {
				error(this, /* @__PURE__ */ new Error("the worker is ending"));
				return false;
			}
			if (this[kImpl].flushing && this[kImpl].bufLen + dataBuf.length >= MAX_STRING) try {
				writeSync(this);
				this[kImpl].flushing = true;
			} catch (err) {
				destroy(this, err);
				return false;
			}
			this[kImpl].buf.push(dataBuf);
			this[kImpl].bufLen += dataBuf.length;
			if (this[kImpl].sync) try {
				writeSync(this);
				return true;
			} catch (err) {
				destroy(this, err);
				return false;
			}
			if (!this[kImpl].flushing) {
				this[kImpl].flushing = true;
				setImmediate(nextFlush, this);
			}
			this[kImpl].needDrain = this[kImpl].data.length - this[kImpl].bufLen - Atomics.load(this[kImpl].state, WRITE_INDEX) <= 0;
			return !this[kImpl].needDrain;
		}
		end() {
			if (this[kImpl].destroyed) return;
			this[kImpl].ending = true;
			end(this);
		}
		flush(cb) {
			cb = typeof cb === "function" ? cb : noop;
			flushBuffer(this, (err) => {
				if (err) {
					process.nextTick(cb, err);
					return;
				}
				requestWorkerFlush(this, cb);
			});
		}
		flushSync() {
			if (this[kImpl].destroyed) return;
			writeSync(this);
			flushSync(this);
		}
		unref() {
			this.worker.unref();
		}
		ref() {
			this.worker.ref();
		}
		get ready() {
			return this[kImpl].ready;
		}
		get destroyed() {
			return this[kImpl].destroyed;
		}
		get closed() {
			return this[kImpl].closed;
		}
		get writable() {
			return !this[kImpl].destroyed && !this[kImpl].ending;
		}
		get writableEnded() {
			return this[kImpl].ending;
		}
		get writableFinished() {
			return this[kImpl].finished;
		}
		get writableNeedDrain() {
			return this[kImpl].needDrain;
		}
		get writableObjectMode() {
			return false;
		}
		get writableErrored() {
			return this[kImpl].errored;
		}
	};
	function flushBuffer(stream, cb) {
		if (stream[kImpl].destroyed) {
			process.nextTick(cb, /* @__PURE__ */ new Error("the worker has exited"));
			return;
		}
		if (!stream[kImpl].sync && (stream[kImpl].flushing || stream[kImpl].bufLen > 0)) {
			setImmediate(flushBuffer, stream, cb);
			return;
		}
		waitForRead(stream, cb);
	}
	function waitForRead(stream, cb) {
		const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
		wait(stream[kImpl].state, READ_INDEX, writeIndex, Infinity, (err, res) => {
			if (err) {
				destroy(stream, err);
				cb(err);
				return;
			}
			if (res !== "ok") {
				waitForRead(stream, cb);
				return;
			}
			cb();
		});
	}
	function requestWorkerFlush(stream, cb) {
		if (stream[kImpl].destroyed) {
			process.nextTick(cb, /* @__PURE__ */ new Error("the worker has exited"));
			return;
		}
		if (!stream[kImpl].ready) {
			const onReady = () => {
				cleanup();
				requestWorkerFlush(stream, cb);
			};
			const onClose = () => {
				cleanup();
				process.nextTick(cb, /* @__PURE__ */ new Error("the worker has exited"));
			};
			const cleanup = () => {
				stream.off("ready", onReady);
				stream.off("close", onClose);
			};
			stream.once("ready", onReady);
			stream.once("close", onClose);
			return;
		}
		const id = ++stream[kImpl].nextFlushId;
		stream[kImpl].flushCallbacks.set(id, cb);
		try {
			stream.worker.postMessage({
				code: "FLUSH",
				context: "thread-stream",
				id
			});
		} catch (err) {
			stream[kImpl].flushCallbacks.delete(id);
			destroy(stream, err);
			process.nextTick(cb, err);
		}
	}
	function failPendingFlushCallbacks(stream, err) {
		const callbacks = stream[kImpl].flushCallbacks;
		if (callbacks.size === 0) return;
		const flushErr = err || /* @__PURE__ */ new Error("the worker has exited");
		for (const cb of callbacks.values()) process.nextTick(cb, flushErr);
		callbacks.clear();
	}
	function error(stream, err) {
		setImmediate(() => {
			stream.emit("error", err);
		});
	}
	function destroy(stream, err) {
		if (stream[kImpl].destroyed) return;
		stream[kImpl].destroyed = true;
		failPendingFlushCallbacks(stream, err);
		if (err) {
			stream[kImpl].errored = err;
			error(stream, err);
		}
		if (!stream.worker.exited) stream.worker.terminate().catch(() => {}).then(() => {
			stream[kImpl].closed = true;
			stream.emit("close");
		});
		else setImmediate(() => {
			stream[kImpl].closed = true;
			stream.emit("close");
		});
	}
	function write(stream, maxBytes, cb) {
		let offset = Atomics.load(stream[kImpl].state, WRITE_INDEX);
		let remaining = maxBytes;
		while (remaining > 0 && stream[kImpl].bufLen !== 0) {
			const head = stream[kImpl].bufHead;
			const buf = stream[kImpl].buf[head];
			if (buf.length <= remaining) {
				buf.copy(stream[kImpl].data, offset);
				offset += buf.length;
				remaining -= buf.length;
				stream[kImpl].bufLen -= buf.length;
				stream[kImpl].bufHead = head + 1;
				if (stream[kImpl].bufHead === stream[kImpl].buf.length) {
					stream[kImpl].buf.length = 0;
					stream[kImpl].bufHead = 0;
				} else if (stream[kImpl].bufHead >= 1024 && stream[kImpl].bufHead * 2 >= stream[kImpl].buf.length) {
					stream[kImpl].buf.splice(0, stream[kImpl].bufHead);
					stream[kImpl].bufHead = 0;
				}
				continue;
			}
			buf.copy(stream[kImpl].data, offset, 0, remaining);
			stream[kImpl].buf[head] = buf.subarray(remaining);
			stream[kImpl].bufLen -= remaining;
			offset += remaining;
			remaining = 0;
		}
		updateState(stream, () => {
			Atomics.store(stream[kImpl].state, WRITE_INDEX, offset);
		});
		cb();
		return true;
	}
	function end(stream) {
		if (stream[kImpl].ended || !stream[kImpl].ending || stream[kImpl].flushing) return;
		stream[kImpl].ended = true;
		try {
			stream.flushSync();
			let readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
			updateState(stream, () => {
				Atomics.store(stream[kImpl].state, WRITE_INDEX, -1);
			});
			let spins = 0;
			while (readIndex !== -1) {
				Atomics.wait(stream[kImpl].state, READ_INDEX, readIndex, 1e3);
				readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
				if (readIndex === -2) {
					destroy(stream, /* @__PURE__ */ new Error("end() failed"));
					return;
				}
				if (++spins === 10) {
					destroy(stream, /* @__PURE__ */ new Error("end() took too long (10s)"));
					return;
				}
			}
			process.nextTick(() => {
				stream[kImpl].finished = true;
				stream.emit("finish");
			});
		} catch (err) {
			destroy(stream, err);
		}
	}
	function writeSync(stream) {
		const cb = () => {
			if (stream[kImpl].ending) end(stream);
			else if (stream[kImpl].needDrain) process.nextTick(drain, stream);
		};
		stream[kImpl].flushing = false;
		while (stream[kImpl].bufLen !== 0) {
			const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
			const leftover = stream[kImpl].data.length - writeIndex;
			if (leftover === 0) {
				flushSync(stream);
				resetIndexes(stream);
				continue;
			} else if (leftover < 0) throw new Error("overwritten");
			write(stream, leftover, cb);
		}
	}
	function flushSync(stream) {
		if (stream[kImpl].flushing) throw new Error("unable to flush while flushing");
		const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
		let spins = 0;
		while (true) {
			const readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
			if (readIndex === -2) throw Error("_flushSync failed");
			if (readIndex !== writeIndex) Atomics.wait(stream[kImpl].state, READ_INDEX, readIndex, 1e3);
			else break;
			if (++spins === 10) throw new Error("_flushSync took too long (10s)");
		}
	}
	module.exports = ThreadStream;
}));
//#endregion
//#region node_modules/pino/lib/transport.js
var require_transport = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { createRequire } = __require("module");
	var { existsSync } = __require("node:fs");
	var getCallers = require_caller();
	var { join, isAbsolute, sep } = __require("node:path");
	var { fileURLToPath } = __require("node:url");
	var sleep = require_atomic_sleep();
	var onExit = require_on_exit_leak_free();
	var ThreadStream = require_thread_stream();
	function setupOnExit(stream) {
		onExit.register(stream, autoEnd);
		onExit.registerBeforeExit(stream, flush);
		stream.on("close", function() {
			onExit.unregister(stream);
		});
	}
	function hasPreloadFlags() {
		const execArgv = process.execArgv;
		for (let i = 0; i < execArgv.length; i++) {
			const arg = execArgv[i];
			if (arg === "--import" || arg === "--require" || arg === "-r") return true;
			if (arg.startsWith("--import=") || arg.startsWith("--require=") || arg.startsWith("-r=")) return true;
		}
		return false;
	}
	function sanitizeNodeOptions(nodeOptions) {
		const tokens = nodeOptions.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g);
		if (!tokens) return nodeOptions;
		const sanitized = [];
		let changed = false;
		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];
			if (token === "--require" || token === "-r" || token === "--import") {
				const next = tokens[i + 1];
				if (next && shouldDropPreload(next)) {
					changed = true;
					i++;
					continue;
				}
				sanitized.push(token);
				if (next) {
					sanitized.push(next);
					i++;
				}
				continue;
			}
			if (token.startsWith("--require=") || token.startsWith("-r=") || token.startsWith("--import=")) {
				if (shouldDropPreload(token.slice(token.indexOf("=") + 1))) {
					changed = true;
					continue;
				}
			}
			sanitized.push(token);
		}
		return changed ? sanitized.join(" ") : nodeOptions;
	}
	function shouldDropPreload(value) {
		const unquoted = stripQuotes(value);
		if (!unquoted) return false;
		let path = unquoted;
		if (path.startsWith("file://")) try {
			path = fileURLToPath(path);
		} catch {
			return false;
		}
		return isAbsolute(path) && !existsSync(path);
	}
	function stripQuotes(value) {
		const first = value[0];
		const last = value[value.length - 1];
		if (first === "\"" && last === "\"" || first === "'" && last === "'") return value.slice(1, -1);
		return value;
	}
	function buildStream(filename, workerData, workerOpts, sync, name) {
		if (!workerOpts.execArgv && hasPreloadFlags() && __require.main === void 0) workerOpts = {
			...workerOpts,
			execArgv: []
		};
		if (!workerOpts.env && process.env.NODE_OPTIONS) {
			const nodeOptions = sanitizeNodeOptions(process.env.NODE_OPTIONS);
			if (nodeOptions !== process.env.NODE_OPTIONS) workerOpts = {
				...workerOpts,
				env: {
					...process.env,
					NODE_OPTIONS: nodeOptions
				}
			};
		}
		workerOpts = {
			...workerOpts,
			name
		};
		const stream = new ThreadStream({
			filename,
			workerData,
			workerOpts,
			sync
		});
		stream.on("ready", onReady);
		stream.on("close", function() {
			process.removeListener("exit", onExit);
		});
		process.on("exit", onExit);
		function onReady() {
			process.removeListener("exit", onExit);
			stream.unref();
			if (workerOpts.autoEnd !== false) setupOnExit(stream);
		}
		function onExit() {
			/* istanbul ignore next */
			if (stream.closed) return;
			stream.flushSync();
			sleep(100);
			stream.end();
		}
		return stream;
	}
	function autoEnd(stream) {
		stream.ref();
		stream.flushSync();
		stream.end();
		stream.once("close", function() {
			stream.unref();
		});
	}
	function flush(stream) {
		stream.flushSync();
	}
	function transport(fullOptions) {
		const { pipeline, targets, levels, dedupe, worker = {}, caller = getCallers(), sync = false } = fullOptions;
		const options = { ...fullOptions.options };
		const callers = typeof caller === "string" ? [caller] : caller;
		const bundlerOverrides = typeof globalThis === "object" && Object.prototype.hasOwnProperty.call(globalThis, "__bundlerPathsOverrides") && globalThis.__bundlerPathsOverrides && typeof globalThis.__bundlerPathsOverrides === "object" ? globalThis.__bundlerPathsOverrides : Object.create(null);
		let target = fullOptions.target;
		if (target && targets) throw new Error("only one of target or targets can be specified");
		if (targets) {
			target = bundlerOverrides["pino-worker"] || join(__dirname, "worker.js");
			options.targets = targets.filter((dest) => dest.target).map((dest) => {
				return {
					...dest,
					target: fixTarget(dest.target)
				};
			});
			options.pipelines = targets.filter((dest) => dest.pipeline).map((dest) => {
				return dest.pipeline.map((t) => {
					return {
						...t,
						level: dest.level,
						target: fixTarget(t.target)
					};
				});
			});
		} else if (pipeline) {
			target = bundlerOverrides["pino-worker"] || join(__dirname, "worker.js");
			options.pipelines = [pipeline.map((dest) => {
				return {
					...dest,
					target: fixTarget(dest.target)
				};
			})];
		}
		if (levels) options.levels = levels;
		if (dedupe) options.dedupe = dedupe;
		options.pinoWillSendConfig = true;
		const name = targets || pipeline ? "pino.transport" : target;
		return buildStream(fixTarget(target), options, worker, sync, name);
		function fixTarget(origin) {
			origin = bundlerOverrides[origin] || origin;
			if (isAbsolute(origin) || origin.indexOf("file://") === 0) return origin;
			if (origin === "pino/file") return join(__dirname, "..", "file.js");
			let fixTarget;
			for (const filePath of callers) try {
				fixTarget = createRequire(filePath === "node:repl" ? process.cwd() + sep : filePath).resolve(origin);
				break;
			} catch (err) {
				continue;
			}
			if (!fixTarget) throw new Error(`unable to determine transport target for "${origin}"`);
			return fixTarget;
		}
	}
	module.exports = transport;
}));
//#endregion
//#region node_modules/pino/lib/tools.js
var require_tools = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var diagChan = __require("node:diagnostics_channel");
	var format = require_quick_format_unescaped();
	var { mapHttpRequest, mapHttpResponse } = require_pino_std_serializers();
	var SonicBoom = require_sonic_boom();
	var onExit = require_on_exit_leak_free();
	var { lsCacheSym, chindingsSym, writeSym, serializersSym, formatOptsSym, endSym, stringifiersSym, stringifySym, stringifySafeSym, wildcardFirstSym, nestedKeySym, formattersSym, messageKeySym, errorKeySym, nestedKeyStrSym, msgPrefixSym } = require_symbols();
	var { isMainThread } = __require("worker_threads");
	var transport = require_transport();
	var [nodeMajor] = process.versions.node.split(".").map((v) => Number(v));
	var asJsonChan = diagChan.tracingChannel("pino_asJson");
	var asString = nodeMajor >= 25 ? (str) => JSON.stringify(str) : _asString;
	function noop() {}
	function genLog(level, hook) {
		if (!hook) return LOG;
		return function hookWrappedLog(...args) {
			hook.call(this, args, LOG, level);
		};
		function LOG(o, ...n) {
			if (typeof o === "object") {
				let msg = o;
				if (o !== null) {
					if (o.method && o.headers && o.socket) o = mapHttpRequest(o);
					else if (typeof o.setHeader === "function") o = mapHttpResponse(o);
				}
				let formatParams;
				if (msg === null && n.length === 0) formatParams = [null];
				else {
					msg = n.shift();
					formatParams = n;
				}
				if (typeof this[msgPrefixSym] === "string" && msg !== void 0 && msg !== null) msg = this[msgPrefixSym] + msg;
				this[writeSym](o, format(msg, formatParams, this[formatOptsSym]), level);
			} else {
				let msg = o === void 0 ? n.shift() : o;
				if (typeof this[msgPrefixSym] === "string" && msg !== void 0 && msg !== null) msg = this[msgPrefixSym] + msg;
				this[writeSym](null, format(msg, n, this[formatOptsSym]), level);
			}
		}
	}
	function _asString(str) {
		let result = "";
		let last = 0;
		let found = false;
		let point = 255;
		const l = str.length;
		if (l > 100) return JSON.stringify(str);
		for (var i = 0; i < l && point >= 32; i++) {
			point = str.charCodeAt(i);
			if (point === 34 || point === 92) {
				result += str.slice(last, i) + "\\";
				last = i;
				found = true;
			}
		}
		if (!found) result = str;
		else result += str.slice(last);
		return point < 32 ? JSON.stringify(str) : "\"" + result + "\"";
	}
	/**
	* `asJson` wraps `_asJson` in order to facilitate generating diagnostics.
	*
	* @param {object} obj The merging object passed to the log method.
	* @param {string} msg The log message passed to the log method.
	* @param {number} num The log level number.
	* @param {number} time The log time in milliseconds.
	*
	* @returns {string}
	*/
	function asJson(obj, msg, num, time) {
		if (asJsonChan.hasSubscribers === false) return _asJson.call(this, obj, msg, num, time);
		const store = {
			instance: this,
			arguments
		};
		return asJsonChan.traceSync(_asJson, store, this, obj, msg, num, time);
	}
	/**
	* `_asJson` parses all collected data and generates the finalized newline
	* delimited JSON string.
	*
	* @param {object} obj The merging object passed to the log method.
	* @param {string} msg The log message passed to the log method.
	* @param {number} num The log level number.
	* @param {number} time The log time in milliseconds.
	*
	* @returns {string} The finalized log string terminated with a newline.
	* @private
	*/
	function _asJson(obj, msg, num, time) {
		const stringify = this[stringifySym];
		const stringifySafe = this[stringifySafeSym];
		const stringifiers = this[stringifiersSym];
		const end = this[endSym];
		const chindings = this[chindingsSym];
		const serializers = this[serializersSym];
		const formatters = this[formattersSym];
		const messageKey = this[messageKeySym];
		const errorKey = this[errorKeySym];
		let data = this[lsCacheSym][num] + time;
		data = data + chindings;
		let value;
		if (formatters.log) obj = formatters.log(obj);
		const wildcardStringifier = stringifiers[wildcardFirstSym];
		let propStr = "";
		for (const key in obj) {
			value = obj[key];
			if (Object.prototype.hasOwnProperty.call(obj, key) && value !== void 0) {
				if (serializers[key]) value = serializers[key](value);
				else if (key === errorKey && serializers.err) value = serializers.err(value);
				const stringifier = stringifiers[key] || wildcardStringifier;
				switch (typeof value) {
					case "undefined":
					case "function": continue;
					case "number": if (Number.isFinite(value) === false) value = null;
					case "boolean":
						if (stringifier) value = stringifier(value);
						break;
					case "string":
						value = (stringifier || asString)(value);
						break;
					default: value = (stringifier || stringify)(value, stringifySafe);
				}
				if (value === void 0) continue;
				const strKey = asString(key);
				propStr += "," + strKey + ":" + value;
			}
		}
		let msgStr = "";
		if (msg !== void 0) {
			value = serializers[messageKey] ? serializers[messageKey](msg) : msg;
			const stringifier = stringifiers[messageKey] || wildcardStringifier;
			switch (typeof value) {
				case "function": break;
				case "number": if (Number.isFinite(value) === false) value = null;
				case "boolean":
					if (stringifier) value = stringifier(value);
					msgStr = ",\"" + messageKey + "\":" + value;
					break;
				case "string":
					value = (stringifier || asString)(value);
					msgStr = ",\"" + messageKey + "\":" + value;
					break;
				default:
					value = (stringifier || stringify)(value, stringifySafe);
					msgStr = ",\"" + messageKey + "\":" + value;
			}
		}
		if (this[nestedKeySym] && propStr) return data + this[nestedKeyStrSym] + propStr.slice(1) + "}" + msgStr + end;
		else return data + propStr + msgStr + end;
	}
	function asChindings(instance, bindings) {
		let value;
		let data = instance[chindingsSym];
		const stringify = instance[stringifySym];
		const stringifySafe = instance[stringifySafeSym];
		const stringifiers = instance[stringifiersSym];
		const wildcardStringifier = stringifiers[wildcardFirstSym];
		const serializers = instance[serializersSym];
		const formatter = instance[formattersSym].bindings;
		bindings = formatter(bindings);
		for (const key in bindings) {
			value = bindings[key];
			if (((key.length < 5 || key !== "level" && key !== "serializers" && key !== "formatters" && key !== "customLevels") && bindings.hasOwnProperty(key) && value !== void 0) === true) {
				value = serializers[key] ? serializers[key](value) : value;
				value = (stringifiers[key] || wildcardStringifier || stringify)(value, stringifySafe);
				if (value === void 0) continue;
				data += ",\"" + key + "\":" + value;
			}
		}
		return data;
	}
	function hasBeenTampered(stream) {
		return stream.write !== stream.constructor.prototype.write;
	}
	function buildSafeSonicBoom(opts) {
		const stream = new SonicBoom(opts);
		stream.on("error", filterBrokenPipe);
		if (!opts.sync && isMainThread) {
			onExit.register(stream, autoEnd);
			stream.on("close", function() {
				onExit.unregister(stream);
			});
		}
		return stream;
		function filterBrokenPipe(err) {
			/* istanbul ignore next */
			if (err.code === "EPIPE") {
				stream.write = noop;
				stream.end = noop;
				stream.flushSync = noop;
				stream.destroy = noop;
				return;
			}
			stream.removeListener("error", filterBrokenPipe);
			stream.emit("error", err);
		}
	}
	function autoEnd(stream, eventName) {
		/* istanbul ignore next */
		if (stream.destroyed) return;
		if (eventName === "beforeExit") {
			stream.flush();
			stream.on("drain", function() {
				stream.end();
			});
		} else
 /* istanbul ignore next */
		stream.flushSync();
	}
	function createArgsNormalizer(defaultOptions) {
		return function normalizeArgs(instance, caller, opts = {}, stream) {
			if (typeof opts === "string") {
				stream = buildSafeSonicBoom({ dest: opts });
				opts = {};
			} else if (typeof stream === "string") {
				if (opts && opts.transport) throw Error("only one of option.transport or stream can be specified");
				stream = buildSafeSonicBoom({ dest: stream });
			} else if (opts instanceof SonicBoom || opts.writable || opts._writableState) {
				stream = opts;
				opts = {};
			} else if (opts.transport) {
				if (opts.transport instanceof SonicBoom || opts.transport.writable || opts.transport._writableState) throw Error("option.transport do not allow stream, please pass to option directly. e.g. pino(transport)");
				if (opts.transport.targets && opts.transport.targets.length && opts.formatters && typeof opts.formatters.level === "function") throw Error("option.transport.targets do not allow custom level formatters");
				let customLevels;
				if (opts.customLevels) customLevels = opts.useOnlyCustomLevels ? opts.customLevels : Object.assign({}, opts.levels, opts.customLevels);
				stream = transport({
					caller,
					...opts.transport,
					levels: customLevels
				});
			}
			opts = Object.assign({}, defaultOptions, opts);
			opts.serializers = Object.assign({}, defaultOptions.serializers, opts.serializers);
			opts.formatters = Object.assign({}, defaultOptions.formatters, opts.formatters);
			if (opts.prettyPrint) throw new Error("prettyPrint option is no longer supported, see the pino-pretty package (https://github.com/pinojs/pino-pretty)");
			const { enabled, onChild } = opts;
			if (enabled === false) opts.level = "silent";
			if (!onChild) opts.onChild = noop;
			if (!stream) if (!hasBeenTampered(process.stdout)) stream = buildSafeSonicBoom({ fd: process.stdout.fd || 1 });
			else stream = process.stdout;
			return {
				opts,
				stream
			};
		};
	}
	function stringify(obj, stringifySafeFn) {
		try {
			return JSON.stringify(obj);
		} catch (_) {
			try {
				return (stringifySafeFn || this[stringifySafeSym])(obj);
			} catch (_) {
				return "\"[unable to serialize, circular reference is too complex to analyze]\"";
			}
		}
	}
	function buildFormatters(level, bindings, log) {
		return {
			level,
			bindings,
			log
		};
	}
	/**
	* Convert a string integer file descriptor to a proper native integer
	* file descriptor.
	*
	* @param {string} destination The file descriptor string to attempt to convert.
	*
	* @returns {Number}
	*/
	function normalizeDestFileDescriptor(destination) {
		const fd = Number(destination);
		if (typeof destination === "string" && Number.isFinite(fd)) return fd;
		if (destination === void 0) return 1;
		return destination;
	}
	module.exports = {
		noop,
		buildSafeSonicBoom,
		asChindings,
		asJson,
		genLog,
		createArgsNormalizer,
		stringify,
		buildFormatters,
		normalizeDestFileDescriptor
	};
}));
//#endregion
//#region node_modules/pino/lib/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		DEFAULT_LEVELS: {
			trace: 10,
			debug: 20,
			info: 30,
			warn: 40,
			error: 50,
			fatal: 60
		},
		SORTING_ORDER: {
			ASC: "ASC",
			DESC: "DESC"
		}
	};
}));
//#endregion
//#region node_modules/pino/lib/levels.js
var require_levels = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { lsCacheSym, levelValSym, useOnlyCustomLevelsSym, streamSym, formattersSym, hooksSym, levelCompSym } = require_symbols();
	var { noop, genLog } = require_tools();
	var { DEFAULT_LEVELS, SORTING_ORDER } = require_constants();
	var levelMethods = {
		fatal: (hook) => {
			const logFatal = genLog(DEFAULT_LEVELS.fatal, hook);
			return function(...args) {
				const stream = this[streamSym];
				logFatal.call(this, ...args);
				if (typeof stream.flushSync === "function") try {
					stream.flushSync();
				} catch (e) {}
			};
		},
		error: (hook) => genLog(DEFAULT_LEVELS.error, hook),
		warn: (hook) => genLog(DEFAULT_LEVELS.warn, hook),
		info: (hook) => genLog(DEFAULT_LEVELS.info, hook),
		debug: (hook) => genLog(DEFAULT_LEVELS.debug, hook),
		trace: (hook) => genLog(DEFAULT_LEVELS.trace, hook)
	};
	var nums = Object.keys(DEFAULT_LEVELS).reduce((o, k) => {
		o[DEFAULT_LEVELS[k]] = k;
		return o;
	}, {});
	var initialLsCache = Object.keys(nums).reduce((o, k) => {
		o[k] = "{\"level\":" + Number(k);
		return o;
	}, {});
	function genLsCache(instance) {
		const formatter = instance[formattersSym].level;
		const { labels } = instance.levels;
		const cache = {};
		for (const label in labels) {
			const level = formatter(labels[label], Number(label));
			cache[label] = JSON.stringify(level).slice(0, -1);
		}
		instance[lsCacheSym] = cache;
		return instance;
	}
	function isStandardLevel(level, useOnlyCustomLevels) {
		if (useOnlyCustomLevels) return false;
		switch (level) {
			case "fatal":
			case "error":
			case "warn":
			case "info":
			case "debug":
			case "trace": return true;
			default: return false;
		}
	}
	function setLevel(level) {
		const { labels, values } = this.levels;
		if (typeof level === "number") {
			if (labels[level] === void 0) throw Error("unknown level value" + level);
			level = labels[level];
		}
		if (values[level] === void 0) throw Error("unknown level " + level);
		const preLevelVal = this[levelValSym];
		const levelVal = this[levelValSym] = values[level];
		const useOnlyCustomLevelsVal = this[useOnlyCustomLevelsSym];
		const levelComparison = this[levelCompSym];
		const hook = this[hooksSym].logMethod;
		for (const key in values) {
			if (levelComparison(values[key], levelVal) === false) {
				this[key] = noop;
				continue;
			}
			this[key] = isStandardLevel(key, useOnlyCustomLevelsVal) ? levelMethods[key](hook) : genLog(values[key], hook);
		}
		this.emit("level-change", level, levelVal, labels[preLevelVal], preLevelVal, this);
	}
	function getLevel(level) {
		const { levels, levelVal } = this;
		return levels && levels.labels ? levels.labels[levelVal] : "";
	}
	function isLevelEnabled(logLevel) {
		const { values } = this.levels;
		const logLevelVal = values[logLevel];
		return logLevelVal !== void 0 && this[levelCompSym](logLevelVal, this[levelValSym]);
	}
	/**
	* Determine if the given `current` level is enabled by comparing it
	* against the current threshold (`expected`).
	*
	* @param {SORTING_ORDER} direction comparison direction "ASC" or "DESC"
	* @param {number} current current log level number representation
	* @param {number} expected threshold value to compare with
	* @returns {boolean}
	*/
	function compareLevel(direction, current, expected) {
		if (direction === SORTING_ORDER.DESC) return current <= expected;
		return current >= expected;
	}
	/**
	* Create a level comparison function based on `levelComparison`
	* it could a default function which compares levels either in "ascending" or "descending" order or custom comparison function
	*
	* @param {SORTING_ORDER | Function} levelComparison sort levels order direction or custom comparison function
	* @returns Function
	*/
	function genLevelComparison(levelComparison) {
		if (typeof levelComparison === "string") return compareLevel.bind(null, levelComparison);
		return levelComparison;
	}
	function mappings(customLevels = null, useOnlyCustomLevels = false) {
		const customNums = customLevels ? Object.keys(customLevels).reduce((o, k) => {
			o[customLevels[k]] = k;
			return o;
		}, {}) : null;
		return {
			labels: Object.assign(Object.create(Object.prototype, { Infinity: { value: "silent" } }), useOnlyCustomLevels ? null : nums, customNums),
			values: Object.assign(Object.create(Object.prototype, { silent: { value: Infinity } }), useOnlyCustomLevels ? null : DEFAULT_LEVELS, customLevels)
		};
	}
	function assertDefaultLevelFound(defaultLevel, customLevels, useOnlyCustomLevels) {
		if (typeof defaultLevel === "number") {
			if (![].concat(Object.keys(customLevels || {}).map((key) => customLevels[key]), useOnlyCustomLevels ? [] : Object.keys(nums).map((level) => +level), Infinity).includes(defaultLevel)) throw Error(`default level:${defaultLevel} must be included in custom levels`);
			return;
		}
		if (!(defaultLevel in Object.assign(Object.create(Object.prototype, { silent: { value: Infinity } }), useOnlyCustomLevels ? null : DEFAULT_LEVELS, customLevels))) throw Error(`default level:${defaultLevel} must be included in custom levels`);
	}
	function assertNoLevelCollisions(levels, customLevels) {
		const { labels, values } = levels;
		for (const k in customLevels) {
			if (k in values) throw Error("levels cannot be overridden");
			if (customLevels[k] in labels) throw Error("pre-existing level values cannot be used for new levels");
		}
	}
	/**
	* Validates whether `levelComparison` is correct
	*
	* @throws Error
	* @param {SORTING_ORDER | Function} levelComparison - value to validate
	* @returns
	*/
	function assertLevelComparison(levelComparison) {
		if (typeof levelComparison === "function") return;
		if (typeof levelComparison === "string" && Object.values(SORTING_ORDER).includes(levelComparison)) return;
		throw new Error("Levels comparison should be one of \"ASC\", \"DESC\" or \"function\" type");
	}
	module.exports = {
		initialLsCache,
		genLsCache,
		levelMethods,
		getLevel,
		setLevel,
		isLevelEnabled,
		mappings,
		assertNoLevelCollisions,
		assertDefaultLevelFound,
		genLevelComparison,
		assertLevelComparison
	};
}));
//#endregion
//#region node_modules/pino/lib/meta.js
var require_meta = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = { version: "10.3.1" };
}));
//#endregion
//#region node_modules/pino/lib/proto.js
var require_proto = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { EventEmitter } = __require("node:events");
	var { lsCacheSym, levelValSym, setLevelSym, getLevelSym, chindingsSym, mixinSym, asJsonSym, writeSym, mixinMergeStrategySym, timeSym, timeSliceIndexSym, streamSym, serializersSym, formattersSym, errorKeySym, messageKeySym, useOnlyCustomLevelsSym, needsMetadataGsym, redactFmtSym, stringifySym, formatOptsSym, stringifiersSym, msgPrefixSym, hooksSym } = require_symbols();
	var { getLevel, setLevel, isLevelEnabled, mappings, initialLsCache, genLsCache, assertNoLevelCollisions } = require_levels();
	var { asChindings, asJson, buildFormatters, stringify, noop } = require_tools();
	var { version } = require_meta();
	var redaction = require_redaction();
	var prototype = {
		constructor: class Pino {},
		child,
		bindings,
		setBindings,
		flush,
		isLevelEnabled,
		version,
		get level() {
			return this[getLevelSym]();
		},
		set level(lvl) {
			this[setLevelSym](lvl);
		},
		get levelVal() {
			return this[levelValSym];
		},
		set levelVal(n) {
			throw Error("levelVal is read-only");
		},
		get msgPrefix() {
			return this[msgPrefixSym];
		},
		get [Symbol.toStringTag]() {
			return "Pino";
		},
		[lsCacheSym]: initialLsCache,
		[writeSym]: write,
		[asJsonSym]: asJson,
		[getLevelSym]: getLevel,
		[setLevelSym]: setLevel
	};
	Object.setPrototypeOf(prototype, EventEmitter.prototype);
	module.exports = function() {
		return Object.create(prototype);
	};
	var resetChildingsFormatter = (bindings) => bindings;
	function child(bindings, options) {
		if (!bindings) throw Error("missing bindings for child Pino");
		const serializers = this[serializersSym];
		const formatters = this[formattersSym];
		const instance = Object.create(this);
		if (options == null) {
			if (instance[formattersSym].bindings !== resetChildingsFormatter) instance[formattersSym] = buildFormatters(formatters.level, resetChildingsFormatter, formatters.log);
			instance[chindingsSym] = asChindings(instance, bindings);
			if (this.onChild !== noop) this.onChild(instance);
			return instance;
		}
		if (options.hasOwnProperty("serializers") === true) {
			instance[serializersSym] = Object.create(null);
			for (const k in serializers) instance[serializersSym][k] = serializers[k];
			const parentSymbols = Object.getOwnPropertySymbols(serializers);
			for (var i = 0; i < parentSymbols.length; i++) {
				const ks = parentSymbols[i];
				instance[serializersSym][ks] = serializers[ks];
			}
			for (const bk in options.serializers) instance[serializersSym][bk] = options.serializers[bk];
			const bindingsSymbols = Object.getOwnPropertySymbols(options.serializers);
			for (var bi = 0; bi < bindingsSymbols.length; bi++) {
				const bks = bindingsSymbols[bi];
				instance[serializersSym][bks] = options.serializers[bks];
			}
		} else instance[serializersSym] = serializers;
		if (options.hasOwnProperty("formatters")) {
			const { level, bindings: chindings, log } = options.formatters;
			instance[formattersSym] = buildFormatters(level || formatters.level, chindings || resetChildingsFormatter, log || formatters.log);
		} else instance[formattersSym] = buildFormatters(formatters.level, resetChildingsFormatter, formatters.log);
		if (options.hasOwnProperty("customLevels") === true) {
			assertNoLevelCollisions(this.levels, options.customLevels);
			instance.levels = mappings(options.customLevels, instance[useOnlyCustomLevelsSym]);
			genLsCache(instance);
		}
		if (typeof options.redact === "object" && options.redact !== null || Array.isArray(options.redact)) {
			instance.redact = options.redact;
			const stringifiers = redaction(instance.redact, stringify);
			const formatOpts = { stringify: stringifiers[redactFmtSym] };
			instance[stringifySym] = stringify;
			instance[stringifiersSym] = stringifiers;
			instance[formatOptsSym] = formatOpts;
		}
		if (typeof options.msgPrefix === "string") instance[msgPrefixSym] = (this[msgPrefixSym] || "") + options.msgPrefix;
		instance[chindingsSym] = asChindings(instance, bindings);
		if (options.level !== void 0 && options.level !== this.level || options.hasOwnProperty("customLevels")) {
			const childLevel = options.level || this.level;
			instance[setLevelSym](childLevel);
		}
		this.onChild(instance);
		return instance;
	}
	function bindings() {
		const chindingsJson = `{${this[chindingsSym].substr(1)}}`;
		const bindingsFromJson = JSON.parse(chindingsJson);
		delete bindingsFromJson.pid;
		delete bindingsFromJson.hostname;
		return bindingsFromJson;
	}
	function setBindings(newBindings) {
		const chindings = asChindings(this, newBindings);
		this[chindingsSym] = chindings;
	}
	/**
	* Default strategy for creating `mergeObject` from arguments and the result from `mixin()`.
	* Fields from `mergeObject` have higher priority in this strategy.
	*
	* @param {Object} mergeObject The object a user has supplied to the logging function.
	* @param {Object} mixinObject The result of the `mixin` method.
	* @return {Object}
	*/
	function defaultMixinMergeStrategy(mergeObject, mixinObject) {
		return Object.assign(mixinObject, mergeObject);
	}
	function write(_obj, msg, num) {
		const t = this[timeSym]();
		const mixin = this[mixinSym];
		const errorKey = this[errorKeySym];
		const messageKey = this[messageKeySym];
		const mixinMergeStrategy = this[mixinMergeStrategySym] || defaultMixinMergeStrategy;
		let obj;
		const streamWriteHook = this[hooksSym].streamWrite;
		if (_obj === void 0 || _obj === null) obj = {};
		else if (_obj instanceof Error) {
			obj = { [errorKey]: _obj };
			if (msg === void 0) msg = _obj.message;
		} else {
			obj = _obj;
			if (msg === void 0 && _obj[messageKey] === void 0 && _obj[errorKey]) msg = _obj[errorKey].message;
		}
		if (mixin) obj = mixinMergeStrategy(obj, mixin(obj, num, this));
		const s = this[asJsonSym](obj, msg, num, t);
		const stream = this[streamSym];
		if (stream[needsMetadataGsym] === true) {
			stream.lastLevel = num;
			stream.lastObj = obj;
			stream.lastMsg = msg;
			stream.lastTime = t.slice(this[timeSliceIndexSym]);
			stream.lastLogger = this;
		}
		stream.write(streamWriteHook ? streamWriteHook(s) : s);
	}
	function flush(cb) {
		if (cb != null && typeof cb !== "function") throw Error("callback must be a function");
		const stream = this[streamSym];
		if (typeof stream.flush === "function") stream.flush(cb || noop);
		else if (cb) cb();
	}
}));
//#endregion
//#region node_modules/pino/lib/multistream.js
var require_multistream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var metadata = Symbol.for("pino.metadata");
	var { DEFAULT_LEVELS } = require_constants();
	var DEFAULT_INFO_LEVEL = DEFAULT_LEVELS.info;
	function multistream(streamsArray, opts) {
		streamsArray = streamsArray || [];
		opts = opts || { dedupe: false };
		const streamLevels = Object.create(DEFAULT_LEVELS);
		streamLevels.silent = Infinity;
		if (opts.levels && typeof opts.levels === "object") Object.keys(opts.levels).forEach((i) => {
			streamLevels[i] = opts.levels[i];
		});
		const res = {
			write,
			add,
			remove,
			emit,
			flushSync,
			end,
			minLevel: 0,
			lastId: 0,
			streams: [],
			clone,
			[metadata]: true,
			streamLevels
		};
		if (Array.isArray(streamsArray)) streamsArray.forEach(add, res);
		else add.call(res, streamsArray);
		streamsArray = null;
		return res;
		function write(data) {
			let dest;
			const level = this.lastLevel;
			const { streams } = this;
			let recordedLevel = 0;
			let stream;
			for (let i = initLoopVar(streams.length, opts.dedupe); checkLoopVar(i, streams.length, opts.dedupe); i = adjustLoopVar(i, opts.dedupe)) {
				dest = streams[i];
				if (dest.level <= level) {
					if (recordedLevel !== 0 && recordedLevel !== dest.level) break;
					stream = dest.stream;
					if (stream[metadata]) {
						const { lastTime, lastMsg, lastObj, lastLogger } = this;
						stream.lastLevel = level;
						stream.lastTime = lastTime;
						stream.lastMsg = lastMsg;
						stream.lastObj = lastObj;
						stream.lastLogger = lastLogger;
					}
					stream.write(data);
					if (opts.dedupe) recordedLevel = dest.level;
				} else if (!opts.dedupe) break;
			}
		}
		function emit(...args) {
			for (const { stream } of this.streams) if (typeof stream.emit === "function") stream.emit(...args);
		}
		function flushSync() {
			for (const { stream } of this.streams) if (typeof stream.flushSync === "function") stream.flushSync();
		}
		function add(dest) {
			if (!dest) return res;
			const isStream = typeof dest.write === "function" || dest.stream;
			const stream_ = dest.write ? dest : dest.stream;
			if (!isStream) throw Error("stream object needs to implement either StreamEntry or DestinationStream interface");
			const { streams, streamLevels } = this;
			let level;
			if (typeof dest.levelVal === "number") level = dest.levelVal;
			else if (typeof dest.level === "string") level = streamLevels[dest.level];
			else if (typeof dest.level === "number") level = dest.level;
			else level = DEFAULT_INFO_LEVEL;
			const dest_ = {
				stream: stream_,
				level,
				levelVal: void 0,
				id: ++res.lastId
			};
			streams.unshift(dest_);
			streams.sort(compareByLevel);
			this.minLevel = streams[0].level;
			return res;
		}
		function remove(id) {
			const { streams } = this;
			const index = streams.findIndex((s) => s.id === id);
			if (index >= 0) {
				streams.splice(index, 1);
				streams.sort(compareByLevel);
				this.minLevel = streams.length > 0 ? streams[0].level : -1;
			}
			return res;
		}
		function end() {
			for (const { stream } of this.streams) {
				if (typeof stream.flushSync === "function") stream.flushSync();
				stream.end();
			}
		}
		function clone(level) {
			const streams = new Array(this.streams.length);
			for (let i = 0; i < streams.length; i++) streams[i] = {
				level,
				stream: this.streams[i].stream
			};
			return {
				write,
				add,
				remove,
				minLevel: level,
				streams,
				clone,
				emit,
				flushSync,
				[metadata]: true
			};
		}
	}
	function compareByLevel(a, b) {
		return a.level - b.level;
	}
	function initLoopVar(length, dedupe) {
		return dedupe ? length - 1 : 0;
	}
	function adjustLoopVar(i, dedupe) {
		return dedupe ? i - 1 : i + 1;
	}
	function checkLoopVar(i, length, dedupe) {
		return dedupe ? i >= 0 : i < length;
	}
	module.exports = multistream;
}));
//#endregion
//#region node_modules/pino/pino.js
var require_pino = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var os = __require("node:os");
	var stdSerializers = require_pino_std_serializers();
	var caller = require_caller();
	var redaction = require_redaction();
	var time = require_time();
	var proto = require_proto();
	var symbols = require_symbols();
	var { configure } = require_safe_stable_stringify();
	var { assertDefaultLevelFound, mappings, genLsCache, genLevelComparison, assertLevelComparison } = require_levels();
	var { DEFAULT_LEVELS, SORTING_ORDER } = require_constants();
	var { createArgsNormalizer, asChindings, buildSafeSonicBoom, buildFormatters, stringify, normalizeDestFileDescriptor, noop } = require_tools();
	var { version } = require_meta();
	var { chindingsSym, redactFmtSym, serializersSym, timeSym, timeSliceIndexSym, streamSym, stringifySym, stringifySafeSym, stringifiersSym, setLevelSym, endSym, formatOptsSym, messageKeySym, errorKeySym, nestedKeySym, mixinSym, levelCompSym, useOnlyCustomLevelsSym, formattersSym, hooksSym, nestedKeyStrSym, mixinMergeStrategySym, msgPrefixSym } = symbols;
	var { epochTime, nullTime } = time;
	var { pid } = process;
	var hostname = os.hostname();
	var defaultErrorSerializer = stdSerializers.err;
	var normalize = createArgsNormalizer({
		level: "info",
		levelComparison: SORTING_ORDER.ASC,
		levels: DEFAULT_LEVELS,
		messageKey: "msg",
		errorKey: "err",
		nestedKey: null,
		enabled: true,
		base: {
			pid,
			hostname
		},
		serializers: Object.assign(Object.create(null), { err: defaultErrorSerializer }),
		formatters: Object.assign(Object.create(null), {
			bindings(bindings) {
				return bindings;
			},
			level(label, number) {
				return { level: number };
			}
		}),
		hooks: {
			logMethod: void 0,
			streamWrite: void 0
		},
		timestamp: epochTime,
		name: void 0,
		redact: null,
		customLevels: null,
		useOnlyCustomLevels: false,
		depthLimit: 5,
		edgeLimit: 100
	});
	var serializers = Object.assign(Object.create(null), stdSerializers);
	function pino(...args) {
		const instance = {};
		const { opts, stream } = normalize(instance, caller(), ...args);
		if (opts.level && typeof opts.level === "string" && DEFAULT_LEVELS[opts.level.toLowerCase()] !== void 0) opts.level = opts.level.toLowerCase();
		const { redact, crlf, serializers, timestamp, messageKey, errorKey, nestedKey, base, name, level, customLevels, levelComparison, mixin, mixinMergeStrategy, useOnlyCustomLevels, formatters, hooks, depthLimit, edgeLimit, onChild, msgPrefix } = opts;
		const stringifySafe = configure({
			maximumDepth: depthLimit,
			maximumBreadth: edgeLimit
		});
		const allFormatters = buildFormatters(formatters.level, formatters.bindings, formatters.log);
		const stringifyFn = stringify.bind({ [stringifySafeSym]: stringifySafe });
		const stringifiers = redact ? redaction(redact, stringifyFn) : {};
		const formatOpts = redact ? { stringify: stringifiers[redactFmtSym] } : { stringify: stringifyFn };
		const end = "}" + (crlf ? "\r\n" : "\n");
		const coreChindings = asChindings.bind(null, {
			[chindingsSym]: "",
			[serializersSym]: serializers,
			[stringifiersSym]: stringifiers,
			[stringifySym]: stringify,
			[stringifySafeSym]: stringifySafe,
			[formattersSym]: allFormatters
		});
		let chindings = "";
		if (base !== null) if (name === void 0) chindings = coreChindings(base);
		else chindings = coreChindings(Object.assign({}, base, { name }));
		const time = timestamp instanceof Function ? timestamp : timestamp ? epochTime : nullTime;
		const timeSliceIndex = time().indexOf(":") + 1;
		if (useOnlyCustomLevels && !customLevels) throw Error("customLevels is required if useOnlyCustomLevels is set true");
		if (mixin && typeof mixin !== "function") throw Error(`Unknown mixin type "${typeof mixin}" - expected "function"`);
		if (msgPrefix && typeof msgPrefix !== "string") throw Error(`Unknown msgPrefix type "${typeof msgPrefix}" - expected "string"`);
		assertDefaultLevelFound(level, customLevels, useOnlyCustomLevels);
		const levels = mappings(customLevels, useOnlyCustomLevels);
		if (typeof stream.emit === "function") stream.emit("message", {
			code: "PINO_CONFIG",
			config: {
				levels,
				messageKey,
				errorKey
			}
		});
		assertLevelComparison(levelComparison);
		const levelCompFunc = genLevelComparison(levelComparison);
		Object.assign(instance, {
			levels,
			[levelCompSym]: levelCompFunc,
			[useOnlyCustomLevelsSym]: useOnlyCustomLevels,
			[streamSym]: stream,
			[timeSym]: time,
			[timeSliceIndexSym]: timeSliceIndex,
			[stringifySym]: stringify,
			[stringifySafeSym]: stringifySafe,
			[stringifiersSym]: stringifiers,
			[endSym]: end,
			[formatOptsSym]: formatOpts,
			[messageKeySym]: messageKey,
			[errorKeySym]: errorKey,
			[nestedKeySym]: nestedKey,
			[nestedKeyStrSym]: nestedKey ? `,${JSON.stringify(nestedKey)}:{` : "",
			[serializersSym]: serializers,
			[mixinSym]: mixin,
			[mixinMergeStrategySym]: mixinMergeStrategy,
			[chindingsSym]: chindings,
			[formattersSym]: allFormatters,
			[hooksSym]: hooks,
			silent: noop,
			onChild,
			[msgPrefixSym]: msgPrefix
		});
		Object.setPrototypeOf(instance, proto());
		genLsCache(instance);
		instance[setLevelSym](level);
		return instance;
	}
	module.exports = pino;
	module.exports.destination = (dest = process.stdout.fd) => {
		if (typeof dest === "object") {
			dest.dest = normalizeDestFileDescriptor(dest.dest || process.stdout.fd);
			return buildSafeSonicBoom(dest);
		} else return buildSafeSonicBoom({
			dest: normalizeDestFileDescriptor(dest),
			minLength: 0
		});
	};
	module.exports.transport = require_transport();
	module.exports.multistream = require_multistream();
	module.exports.levels = mappings();
	module.exports.stdSerializers = serializers;
	module.exports.stdTimeFunctions = Object.assign({}, time);
	module.exports.symbols = symbols;
	module.exports.version = version;
	module.exports.default = pino;
	module.exports.pino = pino;
}));
//#endregion
export { require_pino as t };
