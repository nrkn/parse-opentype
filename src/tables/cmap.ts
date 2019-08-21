import { readUint16, readUint32, readUint16Array, readInt16 } from '../binary-readers'



const parse = function(data, offset, length)
{
  data = new Uint8Array(data.buffer, offset, length);
  offset = 0;

  var offset0 = offset;
  var obj: any = {};
  var version   = readUint16(data, offset);  offset += 2;
  var numTables = readUint16(data, offset);  offset += 2;

  //console.log(version, numTables);

  var offs: number[] = [];
  obj.tables = [];


  for(var i=0; i<numTables; i++)
  {
    var platformID = readUint16(data, offset);  offset += 2;
    var encodingID = readUint16(data, offset);  offset += 2;
    var noffset = readUint32(data, offset);       offset += 4;

    var id = "p"+platformID+"e"+encodingID;

    //console.log("cmap subtable", platformID, encodingID, noffset);


    var tind = offs.indexOf(noffset);

    if(tind==-1)
    {
      tind = obj.tables.length;
      var subt;
      offs.push(noffset);
      var format = readUint16(data, noffset);
      if     (format== 0) subt = parse0(data, noffset);
      else if(format== 4) subt = parse4(data, noffset);
      else if(format== 6) subt = parse6(data, noffset);
      else if(format==12) subt = parse12(data,noffset);
      else console.log("unknown format: "+format, platformID, encodingID, noffset);
      obj.tables.push(subt);
    }

    if(obj[id]!=null) throw "multiple tables for one platform+encoding";
    obj[id] = tind;
  }
  return obj;
}

const parse0 = function(data, offset)
{
  var obj: any = {};
  obj.format = readUint16(data, offset);  offset += 2;
  var len    = readUint16(data, offset);  offset += 2;
  var lang   = readUint16(data, offset);  offset += 2;
  obj.map = [];
  for(var i=0; i<len-6; i++) obj.map.push(data[offset+i]);
  return obj;
}

const parse4 = function(data, offset)
{
  var offset0 = offset;
  var obj: any = {};

  obj.format = readUint16(data, offset);  offset+=2;
  var length = readUint16(data, offset);  offset+=2;
  var language = readUint16(data, offset);  offset+=2;
  var segCountX2 = readUint16(data, offset);  offset+=2;
  var segCount = segCountX2/2;
  obj.searchRange = readUint16(data, offset);  offset+=2;
  obj.entrySelector = readUint16(data, offset);  offset+=2;
  obj.rangeShift = readUint16(data, offset);  offset+=2;
  obj.endCount   = readUint16Array(data, offset, segCount);  offset += segCount*2;
  offset+=2;
  obj.startCount = readUint16Array(data, offset, segCount);  offset += segCount*2;
  obj.idDelta = [];
  for(var i=0; i<segCount; i++) {obj.idDelta.push(readInt16(data, offset));  offset+=2;}
  obj.idRangeOffset = readUint16Array(data, offset, segCount);  offset += segCount*2;
  obj.glyphIdArray = [];
  while(offset< offset0+length) {obj.glyphIdArray.push(readUint16(data, offset));  offset+=2;}
  return obj;
}

const parse6 = function(data, offset)
{
  var offset0 = offset;
  var obj: any = {};

  obj.format = readUint16(data, offset);  offset+=2;
  var length = readUint16(data, offset);  offset+=2;
  var language = readUint16(data, offset);  offset+=2;
  obj.firstCode = readUint16(data, offset);  offset+=2;
  var entryCount = readUint16(data, offset);  offset+=2;
  obj.glyphIdArray = [];
  for(var i=0; i<entryCount; i++) {obj.glyphIdArray.push(readUint16(data, offset));  offset+=2;}

  return obj;
}

const parse12 = function(data, offset)
{
  var offset0 = offset;
  var obj: any = {};

  obj.format = readUint16(data, offset);  offset+=2;
  offset += 2;
  var length = readUint32(data, offset);  offset+=4;
  var lang   = readUint32(data, offset);  offset+=4;
  var nGroups= readUint32(data, offset);  offset+=4;
  obj.groups = [];

  for(var i=0; i<nGroups; i++)
  {
    var off = offset + i * 12;
    var startCharCode = readUint32(data, off+0);
    var endCharCode   = readUint32(data, off+4);
    var startGlyphID  = readUint32(data, off+8);
    obj.groups.push([  startCharCode, endCharCode, startGlyphID  ]);
  }
  return obj;
}

export const cmap = { parse }