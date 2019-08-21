import { DataLocation } from './tables/types';
export declare const createSequence: <T>(length: number, cb: (index: number) => T) => T[];
export declare const indicesToLocations: (indices: number[], offset?: number) => DataLocation[];
