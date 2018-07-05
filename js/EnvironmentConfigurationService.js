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

class EnvironmentConfigurationService extends FeatureOperations {
  constructor(device) {
    super(device, "environmentconfiguration");

    // gatt service and characteristic used to communicate with thingy's environment configuration characteristic
    this.service = {
      uuid: this.device.TES_UUID,
    };

    this.characteristic = {
      uuid: this.device.TES_CONFIG_UUID,
      decoder: this.decodeConfigData.bind(this),
      encoder: this.encodeConfigData.bind(this),
    };
  }

  decodeConfigData(data) {
    try {
      const littleEndian = true;
      const temperatureInterval = data.getUint16(0, littleEndian);
      const pressureInterval = data.getUint16(2, littleEndian);
      const humidityInterval = data.getUint16(4, littleEndian);
      const colorInterval = data.getUint16(6, littleEndian);
      let gasInterval = data.getUint8(8);
      const colorSensorRed = data.getUint8(9);
      const colorSensorGreen = data.getUint8(10);
      const colorSensorBlue = data.getUint8(11);

      if (gasInterval === 1) {
        gasInterval = 1;
      } else if (gasInterval === 2) {
        gasInterval = 10;
      } else if (gasInterval === 3) {
        gasInterval = 60;
      }

      const formattedData = {
        temperatureInterval: temperatureInterval,
        pressureInterval: pressureInterval,
        humidityInterval: humidityInterval,
        colorInterval: colorInterval,
        gasInterval: gasInterval,
        colorSensorCalibration: {
          red: colorSensorRed,
          green: colorSensorGreen,
          blue: colorSensorBlue,
        },
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

      if ((params.temperatureInterval === undefined) && (params.pressureInterval === undefined) && (params.humidityInterval === undefined) && (params.colorInterval === undefined) && (params.gasInterval === undefined) && (params.colorSensorCalibration === undefined)) {
        return Promise.reject(new TypeError("The argument has to be an object with at least one of the properties 'temperatureInterval', 'pressureInterval', 'humidityInterval', 'colorInterval', 'gasInterval' or 'colorSensorCalibration'."));
      }

      let temperatureInterval = params.temperatureInterval;
      let pressureInterval = params.pressureInterval;
      let humidityInterval = params.humidityInterval;
      let colorInterval = params.colorInterval;
      let gasInterval = params.gasInterval;
      const colorSensorCalibration = params.colorSensorCalibration;

      if (temperatureInterval !== undefined) {
        if (temperatureInterval < 100 || temperatureInterval > 60000) {
          return Promise.reject(new RangeError("The temperature sensor sampling interval must be in the range 100 ms - 60 000 ms"));
        }
      }

      if (pressureInterval !== undefined) {
        if (pressureInterval < 50 || pressureInterval > 60000) {
          return Promise.reject(new RangeError("The pressure sensor sampling interval must be in the range 50 ms - 60 000 ms"));
        }
      }

      if (humidityInterval !== undefined) {
        if (humidityInterval < 100 || humidityInterval > 60000) {
          return Promise.reject(new RangeError("The humidity sensor sampling interval must be in the range 100 ms - 60 000 ms"));
        }
      }

      if (colorInterval !== undefined) {
        if (colorInterval < 200 || colorInterval > 60000) {
          return Promise.reject(new RangeError("The color sensor sampling interval must be in the range 200 ms - 60 000 ms"));
        }
      }

      if (gasInterval !== undefined) {
        if (gasInterval === 1) {
          gasInterval = 1;
        } else if (gasInterval === 10) {
          gasInterval = 2;
        } else if (gasInterval === 60) {
          gasInterval = 3;
        } else {
          const e = new RangeError("The gas sensor sampling interval has to be 1, 10 or 60 seconds.");
          throw e;
        }
      }

      let colorSensorRed;
      let colorSensorGreen;
      let colorSensorBlue;
      if (colorSensorCalibration !== undefined) {
        if (typeof colorSensorCalibration !== "object") {
          return Promise.reject(new TypeError("The colorSensorCalibration argument has to be an object."));
        }
        if (colorSensorCalibration.red === undefined || colorSensorCalibration.green === undefined || colorSensorCalibration.blue === undefined) {
          return Promise.reject(new TypeError("The colorSensorCalibration argument has to be an object with the properties red, green and blue."));
        }

        colorSensorRed = colorSensorCalibration.red;
        colorSensorGreen = colorSensorCalibration.green;
        colorSensorBlue = colorSensorCalibration.blue;
      }

      // Preserve values for those settings that are not being changed
      const receivedData = await this._read(true);
      const littleEndian = true;
      temperatureInterval = temperatureInterval || receivedData.getUint16(0, littleEndian);
      pressureInterval = pressureInterval || receivedData.getUint16(2, littleEndian);
      humidityInterval = humidityInterval || receivedData.getUint16(4, littleEndian);
      colorInterval = colorInterval || receivedData.getUint16(6, littleEndian);
      gasInterval = gasInterval || receivedData.getUint8(8);
      colorSensorRed = colorSensorRed || receivedData.getUint8(9);
      colorSensorGreen = colorSensorGreen|| receivedData.getUint8(10);
      colorSensorBlue = colorSensorBlue || receivedData.getUint8(11);

      const dataArray = new Uint8Array(12);
      for (let i = 0; i < dataArray.length; i++) {
        dataArray[i] = receivedData.getUint8(i);
      }

      dataArray[0] = temperatureInterval & 0xff;
      dataArray[1] = (temperatureInterval >> 8) & 0xff;
      dataArray[2] = pressureInterval & 0xff;
      dataArray[3] = (pressureInterval >> 8) & 0xff;
      dataArray[4] = humidityInterval & 0xff;
      dataArray[5] = (humidityInterval >> 8) & 0xff;
      dataArray[6] = colorInterval & 0xff;
      dataArray[7] = (colorInterval >> 8) & 0xff;
      dataArray[8] = gasInterval;
      dataArray[9] = colorSensorRed;
      dataArray[10] = colorSensorGreen;
      dataArray[11] = colorSensorBlue;

      return dataArray;
    } catch (error) {
      throw error;
    }
  }
}

export default EnvironmentConfigurationService;
