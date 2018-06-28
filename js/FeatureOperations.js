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

class FeatureOperations extends EventTarget {
  constructor(device, type) {
    super();
    this.device = device;
    this.type = type || this.constructor.name;
    this.latestReading = new Map();
  }

  async _connect() {
    if (("connected" in this.characteristic) && this.characteristic.connected) {
      console.log(`You're already connected to the ${this.type} feature`);
      return true;
    }

    if (!this.device.connected) {
      const e = new Error(`The device is not currently connected to a central unit`);
      this.processError(e);
      return false;
    }

    if (this.getGattAvailable()) {
      try {
        this.setGattBusy();

        this.service.service = await this.device.server.getPrimaryService(this.service.uuid);

        this.characteristic.characteristic = await this.service.service.getCharacteristic(this.characteristic.uuid);
        this.setGattAvailable();
        this.characteristic.connected = true;
        this.characteristic.notifying = false;


        if (this.characteristic.verifyAction && this.characteristic.verifyReaction) {
          await this.characteristic.verifyAction();

          this.addEventListener("verifyReaction", this.characteristic.verifyReaction);

          const verifyValue = await this._notify(true, true);

          // something needs to be done here depending on the value returned
          // by the functions over. Could prove difficult, will have to see if
          // I can alter how verifyAction & verifyReaction works, as it's
          // only used by the microphone per now
        }

        if (this.device.logEnabled) {
          console.log(`Connected to the ${this.type} feature`);
        }

        return true;
      } catch (error) {
        this.setGattAvailable();
        this.queueOperation("connect", this._connect.bind(this));
        this.characteristic.connected = false;
        this.processError(error);
        return false;
      }
    } else {
      this.queueOperation("connect", this._connect.bind(this));
      return false;
    }
  }

  async _wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

        if (connectIteration === 50) {
          const e = new Error(`As we couldn't connect to the ${this.type} feature, the read operation can't be executed`);
          this.processError(e);
          return false;
        }

