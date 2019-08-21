import { DataLocation } from './tables/types'

export const createSequence = <T>(
  length: number, cb: ( index: number ) => T
) =>
  Array.from( { length }, ( _v, k ) => cb( k ) )

export const indicesToLocations = ( indices: number[], offset = 0 ) =>
  createSequence(
    indices.length - 1,
    i => {
      const location: DataLocation = {
        offset: offset + indices[ i ],
        length: indices[ i + 1 ] - indices[ i ]
      }

      return location
    }
  )
