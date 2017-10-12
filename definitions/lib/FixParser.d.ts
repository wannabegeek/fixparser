import { FixContext } from './FixContext';
import { FixDictionary } from './FixDictionary';
export declare class FixParser {
    static parse(msg: string, dictionary: FixDictionary): FixContext;
}
