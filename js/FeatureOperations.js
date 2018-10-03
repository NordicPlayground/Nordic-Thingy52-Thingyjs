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

import EventTarget from "./EventTarget.js";
import ThingyController from "./ThingyController.js";
import Utilities from "./Utilities.js";

class FeatureOperations {
  constructor(device, type) {
    this.device = device;
    this.utilities = new Utilities(this.device);
    this.type = type || this.constructor.name;
    this.latestReading = new Map();
  }

  async _connect() {
    if (!("thingyController" in this)) {
      // has to be put here rather than in the constructor as we need access to the id of the device
      // which is not accessible before the device has performed its connect method
      this.thingyController = new ThingyController(this.device);
    }

    this.thingyController.addExecutedOperation(this.type, "connect");
    
    if (("connected" in this.characteristic) && this.characteristic.connected) {
      if (this.device.logEnabled) {
        console.log(`You're already connected to the ${this.type} feature`);
      }

      return true;
    }

    if (this.thingyController.getGattStatus()) {
      try {
        this.thingyController.setGattStatus(false);

        this.service.service = await this.device.server.getPrimaryService(this.service.uuid);
        this.characteristic.characteristic = await this.service.service.getCharacteristic(this.characteristic.uuid);

        this.thingyController.setGattStatus(true);

        this.characteristic.connected = true;
        this.characteristic.notifying = false;
        this.characteristic.hasEventListener = false;

        /*
        // This approach needs to be fundamentally revised
        // For now we'll leave it here, commented out
        if (this.characteristic.verifyAction && this.characteristic.verifyReaction) {
          await this.characteristic.verifyAction();

          this.addEventListener("verifyReaction", this.characteristic.verifyReaction);

          const verifyValue = await this._notify(true, true);

          // something needs to be done here depending on the value returned
          // by the functions over. Could prove difficult, will have to see if
          // we can alter how verifyAction & verifyReaction works, as it's
          // only used by the microphone per now
        }*/

        if (this.device.logEnabled) {
          console.log(`Connected to the ${this.type} feature`);
        }

        return true;
      } catch (error) {
        if ("thingyController" in this) {
          this.thingyController.setGattStatus(true);
          this.thingyController.enqueue(this.type, "connect", this._connect.bind(this));
        }
        
        this.characteristic.connected = false;

        if ("utilities" in this) {
          this.utilities.processEvent("error", this.type, error);
        }
        
        return false;
      }
    } else {
      this.thingyController.enqueue(this.type, "connect", this._connect.bind(this));
      return false;
    }
  }

  async _read(returnRaw = false) {
    try {
      let connectIteration = 0;
      let readIteration = 0;
      let returnValue = false;

      if (!this.characteristic.connected) {
        await this._connect();
      }

      while (!this.characteristic.connected) {
        connectIteration++;

        if (connectIteration === 250) {
          const error = new Error(`As we couldn't connect to the ${this.type} feature, the read operation can't be executed`);
          this.utilities.processEvent("error", this.type, error);
          return false;
        }

        // waiting a set amount of time for any ongoing BLE operation to conclude
        await this.utilities.wait(20);
      }

      this.thingyController.addExecutedOperation(this.type, "read");

      if (!this.hasProperty("read")) {
        const error = new Error(`The ${this.type} feature does not support the read method`);
        this.utilities.processEvent("error", this.type, error);
        return false;
      }

      if (!this.characteristic.decoder) {
        const error = new Error("The characteristic you're trying to read does not have a specified decoder");
        this.utilities.processEvent("error", this.type, error);
        return false;
      }

      while (returnValue === false) {
        readIteration++;

        if (readIteration === 250) {
          const error = new Error("We could not process your read request at the moment due to high operational traffic");
          this.utilities.processEvent("error", this.type, error);
          return false;
        }

        if (this.thingyController.getGattStatus()) {
          this.thingyController.setGattStatus(false);
          let prop = await this.characteristic.characteristic.readValue();
          this.thingyController.setGattStatus(true);

          if (returnRaw !== true) {
            prop = await this.characteristic.decoder(prop);
          }

          returnValue = prop;
        } else {
          // waiting a set amount of time for any ongoing BLE operation to conclude
          await this.utilities.wait(20);
        }
      }

      return returnValue;
    } catch (error) {
      this.thingyController.setGattStatus(true);
      this.utilities.processEvent("error", this.type, error);
      return false;
    }
  }

