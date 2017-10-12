"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FixContext_1 = require("./FixContext");
var FixTag_1 = require("./FixTag");
var assert = require("assert");
var FixParser = (function () {
    function FixParser() {
    }
    FixParser.parse = function (msg, dictionary) {
        msg = msg.trim();
        var m = msg.replace(/[\r\n]+/g, "");
        var fix_bits = m.split(/[\|\01]|\^A|\\x01|\\001/g);
        var rootContext = new FixContext_1.FixContext();
        var currentContext = rootContext;
        var repeatingGroups = [];
        var self = this;
        for (var _i = 0, fix_bits_1 = fix_bits; _i < fix_bits_1.length; _i++) {
            var fix_bit = fix_bits_1[_i];
            var components = fix_bit.split(/=/);
            var tag = +components[0].trim();
            var value = components[1];
            if (value !== undefined) {
                var tagDescription = dictionary.tags[tag];
                var fixTag = new FixTag_1.FixTag(tag, tagDescription, value);
                if (dictionary.repeatingGroups[fixTag.name] !== undefined) {
                    if (currentContext instanceof FixContext_1.RepeatingGroupContext) {
                        var repeatingGroupContext = currentContext;
                        while (repeatingGroups.length != 0 && !repeatingGroupContext.isValidTagForGroup(fixTag)) {
                            assert(FixContext_1.isRepeatingGroup(repeatingGroupContext), "Error dropping out of current repeating group on tag '" + fixTag + "' did we exit the group early");
                            repeatingGroupContext.getParent().addRepeatingGroup(repeatingGroupContext.tag, repeatingGroupContext);
                            currentContext = repeatingGroupContext.getParent();
                            repeatingGroups.pop();
                        }
                    }
                    var ctx = new FixContext_1.RepeatingGroupContext(fixTag, dictionary.repeatingGroups[fixTag.name], currentContext);
                    repeatingGroups.push(ctx);
                    currentContext = ctx;
                }
                else if (repeatingGroups.length != 0) {
                    var repeatingGroupContext = currentContext;
                    while (repeatingGroups.length != 0 && !repeatingGroupContext.isValidTagForGroup(fixTag)) {
                        assert(FixContext_1.isRepeatingGroup(repeatingGroupContext), "Error dropping out of current repeating group on tag '" + fixTag + "' did we exit the group early");
                        repeatingGroupContext.getParent().addRepeatingGroup(repeatingGroupContext.tag, repeatingGroupContext);
                        repeatingGroupContext = repeatingGroupContext.getParent();
                        repeatingGroups.pop();
                    }
                    currentContext = repeatingGroupContext;
                    if (currentContext.containsTag(fixTag)) {
                        assert(FixContext_1.isRepeatingGroup(repeatingGroupContext), "Error dropping out of current repeating group on tag '" + fixTag + "' did we exit the group early");
                        repeatingGroupContext.getParent().addRepeatingGroup(repeatingGroupContext.tag, repeatingGroupContext);
                        currentContext = new FixContext_1.RepeatingGroupContext(repeatingGroupContext.tag, dictionary.repeatingGroups[repeatingGroupContext.tag.name], repeatingGroupContext.getParent());
                        repeatingGroups.pop();
                        repeatingGroups.push(repeatingGroupContext);
                    }
                    currentContext.addField(fixTag, value);
                }
                else {
                    rootContext.addField(fixTag, value);
                }
            }
        }
        return rootContext;
    };
    return FixParser;
}());
exports.FixParser = FixParser;
