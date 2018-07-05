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
import FeatureOperations from "./FeatureOperations.js";
var LEDService = /** @class */ (function (_super) {
    __extends(LEDService, _super);
    function LEDService(device) {
        var _this = _super.call(this, device, "led") || this;
        _this.decodeLedData = function (data) {
            try {
                var mode = data.getUint8(0);
                var littleEndian = true;
                var status_1;
                switch (mode) {
                    case 0:
                        status_1 = {
                            mode: mode,
                        };
                        break;
                    case 1:
                        status_1 = {
                            mode: mode,
                            r: data.getUint8(1),
                            g: data.getUint8(2),
                            b: data.getUint8(3),
                        };
                        break;
                    case 2:
                        status_1 = {
                            mode: mode,
                            color: data.getUint8(1),
                            intensity: data.getUint8(2),
                            delay: data.getUint16(3, littleEndian),
                        };
                        break;
                    case 3:
                        status_1 = {
                            mode: mode,
                            color: data.getUint8(1),
                            intensity: data.getUint8(2),
                        };
                        break;
                }
                return status_1;
            }
            catch (error) {
                throw error;
            }
        };
        // gatt service and characteristic used to communicate with Thingy's LED
        _this.service = {
            uuid: _this.device.TUIS_UUID,
        };
        _this.characteristic = {
            uuid: _this.device.TUIS_LED_UUID,
            decoder: _this.decodeLedData,
            encoder: _this.encodeLedData,
        };
        return _this;
    }
    LEDService.prototype.encodeLedData = function (data) {
        try {
            var dataArray = void 0;
            if (!data.mode) {
                var error = new Error("You must specify a LED mode");
                throw error;
            }
            switch (data.mode) {
                case "constant": {
                    if (data.red === undefined || data.green === undefined || data.blue === undefined) {
                        var e = new Error("The options object for constant mode must contain the properties 'red', 'green', and 'blue'.");
                        throw e;
                    }
                    if (data.red < 0 ||
                        data.red > 255 ||
                        data.green < 0 ||
                        data.green > 255 ||
                        data.blue < 0 ||
                        data.blue > 255) {
                        var e = new Error("The color values must be in the range 0 - 255");
                        throw e;
                    }
                    dataArray = new Uint8Array([1, data.red, data.green, data.blue]);
                    break;
                }
                case "breathe": {
                    if (data.color === undefined || data.intensity === undefined || data.delay === undefined) {
                        var e = new Error("The options object for breathe mode must have the properties 'color', 'intensity' and 'delay'.");
                        throw e;
                    }
                    var colors = ["red", "green", "yellow", "blue", "purple", "cyan", "white"];
                    var colorCode = void 0;
                    if (colors.indexOf(data.color) > -1) {
                        colorCode = colors.indexOf(data.color) + 1;
                    }
                    else if (typeof data.color === "number" && (data.color > 0 && data.color < 8)) {
                        colorCode = data.color;
                    }
                    else {
                        var e = new Error("The color must either be a recognized color (" + colors.join(", ") + "), or an integer in the interval 1 - 7");
                        throw e;
                    }
                    if (data.intensity < 0 || data.intensity > 100) {
                        var e = new Error("The intensity must be an integer in the interval 0 - 100");
                        throw e;
                    }
                    if (data.delay < 50 || data.delay > 10000) {
                        var e = new Error("The delay must be an integer in the interval 50 - 10 000");
                        throw e;
                    }
                    dataArray = new Uint8Array([2, colorCode, data.intensity, data.delay & 0xff, (data.delay >> 8) & 0xff]);
                    break;
                }
                case "oneshot": {
                    if (data.color === undefined || data.intensity === undefined) {
                        var e = new Error("The options object for the one shot mode must have the properties 'color' and 'intensity.");
                        throw e;
                    }
                    if (data.color < 1 || data.color > 7) {
                        var e = new Error("The color must either be a recognized color or an integer in the interval 1 - 7");
                        throw e;
                    }
                    if (data.intensity < 0 || data.intensity > 100) {
                        var e = new Error("The intensity must be an integer in the interval 0 - 100");
                        throw e;
                    }
                    dataArray = new Uint8Array([3, data.color, data.intensity]);
                    break;
                }
                case "off": {
                    dataArray = new Uint8Array([0]);
                    break;
                }
                default: {
                    dataArray = new Uint8Array([2, 6, 20, 3500]);
                    break;
                }
            }
            return dataArray;
        }
        catch (error) {
            throw error;
        }
    };
    return LEDService;
}(FeatureOperations));
export default LEDService;
