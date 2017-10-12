"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var FIXRepeatingGroupContainer = (function () {
    function FIXRepeatingGroupContainer() {
        this.groups = [];
    }
    FIXRepeatingGroupContainer.prototype.addGroup = function (group) {
        this.groups.push(group);
    };
    FIXRepeatingGroupContainer.prototype.contexts = function () {
        return this.groups;
    };
    FIXRepeatingGroupContainer.prototype.groupCount = function () {
        return this.groups.length;
    };
    FIXRepeatingGroupContainer.prototype.toString = function () {
        var result = "" + this.groups.length + " => ";
        for (var _i = 0, _a = this.groups; _i < _a.length; _i++) {
            var group = _a[_i];
            result += "" + group;
        }
        ;
        return result;
    };
    return FIXRepeatingGroupContainer;
}());
exports.FIXRepeatingGroupContainer = FIXRepeatingGroupContainer;
var FixTagValueContainer = (function () {
    function FixTagValueContainer() {
        this.tags = {};
    }
    FixTagValueContainer.prototype.set = function (tag, value) {
        this.tags[tag.name] = { tag: tag, value: value };
    };
    FixTagValueContainer.prototype.get = function (tag) {
        var result = this.tags[tag.name];
        return result !== undefined ? result.value : null;
    };
    FixTagValueContainer.prototype.forEach = function (callback) {
        for (var key in this.tags) {
            var kv = this.tags[key];
            callback(kv.tag, kv.value);
        }
    };
    return FixTagValueContainer;
}());
exports.FixTagValueContainer = FixTagValueContainer;
var FixContext = (function () {
    function FixContext() {
        this.tags = new FixTagValueContainer();
    }
    FixContext.prototype.addField = function (tag, value) {
        this.tags.set(tag, value);
    };
    FixContext.prototype.addRepeatingGroup = function (tag, group) {
        var existingTag = this.tags.get(tag);
        if (existingTag != null) {
            if (!this.isRepeatingGroup(tag)) {
                throw new Error(tag.toString() + " is not a repeating group");
            }
            var groupContainer = this.tags.get(tag);
            groupContainer.addGroup(group);
        }
        else {
            var groupContainer = new FIXRepeatingGroupContainer();
            groupContainer.addGroup(group);
            this.tags.set(tag, groupContainer);
        }
    };
    FixContext.prototype.containsTag = function (tag) {
        return this.tags.get(tag) !== null;
    };
    FixContext.prototype.isRepeatingGroup = function (tag) {
        return FixContext.isRepeatingGroup(this.tags.get(tag));
    };
    FixContext.prototype.getTags = function (callback) {
        this.tags.forEach(callback);
    };
    FixContext.prototype.toString = function () {
        var result = "";
        this.getTags(function (key, value) {
            result += key + " -> " + value + "\n";
        });
        return result;
    };
    FixContext.isRepeatingGroup = function (value) {
        return value instanceof FIXRepeatingGroupContainer;
    };
    return FixContext;
}());
exports.FixContext = FixContext;
var RepeatingGroupContext = (function (_super) {
    __extends(RepeatingGroupContext, _super);
    function RepeatingGroupContext(tag, repeatingGroupTags, parent) {
        var _this = _super.call(this) || this;
        _this.tag = tag;
        _this.repeatingGroupTags = repeatingGroupTags;
        _this.parent = parent;
        if (repeatingGroupTags === undefined) {
            throw new Error("Repeating group shouldn't be empty");
        }
        return _this;
    }
    RepeatingGroupContext.prototype.isValidTagForGroup = function (tag) {
        return this.repeatingGroupTags.indexOf(tag.name) > -1;
    };
    RepeatingGroupContext.prototype.getParent = function () {
        return this.parent;
    };
    return RepeatingGroupContext;
}(FixContext));
exports.RepeatingGroupContext = RepeatingGroupContext;
function isRepeatingGroup(context) {
    return context.parent !== undefined;
}
exports.isRepeatingGroup = isRepeatingGroup;
