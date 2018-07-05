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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var Thingy = /** @class */ (function (_super) {
    __extends(Thingy, _super);
    function Thingy(options) {
        if (options === void 0) { options = { logEnabled: true }; }
        var _this = _super.call(this) || this;
        _this.connect = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var _a, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        // Scan for Thingys
                        if (this.logEnabled) {
                            console.log("Scanning for devices with service UUID equal to " + this.TCS_UUID);
                        }
                        _a = this;
                        return [4 /*yield*/, navigator.bluetooth.requestDevice({
                                filters: [{
                                        services: [this.TCS_UUID],
                                    }],
                                optionalServices: this.serviceUUIDs,
                            })];
                    case 1:
                        _a.device = _c.sent();
                        this.device.addEventListener('gattserverdisconnected', function (e) { return _this.onDisconnected(e); });
                        this.setConnected(true);
                        if (this.logEnabled) {
                            console.log("Found Thingy named \"" + this.device.name + "\", trying to connect");
                        }
                        // Connect to GATT server
                        _b = this;
                        return [4 /*yield*/, this.device.gatt.connect()];
                    case 2:
                        // Connect to GATT server
                        _b.server = _c.sent();
                        this.thingyController = new ThingyController(this);
                        this.utilities = new Utilities(this);
                        return [2 /*return*/, true];
                    case 3:
                        error_1 = _c.sent();
                        this.setConnected(false);
                        if ("utilities" in this) {
                            this.utilities.processEvent("error", "thingy", error_1);
                        }
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        // used to execute queued operations.
        // as long as this method perceives operations to be executed (without regard to the operation's outcome) it will run.
        // if an operation fails three times and seemingly no other operations are executed at the same time, the operation is discarded.
        _this.executeQueuedOperations = function () { return __awaiter(_this, void 0, void 0, function () {
            var triedOperations, operation, totalOperationsExecutedUntilLastIteration, totalOperationsExecutedSinceLastIteration, successful, op, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!!this.thingyController.getExecutingQueuedOperations()) return [3 /*break*/, 4];
                        if (!(this.thingyController.getNumQueuedOperations() !== 0)) return [3 /*break*/, 4];
                        if (!this.thingyController.getGattStatus()) return [3 /*break*/, 4];
                        this.thingyController.setExecutingQueuedOperations(true);
                        triedOperations = {};
                        operation = void 0;
                        totalOperationsExecutedUntilLastIteration = 0;
                        totalOperationsExecutedSinceLastIteration = 0;
                        _a.label = 1;
                    case 1:
                        if (!(this.thingyController.getNumQueuedOperations() !== 0)) return [3 /*break*/, 3];
                        if (!this.getConnected()) {
                            return [3 /*break*/, 3];
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
                        return [4 /*yield*/, operation.f()];
                    case 2:
                        successful = _a.sent();
                        // this condition will hopefully never be met
                        if (triedOperations[operation.feature][operation.method] === 10 && successful !== true) {
                            this.thingyController.removeQueuedOperation(operation);
                            this.utilities.processEvent("operationdiscarded", "thingy", operation);
                        }
                        if (triedOperations[operation.feature][operation.method] >= 3) {
                            if (successful !== true) {
                                if (totalOperationsExecutedSinceLastIteration < 2) {
                                    if (totalOperationsExecutedSinceLastIteration === 1) {
                                        op = this.thingyController.getExecutedOperation(this.thingyController.getNumExecutedOperations() - 1);
                                        if (op.feature !== operation.feature || op.method !== operation.method) {
                                            return [3 /*break*/, 1];
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
                        return [3 /*break*/, 1];
                    case 3:
                        this.thingyController.setExecutingQueuedOperations(false);
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        this.thingyController.setExecutingQueuedOperations(false);
                        this.utilities.processEvent("error", "thingy", error_2);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        _this.getConnected = function () {
            return _this.connected;
        };
        _this.setConnected = function (bool) {
            _this.connected = bool;
        };
        _this.resetDeviceProperties = function () {
            _this.setConnected(false);
            _this.thingyController.terminate();
        };
        _this.onDisconnected = function (_a) {
            var target = _a.target;
            if (!_this.getConnected()) {
                if (_this.logEnabled) {
                    console.log("Disconnected from device named " + target.name);
                }
            }
            else {
                _this.resetDeviceProperties();
                _this.utilities.processEvent("disconnected", "thingy");
            }
        };
        _this.disconnect = function () { return __awaiter(_this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.resetDeviceProperties();
                        return [4 /*yield*/, this.device.gatt.disconnect()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_3 = _a.sent();
                        this.utilities.processEvent("error", "thingy", error_3);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.logEnabled = options.logEnabled;
        _this.connected = false;
        if (_this.logEnabled) {
            console.log("I am alive!");
        }
        // TCS = Thingy Configuration Service
        _this.TCS_UUID = "ef680100-9b35-4933-9b10-52ffa9740042";
        _this.TCS_NAME_UUID = "ef680101-9b35-4933-9b10-52ffa9740042";
        _this.TCS_ADV_PARAMS_UUID = "ef680102-9b35-4933-9b10-52ffa9740042";
        _this.TCS_CONN_PARAMS_UUID = "ef680104-9b35-4933-9b10-52ffa9740042";
        _this.TCS_EDDYSTONE_UUID = "ef680105-9b35-4933-9b10-52ffa9740042";
        _this.TCS_CLOUD_TOKEN_UUID = "ef680106-9b35-4933-9b10-52ffa9740042";
        _this.TCS_FW_VER_UUID = "ef680107-9b35-4933-9b10-52ffa9740042";
        _this.TCS_MTU_REQUEST_UUID = "ef680108-9b35-4933-9b10-52ffa9740042";
        // TES = Thingy Environment Service
        _this.TES_UUID = "ef680200-9b35-4933-9b10-52ffa9740042";
        _this.TES_TEMP_UUID = "ef680201-9b35-4933-9b10-52ffa9740042";
        _this.TES_PRESSURE_UUID = "ef680202-9b35-4933-9b10-52ffa9740042";
        _this.TES_HUMIDITY_UUID = "ef680203-9b35-4933-9b10-52ffa9740042";
        _this.TES_GAS_UUID = "ef680204-9b35-4933-9b10-52ffa9740042";
        _this.TES_COLOR_UUID = "ef680205-9b35-4933-9b10-52ffa9740042";
        _this.TES_CONFIG_UUID = "ef680206-9b35-4933-9b10-52ffa9740042";
        // TUIS = Thingy User Interface Service
        _this.TUIS_UUID = "ef680300-9b35-4933-9b10-52ffa9740042";
        _this.TUIS_LED_UUID = "ef680301-9b35-4933-9b10-52ffa9740042";
        _this.TUIS_BTN_UUID = "ef680302-9b35-4933-9b10-52ffa9740042";
        _this.TUIS_PIN_UUID = "ef680303-9b35-4933-9b10-52ffa9740042";
        // TMS = Thingy Motion Service
        _this.TMS_UUID = "ef680400-9b35-4933-9b10-52ffa9740042";
        _this.TMS_CONFIG_UUID = "ef680401-9b35-4933-9b10-52ffa9740042";
        _this.TMS_TAP_UUID = "ef680402-9b35-4933-9b10-52ffa9740042";
        _this.TMS_ORIENTATION_UUID = "ef680403-9b35-4933-9b10-52ffa9740042";
        _this.TMS_QUATERNION_UUID = "ef680404-9b35-4933-9b10-52ffa9740042";
        _this.TMS_STEP_UUID = "ef680405-9b35-4933-9b10-52ffa9740042";
        _this.TMS_RAW_UUID = "ef680406-9b35-4933-9b10-52ffa9740042";
        _this.TMS_EULER_UUID = "ef680407-9b35-4933-9b10-52ffa9740042";
        _this.TMS_ROT_MATRIX_UUID = "ef680408-9b35-4933-9b10-52ffa9740042";
        _this.TMS_HEADING_UUID = "ef680409-9b35-4933-9b10-52ffa9740042";
        _this.TMS_GRAVITY_UUID = "ef68040a-9b35-4933-9b10-52ffa9740042";
        // TSS = Thingy Sound Service
        _this.TSS_UUID = "ef680500-9b35-4933-9b10-52ffa9740042";
        _this.TSS_CONFIG_UUID = "ef680501-9b35-4933-9b10-52ffa9740042";
        _this.TSS_SPEAKER_DATA_UUID = "ef680502-9b35-4933-9b10-52ffa9740042";
        _this.TSS_SPEAKER_STAT_UUID = "ef680503-9b35-4933-9b10-52ffa9740042";
        _this.TSS_MIC_UUID = "ef680504-9b35-4933-9b10-52ffa9740042";
        _this.serviceUUIDs = [
            "battery_service",
            _this.TCS_UUID,
            _this.TES_UUID,
            _this.TUIS_UUID,
            _this.TMS_UUID,
            _this.TSS_UUID,
        ];
        _this.addEventListener("gattavailable", function () { return _this.executeQueuedOperations(); });
        _this.addEventListener("operationqueued", function () { return _this.executeQueuedOperations(); });
        _this.advertisingparameters = new AdvertisingParametersService(_this);
        _this.microphone = new MicrophoneSensor(_this);
        _this.mtu = new MTUService(_this);
        _this.name = new NameService(_this);
        _this.temperature = new TemperatureSensor(_this);
        _this.pressure = new PressureSensor(_this);
        _this.led = new LEDService(_this);
        _this.tap = new TapSensor(_this);
        _this.absoluteorientation = new AbsoluteOrientationSensor(_this);
        _this.quaternionorientation = new QuaternionOrientationSensor(_this);
        _this.button = new ButtonSensor(_this);
        _this.cloudtoken = new CloudTokenService(_this);
        _this.color = new ColorSensor(_this);
        _this.connectionparameters = new ConnectionParametersService(_this);
        _this.eddystone = new EddystoneUrlService(_this);
        _this.firmware = new FirmwareService(_this);
        _this.gas = new GasSensor(_this);
        _this.gravityvector = new GravityVectorSensor(_this);
        _this.humidity = new HumiditySensor(_this);
        _this.stepcounter = new StepCounterSensor(_this);
        _this.rawdata = new RawDataSensor(_this);
        _this.eulerorientation = new EulerOrientationSensor(_this);
        _this.rotationmatrixorientation = new RotationMatrixOrientationSensor(_this);
        _this.heading = new HeadingSensor(_this);
        _this.environmentconfiguration = new EnvironmentConfigurationService(_this);
        _this.motionconfiguration = new MotionConfigurationService(_this);
        _this.soundconfiguration = new SoundConfigurationService(_this);
        _this.speakerdata = new SpeakerDataService(_this);
        _this.speakerstatus = new SpeakerStatusService(_this);
        _this.battery = new BatteryService(_this);
        return _this;
    }
    return Thingy;
}(EventTarget));
export default Thingy;
