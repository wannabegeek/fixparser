import { FixTag } from './FixTag'

export class FIXRepeatingGroupContainer {
    private groups: RepeatingGroupContext[] = [];

    constructor() {
    }

    public addGroup(group: RepeatingGroupContext) {
        this.groups.push(group);
    }

    public contexts(): FixContext[] {
        return this.groups;
    }

    public groupCount(): number {
        return this.groups.length;
    }

    public toString(): string {
        let result = "" + this.groups.length + " => ";
        for(let group of this.groups) {
            result += "" + group;
        };

        return result;
    }
}

export interface FixTagValuePair {
    tag: FixTag,
    value: string | FIXRepeatingGroupContainer
}

export class FixTagValueContainer {

    private tags: {[key: string]: FixTagValuePair} = {};

    constructor() {
    }

    public set(tag: FixTag, value: string | FIXRepeatingGroupContainer) {
        this.tags[tag.name] = {tag: tag, value: value};
    }

    public get(tag: FixTag): string | FIXRepeatingGroupContainer {
        let result = this.tags[tag.name];
        return result !== undefined ? result.value : null;
    }

    public forEach(callback: (tag: FixTag, value: string | FIXRepeatingGroupContainer) => void) {
        for (let key in this.tags) {
            let kv: FixTagValuePair = this.tags[key];
            callback(kv.tag, kv.value);
        }
    }
}

export class FixContext {
    private tags = new FixTagValueContainer();

    constructor() {
    }

    public addField(tag: FixTag, value: string) {
        this.tags.set(tag, value);
    }

    public addRepeatingGroup(tag: FixTag, group: RepeatingGroupContext): void {
        var existingTag = this.tags.get(tag);
        if (existingTag != null) {
            if (!this.isRepeatingGroup(tag)) {
                throw new Error(tag.toString() + " is not a repeating group");
            }
            let groupContainer: FIXRepeatingGroupContainer = this.tags.get(tag) as FIXRepeatingGroupContainer;
            groupContainer.addGroup(group);
        } else {
            let groupContainer = new FIXRepeatingGroupContainer();
            groupContainer.addGroup(group);
            this.tags.set(tag, groupContainer);
        }
    }

    // TODO - This fails to compare
    public containsTag(tag: FixTag): boolean {
        return this.tags.get(tag) !== null;
    }

    public isRepeatingGroup(tag: FixTag): boolean {
        return FixContext.isRepeatingGroup(this.tags.get(tag));
    }

    public getTags(callback: (tag: FixTag, value: string | FIXRepeatingGroupContainer) => void) {
        this.tags.forEach(callback);
    }

    public toString(): string {
        let result = "";
        this.getTags((key, value) => {
            result += key + " -> " + value + "\n";
        });

        return result;
    }

    public static isRepeatingGroup(value: string | FIXRepeatingGroupContainer) {
        return value instanceof FIXRepeatingGroupContainer;
    }
}

export class RepeatingGroupContext extends FixContext {
    constructor(public tag: FixTag, private repeatingGroupTags: string[], private parent: FixContext) {
        super();
        if (repeatingGroupTags === undefined) {
            throw new Error("Repeating group shouldn't be empty");
        }
    }

    public isValidTagForGroup(tag: FixTag): boolean {
        return this.repeatingGroupTags.indexOf(tag.name) > -1;
    }

    public getParent(): FixContext {
        return this.parent;
    }
}

export function isRepeatingGroup(context: any): context is RepeatingGroupContext {
    return context.parent !== undefined;
}