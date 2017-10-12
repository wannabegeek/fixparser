export class FixTag {
    public name: string;

    constructor(public tag: number, name: string, public value: string) {
        this.tag = tag;
        this.name = name || "Unknown";
        this.value = value;
    }

    public equals(fixTag): boolean {
        return this.tag === fixTag.tag;
    }

    public toString(): string {
        return this.name + "[" + this.tag + "]";
    }
}
