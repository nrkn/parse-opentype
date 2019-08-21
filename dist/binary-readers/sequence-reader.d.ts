export declare const sequenceReader: (data: Uint8Array, offset: number) => SequenceReader;
export declare type NumberReader = () => number;
export declare type ArrayReader = (length: number) => number[];
export declare type StringReader = (length: number) => string;
export interface SequenceReader {
    fixed: NumberReader;
    fixed2_14: NumberReader;
    int8: NumberReader;
    int16: NumberReader;
    int32: NumberReader;
    uint8: NumberReader;
    uint16: NumberReader;
    uint32: NumberReader;
    uint64: NumberReader;
    uint8Array: ArrayReader;
    uint16Array: ArrayReader;
    ascii: StringReader;
    skip: (bytes: number) => void;
    move: (offset: number) => void;
    currentOffset: () => number;
    getData: () => Uint8Array;
}
