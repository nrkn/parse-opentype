import { readUint16, readInt16 } from '../binary-readers'

const parse = function(data, offset, length, font)
{
  var obj: any = {};

  obj.aWidth = [];
  obj.lsBearing = [];


  var aw = 0, lsb = 0;

  for(var i=0; i<font.maxp.numGlyphs; i++)
  {
    if(i<font.hhea.numberOfHMetrics) {  aw=readUint16(data, offset);  offset += 2;  lsb=readInt16(data, offset);  offset+=2;  }
    obj.aWidth.push(aw);
    obj.lsBearing.push(lsb);
  }

  return obj;
}

export const hmtx = { parse }