        // waiting for the connect operation to go through
        await this._wait(200);
      }

      if (!this.hasProperty("read")) {
        const e = new Error(`The ${this.type} feature does not support the read method`);
        this.processError(e);
        return false;
      }

      if (!this.characteristic.decoder) {
        const e = new Error("The characteristic you're trying to read does not have a specified decoder");
        this.processError(e);
        return false;
      }

      while (returnValue === false) {
        readIteration++;

        if (readIteration === 50) {
          const e = new Error("We could not process your read request at the moment due to high operational traffic");
          this.processError(e);
          return false;
        }

        if (!this.device.connected) {
          const e = new Error(`The device is not currently connected to a central unit`);
          this.processError(e);
          return false;
        }

        if (this.getGattAvailable()) {
          this.setGattBusy();
          let prop = await this.characteristic.characteristic.readValue();
          this.setGattAvailable();

          if (returnRaw !== true) {
            prop = await this.characteristic.decoder(prop);
          }

          returnValue = prop;
        } else {
          await this._wait(200);
        }
      }

      return returnValue;
    } catch (error) {
      this.setGattAvailable();
      this.processError(error);
      return false;
    }
  }

  async _write(prop) {
    try {
      if (prop === undefined) {
        const e = new Error("You have to write a non-empty body");
        this.processError(e);
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

        if (connectIteration === 50) {
          const e = new Error(`As we couldn't connect to the ${this.type} feature, the read operation can't be executed`);
          this.processError(e);
          return false;
        }

        // waiting for the connect operation to go through
        await this._wait(200);
      }

      if (!this.hasProperty("write") && !this.hasProperty("writeWithoutResponse")) {
        const e = new Error(`The ${this.type} feature does not support the write or writeWithoutResponse method`);
        this.processError(e);
        return false;
      }

      if (!this.characteristic.encoder) {
        const e = new Error("The characteristic you're trying to write does not have a specified encoder");
        this.processError(e);
        return false;
      }

      while (returnValue === false) {
        writeIteration++;

        if (writeIteration === 50) {
          const e = new Error("We could not process your read request at the moment due to high operational traffic");
          this.processError(e);
          return false;
        }

        if (!this.device.connected) {
          const e = new Error(`The device is not currently connected to a central unit`);
          this.processError(e);
          return false;
        }

        if (this.getGattAvailable()) {
          const encodedProp = await this.characteristic.encoder(prop);
          this.setGattBusy();
          await this.characteristic.characteristic.writeValue(encodedProp);
          this.setGattAvailable();

          // emit event for successful write
          const ce = new CustomEvent("write", {detail: {
            feature: this.type,
            value: prop,
          }});
          this.device.dispatchEvent(ce);
          returnValue = true;
        } else {
          await this._wait(200);
        }
      }

      return returnValue;
    } catch (error) {
      this.setGattAvailable();
      this.processError(error);
      return false;
    }
  }

  async _notify(enable, verify = false) {
    if (!(enable === true || enable === false)) {
      const e = new Error("You have to specify the enable parameter (true/false)");
      this.processError(e);
      return;
    }

    if (!this.characteristic.connected) {
      const connected = await this._connect();

      if (!connected) {
        this.queueOperation("notify", this._notify.bind(this, enable, verify));
        return false;
      }
    }

    if (!this.hasProperty("notify")) {
      const e = new Error(`The ${this.type} feature does not support the start/stop methods`);
      this.processError(e);
      return;
    }

    if (enable === this.characteristic.notifying) {
      console.log(`The ${this.type} feature has already ${(this.characteristic.notifying ? "enabled" : "disabled")} notifications`);
      // could also just return, but technically the operation
      // completed successfully as the desired outcome was achieved
      return true;
    }

    if (!this.characteristic.decoder) {
      const e = new Error("The characteristic you're trying to notify does not have a specified decoder");
      this.processError(e);
      return;
    }

    const onReading = async (e) => {
      try {
        const decodedData = await this.characteristic.decoder(e.target.value);
        let ce;

        if (verify) {
          ce = new CustomEvent("verifyReaction", {detail: {feature: this.type, data: decodedData}});
          this.dispatchEvent(ce);
        } else {
          this.latestReading.clear();

          for (const elem in decodedData) {
            this.latestReading.set(elem, decodedData[elem]);
          }

          const e = new Event("reading");
          this.dispatchEvent(e);

          ce = new CustomEvent("characteristicvaluechanged", {detail: {feature: this.type, data: decodedData}});
          this.device.dispatchEvent(ce);
        }
      } catch (error) {
        // have to find a way to remove event listeners from characteristics
      }
    };

    if (!this.device.connected) {
      const e = new Error(`The device is not currently connected to a central unit`);
      this.processError(e);
      return;
    }

    const characteristic = this.characteristic.characteristic;

    if (this.getGattAvailable()) {
      this.setGattBusy();
      if (enable) {
        try {
          const csn = await characteristic.startNotifications();
          this.setGattAvailable();

          csn.addEventListener("characteristicvaluechanged", onReading.bind(this));

          this.characteristic.notifying = true;

          if (this.device.logEnabled) {
            console.log(`Notifications enabled for the ${this.type} feature`);
          }

          return true;
        } catch (error) {
          this.setGattAvailable();
          this.queueOperation("notify", this._notify.bind(this, enable, verify));
          this.characteristic.notifying = false;
          this.processError(error);
          return false;
        }
      } else {
        try {
          const csn = await characteristic.stopNotifications();
          this.setGattAvailable();

          csn.removeEventListener("characteristicvaluechanged", onReading.bind(this));

          this.characteristic.notifying = false;

          if (this.device.logEnabled) {
            console.log(`Notifications disabled for the ${this.type} feature`);
          }

          return true;
        } catch (error) {
          this.setGattAvailable();
          this.queueOperation("notify", this._notify.bind(this, enable, verify));
          this.characteristic.notifying = true;
          this.processError(error);
          return false;
        }
      }
    } else {
      this.queueOperation("notify", this._notify.bind(this, enable, verify));
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

  setGattBusy() {
    if (this.device.connected) {
      window.thingyController[this.device.device.id].gattBusy = true;
    } else {
      const e = new Error(`The device is not currently connected to a central unit`);
      this.processError(e);
    }
  }

  setGattAvailable() {
    if (this.device.connected) {
      window.thingyController[this.device.device.id].gattBusy = false;
      this.device.dispatchEvent(new Event("gattavailable"));
    } else {
      const e = new Error(`The device is not currently connected to a central unit`);
      this.processError(e);
    }
  }

  getGattAvailable() {
    return this.device.connected ? !window.thingyController[this.device.device.id].gattBusy : false;
  }

  queueOperation(method, f) {
    if (this.device.connected) {
      window.thingyController[this.device.device.id].operationQueue.push({feature: this.type, method, f});
      this.device.dispatchEvent(new Event("operationqueued"));
    } else {
      const e = new Error(`The device is not currently connected to a central unit`);
      this.processError(e);
    }
  }

  processError(error) {
    if (this.device.logEnabled) {
      console.error(`The ${this.type} feature has reported an error: ${error}`);
    }

    const ce = new CustomEvent("error", {detail: {
      feature: this.type,
      error,
    }});

    this.device.dispatchEvent(ce);
  }
}

export default FeatureOperations;
