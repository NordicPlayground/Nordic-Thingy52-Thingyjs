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

class ThingyController extends EventTarget {
  constructor(device) {
    super();

    // thingy id
    this.setDevice(device);
    this._init();
  }

  _init() {
    if (window.thingyController === undefined) {
        window.thingyController = {};
      }

      if (window.thingyController[this.tid] === undefined) {
        window.thingyController[this.tid] = {};
      }

      if (window.thingyController[this.tid].gattStatus === undefined) {
        window.thingyController[this.tid].gattStatus = false;
      }

      if (window.thingyController[this.tid].operationQueue === undefined) {
        window.thingyController[this.tid].operationQueue = [];
      }

      if (window.thingyController[this.tid].executingQueuedOperations === undefined) {
        window.thingyController[this.tid].executingQueuedOperations = false;
      }

      if (window.thingyController[this.tid].numExecutedOperationsWhileExecutingQueuedOperations === undefined) {
        window.thingyController[this.tid].numExecutedOperationsWhileExecutingQueuedOperations = 0;
      }
  }

  setGattStatus(bool) {
    window.thingyController[this.tid].gattStatus = bool;

    if (bool) {
      window.thingyController[this.tid].numExecutedOperationsWhileExecutingQueuedOperations++;
      this.device.dispatchEvent("gattavailable");
    }
  }

  getGattStatus() {
    return window.thingyController[this.tid].gattStatus;
  }

  getQueueSize() {
    return window.thingyController[this.tid].operationQueue.length;
  }

  getNextQueueElement() {
    return window.thingyController[this.tid].operationQueue.shift();
  }

  addQueueElement(feature, method, f) {
    window.thingyController[this.tid].operationQueue.push({feature, method, f});
  }

  setExecutingQueuedOperations(bool) {
    window.thingyController[this.tid].executingQueuedOperations = bool;

    if (bool) {
      window.thingyController[this.tid].numExecutedOperationsWhileExecutingQueuedOperations = 0;
    }
  }

  getExecutingQueuedOperations() {
      return window.thingyController[this.tid].executingQueuedOperations;
  }

  getDevice() {
    return this.device;
  }

  setDevice(device) {
    this.device = device;
    this.tid = this.device.device.id;
  }

  // get 
  // window.thingyController[this.tid].numExecutedOperationsWhileExecutingQueuedOperations

  resetController() {
    window.thingyController[this.tid] = undefined;
  }
}

export default ThingyController;
