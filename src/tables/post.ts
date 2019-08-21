import { readFixed, readInt16 } from '../binary-readers'

const parse = function(data, offset, length)
{
  var obj: any = {};

  obj.version           = readFixed(data, offset);  offset+=4;
  obj.italicAngle       = readFixed(data, offset);  offset+=4;
  obj.underlinePosition = readInt16(data, offset);  offset+=2;
  obj.underlineThickness = readInt16(data, offset);  offset+=2;

  return obj;
}

export const post = { parse }
