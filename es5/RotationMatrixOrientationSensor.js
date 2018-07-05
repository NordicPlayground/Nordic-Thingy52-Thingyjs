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
var RotationMatrixOrientationSensor = /** @class */ (function (_super) {
    __extends(RotationMatrixOrientationSensor, _super);
    function RotationMatrixOrientationSensor(device) {
        var _this = _super.call(this, device, "rotationmatrixorientation") || this;
        _this.decodeRotationData = function (data) {
            try {
                // Divide by 2^2 = 4 to get correct values
                var r1c1 = data.getInt16(0, true) / 4;
                var r1c2 = data.getInt16(0, true) / 4;
                var r1c3 = data.getInt16(0, true) / 4;
                var r2c1 = data.getInt16(0, true) / 4;
                var r2c2 = data.getInt16(0, true) / 4;
                var r2c3 = data.getInt16(0, true) / 4;
                var r3c1 = data.getInt16(0, true) / 4;
                var r3c2 = data.getInt16(0, true) / 4;
                var r3c3 = data.getInt16(0, true) / 4;
                var formattedData = {
                    row1: [r1c1, r1c2, r1c3],
                    row2: [r2c1, r2c2, r2c3],
                    row3: [r3c1, r3c2, r3c3],
                };
                return formattedData;
            }
            catch (error) {
                throw error;
            }
        };
        // gatt service and characteristic used to communicate with Thingy's rotation matrix sensor
        _this.service = {
            uuid: _this.device.TMS_UUID,
        };
        _this.characteristic = {
            uuid: _this.device.TMS_ROT_MATRIX_UUID,
            decoder: _this.decodeRotationData.bind(_this),
        };
        return _this;
    }
    return RotationMatrixOrientationSensor;
}(FeatureOperations));
export default RotationMatrixOrientationSensor;
