'use strict';

var require$$0 = require('os');
var fs_1 = require('fs');
var require$$1 = require('path');
var url = require('url');
var http = require('http');
var https = require('https');
require('net');
var tls = require('tls');
var events = require('events');
require('assert');
var util = require('util');
var Stream = require('stream');
var zlib = require('zlib');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
var fs_1__default = /*#__PURE__*/_interopDefaultLegacy(fs_1);
var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
var url__default = /*#__PURE__*/_interopDefaultLegacy(url);
var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var https__default = /*#__PURE__*/_interopDefaultLegacy(https);
var tls__default = /*#__PURE__*/_interopDefaultLegacy(tls);
var events__default = /*#__PURE__*/_interopDefaultLegacy(events);
var util__default = /*#__PURE__*/_interopDefaultLegacy(util);
var Stream__default = /*#__PURE__*/_interopDefaultLegacy(Stream);
var zlib__default = /*#__PURE__*/_interopDefaultLegacy(zlib);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getAugmentedNamespace(n) {
	if (n.__esModule) return n;
	var a = Object.defineProperty({}, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
var toCommandValue_1 = toCommandValue;


var utils$3 = /*#__PURE__*/Object.defineProperty({
	toCommandValue: toCommandValue_1
}, '__esModule', {value: true});

var __importStar$1 = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};

const os$1 = __importStar$1(require$$0__default['default']);

/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand$1(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os$1.EOL);
}
var issueCommand_1$1 = issueCommand$1;
function issue(name, message = '') {
    issueCommand$1(name, {}, message);
}
var issue_1 = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils$3.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils$3.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}


var command = /*#__PURE__*/Object.defineProperty({
	issueCommand: issueCommand_1$1,
	issue: issue_1
}, '__esModule', {value: true});

// For internal use, subject to change.
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(fs_1__default['default']);
const os = __importStar(require$$0__default['default']);

function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils$3.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
var issueCommand_1 = issueCommand;


var fileCommand = /*#__PURE__*/Object.defineProperty({
	issueCommand: issueCommand_1
}, '__esModule', {value: true});

var core = createCommonjsModule(function (module, exports) {
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });



const os = __importStar(require$$0__default['default']);
const path = __importStar(require$$1__default['default']);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils$3.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        fileCommand.issueCommand('ENV', commandValue);
    }
    else {
        command.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        fileCommand.issueCommand('PATH', inputPath);
    }
    else {
        command.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;

});

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var context = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;


class Context {
    /**
     * Hydrate the context from the environment
     */
    constructor() {
        this.payload = {};
        if (process.env.GITHUB_EVENT_PATH) {
            if (fs_1__default['default'].existsSync(process.env.GITHUB_EVENT_PATH)) {
                this.payload = JSON.parse(fs_1__default['default'].readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));
            }
            else {
                const path = process.env.GITHUB_EVENT_PATH;
                process.stdout.write(`GITHUB_EVENT_PATH ${path} does not exist${require$$0__default['default'].EOL}`);
            }
        }
        this.eventName = process.env.GITHUB_EVENT_NAME;
        this.sha = process.env.GITHUB_SHA;
        this.ref = process.env.GITHUB_REF;
        this.workflow = process.env.GITHUB_WORKFLOW;
        this.action = process.env.GITHUB_ACTION;
        this.actor = process.env.GITHUB_ACTOR;
        this.job = process.env.GITHUB_JOB;
        this.runNumber = parseInt(process.env.GITHUB_RUN_NUMBER, 10);
        this.runId = parseInt(process.env.GITHUB_RUN_ID, 10);
    }
    get issue() {
        const payload = this.payload;
        return Object.assign(Object.assign({}, this.repo), { number: (payload.issue || payload.pull_request || payload).number });
    }
    get repo() {
        if (process.env.GITHUB_REPOSITORY) {
            const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
            return { owner, repo };
        }
        if (this.payload.repository) {
            return {
                owner: this.payload.repository.owner.login,
                repo: this.payload.repository.name
            };
        }
        throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
    }
}
exports.Context = Context;

});

function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = url__default['default'].parse(proxyVar);
    }
    return proxyUrl;
}
var getProxyUrl_1 = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
var checkBypass_1 = checkBypass;

var proxy = /*#__PURE__*/Object.defineProperty({
	getProxyUrl: getProxyUrl_1,
	checkBypass: checkBypass_1
}, '__esModule', {value: true});

var httpOverHttp_1 = httpOverHttp;
var httpsOverHttp_1 = httpsOverHttp;
var httpOverHttps_1 = httpOverHttps;
var httpsOverHttps_1 = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http__default['default'].request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http__default['default'].request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https__default['default'].request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https__default['default'].request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http__default['default'].Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util__default['default'].inherits(TunnelingAgent, events__default['default'].EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug$1('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug$1('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug$1('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug$1('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug$1('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket);
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls__default['default'].connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug$1;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug$1 = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  };
} else {
  debug$1 = function() {};
}
var debug_1$1 = debug$1; // for test

var tunnel$1 = {
	httpOverHttp: httpOverHttp_1,
	httpsOverHttp: httpsOverHttp_1,
	httpOverHttps: httpOverHttps_1,
	httpsOverHttps: httpsOverHttps_1,
	debug: debug_1$1
};

var tunnel = tunnel$1;

var httpClient = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




let tunnel$1;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = proxy.getProxyUrl(url__default['default'].parse(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = url__default['default'].parse(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = url__default['default'].parse(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = url__default['default'].parse(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = url__default['default'].parse(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https__default['default'] : http__default['default'];
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = proxy.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http__default['default'].globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel$1) {
                tunnel$1 = tunnel;
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    proxyAuth: proxyUrl.auth,
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel$1.httpsOverHttps : tunnel$1.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel$1.httpOverHttps : tunnel$1.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https__default['default'].Agent(options) : new http__default['default'].Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https__default['default'].globalAgent : http__default['default'].globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new Error(msg);
                // attach statusCode and body obj (if available) to the error object
                err['statusCode'] = statusCode;
                if (response.result) {
                    err['result'] = response.result;
                }
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;
});

var utils$2 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiBaseUrl = exports.getProxyAgent = exports.getAuthString = void 0;
const httpClient$1 = __importStar(httpClient);
function getAuthString(token, options) {
    if (!token && !options.auth) {
        throw new Error('Parameter token or opts.auth is required');
    }
    else if (token && options.auth) {
        throw new Error('Parameters token and opts.auth may not both be specified');
    }
    return typeof options.auth === 'string' ? options.auth : `token ${token}`;
}
exports.getAuthString = getAuthString;
function getProxyAgent(destinationUrl) {
    const hc = new httpClient$1.HttpClient();
    return hc.getAgent(destinationUrl);
}
exports.getProxyAgent = getProxyAgent;
function getApiBaseUrl() {
    return process.env['GITHUB_API_URL'] || 'https://api.github.com';
}
exports.getApiBaseUrl = getApiBaseUrl;

});

function getUserAgent() {
    if (typeof navigator === "object" && "userAgent" in navigator) {
        return navigator.userAgent;
    }
    if (typeof process === "object" && "version" in process) {
        return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
    }
    return "<environment undetectable>";
}

var register_1 = register;

function register (state, name, method, options) {
  if (typeof method !== 'function') {
    throw new Error('method for before hook must be a function')
  }

  if (!options) {
    options = {};
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options)
    }, method)()
  }

  return Promise.resolve()
    .then(function () {
      if (!state.registry[name]) {
        return method(options)
      }

      return (state.registry[name]).reduce(function (method, registered) {
        return registered.hook.bind(null, method, options)
      }, method)()
    })
}

var add = addHook;

function addHook (state, kind, name, hook) {
  var orig = hook;
  if (!state.registry[name]) {
    state.registry[name] = [];
  }

  if (kind === 'before') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options))
    };
  }

  if (kind === 'after') {
    hook = function (method, options) {
      var result;
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_;
          return orig(result, options)
        })
        .then(function () {
          return result
        })
    };
  }

  if (kind === 'error') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options)
        })
    };
  }

  state.registry[name].push({
    hook: hook,
    orig: orig
  });
}

var remove = removeHook;

function removeHook (state, name, method) {
  if (!state.registry[name]) {
    return
  }

  var index = state.registry[name]
    .map(function (registered) { return registered.orig })
    .indexOf(method);

  if (index === -1) {
    return
  }

  state.registry[name].splice(index, 1);
}

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind;
var bindable = bind.bind(bind);

function bindApi (hook, state, name) {
  var removeHookRef = bindable(remove, null).apply(null, name ? [state, name] : [state]);
  hook.api = { remove: removeHookRef };
  hook.remove = removeHookRef

  ;['before', 'error', 'after', 'wrap'].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind];
    hook[kind] = hook.api[kind] = bindable(add, null).apply(null, args);
  });
}

function HookSingular () {
  var singularHookName = 'h';
  var singularHookState = {
    registry: {}
  };
  var singularHook = register_1.bind(null, singularHookState, singularHookName);
  bindApi(singularHook, singularHookState, singularHookName);
  return singularHook
}

function HookCollection () {
  var state = {
    registry: {}
  };

  var hook = register_1.bind(null, state);
  bindApi(hook, state);

  return hook
}

var collectionHookDeprecationMessageDisplayed = false;
function Hook () {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4');
    collectionHookDeprecationMessageDisplayed = true;
  }
  return HookCollection()
}

Hook.Singular = HookSingular.bind();
Hook.Collection = HookCollection.bind();

var beforeAfterHook = Hook;
// expose constructors as a named property for TypeScript
var Hook_1 = Hook;
var Singular = Hook.Singular;
var Collection = Hook.Collection;
beforeAfterHook.Hook = Hook_1;
beforeAfterHook.Singular = Singular;
beforeAfterHook.Collection = Collection;

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject$1(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject$1(o) {
  var ctor,prot;

  if (isObject$1(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject$1(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

function lowercaseKeys(object) {
    if (!object) {
        return {};
    }
    return Object.keys(object).reduce((newObj, key) => {
        newObj[key.toLowerCase()] = object[key];
        return newObj;
    }, {});
}

function mergeDeep(defaults, options) {
    const result = Object.assign({}, defaults);
    Object.keys(options).forEach((key) => {
        if (isPlainObject$1(options[key])) {
            if (!(key in defaults))
                Object.assign(result, { [key]: options[key] });
            else
                result[key] = mergeDeep(defaults[key], options[key]);
        }
        else {
            Object.assign(result, { [key]: options[key] });
        }
    });
    return result;
}

function merge(defaults, route, options) {
    if (typeof route === "string") {
        let [method, url] = route.split(" ");
        options = Object.assign(url ? { method, url } : { url: method }, options);
    }
    else {
        options = Object.assign({}, route);
    }
    // lowercase header names before merging with defaults to avoid duplicates
    options.headers = lowercaseKeys(options.headers);
    const mergedOptions = mergeDeep(defaults || {}, options);
    // mediaType.previews arrays are merged, instead of overwritten
    if (defaults && defaults.mediaType.previews.length) {
        mergedOptions.mediaType.previews = defaults.mediaType.previews
            .filter((preview) => !mergedOptions.mediaType.previews.includes(preview))
            .concat(mergedOptions.mediaType.previews);
    }
    mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map((preview) => preview.replace(/-preview/, ""));
    return mergedOptions;
}

function addQueryParameters(url, parameters) {
    const separator = /\?/.test(url) ? "&" : "?";
    const names = Object.keys(parameters);
    if (names.length === 0) {
        return url;
    }
    return (url +
        separator +
        names
            .map((name) => {
            if (name === "q") {
                return ("q=" + parameters.q.split("+").map(encodeURIComponent).join("+"));
            }
            return `${name}=${encodeURIComponent(parameters[name])}`;
        })
            .join("&"));
}

const urlVariableRegex = /\{[^}]+\}/g;
function removeNonChars(variableName) {
    return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}
function extractUrlVariableNames(url) {
    const matches = url.match(urlVariableRegex);
    if (!matches) {
        return [];
    }
    return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

function omit(object, keysToOmit) {
    return Object.keys(object)
        .filter((option) => !keysToOmit.includes(option))
        .reduce((obj, key) => {
        obj[key] = object[key];
        return obj;
    }, {});
}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
/* istanbul ignore file */
function encodeReserved(str) {
    return str
        .split(/(%[0-9A-Fa-f]{2})/g)
        .map(function (part) {
        if (!/%[0-9A-Fa-f]/.test(part)) {
            part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
        }
        return part;
    })
        .join("");
}
function encodeUnreserved(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
}
function encodeValue(operator, value, key) {
    value =
        operator === "+" || operator === "#"
            ? encodeReserved(value)
            : encodeUnreserved(value);
    if (key) {
        return encodeUnreserved(key) + "=" + value;
    }
    else {
        return value;
    }
}
function isDefined(value) {
    return value !== undefined && value !== null;
}
function isKeyOperator(operator) {
    return operator === ";" || operator === "&" || operator === "?";
}
function getValues(context, operator, key, modifier) {
    var value = context[key], result = [];
    if (isDefined(value) && value !== "") {
        if (typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean") {
            value = value.toString();
            if (modifier && modifier !== "*") {
                value = value.substring(0, parseInt(modifier, 10));
            }
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
        }
        else {
            if (modifier === "*") {
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
                    });
                }
                else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            result.push(encodeValue(operator, value[k], k));
                        }
                    });
                }
            }
            else {
                const tmp = [];
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        tmp.push(encodeValue(operator, value));
                    });
                }
                else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            tmp.push(encodeUnreserved(k));
                            tmp.push(encodeValue(operator, value[k].toString()));
                        }
                    });
                }
                if (isKeyOperator(operator)) {
                    result.push(encodeUnreserved(key) + "=" + tmp.join(","));
                }
                else if (tmp.length !== 0) {
                    result.push(tmp.join(","));
                }
            }
        }
    }
    else {
        if (operator === ";") {
            if (isDefined(value)) {
                result.push(encodeUnreserved(key));
            }
        }
        else if (value === "" && (operator === "&" || operator === "?")) {
            result.push(encodeUnreserved(key) + "=");
        }
        else if (value === "") {
            result.push("");
        }
    }
    return result;
}
function parseUrl(template) {
    return {
        expand: expand.bind(null, template),
    };
}
function expand(template, context) {
    var operators = ["+", "#", ".", "/", ";", "?", "&"];
    return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
        if (expression) {
            let operator = "";
            const values = [];
            if (operators.indexOf(expression.charAt(0)) !== -1) {
                operator = expression.charAt(0);
                expression = expression.substr(1);
            }
            expression.split(/,/g).forEach(function (variable) {
                var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
                values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
            });
            if (operator && operator !== "+") {
                var separator = ",";
                if (operator === "?") {
                    separator = "&";
                }
                else if (operator !== "#") {
                    separator = operator;
                }
                return (values.length !== 0 ? operator : "") + values.join(separator);
            }
            else {
                return values.join(",");
            }
        }
        else {
            return encodeReserved(literal);
        }
    });
}

