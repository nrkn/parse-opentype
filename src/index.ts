import { readAscii, readUint16, readUint32, readFixed } from './binary-readers'
import { tables } from './tables'
import { createSequence } from './util'

export const parseOpenType = ( buff: ArrayBuffer ) => {
  const data = new Uint8Array( buff )
  const tag = readAscii( data, 0, 4 )

  if ( tag === "ttcf" ) {
    let offset = 4

    const majV = readUint16( data, offset )
    offset += 2

    const minV = readUint16( data, offset )
    offset += 2

    const fontCount = readUint32( data, offset )
    offset += 4

    const fonts = createSequence(
      fontCount,
      () => {
        const fontOffset = readUint32( data, offset )
        offset += 4

        return readFont( data, fontOffset )
      }
    )

    return fonts
  }
  else {
    return [ readFont( data, 0 ) ]
  }
}

const readFont = ( data: Uint8Array, offset: number ) => {
  const originalOffset = offset

  const sfnt_version = readFixed( data, offset )
  offset += 4

  const numTables = readUint16( data, offset )
  offset += 2

  const searchRange = readUint16( data, offset )
  offset += 2

  const entrySelector = readUint16( data, offset )
  offset += 2

  const rangeShift = readUint16( data, offset )
  offset += 2

  const tags = [
    'cmap',
    'head',
    'hhea',
    'maxp',
    'hmtx',
    'name',
    'OS/2',
    'post',

    //'cvt',
    //'fpgm',
    'loca',
    'glyf',
    'kern',

    //'prep'
    //'gasp'

    'CFF ',


    'GPOS',
    'GSUB',

    'SVG '
    //'VORG',
  ]

  const fontData = { _data: data, _offset: originalOffset }
  const font = {}
  const tabs = {}

  for ( var i = 0; i < numTables; i++ ) {
    var tag = readAscii( data, offset, 4 ); offset += 4;
    var checkSum = readUint32( data, offset ); offset += 4;
    var toffset = readUint32( data, offset ); offset += 4;
    var length = readUint32( data, offset ); offset += 4;

    tabs[ tag ] = { offset: toffset, length: length };
  }

  for ( var i = 0; i < tags.length; i++ ) {
    var t = tags[ i ];

    if ( tabs[ t ] ){
      console.log( 'parsing table', t )
      const table = tables[ t.trim() ].parse( data, tabs[ t ].offset, tabs[ t ].length, fontData )

      fontData[ t.trim() ] = table
      font[ t.trim() ] = table
    }
  }

  return font
}





