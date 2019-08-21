import { readUint32, readUint16 } from '../binary-readers'

const parse = function(data, offset, length)
{
  var obj: any = {}

  // both versions 0.5 and 1.0
  var ver = readUint32(data, offset); offset += 4;
  obj.numGlyphs = readUint16(data, offset);  offset += 2;

  // only 1.0
  if(ver == 0x00010000)
  {
    obj.maxPoints             = readUint16(data, offset);  offset += 2;
    obj.maxContours           = readUint16(data, offset);  offset += 2;
    obj.maxCompositePoints    = readUint16(data, offset);  offset += 2;
    obj.maxCompositeContours  = readUint16(data, offset);  offset += 2;
    obj.maxZones              = readUint16(data, offset);  offset += 2;
    obj.maxTwilightPoints     = readUint16(data, offset);  offset += 2;
    obj.maxStorage            = readUint16(data, offset);  offset += 2;
    obj.maxFunctionDefs       = readUint16(data, offset);  offset += 2;
    obj.maxInstructionDefs    = readUint16(data, offset);  offset += 2;
    obj.maxStackElements      = readUint16(data, offset);  offset += 2;
    obj.maxSizeOfInstructions = readUint16(data, offset);  offset += 2;
    obj.maxComponentElements  = readUint16(data, offset);  offset += 2;
    obj.maxComponentDepth     = readUint16(data, offset);  offset += 2;
  }

  return obj;
}

export const maxp = { parse }
