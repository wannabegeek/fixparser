"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FixParser_1 = require("../lib/FixParser");
var FixContext_1 = require("../lib/FixContext");
var FidessaFix44Dictionary_1 = require("../lib/FidessaFix44Dictionary");
describe('add', function () {
    var testMessage = "8=FIX.4.4|9=122|35=D|34=215|49=CLIENT12|52=20100225-19:41:57.316|56=B|1=Marcel|11=13346|21=1|40=2|44=5|54=1|59=0|60=20100225-19:39:52.020|10=072|";
    var dictionary = FidessaFix44Dictionary_1.FidessaFIX44Dictionary;
    it('should sum given numbers', function () {
        var ctx = FixParser_1.FixParser.parse(testMessage, dictionary);
        console.log(logger(ctx, 0));
    });
});
function logger(ctx, indent) {
    var output = "";
    var first = true;
    ctx.getTags(function (tag, value) {
        output += "   ".repeat(indent) + (first ? "- " : "  ") + tag.toString() + " => ";
        first = false;
        if (FixContext_1.FixContext.isRepeatingGroup(value)) {
            var container = value;
            output += "[" + container.groupCount() + "] {\n";
            for (var _i = 0, _a = container.contexts(); _i < _a.length; _i++) {
                var group = _a[_i];
                output += logger(group, indent + 1);
            }
            output += "   ".repeat(indent) + "  }";
        }
        else {
            output += value;
        }
        output += "\n";
    });
    return output;
}
