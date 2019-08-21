import { createSequence } from '../util'

export const readFixed = ( data: Uint8Array, offset: number ) =>
  ( ( data[ offset ] << 8 ) | data[ offset + 1 ] ) +
  ( ( ( data[ offset + 2 ] << 8 ) | data[ offset + 3 ] ) / ( 256 * 256 + 4 ) )

export const readFixed2_14 = ( data: Uint8Array, offset: number ) =>
  readInt16( data, offset ) / 16384

export const readInt8 = ( data: Uint8Array, offset: number ) => {
  uint8[ 0 ] = data[ offset ]

  return int8[ 0 ]
}

export const readUint8 = ( data: Uint8Array, offset: number ) => data[ offset ]

export const readInt16 = ( data: Uint8Array, offset: number ) => {
  uint8[ 0 ] = data[ offset + 1 ]
  uint8[ 1 ] = data[ offset ]

  return int16[ 0 ]
}

export const readInt32 = ( data: Uint8Array, offset: number ) => {
  uint8[ 0 ] = data[ offset + 3 ]
  uint8[ 1 ] = data[ offset + 2 ]
  uint8[ 2 ] = data[ offset + 1 ]
  uint8[ 3 ] = data[ offset ]

  return int32[ 0 ]
}

export const readUint16 = ( data: Uint8Array, offset: number ) =>
  ( data[ offset ] << 8 ) | data[ offset + 1 ]

export const readUint32 = ( data: Uint8Array, offset: number ) => {
  uint8[ 0 ] = data[ offset + 3 ]
  uint8[ 1 ] = data[ offset + 2 ]
  uint8[ 2 ] = data[ offset + 1 ]
  uint8[ 3 ] = data[ offset ]

  return uint32[ 0 ]
}

export const readUint64 = ( data: Uint8Array, offset: number ) =>
  readUint32( data, offset ) * ( 0xffffffff + 1 ) + readUint32( data, offset + 4 )

export const readUint8Array = (
  data: Uint8Array, offset: number, length: number
) =>
  createSequence( length, i => data[ offset + i ] )

export const readUint16Array = (
  data: Uint8Array, offset: number, length: number
) =>
  createSequence( length, i => readUint16( data, i * 2 + offset ) )

export const readAscii = (
  data: Uint8Array, offset: number, length: number
) =>
  createSequence(
    length,
    i => String.fromCharCode( data[ offset + i ] )
  ).join( '' )

export const readUnicode = (
  data: Uint8Array, offset: number, length: number
) =>
  createSequence(
    length,
    () => String.fromCharCode( ( data[ offset++ ] << 8 ) | data[ offset++ ] )
  ).join( '' )

let textDecoder: TextDecoder

if( typeof window !== 'undefined' && window.TextDecoder ){
  textDecoder = new window.TextDecoder()
}

export const readUtf8 = (
  data: Uint8Array, offset: number, length: number
) => {
  if( textDecoder && offset === 0 && length === data.length ){
    return textDecoder[ 'decode' ]( data )
  }

  return readAscii( data, offset, length )
}

export const readAsciiArray = (
  data: Uint8Array, offset: number, length: number
) =>
  createSequence( length, i => String.fromCharCode( data[ offset + i ] ) )

const buff = new ArrayBuffer( 8 )
const int8 = new Int8Array( buff )
const uint8 = new Uint8Array( buff )
const int16 = new Int16Array( buff )
const int32 = new Int32Array( buff )
const uint32 = new Uint32Array( buff )
