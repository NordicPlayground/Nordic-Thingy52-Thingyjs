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
var ColorSensor = /** @class */ (function (_super) {
    __extends(ColorSensor, _super);
    function ColorSensor(device) {
        var _this = _super.call(this, device, "color") || this;
        _this.decodeColorData = function (data) {
            try {
                var littleEndian = true;
                var r = data.getUint16(0, littleEndian);
                var g = data.getUint16(2, littleEndian);
                var b = data.getUint16(4, littleEndian);
                var c = data.getUint16(6, littleEndian);
                var rRatio = r / (r + g + b);
                var gRatio = g / (r + g + b);
                var bRatio = b / (r + g + b);
                var clearAtBlack = 300;
                var clearAtWhite = 400;
                var clearDiff = clearAtWhite - clearAtBlack;
                var clearNormalized = (c - clearAtBlack) / clearDiff;
                if (clearNormalized < 0) {
                    clearNormalized = 0;
                }
                var red = rRatio * 255.0 * 3 * clearNormalized;
                if (red > 255) {
                    red = 255;
                }
                var green = gRatio * 255.0 * 3 * clearNormalized;
                if (green > 255) {
                    green = 255;
                }
                var blue = bRatio * 255.0 * 3 * clearNormalized;
                if (blue > 255) {
                    blue = 255;
                }
                var formattedData = {
                    red: parseInt(red.toFixed(0)),
                    green: parseInt(green.toFixed(0)),
                    blue: parseInt(blue.toFixed(0)),
                };
                return formattedData;
            }
            catch (error) {
                throw error;
            }
        };
        // gatt service and characteristic used to communicate with thingy's color sensor
        _this.service = {
            uuid: _this.device.TES_UUID,
        };
        _this.characteristic = {
            uuid: _this.device.TES_COLOR_UUID,
            decoder: _this.decodeColorData,
        };
        return _this;
    }
    return ColorSensor;
}(FeatureOperations));
export default ColorSensor;
