[![Build Status](https://travis-ci.org/tadashiy1012/jpg-size-reader.svg?branch=master)](https://travis-ci.org/tadashiy1012/jpg-size-reader)
# jpg-size-reader
Gets the height and width of the jpeg image

## Installation
`$ npm install jpg-size-reader`

## Example
```JavaScript
const reader = require('jpg-size-reader');
reader(tgtFilePath).then((result) => {
  console.log(result); // [width, height]
});
```

### License
MIT