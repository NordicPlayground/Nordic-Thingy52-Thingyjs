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

class NameService extends FeatureOperations {
  constructor(device) {
    super(device, "name");

    // gatt service and characteristic used to communicate with Thingy's name configuration
    this.service = {
      uuid: this.device.TCS_UUID,
    };

    this.characteristic = {
      uuid: this.device.TCS_NAME_UUID,
      decoder: this.decodeName.bind(this),
      encoder: this.encodeName.bind(this),
    };
  }

  decodeName(data) {
    try {
      const decoder = new TextDecoder();
      const name = decoder.decode(data);
      const decodedName = {
        name: name,
      };
      return decodedName;
    } catch (error) {
      throw error;
    }
  }

  encodeName(data) {
    try {
      if (data.length > 10) {
        return Promise.reject(new TypeError("The name can't be more than 10 characters long."));
      }
      const encodedName = new Uint8Array(data.length);

      for (let i = 0; i < data.length; i += 1) {
        encodedName[i] = data.charCodeAt(i);
      }
      return encodedName;
    } catch (error) {
      throw error;
    }
  }
}

export default NameService;
