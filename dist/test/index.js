"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const fs_1 = require("fs");
const __1 = require("..");
const expectFilename = (name) => `./src/test/fixtures/${name}.expect.json`;
const generateRegressionData = (name) => {
    const font = parseFont(name);
    const json = JSON.stringify(font, null, 2);
    fs_1.writeFileSync(expectFilename(name), json, 'utf8');
};
const testRegressionFont = (name) => {
    const expectJson = fs_1.readFileSync(expectFilename(name), 'utf8');
    const font = parseFont(name);
    const json = JSON.stringify(font, null, 2);
    assert.strictEqual(json, expectJson);
};
const parseFont = (name) => {
    console.log(name);
    const fontBuffer = fs_1.readFileSync(`./src/test/fixtures/${name}`);
    return __1.parseOpenType(fontBuffer);
};
const fontNames = [
    'amiri-regular.ttf',
    'FiraSans-Regular.ttf',
    'Khmer.ttf',
    'Mada-Regular.subset1.ttf',
    'Mada-VF.ttf',
    'NotoKufiArabic-Regular.ttf',
    'NotoNastaliqUrduDraft.ttf',
    'NotoSansBalinese-Regular.ttf',
    'NotoSansBengali-Regular.ttf',
    'NotoSansDevanagari-Regular.ttf',
    'NotoSansGujarati-Regular.ttf',
    'NotoSansGurmukhi-Regular.ttf',
    'NotoSansKannada-Regular.ttf',
    'NotoSansKhmer-Regular.ttf',
    'NotoSansMalayalam-Regular.ttf',
    'NotoSansMongolian-Regular.ttf',
    'NotoSansNKo-Regular.ttf',
    'NotoSansOriya-Regular.ttf',
    'NotoSansPhagsPa-Regular.ttf',
    'NotoSansSyriacEstrangela-Regular.ttf',
    'NotoSansTamil-Regular.ttf',
    'NotoSansTelugu-Regular.ttf',
    'NotoSerifKannada-Regular.ttf',
    'OpenSans-Regular.ttf',
    'Play-Regular.ttf',
    'Roboto-Regular.ttf',
    'ss-emoji-apple.ttf',
    'ss-emoji-microsoft.ttf',
    'TestCMAPMacTurkish.ttf',
    'TestGVARFour.ttf',
    'TestGVAROne.ttf',
    'TestGVARThree.ttf',
    'TestGVARTwo.ttf',
    'TestHVARTwo.ttf',
    'AdobeVFPrototype-Subset.otf',
    'NotoSansCJKkr-Regular.otf',
    'PlayfairDisplay-Regular.otf',
    'SourceSansPro-Regular.otf',
    'TestCMAP14.otf',
    'SourceSansPro-Regular.woff',
    'SourceSansPro-Regular.woff2',
    'NotoSans.ttc',
];
describe('parse-opentype', () => {
    describe('parses', () => {
        fontNames.forEach(name => {
            it(`parses ${name}`, () => {
                assert.doesNotThrow(() => parseFont(name));
            });
        });
    });
});
//# sourceMappingURL=index.js.map