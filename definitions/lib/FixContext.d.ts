import { FixTag } from './FixTag';
export declare class FIXRepeatingGroupContainer {
    private groups;
    constructor();
    addGroup(group: RepeatingGroupContext): void;
    contexts(): FixContext[];
    groupCount(): number;
    toString(): string;
}
export interface FixTagValuePair {
    tag: FixTag;
    value: string | FIXRepeatingGroupContainer;
}
export declare class FixTagValueContainer {
    private tags;
    constructor();
    set(tag: FixTag, value: string | FIXRepeatingGroupContainer): void;
    get(tag: FixTag): string | FIXRepeatingGroupContainer;
    forEach(callback: (tag: FixTag, value: string | FIXRepeatingGroupContainer) => void): void;
}
export declare class FixContext {
    private tags;
    constructor();
    addField(tag: FixTag, value: string): void;
    addRepeatingGroup(tag: FixTag, group: RepeatingGroupContext): void;
    containsTag(tag: FixTag): boolean;
    isRepeatingGroup(tag: FixTag): boolean;
    getTags(callback: (tag: FixTag, value: string | FIXRepeatingGroupContainer) => void): void;
    toString(): string;
    static isRepeatingGroup(value: string | FIXRepeatingGroupContainer): boolean;
}
export declare class RepeatingGroupContext extends FixContext {
    tag: FixTag;
    private repeatingGroupTags;
    private parent;
    constructor(tag: FixTag, repeatingGroupTags: string[], parent: FixContext);
    isValidTagForGroup(tag: FixTag): boolean;
    getParent(): FixContext;
}
export declare function isRepeatingGroup(context: any): context is RepeatingGroupContext;
