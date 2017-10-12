export interface FixDictionary {
    tags: {
        [key: number]: string;
    };
    repeatingGroups: {
        [key: string]: string[];
    };
}