function parse$1(options) {
    // https://fetch.spec.whatwg.org/#methods
    let method = options.method.toUpperCase();
    // replace :varname with {varname} to make it RFC 6570 compatible
    let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{+$1}");
    let headers = Object.assign({}, options.headers);
    let body;
    let parameters = omit(options, [
        "method",
        "baseUrl",
        "url",
        "headers",
        "request",
        "mediaType",
    ]);
    // extract variable names from URL to calculate remaining variables later
    const urlVariableNames = extractUrlVariableNames(url);
    url = parseUrl(url).expand(parameters);
    if (!/^http/.test(url)) {
        url = options.baseUrl + url;
    }
    const omittedParameters = Object.keys(options)
        .filter((option) => urlVariableNames.includes(option))
        .concat("baseUrl");
    const remainingParameters = omit(parameters, omittedParameters);
    const isBinaryRequset = /application\/octet-stream/i.test(headers.accept);
    if (!isBinaryRequset) {
        if (options.mediaType.format) {
            // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
            headers.accept = headers.accept
                .split(/,/)
                .map((preview) => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`))
                .join(",");
        }
        if (options.mediaType.previews.length) {
            const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
            headers.accept = previewsFromAcceptHeader
                .concat(options.mediaType.previews)
                .map((preview) => {
                const format = options.mediaType.format
                    ? `.${options.mediaType.format}`
                    : "+json";
                return `application/vnd.github.${preview}-preview${format}`;
            })
                .join(",");
        }
    }
    // for GET/HEAD requests, set URL query parameters from remaining parameters
    // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters
    if (["GET", "HEAD"].includes(method)) {
        url = addQueryParameters(url, remainingParameters);
    }
    else {
        if ("data" in remainingParameters) {
            body = remainingParameters.data;
        }
        else {
            if (Object.keys(remainingParameters).length) {
                body = remainingParameters;
            }
            else {
                headers["content-length"] = 0;
            }
        }
    }
    // default content-type for JSON if body is set
    if (!headers["content-type"] && typeof body !== "undefined") {
        headers["content-type"] = "application/json; charset=utf-8";
    }
    // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
    // fetch does not allow to set `content-length` header, but we can set body to an empty string
    if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
        body = "";
    }
    // Only return body/request keys if present
    return Object.assign({ method, url, headers }, typeof body !== "undefined" ? { body } : null, options.request ? { request: options.request } : null);
}

function endpointWithDefaults(defaults, route, options) {
    return parse$1(merge(defaults, route, options));
}

function withDefaults$2(oldDefaults, newDefaults) {
    const DEFAULTS = merge(oldDefaults, newDefaults);
    const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
    return Object.assign(endpoint, {
        DEFAULTS,
        defaults: withDefaults$2.bind(null, DEFAULTS),
        merge: merge.bind(null, DEFAULTS),
        parse: parse$1,
    });
}

const VERSION$6 = "6.0.5";

const userAgent = `octokit-endpoint.js/${VERSION$6} ${getUserAgent()}`;
// DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.
const DEFAULTS = {
    method: "GET",
    baseUrl: "https://api.github.com",
    headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
    },
    mediaType: {
        format: "",
        previews: [],
    },
};

const endpoint = withDefaults$2(null, DEFAULTS);

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream__default['default'].Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream__default['default'].PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream__default['default']) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream__default['default']) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream__default['default'])) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
		if (!res) {
			res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
			if (res) {
				res.pop(); // drop last quote
			}
		}

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream__default['default'] && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream__default['default']) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http__default['default'].STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = url__default['default'].parse;
const format_url = url__default['default'].format;

const streamDestructionSupported = 'destroy' in Stream__default['default'].Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream__default['default'].Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream__default['default'].PassThrough;
const resolve_url = url__default['default'].resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https__default['default'] : http__default['default']).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream__default['default'].Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout,
							size: request.size
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib__default['default'].Z_SYNC_FLUSH,
				finishFlush: zlib__default['default'].Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib__default['default'].createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib__default['default'].createInflate());
					} else {
						body = body.pipe(zlib__default['default'].createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib__default['default'].createBrotliDecompress === 'function') {
				body = body.pipe(zlib__default['default'].createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
var wrappy_1 = wrappy;
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k];
  });

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    var ret = fn.apply(this, args);
    var cb = args[args.length-1];
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k];
      });
    }
    return ret
  }
}

var once_1 = wrappy_1(once);
var strict = wrappy_1(onceStrict);

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  });

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  });
});

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true;
    return f.value = fn.apply(this, arguments)
  };
  f.called = false;
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true;
    return f.value = fn.apply(this, arguments)
  };
  var name = fn.name || 'Function wrapped with `once`';
  f.onceError = name + " shouldn't be called more than once";
  f.called = false;
  return f
}
once_1.strict = strict;

const logOnce = once_1((deprecation) => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */
class RequestError extends Error {
    constructor(message, statusCode, options) {
        super(message);
        // Maintains proper stack trace (only available on V8)
        /* istanbul ignore next */
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
        this.name = "HttpError";
        this.status = statusCode;
        Object.defineProperty(this, "code", {
            get() {
                logOnce(new Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
                return statusCode;
            },
        });
        this.headers = options.headers || {};
        // redact request credentials without mutating original request options
        const requestCopy = Object.assign({}, options.request);
        if (options.request.headers.authorization) {
            requestCopy.headers = Object.assign({}, options.request.headers, {
                authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]"),
            });
        }
        requestCopy.url = requestCopy.url
            // client_id & client_secret can be passed as URL query parameters to increase rate limit
            // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
            .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]")
            // OAuth tokens can be passed as URL query parameters, although it is not recommended
            // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
            .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
        this.request = requestCopy;
    }
}

const VERSION$5 = "5.4.7";

function getBufferResponse(response) {
    return response.arrayBuffer();
}

function fetchWrapper(requestOptions) {
    if (isPlainObject(requestOptions.body) ||
        Array.isArray(requestOptions.body)) {
        requestOptions.body = JSON.stringify(requestOptions.body);
    }
    let headers = {};
    let status;
    let url;
    const fetch$1 = (requestOptions.request && requestOptions.request.fetch) || fetch;
    return fetch$1(requestOptions.url, Object.assign({
        method: requestOptions.method,
        body: requestOptions.body,
        headers: requestOptions.headers,
        redirect: requestOptions.redirect,
    }, requestOptions.request))
        .then((response) => {
        url = response.url;
        status = response.status;
        for (const keyAndValue of response.headers) {
            headers[keyAndValue[0]] = keyAndValue[1];
        }
        if (status === 204 || status === 205) {
            return;
        }
        // GitHub API returns 200 for HEAD requests
        if (requestOptions.method === "HEAD") {
            if (status < 400) {
                return;
            }
            throw new RequestError(response.statusText, status, {
                headers,
                request: requestOptions,
            });
        }
        if (status === 304) {
            throw new RequestError("Not modified", status, {
                headers,
                request: requestOptions,
            });
        }
        if (status >= 400) {
            return response
                .text()
                .then((message) => {
                const error = new RequestError(message, status, {
                    headers,
                    request: requestOptions,
                });
                try {
                    let responseBody = JSON.parse(error.message);
                    Object.assign(error, responseBody);
                    let errors = responseBody.errors;
                    // Assumption `errors` would always be in Array format
                    error.message =
                        error.message + ": " + errors.map(JSON.stringify).join(", ");
                }
                catch (e) {
                    // ignore, see octokit/rest.js#684
                }
                throw error;
            });
        }
        const contentType = response.headers.get("content-type");
        if (/application\/json/.test(contentType)) {
            return response.json();
        }
        if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
            return response.text();
        }
        return getBufferResponse(response);
    })
        .then((data) => {
        return {
            status,
            url,
            headers,
            data,
        };
    })
        .catch((error) => {
        if (error instanceof RequestError) {
            throw error;
        }
        throw new RequestError(error.message, 500, {
            headers,
            request: requestOptions,
        });
    });
}

function withDefaults$1(oldEndpoint, newDefaults) {
    const endpoint = oldEndpoint.defaults(newDefaults);
    const newApi = function (route, parameters) {
        const endpointOptions = endpoint.merge(route, parameters);
        if (!endpointOptions.request || !endpointOptions.request.hook) {
            return fetchWrapper(endpoint.parse(endpointOptions));
        }
        const request = (route, parameters) => {
            return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
        };
        Object.assign(request, {
            endpoint,
            defaults: withDefaults$1.bind(null, endpoint),
        });
        return endpointOptions.request.hook(request, endpointOptions);
    };
    return Object.assign(newApi, {
        endpoint,
        defaults: withDefaults$1.bind(null, endpoint),
    });
}

const request = withDefaults$1(endpoint, {
    headers: {
        "user-agent": `octokit-request.js/${VERSION$5} ${getUserAgent()}`,
    },
});

const VERSION$4 = "4.5.4";

class GraphqlError extends Error {
    constructor(request, response) {
        const message = response.data.errors[0].message;
        super(message);
        Object.assign(this, response.data);
        Object.assign(this, { headers: response.headers });
        this.name = "GraphqlError";
        this.request = request;
        // Maintains proper stack trace (only available on V8)
        /* istanbul ignore next */
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

const NON_VARIABLE_OPTIONS = [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "query",
    "mediaType",
];
function graphql(request, query, options) {
    options =
        typeof query === "string"
            ? (options = Object.assign({ query }, options))
            : (options = query);
    const requestOptions = Object.keys(options).reduce((result, key) => {
        if (NON_VARIABLE_OPTIONS.includes(key)) {
            result[key] = options[key];
            return result;
        }
        if (!result.variables) {
            result.variables = {};
        }
        result.variables[key] = options[key];
        return result;
    }, {});
    return request(requestOptions).then((response) => {
        if (response.data.errors) {
            const headers = {};
            for (const key of Object.keys(response.headers)) {
                headers[key] = response.headers[key];
            }
            throw new GraphqlError(requestOptions, {
                headers,
                data: response.data,
            });
        }
        return response.data.data;
    });
}

function withDefaults(request$1, newDefaults) {
    const newRequest = request$1.defaults(newDefaults);
    const newApi = (query, options) => {
        return graphql(newRequest, query, options);
    };
    return Object.assign(newApi, {
        defaults: withDefaults.bind(null, newRequest),
        endpoint: request.endpoint,
    });
}

withDefaults(request, {
    headers: {
        "user-agent": `octokit-graphql.js/${VERSION$4} ${getUserAgent()}`,
    },
    method: "POST",
    url: "/graphql",
});
function withCustomRequest(customRequest) {
    return withDefaults(customRequest, {
        method: "POST",
        url: "/graphql",
    });
}

async function auth(token) {
    const tokenType = token.split(/\./).length === 3
        ? "app"
        : /^v\d+\./.test(token)
            ? "installation"
            : "oauth";
    return {
        type: "token",
        token: token,
        tokenType
    };
}

/**
 * Prefix token for usage in the Authorization header
 *
 * @param token OAuth token or JSON Web Token
 */
function withAuthorizationPrefix(token) {
    if (token.split(/\./).length === 3) {
        return `bearer ${token}`;
    }
    return `token ${token}`;
}

async function hook(token, request, route, parameters) {
    const endpoint = request.endpoint.merge(route, parameters);
    endpoint.headers.authorization = withAuthorizationPrefix(token);
    return request(endpoint);
}

const createTokenAuth = function createTokenAuth(token) {
    if (!token) {
        throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
    }
    if (typeof token !== "string") {
        throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
    }
    token = token.replace(/^(token|bearer) +/i, "");
    return Object.assign(auth.bind(null, token), {
        hook: hook.bind(null, token)
    });
};

const VERSION$3 = "3.1.2";

class Octokit {
    constructor(options = {}) {
        const hook = new Collection();
        const requestDefaults = {
            baseUrl: request.endpoint.DEFAULTS.baseUrl,
            headers: {},
            request: Object.assign({}, options.request, {
                hook: hook.bind(null, "request"),
            }),
            mediaType: {
                previews: [],
                format: "",
            },
        };
        // prepend default user agent with `options.userAgent` if set
        requestDefaults.headers["user-agent"] = [
            options.userAgent,
            `octokit-core.js/${VERSION$3} ${getUserAgent()}`,
        ]
            .filter(Boolean)
            .join(" ");
        if (options.baseUrl) {
            requestDefaults.baseUrl = options.baseUrl;
        }
        if (options.previews) {
            requestDefaults.mediaType.previews = options.previews;
        }
        if (options.timeZone) {
            requestDefaults.headers["time-zone"] = options.timeZone;
        }
        this.request = request.defaults(requestDefaults);
        this.graphql = withCustomRequest(this.request).defaults({
            ...requestDefaults,
            baseUrl: requestDefaults.baseUrl.replace(/\/api\/v3$/, "/api"),
        });
        this.log = Object.assign({
            debug: () => { },
            info: () => { },
            warn: console.warn.bind(console),
            error: console.error.bind(console),
        }, options.log);
        this.hook = hook;
        // (1) If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
        //     is unauthenticated. The `this.auth()` method is a no-op and no request hook is registred.
        // (2) If only `options.auth` is set, use the default token authentication strategy.
        // (3) If `options.authStrategy` is set then use it and pass in `options.auth`. Always pass own request as many strategies accept a custom request instance.
        // TODO: type `options.auth` based on `options.authStrategy`.
        if (!options.authStrategy) {
            if (!options.auth) {
                // (1)
                this.auth = async () => ({
                    type: "unauthenticated",
                });
            }
            else {
                // (2)
                const auth = createTokenAuth(options.auth);
                // @ts-ignore  ¯\_(ツ)_/¯
                hook.wrap("request", auth.hook);
                this.auth = auth;
            }
        }
        else {
            const auth = options.authStrategy(Object.assign({
                request: this.request,
            }, options.auth));
            // @ts-ignore  ¯\_(ツ)_/¯
            hook.wrap("request", auth.hook);
            this.auth = auth;
        }
        // apply plugins
        // https://stackoverflow.com/a/16345172
        const classConstructor = this.constructor;
        classConstructor.plugins.forEach((plugin) => {
            Object.assign(this, plugin(this, options));
        });
    }
    static defaults(defaults) {
        const OctokitWithDefaults = class extends this {
            constructor(...args) {
                const options = args[0] || {};
                if (typeof defaults === "function") {
                    super(defaults(options));
                    return;
                }
                super(Object.assign({}, defaults, options, options.userAgent && defaults.userAgent
                    ? {
                        userAgent: `${options.userAgent} ${defaults.userAgent}`,
                    }
                    : null));
            }
        };
        return OctokitWithDefaults;
    }
    /**
     * Attach a plugin (or many) to your Octokit instance.
     *
     * @example
     * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
     */
    static plugin(...newPlugins) {
        var _a;
        const currentPlugins = this.plugins;
        const NewOctokit = (_a = class extends this {
            },
            _a.plugins = currentPlugins.concat(newPlugins.filter((plugin) => !currentPlugins.includes(plugin))),
            _a);
        return NewOctokit;
    }
}
Octokit.VERSION = VERSION$3;
Octokit.plugins = [];

var distWeb$2 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Octokit: Octokit
});

const Endpoints = {
    actions: {
        addSelectedRepoToOrgSecret: [
            "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}",
        ],
        cancelWorkflowRun: [
            "POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel",
        ],
        createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
        createOrUpdateRepoSecret: [
            "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}",
        ],
        createRegistrationTokenForOrg: [
            "POST /orgs/{org}/actions/runners/registration-token",
        ],
        createRegistrationTokenForRepo: [
            "POST /repos/{owner}/{repo}/actions/runners/registration-token",
        ],
        createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
        createRemoveTokenForRepo: [
            "POST /repos/{owner}/{repo}/actions/runners/remove-token",
        ],
        createWorkflowDispatch: [
            "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
        ],
        deleteArtifact: [
            "DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}",
        ],
        deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
        deleteRepoSecret: [
            "DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}",
        ],
        deleteSelfHostedRunnerFromOrg: [
            "DELETE /orgs/{org}/actions/runners/{runner_id}",
        ],
        deleteSelfHostedRunnerFromRepo: [
            "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}",
        ],
        deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
        deleteWorkflowRunLogs: [
            "DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs",
        ],
        downloadArtifact: [
            "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}",
        ],
        downloadJobLogsForWorkflowRun: [
            "GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs",
        ],
        downloadWorkflowRunLogs: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs",
        ],
        getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
        getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
        getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
        getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
        getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
        getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
        getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
        getSelfHostedRunnerForRepo: [
            "GET /repos/{owner}/{repo}/actions/runners/{runner_id}",
        ],
        getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
        getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
        getWorkflowRunUsage: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing",
        ],
        getWorkflowUsage: [
            "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing",
        ],
        listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
        listJobsForWorkflowRun: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs",
        ],
        listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
        listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
        listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
        listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
        listRunnerApplicationsForRepo: [
            "GET /repos/{owner}/{repo}/actions/runners/downloads",
        ],
        listSelectedReposForOrgSecret: [
            "GET /orgs/{org}/actions/secrets/{secret_name}/repositories",
        ],
        listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
        listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
        listWorkflowRunArtifacts: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts",
        ],
        listWorkflowRuns: [
            "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
        ],
        listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
        reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
        removeSelectedRepoFromOrgSecret: [
            "DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}",
        ],
        setSelectedReposForOrgSecret: [
            "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories",
        ],
    },
    activity: {
        checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
        deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
        deleteThreadSubscription: [
            "DELETE /notifications/threads/{thread_id}/subscription",
        ],
        getFeeds: ["GET /feeds"],
        getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
        getThread: ["GET /notifications/threads/{thread_id}"],
        getThreadSubscriptionForAuthenticatedUser: [
            "GET /notifications/threads/{thread_id}/subscription",
        ],
        listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
        listNotificationsForAuthenticatedUser: ["GET /notifications"],
        listOrgEventsForAuthenticatedUser: [
            "GET /users/{username}/events/orgs/{org}",
        ],
        listPublicEvents: ["GET /events"],
        listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
        listPublicEventsForUser: ["GET /users/{username}/events/public"],
        listPublicOrgEvents: ["GET /orgs/{org}/events"],
        listReceivedEventsForUser: ["GET /users/{username}/received_events"],
        listReceivedPublicEventsForUser: [
            "GET /users/{username}/received_events/public",
        ],
        listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
        listRepoNotificationsForAuthenticatedUser: [
            "GET /repos/{owner}/{repo}/notifications",
        ],
        listReposStarredByAuthenticatedUser: ["GET /user/starred"],
        listReposStarredByUser: ["GET /users/{username}/starred"],
        listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
        listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
        listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
        listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
        markNotificationsAsRead: ["PUT /notifications"],
        markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
        markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
        setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
        setThreadSubscription: [
            "PUT /notifications/threads/{thread_id}/subscription",
        ],
        starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
        unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"],
    },
    apps: {
        addRepoToInstallation: [
            "PUT /user/installations/{installation_id}/repositories/{repository_id}",
            { mediaType: { previews: ["machine-man"] } },
        ],
        checkToken: ["POST /applications/{client_id}/token"],
        createContentAttachment: [
            "POST /content_references/{content_reference_id}/attachments",
            { mediaType: { previews: ["corsair"] } },
        ],
        createFromManifest: ["POST /app-manifests/{code}/conversions"],
        createInstallationAccessToken: [
            "POST /app/installations/{installation_id}/access_tokens",
            { mediaType: { previews: ["machine-man"] } },
        ],
        deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
        deleteInstallation: [
            "DELETE /app/installations/{installation_id}",
            { mediaType: { previews: ["machine-man"] } },
        ],
        deleteToken: ["DELETE /applications/{client_id}/token"],
        getAuthenticated: [
            "GET /app",
            { mediaType: { previews: ["machine-man"] } },
        ],
        getBySlug: [
            "GET /apps/{app_slug}",
            { mediaType: { previews: ["machine-man"] } },
        ],
        getInstallation: [
            "GET /app/installations/{installation_id}",
            { mediaType: { previews: ["machine-man"] } },
        ],
        getOrgInstallation: [
            "GET /orgs/{org}/installation",
            { mediaType: { previews: ["machine-man"] } },
        ],
        getRepoInstallation: [
            "GET /repos/{owner}/{repo}/installation",
            { mediaType: { previews: ["machine-man"] } },
        ],
        getSubscriptionPlanForAccount: [
            "GET /marketplace_listing/accounts/{account_id}",
        ],
        getSubscriptionPlanForAccountStubbed: [
            "GET /marketplace_listing/stubbed/accounts/{account_id}",
        ],
        getUserInstallation: [
            "GET /users/{username}/installation",
            { mediaType: { previews: ["machine-man"] } },
        ],
        listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
        listAccountsForPlanStubbed: [
            "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts",
        ],
        listInstallationReposForAuthenticatedUser: [
            "GET /user/installations/{installation_id}/repositories",
            { mediaType: { previews: ["machine-man"] } },
        ],
        listInstallations: [
            "GET /app/installations",
            { mediaType: { previews: ["machine-man"] } },
        ],
        listInstallationsForAuthenticatedUser: [
            "GET /user/installations",
            { mediaType: { previews: ["machine-man"] } },
        ],
        listPlans: ["GET /marketplace_listing/plans"],
        listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
        listReposAccessibleToInstallation: [
            "GET /installation/repositories",
            { mediaType: { previews: ["machine-man"] } },
        ],
        listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
        listSubscriptionsForAuthenticatedUserStubbed: [
            "GET /user/marketplace_purchases/stubbed",
        ],
        removeRepoFromInstallation: [
            "DELETE /user/installations/{installation_id}/repositories/{repository_id}",
            { mediaType: { previews: ["machine-man"] } },
        ],
        resetToken: ["PATCH /applications/{client_id}/token"],
        revokeInstallationAccessToken: ["DELETE /installation/token"],
        suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
        unsuspendInstallation: [
            "DELETE /app/installations/{installation_id}/suspended",
        ],
    },
    billing: {
        getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
        getGithubActionsBillingUser: [
            "GET /users/{username}/settings/billing/actions",
        ],
        getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
        getGithubPackagesBillingUser: [
            "GET /users/{username}/settings/billing/packages",
        ],
        getSharedStorageBillingOrg: [
            "GET /orgs/{org}/settings/billing/shared-storage",
        ],
        getSharedStorageBillingUser: [
            "GET /users/{username}/settings/billing/shared-storage",
        ],
    },
    checks: {
        create: [
            "POST /repos/{owner}/{repo}/check-runs",
            { mediaType: { previews: ["antiope"] } },
        ],
        createSuite: [
            "POST /repos/{owner}/{repo}/check-suites",
            { mediaType: { previews: ["antiope"] } },
        ],
        get: [
            "GET /repos/{owner}/{repo}/check-runs/{check_run_id}",
            { mediaType: { previews: ["antiope"] } },
        ],
        getSuite: [
            "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}",
            { mediaType: { previews: ["antiope"] } },
        ],
        listAnnotations: [
            "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations",
            { mediaType: { previews: ["antiope"] } },
        ],
        listForRef: [
            "GET /repos/{owner}/{repo}/commits/{ref}/check-runs",
            { mediaType: { previews: ["antiope"] } },
        ],
        listForSuite: [
            "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs",
            { mediaType: { previews: ["antiope"] } },
        ],
        listSuitesForRef: [
            "GET /repos/{owner}/{repo}/commits/{ref}/check-suites",
            { mediaType: { previews: ["antiope"] } },
        ],
        rerequestSuite: [
            "POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest",
            { mediaType: { previews: ["antiope"] } },
        ],
        setSuitesPreferences: [
            "PATCH /repos/{owner}/{repo}/check-suites/preferences",
            { mediaType: { previews: ["antiope"] } },
        ],
        update: [
            "PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}",
            { mediaType: { previews: ["antiope"] } },
        ],
    },
    codeScanning: {
        getAlert: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_id}"],
        listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
    },
    codesOfConduct: {
        getAllCodesOfConduct: [
            "GET /codes_of_conduct",
            { mediaType: { previews: ["scarlet-witch"] } },
        ],
        getConductCode: [
            "GET /codes_of_conduct/{key}",
            { mediaType: { previews: ["scarlet-witch"] } },
        ],
        getForRepo: [
            "GET /repos/{owner}/{repo}/community/code_of_conduct",
            { mediaType: { previews: ["scarlet-witch"] } },
        ],
    },
    emojis: { get: ["GET /emojis"] },
    gists: {
        checkIsStarred: ["GET /gists/{gist_id}/star"],
        create: ["POST /gists"],
        createComment: ["POST /gists/{gist_id}/comments"],
        delete: ["DELETE /gists/{gist_id}"],
        deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
        fork: ["POST /gists/{gist_id}/forks"],
        get: ["GET /gists/{gist_id}"],
        getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
        getRevision: ["GET /gists/{gist_id}/{sha}"],
        list: ["GET /gists"],
        listComments: ["GET /gists/{gist_id}/comments"],
        listCommits: ["GET /gists/{gist_id}/commits"],
        listForUser: ["GET /users/{username}/gists"],
        listForks: ["GET /gists/{gist_id}/forks"],
        listPublic: ["GET /gists/public"],
        listStarred: ["GET /gists/starred"],
        star: ["PUT /gists/{gist_id}/star"],
        unstar: ["DELETE /gists/{gist_id}/star"],
        update: ["PATCH /gists/{gist_id}"],
        updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"],
    },
    git: {
        createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
        createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
        createRef: ["POST /repos/{owner}/{repo}/git/refs"],
        createTag: ["POST /repos/{owner}/{repo}/git/tags"],
        createTree: ["POST /repos/{owner}/{repo}/git/trees"],
        deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
        getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
        getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
        getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
        getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
        getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
        listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
        updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"],
    },
    gitignore: {
        getAllTemplates: ["GET /gitignore/templates"],
        getTemplate: ["GET /gitignore/templates/{name}"],
    },
    interactions: {
        getRestrictionsForOrg: [
            "GET /orgs/{org}/interaction-limits",
            { mediaType: { previews: ["sombra"] } },
        ],
        getRestrictionsForRepo: [
            "GET /repos/{owner}/{repo}/interaction-limits",
            { mediaType: { previews: ["sombra"] } },
        ],
        removeRestrictionsForOrg: [
            "DELETE /orgs/{org}/interaction-limits",
            { mediaType: { previews: ["sombra"] } },
        ],
        removeRestrictionsForRepo: [
            "DELETE /repos/{owner}/{repo}/interaction-limits",
            { mediaType: { previews: ["sombra"] } },
        ],
        setRestrictionsForOrg: [
            "PUT /orgs/{org}/interaction-limits",
            { mediaType: { previews: ["sombra"] } },
        ],
        setRestrictionsForRepo: [
            "PUT /repos/{owner}/{repo}/interaction-limits",
            { mediaType: { previews: ["sombra"] } },
        ],
    },
    issues: {
        addAssignees: [
            "POST /repos/{owner}/{repo}/issues/{issue_number}/assignees",
        ],
        addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
        checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
        create: ["POST /repos/{owner}/{repo}/issues"],
        createComment: [
            "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
        ],
        createLabel: ["POST /repos/{owner}/{repo}/labels"],
        createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
        deleteComment: [
            "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}",
        ],
        deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
        deleteMilestone: [
            "DELETE /repos/{owner}/{repo}/milestones/{milestone_number}",
        ],
        get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
        getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
        getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
        getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
        getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
        list: ["GET /issues"],
        listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
        listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
        listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
        listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
        listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
        listEventsForTimeline: [
            "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline",
            { mediaType: { previews: ["mockingbird"] } },
        ],
        listForAuthenticatedUser: ["GET /user/issues"],
        listForOrg: ["GET /orgs/{org}/issues"],
        listForRepo: ["GET /repos/{owner}/{repo}/issues"],
        listLabelsForMilestone: [
            "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels",
        ],
        listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
        listLabelsOnIssue: [
            "GET /repos/{owner}/{repo}/issues/{issue_number}/labels",
        ],
        listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
        lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
        removeAllLabels: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels",
        ],
        removeAssignees: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees",
        ],
        removeLabel: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}",
        ],
        setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
        unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
        update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
        updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
        updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
        updateMilestone: [
            "PATCH /repos/{owner}/{repo}/milestones/{milestone_number}",
        ],
    },
    licenses: {
        get: ["GET /licenses/{license}"],
        getAllCommonlyUsed: ["GET /licenses"],
        getForRepo: ["GET /repos/{owner}/{repo}/license"],
    },
    markdown: {
        render: ["POST /markdown"],
        renderRaw: [
            "POST /markdown/raw",
            { headers: { "content-type": "text/plain; charset=utf-8" } },
        ],
    },
    meta: { get: ["GET /meta"] },
    migrations: {
        cancelImport: ["DELETE /repos/{owner}/{repo}/import"],
        deleteArchiveForAuthenticatedUser: [
            "DELETE /user/migrations/{migration_id}/archive",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        deleteArchiveForOrg: [
            "DELETE /orgs/{org}/migrations/{migration_id}/archive",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        downloadArchiveForOrg: [
            "GET /orgs/{org}/migrations/{migration_id}/archive",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        getArchiveForAuthenticatedUser: [
            "GET /user/migrations/{migration_id}/archive",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        getCommitAuthors: ["GET /repos/{owner}/{repo}/import/authors"],
        getImportStatus: ["GET /repos/{owner}/{repo}/import"],
        getLargeFiles: ["GET /repos/{owner}/{repo}/import/large_files"],
        getStatusForAuthenticatedUser: [
            "GET /user/migrations/{migration_id}",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        getStatusForOrg: [
            "GET /orgs/{org}/migrations/{migration_id}",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        listForAuthenticatedUser: [
            "GET /user/migrations",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        listForOrg: [
            "GET /orgs/{org}/migrations",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        listReposForOrg: [
            "GET /orgs/{org}/migrations/{migration_id}/repositories",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        listReposForUser: [
            "GET /user/migrations/{migration_id}/repositories",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        mapCommitAuthor: ["PATCH /repos/{owner}/{repo}/import/authors/{author_id}"],
        setLfsPreference: ["PATCH /repos/{owner}/{repo}/import/lfs"],
        startForAuthenticatedUser: ["POST /user/migrations"],
        startForOrg: ["POST /orgs/{org}/migrations"],
        startImport: ["PUT /repos/{owner}/{repo}/import"],
        unlockRepoForAuthenticatedUser: [
            "DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        unlockRepoForOrg: [
            "DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        updateImport: ["PATCH /repos/{owner}/{repo}/import"],
    },
    orgs: {
        blockUser: ["PUT /orgs/{org}/blocks/{username}"],
        checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
        checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
        checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
        convertMemberToOutsideCollaborator: [
            "PUT /orgs/{org}/outside_collaborators/{username}",
        ],
        createInvitation: ["POST /orgs/{org}/invitations"],
        createWebhook: ["POST /orgs/{org}/hooks"],
        deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
        get: ["GET /orgs/{org}"],
        getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
        getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
        getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
        list: ["GET /organizations"],
        listAppInstallations: [
            "GET /orgs/{org}/installations",
            { mediaType: { previews: ["machine-man"] } },
        ],
        listBlockedUsers: ["GET /orgs/{org}/blocks"],
        listForAuthenticatedUser: ["GET /user/orgs"],
        listForUser: ["GET /users/{username}/orgs"],
        listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
        listMembers: ["GET /orgs/{org}/members"],
        listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
        listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
        listPendingInvitations: ["GET /orgs/{org}/invitations"],
        listPublicMembers: ["GET /orgs/{org}/public_members"],
        listWebhooks: ["GET /orgs/{org}/hooks"],
        pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
        removeMember: ["DELETE /orgs/{org}/members/{username}"],
        removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
        removeOutsideCollaborator: [
            "DELETE /orgs/{org}/outside_collaborators/{username}",
        ],
        removePublicMembershipForAuthenticatedUser: [
            "DELETE /orgs/{org}/public_members/{username}",
        ],
        setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
        setPublicMembershipForAuthenticatedUser: [
            "PUT /orgs/{org}/public_members/{username}",
        ],
        unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
        update: ["PATCH /orgs/{org}"],
        updateMembershipForAuthenticatedUser: [
            "PATCH /user/memberships/orgs/{org}",
        ],
        updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
    },
    projects: {
        addCollaborator: [
            "PUT /projects/{project_id}/collaborators/{username}",
            { mediaType: { previews: ["inertia"] } },
        ],
        createCard: [
            "POST /projects/columns/{column_id}/cards",
            { mediaType: { previews: ["inertia"] } },
        ],
        createColumn: [
            "POST /projects/{project_id}/columns",
            { mediaType: { previews: ["inertia"] } },
        ],
        createForAuthenticatedUser: [
            "POST /user/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        createForOrg: [
            "POST /orgs/{org}/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        createForRepo: [
            "POST /repos/{owner}/{repo}/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        delete: [
            "DELETE /projects/{project_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        deleteCard: [
            "DELETE /projects/columns/cards/{card_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        deleteColumn: [
            "DELETE /projects/columns/{column_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        get: [
            "GET /projects/{project_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        getCard: [
            "GET /projects/columns/cards/{card_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        getColumn: [
            "GET /projects/columns/{column_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        getPermissionForUser: [
            "GET /projects/{project_id}/collaborators/{username}/permission",
            { mediaType: { previews: ["inertia"] } },
        ],
        listCards: [
            "GET /projects/columns/{column_id}/cards",
            { mediaType: { previews: ["inertia"] } },
        ],
        listCollaborators: [
            "GET /projects/{project_id}/collaborators",
            { mediaType: { previews: ["inertia"] } },
        ],
        listColumns: [
            "GET /projects/{project_id}/columns",
            { mediaType: { previews: ["inertia"] } },
        ],
        listForOrg: [
            "GET /orgs/{org}/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        listForRepo: [
            "GET /repos/{owner}/{repo}/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        listForUser: [
            "GET /users/{username}/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        moveCard: [
            "POST /projects/columns/cards/{card_id}/moves",
            { mediaType: { previews: ["inertia"] } },
        ],
        moveColumn: [
            "POST /projects/columns/{column_id}/moves",
            { mediaType: { previews: ["inertia"] } },
        ],
        removeCollaborator: [
            "DELETE /projects/{project_id}/collaborators/{username}",
            { mediaType: { previews: ["inertia"] } },
        ],
        update: [
            "PATCH /projects/{project_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        updateCard: [
            "PATCH /projects/columns/cards/{card_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        updateColumn: [
            "PATCH /projects/columns/{column_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
    },
    pulls: {
        checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
        create: ["POST /repos/{owner}/{repo}/pulls"],
        createReplyForReviewComment: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies",
        ],
        createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
        createReviewComment: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments",
        ],
        deletePendingReview: [
            "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}",
        ],
        deleteReviewComment: [
            "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}",
        ],
        dismissReview: [
            "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals",
        ],
        get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
        getReview: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}",
        ],
        getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
        list: ["GET /repos/{owner}/{repo}/pulls"],
        listCommentsForReview: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments",
        ],
        listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
        listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
        listRequestedReviewers: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
        ],
        listReviewComments: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments",
        ],
        listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
        listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
        merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
        removeRequestedReviewers: [
            "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
        ],
        requestReviewers: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
        ],
        submitReview: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events",
        ],
        update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
        updateBranch: [
            "PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch",
            { mediaType: { previews: ["lydian"] } },
        ],
        updateReview: [
            "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}",
        ],
        updateReviewComment: [
            "PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}",
        ],
    },
    rateLimit: { get: ["GET /rate_limit"] },
    reactions: {
        createForCommitComment: [
            "POST /repos/{owner}/{repo}/comments/{comment_id}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        createForIssue: [
            "POST /repos/{owner}/{repo}/issues/{issue_number}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        createForIssueComment: [
            "POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        createForPullRequestReviewComment: [
            "POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        createForTeamDiscussionCommentInOrg: [
            "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        createForTeamDiscussionInOrg: [
            "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        deleteForCommitComment: [
            "DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        deleteForIssue: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        deleteForIssueComment: [
            "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        deleteForPullRequestComment: [
            "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        deleteForTeamDiscussion: [
            "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        deleteForTeamDiscussionComment: [
            "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        deleteLegacy: [
            "DELETE /reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
            {
                deprecated: "octokit.reactions.deleteLegacy() is deprecated, see https://developer.github.com/v3/reactions/#delete-a-reaction-legacy",
            },
        ],
        listForCommitComment: [
            "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        listForIssue: [
            "GET /repos/{owner}/{repo}/issues/{issue_number}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        listForIssueComment: [
            "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        listForPullRequestReviewComment: [
            "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        listForTeamDiscussionCommentInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        listForTeamDiscussionInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
    },
    repos: {
        acceptInvitation: ["PATCH /user/repository_invitations/{invitation_id}"],
        addAppAccessRestrictions: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
            {},
            { mapToData: "apps" },
        ],
        addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
        addStatusCheckContexts: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
            {},
            { mapToData: "contexts" },
        ],
        addTeamAccessRestrictions: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
            {},
            { mapToData: "teams" },
        ],
        addUserAccessRestrictions: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
            {},
            { mapToData: "users" },
        ],
        checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
        checkVulnerabilityAlerts: [
            "GET /repos/{owner}/{repo}/vulnerability-alerts",
            { mediaType: { previews: ["dorian"] } },
        ],
        compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
        createCommitComment: [
            "POST /repos/{owner}/{repo}/commits/{commit_sha}/comments",
        ],
        createCommitSignatureProtection: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures",
            { mediaType: { previews: ["zzzax"] } },
        ],
        createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
        createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
        createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
        createDeploymentStatus: [
            "POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses",
        ],
        createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
        createForAuthenticatedUser: ["POST /user/repos"],
        createFork: ["POST /repos/{owner}/{repo}/forks"],
        createInOrg: ["POST /orgs/{org}/repos"],
        createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
        createPagesSite: [
            "POST /repos/{owner}/{repo}/pages",
            { mediaType: { previews: ["switcheroo"] } },
        ],
        createRelease: ["POST /repos/{owner}/{repo}/releases"],
        createUsingTemplate: [
            "POST /repos/{template_owner}/{template_repo}/generate",
            { mediaType: { previews: ["baptiste"] } },
        ],
        createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
        declineInvitation: ["DELETE /user/repository_invitations/{invitation_id}"],
        delete: ["DELETE /repos/{owner}/{repo}"],
        deleteAccessRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions",
        ],
        deleteAdminBranchProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins",
        ],
        deleteBranchProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection",
        ],
        deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
        deleteCommitSignatureProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures",
            { mediaType: { previews: ["zzzax"] } },
        ],
        deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
        deleteDeployment: [
            "DELETE /repos/{owner}/{repo}/deployments/{deployment_id}",
        ],
        deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
        deleteInvitation: [
            "DELETE /repos/{owner}/{repo}/invitations/{invitation_id}",
        ],
        deletePagesSite: [
            "DELETE /repos/{owner}/{repo}/pages",
            { mediaType: { previews: ["switcheroo"] } },
        ],
        deletePullRequestReviewProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews",
        ],
        deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
        deleteReleaseAsset: [
            "DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}",
        ],
        deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
        disableAutomatedSecurityFixes: [
            "DELETE /repos/{owner}/{repo}/automated-security-fixes",
            { mediaType: { previews: ["london"] } },
        ],
        disableVulnerabilityAlerts: [
            "DELETE /repos/{owner}/{repo}/vulnerability-alerts",
            { mediaType: { previews: ["dorian"] } },
        ],
        downloadArchive: ["GET /repos/{owner}/{repo}/{archive_format}/{ref}"],
        enableAutomatedSecurityFixes: [
            "PUT /repos/{owner}/{repo}/automated-security-fixes",
            { mediaType: { previews: ["london"] } },
        ],
        enableVulnerabilityAlerts: [
            "PUT /repos/{owner}/{repo}/vulnerability-alerts",
            { mediaType: { previews: ["dorian"] } },
        ],
        get: ["GET /repos/{owner}/{repo}"],
        getAccessRestrictions: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions",
        ],
        getAdminBranchProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins",
        ],
        getAllStatusCheckContexts: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
        ],
        getAllTopics: [
            "GET /repos/{owner}/{repo}/topics",
            { mediaType: { previews: ["mercy"] } },
        ],
        getAppsWithAccessToProtectedBranch: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
        ],
        getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
        getBranchProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection",
        ],
        getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
        getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
        getCollaboratorPermissionLevel: [
            "GET /repos/{owner}/{repo}/collaborators/{username}/permission",
        ],
        getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
        getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
        getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
        getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
        getCommitSignatureProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures",
            { mediaType: { previews: ["zzzax"] } },
        ],
        getCommunityProfileMetrics: [
            "GET /repos/{owner}/{repo}/community/profile",
            { mediaType: { previews: ["black-panther"] } },
        ],
        getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
        getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
        getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
        getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
        getDeploymentStatus: [
            "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}",
        ],
        getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
        getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
        getPages: ["GET /repos/{owner}/{repo}/pages"],
        getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
        getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
        getPullRequestReviewProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews",
        ],
        getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
        getReadme: ["GET /repos/{owner}/{repo}/readme"],
        getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
        getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
        getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
        getStatusChecksProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
        ],
        getTeamsWithAccessToProtectedBranch: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
        ],
        getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
        getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
        getUsersWithAccessToProtectedBranch: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
        ],
        getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
        getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
        listBranches: ["GET /repos/{owner}/{repo}/branches"],
        listBranchesForHeadCommit: [
            "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head",
            { mediaType: { previews: ["groot"] } },
        ],
        listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
        listCommentsForCommit: [
            "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments",
        ],
        listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
        listCommitStatusesForRef: [
            "GET /repos/{owner}/{repo}/commits/{ref}/statuses",
        ],
        listCommits: ["GET /repos/{owner}/{repo}/commits"],
        listContributors: ["GET /repos/{owner}/{repo}/contributors"],
        listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
        listDeploymentStatuses: [
            "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses",
        ],
        listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
        listForAuthenticatedUser: ["GET /user/repos"],
        listForOrg: ["GET /orgs/{org}/repos"],
        listForUser: ["GET /users/{username}/repos"],
        listForks: ["GET /repos/{owner}/{repo}/forks"],
        listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
        listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
        listLanguages: ["GET /repos/{owner}/{repo}/languages"],
        listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
        listPublic: ["GET /repositories"],
        listPullRequestsAssociatedWithCommit: [
            "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls",
            { mediaType: { previews: ["groot"] } },
        ],
        listReleaseAssets: [
            "GET /repos/{owner}/{repo}/releases/{release_id}/assets",
        ],
        listReleases: ["GET /repos/{owner}/{repo}/releases"],
        listTags: ["GET /repos/{owner}/{repo}/tags"],
        listTeams: ["GET /repos/{owner}/{repo}/teams"],
        listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
        merge: ["POST /repos/{owner}/{repo}/merges"],
        pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
        removeAppAccessRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
            {},
            { mapToData: "apps" },
        ],
        removeCollaborator: [
            "DELETE /repos/{owner}/{repo}/collaborators/{username}",
        ],
        removeStatusCheckContexts: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
            {},
            { mapToData: "contexts" },
        ],
        removeStatusCheckProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
        ],
        removeTeamAccessRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
            {},
            { mapToData: "teams" },
        ],
        removeUserAccessRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
            {},
            { mapToData: "users" },
        ],
        replaceAllTopics: [
            "PUT /repos/{owner}/{repo}/topics",
            { mediaType: { previews: ["mercy"] } },
        ],
        requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
        setAdminBranchProtection: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins",
        ],
        setAppAccessRestrictions: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
            {},
            { mapToData: "apps" },
        ],
        setStatusCheckContexts: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
            {},
            { mapToData: "contexts" },
        ],
        setTeamAccessRestrictions: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
            {},
            { mapToData: "teams" },
        ],
        setUserAccessRestrictions: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
            {},
            { mapToData: "users" },
        ],
        testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
        transfer: ["POST /repos/{owner}/{repo}/transfer"],
        update: ["PATCH /repos/{owner}/{repo}"],
        updateBranchProtection: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection",
        ],
        updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
        updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
        updateInvitation: [
            "PATCH /repos/{owner}/{repo}/invitations/{invitation_id}",
        ],
        updatePullRequestReviewProtection: [
            "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews",
        ],
        updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
        updateReleaseAsset: [
            "PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}",
        ],
        updateStatusCheckPotection: [
            "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
        ],
        updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
        uploadReleaseAsset: [
            "POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}",
            { baseUrl: "https://uploads.github.com" },
        ],
    },
    search: {
        code: ["GET /search/code"],
        commits: ["GET /search/commits", { mediaType: { previews: ["cloak"] } }],
        issuesAndPullRequests: ["GET /search/issues"],
        labels: ["GET /search/labels"],
        repos: ["GET /search/repositories"],
        topics: ["GET /search/topics", { mediaType: { previews: ["mercy"] } }],
        users: ["GET /search/users"],
    },
    teams: {
        addOrUpdateMembershipForUserInOrg: [
            "PUT /orgs/{org}/teams/{team_slug}/memberships/{username}",
        ],
        addOrUpdateProjectPermissionsInOrg: [
            "PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        addOrUpdateRepoPermissionsInOrg: [
            "PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}",
        ],
        checkPermissionsForProjectInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/projects/{project_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        checkPermissionsForRepoInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}",
        ],
        create: ["POST /orgs/{org}/teams"],
        createDiscussionCommentInOrg: [
            "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
        ],
        createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
        deleteDiscussionCommentInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}",
        ],
        deleteDiscussionInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}",
        ],
        deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
        getByName: ["GET /orgs/{org}/teams/{team_slug}"],
        getDiscussionCommentInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}",
        ],
        getDiscussionInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}",
        ],
        getMembershipForUserInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/memberships/{username}",
        ],
        list: ["GET /orgs/{org}/teams"],
        listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
        listDiscussionCommentsInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
        ],
        listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
        listForAuthenticatedUser: ["GET /user/teams"],
        listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
        listPendingInvitationsInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/invitations",
        ],
        listProjectsInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
        removeMembershipForUserInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}",
        ],
        removeProjectInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}",
        ],
        removeRepoInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}",
        ],
        updateDiscussionCommentInOrg: [
            "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}",
        ],
        updateDiscussionInOrg: [
            "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}",
        ],
        updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"],
    },
    users: {
        addEmailForAuthenticated: ["POST /user/emails"],
        block: ["PUT /user/blocks/{username}"],
        checkBlocked: ["GET /user/blocks/{username}"],
        checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
        checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
        createGpgKeyForAuthenticated: ["POST /user/gpg_keys"],
        createPublicSshKeyForAuthenticated: ["POST /user/keys"],
        deleteEmailForAuthenticated: ["DELETE /user/emails"],
        deleteGpgKeyForAuthenticated: ["DELETE /user/gpg_keys/{gpg_key_id}"],
        deletePublicSshKeyForAuthenticated: ["DELETE /user/keys/{key_id}"],
        follow: ["PUT /user/following/{username}"],
        getAuthenticated: ["GET /user"],
        getByUsername: ["GET /users/{username}"],
        getContextForUser: ["GET /users/{username}/hovercard"],
        getGpgKeyForAuthenticated: ["GET /user/gpg_keys/{gpg_key_id}"],
        getPublicSshKeyForAuthenticated: ["GET /user/keys/{key_id}"],
        list: ["GET /users"],
        listBlockedByAuthenticated: ["GET /user/blocks"],
        listEmailsForAuthenticated: ["GET /user/emails"],
        listFollowedByAuthenticated: ["GET /user/following"],
        listFollowersForAuthenticatedUser: ["GET /user/followers"],
        listFollowersForUser: ["GET /users/{username}/followers"],
        listFollowingForUser: ["GET /users/{username}/following"],
        listGpgKeysForAuthenticated: ["GET /user/gpg_keys"],
        listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
        listPublicEmailsForAuthenticated: ["GET /user/public_emails"],
        listPublicKeysForUser: ["GET /users/{username}/keys"],
        listPublicSshKeysForAuthenticated: ["GET /user/keys"],
        setPrimaryEmailVisibilityForAuthenticated: ["PATCH /user/email/visibility"],
        unblock: ["DELETE /user/blocks/{username}"],
        unfollow: ["DELETE /user/following/{username}"],
        updateAuthenticated: ["PATCH /user"],
    },
};

const VERSION$2 = "4.1.3";

function endpointsToMethods(octokit, endpointsMap) {
    const newMethods = {};
    for (const [scope, endpoints] of Object.entries(endpointsMap)) {
        for (const [methodName, endpoint] of Object.entries(endpoints)) {
            const [route, defaults, decorations] = endpoint;
            const [method, url] = route.split(/ /);
            const endpointDefaults = Object.assign({ method, url }, defaults);
            if (!newMethods[scope]) {
                newMethods[scope] = {};
            }
            const scopeMethods = newMethods[scope];
            if (decorations) {
                scopeMethods[methodName] = decorate(octokit, scope, methodName, endpointDefaults, decorations);
                continue;
            }
            scopeMethods[methodName] = octokit.request.defaults(endpointDefaults);
        }
    }
    return newMethods;
}
function decorate(octokit, scope, methodName, defaults, decorations) {
    const requestWithDefaults = octokit.request.defaults(defaults);
    /* istanbul ignore next */
    function withDecorations(...args) {
        // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
        let options = requestWithDefaults.endpoint.merge(...args);
        // There are currently no other decorations than `.mapToData`
        if (decorations.mapToData) {
            options = Object.assign({}, options, {
                data: options[decorations.mapToData],
                [decorations.mapToData]: undefined,
            });
            return requestWithDefaults(options);
        }
        if (decorations.renamed) {
            const [newScope, newMethodName] = decorations.renamed;
            octokit.log.warn(`octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`);
        }
        if (decorations.deprecated) {
            octokit.log.warn(decorations.deprecated);
        }
        if (decorations.renamedParameters) {
            // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
            const options = requestWithDefaults.endpoint.merge(...args);
            for (const [name, alias] of Object.entries(decorations.renamedParameters)) {
                if (name in options) {
                    octokit.log.warn(`"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`);
                    if (!(alias in options)) {
                        options[alias] = options[name];
                    }
                    delete options[name];
                }
            }
            return requestWithDefaults(options);
        }
        // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
        return requestWithDefaults(...args);
    }
    return Object.assign(withDecorations, requestWithDefaults);
}

