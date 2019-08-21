import { sequenceReader } from '../binary-readers/sequence-reader'
import { Hhea } from './types'

const parse = ( data: Uint8Array, offset: number ): Hhea =>
{
  const { int16, uint16, skip } = sequenceReader( data, offset )

  // tableVersion, fixed
  skip( 4 )

  const ascender  = int16()
  const descender = int16()
  const lineGap = int16()

  const advanceWidthMax = uint16()
  const minLeftSideBearing  = int16()
  const minRightSideBearing = int16()
  const xMaxExtent = int16()

  const caretSlopeRise = int16()
  const caretSlopeRun = int16()
  const caretOffset = int16()

  // not specified in original code, but 2 * 4 byte entries
  skip( 8 )

  const metricDataFormat = int16()
  const numberOfHMetrics = uint16()

  return {
    ascender, descender, lineGap, advanceWidthMax, minLeftSideBearing,
    minRightSideBearing, xMaxExtent, caretSlopeRise, caretSlopeRun, caretOffset,
    metricDataFormat, numberOfHMetrics
  }
}

export const hhea = { parse }
