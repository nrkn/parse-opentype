import { lctf } from './lctf'
import { readUint16, readInt16, readUint16Array } from '../binary-readers'

const parse = function(data, offset, length, font) {
	return lctf.parse(data, offset, length, font, subt);
}


const subt = function(data, ltype, offset)  // lookup type
{
	var offset0 = offset
	var tab: any = {};

  tab.fmt  = readUint16(data, offset);  offset+=2;

  if(ltype!=1 && ltype!=4 && ltype!=5 && ltype!=6) return null;

  if(ltype==1 || ltype==4 || (ltype==5 && tab.fmt<=2) || (ltype==6 && tab.fmt<=2)) {
    var covOff  = readUint16(data, offset);  offset+=2;
    tab.coverage = lctf.readCoverage(data, offset0+covOff);  // not always is coverage here
  }

  if(false) {}
  //  Single Substitution Subtable
  else if(ltype==1) {
    if(tab.fmt==1) {
      tab.delta = readInt16(data, offset);  offset+=2;
    }
    else if(tab.fmt==2) {
      var cnt = readUint16(data, offset);  offset+=2;
      tab.newg = readUint16Array(data, offset, cnt);  offset+=tab.newg.length*2;
    }
  }
  //  Ligature Substitution Subtable
  else if(ltype==4) {
    tab.vals = [];
    var cnt = readUint16(data, offset);  offset+=2;
    for(var i=0; i<cnt; i++) {
      var loff = readUint16(data, offset);  offset+=2;
      tab.vals.push(readLigatureSet(data, offset0+loff));
    }
    //console.log(tab.coverage);
    //console.log(tab.vals);
  }
  //  Contextual Substitution Subtable
  else if(ltype==5) {
    if(tab.fmt==2) {
      var cDefOffset = readUint16(data, offset);  offset+=2;
      tab.cDef = lctf.readClassDef(data, offset0 + cDefOffset);
      tab.scset = [];
      var subClassSetCount = readUint16(data, offset);  offset+=2;
      for(var i=0; i<subClassSetCount; i++)
      {
        var scsOff = readUint16(data, offset);  offset+=2;
        tab.scset.push(  scsOff==0 ? null : readSubClassSet(data, offset0 + scsOff)  );
      }
    }
    //else console.log("unknown table format", tab.fmt);
  }
  //*
  else if(ltype==6) {
    /*
    if(tab.fmt==2) {
      var btDef = readUshort(data, offset);  offset+=2;
      var inDef = readUshort(data, offset);  offset+=2;
      var laDef = readUshort(data, offset);  offset+=2;

      tab.btDef = lctf.readClassDef(data, offset0 + btDef);
      tab.inDef = lctf.readClassDef(data, offset0 + inDef);
      tab.laDef = lctf.readClassDef(data, offset0 + laDef);

      tab.scset = [];
      var cnt = readUshort(data, offset);  offset+=2;
      for(var i=0; i<cnt; i++) {
        var loff = readUshort(data, offset);  offset+=2;
        tab.scset.push(readChainSubClassSet(data, offset0+loff));
      }
    }
    */
    if(tab.fmt==3) {
      for(var i=0; i<3; i++) {
        var cnt = readUint16(data, offset);  offset+=2;
        var cvgs: any[] = [];
        for(var j=0; j<cnt; j++) cvgs.push(  lctf.readCoverage(data, offset0 + readUint16(data, offset+j*2))   );
        offset+=cnt*2;
        if(i==0) tab.backCvg = cvgs;
        if(i==1) tab.inptCvg = cvgs;
        if(i==2) tab.ahedCvg = cvgs;
      }
      var cnt = readUint16(data, offset);  offset+=2;
      tab.lookupRec = readSubstLookupRecords(data, offset, cnt);
    }
    //console.log(tab);
  } //*/
  //if(tab.coverage.indexOf(3)!=-1) console.log(ltype, fmt, tab);

  return tab;
}

const readSubClassSet = function(data, offset)
{
	var offset0 = offset
	var lset: any[] = [];
  var cnt = readUint16(data, offset);  offset+=2;
  for(var i=0; i<cnt; i++) {
    var loff = readUint16(data, offset);  offset+=2;
    lset.push(readSubClassRule(data, offset0+loff));
  }
  return lset;
}

const readSubClassRule= function(data, offset)
{
	var offset0 = offset
	var rule: any = {};
  var gcount = readUint16(data, offset);  offset+=2;
  var scount = readUint16(data, offset);  offset+=2;
  rule.input = [];
  for(var i=0; i<gcount-1; i++) {
    rule.input.push(readUint16(data, offset));  offset+=2;
  }
  rule.substLookupRecords = readSubstLookupRecords(data, offset, scount);
  return rule;
}

const readSubstLookupRecords = function(data, offset, cnt)
{
  var out: any[] = [];
  for(var i=0; i<cnt; i++) {  out.push(readUint16(data, offset), readUint16(data, offset+2));  offset+=4;  }
  return out;
}

const readChainSubClassSet = function(data, offset)
{
  var offset0 = offset
	var lset: any[] = [];
  var cnt = readUint16(data, offset);  offset+=2;
  for(var i=0; i<cnt; i++) {
    var loff = readUint16(data, offset);  offset+=2;
    lset.push(readChainSubClassRule(data, offset0+loff));
  }
  return lset;
}

const readChainSubClassRule= function(data, offset)
{
  var offset0 = offset
	var rule: any = {};
  var pps = ["backtrack", "input", "lookahead"];
  for(var pi=0; pi<pps.length; pi++) {
    var cnt = readUint16(data, offset);  offset+=2;  if(pi==1) cnt--;
    rule[pps[pi]]=readUint16Array(data, offset, cnt);  offset+= rule[pps[pi]].length*2;
  }
  var cnt = readUint16(data, offset);  offset+=2;
  rule.subst = readUint16Array(data, offset, cnt*2);  offset += rule.subst.length*2;
  return rule;
}

const readLigatureSet = function(data, offset)
{
  var offset0 = offset
	var lset: any[] = [];
  var lcnt = readUint16(data, offset);  offset+=2;
  for(var j=0; j<lcnt; j++) {
    var loff = readUint16(data, offset);  offset+=2;
    lset.push(readLigature(data, offset0+loff));
  }
  return lset;
}

const readLigature = function(data, offset)
{
  var lig: any = {chain:[]}
  lig.nglyph = readUint16(data, offset);  offset+=2;
  var ccnt = readUint16(data, offset);  offset+=2;
  for(var k=0; k<ccnt-1; k++) {  lig.chain.push(readUint16(data, offset));  offset+=2;  }
  return lig;
}

export const GSUB = { parse }
