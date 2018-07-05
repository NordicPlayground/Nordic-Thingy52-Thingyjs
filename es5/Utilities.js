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
import EventTarget from "./EventTarget.js";
var Utilities = /** @class */ (function (_super) {
    __extends(Utilities, _super);
    function Utilities(device) {
        var _this = _super.call(this) || this;
        _this.wait = function (ms) {
            return new Promise(function (resolve) { return setTimeout(resolve, ms); });
        };
        _this.processEvent = function (type, feature, body, target) {
            if (target === void 0) { target = _this.device; }
            var eventObject;
            switch (true) {
                case (type === feature || type === "operationdiscarded"):
                    eventObject = body;
                    break;
                default: {
                    eventObject = {
                        feature: feature,
                        body: body,
                    };
                    break;
                }
            }
            var ce = new CustomEvent(type, { detail: eventObject });
            target.dispatchEvent(ce);
        };
        _this.device = device;
        return _this;
    }
    return Utilities;
}(EventTarget));
export default Utilities;
