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
var Microphone = /** @class */ (function (_super) {
    __extends(Microphone, _super);
    function Microphone(device, eventListeners) {
        if (eventListeners === void 0) { eventListeners = []; }
        var _this = _super.call(this, device, "microphone") || this;
        _this.suspendAudioContext = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.audioCtx.suspend()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.decodeMicrophoneData = function (event) {
            var audioPacket = event.buffer;
            var adpcm = {
                header: new DataView(audioPacket.slice(0, 3)),
                data: new DataView(audioPacket.slice(3)),
            };
            var decodedAudio = _this._decodeAudio(adpcm);
            return decodedAudio;
        };
        _this.verifyMicrophoneAction = function () { return __awaiter(_this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.device.mtu._write(140)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this._decodeAudio = function (adpcm) {
            try {
                // Allocate output buffer
                var audioBufferDataLength = adpcm.data.byteLength;
                var audioBuffer = new ArrayBuffer(512);
                var pcm = new DataView(audioBuffer);
                var diff = void 0;
                var bufferStep = false;
                var inputBuffer = 0;
                var delta = 0;
                var sign = 0;
                var step = void 0;
                // The first 2 bytes of ADPCM frame are the predicted value
                var valuePredicted = adpcm.header.getInt16(0, false);
                // The 3rd byte is the index value
                var index = adpcm.header.getInt8(2);
                if (index < 0) {
                    index = 0;
                }
                if (index > 88) {
                    index = 88;
                }
                step = _this._MICROPHONE_STEP_SIZE_TABLE[index];
                for (var _in = 0, _out = 0; _in < audioBufferDataLength; _out += 2) {
                    /* Step 1 - get the delta value */
                    if (bufferStep) {
                        delta = inputBuffer & 0x0F;
                        _in++;
                    }
                    else {
                        inputBuffer = adpcm.data.getInt8(_in);
                        delta = (inputBuffer >> 4) & 0x0F;
                    }
                    bufferStep = !bufferStep;
                    /* Step 2 - Find new index value (for later) */
                    index += _this._MICROPHONE_INDEX_TABLE[delta];
                    if (index < 0) {
                        index = 0;
                    }
                    if (index > 88) {
                        index = 88;
                    }
                    /* Step 3 - Separate sign and magnitude */
                    sign = delta & 8;
                    delta = delta & 7;
                    /* Step 4 - Compute difference and new predicted value */
                    diff = (step >> 3);
                    if ((delta & 4) > 0) {
                        diff += step;
                    }
                    if ((delta & 2) > 0) {
                        diff += (step >> 1);
                    }
                    if ((delta & 1) > 0) {
                        diff += (step >> 2);
                    }
                    if (sign > 0) {
                        valuePredicted -= diff;
                    }
                    else {
                        valuePredicted += diff;
                    }
                    /* Step 5 - clamp output value */
                    if (valuePredicted > 32767) {
                        valuePredicted = 32767;
                    }
                    else if (valuePredicted < -32768) {
                        valuePredicted = -32768;
                    }
                    /* Step 6 - Update step value */
                    step = _this._MICROPHONE_STEP_SIZE_TABLE[index];
                    /* Step 7 - Output value */
                    pcm.setInt16(_out, valuePredicted, true);
                }
                return pcm;
            }
            catch (error) {
                throw error;
            }
        };
        _this.play = function (audio) {
            if (_this._audioStack === undefined) {
                _this._audioStack = [];
            }
            _this._audioStack.push(audio);
            if (_this._audioStack.length) {
                _this._scheduleAudioBuffers();
            }
        };
        _this._scheduleAudioBuffers = function () {
            while (_this._audioStack.length > 0) {
                var bufferTime = 0.01; // Buffer time in seconds before initial audio chunk is played
                var buffer = _this._audioStack.shift();
                var channels = 1;
                var framecount = buffer.byteLength / 2;
                if (_this._audioNextTime === undefined) {
                    _this._audioNextTime = 0;
                }
                if (_this.audioCtx.state === "suspended") {
                    _this.audioCtx.resume();
                }
                var myArrayBuffer = _this.audioCtx.createBuffer(channels, framecount, 16000);
                // This gives us the actual array that contains the data
                var nowBuffering = myArrayBuffer.getChannelData(0);
                for (var i = 0; i < buffer.byteLength / 2; i++) {
                    nowBuffering[i] = buffer.getInt16(2 * i, true) / 32768.0;
                }
                var source = _this.audioCtx.createBufferSource();
                source.buffer = myArrayBuffer;
                source.connect(_this.audioCtx.destination);
                if (_this._audioNextTime === 0) {
                    _this._audioNextTime = _this.audioCtx.currentTime + bufferTime;
                }
                source.start(_this._audioNextTime);
                _this._audioNextTime += source.buffer.duration;
            }
        };
        // gatt service and characteristic used to communicate with Thingy's microphone
        _this.service = {
            uuid: _this.device.TSS_UUID,
        };
        _this.characteristic = {
            uuid: _this.device.TSS_MIC_UUID,
            decoder: _this.decodeMicrophoneData,
        };
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        _this.audioCtx = new AudioContext();
        _this._MICROPHONE_INDEX_TABLE = [-1, -1, -1, -1, 2, 4, 6, 8, -1, -1, -1, -1, 2, 4, 6, 8];
        _this._MICROPHONE_STEP_SIZE_TABLE = [7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45, 50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 157, 173, 190, 209,
            230, 253, 279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724, 796, 876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358,
            5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899, 15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767];
        return _this;
    }
    Microphone.prototype.verifyMicrophoneReaction = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var microphoneData, e, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.getGattAvailable()) return [3 /*break*/, 7];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        microphoneData = data.detail.data;
                        return [4 /*yield*/, this._notify(false, true)];
                    case 2:
                        _a.sent();
                        this.removeEventListener("verifyReaction", this.characteristic.verifyReaction);
                        if (!(microphoneData.byteLength === 131)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._notify(true)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        console.log(microphoneData.byteLength);
                        e = new Error("Your device does not currently support the use of Thingy's microphone. Check back at a later date.");
                        this.notifyError(e);
                        throw e;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        throw error_2;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return Microphone;
}(FeatureOperations));
export default Microphone;
