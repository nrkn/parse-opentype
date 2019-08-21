import { readUint16, readUint32 } from '../binary-readers'

const parse = function(data, offset, length, font)
{
  var obj: any[] = [];

  var ver = font.head.indexToLocFormat;
  var len = font.maxp.numGlyphs+1;

  if(ver==0) for(var i=0; i<len; i++) obj.push(readUint16(data, offset+(i<<1))<<1);
  if(ver==1) for(var i=0; i<len; i++) obj.push(readUint32  (data, offset+(i<<2))   );

  return obj;
}

export const loca = { parse }
