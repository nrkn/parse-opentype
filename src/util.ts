export const createSequence = <T>(
  length: number, cb: ( index: number ) => T
) =>
  Array.from( { length }, ( _v, k ) => cb( k ) )
