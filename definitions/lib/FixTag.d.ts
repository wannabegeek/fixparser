export declare class FixTag {
    tag: number;
    value: string;
    name: string;
    constructor(tag: number, name: string, value: string);
    equals(fixTag: any): boolean;
    toString(): string;
}
