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

class ConnectionParametersService extends FeatureOperations {
  constructor(device) {
    super(device, "connectionparameters");

    // gatt service and characteristic used to communicate with Thingy's connection parameters configuration
    this.service = {
      uuid: this.device.TCS_UUID,
    };

    this.characteristic = {
      uuid: this.device.TCS_CONN_PARAMS_UUID,
      decoder: this.decodeConnectionParam.bind(this),
      encoder: this.encodeConnectionParam.bind(this),
    };
  }

  decodeConnectionParam(data) {
    try {
      // Connection intervals are given in units of 1.25 ms
      const littleEndian = true;
      const minConnInterval = data.getUint16(0, littleEndian) * 1.25;
      const maxConnInterval = data.getUint16(2, littleEndian) * 1.25;
      const slaveLatency = data.getUint16(4, littleEndian);

      // Supervision timeout is given i units of 10 ms
      const supervisionTimeout = data.getUint16(6, littleEndian) * 10;
      const params = {
        minInterval: minConnInterval,
        maxInterval: maxConnInterval,
        slaveLatency: slaveLatency,
        timeout: supervisionTimeout,
      };
      return params;
    } catch (error) {
      throw error;
    }
  }

  async encodeConnectionParam(params) {
    try {
      if (typeof params !== "object") {
        const error = new Error("The argument has to be an object.");
        throw error;
      }

      if ((params.timeout === undefined) && (params.slaveLatency === undefined) && (params.minInterval === undefined) && (params.maxInterval === undefined)) {
        const error = new Error("The argument has to be an object with at least one of the properties 'timeout', 'slaveLatency', 'minInterval' or 'maxInterval'.");
        throw error;
      }

      let timeout = params.timeout;
      let slaveLatency = params.slaveLatency;
      let minInterval = params.minInterval;
      let maxInterval = params.maxInterval;

      // Check parameters
      if (timeout !== undefined) {
        if (timeout < 100 || timeout > 32000) {
          const error = new Error("The supervision timeout must be in the range from 100 ms to 32 000 ms.");
          throw error;
        }
        // The supervision timeout has to be set in units of 10 ms
        timeout = Math.round(timeout / 10);
      }

      if (slaveLatency !== undefined) {
        if (slaveLatency < 0 || slaveLatency > 499) {
          const error = new Error("The slave latency must be in the range from 0 to 499 connection intervals.");
          throw error;
        }
      }

      if (minInterval !== undefined) {
        if (minInterval < 7.5 || minInterval > maxInterval) {
          const error = new Error("The minimum connection interval must be greater than 7.5 ms and <= maximum interval");
          throw error;
        }
        // Interval is in units of 1.25 ms.
        minInterval = Math.round(minInterval * 0.8);
      }

      if (maxInterval !== undefined) {
        if (maxInterval > 4000 || maxInterval < minInterval) {
          const error = new Error("The minimum connection interval must be less than 4 000 ms and >= minimum interval");
          throw error;
        }
        // Interval is in units of 1.25 ms.
        maxInterval = Math.round(maxInterval * 0.8);
      }

      const receivedData = await this._read(true);
      const littleEndian = true;
      minInterval = minInterval || receivedData.getUint16(0, littleEndian);
      maxInterval = maxInterval || receivedData.getUint16(2, littleEndian);
      slaveLatency = slaveLatency || receivedData.getUint16(4, littleEndian);
      timeout = timeout || receivedData.getUint16(6, littleEndian);

      // Check that the timeout obeys  conn_sup_timeout * 4 > (1 + slave_latency) * max_conn_interval
      if (timeout * 4 < (1 + slaveLatency) * maxInterval) {
        const error = new Error("The supervision timeout in milliseconds must be greater than (1 + slaveLatency) * maxConnInterval * 2, where maxConnInterval is also given in milliseconds.");
        throw error;
      }

      const dataArray = new Uint8Array(8);
      for (let i = 0; i < dataArray.length; i++) {
        dataArray[i] = receivedData.getUint8(i);
      }

      dataArray[0] = minInterval & 0xff;
      dataArray[1] = (minInterval >> 8) & 0xff;
      dataArray[2] = maxInterval & 0xff;
      dataArray[3] = (maxInterval >> 8) & 0xff;
      dataArray[4] = slaveLatency & 0xff;
      dataArray[5] = (slaveLatency >> 8) & 0xff;
      dataArray[6] = timeout & 0xff;
      dataArray[7] = (timeout >> 8) & 0xff;

      return dataArray;
    } catch (error) {
      throw error;
    }
  }
}

export default ConnectionParametersService;
