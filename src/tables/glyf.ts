import {
	readInt16, readUint16, readUint8Array, readInt8, readFixed2_14, readAscii, readUint32
} from '../binary-readers'

const parse = function(data, offset, length, font)
{
  var obj: any[] = [];
  for(var g=0; g<font.maxp.numGlyphs; g++) obj.push(null);
  return obj;
}

const parseGlyf = function(font, g)
{
  var data = font._data;

  var offset = tabOffset(data, "glyf", font._offset) + font.loca[g];

  if(font.loca[g]==font.loca[g+1]) return null;

  var gl: any = {};

  gl.noc  = readInt16(data, offset);  offset+=2;    // number of contours
  gl.xMin = readInt16(data, offset);  offset+=2;
  gl.yMin = readInt16(data, offset);  offset+=2;
  gl.xMax = readInt16(data, offset);  offset+=2;
  gl.yMax = readInt16(data, offset);  offset+=2;

  if(gl.xMin>=gl.xMax || gl.yMin>=gl.yMax) return null;

  if(gl.noc>0)
  {
    gl.endPts = [];
    for(var i=0; i<gl.noc; i++) { gl.endPts.push(readUint16(data,offset)); offset+=2; }

    var instructionLength = readUint16(data,offset); offset+=2;
    if((data.length-offset)<instructionLength) return null;
    gl.instructions = readUint8Array(data, offset, instructionLength);   offset+=instructionLength;

    var crdnum = gl.endPts[gl.noc-1]+1;
    gl.flags = [];
    for(var i=0; i<crdnum; i++ )
    {
      var flag = data[offset];  offset++;
      gl.flags.push(flag);
      if((flag&8)!=0)
      {
        var rep = data[offset];  offset++;
        for(var j=0; j<rep; j++) { gl.flags.push(flag); i++; }
      }
    }
    gl.xs = [];
    for(var i=0; i<crdnum; i++) {
      var i8=((gl.flags[i]&2)!=0), same=((gl.flags[i]&16)!=0);
      if(i8) { gl.xs.push(same ? data[offset] : -data[offset]);  offset++; }
      else
      {
        if(same) gl.xs.push(0);
        else { gl.xs.push(readInt16(data, offset));  offset+=2; }
      }
    }
    gl.ys = [];
    for(var i=0; i<crdnum; i++) {
      var i8=((gl.flags[i]&4)!=0), same=((gl.flags[i]&32)!=0);
      if(i8) { gl.ys.push(same ? data[offset] : -data[offset]);  offset++; }
      else
      {
        if(same) gl.ys.push(0);
        else { gl.ys.push(readInt16(data, offset));  offset+=2; }
      }
    }
    var x = 0, y = 0;
    for(var i=0; i<crdnum; i++) { x += gl.xs[i]; y += gl.ys[i];  gl.xs[i]=x;  gl.ys[i]=y; }
    //console.log(endPtsOfContours, instructionLength, instructions, flags, xCoordinates, yCoordinates);
  }
  else
  {
    var ARG_1_AND_2_ARE_WORDS  = 1<<0;
    var ARGS_ARE_XY_VALUES    = 1<<1;
    var ROUND_XY_TO_GRID    = 1<<2;
    var WE_HAVE_A_SCALE      = 1<<3;
    var RESERVED        = 1<<4;
    var MORE_COMPONENTS      = 1<<5;
    var WE_HAVE_AN_X_AND_Y_SCALE= 1<<6;
    var WE_HAVE_A_TWO_BY_TWO  = 1<<7;
    var WE_HAVE_INSTRUCTIONS  = 1<<8;
    var USE_MY_METRICS      = 1<<9;
    var OVERLAP_COMPOUND    = 1<<10;
    var SCALED_COMPONENT_OFFSET  = 1<<11;
    var UNSCALED_COMPONENT_OFFSET  = 1<<12;

    gl.parts = [];
    var flags;
    do {
      flags = readUint16(data, offset);  offset += 2;
      var part: any = {
        m:{ a:1,b:0,c:0,d:1,tx:0,ty:0 },
        p1:-1,
        p2:-1
      };
      gl.parts.push(part);
      part.glyphIndex = readUint16(data, offset);  offset += 2;
      if ( flags & ARG_1_AND_2_ARE_WORDS) {
        var arg1 = readInt16(data, offset);  offset += 2;
        var arg2 = readInt16(data, offset);  offset += 2;
      } else {
        var arg1 = readInt8(data, offset);  offset ++;
        var arg2 = readInt8(data, offset);  offset ++;
      }

      if(flags & ARGS_ARE_XY_VALUES) { part.m.tx = arg1;  part.m.ty = arg2; }
      else  {  part.p1=arg1;  part.p2=arg2;  }
      //part.m.tx = arg1;  part.m.ty = arg2;
      //else { throw "params are not XY values"; }

      if ( flags & WE_HAVE_A_SCALE ) {
        part.m.a = part.m.d = readFixed2_14(data, offset);  offset += 2;
      } else if ( flags & WE_HAVE_AN_X_AND_Y_SCALE ) {
        part.m.a = readFixed2_14(data, offset);  offset += 2;
        part.m.d = readFixed2_14(data, offset);  offset += 2;
      } else if ( flags & WE_HAVE_A_TWO_BY_TWO ) {
        part.m.a = readFixed2_14(data, offset);  offset += 2;
        part.m.b = readFixed2_14(data, offset);  offset += 2;
        part.m.c = readFixed2_14(data, offset);  offset += 2;
        part.m.d = readFixed2_14(data, offset);  offset += 2;
      }
    } while ( flags & MORE_COMPONENTS )
    if (flags & WE_HAVE_INSTRUCTIONS){
      var numInstr = readUint16(data, offset);  offset += 2;
      gl.instr = [];
      for(var i=0; i<numInstr; i++) { gl.instr.push(data[offset]);  offset++; }
    }
  }
  return gl;
}


const tabOffset = function( data, tab, foff ) {
  var numTables = readUint16( data, foff + 4 );
  var offset = foff + 12;
  for ( var i = 0; i < numTables; i++ ) {
    var tag = readAscii( data, offset, 4 ); offset += 4;
    var checkSum = readUint32( data, offset ); offset += 4;
    var toffset = readUint32( data, offset ); offset += 4;
    var length = readUint32( data, offset ); offset += 4;
    if ( tag == tab ) return toffset;
  }
  return 0;
}

export const glyf = { parse, parseGlyf }