/**
 * This plugin is a 1:1 copy of internal @octokit/rest plugins. The primary
 * goal is to rebuild @octokit/rest on top of @octokit/core. Once that is
 * done, we will remove the registerEndpoints methods and return the methods
 * directly as with the other plugins. At that point we will also remove the
 * legacy workarounds and deprecations.
 *
 * See the plan at
 * https://github.com/octokit/plugin-rest-endpoint-methods.js/pull/1
 */
function restEndpointMethods(octokit) {
    return endpointsToMethods(octokit, Endpoints);
}
restEndpointMethods.VERSION = VERSION$2;

var distWeb$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	restEndpointMethods: restEndpointMethods
});

const VERSION$1 = "2.3.1";

/**
 * Some “list” response that can be paginated have a different response structure
 *
 * They have a `total_count` key in the response (search also has `incomplete_results`,
 * /installation/repositories also has `repository_selection`), as well as a key with
 * the list of the items which name varies from endpoint to endpoint.
 *
 * Octokit normalizes these responses so that paginated results are always returned following
 * the same structure. One challenge is that if the list response has only one page, no Link
 * header is provided, so this header alone is not sufficient to check wether a response is
 * paginated or not.
 *
 * We check if a "total_count" key is present in the response data, but also make sure that
 * a "url" property is not, as the "Get the combined status for a specific ref" endpoint would
 * otherwise match: https://developer.github.com/v3/repos/statuses/#get-the-combined-status-for-a-specific-ref
 */
function normalizePaginatedListResponse(response) {
    const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
    if (!responseNeedsNormalization)
        return response;
    // keep the additional properties intact as there is currently no other way
    // to retrieve the same information.
    const incompleteResults = response.data.incomplete_results;
    const repositorySelection = response.data.repository_selection;
    const totalCount = response.data.total_count;
    delete response.data.incomplete_results;
    delete response.data.repository_selection;
    delete response.data.total_count;
    const namespaceKey = Object.keys(response.data)[0];
    const data = response.data[namespaceKey];
    response.data = data;
    if (typeof incompleteResults !== "undefined") {
        response.data.incomplete_results = incompleteResults;
    }
    if (typeof repositorySelection !== "undefined") {
        response.data.repository_selection = repositorySelection;
    }
    response.data.total_count = totalCount;
    return response;
}

function iterator$1(octokit, route, parameters) {
    const options = typeof route === "function"
        ? route.endpoint(parameters)
        : octokit.request.endpoint(route, parameters);
    const requestMethod = typeof route === "function" ? route : octokit.request;
    const method = options.method;
    const headers = options.headers;
    let url = options.url;
    return {
        [Symbol.asyncIterator]: () => ({
            next() {
                if (!url) {
                    return Promise.resolve({ done: true });
                }
                return requestMethod({ method, url, headers })
                    .then(normalizePaginatedListResponse)
                    .then((response) => {
                    // `response.headers.link` format:
                    // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
                    // sets `url` to undefined if "next" URL is not present or `link` header is not set
                    url = ((response.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
                    return { value: response };
                });
            },
        }),
    };
}

function paginate(octokit, route, parameters, mapFn) {
    if (typeof parameters === "function") {
        mapFn = parameters;
        parameters = undefined;
    }
    return gather(octokit, [], iterator$1(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
}
function gather(octokit, results, iterator, mapFn) {
    return iterator.next().then((result) => {
        if (result.done) {
            return results;
        }
        let earlyExit = false;
        function done() {
            earlyExit = true;
        }
        results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);
        if (earlyExit) {
            return results;
        }
        return gather(octokit, results, iterator, mapFn);
    });
}

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */
function paginateRest(octokit) {
    return {
        paginate: Object.assign(paginate.bind(null, octokit), {
            iterator: iterator$1.bind(null, octokit),
        }),
    };
}
paginateRest.VERSION = VERSION$1;

var distWeb = /*#__PURE__*/Object.freeze({
	__proto__: null,
	paginateRest: paginateRest
});

var core_1 = /*@__PURE__*/getAugmentedNamespace(distWeb$2);

var plugin_rest_endpoint_methods_1 = /*@__PURE__*/getAugmentedNamespace(distWeb$1);

var plugin_paginate_rest_1 = /*@__PURE__*/getAugmentedNamespace(distWeb);

var utils$1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOctokitOptions = exports.GitHub = exports.context = void 0;
const Context = __importStar(context);
const Utils = __importStar(utils$2);
// octokit + plugins



exports.context = new Context.Context();
const baseUrl = Utils.getApiBaseUrl();
const defaults = {
    baseUrl,
    request: {
        agent: Utils.getProxyAgent(baseUrl)
    }
};
exports.GitHub = core_1.Octokit.plugin(plugin_rest_endpoint_methods_1.restEndpointMethods, plugin_paginate_rest_1.paginateRest).defaults(defaults);
/**
 * Convience function to correctly format Octokit Options to pass into the constructor.
 *
 * @param     token    the repo PAT or GITHUB_TOKEN
 * @param     options  other options to set
 */
function getOctokitOptions(token, options) {
    const opts = Object.assign({}, options || {}); // Shallow clone - don't mutate the object provided by the caller
    // Auth
    const auth = Utils.getAuthString(token, opts);
    if (auth) {
        opts.auth = auth;
    }
    return opts;
}
exports.getOctokitOptions = getOctokitOptions;

});

var github = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOctokit = exports.context = void 0;
const Context = __importStar(context);

exports.context = new Context.Context();
/**
 * Returns a hydrated octokit ready to use for GitHub Actions
 *
 * @param     token    the repo PAT or GITHUB_TOKEN
 * @param     options  other options to set
 */
function getOctokit(token, options) {
    return new utils$1.GitHub(utils$1.getOctokitOptions(token, options));
}
exports.getOctokit = getOctokit;

});

