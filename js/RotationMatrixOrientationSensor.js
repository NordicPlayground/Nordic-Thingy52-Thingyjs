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

class RotationMatrixOrientationSensor extends FeatureOperations {
  constructor(device) {
    super(device, "rotationmatrixorientation");

    // gatt service and characteristic used to communicate with Thingy's rotation matrix sensor
    this.service = {
      uuid: this.device.TMS_UUID,
    };

    this.characteristic = {
      uuid: this.device.TMS_ROT_MATRIX_UUID,
      decoder: this.decodeRotationData.bind(this),
    };
  }

  decodeRotationData(data) {
    try {
      // Divide by 2^2 = 4 to get correct values
      const r1c1 = data.getInt16(0, true) / 4;
      const r1c2 = data.getInt16(0, true) / 4;
      const r1c3 = data.getInt16(0, true) / 4;
      const r2c1 = data.getInt16(0, true) / 4;
      const r2c2 = data.getInt16(0, true) / 4;
      const r2c3 = data.getInt16(0, true) / 4;
      const r3c1 = data.getInt16(0, true) / 4;
      const r3c2 = data.getInt16(0, true) / 4;
      const r3c3 = data.getInt16(0, true) / 4;

      const formattedData = {
        row1: [r1c1, r1c2, r1c3],
        row2: [r2c1, r2c2, r2c3],
        row3: [r3c1, r3c2, r3c3],
      };

      return formattedData;
    } catch (error) {
      throw error;
    }
  }
}

export default RotationMatrixOrientationSensor;
