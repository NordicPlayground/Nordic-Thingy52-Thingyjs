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
import FeatureOperations from "./FeatureOperations.js";
var EnvironmentConfigurationService = /** @class */ (function (_super) {
    __extends(EnvironmentConfigurationService, _super);
    function EnvironmentConfigurationService(device) {
        var _this = _super.call(this, device, "environmentconfiguration") || this;
        _this.decodeConfigData = function (data) {
            try {
                var littleEndian = true;
                var temperatureInterval = data.getUint16(0, littleEndian);
                var pressureInterval = data.getUint16(2, littleEndian);
                var humidityInterval = data.getUint16(4, littleEndian);
                var colorInterval = data.getUint16(6, littleEndian);
                var gasInterval = data.getUint8(8);
                var colorSensorRed = data.getUint8(9);
                var colorSensorGreen = data.getUint8(10);
                var colorSensorBlue = data.getUint8(11);
                if (gasInterval === 1) {
                    gasInterval = 1;
                }
                else if (gasInterval === 2) {
                    gasInterval = 10;
                }
                else if (gasInterval === 3) {
                    gasInterval = 60;
                }
                var formattedData = {
                    temperatureInterval: temperatureInterval,
                    pressureInterval: pressureInterval,
                    humidityInterval: humidityInterval,
                    colorInterval: colorInterval,
                    gasInterval: gasInterval,
                    colorSensorCalibration: {
                        red: colorSensorRed,
                        green: colorSensorGreen,
                        blue: colorSensorBlue,
                    },
                };
                return formattedData;
            }
            catch (error) {
                throw error;
            }
        };
        _this.encodeConfigData = function (params) { return __awaiter(_this, void 0, void 0, function () {
            var temperatureInterval, pressureInterval, humidityInterval, colorInterval, gasInterval, colorSensorCalibration, e, colorSensorRed, colorSensorGreen, colorSensorBlue, receivedData, littleEndian, dataArray, i, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (typeof params !== "object") {
                            return [2 /*return*/, Promise.reject(new TypeError("The argument has to be an object."))];
                        }
                        if ((params.temperatureInterval === undefined) && (params.pressureInterval === undefined) && (params.humidityInterval === undefined) && (params.colorInterval === undefined) && (params.gasInterval === undefined) && (params.colorSensorCalibration === undefined)) {
                            return [2 /*return*/, Promise.reject(new TypeError("The argument has to be an object with at least one of the properties 'temperatureInterval', 'pressureInterval', 'humidityInterval', 'colorInterval', 'gasInterval' or 'colorSensorCalibration'."))];
                        }
                        temperatureInterval = params.temperatureInterval;
                        pressureInterval = params.pressureInterval;
                        humidityInterval = params.humidityInterval;
                        colorInterval = params.colorInterval;
                        gasInterval = params.gasInterval;
                        colorSensorCalibration = params.colorSensorCalibration;
                        if (temperatureInterval !== undefined) {
                            if (temperatureInterval < 100 || temperatureInterval > 60000) {
                                return [2 /*return*/, Promise.reject(new RangeError("The temperature sensor sampling interval must be in the range 100 ms - 60 000 ms"))];
                            }
                        }
                        if (pressureInterval !== undefined) {
                            if (pressureInterval < 50 || pressureInterval > 60000) {
                                return [2 /*return*/, Promise.reject(new RangeError("The pressure sensor sampling interval must be in the range 50 ms - 60 000 ms"))];
                            }
                        }
                        if (humidityInterval !== undefined) {
                            if (humidityInterval < 100 || humidityInterval > 60000) {
                                return [2 /*return*/, Promise.reject(new RangeError("The humidity sensor sampling interval must be in the range 100 ms - 60 000 ms"))];
                            }
                        }
                        if (colorInterval !== undefined) {
                            if (colorInterval < 200 || colorInterval > 60000) {
                                return [2 /*return*/, Promise.reject(new RangeError("The color sensor sampling interval must be in the range 200 ms - 60 000 ms"))];
                            }
                        }
                        if (gasInterval !== undefined) {
                            if (gasInterval === 1) {
                                gasInterval = 1;
                            }
                            else if (gasInterval === 10) {
                                gasInterval = 2;
                            }
                            else if (gasInterval === 60) {
                                gasInterval = 3;
                            }
                            else {
                                e = new RangeError("The gas sensor sampling interval has to be 1, 10 or 60 seconds.");
                                throw e;
                            }
                        }
                        colorSensorRed = void 0;
                        colorSensorGreen = void 0;
                        colorSensorBlue = void 0;
                        if (colorSensorCalibration !== undefined) {
                            if (typeof colorSensorCalibration !== "object") {
                                return [2 /*return*/, Promise.reject(new TypeError("The colorSensorCalibration argument has to be an object."))];
                            }
                            if (colorSensorCalibration.red === undefined || colorSensorCalibration.green === undefined || colorSensorCalibration.blue === undefined) {
                                return [2 /*return*/, Promise.reject(new TypeError("The colorSensorCalibration argument has to be an object with the properties red, green and blue."))];
                            }
                            colorSensorRed = colorSensorCalibration.red;
                            colorSensorGreen = colorSensorCalibration.green;
                            colorSensorBlue = colorSensorCalibration.blue;
                        }
                        return [4 /*yield*/, this._read(true)];
                    case 1:
                        receivedData = _a.sent();
                        littleEndian = true;
                        temperatureInterval = temperatureInterval || receivedData.getUint16(0, littleEndian);
                        pressureInterval = pressureInterval || receivedData.getUint16(2, littleEndian);
                        humidityInterval = humidityInterval || receivedData.getUint16(4, littleEndian);
                        colorInterval = colorInterval || receivedData.getUint16(6, littleEndian);
                        gasInterval = gasInterval || receivedData.getUint8(8);
                        colorSensorRed = colorSensorRed || receivedData.getUint8(9);
                        colorSensorGreen = colorSensorGreen || receivedData.getUint8(10);
                        colorSensorBlue = colorSensorBlue || receivedData.getUint8(11);
                        dataArray = new Uint8Array(12);
                        for (i = 0; i < dataArray.length; i++) {
                            dataArray[i] = receivedData.getUint8(i);
                        }
                        dataArray[0] = temperatureInterval & 0xff;
                        dataArray[1] = (temperatureInterval >> 8) & 0xff;
                        dataArray[2] = pressureInterval & 0xff;
                        dataArray[3] = (pressureInterval >> 8) & 0xff;
                        dataArray[4] = humidityInterval & 0xff;
                        dataArray[5] = (humidityInterval >> 8) & 0xff;
                        dataArray[6] = colorInterval & 0xff;
                        dataArray[7] = (colorInterval >> 8) & 0xff;
                        dataArray[8] = gasInterval;
                        dataArray[9] = colorSensorRed;
                        dataArray[10] = colorSensorGreen;
                        dataArray[11] = colorSensorBlue;
                        return [2 /*return*/, dataArray];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        // gatt service and characteristic used to communicate with thingy's environment configuration characteristic
        _this.service = {
            uuid: _this.device.TES_UUID,
        };
        _this.characteristic = {
            uuid: _this.device.TES_CONFIG_UUID,
            decoder: _this.decodeConfigData,
            encoder: _this.encodeConfigData,
        };
        return _this;
    }
    return EnvironmentConfigurationService;
}(FeatureOperations));
export default EnvironmentConfigurationService;
