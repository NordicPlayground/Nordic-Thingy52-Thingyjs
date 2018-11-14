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

import AdvertisingParametersService from "./AdvertisingParametersService.js";
import MicrophoneSensor from "./MicrophoneSensor.js";
import MTUService from "./MTUService.js";
import NameService from "./NameService.js";
import TemperatureSensor from "./TemperatureSensor.js";
import PressureSensor from "./PressureSensor.js";
import LEDService from "./LEDService.js";
import TapSensor from "./TapSensor.js";
import AbsoluteOrientationSensor from "./AbsoluteOrientationSensor.js";
import QuaternionOrientationSensor from "./QuaternionOrientationSensor.js";
import ButtonSensor from "./ButtonSensor.js";
import CloudTokenService from "./CloudTokenService.js";
import ColorSensor from "./ColorSensor.js";
import ConnectionParametersService from "./ConnectionParametersService.js";
import FirmwareService from "./FirmwareService.js";
import GasSensor from "./GasSensor.js";
import GravityVectorSensor from "./GravityVectorSensor.js";
import HumiditySensor from "./HumiditySensor.js";
import StepCounterSensor from "./StepCounterSensor.js";
import RawDataSensor from "./RawDataSensor.js";
import EulerOrientationSensor from "./EulerOrientationSensor.js";
import RotationMatrixOrientationSensor from "./RotationMatrixOrientationSensor.js";
import HeadingSensor from "./HeadingSensor.js";
import EddystoneUrlService from "./EddystoneUrlService.js";
import EnvironmentConfigurationService from "./EnvironmentConfigurationService.js";
import MotionConfigurationService from "./MotionConfigurationService.js";
import SoundConfigurationService from "./SoundConfigurationService.js";
import SpeakerDataService from "./SpeakerDataService.js";
import SpeakerStatusService from "./SpeakerStatusService.js";
import BatteryService from "./BatteryService.js";
import ThingyController from "./ThingyController.js";
import Utilities from "./Utilities.js";
import EventTarget from "./EventTarget.js";
import DFUControlPointServiceFirmwarev1 from "./DFUControlPointServiceFirmwarev1.js";
import DFUControlPointServiceFirmwarev2 from "./DFUControlPointServiceFirmwarev2.js";
class Thingy extends EventTarget {
  constructor(options = {logEnabled: true}) {
    super();

    this.logEnabled = options.logEnabled;
    this.connected = false;

    if (this.logEnabled) {
      console.log("I am alive!");
    }

    // TCS = Thingy Configuration Service
    this.TCS_UUID = "ef680100-9b35-4933-9b10-52ffa9740042";
    this.TCS_NAME_UUID = "ef680101-9b35-4933-9b10-52ffa9740042";
    this.TCS_ADV_PARAMS_UUID = "ef680102-9b35-4933-9b10-52ffa9740042";
    this.TCS_CONN_PARAMS_UUID = "ef680104-9b35-4933-9b10-52ffa9740042";
    this.TCS_EDDYSTONE_UUID = "ef680105-9b35-4933-9b10-52ffa9740042";
    this.TCS_CLOUD_TOKEN_UUID = "ef680106-9b35-4933-9b10-52ffa9740042";
    this.TCS_FW_VER_UUID = "ef680107-9b35-4933-9b10-52ffa9740042";
    this.TCS_MTU_REQUEST_UUID = "ef680108-9b35-4933-9b10-52ffa9740042";

    // TES = Thingy Environment Service
    this.TES_UUID = "ef680200-9b35-4933-9b10-52ffa9740042";
    this.TES_TEMP_UUID = "ef680201-9b35-4933-9b10-52ffa9740042";
    this.TES_PRESSURE_UUID = "ef680202-9b35-4933-9b10-52ffa9740042";
    this.TES_HUMIDITY_UUID = "ef680203-9b35-4933-9b10-52ffa9740042";
    this.TES_GAS_UUID = "ef680204-9b35-4933-9b10-52ffa9740042";
    this.TES_COLOR_UUID = "ef680205-9b35-4933-9b10-52ffa9740042";
    this.TES_CONFIG_UUID = "ef680206-9b35-4933-9b10-52ffa9740042";

    // TUIS = Thingy User Interface Service
    this.TUIS_UUID = "ef680300-9b35-4933-9b10-52ffa9740042";
    this.TUIS_LED_UUID = "ef680301-9b35-4933-9b10-52ffa9740042";
    this.TUIS_BTN_UUID = "ef680302-9b35-4933-9b10-52ffa9740042";
    this.TUIS_PIN_UUID = "ef680303-9b35-4933-9b10-52ffa9740042";

    // TMS = Thingy Motion Service
    this.TMS_UUID = "ef680400-9b35-4933-9b10-52ffa9740042";
    this.TMS_CONFIG_UUID = "ef680401-9b35-4933-9b10-52ffa9740042";
    this.TMS_TAP_UUID = "ef680402-9b35-4933-9b10-52ffa9740042";
    this.TMS_ORIENTATION_UUID = "ef680403-9b35-4933-9b10-52ffa9740042";
    this.TMS_QUATERNION_UUID = "ef680404-9b35-4933-9b10-52ffa9740042";
    this.TMS_STEP_UUID = "ef680405-9b35-4933-9b10-52ffa9740042";
    this.TMS_RAW_UUID = "ef680406-9b35-4933-9b10-52ffa9740042";
    this.TMS_EULER_UUID = "ef680407-9b35-4933-9b10-52ffa9740042";
    this.TMS_ROT_MATRIX_UUID = "ef680408-9b35-4933-9b10-52ffa9740042";
    this.TMS_HEADING_UUID = "ef680409-9b35-4933-9b10-52ffa9740042";
    this.TMS_GRAVITY_UUID = "ef68040a-9b35-4933-9b10-52ffa9740042";

    // TSS = Thingy Sound Service
    this.TSS_UUID = "ef680500-9b35-4933-9b10-52ffa9740042";
    this.TSS_CONFIG_UUID = "ef680501-9b35-4933-9b10-52ffa9740042";
    this.TSS_SPEAKER_DATA_UUID = "ef680502-9b35-4933-9b10-52ffa9740042";
    this.TSS_SPEAKER_STAT_UUID = "ef680503-9b35-4933-9b10-52ffa9740042";
    this.TSS_MIC_UUID = "ef680504-9b35-4933-9b10-52ffa9740042";

    // DFU = Device Firmware Update
    this.DFU_UUID = "0000fe59-0000-1000-8000-00805f9b34fb";
    this.DFU_CTRL_POINT_UUID_VERSION_1 = "8ec90001-f315-4f60-9fb8-838830daea50";
    this.DFU_CTRL_POINT_UUID_VERSION_2 = "8ec90003-f315-4f60-9fb8-838830daea50";

    this.serviceUUIDs = [
      "battery_service",
      this.TCS_UUID,
      this.TES_UUID,
      this.TUIS_UUID,
      this.TMS_UUID,
      this.TSS_UUID,
      this.DFU_UUID,
    ];

    this.addEventListener("gattavailable", this.executeQueuedOperations.bind(this));
    this.addEventListener("operationqueued", this.executeQueuedOperations.bind(this));

    this.advertisingparameters = new AdvertisingParametersService(this);
    this.microphone = new MicrophoneSensor(this);
    this.mtu = new MTUService(this);
    this.name = new NameService(this);
    this.temperature = new TemperatureSensor(this);
    this.pressure = new PressureSensor(this);
    this.led = new LEDService(this);
    this.tap = new TapSensor(this);
    this.absoluteorientation = new AbsoluteOrientationSensor(this);
    this.quaternionorientation = new QuaternionOrientationSensor(this);
    this.button = new ButtonSensor(this);
    this.cloudtoken = new CloudTokenService(this);
    this.color = new ColorSensor(this);
    this.connectionparameters = new ConnectionParametersService(this);
    this.eddystone = new EddystoneUrlService(this);
    this.firmware = new FirmwareService(this);
    this.gas = new GasSensor(this);
    this.gravityvector = new GravityVectorSensor(this);
    this.humidity = new HumiditySensor(this);
    this.stepcounter = new StepCounterSensor(this);
    this.rawdata = new RawDataSensor(this);
    this.eulerorientation = new EulerOrientationSensor(this);
    this.rotationmatrixorientation = new RotationMatrixOrientationSensor(this);
    this.heading = new HeadingSensor(this);
    this.environmentconfiguration = new EnvironmentConfigurationService(this);
    this.motionconfiguration = new MotionConfigurationService(this);
    this.soundconfiguration = new SoundConfigurationService(this);
    this.speakerdata = new SpeakerDataService(this);
    this.speakerstatus = new SpeakerStatusService(this);
    this.battery = new BatteryService(this);
    this.dfucontrolpoint_v1 = new DFUControlPointServiceFirmwarev1(this);
    this.dfucontrolpoint_v2 = new DFUControlPointServiceFirmwarev2(this);
  }

