/*
Copyright 2018 Kenneth Rohde Christiansen

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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
function defineProperties(target, descriptions) {
    for (var property in descriptions) {
        Object.defineProperty(target, property, {
            configurable: true,
            value: descriptions[property],
        });
    }
}
var EventTargetMixin = function (superclass) {
    var eventNames = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        eventNames[_i - 1] = arguments[_i];
    }
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.call(this, args) || this;
            var eventTarget = document.createDocumentFragment();
            _this.addEventListener = function (type) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return eventTarget.addEventListener.apply(eventTarget, [type].concat(args));
            };
            _this.removeEventListener = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return eventTarget.removeEventListener.apply(eventTarget, args);
            };
            _this.dispatchEvent = function (event) {
                defineProperties(event, { currentTarget: _this });
                if (!event.target) {
                    defineProperties(event, { target: _this });
                }
                var methodName = "on" + event.type;
                if (typeof _this[methodName] === "function") {
                    _this[methodName](event);
                }
                var retValue = eventTarget.dispatchEvent(event);
                if (retValue && _this.parentNode) {
                    _this.parentNode.dispatchEvent(event);
                }
                defineProperties(event, { currentTarget: null, target: null });
                return retValue;
            };
            return _this;
        }
        return class_1;
    }(superclass));
};
var EventTarget = /** @class */ (function (_super) {
    __extends(EventTarget, _super);
    function EventTarget() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EventTarget;
}(EventTargetMixin(Object)));
export default EventTarget;
;