/**
  * This file contains the Bottleneck library (MIT), compiled to ES2017, and without Clustering support.
  * https://github.com/SGrondin/bottleneck
  */

var light = createCommonjsModule(function (module, exports) {
(function (global, factory) {
	module.exports = factory() ;
}(commonjsGlobal, (function () {
	var commonjsGlobal$1 = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};

	function getCjsExportFromNamespace (n) {
		return n && n['default'] || n;
	}

	var load = function(received, defaults, onto = {}) {
	  var k, ref, v;
	  for (k in defaults) {
	    v = defaults[k];
	    onto[k] = (ref = received[k]) != null ? ref : v;
	  }
	  return onto;
	};

	var overwrite = function(received, defaults, onto = {}) {
	  var k, v;
	  for (k in received) {
	    v = received[k];
	    if (defaults[k] !== void 0) {
	      onto[k] = v;
	    }
	  }
	  return onto;
	};

	var parser = {
		load: load,
		overwrite: overwrite
	};

	var DLList;

	DLList = class DLList {
	  constructor(incr, decr) {
	    this.incr = incr;
	    this.decr = decr;
	    this._first = null;
	    this._last = null;
	    this.length = 0;
	  }

	  push(value) {
	    var node;
	    this.length++;
	    if (typeof this.incr === "function") {
	      this.incr();
	    }
	    node = {
	      value,
	      prev: this._last,
	      next: null
	    };
	    if (this._last != null) {
	      this._last.next = node;
	      this._last = node;
	    } else {
	      this._first = this._last = node;
	    }
	    return void 0;
	  }

	  shift() {
	    var value;
	    if (this._first == null) {
	      return;
	    } else {
	      this.length--;
	      if (typeof this.decr === "function") {
	        this.decr();
	      }
	    }
	    value = this._first.value;
	    if ((this._first = this._first.next) != null) {
	      this._first.prev = null;
	    } else {
	      this._last = null;
	    }
	    return value;
	  }

	  first() {
	    if (this._first != null) {
	      return this._first.value;
	    }
	  }

	  getArray() {
	    var node, ref, results;
	    node = this._first;
	    results = [];
	    while (node != null) {
	      results.push((ref = node, node = node.next, ref.value));
	    }
	    return results;
	  }

	  forEachShift(cb) {
	    var node;
	    node = this.shift();
	    while (node != null) {
	      (cb(node), node = this.shift());
	    }
	    return void 0;
	  }

	  debug() {
	    var node, ref, ref1, ref2, results;
	    node = this._first;
	    results = [];
	    while (node != null) {
	      results.push((ref = node, node = node.next, {
	        value: ref.value,
	        prev: (ref1 = ref.prev) != null ? ref1.value : void 0,
	        next: (ref2 = ref.next) != null ? ref2.value : void 0
	      }));
	    }
	    return results;
	  }

	};

	var DLList_1 = DLList;

	var Events;

	Events = class Events {
	  constructor(instance) {
	    this.instance = instance;
	    this._events = {};
	    if ((this.instance.on != null) || (this.instance.once != null) || (this.instance.removeAllListeners != null)) {
	      throw new Error("An Emitter already exists for this object");
	    }
	    this.instance.on = (name, cb) => {
	      return this._addListener(name, "many", cb);
	    };
	    this.instance.once = (name, cb) => {
	      return this._addListener(name, "once", cb);
	    };
	    this.instance.removeAllListeners = (name = null) => {
	      if (name != null) {
	        return delete this._events[name];
	      } else {
	        return this._events = {};
	      }
	    };
	  }

	  _addListener(name, status, cb) {
	    var base;
	    if ((base = this._events)[name] == null) {
	      base[name] = [];
	    }
	    this._events[name].push({cb, status});
	    return this.instance;
	  }

	  listenerCount(name) {
	    if (this._events[name] != null) {
	      return this._events[name].length;
	    } else {
	      return 0;
	    }
	  }

	  async trigger(name, ...args) {
	    var e, promises;
	    try {
	      if (name !== "debug") {
	        this.trigger("debug", `Event triggered: ${name}`, args);
	      }
	      if (this._events[name] == null) {
	        return;
	      }
	      this._events[name] = this._events[name].filter(function(listener) {
	        return listener.status !== "none";
	      });
	      promises = this._events[name].map(async(listener) => {
	        var e, returned;
	        if (listener.status === "none") {
	          return;
	        }
	        if (listener.status === "once") {
	          listener.status = "none";
	        }
	        try {
	          returned = typeof listener.cb === "function" ? listener.cb(...args) : void 0;
	          if (typeof (returned != null ? returned.then : void 0) === "function") {
	            return (await returned);
	          } else {
	            return returned;
	          }
	        } catch (error) {
	          e = error;
	          {
	            this.trigger("error", e);
	          }
	          return null;
	        }
	      });
	      return ((await Promise.all(promises))).find(function(x) {
	        return x != null;
	      });
	    } catch (error) {
	      e = error;
	      {
	        this.trigger("error", e);
	      }
	      return null;
	    }
	  }

	};

	var Events_1 = Events;

	var DLList$1, Events$1, Queues;

	DLList$1 = DLList_1;

	Events$1 = Events_1;

	Queues = class Queues {
	  constructor(num_priorities) {
	    this.Events = new Events$1(this);
	    this._length = 0;
	    this._lists = (function() {
	      var j, ref, results;
	      results = [];
	      for (j = 1, ref = num_priorities; (1 <= ref ? j <= ref : j >= ref); 1 <= ref ? ++j : --j) {
	        results.push(new DLList$1((() => {
	          return this.incr();
	        }), (() => {
	          return this.decr();
	        })));
	      }
	      return results;
	    }).call(this);
	  }

	  incr() {
	    if (this._length++ === 0) {
	      return this.Events.trigger("leftzero");
	    }
	  }

	  decr() {
	    if (--this._length === 0) {
	      return this.Events.trigger("zero");
	    }
	  }

	  push(job) {
	    return this._lists[job.options.priority].push(job);
	  }

	  queued(priority) {
	    if (priority != null) {
	      return this._lists[priority].length;
	    } else {
	      return this._length;
	    }
	  }

	  shiftAll(fn) {
	    return this._lists.forEach(function(list) {
	      return list.forEachShift(fn);
	    });
	  }

	  getFirst(arr = this._lists) {
	    var j, len, list;
	    for (j = 0, len = arr.length; j < len; j++) {
	      list = arr[j];
	      if (list.length > 0) {
	        return list;
	      }
	    }
	    return [];
	  }

	  shiftLastFrom(priority) {
	    return this.getFirst(this._lists.slice(priority).reverse()).shift();
	  }

	};

	var Queues_1 = Queues;

	var BottleneckError;

	BottleneckError = class BottleneckError extends Error {};

	var BottleneckError_1 = BottleneckError;

	var BottleneckError$1, DEFAULT_PRIORITY, Job, NUM_PRIORITIES, parser$1;

	NUM_PRIORITIES = 10;

	DEFAULT_PRIORITY = 5;

	parser$1 = parser;

	BottleneckError$1 = BottleneckError_1;

	Job = class Job {
	  constructor(task, args, options, jobDefaults, rejectOnDrop, Events, _states, Promise) {
	    this.task = task;
	    this.args = args;
	    this.rejectOnDrop = rejectOnDrop;
	    this.Events = Events;
	    this._states = _states;
	    this.Promise = Promise;
	    this.options = parser$1.load(options, jobDefaults);
	    this.options.priority = this._sanitizePriority(this.options.priority);
	    if (this.options.id === jobDefaults.id) {
	      this.options.id = `${this.options.id}-${this._randomIndex()}`;
	    }
	    this.promise = new this.Promise((_resolve, _reject) => {
	      this._resolve = _resolve;
	      this._reject = _reject;
	    });
	    this.retryCount = 0;
	  }

	  _sanitizePriority(priority) {
	    var sProperty;
	    sProperty = ~~priority !== priority ? DEFAULT_PRIORITY : priority;
	    if (sProperty < 0) {
	      return 0;
	    } else if (sProperty > NUM_PRIORITIES - 1) {
	      return NUM_PRIORITIES - 1;
	    } else {
	      return sProperty;
	    }
	  }

	  _randomIndex() {
	    return Math.random().toString(36).slice(2);
	  }

	  doDrop({error, message = "This job has been dropped by Bottleneck"} = {}) {
	    if (this._states.remove(this.options.id)) {
	      if (this.rejectOnDrop) {
	        this._reject(error != null ? error : new BottleneckError$1(message));
	      }
	      this.Events.trigger("dropped", {args: this.args, options: this.options, task: this.task, promise: this.promise});
	      return true;
	    } else {
	      return false;
	    }
	  }

	  _assertStatus(expected) {
	    var status;
	    status = this._states.jobStatus(this.options.id);
	    if (!(status === expected || (expected === "DONE" && status === null))) {
	      throw new BottleneckError$1(`Invalid job status ${status}, expected ${expected}. Please open an issue at https://github.com/SGrondin/bottleneck/issues`);
	    }
	  }

	  doReceive() {
	    this._states.start(this.options.id);
	    return this.Events.trigger("received", {args: this.args, options: this.options});
	  }

	  doQueue(reachedHWM, blocked) {
	    this._assertStatus("RECEIVED");
	    this._states.next(this.options.id);
	    return this.Events.trigger("queued", {args: this.args, options: this.options, reachedHWM, blocked});
	  }

	  doRun() {
	    if (this.retryCount === 0) {
	      this._assertStatus("QUEUED");
	      this._states.next(this.options.id);
	    } else {
	      this._assertStatus("EXECUTING");
	    }
	    return this.Events.trigger("scheduled", {args: this.args, options: this.options});
	  }

	  async doExecute(chained, clearGlobalState, run, free) {
	    var error, eventInfo, passed;
	    if (this.retryCount === 0) {
	      this._assertStatus("RUNNING");
	      this._states.next(this.options.id);
	    } else {
	      this._assertStatus("EXECUTING");
	    }
	    eventInfo = {args: this.args, options: this.options, retryCount: this.retryCount};
	    this.Events.trigger("executing", eventInfo);
	    try {
	      passed = (await (chained != null ? chained.schedule(this.options, this.task, ...this.args) : this.task(...this.args)));
	      if (clearGlobalState()) {
	        this.doDone(eventInfo);
	        await free(this.options, eventInfo);
	        this._assertStatus("DONE");
	        return this._resolve(passed);
	      }
	    } catch (error1) {
	      error = error1;
	      return this._onFailure(error, eventInfo, clearGlobalState, run, free);
	    }
	  }

	  doExpire(clearGlobalState, run, free) {
	    var error, eventInfo;
	    if (this._states.jobStatus(this.options.id === "RUNNING")) {
	      this._states.next(this.options.id);
	    }
	    this._assertStatus("EXECUTING");
	    eventInfo = {args: this.args, options: this.options, retryCount: this.retryCount};
	    error = new BottleneckError$1(`This job timed out after ${this.options.expiration} ms.`);
	    return this._onFailure(error, eventInfo, clearGlobalState, run, free);
	  }

	  async _onFailure(error, eventInfo, clearGlobalState, run, free) {
	    var retry, retryAfter;
	    if (clearGlobalState()) {
	      retry = (await this.Events.trigger("failed", error, eventInfo));
	      if (retry != null) {
	        retryAfter = ~~retry;
	        this.Events.trigger("retry", `Retrying ${this.options.id} after ${retryAfter} ms`, eventInfo);
	        this.retryCount++;
	        return run(retryAfter);
	      } else {
	        this.doDone(eventInfo);
	        await free(this.options, eventInfo);
	        this._assertStatus("DONE");
	        return this._reject(error);
	      }
	    }
	  }

	  doDone(eventInfo) {
	    this._assertStatus("EXECUTING");
	    this._states.next(this.options.id);
	    return this.Events.trigger("done", eventInfo);
	  }

	};

	var Job_1 = Job;

	var BottleneckError$2, LocalDatastore, parser$2;

	parser$2 = parser;

	BottleneckError$2 = BottleneckError_1;

	LocalDatastore = class LocalDatastore {
	  constructor(instance, storeOptions, storeInstanceOptions) {
	    this.instance = instance;
	    this.storeOptions = storeOptions;
	    this.clientId = this.instance._randomIndex();
	    parser$2.load(storeInstanceOptions, storeInstanceOptions, this);
	    this._nextRequest = this._lastReservoirRefresh = this._lastReservoirIncrease = Date.now();
	    this._running = 0;
	    this._done = 0;
	    this._unblockTime = 0;
	    this.ready = this.Promise.resolve();
	    this.clients = {};
	    this._startHeartbeat();
	  }

	  _startHeartbeat() {
	    var base;
	    if ((this.heartbeat == null) && (((this.storeOptions.reservoirRefreshInterval != null) && (this.storeOptions.reservoirRefreshAmount != null)) || ((this.storeOptions.reservoirIncreaseInterval != null) && (this.storeOptions.reservoirIncreaseAmount != null)))) {
	      return typeof (base = (this.heartbeat = setInterval(() => {
	        var amount, incr, maximum, now, reservoir;
	        now = Date.now();
	        if ((this.storeOptions.reservoirRefreshInterval != null) && now >= this._lastReservoirRefresh + this.storeOptions.reservoirRefreshInterval) {
	          this._lastReservoirRefresh = now;
	          this.storeOptions.reservoir = this.storeOptions.reservoirRefreshAmount;
	          this.instance._drainAll(this.computeCapacity());
	        }
	        if ((this.storeOptions.reservoirIncreaseInterval != null) && now >= this._lastReservoirIncrease + this.storeOptions.reservoirIncreaseInterval) {
	          ({
	            reservoirIncreaseAmount: amount,
	            reservoirIncreaseMaximum: maximum,
	            reservoir
	          } = this.storeOptions);
	          this._lastReservoirIncrease = now;
	          incr = maximum != null ? Math.min(amount, maximum - reservoir) : amount;
	          if (incr > 0) {
	            this.storeOptions.reservoir += incr;
	            return this.instance._drainAll(this.computeCapacity());
	          }
	        }
	      }, this.heartbeatInterval))).unref === "function" ? base.unref() : void 0;
	    } else {
	      return clearInterval(this.heartbeat);
	    }
	  }

	  async __publish__(message) {
	    await this.yieldLoop();
	    return this.instance.Events.trigger("message", message.toString());
	  }

	  async __disconnect__(flush) {
	    await this.yieldLoop();
	    clearInterval(this.heartbeat);
	    return this.Promise.resolve();
	  }

	  yieldLoop(t = 0) {
	    return new this.Promise(function(resolve, reject) {
	      return setTimeout(resolve, t);
	    });
	  }

	  computePenalty() {
	    var ref;
	    return (ref = this.storeOptions.penalty) != null ? ref : (15 * this.storeOptions.minTime) || 5000;
	  }

	  async __updateSettings__(options) {
	    await this.yieldLoop();
	    parser$2.overwrite(options, options, this.storeOptions);
	    this._startHeartbeat();
	    this.instance._drainAll(this.computeCapacity());
	    return true;
	  }

	  async __running__() {
	    await this.yieldLoop();
	    return this._running;
	  }

	  async __queued__() {
	    await this.yieldLoop();
	    return this.instance.queued();
	  }

	  async __done__() {
	    await this.yieldLoop();
	    return this._done;
	  }

	  async __groupCheck__(time) {
	    await this.yieldLoop();
	    return (this._nextRequest + this.timeout) < time;
	  }

	  computeCapacity() {
	    var maxConcurrent, reservoir;
	    ({maxConcurrent, reservoir} = this.storeOptions);
	    if ((maxConcurrent != null) && (reservoir != null)) {
	      return Math.min(maxConcurrent - this._running, reservoir);
	    } else if (maxConcurrent != null) {
	      return maxConcurrent - this._running;
	    } else if (reservoir != null) {
	      return reservoir;
	    } else {
	      return null;
	    }
	  }

	  conditionsCheck(weight) {
	    var capacity;
	    capacity = this.computeCapacity();
	    return (capacity == null) || weight <= capacity;
	  }

	  async __incrementReservoir__(incr) {
	    var reservoir;
	    await this.yieldLoop();
	    reservoir = this.storeOptions.reservoir += incr;
	    this.instance._drainAll(this.computeCapacity());
	    return reservoir;
	  }

	  async __currentReservoir__() {
	    await this.yieldLoop();
	    return this.storeOptions.reservoir;
	  }

	  isBlocked(now) {
	    return this._unblockTime >= now;
	  }

	  check(weight, now) {
	    return this.conditionsCheck(weight) && (this._nextRequest - now) <= 0;
	  }

	  async __check__(weight) {
	    var now;
	    await this.yieldLoop();
	    now = Date.now();
	    return this.check(weight, now);
	  }

	  async __register__(index, weight, expiration) {
	    var now, wait;
	    await this.yieldLoop();
	    now = Date.now();
	    if (this.conditionsCheck(weight)) {
	      this._running += weight;
	      if (this.storeOptions.reservoir != null) {
	        this.storeOptions.reservoir -= weight;
	      }
	      wait = Math.max(this._nextRequest - now, 0);
	      this._nextRequest = now + wait + this.storeOptions.minTime;
	      return {
	        success: true,
	        wait,
	        reservoir: this.storeOptions.reservoir
	      };
	    } else {
	      return {
	        success: false
	      };
	    }
	  }

	  strategyIsBlock() {
	    return this.storeOptions.strategy === 3;
	  }

	  async __submit__(queueLength, weight) {
	    var blocked, now, reachedHWM;
	    await this.yieldLoop();
	    if ((this.storeOptions.maxConcurrent != null) && weight > this.storeOptions.maxConcurrent) {
	      throw new BottleneckError$2(`Impossible to add a job having a weight of ${weight} to a limiter having a maxConcurrent setting of ${this.storeOptions.maxConcurrent}`);
	    }
	    now = Date.now();
	    reachedHWM = (this.storeOptions.highWater != null) && queueLength === this.storeOptions.highWater && !this.check(weight, now);
	    blocked = this.strategyIsBlock() && (reachedHWM || this.isBlocked(now));
	    if (blocked) {
	      this._unblockTime = now + this.computePenalty();
	      this._nextRequest = this._unblockTime + this.storeOptions.minTime;
	      this.instance._dropAllQueued();
	    }
	    return {
	      reachedHWM,
	      blocked,
	      strategy: this.storeOptions.strategy
	    };
	  }

	  async __free__(index, weight) {
	    await this.yieldLoop();
	    this._running -= weight;
	    this._done += weight;
	    this.instance._drainAll(this.computeCapacity());
	    return {
	      running: this._running
	    };
	  }

	};

	var LocalDatastore_1 = LocalDatastore;

	var BottleneckError$3, States;

	BottleneckError$3 = BottleneckError_1;

	States = class States {
	  constructor(status1) {
	    this.status = status1;
	    this._jobs = {};
	    this.counts = this.status.map(function() {
	      return 0;
	    });
	  }

	  next(id) {
	    var current, next;
	    current = this._jobs[id];
	    next = current + 1;
	    if ((current != null) && next < this.status.length) {
	      this.counts[current]--;
	      this.counts[next]++;
	      return this._jobs[id]++;
	    } else if (current != null) {
	      this.counts[current]--;
	      return delete this._jobs[id];
	    }
	  }

	  start(id) {
	    var initial;
	    initial = 0;
	    this._jobs[id] = initial;
	    return this.counts[initial]++;
	  }

	  remove(id) {
	    var current;
	    current = this._jobs[id];
	    if (current != null) {
	      this.counts[current]--;
	      delete this._jobs[id];
	    }
	    return current != null;
	  }

	  jobStatus(id) {
	    var ref;
	    return (ref = this.status[this._jobs[id]]) != null ? ref : null;
	  }

	  statusJobs(status) {
	    var k, pos, ref, results, v;
	    if (status != null) {
	      pos = this.status.indexOf(status);
	      if (pos < 0) {
	        throw new BottleneckError$3(`status must be one of ${this.status.join(', ')}`);
	      }
	      ref = this._jobs;
	      results = [];
	      for (k in ref) {
	        v = ref[k];
	        if (v === pos) {
	          results.push(k);
	        }
	      }
	      return results;
	    } else {
	      return Object.keys(this._jobs);
	    }
	  }

	  statusCounts() {
	    return this.counts.reduce(((acc, v, i) => {
	      acc[this.status[i]] = v;
	      return acc;
	    }), {});
	  }

	};

	var States_1 = States;

	var DLList$2, Sync;

	DLList$2 = DLList_1;

	Sync = class Sync {
	  constructor(name, Promise) {
	    this.schedule = this.schedule.bind(this);
	    this.name = name;
	    this.Promise = Promise;
	    this._running = 0;
	    this._queue = new DLList$2();
	  }

	  isEmpty() {
	    return this._queue.length === 0;
	  }

	  async _tryToRun() {
	    var args, cb, error, reject, resolve, returned, task;
	    if ((this._running < 1) && this._queue.length > 0) {
	      this._running++;
	      ({task, args, resolve, reject} = this._queue.shift());
	      cb = (await (async function() {
	        try {
	          returned = (await task(...args));
	          return function() {
	            return resolve(returned);
	          };
	        } catch (error1) {
	          error = error1;
	          return function() {
	            return reject(error);
	          };
	        }
	      })());
	      this._running--;
	      this._tryToRun();
	      return cb();
	    }
	  }

	  schedule(task, ...args) {
	    var promise, reject, resolve;
	    resolve = reject = null;
	    promise = new this.Promise(function(_resolve, _reject) {
	      resolve = _resolve;
	      return reject = _reject;
	    });
	    this._queue.push({task, args, resolve, reject});
	    this._tryToRun();
	    return promise;
	  }

	};

	var Sync_1 = Sync;

	var version = "2.19.5";
	var version$1 = {
		version: version
	};

	var version$2 = /*#__PURE__*/Object.freeze({
		version: version,
		default: version$1
	});

	var require$$2 = () => console.log('You must import the full version of Bottleneck in order to use this feature.');

	var require$$3 = () => console.log('You must import the full version of Bottleneck in order to use this feature.');

	var require$$4 = () => console.log('You must import the full version of Bottleneck in order to use this feature.');

	var Events$2, Group, IORedisConnection$1, RedisConnection$1, Scripts$1, parser$3;

	parser$3 = parser;

	Events$2 = Events_1;

	RedisConnection$1 = require$$2;

	IORedisConnection$1 = require$$3;

	Scripts$1 = require$$4;

	Group = (function() {
	  class Group {
	    constructor(limiterOptions = {}) {
	      this.deleteKey = this.deleteKey.bind(this);
	      this.limiterOptions = limiterOptions;
	      parser$3.load(this.limiterOptions, this.defaults, this);
	      this.Events = new Events$2(this);
	      this.instances = {};
	      this.Bottleneck = Bottleneck_1;
	      this._startAutoCleanup();
	      this.sharedConnection = this.connection != null;
	      if (this.connection == null) {
	        if (this.limiterOptions.datastore === "redis") {
	          this.connection = new RedisConnection$1(Object.assign({}, this.limiterOptions, {Events: this.Events}));
	        } else if (this.limiterOptions.datastore === "ioredis") {
	          this.connection = new IORedisConnection$1(Object.assign({}, this.limiterOptions, {Events: this.Events}));
	        }
	      }
	    }

	    key(key = "") {
	      var ref;
	      return (ref = this.instances[key]) != null ? ref : (() => {
	        var limiter;
	        limiter = this.instances[key] = new this.Bottleneck(Object.assign(this.limiterOptions, {
	          id: `${this.id}-${key}`,
	          timeout: this.timeout,
	          connection: this.connection
	        }));
	        this.Events.trigger("created", limiter, key);
	        return limiter;
	      })();
	    }

	    async deleteKey(key = "") {
	      var deleted, instance;
	      instance = this.instances[key];
	      if (this.connection) {
	        deleted = (await this.connection.__runCommand__(['del', ...Scripts$1.allKeys(`${this.id}-${key}`)]));
	      }
	      if (instance != null) {
	        delete this.instances[key];
	        await instance.disconnect();
	      }
	      return (instance != null) || deleted > 0;
	    }

	    limiters() {
	      var k, ref, results, v;
	      ref = this.instances;
	      results = [];
	      for (k in ref) {
	        v = ref[k];
	        results.push({
	          key: k,
	          limiter: v
	        });
	      }
	      return results;
	    }

	    keys() {
	      return Object.keys(this.instances);
	    }

	    async clusterKeys() {
	      var cursor, end, found, i, k, keys, len, next, start;
	      if (this.connection == null) {
	        return this.Promise.resolve(this.keys());
	      }
	      keys = [];
	      cursor = null;
	      start = `b_${this.id}-`.length;
	      end = "_settings".length;
	      while (cursor !== 0) {
	        [next, found] = (await this.connection.__runCommand__(["scan", cursor != null ? cursor : 0, "match", `b_${this.id}-*_settings`, "count", 10000]));
	        cursor = ~~next;
	        for (i = 0, len = found.length; i < len; i++) {
	          k = found[i];
	          keys.push(k.slice(start, -end));
	        }
	      }
	      return keys;
	    }

	    _startAutoCleanup() {
	      var base;
	      clearInterval(this.interval);
	      return typeof (base = (this.interval = setInterval(async() => {
	        var e, k, ref, results, time, v;
	        time = Date.now();
	        ref = this.instances;
	        results = [];
	        for (k in ref) {
	          v = ref[k];
	          try {
	            if ((await v._store.__groupCheck__(time))) {
	              results.push(this.deleteKey(k));
	            } else {
	              results.push(void 0);
	            }
	          } catch (error) {
	            e = error;
	            results.push(v.Events.trigger("error", e));
	          }
	        }
	        return results;
	      }, this.timeout / 2))).unref === "function" ? base.unref() : void 0;
	    }

	    updateSettings(options = {}) {
	      parser$3.overwrite(options, this.defaults, this);
	      parser$3.overwrite(options, options, this.limiterOptions);
	      if (options.timeout != null) {
	        return this._startAutoCleanup();
	      }
	    }

	    disconnect(flush = true) {
	      var ref;
	      if (!this.sharedConnection) {
	        return (ref = this.connection) != null ? ref.disconnect(flush) : void 0;
	      }
	    }

	  }
	  Group.prototype.defaults = {
	    timeout: 1000 * 60 * 5,
	    connection: null,
	    Promise: Promise,
	    id: "group-key"
	  };

	  return Group;

	}).call(commonjsGlobal$1);

	var Group_1 = Group;

	var Batcher, Events$3, parser$4;

	parser$4 = parser;

	Events$3 = Events_1;

	Batcher = (function() {
	  class Batcher {
	    constructor(options = {}) {
	      this.options = options;
	      parser$4.load(this.options, this.defaults, this);
	      this.Events = new Events$3(this);
	      this._arr = [];
	      this._resetPromise();
	      this._lastFlush = Date.now();
	    }

	    _resetPromise() {
	      return this._promise = new this.Promise((res, rej) => {
	        return this._resolve = res;
	      });
	    }

	    _flush() {
	      clearTimeout(this._timeout);
	      this._lastFlush = Date.now();
	      this._resolve();
	      this.Events.trigger("batch", this._arr);
	      this._arr = [];
	      return this._resetPromise();
	    }

	    add(data) {
	      var ret;
	      this._arr.push(data);
	      ret = this._promise;
	      if (this._arr.length === this.maxSize) {
	        this._flush();
	      } else if ((this.maxTime != null) && this._arr.length === 1) {
	        this._timeout = setTimeout(() => {
	          return this._flush();
	        }, this.maxTime);
	      }
	      return ret;
	    }

	  }
	  Batcher.prototype.defaults = {
	    maxTime: null,
	    maxSize: null,
	    Promise: Promise
	  };

	  return Batcher;

	}).call(commonjsGlobal$1);

	var Batcher_1 = Batcher;

	var require$$4$1 = () => console.log('You must import the full version of Bottleneck in order to use this feature.');

	var require$$8 = getCjsExportFromNamespace(version$2);

	var Bottleneck, DEFAULT_PRIORITY$1, Events$4, Job$1, LocalDatastore$1, NUM_PRIORITIES$1, Queues$1, RedisDatastore$1, States$1, Sync$1, parser$5,
	  splice = [].splice;

	NUM_PRIORITIES$1 = 10;

	DEFAULT_PRIORITY$1 = 5;

	parser$5 = parser;

	Queues$1 = Queues_1;

	Job$1 = Job_1;

	LocalDatastore$1 = LocalDatastore_1;

	RedisDatastore$1 = require$$4$1;

	Events$4 = Events_1;

	States$1 = States_1;

	Sync$1 = Sync_1;

	Bottleneck = (function() {
	  class Bottleneck {
	    constructor(options = {}, ...invalid) {
	      var storeInstanceOptions, storeOptions;
	      this._addToQueue = this._addToQueue.bind(this);
	      this._validateOptions(options, invalid);
	      parser$5.load(options, this.instanceDefaults, this);
	      this._queues = new Queues$1(NUM_PRIORITIES$1);
	      this._scheduled = {};
	      this._states = new States$1(["RECEIVED", "QUEUED", "RUNNING", "EXECUTING"].concat(this.trackDoneStatus ? ["DONE"] : []));
	      this._limiter = null;
	      this.Events = new Events$4(this);
	      this._submitLock = new Sync$1("submit", this.Promise);
	      this._registerLock = new Sync$1("register", this.Promise);
	      storeOptions = parser$5.load(options, this.storeDefaults, {});
	      this._store = (function() {
	        if (this.datastore === "redis" || this.datastore === "ioredis" || (this.connection != null)) {
	          storeInstanceOptions = parser$5.load(options, this.redisStoreDefaults, {});
	          return new RedisDatastore$1(this, storeOptions, storeInstanceOptions);
	        } else if (this.datastore === "local") {
	          storeInstanceOptions = parser$5.load(options, this.localStoreDefaults, {});
	          return new LocalDatastore$1(this, storeOptions, storeInstanceOptions);
	        } else {
	          throw new Bottleneck.prototype.BottleneckError(`Invalid datastore type: ${this.datastore}`);
	        }
	      }).call(this);
	      this._queues.on("leftzero", () => {
	        var ref;
	        return (ref = this._store.heartbeat) != null ? typeof ref.ref === "function" ? ref.ref() : void 0 : void 0;
	      });
	      this._queues.on("zero", () => {
	        var ref;
	        return (ref = this._store.heartbeat) != null ? typeof ref.unref === "function" ? ref.unref() : void 0 : void 0;
	      });
	    }

	    _validateOptions(options, invalid) {
	      if (!((options != null) && typeof options === "object" && invalid.length === 0)) {
	        throw new Bottleneck.prototype.BottleneckError("Bottleneck v2 takes a single object argument. Refer to https://github.com/SGrondin/bottleneck#upgrading-to-v2 if you're upgrading from Bottleneck v1.");
	      }
	    }

	    ready() {
	      return this._store.ready;
	    }

	    clients() {
	      return this._store.clients;
	    }

	    channel() {
	      return `b_${this.id}`;
	    }

	    channel_client() {
	      return `b_${this.id}_${this._store.clientId}`;
	    }

	    publish(message) {
	      return this._store.__publish__(message);
	    }

	    disconnect(flush = true) {
	      return this._store.__disconnect__(flush);
	    }

	    chain(_limiter) {
	      this._limiter = _limiter;
	      return this;
	    }

	    queued(priority) {
	      return this._queues.queued(priority);
	    }

	    clusterQueued() {
	      return this._store.__queued__();
	    }

	    empty() {
	      return this.queued() === 0 && this._submitLock.isEmpty();
	    }

	    running() {
	      return this._store.__running__();
	    }

	    done() {
	      return this._store.__done__();
	    }

	    jobStatus(id) {
	      return this._states.jobStatus(id);
	    }

	    jobs(status) {
	      return this._states.statusJobs(status);
	    }

	    counts() {
	      return this._states.statusCounts();
	    }

	    _randomIndex() {
	      return Math.random().toString(36).slice(2);
	    }

	    check(weight = 1) {
	      return this._store.__check__(weight);
	    }

	    _clearGlobalState(index) {
	      if (this._scheduled[index] != null) {
	        clearTimeout(this._scheduled[index].expiration);
	        delete this._scheduled[index];
	        return true;
	      } else {
	        return false;
	      }
	    }

	    async _free(index, job, options, eventInfo) {
	      var e, running;
	      try {
	        ({running} = (await this._store.__free__(index, options.weight)));
	        this.Events.trigger("debug", `Freed ${options.id}`, eventInfo);
	        if (running === 0 && this.empty()) {
	          return this.Events.trigger("idle");
	        }
	      } catch (error1) {
	        e = error1;
	        return this.Events.trigger("error", e);
	      }
	    }

	    _run(index, job, wait) {
	      var clearGlobalState, free, run;
	      job.doRun();
	      clearGlobalState = this._clearGlobalState.bind(this, index);
	      run = this._run.bind(this, index, job);
	      free = this._free.bind(this, index, job);
	      return this._scheduled[index] = {
	        timeout: setTimeout(() => {
	          return job.doExecute(this._limiter, clearGlobalState, run, free);
	        }, wait),
	        expiration: job.options.expiration != null ? setTimeout(function() {
	          return job.doExpire(clearGlobalState, run, free);
	        }, wait + job.options.expiration) : void 0,
	        job: job
	      };
	    }

	    _drainOne(capacity) {
	      return this._registerLock.schedule(() => {
	        var args, index, next, options, queue;
	        if (this.queued() === 0) {
	          return this.Promise.resolve(null);
	        }
	        queue = this._queues.getFirst();
	        ({options, args} = next = queue.first());
	        if ((capacity != null) && options.weight > capacity) {
	          return this.Promise.resolve(null);
	        }
	        this.Events.trigger("debug", `Draining ${options.id}`, {args, options});
	        index = this._randomIndex();
	        return this._store.__register__(index, options.weight, options.expiration).then(({success, wait, reservoir}) => {
	          var empty;
	          this.Events.trigger("debug", `Drained ${options.id}`, {success, args, options});
	          if (success) {
	            queue.shift();
	            empty = this.empty();
	            if (empty) {
	              this.Events.trigger("empty");
	            }
	            if (reservoir === 0) {
	              this.Events.trigger("depleted", empty);
	            }
	            this._run(index, next, wait);
	            return this.Promise.resolve(options.weight);
	          } else {
	            return this.Promise.resolve(null);
	          }
	        });
	      });
	    }

	    _drainAll(capacity, total = 0) {
	      return this._drainOne(capacity).then((drained) => {
	        var newCapacity;
	        if (drained != null) {
	          newCapacity = capacity != null ? capacity - drained : capacity;
	          return this._drainAll(newCapacity, total + drained);
	        } else {
	          return this.Promise.resolve(total);
	        }
	      }).catch((e) => {
	        return this.Events.trigger("error", e);
	      });
	    }

	    _dropAllQueued(message) {
	      return this._queues.shiftAll(function(job) {
	        return job.doDrop({message});
	      });
	    }

	    stop(options = {}) {
	      var done, waitForExecuting;
	      options = parser$5.load(options, this.stopDefaults);
	      waitForExecuting = (at) => {
	        var finished;
	        finished = () => {
	          var counts;
	          counts = this._states.counts;
	          return (counts[0] + counts[1] + counts[2] + counts[3]) === at;
	        };
	        return new this.Promise((resolve, reject) => {
	          if (finished()) {
	            return resolve();
	          } else {
	            return this.on("done", () => {
	              if (finished()) {
	                this.removeAllListeners("done");
	                return resolve();
	              }
	            });
	          }
	        });
	      };
	      done = options.dropWaitingJobs ? (this._run = function(index, next) {
	        return next.doDrop({
	          message: options.dropErrorMessage
	        });
	      }, this._drainOne = () => {
	        return this.Promise.resolve(null);
	      }, this._registerLock.schedule(() => {
	        return this._submitLock.schedule(() => {
	          var k, ref, v;
	          ref = this._scheduled;
	          for (k in ref) {
	            v = ref[k];
	            if (this.jobStatus(v.job.options.id) === "RUNNING") {
	              clearTimeout(v.timeout);
	              clearTimeout(v.expiration);
	              v.job.doDrop({
	                message: options.dropErrorMessage
	              });
	            }
	          }
	          this._dropAllQueued(options.dropErrorMessage);
	          return waitForExecuting(0);
	        });
	      })) : this.schedule({
	        priority: NUM_PRIORITIES$1 - 1,
	        weight: 0
	      }, () => {
	        return waitForExecuting(1);
	      });
	      this._receive = function(job) {
	        return job._reject(new Bottleneck.prototype.BottleneckError(options.enqueueErrorMessage));
	      };
	      this.stop = () => {
	        return this.Promise.reject(new Bottleneck.prototype.BottleneckError("stop() has already been called"));
	      };
	      return done;
	    }

	    async _addToQueue(job) {
	      var args, blocked, error, options, reachedHWM, shifted, strategy;
	      ({args, options} = job);
	      try {
	        ({reachedHWM, blocked, strategy} = (await this._store.__submit__(this.queued(), options.weight)));
	      } catch (error1) {
	        error = error1;
	        this.Events.trigger("debug", `Could not queue ${options.id}`, {args, options, error});
	        job.doDrop({error});
	        return false;
	      }
	      if (blocked) {
	        job.doDrop();
	        return true;
	      } else if (reachedHWM) {
	        shifted = strategy === Bottleneck.prototype.strategy.LEAK ? this._queues.shiftLastFrom(options.priority) : strategy === Bottleneck.prototype.strategy.OVERFLOW_PRIORITY ? this._queues.shiftLastFrom(options.priority + 1) : strategy === Bottleneck.prototype.strategy.OVERFLOW ? job : void 0;
	        if (shifted != null) {
	          shifted.doDrop();
	        }
	        if ((shifted == null) || strategy === Bottleneck.prototype.strategy.OVERFLOW) {
	          if (shifted == null) {
	            job.doDrop();
	          }
	          return reachedHWM;
	        }
	      }
	      job.doQueue(reachedHWM, blocked);
	      this._queues.push(job);
	      await this._drainAll();
	      return reachedHWM;
	    }

	    _receive(job) {
	      if (this._states.jobStatus(job.options.id) != null) {
	        job._reject(new Bottleneck.prototype.BottleneckError(`A job with the same id already exists (id=${job.options.id})`));
	        return false;
	      } else {
	        job.doReceive();
	        return this._submitLock.schedule(this._addToQueue, job);
	      }
	    }

	    submit(...args) {
	      var cb, fn, job, options, ref, ref1, task;
	      if (typeof args[0] === "function") {
	        ref = args, [fn, ...args] = ref, [cb] = splice.call(args, -1);
	        options = parser$5.load({}, this.jobDefaults);
	      } else {
	        ref1 = args, [options, fn, ...args] = ref1, [cb] = splice.call(args, -1);
	        options = parser$5.load(options, this.jobDefaults);
	      }
	      task = (...args) => {
	        return new this.Promise(function(resolve, reject) {
	          return fn(...args, function(...args) {
	            return (args[0] != null ? reject : resolve)(args);
	          });
	        });
	      };
	      job = new Job$1(task, args, options, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise);
	      job.promise.then(function(args) {
	        return typeof cb === "function" ? cb(...args) : void 0;
	      }).catch(function(args) {
	        if (Array.isArray(args)) {
	          return typeof cb === "function" ? cb(...args) : void 0;
	        } else {
	          return typeof cb === "function" ? cb(args) : void 0;
	        }
	      });
	      return this._receive(job);
	    }

	    schedule(...args) {
	      var job, options, task;
	      if (typeof args[0] === "function") {
	        [task, ...args] = args;
	        options = {};
	      } else {
	        [options, task, ...args] = args;
	      }
	      job = new Job$1(task, args, options, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise);
	      this._receive(job);
	      return job.promise;
	    }

	    wrap(fn) {
	      var schedule, wrapped;
	      schedule = this.schedule.bind(this);
	      wrapped = function(...args) {
	        return schedule(fn.bind(this), ...args);
	      };
	      wrapped.withOptions = function(options, ...args) {
	        return schedule(options, fn, ...args);
	      };
	      return wrapped;
	    }

	    async updateSettings(options = {}) {
	      await this._store.__updateSettings__(parser$5.overwrite(options, this.storeDefaults));
	      parser$5.overwrite(options, this.instanceDefaults, this);
	      return this;
	    }

	    currentReservoir() {
	      return this._store.__currentReservoir__();
	    }

	    incrementReservoir(incr = 0) {
	      return this._store.__incrementReservoir__(incr);
	    }

	  }
	  Bottleneck.default = Bottleneck;

	  Bottleneck.Events = Events$4;

	  Bottleneck.version = Bottleneck.prototype.version = require$$8.version;

	  Bottleneck.strategy = Bottleneck.prototype.strategy = {
	    LEAK: 1,
	    OVERFLOW: 2,
	    OVERFLOW_PRIORITY: 4,
	    BLOCK: 3
	  };

	  Bottleneck.BottleneckError = Bottleneck.prototype.BottleneckError = BottleneckError_1;

	  Bottleneck.Group = Bottleneck.prototype.Group = Group_1;

	  Bottleneck.RedisConnection = Bottleneck.prototype.RedisConnection = require$$2;

	  Bottleneck.IORedisConnection = Bottleneck.prototype.IORedisConnection = require$$3;

	  Bottleneck.Batcher = Bottleneck.prototype.Batcher = Batcher_1;

	  Bottleneck.prototype.jobDefaults = {
	    priority: DEFAULT_PRIORITY$1,
	    weight: 1,
	    expiration: null,
	    id: "<no-id>"
	  };

	  Bottleneck.prototype.storeDefaults = {
	    maxConcurrent: null,
	    minTime: 0,
	    highWater: null,
	    strategy: Bottleneck.prototype.strategy.LEAK,
	    penalty: null,
	    reservoir: null,
	    reservoirRefreshInterval: null,
	    reservoirRefreshAmount: null,
	    reservoirIncreaseInterval: null,
	    reservoirIncreaseAmount: null,
	    reservoirIncreaseMaximum: null
	  };

	  Bottleneck.prototype.localStoreDefaults = {
	    Promise: Promise,
	    timeout: null,
	    heartbeatInterval: 250
	  };

	  Bottleneck.prototype.redisStoreDefaults = {
	    Promise: Promise,
	    timeout: null,
	    heartbeatInterval: 5000,
	    clientTimeout: 10000,
	    Redis: null,
	    clientOptions: {},
	    clusterNodes: null,
	    clearDatastore: false,
	    connection: null
	  };

	  Bottleneck.prototype.instanceDefaults = {
	    datastore: "local",
	    connection: null,
	    id: "<no-id>",
	    rejectOnDrop: true,
	    trackDoneStatus: false,
	    Promise: Promise
	  };

	  Bottleneck.prototype.stopDefaults = {
	    enqueueErrorMessage: "This limiter has been stopped and cannot accept new jobs.",
	    dropWaitingJobs: true,
	    dropErrorMessage: "This limiter has been stopped."
	  };

	  return Bottleneck;

	}).call(commonjsGlobal$1);

	var Bottleneck_1 = Bottleneck;

	var lib = Bottleneck_1;

	return lib;

})));
});

