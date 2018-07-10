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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import FeatureOperations from "./FeatureOperations.js";
var ConnectionParametersService = /** @class */ (function (_super) {
    __extends(ConnectionParametersService, _super);
    function ConnectionParametersService(device) {
        var _this = _super.call(this, device, "connectionparameters") || this;
        _this.decodeConnectionParam = function (data) {
            try {
                // Connection intervals are given in units of 1.25 ms
                var littleEndian = true;
                var minConnInterval = data.getUint16(0, littleEndian) * 1.25;
                var maxConnInterval = data.getUint16(2, littleEndian) * 1.25;
                var slaveLatency = data.getUint16(4, littleEndian);
                // Supervision timeout is given i units of 10 ms
                var supervisionTimeout = data.getUint16(6, littleEndian) * 10;
                var params = {
                    minInterval: minConnInterval,
                    maxInterval: maxConnInterval,
                    slaveLatency: slaveLatency,
                    timeout: supervisionTimeout,
                };
                return params;
            }
            catch (error) {
                throw error;
            }
        };
        _this.encodeConnectionParam = function (params) { return __awaiter(_this, void 0, void 0, function () {
            var error, error, timeout, slaveLatency, minInterval, maxInterval, error, error, error, error, receivedData, littleEndian, error, dataArray, i, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (typeof params !== "object") {
                            error = new Error("The argument has to be an object.");
                            throw error;
                        }
                        if ((params.timeout === undefined) && (params.slaveLatency === undefined) && (params.minInterval === undefined) && (params.maxInterval === undefined)) {
                            error = new Error("The argument has to be an object with at least one of the properties 'timeout', 'slaveLatency', 'minInterval' or 'maxInterval'.");
                            throw error;
                        }
                        timeout = params.timeout;
                        slaveLatency = params.slaveLatency;
                        minInterval = params.minInterval;
                        maxInterval = params.maxInterval;
                        // Check parameters
                        if (timeout !== undefined) {
                            if (timeout < 100 || timeout > 32000) {
                                error = new Error("The supervision timeout must be in the range from 100 ms to 32 000 ms.");
                                throw error;
                            }
                            // The supervision timeout has to be set in units of 10 ms
                            timeout = Math.round(timeout / 10);
                        }
                        if (slaveLatency !== undefined) {
                            if (slaveLatency < 0 || slaveLatency > 499) {
                                error = new Error("The slave latency must be in the range from 0 to 499 connection intervals.");
                                throw error;
                            }
                        }
                        if (minInterval !== undefined) {
                            if (minInterval < 7.5 || minInterval > maxInterval) {
                                error = new Error("The minimum connection interval must be greater than 7.5 ms and <= maximum interval");
                                throw error;
                            }
                            // Interval is in units of 1.25 ms.
                            minInterval = Math.round(minInterval * 0.8);
                        }
                        if (maxInterval !== undefined) {
                            if (maxInterval > 4000 || maxInterval < minInterval) {
                                error = new Error("The minimum connection interval must be less than 4 000 ms and >= minimum interval");
                                throw error;
                            }
                            // Interval is in units of 1.25 ms.
                            maxInterval = Math.round(maxInterval * 0.8);
                        }
                        return [4 /*yield*/, this._read(true)];
                    case 1:
                        receivedData = _a.sent();
                        littleEndian = true;
                        minInterval = minInterval || receivedData.getUint16(0, littleEndian);
                        maxInterval = maxInterval || receivedData.getUint16(2, littleEndian);
                        slaveLatency = slaveLatency || receivedData.getUint16(4, littleEndian);
                        timeout = timeout || receivedData.getUint16(6, littleEndian);
                        // Check that the timeout obeys  conn_sup_timeout * 4 > (1 + slave_latency) * max_conn_interval
                        if (timeout * 4 < (1 + slaveLatency) * maxInterval) {
                            error = new Error("The supervision timeout in milliseconds must be greater than (1 + slaveLatency) * maxConnInterval * 2, where maxConnInterval is also given in milliseconds.");
                            throw error;
                        }
                        dataArray = new Uint8Array(8);
                        for (i = 0; i < dataArray.length; i++) {
                            dataArray[i] = receivedData.getUint8(i);
                        }
                        dataArray[0] = minInterval & 0xff;
                        dataArray[1] = (minInterval >> 8) & 0xff;
                        dataArray[2] = maxInterval & 0xff;
                        dataArray[3] = (maxInterval >> 8) & 0xff;
                        dataArray[4] = slaveLatency & 0xff;
                        dataArray[5] = (slaveLatency >> 8) & 0xff;
                        dataArray[6] = timeout & 0xff;
                        dataArray[7] = (timeout >> 8) & 0xff;
                        return [2 /*return*/, dataArray];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        // gatt service and characteristic used to communicate with Thingy's connection parameters configuration
        _this.service = {
            uuid: _this.device.TCS_UUID,
        };
        _this.characteristic = {
            uuid: _this.device.TCS_CONN_PARAMS_UUID,
            decoder: _this.decodeConnectionParam,
            encoder: _this.encodeConnectionParam,
        };
        return _this;
    }
    return ConnectionParametersService;
}(FeatureOperations));
export default ConnectionParametersService;
