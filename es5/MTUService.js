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
var MTUService = /** @class */ (function (_super) {
    __extends(MTUService, _super);
    function MTUService(device) {
        var _this = _super.call(this, device, "mtu") || this;
        _this.decodeMtu = function (mtuSize) {
            try {
                var littleEndian = true;
                var mtu = mtuSize.getUint16(1, littleEndian);
                return mtu;
            }
            catch (error) {
                throw error;
            }
        };
        _this.encodeMtu = function (mtuSize, peripheralRequest) {
            if (peripheralRequest === void 0) { peripheralRequest = true; }
            try {
                if (mtuSize < 23 || mtuSize > 276) {
                    var e = new Error("MTU size must be in range 23 - 276 bytes");
                    throw e;
                }
                var dataArray = new Uint8Array(3);
                dataArray[0] = peripheralRequest ? 1 : 0;
                dataArray[1] = mtuSize & 0xff;
                dataArray[2] = (mtuSize >> 8) & 0xff;
                return dataArray;
            }
            catch (error) {
                throw error;
            }
        };
        // gatt service and characteristic used to communicate with Thingy's MTU
        _this.service = {
            uuid: _this.device.TCS_UUID,
        };
        _this.characteristic = {
            uuid: _this.device.TCS_MTU_REQUEST_UUID,
            decoder: _this.decodeMtu,
            encoder: _this.encodeMtu,
        };
        return _this;
    }
    return MTUService;
}(FeatureOperations));
export default MTUService;