const VERSION = "3.4.1";

const noop = () => Promise.resolve();
// @ts-ignore
function wrapRequest(state, request, options) {
    return state.retryLimiter.schedule(doRequest, state, request, options);
}
// @ts-ignore
async function doRequest(state, request, options) {
    const isWrite = options.method !== "GET" && options.method !== "HEAD";
    const isSearch = options.method === "GET" && options.url.startsWith("/search/");
    const isGraphQL = options.url.startsWith("/graphql");
    const retryCount = ~~options.request.retryCount;
    const jobOptions = retryCount > 0 ? { priority: 0, weight: 0 } : {};
    if (state.clustering) {
        // Remove a job from Redis if it has not completed or failed within 60s
        // Examples: Node process terminated, client disconnected, etc.
        // @ts-ignore
        jobOptions.expiration = 1000 * 60;
    }
    // Guarantee at least 1000ms between writes
    // GraphQL can also trigger writes
    if (isWrite || isGraphQL) {
        await state.write.key(state.id).schedule(jobOptions, noop);
    }
    // Guarantee at least 3000ms between requests that trigger notifications
    if (isWrite && state.triggersNotification(options.url)) {
        await state.notifications.key(state.id).schedule(jobOptions, noop);
    }
    // Guarantee at least 2000ms between search requests
    if (isSearch) {
        await state.search.key(state.id).schedule(jobOptions, noop);
    }
    const req = state.global.key(state.id).schedule(jobOptions, request, options);
    if (isGraphQL) {
        const res = await req;
        if (res.data.errors != null &&
            // @ts-ignore
            res.data.errors.some((error) => error.type === "RATE_LIMITED")) {
            const error = Object.assign(new Error("GraphQL Rate Limit Exceeded"), {
                headers: res.headers,
                data: res.data,
            });
            throw error;
        }
    }
    return req;
}

var triggersNotificationPaths = [
    "/orgs/{org}/invitations",
    "/orgs/{org}/invitations/{invitation_id}",
    "/orgs/{org}/teams/{team_slug}/discussions",
    "/orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
    "/repos/{owner}/{repo}/collaborators/{username}",
    "/repos/{owner}/{repo}/commits/{commit_sha}/comments",
    "/repos/{owner}/{repo}/issues",
    "/repos/{owner}/{repo}/issues/{issue_number}/comments",
    "/repos/{owner}/{repo}/pulls",
    "/repos/{owner}/{repo}/pulls/{pull_number}/comments",
    "/repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies",
    "/repos/{owner}/{repo}/pulls/{pull_number}/merge",
    "/repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
    "/repos/{owner}/{repo}/pulls/{pull_number}/reviews",
    "/repos/{owner}/{repo}/releases",
    "/teams/{team_id}/discussions",
    "/teams/{team_id}/discussions/{discussion_number}/comments",
];

