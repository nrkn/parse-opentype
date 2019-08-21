import { Head } from './types'
import { sequenceReader } from '../binary-readers/sequence-reader'

const parse = (
  data: Uint8Array, offset: number
): Head => {
  const {
    fixed, uint32, uint16, uint64, int16
  } = sequenceReader( data, offset )

  const tableVersion = fixed()
  const fontRevision = fixed()
  const checkSumAdjustment = uint32()
  const magicNumber = uint32()
  const flags = uint16()
  const unitsPerEm = uint16()
  const created  = uint64()
  const modified = uint64()
  const xMin = int16()
  const yMin = int16()
  const xMax = int16()
  const yMax = int16()
  const macStyle = uint16()
  const lowestRecPPEM = uint16()
  const fontDirectionHint = int16()
  const indexToLocFormat = int16()
  const glyphDataFormat = int16()

  return {
    tableVersion, fontRevision, checkSumAdjustment, magicNumber, flags,
    unitsPerEm, created, modified, xMin, yMin, xMax, yMax, macStyle,
    lowestRecPPEM, fontDirectionHint, indexToLocFormat,
    glyphDataFormat
  }
}

export const head = { parse }
