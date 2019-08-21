import { readUint16, readInt16, readUint8Array, readUint32, readInt8 } from '../binary-readers'

const parse = function(data, offset, length)
{
  var ver = readUint16(data, offset); offset += 2;

  var obj = {};
  if     (ver==0) version0(data, offset, obj);
  else if(ver==1) version1(data, offset, obj);
  else if(ver==2 || ver==3 || ver==4) version2(data, offset, obj);
  else if(ver==5) version5(data, offset, obj);
  else throw Error( "unknown OS/2 table version: "+ver);

  return obj;
}

const version0 = function(data, offset, obj)
{
  obj.xAvgCharWidth = readInt16(data, offset); offset += 2;
  obj.usWeightClass = readUint16(data, offset); offset += 2;
  obj.usWidthClass  = readUint16(data, offset); offset += 2;
  obj.fsType = readUint16(data, offset); offset += 2;
  obj.ySubscriptXSize = readInt16(data, offset); offset += 2;
  obj.ySubscriptYSize = readInt16(data, offset); offset += 2;
  obj.ySubscriptXOffset = readInt16(data, offset); offset += 2;
  obj.ySubscriptYOffset = readInt16(data, offset); offset += 2;
  obj.ySuperscriptXSize = readInt16(data, offset); offset += 2;
  obj.ySuperscriptYSize = readInt16(data, offset); offset += 2;
  obj.ySuperscriptXOffset = readInt16(data, offset); offset += 2;
  obj.ySuperscriptYOffset = readInt16(data, offset); offset += 2;
  obj.yStrikeoutSize = readInt16(data, offset); offset += 2;
  obj.yStrikeoutPosition = readInt16(data, offset); offset += 2;
  obj.sFamilyClass = readInt16(data, offset); offset += 2;
  obj.panose = readUint8Array(data, offset, 10);  offset += 10;
  obj.ulUnicodeRange1  = readUint32(data, offset);  offset += 4;
  obj.ulUnicodeRange2  = readUint32(data, offset);  offset += 4;
  obj.ulUnicodeRange3  = readUint32(data, offset);  offset += 4;
  obj.ulUnicodeRange4  = readUint32(data, offset);  offset += 4;
  obj.achVendID = [readInt8(data, offset), readInt8(data, offset+1),readInt8(data, offset+2),readInt8(data, offset+3)];  offset += 4;
  obj.fsSelection   = readUint16(data, offset); offset += 2;
  obj.usFirstCharIndex = readUint16(data, offset); offset += 2;
  obj.usLastCharIndex = readUint16(data, offset); offset += 2;
  obj.sTypoAscender = readInt16(data, offset); offset += 2;
  obj.sTypoDescender = readInt16(data, offset); offset += 2;
  obj.sTypoLineGap = readInt16(data, offset); offset += 2;
  obj.usWinAscent = readUint16(data, offset); offset += 2;
  obj.usWinDescent = readUint16(data, offset); offset += 2;
  return offset;
}

const version1 = function(data, offset, obj)
{
  offset = version0(data, offset, obj);

  obj.ulCodePageRange1 = readUint32(data, offset); offset += 4;
  obj.ulCodePageRange2 = readUint32(data, offset); offset += 4;
  return offset;
}

const version2 = function(data, offset, obj)
{
  offset = version1(data, offset, obj);

  obj.sxHeight = readInt16(data, offset); offset += 2;
  obj.sCapHeight = readInt16(data, offset); offset += 2;
  obj.usDefault = readUint16(data, offset); offset += 2;
  obj.usBreak = readUint16(data, offset); offset += 2;
  obj.usMaxContext = readUint16(data, offset); offset += 2;
  return offset;
}

const version5 = function(data, offset, obj)
{
  offset = version2(data, offset, obj);

  obj.usLowerOpticalPointSize = readUint16(data, offset); offset += 2;
  obj.usUpperOpticalPointSize = readUint16(data, offset); offset += 2;
  return offset;
}

export const OS2 = { parse }