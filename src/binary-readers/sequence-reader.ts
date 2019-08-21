import {
  readFixed, readFixed2_14, readInt8, readInt16, readInt32, readUint16,
  readUint32, readUint64, readUint8Array, readUint16Array, readAscii, readUint8
} from '.'

export const sequenceReader = (
  data: Uint8Array, offset: number
) => {
  const reader: Partial<SequenceReader> = {}

  const valueKeys = Object.keys( valueReaders ) as ( keyof ValueReaders )[]
  const arrayKeys = Object.keys( arrayReaders ) as ( keyof ArrayReaders )[]
  const stringKeys = Object.keys( stringReaders ) as ( keyof StringReaders )[]

  valueKeys.forEach( key => {
    reader[ key ] = () => {
      const { bytes, reader } = valueReaders[ key ]
      const result = reader( data, offset )

      offset += bytes

      return result
    }
  } )

  arrayKeys.forEach( key => {
    reader[ key ] = ( length: number ) => {
      const { bytes, reader } = arrayReaders[ key ]
      const result = reader( data, offset, length )

      offset += bytes * length

      return result
    }
  } )

  stringKeys.forEach( key => {
    reader[ key ] = ( length: number ) => {
      const { bytes, reader } = stringReaders[ key ]
      const result = reader( data, offset, length )

      offset += bytes * length

      return result
    }
  } )

  reader.skip = bytes => { offset += bytes }
  reader.move = newOffset => { offset = newOffset }
  reader.currentOffset = () => offset
  reader.getData = () => data

  return reader as SequenceReader
}

export type NumberReader = () => number
export type ArrayReader = ( length: number ) => number[]
export type StringReader = ( length: number ) => string

export interface SequenceReader {
  fixed: NumberReader
  fixed2_14: NumberReader
  int8: NumberReader
  int16: NumberReader
  int32: NumberReader
  uint8: NumberReader
  uint16: NumberReader
  uint32: NumberReader
  uint64: NumberReader
  uint8Array: ArrayReader
  uint16Array: ArrayReader
  ascii: StringReader
  skip: ( bytes: number ) => void
  move: ( offset: number ) => void
  currentOffset: () => number
  getData: () => Uint8Array
}

interface ArrayReaders {
  uint8Array: ReaderDef<ReadNumberArray>
  uint16Array: ReaderDef<ReadNumberArray>
}

interface StringReaders {
  ascii: ReaderDef<ReadString>
}

interface ReadNumber {
  ( data: Uint8Array, offset: number ): number
}

interface ReadNumberArray {
  ( data: Uint8Array, offset: number, length: number ): number[]
}

interface ReadString {
  ( data: Uint8Array, offset: number, length: number ): string
}

type ReaderType = ReadNumber | ReadNumberArray | ReadString

interface ReaderDef<T extends ReaderType = ReadNumber> {
  bytes: number
  reader: T
}

const fixed: ReaderDef = {
  bytes: 4,
  reader: readFixed
}

const fixed2_14: ReaderDef = {
  bytes: 2,
  reader: readFixed2_14
}

const int8: ReaderDef = {
  bytes: 1,
  reader: readInt8
}

const int16: ReaderDef = {
  bytes: 2,
  reader: readInt16
}

const int32: ReaderDef = {
  bytes: 4,
  reader: readInt32
}

const uint8: ReaderDef = {
  bytes: 1,
  reader: readUint8
}

const uint16: ReaderDef = {
  bytes: 2,
  reader: readUint16
}

const uint32: ReaderDef = {
  bytes: 4,
  reader: readUint32
}

const uint64: ReaderDef = {
  bytes: 8,
  reader: readUint64
}

const uint8Array: ReaderDef<ReadNumberArray> = {
  bytes: 1,
  reader: readUint8Array
}

const uint16Array: ReaderDef<ReadNumberArray> = {
  bytes: 2,
  reader: readUint16Array
}

const ascii: ReaderDef<ReadString> = {
  bytes: 1,
  reader: readAscii
}

const valueReaders: ValueReaders = {
  fixed,
  fixed2_14,
  int8,
  int16,
  int32,
  uint8,
  uint16,
  uint32,
  uint64
}

const arrayReaders: ArrayReaders = {
  uint8Array,
  uint16Array
}

const stringReaders: StringReaders = {
  ascii
}

interface ValueReaders {
  fixed: ReaderDef
  fixed2_14: ReaderDef
  int8: ReaderDef
  int16: ReaderDef
  int32: ReaderDef
  uint8: ReaderDef
  uint16: ReaderDef
  uint32: ReaderDef
  uint64: ReaderDef
}

interface ArrayReaders {
  uint8Array: ReaderDef<ReadNumberArray>
  uint16Array: ReaderDef<ReadNumberArray>
}

interface StringReaders {
  ascii: ReaderDef<ReadString>
}
