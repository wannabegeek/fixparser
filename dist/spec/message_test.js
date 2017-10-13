"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FixParser_1 = require("../lib/FixParser");
var FixContext_1 = require("../lib/FixContext");
var Fix44Dictionary_1 = require("../lib/Fix44Dictionary");
describe('add', function () {
    var testMessage = "8=FIX.4.4^A9=1327^A35=8^A34=883^A49=FID_UAB_LON_OES^A56=BARC_UAB_LON_OES^A43=N^A52=20170925-09:11:14.123^A453=7^A448=sarvakam^A447=D^A452=11^A802=3^A523=sarvakam^A803=2^A523=BarCapFutures.FETServAP^A803=24^A523=SG^A803=25^A448=QAClient^A447=D^A452=3^A802=1^A523=1234561^A803=3^A448=QAAgency^A447=D^A452=24^A802=5^A523=QACLIENTAGENCY^A803=19^A523=12345643^A803=3^A523=123Client^A803=100^A523=123Client^A803=28^A523=A^A803=26^A448=BPLC^A447=D^A452=7^A448=sarvakam^A447=D^A452=39^A448=13571113^A447=P^A452=3^A448=2000581^A447=P^A452=12^A10=121^A";
    var dictionary = Fix44Dictionary_1.FIX44Dictionary;
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
