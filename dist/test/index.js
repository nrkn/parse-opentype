"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const fs_1 = require("fs");
const __1 = require("..");
describe('parse-opentype', () => {
    it('matches expected output', () => {
        const expectJson = fs_1.readFileSync('./src/test/fixtures/Roboto-Regular-expect.json', 'utf8');
        const fontBuffer = fs_1.readFileSync('./src/test/fixtures/Roboto-Regular.ttf');
        const font = __1.parseOpenType(fontBuffer);
        const json = JSON.stringify(font, null, 2);
        assert.strictEqual(json, expectJson);
    });
});
//# sourceMappingURL=index.js.map