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
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
require("isomorphic-fetch");
var nodes_1 = require("./nodes");
var node_1 = require("./node");
var Client = /** @class */ (function () {
    function Client(seedIP) {
        this.allNodes = [];
        this.initializedFlag = false;
        this.seedIP = seedIP;
    }
    Client.prototype.initialized = function () {
        return this.initializedFlag;
    };
    Client.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var payload, committeeMap, committeeSet, _i, _a, member;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.initializedFlag = false;
                        return [4 /*yield*/, this.loadSeed(this.seedIP)];
                    case 1:
                        payload = _b.sent();
                        if (!payload) {
                            throw new Error('Failed to load seed: none of the seed nodes returned a valid status');
                        }
                        committeeMap = new Map();
                        committeeSet = new Set();
                        for (_i = 0, _a = payload.CurrentCommittee; _i < _a.length; _i++) {
                            member = _a[_i];
                            committeeMap.set(member.EthAddress, member);
                            committeeSet.add(member.EthAddress);
                        }
                        // Map CurrentTopology to Node objects, merging data from CurrentCommittee
                        this.allNodes = payload.CurrentTopology.map(function (topologyNode) {
                            var committeeMember = committeeMap.get(topologyNode.EthAddress);
                            return new node_1.Node({
                                name: topologyNode.Name || '',
                                ip: topologyNode.Ip || '',
                                port: topologyNode.Port || 0,
                                website: topologyNode.Website || '',
                                guardianAddress: topologyNode.EthAddress || '',
                                nodeAddress: topologyNode.OrbsAddress || '',
                                reputation: topologyNode.Reputation || 0,
                                effectiveStake: (committeeMember === null || committeeMember === void 0 ? void 0 : committeeMember.EffectiveStake) || 0,
                                enterTime: (committeeMember === null || committeeMember === void 0 ? void 0 : committeeMember.EnterTime) || 0,
                                weight: (committeeMember === null || committeeMember === void 0 ? void 0 : committeeMember.Weight) || 0,
                                inCommittee: committeeSet.has(topologyNode.EthAddress),
                                teeHardware: topologyNode.TeeHardware || false,
                            });
                        });
                        // Sort by effectiveStake (descending)
                        this.allNodes.sort(function (a, b) { return b.effectiveStake - a.effectiveStake; });
                        this.initializedFlag = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    Client.prototype.loadSeed = function (seedIP) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, data, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "http://".concat(seedIP, "/services/management-service/status");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch(url)];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        if (data.Payload) {
                            return [2 /*return*/, data.Payload];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.error("exception in fetch loadSeed ".concat(seedIP, ":"), e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, null];
                }
            });
        });
    };
    Client.prototype.getNodes = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            var filteredNodes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filteredNodes = __spreadArray([], this.allNodes, true);
                        // Apply committeeOnly filter
                        if ((filter === null || filter === void 0 ? void 0 : filter.committeeOnly) === true) {
                            filteredNodes = filteredNodes.filter(function (node) { return node.inCommittee === true; });
                        }
                        // Apply teeHardware filter
                        if ((filter === null || filter === void 0 ? void 0 : filter.teeHardware) !== undefined) {
                            filteredNodes = filteredNodes.filter(function (node) { return node.teeHardware === filter.teeHardware; });
                        }
                        if (!((filter === null || filter === void 0 ? void 0 : filter.onlineOnly) === true)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.checkNodesOnline(filteredNodes)];
                    case 1:
                        _a.sent();
                        filteredNodes = filteredNodes.filter(function (node) { return node.online === true; });
                        _a.label = 2;
                    case 2: return [2 /*return*/, new nodes_1.Nodes(filteredNodes)];
                }
            });
        });
    };
    Client.prototype.checkNodesOnline = function (nodes) {
        return __awaiter(this, void 0, void 0, function () {
            var timeoutMs, checkPromises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timeoutMs = 5000;
                        checkPromises = nodes.map(function (node) { return node.updateStatus(timeoutMs); });
                        return [4 /*yield*/, Promise.all(checkPromises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Client;
}());
exports.Client = Client;
//# sourceMappingURL=client.js.map