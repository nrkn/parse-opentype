import { lctf } from './lctf'
import { readUint16, readInt16 } from '../binary-readers'

const parse = function(data, offset, length, font) {
  return lctf.parse(data, offset, length, font, subt);
}


const subt = function(data, ltype, offset)  // lookup type
{
	var offset0 = offset
	var tab: any = {};

  tab.fmt  = readUint16(data, offset);  offset+=2;

  //console.log(ltype, tab.fmt);

  if(ltype==1 || ltype==2 || ltype==3 || ltype==7 || (ltype==8 && tab.fmt<=2)) {
    var covOff  = readUint16(data, offset);  offset+=2;
    tab.coverage = lctf.readCoverage(data, covOff+offset0);
  }
  if(ltype==1 && tab.fmt==1) {
    var valFmt1 = readUint16(data, offset);  offset+=2;
    var ones1 = lctf.numOfOnes(valFmt1);
    if(valFmt1!=0)  tab.pos = readValueRecord(data, offset, valFmt1);
  }
  else if(ltype==2) {
    var valFmt1 = readUint16(data, offset);  offset+=2;
    var valFmt2 = readUint16(data, offset);  offset+=2;
    var ones1 = lctf.numOfOnes(valFmt1);
    var ones2 = lctf.numOfOnes(valFmt2);
    if(tab.fmt==1)
    {
      tab.pairsets = [];
      var psc = readUint16(data, offset);  offset+=2;  // PairSetCount

      for(var i=0; i<psc; i++)
      {
        var psoff = offset0 + readUint16(data, offset);  offset+=2;

        var pvc = readUint16(data, psoff);  psoff+=2;
        var arr: any = [];
        for(var j=0; j<pvc; j++)
        {
          var gid2 = readUint16(data, psoff);  psoff+=2;
          var value1, value2;
          if(valFmt1!=0) {  value1 = readValueRecord(data, psoff, valFmt1);  psoff+=ones1*2;  }
          if(valFmt2!=0) {  value2 = readValueRecord(data, psoff, valFmt2);  psoff+=ones2*2;  }
          //if(value1!=null) throw "e";
          arr.push({gid2:gid2, val1:value1, val2:value2});
        }
        tab.pairsets.push(arr);
      }
    }
    if(tab.fmt==2)
    {
      var classDef1 = readUint16(data, offset);  offset+=2;
      var classDef2 = readUint16(data, offset);  offset+=2;
      var class1Count = readUint16(data, offset);  offset+=2;
      var class2Count = readUint16(data, offset);  offset+=2;

      tab.classDef1 = lctf.readClassDef(data, offset0 + classDef1);
      tab.classDef2 = lctf.readClassDef(data, offset0 + classDef2);

      tab.matrix = [];
      for(var i=0; i<class1Count; i++)
      {
        var row: any[] = [];
        for(var j=0; j<class2Count; j++)
        {
          var value1: any = null
					var value2: any = null;
          if(tab.valFmt1!=0) { value1 = readValueRecord(data, offset, tab.valFmt1);  offset+=ones1*2; }
          if(tab.valFmt2!=0) { value2 = readValueRecord(data, offset, tab.valFmt2);  offset+=ones2*2; }
          row.push({val1:value1, val2:value2});
        }
        tab.matrix.push(row);
      }
    }
  }
  else if(ltype==4) {

  }
  return tab;
}


const readValueRecord = function(data, offset, valFmt)
{
  var arr: any[] = [];
  arr.push( (valFmt&1) ? readInt16(data, offset) : 0 );  offset += (valFmt&1) ? 2 : 0;  // X_PLACEMENT
  arr.push( (valFmt&2) ? readInt16(data, offset) : 0 );  offset += (valFmt&2) ? 2 : 0;  // Y_PLACEMENT
  arr.push( (valFmt&4) ? readInt16(data, offset) : 0 );  offset += (valFmt&4) ? 2 : 0;  // X_ADVANCE
  arr.push( (valFmt&8) ? readInt16(data, offset) : 0 );  offset += (valFmt&8) ? 2 : 0;  // Y_ADVANCE
  return arr;
}

export const GPOS = { parse }