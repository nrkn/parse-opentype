import {
  readFixed, readUint16, readUint16Array, readAscii
} from '../binary-readers'

import { createSequence } from '../util'


// OpenType Layout Common Table Formats

const parse = (
  data: Uint8Array, offset: number, length: number,
  font, subt
) => {
  const originalOffset = offset

  const tableVersion = readFixed( data, offset )
  offset += 4

  const offScriptList = readUint16( data, offset )
  offset += 2

  const offFeatureList = readUint16( data, offset )
  offset += 2

  const offLookupList = readUint16( data, offset )
  offset += 2


  const scriptList = readScriptList( data, originalOffset + offScriptList )
  const featureList = readFeatureList( data, originalOffset + offFeatureList )
  const lookupList = readLookupList( data, originalOffset + offLookupList, subt )

  return { scriptList, featureList, lookupList }
}

const readLookupList = (
  data: Uint8Array, offset: number, subt
) => {
  const originalOffset = offset

  const count = readUint16( data, offset )
  offset += 2

  return createSequence(
    count,
    () => {
      const noff = readUint16( data, offset )
      offset += 2

      const lut = readLookupTable( data, originalOffset + noff, subt )

      return lut
    }
  )
}

const readLookupTable = (
  data: Uint8Array, offset: number, subt
) => {
  const originalOffset = offset

  const ltype = readUint16( data, offset )
  offset += 2

  const flag = readUint16( data, offset )
  offset += 2

  const count = readUint16( data, offset )
  offset += 2

  const tabs = createSequence(
    count,
    () => {
      const noff = readUint16( data, offset )
      offset += 2

      const tab = subt( data, ltype, originalOffset + noff )

      return tab
    }
  )

  return { tabs, ltype, flag }
}

const numOfOnes = ( n: number ) => {
  let num = 0

  for ( let i = 0; i < 32; i++ )
    if ( ( ( n >>> i ) & 1 ) != 0 ) num++

  return num
}

const readClassDef = ( data, offset ) => {
  var obj: number[] = []
  var format = readUint16( data, offset ); offset += 2;

  if ( format === 1 ) {
    var startGlyph = readUint16( data, offset ); offset += 2;
    var glyphCount = readUint16( data, offset ); offset += 2;
    for ( var i = 0; i < glyphCount; i++ ) {
      obj.push( startGlyph + i );
      obj.push( startGlyph + i );
      obj.push( readUint16( data, offset ) ); offset += 2;
    }
  }
  if ( format === 2 ) {
    var count = readUint16( data, offset ); offset += 2;
    for ( var i = 0; i < count; i++ ) {
      obj.push( readUint16( data, offset ) ); offset += 2;
      obj.push( readUint16( data, offset ) ); offset += 2;
      obj.push( readUint16( data, offset ) ); offset += 2;
    }
  }
  return obj;
}

const getInterval = ( tab, val ) => {
  for ( var i = 0; i < tab.length; i += 3 ) {
    var start = tab[ i ], end = tab[ i + 1 ], index = tab[ i + 2 ];
    if ( start <= val && val <= end ) return i;
  }
  return -1;
}


const readCoverage = ( data, offset ) => {
  var cvg: any = {}

  cvg.fmt = readUint16( data, offset ); offset += 2;

  var count = readUint16( data, offset ); offset += 2;

  if ( cvg.fmt == 1 ) cvg.tab = readUint16Array( data, offset, count );
  if ( cvg.fmt == 2 ) cvg.tab = readUint16Array( data, offset, count * 3 );

  return cvg;
}

const coverageIndex = ( cvg, val ) => {
  var tab = cvg.tab;
  if ( cvg.fmt == 1 ) return tab.indexOf( val );
  if ( cvg.fmt == 2 ) {
    var ind = getInterval( tab, val );
    if ( ind != -1 ) return tab[ ind + 2 ] + ( val - tab[ ind ] );
  }
  return -1;
}

const readFeatureList = ( data, offset ) => {
  var offset0 = offset;
  var obj: any[] = []

  var count = readUint16( data, offset ); offset += 2;

  for ( var i = 0; i < count; i++ ) {
    var tag = readAscii( data, offset, 4 ); offset += 4;
    var noff = readUint16( data, offset ); offset += 2;
    obj.push( { tag: tag.trim(), tab: readFeatureTable( data, offset0 + noff ) } );
  }
  return obj;
}

const readFeatureTable = ( data, offset ) => {

  var featureParams = readUint16( data, offset ); offset += 2;  // = 0
  var lookupCount = readUint16( data, offset ); offset += 2;

  var indices: any[] = [];
  for ( var i = 0; i < lookupCount; i++ ) indices.push( readUint16( data, offset + 2 * i ) );
  return indices;
}


const readScriptList = ( data, offset ) => {
  var offset0 = offset;
  var obj = {};

  var count = readUint16( data, offset ); offset += 2;

  for ( var i = 0; i < count; i++ ) {
    var tag = readAscii( data, offset, 4 ); offset += 4;
    var noff = readUint16( data, offset ); offset += 2;
    obj[ tag.trim() ] = readScriptTable( data, offset0 + noff );
  }
  return obj;
}

const readScriptTable = ( data, offset ) => {
  var offset0 = offset;
  var obj: any = {};

  var defLangSysOff = readUint16( data, offset ); offset += 2;
  obj.default = readLangSysTable( data, offset0 + defLangSysOff );

  var langSysCount = readUint16( data, offset ); offset += 2;

  for ( var i = 0; i < langSysCount; i++ ) {
    var tag = readAscii( data, offset, 4 ); offset += 4;
    var langSysOff = readUint16( data, offset ); offset += 2;
    obj[ tag.trim() ] = readLangSysTable( data, offset0 + langSysOff );
  }
  return obj;
}

const readLangSysTable = ( data, offset ) => {
  var obj: any = {};

  var lookupOrder = readUint16( data, offset ); offset += 2;

  obj.reqFeature = readUint16( data, offset ); offset += 2;

  var featureCount = readUint16( data, offset ); offset += 2;
  obj.features = readUint16Array( data, offset, featureCount );
  return obj;
}

export const lctf = { parse, readCoverage, numOfOnes, readClassDef }
