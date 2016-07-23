module.exports = (function() {
  const fs = require('fs');

  const SIGNATURE_SIZE = 2;
  const SEG_MARKER = [0xff];
  const JPG_SIGNATURE = [0xff, 0xd8];
  const JFIF = [0x4a, 0x46, 0x49, 0x46, 0x00];
  const SOF0 = [0xff, 0xc0];
  const SOF2 = [0xff, 0xc2];

  function getHexStr(bary) {
    let line = '';
    for (let i = 0; i < bary.length; i++) {
      const s = bary[i].toString(16);
      if (s.length < 2) {
        line += ('0' + s);
      } else {
        line += s;
      }
    }
    return line;
  }

  function comp(intary, hexary) {
    return intary.toString() === hexary.toString();
  }

  function readBuf(tgtImagePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(tgtImagePath, (err, data) => {
        if (err) { reject(err); }
        else { resolve(data); }
      });
    });
  }

  function getSegment(bary) {
    const ary = [];
    let idx = 0;
    let next = bary.indexOf(255, idx);
    while (next !== -1) {
      idx += 1;
      let n = bary.indexOf(255, idx);
      if (n !== next) {
        ary.push(bary.subarray(next, n));
        next = n;
      }
    }
    return ary;
  }

  function findSeg(segs, tgt) {
    const result = [];
    for (let i = 0; i < segs.length; i++) {
      const s = segs[i];
      const mark = s.subarray(0, 2);
      if (comp(mark, tgt)) {
        result.push(s);
      }
    }
    return result;
  }

  function checkTop(bary) {
    const b = bary.subarray(0, 2);
    return comp(b, JPG_SIGNATURE);
  }

  function check(segs) {
    const seg = findSeg(segs, [0xff, 0xe0]);
    if (seg.length === 0) { return false; }
    const jfif = seg[0].subarray(4, 9);
    return comp(jfif, JFIF);
  }

  function getSize(segs) {
    const segA = findSeg(segs, SOF0);
    const segB = findSeg(segs, SOF2);
    if (segA.length > 0) {
      const hh = getHexStr(segA[0].subarray(5, 7));
      const wh = getHexStr(segA[0].subarray(7, 9));
      return [parseInt(wh, 16), parseInt(hh, 16)];
    } else {
      throw new Error('Unsupported image type');
    }
  }

  return function jpgExifReader(tgtFilePath) {
    return new Promise((resolve, reject) => {
      readBuf(tgtFilePath).then((resp) => {
        if (checkTop(resp)) {
          const segs = getSegment(resp);
          if (check(segs)) {
            resolve(getSize(segs));
          } else {
            reject(new Error('Unsupported file type'));
          }
        } else {
          reject(new Error('Unsupported file type'));
        }
      }).catch((err) => {
        reject(err);
      });
    });
  };
})();