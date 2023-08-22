"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var attempt_1 = require("@lifeomic/attempt");
/**
 * A wrapper class for making API requests with optional JWT authentication, response transformation, and enhanced logging.
 */
var VaporWrapper = /** @class */ (function () {
    function VaporWrapper(options) {
        var _a, _b;
        this.client = axios_1.default.create({
            baseURL: options.baseURL,
            timeout: options.timeout,
            withCredentials: true, // Enable cookies for session handling
        });
        this.maxRetries = (_a = options.maxRetries) !== null && _a !== void 0 ? _a : 3;
        this.logger = (_b = options.logger) !== null && _b !== void 0 ? _b : console;
    }
    /**
     * Session login method with dynamic route.
     * @param route The login endpoint
     * @param username The username for login
     * @param password The password for login
     * @returns The response data from the API
     */
    VaporWrapper.prototype.login = function (route, username, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.route({
                        method: 'post',
                        route: route,
                        data: { username: username, password: password },
                    })];
            });
        });
    };
    /**
     * Utility function to fetch data with dynamic route and optional JWT authentication.
     * @param route The endpoint to fetch data from
     * @param token Optional JWT token for authentication
     * @param transformResponse Optional response transformation function
     * @returns The response data from the API
     */
    VaporWrapper.prototype.fetchData = function (route, token, transformResponse) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.route({
                        method: 'get',
                        route: route,
                        token: token,
                        transformResponse: transformResponse,
                    })];
            });
        });
    };
    /**
     * Generic route method with optional JWT authentication and response transformation.
     * @param options The options for making the API request
     * @returns The response data from the API
     */
    VaporWrapper.prototype.route = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var config, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        config = {
                            method: options.method,
                            url: options.route,
                            data: options.data,
                            onUploadProgress: options.onUploadProgress,
                            onDownloadProgress: options.onDownloadProgress,
                            transformResponse: options.transformResponse,
                        };
                        // Add JWT token authentication if provided
                        if (options.token) {
                            config.headers = { Authorization: "Bearer ".concat(options.token) };
                        }
                        return [4 /*yield*/, this.request(config)];
                    case 1:
                        response = _a.sent();
                        this.logger.log("Request to ".concat(options.route, " succeeded"), {
                            url: options.route,
                            method: options.method,
                            headers: response.headers,
                            data: response.data,
                            status: response.status,
                            time: new Date().toISOString(),
                        });
                        return [2 /*return*/, {
                                data: response.data,
                                status: response.status,
                                headers: response.headers,
                            }];
                    case 2:
                        error_1 = _a.sent();
                        this.logger.error("Request to ".concat(options.route, " failed"), {
                            url: options.route,
                            method: options.method,
                            error: error_1,
                            time: new Date().toISOString(),
                        });
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Makes an API request using the specified configuration object with retry logic.
     * @param config The configuration object for the request
     * @returns The response data from the API
     */
    VaporWrapper.prototype.request = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, attempt_1.retry)(function () { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.client(config)];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, response];
                            }
                        });
                    }); }, {
                        maxAttempts: this.maxRetries,
                        delay: 1000,
                        factor: 2,
                    })];
            });
        });
    };
    return VaporWrapper;
}());
exports.default = VaporWrapper;
