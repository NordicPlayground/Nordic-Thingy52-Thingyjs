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

class RawDataSensor extends FeatureOperations {
  constructor(device) {
    super(device, "rawdata");

    // gatt service and characteristic used to communicate with Thingy's raw data sensor
    this.service = {
      uuid: this.device.TMS_UUID,
    };

    this.characteristic = {
      uuid: this.device.TMS_RAW_UUID,
      decoder: this.decodeRawDataData.bind(this),
    };
  }

  decodeRawDataData(data) {
    try {
      const littleEndian = true;
      const accX = data.getInt16(0, littleEndian) / 64;
      const accY = data.getInt16(2, littleEndian) / 64;
      const accZ = data.getInt16(4, littleEndian) / 64;

      // Divide by 2^11 = 2048 to get correct gyroscope values
      const gyroX = data.getInt16(6, littleEndian) / 2048;
      const gyroY = data.getInt16(8, littleEndian) / 2048;
      const gyroZ = data.getInt16(10, littleEndian) / 2048;

      // Divide by 2^12 = 4096 to get correct compass values
      const compassX = data.getInt16(12, littleEndian) / 4096;
      const compassY = data.getInt16(14, littleEndian) / 4096;
      const compassZ = data.getInt16(16, littleEndian) / 4096;

      const formattedData = {
        accelerometer: {
          x: accX,
          y: accY,
          z: accZ,
          unit: "G",
        },
        gyroscope: {
          x: gyroX,
          y: gyroY,
          z: gyroZ,
          unit: "deg/s",
        },
        compass: {
          x: compassX,
          y: compassY,
          z: compassZ,
          unit: "microTesla",
        },
      };

      return formattedData;
    } catch (error) {
      throw error;
    }
  }
}

export default RawDataSensor;
