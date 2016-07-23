const path = require('path');
const assert = require('power-assert');
const reader = require('../index.js');

describe('jpg-exif-reader test', () => {
  const testDir = path.join(__dirname, 'test_image');
  const testImage1= path.join(testDir, 'test_jpg_image.jpg');
  const testImage2 = path.join(testDir, 'test_jpg_image2.jpg');
  const testImage3 = path.join(testDir, 'test_jpg_image3.jpg');
  const testImageBmp = path.join(testDir, 'test_bmp_image.bmp');
  const testImageGif = path.join(testDir, 'test_gif_image.gif');
  const testImagePng = path.join(testDir, 'test_png_image.png');
  it('test1', (done) => {
    reader(testImage1).then((resp) => {
      assert(resp.toString() === [500, 500].toString());
      done();
    });
  });
  it('test2', (done) => {
    reader(testImage2).then((resp) => {
      assert(resp.toString() === [800, 600].toString());
      done();
    });
  });
  it('test3', (done) => {
    reader(testImage3).then((resp) => {
      assert(resp.toString() === [1000, 1000].toString());
      done();
    });
  });
  it('test4 bmp', (done) => {
    reader(testImageBmp).catch((resp) => {
      assert(resp.message === 'Unsupported file type');
      done();
    });
  });
  it('test5 gif', (done) => {
    reader(testImageGif).catch((resp) => {
      assert(resp.message === 'Unsupported file type');
      done();
    });
  });
  it('test6 png', (done) => {
    reader(testImagePng).catch((resp) => {
      assert(resp.message === 'Unsupported file type');
      done();
    });
  });
})