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
var AdvertisingParametersService = /** @class */ (function (_super) {
    __extends(AdvertisingParametersService, _super);
    function AdvertisingParametersService(device) {
        var _this = _super.call(this, device, "advertisingparameters") || this;
        _this.decodeAdvertisingParam = function (data) {
            try {
                // Interval is given in units of 0.625 milliseconds
                var littleEndian = true;
                var interval = (data.getUint16(0, littleEndian) * 0.625).toFixed(0);
                var timeout = data.getUint8(2);
                var decodedAdvertisingParams = {
                    interval: interval,
                    timeout: timeout,
                };
                return decodedAdvertisingParams;
            }
            catch (error) {
                throw error;
            }
        };
        _this.encodeAdvertisingParam = function (params) { return __awaiter(_this, void 0, void 0, function () {
            var error, error, interval, timeout, error, error, receivedData, littleEndian, dataArray, i, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (typeof params !== "object") {
                            error = new Error("The argument has to be an object.");
                            throw error;
                        }
                        if ((params.interval === undefined) && (params.timeout === undefined)) {
                            error = new RangeError("The argument has to be an object with at least one of the properties 'interval' or 'timeout': {interval: someInterval, timeout: someTimeout}");
                            throw error;
                        }
                        interval = params.interval;
                        timeout = params.timeout;
                        // Check parameters
                        if (interval !== undefined) {
                            if (interval < 20 || interval > 5000) {
                                error = new RangeError("The advertising interval must be within the range of 20 ms to 5 000 ms");
                                throw error;
                            }
                            // Interval is in units of 0.625 ms.
                            interval = interval * 1.6;
                        }
                        if (timeout !== undefined) {
                            if (timeout < 0 || timeout > 180) {
                                error = new RangeError("The advertising timeout must be within the range of 0 to 180 s");
                                throw error;
                            }
                        }
                        return [4 /*yield*/, this._read(true)];
                    case 1:
                        receivedData = _a.sent();
                        littleEndian = true;
                        interval = interval || receivedData.getUint16(0, littleEndian);
                        timeout = timeout || receivedData.getUint8(2, littleEndian);
                        dataArray = new Uint8Array(3);
                        for (i = 0; i < dataArray.length; i++) {
                            dataArray[i] = receivedData.getUint8(i);
                        }
                        dataArray[0] = interval & 0xff;
                        dataArray[1] = (interval >> 8) & 0xff;
                        dataArray[2] = timeout;
                        return [2 /*return*/, dataArray];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        // gatt service and characteristic used to communicate with thingy's advertising parameters configuration
        _this.service = {
            uuid: _this.device.TCS_UUID,
        };
        _this.characteristic = {
            uuid: _this.device.TCS_ADV_PARAMS_UUID,
            decoder: _this.decodeAdvertisingParam,
            encoder: _this.encodeAdvertisingParam,
        };
        return _this;
    }
    return AdvertisingParametersService;
}(FeatureOperations));
export default AdvertisingParametersService;
