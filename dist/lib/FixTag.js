"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FixTag = (function () {
    function FixTag(tag, name, value) {
        this.tag = tag;
        this.value = value;
        this.tag = tag;
        this.name = name || "Unknown";
        this.value = value;
    }
    FixTag.prototype.equals = function (fixTag) {
        return this.tag === fixTag.tag;
    };
    FixTag.prototype.toString = function () {
        return this.name + "[" + this.tag + "]";
    };
    return FixTag;
}());
exports.FixTag = FixTag;
