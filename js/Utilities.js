import EventTarget from "./EventTarget.js";

class Utilities extends EventTarget {
    constructor(device) {
      super();
  
      this.device = device;
    }
  

    async wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    processEvent(type, feature, body, target = this.device) {
      let eventObject;

      switch(true) {
        case (type === feature || type === "operationdiscarded"):
          eventObject = body;
          break;
        default: {
          eventObject = {
            feature,
            body,
          }

          break;
        }
      }

      const ce = new CustomEvent(type, {detail: eventObject});
  
      target.dispatchEvent(ce);
    }
}

export default Utilities;