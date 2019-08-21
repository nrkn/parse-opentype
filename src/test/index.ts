import * as assert from 'assert'
import { readFileSync } from 'fs'
import { parseOpenType } from '..'

const generateFont = ( name: string ) => {

}

const testFont = ( name: string ) => {

}

describe( 'parse-opentype', () => {
  it( 'matches expected output', () => {
    const expectJson = readFileSync( './src/test/fixtures/Roboto-Regular-expect.json', 'utf8' )
    const fontBuffer = readFileSync( './src/test/fixtures/Roboto-Regular.ttf' )
    const font = parseOpenType( fontBuffer )
    const json = JSON.stringify( font, null, 2 )

    assert.strictEqual( json, expectJson )
  } )
} )
