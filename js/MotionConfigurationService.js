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

class MotionConfigurationService extends FeatureOperations {
  constructor(device) {
    super(device, "motionconfiguration");

    // gatt service and characteristic used to communicate with thingy's motion configuration characteristic
    this.service = {
      uuid: this.device.TMS_UUID,
    };

    this.characteristic = {
      uuid: this.device.TMS_CONFIG_UUID,
      decoder: this.decodeConfigData.bind(this),
      encoder: this.encodeConfigData.bind(this),
    };
  }

  decodeConfigData(data) {
    try {
      const littleEndian = true;
      const stepCounterInterval = data.getUint16(0, littleEndian);
      const tempCompensationInterval = data.getUint16(2, littleEndian);
      const magnetCompInterval = data.getUint16(4, littleEndian);
      const motionProcessFrequency = data.getUint16(6, littleEndian);
      const wakeOnMotion = data.getUint8(8);

      const formattedData = {
        stepCounterInterval: stepCounterInterval,
        tempCompensationInterval: tempCompensationInterval,
        magnetCompInterval: magnetCompInterval,
        motionProcessFrequency: motionProcessFrequency,
        wakeOnMotion: wakeOnMotion,
      };

      return formattedData;
    } catch (error) {
      throw error;
    }
  }

  async encodeConfigData(params) {
    try {
      if (typeof params !== "object") {
        return Promise.reject(new TypeError("The argument has to be an object."));
      }

      if ((params.stepCounterInterval === undefined) && (params.tempCompensationInterval === undefined) && (params.magnetCompInterval === undefined) && (params.motionProcessFrequency === undefined) && (params.wakeOnMotion === undefined)) {
        return Promise.reject(new TypeError("The argument has to be an object with at least one of the properties 'stepCounterInterval', 'tempCompensationInterval', 'magnetCompInterval', 'motionProcessFrequency' or 'wakeOnMotion'."));
      }

      let stepCounterInterval = params.stepCounterInterval;
      let tempCompensationInterval = params.tempCompensationInterval;
      let magnetCompInterval = params.magnetCompInterval;
      let motionProcessFrequency = params.motionProcessFrequency;
      let wakeOnMotion = params.wakeOnMotion;

      if (stepCounterInterval !== undefined) {
        if (stepCounterInterval < 100 || stepCounterInterval > 5000) {
          return Promise.reject(new RangeError("The step counter interval must be in the range 100 ms - 5000 ms"));
        }
      }

      if (tempCompensationInterval !== undefined) {
        if (tempCompensationInterval < 100 || tempCompensationInterval > 5000) {
          return Promise.reject(new RangeError("The temperature compensation interval must be in the range 100 ms - 5000 ms"));
        }
      }

      if (magnetCompInterval !== undefined) {
        if (magnetCompInterval < 100 || magnetCompInterval > 1000) {
          return Promise.reject(new RangeError("The magnetometer compensation interval must be in the range 100 ms - 1000 ms"));
        }
      }

      if (motionProcessFrequency !== undefined) {
        if (motionProcessFrequency < 5 || motionProcessFrequency > 200) {
          return Promise.reject(new RangeError("The motion processing unit frequency must be in the range 5 hz - 200 hz"));
        }
      }

      if (wakeOnMotion !== undefined) {
        if (typeof wakeOnMotion !== "boolean") {
          return Promise.reject(new RangeError("The argument must be true or false."));
        }
        wakeOnMotion = wakeOnMotion ? 1 : 0;
      }

      const receivedData = await this._read(true);
      const littleEndian = true;
      stepCounterInterval = stepCounterInterval || receivedData.getUint16(0, littleEndian);
      tempCompensationInterval = tempCompensationInterval || receivedData.getUint16(2, littleEndian);
      magnetCompInterval = magnetCompInterval || receivedData.getUint16(4, littleEndian);
      motionProcessFrequency = motionProcessFrequency || receivedData.getUint16(6, littleEndian);

      // Do it this way because otherwise it would evaluate a truth statement, i.e. wakeOnMotion = 0 || 1.
      // This would result in never being able to turn wakeOnMotion off once it was on.
      if (wakeOnMotion === undefined) {
        wakeOnMotion = receivedData.getUint8(8);
      }

      const dataArray = new Uint8Array(9);
      for (let i = 0; i < dataArray.length; i++) {
        dataArray[i] = receivedData.getUint8(i);
      }

      dataArray[0] = stepCounterInterval & 0xff;
      dataArray[1] = (stepCounterInterval >> 8) & 0xff;
      dataArray[2] = tempCompensationInterval & 0xff;
      dataArray[3] = (tempCompensationInterval >> 8) & 0xff;
      dataArray[4] = magnetCompInterval & 0xff;
      dataArray[5] = (magnetCompInterval >> 8) & 0xff;
      dataArray[6] = motionProcessFrequency & 0xff;
      dataArray[7] = (motionProcessFrequency >> 8) & 0xff;
      dataArray[8] = wakeOnMotion;

      return dataArray;
    } catch (error) {
      throw error;
    }
  }
}

export default MotionConfigurationService;
