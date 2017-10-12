import { FixContext, RepeatingGroupContext, isRepeatingGroup } from './FixContext'
import { FixTag } from './FixTag'
import { FixDictionary } from './FixDictionary'

import * as assert from 'assert';

export class FixParser {

    public static parse(msg: string, dictionary: FixDictionary): FixContext {
        msg = msg.trim();
        let m = msg.replace(/[\r\n]+/g,"");
        let fix_bits = m.split(/[\|\01]|\^A|\\x01|\\001/g);

        let rootContext = new FixContext();
        let currentContext = rootContext;
        let repeatingGroups = [];

        var self = this;
        for (let fix_bit of fix_bits) {
            let components = fix_bit.split(/=/);
            let tag = +components[0].trim();    // + converts it to an integer
            let value = components[1];

            if (value !== undefined) {
                let tagDescription: string = dictionary.tags[tag];
                let fixTag = new FixTag(tag, tagDescription, value);

                if (dictionary.repeatingGroups[fixTag.name] !== undefined) {
                    // We have found the start of a repeating group
                    if (currentContext instanceof RepeatingGroupContext) {
                        let repeatingGroupContext = currentContext as RepeatingGroupContext; 
                        // We are alreading in a repeating group!
                        while (repeatingGroups.length != 0 && !repeatingGroupContext.isValidTagForGroup(fixTag)) {
                            assert(isRepeatingGroup(repeatingGroupContext), "Error dropping out of current repeating group on tag '" + fixTag + "' did we exit the group early");
                            repeatingGroupContext.getParent().addRepeatingGroup(repeatingGroupContext.tag, repeatingGroupContext);
                            currentContext = repeatingGroupContext.getParent();
                            repeatingGroups.pop(); // pop the completed group off the stack
                        }
                    }

                    let ctx = new RepeatingGroupContext(fixTag, dictionary.repeatingGroups[fixTag.name], currentContext);
                    repeatingGroups.push(ctx);
                    currentContext = ctx;

                } else if (repeatingGroups.length != 0) {
                    // We have one or more prepeating groups in progress
                    let repeatingGroupContext = currentContext as RepeatingGroupContext; 
                    while (repeatingGroups.length != 0 && !repeatingGroupContext.isValidTagForGroup(fixTag)) {
                        assert(isRepeatingGroup(repeatingGroupContext), "Error dropping out of current repeating group on tag '" + fixTag + "' did we exit the group early");
                        repeatingGroupContext.getParent().addRepeatingGroup(repeatingGroupContext.tag, repeatingGroupContext);
                        repeatingGroupContext = repeatingGroupContext.getParent() as RepeatingGroupContext;
                        repeatingGroups.pop(); // pop the completed group off the stack
                    }
                    currentContext = repeatingGroupContext;

                    if (currentContext.containsTag(fixTag)) {
                        // if the repeating group already contains this field, start the next
                        assert(isRepeatingGroup(repeatingGroupContext), "Error dropping out of current repeating group on tag '" + fixTag + "' did we exit the group early");
                        repeatingGroupContext.getParent().addRepeatingGroup(repeatingGroupContext.tag, repeatingGroupContext);
                        currentContext = new RepeatingGroupContext(repeatingGroupContext.tag, dictionary.repeatingGroups[repeatingGroupContext.tag.name], repeatingGroupContext.getParent());
                        repeatingGroups.pop(); // pop the completed group off the stack
                        repeatingGroups.push(repeatingGroupContext);
                    }

                    // else add it to the current one
                    currentContext.addField(fixTag, value);
                } else {
                    rootContext.addField(fixTag, value);
                }
            }
        }
    
        return rootContext;
    }
}
