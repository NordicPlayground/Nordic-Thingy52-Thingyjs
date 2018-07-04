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

class ThingyController {
  constructor(device) {

    // thingy id)
    this.setDevice(device);
    this.utilities = new Utilities(device);
    this._initialize();
  }

  _initialize() {
    if (window.thingyController === undefined) {
        window.thingyController = {};
      }

      if (window.thingyController[this.tid] === undefined) {
        window.thingyController[this.tid] = {};
      }

      if (window.thingyController[this.tid].gattStatus === undefined) {
        window.thingyController[this.tid].gattStatus = true;
      }

      if (window.thingyController[this.tid].queuedOperations === undefined) {
        window.thingyController[this.tid].queuedOperations = [];
      }

      if (window.thingyController[this.tid].executingQueuedOperations === undefined) {
        window.thingyController[this.tid].executingQueuedOperations = false;
      }

      if (window.thingyController[this.tid].executedOperations === undefined) {
        window.thingyController[this.tid].executedOperations = [];
      }
  }

  setExecutedOperation(feature, method) {
    if (this.device.connected) {
      window.thingyController[this.tid].executedOperations.push({feature, method});
    }
  }

  setGattStatus(bool) {
    if (this.device.connected) {
      window.thingyController[this.tid].gattStatus = bool;

      if (bool) {
        this.utilities.processEvent("gattavailable");
      }
    }
  }

  getGattStatus() {
    if (this.device.connected) {
      return window.thingyController[this.tid].gattStatus;
    }
  }

  getNumQueuedOperations() {
    if (this.device.connected) {
      return window.thingyController[this.tid].queuedOperations.length;
    }
  }

  getQueuedOperation(index) {
    if (this.device.connected) {
      if (window.thingyController[this.tid].queuedOperations.length >= index) {
        return window.thingyController[this.tid].queuedOperations[index];
      }
    }
  }

  removeQueuedOperation(index) {
    if (this.device.connected) {
      window.thingyController[this.tid].queuedOperations.splice(index, 1);
    }
  }

  enqueue(feature, method, f) {
    if (this.device.connected) {
      window.thingyController[this.tid].queuedOperations.push({feature, method, f});
      this.utilities.processEvent("operationqueued");
    }
  }

  dequeue() {
    if (this.device.connected) {
      return window.thingyController[this.tid].queuedOperations.shift();
    }
  }

  setExecutingQueuedOperations(bool) {
    if (this.device.connected) {
      window.thingyController[this.tid].executingQueuedOperations = bool;

      if (bool) {
       window.thingyController[this.tid].executedOperations = [];
      }
    }
  }

  getExecutingQueuedOperations() {
    if (this.device.connected) {
      return window.thingyController[this.tid].executingQueuedOperations;
    }
  }

  getDevice() {
    return this.device;
  }

  setDevice(device) {
    this.device = device;
    this.tid = device.device.id;
  }

  getExecutedOperation(index) {
    if (this.device.connected) {
      return window.thingyController[this.tid].executedOperations[index];
    }
  }

  getNumExecutedOperations() {
    if (this.device.connected) {
      return window.thingyController[this.tid].executedOperations.length;
    }
  }

  terminate() {
    window.thingyController[this.tid] = undefined;
  }
}

export default ThingyController;