  async connect() {
    try {
      // Scan for Thingys
      if (this.logEnabled) {
        console.log(`Scanning for devices with service UUID equal to ${this.TCS_UUID}`);
      }

      this.device = await navigator.bluetooth.requestDevice({
        filters: [{
          services: [this.TCS_UUID],
        }],
        optionalServices: this.serviceUUIDs,
      })

      this.device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));

      this.setConnected(true);

      if (this.logEnabled) {
        console.log(`Found Thingy named "${this.device.name}", trying to connect`);
      }

      // Connect to GATT server
      this.server = await this.device.gatt.connect();

      this.thingyController = new ThingyController(this);
      this.utilities = new Utilities(this);

      if (this.logEnabled) {
        console.log(`Connected to "${this.device.name}"`);
      }

      return true;
    } catch (error) {
      this.setConnected(false);

      if ("utilities" in this) {
        this.utilities.processEvent("error", "thingy", error);
      }

      return false;
    }
  }

  // used to execute queued operations.
  // as long as this method perceives operations to be executed (without regard to the operation's outcome) it will run.
  // if an operation fails three times and seemingly no other operations are executed at the same time, the operation is discarded.
  async executeQueuedOperations() {
    try {
      if (!this.thingyController.getExecutingQueuedOperations()) {
        if (this.thingyController.getNumQueuedOperations() !== 0) {
          if (this.thingyController.getGattStatus()) {
            this.thingyController.setExecutingQueuedOperations(true);
            
            const triedOperations = {};
            let operation;
      
            let totalOperationsExecutedUntilLastIteration = 0;
            let totalOperationsExecutedSinceLastIteration = 0;

            while (this.thingyController.getNumQueuedOperations() !== 0) {
              if (!this.getConnected()) {
                break;
              }
      
              totalOperationsExecutedSinceLastIteration = this.thingyController.getNumExecutedOperations() - totalOperationsExecutedUntilLastIteration;
              totalOperationsExecutedUntilLastIteration = this.thingyController.getNumExecutedOperations();
              operation = this.thingyController.dequeue();
              
              if (!(operation.feature in triedOperations)) {
                triedOperations[operation.feature] = {};
              }
      
              if (!(operation.method in triedOperations[operation.feature])) {
                triedOperations[operation.feature][operation.method] = 0;
              } 
      
              triedOperations[operation.feature][operation.method]++;
              
              const successful = await operation.f();

              // this condition will hopefully never be met
              if (triedOperations[operation.feature][operation.method] === 10 && successful !== true) {
                this.thingyController.removeQueuedOperation(operation);
                this.utilities.processEvent("operationdiscarded", "thingy", operation);
              }
      
              if (triedOperations[operation.feature][operation.method] >= 3) {
                if (successful !== true) {
                  if (totalOperationsExecutedSinceLastIteration < 2) {
                    if (totalOperationsExecutedSinceLastIteration === 1) {
                      const op = this.thingyController.getExecutedOperation(this.thingyController.getNumExecutedOperations() - 1);

                      if (op.feature !== operation.feature || op.method !== operation.method) {
                        continue;
                      }
                    }

                    // we have now tried this particular operation three times.
                    // It's still not completing successfully, and no other operations
                    // are going through. We are therefore discarding it.
                    this.thingyController.removeQueuedOperation(operation);
                    this.utilities.processEvent("operationdiscarded", "thingy", operation);
                  }
                }
              }
            } 
      
            this.thingyController.setExecutingQueuedOperations(false);
          }
        }
      }
    } catch (error) {
      this.thingyController.setExecutingQueuedOperations(false);
      this.utilities.processEvent("error", "thingy", error);
    }
  }

  getConnected() {
    return this.connected;
  }

  setConnected(bool) {
    this.connected = bool;
  }

  resetDeviceProperties() {
    this.setConnected(false);
    this.thingyController.terminate();
  }

  onDisconnected({target}) {
    if (!this.getConnected()) {
      if (this.logEnabled) {
        console.log(`Disconnected from device named ${target.name}`);
      }
    } else {
      this.resetDeviceProperties();
      this.utilities.processEvent("disconnected", "thingy");
    }
  }

  async disconnect() {
    try {
      this.resetDeviceProperties();
      await this.device.gatt.disconnect();
      return true;
    } catch (error) {
      this.utilities.processEvent("error", "thingy", error);
      return false;
    }
  }
}

export default Thingy;