// @ts-ignore
function routeMatcher(paths) {
    // EXAMPLE. For the following paths:
    /* [
        "/orgs/{org}/invitations",
        "/repos/{owner}/{repo}/collaborators/{username}"
    ] */
    // @ts-ignore
    const regexes = paths.map((path) => path
        .split("/")
        // @ts-ignore
        .map((c) => (c.startsWith("{") ? "(?:.+?)" : c))
        .join("/"));
    // 'regexes' would contain:
    /* [
        '/orgs/(?:.+?)/invitations',
        '/repos/(?:.+?)/(?:.+?)/collaborators/(?:.+?)'
    ] */
    // @ts-ignore
    const regex = `^(?:${regexes.map((r) => `(?:${r})`).join("|")})[^/]*$`;
    // 'regex' would contain:
    /*
      ^(?:(?:\/orgs\/(?:.+?)\/invitations)|(?:\/repos\/(?:.+?)\/(?:.+?)\/collaborators\/(?:.+?)))[^\/]*$
  
      It may look scary, but paste it into https://www.debuggex.com/
      and it will make a lot more sense!
    */
    return new RegExp(regex, "i");
}

// @ts-ignore
// Workaround to allow tests to directly access the triggersNotification function.
const regex = routeMatcher(triggersNotificationPaths);
const triggersNotification = regex.test.bind(regex);
const groups = {};
// @ts-ignore
const createGroups = function (Bottleneck, common) {
    // @ts-ignore
    groups.global = new Bottleneck.Group({
        id: "octokit-global",
        maxConcurrent: 10,
        ...common,
    });
    // @ts-ignore
    groups.search = new Bottleneck.Group({
        id: "octokit-search",
        maxConcurrent: 1,
        minTime: 2000,
        ...common,
    });
    // @ts-ignore
    groups.write = new Bottleneck.Group({
        id: "octokit-write",
        maxConcurrent: 1,
        minTime: 1000,
        ...common,
    });
    // @ts-ignore
    groups.notifications = new Bottleneck.Group({
        id: "octokit-notifications",
        maxConcurrent: 1,
        minTime: 3000,
        ...common,
    });
};
function throttling(octokit, octokitOptions = {}) {
    const { enabled = true, Bottleneck = light, id = "no-id", timeout = 1000 * 60 * 2, // Redis TTL: 2 minutes
    connection, } = octokitOptions.throttle || {};
    if (!enabled) {
        return;
    }
    const common = { connection, timeout };
    // @ts-ignore
    if (groups.global == null) {
        createGroups(Bottleneck, common);
    }
    const state = Object.assign({
        clustering: connection != null,
        triggersNotification,
        minimumAbuseRetryAfter: 5,
        retryAfterBaseValue: 1000,
        retryLimiter: new Bottleneck(),
        id,
        ...groups,
    }, 
    // @ts-ignore
    octokitOptions.throttle);
    if (typeof state.onAbuseLimit !== "function" ||
        typeof state.onRateLimit !== "function") {
        throw new Error(`octokit/plugin-throttling error:
        You must pass the onAbuseLimit and onRateLimit error handlers.
        See https://github.com/octokit/rest.js#throttling

        const octokit = new Octokit({
          throttle: {
            onAbuseLimit: (retryAfter, options) => {/* ... */},
            onRateLimit: (retryAfter, options) => {/* ... */}
          }
        })
    `);
    }
    const events = {};
    const emitter = new Bottleneck.Events(events);
    // @ts-ignore
    events.on("abuse-limit", state.onAbuseLimit);
    // @ts-ignore
    events.on("rate-limit", state.onRateLimit);
    // @ts-ignore
    events.on("error", (e) => console.warn("Error in throttling-plugin limit handler", e));
    // @ts-ignore
    state.retryLimiter.on("failed", async function (error, info) {
        const options = info.args[info.args.length - 1];
        const shouldRetryGraphQL = options.url.startsWith("/graphql") && error.status !== 401;
        if (!(shouldRetryGraphQL || error.status === 403)) {
            return;
        }
        const retryCount = ~~options.request.retryCount;
        options.request.retryCount = retryCount;
        const { wantRetry, retryAfter } = await (async function () {
            if (/\babuse\b/i.test(error.message)) {
                // The user has hit the abuse rate limit. (REST and GraphQL)
                // https://docs.github.com/en/rest/overview/resources-in-the-rest-api#abuse-rate-limits
                // The Retry-After header can sometimes be blank when hitting an abuse limit,
                // but is always present after 2-3s, so make sure to set `retryAfter` to at least 5s by default.
                const retryAfter = Math.max(~~error.headers["retry-after"], state.minimumAbuseRetryAfter);
                const wantRetry = await emitter.trigger("abuse-limit", retryAfter, options, octokit);
                return { wantRetry, retryAfter };
            }
            if (error.headers != null &&
                error.headers["x-ratelimit-remaining"] === "0") {
                // The user has used all their allowed calls for the current time period (REST and GraphQL)
                // https://docs.github.com/en/rest/reference/rate-limit (REST)
                // https://docs.github.com/en/graphql/overview/resource-limitations#rate-limit (GraphQL)
                const rateLimitReset = new Date(~~error.headers["x-ratelimit-reset"] * 1000).getTime();
                const retryAfter = Math.max(Math.ceil((rateLimitReset - Date.now()) / 1000), 0);
                const wantRetry = await emitter.trigger("rate-limit", retryAfter, options, octokit);
                return { wantRetry, retryAfter };
            }
            return {};
        })();
        if (wantRetry) {
            options.request.retryCount++;
            // @ts-ignore
            return retryAfter * state.retryAfterBaseValue;
        }
    });
    octokit.hook.wrap("request", wrapRequest.bind(null, state));
}
throttling.VERSION = VERSION;
throttling.triggersNotification = triggersNotification;

var utils = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  {
    factory(exports);
  }
})(commonjsGlobal, function (exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  exports.isDate = function isDate(d) {
    return d instanceof Date;
  };
  exports.isEmpty = function isEmpty(o) {
    return Object.keys(o).length === 0;
  };
  var isObject = exports.isObject = function isObject(o) {
    return o != null && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object';
  };
  exports.properObject = function properObject(o) {
    return isObject(o) && !o.hasOwnProperty ? _extends({}, o) : o;
  };
});
});

var diff$1 = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  {
    factory(module, exports, utils);
  }
})(commonjsGlobal, function (module, exports, _utils) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var diff = function diff(lhs, rhs) {
    if (lhs === rhs) return {}; // equal return no diff

    if (!(0, _utils.isObject)(lhs) || !(0, _utils.isObject)(rhs)) return rhs; // return updated rhs

    var l = (0, _utils.properObject)(lhs);
    var r = (0, _utils.properObject)(rhs);

    var deletedValues = Object.keys(l).reduce(function (acc, key) {
      return r.hasOwnProperty(key) ? acc : _extends({}, acc, _defineProperty({}, key, undefined));
    }, {});

    if ((0, _utils.isDate)(l) || (0, _utils.isDate)(r)) {
      if (l.valueOf() == r.valueOf()) return {};
      return r;
    }

    return Object.keys(r).reduce(function (acc, key) {
      if (!l.hasOwnProperty(key)) return _extends({}, acc, _defineProperty({}, key, r[key])); // return added r key

      var difference = diff(l[key], r[key]);

      if ((0, _utils.isObject)(difference) && (0, _utils.isEmpty)(difference) && !(0, _utils.isDate)(difference)) return acc; // return no diff

      return _extends({}, acc, _defineProperty({}, key, difference)); // return updated key
    }, deletedValues);
  };

  exports.default = diff;
  module.exports = exports['default'];
});
});

var added = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  {
    factory(module, exports, utils);
  }
})(commonjsGlobal, function (module, exports, _utils) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var addedDiff = function addedDiff(lhs, rhs) {

    if (lhs === rhs || !(0, _utils.isObject)(lhs) || !(0, _utils.isObject)(rhs)) return {};

    var l = (0, _utils.properObject)(lhs);
    var r = (0, _utils.properObject)(rhs);

    return Object.keys(r).reduce(function (acc, key) {
      if (l.hasOwnProperty(key)) {
        var difference = addedDiff(l[key], r[key]);

        if ((0, _utils.isObject)(difference) && (0, _utils.isEmpty)(difference)) return acc;

        return _extends({}, acc, _defineProperty({}, key, difference));
      }

      return _extends({}, acc, _defineProperty({}, key, r[key]));
    }, {});
  };

  exports.default = addedDiff;
  module.exports = exports['default'];
});
});

var deleted = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  {
    factory(module, exports, utils);
  }
})(commonjsGlobal, function (module, exports, _utils) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var deletedDiff = function deletedDiff(lhs, rhs) {
    if (lhs === rhs || !(0, _utils.isObject)(lhs) || !(0, _utils.isObject)(rhs)) return {};

    var l = (0, _utils.properObject)(lhs);
    var r = (0, _utils.properObject)(rhs);

    return Object.keys(l).reduce(function (acc, key) {
      if (r.hasOwnProperty(key)) {
        var difference = deletedDiff(l[key], r[key]);

        if ((0, _utils.isObject)(difference) && (0, _utils.isEmpty)(difference)) return acc;

        return _extends({}, acc, _defineProperty({}, key, difference));
      }

      return _extends({}, acc, _defineProperty({}, key, undefined));
    }, {});
  };

  exports.default = deletedDiff;
  module.exports = exports['default'];
});
});

var updated = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  {
    factory(module, exports, utils);
  }
})(commonjsGlobal, function (module, exports, _utils) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var updatedDiff = function updatedDiff(lhs, rhs) {

    if (lhs === rhs) return {};

    if (!(0, _utils.isObject)(lhs) || !(0, _utils.isObject)(rhs)) return rhs;

    var l = (0, _utils.properObject)(lhs);
    var r = (0, _utils.properObject)(rhs);

    if ((0, _utils.isDate)(l) || (0, _utils.isDate)(r)) {
      if (l.valueOf() == r.valueOf()) return {};
      return r;
    }

    return Object.keys(r).reduce(function (acc, key) {

      if (l.hasOwnProperty(key)) {
        var difference = updatedDiff(l[key], r[key]);

        if ((0, _utils.isObject)(difference) && (0, _utils.isEmpty)(difference) && !(0, _utils.isDate)(difference)) return acc;

        return _extends({}, acc, _defineProperty({}, key, difference));
      }

      return acc;
    }, {});
  };

  exports.default = updatedDiff;
  module.exports = exports['default'];
});
});

var detailed = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  {
    factory(module, exports, added, deleted, updated);
  }
})(commonjsGlobal, function (module, exports, _added, _deleted, _updated) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _added2 = _interopRequireDefault(_added);

  var _deleted2 = _interopRequireDefault(_deleted);

  var _updated2 = _interopRequireDefault(_updated);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var detailedDiff = function detailedDiff(lhs, rhs) {
    return {
      added: (0, _added2.default)(lhs, rhs),
      deleted: (0, _deleted2.default)(lhs, rhs),
      updated: (0, _updated2.default)(lhs, rhs)
    };
  };

  exports.default = detailedDiff;
  module.exports = exports['default'];
});
});

var dist = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  {
    factory(exports, diff$1, added, deleted, updated, detailed);
  }
})(commonjsGlobal, function (exports, _diff, _added, _deleted, _updated, _detailed) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.detailedDiff = exports.updatedDiff = exports.deletedDiff = exports.diff = exports.addedDiff = undefined;

  var _diff2 = _interopRequireDefault(_diff);

  var _added2 = _interopRequireDefault(_added);

  var _deleted2 = _interopRequireDefault(_deleted);

  var _updated2 = _interopRequireDefault(_updated);

  var _detailed2 = _interopRequireDefault(_detailed);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.addedDiff = _added2.default;
  exports.diff = _diff2.default;
  exports.deletedDiff = _deleted2.default;
  exports.updatedDiff = _updated2.default;
  exports.detailedDiff = _detailed2.default;
});
});

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0';

const MAX_LENGTH$2 = 256;
const MAX_SAFE_INTEGER$1 = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991;

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16;

var constants = {
  SEMVER_SPEC_VERSION,
  MAX_LENGTH: MAX_LENGTH$2,
  MAX_SAFE_INTEGER: MAX_SAFE_INTEGER$1,
  MAX_SAFE_COMPONENT_LENGTH
};

const debug = (
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
) ? (...args) => console.error('SEMVER', ...args)
  : () => {};

var debug_1 = debug;

var re_1 = createCommonjsModule(function (module, exports) {
const { MAX_SAFE_COMPONENT_LENGTH } = constants;

exports = module.exports = {};

// The actual regexps go on exports.re
const re = exports.re = [];
const src = exports.src = [];
const t = exports.t = {};
let R = 0;

const createToken = (name, value, isGlobal) => {
  const index = R++;
  debug_1(index, value);
  t[name] = index;
  src[index] = value;
  re[index] = new RegExp(value, isGlobal ? 'g' : undefined);
};

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*');
createToken('NUMERICIDENTIFIERLOOSE', '[0-9]+');

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

createToken('NONNUMERICIDENTIFIER', '\\d*[a-zA-Z-][a-zA-Z0-9-]*');

// ## Main Version
// Three dot-separated numeric identifiers.

createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})`);

createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`);

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
}|${src[t.NONNUMERICIDENTIFIER]})`);

createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
}|${src[t.NONNUMERICIDENTIFIER]})`);

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);

createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

createToken('BUILDIDENTIFIER', '[0-9A-Za-z-]+');

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
}${src[t.PRERELEASE]}?${
  src[t.BUILD]}?`);

createToken('FULL', `^${src[t.FULLPLAIN]}$`);

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
}${src[t.PRERELEASELOOSE]}?${
  src[t.BUILD]}?`);

createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`);

createToken('GTLT', '((?:<|>)?=?)');

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);

createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:${src[t.PRERELEASE]})?${
                     src[t.BUILD]}?` +
                   `)?)?`);

createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:${src[t.PRERELEASELOOSE]})?${
                          src[t.BUILD]}?` +
                        `)?)?`);

createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCE', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:$|[^\\d])`);
createToken('COERCERTL', src[t.COERCE], true);

// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)');

createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true);
exports.tildeTrimReplace = '$1~';

createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);

// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)');

createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true);
exports.caretTrimReplace = '$1^';

createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);

// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
exports.comparatorTrimReplace = '$1$2$3';

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
                   `\\s+-\\s+` +
                   `(${src[t.XRANGEPLAIN]})` +
                   `\\s*$`);

createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s+-\\s+` +
                        `(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s*$`);

// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*');
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\.0\.0\\s*$');
createToken('GTE0PRE', '^\\s*>=\\s*0\.0\.0-0\\s*$');
});

// parse out just the options we care about so we always get a consistent
// obj with keys in a consistent order.
const opts = ['includePrerelease', 'loose', 'rtl'];
const parseOptions = options =>
  !options ? {}
  : typeof options !== 'object' ? { loose: true }
  : opts.filter(k => options[k]).reduce((options, k) => {
    options[k] = true;
    return options
  }, {});
var parseOptions_1 = parseOptions;

const numeric = /^[0-9]+$/;
const compareIdentifiers$1 = (a, b) => {
  const anum = numeric.test(a);
  const bnum = numeric.test(b);

  if (anum && bnum) {
    a = +a;
    b = +b;
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
};

const rcompareIdentifiers = (a, b) => compareIdentifiers$1(b, a);

var identifiers = {
  compareIdentifiers: compareIdentifiers$1,
  rcompareIdentifiers
};

const { MAX_LENGTH: MAX_LENGTH$1, MAX_SAFE_INTEGER } = constants;
const { re: re$4, t: t$4 } = re_1;


const { compareIdentifiers } = identifiers;
class SemVer {
  constructor (version, options) {
    options = parseOptions_1(options);

    if (version instanceof SemVer) {
      if (version.loose === !!options.loose &&
          version.includePrerelease === !!options.includePrerelease) {
        return version
      } else {
        version = version.version;
      }
    } else if (typeof version !== 'string') {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    if (version.length > MAX_LENGTH$1) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH$1} characters`
      )
    }

    debug_1('SemVer', version, options);
    this.options = options;
    this.loose = !!options.loose;
    // this isn't actually relevant for versions, but keep it so that we
    // don't run into trouble passing this.options around.
    this.includePrerelease = !!options.includePrerelease;

    const m = version.trim().match(options.loose ? re$4[t$4.LOOSE] : re$4[t$4.FULL]);

    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    this.raw = version;

    // these are actually numbers
    this.major = +m[1];
    this.minor = +m[2];
    this.patch = +m[3];

    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError('Invalid major version')
    }

    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError('Invalid minor version')
    }

    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError('Invalid patch version')
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = [];
    } else {
      this.prerelease = m[4].split('.').map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id;
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num
          }
        }
        return id
      });
    }

    this.build = m[5] ? m[5].split('.') : [];
    this.format();
  }

  format () {
    this.version = `${this.major}.${this.minor}.${this.patch}`;
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join('.')}`;
    }
    return this.version
  }

  toString () {
    return this.version
  }

  compare (other) {
    debug_1('SemVer.compare', this.version, this.options, other);
    if (!(other instanceof SemVer)) {
      if (typeof other === 'string' && other === this.version) {
        return 0
      }
      other = new SemVer(other, this.options);
    }

    if (other.version === this.version) {
      return 0
    }

    return this.compareMain(other) || this.comparePre(other)
  }

  compareMain (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }

    return (
      compareIdentifiers(this.major, other.major) ||
      compareIdentifiers(this.minor, other.minor) ||
      compareIdentifiers(this.patch, other.patch)
    )
  }

  comparePre (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }

    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }

    let i = 0;
    do {
      const a = this.prerelease[i];
      const b = other.prerelease[i];
      debug_1('prerelease compare', i, a, b);
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  compareBuild (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }

    let i = 0;
    do {
      const a = this.build[i];
      const b = other.build[i];
      debug_1('prerelease compare', i, a, b);
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc (release, identifier) {
    switch (release) {
      case 'premajor':
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor = 0;
        this.major++;
        this.inc('pre', identifier);
        break
      case 'preminor':
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor++;
        this.inc('pre', identifier);
        break
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0;
        this.inc('patch', identifier);
        this.inc('pre', identifier);
        break
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier);
        }
        this.inc('pre', identifier);
        break

      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (
          this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0
        ) {
          this.major++;
        }
        this.minor = 0;
        this.patch = 0;
        this.prerelease = [];
        break
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++;
        }
        this.patch = 0;
        this.prerelease = [];
        break
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++;
        }
        this.prerelease = [];
        break
      // This probably shouldn't be used publicly.
      // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
      case 'pre':
        if (this.prerelease.length === 0) {
          this.prerelease = [0];
        } else {
          let i = this.prerelease.length;
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++;
              i = -2;
            }
          }
          if (i === -1) {
            // didn't increment anything
            this.prerelease.push(0);
          }
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          if (this.prerelease[0] === identifier) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = [identifier, 0];
            }
          } else {
            this.prerelease = [identifier, 0];
          }
        }
        break

      default:
        throw new Error(`invalid increment argument: ${release}`)
    }
    this.format();
    this.raw = this.version;
    return this
  }
}

var semver$1 = SemVer;

const {MAX_LENGTH} = constants;
const { re: re$3, t: t$3 } = re_1;



const parse = (version, options) => {
  options = parseOptions_1(options);

  if (version instanceof semver$1) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  const r = options.loose ? re$3[t$3.LOOSE] : re$3[t$3.FULL];
  if (!r.test(version)) {
    return null
  }

  try {
    return new semver$1(version, options)
  } catch (er) {
    return null
  }
};

var parse_1 = parse;

const valid$1 = (version, options) => {
  const v = parse_1(version, options);
  return v ? v.version : null
};
var valid_1 = valid$1;

const clean = (version, options) => {
  const s = parse_1(version.trim().replace(/^[=v]+/, ''), options);
  return s ? s.version : null
};
var clean_1 = clean;

const inc = (version, release, options, identifier) => {
  if (typeof (options) === 'string') {
    identifier = options;
    options = undefined;
  }

  try {
    return new semver$1(version, options).inc(release, identifier).version
  } catch (er) {
    return null
  }
};
var inc_1 = inc;

const compare = (a, b, loose) =>
  new semver$1(a, loose).compare(new semver$1(b, loose));

var compare_1 = compare;

const eq = (a, b, loose) => compare_1(a, b, loose) === 0;
var eq_1 = eq;

const diff = (version1, version2) => {
  if (eq_1(version1, version2)) {
    return null
  } else {
    const v1 = parse_1(version1);
    const v2 = parse_1(version2);
    const hasPre = v1.prerelease.length || v2.prerelease.length;
    const prefix = hasPre ? 'pre' : '';
    const defaultResult = hasPre ? 'prerelease' : '';
    for (const key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
};
var diff_1 = diff;

const major = (a, loose) => new semver$1(a, loose).major;
var major_1 = major;

const minor = (a, loose) => new semver$1(a, loose).minor;
var minor_1 = minor;

const patch = (a, loose) => new semver$1(a, loose).patch;
var patch_1 = patch;

const prerelease = (version, options) => {
  const parsed = parse_1(version, options);
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
};
var prerelease_1 = prerelease;

const rcompare = (a, b, loose) => compare_1(b, a, loose);
var rcompare_1 = rcompare;

const compareLoose = (a, b) => compare_1(a, b, true);
var compareLoose_1 = compareLoose;

const compareBuild = (a, b, loose) => {
  const versionA = new semver$1(a, loose);
  const versionB = new semver$1(b, loose);
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
};
var compareBuild_1 = compareBuild;

const sort = (list, loose) => list.sort((a, b) => compareBuild_1(a, b, loose));
var sort_1 = sort;

const rsort = (list, loose) => list.sort((a, b) => compareBuild_1(b, a, loose));
var rsort_1 = rsort;

const gt = (a, b, loose) => compare_1(a, b, loose) > 0;
var gt_1 = gt;

const lt = (a, b, loose) => compare_1(a, b, loose) < 0;
var lt_1 = lt;

const neq = (a, b, loose) => compare_1(a, b, loose) !== 0;
var neq_1 = neq;

const gte = (a, b, loose) => compare_1(a, b, loose) >= 0;
var gte_1 = gte;

const lte = (a, b, loose) => compare_1(a, b, loose) <= 0;
var lte_1 = lte;

const cmp = (a, op, b, loose) => {
  switch (op) {
    case '===':
      if (typeof a === 'object')
        a = a.version;
      if (typeof b === 'object')
        b = b.version;
      return a === b

    case '!==':
      if (typeof a === 'object')
        a = a.version;
      if (typeof b === 'object')
        b = b.version;
      return a !== b

    case '':
    case '=':
    case '==':
      return eq_1(a, b, loose)

    case '!=':
      return neq_1(a, b, loose)

    case '>':
      return gt_1(a, b, loose)

    case '>=':
      return gte_1(a, b, loose)

    case '<':
      return lt_1(a, b, loose)

    case '<=':
      return lte_1(a, b, loose)

    default:
      throw new TypeError(`Invalid operator: ${op}`)
  }
};
var cmp_1 = cmp;

const {re: re$2, t: t$2} = re_1;

const coerce = (version, options) => {
  if (version instanceof semver$1) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version);
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {};

  let match = null;
  if (!options.rtl) {
    match = version.match(re$2[t$2.COERCE]);
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    let next;
    while ((next = re$2[t$2.COERCERTL].exec(version)) &&
        (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
            next.index + next[0].length !== match.index + match[0].length) {
        match = next;
      }
      re$2[t$2.COERCERTL].lastIndex = next.index + next[1].length + next[2].length;
    }
    // leave it in a clean state
    re$2[t$2.COERCERTL].lastIndex = -1;
  }

  if (match === null)
    return null

  return parse_1(`${match[2]}.${match[3] || '0'}.${match[4] || '0'}`, options)
};
var coerce_1 = coerce;

var iterator = function (Yallist) {
  Yallist.prototype[Symbol.iterator] = function* () {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value;
    }
  };
};

var yallist = Yallist;

Yallist.Node = Node;
Yallist.create = Yallist;

function Yallist (list) {
  var self = this;
  if (!(self instanceof Yallist)) {
    self = new Yallist();
  }

  self.tail = null;
  self.head = null;
  self.length = 0;

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item);
    });
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i]);
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next;
  var prev = node.prev;

  if (next) {
    next.prev = prev;
  }

  if (prev) {
    prev.next = next;
  }

  if (node === this.head) {
    this.head = next;
  }
  if (node === this.tail) {
    this.tail = prev;
  }

  node.list.length--;
  node.next = null;
  node.prev = null;
  node.list = null;

  return next
};

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node);
  }

  var head = this.head;
  node.list = this;
  node.next = head;
  if (head) {
    head.prev = node;
  }

  this.head = node;
  if (!this.tail) {
    this.tail = node;
  }
  this.length++;
};

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node);
  }

  var tail = this.tail;
  node.list = this;
  node.prev = tail;
  if (tail) {
    tail.next = node;
  }

  this.tail = node;
  if (!this.head) {
    this.head = node;
  }
  this.length++;
};

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i]);
  }
  return this.length
};

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i]);
  }
  return this.length
};

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value;
  this.tail = this.tail.prev;
  if (this.tail) {
    this.tail.next = null;
  } else {
    this.head = null;
  }
  this.length--;
  return res
};

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value;
  this.head = this.head.next;
  if (this.head) {
    this.head.prev = null;
  } else {
    this.tail = null;
  }
  this.length--;
  return res
};

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this;
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this);
    walker = walker.next;
  }
};

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this;
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this);
    walker = walker.prev;
  }
};

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next;
  }
  if (i === n && walker !== null) {
    return walker.value
  }
};

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev;
  }
  if (i === n && walker !== null) {
    return walker.value
  }
};

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this;
  var res = new Yallist();
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this));
    walker = walker.next;
  }
  return res
};

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this;
  var res = new Yallist();
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this));
    walker = walker.prev;
  }
  return res
};

Yallist.prototype.reduce = function (fn, initial) {
  var acc;
  var walker = this.head;
  if (arguments.length > 1) {
    acc = initial;
  } else if (this.head) {
    walker = this.head.next;
    acc = this.head.value;
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i);
    walker = walker.next;
  }

  return acc
};

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc;
  var walker = this.tail;
  if (arguments.length > 1) {
    acc = initial;
  } else if (this.tail) {
    walker = this.tail.prev;
    acc = this.tail.value;
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i);
    walker = walker.prev;
  }

  return acc
};

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length);
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value;
    walker = walker.next;
  }
  return arr
};

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length);
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value;
    walker = walker.prev;
  }
  return arr
};

Yallist.prototype.slice = function (from, to) {
  to = to || this.length;
  if (to < 0) {
    to += this.length;
  }
  from = from || 0;
  if (from < 0) {
    from += this.length;
  }
  var ret = new Yallist();
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0;
  }
  if (to > this.length) {
    to = this.length;
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next;
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value);
  }
  return ret
};

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length;
  if (to < 0) {
    to += this.length;
  }
  from = from || 0;
  if (from < 0) {
    from += this.length;
  }
  var ret = new Yallist();
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0;
  }
  if (to > this.length) {
    to = this.length;
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev;
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value);
  }
  return ret
};

Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  if (start > this.length) {
    start = this.length - 1;
  }
  if (start < 0) {
    start = this.length + start;
  }

  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
    walker = walker.next;
  }

  var ret = [];
  for (var i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value);
    walker = this.removeNode(walker);
  }
  if (walker === null) {
    walker = this.tail;
  }

  if (walker !== this.head && walker !== this.tail) {
    walker = walker.prev;
  }

  for (var i = 0; i < nodes.length; i++) {
    walker = insert(this, walker, nodes[i]);
  }
  return ret;
};

Yallist.prototype.reverse = function () {
  var head = this.head;
  var tail = this.tail;
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev;
    walker.prev = walker.next;
    walker.next = p;
  }
  this.head = tail;
  this.tail = head;
  return this
};

function insert (self, node, value) {
  var inserted = node === self.head ?
    new Node(value, null, node, self) :
    new Node(value, node, node.next, self);

  if (inserted.next === null) {
    self.tail = inserted;
  }
  if (inserted.prev === null) {
    self.head = inserted;
  }

  self.length++;

  return inserted
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self);
  if (!self.head) {
    self.head = self.tail;
  }
  self.length++;
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self);
  if (!self.tail) {
    self.tail = self.head;
  }
  self.length++;
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list;
  this.value = value;

  if (prev) {
    prev.next = this;
    this.prev = prev;
  } else {
    this.prev = null;
  }

  if (next) {
    next.prev = this;
    this.next = next;
  } else {
    this.next = null;
  }
}

try {
  // add if support for Symbol.iterator is present
  iterator(Yallist);
} catch (er) {}

// A linked list to keep track of recently-used-ness


const MAX = Symbol('max');
const LENGTH = Symbol('length');
const LENGTH_CALCULATOR = Symbol('lengthCalculator');
const ALLOW_STALE = Symbol('allowStale');
const MAX_AGE = Symbol('maxAge');
const DISPOSE = Symbol('dispose');
const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet');
const LRU_LIST = Symbol('lruList');
const CACHE = Symbol('cache');
const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet');

const naiveLength = () => 1;

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
  constructor (options) {
    if (typeof options === 'number')
      options = { max: options };

    if (!options)
      options = {};

    if (options.max && (typeof options.max !== 'number' || options.max < 0))
      throw new TypeError('max must be a non-negative number')
    // Kind of weird to have a default max of Infinity, but oh well.
    this[MAX] = options.max || Infinity;

    const lc = options.length || naiveLength;
    this[LENGTH_CALCULATOR] = (typeof lc !== 'function') ? naiveLength : lc;
    this[ALLOW_STALE] = options.stale || false;
    if (options.maxAge && typeof options.maxAge !== 'number')
      throw new TypeError('maxAge must be a number')
    this[MAX_AGE] = options.maxAge || 0;
    this[DISPOSE] = options.dispose;
    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
    this.reset();
  }

  // resize the cache when the max changes.
  set max (mL) {
    if (typeof mL !== 'number' || mL < 0)
      throw new TypeError('max must be a non-negative number')

    this[MAX] = mL || Infinity;
    trim(this);
  }
  get max () {
    return this[MAX]
  }

  set allowStale (allowStale) {
    this[ALLOW_STALE] = !!allowStale;
  }
  get allowStale () {
    return this[ALLOW_STALE]
  }

  set maxAge (mA) {
    if (typeof mA !== 'number')
      throw new TypeError('maxAge must be a non-negative number')

    this[MAX_AGE] = mA;
    trim(this);
  }
  get maxAge () {
    return this[MAX_AGE]
  }

  // resize the cache when the lengthCalculator changes.
  set lengthCalculator (lC) {
    if (typeof lC !== 'function')
      lC = naiveLength;

    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC;
      this[LENGTH] = 0;
      this[LRU_LIST].forEach(hit => {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
        this[LENGTH] += hit.length;
      });
    }
    trim(this);
  }
  get lengthCalculator () { return this[LENGTH_CALCULATOR] }

  get length () { return this[LENGTH] }
  get itemCount () { return this[LRU_LIST].length }

  rforEach (fn, thisp) {
    thisp = thisp || this;
    for (let walker = this[LRU_LIST].tail; walker !== null;) {
      const prev = walker.prev;
      forEachStep(this, fn, walker, thisp);
      walker = prev;
    }
  }

  forEach (fn, thisp) {
    thisp = thisp || this;
    for (let walker = this[LRU_LIST].head; walker !== null;) {
      const next = walker.next;
      forEachStep(this, fn, walker, thisp);
      walker = next;
    }
  }

  keys () {
    return this[LRU_LIST].toArray().map(k => k.key)
  }

  values () {
    return this[LRU_LIST].toArray().map(k => k.value)
  }

  reset () {
    if (this[DISPOSE] &&
        this[LRU_LIST] &&
        this[LRU_LIST].length) {
      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value));
    }

    this[CACHE] = new Map(); // hash of items by key
    this[LRU_LIST] = new yallist(); // list of items in order of use recency
    this[LENGTH] = 0; // length of items in the list
  }

  dump () {
    return this[LRU_LIST].map(hit =>
      isStale(this, hit) ? false : {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }).toArray().filter(h => h)
  }

  dumpLru () {
    return this[LRU_LIST]
  }

  set (key, value, maxAge) {
    maxAge = maxAge || this[MAX_AGE];

    if (maxAge && typeof maxAge !== 'number')
      throw new TypeError('maxAge must be a number')

    const now = maxAge ? Date.now() : 0;
    const len = this[LENGTH_CALCULATOR](value, key);

    if (this[CACHE].has(key)) {
      if (len > this[MAX]) {
        del(this, this[CACHE].get(key));
        return false
      }

      const node = this[CACHE].get(key);
      const item = node.value;

      // dispose of the old one before overwriting
      // split out into 2 ifs for better coverage tracking
      if (this[DISPOSE]) {
        if (!this[NO_DISPOSE_ON_SET])
          this[DISPOSE](key, item.value);
      }

      item.now = now;
      item.maxAge = maxAge;
      item.value = value;
      this[LENGTH] += len - item.length;
      item.length = len;
      this.get(key);
      trim(this);
      return true
    }

    const hit = new Entry(key, value, len, now, maxAge);

    // oversized objects fall out of cache automatically.
    if (hit.length > this[MAX]) {
      if (this[DISPOSE])
        this[DISPOSE](key, value);

      return false
    }

    this[LENGTH] += hit.length;
    this[LRU_LIST].unshift(hit);
    this[CACHE].set(key, this[LRU_LIST].head);
    trim(this);
    return true
  }

  has (key) {
    if (!this[CACHE].has(key)) return false
    const hit = this[CACHE].get(key).value;
    return !isStale(this, hit)
  }

  get (key) {
    return get(this, key, true)
  }

  peek (key) {
    return get(this, key, false)
  }

  pop () {
    const node = this[LRU_LIST].tail;
    if (!node)
      return null

    del(this, node);
    return node.value
  }

  del (key) {
    del(this, this[CACHE].get(key));
  }

  load (arr) {
    // reset the cache
    this.reset();

    const now = Date.now();
    // A previous serialized cache has the most recent items first
    for (let l = arr.length - 1; l >= 0; l--) {
      const hit = arr[l];
      const expiresAt = hit.e || 0;
      if (expiresAt === 0)
        // the item was created without expiration in a non aged cache
        this.set(hit.k, hit.v);
      else {
        const maxAge = expiresAt - now;
        // dont add already expired items
        if (maxAge > 0) {
          this.set(hit.k, hit.v, maxAge);
        }
      }
    }
  }

  prune () {
    this[CACHE].forEach((value, key) => get(this, key, false));
  }
}

const get = (self, key, doUse) => {
  const node = self[CACHE].get(key);
  if (node) {
    const hit = node.value;
    if (isStale(self, hit)) {
      del(self, node);
      if (!self[ALLOW_STALE])
        return undefined
    } else {
      if (doUse) {
        if (self[UPDATE_AGE_ON_GET])
          node.value.now = Date.now();
        self[LRU_LIST].unshiftNode(node);
      }
    }
    return hit.value
  }
};

const isStale = (self, hit) => {
  if (!hit || (!hit.maxAge && !self[MAX_AGE]))
    return false

  const diff = Date.now() - hit.now;
  return hit.maxAge ? diff > hit.maxAge
    : self[MAX_AGE] && (diff > self[MAX_AGE])
};

const trim = self => {
  if (self[LENGTH] > self[MAX]) {
    for (let walker = self[LRU_LIST].tail;
      self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      const prev = walker.prev;
      del(self, walker);
      walker = prev;
    }
  }
};

const del = (self, node) => {
  if (node) {
    const hit = node.value;
    if (self[DISPOSE])
      self[DISPOSE](hit.key, hit.value);

    self[LENGTH] -= hit.length;
    self[CACHE].delete(hit.key);
    self[LRU_LIST].removeNode(node);
  }
};

class Entry {
  constructor (key, value, length, now, maxAge) {
    this.key = key;
    this.value = value;
    this.length = length;
    this.now = now;
    this.maxAge = maxAge || 0;
  }
}

const forEachStep = (self, fn, node, thisp) => {
  let hit = node.value;
  if (isStale(self, hit)) {
    del(self, node);
    if (!self[ALLOW_STALE])
      hit = undefined;
  }
  if (hit)
    fn.call(thisp, hit.value, hit.key, self);
};

var lruCache = LRUCache;

// hoisted class for cyclic dependency
class Range {
  constructor (range, options) {
    options = parseOptions_1(options);

    if (range instanceof Range) {
      if (
        range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease
      ) {
        return range
      } else {
        return new Range(range.raw, options)
      }
    }

    if (range instanceof comparator) {
      // just put it in the set and return
      this.raw = range.value;
      this.set = [[range]];
      this.format();
      return this
    }

    this.options = options;
    this.loose = !!options.loose;
    this.includePrerelease = !!options.includePrerelease;

    // First, split based on boolean or ||
    this.raw = range;
    this.set = range
      .split(/\s*\|\|\s*/)
      // map the range to a 2d array of comparators
      .map(range => this.parseRange(range.trim()))
      // throw out any comparator lists that are empty
      // this generally means that it was not a valid range, which is allowed
      // in loose mode, but will still throw if the WHOLE range is invalid.
      .filter(c => c.length);

    if (!this.set.length) {
      throw new TypeError(`Invalid SemVer Range: ${range}`)
    }

    // if we have any that are not the null set, throw out null sets.
    if (this.set.length > 1) {
      // keep the first one, in case they're all null sets
      const first = this.set[0];
      this.set = this.set.filter(c => !isNullSet(c[0]));
      if (this.set.length === 0)
        this.set = [first];
      else if (this.set.length > 1) {
        // if we have any that are *, then the range is just *
        for (const c of this.set) {
          if (c.length === 1 && isAny(c[0])) {
            this.set = [c];
            break
          }
        }
      }
    }

    this.format();
  }

  format () {
    this.range = this.set
      .map((comps) => {
        return comps.join(' ').trim()
      })
      .join('||')
      .trim();
    return this.range
  }

  toString () {
    return this.range
  }

  parseRange (range) {
    range = range.trim();

    // memoize range parsing for performance.
    // this is a very hot path, and fully deterministic.
    const memoOpts = Object.keys(this.options).join(',');
    const memoKey = `parseRange:${memoOpts}:${range}`;
    const cached = cache.get(memoKey);
    if (cached)
      return cached

    const loose = this.options.loose;
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    const hr = loose ? re$1[t$1.HYPHENRANGELOOSE] : re$1[t$1.HYPHENRANGE];
    range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
    debug_1('hyphen replace', range);
    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re$1[t$1.COMPARATORTRIM], comparatorTrimReplace);
    debug_1('comparator trim', range, re$1[t$1.COMPARATORTRIM]);

    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re$1[t$1.TILDETRIM], tildeTrimReplace);

    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re$1[t$1.CARETTRIM], caretTrimReplace);

    // normalize spaces
    range = range.split(/\s+/).join(' ');

    // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    const compRe = loose ? re$1[t$1.COMPARATORLOOSE] : re$1[t$1.COMPARATOR];
    const rangeList = range
      .split(' ')
      .map(comp => parseComparator(comp, this.options))
      .join(' ')
      .split(/\s+/)
      // >=0.0.0 is equivalent to *
      .map(comp => replaceGTE0(comp, this.options))
      // in loose mode, throw out any that are not valid comparators
      .filter(this.options.loose ? comp => !!comp.match(compRe) : () => true)
      .map(comp => new comparator(comp, this.options));

    // if any comparators are the null set, then replace with JUST null set
    // if more than one comparator, remove any * comparators
    // also, don't include the same comparator more than once
    rangeList.length;
    const rangeMap = new Map();
    for (const comp of rangeList) {
      if (isNullSet(comp))
        return [comp]
      rangeMap.set(comp.value, comp);
    }
    if (rangeMap.size > 1 && rangeMap.has(''))
      rangeMap.delete('');

    const result = [...rangeMap.values()];
    cache.set(memoKey, result);
    return result
  }

  intersects (range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError('a Range is required')
    }

    return this.set.some((thisComparators) => {
      return (
        isSatisfiable(thisComparators, options) &&
        range.set.some((rangeComparators) => {
          return (
            isSatisfiable(rangeComparators, options) &&
            thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options)
              })
            })
          )
        })
      )
    })
  }

  // if ANY of the sets match ALL of its comparators, then pass
  test (version) {
    if (!version) {
      return false
    }

    if (typeof version === 'string') {
      try {
        version = new semver$1(version, this.options);
      } catch (er) {
        return false
      }
    }

    for (let i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version, this.options)) {
        return true
      }
    }
    return false
  }
}
var range = Range;


const cache = new lruCache({ max: 1000 });





const {
  re: re$1,
  t: t$1,
  comparatorTrimReplace,
  tildeTrimReplace,
  caretTrimReplace
} = re_1;

const isNullSet = c => c.value === '<0.0.0-0';
const isAny = c => c.value === '';

// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options) => {
  let result = true;
  const remainingComparators = comparators.slice();
  let testComparator = remainingComparators.pop();

  while (result && remainingComparators.length) {
    result = remainingComparators.every((otherComparator) => {
      return testComparator.intersects(otherComparator, options)
    });

    testComparator = remainingComparators.pop();
  }

  return result
};

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options) => {
  debug_1('comp', comp, options);
  comp = replaceCarets(comp, options);
  debug_1('caret', comp);
  comp = replaceTildes(comp, options);
  debug_1('tildes', comp);
  comp = replaceXRanges(comp, options);
  debug_1('xrange', comp);
  comp = replaceStars(comp, options);
  debug_1('stars', comp);
  return comp
};

const isX = id => !id || id.toLowerCase() === 'x' || id === '*';

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
const replaceTildes = (comp, options) =>
  comp.trim().split(/\s+/).map((comp) => {
    return replaceTilde(comp, options)
  }).join(' ');

const replaceTilde = (comp, options) => {
  const r = options.loose ? re$1[t$1.TILDELOOSE] : re$1[t$1.TILDE];
  return comp.replace(r, (_, M, m, p, pr) => {
    debug_1('tilde', comp, _, M, m, p, pr);
    let ret;

    if (isX(M)) {
      ret = '';
    } else if (isX(m)) {
      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0-0
      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
    } else if (pr) {
      debug_1('replaceTilde pr', pr);
      ret = `>=${M}.${m}.${p}-${pr
      } <${M}.${+m + 1}.0-0`;
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0-0
      ret = `>=${M}.${m}.${p
      } <${M}.${+m + 1}.0-0`;
    }

    debug_1('tilde return', ret);
    return ret
  })
};

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
const replaceCarets = (comp, options) =>
  comp.trim().split(/\s+/).map((comp) => {
    return replaceCaret(comp, options)
  }).join(' ');

const replaceCaret = (comp, options) => {
  debug_1('caret', comp, options);
  const r = options.loose ? re$1[t$1.CARETLOOSE] : re$1[t$1.CARET];
  const z = options.includePrerelease ? '-0' : '';
  return comp.replace(r, (_, M, m, p, pr) => {
    debug_1('caret', comp, _, M, m, p, pr);
    let ret;

    if (isX(M)) {
      ret = '';
    } else if (isX(m)) {
      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
    } else if (isX(p)) {
      if (M === '0') {
        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
      } else {
        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
      }
    } else if (pr) {
      debug_1('replaceCaret pr', pr);
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${m}.${+p + 1}-0`;
        } else {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${+m + 1}.0-0`;
        }
      } else {
        ret = `>=${M}.${m}.${p}-${pr
        } <${+M + 1}.0.0-0`;
      }
    } else {
      debug_1('no pr');
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${m}.${+p + 1}-0`;
        } else {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${+m + 1}.0-0`;
        }
      } else {
        ret = `>=${M}.${m}.${p
        } <${+M + 1}.0.0-0`;
      }
    }

    debug_1('caret return', ret);
    return ret
  })
};

const replaceXRanges = (comp, options) => {
  debug_1('replaceXRanges', comp, options);
  return comp.split(/\s+/).map((comp) => {
    return replaceXRange(comp, options)
  }).join(' ')
};

const replaceXRange = (comp, options) => {
  comp = comp.trim();
  const r = options.loose ? re$1[t$1.XRANGELOOSE] : re$1[t$1.XRANGE];
  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
    debug_1('xRange', comp, ret, gtlt, M, m, p, pr);
    const xM = isX(M);
    const xm = xM || isX(m);
    const xp = xm || isX(p);
    const anyX = xp;

    if (gtlt === '=' && anyX) {
      gtlt = '';
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : '';

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0';
      } else {
        // nothing is forbidden
        ret = '*';
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0;
      }
      p = 0;

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        gtlt = '>=';
        if (xm) {
          M = +M + 1;
          m = 0;
          p = 0;
        } else {
          m = +m + 1;
          p = 0;
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<';
        if (xm) {
          M = +M + 1;
        } else {
          m = +m + 1;
        }
      }

      if (gtlt === '<')
        pr = '-0';

      ret = `${gtlt + M}.${m}.${p}${pr}`;
    } else if (xm) {
      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
    } else if (xp) {
      ret = `>=${M}.${m}.0${pr
      } <${M}.${+m + 1}.0-0`;
    }

    debug_1('xRange return', ret);

    return ret
  })
};

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options) => {
  debug_1('replaceStars', comp, options);
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re$1[t$1.STAR], '')
};

const replaceGTE0 = (comp, options) => {
  debug_1('replaceGTE0', comp, options);
  return comp.trim()
    .replace(re$1[options.includePrerelease ? t$1.GTE0PRE : t$1.GTE0], '')
};

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
const hyphenReplace = incPr => ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) => {
  if (isX(fM)) {
    from = '';
  } else if (isX(fm)) {
    from = `>=${fM}.0.0${incPr ? '-0' : ''}`;
  } else if (isX(fp)) {
    from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`;
  } else if (fpr) {
    from = `>=${from}`;
  } else {
    from = `>=${from}${incPr ? '-0' : ''}`;
  }

  if (isX(tM)) {
    to = '';
  } else if (isX(tm)) {
    to = `<${+tM + 1}.0.0-0`;
  } else if (isX(tp)) {
    to = `<${tM}.${+tm + 1}.0-0`;
  } else if (tpr) {
    to = `<=${tM}.${tm}.${tp}-${tpr}`;
  } else if (incPr) {
    to = `<${tM}.${tm}.${+tp + 1}-0`;
  } else {
    to = `<=${to}`;
  }

  return (`${from} ${to}`).trim()
};

