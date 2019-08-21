import { CFF } from './cff'
import { cmap } from './cmap'
import { glyf } from './glyf'
import { GPOS } from './GPOS'
import { GSUB } from './GSUB'
import { head } from './head'
import { hhea } from './hhea'
import { hmtx } from './hmtx'
import { kern } from './kern'
import { loca } from './loca'
import { maxp } from './maxp'
import { name } from './name'
import { OS2 } from './os-2'
import { post } from './post'
import { SVG } from './svg'

export const tables = {
  CFF, cmap, glyf, GPOS, GSUB, head, hhea, hmtx, kern, loca, maxp, name,
  'OS/2': OS2,
  post, SVG
}
