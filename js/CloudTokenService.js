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

class CloudTokenService extends FeatureOperations {
  constructor(device) {
    super(device, "cloudtoken");

    // gatt service and characteristic used to communicate with Thingy's cloud configuration
    this.service = {
      uuid: this.device.TCS_UUID,
    };

    this.characteristic = {
      uuid: this.device.TCS_CLOUD_TOKEN_UUID,
      decoder: this.decodeCloudToken.bind(this),
      encoder: this.encodeCloudToken.bind(this),
    };
  }

  decodeCloudToken(data) {
    try {
      const decoder = new TextDecoder();
      const token = decoder.decode(data);

      const decodedToken = {
        token: token,
      };
      return decodedToken;
    } catch (error) {
      throw error;
    }
  }

  encodeCloudToken(token) {
    try {
      if (token.length > 250) {
        const error = new Error("The length of the cloud token can not exceed 250 characters.");
        throw error;
      }

      const encoder = new TextEncoder();
      const encodedToken = encoder.encode(token);

      return encodedToken;
    } catch (error) {
      throw error;
    }
  }
}

export default CloudTokenService;