const testSet = (set, version, options) => {
  for (let i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (let i = 0; i < set.length; i++) {
      debug_1(set[i].semver);
      if (set[i].semver === comparator.ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        const allowed = set[i].semver;
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
};

const ANY$2 = Symbol('SemVer ANY');
// hoisted class for cyclic dependency
class Comparator {
  static get ANY () {
    return ANY$2
  }
  constructor (comp, options) {
    options = parseOptions_1(options);

    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      } else {
        comp = comp.value;
      }
    }

    debug_1('comparator', comp, options);
    this.options = options;
    this.loose = !!options.loose;
    this.parse(comp);

    if (this.semver === ANY$2) {
      this.value = '';
    } else {
      this.value = this.operator + this.semver.version;
    }

    debug_1('comp', this);
  }

  parse (comp) {
    const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
    const m = comp.match(r);

    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`)
    }

    this.operator = m[1] !== undefined ? m[1] : '';
    if (this.operator === '=') {
      this.operator = '';
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = ANY$2;
    } else {
      this.semver = new semver$1(m[2], this.options.loose);
    }
  }

  toString () {
    return this.value
  }

  test (version) {
    debug_1('Comparator.test', version, this.options.loose);

    if (this.semver === ANY$2 || version === ANY$2) {
      return true
    }

    if (typeof version === 'string') {
      try {
        version = new semver$1(version, this.options);
      } catch (er) {
        return false
      }
    }

    return cmp_1(version, this.operator, this.semver, this.options)
  }

  intersects (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required')
    }

    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      };
    }

    if (this.operator === '') {
      if (this.value === '') {
        return true
      }
      return new range(comp.value, options).test(this.value)
    } else if (comp.operator === '') {
      if (comp.value === '') {
        return true
      }
      return new range(this.value, options).test(comp.semver)
    }

    const sameDirectionIncreasing =
      (this.operator === '>=' || this.operator === '>') &&
      (comp.operator === '>=' || comp.operator === '>');
    const sameDirectionDecreasing =
      (this.operator === '<=' || this.operator === '<') &&
      (comp.operator === '<=' || comp.operator === '<');
    const sameSemVer = this.semver.version === comp.semver.version;
    const differentDirectionsInclusive =
      (this.operator === '>=' || this.operator === '<=') &&
      (comp.operator === '>=' || comp.operator === '<=');
    const oppositeDirectionsLessThan =
      cmp_1(this.semver, '<', comp.semver, options) &&
      (this.operator === '>=' || this.operator === '>') &&
        (comp.operator === '<=' || comp.operator === '<');
    const oppositeDirectionsGreaterThan =
      cmp_1(this.semver, '>', comp.semver, options) &&
      (this.operator === '<=' || this.operator === '<') &&
        (comp.operator === '>=' || comp.operator === '>');

    return (
      sameDirectionIncreasing ||
      sameDirectionDecreasing ||
      (sameSemVer && differentDirectionsInclusive) ||
      oppositeDirectionsLessThan ||
      oppositeDirectionsGreaterThan
    )
  }
}

var comparator = Comparator;


const {re, t} = re_1;

const satisfies = (version, range$1, options) => {
  try {
    range$1 = new range(range$1, options);
  } catch (er) {
    return false
  }
  return range$1.test(version)
};
var satisfies_1 = satisfies;

// Mostly just for testing and legacy API reasons
const toComparators = (range$1, options) =>
  new range(range$1, options).set
    .map(comp => comp.map(c => c.value).join(' ').trim().split(' '));

var toComparators_1 = toComparators;

const maxSatisfying = (versions, range$1, options) => {
  let max = null;
  let maxSV = null;
  let rangeObj = null;
  try {
    rangeObj = new range(range$1, options);
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v;
        maxSV = new semver$1(max, options);
      }
    }
  });
  return max
};
var maxSatisfying_1 = maxSatisfying;

const minSatisfying = (versions, range$1, options) => {
  let min = null;
  let minSV = null;
  let rangeObj = null;
  try {
    rangeObj = new range(range$1, options);
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v;
        minSV = new semver$1(min, options);
      }
    }
  });
  return min
};
var minSatisfying_1 = minSatisfying;

const minVersion = (range$1, loose) => {
  range$1 = new range(range$1, loose);

  let minver = new semver$1('0.0.0');
  if (range$1.test(minver)) {
    return minver
  }

  minver = new semver$1('0.0.0-0');
  if (range$1.test(minver)) {
    return minver
  }

  minver = null;
  for (let i = 0; i < range$1.set.length; ++i) {
    const comparators = range$1.set[i];

    let setMin = null;
    comparators.forEach((comparator) => {
      // Clone to avoid manipulating the comparator's semver object.
      const compver = new semver$1(comparator.semver.version);
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++;
          } else {
            compver.prerelease.push(0);
          }
          compver.raw = compver.format();
          /* fallthrough */
        case '':
        case '>=':
          if (!setMin || gt_1(compver, setMin)) {
            setMin = compver;
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error(`Unexpected operation: ${comparator.operator}`)
      }
    });
    if (setMin && (!minver || gt_1(minver, setMin)))
      minver = setMin;
  }

  if (minver && range$1.test(minver)) {
    return minver
  }

  return null
};
var minVersion_1 = minVersion;

const validRange = (range$1, options) => {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new range(range$1, options).range || '*'
  } catch (er) {
    return null
  }
};
var valid = validRange;

const {ANY: ANY$1} = comparator;







const outside = (version, range$1, hilo, options) => {
  version = new semver$1(version, options);
  range$1 = new range(range$1, options);

  let gtfn, ltefn, ltfn, comp, ecomp;
  switch (hilo) {
    case '>':
      gtfn = gt_1;
      ltefn = lte_1;
      ltfn = lt_1;
      comp = '>';
      ecomp = '>=';
      break
    case '<':
      gtfn = lt_1;
      ltefn = gte_1;
      ltfn = gt_1;
      comp = '<';
      ecomp = '<=';
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisfies the range it is not outside
  if (satisfies_1(version, range$1, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (let i = 0; i < range$1.set.length; ++i) {
    const comparators = range$1.set[i];

    let high = null;
    let low = null;

    comparators.forEach((comparator$1) => {
      if (comparator$1.semver === ANY$1) {
        comparator$1 = new comparator('>=0.0.0');
      }
      high = high || comparator$1;
      low = low || comparator$1;
      if (gtfn(comparator$1.semver, high.semver, options)) {
        high = comparator$1;
      } else if (ltfn(comparator$1.semver, low.semver, options)) {
        low = comparator$1;
      }
    });

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
};

var outside_1 = outside;

// Determine if version is greater than all the versions possible in the range.

const gtr = (version, range, options) => outside_1(version, range, '>', options);
var gtr_1 = gtr;

// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options) => outside_1(version, range, '<', options);
var ltr_1 = ltr;

const intersects = (r1, r2, options) => {
  r1 = new range(r1, options);
  r2 = new range(r2, options);
  return r1.intersects(r2)
};
var intersects_1 = intersects;

// given a set of versions and a range, create a "simplified" range
// that includes the same versions that the original range does
// If the original range is shorter than the simplified one, return that.


var simplify = (versions, range, options) => {
  const set = [];
  let min = null;
  let prev = null;
  const v = versions.sort((a, b) => compare_1(a, b, options));
  for (const version of v) {
    const included = satisfies_1(version, range, options);
    if (included) {
      prev = version;
      if (!min)
        min = version;
    } else {
      if (prev) {
        set.push([min, prev]);
      }
      prev = null;
      min = null;
    }
  }
  if (min)
    set.push([min, null]);

  const ranges = [];
  for (const [min, max] of set) {
    if (min === max)
      ranges.push(min);
    else if (!max && min === v[0])
      ranges.push('*');
    else if (!max)
      ranges.push(`>=${min}`);
    else if (min === v[0])
      ranges.push(`<=${max}`);
    else
      ranges.push(`${min} - ${max}`);
  }
  const simplified = ranges.join(' || ');
  const original = typeof range.raw === 'string' ? range.raw : String(range);
  return simplified.length < original.length ? simplified : range
};

const { ANY } = comparator;



// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
// - Every simple range `r1, r2, ...` is a subset of some `R1, R2, ...`
//
// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
// - If c is only the ANY comparator
//   - If C is only the ANY comparator, return true
//   - Else return false
// - Let EQ be the set of = comparators in c
// - If EQ is more than one, return true (null set)
// - Let GT be the highest > or >= comparator in c
// - Let LT be the lowest < or <= comparator in c
// - If GT and LT, and GT.semver > LT.semver, return true (null set)
// - If EQ
//   - If GT, and EQ does not satisfy GT, return true (null set)
//   - If LT, and EQ does not satisfy LT, return true (null set)
//   - If EQ satisfies every C, return true
//   - Else return false
// - If GT
//   - If GT.semver is lower than any > or >= comp in C, return false
//   - If GT is >=, and GT.semver does not satisfy every C, return false
// - If LT
//   - If LT.semver is greater than any < or <= comp in C, return false
//   - If LT is <=, and LT.semver does not satisfy every C, return false
// - If any C is a = range, and GT or LT are set, return false
// - Else return true

const subset = (sub, dom, options) => {
  if (sub === dom)
    return true

  sub = new range(sub, options);
  dom = new range(dom, options);
  let sawNonNull = false;

  OUTER: for (const simpleSub of sub.set) {
    for (const simpleDom of dom.set) {
      const isSub = simpleSubset(simpleSub, simpleDom, options);
      sawNonNull = sawNonNull || isSub !== null;
      if (isSub)
        continue OUTER
    }
    // the null set is a subset of everything, but null simple ranges in
    // a complex range should be ignored.  so if we saw a non-null range,
    // then we know this isn't a subset, but if EVERY simple range was null,
    // then it is a subset.
    if (sawNonNull)
      return false
  }
  return true
};

const simpleSubset = (sub, dom, options) => {
  if (sub === dom)
    return true

  if (sub.length === 1 && sub[0].semver === ANY)
    return dom.length === 1 && dom[0].semver === ANY

  const eqSet = new Set();
  let gt, lt;
  for (const c of sub) {
    if (c.operator === '>' || c.operator === '>=')
      gt = higherGT(gt, c, options);
    else if (c.operator === '<' || c.operator === '<=')
      lt = lowerLT(lt, c, options);
    else
      eqSet.add(c.semver);
  }

  if (eqSet.size > 1)
    return null

  let gtltComp;
  if (gt && lt) {
    gtltComp = compare_1(gt.semver, lt.semver, options);
    if (gtltComp > 0)
      return null
    else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<='))
      return null
  }

  // will iterate one or zero times
  for (const eq of eqSet) {
    if (gt && !satisfies_1(eq, String(gt), options))
      return null

    if (lt && !satisfies_1(eq, String(lt), options))
      return null

    for (const c of dom) {
      if (!satisfies_1(eq, String(c), options))
        return false
    }

    return true
  }

  let higher, lower;
  let hasDomLT, hasDomGT;
  for (const c of dom) {
    hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>=';
    hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<=';
    if (gt) {
      if (c.operator === '>' || c.operator === '>=') {
        higher = higherGT(gt, c, options);
        if (higher === c && higher !== gt)
          return false
      } else if (gt.operator === '>=' && !satisfies_1(gt.semver, String(c), options))
        return false
    }
    if (lt) {
      if (c.operator === '<' || c.operator === '<=') {
        lower = lowerLT(lt, c, options);
        if (lower === c && lower !== lt)
          return false
      } else if (lt.operator === '<=' && !satisfies_1(lt.semver, String(c), options))
        return false
    }
    if (!c.operator && (lt || gt) && gtltComp !== 0)
      return false
  }

  // if there was a < or >, and nothing in the dom, then must be false
  // UNLESS it was limited by another range in the other direction.
  // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
  if (gt && hasDomLT && !lt && gtltComp !== 0)
    return false

  if (lt && hasDomGT && !gt && gtltComp !== 0)
    return false

  return true
};

// >=1.2.3 is lower than >1.2.3
const higherGT = (a, b, options) => {
  if (!a)
    return b
  const comp = compare_1(a.semver, b.semver, options);
  return comp > 0 ? a
    : comp < 0 ? b
    : b.operator === '>' && a.operator === '>=' ? b
    : a
};

// <=1.2.3 is higher than <1.2.3
const lowerLT = (a, b, options) => {
  if (!a)
    return b
  const comp = compare_1(a.semver, b.semver, options);
  return comp < 0 ? a
    : comp > 0 ? b
    : b.operator === '<' && a.operator === '<=' ? b
    : a
};

var subset_1 = subset;

// just pre-load all the stuff that index.js lazily exports

var semver = {
  re: re_1.re,
  src: re_1.src,
  tokens: re_1.t,
  SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
  SemVer: semver$1,
  compareIdentifiers: identifiers.compareIdentifiers,
  rcompareIdentifiers: identifiers.rcompareIdentifiers,
  parse: parse_1,
  valid: valid_1,
  clean: clean_1,
  inc: inc_1,
  diff: diff_1,
  major: major_1,
  minor: minor_1,
  patch: patch_1,
  prerelease: prerelease_1,
  compare: compare_1,
  rcompare: rcompare_1,
  compareLoose: compareLoose_1,
  compareBuild: compareBuild_1,
  sort: sort_1,
  rsort: rsort_1,
  gt: gt_1,
  lt: lt_1,
  eq: eq_1,
  neq: neq_1,
  gte: gte_1,
  lte: lte_1,
  cmp: cmp_1,
  coerce: coerce_1,
  Comparator: comparator,
  Range: range,
  satisfies: satisfies_1,
  toComparators: toComparators_1,
  maxSatisfying: maxSatisfying_1,
  minSatisfying: minSatisfying_1,
  minVersion: minVersion_1,
  validRange: valid,
  outside: outside_1,
  gtr: gtr_1,
  ltr: ltr_1,
  intersects: intersects_1,
  simplifyRange: simplify,
  subset: subset_1,
};

var Result;
(function (Result) {
    Result[Result["UnknownEvent"] = 0] = "UnknownEvent";
    Result[Result["ActorNotAllowed"] = 1] = "ActorNotAllowed";
    Result[Result["FileNotAllowed"] = 2] = "FileNotAllowed";
    Result[Result["UnexpectedChanges"] = 3] = "UnexpectedChanges";
    Result[Result["UnexpectedPropertyChange"] = 4] = "UnexpectedPropertyChange";
    Result[Result["VersionChangeNotAllowed"] = 5] = "VersionChangeNotAllowed";
    Result[Result["PRNotOpen"] = 6] = "PRNotOpen";
    Result[Result["PRHeadChanged"] = 7] = "PRHeadChanged";
    Result[Result["Success"] = 8] = "Success";
})(Result || (Result = {}));

var semverRegex = /^([~^]?)[0-9]+\.[0-9]+\.[0-9]+(-.+)?$/;
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var context, payload, token, allowedActors, allowedUpdateTypes, packageBlockList, pr, Octokit, octokit, readPackageJson, enableAutoMerge, getCommit, validVersionChange, commit, onlyPackageJsonChanged, packageJsonBase, packageJsonPr, diff, allowedPropsChanges, allowedChange, result;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    core.info('Starting');
                    context = github.context;
                    core.debug(JSON.stringify(context, null, 2));
                    if (!['pull_request', 'pull_request_target'].includes(github.context.eventName)) {
                        core.error("Unsupported event name: " + github.context.eventName);
                        return [2 /*return*/, Result.UnknownEvent];
                    }
                    payload = github.context.payload;
                    token = core.getInput('github-token', { required: true });
                    allowedActors = core.getInput('allowed-actors', { required: true })
                        .split(',')
                        .map(function (a) { return a.trim(); })
                        .filter(Boolean);
                    allowedUpdateTypes = {};
                    core.getInput('allowed-update-types', { required: true })
                        .split(',')
                        .map(function (a) { return a.trim(); })
                        .filter(Boolean)
                        .forEach(function (group) {
                        var parts = group
                            .trim()
                            .split(':', 2)
                            .map(function (a) { return a.trim(); });
                        if (parts.length !== 2 || !parts.every(function (a) { return typeof a === 'string'; })) {
                            throw new Error('allowed-update-types invalid');
                        }
                        var dependencyType = parts[0], bumpType = parts[1];
                        if (!allowedUpdateTypes[dependencyType]) {
                            allowedUpdateTypes[dependencyType] = [];
                        }
                        allowedUpdateTypes[dependencyType].push(bumpType);
                    });
                    packageBlockList = (core.getInput('package-block-list') || '')
                        .split(',')
                        .map(function (a) { return a.trim(); });
                    if (!allowedActors.includes(context.actor)) {
                        core.error("Actor not allowed: " + context.actor);
                        return [2 /*return*/, Result.ActorNotAllowed];
                    }
                    pr = payload.pull_request;
                    Octokit = utils$1.GitHub.plugin(throttling);
                    octokit = new Octokit(utils$1.getOctokitOptions(token, {
                        throttle: {
                            onRateLimit: /* istanbul ignore next */ function (retryAfter) {
                                core.warning("Hit rate limit. Retrying in " + retryAfter + " seconds");
                                return true;
                            },
                            onAbuseLimit: /* istanbul ignore next */ function (retryAfter) {
                                core.warning("Hit abuse limit. Retrying in " + retryAfter + " seconds");
                                return true;
                            },
                        },
                    }));
                    readPackageJson = function (ref) { return __awaiter(_this, void 0, void 0, function () {
                        var content;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, octokit.repos.getContent({
                                        owner: context.repo.owner,
                                        repo: context.repo.repo,
                                        path: 'package.json',
                                        ref: ref,
                                    })];
                                case 1:
                                    content = _a.sent();
                                    if (content.data.type !== 'file' || content.data.encoding !== 'base64') {
                                        throw new Error('Unexpected repo content response');
                                    }
                                    return [2 /*return*/, JSON.parse(Buffer.from(content.data.content, 'base64').toString('utf-8'))];
                            }
                        });
                    }); };
                    enableAutoMerge = function () { return __awaiter(_this, void 0, void 0, function () {
                        var mutation, variables, result;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    mutation = "mutation($pullRequestId:ID!) {\n\t\t\tenablePullRequestAutoMerge(input: {pullRequestId: $pullRequestId, mergeMethod: SQUASH}) {\n\t\t\t\tpullRequest {\n\t\t\t\t\tautoMergeRequest {\n\t\t\t\t\t\tenabledAt\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}";
                                    variables = {
                                        pullRequestId: pr.node_id,
                                    };
                                    return [4 /*yield*/, octokit.graphql(mutation, variables)];
                                case 1:
                                    result = _d.sent();
                                    if (!((_c = (_b = (_a = result === null || result === void 0 ? void 0 : result.enablePullRequestAutoMerge) === null || _a === void 0 ? void 0 : _a.pullRequest) === null || _b === void 0 ? void 0 : _b.autoMergeRequest) === null || _c === void 0 ? void 0 : _c.enabledAt)) {
                                        core.error('Failed to enable auto-merge');
                                        throw new Error('Failed to enable auto-merge');
                                    }
                                    core.info('Auto-merge enabled');
                                    return [2 /*return*/, Result.Success];
                            }
                        });
                    }); };
                    getCommit = function () {
                        return octokit.repos.getCommit({
                            owner: context.repo.owner,
                            repo: context.repo.repo,
                            ref: pr.head.sha,
                        });
                    };
                    validVersionChange = function (oldVersion, newVersion, allowedBumpTypes) {
                        var oldVersionMatches = semverRegex.exec(oldVersion);
                        if (!oldVersionMatches) {
                            return false;
                        }
                        var newVersionMatches = semverRegex.exec(newVersion);
                        if (!newVersionMatches) {
                            return false;
                        }
                        var oldVersionPrefix = oldVersionMatches[1];
                        var newVersionPrefix = newVersionMatches[1];
                        if (oldVersionPrefix !== newVersionPrefix) {
                            return false;
                        }
                        var oldVersionExact = oldVersion.slice(oldVersionPrefix.length);
                        var newVersionExact = newVersion.slice(newVersionPrefix.length);
                        if (semver.gte(oldVersionExact, newVersionExact)) {
                            return false;
                        }
                        var allowed = [];
                        if (allowedBumpTypes.includes('major')) {
                            allowed.push('major');
                        }
                        if (allowedBumpTypes.includes('minor')) {
                            allowed.push('minor');
                        }
                        if (allowedBumpTypes.includes('patch')) {
                            allowed.push('patch');
                        }
                        return allowed.includes(semver.diff(oldVersionExact, newVersionExact));
                    };
                    core.info('Getting commit info');
                    return [4 /*yield*/, getCommit()];
                case 1:
                    commit = _a.sent();
                    onlyPackageJsonChanged = commit.data.files.every(function (_a) {
                        var filename = _a.filename, status = _a.status;
                        return ['package.json', 'package-lock.json', 'yarn.lock'].includes(filename) &&
                            status === 'modified';
                    });
                    if (!onlyPackageJsonChanged) {
                        core.error('More changed than the package.json and lockfile');
                        return [2 /*return*/, Result.FileNotAllowed];
                    }
                    core.info('Retrieving package.json');
                    return [4 /*yield*/, readPackageJson(pr.base.sha)];
                case 2:
                    packageJsonBase = _a.sent();
                    return [4 /*yield*/, readPackageJson(pr.head.sha)];
                case 3:
                    packageJsonPr = _a.sent();
                    core.info('Calculating diff');
                    diff = dist.detailedDiff(packageJsonBase, packageJsonPr);
                    core.debug(JSON.stringify(diff, null, 2));
                    if (Object.keys(diff.added).length || Object.keys(diff.deleted).length) {
                        core.error('Unexpected changes');
                        return [2 /*return*/, Result.UnexpectedChanges];
                    }
                    core.info('Checking diff');
                    allowedPropsChanges = Object.keys(diff.updated).every(function (prop) {
                        return (['dependencies', 'devDependencies'].includes(prop) &&
                            typeof diff.updated[prop] === 'object');
                    });
                    if (!allowedPropsChanges) {
                        core.error('Unexpected property change');
                        return [2 /*return*/, Result.UnexpectedPropertyChange];
                    }
                    allowedChange = Object.keys(diff.updated).every(function (prop) {
                        var allowedBumpTypes = allowedUpdateTypes[prop] || [];
                        var changedDependencies = diff.updated[prop];
                        return Object.keys(changedDependencies).every(function (dependency) {
                            if (typeof changedDependencies[dependency] !== 'string') {
                                return false;
                            }
                            if (packageBlockList.includes(dependency)) {
                                return false;
                            }
                            var oldVersion = packageJsonBase[prop][dependency];
                            var newVersion = packageJsonPr[prop][dependency];
                            if (typeof oldVersion !== 'string' || typeof newVersion !== 'string') {
                                return false;
                            }
                            return validVersionChange(oldVersion, newVersion, allowedBumpTypes);
                        });
                    });
                    if (!allowedChange) {
                        core.error('One or more version changes are not allowed');
                        return [2 /*return*/, Result.VersionChangeNotAllowed];
                    }
                    core.info('Enabling auto-merge');
                    return [4 /*yield*/, enableAutoMerge()];
                case 4:
                    result = _a.sent();
                    core.info('Finished!');
                    return [2 /*return*/, result];
            }
        });
    });
}

run().catch(function (e) {
    core.setFailed(e.message);
});
