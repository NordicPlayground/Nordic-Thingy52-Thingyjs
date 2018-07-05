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

import FeatureOperations from "./FeatureOperations.js";

class EddystoneUrlService extends FeatureOperations {
  constructor(device) {
    super(device, "eddystone");

    // gatt service and characteristic used to communicate with Thingy's Eddystone url
    this.service = {
      uuid: this.device.TCS_UUID,
    };

    this.characteristic = {
      uuid: this.device.TCS_EDDYSTONE_UUID,
      decoder: this.decodeEddystoneData.bind(this),
      encoder: this.encodeEddystoneData.bind(this),
    };
  }

  decodeEddystoneData(data) {
    try {
      // According to Eddystone URL encoding specification, certain elements can be expanded: https://github.com/google/eddystone/tree/master/eddystone-url
      const prefixArray = ["http://www.", "https://www.", "http://", "https://"];
      const expansionCodes = [
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
      const prefix = prefixArray[data.getUint8(0)];
      const decoder = new TextDecoder();
      let url = decoder.decode(data);
      url = prefix + url.slice(1);

      expansionCodes.forEach((element, i) => {
        if (url.indexOf(String.fromCharCode(i)) !== -1) {
          url = url.replace(String.fromCharCode(i), expansionCodes[i]);
        }
      });

      return new URL(url);
    } catch (error) {
      throw error;
    }
  }

  encodeEddystoneData(data) {
    try {
      // Uses URL API to check for valid URL
      const url = new URL(data);

      // Eddystone URL specification defines codes for URL scheme prefixes and expansion codes in the URL.
      // The array index corresponds to the defined code in the specification.
      // Details here: https://github.com/google/eddystone/tree/master/eddystone-url
      const prefixArray = ["http://www.", "https://www.", "http://", "https://"];
      const expansionCodes = [
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

      let prefixCode = null;
      let expansionCode = null;
      let eddystoneUrl = url.href;
      let len = eddystoneUrl.length;

      prefixArray.forEach((element, i) => {
        if (url.href.indexOf(element) !== -1 && prefixCode === null) {
          prefixCode = String.fromCharCode(i);
          eddystoneUrl = eddystoneUrl.replace(element, prefixCode);
          len -= element.length;
        }
      });

      expansionCodes.forEach((element, i) => {
        if (url.href.indexOf(element) !== -1 && expansionCode === null) {
          expansionCode = String.fromCharCode(i);
          eddystoneUrl = eddystoneUrl.replace(element, expansionCode);
          len -= element.length;
        }
      });

      if (len < 1 || len > 14) {
        const error = new Error("The URL can't be longer than 14 characters, excluding URL scheme such as \"https://\" and \".com/\".");
        throw error;
      }

      const byteArray = new Uint8Array(eddystoneUrl.length);

      for (let i = 0; i < eddystoneUrl.length; i++) {
        byteArray[i] = eddystoneUrl.charCodeAt(i);
      }

      return byteArray;
    } catch (error) {
      throw error;
    }
  }
}

export default EddystoneUrlService;
