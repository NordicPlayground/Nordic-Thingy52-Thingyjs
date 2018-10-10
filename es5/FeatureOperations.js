/*
  Copyright (c) 2010 - 2017, Nordic Semiconductor ASA
  All rights reserved.
  Redistribution and use in source and binary forms, with or without modification,
  are permitted provided that the following conditions are met:
  1. Redistributions of source code must retain the above copyright notice, this
     list of conditions and the following disclaimer.
  2. Redistributions in binary form, except as embedded into a Nordic
     Semiconductor ASA integrated circuit in a product or a software update for
     such product, must reproduce the above copyright notice, this list of
     conditions and the following disclaimer in the documentation and/or other
     materials provided with the distribution.
  3. Neither the name of Nordic Semiconductor ASA nor the names of its
     contributors may be used to endorse or promote products derived from this
     software without specific prior written permission.
  4. This software, with or without modification, must only be used with a
     Nordic Semiconductor ASA integrated circuit.
  5. Any software provided in binary form under this license must not be reverse
     engineered, decompiled, modified and/or disassembled.
  THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS
  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
  OF MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE
  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
  HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
  LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
  OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
import ThingyController from "./ThingyController.js";
import Utilities from "./Utilities.js";
var FeatureOperations = /** @class */ (function () {
    function FeatureOperations(device, type) {
        var _this = this;
        this._connect = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var _a, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!("thingyController" in this)) {
                            // has to be put here rather than in the constructor as we need access to the id of the device
                            // which is not accessible before the device has performed its connect method
                            this.thingyController = new ThingyController(this.device);
                        }
                        this.thingyController.addExecutedOperation(this.type, "connect");
                        if (("connected" in this.characteristic) && this.characteristic.connected) {
                            if (this.device.logEnabled) {
                                console.log("You're already connected to the " + this.type + " feature");
                            }
                            return [2 /*return*/, true];
                        }
                        if (!this.thingyController.getGattStatus()) return [3 /*break*/, 6];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        this.thingyController.setGattStatus(false);
                        _a = this.service;
                        return [4 /*yield*/, this.device.server.getPrimaryService(this.service.uuid)];
                    case 2:
                        _a.service = _c.sent();
                        _b = this.characteristic;
                        return [4 /*yield*/, this.service.service.getCharacteristic(this.characteristic.uuid)];
                    case 3:
                        _b.characteristic = _c.sent();
                        this.thingyController.setGattStatus(true);
                        this.characteristic.connected = true;
                        this.characteristic.notifying = false;
                        this.characteristic.hasEventListener = false;
                        /*
                        // This approach needs to be fundamentally revised
                        // For now we'll leave it here, commented out
                        if (this.characteristic.verifyAction && this.characteristic.verifyReaction) {
                          await this.characteristic.verifyAction();
                
                          this.addEventListener("verifyReaction", this.characteristic.verifyReaction);
                
                          const verifyValue = await this._notify(true, true);
                
                          // something needs to be done here depending on the value returned
                          // by the functions over. Could prove difficult, will have to see if
                          // we can alter how verifyAction & verifyReaction works, as it's
                          // only used by the microphone per now
                        }*/
                        if (this.device.logEnabled) {
                            console.log("Connected to the " + this.type + " feature");
                        }
                        return [2 /*return*/, true];
                    case 4:
                        error_1 = _c.sent();
                        if ("thingyController" in this) {
                            this.thingyController.setGattStatus(true);
                            this.thingyController.enqueue(this.type, "connect", function () { return _this._connect(); });
                        }
                        this.characteristic.connected = false;
                        if ("utilities" in this) {
                            this.utilities.processEvent("error", this.type, error_1);
                        }
                        return [2 /*return*/, false];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        this.thingyController.enqueue(this.type, "connect", function () { return _this._connect(); });
                        return [2 /*return*/, false];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        this._read = function (returnRaw) {
            if (returnRaw === void 0) { returnRaw = false; }
            return __awaiter(_this, void 0, void 0, function () {
                var connectIteration, readIteration, returnValue, error, error, error, error, prop, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 13, , 14]);
                            connectIteration = 0;
                            readIteration = 0;
                            returnValue = false;
                            if (!!this.characteristic.connected) return [3 /*break*/, 2];
                            return [4 /*yield*/, this._connect()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            if (!!this.characteristic.connected) return [3 /*break*/, 4];
                            connectIteration++;
                            if (connectIteration === 250) {
                                error = new Error("As we couldn't connect to the " + this.type + " feature, the read operation can't be executed");
                                this.utilities.processEvent("error", this.type, error);
                                return [2 /*return*/, false];
                            }
                            // waiting a set amount of time for any ongoing BLE operation to conclude
                            return [4 /*yield*/, this.utilities.wait(20)];
                        case 3:
                            // waiting a set amount of time for any ongoing BLE operation to conclude
                            _a.sent();
                            return [3 /*break*/, 2];
                        case 4:
                            this.thingyController.addExecutedOperation(this.type, "read");
                            if (!this.hasProperty("read")) {
                                error = new Error("The " + this.type + " feature does not support the read method");
                                this.utilities.processEvent("error", this.type, error);
                                return [2 /*return*/, false];
                            }
                            if (!this.characteristic.decoder) {
                                error = new Error("The characteristic you're trying to read does not have a specified decoder");
                                this.utilities.processEvent("error", this.type, error);
                                return [2 /*return*/, false];
                            }
                            _a.label = 5;
                        case 5:
                            if (!(returnValue === false)) return [3 /*break*/, 12];
                            readIteration++;
                            if (readIteration === 250) {
                                error = new Error("We could not process your read request at the moment due to high operational traffic");
                                this.utilities.processEvent("error", this.type, error);
                                return [2 /*return*/, false];
                            }
                            if (!this.thingyController.getGattStatus()) return [3 /*break*/, 9];
                            this.thingyController.setGattStatus(false);
                            return [4 /*yield*/, this.characteristic.characteristic.readValue()];
                        case 6:
                            prop = _a.sent();
                            this.thingyController.setGattStatus(true);
                            if (!(returnRaw !== true)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.characteristic.decoder(prop)];
                        case 7:
                            prop = _a.sent();
                            _a.label = 8;
                        case 8:
                            returnValue = prop;
                            return [3 /*break*/, 11];
                        case 9: 
                        // waiting a set amount of time for any ongoing BLE operation to conclude
                        return [4 /*yield*/, this.utilities.wait(20)];
                        case 10:
                            // waiting a set amount of time for any ongoing BLE operation to conclude
                            _a.sent();
                            _a.label = 11;
                        case 11: return [3 /*break*/, 5];
                        case 12: return [2 /*return*/, returnValue];
                        case 13:
                            error_2 = _a.sent();
                            this.thingyController.setGattStatus(true);
                            this.utilities.processEvent("error", this.type, error_2);
                            return [2 /*return*/, false];
                        case 14: return [2 /*return*/];
                    }
                });
            });
        };
        this._write = function (prop) { return __awaiter(_this, void 0, void 0, function () {
            var error, connectIteration, writeIteration, returnValue, error, error, error, error, encodedProp, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 12, , 13]);
                        if (prop === undefined) {
                            error = new Error("You have to write a non-empty body");
                            this.utilities.processEvent("error", this.type, error);
                            return [2 /*return*/, false];
                        }
                        connectIteration = 0;
                        writeIteration = 0;
                        returnValue = false;
                        if (!!this.characteristic.connected) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._connect()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!!this.characteristic.connected) return [3 /*break*/, 4];
                        connectIteration++;
                        if (connectIteration === 250) {
                            error = new Error("As we couldn't connect to the " + this.type + " feature, the write operation can't be executed");
                            this.utilities.processEvent("error", this.type, error);
                            return [2 /*return*/, false];
                        }
                        // waiting a set amount of time for any ongoing BLE operation to conclude
                        return [4 /*yield*/, this.utilities.wait(20)];
                    case 3:
                        // waiting a set amount of time for any ongoing BLE operation to conclude
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 4:
                        this.thingyController.addExecutedOperation(this.type, "write");
                        if (!this.hasProperty("write") && !this.hasProperty("writeWithoutResponse")) {
                            error = new Error("The " + this.type + " feature does not support the write or writeWithoutResponse method");
                            this.utilities.processEvent("error", this.type, error);
                            return [2 /*return*/, false];
                        }
                        if (!this.characteristic.encoder) {
                            error = new Error("The characteristic you're trying to write does not have a specified encoder");
                            this.utilities.processEvent("error", this.type, error);
                            return [2 /*return*/, false];
                        }
                        _a.label = 5;
                    case 5:
                        if (!(returnValue === false)) return [3 /*break*/, 11];
                        writeIteration++;
                        if (writeIteration === 250) {
                            error = new Error("We could not process your read request at the moment due to high operational traffic");
                            this.utilities.processEvent("error", this.type, error);
                            return [2 /*return*/, false];
                        }
                        if (!this.thingyController.getGattStatus()) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.characteristic.encoder(prop)];
                    case 6:
                        encodedProp = _a.sent();
                        this.thingyController.setGattStatus(false);
                        return [4 /*yield*/, this.characteristic.characteristic.writeValue(encodedProp)];
                    case 7:
                        _a.sent();
                        this.thingyController.setGattStatus(true);
                        // emit event for successful write
                        this.utilities.processEvent("write", this.type, prop);
                        returnValue = true;
                        return [3 /*break*/, 10];
                    case 8: 
                    // waiting a set amount of time for any ongoing BLE operation to conclude
                    return [4 /*yield*/, this.utilities.wait(20)];
                    case 9:
                        // waiting a set amount of time for any ongoing BLE operation to conclude
                        _a.sent();
                        _a.label = 10;
                    case 10: return [3 /*break*/, 5];
                    case 11: return [2 /*return*/, returnValue];
                    case 12:
                        error_3 = _a.sent();
                        this.thingyController.setGattStatus(true);
                        this.utilities.processEvent("error", this.type, error_3);
                        return [2 /*return*/, false];
                    case 13: return [2 /*return*/];
                }
            });
        }); };
        this._notify = function (enable, verify) {
            if (verify === void 0) { verify = false; }
            return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                var error, connected, error, error, onReading, characteristic, csn, error_4, csn, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(enable === true || enable === false)) {
                                error = new Error("You have to specify the enable parameter (true/false)");
                                this.utilities.processEvent("error", this.type, error);
                                return [2 /*return*/];
                            }
                            if (!!this.characteristic.connected) return [3 /*break*/, 2];
                            return [4 /*yield*/, this._connect()];
                        case 1:
                            connected = _a.sent();
                            if (!connected) {
                                this.thingyController.enqueue(this.type, (enable ? "start" : "stop"), function () { return _this._notify(enable, verify); });
                                return [2 /*return*/, false];
                            }
                            _a.label = 2;
                        case 2:
                            this.thingyController.addExecutedOperation(this.type, (enable ? "start" : "stop"));
                            if (!this.hasProperty("notify") && (!this.hasProperty("indicate"))) {
                                error = new Error("The " + this.type + " feature does not support the start/stop methods");
                                this.utilities.processEvent("error", this.type, error);
                                return [2 /*return*/];
                            }
                            if (enable === this.characteristic.notifying) {
                                if (this.device.logEnabled) {
                                    console.log("The " + this.type + " feature has already " + (this.characteristic.notifying ? "enabled" : "disabled") + " notifications");
                                }
                                // could also just return, but technically the operation
                                // completed successfully as the desired outcome was achieved
                                return [2 /*return*/, true];
                            }
                            if (!this.characteristic.decoder) {
                                error = new Error("The characteristic you're trying to notify does not have a specified decoder");
                                this.utilities.processEvent("error", this.type, error);
                                return [2 /*return*/];
                            }
                            onReading = function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var data, error_6;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, this.characteristic.decoder(e.target.value)];
                                        case 1:
                                            data = _a.sent();
                                            if (verify) {
                                                /*ce = new CustomEvent("verifyReaction", {detail: {feature: this.type, data: decodedData}});
                                                this.dispatchEvent(ce);*/
                                            }
                                            else {
                                                this.utilities.processEvent(this.type, this.type, data);
                                            }
                                            return [3 /*break*/, 3];
                                        case 2:
                                            error_6 = _a.sent();
                                            this.utilities.processEvent("error", this.type, error_6);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); };
                            characteristic = this.characteristic.characteristic;
                            if (!this.thingyController.getGattStatus()) return [3 /*break*/, 11];
                            this.thingyController.setGattStatus(false);
                            if (!enable) return [3 /*break*/, 7];
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, characteristic.startNotifications()];
                        case 4:
                            csn = _a.sent();
                            this.thingyController.setGattStatus(true);
                            if (!this.characteristic.hasEventListener) {
                                csn.addEventListener("characteristicvaluechanged", function (e) { return onReading(e); });
                                this.characteristic.hasEventListener = true;
                            }
                            this.characteristic.notifying = true;
                            if (this.device.logEnabled) {
                                console.log("Notifications enabled for the " + this.type + " feature");
                            }
                            return [2 /*return*/, true];
                        case 5:
                            error_4 = _a.sent();
                            this.thingyController.setGattStatus(true);
                            this.thingyController.enqueue(this.type, (enable ? "start" : "stop"), function () { return _this._notify(enable, verify); });
                            this.characteristic.notifying = false;
                            this.utilities.processEvent("error", this.type, error_4);
                            return [2 /*return*/, false];
                        case 6: return [3 /*break*/, 10];
                        case 7:
                            _a.trys.push([7, 9, , 10]);
                            return [4 /*yield*/, characteristic.stopNotifications()];
                        case 8:
                            csn = _a.sent();
                            this.thingyController.setGattStatus(true);
                            this.characteristic.notifying = false;
                            // not ideal
                            if (this.type === "microphone") {
                                if (this.audioCtx) {
                                    this.suspendAudioContext();
                                }
                            }
                            if (this.device.logEnabled) {
                                console.log("Notifications disabled for the " + this.type + " feature");
                            }
                            return [2 /*return*/, true];
                        case 9:
                            error_5 = _a.sent();
                            this.thingyController.setGattStatus(true);
                            this.thingyController.enqueue(this.type, (enable ? "start" : "stop"), function () { return _this._notify(enable, verify); });
                            this.characteristic.notifying = true;
                            this.utilities.processEvent("error", this.type, error_5);
                            return [2 /*return*/, false];
                        case 10: return [3 /*break*/, 12];
                        case 11:
                            this.thingyController.enqueue(this.type, (enable ? "start" : "stop"), function () { return _this._notify(enable, verify); });
                            return [2 /*return*/, false];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        this.hasProperty = function (property) {
            return (_this.characteristic.characteristic.properties[property] === true ? true : false);
        };
        this.start = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._notify(true)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.stop = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._notify(false)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.read = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._read()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.write = function (data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._write(data)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.device = device;
        this.utilities = new Utilities(this.device);
        this.type = type || this.constructor.name;
        this.latestReading = new Map();
    }
    return FeatureOperations;
}());
export default FeatureOperations;