  async _write(prop) {
    try {
      if (prop === undefined) {
        const error = new Error("You have to write a non-empty body");
        this.utilities.processEvent("error", this.type, error);
        return false;
      }

      let connectIteration = 0;
      let writeIteration = 0;
      let returnValue = false;

      if (!this.characteristic.connected) {
        await this._connect();
      }

      while (!this.characteristic.connected) {
        connectIteration++;

        if (connectIteration === 250) {
          const error = new Error(`As we couldn't connect to the ${this.type} feature, the write operation can't be executed`);
          this.utilities.processEvent("error", this.type, error);
          return false;
        }

        // waiting a set amount of time for any ongoing BLE operation to conclude
        await this.utilities.wait(20);
      }

      this.thingyController.addExecutedOperation(this.type, "write");

      if (!this.hasProperty("write") && !this.hasProperty("writeWithoutResponse")) {
        const error = new Error(`The ${this.type} feature does not support the write or writeWithoutResponse method`);
        this.utilities.processEvent("error", this.type, error);
        return false;
      }

      if (!this.characteristic.encoder) {
        const error = new Error("The characteristic you're trying to write does not have a specified encoder");
        this.utilities.processEvent("error", this.type, error);
        return false;
      }

      while (returnValue === false) {
        writeIteration++;

        if (writeIteration === 250) {
          const error = new Error("We could not process your read request at the moment due to high operational traffic");
          this.utilities.processEvent("error", this.type, error);
          return false;
        }

        if (this.thingyController.getGattStatus()) {
          const encodedProp = await this.characteristic.encoder(prop);
          this.thingyController.setGattStatus(false);
          await this.characteristic.characteristic.writeValue(encodedProp);
          this.thingyController.setGattStatus(true);

          // emit event for successful write
          this.utilities.processEvent("write", this.type, prop);

          returnValue = true;
        } else {
          // waiting a set amount of time for any ongoing BLE operation to conclude
          await this.utilities.wait(20);
        }
      }

      return returnValue;
    } catch (error) {
      this.thingyController.setGattStatus(true);
      this.utilities.processEvent("error", this.type, error);
      return false;
    }
  }

  async _notify(enable, verify = false) {
    if (!(enable === true || enable === false)) {
      const error = new Error("You have to specify the enable parameter (true/false)");
      this.utilities.processEvent("error", this.type, error);
      return;
    }

    if (!this.characteristic.connected) {
      const connected = await this._connect();

      if (!connected) {
        this.thingyController.enqueue(this.type, (enable ? "start" : "stop"), this._notify.bind(this, enable, verify));
        return false;
      }
    }

    this.thingyController.addExecutedOperation(this.type, (enable ? "start" : "stop"));

    if (!this.hasProperty("notify") && !this.hasProperty("indicate")) {
      const error = new Error(`The ${this.type} feature does not support the start/stop methods`);
      this.utilities.processEvent("error", this.type, error);
      return;
    }

    if (enable === this.characteristic.notifying) {
      if (this.device.logEnabled) {
        console.log(`The ${this.type} feature has already ${(this.characteristic.notifying ? "enabled" : "disabled")} notifications`);
      }
      // could also just return, but technically the operation
      // completed successfully as the desired outcome was achieved
      return true;
    }

    if (!this.characteristic.decoder) {
      const error = new Error("The characteristic you're trying to notify does not have a specified decoder");
      this.utilities.processEvent("error", this.type, error);
      return;
    }

    const onReading = async (e) => {
      try {
        const data = await this.characteristic.decoder(e.target.value);

        if (verify) {
          /*ce = new CustomEvent("verifyReaction", {detail: {feature: this.type, data: decodedData}});
          this.dispatchEvent(ce);*/
        } else {
          this.utilities.processEvent(this.type, this.type, data);
        }
      } catch (error) {
        this.utilities.processEvent("error", this.type, error);
      }
    };

    const characteristic = this.characteristic.characteristic;

    if (this.thingyController.getGattStatus()) {
      this.thingyController.setGattStatus(false);
      if (enable) {
        try {
          const csn = await characteristic.startNotifications();
          this.thingyController.setGattStatus(true);
          
          if (!this.characteristic.hasEventListener) {
            csn.addEventListener("characteristicvaluechanged", onReading.bind(this));
            this.characteristic.hasEventListener = true;
          }

          this.characteristic.notifying = true;

          if (this.device.logEnabled) {
            console.log(`Notifications enabled for the ${this.type} feature`);
          }

          return true;
        } catch (error) {
          this.thingyController.setGattStatus(true);
          this.thingyController.enqueue(this.type, (enable ? "start" : "stop"), this._notify.bind(this, enable, verify));
          this.characteristic.notifying = false;
          this.utilities.processEvent("error", this.type, error);
          return false;
        }
      } else {
        try {
          const csn = await characteristic.stopNotifications();
          this.thingyController.setGattStatus(true);

          this.characteristic.notifying = false;

          // not ideal
          if (this.type === "microphone") {
            if (this.audioCtx) {
              this.suspendAudioContext();
            }
          }

          if (this.device.logEnabled) {
            console.log(`Notifications disabled for the ${this.type} feature`);
          }

          return true;
        } catch (error) {
          this.thingyController.setGattStatus(true);
          this.thingyController.enqueue(this.type, (enable ? "start" : "stop"), this._notify.bind(this, enable, verify));
          this.characteristic.notifying = true;
          this.utilities.processEvent("error", this.type, error);
          return false;
        }
      }
    } else {
      this.thingyController.enqueue(this.type, (enable ? "start" : "stop"), this._notify.bind(this, enable, verify));
      return false;
    }
  }

  hasProperty(property) {
    return (this.characteristic.characteristic.properties[property] === true ? true : false);
  }

  async start() {
    return await this._notify(true);
  }

  async stop() {
    return await this._notify(false);
  }

  async read() {
    return await this._read();
  }

  async write(data) {
    return await this._write(data);
  }
}

export default FeatureOperations;
