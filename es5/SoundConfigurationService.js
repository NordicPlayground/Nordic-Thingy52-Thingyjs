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
var SoundConfigurationService = /** @class */ (function (_super) {
    __extends(SoundConfigurationService, _super);
    function SoundConfigurationService(device) {
        var _this = _super.call(this, device, "soundconfiguration") || this;
        _this.decodeSoundConfigurationData = function (data) {
            try {
                var speakerMode = data.getUint8(0);
                var microphoneMode = data.getUint8(1);
                var decodedSoundConfiguration = {
                    speakerMode: speakerMode,
                    microphoneMode: microphoneMode,
                };
                return decodedSoundConfiguration;
            }
            catch (error) {
                throw error;
            }
        };
        _this.encodeSoundConfigurationData = function (data) { return __awaiter(_this, void 0, void 0, function () {
            var speakerMode, microphoneMode, receivedData, dataArray, i, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (typeof data !== "object") {
                            return [2 /*return*/, Promise.reject(new TypeError("The argument has to be an object."))];
                        }
                        if ((data.speakerMode === undefined) && (data.microphoneMode === undefined)) {
                            return [2 /*return*/, Promise.reject(new TypeError("The argument has to be an object with at least one of the properties speakerMode and microphoneMode."))];
                        }
                        speakerMode = data.speakerMode;
                        microphoneMode = data.microphoneMode;
                        if (speakerMode !== undefined) {
                            if (!(speakerMode === 1 || speakerMode === 2 || speakerMode === 3)) {
                                return [2 /*return*/, Promise.reject(new RangeError("The speaker mode must be one of the integers 1, 2 or 3."))];
                            }
                        }
                        if (microphoneMode !== undefined) {
                            if (!(microphoneMode === 1 || microphoneMode === 2)) {
                                return [2 /*return*/, Promise.reject(new RangeError("The microphone mode must be one of the integers 1 or 2."))];
                            }
                        }
                        return [4 /*yield*/, this._read(true)];
                    case 1:
                        receivedData = _a.sent();
                        speakerMode = speakerMode || receivedData.getUint8(0);
                        microphoneMode = microphoneMode || receivedData.getUint8(1);
                        dataArray = new Uint8Array(2);
                        for (i = 0; i < dataArray.length; i++) {
                            dataArray[i] = receivedData.getUint8(i);
                        }
                        dataArray[0] = speakerMode & 0xff;
                        dataArray[1] = microphoneMode & 0xff;
                        return [2 /*return*/, dataArray];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        // gatt service and characteristic used to communicate with Thingy's sound service
        _this.service = {
            uuid: _this.device.TSS_UUID,
        };
        _this.characteristic = {
            uuid: _this.device.TSS_CONFIG_UUID,
            decoder: _this.decodeSoundConfigurationData,
            encoder: _this.encodeSoundConfigurationData,
        };
        return _this;
    }
    return SoundConfigurationService;
}(FeatureOperations));
export default SoundConfigurationService;
