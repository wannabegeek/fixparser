import { FixParser } from '../lib/FixParser';
import { FixContext, RepeatingGroupContext, FIXRepeatingGroupContainer } from '../lib/FixContext';
import { FIX44Dictionary } from '../lib/Fix44Dictionary'
import { FidessaFIX44Dictionary } from '../lib/FidessaFix44Dictionary'

describe('add', () => {

    let testMessage = "8=FIX.4.4|9=122|35=D|34=215|49=CLIENT12|52=20100225-19:41:57.316|56=B|1=Marcel|11=13346|21=1|40=2|44=5|54=1|59=0|60=20100225-19:39:52.020|10=072|";

    let dictionary = FidessaFIX44Dictionary;

    it('should sum given numbers', () => {
        let ctx = FixParser.parse(testMessage, dictionary);
        console.log(logger(ctx, 0));
    });
});

function logger(ctx: FixContext, indent: number): string {
    let output = "";
    let first = true;
    ctx.getTags((tag, value) => {
        output += "   ".repeat(indent) + (first ? "- " : "  ") + tag.toString() + " => ";
        first = false;
        if (FixContext.isRepeatingGroup(value)) {
            let container = value as FIXRepeatingGroupContainer;
            output += "[" + container.groupCount() + "] {\n"
            for (let group of container.contexts()) {
                output += logger(group, indent + 1);
            }
            output += "   ".repeat(indent) + "  }";
        } else {
            output += value;
        }
        output += "\n";
    });

    return output;
}