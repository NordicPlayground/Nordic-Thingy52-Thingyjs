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
import Utilities from "./Utilities.js";
var ThingyController = /** @class */ (function () {
    function ThingyController(device) {
        var _this = this;
        this._initialize = function () {
            if (window.thingyController === undefined) {
                window.thingyController = {};
            }
            if (window.thingyController[_this.tid] === undefined) {
                window.thingyController[_this.tid] = {};
            }
            if (window.thingyController[_this.tid].gattStatus === undefined) {
                window.thingyController[_this.tid].gattStatus = true;
            }
            if (window.thingyController[_this.tid].queuedOperations === undefined) {
                window.thingyController[_this.tid].queuedOperations = [];
            }
            if (window.thingyController[_this.tid].executingQueuedOperations === undefined) {
                window.thingyController[_this.tid].executingQueuedOperations = false;
            }
            if (window.thingyController[_this.tid].executedOperations === undefined) {
                window.thingyController[_this.tid].executedOperations = [];
            }
        };
        this.addExecutedOperation = function (feature, method) {
            if (_this.device.getConnected()) {
                window.thingyController[_this.tid].executedOperations.push({ feature: feature, method: method });
            }
        };
        this.clearExecutedOperations = function () {
            window.thingyController[_this.tid].executedOperations = [];
        };
        this.setGattStatus = function (bool) {
            if (_this.device.getConnected()) {
                window.thingyController[_this.tid].gattStatus = bool;
                if (bool) {
                    _this.utilities.processEvent("gattavailable");
                }
            }
        };
        this.getGattStatus = function () {
            if (_this.device.getConnected()) {
                return window.thingyController[_this.tid].gattStatus;
            }
        };
        this.getNumQueuedOperations = function () {
            if (_this.device.getConnected()) {
                return window.thingyController[_this.tid].queuedOperations.length;
            }
        };
        this.getQueuedOperation = function (index) {
            if (_this.device.getConnected()) {
                if (window.thingyController[_this.tid].queuedOperations.length >= index) {
                    return window.thingyController[_this.tid].queuedOperations[index];
                }
            }
        };
        // removes either by index or by operation specifics (feature and method)
        this.removeQueuedOperation = function (x) {
            if (_this.device.getConnected()) {
                if (Number.isInteger(x)) {
                    window.thingyController[_this.tid].queuedOperations.splice(x, 1);
                }
                else {
                    for (var i = 0; i < _this.getNumQueuedOperations(); i++) {
                        var op = _this.getQueuedOperation(i);
                        if (x.feature === op.feature && x.method === op.method) {
                            _this.removeQueuedOperation(i);
                            i--;
                        }
                    }
                }
            }
        };
        this.enqueue = function (feature, method, f) {
            if (_this.device.getConnected()) {
                window.thingyController[_this.tid].queuedOperations.push({ feature: feature, method: method, f: f });
                _this.utilities.processEvent("operationqueued");
            }
        };
        this.dequeue = function () {
            if (_this.device.getConnected()) {
                return window.thingyController[_this.tid].queuedOperations.shift();
            }
        };
        this.setExecutingQueuedOperations = function (bool) {
            if (_this.device.getConnected()) {
                window.thingyController[_this.tid].executingQueuedOperations = bool;
                if (bool) {
                    _this.clearExecutedOperations();
                }
            }
        };
        this.getExecutingQueuedOperations = function () {
            if (_this.device.getConnected()) {
                return window.thingyController[_this.tid].executingQueuedOperations;
            }
        };
        this.getDevice = function () {
            return _this.device;
        };
        this.setDevice = function (device) {
            _this.device = device;
            _this.tid = device.device.id;
        };
        this.getExecutedOperation = function (index) {
            if (_this.device.getConnected()) {
                return window.thingyController[_this.tid].executedOperations[index];
            }
        };
        this.getNumExecutedOperations = function () {
            if (_this.device.getConnected()) {
                return window.thingyController[_this.tid].executedOperations.length;
            }
        };
        this.terminate = function () {
            window.thingyController[_this.tid] = undefined;
        };
        // thingy id)
        this.setDevice(device);
        this.utilities = new Utilities(device);
        this._initialize();
    }
    return ThingyController;
}());
export default ThingyController;
