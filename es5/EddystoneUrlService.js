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
var EddystoneUrlService = /** @class */ (function (_super) {
    __extends(EddystoneUrlService, _super);
    function EddystoneUrlService(device) {
        var _this = _super.call(this, device, "eddystone") || this;
        _this.decodeEddystoneData = function (data) {
            try {
                // According to Eddystone URL encoding specification, certain elements can be expanded: https://github.com/google/eddystone/tree/master/eddystone-url
                var prefixArray = ["http://www.", "https://www.", "http://", "https://"];
                var expansionCodes_1 = [
                    ".com/",
                    ".org/",
                    ".edu/",
                    ".net/",
                    ".info/",
                    ".biz/",
                    ".gov/",
                    ".com",
                    ".org",
                    ".edu",
                    ".net",
                    ".info",
                    ".biz",
                    ".gov",
                ];
                var prefix = prefixArray[data.getUint8(0)];
                var decoder = new TextDecoder();
                var url_1 = decoder.decode(data);
                url_1 = prefix + url_1.slice(1);
                expansionCodes_1.forEach(function (element, i) {
                    if (url_1.indexOf(String.fromCharCode(i)) !== -1) {
                        url_1 = url_1.replace(String.fromCharCode(i), expansionCodes_1[i]);
                    }
                });
                return new URL(url_1);
            }
            catch (error) {
                throw error;
            }
        };
        _this.encodeEddystoneData = function (data) {
            try {
                // Uses URL API to check for valid URL
                var url_2 = new URL(data);
                // Eddystone URL specification defines codes for URL scheme prefixes and expansion codes in the URL.
                // The array index corresponds to the defined code in the specification.
                // Details here: https://github.com/google/eddystone/tree/master/eddystone-url
                var prefixArray = ["http://www.", "https://www.", "http://", "https://"];
                var expansionCodes = [
                    ".com/",
                    ".org/",
                    ".edu/",
                    ".net/",
                    ".info/",
                    ".biz/",
                    ".gov/",
                    ".com",
                    ".org",
                    ".edu",
                    ".net",
                    ".info",
                    ".biz",
                    ".gov",
                ];
                var prefixCode_1 = null;
                var expansionCode_1 = null;
                var eddystoneUrl_1 = url_2.href;
                var len_1 = eddystoneUrl_1.length;
                prefixArray.forEach(function (element, i) {
                    if (url_2.href.indexOf(element) !== -1 && prefixCode_1 === null) {
                        prefixCode_1 = String.fromCharCode(i);
                        eddystoneUrl_1 = eddystoneUrl_1.replace(element, prefixCode_1);
                        len_1 -= element.length;
                    }
                });
                expansionCodes.forEach(function (element, i) {
                    if (url_2.href.indexOf(element) !== -1 && expansionCode_1 === null) {
                        expansionCode_1 = String.fromCharCode(i);
                        eddystoneUrl_1 = eddystoneUrl_1.replace(element, expansionCode_1);
                        len_1 -= element.length;
                    }
                });
                if (len_1 < 1 || len_1 > 14) {
                    var error = new Error("The URL can't be longer than 14 characters, excluding URL scheme such as \"https://\" and \".com/\".");
                    throw error;
                }
                var byteArray = new Uint8Array(eddystoneUrl_1.length);
                for (var i = 0; i < eddystoneUrl_1.length; i++) {
                    byteArray[i] = eddystoneUrl_1.charCodeAt(i);
                }
                return byteArray;
            }
            catch (error) {
                throw error;
            }
        };
        // gatt service and characteristic used to communicate with Thingy's Eddystone url
        _this.service = {
            uuid: _this.device.TCS_UUID,
        };
        _this.characteristic = {
            uuid: _this.device.TCS_EDDYSTONE_UUID,
            decoder: _this.decodeEddystoneData,
            encoder: _this.encodeEddystoneData,
        };
        return _this;
    }
    return EddystoneUrlService;
}(FeatureOperations));
export default EddystoneUrlService;
